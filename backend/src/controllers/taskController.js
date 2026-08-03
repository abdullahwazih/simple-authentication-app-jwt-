import supabase from "../config/supabase.js";


export const addTask = async (req, res) => {

    try {
        const { title, description, deadline } = req.body;

        if (!title || !description || !deadline) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        const { data, error } = await supabase
            .from("tasks")
            .insert({ title, description, deadline, user_id: req.user.id })
            .select();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(201).json(
            { message: "Task added successfully", task: data?.[0] },
        );
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getTasks = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", req.user.id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({ tasks: data });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, deadline } = req.body;

        if (!title && !description && !deadline) {
            return res.status(400).json({ error: "Provide at least one field to update" });
        }

        const { data, error } = await supabase
            .from("tasks")
            .update({ title, description, deadline })
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        return res.status(200).json({
            message: "Task updated successfully",
            task: data[0],
        });

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const toggleTaskCompletion = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Get current value
        const { data: task, error: fetchError } = await supabase
            .from("tasks")
            .select("is_completed")
            .eq("id", id)
            .eq("user_id", req.user.id)
            .single();

        if (fetchError || !task) {
            return res.status(404).json({ error: "Task not found" });
        }

        // 2. Reverse the value
        const newStatus = !task.is_completed;

        // 3. Update it
        const { data, error } = await supabase
            .from("tasks")
            .update({ is_completed: newStatus })
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({
            message: "Task status updated",
            task: data[0],
        });

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};


// Get tasks for the next 7 days

export const getWeeklyTasks = async (req, res) => {
    try {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", req.user.id)
            .gte("deadline", now.toISOString())
            .lte("deadline", nextWeek.toISOString());

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({ tasks: data });

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get tasks for this year

export const getYearlyTasks = async (req, res) => {
    try {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", req.user.id)
            .gte("deadline", startOfYear.toISOString())
            .lte("deadline", endOfYear.toISOString());

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({ tasks: data });

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};


// Get all tasks

export const getAllTasks = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", req.user.id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({ tasks: data });

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a task

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", id)
            .eq("user_id", req.user.id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({ message: "Task deleted" });

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};