import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(client => { console.log("✅ Connected to DB:", process.env.DB_NAME); client.release(); })
  .catch(err => console.error("❌ DB Error:", err.message));

export default pool;