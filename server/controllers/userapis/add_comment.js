const express = require('express');
const router = express.Router();
const Comment = require('../../model/commentmodel');

// Define a route to post a comment
router.post('', async (req, res) => {
    try {
        const { userId, filmid, comment } = req.body;
        const newComment = new Comment({
            userId: userId,
            filmid: filmid,
            comment: comment,
        });
        const savedComment = await newComment.save();

        return res.status(201).json({ success: true, comment: savedComment });
    } catch (error) {
        console.error('Error posting comment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const filmid = req.params.id;
        console.log(filmid)
        // Validate the filmid
        if (!filmid) {
            return res.status(400).json({ error: 'Missing filmid parameter.' });
        }

        // Fetch comments based on the provided filmid
        const comments = await Comment.find({ filmid: filmid })
            .populate('userId')
            .sort({ updatedAt: -1 });

        return res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        console.log(req.params)
        const commentId = req.params.id;

        // Validate the commentId
        if (!commentId) {
            return res.status(400).json({ error: 'Missing comment ID parameter.' });
        }

        // Find the comment by ID and delete it
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        return res.status(200).json({ success: true, message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
