import { UserRegisterSchema } from "../models/register.js";
import { Property } from "../models/Property.js";

// ─── Toggle Favorite (Add / Remove) ──────────────────────────────────────────
export const toggleFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    // Check property exists and is approved
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    if (property.approvalStatus !== "approved") {
      return res.status(400).json({ success: false, message: "Property is not available" });
    }

    const user = await UserRegisterSchema.findById(userId);

    const alreadyFavorited = user.favorites.includes(propertyId);

    if (alreadyFavorited) {
      // Remove from favorites
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== propertyId.toString()
      );
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Removed from favorites",
        isFavorited: false,
      });
    } else {
      // Add to favorites
      user.favorites.push(propertyId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Added to favorites",
        isFavorited: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ─── Get My Favorites ─────────────────────────────────────────────────────────
export const getMyFavorites = async (req, res) => {
  try {
    const user = await UserRegisterSchema.findById(req.user._id).populate({
      path: "favorites",
      match: { approvalStatus: "approved" }, // sirf approved properties dikhao
      select: "title price city country propertyType listingType bedrooms bathrooms area images status isFeatured createdBy",
      populate: {
        path: "createdBy",
        select: "name email phoneNumber",
      },
    });

    return res.status(200).json({
      success: true,
      total: user.favorites.length,
      data: user.favorites,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ─── Check if Property is Favorited ──────────────────────────────────────────
export const checkFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const user = await UserRegisterSchema.findById(req.user._id);

    const isFavorited = user.favorites.includes(propertyId);

    return res.status(200).json({ success: true, isFavorited });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
