import { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import type { Category } from '../types';
import { MdEdit, MdDelete, MdCheck, MdClose } from 'react-icons/md';
import AddCategoryModal from './AddCategoryModal';

export default function Plan() {
  const { data, setIncome, updateCategory, deleteCategory } = useBudget();
  const { template } = data;

  const [incomeEditing, setIncomeEditing] = useState(false);
  const [incomeInput, setIncomeInput] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  function startEditIncome() {
    setIncomeInput(String(template.income));
    setIncomeEditing(true);
  }

  function saveIncome() {
    const val = parseFloat(incomeInput);
    if (!isNaN(val) && val >= 0) setIncome(val);
    setIncomeEditing(false);
  }

  function saveEditCat() {
    if (!editingCat) return;
    updateCategory(editingCat);
    setEditingCat(null);
  }

  const inputClass = "bg-surface text-fg border border-border rounded-input focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="flex flex-col gap-6">
      {/* Income */}
      <div className="bg-surface rounded-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-fg-secondary">Monthly income</h3>
          {!incomeEditing && (
            <button onClick={startEditIncome} className="text-primary active:opacity-70">
              <MdEdit className="w-5 h-5" />
            </button>
          )}
        </div>

        {incomeEditing ? (
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              value={incomeInput}
              onChange={e => setIncomeInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveIncome(); if (e.key === 'Escape') setIncomeEditing(false); }}
              className={`flex-1 px-4 py-2.5 text-base ${inputClass}`}
              autoFocus
            />
            <button onClick={saveIncome} className="p-2.5 bg-primary text-white rounded-input active:bg-primary-hover">
              <MdCheck className="w-5 h-5" />
            </button>
            <button onClick={() => setIncomeEditing(false)} className="p-2.5 border border-border rounded-input text-muted active:bg-hover">
              <MdClose className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <p className="text-2xl font-bold text-fg mt-1">
            {template.income.toLocaleString('en')} kr
          </p>
        )}
      </div>

      {/* Categories */}
      <div className="bg-surface rounded-card p-5 shadow-sm">
        <h3 className="text-base font-semibold text-fg-secondary mb-3">Categories</h3>

        {template.categories.length === 0 && (
          <p className="text-sm text-muted mb-4">No categories yet.</p>
        )}

        <div className="flex flex-col divide-y divide-border">
          {template.categories.map(cat => (
            <div key={cat.id} className="py-2 first:pt-0 last:pb-0">
              {editingCat?.id === cat.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCat.name}
                    onChange={e => setEditingCat({ ...editingCat, name: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter') saveEditCat(); if (e.key === 'Escape') setEditingCat(null); }}
                    className={`flex-1 px-3 py-2 text-sm ${inputClass}`}
                    autoFocus
                  />
                  <input
                    type="number"
                    value={editingCat.budget}
                    onChange={e => setEditingCat({ ...editingCat, budget: Number(e.target.value) })}
                    className={`w-28 px-3 py-2 text-sm ${inputClass}`}
                  />
                  <button onClick={saveEditCat} className="p-2 bg-primary text-white rounded-input">
                    <MdCheck className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingCat(null)} className="p-2 border border-border rounded-input text-muted">
                    <MdClose className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-fg-secondary">{cat.name}</p>
                    <p className="text-xs text-muted">{cat.budget.toLocaleString('en')} kr / month</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditingCat(cat)} className="p-2 text-muted active:text-primary">
                      <MdEdit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteCategory(cat.id)} className="p-2 text-muted active:text-danger">
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowAddCategory(true)}
          className="w-full mt-3 py-3 rounded-input border-2 border-dashed border-border text-sm font-medium text-muted active:bg-hover"
        >
          + Add category
        </button>
      </div>

      {showAddCategory && <AddCategoryModal onClose={() => setShowAddCategory(false)} />}
    </div>
  );
}
