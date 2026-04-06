# 🎮 GamingGear Store - E-Commerce Platform

Premium Gaming Peripherals Store cho Pro Players. Full-stack E-commerce website với React + Node.js + MongoDB.

![Gaming Store](https://img.shields.io/badge/Gaming-Store-00ff88?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb)

## 🌐 Môi trường Deploy (Live)

Dự án hiện đã được deploy thành công trên nền tảng đám mây:
- **Trang chủ Client (Frontend):** [https://gaminggear-store.vercel.app](https://gaminggear-store.vercel.app)
- **Máy chủ API (Backend):** Được host trên Render
- **Cơ sở dữ liệu (Database):** MongoDB Atlas Cloud (Cluster TLCN)

### Lưu ý quan trọng khi Test trên môi trường Deploy:
- Do chính sách **chặn cổng gửi Email** từ các gói thử nghiệm (Free tier) của Render nên hệ thống sẽ **bỏ qua bước gửi mail OTP**. 
- Khi đăng ký tài khoản trải nghiệm, ở bước xác minh email các bạn chỉ cần nhập cứng mã OTP mặc định là: **`123456`**.

## 🎯 Giới Thiệu

GamingGear Store là nền tảng thương mại điện tử chuyên cung cấp thiết bị gaming cao cấp cho game thủ chuyên nghiệp và đam mê esports. Website được thiết kế với giao diện gaming cyber đậm chất, hỗ trợ 2 vai trò người dùng: **Khách hàng (User)** và **Admin (Chủ cửa hàng/Owner)**.

## ✨ Tính Năng Hệ Thống

### 🔐 Xác Thực & Phân Quyền

- Đăng ký / Đăng nhập / Quên mật khẩu.
- Phân quyền theo role: **User** và **Admin/Owner**.
- Cơ chế bảo mật JWT với OTP Email Verification (khi chạy local).
- Tự động điều hướng động theo vai trò (Role-based Navigation).

### 🛍️ Người Dùng (User)

- Duyệt sản phẩm theo 6 danh mục: Chuột Gaming, Bàn Phím, Tai Nghe, IEM FPS, Màn Hình, Phụ Kiện.
- Tìm kiếm và lọc sản phẩm (thương hiệu, giá, danh mục, sale, hàng mới...).
- Xem chi tiết sản phẩm với thông số kỹ thuật đầy đủ và thư viện hình ảnh thu phóng tốt.
- Giỏ hàng: thêm, điều chỉnh số lượng, tính toán tổng bill tự động.
- Cổng thanh toán tiện dụng hỗ trợ **VNPAY Sandbox** (Thanh toán điện tử) và COD (Thanh toán khi nhận hàng).
- Chuyển hướng sang trang `/order-success` thân thiện sau khi mua đồ.

### 👑 Chủ Cửa Hàng (Owner/Admin)

Để test trang quản lý, vui lòng dùng tài khoản CMS Admin:
- **Email:** `nguyenkhanhduy0114@gmail.com`
- **Mật khẩu:** `Admin123!`

- **Dashboard**: Tổng quan thống kê (tổng sản phẩm, khách hàng, số lượng đơn hàng, doanh thu ước tính), hoạt động gần đây, sản phẩm bán chạy.
- **Quản lý Gear**: Thêm / sửa / xóa thông tin sản phẩm, hỗ trợ tìm kiếm filter.
- **Quản lý Khách hàng**: Theo dõi danh sách user, trạng thái kiểm duyệt, và thiết lập role.

## 🎨 Tech Stack

### Frontend

| Công nghệ | Mục đích |
|-----------|----------|
| React 18.2 | UI Framework MVC kiến trúc |
| Vite 5.1 | Build Tool / Bundler |
| React Router DOM v6 | Component Routing / Guards |
| Zustand | Global State Management (Cart, Auth, Model) |
| Axios | HTTP API Client |
| CSS Variables | Design System Themeing |

### Backend

| Công nghệ | Mục đích |
|-----------|----------|
| Node.js + Express | Web Server & Xử lý API |
| MongoDB + Mongoose| Database Storage & ODM Schema Models |
| JWT | JSON Web Tokens Authentication |
| bcryptjs | Hashing & Security |
| Nodemailer | Gửi thư điện tử OTP Automation |

## 📁 Cấu Trúc File & Thư Mục Nổi Bật

```
GamingStoreWeb/
├── client/                         # Frontend React
│   ├── src/
│   │   ├── components/            # Layout Elements, UI Components (Button, Modal...)
│   │   ├── pages/                 # Container Views chính (Home, Cart, Admin Dashboard)
│   │   ├── store/                 # Zustand Store quản lý trạng thái
│   │   ├── services/              # Định nghĩa call service logic ra Backend
│   │   └── data/                  # Mock data / seed source
│   ├── public/                    # Assets Web
│   └── vercel.json                # Rewrites file giúp SPA chạy trơn tru trên Vercel
│
├── server/                        # Backend Node.js
│   ├── config/                    # Cấu hình Mongoose DB
│   ├── models/                    # Khai báo schema chuẩn Product, User, Order...
│   ├── routes/                    # Export Express Router định tuyến REST Endpoint
│   ├── controllers/               # (Tùy chọn) Logic Xử lý request từ Route
│   ├── utils/                     # Các Function phụ (email gửi mail)
│   ├── seed_direct.js             # Script tự động seed toàn bộ Data thẳng lên MongoDB Atlas
│   └── server.js                  # Điểm chạm Entry point để khởi chạy cluster Server
│
└── README.md
```

## 🗺️ Sơ Đồ Routes

### Public Routes

| Route | Mô tả |
|-------|--------|
| `/` | Trang chủ — banner, sản phẩm nổi bật |
| `/products` | Danh sách sản phẩm đầy đủ |
| `/products/:id` | Xem chi tiết 1 sản phẩm chỉ định |
| `/cart` | Giỏ hàng cá nhân |
| `/checkout` | Thanh toán Giỏ hàng |
| `/order-success` | Trang chúc mừng sau thanh toán Order Flow |
| `/login` | Đăng nhập hệ thống |
| `/register` | Đăng ký tài khoản (hỗ trợ pass OTP) |
| `/forgot-password` | Khôi phục mật khẩu tài khoản |

### Owner Routes (Yêu cầu Role 'admin' hoặc 'owner')

| Route | Mô tả |
|-------|--------|
| `/owner/dashboard` | Thống kê KPI báo cáo doanh thu & user |
| `/owner/gear` | Panel Quản lý toàn vẹn Sản Phẩm (CRUD) |
| `/owner/customers` | Panel Quản lý User/Khách Hàng |

## 📝 Demo Setup Local (Tham Khảo DEV)

1. Mở terminal, tại thư mục gốc `TLCN`:
2. Mở `/server` và chạy `npm i`. Cấu hình biến môi trường kết nối MongoDB cục bộ thông qua `.env` theo form `.env.example`. Chạy lệnh `npm run dev` để start server tại `:5000`.
3. Mở một terminal khác tại thẻ `/client` và chạy `npm i`. Sau đó chạy `npm run dev` chờ load trang Vite `:5173`.
4. Trang web của bạn đã chạy!

*Lưu ý Local Seed DB:* Chỉ xài file `node seed_direct.js` khi bạn cần bơm dữ liệu demo vào database, có chứa sẵn hơn chục món đồ chơi gaming. Thường dùng nếu cơ sở dữ liệu trống.

## 🎨 Design System

### Gaming Color Palette

```css
--color-bg-dark: #0a0e27;    /* Dark background */
--color-bg-card: #12162e;     /* Card background */
--color-primary: #00ff88;     /* Neon Green - Active state */
--color-secondary: #ff0055;   /* Hot Pink - Alert/Sale state */
--color-tertiary: #00d9ff;    /* Cyber Blue - Highlights */
--color-accent: #b537f2;      /* Purple */
```

### Typography

- **Font:** Inter (Google Fonts)
- **Headings:** Uppercase, letter-spacing, font-weight 700-800

---

**DuyVertu - Báo Cáo Đồ Án / Đề Tài TLCN 2024**
