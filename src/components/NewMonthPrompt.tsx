import { useBudget } from '../context/BudgetContext'
import { monthLabel } from '../lib/format'

export default function NewMonthPrompt() {
  const { pendingNewMonth, confirmNewMonth, dismissNewMonth } = useBudget()
  if (!pendingNewMonth) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 px-4 pb-4 sm:pb-0">
      <div className="bg-surface rounded-card p-6 w-full max-w-sm shadow-xl">
        <p className="mb-4">
          {monthLabel(pendingNewMonth)} is starting. Your budget will be copied
          to the new month.
        </p>
        <div className="flex gap-3">
          <button onClick={dismissNewMonth} className="flex-1 btn-secondary">
            Cancel
          </button>
          <button onClick={confirmNewMonth} className="flex-1 btn-primary">
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
