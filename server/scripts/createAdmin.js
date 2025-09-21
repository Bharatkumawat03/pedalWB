const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pedalbharat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  emailVerified: { type: Boolean, default: false },
  addresses: { type: Array, default: [] },
  preferences: {
    newsletter: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'INR' }
  },
  cart: { type: Array, default: [] },
  wishlist: { type: Array, default: [] },
  orderHistory: { type: Array, default: [] },
  loyaltyPoints: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  loginAttempts: { type: Number, default: 0 },
  lastLogin: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@pedalbharat.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@pedalbharat.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@pedalbharat.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      emailVerified: true
    });

    await admin.save();
    
    console.log('Admin user created successfully!');
    console.log('Email: admin@pedalbharat.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
