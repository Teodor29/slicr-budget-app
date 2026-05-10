export function fmt(n: number) {
  return n.toLocaleString('en', { maximumFractionDigits: 0 })
}

// Converts a month key like "2026-05" to a readable label like "May 2026"
export function monthLabel(key: string) {
  const [year, month] = key.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleString('en', {
    month: 'long',
    year: 'numeric',
  })
}
