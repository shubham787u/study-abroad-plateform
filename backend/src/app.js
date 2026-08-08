import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import universityRoutes from "./routes/universityRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

import { apiLimiter } from "./middleware/rateLimiter.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Gzip Compression
app.use(compression());

// HTTP Request Logger
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Apply Global Rate Limiter
app.use("/api", apiLimiter);

// Health Check Endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Study Abroad Platform API is Running",
    version: "1.0.0",
  });
});

// API Routes Mounting
app.use("/api/auth", authRoutes);
app.use("/api", universityRoutes); // Handles /api/universities and /api/programs
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/applications", applicationRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
