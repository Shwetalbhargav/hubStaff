const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

// Create Project
router.post('/', async (req, res) => {
  const { name, description, assignedUsers } = req.body;

  try {
    const project = new Project({ name, description, assignedUsers });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get Project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('assignedUsers');
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
