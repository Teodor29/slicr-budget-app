interface Props {
  pct: number
  danger?: boolean
  size?: 'sm' | 'md'
}

export default function ProgressBar({
  pct,
  danger = false,
  size = 'md',
}: Props) {
  const h = size === 'sm' ? 'h-2' : 'h-2.5'
  return (
    <div className={`w-full bg-border rounded-full ${h} overflow-hidden`}>
      <div
        className={`${h} rounded-full transition-all ${danger ? 'bg-danger' : 'bg-primary'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
