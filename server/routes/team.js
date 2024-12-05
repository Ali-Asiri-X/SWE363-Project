const express = require("express");
const router = express.Router();

const TeamModal = require("../models/team");

//Handle adding new items
router.post("/add", async (req, res) => {
  const data = new TeamModal({
    teamName: req.body.teamName,
    description: req.body.description,
    majors: req.body.majors,
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to handle creating multiple teams
router.post("/bulk", async (req, res) => {
    try {
      const teams = req.body;
      const createdTeams = await TeamModal.insertMany(teams);
      res.status(201).json(createdTeams);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

//Get All Items
router.get("/all", async (req, res) => {
  try {
    const data = await TeamModal.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
