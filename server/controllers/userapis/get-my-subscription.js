const express = require('express');
const router = express.Router();
const Subscription = require('../../model/subscription');

// GET route to retrieve subscription plan by userId
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const subscription = await Subscription.findOne({ userId });

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found for the given user ID' });
        }

        // Check if validity is less than today's date
        const validityDate = new Date(subscription.plan_validity);
        const currentDate = new Date();

        if (validityDate < currentDate) {
            // Update subscription plan to basic
            subscription.subscription_plan = 'basic';
            await subscription.save();
        }

        res.status(200).json({
            subscription_plan: subscription.subscription_plan,
            validity: subscription.plan_validity
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

