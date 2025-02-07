const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    },
    seatNumber: {
        type: String,
    },
    ticketCount: {
        type: Number,
    },
    amount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    paymentTime: {
        type: Date,
        required: true
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

const Booking = mongoose.model('Event-Booking', bookingSchema);

module.exports = Booking;
