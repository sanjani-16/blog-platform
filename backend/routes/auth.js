import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../configure/db.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // ✅ Validate inputs
    if (!name || !email || !password || typeof email !== "string") {
      return res.status(400).json({ error: "Invalid input data" });
    }

    email = email.toLowerCase().trim();

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name.trim(), email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("❌ REGISTER ERROR:", err);
    res.status(500).json({
      error: "Database error",
      details: err.message,
      stack: err.stack,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    // ✅ Validate inputs
    if (!email || !password || typeof email !== "string") {
      return res.status(400).json({ error: "Invalid input data" });
    }

    email = email.toLowerCase().trim();

    console.log("🟢 Login attempt:", email);

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    console.log("🟢 Query result:", result.rows);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("🟢 Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    delete user.password;
    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

export default router;
