const express = require('express');
const router = express.Router();
const HostRegistration = require('../../model/hostmodel');
const Login = require('../../model/loginmodel');

// GET all hosts with their status
router.get('', async (req, res) => {
    console.log("haii")
    try {
        // Fetch all hosts
        const hosts = await HostRegistration.find();

        // Fetch login information for each host and append the status
        const hostsWithStatus = await Promise.all(hosts.map(async (host) => {
            const loginInfo = await Login.findOne({ _id: host._id }); // Assuming _id is used as a reference
            if (loginInfo) {
                return { ...host._doc, status: loginInfo.status };
            }
            // If no matching Login entry is found, set status to 'unknown' or any other default value.
            return { ...host._doc, status: 'unknown' };
        }));

        res.status(200).json(hostsWithStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
