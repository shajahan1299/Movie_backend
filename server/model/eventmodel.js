const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Event schema
const eventSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Host',
    },
    event_name: {
        type: String,
        required: true,
    },
    event_type: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    event_date: {
        type: Date,
        required: true,
    },
    event_time: {
        type: String,
        required: true,
    },
    ticket_price: {
        type: Number,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
    ticket_availability: {
        type: Number,
        required: true,
    },
    seat_arrangement: {
        type: String,
        required: true,
    },
    poster_url: {
        type: String,
        required: true,
    }, // Assuming the poster_url is a string representing the URL of the poster image
    status: {
        type: String,
        required: true,
    },
    rows: {
        type: String,
        required: true,
    },
    cols: {
        type: String,
        required: true,
    }
});

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
