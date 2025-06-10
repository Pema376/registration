const express = require("express");
const router = express.Router();
const db = require("../db"); // ✅ Ensure db connection is loaded
require("dotenv").config();

// ✅ Admin Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({ message: "Admin login successful" });
  } else {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
});

// ✅ GET all registered students
router.get("/students", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT student_id, full_name, email, program, year FROM students ORDER BY student_id DESC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// ✅ Update student
// ✅ Improved Update Student Route with Logs
router.put("/students/:student_id", async (req, res) => {
  const { student_id } = req.params;
  const { full_name, email, program, year } = req.body;

  console.log("UPDATE REQUEST:");
  console.log("Params ID:", student_id);
  console.log("Body:", { full_name, email, program, year });

  // Validate required fields
  if (!full_name || !email || !program || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await db.query(
      "UPDATE students SET full_name = $1, email = $2, program = $3, year = $4 WHERE student_id = $5",
      [full_name, email, program, year, student_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update student" });
  }
});
// ✅ PATCH - Update one field of a student
router.patch("/students/:student_id", async (req, res) => {
  const { student_id } = req.params;
  const { field, value } = req.body;

  const allowedFields = ["full_name", "email", "program", "year"];
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ message: "Invalid field" });
  }

  try {
    const result = await db.query(
      `UPDATE students SET ${field} = $1 WHERE student_id = $2`,
      [value, student_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: `Student ${field} updated successfully` });
  } catch (err) {
    console.error("PATCH update error:", err);
    res.status(500).json({ message: "Failed to update student" });
  }
});

// ✅ Delete student
router.delete("/students/:student_id", async (req, res) => {
  const { student_id } = req.params;

  try {
    await db.query("DELETE FROM students WHERE student_id = $1", [student_id]);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete student" });
  }
});

module.exports = router;
