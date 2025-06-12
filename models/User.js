const pool = require("../config/db");

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      verified BOOLEAN DEFAULT false,
      verification_token TEXT
    );
  `;
  try {
    await pool.query(query);
    console.log("✅ Correct 'users' table created or already exists.");
  } catch (err) {
    console.error("❌ Error creating users table:", err);
  }
};

createUserTable();
