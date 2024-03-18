const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sliderSchema = new Schema({
  text: {
    type: String,
  },
  image: {
    type: String, // Store only the file name in the database
  },
  fileUrl: {
    type: String, // Store the relative path to the file
  },
});

const sliderSchemas = mongoose.model("sliderSchema", sliderSchema);

module.exports = sliderSchemas;
