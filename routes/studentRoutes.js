// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/register", async (req, res) => {
  const { full_name, email, program, year } = req.body;

  // Generate unique student ID (example: 07230055)
  const student_id = "0723" + Math.floor(1000 + Math.random() * 9000);

  try {
    const result = await db.query(
      "INSERT INTO students (student_id, full_name, email, program, year) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [student_id, full_name, email, program, year]
    );

    res.status(201).json({
      message: "Registration successful",
      studentId: result.rows[0].student_id,
    });
  } catch (err) {
    console.error("Error during student registration:", err);
    res.status(500).json({ message: "Registration failed." });
  }
});

module.exports = router;
