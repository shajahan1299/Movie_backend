const express = require('express');
const router = express.Router();
const ShortFilm = require('../../model/filmmodel');
const fs = require('fs/promises'); // Using fs.promises to utilize promises for file operations
const path = require('path');

router.get('/:userId', async (req, res) => {
    try {

        const userId = req.params.userId;
        const shortFilms = await ShortFilm.find({ userId });

        // Send the short films as the response
        res.status(200).json({ shortFilms });
    } catch (error) {
        // Send error response
        console.error('Error fetching short films:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
});

router.delete('/:filmId', async (req, res) => {
    try {
        const filmId = req.params.filmId;

        // Find the short film by its ID
        const shortFilm = await ShortFilm.findById(filmId);

        if (!shortFilm) {
            return res.status(404).json({ message: 'Short film not found' });
        }

        // Remove associated poster image and video file from the public folder
        await Promise.all([
            fs.unlink(path.join('public/film_poster', shortFilm.poster_url)), // Delete poster image
            fs.unlink(path.join('public/film_videos', shortFilm.file_url)) // Delete video file
        ]);

        // Delete the short film from the database
        await ShortFilm.findByIdAndDelete(filmId);

        // Send success response
        res.status(200).json({ message: 'Short film deleted successfully' });
    } catch (error) {
        // Send error response
        console.error('Error deleting short film:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
});



module.exports = router;
