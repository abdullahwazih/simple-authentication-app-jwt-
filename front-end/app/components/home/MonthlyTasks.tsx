"use client";

import { useEffect, useState } from "react";
import { getMonthlyTasks, toggleTask, deleteTask } from "@/lib/taskApi";
import EditTaskModal from "./EditTaskModal";
import { TaskShell, TaskCard } from "./TodayTasks";

export default function MonthlyTasks() {
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
        const hours = Math.floor((diff / 36e5) % 24);
        return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
    };

    const urgencyColor = (deadline: string) => {
        const diff = new Date(deadline).getTime() - Date.now();
        if (diff <= 0) return "var(--text-muted)";
        if (diff < 864e5) return "var(--danger)";
        if (diff < 864e5 * 3) return "var(--warning)";
        return "var(--success)";
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await getMonthlyTasks();
            if (!res.error) setTasks(res.tasks ?? []);
            setLoading(false);
        })();
    }, []);

    return (
        <TaskShell loading={loading} empty={tasks.length === 0} emptyMsg="No tasks this month">
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
