const express = require('express');
const router = express.Router();
const ShortFilm = require('../../model/filmmodel');

router.get('', async (req, res) => {
    try {
        const shortFilms = await ShortFilm.find();
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

module.exports = router;
