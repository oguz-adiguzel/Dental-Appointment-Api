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

// Zaman aralıklarını kontrol eden statik metod
// doctorSchema.statics.getAvailableTimeSlots = function (doctorId, date) {
//   const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  
//   return this.findById(doctorId).then((doctor) => {
//     if (!doctor) throw new Error('Doctor not found');
    
//     // Seçilen tarihte dolu olan saat dilimlerini bulma
//     const bookedSlots = doctor.appointments
//       .filter(app => app.date.toISOString().split('T')[0] === date)
//       .map(app => app.timeSlot);
    
//     // Boş olan saat dilimlerini geri döndür
//     return timeSlots.filter(slot => !bookedSlots.includes(slot));
//   });
// };

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;