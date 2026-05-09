import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import Modal from "./Modal";

interface Props {
  onClose: () => void;
}

const SUGGESTIONS = [
  "Housing",
  "Groceries",
  "Transport",
  "Shopping",
  "Health",
  "Entertainment",
  "Bills",
  "Savings",
  "Dining Out",
  "Subscriptions",
  "Travel",
  "Pets"
];

export default function AddCategoryModal({ onClose }: Props) {
  const { addCategory, currency, data } = useBudget();
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");

  const existingNames = new Set(
    data.template.categories.map((c) => c.name.toLowerCase()),
  );
  const suggestions = SUGGESTIONS.filter(
    (s) => !existingNames.has(s.toLowerCase()),
  );

  function handleSave() {
    const parsed = parseFloat(budget);
    if (!name.trim()) {
      setError("Enter a name");
      return;
    }
    if (!budget || isNaN(parsed) || parsed < 0) {
      setError("Enter a valid budget");
      return;
    }
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
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            className="input"
            autoFocus
          />
          {suggestions.length > 0 && (
            <div className="relative mt-2">
              <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setName(s);
                    setError("");
                  }}
                  className="tag"
                >
                  {s}
                </button>
              ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-surface to-transparent" />
            </div>
          )}
        </div>
        <div>
          <label className="label">Monthly budget ({currency}) *</label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            className="input"
          />
          {error && <p className="error-msg">{error}</p>}
        </div>
      </div>

      <div className="modal-actions">
        <button onClick={onClose} className="flex-1 btn-secondary">
          Cancel
        </button>
        <button onClick={handleSave} className="flex-1 btn-primary">
          Save
        </button>
      </div>
    </Modal>
  );
}
