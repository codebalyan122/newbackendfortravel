const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sliderSchema = new Schema({
  text: {
    type: String,
  },
  fileUrl: {
    type: String,
  },
});

const sliderSchemas = mongoose.model("sliderSchema", sliderSchema);

module.exports = sliderSchemas;
