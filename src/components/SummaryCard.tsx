import { useBudget } from "../context/BudgetContext"
import { formatAmount } from "../lib/format"
import ProgressBar from "./ProgressBar"

interface Props {
  label: string
  used: number
  total: number
  usedLabel: string
}

export default function SummaryCard({ label, used, total, usedLabel }: Props) {
  const { currency } = useBudget()
  const remaining = total - used
  const isOver = remaining < 0

  return (
    <div className="card">
      <p className="mb-1">{label}</p>
      <p className={`text-4xl font-bold mb-3 ${isOver ? "text-danger" : ""}`}>
        {formatAmount(remaining)} {currency}
      </p>
      <ProgressBar value={used} max={total} danger={isOver} />
      <p className="text-xs text-fg-muted mt-1.5">
        {formatAmount(used)} of {formatAmount(total)} {currency} {usedLabel}
      </p>
    </div>
  )
}
