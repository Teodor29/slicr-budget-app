import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import type { Transaction } from "../types";
import Modal from "./Modal";

interface Props {
  onClose: () => void;
  editTransaction?: Transaction;
  onDelete?: (id: string) => void;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddTransactionModal({ onClose, editTransaction, onDelete }: Props) {
  const { data, viewedMonth, addTransaction, updateTransaction } = useBudget();
  const categories = data.months[viewedMonth]?.categories ?? [];

  const [amount, setAmount] = useState(editTransaction ? String(editTransaction.amount) : "");
  const [description, setDescription] = useState(editTransaction?.description ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(editTransaction?.categoryId ?? null);
  const [date, setDate] = useState(editTransaction?.date ?? todayStr());
  const [recurring, setRecurring] = useState(editTransaction?.recurring ?? false);
  const [error, setError] = useState("");

  function handleSave() {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (editTransaction) {
      updateTransaction({ ...editTransaction, amount: parsed, description, categoryId, date, recurring });
    } else {
      addTransaction({ categoryId, amount: parsed, description, date, recurring });
    }
    onClose();
  }

  return (
    <Modal title={editTransaction ? "Edit expense" : "Add expense"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="label">Amount (kr) *</label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError(""); }}
            className="input"
            autoFocus
          />
          {error && <p className="text-danger text-xs mt-1">{error}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <input
            type="text"
            placeholder="What was it for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="label">Category</label>
          <select
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value || null)}
            className="input"
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
          <label className="label">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </div>

        <label className="flex items-center justify-between cursor-pointer select-none py-1">
          <span className="text-sm text-fg">Repeat every month</span>
          <input
            type="checkbox"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
            className="sr-only"
          />
          <div className={`relative w-11 h-6 rounded-full transition-colors ${recurring ? "bg-primary" : "bg-border"}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${recurring ? "translate-x-5" : ""}`} />
          </div>
        </label>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 btn-secondary"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 btn-primary"
        >
          Save
        </button>
      </div>

      {editTransaction && onDelete && (
        <button
          onClick={() => { onDelete(editTransaction.id); onClose(); }}
          className="btn-danger"
        >
          Delete transaction
        </button>
      )}
    </Modal>
  );
}
