import { useState } from "react";
import Modal from "./Modal";
import { useBudget } from "../context/BudgetContext";

interface Props {
  income: number;
  onClose: () => void;
  onSave: (amount: number) => void;
}

export default function EditIncomeModal({ income, onClose, onSave }: Props) {
  const { currency } = useBudget();
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

  return (
    <Modal title="Edit monthly income" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="label">Monthly income ({currency}) *</label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={incomeInput}
            onChange={(e) => { setIncomeInput(e.target.value); setError(""); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") onClose();
            }}
            className="input"
            autoFocus
          />
          {error && <p className="text-danger text-xs mt-1">{error}</p>}
        </div>
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
    </Modal>
  );
}
