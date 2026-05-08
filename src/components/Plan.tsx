import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import type { Category } from "../types";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import EditIncomeModal from "./EditIncomeModal";
import { MdEdit } from "react-icons/md";
import { fmt } from "../lib/format";

export default function Plan() {
  const { data, setIncome, updateCategory, deleteCategory } = useBudget();
  const template = data.template;

  const [incomeEditing, setIncomeEditing] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [focusField, setFocusField] = useState<"name" | "budget" | null>(null);

  const totalBudgeted = template.categories.reduce((sum, cat) => sum + cat.budget, 0);
  const remainingToBudget = template.income - totalBudgeted;
  const budgetedPct =
    template.income > 0 ? Math.min((totalBudgeted / template.income) * 100, 100) : 0;
  const overBudget = remainingToBudget < 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <p className="text-sm text-fg-muted mb-1">Remaining to budget</p>
        <p className={`text-4xl font-bold mb-3 ${overBudget ? "text-danger" : "text-fg"}`}>
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
        className="flex card cursor-pointer"
        onClick={() => setIncomeEditing(true)}
      >
        <div className="flex-1">
          <h3 className="text-base font-semibold text-fg mb-2">Monthly income</h3>
          <p className="text-2xl font-bold text-fg">
            {(template.income ?? 0).toLocaleString("en")} kr
          </p>
        </div>
        <MdEdit className="w-4 h-4 text-fg-muted mt-1" />
      </div>

      <div className="card">
        <h3 className="text-base font-semibold text-fg mb-3">Categories</h3>

        {template.categories.length === 0 && (
          <p className="text-sm text-fg-muted mb-4">No categories yet.</p>
        )}

        <div className="flex flex-col divide-y divide-border border-y border-border">
          {template.categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center cursor-pointer py-3"
              onClick={() => { setEditingCat(cat); setFocusField("name"); }}
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

      {showAddCategory && <AddCategoryModal onClose={() => setShowAddCategory(false)} />}
      {editingCat && (
        <EditCategoryModal
          category={editingCat}
          onClose={() => { setEditingCat(null); setFocusField(null); }}
          onSave={updateCategory}
          onDelete={deleteCategory}
          canDelete={editingCat.id !== "other"}
          focusField={focusField}
        />
      )}
      {incomeEditing && (
        <EditIncomeModal
          income={template.income}
          onClose={() => setIncomeEditing(false)}
          onSave={setIncome}
        />
      )}
    </div>
  );
}
