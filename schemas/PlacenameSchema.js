const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaceNameSchema = new Schema({
  DestinationName: {
    id: { type: mongoose.Schema.Types.ObjectId },
    name: String,
  },
  Placename: {
    type: String,
  },
  showForHotel: {
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
  destinationName: {
    type: String,
  },
  image: {
    type: String,
  },
});

const PlaceNameSchemas = mongoose.model("PlaceNameSchema", PlaceNameSchema);

module.exports = PlaceNameSchemas;
