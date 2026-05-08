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

export interface Month {
  income: number;
  categories: Category[];
  transactions: Transaction[];
}

export interface Template {
  income: number;
  categories: Category[];
}

export interface AppData {
  template: Template;
  months: Record<string, Month>;
  currentMonth: string;
}
