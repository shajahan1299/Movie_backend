const express = require("express");
const router = express.Router();
const Event = require('../../model/eventmodel'); // Adjust the path based on your project structure

router.post('', async (req, res) => {
    console.log("here");
    console.log("postevents");

    try {
        // Extract data from the request body
        const eventData = req.body;

        // Create a new event instance using the Event model
        const newEvent = new Event({
            event_name: eventData.event_name,
            event_type: eventData.event_type,
            location: eventData.location,
            event_date: eventData.event_date,
            event_time: eventData.event_time,
            ticket_price: eventData.ticket_price,
            organizer: eventData.organizer,
            description: eventData.description,
            ticket_availability: eventData.ticket_availability,
            seat_arrangement: eventData.seat_arrangement,
            poster_url: eventData.poster_url,
        });

        // Save the event to the database
        const savedEvent = await newEvent.save();

        return res.json({ message: "Event Added Successfully", event: savedEvent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

