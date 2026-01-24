# E-Store - Premium Electronics Frontend

Modern e-commerce web application built with React + Vite, featuring a beautiful UI matching the Figma design.

## 🚀 Features

- ✅ **7 Complete Pages**: Home, Products, Product Details, Cart, Checkout (3-step flow)
- 🎨 **Modern Design**: Matching Figma design with premium aesthetics
- 📱 **Fully Responsive**: Mobile-first design approach
- 🛒 **Shopping Cart**: Add/remove items, update quantities with localStorage persistence
- ❤️ **Wishlist**: Save favorite products
- 🔍 **Advanced Filtering**: Category, brand, price range, sale, new products
- 🌟 **Product Variants**: Color and storage options
- 📦 **Checkout Flow**: Address → Shipping → Payment with validation
- ⚡ **Fast Performance**: Built with Vite for optimal speed

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: Zustand (with localStorage persistence)
- **HTTP Client**: Axios
- **Styling**: CSS Modules with CSS Variables

## 📦 Installation

### Prerequisites

Make sure you have Node.js installed (v16 or higher).

### Install Dependencies

```bash
cd client
npm install
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout/       # Header, Footer
│   │   ├── Product/      # ProductCard, ProductGrid
│   │   └── Checkout/     # ProgressIndicator
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   └── Checkout.jsx
│   ├── store/            # Zustand state management
│   │   ├── useCartStore.js
│   │   ├── useWishlistStore.js
│   │   └── useAuthStore.js
│   ├── services/         # API services
│   │   └── api.js
│   ├── data/             # Mock data
│   │   └── products.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles & design system
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Design System

The application uses a comprehensive design system defined in `index.css`:

- **Colors**: Matching Figma palette (White, Black, Gray scales, Red for sales, Gold for ratings)
- **Typography**: Inter font family with responsive sizing
- **Spacing Scale**: Consistent spacing from 4px to 64px
- **Components**: Reusable button, card, input, and badge styles
- **Responsive Grid**: Auto-responsive product grids

## 🛒 Features Breakdown

### Home Page

- Hero banner with gradient background
- Category navigation (6 categories)
- Featured products section
- Sale products section
- New arrivals section
- Features showcase

### Products Page

- Filter sidebar (category, brand, price, special filters)
- Product grid with responsive layout
- Search integration via URL params
- Active filter count and clear filters

### Product Details Page

- Image gallery with thumbnails
- Product information and ratings
- Color and storage variant selectors
- Quantity selector
- Add to cart and buy now actions
- Specifications section
- Related products

### Shopping Cart

- Cart items list with images
- Quantity controls (+/-)
- Remove items
- Order summary (subtotal, shipping, tax, total)
- Free shipping threshold indicator
- Empty cart state

### Checkout

- 3-step flow with progress indicator
- **Step 1**: Shipping address form with validation
- **Step 2**: Shipping method selection
- **Step 3**: Payment method (credit card, PayPal, COD)
- Order summary sidebar
- Form validation with error messages

## 🔧 Configuration

### API Proxy

The Vite config is set up to proxy API requests to a backend server:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

## 📝 Next Steps (Backend Integration)

To connect with a real backend:

1. Set up Node.js + Express server (see `server/` directory)
2. Configure MongoDB connection
3. Replace mock data in `src/data/products.js` with API calls
4. Update API service in `src/services/api.js` with real endpoints

## 🎉 Ready to Use!

The frontend is fully functional with mock data and ready for backend integration. All UI components are built following modern best practices and the Figma design specification.

---

Made with ❤️ by Antigravity
