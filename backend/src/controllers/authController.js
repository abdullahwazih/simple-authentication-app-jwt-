import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

import supabase from "../config/supabase.js";

export const registerUser = async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
        .from("users")
        .insert([{ email, password: hashedPassword }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: "User created" });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (error || !user) {
        return res.status(401).json({ error: "Invalid email" });
    }

    // 🔹 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ error: "Wrong password" });
    }

    // 🔹 3. Generate token
    const token = generateToken(user.id);

    // 🔹 4. Set cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
    });

    res.json({ message: "Login successful" });
};

// PROTECTED ROUTE
export const getProfile = async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const { data: user, error } = await supabase
        .from("users")
        .select("id, email")
        .eq("id", req.user.id)
        .single();

    if (error) {
        return res.status(500).json({
            error: "Could not fetch user profile",
            details: error.message,
        });
    }

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
};

// LOGOUT
export const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
};
