import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5052/api/Auth/register";

function Signup({ goToLogin }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API, user);
      alert("Registration Successful");
      goToLogin();
    } catch (err) {
      alert(err.response?.data || "Registration Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>📝 Sign Up</h1>
        <p>Create your account</p>

        <form onSubmit={register}>
          <input
            name="name"
            placeholder="Full Name"
            value={user.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Create Account</button>
        </form>

        <p style={{ marginTop: "20px" }}>
          Already have an account?{" "}
          <span className="link" onClick={goToLogin}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;