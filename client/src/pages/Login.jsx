import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { mockUsers } from '../data/mockUsers'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu')
      return
    }

    // Mock authentication
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    )

    if (!user) {
      setError('Email hoặc mật khẩu không đúng')
      return
    }

    // Login success - store user without password
    const { password: _, ...userWithoutPassword } = user
    login(userWithoutPassword, `mock-token-${user.id}`)

    // Redirect based on role
    if (user.role === 'owner') {
      navigate('/owner/dashboard')
    } else {
      navigate('/')
    }
  }

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

            <button type="submit" className="btn btn-primary login-btn">
              Đăng nhập
            </button>
          </form>

          {/* Demo accounts for testing */}
          <div className="demo-accounts">
            <div className="demo-accounts-title">🎮 Tài khoản test</div>
            <div
              className="demo-account"
              onClick={() => handleDemoLogin('user@gmail.com', '123456')}
            >
              <div className="demo-account-info">
                <span className="demo-account-role role-user">👤 User</span>
                <span className="demo-account-email">user@gmail.com / 123456</span>
              </div>
              <button className="demo-account-btn">Dùng</button>
            </div>
            <div
              className="demo-account"
              onClick={() => handleDemoLogin('owner@gmail.com', '123456')}
            >
              <div className="demo-account-info">
                <span className="demo-account-role role-owner">👑 Owner</span>
                <span className="demo-account-email">owner@gmail.com / 123456</span>
              </div>
              <button className="demo-account-btn">Dùng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
