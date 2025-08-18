const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/admin');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.error('Admin credentials not found in environment variables');
      process.exit(1);
    }

    const existingAdmin = await Admin.findOne({ username: ADMIN_USERNAME });
    if (existingAdmin) {
      console.log('Admin already exists');
      return process.exit();
    }

    const admin = new Admin({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD, // Will be hashed automatically
    });

    await admin.save();
    console.log('Admin user seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
