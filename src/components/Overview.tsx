import { useBudget } from "../context/BudgetContext"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import { formatAmount } from "../lib/format"
import { addMonths, monthLabel } from "../lib/date"
import type { Category, Transaction } from "../types"
import ProgressBar from "./ProgressBar"
import SummaryCard from "./SummaryCard"

function sumAmounts(transactions: Transaction[]) {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
}

export default function Overview() {
  const { data, viewedMonth, setViewedMonth, promptMonth, currency } =
    useBudget()

  const monthKeys = Object.keys(data.months).sort()
  const currentIndex = monthKeys.indexOf(viewedMonth)
  const isFirstMonth = currentIndex <= 0
  const isLastMonth = currentIndex === monthKeys.length - 1
  const month = data.months[viewedMonth]

  if (!month) {
    return (
      <p className="text-center text-fg-muted py-12">No data for this month.</p>
    )
  }

  const totalSpent = sumAmounts(month.transactions)

  function spentInCategory(category: Category) {
    const categoryTransactions = month.transactions.filter(
      (transaction) => transaction.categoryId === category.id,
    )
    return sumAmounts(categoryTransactions)
  }

  function goToPreviousMonth() {
    setViewedMonth(monthKeys[currentIndex - 1])
  }

  function goToNextMonth() {
    if (isLastMonth) {
      promptMonth(addMonths(viewedMonth, 1))
    } else {
      setViewedMonth(monthKeys[currentIndex + 1])
    }
  }

  return (
    <div className="form-stack">
      <div className="flex items-center justify-between">
        <button
          aria-label="Previous month"
          onClick={goToPreviousMonth}
          disabled={isFirstMonth}
          className="p-2 rounded-full text-fg-muted disabled:opacity-30 active:bg-subtle"
        >
          <MdChevronLeft className="size-6" />
        </button>
        <h1 className="text-lg md:text-3xl font-semibold">
          {monthLabel(viewedMonth)}
        </h1>
        <button
          aria-label="Next month"
          onClick={goToNextMonth}
          className="p-2 rounded-full text-fg-muted active:bg-subtle"
        >
          <MdChevronRight className="size-6" />
        </button>
      </div>

      <SummaryCard
        label="Remaining"
        used={totalSpent}
        total={month.income}
        usedLabel="spent"
      />

      {month.categories.length > 0 && (
        <div className="card">
          <h3 className="mb-4">Total Budgeted</h3>
          <div className="form-stack">
            {month.categories.map((category) => {
              const spent = spentInCategory(category)
              const isOver = category.budget > 0 && spent > category.budget
              return (
                <div key={category.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span
                      className={`text-sm font-medium ${isOver ? "text-danger" : "text-fg-muted"}`}
                    >
                      {formatAmount(spent)} / {formatAmount(category.budget)}{" "}
                      {currency}
                    </span>
                  </div>
                  <ProgressBar
                    value={spent}
                    max={category.budget}
                    danger={isOver}
                    size="sm"
                    muted
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
