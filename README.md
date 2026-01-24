# 🎮 GamingGear Store - E-Commerce Platform

Premium Gaming Peripherals Store cho Pro Players. Full-stack E-commerce website với React + Node.js + MongoDB.

![Gaming Store](https://img.shields.io/badge/Gaming-Store-00ff88?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb)

## 🎯 Giới Thiệu

GamingGear Store là nền tảng thương mại điện tử chuyên cung cấp thiết bị gaming cao cấp cho game thủ chuyên nghiệp và đam mê esports. Website được thiết kế với giao diện gaming cyber đậm chất, tối ưu để mang đến trải nghiệm mua sắm tốt nhất.

## ✨ Tính Năng

### 🛍️ Người Dùng

- ✅ Duyệt sản phẩm gaming theo danh mục
- ✅ Tìm kiếm và lọc sản phẩm (brand, price, category)
- ✅ Xem chi tiết sản phẩm với specifications đầy đủ
- ✅ Thêm vào giỏ hàng và wishlist
- ✅ Điều chỉnh số lượng trong giỏ hàng
- ✅ Thanh toán 3 bước: Shipping → Payment → Review
- ✅ Responsive design (mobile, tablet, desktop)

### 🎨 Giao Diện Gaming

- Dark theme với neon accents (Green, Pink, Blue)
- Cyber effects với gradient và glow
- Smooth animations và hover effects
- Custom scrollbar với gaming colors
- Product cards với neon border glow

### 🛠️ Kỹ Thuật

- State management với Zustand + localStorage
- React Router v6 cho navigation
- Axios cho API calls
- Real-time price calculations
- Form validation toàn bộ

## 🚀 Cài Đặt

### Prerequisites

- Node.js v16+
- MongoDB Community Server hoặc MongoDB Atlas
- Git

### 1. Clone Repository

```bash
git clone https://github.com/DuyVertu/GamingStoreWeb.git
cd GamingStoreWeb
```

### 2. Cài Đặt Frontend

```bash
cd client
npm install
```

### 3. Cài Đặt Backend

```bash
cd ../server
npm install
```

### 4. Cấu Hình MongoDB

**Option 1: MongoDB Local**

1. Download: https://www.mongodb.com/try/download/community
2. Install với default settings
3. MongoDB sẽ chạy tại `mongodb://localhost:27017`

**Option 2: MongoDB Atlas (Cloud)**

1. Tạo account tại: https://www.mongodb.com/cloud/atlas
2. Tạo cluster miễn phí
3. Lấy connection string

### 5. Tạo File Environment

```bash
# Trong thư mục server/
copy .env.example .env
```

Sửa file `.env`:

```env
PORT=5000
NODE_ENV=development

# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/estore

# Hoặc MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/estore

JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### 6. Seed Database

```bash
# Trong thư mục server/
npm run seed
```

### 7. Chạy Ứng Dụng

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
# Server: http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
# App: http://localhost:5173
```

## 🎨 Tech Stack

### Frontend

- **Framework:** React 18.2
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Styling:** CSS với CSS Variables

### Backend

- **Runtime:** Node.js v20+
- **Framework:** Express
- **Database:** MongoDB với Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs for password hashing
- **Environment:** dotenv

## 📁 Cấu Trúc Project

```
GamingStoreWeb/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Layout/   # Header, Footer
│   │   │   ├── Product/  # ProductCard, ProductGrid
│   │   │   └── Checkout/ # ProgressIndicator
│   │   ├── pages/        # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── Checkout.jsx
│   │   ├── store/        # Zustand stores
│   │   ├── services/     # API services
│   │   ├── data/         # Mock data & products
│   │   └── index.css     # Gaming design system
│   └── package.json
│
├── server/                # Backend Node.js
│   ├── config/           # Database config
│   ├── models/           # Mongoose models
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/           # API routes
│   │   ├── products.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── seeds/            # Database seeding
│   ├── server.js         # Main server file
│   └── package.json
│
└── README.md
```

## 🎨 Design System

### Gaming Color Palette

```css
--color-bg-dark: #0a0e27; /* Dark background */
--color-bg-darker: #050714; /* Darker background */
--color-bg-card: #12162e; /* Card background */

--color-primary: #00ff88; /* Neon Green */
--color-secondary: #ff0055; /* Hot Pink */
--color-tertiary: #00d9ff; /* Cyber Blue */
--color-accent: #b537f2; /* Purple */
```

### Typography

- **Font Family:** Inter (Google Fonts)
- **Headings:** Uppercase, letter-spacing: 2px
- **Weights:** 300-900

### Effects

- Glow effects với box-shadow
- Smooth transitions (150-350ms)
- Hover animations
- Gradient backgrounds
- Custom scrollbar

## 📝 API Endpoints

### Products

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Cart & Orders

- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

## 👨‍💻 Tác Giả

**DuyVertu - TLCN Project**

- Gaming Store for Pro Players
- Full-stack E-commerce Platform

## 📄 License

Dự án phục vụ học tập.

---

⚡ **Made with passion for gaming!** 🎮
