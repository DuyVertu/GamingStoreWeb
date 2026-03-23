# 🎮 GamingGear Store - E-Commerce Platform

Premium Gaming Peripherals Store cho Pro Players. Full-stack E-commerce website với React + Node.js + MongoDB.

![Gaming Store](https://img.shields.io/badge/Gaming-Store-00ff88?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb)

## 🎯 Giới Thiệu

GamingGear Store là nền tảng thương mại điện tử chuyên cung cấp thiết bị gaming cao cấp cho game thủ chuyên nghiệp và đam mê esports. Website được thiết kế với giao diện gaming cyber đậm chất, hỗ trợ 2 vai trò người dùng: **Khách hàng (User)** và **Chủ cửa hàng (Owner)**.

## ✨ Tính Năng Hệ Thống

### 🔐 Xác Thực & Phân Quyền

- Đăng ký / Đăng nhập / Quên mật khẩu
- Phân quyền theo role: **User** và **Owner**
- Route protection — Owner mới truy cập được trang quản lý
- Tự động redirect theo role sau đăng nhập

### 🛍️ Người Dùng (User)

- Duyệt sản phẩm theo 6 danh mục: Chuột Gaming, Bàn Phím, Tai Nghe, IEM FPS, Màn Hình, Phụ Kiện
- Tìm kiếm và lọc sản phẩm (thương hiệu, giá, danh mục)
- Xem chi tiết sản phẩm với thông số kỹ thuật đầy đủ
- Giỏ hàng: thêm, điều chỉnh số lượng, xóa
- Wishlist sản phẩm yêu thích
- Thanh toán 3 bước: Shipping → Payment → Review

### 👑 Chủ Cửa Hàng (Owner)

- **Dashboard**: Tổng quan thống kê (sản phẩm, khách hàng, đơn hàng, doanh thu), hoạt động gần đây, sản phẩm bán chạy
- **Quản lý Gear**: Thêm / sửa / xóa sản phẩm, tìm kiếm, hiển thị bảng với giá, tồn kho, đánh giá
- **Quản lý Khách hàng**: Danh sách khách hàng, tìm kiếm, xem chi tiết, xóa tài khoản

### 🎨 Giao Diện

- Dark theme với neon accents (Green, Pink, Blue, Purple)
- Cyber gradient và glow effects
- Smooth animations, hover effects, micro-interactions
- Custom scrollbar gaming style
- Responsive design (mobile, tablet, desktop)

## 🎨 Tech Stack

### Frontend

| Công nghệ | Mục đích |
|-----------|----------|
| React 18.2 | UI Framework |
| Vite 5.1 | Build Tool |
| React Router DOM v6 | Routing & Navigation |
| Zustand | State Management |
| Axios | HTTP Client |
| CSS Variables | Design System |

### Backend

| Công nghệ | Mục đích |
|-----------|----------|
| Node.js + Express | Web Server & API |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |

## 📁 Cấu Trúc Project

```
GamingStoreWeb/
├── client/                         # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/            # Header, Footer
│   │   │   ├── Product/           # ProductCard
│   │   │   ├── Checkout/          # ProgressIndicator
│   │   │   ├── Owner/             # OwnerLayout (sidebar navigation)
│   │   │   └── PrivateRoute.jsx   # Route guard theo role
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Trang chủ
│   │   │   ├── Products.jsx       # Danh sách sản phẩm
│   │   │   ├── ProductDetails.jsx # Chi tiết sản phẩm
│   │   │   ├── Cart.jsx           # Giỏ hàng
│   │   │   ├── Checkout.jsx       # Thanh toán
│   │   │   ├── Login.jsx          # Đăng nhập
│   │   │   ├── Register.jsx       # Đăng ký
│   │   │   ├── ForgotPassword.jsx # Quên mật khẩu
│   │   │   └── Owner/
│   │   │       ├── Dashboard.jsx      # Tổng quan cửa hàng
│   │   │       ├── ManageGear.jsx     # CRUD sản phẩm
│   │   │       └── ManageCustomers.jsx # Quản lý khách hàng
│   │   ├── store/                 # Zustand state management
│   │   │   ├── useAuthStore.js    # Trạng thái xác thực
│   │   │   ├── useCartStore.js    # Giỏ hàng
│   │   │   └── useWishlistStore.js # Wishlist
│   │   ├── services/              # API services (Axios)
│   │   └── data/                  # Mock data
│   └── package.json
│
├── server/                        # Backend Node.js
│   ├── config/                    # Cấu hình database
│   ├── models/
│   │   ├── Product.js             # Schema sản phẩm
│   │   └── User.js               # Schema người dùng
│   ├── routes/
│   │   ├── auth.js                # Đăng ký, đăng nhập
│   │   ├── products.js            # CRUD sản phẩm
│   │   ├── cart.js                # Giỏ hàng
│   │   └── orders.js             # Đơn hàng
│   ├── seeds/                     # Dữ liệu mẫu
│   └── server.js                  # Entry point
│
└── README.md
```

## 🗺️ Sơ Đồ Routes

### Public Routes

| Route | Mô tả |
|-------|--------|
| `/` | Trang chủ — banner, sản phẩm nổi bật |
| `/products` | Danh sách sản phẩm — filter, search |
| `/products/:id` | Chi tiết sản phẩm |
| `/cart` | Giỏ hàng |
| `/checkout` | Thanh toán |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/forgot-password` | Quên mật khẩu |

### Owner Routes (yêu cầu role Owner)

| Route | Mô tả |
|-------|--------|
| `/owner/dashboard` | Tổng quan cửa hàng |
| `/owner/gear` | Quản lý sản phẩm (CRUD) |
| `/owner/customers` | Quản lý khách hàng |

## 📝 API Endpoints

### Authentication

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại |

### Products

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/products` | Danh sách sản phẩm (có filter) |
| GET | `/api/products/:id` | Chi tiết sản phẩm |
| POST | `/api/products` | Thêm sản phẩm (Owner) |
| PUT | `/api/products/:id` | Cập nhật sản phẩm (Owner) |
| DELETE | `/api/products/:id` | Xóa sản phẩm (Owner) |

### Cart & Orders

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/cart` | Lấy giỏ hàng |
| POST | `/api/cart/add` | Thêm vào giỏ |
| POST | `/api/orders` | Tạo đơn hàng |
| GET | `/api/orders` | Danh sách đơn hàng |

## 🎨 Design System

### Gaming Color Palette

```css
--color-bg-dark: #0a0e27;    /* Dark background */
--color-bg-card: #12162e;     /* Card background */
--color-primary: #00ff88;     /* Neon Green */
--color-secondary: #ff0055;   /* Hot Pink */
--color-tertiary: #00d9ff;    /* Cyber Blue */
--color-accent: #b537f2;      /* Purple */
```

### Typography

- **Font:** Inter (Google Fonts)
- **Headings:** Uppercase, letter-spacing, font-weight 700-800

---

**DuyVertu - TLCN Project** ⚡🎮
