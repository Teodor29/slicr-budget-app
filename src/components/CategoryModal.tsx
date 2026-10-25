import { useState } from "react"
import { useBudget } from "../context/BudgetContext"
import type { Category } from "../types"
import Modal from "./Modal"

interface Props {
  onClose: () => void
  category?: Category
}

interface FormErrors {
  name?: string
  budget?: string
}

const SUGGESTIONS = [
  "Housing",
  "Food",
  "Savings",
  "Transport",
  "Shopping",
  "Utilities",
  "Subscriptions",
  "Groceries",
  "Dining Out",
  "Entertainment",
  "Health",
  "Education",
  "Insurance",
  "Travel",
  "Pets",
]

export default function CategoryModal({ onClose, category }: Props) {
  const { addCategory, updateCategory, deleteCategory, currency, data } =
    useBudget()
  const isEditing = category !== undefined
  const canDelete = isEditing && category.id !== "other"

  const [name, setName] = useState(category?.name ?? "")
  const [budget, setBudget] = useState(isEditing ? String(category.budget) : "")
  const [errors, setErrors] = useState<FormErrors>({})

  const existingNames = data.template.categories.map((existing) =>
    existing.name.toLowerCase(),
  )
  let suggestions: string[] = []
  if (!isEditing) {
    suggestions = SUGGESTIONS.filter(
      (suggestion) => !existingNames.includes(suggestion.toLowerCase()),
    )
  }

  function handleNameChange(value: string) {
    setName(value)
    setErrors({ ...errors, name: undefined })
  }

  function handleBudgetChange(value: string) {
    setBudget(value)
    setErrors({ ...errors, budget: undefined })
  }

  function handleSave() {
    const trimmedName = name.trim()
    const parsedBudget = budget === "" ? 0 : parseFloat(budget)

    const newErrors: FormErrors = {}
    if (!trimmedName) {
      newErrors.name = "Enter a name"
    }
    if (isNaN(parsedBudget) || parsedBudget < 0) {
      newErrors.budget = "Enter a valid budget"
    }
    if (newErrors.name || newErrors.budget) {
      setErrors(newErrors)
      return
    }

    const values = { name: trimmedName, budget: parsedBudget }
    if (isEditing) {
      updateCategory({ ...category, ...values })
    } else {
      addCategory(values)
    }
    onClose()
  }

  function handleDelete() {
    if (!category) return
    deleteCategory(category.id)
    onClose()
  }

  return (
    <Modal
      title={isEditing ? "Edit category" : "Add category"}
      onClose={onClose}
      onSubmit={handleSave}
    >
      <div className="form-stack">
        <div>
          <label>
            <span className="label">Name</span>
            <input
              type="text"
              placeholder="e.g. Groceries, Food"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="input"
              autoFocus={!isEditing}
            />
          </label>
          {suggestions.length > 0 && (
            <div className="relative mt-2">
              <div className="flex gap-2 overflow-x-auto flex-nowrap md:flex-wrap md:overflow-x-visible no-scrollbar">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleNameChange(suggestion)}
                    className="tag"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-surface to-transparent md:hidden" />
            </div>
          )}
          {errors.name && <p className="error-msg">{errors.name}</p>}
        </div>

        <label>
          <span className="label">Monthly budget ({currency})</span>
          <input
            type="number"
            step="any"
            inputMode="decimal"
            placeholder="0"
            value={budget}
            onChange={(e) => handleBudgetChange(e.target.value)}
            className="input"
          />
          {errors.budget && <p className="error-msg">{errors.budget}</p>}
        </label>
      </div>

      <div className="modal-actions">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" className="flex-1 btn-primary">
          Save
        </button>
      </div>

      {canDelete && (
        <button type="button" onClick={handleDelete} className="btn-danger">
          Delete category
        </button>
      )}
    </Modal>
  )
}
