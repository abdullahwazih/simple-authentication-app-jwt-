"use client";

import { useState } from "react";
import { login } from "../lib/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (!res || res.error) {
        setError(res?.error || "Login failed");
      } else {
        router.push("/profile");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow-lg)",
          padding: "40px 36px",
          width: "100%",
          maxWidth: "380px",
        }}
      >
        {/* Logo mark */}
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "var(--accent)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          {error && (
            <p style={{ fontSize: 13, color: "var(--danger)", margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={btnPrimaryStyle(loading)}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)", marginTop: 20 }}>
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, padding: 0 }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  outline: "none",
  background: "#fafafa",
  color: "var(--text-primary)",
  transition: "border-color var(--transition)",
};

const btnPrimaryStyle = (disabled: boolean): React.CSSProperties => ({
  padding: "11px",
  fontSize: 14,
  fontWeight: 600,
  background: disabled ? "#a0c4f1" : "var(--accent)",
  color: "white",
  border: "none",
  borderRadius: "var(--radius-sm)",
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "background var(--transition)",
  marginTop: 4,
});
