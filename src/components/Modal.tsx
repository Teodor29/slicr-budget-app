import type { ReactNode } from "react"

interface Props {
  title: string
  onClose: () => void
  onSubmit: () => void
  children: ReactNode
}

export default function Modal({ title, onClose, onSubmit, children }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4"
      onClick={onClose}
    >
      <form
        className="card w-full max-w-md max-h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <h2 className="text-xl font-bold mb-3">{title}</h2>
        {children}
      </form>
    </div>
  )
}
