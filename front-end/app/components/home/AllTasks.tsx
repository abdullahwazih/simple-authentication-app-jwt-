"use client";

import { useEffect, useState } from "react";
import { getAllTasks, toggleTask, deleteTask } from "@/lib/taskApi";
import EditTaskModal from "./EditTaskModal";
import { TaskShell, TaskCard } from "./TodayTasks";

type Filter = "all" | "active" | "completed";

export default function AllTasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState<any | null>(null);
    const [filter, setFilter] = useState<Filter>("all");

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
        const hours = Math.floor((diff / 36e5) % 24);
        return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
    };

    const urgencyColor = (deadline: string) => {
        const diff = new Date(deadline).getTime() - Date.now();
        if (diff <= 0) return "var(--text-muted)";
        if (diff < 864e5) return "var(--danger)";
        if (diff < 864e5 * 7) return "var(--warning)";
        return "var(--success)";
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await getAllTasks();
            if (!res.error) setTasks(res.tasks ?? []);
            setLoading(false);
        })();
    }, []);

    const filtered = tasks.filter((t) => {
        if (filter === "active") return !t.is_completed;
        if (filter === "completed") return t.is_completed;
        return true;
    });

    const FILTERS: Filter[] = ["all", "active", "completed"];

    return (
        <div>
            {/* Filter bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: "4px 14px",
                            fontSize: 12,
                            fontWeight: 500,
                            borderRadius: 20,
                            border: "1px solid",
                            borderColor: filter === f ? "var(--accent)" : "var(--border)",
                            background: filter === f ? "var(--accent)" : "var(--surface)",
                            color: filter === f ? "white" : "var(--text-secondary)",
                            cursor: "pointer",
                            textTransform: "capitalize",
                            transition: "all 0.15s ease",
                        }}
                    >
                        {f}
                    </button>
                ))}
                <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>
                    {filtered.length} task{filtered.length !== 1 ? "s" : ""}
                </span>
            </div>

            <TaskShell loading={loading} empty={filtered.length === 0} emptyMsg="No tasks found">
                {filtered.map((task) => (
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
                {editingTask && (
                    <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onUpdated={handleTaskUpdated} />
                )}
            </TaskShell>
        </div>
    );
}
