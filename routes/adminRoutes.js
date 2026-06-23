import express from "express";
import {
  getAllUsers,
  getUserById,
  toggleBlockUser,
  deleteUser,
  promoteToAgent,
  getPlatformStats,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, authorize("admin"));

// ── Stats ──────────────────────────────────────────────
router.get("/stats", getPlatformStats);

// ── User Management ────────────────────────────────────
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/block", toggleBlockUser);
router.patch("/users/:id/promote", promoteToAgent);
router.delete("/users/:id", deleteUser);

// ── Category Management ────────────────────────────────
router.get("/categories", getAllCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

export default router;
