export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  specifications?: { [key: string]: string };
  colors?: string[];
  sizes?: string[];
}

export const categories = [
  { id: 'all', name: 'All Categories', icon: '🚴' },
  { id: 'bikes', name: 'Bicycles', icon: '🚲' },
  { id: 'drivetrain', name: 'Drivetrain Systems', icon: '⚙️' },
  { id: 'wheels', name: 'Wheels & Tires', icon: '🛞' },
  { id: 'brakes', name: 'Brakes', icon: '🛑' },
  { id: 'components', name: 'Components', icon: '🔧' },
  { id: 'accessories', name: 'Accessories', icon: '🎒' },
  { id: 'apparel', name: 'Cycling Apparel', icon: '👕' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'maintenance', name: 'Maintenance', icon: '🛠️' },
  { id: 'safety', name: 'Safety Gear', icon: '🦺' },
];

export const brands = [
  'SRAM', 'Shimano', 'Campagnolo', 'RockShox', 'Fox Racing', 'Mavic', 
  'DT Swiss', 'Specialized', 'Trek', 'Giant', 'Canyon', 'Bianchi',
  'Garmin', 'Wahoo', 'Polar', 'Continental', 'Michelin', 'Schwalbe',
  'Pearl Izumi', 'Castelli', 'Rapha', 'Endura'
];

export const products: Product[] = [
  {
    id: '1',
    name: 'SRAM Force AXS Rear Derailleur',
    price: 45000,
    originalPrice: 52000,
    image: '/src/assets/derailleur.jpg',
    category: 'drivetrain',
    brand: 'SRAM',
    rating: 4.8,
    reviews: 124,
    description: 'Wireless 12-speed shifting with Orbit Cage & Titanium Hardware',
    features: [
      'Wireless 12-Speed Shifting',
      'Orbit Cage & Titanium Hardware', 
      'Personalization via AXS App',
      'Battery life up to 60+ hours'
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
    specifications: {
      'Speed': '12-Speed',
      'Weight': '303g',
      'Battery Life': '60+ hours',
      'Compatibility': 'SRAM AXS'
    }
  },
  {
    id: '2',
    name: 'Specialized Tarmac SL7 Road Bike',
    price: 125000,
    image: '/src/assets/wheel.jpg',
    category: 'bikes',
    brand: 'Specialized',
    rating: 4.9,
    reviews: 89,
    description: 'Professional grade road bike with carbon fiber frame',
    features: [
      'Fact 10r Carbon Frame',
      'Shimano Ultegra Groupset',
      'Lightweight Design',
      'Aerodynamic Profile'
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Red'],
    specifications: {
      'Frame Material': 'Carbon Fiber',
      'Weight': '7.8kg',
      'Groupset': 'Shimano Ultegra',
      'Wheel Size': '700c'
    }
  },
  {
    id: '3',
    name: 'Specialized Aero Helmet',
    price: 18000,
    image: '/src/assets/helmet.jpg',
    category: 'safety',
    brand: 'Specialized',
    rating: 4.7,
    reviews: 203,
    description: 'Aerodynamic cycling helmet with advanced ventilation',
    features: [
      'Aerodynamic Design',
      'Advanced Ventilation',
      'MIPS Technology',
      'Lightweight Construction'
    ],
    inStock: true,
    isNew: true,
    isFeatured: false,
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'White', 'Red', 'Blue'],
    specifications: {
      'Weight': '290g',
      'Ventilation': '15 vents',
      'Safety': 'MIPS Technology',
      'Fit System': 'Specialized Mindset'
    }
  },
  {
    id: '4',
    name: 'Shimano Ultegra 12-Speed Cassette',
    price: 22000,
    originalPrice: 25000,
    image: '/src/assets/derailleur.jpg',
    category: 'drivetrain',
    brand: 'Shimano',
    rating: 4.6,
    reviews: 156,
    description: 'Professional-grade 12-speed cassette for road cycling',
    features: [
      '12-Speed Range',
      'Lightweight Design',
      'Smooth Shifting',
      'Durable Construction'
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
    specifications: {
      'Speeds': '12',
      'Range': '11-30T',
      'Weight': '251g',
      'Material': 'Steel/Titanium'
    }
  },
  {
    id: '5',
    name: 'RockShox Pike Ultimate Fork',
    price: 68000,
    image: '/src/assets/wheel.jpg',
    category: 'components',
    brand: 'RockShox',
    rating: 4.9,
    reviews: 78,
    description: 'Ultimate mountain bike suspension fork',
    features: [
      '35mm Stanchions',
      'Charger 2.1 Damper',
      'DebonAir Spring',
      'Adjustable Compression'
    ],
    inStock: false,
    isNew: true,
    isFeatured: false,
    specifications: {
      'Travel': '160mm',
      'Stanchion': '35mm',
      'Axle': '15x110mm',
      'Weight': '2.1kg'
    }
  },
  {
    id: '6',
    name: 'Mavic Cosmic Carbon Wheels',
    price: 92000,
    image: '/src/assets/wheel.jpg',
    category: 'wheels',
    brand: 'Mavic',
    rating: 4.8,
    reviews: 91,
    description: 'Premium carbon fiber road wheelset',
    features: [
      'Carbon Fiber Rim',
      'Aerodynamic Profile',
      'Sealed Bearings',
      'Tubeless Compatible'
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
    specifications: {
      'Material': 'Carbon Fiber',
      'Weight': '1450g',
      'Rim Depth': '45mm',
      'Hub': 'Mavic ID360'
    }
  },
  {
    id: '7',
    name: 'Garmin Edge 1030 Plus GPS',
    price: 35000,
    image: '/src/assets/helmet.jpg',
    category: 'electronics',
    brand: 'Garmin',
    rating: 4.7,
    reviews: 145,
    description: 'Advanced GPS cycling computer with performance monitoring',
    features: [
      '3.5" Color Touchscreen',
      'GPS & GLONASS',
      'Up to 24hr Battery',
      'ClimbPro Feature'
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
    specifications: {
      'Display': '3.5" Color',
      'Battery': '24 hours',
      'Memory': '32GB',
      'Water Rating': 'IPX7'
    }
  },
  {
    id: '8',
    name: 'Continental GP5000 Tires',
    price: 8500,
    image: '/src/assets/wheel.jpg',
    category: 'wheels',
    brand: 'Continental',
    rating: 4.9,
    reviews: 234,
    description: 'Premium road bike tires with excellent grip and durability',
    features: [
      'BlackChili Compound',
      'Vectran Breaker',
      'Active Comfort Technology',
      'Tubeless Ready'
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
    sizes: ['23c', '25c', '28c'],
    specifications: {
      'Compound': 'BlackChili',
      'TPI': '330',
      'Weight': '230g (25c)',
      'Puncture Protection': 'Vectran Breaker'
    }
  },
  {
    id: '9',
    name: 'Pearl Izumi Elite Pursuit Jersey',
    price: 6500,
    image: '/src/assets/helmet.jpg',
    category: 'apparel',
    brand: 'Pearl Izumi',
    rating: 4.5,
    reviews: 89,
    description: 'Professional cycling jersey with moisture management',
    features: [
      'Transfer Fabric',
      'Full-Length Zipper',
      'Three Rear Pockets',
      'UPF 40+ Protection'
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Red', 'Green', 'White'],
    specifications: {
      'Material': 'Transfer Fabric',
      'Fit': 'Elite',
      'UV Protection': 'UPF 40+',
      'Care': 'Machine Washable'
    }
  },
  {
    id: '10',
    name: 'Park Tool PCS-10.2 Repair Stand',
    price: 28000,
    image: '/src/assets/derailleur.jpg',
    category: 'maintenance',
    brand: 'Park Tool',
    rating: 4.8,
    reviews: 67,
    description: 'Professional bike repair stand for home mechanics',
    features: [
      'Quick-Release Clamp',
      'Adjustable Height',
      'Sturdy Base',
      'Portable Design'
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
    specifications: {
      'Max Height': '165cm',
      'Min Height': '120cm',
      'Clamp': '100-4 Quick-Release',
      'Weight': '11kg'
    }
  },
  {
    id: '11',
    name: 'Wahoo KICKR Core Smart Trainer',
    price: 85000,
    image: '/src/assets/wheel.jpg',
    category: 'electronics',
    brand: 'Wahoo',
    rating: 4.7,
    reviews: 156,
    description: 'Smart indoor trainer with realistic road feel',
    features: [
      'Direct Drive Design',
      '1800W Max Power',
      'ERG Mode',
      'Zwift Compatible'
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
    specifications: {
      'Max Power': '1800W',
      'Accuracy': '+/- 2%',
      'Connectivity': 'ANT+, Bluetooth',
      'Cassette': '11-speed included'
    }
  },
  {
    id: '12',
    name: 'Trek Madone SLR 9 Disc',
    price: 245000,
    image: '/src/assets/wheel.jpg',
    category: 'bikes',
    brand: 'Trek',
    rating: 4.9,
    reviews: 45,
    description: 'Ultimate aerodynamic road bike with disc brakes',
    features: [
      'OCLV 800 Carbon',
      'Aerodynamic Design',
      'Disc Brakes',
      'Electronic Shifting'
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
    sizes: ['50', '52', '54', '56', '58', '60'],
    colors: ['Black', 'Red', 'Blue'],
    specifications: {
      'Frame': 'OCLV 800 Carbon',
      'Weight': '7.2kg',
      'Groupset': 'Shimano Dura-Ace Di2',
      'Brakes': 'Disc'
    }
  }
];

export const priceRanges = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
  { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
  { label: 'Above ₹1,00,000', min: 100000, max: 999999 },
];

export const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];