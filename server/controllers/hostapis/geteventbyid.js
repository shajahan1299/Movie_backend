// routes/events.js

const express = require('express');
const router = express.Router();
const Event = require('../../model/eventmodel'); // Adjust the path as needed

// Route to get events by userId
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const events = await Event.find({ userId }).sort({ event_date: -1 }); // Filter events by userId
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
