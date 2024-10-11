const express = require('express');
const ActivityLog = require('../models/ActivityLog');
const router = express.Router();

// Log Activity
router.post('/', async (req, res) => {
  const { projectId, userId, mouseActivity, keyboardActivity } = req.body;

  try {
    const activityLog = new ActivityLog({
      projectId,
      userId,
      mouseActivity,
      keyboardActivity,
    });
    await activityLog.save();
    res.json(activityLog);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all activity logs
router.get('/', async (req, res) => {
  try {
    const activityLogs = await ActivityLog.find();
    res.json(activityLogs);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
