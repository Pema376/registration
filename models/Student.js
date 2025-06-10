const pool = require("../config/db");

const createStudentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      age INT,
      email VARCHAR(100),
      course VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("✅ Student table created or already exists.");
  } catch (err) {
    console.error("❌ Error creating student table:", err);
  }
};

createStudentTable();
