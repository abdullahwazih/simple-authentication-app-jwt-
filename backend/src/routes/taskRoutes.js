import express from "express";
import { addTask, getTasks, updateTask, toggleTaskCompletion, getAllTasks, getWeeklyTasks, getYearlyTasks, deleteTask } from "../controllers/taskController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-task", authMiddleware, addTask);
router.get("/get-tasks", authMiddleware, getTasks);
router.put("/update-task/:id", authMiddleware, updateTask);
router.patch("/toggle-task/:id", authMiddleware, toggleTaskCompletion);
router.get("/weekly", authMiddleware, getWeeklyTasks);
router.get("/yearly", authMiddleware, getYearlyTasks);
router.get("/all", authMiddleware, getAllTasks);
router.delete("/delete-task/:id", authMiddleware, deleteTask);

export default router;
