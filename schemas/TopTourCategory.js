const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TopPackageSchema = new Schema({
  topCategoryName: {
    type: String,
  },
  file: {
    type: {},
  },
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
});

const ToppackageSchemas = mongoose.model("TopTourpackages", TopPackageSchema);

module.exports = ToppackageSchemas;
