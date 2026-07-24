"use client";

import { useEffect, useState } from "react";
import { getTasks } from "@/lib/taskApi";

export default function TodayTasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [timeNow, setTimeNow] = useState(Date.now());

    // 🔹 Filter today's tasks
    const filterTodayTasks = (tasks: any[]) => {
        const today = new Date();

        return tasks.filter((task) => {
            const taskDate = new Date(task.deadline);

            return (
                taskDate.getFullYear() === today.getFullYear() &&
                taskDate.getMonth() === today.getMonth() &&
                taskDate.getDate() === today.getDate()
            );
        });
    };

    // 🔹 Live countdown (with seconds ticking)
    const getTimeRemaining = (deadline: string) => {
        const now = Date.now(); // always fresh
        const end = new Date(deadline).getTime();

        const diff = end - now;

        if (diff <= 0) return "Expired";

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    // 🔹 Color based on urgency
    const getColor = (deadline: string) => {
        const diff = new Date(deadline).getTime() - Date.now();

        if (diff <= 0) return "text-gray-400";
        if (diff < 1000 * 10) return "text-red-600 animate-pulse"; // <10s
        if (diff < 1000 * 60 * 10) return "text-red-500";          // <10 min
        if (diff < 1000 * 60 * 60) return "text-yellow-500";       // <1 hour

        return "text-green-500";
    };

    // 🔹 Fetch tasks
    useEffect(() => {
        const fetchTasks = async () => {
            const res = await getTasks();

            if (!res.error) {
                setTasks(filterTodayTasks(res.tasks));
            } else {
                console.error("Error fetching tasks");
            }
        };

        fetchTasks();
    }, []);

    // 🔹 Force re-render every second (for ticking effect)
    useEffect(() => {
        
        const interval = setInterval(() => {
            setTimeNow(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-xl shadow p-6">
            {tasks.length === 0 ? (
                <p className="text-gray-500 text-sm">
                    No tasks for today
                </p>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="p-4 border shadow-sm border-gray-200 rounded-lg flex justify-between items-center"
                        >
                            <p className="font-semibold text-gray-800">
                                {task.title}
                            </p>

                            <p className={`text-lg font-mono font-medium ${getColor(task.deadline)}`}>
                                {getTimeRemaining(task.deadline)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}