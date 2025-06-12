const express = require("express");
const router = express.Router();
const db = require("../db");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendVerificationEmail = require("../utils/sendEmails");

// ✅ Signup with email verification
router.post("/signup", async (req, res) => {
  const { full_name, email, password } = req.body;
  console.log("➡️ Incoming email:", email);

  try {
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    console.log("📋 existing.rows:", existing.rows); // ✅ Moved here

    if (existing.rows.length > 0)
      return res.status(400).json({ message: "Email already registered" });

    const token = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (full_name, email, password, verified, verification_token) VALUES ($1, $2, $3, $4, $5)",
      [full_name, email, hashedPassword, false, token]
    );

    await sendVerificationEmail(email, token);
    res.status(200).json({
      message:
        "Signup successful. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Email verification
router.get("/verify", async (req, res) => {
  const { token } = req.query;
  try {
    const user = await db.query(
      "SELECT * FROM users WHERE verification_token = $1",
      [token]
    );
    if (user.rows.length === 0) return res.status(400).send("Invalid token");

    await db.query(
      "UPDATE users SET verified = true, verification_token = NULL WHERE verification_token = $1",
      [token]
    );
    res.send("Email verified! You can now login.");
  } catch (err) {
    console.error("❌ Verification error:", err);
    res.status(500).send("Verification failed.");
  }
});

// ✅ Login only for verified users
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.verified)
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
