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
      <div className="product-card-image-wrapper">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-card-image"
        />
        {hasDiscount && (
          <span className="badge badge-sale product-badge">
            Sale
          </span>
        )}
        {product.isNew && (
          <span className="badge badge-new product-badge">
            New
          </span>
        )}
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
      
      <div className="product-card-content">
        <h3 className="product-card-title">{product.name}</h3>
        
        <div className="product-card-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i}
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill={i < Math.floor(product.rating || 0) ? "var(--color-rating-gold)" : "none"}
                stroke="var(--color-rating-gold)"
                strokeWidth="2"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <span className="rating-count">({product.reviewCount || 0})</span>
        </div>
        
        <div className="product-card-price">
          <span className="price">${displayPrice.toLocaleString()}</span>
          {hasDiscount && (
            <span className="original-price">${product.price.toLocaleString()}</span>
          )}
        </div>
        
        <button className="btn btn-primary btn-buy" onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>
    </div>
  )
}

export default ProductCard
