import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import './Register.css'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

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

  const handleSubmit = (e) => {
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

    // Mock register - create user and auto login
    const newUser = {
      id: String(Date.now()),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: 'user',
      createdAt: new Date().toISOString(),
    }

    login(newUser, `mock-token-${newUser.id}`)
    setSuccess(true)

    // Redirect to home after short delay
    setTimeout(() => {
      navigate('/')
    }, 1500)
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
            <p className="register-subtitle">Tạo tài khoản mới để mua sắm</p>
          </div>

          {success ? (
            <div className="forgot-success">
              <div className="forgot-success-icon">🎉</div>
              <p>
                Đăng ký thành công! Đang chuyển hướng...
              </p>
            </div>
          ) : (
            <form className="register-form" onSubmit={handleSubmit}>
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

              <button type="submit" className="btn btn-primary register-btn">
                Đăng ký
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
