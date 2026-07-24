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
