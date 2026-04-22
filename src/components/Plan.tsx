import { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import type { Category } from '../types';
import { MdEdit, MdDelete, MdCheck, MdClose } from 'react-icons/md';

export default function Plan() {
  const { data, setIncome, addCategory, updateCategory, deleteCategory } = useBudget();
  const { template } = data;

  const [incomeEditing, setIncomeEditing] = useState(false);
  const [incomeInput, setIncomeInput] = useState('');

  const [newName, setNewName] = useState('');
  const [newBudget, setNewBudget] = useState('');

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

  function handleAddCategory() {
    const budget = parseFloat(newBudget);
    if (!newName.trim() || isNaN(budget) || budget < 0) return;
    addCategory({ name: newName.trim(), budget });
    setNewName('');
    setNewBudget('');
  }

  function saveEditCat() {
    if (!editingCat) return;
    updateCategory(editingCat);
    setEditingCat(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Income */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-gray-800">Monthly income</h3>
          {!incomeEditing && (
            <button onClick={startEditIncome} className="text-blue-600 active:opacity-70">
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
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button onClick={saveIncome} className="p-2.5 bg-blue-600 text-white rounded-xl active:bg-blue-700">
              <MdCheck className="w-5 h-5" />
            </button>
            <button onClick={() => setIncomeEditing(false)} className="p-2.5 border border-gray-200 rounded-xl text-gray-500 active:bg-gray-50">
              <MdClose className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {template.income.toLocaleString('en')} kr
          </p>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Categories</h3>

        {template.categories.length === 0 && (
          <p className="text-sm text-gray-400 mb-4">No categories yet.</p>
        )}

        <div className="flex flex-col divide-y divide-gray-50">
          {template.categories.map(cat => (
            <div key={cat.id} className="py-2 first:pt-0 last:pb-0">
              {editingCat?.id === cat.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCat.name}
                    onChange={e => setEditingCat({ ...editingCat, name: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter') saveEditCat(); if (e.key === 'Escape') setEditingCat(null); }}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <input
                    type="number"
                    value={editingCat.budget}
                    onChange={e => setEditingCat({ ...editingCat, budget: Number(e.target.value) })}
                    className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={saveEditCat} className="p-2 bg-blue-600 text-white rounded-xl">
                    <MdCheck className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingCat(null)} className="p-2 border border-gray-200 rounded-xl text-gray-500">
                    <MdClose className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                    <p className="text-xs text-gray-400">{cat.budget.toLocaleString('en')} kr / month</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditingCat(cat)} className="p-2 text-gray-400 active:text-blue-600">
                      <MdEdit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-400 active:text-red-600">
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 mt-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Add category</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); }}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Budget"
              value={newBudget}
              onChange={e => setNewBudget(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); }}
              className="w-24 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddCategory}
              disabled={!newName.trim() || !newBudget}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-40 active:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
