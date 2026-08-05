import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateRegister, validateLogin } from "../validations/authValidation.js";

const router = express.Router();

// Register
router.post("/register", authLimiter, validateRegister, registerUser);

// Login
router.post("/login", authLimiter, validateLogin, loginUser);

// Profile (Protected)
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;