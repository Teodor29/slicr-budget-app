import { useBudget } from '../context/BudgetContext'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { fmt, monthLabel } from '../lib/format'
import ProgressBar from './ProgressBar'

// Returns a month key (e.g. "2026-06") offset by delta months from the given key
function addMonths(monthKey: string, delta: number) {
  const [y, m] = monthKey.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// Adds up all spending for a category.
// Transactions with no category (null) are counted under "other".
function spentForCategory(
  transactions: { categoryId: string | null; amount: number }[],
  catId: string
) {
  return transactions
    .filter(
      (t) => t.categoryId === catId || (catId === 'other' && !t.categoryId)
    )
    .reduce((sum, t) => sum + t.amount, 0)
}

export default function Overview() {
  const { data, viewedMonth, setViewedMonth, promptMonth, currency } =
    useBudget()

  const monthKeys = Object.keys(data.months).sort()
  const idx = monthKeys.indexOf(viewedMonth)
  const month = data.months[viewedMonth]

  if (!month) {
    return <p className="text-center-muted py-12">No data for this month.</p>
  }

  const totalSpent = month.transactions.reduce((sum, t) => sum + t.amount, 0)
  const remaining = month.income - totalSpent
  const spentPct =
    month.income > 0 ? Math.min((totalSpent / month.income) * 100, 100) : 0
  const overBudget = remaining < 0

  function goNext() {
    if (idx < monthKeys.length - 1) {
      setViewedMonth(monthKeys[idx + 1])
    } else {
      promptMonth(addMonths(viewedMonth, 1))
    }
  }

  return (
    <div className="form-stack">
      <div className="flex items-center justify-between">
        <button
          onClick={() => idx > 0 && setViewedMonth(monthKeys[idx - 1])}
          disabled={idx <= 0}
          className="p-2 rounded-full-muted disabled:opacity-30 active:bg-subtle"
        >
          <MdChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg md:text-3xl font-semibold">
          {monthLabel(viewedMonth)}
        </h1>
        <button
          onClick={goNext}
          className="p-2 rounded-full-muted active:bg-subtle"
        >
          <MdChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="card">
        <p className="mb-1">Remaining</p>
        <p className={`text-4xl font-bold mb-3 ${overBudget && 'text-danger'}`}>
          {fmt(remaining)} {currency}
        </p>
        <ProgressBar pct={spentPct} danger={overBudget} />
        <p className="text-xs-muted mt-1.5">
          {fmt(totalSpent)} of {fmt(month.income)} {currency} spent
        </p>
      </div>

      {month.categories.length > 0 && (
        <div className="card">
          <h3 className="mb-4">Total Budgeted</h3>
          <div className="form-stack">
            {month.categories.map((cat) => {
              const spent = spentForCategory(month.transactions, cat.id)
              const pct =
                cat.budget > 0 ? Math.min((spent / cat.budget) * 100, 100) : 0
              const over = spent > cat.budget && cat.budget > 0
              return (
                <div key={cat.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <span
                      className={`text-sm font-medium ${over ? 'text-danger' : 'text-fg-muted'}`}
                    >
                      {fmt(spent)} / {fmt(cat.budget)} {currency}
                    </span>
                  </div>
                  <ProgressBar pct={pct} danger={over} size="sm" />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
