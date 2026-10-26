import type { AppData, Transaction } from "../types"
import { currentMonthKey } from "./date"

export function createSeedData(): AppData {
  const month = currentMonthKey()
  const today = new Date().getDate()

  function transaction(
    categoryId: string,
    amount: number,
    description: string,
    day: number,
    recurring = false,
  ): Transaction {
    const date = Math.min(day, today)

    return {
      id: crypto.randomUUID(),
      categoryId,
      amount,
      description,
      date: `${month}-${String(date).padStart(2, "0")}`,
      recurring,
    }
  }

  const categories = [
    { id: "housing", name: "Housing", budget: 10000 },
    { id: "food", name: "Food", budget: 4000 },
    { id: "transport", name: "Transport", budget: 2000 },
    { id: "subscriptions", name: "Subscriptions", budget: 500 },
    { id: "savings", name: "Savings", budget: 5000 },
    { id: "other", name: "Other", budget: 1000 },
  ]

  const transactions = [
    transaction("housing", 9000, "Rent", 1, true),
    transaction("savings", 5000, "", 1, true),
    transaction("transport", 1000, "Gas", 1, true),
    transaction("subscriptions", 200, "Streaming", 1, true),
    transaction("food", 700, "Groceries", 6),
    transaction("food", 400, "Restaurant", 12),
    transaction("other", 500, "Haircut", 15),
    transaction("food", 600, "Groceries", 18),
    transaction("food", 600, "Groceries", 25),
  ]

  return {
    template: { income: 30000, categories },
    months: { [month]: { income: 30000, categories, transactions } },
    currency: "kr",
    isDemo: true,
  }
}
