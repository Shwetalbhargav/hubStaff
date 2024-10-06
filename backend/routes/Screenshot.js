const express = require('express');
const mongoose = require('mongoose');
const Screenshot = require('../models/Screenshot');
const multer = require('multer'); // Middleware for handling image uploads
const router = express.Router();

// Configure Multer for file uploads
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 } // Set file size limit (5MB in this case)
});

// Route to create a new screenshot
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const screenshot = new Screenshot({
            projectId: req.body.projectId,
            userId: req.body.userId,
            image: req.file.buffer // Save image as buffer
        });

        await screenshot.save();
        res.status(201).send(screenshot);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Route to fetch all screenshots (or by project/user)
router.get('/', async (req, res) => {
    const { projectId, userId } = req.query;

    let query = {};
    if (projectId) query.projectId = projectId;
    if (userId) query.userId = userId;

    try {
        const screenshots = await Screenshot.find(query).populate('projectId userId');
        res.status(200).send(screenshots);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Route to fetch a screenshot by ID
router.get('/:id', async (req, res) => {
    try {
        const screenshot = await Screenshot.findById(req.params.id).populate('projectId userId');
        if (!screenshot) return res.status(404).send({ error: 'Screenshot not found' });

        res.status(200).send(screenshot);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Route to delete a screenshot by ID
router.delete('/:id', async (req, res) => {
    try {
        const screenshot = await Screenshot.findByIdAndDelete(req.params.id);
        if (!screenshot) return res.status(404).send({ error: 'Screenshot not found' });

        res.status(200).send({ message: 'Screenshot deleted' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
