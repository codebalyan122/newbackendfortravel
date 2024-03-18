const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  // RegionName: {
  //   type: String,
  // },
  title: {
    type: String,
  },
  url: { type: String },
  // fileUrl: {
  //   type: String,
  // },
  postBy: {
    type: String,
  },
  extractedText: {
    type: String,
  },
  seoTitle: {
    type: String,
  },
  seoKeyword: { type: String },
  SeoDescription: { type: String },
  image: {
    type: String,
  },
});

const BlogSchemas = mongoose.model("BlogSchema", BlogSchema);

module.exports = BlogSchemas;
