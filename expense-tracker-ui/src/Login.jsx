import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5052/api/Auth/login";

function Login({ onLogin, goToSignup }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 const login = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(API, form);
    onLogin(res.data);
  } catch {
    alert("Invalid Email or Password");
  }
};
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>💰 Expense Tracker</h1>
        <p>Login to your account</p>

        <form onSubmit={login}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p style={{ marginTop: "20px" }}>
          Don't have an account?{" "}
          <span className="link" onClick={goToSignup}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;