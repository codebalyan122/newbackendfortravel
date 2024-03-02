const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddPackageSchema = new Schema({
  destinationName: {
    type: String,
  },
  placeName: {
    type: [
      {
        value: { type: mongoose.Schema.Types.ObjectId },
        label: { type: String },
      },
    ],
  },
  packageName: {
    type: String,
  },
  price: {
    type: String,
  },
  day: {
    type: String,
  },
  night: {
    type: String,
  },
  startingLocation: {
    type: String,
  },
  endingLocation: {
    type: String,
  },
  sameDay: {
    type: String,
  },
  featuredPhotoUrl: { type: String },
  imagesUrl: { type: String },
  packagePdfUrl: {
    type: {},
  },
  extractedText: {
    type: String,
  },
  itineraryData: {
    type: [{}],
  },
  inclusions: [String],
  exclusionText: { type: String },

  Relatedpackages: {
    type: [{ value: [{}], label: { type: String } }],
  },
  DestinationOption: {
    type: [{ value: [{}], label: { type: String } }],
  },
  midCategoryOptions: {
    type: [{ value: [{}], label: { type: String } }],
  },
  tripTypeSelect: {
    type: [{ value: [{}], label: { type: String } }],
  },
  regionSelect: {
    type: [{ value: [{}], label: { type: String } }],
  },
  isRecommended: {
    type: String,
  },
  isChardham: {
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
  newImagesUrl: {
    type: [String],
    required: false,
  },
});

const AddpackageSchemas = mongoose.model("AddpackagesSchema", AddPackageSchema);

module.exports = AddpackageSchemas;
