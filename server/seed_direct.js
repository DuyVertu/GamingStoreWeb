import dns from 'node:dns';
dns.setServers(['8.8.8.8']); // force Google DNS for SRV lookup

import mongoose from 'mongoose';
import Product from './models/Product.js';
import User from './models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const products = [
  {
    name: 'Logitech G Pro X Superlight 2',
    description: 'Chuột gaming không dây siêu nhẹ 60g với sensor HERO 2, wireless LIGHTSPEED và Pin 95h. Lựa chọn hàng đầu cho Pro Players',
    price: 3800000,
    salePrice: 3400000,
    category: 'gaming-mice',
    brand: 'Logitech',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 1842,
    stock: 23,
    isNew: true,
    colors: ['Đen', 'Trắng', 'Hồng'],
    specs: {
      'Sensor': 'HERO 2 32K DPI',
      'Weight': '60g',
      'Connectivity': 'LIGHTSPEED Wireless',
      'Battery Life': 'Up to 95 hours',
      'Switches': 'LIGHTFORCE Hybrid'
    }
  },
  {
    name: 'Finalmouse UltralightX',
    description: 'Chuột gaming siêu nhẹ 55g với thiết kế honeycomb độc quyền, switches Kailh GM 8.0 và coating đặc biệt chống mồ hôi',
    price: 4500000,
    category: 'gaming-mice',
    brand: 'Finalmouse',
    image: 'https://images.unsplash.com/photo-1598751221615-e04a9c05e78e?w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 892,
    stock: 12,
    isNew: true,
    colors: ['Phantom', 'Starlight'],
    specs: {
      'Sensor': 'PixArt 3370',
      'Weight': '55g',
      'Connectivity': 'Wired',
      'Cable': 'Paracord',
      'Feet': 'PTFE'
    }
  },
  {
    name: 'Wooting 60HE+',
    description: 'Bàn phím cơ 60% với công nghệ Hall Effect Analog, điều chỉnh actuation point 0.1-4.0mm, RGB per-key và Rapid Trigger',
    price: 4900000,
    salePrice: 4500000,
    category: 'keyboards',
    brand: 'Wooting',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 2134,
    stock: 8,
    isNew: true,
    colors: ['Đen'],
    specs: {
      'Layout': '60% (61 keys)',
      'Switches': 'Lekker Hall Effect',
      'Actuation': '0.1-4.0mm adjustable',
      'Features': 'Rapid Trigger, Tachyon Mode',
      'Connectivity': 'USB-C Wired'
    }
  },
  {
    name: 'Keychron Q1 Pro',
    description: 'Bàn phím cơ QMK/VIA 75% với gasket mount, hot-swappable, aluminum CNC, RGB per-key. Tùy biến hoàn toàn cho game thủ',
    price: 4600000,
    category: 'keyboards',
    brand: 'Keychron',
    image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 1523,
    stock: 18,
    colors: ['Navy Blue', 'Carbon Black', 'Silver Grey'],
    specs: {
      'Layout': '75%',
      'Mount': 'Gasket Mount',
      'Case': 'Full Aluminum CNC',
      'Connectivity': 'Bluetooth 5.1 & Wired Type-C',
      'Software': 'QMK/VIA Support'
    }
  },
  {
    name: 'HyperX Cloud III Wireless',
    description: 'Tai nghe gaming không dây với pin 120 giờ, màng loa 53mm góc nghiêng, DTS Headphone:X Spatial Audio và mic chống ồn tháo rời',
    price: 4100000,
    salePrice: 3800000,
    category: 'headsets',
    brand: 'HyperX',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599669500515-b3e1dd5ea731?w=800&auto=format&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 3421,
    stock: 45,
    colors: ['Đen', 'Đỏ'],
    specs: {
      'Drivers': '53mm angled',
      'Battery Life': 'Up to 120 hours',
      'Audio': 'DTS Headphone:X Spatial',
      'Microphone': 'Detachable Noise-Cancelling',
      'Connectivity': '2.4GHz Wireless / Bluetooth'
    }
  },
  {
    name: 'Moondrop Aria 2',
    description: 'Tai nghe in-ear monitor (IEM) với driver dynamic màng mạ LCP, cáp đồng mạ bạc có thể tháo rời, tuning Harman Target chuẩn mực',
    price: 1990000,
    category: 'iems',
    brand: 'Moondrop',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 512,
    stock: 35,
    colors: ['Bạc'],
    specs: {
      'Driver': 'Liquid Crystal Polymer Dynamic',
      'Impedance': '33Ω',
      'Sensitivity': '122dB/Vrms',
      'Frequency': '15Hz-50kHz',
      'Cable': 'Silver-Plated Copper, Detachable'
    }
  },
  {
    name: 'BenQ ZOWIE XL2566K',
    description: 'Màn hình gaming ESPORT 24.5 inch 360Hz TN Panel với DyAc⁺™ công nghệ giảm thiểu blur trong motion cực tốt cho try-hard',
    price: 12500000,
    salePrice: 11900000,
    category: 'monitors',
    brand: 'Zowie',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 928,
    stock: 5,
    specs: {
      'Size': '24.5 inch',
      'Panel Type': 'Fast TN',
      'Refresh Rate': '360Hz',
      'Response Time': '0.5ms',
      'Features': 'DyAc⁺™, Black eQualizer'
    }
  },
  {
    name: 'Lethal Gaming Gear Saturn Pro',
    description: 'Pad chuột cao cấp bề mặt control siêu mượt, đế Poron siêu dính. Dành cho game thủ tracking và flick chuyên nghiệp',
    price: 1200000,
    category: 'accessories',
    brand: 'Lethal Gaming Gear',
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 421,
    stock: 50,
    colors: ['Đen', 'Đỏ'],
    specs: {
      'Surface': 'Smooth Control Cloth',
      'Base': 'Custom Poron',
      'Thickness': '3.5mm',
      'Edges': 'Low-profile Stitched',
      'Size': 'XL SQ (490x490mm)'
    }
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    await Product.deleteMany({});
    console.log('🗑️  Deleted old products');

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seed();
