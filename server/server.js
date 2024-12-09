const express = require("express"); // Define Express
const mongoose = require("mongoose"); // Define Mongoose
const cors = require("cors"); // Import the cors package
const session = require("express-session"); // Add session support
const teamRoutes = require("./routes/team"); // Get List Routes
const studentRoutes = require("./routes/studentRoutes"); // Get List Routes
const authRoutes = require("./routes/authRoutes"); // Add auth routes

mongoose.connect("mongodb+srv://ziyad:Zzz%401234@testcluster.cpids.mongodb.net/team-formation-database"); // Initialize connection to the DB
const database = mongoose.connection; // Connect to the database

// Listen for errors
database.on("error", (error) => {
  console.log(error);
});

// Listen for successful connection
database.once("connected", () => {
  console.log("Database Connected");
});

// Initialize Express
const app = express(); // An instance of the express js application

// Temporarily enable CORS for all origins
app.use(cors());

// Configure session middleware
app.use(
  session({
    secret: "your_secret_key", // Replace with a secure key
    resave: false,             // Prevent resaving unchanged sessions
    saveUninitialized: false,  // Don't save uninitialized sessions
    cookie: {                  // Configure session cookie settings
      maxAge: 1000 * 60 * 30, // 30 Minutes
    },
  })
);

app.use(express.json()); // Parse incoming request bodies in JSON format

app.use("/team", teamRoutes); // Connect to team route
app.use("/student", studentRoutes); // Connect to team route
app.use("/auth", authRoutes); // Connect to auth route
app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
