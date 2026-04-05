import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import api from '../services/api'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu')
      return
    }

    setIsLoading(true)
    try {
      // Gọi lên Server Backend
      const response = await api.post('/auth/login', { email, password })
      
      const { token, user } = response.data
      
      // Lưu token vào Zustand store & LocalStorage
      login(user, token)

      // Chuyển hướng dựa theo quyền
      if (user.role === 'admin' || user.role === 'owner') {
        navigate('/owner/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  // Tiện ích để điền nhanh Demo Account
  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <Link to="/" className="login-logo">
              <span className="logo-icon">⚡</span>
              GAMING<span className="logo-accent">GEAR</span>
            </Link>
            <p className="login-subtitle">Đăng nhập vào tài khoản của bạn</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="form-error">
                <span>⚠</span> {error}
              </div>
            )}

            <div className="login-links">
              <Link to="/forgot-password">Quên mật khẩu?</Link>
              <Link to="/register">Đăng ký</Link>
            </div>

            <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
              {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Demo accounts for testing - bạn có thể tạo tài khoản này trong MongoDB */}
          <div className="demo-accounts">
            <div className="demo-accounts-title">🎮 Tài khoản test API nhanh (Điền Form)</div>
            <div
              className="demo-account"
              onClick={() => handleDemoLogin('nguyenkhanhduy0114@gmail.com', 'password123')}
            >
              <div className="demo-account-info">
                <span className="demo-account-role role-user">👤 User</span>
                <span className="demo-account-email">nguyenkhanhduy0114@gmail.com</span>
              </div>
              <button className="demo-account-btn">Điền API</button>
            </div>
            <div
              className="demo-account"
              onClick={() => handleDemoLogin('admin@gmail.com', 'admin123')}
            >
              <div className="demo-account-info">
                 <span className="demo-account-role role-owner">👑 Admin</span>
                <span className="demo-account-email">admin@gmail.com</span>
              </div>
              <button className="demo-account-btn">Điền API</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
