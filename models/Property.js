import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
    },

    propertyType: {
      type: String,
      required: [true, "Property type is required"],
      enum: ["House", "Apartment", "Villa", "Plot", "Commercial", "Other"],
    },

    listingType: {
      type: String,
      required: [true, "Listing type is required"],
      enum: ["Sale", "Rent"],
    },

    bedrooms: {
      type: Number,
      required: [true, "Bedrooms count is required"],
    },

    bathrooms: {
      type: Number,
      required: [true, "Bathrooms count is required"],
    },

    area: {
      type: Number, // sq ft
      required: [true, "Area is required"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
    },

    city: {
      type: String,
      required: [true, "City is required"],
    },

    country: {
      type: String,
      required: [true, "Country is required"],
    },

    location: {
      lat: { type: Number },
      lng: { type: Number },
    },

    amenities: {
      parking: { type: Boolean, default: false },
      pool: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      garden: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      elevator: { type: Boolean, default: false },
    },

    images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true }, // cloudinary public_id for deletion
        },
      ],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "Maximum 10 images allowed",
      },
    },

    status: {
      type: String,
      enum: ["Available", "Sold", "Rented"],
      default: "Available",
    },

    // Admin approval workflow
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    // Featured listing — Admin only
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Owner reference
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Property = mongoose.model("Property", propertySchema);
