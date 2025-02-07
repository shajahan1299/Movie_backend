const express = require('express');
const router = express.Router();
const Booking = require('../../model/eventbooking'); // Import your Mongoose EventBooking model
const TicketCount = require('./../../model/ticketcount');

// Define a route for booking an event
router.post('', async (req, res) => {
    try {
        console.log(req.body);
        const {
            userId,
            event_id,
            selectedSeats,
            ticketQuantity,
            amount,
            paymentId,
            orderId,
        } = req.body;

        const paymentTime = new Date();

        if (selectedSeats !== "") {
            const bookingPromises = selectedSeats.map(async (seat) => {
                const newBooking = new Booking({
                    userId: userId,
                    eventId: event_id,
                    status: 'Confirmed',
                    seatNumber: seat,
                    ticketCount: 1, // Assuming each seat is for 1 ticket
                    amount: amount / 100,
                    paymentId: paymentId,
                    razorpayOrderId: orderId,
                    paymentTime: paymentTime
                });

                // Save the booking object to the database
                const savedBooking = await newBooking.save();
                return savedBooking.seatNumber; // Return the booked seat number
            });

            // Wait for all booking promises to resolve
            const savedSelectedSeats = await Promise.all(bookingPromises);
            const selectedSeatsString = savedSelectedSeats.join(',');
            res.status(201).json({ "BookedSeats": selectedSeatsString, status: true });
        } else {
            const newBooking = new Booking({
                userId: userId,
                eventId: event_id,
                status: 'Confirmed',
                seatNumber: '',
                ticketCount: ticketQuantity, // Assuming each seat is for 1 ticket
                amount: amount / 100,
                paymentId: paymentId,
                razorpayOrderId: orderId,
                paymentTime: paymentTime
            });

            // Save the booking object to the database
            const savedBooking = await newBooking.save();

            // Reduce the ticket count in TicketCount model
            await TicketCount.findOneAndUpdate({ eventId: event_id }, { $inc: { ticket_availability: -ticketQuantity } }
            );

            res.status(201).json({ "BookedSeats": '', status: true });
        }
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: 'An error occurred while creating the booking' });
    }
});

module.exports = router;
