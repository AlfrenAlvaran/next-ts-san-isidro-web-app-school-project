import { PaymongoError } from "./types";

const BASE_URL = "https://api.paymongo.com/v1";
const MAX_RETRIES = 3;
const TIMEOUT_MS = 10_000;

function getSecretKey(): string {
  const key = process.env.PAYMONGO_SECRET_KEY;
  if (!key) throw new Error("PAYMONGO_SECRET_KEY is not set");
  return key;
}

function authHeader(): string {
  return `Basic ${Buffer.from(`${getSecretKey()}:`).toString("base64")}`;
}

function isRetryable(status: number): boolean {
  // 429 (rate limit) and 5xx (PayMongo-side issues) are worth retrying;
  // 4xx client errors (bad request, invalid params) are not.
  return status === 429 || status >= 500;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function paymongoRequest<T>(
  path: string,
  init: {
    method: "GET" | "POST" | "DELETE";
    body?: unknown;
    idempotencyKey?: string;
  }
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  let attempt = 0;
  let lastError: unknown;

  while (attempt < MAX_RETRIES) {
    attempt++;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        method: init.method,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader(),
          ...(init.idempotencyKey ? { "Idempotency-Key": init.idempotencyKey } : {}),
        },
        body: init.body ? JSON.stringify(init.body) : undefined,
      });

      clearTimeout(timeout);

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const details = json?.errors ?? [];
        const message = details[0]?.detail ?? `PayMongo request failed (${res.status})`;

        if (isRetryable(res.status) && attempt < MAX_RETRIES) {
          await sleep(2 ** attempt * 200); // 400ms, 800ms backoff
          continue;
        }
        throw new PaymongoError(message, res.status, details);
      }

      return json as T;
    } catch (err) {
      clearTimeout(timeout);
      lastError = err;

      if (err instanceof PaymongoError) throw err;

      // Network error / abort — retry if attempts remain
      if (attempt < MAX_RETRIES) {
        await sleep(2 ** attempt * 200);
        continue;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("PayMongo request failed after retries");
}