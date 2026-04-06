import dns from 'node:dns';
dns.setServers(['8.8.8.8']); // force Google DNS for SRV lookup

import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function seedUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Create admin if not exists
    const email = 'nguyenkhanhduy0114@gmail.com';
    let admin = await User.findOne({ email });
    if (!admin) {
      admin = new User({ 
        name: 'Khánh Duy (Admin)', 
        email, 
        password: 'Admin123!', 
        role: 'admin', 
        status: 'Verified' 
      });
      await admin.save();
      console.log('✅ Admin created (Password: Admin123!)');
    } else {
      admin.role = 'admin';
      admin.status = 'Verified';
      admin.password = 'Admin123!';
      await admin.save();
      console.log('✅ Admin updated (Password: Admin123!)');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedUser();
