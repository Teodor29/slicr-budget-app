import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import type { Category } from "../types";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import EditIncomeModal from "./EditIncomeModal";
import { MdEdit } from "react-icons/md";

export default function Plan() {
  const { data, setIncome, updateCategory, deleteCategory } = useBudget();
  const template = data?.template ?? { income: 0, categories: [] };

  const [incomeEditing, setIncomeEditing] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [focusField, setFocusField] = useState<"name" | "budget" | null>(null);

  function handleSaveCategory(cat: Category) {
    updateCategory(cat);
  }

  function handleSaveIncome(amount: number) {
    setIncome(amount);
  }

  return (
    <div className="flex flex-col gap-6">
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

        <div className="flex flex-col divide-y divide-border">
          {template.categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center py-3 first:pt-0 last:pb-0 cursor-pointer"
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
    </div>
  );
}
