import { useState } from "react"
import { BudgetProvider } from "./context/BudgetContext"
import Overview from "./views/Overview"
import Plan from "./views/Plan"
import Transactions from "./views/Transactions"
import { MdAdd } from "react-icons/md"
import TransactionModal from "./components/TransactionModal"
import BottomNav, { type View } from "./components/BottomNav"
import NewMonthPrompt from "./components/NewMonthPrompt"

function AppInner() {
  const [view, setView] = useState<View>("overview")
  const [showAdd, setShowAdd] = useState(false)
  const showFab = view === "overview" || view === "transactions"

  function panelClass(panelView: View) {
    if (view === panelView) return ""
    return "hidden md:block"
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex-1 w-full px-4 py-6 md:grid md:grid-cols-[2fr_1fr] md:gap-6 md:px-8 md:py-10 max-w-6xl mx-auto">
        <section className={panelClass("overview")}>
          <Overview />
        </section>
        <section className={panelClass("transactions")}>
          <Transactions />
        </section>
        <section className={panelClass("plan")}>
          <Plan />
        </section>
      </main>

      <BottomNav view={view} onNavigate={setView}>
        {showFab && (
          <button
            aria-label="Add expense"
            onClick={() => setShowAdd(true)}
            className="absolute bottom-full right-4 mb-4 size-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center active:bg-primary-hover hover:bg-primary-hover"
          >
            <MdAdd className="size-7" />
          </button>
        )}
      </BottomNav>

      {showAdd && <TransactionModal onClose={() => setShowAdd(false)} />}
      <NewMonthPrompt />
    </div>
  )
}

export default function App() {
  return (
    <BudgetProvider>
      <AppInner />
    </BudgetProvider>
  )
}
