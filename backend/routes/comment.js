import express from "express";
import pool from "../configure/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// GET all comments for a post
router.get("/post/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await pool.query(
      `SELECT c.*, u.name AS author FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at ASC`,
      [postId]
    );
    res.json(comments.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// ADD comment
router.post("/post/:postId", auth, async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content } = req.body;
    const result = await pool.query(
      "INSERT INTO comments (post_id, user_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [postId, req.user.id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// DELETE comment
router.delete("/:commentId", auth, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await pool.query("SELECT * FROM comments WHERE id = $1", [commentId]);
    if (comment.rows[0].user_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });
    await pool.query("DELETE FROM comments WHERE id = $1", [commentId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;
