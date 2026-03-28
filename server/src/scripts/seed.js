require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fto_db';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Look for any of the seed accounts (old or new)
  const existingByEmail = await User.findOne({ email: { $in: ['admin@fto.edu', 'superadmin@fto.edu'] } });
  const existingByPhone = await User.findOne({ phone: '0000000000' });
  
  const existing = existingByEmail || existingByPhone;

  if (existing) {
    if (existing.role !== 'super_admin' || existing.username !== 'superadmin' || existing.email !== 'superadmin@fto.edu') {
      existing.username = 'superadmin';
      existing.email = 'superadmin@fto.edu';
      existing.role = 'super_admin';
      existing.status = 'active';
      await existing.save();
      console.log('Seed user successfully migrated/updated to super_admin');
    } else {
      console.log('Super Admin user already exists');
    }
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash('admin@123', 10);

  await User.create({
    username: 'superadmin',
    email: 'superadmin@fto.edu',
    phone: '0000000000',
    passwordHash,
    role: 'super_admin',
    status: 'active',
  });

  console.log('Super Admin user created: superadmin / admin@123');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
