const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  patientName: {
    type: String,
    required: true,
  },
  patientDepartment: {
    type: String,
    required: true,
  },
  patientSurName: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
  },
  patientPhone: {
    type: String,
    required: true,
  },
  patientAddress: {
    type: String,
    required: true,
  },
  patientMessage: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  confirm: {
    type: Boolean,
    default: false,
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;