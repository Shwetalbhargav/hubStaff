const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
app.get('/test', (req, res) => {
    res.send('Test route is working');
  });


// Middleware
app.use(express.json());
app.use(cors());



app.use((err, req, res, next) => {
    console.error('Error:', err.stack);  // Log full error details on the server
    res.status(500).json({ message: 'Server Error', error: err.message });  // Send the error message to Postman
  });

 
// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const activityRoutes = require('./routes/activity');
const screenshot = require('./routes/Screenshot');

// Routes middleware
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/activity', activityRoutes);
app.use('/screeshot', screenshot);

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  });
  
  process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
  });

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

 

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

