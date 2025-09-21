import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import postsRouter from "./routes/post.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js"; 

// Load environment variables
dotenv.config();

// Handle __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Enable CORS for React frontend
app.use(
  cors({
    origin: "http://localhost:3000", // your React frontend
    credentials: true, // allow cookies/credentials if needed
  })
);

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Serve uploaded files from /uploads folder (profile pictures etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API routes
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes); 

// ✅ 404 handler for unknown API routes
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
  next();
});

// ✅ Central error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res
    .status(500)
    .json({ error: "Server error", details: err.message || "Unknown error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
