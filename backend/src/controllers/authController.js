import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      preferredCountry,
      preferredField,
      budget,
      ieltsScore,
      preferredIntake,
    } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, "Name, email and password are required");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return sendError(res, 409, "Email already registered");
    }

    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "student",
      preferredCountry: preferredCountry || "",
      preferredField: preferredField || "",
      budget: budget !== undefined ? Number(budget) : 0,
      ieltsScore: ieltsScore !== undefined ? Number(ieltsScore) : 0,
      preferredIntake: preferredIntake || "",
    });

    const token = generateToken(user._id);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredCountry: user.preferredCountry,
      preferredField: user.preferredField,
      budget: user.budget,
      ieltsScore: user.ieltsScore,
      preferredIntake: user.preferredIntake,
      createdAt: user.createdAt,
    };

    return sendSuccess(
      res,
      201,
      "Registration successful",
      { user: userResponse, token }
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Email and password are required");
    }

    // Select password explicitly since select: false on schema
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      return sendError(res, 401, "Invalid email or password");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password");
    }

    const token = generateToken(user._id);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredCountry: user.preferredCountry,
      preferredField: user.preferredField,
      budget: user.budget,
      ieltsScore: user.ieltsScore,
      preferredIntake: user.preferredIntake,
    };

    return sendSuccess(
      res,
      200,
      "Login successful",
      { user: userResponse, token }
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return sendError(res, 404, "User profile not found");
    }
    return sendSuccess(res, 200, "Profile retrieved successfully", { user });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update user profile & study abroad preferences
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const {
      name,
      preferredCountry,
      preferredField,
      budget,
      ieltsScore,
      preferredIntake,
    } = req.body;

    if (name) user.name = name.trim();
    if (preferredCountry !== undefined) user.preferredCountry = preferredCountry.trim();
    if (preferredField !== undefined) user.preferredField = preferredField.trim();
    if (budget !== undefined) user.budget = Number(budget);
    if (ieltsScore !== undefined) user.ieltsScore = Number(ieltsScore);
    if (preferredIntake !== undefined) user.preferredIntake = preferredIntake.trim();

    const updatedUser = await user.save();

    return sendSuccess(
      res,
      200,
      "Profile updated successfully",
      { user: updatedUser }
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};