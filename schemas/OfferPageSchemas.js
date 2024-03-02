const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  fileUrl: {
    type: String,
  },

  offername: {
    type: String,
  },
});

const OfferSchemas = mongoose.model("OfferSchema", OfferSchema);

module.exports = OfferSchemas;
