import { useBudget } from "../context/BudgetContext"
import { monthLabel } from "../lib/date"
import Modal from "./Modal"

export default function NewMonthPrompt() {
  const { pendingNewMonth, confirmNewMonth, dismissNewMonth } = useBudget()
  if (!pendingNewMonth) return null

  return (
    <Modal
      title={`${monthLabel(pendingNewMonth)} is starting`}
      onClose={dismissNewMonth}
      onSubmit={confirmNewMonth}
    >
      <p>Your budget will be copied to the new month.</p>
      <div className="modal-actions">
        <button
          type="button"
          onClick={dismissNewMonth}
          className="flex-1 btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" className="flex-1 btn-primary">
          OK
        </button>
      </div>
    </Modal>
  )
}
