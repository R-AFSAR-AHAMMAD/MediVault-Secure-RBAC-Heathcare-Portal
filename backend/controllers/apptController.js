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
  await Appointment.findByIdAndUpdate(req.params.id, {
    diagnosis: req.body.diagnosis,
    prescription: req.body.prescription,
    status: 'treated'
  });
  res.json({ message: 'Treated' });
};

module.exports = { bookAppt, getHistory, treatPatient };