const express = require('express');
const router = express.Router();
const LikeDislike = require('../../model/likedislikemodel');

// Route to add a like
router.post('', async (req, res) => {
    try {
        const { userId, shortFilmId, actionlike, actiondislike } = req.body;
        let likeDislikeEntry = await LikeDislike.findOne({ shortFilmId, userId });

        // If the entry does not exist, create a new one
        if (!likeDislikeEntry) {
            likeDislikeEntry = new LikeDislike({
                userId,
                shortFilmId,
                like: actionlike,
                unlike: actiondislike,
            });
        } else {
            // If the entry already exists, update it
            likeDislikeEntry.like = actionlike;
            likeDislikeEntry.unlike = actiondislike;
        }

        await likeDislikeEntry.save();

        res.json({ success: true, message: `Successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

router.post('/count', async (req, res) => {
    try {
        const { shortFilmId, userId } = req.body;

        // Count the number of likes and dislikes for the given short film
        const likeCount = await LikeDislike.countDocuments({ shortFilmId, like: 'like' });
        const dislikeCount = await LikeDislike.countDocuments({ shortFilmId, unlike: 'unlike' });

        // Check if the user has liked or unliked the short film
        const userAction = await LikeDislike.findOne({ shortFilmId, userId });
        let userLikeStatus = null;
        if (userAction) {
            userLikeStatus = userAction.like === 'like' ? 'liked' : (userAction.unlike === 'unlike' ? 'unliked' : null);
        }
        console.log(likeCount, dislikeCount, userLikeStatus)
        res.json({ success: true, likeCount, dislikeCount, userLikeStatus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;
