import { useState } from 'react';
import { useBudget } from '../context/BudgetContext';

interface Props {
  onClose: () => void;
}

export default function AddCategoryModal({ onClose }: Props) {
  const { addCategory } = useBudget();
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');

  function handleSave() {
    const parsed = parseFloat(budget);
    if (!name.trim()) { setError('Enter a name'); return; }
    if (!budget || isNaN(parsed) || parsed < 0) { setError('Enter a valid budget'); return; }
    addCategory({ name: name.trim(), budget: parsed });
    onClose();
  }

  const inputClass = "w-full bg-surface text-fg border border-border rounded-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary";
  const labelClass = "text-sm font-medium text-fg-muted block mb-1.5";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-20"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-t-2xl sm:rounded-card p-6 w-full sm:max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-fg mb-5">Add category</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              type="text"
              placeholder="e.g. Food, Rent, Gym"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
              className={inputClass}
              autoFocus
            />
          </div>

          <div>
            <label className={labelClass}>Monthly budget (kr) *</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={budget}
              onChange={e => { setBudget(e.target.value); setError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
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
      </div>
    </div>
  );
}
