import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import type { Transaction } from "../types";

interface Props {
  onClose: () => void;
  editTransaction?: Transaction;
  focusField?: "amount" | "description" | "category" | "date" | null;
  onDelete?: (id: string) => void;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddTransactionModal({
  onClose,
  editTransaction,
  focusField,
  onDelete,
}: Props) {
  const { data, viewedMonth, addTransaction, updateTransaction } = useBudget();
  const categories = data.months[viewedMonth]?.categories ?? [];

  const [amount, setAmount] = useState(
    editTransaction ? String(editTransaction.amount) : "",
  );
  const [description, setDescription] = useState(
    editTransaction?.description ?? "",
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    editTransaction?.categoryId ?? null,
  );
  const [date, setDate] = useState(editTransaction?.date ?? todayStr());
  const [error, setError] = useState("");

  function handleSave() {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (editTransaction) {
      updateTransaction({
        ...editTransaction,
        amount: parsed,
        description,
        categoryId,
        date,
      });
    } else {
      addTransaction({ categoryId, amount: parsed, description, date });
    }
    onClose();
  }

  const inputClass =
    "w-full bg-surface text-fg border border-border rounded-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary";
  const labelClass = "text-sm font-medium text-fg-muted block mb-1.5";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-20"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-t-2xl sm:rounded-card p-6 w-full sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-fg mb-5">
          {editTransaction ? "Edit expense" : "Add expense"}
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Amount (kr) *</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              className={inputClass}
              autoFocus={
                focusField !== "description" &&
                focusField !== "category" &&
                focusField !== "date"
              }
            />
            {error && <p className="text-danger text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <input
              type="text"
              placeholder="What was it for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              autoFocus={focusField === "description"}
            />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(e.target.value || null)}
              className={inputClass}
              autoFocus={focusField === "category"}
            >
              <option value="">Other</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
              autoFocus={focusField === "date"}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-input border border-border text-fg-muted font-medium active:bg-subtle"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-input bg-primary text-white font-semibold active:bg-primary-hover"
          >
            Save
          </button>
        </div>

        {editTransaction && onDelete && (
          <button
            onClick={() => {
              onDelete(editTransaction.id);
              onClose();
            }}
            className="w-full mt-3 py-3 rounded-input border border-danger text-danger font-medium active:bg-red-50"
          >
            Delete transaction
          </button>
        )}
      </div>
    </div>
  );
}
