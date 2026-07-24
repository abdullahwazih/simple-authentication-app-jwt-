import express from "express";
import { addTask, getTasks } from "../controllers/taskController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-task", authMiddleware, addTask);
router.get("/get-tasks", authMiddleware, getTasks);

export default router;
