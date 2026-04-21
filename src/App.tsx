import { useState } from 'react';
import Overview from './components/Overview';
import Plan from './components/Plan';
import Transactions from './components/Transactions';
import AddTransactionModal from './components/AddTransactionModal';
import { FaChartPie } from 'react-icons/fa';
import { MdNotes, MdEdit } from 'react-icons/md';

type View = 'overview' | 'transactions' | 'plan';

export default function App() {
  const [view, setView] = useState<View>('overview');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 pb-24">
        {view === 'overview' && <Overview onAddTransaction={() => setShowModal(true)} />}
        {view === 'transactions' && <Transactions />}
        {view === 'plan' && <Plan />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        <button
          onClick={() => setView('overview')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium ${view === 'overview' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <FaChartPie className="w-6 h-6" />
          Overview
        </button>
        <button
          onClick={() => setView('plan')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium ${view === 'plan' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <MdEdit className="w-6 h-6" />
          Plan
        </button>
        <button
          onClick={() => setView('transactions')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium ${view === 'transactions' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <MdNotes className="w-6 h-6" />
          Transactions
        </button>
      </nav>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
