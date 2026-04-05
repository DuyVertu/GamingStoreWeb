import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Register.css'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  
  const [isOtpMode, setIsOtpMode] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: '', class: '' }
    if (password.length < 6) return { level: 1, text: 'Yếu', class: 'weak' }
    if (password.length < 10) return { level: 2, text: 'Trung bình', class: 'medium' }
    return { level: 3, text: 'Mạnh', class: 'strong' }
  }

  const strength = getPasswordStrength(formData.password)

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    setIsLoading(true)
    try {
      // Call real backend API
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      
      // If server successfully sent OTP
      setIsOtpMode(true)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối đến máy chủ. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!otpCode || otpCode.length < 6) {
      setError('Vui lòng nhập đầy đủ 6 số OTP')
      return
    }

    setIsLoading(true)
    try {
      await api.post('/auth/verify-email', {
        email: formData.email,
        code: otpCode
      })
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Mã OTP không hợp lệ, hoặc đã hết hạn.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <Link to="/" className="register-logo">
              <span className="logo-icon">⚡</span>
              GAMING<span className="logo-accent">GEAR</span>
            </Link>
            <p className="register-subtitle">
              {isOtpMode ? 'Xác thực tài khoản' : 'Tạo tài khoản mới để mua sắm'}
            </p>
          </div>

          {success ? (
            <div className="forgot-success">
              <div className="forgot-success-icon">🎉</div>
              <p>
                Xác thực thành công! Đang chuyển đến trang đăng nhập...
              </p>
            </div>
          ) : isOtpMode ? (
            // Form Nhập OTP
            <form className="register-form" onSubmit={handleOtpSubmit}>
              <div className="form-group" style={{textAlign: 'center'}}>
                <label className="form-label" style={{fontSize: '15px', marginBottom: '15px'}}>
                  Vui lòng kiểm tra hộp thư email <b>{formData.email}</b> và nhập mã 6 số OTP
                </label>
                <input
                  type="text"
                  className="form-input"
                  style={{textAlign: 'center', fontSize: '24px', letterSpacing: '5px'}}
                  maxLength={6}
                  placeholder="******"
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/[^0-9]/g, ''))
                    setError('')
                  }}
                />
              </div>
              
              {error && (
                <div className="form-error">
                  <span>⚠</span> {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary register-btn" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Xác Nhận OTP'}
              </button>
            </form>
          ) : (
            // Form Đăng ký thông thường
            <form className="register-form" onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label">Họ và tên *</label>
                <input
                  type="text"
                  className="form-input"
                  name="name"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="register-row">
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-input"
                    name="phone"
                    placeholder="0901234567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu *</label>
                <input
                  type="password"
                  className="form-input"
                  name="password"
                  placeholder="Ít nhất 6 ký tự"
                  value={formData.password}
                  onChange={handleChange}
                />
                {formData.password && (
                  <>
                    <div className="password-strength">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`strength-bar ${level <= strength.level ? `active ${strength.class}` : ''}`}
                        />
                      ))}
                    </div>
                    <div className={`strength-text ${strength.class}`}>
                      {strength.text}
                    </div>
                  </>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu *</label>
                <input
                  type="password"
                  className="form-input"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <div className="form-error">
                  <span>⚠</span> {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary register-btn" disabled={isLoading}>
                {isLoading ? 'Đang gửi...' : 'Đăng ký'}
              </button>
            </form>
          )}

          <div className="register-footer">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
