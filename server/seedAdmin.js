import mongoose from 'mongoose';
import User from './models/User.js';

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/estore');
  const email = 'nguyenkhanhduy0114@gmail.com';
  let admin = await User.findOne({ email });
  if (!admin) {
    admin = new User({ name: 'Khánh Duy (Admin)', email, password: 'admin123', role: 'admin', status: 'Verified' });
  } else {
    admin.role = 'admin';
    admin.status = 'Verified';
    admin.password = 'admin123';
  }
  await admin.save();
  console.log('Admin account created/updated with password admin123');
  process.exit();
}
seed();
