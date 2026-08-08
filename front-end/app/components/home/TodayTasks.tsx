"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, toggleTask, deleteTask } from "@/lib/taskApi";
import EditTaskModal from "./EditTaskModal";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

const filterToday = (tasks: any[]) => {
    const today = new Date();
    return tasks.filter((t) => {
        const d = new Date(t.deadline);
        return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
        );
    });
};

export default function TodayTasks() {
    const queryClient = useQueryClient();
    const [editingTask, setEditingTask] = useState<any | null>(null);

    // ── Fetch tasks ──
    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ["tasks", "today"],
        queryFn: async () => {
            const res = await getTasks();
            if (res.error) throw new Error(res.error);
            return filterToday(res.tasks);
        },
        // keep the countdown labels fresh without refetching the network
        refetchInterval: 1000,
        refetchIntervalInBackground: false,
    });

    // ── Toggle mutation ──
    const toggleMutation = useMutation({
        mutationFn: (id: string) => toggleTask(id),
        onSuccess: (res, id) => {
            if (res.error) return;
            queryClient.setQueryData(["tasks", "today"], (old: any[] = []) =>
                old.map((t) => (t.id === id ? res.task : t))
            );
        },
    });

    // ── Delete mutation ──
    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteTask(id),
        onSuccess: (res, id) => {
            if (res.error) return;
            queryClient.setQueryData(["tasks", "today"], (old: any[] = []) =>
                old.filter((t) => t.id !== id)
            );
        },
    });

    const handleTaskUpdated = (updated: any) =>
        queryClient.setQueryData(["tasks", "today"], (old: any[] = []) =>
            old.map((t) => (t.id === updated.id ? updated : t))
        );

    const getTimeRemaining = (deadline: string) => {
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
        if (diff < 1e3 * 600) return "var(--danger)";
        if (diff < 36e5) return "var(--warning)";
        return "var(--success)";
    };

    return (
        <TaskShell loading={isLoading} empty={tasks.length === 0} emptyMsg="No tasks due today">
            {tasks.map((task: any) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={(id) => toggleMutation.mutate(id)}
                    onEdit={() => setEditingTask(task)}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    timeLabel={!task.is_completed ? getTimeRemaining(task.deadline) : undefined}
                    timeColor={urgencyColor(task.deadline)}
                />
            ))}
            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onUpdated={handleTaskUpdated}
                />
            )}
        </TaskShell>
    );
}

/* ── Shared sub-components (unchanged) ── */

export function TaskShell({ loading, empty, emptyMsg, children }: {
    loading: boolean; empty: boolean; emptyMsg: string; children?: React.ReactNode;
}) {
    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
            <div style={{ width: 22, height: 22, border: "2.5px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );
    if (empty) return <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "12px 0" }}>{emptyMsg}</p>;
    return <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>;
}

export function TaskCard({ task, onToggle, onEdit, onDelete, timeLabel, timeColor }: {
    task: any;
    onToggle: (id: string) => void;
    onEdit: () => void;
    onDelete: (id: string) => void;
    timeLabel?: string;
    timeColor?: string;
}) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "0 1px 4px rgba(0,0,0,.04)",
            gap: 12,
            transition: "box-shadow 0.15s ease",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <input
                    type="checkbox"
                    checked={task.is_completed}
                    onChange={() => onToggle(task.id)}
                    style={{ width: 17, height: 17, cursor: "pointer", accentColor: "var(--accent)", flexShrink: 0 }}
                />
                <div style={{ minWidth: 0 }}>
                    <p style={{
                        fontWeight: 500,
                        fontSize: 14,
                        margin: 0,
                        color: task.is_completed ? "var(--text-muted)" : "var(--text-primary)",
                        textDecoration: task.is_completed ? "line-through" : "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}>
                        {task.title}
                    </p>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {timeLabel && (
                    <span style={{ fontSize: 12, fontWeight: 500, fontFamily: "inherit", color: timeColor ?? "var(--text-secondary)" }}>
                        {timeLabel}
                    </span>
                )}
                <button onClick={onEdit} style={iconBtn("#3b82f6")}>
                    <FiEdit2 size={15} />
                </button>
                <button onClick={() => onDelete(task.id)} style={iconBtn("#ef4444")}>
                    <RiDeleteBinLine size={15} />
                </button>
            </div>
        </div>
    );
}

export const iconBtn = (color: string): React.CSSProperties => ({
    width: 30, height: 30,
    borderRadius: 7,
    border: "none",
    background: "transparent",
    color,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.15s",
});