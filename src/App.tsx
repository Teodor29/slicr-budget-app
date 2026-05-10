import { useState } from 'react'
import { BudgetProvider } from './context/BudgetContext'
import Overview from './components/Overview'
import Plan from './components/Plan'
import Transactions from './components/Transactions'
import { MdAdd } from 'react-icons/md'
import AddTransactionModal from './components/AddTransactionModal'
import BottomNav from './components/BottomNav'
import NewMonthPrompt from './components/NewMonthPrompt'

type View = 'overview' | 'transactions' | 'plan'

function AppInner() {
  const [view, setView] = useState<View>('overview')
  const [showAdd, setShowAdd] = useState(false)
  const showFab = view === 'overview' || view === 'transactions'

  return (
    <div className="min-h-[100dvh] bg-page">
      {/* Desktop: sections stacked */}
      <div className="hidden md:grid md:grid-cols-[2fr_1fr] gap-6 px-8 py-10 max-w-6xl mx-auto">
        <Overview />
        <Transactions />
        <Plan />
      </div>

      {/* Mobile: one panel at a time */}
      <div className="md:hidden flex flex-col min-h-[100dvh]">
        <main
          className="flex-1 px-4 py-6"
          style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
        >
          {view === 'overview' && <Overview />}
          {view === 'transactions' && <Transactions />}
          {view === 'plan' && <Plan />}
        </main>

        {showFab && (
          <button
            onClick={() => setShowAdd(true)}
            className="fixed bottom-20 right-4 z-20 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center active:bg-primary-hover hover:bg-primary-hover"
          >
            <MdAdd className="w-7 h-7" />
          </button>
        )}

        <BottomNav view={view} onNavigate={setView} />
      </div>

      {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} />}
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
