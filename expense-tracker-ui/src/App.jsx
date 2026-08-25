import { useEffect, useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  // Restore logged-in user after refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setPage("login");
  };

  if (user) {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return page === "login" ? (
    <Login
      onLogin={handleLogin}
      goToSignup={() => setPage("signup")}
    />
  ) : (
    <Signup
      goToLogin={() => setPage("login")}
    />
  );
}

export default App;