import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import type { RecurringTransaction } from "../types";

interface Props {
  recurring?: RecurringTransaction;
  onClose: () => void;
}

export default function EditRecurringTransactionModal({
  recurring,
  onClose,
}: Props) {
  const { data, addRecurringTransaction, updateRecurringTransaction, deleteRecurringTransaction } =
    useBudget();

  const categories = data.template.categories ?? [];

  const [amount, setAmount] = useState(recurring ? String(recurring.amount) : "");
  const [description, setDescription] = useState(recurring?.description ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(
    recurring?.categoryId ?? null,
  );
  const [dayOfMonth, setDayOfMonth] = useState(
    recurring ? String(recurring.dayOfMonth) : "1",
  );
  const [error, setError] = useState("");

  function handleSave() {
    const parsedAmount = parseFloat(amount);
    const parsedDay = parseInt(dayOfMonth, 10);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!dayOfMonth || isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) {
      setError("Enter a day between 1 and 31");
      return;
    }

    if (recurring) {
      updateRecurringTransaction({
        ...recurring,
        amount: parsedAmount,
        description,
        categoryId,
        dayOfMonth: parsedDay,
      });
    } else {
      addRecurringTransaction({
        amount: parsedAmount,
        description,
        categoryId,
        dayOfMonth: parsedDay,
      });
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
          {recurring ? "Edit fixed expense" : "Add fixed expense"}
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
              autoFocus
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <input
              type="text"
              placeholder="e.g. Rent, Spotify"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(e.target.value || null)}
              className={inputClass}
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
            <label className={labelClass}>Day of month (1-31) *</label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={31}
              value={dayOfMonth}
              onChange={(e) => {
                setDayOfMonth(e.target.value);
                setError("");
              }}
              className={inputClass}
            />
            {error && <p className="text-danger text-xs mt-1">{error}</p>}
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

        {recurring && (
          <button
            onClick={() => {
              deleteRecurringTransaction(recurring.id);
              onClose();
            }}
            className="w-full mt-3 py-3 rounded-input border border-danger text-danger font-medium active:bg-red-50"
          >
            Delete fixed expense
          </button>
        )}
      </div>
    </div>
  );
}

