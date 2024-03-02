const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FaqSchema = new Schema({
  extractedText: {
    type: String,
  },
  title: {
    type: String,
  },
});

const FaqSchemas = mongoose.model("FAQSchema", FaqSchema);

module.exports = FaqSchemas;
