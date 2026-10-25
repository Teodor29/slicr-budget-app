import { useState } from "react"
import { useBudget } from "../context/BudgetContext"
import type { Category } from "../types"
import CategoryModal from "../components/CategoryModal"
import EditableNumber from "../components/EditableNumber"
import SummaryCard from "../components/SummaryCard"
import { MdEdit } from "react-icons/md"
import { formatAmount } from "../lib/format"

const CURRENCIES = ["kr", "€", "$", "£", "¥", "CHF", "₹", "R$", "₩", "₺"]

export default function Plan() {
  const {
    data,
    setIncome,
    updateCategory,
    currency,
    setCurrency,
    resetData,
  } = useBudget()
  const template = data.template

  // "new" = adding a category, a Category = editing that category
  const [modal, setModal] = useState<Category | "new" | null>(null)

  const totalBudgeted = template.categories.reduce(
    (sum, category) => sum + category.budget,
    0,
  )

  return (
    <div className="flex flex-col gap-4 md:border-t md:border-border pt-6">
      <h2 className="hidden md:block">Plan</h2>

      <SummaryCard
        label="Remaining to budget"
        used={totalBudgeted}
        total={template.income}
        usedLabel="budgeted"
      />

      <div className="card">
        <h4 className="mb-3">Monthly income</h4>
        <div className="flex gap-2 items-center">
          <EditableNumber
            value={template.income}
            onSave={setIncome}
            label="Monthly income"
            className="flex flex-1 min-w-0 items-center justify-between bg-subtle rounded-input px-3 py-2 text-lg font-bold"
          >
            {formatAmount(template.income)}
            <MdEdit className="size-4 text-fg-muted" />
          </EditableNumber>
          <select
            aria-label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="input w-auto"
          >
            {CURRENCIES.map((symbol) => (
              <option key={symbol}>{symbol}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <h4 className="mb-3">Categories</h4>
        <div className="flex flex-col divide-y divide-border border-y border-border">
          {template.categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2 py-2">
              <button
                type="button"
                onClick={() => setModal(category)}
                className="flex flex-1 items-center gap-2 text-left text-sm font-medium"
              >
                {category.name}
                <MdEdit className="size-4 text-fg-muted" />
              </button>
              <EditableNumber
                value={category.budget}
                onSave={(budget) => updateCategory({ ...category, budget })}
                label={`Budget for ${category.name}`}
                className="px-3 py-2 rounded-lg bg-subtle text-sm font-medium text-right min-w-[3ch] field-sizing-content"
              >
                {formatAmount(category.budget)} {currency}
              </EditableNumber>
            </div>
          ))}
        </div>

        <button
          onClick={() => setModal("new")}
          className="w-full mt-4 py-3 rounded-input border-2 border-dashed border-border text-sm font-medium text-fg-muted active:bg-subtle"
        >
          + Add category
        </button>
      </div>

      {modal === "new" && <CategoryModal onClose={() => setModal(null)} />}
      {modal && modal !== "new" && (
        <CategoryModal category={modal} onClose={() => setModal(null)} />
      )}

      <button
        onClick={resetData}
        className="text-sm text-fg-muted underline hover:text-fg-muted/80 underline-offset-2 transition"
      >
        Reset all data
      </button>
    </div>
  )
}
