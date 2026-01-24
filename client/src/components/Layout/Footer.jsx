import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <h3 className="footer-brand">E-Store</h3>
            <p className="footer-tagline">
              Your Premium Electronics Shopping Destination
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4" fill="black"/>
                  <circle cx="18" cy="6" r="1.5"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Liên kết nhanh</h4>
            <ul className="footer-links">
              <li><a href="#about">Về chúng tôi</a></li>
              <li><a href="#products">Sản phẩm</a></li>
              <li><a href="#deals">Ưu đãi</a></li>
              <li><a href="#contact">Liên hệ</a></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div className="footer-section">
            <h4 className="footer-title">Hỗ trợ khách hàng</h4>
            <ul className="footer-links">
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#shipping">Vận chuyển</a></li>
              <li><a href="#returns">Đổi trả</a></li>
              <li><a href="#warranty">Bảo hành</a></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="footer-section">
            <h4 className="footer-title">Đăng ký nhận tin</h4>
            <p className="footer-text">
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Email của bạn"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                Đăng ký
              </button>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="footer-bottom">
          <p className="copyright">
            © 2024 E-Store. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#privacy">Chính sách bảo mật</a>
            <a href="#terms">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
