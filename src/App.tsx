import { useState } from "react";
import { BudgetProvider, useBudget } from "./context/BudgetContext";
import Overview from "./components/Overview";
import Plan from "./components/Plan";
import Transactions from "./components/Transactions";
import { FaChartPie } from "react-icons/fa";
import { MdNotes, MdEdit, MdAdd } from "react-icons/md";
import AddTransactionModal from "./components/AddTransactionModal";

type View = "overview" | "transactions" | "plan";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", Icon: FaChartPie },
  { id: "transactions", label: "Transactions", Icon: MdNotes },
  { id: "plan", label: "Plan", Icon: MdEdit },
] as const;

function NewMonthPrompt() {
  const { pendingNewMonth, confirmNewMonth, dismissNewMonth } = useBudget();
  if (!pendingNewMonth) return null;

  const [year, month] = pendingNewMonth.split("-");
  const label = new Date(Number(year), Number(month) - 1).toLocaleString("en", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-30 px-4 pb-4 sm:pb-0">
      <div className="bg-surface rounded-card p-6 w-full max-w-sm shadow-xl">
        <p className="text-fg mb-4">
          {label} is starting. Your budget will be copied to the new month.
        </p>
        <div className="flex gap-3">
          <button
            onClick={dismissNewMonth}
            className="flex-1 py-2.5 rounded-input border border-border text-fg-muted font-medium active:bg-subtle"
          >
            Cancel
          </button>
          <button
            onClick={confirmNewMonth}
            className="flex-1 py-2.5 rounded-input bg-primary text-white font-semibold active:bg-primary-hover"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function AppInner() {
  const [view, setView] = useState<View>("overview");
  const [showAdd, setShowAdd] = useState(false);
  const showFab = view === "overview" || view === "transactions";

  return (
    <div className="min-h-[100dvh] bg-page">
      {/* Desktop: one page, sections stacked */}
      <div className="hidden md:grid md:grid-cols-[2fr_1fr] gap-6 px-8 py-10 max-w-6xl mx-auto">
        <Overview />
        <Transactions />
        <Plan />
      </div>

      {/* Mobile: one panel at a time */}
      <div className="md:hidden flex flex-col min-h-[100dvh]">
        <main
          className="flex-1 px-4 py-6"
          style={{ paddingBottom: "calc(6rem + env(safe-area-inset-bottom))" }}
        >
          {view === "overview" && <Overview />}
          {view === "transactions" && <Transactions />}
          {view === "plan" && <Plan />}
        </main>

        {showFab && (
          <button
            onClick={() => setShowAdd(true)}
            className="fixed bottom-20 right-4 z-10 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center active:bg-primary-hover"
          >
            <MdAdd className="w-7 h-7" />
          </button>
        )}

        <nav
          className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setView(id as View)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium ${view === id ? "text-primary" : "text-fg-muted"}`}
            >
              <Icon className="w-6 h-6" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} />}
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
