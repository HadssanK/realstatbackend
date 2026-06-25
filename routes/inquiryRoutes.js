import express from "express";
import {
  sendInquiry,
  getMyListingInquiries,
  markInquiryAsRead,
  getMySentInquiries,
} from "../controllers/inquiryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Buyer — send inquiry on a property
router.post("/:propertyId", protect, sendInquiry);

// Buyer — get all inquiries I sent
router.get("/sent/me", protect, getMySentInquiries);

// Agent — get all inquiries on my listings
router.get("/received/my-listings", protect, getMyListingInquiries);

// Agent — mark inquiry as read
router.patch("/:id/read", protect, markInquiryAsRead);

export default router;
