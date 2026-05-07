import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { AppData, Category, Transaction } from "../types";
import {
  loadData,
  saveData,
  getCurrentMonthKey,
  createInitialData,
} from "../lib/storage";
import type { RecurringTransaction } from "../types";

interface BudgetCtx {
  data: AppData;
  viewedMonth: string;
  setViewedMonth: (m: string) => void;
  ensureMonthExists: (monthKey: string) => void;
  pendingNewMonth: string | null;
  confirmNewMonth: () => void;
  dismissNewMonth: () => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addRecurringTransaction: (t: Omit<RecurringTransaction, "id">) => void;
  updateRecurringTransaction: (t: RecurringTransaction) => void;
  deleteRecurringTransaction: (id: string) => void;
  addCategory: (cat: Omit<Category, "id">) => void;
  updateCategory: (cat: Category) => void;
  deleteCategory: (id: string) => void;
  setIncome: (amount: number) => void;
}

const BudgetContext = createContext<BudgetCtx | null>(null);

function daysInMonth(monthKey: string) {
  const [y, m] = monthKey.split("-").map(Number);
  const year = y ?? new Date().getFullYear();
  const month = m ?? 1;
  return new Date(year, month, 0).getDate();
}

function dateForMonthDay(monthKey: string, dayOfMonth: number) {
  const max = daysInMonth(monthKey);
  const day = Math.min(Math.max(1, Math.floor(dayOfMonth)), max);
  return `${monthKey}-${String(day).padStart(2, "0")}`;
}

function materializeRecurring(monthKey: string, recurring: RecurringTransaction[]) {
  return recurring.map((rt) => ({
    id: crypto.randomUUID(),
    categoryId: rt.categoryId,
    amount: rt.amount,
    description: rt.description,
    date: dateForMonthDay(monthKey, rt.dayOfMonth),
  }));
}

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    const loaded = loadData() ?? createInitialData();
    // Migrate: ensure 'other' category exists
    const hasOther = loaded.template.categories.some((c) => c.id === "other");
    if (!hasOther) {
      const otherCat = { id: "other", name: "Other", budget: 0 };
      loaded.template.categories.push(otherCat);
      for (const monthKey in loaded.months) {
        loaded.months[monthKey].categories.push(otherCat);
      }
      saveData(loaded);
    }
    return loaded;
  });
  const [viewedMonth, setViewedMonth] = useState(
    () => (loadData() ?? createInitialData()).currentMonth,
  );
  const [pendingNewMonth, setPendingNewMonth] = useState<string | null>(null);

  useEffect(() => {
    const realMonth = getCurrentMonthKey();
    if (realMonth !== data.currentMonth) {
      setPendingNewMonth(realMonth);
    }
  }, [data.currentMonth]);

  const update = useCallback((next: AppData) => {
    setData(next);
    saveData(next);
  }, []);

  const confirmNewMonth = useCallback(() => {
    if (!pendingNewMonth) return;
    const recurring = data.template.recurringTransactions ?? [];
    const next: AppData = {
      ...data,
      months: {
        ...data.months,
        [pendingNewMonth]: {
          income: data.template.income,
          categories: data.template.categories.map((c) => ({ ...c })),
          transactions: materializeRecurring(pendingNewMonth, recurring),
        },
      },
      currentMonth: pendingNewMonth,
    };
    update(next);
    setViewedMonth(pendingNewMonth);
    setPendingNewMonth(null);
  }, [pendingNewMonth, data, update]);

  const dismissNewMonth = useCallback(() => {
    setPendingNewMonth(null);
  }, []);

  const ensureMonthExists = useCallback(
    (monthKey: string) => {
      if (data.months[monthKey]) return;
      const recurring = data.template.recurringTransactions ?? [];
      const next: AppData = {
        ...data,
        months: {
          ...data.months,
          [monthKey]: {
            income: data.template.income,
            categories: data.template.categories.map((c) => ({ ...c })),
            transactions: materializeRecurring(monthKey, recurring),
          },
        },
      };
      update(next);
    },
    [data, update],
  );

  const addTransaction = useCallback(
    (t: Omit<Transaction, "id">) => {
      const month = data.months[viewedMonth];
      if (!month) return;
      update({
        ...data,
        months: {
          ...data.months,
          [viewedMonth]: {
            ...month,
            transactions: [
              ...month.transactions,
              { ...t, id: crypto.randomUUID() },
            ],
          },
        },
      });
    },
    [data, viewedMonth, update],
  );

  const updateTransaction = useCallback(
    (t: Transaction) => {
      const month = data.months[viewedMonth];
      if (!month) return;
      update({
        ...data,
        months: {
          ...data.months,
          [viewedMonth]: {
            ...month,
            transactions: month.transactions.map((tx) =>
              tx.id === t.id ? t : tx,
            ),
          },
        },
      });
    },
    [data, viewedMonth, update],
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      const month = data.months[viewedMonth];
      if (!month) return;
      update({
        ...data,
        months: {
          ...data.months,
          [viewedMonth]: {
            ...month,
            transactions: month.transactions.filter((tx) => tx.id !== id),
          },
        },
      });
    },
    [data, viewedMonth, update],
  );

  const addRecurringTransaction = useCallback(
    (t: Omit<RecurringTransaction, "id">) => {
      const next: AppData = {
        ...data,
        template: {
          ...data.template,
          recurringTransactions: [
            ...(data.template.recurringTransactions ?? []),
            { ...t, id: crypto.randomUUID() },
          ],
        },
      };
      update(next);
    },
    [data, update],
  );

  const updateRecurringTransaction = useCallback(
    (t: RecurringTransaction) => {
      const next: AppData = {
        ...data,
        template: {
          ...data.template,
          recurringTransactions: (data.template.recurringTransactions ?? []).map(
            (rt) => (rt.id === t.id ? t : rt),
          ),
        },
      };
      update(next);
    },
    [data, update],
  );

  const deleteRecurringTransaction = useCallback(
    (id: string) => {
      const next: AppData = {
        ...data,
        template: {
          ...data.template,
          recurringTransactions: (data.template.recurringTransactions ?? []).filter(
            (rt) => rt.id !== id,
          ),
        },
      };
      update(next);
    },
    [data, update],
  );

  const addCategory = useCallback(
    (cat: Omit<Category, "id">) => {
      const newCat = { ...cat, id: crypto.randomUUID() };
      const curMonth = data.months[data.currentMonth];
      update({
        ...data,
        template: {
          ...data.template,
          categories: [...data.template.categories, newCat],
        },
        months: curMonth
          ? {
              ...data.months,
              [data.currentMonth]: {
                ...curMonth,
                categories: [...curMonth.categories, newCat],
              },
            }
          : data.months,
      });
    },
    [data, update],
  );

  const updateCategory = useCallback(
    (cat: Category) => {
      const curMonth = data.months[data.currentMonth];
      update({
        ...data,
        template: {
          ...data.template,
          categories: data.template.categories.map((c) =>
            c.id === cat.id ? cat : c,
          ),
        },
        months: curMonth
          ? {
              ...data.months,
              [data.currentMonth]: {
                ...curMonth,
                categories: curMonth.categories.map((c) =>
                  c.id === cat.id ? cat : c,
                ),
              },
            }
          : data.months,
      });
    },
    [data, update],
  );

  const deleteCategory = useCallback(
    (id: string) => {
      if (id === "other") return; // Cannot delete the default 'other' category
      const curMonth = data.months[data.currentMonth];
      update({
        ...data,
        template: {
          ...data.template,
          categories: data.template.categories.filter((c) => c.id !== id),
        },
        months: curMonth
          ? {
              ...data.months,
              [data.currentMonth]: {
                ...curMonth,
                categories: curMonth.categories.filter((c) => c.id !== id),
                transactions: curMonth.transactions.map((t) =>
                  t.categoryId === id ? { ...t, categoryId: null } : t,
                ),
              },
            }
          : data.months,
      });
    },
    [data, update],
  );

  const setIncome = useCallback(
    (amount: number) => {
      const curMonth = data.months[data.currentMonth];
      update({
        ...data,
        template: { ...data.template, income: amount },
        months: curMonth
          ? {
              ...data.months,
              [data.currentMonth]: { ...curMonth, income: amount },
            }
          : data.months,
      });
    },
    [data, update],
  );

  return (
    <BudgetContext.Provider
      value={{
        data,
        viewedMonth,
        setViewedMonth,
        ensureMonthExists,
        pendingNewMonth,
        confirmNewMonth,
        dismissNewMonth,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addRecurringTransaction,
        updateRecurringTransaction,
        deleteRecurringTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        setIncome,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error("useBudget must be used within BudgetProvider");
  return ctx;
}
