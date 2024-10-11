const mongoose = require('mongoose');

const screenshotSchema = new mongoose.Schema({
  
  image: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now }
});
/*
const screenshotSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

*/

const Screenshot = mongoose.model('Screenshot', screenshotSchema);

module.exports = Screenshot;
