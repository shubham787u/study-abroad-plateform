import express from "express";
import {
  applyToProgram,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All application endpoints require authentication
router.use(authMiddleware);

router.post("/", applyToProgram);
router.get("/", getMyApplications);
router.get("/:id", getApplicationById);
router.patch("/:id/status", updateApplicationStatus);

export default router;
