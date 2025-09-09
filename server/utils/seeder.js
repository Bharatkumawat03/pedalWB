const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './server/.env' });

// Import models
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

const connectDB = require('../config/database');

// Sample categories data
const categoriesData = [
  {
    name: 'Bicycles',
    slug: 'bikes',
    description: 'Complete bicycles for all riding styles',
    icon: '🚲'
  },
  {
    name: 'Drivetrain Systems',
    slug: 'drivetrain',
    description: 'Gears, chains, and drivetrain components',
    icon: '⚙️'
  },
  {
    name: 'Wheels & Tires',
    slug: 'wheels',
    description: 'Wheels, rims, tires and tubes',
    icon: '🛞'
  },
  {
    name: 'Brakes',
    slug: 'brakes',
    description: 'Brake systems and components',
    icon: '🛑'
  },
  {
    name: 'Components',
    slug: 'components',
    description: 'Various bike components and parts',
    icon: '🔧'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Bike accessories and add-ons',
    icon: '🎒'
  },
  {
    name: 'Cycling Apparel',
    slug: 'apparel',
    description: 'Clothing and gear for cyclists',
    icon: '👕'
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'GPS devices, lights, and electronics',
    icon: '📱'
  },
  {
    name: 'Maintenance',
    slug: 'maintenance',
    description: 'Tools and maintenance equipment',
    icon: '🛠️'
  },
  {
    name: 'Safety Gear',
    slug: 'safety',
    description: 'Helmets, protective gear, and safety equipment',
    icon: '🦺'
  }
];

// Sample products data (using the same data from frontend)
const productsData = [
  {
    name: 'SRAM Force AXS Rear Derailleur',
    price: 45000,
    originalPrice: 52000,
    images: [{ url: '/api/uploads/derailleur.jpg', isPrimary: true }],
    category: 'drivetrain',
    brand: 'SRAM',
    rating: { average: 4.8, count: 124 },
    description: 'Wireless 12-speed shifting with Orbit Cage & Titanium Hardware',
    features: [
      'Wireless 12-Speed Shifting',
      'Orbit Cage & Titanium Hardware',
      'Personalization via AXS App',
      'Battery life up to 60+ hours'
    ],
    inventory: { inStock: true, quantity: 25 },
    isNew: true,
    isFeatured: true,
    specifications: new Map([
      ['Speed', '12-Speed'],
      ['Weight', '303g'],
      ['Battery Life', '60+ hours'],
      ['Compatibility', 'SRAM AXS']
    ])
  },
  {
    name: 'Specialized Tarmac SL7 Road Bike',
    price: 125000,
    images: [{ url: '/api/uploads/bike.jpg', isPrimary: true }],
    category: 'bikes',
    brand: 'Specialized',
    rating: { average: 4.9, count: 89 },
    description: 'Professional grade road bike with carbon fiber frame',
    features: [
      'Fact 10r Carbon Frame',
      'Shimano Ultegra Groupset',
      'Lightweight Design',
      'Aerodynamic Profile'
    ],
    inventory: { inStock: true, quantity: 8 },
    isNew: false,
    isFeatured: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Red'],
    specifications: new Map([
      ['Frame Material', 'Carbon Fiber'],
      ['Weight', '7.8kg'],
      ['Groupset', 'Shimano Ultegra'],
      ['Wheel Size', '700c']
    ])
  },
  {
    name: 'Specialized Aero Helmet',
    price: 18000,
    images: [{ url: '/api/uploads/helmet.jpg', isPrimary: true }],
    category: 'safety',
    brand: 'Specialized',
    rating: { average: 4.7, count: 203 },
    description: 'Aerodynamic cycling helmet with advanced ventilation',
    features: [
      'Aerodynamic Design',
      'Advanced Ventilation',
      'MIPS Technology',
      'Lightweight Construction'
    ],
    inventory: { inStock: true, quantity: 35 },
    isNew: true,
    isFeatured: false,
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'White', 'Red', 'Blue'],
    specifications: new Map([
      ['Weight', '290g'],
      ['Ventilation', '15 vents'],
      ['Safety', 'MIPS Technology'],
      ['Fit System', 'Specialized Mindset']
    ])
  },
  {
    name: 'Shimano Ultegra 12-Speed Cassette',
    price: 22000,
    originalPrice: 25000,
    images: [{ url: '/api/uploads/cassette.jpg', isPrimary: true }],
    category: 'drivetrain',
    brand: 'Shimano',
    rating: { average: 4.6, count: 156 },
    description: 'Professional-grade 12-speed cassette for road cycling',
    features: [
      '12-Speed Range',
      'Lightweight Design',
      'Smooth Shifting',
      'Durable Construction'
    ],
    inventory: { inStock: true, quantity: 40 },
    isNew: false,
    isFeatured: true,
    specifications: new Map([
      ['Speeds', '12'],
      ['Range', '11-30T'],
      ['Weight', '251g'],
      ['Material', 'Steel/Titanium']
    ])
  },
  {
    name: 'Continental GP5000 Tires',
    price: 8500,
    images: [{ url: '/api/uploads/tire.jpg', isPrimary: true }],
    category: 'wheels',
    brand: 'Continental',
    rating: { average: 4.9, count: 234 },
    description: 'Premium road bike tires with excellent grip and durability',
    features: [
      'BlackChili Compound',
      'Vectran Breaker',
      'Active Comfort Technology',
      'Tubeless Ready'
    ],
    inventory: { inStock: true, quantity: 120 },
    isNew: false,
    isFeatured: true,
    sizes: ['23c', '25c', '28c'],
    specifications: new Map([
      ['Compound', 'BlackChili'],
      ['TPI', '330'],
      ['Weight', '230g (25c)'],
      ['Puncture Protection', 'Vectran Breaker']
    ])
  }
];

// Admin user data
const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@cyclehub.com',
  password: 'admin123',
  role: 'admin',
  status: 'active',
  emailVerified: true
};

// Demo user data
const demoUser = {
  firstName: 'Demo',
  lastName: 'User',
  email: 'demo@cyclehub.com',
  password: 'demo123',
  role: 'user',
  status: 'active',
  emailVerified: true
};

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('✅ Data cleared');

    // Create categories
    await Category.insertMany(categoriesData);
    console.log('✅ Categories created');

    // Create products
    await Product.insertMany(productsData);
    console.log('✅ Products created');

    // Create users
    await User.create(adminUser);
    await User.create(demoUser);
    console.log('✅ Users created');

    console.log('🚀 Data import completed successfully!');
    console.log('📧 Admin login: admin@cyclehub.com / admin123');
    console.log('📧 Demo login: demo@cyclehub.com / demo123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('🗑️  Data deleted successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    process.exit(1);
  }
};

// Command line execution
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}