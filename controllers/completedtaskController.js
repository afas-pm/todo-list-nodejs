const db = require('../config/mongoose');
const Dashboard = require('../models/dashboard');
const User = require('../models/register');

module.exports.completedtask = async function (req, res) {
  try {
    // Get all completed tasks
    const data = await Dashboard.find({ completed: true });

    // Get the currently logged-in user (or fallback for testing)
    const user = await User.findOne({ email: req.session?.userEmail || "ankitvis609@gmail.com" });

    console.log("✅ User:", user?.name);

    return res.render("completedtask", {
      title: "Completed Tasks",
      name: user ? user.name : "User",
      dashboard: data
    });
  } catch (err) {
    console.error("❌ Error loading completed tasks:", err);
    res.status(500).send("Error loading completed tasks");
  }
};
