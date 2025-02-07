const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        filmid: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'ShortFilm',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
