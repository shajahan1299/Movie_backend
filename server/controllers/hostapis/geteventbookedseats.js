const express = require('express');
const router = express.Router();
const Booking = require('../../model/eventbooking'); // Import your Mongoose Booking model

// Define a route for fetching booked seats
router.get('', async (req, res) => {
    try {
        const { event_id } = req.query;

        // Use Mongoose to find bookings matching the provided parameters
        const bookings = await Booking.find({
            eventId: event_id // Ensure the field name matches the model
        });

        // Extract selectedSeats from the bookings and flatten them into a single array
        const allSelectedSeats = bookings.flatMap(booking => booking.seatNumber);

        // Convert the array to a comma-separated string
        const BookedSeats = allSelectedSeats.join(',');
        console.log(BookedSeats);
        res.status(200).json({ BookedSeats: BookedSeats });
    } catch (error) {
        console.error("Error fetching booked seats:", error);
        res.status(500).json({ error: 'Could not fetch booked seats.' });
    }
});

module.exports = router;
