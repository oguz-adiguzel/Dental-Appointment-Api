const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require("slugify");

const doctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  certificates: {
    type: String,
    required: true,
  },
  awards: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
  appointments: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
  ], 
  unavailableDates: [],
});

doctorSchema.pre("validate", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
  });
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;