import type { AppData } from '../types'

const STORAGE_KEY = 'budget_app'

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

export function getCurrentMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function createInitialData(): AppData {
  const currentMonth = getCurrentMonthKey()
  return {
    template: {
      income: 0,
      categories: [{ id: 'other', name: 'Other', budget: 0 }],
    },
    months: {
      [currentMonth]: {
        income: 0,
        categories: [{ id: 'other', name: 'Other', budget: 0 }],
        transactions: [],
      },
    },
    currentMonth,
    currency: 'kr',
  }
}

export function createSeedData(): AppData {
  const currentMonth = getCurrentMonthKey()
  const [year, month] = currentMonth.split('-').map(Number)
  const d = (day: number) =>
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const categories = [
    { id: 'housing', name: 'Housing', budget: 12000 },
    { id: 'food', name: 'Food', budget: 4000 },
    { id: 'transport', name: 'Transport', budget: 1800 },
    { id: 'entertainment', name: 'Entertainment', budget: 1500 },
    { id: 'savings', name: 'Savings', budget: 5000 },
    { id: 'other', name: 'Other', budget: 1000 },
  ]

  const transactions = [
    { id: 't1', categoryId: 'other', amount: 450, description: '', date: d(1) },
    {
      id: 't2',
      categoryId: 'housing',
      amount: 9500,
      description: 'Rent',
      date: d(1),
      recurring: true,
    },
    {
      id: 't3',
      categoryId: 'savings',
      amount: 5000,
      description: '',
      date: d(1),
      recurring: true,
    },
    {
      id: 't4',
      categoryId: 'transport',
      amount: 890,
      description: '',
      date: d(2),
      recurring: true,
    },
    {
      id: 't5',
      categoryId: 'food',
      amount: 850,
      description: 'Groceries',
      date: d(5),
    },
    {
      id: 't6',
      categoryId: 'entertainment',
      amount: 260,
      description: 'Streaming',
      date: d(8),
      recurring: true,
    },
    {
      id: 't7',
      categoryId: 'food',
      amount: 340,
      description: 'Restaurant',
      date: d(12),
    },
  ]

  return {
    template: { income: 35000, categories },
    months: {
      [currentMonth]: { income: 35000, categories, transactions },
    },
    currentMonth,
    currency: 'kr',
  }
}
