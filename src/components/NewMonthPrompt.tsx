import { useBudget } from "../context/BudgetContext";

export default function NewMonthPrompt() {
  const { pendingNewMonth, confirmNewMonth, dismissNewMonth } = useBudget();
  if (!pendingNewMonth) return null;

  const [year, month] = pendingNewMonth.split("-");
  const label = new Date(Number(year), Number(month) - 1).toLocaleString("en", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 px-4 pb-4 sm:pb-0">
      <div className="bg-surface rounded-card p-6 w-full max-w-sm shadow-xl">
        <p className="mb-4">
          {label} is starting. Your budget will be copied to the new month.
        </p>
        <div className="flex gap-3">
          <button
            onClick={dismissNewMonth}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={confirmNewMonth}
            className="flex-1 btn-primary"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
