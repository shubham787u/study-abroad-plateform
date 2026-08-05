import express from "express";
import {
  getPrograms,
  getProgramById,
  getUniversities,
} from "../controllers/universityController.js";
import cacheMiddleware from "../middleware/cacheMiddleware.js";

const router = express.Router();

// Public Discovery Endpoints (cached for 5 minutes)
router.get("/programs", cacheMiddleware(300), getPrograms);
router.get("/programs/:id", cacheMiddleware(300), getProgramById);
router.get("/universities", cacheMiddleware(300), getUniversities);

export default router;
