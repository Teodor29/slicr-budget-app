import { useState } from "react"
import { BrowserRouter, Navigate, Route, Routes, useMatch } from "react-router"
import { BudgetProvider } from "./context/BudgetContext"
import Month from "./views/Month"
import Plan from "./views/Plan"
import { MdAdd } from "react-icons/md"
import TransactionModal from "./components/TransactionModal"
import BottomNav from "./components/BottomNav"
import NewMonthPrompt from "./components/NewMonthPrompt"
import DesktopHeader from "./components/DesktopHeader"

function AppInner() {
  const [showAdd, setShowAdd] = useState(false)
  const isPlanPage = useMatch("/plan") !== null

  return (
    <div className="min-h-dvh flex flex-col">
      <DesktopHeader />
      <main className="flex-1 w-full px-4 py-6 md:px-8 md:py-8 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Month mobileView="overview" />} />
          <Route
            path="/transactions"
            element={<Month mobileView="transactions" />}
          />
          <Route path="/plan" element={<Plan />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <BottomNav>
        {!isPlanPage && (
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
    <BrowserRouter>
      <BudgetProvider>
        <AppInner />
      </BudgetProvider>
    </BrowserRouter>
  )
}
