import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const API = "https://heroic-laughter-production-5139.up.railway.app/api/Expenses";

function Dashboard({ user, onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  // GET USER EXPENSES
  const getExpenses = async () => {
    const res = await axios.get(`${API}/${user.id}`);
    setExpenses(res.data);
  };

  useEffect(() => {
    getExpenses();
  }, [user.id]);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ADD OR UPDATE
  const saveExpense = async (e) => {
    e.preventDefault();

    if (editingId === null) {
      await axios.post(API, {
        userId: user.id,
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
      });
    } else {
      await axios.put(`${API}/${editingId}`, {
        id: editingId,
        userId: user.id,
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
      });
    }

    // CLEAR FORM
    setForm({
      title: "",
      amount: "",
      category: "",
      date: "",
    });

    setEditingId(null);
    getExpenses();
  };

  // EDIT
  const editExpense = (expense) => {
    setEditingId(expense.id);

    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.substring(0, 10),
    });
  };

  // DELETE
  const deleteExpense = async (id) => {
    await axios.delete(`${API}/${id}`);
    getExpenses();
  };

  // MONTH FILTER
  const filteredExpenses = selectedMonth
    ? expenses.filter((e) => e.date.startsWith(selectedMonth))
    : expenses;

  // TOTAL
  const totalExpense = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  // CATEGORY TOTALS
  const foodTotal = filteredExpenses
    .filter((e) => e.category?.toLowerCase() === "food")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const travelTotal = filteredExpenses
    .filter((e) => e.category?.toLowerCase() === "travel")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const shoppingTotal = filteredExpenses
    .filter((e) => e.category?.toLowerCase() === "shopping")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const otherTotal = filteredExpenses
    .filter(
      (e) =>
        !["food", "travel", "shopping"].includes(
          e.category?.toLowerCase()
        )
    )
    .reduce((sum, e) => sum + Number(e.amount), 0);

  // PIE CHART
  const pieData = {
    labels: ["Food", "Travel", "Shopping", "Others"],
    datasets: [
      {
        data: [foodTotal, travelTotal, shoppingTotal, otherTotal],
        backgroundColor: [
          "#22C55E",
          "#3B82F6",
          "#A855F7",
          "#F97316",
        ],
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <h1>💰 Expense Tracker</h1>
        <p>Login to your account</p>
        <p>Welcome, {user.name}</p>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* TOTAL */}
      <div className="card">
        <h3>Total Expenses</h3>
        <h1>₹ {totalExpense}</h1>
      </div>

      {/* MONTH FILTER */}
      <div className="filter-card">
        <h3>📅 Filter by Month</h3>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

        {selectedMonth && (
          <button
            type="button"
            className="clear-btn"
            onClick={() => setSelectedMonth("")}
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* SUMMARY */}
      <div className="summary-grid">
        <div className="summary-card food">
          <h3>🍔 Food</h3>
          <h2>₹{foodTotal}</h2>
        </div>

        <div className="summary-card travel">
          <h3>✈️ Travel</h3>
          <h2>₹{travelTotal}</h2>
        </div>

        <div className="summary-card shopping">
          <h3>🛍 Shopping</h3>
          <h2>₹{shoppingTotal}</h2>
        </div>

        <div className="summary-card other">
          <h3>📦 Others</h3>
          <h2>₹{otherTotal}</h2>
        </div>
      </div>

      {/* PIE CHART */}
      <div className="card">
        <h3>📊 Expense Distribution</h3>

        <div className="chart-container">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      {/* FORM */}
      <form className="expense-form" onSubmit={saveExpense}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId === null ? "Add Expense" : "Update Expense"}
        </button>
      </form>

      {/* TABLE */}
      <table className="expense-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredExpenses.map((e) => (
            <tr key={e.id}>
              <td>{e.title}</td>
              <td>₹{e.amount}</td>
              <td>{e.category}</td>
              <td>{new Date(e.date).toLocaleDateString("en-GB")}</td>

              <td>
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => editExpense(e)}
                >
                  ✏ Edit
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => deleteExpense(e.id)}
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;