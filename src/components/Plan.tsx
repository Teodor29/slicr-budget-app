import { useState } from 'react'
import { useBudget } from '../context/BudgetContext'
import type { Category } from '../types'
import AddCategoryModal from './AddCategoryModal'
import EditCategoryModal from './EditCategoryModal'
import { MdEdit } from 'react-icons/md'
import { fmt } from '../lib/format'
import ProgressBar from './ProgressBar'

export default function Plan() {
  const {
    data,
    setIncome,
    updateCategory,
    deleteCategory,
    currency,
    setCurrency,
  } = useBudget()
  const template = data.template

  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingCat, setEditingCat] = useState<Category | null>(null)

  // Income inline editing
  const [editingIncome, setEditingIncome] = useState(false)
  const [incomeInput, setIncomeInput] = useState('')

  // Budget inline editing (one category at a time, tracked by id)
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null)
  const [budgetInput, setBudgetInput] = useState('')

  function commitIncome() {
    const parsed = parseFloat(incomeInput)
    if (!isNaN(parsed) && parsed >= 0) setIncome(parsed)
    setEditingIncome(false)
  }

  function commitBudget() {
    const cat = template.categories.find((c) => c.id === editingBudgetId)
    setEditingBudgetId(null)
    if (!cat) return
    const parsed = parseFloat(budgetInput)
    if (!isNaN(parsed) && parsed >= 0) {
      updateCategory({ ...cat, budget: parsed })
    }
  }

  const totalBudgeted = template.categories.reduce(
    (sum, cat) => sum + cat.budget,
    0
  )
  const remainingToBudget = template.income - totalBudgeted
  const budgetedPct =
    template.income > 0
      ? Math.min((totalBudgeted / template.income) * 100, 100)
      : 0
  const overBudget = remainingToBudget < 0

  return (
    <div className="flex flex-col gap-4 md:border-t md:border-border pt-6">
      <h2 className="hidden md:block">Plan</h2>

      <div className="card">
        <p className="mb-1">Remaining to budget</p>
        <p className={`text-4xl font-bold mb-3 ${overBudget && 'text-danger'}`}>
          {fmt(remainingToBudget)} {currency}
        </p>
        <ProgressBar pct={budgetedPct} danger={overBudget} />
        <p className="text-xs-muted mt-1.5">
          {fmt(totalBudgeted)} of {fmt(template.income)} {currency} budgeted
        </p>
      </div>

      <div className="card">
        <h4 className="mb-3">Monthly income</h4>
        <div className="flex gap-2 items-center">
          {editingIncome ? (
            <input
              type="text"
              inputMode="decimal"
              value={incomeInput}
              autoFocus
              onFocus={(e) => e.target.select()}
              onChange={(e) => setIncomeInput(e.target.value)}
              onBlur={commitIncome}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitIncome()
                if (e.key === 'Escape') setEditingIncome(false)
              }}
              maxLength={12}
              className="flex-1 bg-subtle rounded-input px-3 py-2 text-lg font-bold focus:outline-none"
            />
          ) : (
            <div
              className="flex flex-1 items-center justify-between cursor-pointer bg-subtle rounded-input px-3 py-2"
              onClick={() => {
                setEditingIncome(true)
                setIncomeInput(String(template.income))
              }}
            >
              <span className="text-lg font-bold">
                {template.income.toLocaleString('en')}
              </span>
              <MdEdit className="w-4 h-4-muted" />
            </div>
          )}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="input w-auto"
          >
            {['kr', '€', '$', '£', '¥', 'CHF', '₹', 'R$', '₩', '₺'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <h4 className="mb-3">Categories</h4>
        {template.categories.length === 0 && (
          <p className="text-sm-muted mb-4">No categories yet.</p>
        )}

        <div className="flex flex-col divide-y divide-border border-y border-border">
          {template.categories.map((cat) => {
            const isEditingBudget = editingBudgetId === cat.id
            return (
              <div
                key={cat.id}
                className="flex items-center cursor-pointer py-2"
                onClick={() => setEditingCat(cat)}
              >
                <p className="text-sm font-medium">{cat.name}</p>
                <div className="flex-1" />
                {isEditingBudget ? (
                  <input
                    type="text"
                    inputMode="decimal"
                    value={budgetInput}
                    autoFocus
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    onBlur={commitBudget}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitBudget()
                      if (e.key === 'Escape') setEditingBudgetId(null)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    maxLength={12}
                    style={{ fieldSizing: 'content' } as React.CSSProperties} // makes the input shrink to fit its content
                    className="px-3 py-2 rounded-lg bg-subtle text-right focus:outline-none min-w-[3ch]"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingBudgetId(cat.id)
                      setBudgetInput(String(cat.budget))
                    }}
                    className="px-3 py-2 rounded-lg bg-subtle"
                  >
                    <span className="text-sm font-medium">
                      {cat.budget.toLocaleString('en')} {currency}
                    </span>
                  </button>
                )}
                <MdEdit className="w-4 h-4-muted ml-2" />
              </div>
            )
          })}
        </div>

        <button
          onClick={() => setShowAddCategory(true)}
          className="w-full mt-4 py-3 rounded-input border-2 border-dashed border-border text-sm font-medium-muted active:bg-subtle"
        >
          + Add category
        </button>
      </div>

      {showAddCategory && (
        <AddCategoryModal onClose={() => setShowAddCategory(false)} />
      )}
      {editingCat && (
        <EditCategoryModal
          category={editingCat}
          onClose={() => setEditingCat(null)}
          onSave={updateCategory}
          onDelete={deleteCategory}
          canDelete={editingCat.id !== 'other'}
        />
      )}
    </div>
  )
}
