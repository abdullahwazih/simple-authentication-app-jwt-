"use client";

import { useState } from "react";
import { updateTask } from "@/lib/taskApi";

export default function EditTaskModal({
    task,
    onClose,
    onUpdated,
}: {
    task: any;
    onClose: () => void;
    onUpdated: (updatedTask: any) => void;
}) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [deadline, setDeadline] = useState(task.deadline);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        setSaving(true);
        const res = await updateTask(task.id, { title, description, deadline });
        setSaving(false);
        if (!res.error) {
            onUpdated(res.task);
            onClose();
        }
    };

    return (
        <div
            style={overlay}
            onClick={onClose}
        >
            <div
                style={card}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>Edit task</h2>
                    <button onClick={onClose} style={closeBtn}>✕</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task title"
                        style={inputStyle}
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        rows={3}
                        style={{ ...inputStyle, resize: "vertical" }}
                    />
                    <div>
                        <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>Deadline</label>
                        <input
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
                    <button onClick={onClose} style={btnSecondary}>Cancel</button>
                    <button onClick={handleSubmit} disabled={saving} style={btnPrimary(saving)}>
                        {saving ? "Saving…" : "Save changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const overlay: React.CSSProperties = {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 100,
    padding: 20,
};

const card: React.CSSProperties = {
    background: "var(--surface)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow-lg)",
    padding: "28px 28px",
    width: "100%",
    maxWidth: 420,
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 13px",
    fontSize: 14,
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    outline: "none",
    background: "#fafafa",
    color: "var(--text-primary)",
    fontFamily: "inherit",
};

const closeBtn: React.CSSProperties = {
    width: 28, height: 28,
    border: "none",
    background: "var(--bg)",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    color: "var(--text-secondary)",
    display: "flex", alignItems: "center", justifyContent: "center",
};

const btnSecondary: React.CSSProperties = {
    padding: "9px 20px", fontSize: 13, fontWeight: 500,
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    color: "var(--text-primary)",
};

const btnPrimary = (disabled: boolean): React.CSSProperties => ({
    padding: "9px 20px", fontSize: 13, fontWeight: 600,
    background: disabled ? "#a0c4f1" : "var(--accent)",
    border: "none",
    borderRadius: "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    color: "white",
});