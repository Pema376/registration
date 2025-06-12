require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const db = require("./db"); // ✅ Required to query students

// Import table creation functions
const createUserTable = require("/models/user.js");
const createStudentTable = require("/models/student.js");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "frontend"));

// Static files (optional)
app.use(express.static(path.join(__dirname, "public")));

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");

app.use("/api", authRoutes); // User signup/login
app.use("/api/admin", adminRoutes); // Admin login POST route
app.use("/api/student", studentRoutes); // Student registration
app.use('/images', express.static(path.join(__dirname, 'frontend/images')));

// Page Rendering Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/admin/login", (req, res) => {
  res.render("admin/adminlogin");
});

app.get("/user/register", (req, res) => {
  res.render("user/register");
});

app.get("/logout", (req, res) => {
  // Optional: destroy session or clear cookies if using sessions
  res.redirect("/home"); // Redirect to home.ejs
});

// ✅ Dashboard route with student data
app.get("/dashboard", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM students ORDER BY student_id DESC"
    );
    res.render("admin/dashboard", { students: result.rows });
  } catch (err) {
    console.error("❌ Failed to fetch students:", err);
    res.status(500).send("Failed to load dashboard.");
  }
});

// Start server after creating tables
const startServer = async () => {
  try {
    await createUserTable();
    await createStudentTable();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error during startup:", error);
    process.exit(1);
  }
};

startServer();
