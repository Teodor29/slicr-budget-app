import { useBudget } from "../context/BudgetContext";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { fmt } from "../lib/format";

function monthLabel(key: string) {
  const [year, month] = key.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleString("en", {
    month: "long",
    year: "numeric",
  });
}

function addMonths(monthKey: string, delta: number) {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function spentForCategory(
  transactions: { categoryId: string | null; amount: number }[],
  catId: string,
) {
  return transactions
    .filter((t) => t.categoryId === catId || (catId === "other" && !t.categoryId))
    .reduce((sum, t) => sum + t.amount, 0);
}

export default function Overview() {
  const { data, viewedMonth, setViewedMonth, promptMonth } = useBudget();

  const monthKeys = Object.keys(data.months).sort();
  const idx = monthKeys.indexOf(viewedMonth);
  const month = data.months[viewedMonth];

  if (!month) {
    return <p className="text-center text-fg-muted py-12">No data for this month.</p>;
  }

  const totalSpent = month.transactions.reduce((sum, t) => sum + t.amount, 0);
  const income = month.income ?? 0;
  const remaining = income - totalSpent;
  const spentPct = income > 0 ? Math.min((totalSpent / income) * 100, 100) : 0;
  const overBudget = remaining < 0;
  const totalBudgeted = month.categories.reduce((sum, cat) => sum + cat.budget, 0);

  function goNext() {
    if (idx < monthKeys.length - 1) {
      setViewedMonth(monthKeys[idx + 1]);
    } else {
      promptMonth(addMonths(viewedMonth, 1));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => idx > 0 && setViewedMonth(monthKeys[idx - 1])}
          disabled={idx <= 0}
          className="p-2 rounded-full text-fg-muted disabled:opacity-30 active:bg-subtle"
        >
          <MdChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg md:text-3xl font-semibold text-fg">
          {monthLabel(viewedMonth)}
        </h1>
        <button
          onClick={goNext}
          className="p-2 rounded-full text-fg-muted active:bg-subtle"
        >
          <MdChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-surface rounded-card p-5 shadow-sm">
        <p className="text-sm text-fg-muted mb-1">Remaining</p>
        <p className={`text-4xl font-bold mb-3 ${overBudget ? "text-danger" : "text-fg"}`}>
          {fmt(remaining)} kr
        </p>
        <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all ${overBudget ? "bg-danger" : "bg-primary"}`}
            style={{ width: `${spentPct}%` }}
          />
        </div>
        <p className="text-xs text-fg-muted mt-1.5">
          {fmt(totalSpent)} of {fmt(income)} kr spent
        </p>
      </div>

      {month.categories.length > 0 && (
        <div className="bg-surface rounded-card p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-fg">Total Budgeted</h3>
            <span className="font-medium text-fg-muted">{fmt(totalBudgeted)} kr</span>
          </div>
          <div className="flex flex-col gap-4">
            {month.categories.map((cat) => {
              const spent = spentForCategory(month.transactions, cat.id);
              const pct = cat.budget > 0 ? Math.min((spent / cat.budget) * 100, 100) : 0;
              const over = spent > cat.budget;
              return (
                <div key={cat.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-fg">{cat.name}</span>
                    <span className={`text-sm font-medium ${over ? "text-danger" : "text-fg-muted"}`}>
                      {fmt(spent)} / {fmt(cat.budget)} kr
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${over ? "bg-danger" : "bg-primary"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
