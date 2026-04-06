import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'
import { useAuthStore } from '../store/useAuthStore'
import { formatVND } from '../utils/format'
import ProgressIndicator from '../components/Checkout/ProgressIndicator'
import api from '../services/api'
import './Checkout.css'

// ========================
// VNPAY Simulated Gateway
// ========================
function VNPayGateway({ amount, onSuccess, onCancel }) {
  const [stage, setStage] = useState('form') // 'form' | 'processing' | 'success'
  const [otp, setOtp] = useState('')
  const [cardInfo, setCardInfo] = useState({ number: '9704198526191432198', name: 'NGUYEN VAN A', date: '07/15', bank: 'NCB' })
  const [error, setError] = useState('')

  const handlePay = () => {
    if (!cardInfo.number || !cardInfo.name || !cardInfo.date) {
      setError('Vui lòng điền đầy đủ thông tin thẻ')
      return
    }
    setStage('processing')
    // Tự động gửi OTP sau 1s
    setTimeout(() => setStage('otp'), 1000)
  }

  const handleOtpSubmit = () => {
    if (otp.length < 4) { setError('Vui lòng nhập OTP'); return }
    setStage('processing')
    setTimeout(() => {
      setStage('success')
      setTimeout(onSuccess, 1500)
    }, 1500)
  }

  return (
    <div className="vnpay-overlay">
      <div className="vnpay-modal">
        {/* Header */}
        <div className="vnpay-header">
          <div className="vnpay-logo">
            <span className="vnpay-logo-text">VN<span>PAY</span></span>
          </div>
          <button className="vnpay-close" onClick={onCancel}>✕</button>
        </div>

        {/* Amount */}
        <div className="vnpay-amount">
          <p className="vnpay-amount-label">Số tiền thanh toán</p>
          <p className="vnpay-amount-value">{formatVND(amount)}</p>
          <p className="vnpay-merchant">GamingGear Store</p>
        </div>

        {stage === 'form' && (
          <div className="vnpay-body">
            <div className="vnpay-bank-selector">
              <label className="vnpay-label">Ngân hàng</label>
              <select
                className="vnpay-input"
                value={cardInfo.bank}
                onChange={e => setCardInfo(p => ({ ...p, bank: e.target.value }))}
              >
                <option value="NCB">NCB - Ngân hàng Quốc Dân</option>
                <option value="VCB">VCB - Vietcombank</option>
                <option value="BIDV">BIDV - Ngân hàng Đầu tư</option>
                <option value="TCB">TCB - Techcombank</option>
                <option value="MB">MB - Ngân hàng Quân đội</option>
              </select>
            </div>
            <div className="vnpay-field">
              <label className="vnpay-label">Số thẻ</label>
              <input
                className="vnpay-input"
                value={cardInfo.number}
                onChange={e => setCardInfo(p => ({ ...p, number: e.target.value }))}
                placeholder="Nhập số thẻ ATM"
                maxLength={19}
              />
            </div>
            <div className="vnpay-field">
              <label className="vnpay-label">Tên chủ thẻ</label>
              <input
                className="vnpay-input"
                value={cardInfo.name}
                onChange={e => setCardInfo(p => ({ ...p, name: e.target.value }))}
                placeholder="NGUYEN VAN A"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            <div className="vnpay-field">
              <label className="vnpay-label">Ngày phát hành (MM/YY)</label>
              <input
                className="vnpay-input"
                value={cardInfo.date}
                onChange={e => setCardInfo(p => ({ ...p, date: e.target.value }))}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            {error && <p className="vnpay-error">{error}</p>}
            <div className="vnpay-actions">
              <button className="vnpay-btn-cancel" onClick={onCancel}>Hủy</button>
              <button className="vnpay-btn-pay" onClick={handlePay}>Tiếp tục</button>
            </div>
            <div className="vnpay-security">
              🔒 Giao dịch được bảo mật bởi SSL/TLS 256-bit
            </div>
          </div>
        )}

        {stage === 'otp' && (
          <div className="vnpay-body">
            <div className="vnpay-otp-info">
              <div className="vnpay-otp-icon">📱</div>
              <p>Mã OTP đã được gửi tới số điện thoại đăng ký với ngân hàng <strong>{cardInfo.bank}</strong></p>
              <p className="vnpay-otp-note">Mã có hiệu lực trong <strong>3 phút</strong></p>
            </div>
            <div className="vnpay-field">
              <label className="vnpay-label">Nhập mã OTP</label>
              <input
                className="vnpay-input vnpay-otp-input"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                maxLength={6}
                autoFocus
              />
              <p className="vnpay-otp-hint">Gợi ý: nhập bất kỳ 6 số (môi trường demo)</p>
            </div>
            {error && <p className="vnpay-error">{error}</p>}
            <div className="vnpay-actions">
              <button className="vnpay-btn-cancel" onClick={() => { setStage('form'); setError('') }}>Quay lại</button>
              <button className="vnpay-btn-pay" onClick={handleOtpSubmit}>Xác nhận</button>
            </div>
          </div>
        )}

        {stage === 'processing' && (
          <div className="vnpay-body vnpay-processing">
            <div className="vnpay-spinner"></div>
            <p>Đang xử lý thanh toán...</p>
            <p className="vnpay-processing-note">Vui lòng không đóng trang này</p>
          </div>
        )}

        {stage === 'success' && (
          <div className="vnpay-body vnpay-result-success">
            <div className="vnpay-success-icon">✅</div>
            <h3>Thanh toán thành công!</h3>
            <p>{formatVND(amount)}</p>
            <p className="vnpay-processing-note">Đang chuyển hướng...</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ========================
// Main Checkout Component
// ========================
function Checkout() {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [showVNPay, setShowVNPay] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isOrderPlaced = React.useRef(false)

  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    zipCode: '',
    shippingMethod: 'standard',
    paymentMethod: 'vnpay',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })

  const [errors, setErrors] = useState({})

  // Redirect to cart when empty, but not when an order was just placed
  useEffect(() => {
    if (items.length === 0 && !isOrderPlaced.current) {
      navigate('/cart')
    }
  }, [items.length, navigate])

  if (items.length === 0) {
    return null
  }

  const subtotal = getTotal()
  const shipping = formData.shippingMethod === 'express' ? 80000 : (subtotal > 500000 ? 0 : 30000)
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + shipping + tax

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateStep = () => {
    const newErrors = {}
    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ tên'
      if (!formData.email) newErrors.email = 'Vui lòng nhập email'
      if (!formData.phone) newErrors.phone = 'Vui lòng nhập số điện thoại'
      if (!formData.address) newErrors.address = 'Vui lòng nhập địa chỉ'
      if (!formData.city) newErrors.city = 'Vui lòng nhập thành phố'
      if (!formData.zipCode) newErrors.zipCode = 'Vui lòng nhập mã bưu điện'
    }
    if (currentStep === 3) {
      // No extra validation needed for VNPAY or COD
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) setCurrentStep(prev => Math.min(prev + 1, 3))
  }

  const handlePrevious = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  // Create order in backend
  const createOrder = async (paymentMethodLabel) => {
    try {
      setIsSubmitting(true)
      const res = await api.post('/orders/checkout', {
        cartItems: items.map(item => ({
          _id: item._id || item.id,
          name: item.name,
          price: item.price,
          salePrice: item.salePrice,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          phone: formData.phone,
          shippingMethod: formData.shippingMethod,
        },
        paymentMethod: paymentMethodLabel,
      })
      isOrderPlaced.current = true
      clearCart()
      navigate('/order-success', { state: { order: res.data.data }, replace: true })
    } catch (err) {
      alert('Lỗi tạo đơn hàng: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep()) return

    if (formData.paymentMethod === 'vnpay') {
      setShowVNPay(true)
      return
    }

    // COD
    await createOrder('COD')
  }

  const handleVNPaySuccess = async () => {
    setShowVNPay(false)
    await createOrder('VNPAY')
  }


  return (
    <div className="checkout-page">
      {/* VNPAY Gateway Modal */}
      {showVNPay && (
        <VNPayGateway
          amount={total}
          onSuccess={handleVNPaySuccess}
          onCancel={() => setShowVNPay(false)}
        />
      )}

      <div className="container">
        <h1 className="page-title">Thanh toán</h1>
        <ProgressIndicator currentStep={currentStep} />

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* Step 1: Thông tin giao hàng */}
            {currentStep === 1 && (
              <div className="checkout-step">
                <h2 className="step-title">Thông tin giao hàng</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Họ và tên *</label>
                    <input type="text" name="fullName" className={`input ${errors.fullName ? 'input-error' : ''}`} value={formData.fullName} onChange={handleInputChange} placeholder="Nguyễn Văn A" />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" className={`input ${errors.email ? 'input-error' : ''}`} value={formData.email} onChange={handleInputChange} placeholder="your@email.com" />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input type="tel" name="phone" className={`input ${errors.phone ? 'input-error' : ''}`} value={formData.phone} onChange={handleInputChange} placeholder="0123456789" />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                  <div className="form-group full-width">
                    <label>Địa chỉ *</label>
                    <input type="text" name="address" className={`input ${errors.address ? 'input-error' : ''}`} value={formData.address} onChange={handleInputChange} placeholder="123 Đường ABC, Quận XYZ" />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>
                  <div className="form-group">
                    <label>Thành phố *</label>
                    <input type="text" name="city" className={`input ${errors.city ? 'input-error' : ''}`} value={formData.city} onChange={handleInputChange} placeholder="Hồ Chí Minh" />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>Mã bưu điện *</label>
                    <input type="text" name="zipCode" className={`input ${errors.zipCode ? 'input-error' : ''}`} value={formData.zipCode} onChange={handleInputChange} placeholder="700000" />
                    {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Vận chuyển */}
            {currentStep === 2 && (
              <div className="checkout-step">
                <h2 className="step-title">Phương thức vận chuyển</h2>
                <div className="shipping-options">
                  <label className={`shipping-option ${formData.shippingMethod === 'standard' ? 'active' : ''}`}>
                    <input type="radio" name="shippingMethod" value="standard" checked={formData.shippingMethod === 'standard'} onChange={handleInputChange} />
                    <div className="shipping-info">
                      <div>
                        <span className="shipping-name">Giao hàng tiêu chuẩn</span>
                        <p className="shipping-desc">5-7 ngày làm việc</p>
                      </div>
                      <span className="shipping-price">{subtotal > 500000 ? 'Miễn phí' : formatVND(30000)}</span>
                    </div>
                  </label>
                  <label className={`shipping-option ${formData.shippingMethod === 'express' ? 'active' : ''}`}>
                    <input type="radio" name="shippingMethod" value="express" checked={formData.shippingMethod === 'express'} onChange={handleInputChange} />
                    <div className="shipping-info">
                      <div>
                        <span className="shipping-name">Giao hàng nhanh</span>
                        <p className="shipping-desc">2-3 ngày làm việc</p>
                      </div>
                      <span className="shipping-price">{formatVND(80000)}</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Thanh toán */}
            {currentStep === 3 && (
              <div className="checkout-step">
                <h2 className="step-title">Phương thức thanh toán</h2>
                <div className="payment-methods">
                  <label className={`payment-method ${formData.paymentMethod === 'vnpay' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="vnpay" checked={formData.paymentMethod === 'vnpay'} onChange={handleInputChange} />
                    <span>
                      <span className="vnpay-badge">VN<b>PAY</b></span> Thanh toán qua VNPAY
                    </span>
                  </label>
                  <label className={`payment-method ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} />
                    <span>💵 Thanh toán khi nhận hàng (COD)</span>
                  </label>
                </div>

                {formData.paymentMethod === 'vnpay' && (
                  <div className="vnpay-info-box">
                    <div className="vnpay-info-logo">VN<b>PAY</b></div>
                    <p>Bạn sẽ được chuyển đến cổng thanh toán <strong>VNPAY</strong> để hoàn tất giao dịch</p>
                    <p className="vnpay-info-note">Hỗ trợ thẻ ATM nội địa, Visa, MasterCard của hơn 40 ngân hàng</p>
                  </div>
                )}

                {formData.paymentMethod === 'cod' && (
                  <div className="momo-info-box">
                    <div style={{ fontSize: '2rem' }}>💵</div>
                    <p>Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng</p>
                    <p className="vnpay-info-note">Nhấn "Đặt hàng" để xác nhận đơn hàng</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="checkout-actions">
              {currentStep > 1 && (
                <button type="button" className="btn btn-outline" onClick={handlePrevious}>← Quay lại</button>
              )}
              {currentStep < 3 ? (
                <button type="button" className="btn btn-primary" onClick={handleNext}>Tiếp tục →</button>
              ) : (
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? '⏳ Đang xử lý...' : formData.paymentMethod === 'vnpay' ? '🔒 Thanh toán qua VNPAY' : '✅ Đặt hàng (COD)'}
                </button>
              )}
            </div>
          </form>

          {/* Order Summary */}
          <div className="order-summary">
            <h2 className="summary-title">Đơn hàng của bạn</h2>
            <div className="summary-items">
              {items.map(item => (
                <div key={item._id || item.id} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="summary-item-details">
                    <span className="summary-item-name">{item.name}</span>
                    <span className="summary-item-qty">x{item.quantity}</span>
                  </div>
                  <span className="summary-item-price">
                    {formatVND((item.salePrice || item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Vận chuyển</span>
                <span>{shipping === 0 ? 'Miễn phí' : formatVND(shipping)}</span>
              </div>
              <div className="summary-row">
                <span>Thuế (10%)</span>
                <span>{formatVND(tax)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Tổng cộng</span>
                <span>{formatVND(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
