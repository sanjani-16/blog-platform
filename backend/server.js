import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import profileRoutes from "./routes/profile.js";
import pool from "./configure/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

// ✅ Auth routes
app.use("/api/auth", authRoutes);

// ✅ Posts routes
app.use("/api/posts", postRoutes);

// ✅ Profile routes
app.use("/api/profile", profileRoutes);

// ✅ Serve uploaded images
app.use("/uploads", express.static("uploads"));

// (Optional) DB connectivity quick check
app.get("/api/test-db", async (_req, res) => {
  try {
    const r = await pool.query("SELECT NOW() as now");
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
