const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { register, login } = require('../controllers/authController');
const { hireDoctor, getStats } = require('../controllers/adminController');
const { bookAppt, getHistory, treatPatient } = require('../controllers/apptController');
const User = require('../models/User');

// Auth
router.post('/register', register);
router.post('/login', login);

// Admin
router.post('/admin/hire', protect, adminOnly, hireDoctor);
router.get('/admin/stats', protect, adminOnly, getStats);

// Doctor/Patient
router.get('/doctors', protect, async (req, res) => res.json(await User.find({ role: 'doctor' })));
router.post('/book', protect, bookAppt);
router.get('/appointments', protect, getHistory);
router.put('/treat/:id', protect, treatPatient);

module.exports = router;