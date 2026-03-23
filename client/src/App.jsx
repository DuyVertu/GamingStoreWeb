import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'
import OwnerLayout from './components/Owner/OwnerLayout'
import Dashboard from './pages/Owner/Dashboard'
import ManageGear from './pages/Owner/ManageGear'
import ManageCustomers from './pages/Owner/ManageCustomers'
import './App.css'

function App() {
  const location = useLocation()
  const isOwnerRoute = location.pathname.startsWith('/owner')
  const isAuthRoute = ['/login', '/forgot-password', '/register'].includes(location.pathname)

  return (
    <div className="app">
      {/* Hide header/footer on owner and auth pages */}
      {!isOwnerRoute && !isAuthRoute && <Header />}
      <main className={!isOwnerRoute && !isAuthRoute ? 'main-content' : ''}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />

          {/* Owner routes - protected */}
          <Route
            path="/owner"
            element={
              <PrivateRoute roles={['owner', 'admin']}>
                <OwnerLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="gear" element={<ManageGear />} />
            <Route path="customers" element={<ManageCustomers />} />
          </Route>
        </Routes>
      </main>
      {!isOwnerRoute && !isAuthRoute && <Footer />}
    </div>
  )
}

export default App
