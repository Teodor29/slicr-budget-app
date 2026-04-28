import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import type { Transaction } from "../types";
import AddTransactionModal from "./AddTransactionModal";
import { MdEdit, MdAdd } from "react-icons/md";

export default function Transactions() {
  const { data, viewedMonth, deleteTransaction } = useBudget();
  const month = data.months[viewedMonth];
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [focusField, setFocusField] = useState<
    "amount" | "description" | "category" | "date" | null
  >(null);
  const [showAdd, setShowAdd] = useState(false);

  const isCurrentMonth = viewedMonth === data.currentMonth;

  const transactions = [...(month?.transactions ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Group transactions by date
  const transactionsByDate = transactions.reduce(
    (acc, tx) => {
      const date = tx.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(tx);
      return acc;
    },
    {} as Record<string, Transaction[]>,
  );

  const sortedDates = Object.keys(transactionsByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  function getCategoryName(categoryId: string | null) {
    if (!categoryId) return "Other";
    return month?.categories.find((c) => c.id === categoryId)?.name ?? "Other";
  }

  function formatFullDate(dateStr: string) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en", {
      weekday: "short",
      day: "numeric",
      month: "long",
    });
  }

  function handleEditField(tx: Transaction, field: string) {
    setEditTx(tx);
    setFocusField(field as any);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="hidden md:block text-2xl font-semibold text-fg">
          Transactions
        </h2>
        {isCurrentMonth && (
          <button
            onClick={() => setShowAdd(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-input bg-primary text-white text-sm font-semibold active:bg-primary-hover"
          >
            <MdAdd className="w-4 h-4" />
            Add
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <p className="text-center text-fg-muted py-10">No transactions yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-fg-muted px-4 mb-2">
                {formatFullDate(date)}
              </h3>
              <div className="flex flex-col gap-3">
                {transactionsByDate[date].map((tx) => (
                  <div
                    key={tx.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditField(tx, "amount");
                    }}
                    className="bg-surface rounded-card p-4 shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center cursor-pointer">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-fg">
                          {getCategoryName(tx.categoryId)}
                        </p>
                        <p className="text-xs text-fg-muted mt-0.5">
                          {tx.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-fg">
                          {tx.amount.toLocaleString("en")} kr
                        </span>
                        {isCurrentMonth && (
                          <MdEdit className="w-4 h-4 text-fg-muted" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} />}
      {editTx && (
        <AddTransactionModal
          onClose={() => {
            setEditTx(null);
            setFocusField(null);
          }}
          editTransaction={editTx}
          focusField={focusField}
          onDelete={deleteTransaction}
        />
      )}
    </div>
  );
}
