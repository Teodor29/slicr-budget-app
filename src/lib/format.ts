export function fmt(n: number) {
  return n.toLocaleString("en", { maximumFractionDigits: 0 });
}
