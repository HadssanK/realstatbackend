import express from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  toggleFeatured,
  getFeaturedProperties,
} from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProperties);
router.get("/featured", getFeaturedProperties);

// Protected routes
router.get("/user/my-properties", protect, getMyProperties);
router.post("/", protect, upload.array("images", 10), createProperty);
router.put("/:id", protect, upload.array("images", 10), updateProperty);
router.delete("/:id", protect, deleteProperty);

// Admin only routes
router.get("/admin/pending", protect, authorize("admin"), getPendingProperties);
router.patch("/admin/:id/approve", protect, authorize("admin"), approveProperty);
router.patch("/admin/:id/reject", protect, authorize("admin"), rejectProperty);
router.patch("/admin/:id/featured", protect, authorize("admin"), toggleFeatured);

// Single property (last mein)
router.get("/:id", getPropertyById);

export default router;
