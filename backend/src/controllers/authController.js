import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// Fake user (replace with DB later)
const user = {
    id: 1,
    email: "test@test.com",
    password: bcrypt.hashSync("123456", 10),
};

// LOGIN
export const loginUser = async (req, res) => {
    
    const { email, password } = req.body;

    if (email !== user.email) {
        return res.status(401).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ error: "Wrong password" });
    }

    const token = generateToken(user.id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
    });

    res.json({ message: "Login successful" });
};

// PROTECTED ROUTE
export const getProfile = (req, res) => {
    res.json({
        message: "Protected data",
        user: req.user,
    });
};

// LOGOUT
export const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
};