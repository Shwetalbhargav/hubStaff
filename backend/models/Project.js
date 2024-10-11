const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  adminName: { type: String, required: true },
  teamMembers: [{ type: String }],
  invitationEmails: [{ type: String }],
  deadline: { type: Date, required: true },
  tasks: [{ 
    title: String,
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
