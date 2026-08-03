"use client";

import { useEffect, useState } from "react";
import { getProfile, logout } from "../../lib/api";
import { useRouter } from "next/navigation";

import AddTaskModal from "../components/addTaskModal";
import TodayTasks from "../components/home/TodayTasks";
import WeekTasks from "../components/home/WeekTasks";
import MonthlyTasks from "../components/home/MonthlyTasks";
import YearlyTasks from "../components/home/YearlyTasks";
import AllTasks from "../components/home/AllTasks";

const TABS = ["Today", "Weekly", "Monthly", "Yearly", "All"];

export default function Profile() {
    const [data, setData] = useState<any>(null);
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("Today");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile();
                if (res.error) router.push("/");
                else setData(res);
            } catch {
                router.push("/");
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const initials = data?.email?.[0]?.toUpperCase() ?? "?";

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

            {/* ── Navbar ─────────────────────────────────── */}
            <nav style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid var(--border)",
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 28px",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                        width: 28, height: 28,
                        background: "var(--accent)",
                        borderRadius: 7,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                        </svg>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", letterSpacing: "-0.2px" }}>
                        Taskly
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            fontSize: 13, fontWeight: 500,
                            color: "var(--text-secondary)",
                            background: "none", border: "none", cursor: "pointer", padding: "4px 8px",
                            borderRadius: 6,
                        }}
                    >
                        Sign out
                    </button>
                    <div style={{
                        width: 32, height: 32,
                        background: "var(--accent)",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontWeight: 700, fontSize: 14,
                        cursor: "default",
                    }}>
                        {initials}
                    </div>
                </div>
            </nav>

            {/* ── Page body ──────────────────────────────── */}
            <main style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px" }}>

                {/* Welcome */}
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                        Good {greeting()} 👋
                    </h1>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
                        {data?.email}
                    </p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    background: "var(--surface)",
                    padding: "5px 6px",
                    borderRadius: 12,
                    boxShadow: "var(--shadow)",
                    marginBottom: 20,
                    border: "1px solid var(--border)",
                }}>
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: "6px 16px",
                                fontSize: 13,
                                fontWeight: 500,
                                borderRadius: 8,
                                border: "none",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                background: activeTab === tab ? "var(--accent)" : "transparent",
                                color: activeTab === tab ? "white" : "var(--text-secondary)",
                                boxShadow: activeTab === tab ? "0 1px 6px rgba(0,113,227,0.3)" : "none",
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Task panel */}
                {activeTab === "Today" && <TodayTasks />}
                {activeTab === "Weekly" && <WeekTasks />}
                {activeTab === "Monthly" && <MonthlyTasks />}
                {activeTab === "Yearly" && <YearlyTasks />}
                {activeTab === "All" && <AllTasks />}
            </main>

            {/* ── Floating Add button ────────────────────── */}
            <button
                onClick={() => setShowModal(true)}
                style={{
                    position: "fixed",
                    bottom: 28,
                    right: 28,
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "white",
                    border: "none",
                    fontSize: 26,
                    lineHeight: 1,
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    zIndex: 40,
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)";
                }}
            >
                +
            </button>

            {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}
        </div>
    );
}

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return "morning";
    if (h < 18) return "afternoon";
    return "evening";
}
