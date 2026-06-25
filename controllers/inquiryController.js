import { Inquiry } from "../models/Inquiry.js";
import { Property } from "../models/Property.js";

// ─── Send Inquiry (Buyer → Agent) ─────────────────────────────────────────────
export const sendInquiry = async (req, res) => {
  try {
    const { message, buyerName, buyerEmail, buyerPhone } = req.body;
    const propertyId = req.params.propertyId;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    if (property.approvalStatus !== "approved") {
      return res.status(400).json({ success: false, message: "Cannot inquire on this property" });
    }

    // Prevent owner from sending inquiry on own property
    if (property.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot inquire on your own property" });
    }

    // Auto-fill from logged-in user if not provided
    const name = buyerName || req.user.name;
    const email = buyerEmail || req.user.email;
    const phone = buyerPhone || String(req.user.phoneNumber || "");

    const inquiry = await Inquiry.create({
      property: propertyId,
      sender: req.user._id,
      buyerName: name,
      buyerEmail: email,
      buyerPhone: phone,
      message,
    });

    await inquiry.populate("sender", "name email phoneNumber");
    await inquiry.populate("property", "title city price");

    return res.status(201).json({
      success: true,
      message: "Inquiry sent successfully",
      data: inquiry,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ─── Get Inquiries on Agent's Listings ───────────────────────────────────────
export const getMyListingInquiries = async (req, res) => {
  try {
    // Get all properties owned by this agent
    const myProperties = await Property.find({ createdBy: req.user._id }).select("_id");
    const propertyIds = myProperties.map((p) => p._id);

    const { status, page = 1, limit = 10 } = req.query;
    const filter = { property: { $in: propertyIds } };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Inquiry.countDocuments(filter);

    const inquiries = await Inquiry.find(filter)
      .populate("sender", "name email phoneNumber")
      .populate("property", "title city price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: inquiries,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ─── Mark Inquiry as Read ─────────────────────────────────────────────────────
export const markInquiryAsRead = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate("property", "createdBy");

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    // Only the property owner can mark as read
    if (inquiry.property.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    inquiry.status = "read";
    await inquiry.save();

    return res.status(200).json({ success: true, message: "Inquiry marked as read", data: inquiry });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ─── Get Inquiries Sent by Me (Buyer) ────────────────────────────────────────
export const getMySentInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ sender: req.user._id })
      .populate("property", "title city price images status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
