import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import type { Category } from "../types";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import EditIncomeModal from "./EditIncomeModal";
import EditRecurringTransactionModal from "./EditRecurringTransactionModal";
import { MdEdit, MdAdd } from "react-icons/md";

function fmt(n: number) {
  return n.toLocaleString("en", { maximumFractionDigits: 0 });
}

export default function Plan() {
  const { data, setIncome, updateCategory, deleteCategory } = useBudget();
  const template = data.template;
  const recurring = template.recurringTransactions ?? [];

  const [incomeEditing, setIncomeEditing] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [focusField, setFocusField] = useState<"name" | "budget" | null>(null);
  const [editingRecurringId, setEditingRecurringId] = useState<string | null>(
    null,
  );
  const [showAddRecurring, setShowAddRecurring] = useState(false);

  function handleSaveCategory(cat: Category) {
    updateCategory(cat);
  }

  function handleSaveIncome(amount: number) {
    setIncome(amount);
  }

  function getCategoryName(id: string | null) {
    if (!id) return "Other";
    return template.categories.find((c: Category) => c.id === id)?.name ?? "Other";
  }

  const totalBudgeted = template.categories.reduce(
    (sum, cat) => sum + cat.budget,
    0,
  );
  const remainingToBudget = template.income - totalBudgeted;
  const budgetedPct =
    template.income > 0
      ? Math.min((totalBudgeted / template.income) * 100, 100)
      : 0;
  const overBudget = remainingToBudget < 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface rounded-card p-5 shadow-sm">
        <p className="text-sm text-fg-muted mb-1">Remaining to budget</p>
        <p
          className={`text-4xl font-bold mb-3 ${overBudget ? "text-danger" : "text-fg"}`}
        >
          {fmt(remainingToBudget)} kr
        </p>
        <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all ${overBudget ? "bg-danger" : "bg-primary"}`}
            style={{ width: `${budgetedPct}%` }}
          />
        </div>
        <p className="text-xs text-fg-muted mt-1.5">
          {fmt(totalBudgeted)} of {fmt(template.income)} kr budgeted
        </p>
      </div>
      <div
        className="flex bg-surface rounded-card p-5 shadow-sm"
        onClick={() => setIncomeEditing(true)}
      >
        <div className="flex-1">
          <h3 className="text-base font-semibold text-fg mb-2">
            Monthly income
          </h3>
          <p className="text-2xl font-bold text-fg">
            {(template.income ?? 0).toLocaleString("en")} kr
          </p>
        </div>
        <MdEdit className=" w-4 h-4 text-fg-muted mt-1" />
      </div>

      <div className="bg-surface rounded-card p-5 shadow-sm">
        <h3 className="text-base font-semibold text-fg mb-3">Categories</h3>

        {template.categories.length === 0 && (
          <p className="text-sm text-fg-muted mb-4">No categories yet.</p>
        )}

        <div className="flex flex-col divide-y divide-border border-y border-border">
          {template.categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center cursor-pointer py-3"
              onClick={() => {
                setEditingCat(cat);
                setFocusField("name");
              }}
            >
              <p className="text-sm font-medium text-fg">{cat.name}</p>
              <div className="flex-1" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingCat(cat);
                  setFocusField("budget");
                }}
                className="px-3 py-2 rounded-lg bg-subtle"
              >
                <span className="text-sm font-medium text-fg">
                  {cat.budget.toLocaleString("en")} kr
                </span>
              </button>
              <MdEdit className="w-4 h-4 text-fg-muted ml-2" />
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowAddCategory(true)}
          className="w-full mt-3 py-3 rounded-input border-2 border-dashed border-border text-sm font-medium text-fg-muted active:bg-subtle"
        >
          + Add category
        </button>
      </div>

      <div className="bg-surface rounded-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-fg">Fixed expenses</h3>
          <button
            onClick={() => setShowAddRecurring(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-input bg-subtle text-fg text-sm font-semibold active:bg-border"
          >
            <MdAdd className="w-4 h-4" />
            Add
          </button>
        </div>

        {recurring.length === 0 ? (
          <p className="text-sm text-fg-muted">No fixed expenses yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border border-y border-border">
            {recurring
              .slice()
              .sort((a, b) => a.dayOfMonth - b.dayOfMonth)
              .map((rt) => (
                <div
                  key={rt.id}
                  className="flex items-center cursor-pointer py-3"
                  onClick={() => setEditingRecurringId(rt.id)}
                >
                  <div>
                    <p className="text-sm font-medium text-fg">
                      {rt.description || getCategoryName(rt.categoryId)}
                    </p>
                    <p className="text-xs text-fg-muted mt-0.5">
                      Day {rt.dayOfMonth} · {getCategoryName(rt.categoryId)}
                    </p>
                  </div>
                  <div className="flex-1" />
                  <span className="text-sm font-semibold text-fg">
                    {rt.amount.toLocaleString("en")} kr
                  </span>
                  <MdEdit className="w-4 h-4 text-fg-muted ml-2" />
                </div>
              ))}
          </div>
        )}
      </div>

      {showAddCategory && (
        <AddCategoryModal onClose={() => setShowAddCategory(false)} />
      )}
      {editingCat && (
        <EditCategoryModal
          category={editingCat}
          onClose={() => {
            setEditingCat(null);
            setFocusField(null);
          }}
          onSave={handleSaveCategory}
          onDelete={deleteCategory}
          canDelete={editingCat.id !== "other"}
          focusField={focusField}
        />
      )}
      {incomeEditing && (
        <EditIncomeModal
          income={template.income}
          onClose={() => setIncomeEditing(false)}
          onSave={handleSaveIncome}
        />
      )}

      {showAddRecurring && (
        <EditRecurringTransactionModal onClose={() => setShowAddRecurring(false)} />
      )}
      {editingRecurringId && (
        <EditRecurringTransactionModal
          recurring={recurring.find((r) => r.id === editingRecurringId)}
          onClose={() => setEditingRecurringId(null)}
        />
      )}
    </div>
  );
}
