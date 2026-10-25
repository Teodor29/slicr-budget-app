export interface Category {
  id: string
  name: string
  budget: number
}

export interface Transaction {
  id: string
  categoryId: string
  amount: number
  description: string
  date: string
  recurring?: boolean
}

export interface Template {
  income: number
  categories: Category[]
}

export interface Month extends Template {
  transactions: Transaction[]
}

export interface AppData {
  template: Template
  months: Record<string, Month>
  currency: string
}
