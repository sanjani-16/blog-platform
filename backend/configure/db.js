// backend/configure/db.js
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config(); // Load .env

const pool = new Pool({
  user: process.env.DB_USER,       // postgres
  host: process.env.DB_HOST,       // localhost
  database: process.env.DB_NAME,   // blogdb
  password: process.env.DB_PASS,   // tangedapally
  port: process.env.DB_PORT,       // 5432
});

// Test connection
pool.connect()
  .then(client => {
    console.log("✅ Connected to DB:", process.env.DB_NAME);
    client.release();
  })
  .catch(err => console.error("❌ DB Error:", err.message));

export default pool;
