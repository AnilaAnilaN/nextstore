import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import connectDB from '../src/lib/db';
import Admin from '../src/models/Admin';

async function createAdmin() {
  await connectDB();
  
  const admin = await Admin.create({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: 'Admin',
    role: 'super-admin',
  });
  
  console.log('✅ Admin created:', admin.email);
  process.exit(0);
}

createAdmin();