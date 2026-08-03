"use client";

import { useEffect, useState } from "react";
import { getWeeklyTasks, toggleTask, deleteTask } from "@/lib/taskApi";
import EditTaskModal from "./EditTaskModal";
import { TaskShell, TaskCard } from "./TodayTasks";

export default function WeekTasks() {
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
        const h = Math.floor(diff / 36e5);
        const m = Math.floor((diff / 6e4) % 60);
        const s = Math.floor((diff / 1e3) % 60);
        return `${h}h ${m}m ${s}s`;
    };

    const urgencyColor = (deadline: string) => {
        const diff = new Date(deadline).getTime() - Date.now();
        if (diff <= 0) return "var(--text-muted)";
        if (diff < 36e3 * 10) return "var(--danger)";
        if (diff < 36e5) return "var(--warning)";
        return "var(--success)";
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await getWeeklyTasks();
            if (!res.error) setTasks(res.tasks ?? []);
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        const iv = setInterval(() => setTasks((t) => [...t]), 1000);
        return () => clearInterval(iv);
    }, []);

    return (
        <TaskShell loading={loading} empty={tasks.length === 0} emptyMsg="No tasks this week">
            {tasks.map((task) => (
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
    );
}