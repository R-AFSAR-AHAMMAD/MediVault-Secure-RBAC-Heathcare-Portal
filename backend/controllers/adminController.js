const User = require('../models/User');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');

const hireDoctor = async (req, res) => {
  const { name, email, password, specialization } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPassword, specialization, role: 'doctor' });
  res.status(201).json({ message: 'Doctor hired' });
};

const getStats = async (req, res) => {
  const doctors = await User.countDocuments({ role: 'doctor' });
  const patients = await User.countDocuments({ role: 'patient' });
  const active = await Appointment.countDocuments({ status: 'pending' });
  res.json({ doctors, patients, active });
};

module.exports = { hireDoctor, getStats };