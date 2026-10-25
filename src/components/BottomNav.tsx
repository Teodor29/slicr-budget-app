import type { ReactNode } from "react"
import { FaChartPie } from "react-icons/fa"
import { MdNotes, MdEdit } from "react-icons/md"

export type View = "overview" | "transactions" | "plan"

const NAV_ITEMS = [
  { id: "overview", label: "Overview", Icon: FaChartPie },
  { id: "transactions", label: "Transactions", Icon: MdNotes },
  { id: "plan", label: "Plan", Icon: MdEdit },
] as const

interface Props {
  view: View
  onNavigate: (view: View) => void
  children?: ReactNode
}

export default function BottomNav({ view, onNavigate, children }: Props) {
  return (
    <nav className="md:hidden sticky bottom-0 z-10 bg-surface border-t border-border flex">
      {children}
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = view === id
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            aria-current={isActive ? "page" : undefined}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium ${isActive ? "text-primary" : "text-fg-muted"}`}
          >
            <Icon className="size-6" />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
