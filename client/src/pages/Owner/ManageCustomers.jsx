import { useState, useEffect } from 'react'
import api from '../../services/api'
import { formatVND } from '../../utils/format'
import './ManageCustomers.css'

function ManageCustomers() {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  // Fetch danh sách user từ API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true)
        const res = await api.get('/users')
        setCustomers(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi tải danh sách khách hàng')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(
    (c) =>
      (c.fullName || c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalCustomers = customers.filter(c => c.role !== 'admin' && c.role !== 'owner').length

  const handleBlockToggle = async (customer) => {
    try {
      const res = await api.put(`/users/${customer._id}/block`)
      setCustomers(prev =>
        prev.map(c => c._id === customer._id ? res.data.data : c)
      )
      if (selectedCustomer?._id === customer._id) {
        setSelectedCustomer(res.data.data)
      }
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
      case 'owner':
        return <span className="role-badge role-admin">👑 Admin</span>
      default:
        return <span className="role-badge role-user">👤 Khách hàng</span>
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Blocked':
        return <span className="status-badge status-blocked">🔴 Bị chặn</span>
      case 'Verified':
        return <span className="status-badge status-verified">🟢 Đã xác thực</span>
      default:
        return <span className="status-badge status-pending">🟡 Chờ xác thực</span>
    }
  }

  return (
    <div className="manage-customers">
      {/* Stats */}
      <div className="customer-stats">
        <div className="customer-stat">
          <div className="customer-stat-value">{customers.length}</div>
          <div className="customer-stat-label">Tổng tài khoản</div>
        </div>
        <div className="customer-stat">
          <div className="customer-stat-value">{totalCustomers}</div>
          <div className="customer-stat-label">Khách hàng</div>
        </div>
        <div className="customer-stat">
          <div className="customer-stat-value">
            {customers.filter(c => c.status === 'Verified').length}
          </div>
          <div className="customer-stat-label">Đã xác thực</div>
        </div>
        <div className="customer-stat">
          <div className="customer-stat-value" style={{ color: '#f87171' }}>
            {customers.filter(c => c.status === 'Blocked').length}
          </div>
          <div className="customer-stat-label">Bị chặn</div>
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

      {/* Loading / Error */}
      {isLoading && (
        <div className="table-empty">
          <div className="table-empty-icon">⏳</div>
          <p>Đang tải danh sách khách hàng...</p>
        </div>
      )}

      {error && (
        <div className="table-empty" style={{ color: '#f87171' }}>
          <div className="table-empty-icon">❌</div>
          <p>{error}</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày đăng ký</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="table-empty">
                      <div className="table-empty-icon">👥</div>
                      <p>Không tìm thấy khách hàng nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer._id}>
                    <td>
                      <div className="customer-cell">
                        <div className={`customer-avatar avatar-${(index % 6) + 1}`}>
                          {(customer.fullName || customer.name || customer.email || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="customer-name">
                            {customer.fullName || customer.name || '—'}
                          </div>
                          <div className="customer-email">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{getRoleBadge(customer.role)}</td>
                    <td>{getStatusBadge(customer.status)}</td>
                    <td>{formatDate(customer.createdAt)}</td>
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
                          className={`action-btn ${customer.status === 'Blocked' ? 'unblock' : 'delete'}`}
                          title={customer.status === 'Blocked' ? 'Bỏ chặn' : 'Chặn tài khoản'}
                          onClick={() => handleBlockToggle(customer)}
                        >
                          {customer.status === 'Blocked' ? '🔓' : '🔒'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">👤 Chi tiết tài khoản</h3>
              <button className="modal-close" onClick={() => setSelectedCustomer(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="customer-detail">
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Họ tên</span>
                  <span className="customer-detail-value">
                    {selectedCustomer.fullName || selectedCustomer.name || '—'}
                  </span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Email</span>
                  <span className="customer-detail-value">{selectedCustomer.email}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Số điện thoại</span>
                  <span className="customer-detail-value">{selectedCustomer.phone || '—'}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Vai trò</span>
                  <span className="customer-detail-value">{getRoleBadge(selectedCustomer.role)}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Trạng thái</span>
                  <span className="customer-detail-value">{getStatusBadge(selectedCustomer.status)}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Ngày đăng ký</span>
                  <span className="customer-detail-value">{formatDate(selectedCustomer.createdAt)}</span>
                </div>
                <div className="customer-detail-row">
                  <span className="customer-detail-label">Đăng nhập sai</span>
                  <span className="customer-detail-value">
                    {selectedCustomer.loginAttempts || 0} lần
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
                className={`btn btn-sm ${selectedCustomer.status === 'Blocked' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  handleBlockToggle(selectedCustomer)
                }}
              >
                {selectedCustomer.status === 'Blocked' ? '🔓 Bỏ chặn' : '🔒 Chặn tài khoản'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageCustomers
