const express = require('express');
const router = express.Router();
const multer = require('multer');
const ShortFilm = require('../../model/filmmodel');
const path = require("path");

// Multer configuration to handle image files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'poster_url') {
            cb(null, 'public/film_poster'); // Destination folder for image uploads
        } else if (file.fieldname === 'file_url') {
            cb(null, 'public/film_videos'); // Destination folder for video uploads
        } else {
            cb(new Error('Invalid fieldname'));
        }
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // Get file extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate unique suffix
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Set file name with unique suffix and original extension
    }
});

const upload = multer({ storage: storage });

router.post('/addshortfilm', upload.fields([{ name: 'poster_url', maxCount: 1 }, { name: 'file_url', maxCount: 1 }]), async (req, res) => {
    try {
        // Extract form data
        const {
            userId,
            shortfilm_title,
            genre,
            director,
            release_date,
            duration,
            description,
            language
        } = req.body;

        // Extract file paths
        const posterUrl = path.basename(req.files['poster_url'][0].path); // Extract only the filename for the poster
        const fileUrl = path.basename(req.files['file_url'][0].path); // Extract only the filename for the video

        // Create new ShortFilm document
        const newShortFilm = await ShortFilm.create({
            userId,
            shortfilm_title,
            genre,
            director,
            release_date,
            duration,
            description,
            language,
            poster_url: posterUrl,
            file_url: fileUrl
        });

        // Send success response
        res.status(200).json({
            message: 'ShortFilm created successfully',
            data: newShortFilm
        });
    } catch (error) {
        // Send error response
        console.error('Error creating ShortFilm:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
});

module.exports = router;
