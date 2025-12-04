const Appointment = require('../models/Appointment');
const User = require('../models/User');

const bookAppt = async (req, res) => {
  const { doctorId, symptoms } = req.body;
  const doctor = await User.findById(doctorId);
  await Appointment.create({
    patientId: req.user.id,
    patientName: req.user.name,
    doctorId,
    doctorName: doctor.name,
    symptoms
  });
  res.status(201).json({ message: 'Booked' });
};

const getHistory = async (req, res) => {
  const history = await Appointment.find({ $or: [{ patientId: req.user.id }, { doctorId: req.user.id }] });
  res.json(history);
};

const treatPatient = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
if (appointment.doctorId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to treat this patient' });
  }

  appointment.diagnosis = req.body.diagnosis;
  appointment.prescription = req.body.prescription;
  appointment.status = 'treated';
  
  const updatedAppointment = await appointment.save();
  res.json(updatedAppointment);
};

module.exports = { bookAppt, getHistory, treatPatient };