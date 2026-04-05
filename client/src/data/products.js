// Gaming Store Products Data
// Categories: gaming-mice, keyboards, headsets, monitors, iems, accessories

export const categories = [
  { id: 'gaming-mice', name: 'Chuột Gaming', icon: '🖱️' },
  { id: 'keyboards', name: 'Bàn Phím', icon: '⌨️' },
  { id: 'headsets', name: 'Tai Nghe', icon: '🎧' },
  { id: 'iems', name: 'IEM FPS', icon: '🎵' },
  { id: 'monitors', name: 'Màn Hình', icon: '🖥️' },
  { id: 'accessories', name: 'Phụ Kiện', icon: '🎮' }
];

export const brands = [
  'Logitech', 'Razer', 'SteelSeries', 'HyperX', 'Corsair', 'ASUS','Wooting', 'Glorious', 'Finalmouse', 'Zowie', 'Lamzu', 'Keychron'
];

export const mockProducts = [
  {
    id: '1',
    name: 'Logitech G Pro X Superlight 2',
    description: 'Chuột gaming không dây siêu nhẹ 60g với sensor HERO 2, wireless LIGHTSPEED và Pin 95h. Lựa chọn hàng đầu cho Pro Players',
    price: 159,
    salePrice: 139,
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
    id: '2',
    name: 'Finalmouse UltralightX',
    description: 'Chuột gaming siêu nhẹ 55g với thiết kế honeycomb độc quyền, switches Kailh GM 8.0 và coating đặc biệt chống mồ hôi',
    price: 189,
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
    id: '3',
    name: 'Wooting 60HE+',
    description: 'Bàn phím cơ 60% với công nghệ Hall Effect Analog, điều chỉnh actuation point 0.1-4.0mm, RGB per-key và Rapid Trigger',
    price: 199,
    salePrice: 179,
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
    id: '4',
    name: 'Keychron Q1 Pro',
    description: 'Bàn phím cơ QMK/VIA 75% với gasket mount, hot-swappable, aluminum CNC, RGB per-key. Tùy biến hoàn toàn cho game thủ',
    price: 189,
    category: 'keyboards',
    brand: 'Keychron',
    image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 1523,
    stock: 18,
    colors: ['Navy Blue', 'Carbon Black', 'Silver Grey'],
    storage: ['Gateron', 'Cherry MX', 'Kailh Box'],
    specs: {
      'Layout': '75% (82 keys)',
      'Mount': 'Full Gasket',
      'PCB': 'Hot-swappable',  
      'Material': 'CNC Aluminum',
      'Battery': 'Wireless 4000mAh'
    }
  },
  {
    id: '5',
    name: 'SteelSeries Arctis Nova Pro',
    description: 'Tai nghe gaming Hi-Res với driver  neodymium 40mm, Active Noise Cancellation, GameDAC Gen 2. Âm thanh immersive đỉnh cao',
    price: 349,
    salePrice: 299,
    category: 'headsets',
    brand: 'SteelSeries',
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 1687,
    stock: 15,
    colors: ['Đen'],
    specs: {
      'Driver': '40mm Premium',
      'Frequency': '10-40,000 Hz',
      'ANC': 'Active Noise Cancellation',
      'Mic': 'ClearCast Gen 2',
      'Connectivity': 'Wireless + Wired'
    }
  },
  {
    id: '6',
    name: 'HyperX Cloud III Wireless',
    description: 'Tai nghe gaming không dây DTS Headphone:X, Pin 120h, driver 53mm custom-tuned, comfort memory foam. Giá trị tốt nhất',
    price: 169,
    category: 'headsets',
    brand: 'HyperX',
    image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 2341,
    stock: 32,
    colors: ['Đen', 'Trắng'],
    specs: {
      'Driver': '53mm Dynamic',
      'Frequency': '10-21,000 Hz',
      'Surround': 'DTS Headphone:X',
      'Battery': 'Up to 120 hours',
      'Mic': 'Detachable boom'
    }
  },
  {
    id: '7',
    name: 'Moondrop Blessing 3 - IEM FPS',
    description: 'IEM chuyên FPS với 4BA+1DD, soundstage rộng, imaging chính xác. Nghe rõ footstep, định vị vô địch. Đỉnh cho Valorant/CS2',
    price: 319,
    salePrice: 289,
    category: 'iems',
    brand: 'Moondrop',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 876,
    stock: 14,
    isNew: true,
    colors: ['Dusk', 'Moon'],
    specs: {
      'Configuration': '4BA + 1DD Hybrid',
      'Impedance': '14.8Ω',
      'Sensitivity': '117dB/Vrms',
      'Cable': 'Silver-plated OFC',
      'Connector': '3.5mm / 4.4mm'
    }
  },
  {
    id: '8',
    name: '7Hz Timeless AE - Gaming Edition',
    description: 'IEM Planar magnetic 14.2mm cho gaming, âm bass punch, treble detail cao. Nghe footstep rõ mồn một, ăn gà liên tục',
    price: 219,
    category: 'iems',
    brand: '7Hz',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 1234,
    stock: 19,
    colors: ['Aurora', 'Timeless'],
    specs: {
      'Driver': '14.2mm Planar',
      'Impedance': '14.5Ω',
      'Sensitivity': '104dB/mW',
      'Frequency': '5-40,000 Hz',
      'Cable': 'OFC 8-core'
    }
  },
  {
    id: '9',
    name: 'ASUS ROG Swift OLED PG27AQDM',
    description: 'Màn hình gaming OLED 27" 2K 240Hz với response time 0.03ms, G-SYNC, HDR True Black 400. Hình ảnh siêu mượt cho Pro',
    price: 999,
    salePrice: 899,
    category: 'monitors',
    brand: 'ASUS',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 543,
    stock: 6,
    isNew: true,
    specs: {
      'Panel': '27" OLED',
      'Resolution': '2560 x 1440 (2K)',
      'Refresh Rate': '240Hz',
      'Response Time': '0.03ms GTG',
      'Sync': 'G-SYNC Compatible'
    }
  },
  {
    id: '10',
    name: 'LG UltraGear 27GR95QE',
    description: 'Màn hình OLED 27" 2K 240Hz với màu sắc DCI-P3 99%, anti-glare coating, height adjustable. Màu chính xác, độ tương phản vô hạn',
    price: 1099,
    category: 'monitors',
    brand: 'LG',
    image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 421,
    stock: 9,
    specs: {
      'Panel': '27" OLED',
      'Resolution': '2560 x 1440',
      'Refresh Rate': '240Hz',
      'Color': 'DCI-P3 99%',
      'HDR': 'HDR10'
    }
  },
  {
    id: '11',
    name: 'Artisan Hien Soft XL',
    description: 'Mousepad vải Nhật Bản cao cấp, surface cân bằng speed/control, độ bền extreme. Best seller cho FPS Pro players',
    price: 59,
    salePrice: 49,
    category: 'accessories',
    brand: 'Artisan',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 3421,
    stock: 67,
    colors: ['Hien MID', 'Hien SOFT', 'Hien XSOFT'],
    specs: {
      'Size': 'XL (490 x 420mm)',
      'Thickness': '4mm',
      'Surface': 'Mid-hard weave',
      'Base': 'Non-slip rubber',
      'Origin': 'Made in Japan'
    }
  },
  {
    id: '12',
    name: 'Glorious Model O Wireless',
    description: 'Chuột gaming wireless siêu nhẹ 69g với honeycomb shell, BAMF sensor, battery 71h, RGB sync. Giá tốt nhất phân khúc',
    price: 79,
    category: 'gaming-mice',
    brand: 'Glorious',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 2891,  
    stock: 45,
    colors: ['Matte Black', 'Glossy White', 'Forge Pink'],
    specs: {
      'Sensor': 'BAMF 19K DPI',
      'Weight': '69g',
      'Battery': '71 hours',
  'Polling Rate': '1000Hz',
      'Feet': 'G-Skates PTFE'
    }
  }
];

export default mockProducts;
