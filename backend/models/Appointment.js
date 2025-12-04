const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientName: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorName: String,
  symptoms: String,
  diagnosis: String,
  prescription: String,
  status: { type: String, enum: ['pending', 'treated'], default: 'pending' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);