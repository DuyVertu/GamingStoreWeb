import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { formatVND } from '../../utils/format'
import api from '../../services/api'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuthStore()

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    lowStockProducts: 0,
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          api.get('/products?limit=100'),
          api.get('/users'),
          api.get('/orders'),
        ])

        const products = productsRes.data.data || []
        const users = usersRes.data.data || []
        const orders = ordersRes.data.data || []

        setStats({
          totalProducts: products.length,
          totalCustomers: users.filter(u => u.role !== 'admin' && u.role !== 'owner').length,
          totalOrders: orders.length,
          lowStockProducts: products.filter(p => p.stock <= 10).length,
        })

        // 5 sản phẩm mới nhất
        setRecentProducts([...products].reverse().slice(0, 5))
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      icon: '🎮',
      label: 'Tổng sản phẩm',
      value: isLoading ? '...' : stats.totalProducts,
      color: 'green',
    },
    {
      icon: '👥',
      label: 'Khách hàng',
      value: isLoading ? '...' : stats.totalCustomers,
      color: 'blue',
    },
    {
      icon: '⚠️',
      label: 'Sắp hết hàng',
      value: isLoading ? '...' : stats.lowStockProducts,
      color: 'yellow',
    },
    {
      icon: '📦',
      label: 'Đơn hàng',
      value: isLoading ? '...' : stats.totalOrders || '—',
      color: 'purple',
    },
  ]

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2 className="welcome-title">
          Chào mừng, {user?.fullName || user?.name || 'Owner'} 👋
        </h2>
        <p className="welcome-subtitle">
          Đây là tổng quan cửa hàng GamingGear của bạn hôm nay
        </p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        {statCards.map((stat, index) => (
          <div className={`stat-card stat-card--${stat.color}`} key={index}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Sản phẩm mới thêm gần đây */}
        <div className="activity-card">
          <h3 className="activity-card-title">🆕 Sản phẩm mới nhất</h3>
          {isLoading ? (
            <p style={{ color: 'var(--color-text-muted)', padding: '16px 0' }}>Đang tải...</p>
          ) : recentProducts.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', padding: '16px 0' }}>Chưa có sản phẩm nào</p>
          ) : (
            <ul className="activity-list">
              {recentProducts.map((product) => (
                <li className="activity-item" key={product._id}>
                  <span className="activity-dot green"></span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600 }}>{product.name}</span>
                    <span style={{ marginLeft: 8, color: 'var(--color-primary)', fontWeight: 700 }}>
                      {formatVND(product.salePrice || product.price)}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Kho: {product.stock}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Thống kê nhanh */}
        <div className="activity-card">
          <h3 className="activity-card-title">📊 Thống kê nhanh</h3>
          <ul className="activity-list">
            <li className="activity-item">
              <span className="activity-dot green"></span>
              <span>Tổng sản phẩm trong kho: <strong>{stats.totalProducts}</strong></span>
            </li>
            <li className="activity-item">
              <span className="activity-dot blue"></span>
              <span>Số tài khoản khách hàng: <strong>{stats.totalCustomers}</strong></span>
            </li>
            <li className="activity-item">
              <span className={`activity-dot ${stats.lowStockProducts > 0 ? 'yellow' : 'green'}`}></span>
              <span>
                Sản phẩm sắp hết hàng (≤10): <strong style={{ color: stats.lowStockProducts > 0 ? '#fbbf24' : 'inherit' }}>
                  {stats.lowStockProducts}
                </strong>
              </span>
            </li>
            <li className="activity-item">
              <span className="activity-dot purple"></span>
              <span>Tổng đơn hàng: <strong>{stats.totalOrders || 'Chưa có dữ liệu'}</strong></span>
            </li>
          </ul>

          <div style={{ marginTop: 20, padding: '16px', background: 'rgba(0,255,136,0.05)', borderRadius: 12, border: '1px solid rgba(0,255,136,0.15)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>💡 Hệ thống đang hoạt động</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              ✅ API kết nối: MongoDB Local
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              Cập nhật: {formatDate(new Date().toISOString())}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
