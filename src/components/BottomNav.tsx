import type { ReactNode } from "react"
import { NavLink } from "react-router"
import { FaChartPie } from "react-icons/fa"
import { MdNotes, MdEdit } from "react-icons/md"

const NAV_ITEMS = [
  { to: "/", label: "Overview", Icon: FaChartPie },
  { to: "/transactions", label: "Transactions", Icon: MdNotes },
  { to: "/plan", label: "Plan", Icon: MdEdit },
] as const

function navItemClass({ isActive }: { isActive: boolean }) {
  const color = isActive ? "text-primary" : "text-fg-muted"
  return `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium ${color}`
}

interface Props {
  children?: ReactNode
}

export default function BottomNav({ children }: Props) {
  return (
    <nav className="md:hidden sticky bottom-0 z-10 bg-surface border-t border-border flex">
      {children}
      {NAV_ITEMS.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} end className={navItemClass}>
          <Icon className="size-6" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
