import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import type { Category } from "../types";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import EditIncomeModal from "./EditIncomeModal";
import { MdEdit } from "react-icons/md";
import { fmt } from "../lib/format";

export default function Plan() {
  const {
    data,
    setIncome,
    updateCategory,
    deleteCategory,
    currency,
    setCurrency,
  } = useBudget();
  const template = data.template;

  const [incomeEditing, setIncomeEditing] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [focusField, setFocusField] = useState<"name" | "budget" | null>(null);

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
    <div className="flex flex-col gap-6 md:border-t md:border-border pt-6">
      <h2 className="hidden md:block">Plan</h2>
      <div className="card">
        <p className="text-sm-muted mb-1">Remaining to budget</p>
        <p
          className={`text-4xl font-bold mb-3 ${overBudget ? "text-danger" : "text-fg"}`}
        >
          {fmt(remainingToBudget)} {currency}
        </p>
        <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all ${overBudget ? "bg-danger" : "bg-primary"}`}
            style={{ width: `${budgetedPct}%` }}
          />
        </div>
        <p className="text-xs-muted mt-1.5">
          {fmt(totalBudgeted)} of {fmt(template.income)} {currency} budgeted
        </p>
      </div>

      <div className="card">
        <h3 className="text-base font-semibold mb-3">Monthly income</h3>
        <div className="flex gap-2 items-center">
          <div
            className="flex flex-1 items-center justify-between cursor-pointer bg-subtle rounded-input px-3 py-2"
            onClick={() => setIncomeEditing(true)}
          >
            <span className="text-lg font-bold">
              {(template.income ?? 0).toLocaleString("en")}
            </span>
            <MdEdit className="w-4 h-4-muted" />
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="input w-auto"
          >
            {["kr", "€", "$", "£", "¥", "CHF", "₹", "R$", "₩", "₺"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-semibold mb-3">Categories</h3>
        {template.categories.length === 0 && (
          <p className="text-sm-muted mb-4">No categories yet.</p>
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
              <p className="text-sm font-medium">{cat.name}</p>
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
                <span className="text-sm font-medium">
                  {cat.budget.toLocaleString("en")} {currency}
                </span>
              </button>
              <MdEdit className="w-4 h-4-muted ml-2" />
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowAddCategory(true)}
          className="w-full mt-3 py-3 rounded-input border-2 border-dashed border-border text-sm font-medium-muted active:bg-subtle"
        >
          + Add category
        </button>
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
