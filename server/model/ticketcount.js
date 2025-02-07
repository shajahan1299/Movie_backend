const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventAvailabilitySchema = new Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event',
    },
    ticket_availability: {
        type: Number,
        required: true,
    }
});

// Create the EventAvailability model
const TicketCount = mongoose.model('TicketCount', eventAvailabilitySchema);

module.exports = TicketCount; 
