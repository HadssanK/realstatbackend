import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    // Logged-in user reference
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Buyer details — auto-filled from logged-in user, or entered manually
    buyerName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    buyerEmail: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    buyerPhone: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      required: [true, "Message is required"],
    },

    status: {
      type: String,
      enum: ["unread", "read", "responded"],
      default: "unread",
    },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model("Inquiry", inquirySchema);
