import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import './OwnerLayout.css'

function OwnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { path: '/owner/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/owner/gear', icon: '🎮', label: 'Quản lý Gear' },
    { path: '/owner/customers', icon: '👥', label: 'Quản lý Khách hàng' },
  ]

  const getPageTitle = () => {
    const current = navItems.find((item) => location.pathname === item.path)
    return current ? current.label : 'Dashboard'
  }

  return (
    <div className="owner-layout">
      {/* Sidebar */}
      <aside className={`owner-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            ⚡ GAMING<span className="logo-accent">GEAR</span>
          </Link>
          <span className="sidebar-badge">OWNER</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Menu</div>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="nav-item-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'O'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'Owner'}</div>
              <div className="sidebar-user-role">Owner</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="owner-main">
        <div className="owner-topbar">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="topbar-title">{getPageTitle()}</h1>
          <div className="topbar-actions">
            <Link to="/" className="topbar-back">
              ← Về trang chủ
            </Link>
          </div>
        </div>
        <div className="owner-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default OwnerLayout
