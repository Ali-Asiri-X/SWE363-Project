const express = require("express"); // Define Express
const mongoose = require("mongoose"); // Define Mongoose
const cors = require("cors"); // Import the cors package
const teamRoutes = require("./routes/team"); // Team Routes
const studentRoutes = require("./routes/studentRoutes"); // Student Routes
const authRoutes = require("./routes/authRoutes"); // Authentication Routes

// Connect to MongoDB
mongoose.connect("mongodb+srv://ziyad:Zzz%401234@testcluster.cpids.mongodb.net/team-formation-database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const database = mongoose.connection;

// Handle connection errors
database.on("error", (error) => console.log(error));

// Confirm successful connection
database.once("connected", () => console.log("Database Connected"));

// Initialize Express
const app = express(); // An instance of the express application

// Enable CORS for all origins
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Connect routes
app.use("/team", teamRoutes); // Team routes
app.use("/student", studentRoutes); // Student routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/scheme", teamSchemes); // Scheme routes

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server Started at ${3000}');
});
