"use client";

import { useState } from "react";
import { register } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password || !confirmPassword) return setError("Please fill all fields");
        if (password !== confirmPassword) return setError("Passwords do not match");

        try {
            setLoading(true);
            const res = await register(email, password);
            if (res.error) {
                setError(res.error);
            } else {
                router.push("/");
            }
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
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Create account</h1>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>Get started for free</p>
                </div>

                <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
                    <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />

                    {error && <p style={{ fontSize: 13, color: "var(--danger)", margin: 0 }}>{error}</p>}

                    <button type="submit" disabled={loading} style={btnPrimaryStyle(loading)}>
                        {loading ? "Creating account…" : "Create account"}
                    </button>
                </form>

                <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)", marginTop: 20 }}>
                    Already have an account?{" "}
                    <button
                        onClick={() => router.push("/")}
                        style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, padding: 0 }}
                    >
                        Sign in
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
    marginTop: 4,
});
