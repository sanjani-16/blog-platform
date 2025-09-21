import express from "express";
import pool from "../configure/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();


router.put("/me", requireAuth, upload.single("profile_picture"), async (req, res) => {
  try {
    const { bio, name } = req.body;
    let profile_picture;
    if (req.file) {
      profile_picture = `/uploads/${req.file.filename}`;
    }
    // Only update fields provided
    const result = await pool.query(
      "UPDATE users SET bio = COALESCE($1, bio), name = COALESCE($2, name), profile_picture = COALESCE($3, profile_picture) WHERE id = $4 RETURNING id, name, email, bio, profile_picture",
      [bio, name, profile_picture, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
});
// Current user profile + posts
router.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await pool.query(
      "SELECT id, name, email, bio, avatar_url, created_at FROM users WHERE id = $1",
      [userId]
    );
    const posts = await pool.query(
      "SELECT id, title, content, image_url, created_at FROM posts WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json({ user: user.rows[0], posts: posts.rows });
  } catch (err) {
    console.error("❌ PROFILE ERROR:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Public profile by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      "SELECT id, name, bio, avatar_url, created_at FROM users WHERE id = $1",
      [id]
    );
    if (!user.rows.length) return res.status(404).json({ error: "User not found" });
    const posts = await pool.query(
      "SELECT id, title, content, image_url, created_at FROM posts WHERE user_id = $1 ORDER BY created_at DESC",
      [id]
    );
    res.json({ user: user.rows[0], posts: posts.rows });
  } catch (err) {
    console.error("❌ PUBLIC PROFILE ERROR:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;


