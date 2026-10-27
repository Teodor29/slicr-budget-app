import { Link, useMatch } from "react-router"

function modeLinkClass(isActive: boolean) {
  if (isActive)
    return "px-4 py-1.5 rounded-full text-sm font-medium bg-surface shadow-sm"
  return "px-4 py-1.5 rounded-full text-sm font-medium text-fg-muted hover:text-fg"
}

export default function DesktopHeader() {
  const isPlanPage = useMatch("/plan") !== null

  return (
    <header className="hidden md:flex items-center justify-between w-full max-w-6xl mx-auto px-8 pt-8">
      <Link to="/" className="text-xl font-bold">
        Slicr
      </Link>
      <nav className="flex gap-1 p-1 rounded-full bg-subtle">
        <Link
          to="/"
          aria-current={!isPlanPage ? "page" : undefined}
          className={modeLinkClass(!isPlanPage)}
        >
          Month
        </Link>
        <Link
          to="/plan"
          aria-current={isPlanPage ? "page" : undefined}
          className={modeLinkClass(isPlanPage)}
        >
          Plan
        </Link>
      </nav>
    </header>
  )
}
