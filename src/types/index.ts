export interface Category {
  id: string;
  name: string;
  budget: number;
}

export interface Transaction {
  id: string;
  categoryId: string | null;
  amount: number;
  description: string;
  date: string;
}

export interface RecurringTransaction {
  id: string;
  categoryId: string | null;
  amount: number;
  description: string;
  dayOfMonth: number;
}

export interface Month {
  income: number;
  categories: Category[];
  transactions: Transaction[];
}

export interface Template {
  income: number;
  categories: Category[];
  recurringTransactions: RecurringTransaction[];
}

export interface AppData {
  template: Template;
  months: Record<string, Month>;
  currentMonth: string;
}
