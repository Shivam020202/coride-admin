import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import "./LoginPage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Props {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/admin/login`, {
        username,
        password,
      });
      sessionStorage.setItem("adminAuth", "true");
      sessionStorage.setItem("adminToken", res.data.token);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.msg || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#0f172a" />
              <path d="M8 20V12a8 8 0 0 1 16 0v8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="16" cy="22" r="3" fill="#3b82f6" />
            </svg>
          </div>
          <h1>CoRide Admin</h1>
          <p>Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
