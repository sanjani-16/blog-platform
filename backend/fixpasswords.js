import bcrypt from "bcryptjs";
import pool from "./configure/db.js";  // ✅ this now works

const fixPasswords = async () => {
  try {
    const users = await pool.query("SELECT id, password FROM users");
    for (let user of users.rows) {
      if (!user.password.startsWith("$2a$")) {
        const hashed = await bcrypt.hash(user.password, 10);
        await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
          hashed,
          user.id,
        ]);
        console.log(`🔑 Updated password for user ID: ${user.id}`);
      }
    }
    console.log("✅ All plain text passwords have been hashed!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

fixPasswords();
