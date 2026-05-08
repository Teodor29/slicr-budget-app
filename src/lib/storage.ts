import type { AppData } from "../types";

const STORAGE_KEY = "budget_app";

export function loadData(): AppData | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as AppData;
    for (const monthKey in data.months) {
      if (data.months[monthKey].income === undefined) {
        data.months[monthKey].income = data.template?.income ?? 0;
      }
    }
    if (data.template?.income === undefined) {
      data.template.income = 0;
    }
    return data;
  } catch {
    return null;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function createInitialData(): AppData {
  const currentMonth = getCurrentMonthKey();
  return {
    template: {
      income: 0,
      categories: [{ id: "other", name: "Other", budget: 0 }],
    },
    months: {
      [currentMonth]: {
        income: 0,
        categories: [{ id: "other", name: "Other", budget: 0 }],
        transactions: [],
      },
    },
    currentMonth,
  };
}
