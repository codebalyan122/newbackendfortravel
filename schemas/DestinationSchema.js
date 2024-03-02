const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
  DestinationName: {
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

const DestinationSchemas = mongoose.model(
  "DestinationSchema",
  DestinationSchema
);

module.exports = DestinationSchemas;
