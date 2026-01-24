import { Link } from 'react-router-dom'
import ProductGrid from '../components/Product/ProductGrid'
import { mockProducts, categories } from '../data/products'
import './Home.css'

function Home() {
  const featuredProducts = mockProducts.filter(p => p.rating >= 4.8).slice(0, 8)
  const saleProducts = mockProducts.filter(p => p.salePrice)
  const newProducts = mockProducts.filter(p => p.isNew)
  
  return (
    <div className="home">
      {/* Hero  Banner - Gaming Style */}
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
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
      
      {/* Sale Products */}
      {saleProducts.length > 0 && (
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
      {newProducts.length > 0 && (
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
