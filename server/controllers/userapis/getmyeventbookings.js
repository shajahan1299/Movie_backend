const express = require('express');
const router = express.Router();
const Booking = require('../../model/eventbooking'); // Assuming your model is named Booking
const Event = require('../../model/eventmodel'); // Assuming your event model is named Event
const Host = require('../../model/hostmodel'); // Assuming your host model is named Host

// Route to get all booking details for a specific user
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find all bookings for the given userId and populate associated event details
        const bookings = await Booking.find({ userId }).populate('eventId').sort({ createdAt: -1 });
        console.log(bookings);

        // If you want to append additional details like organizer, location, event starts at, booking date, and poster url
        const enrichedBookings = await Promise.all(bookings.map(async (booking) => {
            // Find event details
            const eventDetails = await Event.findById(booking.eventId);
            // Find host details
            const hostDetails = await Host.findById(eventDetails.userId);
            return {
                ...booking.toJSON(),
                organizer: hostDetails.hostname, // Append organizer's email

                location: eventDetails.location,
                eventStartsAt: eventDetails.event_time,
                bookingDate: eventDetails.event_date,
                posterUrl: eventDetails.poster_url
            };
        }));
        console.log(enrichedBookings);
        res.json(enrichedBookings);
    } catch (error) {
        console.error('Error fetching booking details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
