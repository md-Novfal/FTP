require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Application = require('../models/application.model');
const Commission = require('../models/commission.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fto_db';

const STATUSES = [
  'apply', 'under_review', 'college_submitted', 'offer_letter',
  'interview', 'admission_letter', 'ministry_order', 'visa', 'arrived',
];

const UNIVERSITIES = [
  { university: 'Kazan Federal University', course: 'MBBS', country: 'Russia' },
  { university: 'Sechenov University', course: 'MBBS', country: 'Russia' },
  { university: 'Tbilisi State Medical University', course: 'MBBS', country: 'Georgia' },
  { university: 'Kyiv Medical University', course: 'MBBS', country: 'Ukraine' },
  { university: 'Poznan University of Medical Sciences', course: 'MBBS', country: 'Poland' },
  { university: 'University of Debrecen', course: 'MBBS', country: 'Hungary' },
  { university: 'Peoples Friendship University', course: 'MBBS', country: 'Russia' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const hash = (pw) => bcrypt.hash(pw, 10);

  // Create agencies
  const agencyData = [
    { email: 'agency1@fto.edu', phone: '9000000001', name: 'Global Edu Agency' },
    { email: 'agency2@fto.edu', phone: '9000000002', name: 'Bright Future Agency' },
    { email: 'agency3@fto.edu', phone: '9000000003', name: 'MedPath Consultancy' },
  ];

  const agencies = [];
  for (const a of agencyData) {
    let user = await User.findOne({ email: a.email });
    if (!user) {
      user = await User.create({
        username: a.email.split('@')[0],
        email: a.email,
        phone: a.phone,
        passwordHash: await hash('agency@123'),
        role: 'agency',
        status: 'active',
      });
      console.log(`Agency created: ${a.email}`);
    } else if (!user.username) {
      user.username = a.email.split('@')[0];
      await user.save();
      console.log(`Agency updated with username: ${user.username}`);
    }
    agencies.push(user);
  }

  // Create students
  const studentNames = [
    { name: 'Rahul Sharma', email: 'rahul@student.com', phone: '8000000001' },
    { name: 'Priya Verma', email: 'priya@student.com', phone: '8000000002' },
    { name: 'Arjun Singh', email: 'arjun@student.com', phone: '8000000003' },
    { name: 'Neha Gupta', email: 'neha@student.com', phone: '8000000004' },
    { name: 'Vikram Reddy', email: 'vikram@student.com', phone: '8000000005' },
    { name: 'Ananya Das', email: 'ananya@student.com', phone: '8000000006' },
  ];

  const students = [];
  for (const s of studentNames) {
    let user = await User.findOne({ email: s.email });
    if (!user) {
      user = await User.create({
        username: s.email.split('@')[0],
        email: s.email,
        phone: s.phone,
        passwordHash: await hash('student@123'),
        role: 'student',
        status: 'active',
      });
      console.log(`Student created: ${s.email}`);
    } else if (!user.username) {
      user.username = s.email.split('@')[0];
      await user.save();
      console.log(`Student updated with username: ${user.username}`);
    }
    students.push(user);
  }

  // Create applications
  const existingApps = await Application.countDocuments();
  if (existingApps === 0) {
    const apps = [];
    for (let i = 0; i < students.length; i++) {
      const uni = UNIVERSITIES[i % UNIVERSITIES.length];
      const status = STATUSES[i % STATUSES.length];
      const agency = agencies[i % agencies.length];
      const app = await Application.create({
        userId: students[i]._id,
        agencyId: agency._id,
        universityName: uni.university,
        courseName: uni.course,
        countryName: uni.country,
        status,
        submittedAt: new Date(Date.now() - i * 5 * 24 * 60 * 60 * 1000),
      });
      apps.push(app);
      console.log(`Application created: ${students[i].email} → ${uni.university} [${status}]`);
    }

    // Create commissions for arrived/visa applications
    for (const app of apps) {
      if (['arrived', 'visa', 'admission_letter'].includes(app.status)) {
        const existing = await Commission.findOne({ applicationId: app._id });
        if (!existing) {
          await Commission.create({
            agencyId: app.agencyId,
            applicationId: app._id,
            amount: Math.floor(Math.random() * 30000) + 20000,
            status: app.status === 'arrived' ? 'paid' : 'pending',
          });
          console.log(`Commission created for application ${app._id}`);
        }
      }
    }
  } else {
    console.log(`Skipping applications — ${existingApps} already exist`);
  }

  console.log('\nDemo seed complete!');
  console.log('Agencies: agency1 / agency@123');
  console.log('Students: rahul / student@123');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
