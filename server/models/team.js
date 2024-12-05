const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamName: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  majors: {
    required: true,
    type: [String],
  },
});

module.exports = mongoose.model("Team", teamSchema);