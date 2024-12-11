const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT
const User = require('../models/student');
const Moderator = require('../models/moderator');
const Student = require('../models/student');

const router = express.Router();

// Secret for signing JWT tokens
const JWT_SECRET = 'your_secret_key'; // Replace with a secure key

// Create Account for Students
router.post('/create-account', async (req, res) => {
    const { name, email, whatsappNumber, major, description, batchYear, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Student({
            name,
            email,
            whatsappNumber,
            major,
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
        // Check if it's a regular student
        const user = await User.findOne({ email: username });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

            // Generate JWT for student
            const token = jwt.sign(
                { id: user._id, name: user.name, role: 'student' },
                JWT_SECRET,
                { expiresIn: '30m' } // Token expires in 30 minutes
            );
            return res.status(200).json({ message: 'Login successful', role: 'student', token });
        }

        // Check if it's a moderator
        const moderator = await Moderator.findOne({ username: username });
        if (moderator) {
            const isMatch = await bcrypt.compare(password, moderator.password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

            // Generate JWT for moderator
            const token = jwt.sign(
                { id: moderator._id, name: moderator.username, role: 'moderator' },
                JWT_SECRET,
                { expiresIn: '30m' } // Token expires in 30 minutes
            );
            return res.status(200).json({ message: 'Login successful', role: 'moderator', token });
        }

        return res.status(404).json({ message: 'User not found' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Protected Route (Example: Dashboard)
router.get('/dashboard', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized. No token provided.' });

    const token = authHeader.split(' ')[1]; // Extract the token
    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
        res.status(200).json({
            message: 'Welcome, ${decoded.name}!',
            user: decoded,
        });
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
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
