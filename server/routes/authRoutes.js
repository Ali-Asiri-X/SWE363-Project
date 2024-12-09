const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

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
        // Check if user exists
        const user = await User.findOne({ email: username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Store user data in the session
        req.session.user = { id: user._id, name: user.name, role: user.role || 'student' };
        res.status(200).json({ message: 'Login successful' });
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

module.exports = router;
