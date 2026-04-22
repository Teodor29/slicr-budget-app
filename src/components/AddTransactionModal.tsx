import { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import type { Transaction } from '../types';

interface Props {
  onClose: () => void;
  editTransaction?: Transaction;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddTransactionModal({ onClose, editTransaction }: Props) {
  const { data, viewedMonth, addTransaction, updateTransaction } = useBudget();
  const categories = data.months[viewedMonth]?.categories ?? [];

  const [amount, setAmount] = useState(editTransaction ? String(editTransaction.amount) : '');
  const [description, setDescription] = useState(editTransaction?.description ?? '');
  const [categoryId, setCategoryId] = useState<string | null>(editTransaction?.categoryId ?? null);
  const [date, setDate] = useState(editTransaction?.date ?? todayStr());
  const [error, setError] = useState('');

  function handleSave() {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (editTransaction) {
      updateTransaction({ ...editTransaction, amount: parsed, description, categoryId, date });
    } else {
      addTransaction({ categoryId, amount: parsed, description, date });
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-20"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-t-2xl sm:rounded-card p-6 w-full sm:max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-5">
          {editTransaction ? 'Edit expense' : 'Add expense'}
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Amount (kr) *</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={e => { setAmount(e.target.value); setError(''); }}
              className="w-full border border-border rounded-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            {error && <p className="text-danger text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
            <input
              type="text"
              placeholder="What was it for?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border border-border rounded-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Category</label>
            <select
              value={categoryId ?? ''}
              onChange={e => setCategoryId(e.target.value || null)}
              className="w-full border border-border rounded-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
            >
              <option value="">Other</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-border rounded-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-input border border-border text-gray-700 font-medium active:bg-gray-50"
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
