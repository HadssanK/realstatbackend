import express from "express";
import {
  toggleFavorite,
  getMyFavorites,
  checkFavorite,
} from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyFavorites);                        // Get all my favorites
router.post("/:propertyId", protect, toggleFavorite);            // Add / Remove toggle
router.get("/:propertyId/check", protect, checkFavorite);        // Check if favorited

export default router;
