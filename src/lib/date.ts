// Dates are stored as "YYYY-MM-DD" and months as "YYYY-MM", both in local time

export function toDateKey(date: Date) {
  return date.toLocaleDateString("sv-SE")
}

export function toMonthKey(date: Date) {
  return toDateKey(date).slice(0, 7)
}

export function currentMonthKey() {
  return toMonthKey(new Date())
}

export function addMonths(monthKey: string, monthsToAdd: number) {
  const [year, month] = monthKey.split("-").map(Number)
  return toMonthKey(new Date(year, month - 1 + monthsToAdd, 1))
}

export function monthRange(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number)
  // Day 0 of next month is the last day of this month
  const lastDay = new Date(year, month, 0)
  return { first: `${monthKey}-01`, last: toDateKey(lastDay) }
}

export function monthLabel(monthKey: string) {
  return new Date(monthKey + "-01T00:00").toLocaleString("en", {
    month: "long",
    year: "numeric",
  })
}

export function dayLabel(dateKey: string) {
  return new Date(dateKey + "T00:00").toLocaleDateString("en", {
    weekday: "short",
    day: "numeric",
    month: "long",
  })
}
