"use client";
import { useEffect, useState } from "react";

interface Expense {
  name: string;
  amount: number;
  dueDay: number;
  paid: 0 | 1;
}

async function fetchExpenses(api: string): Promise<Expense[]> {
  const res = await fetch(api);
  return res.json();
}

async function updateExpenses(api: string, data: Expense[]) {
  await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

function ExpensesTable({ title, api }: { title: string; api: string }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses(api).then((data) => {
      setExpenses(data);
      setLoading(false);
    });
  }, [api]);

  const handleChange = (
    idx: number,
    key: keyof Expense,
    value: string | number | 0 | 1
  ) => {
    const updated = expenses.map((e, i) =>
      i === idx ? { ...e, [key]: value } : e
    );
    setExpenses(updated);
    updateExpenses(api, updated);
  };

  const handleAdd = () => {
    const updated = [
      ...expenses,
      { name: "", amount: 0, dueDay: 1, paid: 0 as const },
    ];
    setExpenses(updated);
    updateExpenses(api, updated);
  };

  const handleDelete = (idx: number) => {
    const updated = expenses.filter((_, i) => i !== idx);
    setExpenses(updated);
    updateExpenses(api, updated);
  };

  if (loading) return <div>Loading {title}...</div>;

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow p-2 sm:p-6 mb-8">
      <h2 className="text-lg sm:text-xl font-bold mb-4">{title}</h2>
      {/* Desktop Table */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <table className="min-w-[500px] w-full border-collapse mb-4 text-xs sm:text-base">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2">NAME</th>
              <th className="p-2">AMOUNT</th>
              <th className="p-2">DUE DAY</th>
              <th className="p-2">PAID</th>
              <th className="p-2">DELETE</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="p-2">
                  <input
                    className="bg-transparent border-b border-gray-300 focus:outline-none w-full py-1 px-2 rounded text-xs sm:text-base"
                    value={e.name}
                    onChange={(ev) =>
                      handleChange(idx, "name", ev.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="bg-transparent border-b border-gray-300 focus:outline-none w-20 py-1 px-2 rounded text-xs sm:text-base"
                    value={e.amount}
                    onChange={(ev) =>
                      handleChange(idx, "amount", Number(ev.target.value))
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="bg-transparent border-b border-gray-300 focus:outline-none w-16 py-1 px-2 rounded text-xs sm:text-base"
                    value={e.dueDay}
                    onChange={(ev) =>
                      handleChange(idx, "dueDay", Number(ev.target.value))
                    }
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={!!e.paid}
                    onChange={() => handleChange(idx, "paid", e.paid ? 0 : 1)}
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    className="text-red-500 hover:text-red-700 font-bold text-lg sm:text-xl"
                    onClick={() => handleDelete(idx)}
                    title="Delete row"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="sm:hidden flex flex-col gap-4 mb-4">
        {expenses.map((e, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-sm bg-gray-50 dark:bg-gray-800"
          >
            <div className="mb-2">
              <label className="block text-xs font-semibold mb-1">Name</label>
              <input
                className="bg-white dark:bg-gray-900 border-b border-gray-300 focus:outline-none w-full py-1 px-2 rounded text-base"
                value={e.name}
                onChange={(ev) => handleChange(idx, "name", ev.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-semibold mb-1">Amount</label>
              <input
                type="number"
                className="bg-white dark:bg-gray-900 border-b border-gray-300 focus:outline-none w-full py-1 px-2 rounded text-base"
                value={e.amount}
                onChange={(ev) =>
                  handleChange(idx, "amount", Number(ev.target.value))
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-semibold mb-1">
                Due Day
              </label>
              <input
                type="number"
                className="bg-white dark:bg-gray-900 border-b border-gray-300 focus:outline-none w-full py-1 px-2 rounded text-base"
                value={e.dueDay}
                onChange={(ev) =>
                  handleChange(idx, "dueDay", Number(ev.target.value))
                }
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={!!e.paid}
                  onChange={() => handleChange(idx, "paid", e.paid ? 0 : 1)}
                />
                Paid
              </label>
              <button
                className="text-red-500 hover:text-red-700 font-bold text-xl"
                onClick={() => handleDelete(idx)}
                title="Delete row"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full sm:w-auto text-sm sm:text-base"
        onClick={handleAdd}
      >
        + Add Row
      </button>
    </div>
  );
}

export default function Home() {
  const [currentTotals, setCurrentTotals] = useState({ paid: 0, unpaid: 0 });
  const [eliteTotals, setEliteTotals] = useState({ paid: 0, unpaid: 0 });

  // Helper to fetch and sum totals for a given API
  async function fetchTotals(api: string) {
    const res = await fetch(api);
    const data: Expense[] = await res.json();
    const paid = data
      .filter((e) => e.paid)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const unpaid = data
      .filter((e) => !e.paid)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return { paid, unpaid };
  }

  useEffect(() => {
    async function updateAllTotals() {
      setCurrentTotals(await fetchTotals("/api/current-expenses"));
      setEliteTotals(await fetchTotals("/api/elite-expenses"));
    }
    updateAllTotals();
    // Listen for changes in the page (naive: refetch every 1s)
    const interval = setInterval(updateAllTotals, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center p-2 sm:p-8 pb-24">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 mt-4 text-center">
        Budgeting Sheet
      </h1>
      <ExpensesTable title="Current Expenses" api="/api/current-expenses" />
      <ExpensesTable title="Elite Expenses" api="/api/elite-expenses" />
      {/* Sticky Totals Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-700 shadow-lg flex flex-row justify-between items-center py-3 px-4 text-base sm:text-lg font-semibold">
        <div>
          <span>
            Current Unpaid:{" "}
            <span className="text-red-600">${currentTotals.unpaid}</span>
          </span>
        </div>
        <div>
          <span>
            Elite Unpaid:{" "}
            <span className="text-red-600">${eliteTotals.unpaid}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
