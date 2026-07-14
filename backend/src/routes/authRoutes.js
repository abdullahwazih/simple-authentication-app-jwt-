import express from "express";
import {
    loginUser,
    getProfile,
    logoutUser
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);
router.post("/logout", logoutUser);

export default router;