import express from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getMyProperties,
} from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProperties);

// Protected routes (my-properties :id se pehle hona chahiye)
router.get("/user/my-properties", protect, getMyProperties);
router.post("/", protect, upload.array("images", 10), createProperty);
router.put("/:id", protect, upload.array("images", 10), updateProperty);
router.delete("/:id", protect, deleteProperty);

// Single property (last mein taake /user/my-properties conflict na ho)
router.get("/:id", getPropertyById);

export default router;
