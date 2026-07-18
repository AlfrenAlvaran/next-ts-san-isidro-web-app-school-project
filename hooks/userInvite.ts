"use client";
import useSWR from "swr";
import axios from "axios";

export interface InviteDetails {
  name: string;
  email: string;
  role: "admin" | "staff";
  barangay: string;
}
const fetcher = (url: string) => axios.get(url).then((res) => res.data.invite);

export function useInvite(token: string | null) {
  const {
    data: invite,
    error,
    isLoading,
  } = useSWR<InviteDetails>(token ? `/api/invites/${token}` : null, fetcher, {
    shouldRetryOnError: false,
  });

  const status: "loading" | "valid" | "invalid" = !token
    ? "invalid"
    : isLoading
      ? "loading"
      : error
        ? "invalid"
        : "valid";

  return { invite: invite ?? null, status };
}
