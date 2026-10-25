import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import type { AppData, Category, Month, Template, Transaction } from "../types"
import { loadData, saveData, createInitialData } from "../lib/storage"
import { createSeedData } from "../lib/seed"
import { currentMonthKey } from "../lib/date"

interface BudgetContextValue {
  data: AppData
  viewedMonth: string
  setViewedMonth: (monthKey: string) => void
  pendingNewMonth: string | null
  promptMonth: (monthKey: string) => void
  confirmNewMonth: () => void
  dismissNewMonth: () => void
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  updateTransaction: (transaction: Transaction) => void
  deleteTransaction: (id: string) => void
  addCategory: (category: Omit<Category, "id">) => string
  updateCategory: (category: Category) => void
  deleteCategory: (id: string) => void
  setIncome: (amount: number) => void
  currency: string
  setCurrency: (currency: string) => void
  loadSeedData: () => void
}

const BudgetContext = createContext<BudgetContextValue | null>(null)

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(
    () => loadData() ?? createInitialData(),
  )

  const currentMonthExists = Boolean(data.months[currentMonthKey()])

  const [viewedMonth, setViewedMonth] = useState(() => {
    if (currentMonthExists) return currentMonthKey()
    const latestMonth = Object.keys(data.months).sort().pop()!
    return latestMonth
  })

  const [pendingNewMonth, setPendingNewMonth] = useState<string | null>(() => {
    if (currentMonthExists) return null
    return currentMonthKey()
  })

  useEffect(() => {
    saveData(data)
  }, [data])

  function updateViewedMonth(change: (month: Month) => Month) {
    setData((prev) => {
      const month = prev.months[viewedMonth]
      if (!month) return prev

      return {
        ...prev,
        months: { ...prev.months, [viewedMonth]: change(month) },
      }
    })
  }

  function updateViewedTransactions(
    change: (transactions: Transaction[]) => Transaction[],
  ) {
    updateViewedMonth((month) => ({
      ...month,
      transactions: change(month.transactions),
    }))
  }

  function confirmNewMonth() {
    if (!pendingNewMonth) return
    const newMonthKey = pendingNewMonth

    setData((prev) => {
      const previousTransactions = prev.months[viewedMonth]?.transactions ?? []
      const recurringTransactions = previousTransactions
        .filter((transaction) => transaction.recurring)
        .map((transaction) => ({
          ...transaction,
          id: crypto.randomUUID(),
          date: newMonthKey + "-01",
        }))

      const newMonth = { ...prev.template, transactions: recurringTransactions }
      return { ...prev, months: { ...prev.months, [newMonthKey]: newMonth } }
    })

    setViewedMonth(newMonthKey)
    setPendingNewMonth(null)
  }

  function addTransaction(newTransaction: Omit<Transaction, "id">) {
    updateViewedTransactions((transactions) => [
      ...transactions,
      { ...newTransaction, id: crypto.randomUUID() },
    ])
  }

  function updateTransaction(updated: Transaction) {
    updateViewedTransactions((transactions) =>
      transactions.map((transaction) => {
        if (transaction.id === updated.id) return updated
        return transaction
      }),
    )
  }

  function deleteTransaction(id: string) {
    updateViewedTransactions((transactions) =>
      transactions.filter((transaction) => transaction.id !== id),
    )
  }

  function updatePlan(change: (plan: Template) => Template) {
    setData((prev) => ({ ...prev, template: change(prev.template) }))
    updateViewedMonth((month) => ({ ...month, ...change(month) }))
  }

  function addCategory(category: Omit<Category, "id">): string {
    const newCategory = { ...category, id: crypto.randomUUID() }
    updatePlan((plan) => ({
      ...plan,
      categories: [...plan.categories, newCategory],
    }))
    return newCategory.id
  }

  function updateCategory(updated: Category) {
    updatePlan((plan) => ({
      ...plan,
      categories: plan.categories.map((category) => {
        if (category.id === updated.id) return updated
        return category
      }),
    }))
  }

  function deleteCategory(id: string) {
    if (id === "other") return

    updatePlan((plan) => ({
      ...plan,
      categories: plan.categories.filter((category) => category.id !== id),
    }))
    updateViewedTransactions((transactions) =>
      transactions.map((transaction) => {
        if (transaction.categoryId === id) {
          return { ...transaction, categoryId: "other" }
        }
        return transaction
      }),
    )
  }

  function setIncome(amount: number) {
    updatePlan((plan) => ({ ...plan, income: amount }))
  }

  function setCurrency(currency: string) {
    setData((prev) => ({ ...prev, currency }))
  }

  function loadSeedData() {
    setData(createSeedData())
    setViewedMonth(currentMonthKey())
  }

  return (
    <BudgetContext
      value={{
        data,
        viewedMonth,
        setViewedMonth,
        pendingNewMonth,
        promptMonth: setPendingNewMonth,
        confirmNewMonth,
        dismissNewMonth: () => setPendingNewMonth(null),
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        setIncome,
        currency: data.currency,
        setCurrency,
        loadSeedData,
      }}
    >
      {children}
    </BudgetContext>
  )
}

export function useBudget() {
  const context = useContext(BudgetContext)
  if (!context) throw new Error("useBudget must be used within BudgetProvider")
  return context
}
