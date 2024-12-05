const express = require("express"); // Define Express
const mongoose = require("mongoose"); // Define Mongoose
const cors = require("cors"); // Import the cors package

const teamRoutes = require("./routes/team"); // Get List Routes

mongoose.connect(""); // Initialize connection to the DB
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

app.use(express.json()); // Parse incoming request bodies in JSON format

app.use("/team", teamRoutes); // Connect to team route

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});