import { useAuthStore } from '../../store/useAuthStore'
import { mockProducts } from '../../data/products'
import { mockCustomers } from '../../data/mockUsers'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuthStore()

  const stats = [
    {
      icon: '🎮',
      label: 'Tổng sản phẩm',
      value: mockProducts.length,
    },
    {
      icon: '👥',
      label: 'Khách hàng',
      value: mockCustomers.length,
    },
    {
      icon: '📦',
      label: 'Đơn hàng',
      value: 24,
    },
    {
      icon: '💰',
      label: 'Doanh thu (USD)',
      value: '$12.4K',
    },
  ]

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2 className="welcome-title">
          Chào mừng, {user?.name || 'Owner'} 👋
        </h2>
        <p className="welcome-subtitle">
          Đây là tổng quan cửa hàng Gaming Gear của bạn hôm nay
        </p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Sections */}
      <div className="dashboard-grid">
        <div className="activity-card">
          <h3 className="activity-card-title">📋 Hoạt động gần đây</h3>
          <ul className="activity-list">
            <li className="activity-item">
              <span className="activity-dot green"></span>
              Thêm sản phẩm mới: Logitech G Pro X Superlight 2
            </li>
            <li className="activity-item">
              <span className="activity-dot blue"></span>
              Khách hàng mới: Đặng Quốc F đã đăng ký
            </li>
            <li className="activity-item">
              <span className="activity-dot purple"></span>
              Đơn hàng #1024 đã được xác nhận
            </li>
            <li className="activity-item">
              <span className="activity-dot yellow"></span>
              Cập nhật giá: Wooting 60HE+ giảm 10%
            </li>
            <li className="activity-item">
              <span className="activity-dot green"></span>
              Đơn hàng #1023 đã giao thành công
            </li>
          </ul>
        </div>

        <div className="activity-card">
          <h3 className="activity-card-title">🏆 Sản phẩm bán chạy</h3>
          <ul className="activity-list">
            {mockProducts.slice(0, 5).map((product) => (
              <li className="activity-item" key={product.id}>
                <span className="activity-dot green"></span>
                {product.name} — ⭐ {product.rating}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
