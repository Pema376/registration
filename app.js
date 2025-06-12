require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const db = require("./db"); // ✅ Required to query students

// ✅ Corrected relative paths to your models inside frontend/models/
const createUserTable = require("./frontend/models/user.js");
const createStudentTable = require("./frontend/models/student.js");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "frontend"));

// Static files (optional)
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "frontend/images")));

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");

app.use("/api", authRoutes); // User signup/login
app.use("/api/admin", adminRoutes); // Admin login
app.use("/api/student", studentRoutes); // Student registration

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
  res.redirect("/home");
});

// ✅ Admin dashboard route that shows all registered students
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

// Start the server after creating tables
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
