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
  addCategory: (cat: Omit<Category, "id">) => void;
  updateCategory: (cat: Category) => void;
  deleteCategory: (id: string) => void;
  setIncome: (amount: number) => void;
}

const BudgetContext = createContext<BudgetCtx | null>(null);

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
  }, []);

  const update = useCallback((next: AppData) => {
    setData(next);
    saveData(next);
  }, []);

  const confirmNewMonth = useCallback(() => {
    if (!pendingNewMonth) return;
    const next: AppData = {
      ...data,
      months: {
        ...data.months,
        [pendingNewMonth]: {
          income: data.template.income,
          categories: data.template.categories.map((c) => ({ ...c })),
          transactions: [],
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
      const next: AppData = {
        ...data,
        months: {
          ...data.months,
          [monthKey]: {
            income: data.template.income,
            categories: data.template.categories.map((c) => ({ ...c })),
            transactions: [],
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
