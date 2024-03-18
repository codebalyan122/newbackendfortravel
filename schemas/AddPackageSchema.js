const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItineraryItemSchema = new Schema({
  day: String,
  itinerary: String,
});

const AddPackageSchema = new Schema({
  destinationName: {
    id: { type: mongoose.Schema.Types.ObjectId },
    name: String,
  },

  placeName: [
    {
      value: { type: mongoose.Schema.Types.ObjectId },
      label: String,
    },
  ],
  packageName: String,
  price: String,
  day: String,
  night: String,
  startingLocation: String,
  endingLocation: String,
  sameDay: String,
  featuredPhotoUrl: String,
  imagesUrl: String,
  packagePdfUrl: {},
  extractedText: String,
  itineraryData: [ItineraryItemSchema], // Define as an array of objects
  inclusions: [String],
  exclusionText: String,
  Relatedpackages: [
    {
      value: { type: mongoose.Schema.Types.ObjectId },
      label: String,
    },
  ],
  DestinationOption: [
    {
      value: { type: mongoose.Schema.Types.ObjectId },
      label: String,
    },
  ],
  midCategoryOptions: [
    {
      value: { type: mongoose.Schema.Types.ObjectId },
      label: String,
    },
  ],
  tripTypeSelect: [
    {
      value: { type: mongoose.Schema.Types.ObjectId },
      label: String,
    },
  ],
  regionSelect: [
    {
      value: { type: mongoose.Schema.Types.ObjectId },
      label: String,
    },
  ],
  isRecommended: String,
  isChardham: String,
  seoTitle: String,
  seoKeyword: String,
  seoDescription: String,
  newImagesUrl: [String],
  image: String,
});

const AddpackageSchemas = mongoose.model("AddpackagesSchema", AddPackageSchema);

module.exports = AddpackageSchemas;
