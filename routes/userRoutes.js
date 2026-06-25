import express from "express";
import {
  getAgentProfile,
  updateMyProfile,
  getPropertiesByAgent,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/agent/:agentId", getAgentProfile);                           // Agent public profile
router.get("/agent/:agentId/properties", getPropertiesByAgent);           // Agent's listings

// Protected routes
router.put("/profile", protect, upload.single("profileImage"), updateMyProfile); // Update my profile

export default router;
