interface Props {
  pct: number
  danger?: boolean
  size?: 'sm' | 'md'
  muted?: boolean
}

export default function ProgressBar({
  pct,
  danger = false,
  size = 'md',
  muted = false,
}: Props) {
  const h = size === 'sm' ? 'h-1.5' : 'h-3'
  const fill = danger ? 'bg-danger' : muted ? 'bg-primary/50' : 'bg-primary'
  return (
    <div className={`w-full bg-border rounded-full ${h} overflow-hidden`}>
      <div
        className={`${h} rounded-full transition-all ${fill}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
