export function isFreeFee(fee: string): boolean {
  return fee.trim().toLowerCase() === "free";
}

export function parseFeeAmount(fee: string): number {
  if (isFreeFee(fee)) return 0;
  const match = fee.replace(/,/g, "").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}
