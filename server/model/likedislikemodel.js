const mongoose = require('mongoose');

// Define the schema
const likeDislikeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shortFilmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShortFilm',
        required: true
    },
    like: {
        type: String,
        default: 'null'
    },
    unlike: {
        type: String,
        default: 'null'
    }
});

// Create the model
const LikeDislike = mongoose.model('LikeDislike', likeDislikeSchema);

module.exports = LikeDislike;
