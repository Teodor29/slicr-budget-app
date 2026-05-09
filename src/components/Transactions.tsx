import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import type { Transaction } from "../types";
import AddTransactionModal from "./AddTransactionModal";
import { MdEdit, MdAdd, MdRepeat } from "react-icons/md";

export default function Transactions() {
  const { data, viewedMonth, deleteTransaction, currency } = useBudget();
  const month = data.months[viewedMonth];
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const sorted = [...(month?.transactions ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Group consecutive transactions by date (already sorted)
  const groups: { date: string; txs: Transaction[] }[] = [];
  for (const tx of sorted) {
    const last = groups[groups.length - 1];
    if (last?.date === tx.date) last.txs.push(tx);
    else groups.push({ date: tx.date, txs: [tx] });
  }

  function getCategoryName(categoryId: string | null) {
    if (!categoryId) return "Other";
    return month?.categories.find((c) => c.id === categoryId)?.name ?? "Other";
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en", {
      weekday: "short",
      day: "numeric",
      month: "long",
    });
  }

  return (
    <div className="form-stack">
      <div className="flex items-center justify-between">
        <h2 className="hidden md:block">Transactions</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="hidden md:flex items-center gap-1.5 btn-sm-primary"
        >
          <MdAdd className="w-4 h-4" />
          Add
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-center py-10">No transactions yet.</p>
      ) : (
        <div className="form-stack">
          {groups.map(({ date, txs }) => (
            <div key={date}>
              <h3 className="text-sm font-semibold-muted px-4 mb-2">
                {formatDate(date)}
              </h3>
              <div className="bg-surface rounded-card shadow-sm">
                <div className="flex flex-col">
                  {txs.map((tx, i) => (
                    <div key={tx.id}>
                      {i > 0 && <div className="h-px bg-border mx-4" />}
                      <div
                        onClick={() => setEditTx(tx)}
                        className="flex items-center p-4 cursor-pointer"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {getCategoryName(tx.categoryId)}
                          </p>
                          <p className="text-xs-muted mt-0.5">{tx.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {tx.recurring && <MdRepeat className="w-4 h-4-muted" />}
                          <span className="text-sm font-medium">
                            {tx.amount.toLocaleString("en")} {currency}
                          </span>
                          <MdEdit className="w-4 h-4-muted" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} />}
      {editTx && (
        <AddTransactionModal
          onClose={() => setEditTx(null)}
          editTransaction={editTx}
          onDelete={deleteTransaction}
        />
      )}
    </div>
  );
}
