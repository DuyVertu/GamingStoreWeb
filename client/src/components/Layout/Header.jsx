import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/useCartStore'
import { useAuthStore } from '../../store/useAuthStore'
import './Header.css'

function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { items } = useCartStore()
  const { user, logout } = useAuthStore()
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }
  
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo - Gaming */}
          <Link to="/" className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">
              GAMING<span className="logo-accent">GEAR</span>
            </span>
          </Link>
          
          {/* Search Bar */}
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Tìm chuột, bàn phím, tai nghe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <circle cx="9" cy="9" r="6" strokeWidth="2"/>
                <path d="M14 14L18 18" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </form>
          
          {/* Actions */}
          <div className="header-actions">
            <Link to="/products" className="header-link">
              Sản phẩm
            </Link>
            
            <button className="icon-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="2"/>
              </svg>
            </button>
            
            <Link to="/cart" className="icon-btn cart-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="9" cy="21" r="1" fill="currentColor"/>
                <circle cx="20" cy="21" r="1" fill="currentColor"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeWidth="2"/>
              </svg>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
            
            <div className="user-menu">
              {user ? (
                <>
                  {(user.role === 'owner' || user.role === 'admin') && (
                    <Link to="/owner/dashboard" className="header-link" style={{ color: 'var(--color-accent)' }}>
                      👑 Quản lý
                    </Link>
                  )}
                  <div className="user-chip">
                    <div className="user-avatar">
                      {(user.fullName || user.name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <span className="user-name">
                      {user.fullName || user.name || user.email?.split('@')[0]}
                    </span>
                    <div className="user-dropdown">
                      <div className="dropdown-email">{user.email}</div>
                      <div className="dropdown-divider" />
                      <button onClick={logout} className="dropdown-item danger">
                        🚪 Đăng xuất
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm">
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
