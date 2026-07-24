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

        if (!email || !password || !confirmPassword) {
            return setError("Please fill all fields");
        }

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {

            setLoading(true);

            const res = await register(email, password);

            if (res.error) {
                setError(res.error);
            } else {
                alert("Registration successful! Please log in.");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                router.push("/");

            }

        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex  items-center justify-center  bg-gray-200">

            <div className="border-2 border-black p-6 rounded-md bg-white w-80">
                <h1 className="text-xl font-semibold mb-4 text-center">
                    Sign Up
                </h1>

                <form onSubmit={handleSignUp} className="flex flex-col gap-3">

                    <input

                        className="border p-2 rounded w-full"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="border p-2 rounded w-full"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className="border p-2 rounded w-full"
                        placeholder="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                {error && (
                    <p className="text-red-500 text-sm mt-3 text-center">
                        {error}
                    </p>
                )}

                <p className =  "text-center mt-3 text-sm">
                    Already have an account?{" "}
                    <button className = "hover:underline" onClick ={ ()=> router.push("/")} >Log In</button>
                </p>
            </div>
        </div>
    );
}
