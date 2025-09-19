import pool from "./configure/db.js";

const test = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ DB Connected! Time:", res.rows[0]);
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
  } finally {
    process.exit();
  }
};

test();
