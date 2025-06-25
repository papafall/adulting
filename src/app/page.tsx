"use client";
import { useEffect, useState } from "react";

interface Expense {
  name: string;
  amount: number;
  dueDay: number;
  paid: 0 | 1;
}

async function updateExpenses(api: string, data: Expense[]) {
  await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ToggleSwitch component
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        checked ? "bg-green-500" : "bg-gray-300"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
      <span className="sr-only">Toggle Paid</span>
    </button>
  );
}

function ExpensesTable({
  title,
  api,
  expenses,
  setExpenses,
}: {
  title: string;
  api: string;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}) {
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
                  <ToggleSwitch
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
                <ToggleSwitch
                  checked={!!e.paid}
                  onChange={() => handleChange(idx, "paid", e.paid ? 0 : 1)}
                />
                <span>{e.paid ? "Paid" : "Unpaid"}</span>
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
  const [currentExpenses, setCurrentExpenses] = useState<Expense[]>([]);
  const [eliteExpenses, setEliteExpenses] = useState<Expense[]>([]);

  // Fetch initial data on mount
  useEffect(() => {
    fetch("/api/current-expenses")
      .then((res) => res.json())
      .then(setCurrentExpenses);
    fetch("/api/elite-expenses")
      .then((res) => res.json())
      .then(setEliteExpenses);
  }, []);

  // Calculate totals instantly from local state
  const currentUnpaid = currentExpenses
    .filter((e) => !e.paid)
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const eliteUnpaid = eliteExpenses
    .filter((e) => !e.paid)
    .reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center p-2 sm:p-8 pb-24">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 mt-4 text-center">
        Budgeting Sheet
      </h1>
      <ExpensesTable
        title="Current Expenses"
        api="/api/current-expenses"
        expenses={currentExpenses}
        setExpenses={setCurrentExpenses}
      />
      <ExpensesTable
        title="Elite Expenses"
        api="/api/elite-expenses"
        expenses={eliteExpenses}
        setExpenses={setEliteExpenses}
      />
      {/* Sticky Totals Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-700 shadow-lg flex flex-col sm:flex-row justify-between items-center py-3 px-4 text-base sm:text-lg font-semibold">
        <div className="self-start sm:self-auto w-full sm:w-auto flex justify-start">
          <span>
            Current Unpaid:{" "}
            <span className="text-red-600">${currentUnpaid}</span>
          </span>
        </div>
        <div className="self-end sm:self-auto w-full sm:w-auto flex justify-end">
          <span>
            Elite Unpaid: <span className="text-red-600">${eliteUnpaid}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
