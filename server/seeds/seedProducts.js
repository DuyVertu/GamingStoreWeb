import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config();

// Sample products data
const products = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system',
    price: 1199,
    salePrice: 1099,
    category: 'phones',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1696446702183-cbd6311d3028?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1696446702183-cbd6311d3028?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&auto=format&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 324,
    stock: 15,
    isNew: true,
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    storage: ['256GB', '512GB', '1TB'],
    specs: {
      'Display': '6.7" Super Retina XDR',
      'Chip': 'A17 Pro',
      'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
      'Battery': 'Up to 29 hours video playback'
    }
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'AI-powered smartphone with S Pen and incredible camera capabilities',
    price: 1299,
    category: 'phones',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 256,
    stock: 23,
    isNew: true,
    colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet'],
    storage: ['256GB', '512GB', '1TB'],
    specs: {
      'Display': '6.8" Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Camera': '200MP Wide, 50MP Periscope, 12MP Ultra Wide',
      'Battery': '5000mAh'
    }
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Smartwatch with advanced health features and always-on Retina display',
    price: 429,
    salePrice: 389,
    category: 'watches',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 512,
    stock: 30,
    colors: ['Midnight', 'Starlight', 'Silver', 'Pink'],
    specs: {
      'Display': 'Always-On Retina LTPO OLED',
      'Chip': 'S9 SiP',
      'Health': 'ECG, Blood Oxygen, Sleep Tracking',
      'Battery': 'Up to 18 hours'
    }
  },
  {
    name: 'Sony A7 IV',
    description: 'Full-frame mirrorless camera with 33MP sensor and 4K 60p video',
    price: 2498,
    category: 'cameras',
    brand: 'Sony',
    image: 'https://images.unsplash.com/photo-1606980623535-c0c8eeb8e212?w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 178,
    stock: 8,
    specs: {
      'Sensor': '33MP Full-Frame Exmo R',
      'Video': '4K 60p 10-bit 4:2:2',
      'ISO Range': '100-51200',
      'Stabilization': '5-axis in-body'
    }
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling headphones with premium sound quality',
    price: 399,
    salePrice: 349,
    category: 'headphones',
    brand: 'Sony',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 892,
    stock: 45,
    colors: ['Black', 'Silver'],
    specs: {
      'Noise Canceling': 'Auto NC Optimizer',
      'Battery': 'Up to 30 hours',
      'Connectivity': 'Bluetooth 5.2, Multipoint',
      'Driver': '30mm'
    }
  },
  {
    name: 'PlayStation 5',
    description: 'Next-gen gaming console with lightning-fast SSD and ray tracing',
    price: 499,
    category: 'gaming',
    brand: 'Sony',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 1024,
    stock: 12,
    specs: {
      'CPU': 'AMD Zen 2, 8 Cores',
      'GPU': '10.28 TFLOPs, 36 CUs @ 2.23 GHz',
      'Storage': '825GB SSD',
      'Resolution': 'Up to 8K'
    }
  },
  {
    name: 'MacBook Pro 14" M3',
    description: 'Supercharged for pros with M3 chip and Liquid Retina XDR display',
    price: 1999,
    category: 'computers',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 412,
    stock: 18,
    isNew: true,
    colors: ['Space Gray', 'Silver'],
    specs: {
      'Chip': 'Apple M3',
      'Display': '14.2" Liquid Retina XDR',
      'Memory': '8GB unified memory',
      'Storage': '512GB SSD'
    }
  },
  {
    name: 'Dell XPS 15',
    description: 'Premium Windows laptop with InfinityEdge display and powerful performance',
    price: 1799,
    salePrice: 1599,
    category: 'computers',
    brand: 'Dell',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 287,
    stock: 14,
    colors: ['Platinum Silver', 'Frost White'],
    specs: {
      'Processor': 'Intel Core i7-13700H',
      'Display': '15.6" FHD+ InfinityEdge',
      'RAM': '16GB DDR5',
      'Storage': '512GB PCIe SSD'
    }
  },
  {
    name: 'Canon EOS R6 Mark II',
    description: 'Advanced full-frame mirrorless camera for enthusiasts and professionals',
    price: 2499,
    category: 'cameras',
    brand: 'Canon',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 156,
    stock: 6,
    specs: {
      'Sensor': '24.2MP Full-Frame CMOS',
      'Video': '4K 60p oversampled',
      'ISO Range': '100-102400',
      'Stabilization': 'Up to 8 stops'
    }
  },
  {
    name: 'AirPods Pro (2nd Gen)',
    description: 'Active Noise Cancellation, Adaptive Audio, and personalized spatial audio',
    price: 249,
    category: 'headphones',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 1256,
    stock: 67,
    specs: {
      'Chip': 'H2',
      'Active Noise Cancellation': 'Up to 2x more',
      'Battery': 'Up to 6 hours',
      'Charging': 'MagSafe, Wireless'
    }
  },
  {
    name: 'Samsung Galaxy Watch 6',
    description: 'Advanced smartwatch with comprehensive health tracking and fitness features',
    price: 329,
    salePrice: 279,
    category: 'watches',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 423,
    stock: 25,
    colors: ['Graphite', 'Gold', 'Silver'],
    specs: {
      'Display': '1.5" Super AMOLED',
      'Processor': 'Exynos W930',
      'Battery': 'Up to 40 hours',
      'Health': 'Sleep coaching, Body composition'
    }
  },
  {
    name: 'Nintendo Switch OLED',
    description: 'Hybrid gaming console with vibrant 7" OLED screen',
    price: 349,
    category: 'gaming',
    brand: 'Nintendo',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 782,
    stock: 28,
    colors: ['White', 'Neon Red/Blue'],
    specs: {
      'Display': '7" OLED touchscreen',
      'Storage': '64GB internal',
      'Battery': '4.5 - 9 hours',
      'Modes': 'TV, Tabletop, Handheld'
    }
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany();
    console.log('🗑️  Cleared existing products');
    
    // Insert new products
    await Product.insertMany(products);
    console.log('✅ Successfully seeded 12 products');
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();
