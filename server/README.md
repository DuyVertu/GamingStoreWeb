# E-Store Backend API

Backend API cho ứng dụng E-Store được xây dựng với Node.js, Express, và MongoDB.

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
cd server
npm install
```

### 2. Cấu hình MongoDB

**Cách 1: MongoDB Local (Khuyến nghị cho development)**

1. Tải và cài đặt MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Sau khi cài đặt, MongoDB sẽ chạy tại `mongodb://localhost:27017`

**Cách 2: MongoDB Atlas (Cloud - miễn phí)**

1. Đăng ký tài khoản tại: https://www.mongodb.com/cloud/atlas/register
2. Tạo cluster miễn phí
3. Lấy connection string

### 3. Tạo file .env

Sao chép file `.env.example` thành `.env`:

```bash
copy .env.example .env
```

Sau đó chỉnh sửa file `.env`:

```env
PORT=5000
NODE_ENV=development

# Dùng MongoDB local:
MONGODB_URI=mongodb://localhost:27017/estore

# Hoặc dùng MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/estore

JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### 4. Seed database với dữ liệu mẫu

```bash
npm run seed
```

Lệnh này sẽ tạo 12 sản phẩm mẫu trong database.

### 5. Chạy server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại `http://localhost:5000`

## 📚 API Endpoints

### Products

- `GET /api/products` - Lấy tất cả sản phẩm (có filter)
  - Query params: `category`, `brand`, `minPrice`, `maxPrice`, `search`, `sale`, `isNew`
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Authentication

- `POST /api/auth/register` - Đăng ký user mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Cart

- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/add` - Thêm vào giỏ
- `PUT /api/cart/update/:itemId` - Cập nhật số lượng
- `DELETE /api/cart/remove/:itemId` - Xóa khỏi giỏ

### Orders

- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/:id` - Chi tiết đơn hàng

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB với Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv

## 📝 Models

### Product

- name, description, price, salePrice
- category, brand, image, images
- rating, reviewCount, stock
- isNew, colors, storage, specs

### User

- name, email, password (hashed)
- phone, addresses, wishlist
- role (user/admin)

## 🔄 Kết nối với Frontend

Frontend React (chạy tại `localhost:5173`) đã được cấu hình để proxy requests tới backend API (`localhost:5000`).

Trong `client/vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

---

Made with ❤️ for TLCN
