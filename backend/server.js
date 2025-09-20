import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import postsRouter from "./routes/post.js";
import authRoutes from "./routes/auth.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));