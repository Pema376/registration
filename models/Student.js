const pool = require("../config/db");

const createStudentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS students (
      student_id SERIAL PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      program VARCHAR(100),
      year VARCHAR(50)
    );
  `;
  try {
    await pool.query(query);
    console.log("✅ Correct 'students' table created or already exists.");
  } catch (err) {
    console.error("❌ Error creating student table:", err);
  }
};

// Export the function but DO NOT call here
module.exports = createStudentTable;
