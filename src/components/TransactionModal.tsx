import { useState } from "react"
import { useBudget } from "../context/BudgetContext"
import type { Transaction } from "../types"
import { monthRange, toDateKey } from "../lib/date"
import Modal from "./Modal"

const NEW_CATEGORY_OPTION = "__new__"

interface Props {
  onClose: () => void
  transaction?: Transaction
}

export default function TransactionModal({ onClose, transaction }: Props) {
  const {
    data,
    viewedMonth,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    currency,
  } = useBudget()
  const categories = data.months[viewedMonth]?.categories ?? []
  const isEditing = transaction !== undefined

  // The date has to be within the viewed month
  const { first: firstDate, last: lastDate } = monthRange(viewedMonth)
  const today = toDateKey(new Date())
  let defaultDate = firstDate
  if (today.startsWith(viewedMonth)) defaultDate = today

  const [amount, setAmount] = useState(
    isEditing ? String(transaction.amount) : "",
  )
  const [description, setDescription] = useState(transaction?.description ?? "")
  const [categoryId, setCategoryId] = useState(
    transaction?.categoryId ?? "other",
  )
  const [date, setDate] = useState(transaction?.date ?? defaultDate)
  const [recurring, setRecurring] = useState(transaction?.recurring ?? false)
  const [error, setError] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  function handleCreateCategory() {
    const name = newCategoryName.trim()
    if (!name) return

    const id = addCategory({ name, budget: 0 })
    setCategoryId(id)
    setNewCategoryName("")
    setIsAddingCategory(false)
  }

  function handleCategoryChange(value: string) {
    if (value === NEW_CATEGORY_OPTION) {
      setIsAddingCategory(true)
    } else {
      setCategoryId(value)
    }
  }

  function handleSave() {
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount")
      return
    }

    const values = {
      amount: parsedAmount,
      description,
      categoryId,
      date,
      recurring,
    }
    if (isEditing) {
      updateTransaction({ ...transaction, ...values })
    } else {
      addTransaction(values)
    }
    onClose()
  }

  function handleDelete() {
    if (!transaction) return
    deleteTransaction(transaction.id)
    onClose()
  }

  return (
    <Modal
      title={isEditing ? "Edit expense" : "Add expense"}
      onClose={onClose}
      onSubmit={handleSave}
    >
      <div className="form-stack">
        <label>
          <span className="label">Amount ({currency})</span>
          <input
            type="number"
            step="any"
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              setError("")
            }}
            className="input"
            autoFocus={!isEditing}
          />
          {error && <p className="error-msg">{error}</p>}
        </label>

        <label>
          <span className="label">Description</span>
          <input
            type="text"
            placeholder="What was it for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
          />
        </label>

        <div>
          <span className="label">Category</span>
          {isAddingCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                aria-label="New category name"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleCreateCategory()
                  }
                  if (e.key === "Escape") setIsAddingCategory(false)
                }}
                className="input flex-1"
                autoFocus
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                className="btn-primary"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          ) : (
            <select
              aria-label="Category"
              value={categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="input"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value={NEW_CATEGORY_OPTION}>+ New category</option>
            </select>
          )}
        </div>

        <label>
          <span className="label">Date</span>
          <input
            type="date"
            required
            min={firstDate}
            max={lastDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer select-none py-1">
          <span className="text-sm">Repeat every month</span>
          <input
            type="checkbox"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`relative w-11 h-6 rounded-full transition-colors ${recurring ? "bg-primary" : "bg-border"}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${recurring ? "translate-x-5" : ""}`}
            />
          </div>
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

      {isEditing && (
        <button type="button" onClick={handleDelete} className="btn-danger">
          Delete transaction
        </button>
      )}
    </Modal>
  )
}
