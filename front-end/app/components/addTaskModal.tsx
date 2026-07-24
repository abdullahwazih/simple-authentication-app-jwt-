"use client";

import { useState } from "react";
import { addTask } from "@/lib/taskApi";

export default function AddTaskModal({ onClose }: { onClose: () => void }) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");

    const handleAddTask = async () => {

        if (!title || !description || !deadline) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            console.log("Adding task with:", { title, description, deadline });

            const res = await addTask(title, description, deadline);
            if (res.error) {
                alert(`Server error ${res.error}`);
            } else {
                alert("Task added successfully!");
                console.log("Task added:", res);
                onClose();
            }
        } catch (err) {
            console.error("Error adding task:", err);
            alert("An error occurred while adding the task.",);
        }
    }
    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 transform transition-all scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Add New Task
                </h2>

                {/* Inputs */}
                <div className="space-y-3">
                    <input
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <textarea
                        placeholder="Task description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <p className="text-sm text-gray-600 mb-1 ml-1">Deadline</p>


                    <input
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />


                </div>


                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleAddTask}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition shadow"
                    >
                        Add Task
                    </button>
                </div>
            </div>
        </div>
    );
}
