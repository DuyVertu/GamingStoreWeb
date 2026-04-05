import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'
import { useWishlistStore } from '../store/useWishlistStore'
import ProductGrid from '../components/Product/ProductGrid'
import { formatVND } from '../utils/format'
import api from '../services/api'
import './ProductDetails.css'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedStorage, setSelectedStorage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setNotFound(false)
        const res = await api.get(`/products/${id}`)
        const p = res.data.data
        setProduct(p)
        setSelectedColor(p.colors?.[0] || '')
        setSelectedStorage(p.storage?.[0] || '')

        // Tải sản phẩm liên quan cùng danh mục
        if (p.category) {
          const relatedRes = await api.get(`/products?category=${p.category}`)
          const related = relatedRes.data.data.filter(r => r._id !== p._id).slice(0, 4)
          setRelatedProducts(related)
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setNotFound(true)
        } else {
          console.error('Lỗi tải sản phẩm:', error)
          setNotFound(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: '#888' }}>
        ⏳ Đang tải thông tin sản phẩm...
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
        <p style={{ color: '#888', marginBottom: '20px' }}>Không tìm thấy sản phẩm này</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          ← Quay lại danh sách
        </button>
      </div>
    )
  }

  const displayPrice = product.salePrice || product.price
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0
  const productId = product._id || product.id
  const inWishlist = isInWishlist(productId)

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  const handleBuyNow = () => {
    addItem(product, quantity)
    navigate('/cart')
  }

  // Xử lý specs có thể là Map (MongoDB) hoặc object thường
  const specsEntries = product.specs
    ? product.specs instanceof Map
      ? [...product.specs.entries()]
      : Object.entries(product.specs)
    : []

  return (
    <div className="product-details-page">
      <div className="container">
        {/* Product Detail */}
        <div className="product-detail">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="gallery-main">
              <img
                src={product.images?.[currentImage] || product.image}
                alt={product.name}
              />
              {product.salePrice && (
                <span className="badge badge-sale discount-badge">
                  -{discount}%
                </span>
              )}
              {product.isNew && (
                <span className="badge badge-new new-badge">
                  New
                </span>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="gallery-thumbs">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumb ${idx === currentImage ? 'active' : ''}`}
                    onClick={() => setCurrentImage(idx)}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <div>
                <p className="product-brand">{product.brand}</p>
                <h1 className="product-name">{product.name}</h1>
              </div>
              <button
                className={`wishlist-btn-large ${inWishlist ? 'active' : ''}`}
                onClick={() => toggleItem(product)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={i < Math.floor(product.rating || 0) ? '#FFD700' : 'none'}
                    stroke="#FFD700"
                    strokeWidth="2"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="rating-text">
                {product.rating || 0} ({product.reviewCount || 0} đánh giá)
              </span>
            </div>

            <div className="product-price-section">
              <div className="price-main">
                <span className="price-current">{formatVND(displayPrice)}</span>
                {product.salePrice && (
                  <span className="price-original">{formatVND(product.price)}</span>
                )}
              </div>
              <p className="stock-status">
                {product.stock > 0 ? `✅ Còn ${product.stock} sản phẩm` : '❌ Hết hàng'}
              </p>
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* Variants */}
            {product.colors && product.colors.length > 0 && (
              <div className="variant-section">
                <h3 className="variant-title">Màu sắc: <span style={{color:'rgba(255,255,255,0.6)', fontWeight:400}}>{selectedColor}</span></h3>
                <div className="variant-options color-options">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`variant-btn color-btn ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.storage && product.storage.length > 0 && (
              <div className="variant-section">
                <h3 className="variant-title">Dung lượng</h3>
                <div className="variant-options">
                  {product.storage.map(storage => (
                    <button
                      key={storage}
                      className={`variant-btn ${selectedStorage === storage ? 'active' : ''}`}
                      onClick={() => setSelectedStorage(storage)}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="quantity-section">
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                  </svg>
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14m-7-7h14"/>
                  </svg>
                </button>
              </div>

              <div className="action-buttons">
                <button
                  className="btn btn-outline btn-lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  Thêm vào giỏ
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {specsEntries.length > 0 && (
          <div className="specs-section">
            <h2 className="section-title">Thông số kỹ thuật</h2>
            <div className="specs-grid">
              {specsEntries.map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-section">
            <h2 className="section-title">Sản phẩm tương tự</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetails
