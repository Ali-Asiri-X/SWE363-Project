const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Moderator = require('../models/moderator');

const router = express.Router();

// Create Account
router.post('/create-account', async (req, res) => {
    const { name, email, whatsappNumber, universityMajor, description, batchYear, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            whatsappNumber,
            universityMajor,
            description,
            batchYear,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // First check if it's a regular user
        const user = await User.findOne({ email: username });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

            req.session.user = { 
                id: user._id, 
                name: user.name, 
                role: 'student'
            };
            return res.status(200).json({ message: 'Login successful', role: 'student' });
        }

        // If not a regular user, check if it's a moderator
        const moderator = await Moderator.findOne({ username: username });
        if (moderator) {
            const isMatch = await bcrypt.compare(password, moderator.password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

            req.session.user = {
                id: moderator._id,
                name: moderator.username,
                role: 'moderator'
            };
            return res.status(200).json({ message: 'Login successful', role: 'moderator' });
        }

        // If neither user nor moderator is found
        return res.status(404).json({ message: 'User not found' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: 'Error logging out' });
        res.status(200).json({ message: 'Logout successful' });
    });
});

// Protected Route (Example: Dashboard)
router.get('/dashboard', (req, res) => {
    // Check if the session exists
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    // Send personalized data
    res.status(200).json({
        message: 'Welcome, ${req.session.user.name}!',
        user: req.session.user,
    });
});

// Add new endpoint to create moderator
router.post('/create-moderator', async (req, res) => {
    const { username, password, profileImage } = req.body;

    try {
        // Check if moderator already exists
        const existingModerator = await Moderator.findOne({ username });
        if (existingModerator) {
            return res.status(400).json({ message: 'Moderator already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newModerator = new Moderator({
            username,
            password: hashedPassword,
            profileImage
        });

        await newModerator.save();
        res.status(201).json({ message: 'Moderator created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all moderators
router.get('/moderators', async (req, res) => {
    try {
        const moderators = await Moderator.find({}, 'username profileImage');
        res.status(200).json(moderators);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
