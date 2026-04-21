import type { AppData } from '../types';

const STORAGE_KEY = 'budget_app';

export function loadData(): AppData | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AppData;
  } catch {
    return null;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function createInitialData(): AppData {
  const currentMonth = getCurrentMonthKey();
  return {
    template: { income: 0, categories: [] },
    months: {
      [currentMonth]: { income: 0, categories: [], transactions: [] },
    },
    currentMonth,
  };
}
