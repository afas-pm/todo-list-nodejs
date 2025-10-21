const db = require('../config/mongoose');
const Dashboard = require('../models/dashboard');

module.exports.alltask = async function (req, res) {
  try {
    // 🧠 If user not logged in, redirect to login page
    if (!req.session.userName) {
      return res.redirect('/login');
    }

    // ✅ Fetch all tasks
    const data = await Dashboard.find({});

    // ✅ Render page with session user name
    return res.render('alltask', {
      title: "All Tasks",
      name: req.session.userName,
      dashboard: data
    });
  } catch (err) {
    console.error('❌ Error loading all tasks:', err);
    return res.status(500).send('Error loading all tasks');
  }
};
