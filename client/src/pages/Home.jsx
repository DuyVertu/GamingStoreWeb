import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/Product/ProductGrid'
import { categories } from '../data/products'
import api from '../services/api'
import './Home.css'

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [saleProducts, setSaleProducts] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true)
        // Gọi cả 3 API song song để tối ưu tốc độ
        const [allRes, saleRes, newRes] = await Promise.all([
          api.get('/products'),
          api.get('/products?sale=true'),
          api.get('/products?isNew=true'),
        ])

        // Sắp xếp theo rating cao nhất, lấy tối đa 8 sản phẩm nổi bật
        const sorted = [...allRes.data.data].sort((a, b) => (b.rating || 0) - (a.rating || 0))
        setFeaturedProducts(sorted.slice(0, 8))
        setSaleProducts(saleRes.data.data)
        setNewProducts(newRes.data.data)
      } catch (error) {
        console.error('Lỗi tải sản phẩm trang chủ:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAll()
  }, [])

  return (
    <div className="home">
      {/* Hero Banner - Gaming Style */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              GEAR UP FOR <span className="text-neon">VICTORY</span>
            </h1>
            <p className="hero-subtitle">
              Premium Gaming Peripherals cho Pro Players. Chuột, Bàn Phím, Tai nghe, IEM chuyên FPS, Màn hình OLED.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                🎮 Khám Phá Ngay
              </Link>
              <Link to="/products?sale=true" className="btn btn-outline btn-lg">
                ⚡ Flash Sale
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Gaming */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">GAMING CATEGORIES</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="category-card"
              >
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="badge-accent">⭐</span> PRO CHOICE
            </h2>
            <Link to="/products" className="see-all">
              Xem tất cả →
            </Link>
          </div>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              ⏳ Đang tải sản phẩm...
            </div>
          ) : featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <p>📦 Chưa có sản phẩm nào. Admin hãy thêm sản phẩm từ Dashboard!</p>
              <Link to="/owner/gear" className="btn btn-primary" style={{ marginTop: '12px', display: 'inline-block' }}>
                ➕ Thêm sản phẩm
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Sale Products */}
      {!isLoading && saleProducts.length > 0 && (
        <section className="section section-sale">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="badge-hot">🔥</span> FLASH SALE
              </h2>
              <Link to="/products?sale=true" className="see-all">
                Xem tất cả →
              </Link>
            </div>
            <ProductGrid products={saleProducts} />
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {!isLoading && newProducts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="badge-new">✨</span> NEW ARRIVALS
              </h2>
              <Link to="/products?new=true" className="see-all">
                Xem tất cả →
              </Link>
            </div>
            <ProductGrid products={newProducts} />
          </div>
        </section>
      )}

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title">SHIP TOÀN QUỐC</h3>
              <p className="feature-text">Miễn phí ship đơn trên 500K</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3 className="feature-title">100% CHÍNH HÃNG</h3>
              <p className="feature-text">Bảo hành chính hãng toàn cầu</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3 className="feature-title">THANH TOÁN AN TOÀN</h3>
              <p className="feature-text">Nhiều phương thức thanh toán</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎧</div>
              <h3 className="feature-title">HỖ TRỢ 24/7</h3>
              <p className="feature-text">Tư vấn nhiệt tình, chuyên nghiệp</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
