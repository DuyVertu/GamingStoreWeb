import { useState } from 'react'
import { mockCustomers } from '../../data/mockUsers'
import './ManageCustomers.css'

function ManageCustomers() {
  const [customers, setCustomers] = useState([...mockCustomers])
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0)
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  const handleDelete = (customerId) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản khách hàng này?')) {
      setCustomers(customers.filter((c) => c.id !== customerId))
      setSelectedCustomer(null)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="manage-customers">
      {/* Stats */}
      <div className="customer-stats">
        <div className="customer-stat">
          <div className="customer-stat-value">{customers.length}</div>
          <div className="customer-stat-label">Tổng khách hàng</div>
        </div>
        <div className="customer-stat">
          <div className="customer-stat-value">{totalOrders}</div>
          <div className="customer-stat-label">Tổng đơn hàng</div>
        </div>
        <div className="customer-stat">
          <div className="customer-stat-value">${totalRevenue.toLocaleString()}</div>
          <div className="customer-stat-label">Tổng doanh thu</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="manage-customers-toolbar">
        <div className="toolbar-search">
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="🔍 Tìm khách hàng theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Điện thoại</th>
              <th>Ngày đăng ký</th>
              <th>Đơn hàng</th>
              <th>Chi tiêu</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="table-empty">
                    <div className="table-empty-icon">👥</div>
                    <p>Không tìm thấy khách hàng nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer, index) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-cell">
                      <div className={`customer-avatar avatar-${(index % 6) + 1}`}>
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="customer-name">{customer.name}</div>
                        <div className="customer-email">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{customer.phone}</td>
                  <td>{formatDate(customer.createdAt)}</td>
                  <td>
                    <span
                      className={`order-badge ${customer.totalOrders === 0 ? 'no-orders' : ''}`}
                    >
                      {customer.totalOrders} đơn
                    </span>
                  </td>
                  <td>
                    <span className="table-price">${customer.totalSpent.toLocaleString()}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn"
                        title="Xem chi tiết"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        👁️
                      </button>
                      <button
                        className="action-btn delete"
                        title="Xóa"
                        onClick={() => handleDelete(customer.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">👤 Chi tiết khách hàng</h3>
              <button
                className="modal-close"
                onClick={() => setSelectedCustomer(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="customer-detail">
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Họ tên</span>
                  <span className="customer-detail-value">{selectedCustomer.name}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Email</span>
                  <span className="customer-detail-value">{selectedCustomer.email}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Điện thoại</span>
                  <span className="customer-detail-value">{selectedCustomer.phone}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Ngày đăng ký</span>
                  <span className="customer-detail-value">
                    {formatDate(selectedCustomer.createdAt)}
                  </span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Tổng đơn hàng</span>
                  <span className="customer-detail-value">{selectedCustomer.totalOrders} đơn</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Tổng chi tiêu</span>
                  <span className="customer-detail-value">
                    ${selectedCustomer.totalSpent.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedCustomer(null)}
              >
                Đóng
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleDelete(selectedCustomer.id)}
              >
                🗑️ Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageCustomers
