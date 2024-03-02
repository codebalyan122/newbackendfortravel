const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingSchema = new Schema({
  email: {
    type: String,
  },
  contact_Number: {
    type: String,
  },
  whatsapp_Number: {
    type: String,
  },
  address: {
    type: String,
  },
  footer_copyRight: {
    type: String,
  },
  companyName: {
    type: String,
  },
  terms: {
    type: Boolean,
  },
  facebookLink: {
    type: String,
  },
  twitter: {
    type: String,
  },
  instagram: {
    type: String,
  },
  youtube: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  image: {
    type: String,
  },
});

const settingSchemas = mongoose.model("settingSchema", settingSchema);

module.exports = settingSchemas;
