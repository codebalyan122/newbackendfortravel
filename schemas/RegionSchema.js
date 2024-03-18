const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RegionSchema = new Schema({
  RegionName: {
    type: String,
  },
  // file: {
  //   type: {},
  // },
  fileUrl: {
    type: String,
  },
  extractedText: {
    type: String,
  },
  showOnMenu: {
    type: String,
  },
  seoTitle: {
    type: String,
  },
  seoKeyword: {
    type: String,
  },
  seoDescription: {
    type: String,
  },
  image: {
    type: String,
  },
});

const RegionSchemas = mongoose.model("RegionSchema", RegionSchema);

module.exports = RegionSchemas;
