import { useNavigate } from 'react-router-dom'
import { useWishlistStore } from '../../store/useWishlistStore'
import { useCartStore } from '../../store/useCartStore'
import './ProductCard.css'

function ProductCard({ product }) {
  const navigate = useNavigate()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const { addItem } = useCartStore()
  
  const inWishlist = isInWishlist(product.id)
  const displayPrice = product.salePrice || product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price
  
  const handleBuyNow = (e) => {
    e.stopPropagation()
    addItem(product)
    navigate('/cart')
  }
  
  const handleWishlistToggle = (e) => {
    e.stopPropagation()
    toggleItem(product)
  }
  
  const handleCardClick = () => {
    navigate(`/products/${product.id}`)
  }
  
  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-wrapper">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
        />
        
        {/* Badges */}
        <div className="product-badges">
          {hasDiscount && (
            <span className="badge badge-sale">SALE</span>
          )}
          {product.isNew && (
            <span className="badge badge-new">NEW</span>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button 
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="2"/>
          </svg>
        </button>
      </div>
      
      {/* Product Info */}
      <div className="product-info">
        {product.brand && (
          <div className="product-brand">{product.brand}</div>
        )}
        
        <h3 className="product-name">{product.name}</h3>
        
        {/* Rating */}
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i}
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <span className="review-count">({product.reviewCount || 0})</span>
        </div>
        
        {/* Price */}
        <div className="product-price">
          <span className="price-current">${displayPrice}</span>
          {hasDiscount && (
            <span className="price-original">${product.price}</span>
          )}
        </div>
        
        {/* Buy Button */}
        <button className="buy-btn" onClick={handleBuyNow}>
          BUY NOW
        </button>
        
        {/* Stock Badge */}
        {product.stock < 10 && product.stock > 0 && (
          <div className="stock-badge low-stock">
            Only {product.stock} left!
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
