const mongoose = require('mongoose');

const hostRegistrationSchema = new mongoose.Schema({
    hostname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
});

const HostRegistration = mongoose.model('Host', hostRegistrationSchema);

module.exports = HostRegistration;
