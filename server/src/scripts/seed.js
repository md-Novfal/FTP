require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fto_db';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@fto.edu' });
  if (existing) {
    console.log('Admin user already exists, skipping.');
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash('admin@123', 10);

  await User.create({
    email: 'admin@fto.edu',
    phone: '0000000000',
    passwordHash,
    role: 'admin',
    status: 'active',
  });

  console.log('Admin user created: admin@fto.edu / admin@123');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
