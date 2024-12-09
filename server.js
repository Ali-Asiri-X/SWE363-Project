// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const teamRoutes = require('./routes/team');
const studentRoutes = require('./routes/studentRoutes');

// Middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://ziyad:Zzz%401234@testcluster.cpids.mongodb.net/team-formation-database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('connected', () => {
    console.log('Database Connected');
});

// Define Mongoose Schema
const teamSchemeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    createdBy: String // Role: Moderator, Student
});

const TeamScheme = mongoose.model('TeamScheme', teamSchemeSchema);

// Middleware to validate roles
function roleMiddleware(allowedRoles) {
    return (req, res, next) => {
        const userRole = req.headers['role']; // Expecting role in request header
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
}

// Routes for TeamScheme operations
// Moderator: Add a team scheme
app.post('/team/moderator/add', roleMiddleware(['Moderator']), async (req, res) => {
    try {
        const { name, description } = req.body;
        const newScheme = new TeamScheme({ name, description, createdBy: 'Moderator' });
        await newScheme.save();
        res.status(201).json({ message: 'Team scheme added successfully', scheme: newScheme });
    } catch (error) {
        res.status(500).json({ message: 'Error adding team scheme', error });
    }
});

// Admin: Delete a team scheme
app.delete('/team/admin/delete/:id', roleMiddleware(['Admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const deletedScheme = await TeamScheme.findByIdAndDelete(id);
        if (!deletedScheme) {
            return res.status(404).json({ message: 'Team scheme not found' });
        }
        res.status(200).json({ message: 'Team scheme deleted successfully', scheme: deletedScheme });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting team scheme', error });
    }
});

// Student: Create a team scheme
app.post('/team/student/create', roleMiddleware(['Student']), async (req, res) => {
    try {
        const { name, description } = req.body;
        const newScheme = new TeamScheme({ name, description, createdBy: 'Student' });
        await newScheme.save();
        res.status(201).json({ message: 'Team scheme created successfully', scheme: newScheme });
    } catch (error) {
        res.status(500).json({ message: 'Error creating team scheme', error });
    }
});

// Connect additional routes
app.use('/team', teamRoutes);
app.use('/student', studentRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});

