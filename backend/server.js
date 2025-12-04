const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

// Seed Admin
const seed = async () => {
  if (!await User.findOne({ email: 'admin@medivault.com' })) {
    const pass = await bcrypt.hash('admin', 10);
    await User.create({ name: 'Admin', email: 'admin@medivault.com', password: pass, role: 'admin' });
    console.log('Admin Seeded');
  }
};
seed();

app.use('/api', apiRoutes);
app.listen(process.env.PORT, () => console.log('Server Running'));
