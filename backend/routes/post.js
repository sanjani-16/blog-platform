import express from "express";
import pool from "../configure/db.js";
import { requireAuth } from "../middleware/auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Create a new post (protected)
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const result = await pool.query(
      "INSERT INTO posts (user_id, title, content, image_url, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [userId, title, content, image_url]
    );

    res.status(201).json({ message: "Post created", post: result.rows[0] });
  } catch (err) {
    console.error("❌ CREATE POST ERROR:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all posts (with user info)
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT posts.*, users.name, users.email 
       FROM posts 
       JOIN users ON posts.user_id = users.id 
       ORDER BY posts.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ LIST POSTS ERROR:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a post (author only)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await pool.query("SELECT user_id FROM posts WHERE id = $1", [id]);
    if (!owner.rows.length) return res.status(404).json({ error: "Post not found" });
    if (String(owner.rows[0].user_id) !== String(req.user.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("❌ DELETE POST ERROR:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
