const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type:String,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
});

BlogSchema.pre("validate", function (next) {
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
  });
  next();
});

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;