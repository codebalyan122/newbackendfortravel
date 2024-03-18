const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MidPackageSchema = new Schema({
  topCategoryName: {
    id: { type: mongoose.Schema.Types.ObjectId },
    name: String,
  },
  midCategoryName: {
    type: String,
  },
  placeForMidCategory: {
    type: [
      {
        value: { type: mongoose.Schema.Types.ObjectId },
        label: { type: String },
      },
    ],
    ref: "PlaceNameSchemas",
  },

  fileUrl: {
    type: String,
  },
  extractedText: {
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

const MidpackageSchemas = mongoose.model("MidTourpackages", MidPackageSchema);

module.exports = MidpackageSchemas;
