import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { formatVND } from '../utils/format'
import './OrderSuccess.css'

const REDIRECT_SECONDS = 7

function OrderSuccess() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const order = state?.order
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS)

  useEffect(() => {
    if (!order) {
      navigate('/')
      return
    }
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [order, navigate])

  if (!order) return null

  return (
    <div className="order-success-page">
      <div className="order-success-card">
        {/* Animated checkmark */}
        <div className="order-success-icon">
          <svg className="checkmark-svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>

        <h2>Đặt hàng thành công!</h2>
        <p className="order-success-subtitle">
          Cảm ơn bạn đã mua hàng tại <strong>GamingGear Store</strong>
        </p>

        {/* Order details */}
        <div className="order-success-details">
          <div className="order-detail-row">
            <span>Mã đơn hàng</span>
            <strong className="order-id">#{order._id?.slice(-8).toUpperCase() || 'N/A'}</strong>
          </div>
          <div className="order-detail-row">
            <span>Tổng tiền</span>
            <strong className="order-total">{formatVND(order.totalPrice || 0)}</strong>
          </div>
          <div className="order-detail-row">
            <span>Trạng thái</span>
            <span className="order-status-badge">✅ Đã xác nhận</span>
          </div>
          <div className="order-detail-row">
            <span>Thanh toán</span>
            <span className="order-paid-badge">
              {order.isPaid ? '💳 Đã thanh toán qua VNPAY' : '💵 Thanh toán khi nhận hàng'}
            </span>
          </div>
        </div>

        {/* Countdown */}
        <div className="countdown-bar-wrapper">
          <div
            className="countdown-bar"
            style={{ width: `${(countdown / REDIRECT_SECONDS) * 100}%` }}
          />
        </div>
        <p className="countdown-text">
          Tự động về trang chủ sau <strong>{countdown}</strong> giây...
        </p>

        {/* Actions */}
        <div className="order-success-actions">
          <button className="btn btn-outline" onClick={() => navigate('/products')}>
            🛒 Tiếp tục mua sắm
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            🏠 Về trang chủ
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
