const pool = require("../config/db");

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      verified BOOLEAN DEFAULT false,
      verification_token VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("✅ User table created or already exists.");
  } catch (err) {
    console.error("❌ Error creating user table:", err);
  }
};

module.exports = createUserTable;
