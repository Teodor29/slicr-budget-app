import { useState } from "react";
import type { Category } from "../types";
import Modal from "./Modal";
import { useBudget } from "../context/BudgetContext";

interface Props {
  category: Category;
  onClose: () => void;
  onSave: (cat: Category) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
  focusField?: "name" | "budget" | null;
}

export default function EditCategoryModal({
  category,
  onClose,
  onSave,
  onDelete,
  canDelete,
  focusField,
}: Props) {
  const { currency } = useBudget();
  const [name, setName] = useState(category.name);
  const [budget, setBudget] = useState(String(category.budget));
  const [error, setError] = useState("");

  function handleSave() {
    const parsed = parseFloat(budget);
    if (!name.trim()) { setError("Enter a name"); return; }
    if (!budget || isNaN(parsed) || parsed < 0) { setError("Enter a valid budget"); return; }
    onSave({ ...category, name: name.trim(), budget: parsed });
    onClose();
  }

  return (
    <Modal title="Edit category" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="label">Name *</label>
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            className="input"
            autoFocus={focusField !== "budget"}
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
            className="input"
            autoFocus={focusField === "budget"}
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

      {canDelete && (
        <button
          onClick={() => { onDelete(category.id); onClose(); }}
          className="btn-danger"
        >
          Delete category
        </button>
      )}
    </Modal>
  );
}
