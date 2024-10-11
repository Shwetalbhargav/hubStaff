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
            image: req.file.buffer, // Save image as buffer
        });

        await screenshot.save();
        res.status(201).send({ message: 'Screenshot saved successfully', id: screenshot._id });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Route to fetch all screenshots
router.get('/', async (req, res) => {
    try {
        const screenshots = await Screenshot.find();
        const formattedScreenshots = screenshots.map((screenshot) => ({
            id: screenshot._id,
            createdAt: screenshot.createdAt,
            image: screenshot.image.toString('base64'),
        }));
        res.status(200).send(formattedScreenshots);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Route to fetch a screenshot by ID
router.get('/:id', async (req, res) => {
    try {
        const screenshot = await Screenshot.findById(req.params.id);
        if (!screenshot) return res.status(404).send({ error: 'Screenshot not found' });
        res.set('Content-Type', 'image/png');
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

router.get('/png/:id', async (req, res) => {
    try {
        const screenshot = await Screenshot.findById(req.params.id);
        if (!screenshot) return res.status(404).send({ error: 'Screenshot not found' });

        res.set('Content-Type', 'image/png');
        res.send(screenshot.image);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});
module.exports = router;
