import { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import type { Transaction } from '../types';
import AddTransactionModal from './AddTransactionModal';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';

export default function Transactions() {
  const { data, viewedMonth, deleteTransaction } = useBudget();
  const month = data.months[viewedMonth];
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const isCurrentMonth = viewedMonth === data.currentMonth;

  const transactions = [...(month?.transactions ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  function getCategoryName(categoryId: string | null) {
    if (!categoryId) return 'Other';
    return month?.categories.find(c => c.id === categoryId)?.name ?? 'Other';
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en', {
      day: 'numeric', month: 'short',
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="hidden md:block text-2xl font-semibold text-fg">Transactions</h2>
        {isCurrentMonth && (
          <button
            onClick={() => setShowAdd(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-input bg-primary text-white text-sm font-semibold active:bg-primary-hover"
          >
            <MdAdd className="w-4 h-4" />
            Add
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <p className="text-center text-muted py-10">No transactions yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-surface rounded-input px-4 py-3.5 shadow-sm flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-fg-secondary truncate">
                  {tx.description || getCategoryName(tx.categoryId)}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {getCategoryName(tx.categoryId)} · {formatDate(tx.date)}
                </p>
              </div>
              <span className="text-base font-semibold text-fg shrink-0">
                {tx.amount.toLocaleString('en')} kr
              </span>
              {isCurrentMonth && (
                <div className="flex gap-0.5 shrink-0">
                  <button onClick={() => setEditTx(tx)} className="p-2 text-muted active:text-primary rounded-lg">
                    <MdEdit className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteTransaction(tx.id)} className="p-2 text-muted active:text-danger rounded-lg">
                    <MdDelete className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAdd  && <AddTransactionModal onClose={() => setShowAdd(false)} />}
      {editTx   && <AddTransactionModal onClose={() => setEditTx(null)} editTransaction={editTx} />}
    </div>
  );
}
