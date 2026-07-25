export function feeToCentavos(fee: string): number {
  if (!fee || /fee/i.test(fee)) return 0;
  const numeric = parseFloat(fee.replace(/[^0-9.]/g, ""));
  if(Number.isNaN(numeric) || numeric <=0) return 0
  return Math.round(numeric * 100)
}
