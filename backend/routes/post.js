import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pool from "../configure/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`);
  },
});
const upload = multer({ storage });

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

// GET all posts
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name AS author,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count
      FROM posts p
      JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET single post with comments
router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await pool.query(`
      SELECT p.*, u.name AS author
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = $1
    `, [postId]);
    const comments = await pool.query(`
      SELECT c.*, u.name AS author
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
    `, [postId]);
    res.json({ ...post.rows[0], comments: comments.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// CREATE post
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { caption } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const author_id = req.user.id;
    const insert = await pool.query(
      "INSERT INTO posts (author_id, caption, image_url, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [author_id, caption, image_url]
    );
    res.status(201).json(insert.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// UPDATE post
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const postId = req.params.id;
    const check = await pool.query("SELECT * FROM posts WHERE id=$1", [postId]);
    if (check.rowCount === 0) return res.status(404).json({ error: "Not found" });
    if (check.rows[0].author_id !== req.user.id) return res.status(403).json({ error: "Not authorized" });
    const { caption } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : check.rows[0].image_url;
    const updated = await pool.query(
      "UPDATE posts SET caption=$1, image_url=$2 WHERE id=$3 RETURNING *",
      [caption, image_url, postId]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE post
router.delete("/:id", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const check = await pool.query("SELECT * FROM posts WHERE id=$1", [postId]);
    if (check.rowCount === 0) return res.status(404).json({ error: "Not found" });
    if (check.rows[0].author_id !== req.user.id) return res.status(403).json({ error: "Not authorized" });
    await pool.query("DELETE FROM posts WHERE id=$1", [postId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// LIKE/UNLIKE post
router.post("/:id/likes", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const like = await pool.query("SELECT * FROM likes WHERE post_id = $1 AND user_id = $2", [postId, userId]);
    if (like.rows.length) {
      await pool.query("DELETE FROM likes WHERE post_id = $1 AND user_id = $2", [postId, userId]);
      res.json({ liked: false });
    } else {
      await pool.query("INSERT INTO likes (post_id, user_id) VALUES ($1, $2)", [postId, userId]);
      res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

// ADD comment
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const postId = req.params.id;
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
router.delete("/:id/comments/:commentId", auth, async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const comment = await pool.query("SELECT * FROM comments WHERE id = $1", [commentId]);
    if (comment.rows[0].user_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });
    await pool.query("DELETE FROM comments WHERE id = $1", [commentId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;