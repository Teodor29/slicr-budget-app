import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { AppData, Category, Month, Transaction } from "../types";
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
  pendingNewMonth: string | null;
  promptMonth: (key: string) => void;
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

function buildMonth(template: AppData["template"]): Month {
  return {
    income: template.income,
    categories: template.categories.map((c) => ({ ...c })),
    transactions: [],
  };
}

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    const loaded = loadData() ?? createInitialData();
    if (!loaded.template.categories.some((c) => c.id === "other")) {
      const other = { id: "other", name: "Other", budget: 0 };
      loaded.template.categories.push(other);
      for (const key in loaded.months) loaded.months[key].categories.push(other);
      saveData(loaded);
    }
    return loaded;
  });
  const [viewedMonth, setViewedMonth] = useState(
    () => (loadData() ?? createInitialData()).currentMonth,
  );
  const [pendingNewMonth, setPendingNewMonth] = useState<string | null>(null);

  useEffect(() => {
    const real = getCurrentMonthKey();
    if (real !== data.currentMonth) setPendingNewMonth(real);
  }, [data.currentMonth]);

  function save(next: AppData) {
    setData(next);
    saveData(next);
  }

  function updateViewedTransactions(fn: (txs: Transaction[]) => Transaction[]) {
    const month = data.months[viewedMonth];
    if (!month) return;
    save({
      ...data,
      months: {
        ...data.months,
        [viewedMonth]: { ...month, transactions: fn(month.transactions) },
      },
    });
  }

  function confirmNewMonth() {
    if (!pendingNewMonth) return;
    const isRealCurrentMonth = pendingNewMonth === getCurrentMonthKey();
    const prevMonth = data.months[data.currentMonth];
    const recurringTxs = (prevMonth?.transactions ?? [])
      .filter((tx) => tx.recurring)
      .map((tx) => ({ ...tx, id: crypto.randomUUID(), date: pendingNewMonth + "-01" }));
    const newMonth = buildMonth(data.template);
    newMonth.transactions = recurringTxs;
    save({
      ...data,
      months: { ...data.months, [pendingNewMonth]: newMonth },
      ...(isRealCurrentMonth ? { currentMonth: pendingNewMonth } : {}),
    });
    setViewedMonth(pendingNewMonth);
    setPendingNewMonth(null);
  }

  function addTransaction(t: Omit<Transaction, "id">) {
    updateViewedTransactions((txs) => [...txs, { ...t, id: crypto.randomUUID() }]);
  }

  function updateTransaction(t: Transaction) {
    updateViewedTransactions((txs) => txs.map((tx) => (tx.id === t.id ? t : tx)));
  }

  function deleteTransaction(id: string) {
    updateViewedTransactions((txs) => txs.filter((tx) => tx.id !== id));
  }

  function addCategory(cat: Omit<Category, "id">) {
    const newCat = { ...cat, id: crypto.randomUUID() };
    const curMonth = data.months[viewedMonth];
    save({
      ...data,
      template: { ...data.template, categories: [...data.template.categories, newCat] },
      months: curMonth
        ? { ...data.months, [viewedMonth]: { ...curMonth, categories: [...curMonth.categories, newCat] } }
        : data.months,
    });
  }

  function updateCategory(cat: Category) {
    const curMonth = data.months[viewedMonth];
    save({
      ...data,
      template: {
        ...data.template,
        categories: data.template.categories.map((c) => (c.id === cat.id ? cat : c)),
      },
      months: curMonth
        ? {
            ...data.months,
            [viewedMonth]: {
              ...curMonth,
              categories: curMonth.categories.map((c) => (c.id === cat.id ? cat : c)),
            },
          }
        : data.months,
    });
  }

  function deleteCategory(id: string) {
    if (id === "other") return;
    const curMonth = data.months[viewedMonth];
    save({
      ...data,
      template: {
        ...data.template,
        categories: data.template.categories.filter((c) => c.id !== id),
      },
      months: curMonth
        ? {
            ...data.months,
            [viewedMonth]: {
              ...curMonth,
              categories: curMonth.categories.filter((c) => c.id !== id),
              transactions: curMonth.transactions.map((t) =>
                t.categoryId === id ? { ...t, categoryId: null } : t,
              ),
            },
          }
        : data.months,
    });
  }

  function setIncome(amount: number) {
    const curMonth = data.months[viewedMonth];
    save({
      ...data,
      template: { ...data.template, income: amount },
      months: curMonth
        ? { ...data.months, [viewedMonth]: { ...curMonth, income: amount } }
        : data.months,
    });
  }

  return (
    <BudgetContext.Provider
      value={{
        data,
        viewedMonth,
        setViewedMonth,
        pendingNewMonth,
        promptMonth: setPendingNewMonth,
        confirmNewMonth,
        dismissNewMonth: () => setPendingNewMonth(null),
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
