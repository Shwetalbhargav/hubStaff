const express = require('express');
const Project = require('../models/Project');
const router = express.Router();
const nodemailer = require('nodemailer'); // Install Nodemailer if not already installed
const mongoose = require('mongoose');

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});

// Create Project
router.post('/', async (req, res) => {
  const { name, description, adminName, teamMembers, invitationEmails, deadline, tasks } = req.body;

  try {
    const project = new Project({
      name,
      description,
      adminName,
      teamMembers,
      invitationEmails,
      deadline,
      tasks
    });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all Projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get Project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update Project
router.put('/:id', async (req, res) => {
  const { name, description, adminName, teamMembers, invitationEmails, deadline, tasks } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, adminName, teamMembers, invitationEmails, deadline, tasks },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete Project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Invite Users via Email
router.post('/:id/invite', async (req, res) => {
  const { email } = req.body;
  const { id: projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Prepare the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Invitation to join the project: ${project.name}`,
      text: `Hi, you have been invited to join the project "${project.name}". Please contact ${project.adminName} for more details.`
    };

    // Send the email
    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Error sending email' });
      }

      // Update the project with the invited email
      project.invitationEmails.push(email);
      await project.save();

      res.json({ message: 'Invitation sent successfully', info });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
