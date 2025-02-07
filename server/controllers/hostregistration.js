const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Login = require('../model/loginmodel');
const HostRegistration = require('../model/hostmodel');
const nodemailer = require("nodemailer");
require("dotenv").config();

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailService = process.env.EMAIL_SERVICE;

const transporter = nodemailer.createTransport({
    service: emailService, // e.g., 'Gmail', 'Yahoo', etc.
    auth: {
        user: emailUser,
        pass: emailPassword,
    },
});


const sendBlockEmail = async (toEmail, userId) => {// Function to generate activation token
    const activationLink = `http://localhost:5000/api/activate-user?id=${userId}`;

    const mailOptions = {
        from: emailUser,
        to: toEmail,
        subject: "Welcome to MovieVerse",
        text: `Hello MovieVerse User,
        
        Welcome to MovieVerse! To activate your account, please click on the following link:
        ${activationLink}
        
        Best regards,
        The MovieVerse Team`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully");
        return true; // Return true to indicate success
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return false; // Return false to indicate failure
    }
};

// Function to generate activation token (example implementation)
function generateActivationToken() {
    // Generate token logic here, for example:
    return Math.random().toString(36).substr(2); // Example of a random alphanumeric token
}


router.post('', async (req, res) => {
    try {
        // Destructure relevant data from the request body
        const { name, email, phone, password, confirmPassword } = req.body;
        const newHost = new HostRegistration({
            hostname: name,
            email: email,
            contactNumber: phone,
        });

        // Save the host registration
        const savedHost = await newHost.save();

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const emailsend = await sendBlockEmail(email, savedHost._id);

        // Create a new login entry with the host's _id as the unique identifier
        const newLogin = new Login({
            _id: savedHost._id,
            email,
            password: hashedPassword,
            usertype: "host",
            status: "Not-Verified",
        });

        // Save the login information
        const savedLogin = await newLogin.save();

        // Check if both host registration and login information are saved successfully
        if (savedHost && savedLogin) {
            return res.status(201).json({ message: 'Registration Successful. Please verify your email.', savedHost, navigation: true });
        }
    } catch (error) {
        if (error.code === 11000) {
            console.log("Email Duplication");
            return res.status(201).json({ message: 'mail-Duplication', navigation: false });
        } else {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
});

module.exports = router;
