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

module.exports = router;
