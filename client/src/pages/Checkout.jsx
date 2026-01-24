import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'
import ProgressIndicator from '../components/Checkout/ProgressIndicator'
import './Checkout.css'

function Checkout() {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState(1)
  
  const [formData, setFormData] = useState({
    // Step 1: Address
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    
    // Step 2: Shipping
    shippingMethod: 'standard',
    
    // Step 3: Payment
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })
  
  const [errors, setErrors] = useState({})
  
  if (items.length === 0) {
    navigate('/cart')
    return null
  }
  
  const subtotal = getTotal()
  const shipping = formData.shippingMethod === 'express' ? 50 : (subtotal > 500 ? 0 : 25)
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
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
    
    if (currentStep === 3 && formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Vui lòng nhập số thẻ'
      if (!formData.cardName) newErrors.cardName = 'Vui lòng nhập tên trên thẻ'
      if (!formData.expiryDate) newErrors.expiryDate = 'Vui lòng nhập ngày hết hạn'
      if (!formData.cvv) newErrors.cvv = 'Vui lòng nhập CVV'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateStep()) {
      // Process order
      clearCart()
      alert('Đặt hàng thành công! 🎉')
      navigate('/')
    }
  }
  
  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Thanh toán</h1>
        
        <ProgressIndicator currentStep={currentStep} />
        
        <div className="checkout-layout">
          {/* Checkout Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="checkout-step">
                <h2 className="step-title">Thông tin giao hàng</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Họ và tên *</label>
                    <input
                      type="text"
                      name="fullName"
                      className={`input ${errors.fullName ? 'input-error' : ''}`}
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      className={`input ${errors.email ? 'input-error' : ''}`}
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input
                      type="tel"
                      name="phone"
                      className={`input ${errors.phone ? 'input-error' : ''}`}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0123456789"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Địa chỉ *</label>
                    <input
                      type="text"
                      name="address"
                      className={`input ${errors.address ? 'input-error' : ''}`}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Đường ABC, Quận XYZ"
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Thành phố *</label>
                    <input
                      type="text"
                      name="city"
                      className={`input ${errors.city ? 'input-error' : ''}`}
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Hồ Chí Minh"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Mã bưu điện *</label>
                    <input
                      type="text"
                      name="zipCode"
                      className={`input ${errors.zipCode ? 'input-error' : ''}`}
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="700000"
                    />
                    {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Shipping Method */}
            {currentStep === 2 && (
              <div className="checkout-step">
                <h2 className="step-title">Phương thức vận chuyển</h2>
                
                <div className="shipping-options">
                  <label className={`shipping-option ${formData.shippingMethod === 'standard' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={handleInputChange}
                    />
                    <div className="shipping-info">
                      <div>
                        <span className="shipping-name">Giao hàng tiêu chuẩn</span>
                        <p className="shipping-desc">5-7 ngày làm việc</p>
                      </div>
                      <span className="shipping-price">{subtotal > 500 ? 'Miễn phí' : '$25'}</span>
                    </div>
                  </label>
                  
                  <label className={`shipping-option ${formData.shippingMethod === 'express' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={handleInputChange}
                    />
                    <div className="shipping-info">
                      <div>
                        <span className="shipping-name">Giao hàng nhanh</span>
                        <p className="shipping-desc">2-3 ngày làm việc</p>
                      </div>
                      <span className="shipping-price">$50</span>
                    </div>
                  </label>
                </div>
              </div>
            )}
            
            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="checkout-step">
                <h2 className="step-title">Phương thức thanh toán</h2>
                
                <div className="payment-methods">
                  <label className={`payment-method ${formData.paymentMethod === 'credit_card' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleInputChange}
                    />
                    <span>💳 Thẻ tín dụng / Ghi nợ</span>
                  </label>
                  
                  <label className={`payment-method ${formData.paymentMethod === 'paypal' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                    />
                    <span>PayPal</span>
                  </label>
                  
                  <label className={`payment-method ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <span>💵 Thanh toán khi nhận hàng</span>
                  </label>
                </div>
                
                {formData.paymentMethod === 'credit_card' && (
                  <div className="card-form">
                    <div className="form-group full-width">
                      <label>Số thẻ *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        className={`input ${errors.cardNumber ? 'input-error' : ''}`}
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Tên trên thẻ *</label>
                      <input
                        type="text"
                        name="cardName"
                        className={`input ${errors.cardName ? 'input-error' : ''}`}
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="NGUYEN VAN A"
                      />
                      {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Ngày hết hạn *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          className={`input ${errors.expiryDate ? 'input-error' : ''}`}
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          className={`input ${errors.cvv ? 'input-error' : ''}`}
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength="3"
                        />
                        {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="checkout-actions">
              {currentStep > 1 && (
                <button type="button" className="btn btn-outline" onClick={handlePrevious}>
                  ← Quay lại
                </button>
              )}
              {currentStep < 3 ? (
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                  Tiếp tục →
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  Đặt hàng
                </button>
              )}
            </div>
          </form>
          
          {/* Order Summary */}
          <div className="order-summary">
            <h2 className="summary-title">Đơn hàng của bạn</h2>
            
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="summary-item-details">
                    <span className="summary-item-name">{item.name}</span>
                    <span className="summary-item-qty">x{item.quantity}</span>
                  </div>
                  <span className="summary-item-price">
                    ${((item.salePrice || item.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Vận chuyển</span>
                <span>{shipping === 0 ? 'Miễn phí' : `$${shipping}`}</span>
              </div>
              <div className="summary-row">
                <span>Thuế (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Tổng cộng</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
