import type { AppData, Transaction } from "../types"
import { currentMonthKey } from "./date"

export function createSeedData(): AppData {
  const month = currentMonthKey()

  function transaction(
    categoryId: string,
    amount: number,
    description: string,
    day: number,
    recurring = false,
  ): Transaction {
    return {
      id: crypto.randomUUID(),
      categoryId,
      amount,
      description,
      date: `${month}-${String(day).padStart(2, "0")}`,
      recurring,
    }
  }

  const categories = [
    { id: "housing", name: "Housing", budget: 12000 },
    { id: "food", name: "Food", budget: 4000 },
    { id: "transport", name: "Transport", budget: 1800 },
    { id: "entertainment", name: "Entertainment", budget: 1500 },
    { id: "savings", name: "Savings", budget: 5000 },
    { id: "other", name: "Other", budget: 1000 },
  ]

  const transactions = [
    transaction("other", 450, "", 1),
    transaction("housing", 9500, "Rent", 1, true),
    transaction("savings", 5000, "", 1, true),
    transaction("transport", 890, "", 2, true),
    transaction("food", 850, "Groceries", 5),
    transaction("entertainment", 260, "Streaming", 8, true),
    transaction("food", 340, "Restaurant", 12),
  ]

  return {
    template: { income: 35000, categories },
    months: { [month]: { income: 35000, categories, transactions } },
    currency: "kr",
  }
}
