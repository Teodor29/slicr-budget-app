import { useState } from "react"
import { useBudget } from "../context/BudgetContext"
import type { Transaction } from "../types"
import TransactionModal from "../components/TransactionModal"
import { MdEdit, MdAdd, MdRepeat } from "react-icons/md"
import { formatAmount } from "../lib/format"
import { dayLabel } from "../lib/date"

interface DayGroup {
  date: string
  transactions: Transaction[]
}

function groupByDay(transactions: Transaction[]) {
  const newestFirst = [...transactions].sort((a, b) =>
    b.date.localeCompare(a.date),
  )

  const groups: DayGroup[] = []
  for (const transaction of newestFirst) {
    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.date === transaction.date) {
      lastGroup.transactions.push(transaction)
    } else {
      groups.push({ date: transaction.date, transactions: [transaction] })
    }
  }
  return groups
}

export default function Transactions() {
  const { data, viewedMonth, currency } = useBudget()
  const month = data.months[viewedMonth]
  const transactions = month?.transactions ?? []
  const dayGroups = groupByDay(transactions)

  // "new" = adding a transaction, a Transaction = editing that transaction
  const [modal, setModal] = useState<Transaction | "new" | null>(null)

  function getCategoryName(categoryId: string) {
    const category = month?.categories.find(
      (category) => category.id === categoryId,
    )
    return category?.name ?? "Other"
  }

  return (
    <div className="form-stack">
      <div className="flex items-center justify-between">
        <h2 className="hidden md:block">Transactions</h2>
        <button
          onClick={() => setModal("new")}
          className="hidden md:flex items-center gap-1.5 btn-primary btn-sm"
        >
          <MdAdd className="size-4" />
          Add
        </button>
      </div>

      {transactions.length === 0 && (
        <p className="text-center py-10">No transactions yet.</p>
      )}

      <div className="form-stack">
        {dayGroups.map((group) => (
          <div key={group.date}>
            <h3 className="text-sm font-semibold text-fg-muted px-4 mb-2">
              {dayLabel(group.date)}
            </h3>
            <div className="bg-surface rounded-card shadow-sm divide-y divide-border overflow-hidden">
              {group.transactions.map((transaction) => (
                <button
                  key={transaction.id}
                  onClick={() => setModal(transaction)}
                  className="flex w-full items-center px-4 py-3.5 text-left hover:bg-subtle"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {getCategoryName(transaction.categoryId)}
                    </p>
                    <p className="text-sm text-fg-muted mt-0.5">
                      {transaction.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {transaction.recurring && (
                      <MdRepeat
                        className="size-4 text-fg-muted"
                        aria-label="Repeats every month"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {formatAmount(transaction.amount)} {currency}
                    </span>
                    <MdEdit className="size-4 text-fg-muted" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modal === "new" && <TransactionModal onClose={() => setModal(null)} />}
      {modal && modal !== "new" && (
        <TransactionModal transaction={modal} onClose={() => setModal(null)} />
      )}
    </div>
  )
}
