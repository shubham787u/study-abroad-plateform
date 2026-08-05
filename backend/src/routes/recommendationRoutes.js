import express from "express";
import {
  getUserProfileRecommendations,
  getCustomRecommendations,
} from "../controllers/recommendationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import cacheMiddleware from "../middleware/cacheMiddleware.js";

const router = express.Router();

// Profile Recommendations (Protected)
router.get("/", authMiddleware, cacheMiddleware(300), getUserProfileRecommendations);

// Custom Recommendations (Public/Custom input)
router.post("/custom", getCustomRecommendations);

export default router;
