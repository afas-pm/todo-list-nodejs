// ======================================
// 🟢 Required Modules
// ======================================
const express = require("express");
const path = require("path");
const session = require("express-session");

// ✅ Use Render’s environment port or fallback for local development
const PORT = process.env.PORT || 4000;

// ✅ Database and Models
const db = require("./config/mongoose");
const User = require("./models/register");
const Login = require("./models/login");
const Dashboard = require("./models/dashboard");

const app = express();

// ======================================
// 🟢 Middleware
// ======================================
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "assets"))); // serve /assets

// ✅ Session setup (must come AFTER app is created)
app.use(
  session({
    secret: "todo-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// ======================================
// 🟢 View Engine
// ======================================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ======================================
// 🟢 Routes
// ======================================
app.use("/", require("./routes"));

// ======================================
// 🟣 Authentication Routes
// ======================================

// ✅ Render Register Page
app.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

// ✅ Render Login Page
app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// ✅ Register User
app.post("/register", async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
    });
    console.log("✅ User Registered:", user.email);
    res.redirect("/login");
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).send("Error creating user");
  }
});

// ✅ Handle Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      console.log("❌ Invalid credentials");
      return res.send("<h3>Invalid email or password. <a href='/login'>Try again</a></h3>");
    }

    console.log("✅ Login successful:", user.email);
    req.session.userName = user.name; // store user name in session
    res.redirect("/dashboard");
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).send("Login error");
  }
});

// ======================================
// 🟢 Dashboard Routes
// ======================================

// ✅ Dashboard (Protected)
app.get("/dashboard", async (req, res) => {
  try {
    if (!req.session.userName) return res.redirect("/login");

    const dashboard = await Dashboard.find({});
    res.render("dashboard", {
      title: "Dashboard",
      dashboard,
      userName: req.session.userName,
    });
  } catch (err) {
    console.error("❌ Error loading dashboard:", err);
    res.status(500).send("Error loading dashboard");
  }
});

// ✅ Completed Tasks
app.get("/completedtask", async (req, res) => {
  try {
    if (!req.session.userName) return res.redirect("/login");

    const dashboard = await Dashboard.find({ completed: true });
    res.render("completedtask", {
      title: "Completed Tasks",
      dashboard,
      userName: req.session.userName,
    });
  } catch (err) {
    console.error("❌ Error loading completed tasks:", err);
    res.status(500).send("Error loading completed tasks");
  }
});

// ✅ All Tasks
app.get("/alltask", async (req, res) => {
  try {
    if (!req.session.userName) return res.redirect("/login");

    const dashboard = await Dashboard.find({});
    res.render("alltask", {
      title: "All Tasks",
      dashboard,
      userName: req.session.userName,
    });
  } catch (err) {
    console.error("❌ Error loading all tasks:", err);
    res.status(500).send("Error loading all tasks");
  }
});

// ======================================
// 🟢 Task Management Routes
// ======================================

// ✅ Add New Task
app.post("/addtask", async (req, res) => {
  try {
    const newTask = await Dashboard.create({
      task: req.body.task,
      date: req.body.date,
      description: req.body.description,
      time: req.body.time,
      categoryChoosed: req.body.categoryChoosed,
    });
    console.log("✅ Task Created:", newTask.task);
    res.redirect("back");
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.redirect("back");
  }
});

// ✅ Mark Task as Completed
app.get("/complete-task", async (req, res) => {
  try {
    await Dashboard.findByIdAndUpdate(req.query.id, { completed: true });
    console.log("✅ Task Completed");
    res.redirect("back");
  } catch (err) {
    console.error("❌ Error completing task:", err);
    res.redirect("back");
  }
});

// ✅ Delete Task
app.get("/delete-task", async (req, res) => {
  try {
    await Dashboard.findByIdAndDelete(req.query.id);
    console.log("🗑️ Task Deleted");
    res.redirect("back");
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    res.redirect("back");
  }
});

// ======================================
// 🟢 Logout Route
// ======================================
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("❌ Logout error:", err);
    res.redirect("/login");
  });
});

// ======================================
// 🟢 Start Server
// ======================================
app.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Server error:", err);
  } else {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  }
});
