const express = require('express');
const router = express.Router();
const Subscription = require('../../model/subscription');

router.post('', async (req, res) => {
    try {
        const {
            userId,
            subscription_plan,
            orderId,
            paymentId,
            payment_date,
            plan_validity
        } = req.body;

        // Check if the user already has a subscription
        let subscription = await Subscription.findOne({ userId });

        if (subscription) {
            // If user already has a subscription, update the document
            subscription = await Subscription.findOneAndUpdate(
                { userId },
                { $set: { subscription_plan, orderId, paymentId, payment_date, plan_validity } },
                { new: true } // Return the updated document
            );
        } else {
            // If user doesn't have a subscription, create a new document
            subscription = new Subscription({
                userId,
                subscription_plan,
                orderId,
                paymentId,
                payment_date,
                plan_validity
            });
            await subscription.save();
        }

        res.status(201).json({ message: 'Subscription Plan Activated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
