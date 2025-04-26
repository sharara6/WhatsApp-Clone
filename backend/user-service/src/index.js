import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || "http://localhost:5000";

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5002", API_GATEWAY_URL], // Allow frontend, message service, and API gateway
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "user-service" });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`User service running on PORT: ${PORT}`);
  console.log(`API Gateway URL: ${API_GATEWAY_URL}`);
  connectDB();
}); 