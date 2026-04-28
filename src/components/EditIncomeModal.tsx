import { useState } from "react";

interface Props {
  income: number;
  onClose: () => void;
  onSave: (amount: number) => void;
}

export default function EditIncomeModal({ income, onClose, onSave }: Props) {
  const [incomeInput, setIncomeInput] = useState(String(income));
  const [error, setError] = useState("");

  function handleSave() {
    const parsed = parseFloat(incomeInput);
    if (!incomeInput || isNaN(parsed) || parsed < 0) {
      setError("Enter a valid income");
      return;
    }
    onSave(parsed);
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
        <h2 className="text-xl font-bold text-fg mb-5">Edit monthly income</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Monthly income (kr) *</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={incomeInput}
              onChange={(e) => {
                setIncomeInput(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") onClose();
              }}
              className={inputClass}
              autoFocus
            />
            {error && <p className="text-danger text-xs mt-1">{error}</p>}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-input bg-primary text-white font-semibold active:bg-primary-hover"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-input border border-border text-fg-muted font-medium active:bg-subtle"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
