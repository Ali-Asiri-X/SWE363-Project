const express = require("express"); // Define Express
const mongoose = require("mongoose"); // Define Mongoose
const cors = require("cors"); // Import the cors package
const cookieParser = require('cookie-parser'); // Add cookie parser
const jwt = require('jsonwebtoken'); // Add JWT
const teamRoutes = require("./routes/team"); // Team Routes
const studentRoutes = require("./routes/studentRoutes"); // Student Routes
const { router: authRoutes, authMiddleware, JWT_SECRET } = require('./routes/authRoutes'); // Authentication Routes
const path = require('path'); // Import path module
// const teamSchemes = require("./routes/teamSchemes"); // Scheme Routes
// Connect to MongoDB
mongoose.connect("mongodb+srv://ziyad:Zzz%401234@testcluster.cpids.mongodb.net/team-formation-database", {
});
const database = mongoose.connection;

// Handle connection errors
database.on("error", (error) => console.log(error));

// Confirm successful connection
database.once("connected", () => console.log("Database Connected"));

// Initialize Express
const app = express(); // An instance of the express application

// Middleware order is important
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Add cookie parsing

// // Serve public assets that don't need protection
// app.use('/css', express.static(path.join(__dirname, 'public/css')));
// app.use('/js', express.static(path.join(__dirname, 'public/js')));
// app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Public routes
app.use('/auth', authRoutes);

// Add this middleware to protect HTML files
const protectHtmlRoutes = (req, res, next) => {
    // Allow public routes
    const publicFiles = ['/loginPage.html', '/createaccountpage.html'];
    if (publicFiles.includes(req.path)) {
        return next();
    }

    // Check if requesting HTML file
    if (req.path.endsWith('.html')) {
        const token = req.header('Authorization')?.replace('Bearer ', '') || 
                     req.cookies?.token;
        
        if (!token) {
            return res.redirect('/loginPage.html');
        }

        try {
            jwt.verify(token, JWT_SECRET);
            next();
        } catch (error) {
            res.clearCookie('token');
            return res.redirect('/loginPage.html');
        }
    } else {
        next();
    }
};

// Protect HTML routes
app.use(protectHtmlRoutes);

// Protected routes
app.use('/team', authMiddleware, teamRoutes);
app.use('/student', authMiddleware, studentRoutes);
// app.use('/scheme', authMiddleware, schemeRoutes);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to serve index.html for SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'loginPage.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
