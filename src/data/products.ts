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
}

export const categories = [
  { id: 'drivetrain', name: 'Drivetrain Systems', icon: '⚙️' },
  { id: 'wheels', name: 'Wheels & Tires', icon: '🛞' },
  { id: 'brakes', name: 'Brakes', icon: '🛑' },
  { id: 'components', name: 'Components', icon: '🔧' },
  { id: 'accessories', name: 'Accessories', icon: '🎒' },
  { id: 'apparel', name: 'Apparel', icon: '👕' },
];

export const brands = [
  'SRAM', 'Shimano', 'Campagnolo', 'RockShox', 'Fox Racing', 'Mavic', 'DT Swiss', 'Specialized'
];

export const products: Product[] = [
  {
    id: '1',
    name: 'SRAM Force AXS Rear Derailleur',
    price: 450,
    originalPrice: 520,
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
  },
  {
    id: '2',
    name: 'Fizik 404 Carbon Wheel Set',
    price: 850,
    image: '/src/assets/wheel.jpg',
    category: 'wheels',
    brand: 'Fizik',
    rating: 4.9,
    reviews: 89,
    description: 'High-performance carbon wheelset with disc brake compatibility',
    features: [
      'Full Carbon Construction',
      'Disc Brake Compatible',
      'Tubeless Ready',
      'Lightweight Design'
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Specialized Aero Helmet',
    price: 180,
    image: '/src/assets/helmet.jpg',
    category: 'accessories',
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
  },
  {
    id: '4',
    name: 'Shimano Ultegra 12-Speed Cassette',
    price: 220,
    originalPrice: 250,
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
  },
  {
    id: '5',
    name: 'RockShox Pike Ultimate Fork',
    price: 680,
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
  },
  {
    id: '6',
    name: 'Mavic Cosmic Carbon Wheels',
    price: 920,
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
  },
];