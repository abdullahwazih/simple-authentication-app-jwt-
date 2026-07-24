"use client";

import { useEffect, useState } from "react";
import { getProfile, logout } from "../../lib/api";
import { useRouter } from "next/navigation";

import AddTaskModal from "../components/addTaskModal";
import  TodayTasks  from "../components/home/TodayTasks";

export default function Profile() {

    const [data, setData] = useState<any>(null);
    const router = useRouter();

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile();

                if (res.error) {
                    router.push("/");
                } else {
                    setData(res);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                router.push("/");
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <div className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6">
                <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-600 hidden sm:block">
                        {/* {data?.email} */}
                    </p>

                    <button className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                        {data?.email?.[0]?.toUpperCase()}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto mt-10 px-4">

                {/* Welcome Card */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Welcome back 👋
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {data?.email}
                    </p>
                </div>

                {/* Tabs */}


                <div className="flex flex-wrap gap-3 mb-6">
                    {["Today", "Weekly", "Monthly", "Yearly"].map((item) => (
                        <button
                            key={item}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-blue-500 hover:text-white transition"
                        >
                            {item}
                        </button>
                    ))}
                </div>



                {/* Example Content Box */}
                <div className="bg-white rounded-xl shadow p-6">
                    <TodayTasks />
                </div>

                {/* Logout */}
                <div className="mt-6 text-right">
                    <button
                        onClick={handleLogout}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Logout
                    </button>
                </div>
                <div>
                    <button
                        className="bg-blue-500 hover:bg-red-500 text-white px-3 py-1 rounded-full transition"
                        onClick={() => setShowModal(true)}>
                        +
                    </button>
                    {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}
                </div>
            </div>
        </div>
    );
}
