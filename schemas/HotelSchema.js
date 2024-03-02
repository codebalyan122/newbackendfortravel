const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
  // RegionName: {
  //   type: String,
  // },
  file: {
    type: {},
  },
  fileUrl: {
    type: String,
  },
  otherPhotos: {
    type: [String],
  },
  extractedText: {
    type: String,
  },
  destinationName: {
    type: String,
  },
  hotelStartingPrice: { type: String },
  Placename: { type: String },
  hotelName: { type: String },
});

const HotelSchemas = mongoose.model("HotelSchema", HotelSchema);

module.exports = HotelSchemas;
