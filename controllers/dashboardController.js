const Dashboard = require('../models/dashboard');

// Render the dashboard page
module.exports.dashboard = async function (req, res) {
  try {
    // 🔒 Redirect if not logged in
    if (!req.session || !req.session.userName) {
      return res.redirect('/login');
    }

    // Get all dashboard tasks
    const data = await Dashboard.find({});

    // Render the dashboard page with user's name
    return res.render('dashboard', {
      title: 'Dashboard',
      dashboard: data,
      userName: req.session.userName || 'User',
    });
  } catch (err) {
    console.error('❌ Error loading dashboard:', err);
    return res.status(500).send('Error loading dashboard');
  }
};
