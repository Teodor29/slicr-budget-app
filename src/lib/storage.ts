import type { AppData } from "../types"
import { currentMonthKey } from "./date"

const STORAGE_KEY = "budget_app"

export function loadData(): AppData | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AppData
  } catch {
    return null
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function createInitialData(): AppData {
  const template = {
    income: 0,
    categories: [{ id: "other", name: "Other", budget: 0 }],
  }
  return {
    template,
    months: { [currentMonthKey()]: { ...template, transactions: [] } },
    currency: "kr",
  }
}
