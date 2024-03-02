const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InterestSchema = new Schema({
  interestName: {
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

const InterestSchemas = mongoose.model("Interest", InterestSchema);

module.exports = InterestSchemas;
