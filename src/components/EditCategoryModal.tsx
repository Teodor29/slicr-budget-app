import { useState } from 'react'
import type { Category } from '../types'
import Modal from './Modal'
import { useBudget } from '../context/BudgetContext'

interface Props {
  category: Category
  onClose: () => void
  onSave: (cat: Category) => void
  onDelete: (id: string) => void
  canDelete: boolean
}

export default function EditCategoryModal({
  category,
  onClose,
  onSave,
  onDelete,
  canDelete,
}: Props) {
  const { currency } = useBudget()
  const [name, setName] = useState(category.name)
  const [budget, setBudget] = useState(String(category.budget))
  const [error, setError] = useState('')

  function handleSave() {
    if (!name.trim()) {
      setError('Enter a name')
      return
    }
    const parsed = parseFloat(budget)
    if (!budget || isNaN(parsed) || parsed < 0) {
      setError('Enter a valid budget')
      return
    }
    onSave({ ...category, name: name.trim(), budget: parsed })
    onClose()
  }

  return (
    <Modal title="Edit category" onClose={onClose}>
      <div className="form-stack">
        <div>
          <label className="label">Name *</label>
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            className="input"
          />
        </div>
        <div>
          <label className="label">Monthly budget ({currency}) *</label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value)
              setError('')
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

      {canDelete && (
        <button
          onClick={() => {
            onDelete(category.id)
            onClose()
          }}
          className="btn-danger"
        >
          Delete category
        </button>
      )}
    </Modal>
  )
}
