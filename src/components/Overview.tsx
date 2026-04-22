import { useBudget } from '../context/BudgetContext';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

function formatMonthLabel(key: string) {
  const [year, month] = key.split('-');
  return new Date(Number(year), Number(month) - 1).toLocaleString('en', {
    month: 'long',
    year: 'numeric',
  });
}

function fmt(n: number) {
  return n.toLocaleString('en', { maximumFractionDigits: 0 });
}

export default function Overview() {
  const { data, viewedMonth, setViewedMonth } = useBudget();

  const monthKeys = Object.keys(data.months).sort();
  const idx = monthKeys.indexOf(viewedMonth);
  const month = data.months[viewedMonth];

  if (!month) {
    return <p className="text-center text-gray-400 py-12">No data for this month.</p>;
  }

  const totalSpent = month.transactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = month.income - totalSpent;
  const spentPct = month.income > 0 ? Math.min((totalSpent / month.income) * 100, 100) : 0;
  const overBudget = remaining < 0;
  return (
    <div className="flex flex-col gap-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => idx > 0 && setViewedMonth(monthKeys[idx - 1])}
          disabled={idx <= 0}
          className="p-2 rounded-full text-gray-400 disabled:opacity-30 active:bg-gray-100"
        >
          <MdChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{formatMonthLabel(viewedMonth)}</h1>
        <button
          onClick={() => idx < monthKeys.length - 1 && setViewedMonth(monthKeys[idx + 1])}
          disabled={idx >= monthKeys.length - 1}
          className="p-2 rounded-full text-gray-400 disabled:opacity-30 active:bg-gray-100"
        >
          <MdChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Total remaining card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-sm text-gray-500 mb-1">Remaining</p>
        <p className={`text-4xl font-bold mb-3 ${overBudget ? 'text-red-600' : 'text-gray-900'}`}>
          {fmt(remaining)} kr
        </p>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all ${overBudget ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${spentPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          {fmt(totalSpent)} of {fmt(month.income)} kr spent
        </p>
      </div>

      {/* Category breakdown */}
      {month.categories.length > 0 && (
        <div className="flex flex-col gap-2">
          {month.categories.map(cat => {
            const spent = month.transactions
              .filter(t => t.categoryId === cat.id)
              .reduce((sum, t) => sum + t.amount, 0);
            const pct = cat.budget > 0 ? Math.min((spent / cat.budget) * 100, 100) : 0;
            const over = spent > cat.budget;
            return (
              <div key={cat.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                  <span className={`text-sm font-medium ${over ? 'text-red-600' : 'text-gray-500'}`}>
                    {fmt(spent)} / {fmt(cat.budget)} kr
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${over ? 'bg-red-500' : 'bg-blue-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
