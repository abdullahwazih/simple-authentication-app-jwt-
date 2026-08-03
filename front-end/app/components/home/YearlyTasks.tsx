"use client";

import { useEffect, useState } from "react";
import { getYearlyTasks, toggleTask, deleteTask } from "@/lib/taskApi";
import EditTaskModal from "./EditTaskModal";
import { TaskShell, TaskCard } from "./TodayTasks";

export default function YearlyTasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState<any | null>(null);

    const handleTaskUpdated = (updated: any) =>
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

    const handleToggle = async (id: string) => {
        const res = await toggleTask(id);
        if (!res.error) setTasks((prev) => prev.map((t) => (t.id === id ? res.task : t)));
    };

    const handleDelete = async (id: string) => {
        const res = await deleteTask(id);
        if (!res.error) setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const getTimeLabel = (deadline: string) => {
        const diff = new Date(deadline).getTime() - Date.now();
        if (diff <= 0) return "Expired";
        const days = Math.floor(diff / 864e5);
        const months = Math.floor(days / 30);
        return months > 0 ? `${months}mo ${days % 30}d` : `${days}d`;
    };

    const urgencyColor = (deadline: string) => {
        const diff = new Date(deadline).getTime() - Date.now();
        if (diff <= 0) return "var(--text-muted)";
        if (diff < 864e5 * 7) return "var(--danger)";
        if (diff < 864e5 * 30) return "var(--warning)";
        return "var(--success)";
    };

    const groupByMonth = (tasks: any[]) =>
        tasks.reduce((g: Record<string, any[]>, t) => {
            const key = new Date(t.deadline).toLocaleDateString("en-US", { month: "long", year: "numeric" });
            (g[key] ??= []).push(t);
            return g;
        }, {});

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await getYearlyTasks();
            if (!res.error) setTasks(res.tasks ?? []);
            setLoading(false);
        })();
    }, []);

    const grouped = groupByMonth(tasks);

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
            <div style={{ width: 22, height: 22, border: "2.5px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    if (tasks.length === 0)
        return <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>No tasks this year</p>;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {Object.entries(grouped).map(([month, monthTasks]) => (
                <div key={month}>
                    <p style={{
                        fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                        textTransform: "uppercase", color: "var(--text-muted)",
                        marginBottom: 8, paddingBottom: 6,
                        borderBottom: "1px solid var(--border)",
                    }}>
                        {month}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {monthTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={handleToggle}
                                onEdit={() => setEditingTask(task)}
                                onDelete={handleDelete}
                                timeLabel={!task.is_completed ? getTimeLabel(task.deadline) : undefined}
                                timeColor={urgencyColor(task.deadline)}
                            />
                        ))}
                    </div>
                </div>
            ))}
            {editingTask && (
                <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onUpdated={handleTaskUpdated} />
            )}
        </div>
    );
}
