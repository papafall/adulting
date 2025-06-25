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

  const totalPaid = expenses
    .filter((e) => e.paid)
    .reduce((sum, e) => sum + e.amount, 0);
  const totalUnpaid = expenses
    .filter((e) => !e.paid)
    .reduce((sum, e) => sum + e.amount, 0);

  if (loading) return <div>Loading {title}...</div>;

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <table className="w-full border-collapse mb-4">
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
                  className="bg-transparent border-b border-gray-300 focus:outline-none w-full"
                  value={e.name}
                  onChange={(ev) => handleChange(idx, "name", ev.target.value)}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  className="bg-transparent border-b border-gray-300 focus:outline-none w-20"
                  value={e.amount}
                  onChange={(ev) =>
                    handleChange(idx, "amount", Number(ev.target.value))
                  }
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  className="bg-transparent border-b border-gray-300 focus:outline-none w-16"
                  value={e.dueDay}
                  onChange={(ev) =>
                    handleChange(idx, "dueDay", Number(ev.target.value))
                  }
                />
              </td>
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={!!e.paid}
                  onChange={() => handleChange(idx, "paid", e.paid ? 0 : 1)}
                />
              </td>
              <td className="p-2 text-center">
                <button
                  className="text-red-500 hover:text-red-700 font-bold"
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
      <div className="flex justify-between text-sm font-semibold mb-2">
        <span>
          Total Paid: <span className="text-green-600">${totalPaid}</span>
        </span>
        <span>
          Total Unpaid: <span className="text-red-600">${totalUnpaid}</span>
        </span>
      </div>
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={handleAdd}
      >
        + Add Row
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-8 mt-4">Budgeting Sheet</h1>
      <ExpensesTable title="Current Expenses" api="/api/current-expenses" />
      <ExpensesTable title="Elite Expenses" api="/api/elite-expenses" />
    </div>
  );
}
