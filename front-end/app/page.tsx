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

        setError(res?.error || "Registration  Failed");
      } else {
        router.push("/profile");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">

      {/* Card */}
      <div className="border-2 border-black p-6 rounded-md bg-white w-80">

        <h1 className="text-xl font-semibold mb-4 text-center">
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">

          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white p-2 rounded hover:opacity-80"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm mt-3 text-center">
          Don't have an account?{" "}
          <button className="hover:underline" onClick={() => router.push("/signup")}>Sign up</button>
        </p>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">
            <span>Error: {error}</span>
          </p>
        )}
      </div>
    </div>
  );
}
