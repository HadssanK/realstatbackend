import { UserRegisterSchema } from "../models/register.js";
import { Property } from "../models/Property.js";
import { Inquiry } from "../models/Inquiry.js";
import { Category } from "../models/Category.js";

// ═══════════════════════════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════════════════════════

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { role, isBlocked, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (isBlocked !== undefined) filter.isBlocked = isBlocked === "true";

    const skip = (Number(page) - 1) * Number(limit);
    const total = await UserRegisterSchema.countDocuments(filter);
    const users = await UserRegisterSchema.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get single user
export const getUserById = async (req, res) => {
  try {
    const user = await UserRegisterSchema.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Block / Unblock user
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await UserRegisterSchema.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Admin cannot block themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot block yourself" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.status(200).json({
      success: true,
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      data: { id: user._id, name: user.name, isBlocked: user.isBlocked },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await UserRegisterSchema.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot delete yourself" });
    }

    await user.deleteOne();
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Promote user to agent
export const promoteToAgent = async (req, res) => {
  try {
    const user = await UserRegisterSchema.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "agent") {
      return res.status(400).json({ success: false, message: "User is already an agent" });
    }

    user.role = "agent";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User promoted to agent successfully",
      data: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ═══════════════════════════════════════════════════════
// PLATFORM STATISTICS
// ═══════════════════════════════════════════════════════

export const getPlatformStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProperties,
      totalInquiries,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      featuredProperties,
      blockedUsers,
      agentCount,
      buyerCount,
    ] = await Promise.all([
      UserRegisterSchema.countDocuments(),
      Property.countDocuments(),
      Inquiry.countDocuments(),
      Property.countDocuments({ approvalStatus: "pending" }),
      Property.countDocuments({ approvalStatus: "approved" }),
      Property.countDocuments({ approvalStatus: "rejected" }),
      Property.countDocuments({ isFeatured: true }),
      UserRegisterSchema.countDocuments({ isBlocked: true }),
      UserRegisterSchema.countDocuments({ role: "agent" }),
      UserRegisterSchema.countDocuments({ role: "Buyer" }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          agents: agentCount,
          buyers: buyerCount,
          blocked: blockedUsers,
        },
        properties: {
          total: totalProperties,
          pending: pendingProperties,
          approved: approvedProperties,
          rejected: rejectedProperties,
          featured: featuredProperties,
        },
        inquiries: {
          total: totalInquiries,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ═══════════════════════════════════════════════════════
// CATEGORY MANAGEMENT
// ═══════════════════════════════════════════════════════

// Get all categories (public)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return res.status(200).json({ success: true, total: categories.length, data: categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Create category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const existing = await Category.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({ name, description });
    return res.status(201).json({ success: true, message: "Category created", data: category });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, message: "Category updated", data: category });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    return res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
