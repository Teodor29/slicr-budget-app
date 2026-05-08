import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import Modal from "./Modal";

interface Props {
  onClose: () => void;
}

export default function AddCategoryModal({ onClose }: Props) {
  const { addCategory, currency } = useBudget();
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");

  function handleSave() {
    const parsed = parseFloat(budget);
    if (!name.trim()) { setError("Enter a name"); return; }
    if (!budget || isNaN(parsed) || parsed < 0) { setError("Enter a valid budget"); return; }
    addCategory({ name: name.trim(), budget: parsed });
    onClose();
  }

  return (
    <Modal title="Add category" onClose={onClose}>
      <div className="form-stack">
        <div>
          <label className="label">Name *</label>
          <input
            type="text"
            placeholder="e.g. Food, Rent, Gym"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            className="input"
            autoFocus
          />
        </div>
        <div>
          <label className="label">Monthly budget ({currency}) *</label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={budget}
            onChange={(e) => { setBudget(e.target.value); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            className="input"
          />
          {error && <p className="error-msg">{error}</p>}
        </div>
      </div>

      <div className="modal-actions">
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
