import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ForgotPassword.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Vui lòng nhập email của bạn')
      return
    }

    // Mock - just show success
    setSubmitted(true)
  }

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <div className="forgot-card">
          <div className="forgot-header">
            <div className="forgot-icon">🔑</div>
            <h2 className="forgot-title">Quên mật khẩu?</h2>
            <p className="forgot-subtitle">
              Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn
            </p>
          </div>

          {!submitted ? (
            <form className="forgot-form" onSubmit={handleSubmit}>
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

              {error && (
                <div className="form-error">
                  <span>⚠</span> {error}
                </div>
              )}

              <button type="submit" className="btn btn-secondary forgot-btn">
                Gửi link đặt lại
              </button>
            </form>
          ) : (
            <div className="forgot-success">
              <div className="forgot-success-icon">✅</div>
              <p>
                Đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>. 
                Vui lòng kiểm tra hộp thư email của bạn.
              </p>
            </div>
          )}

          <div className="forgot-back">
            <Link to="/login">← Quay lại đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
