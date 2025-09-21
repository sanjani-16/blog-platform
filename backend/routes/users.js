// backend/routes/users.js
import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/auth.js";
import pool from "../configure/db.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * ✅ Logged-in user profile
 */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, name, email, profile_picture, bio FROM users WHERE id=$1",
      [req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ Update logged-in user name + bio
 */
router.put("/me", verifyToken, async (req, res) => {
  const { name, bio } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET name=$1, bio=$2 WHERE id=$3 RETURNING id, username, name, email, profile_picture, bio",
      [name, bio, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /me error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

/**
 * ✅ Upload logged-in user avatar
 */
router.post(
  "/me/avatar",
  verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const filePath = `/uploads/${req.file.filename}`; // served statically
      const result = await pool.query(
        "UPDATE users SET profile_picture=$1 WHERE id=$2 RETURNING id, username, name, email, profile_picture, bio",
        [filePath, req.user.id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error("POST /me/avatar error:", err);
      res.status(500).json({ error: "Avatar upload failed" });
    }
  }
);

/**
 * ✅ Logged-in user posts
 */
router.get("/me/posts", verifyToken, async (req, res) => {
  try {
    const posts = await pool.query(
      "SELECT id, caption, created_at, image_url FROM posts WHERE author_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(posts.rows);
  } catch (err) {
    console.error("GET /me/posts error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ Public profile by username
 * (use /api/users/u/:username)
 */
router.get("/u/:username", async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, username, name, email, profile_picture, bio FROM users WHERE username=$1",
      [req.params.username]
    );
    if (user.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error("GET /u/:username error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ Public posts by username
 * (use /api/users/u/:username/posts)
 */
router.get("/u/:username/posts", async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id FROM users WHERE username=$1",
      [req.params.username]
    );
    if (user.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await pool.query(
      "SELECT id, caption, created_at, image_url FROM posts WHERE author_id=$1 ORDER BY created_at DESC",
      [user.rows[0].id]
    );
    res.json(posts.rows);
  } catch (err) {
    console.error("GET /u/:username/posts error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
