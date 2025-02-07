const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the ShortFilm
const ShortFilmSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Host',
    },
    shortfilm_title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    release_date: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    poster_url: {
        type: String,
    },
    file_url: {
        type: String,
    }
},
    {
        timestamps: true // Automatically add createdAt and updatedAt fields
    });

// Create the ShortFilm model
const ShortFilm = mongoose.model('ShortFilm', ShortFilmSchema);

module.exports = ShortFilm;
