import { useState } from 'react';
import { BudgetProvider, useBudget } from './context/BudgetContext';
import Overview from './components/Overview';
import Plan from './components/Plan';
import Transactions from './components/Transactions';
import AddTransactionModal from './components/AddTransactionModal';
import { FaChartPie } from 'react-icons/fa';
import { MdNotes, MdEdit, MdAdd } from 'react-icons/md';

type View = 'overview' | 'transactions' | 'plan';

function NewMonthPrompt() {
  const { pendingNewMonth, confirmNewMonth, dismissNewMonth } = useBudget();
  if (!pendingNewMonth) return null;

  const [year, month] = pendingNewMonth.split('-');
  const label = new Date(Number(year), Number(month) - 1).toLocaleString('en', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 px-4">
      <div className="bg-surface rounded-card p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 mb-2">New month</h2>
        <p className="text-muted mb-6">
          Start {label}? Your template will be copied to the new month.
        </p>
        <div className="flex gap-3">
          <button
            onClick={dismissNewMonth}
            className="flex-1 py-2.5 rounded-input border border-border text-gray-700 font-medium active:bg-gray-50"
          >
            Not now
          </button>
          <button
            onClick={confirmNewMonth}
            className="flex-1 py-2.5 rounded-input bg-primary text-white font-semibold active:bg-primary-hover"
          >
            Start {label}
          </button>
        </div>
      </div>
    </div>
  );
}

function AppInner() {
  const [view, setView] = useState<View>('overview');
  const [showModal, setShowModal] = useState(false);
  const { data } = useBudget();
  const showFab = (view === 'overview' || view === 'transactions') && data.months[data.currentMonth] !== undefined;

  return (
    <div className="min-h-screen bg-page flex flex-col">
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 pb-24">
        {view === 'overview' && <Overview />}
        {view === 'transactions' && <Transactions />}
        {view === 'plan' && <Plan />}
      </main>

      {showFab && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-20 right-4 z-10 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center active:bg-primary-hover"
        >
          <MdAdd className="w-7 h-7" />
        </button>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex">
        <button
          onClick={() => setView('overview')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium ${view === 'overview' ? 'text-primary' : 'text-muted'}`}
        >
          <FaChartPie className="w-6 h-6" />
          Overview
        </button>
        <button
          onClick={() => setView('plan')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium ${view === 'plan' ? 'text-primary' : 'text-muted'}`}
        >
          <MdEdit className="w-6 h-6" />
          Plan
        </button>
        <button
          onClick={() => setView('transactions')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium ${view === 'transactions' ? 'text-primary' : 'text-muted'}`}
        >
          <MdNotes className="w-6 h-6" />
          Transactions
        </button>
      </nav>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
      <NewMonthPrompt />
    </div>
  );
}

export default function App() {
  return (
    <BudgetProvider>
      <AppInner />
    </BudgetProvider>
  );
}
