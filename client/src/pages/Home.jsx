import { Link } from 'react-router-dom'
import ProductGrid from '../components/Product/ProductGrid'
import { mockProducts, categories } from '../data/products'
import './Home.css'

function Home() {
  const featuredProducts = mockProducts.slice(0, 8)
  const saleProducts = mockProducts.filter(p => p.salePrice)
  const newProducts = mockProducts.filter(p => p.isNew)
  
  return (
    <div className="home">
      {/* Hero Banner */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Trải nghiệm công nghệ<br />
                <span className="gradient-text">Đẳng cấp Premium</span>
              </h1>
              <p className="hero-description">
                Khám phá bộ sưu tập điện tử cao cấp với những sản phẩm mới nhất từ các thương hiệu hàng đầu thế giới
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-primary btn-lg">
                  Khám phá ngay
                </Link>
                <Link to="/products?sale=true" className="btn btn-outline btn-lg">
                  Ưu đãi đặc biệt
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&auto=format&fit=crop" 
                  alt="Premium Electronics" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Danh mục sản phẩm</h2>
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
      <section className="section bg-gray">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
            <Link to="/products" className="see-all">
              Xem tất cả →
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
      
      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="sale-badge">🔥</span> Giảm giá đặc biệt
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
        <section className="section bg-gray">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="new-badge">✨</span> Sản phẩm mới
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
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7h-9M14 17H5m13 0h2M7 7H5m7 10H5M14 7h2"/>
                </svg>
              </div>
              <h3 className="feature-title">Miễn phí vận chuyển</h3>
              <p className="feature-text">Cho đơn hàng trên 500.000đ</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                </svg>
              </div>
              <h3 className="feature-title">Bảo hành chính hãng</h3>
              <p className="feature-text">Đảm bảo 100% hàng chính hãng</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
              </div>
              <h3 className="feature-title">Thanh toán an toàn</h3>
              <p className="feature-text">Nhiều phương thức thanh toán</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="feature-title">Hỗ trợ 24/7</h3>
              <p className="feature-text">Đội ngũ hỗ trợ nhiệt tình</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
