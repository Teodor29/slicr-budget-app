import { useState, type ReactNode } from "react"

interface Props {
  value: number
  onSave: (value: number) => void
  label: string
  className: string
  children: ReactNode
}

export default function EditableNumber({
  value,
  onSave,
  label,
  className,
  children,
}: Props) {
  const [draft, setDraft] = useState<string | null>(null)
  const isEditing = draft !== null

  function save() {
    const parsed = parseFloat(draft ?? "")
    if (!isNaN(parsed) && parsed >= 0) onSave(parsed)
    setDraft(null)
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        aria-label={label}
        onClick={() => setDraft(String(value))}
        className={className}
      >
        {children}
      </button>
    )
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      aria-label={label}
      value={draft}
      autoFocus
      maxLength={12}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") save()
        if (e.key === "Escape") setDraft(null)
      }}
      className={`${className} focus:outline-none`}
    />
  )
}
