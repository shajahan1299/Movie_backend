const express = require('express');
const router = express.Router();
const TicketCount = require('./../../model/ticketcount');

// Define a route to get ticket availability by event ID
router.get('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        console.log(eventId);
        console.log("get countttt");
        // Find the TicketCount document for the specified event ID
        const ticketCount = await TicketCount.findOne({ eventId });
        console.log(ticketCount);
        if (!ticketCount) {
            return res.status(404).json({ message: 'Ticket count not found for the provided event ID' });
        }

        // Respond with the ticket availability
        res.json({ count: ticketCount.ticket_availability });
    } catch (error) {
        console.error('Error retrieving ticket availability:', error);
        res.status(500).json({ error: 'An error occurred while retrieving ticket availability' });
    }
});

module.exports = router;
