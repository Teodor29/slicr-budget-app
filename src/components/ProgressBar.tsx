interface Props {
  value: number
  max: number
  danger?: boolean
  size?: "sm" | "md"
  muted?: boolean
}

export default function ProgressBar({
  value,
  max,
  danger = false,
  size = "md",
  muted = false,
}: Props) {
  let percent = 0
  if (max > 0) percent = Math.min((value / max) * 100, 100)

  const height = size === "sm" ? "h-1.5" : "h-3"

  let fillColor = "bg-primary"
  if (muted) fillColor = "bg-primary/50"
  if (danger) fillColor = "bg-danger"

  return (
    <div className={`w-full bg-border rounded-full ${height} overflow-hidden`}>
      <div
        className={`${height} rounded-full transition-all ${fillColor}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
