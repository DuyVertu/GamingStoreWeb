import { Link } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'
import { formatVND } from '../utils/format'
import './Cart.css'

function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()

  const subtotal = getTotal()
  const shipping = subtotal > 500000 ? 0 : 30000
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <div className="empty-cart">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Giỏ hàng ({items.length} sản phẩm)</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map(item => {
              const itemId = item._id || item.id
              const displayPrice = item.salePrice || item.price

              return (
                <div key={itemId} className="cart-item">
                  <Link to={`/products/${itemId}`} className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </Link>

                  <div className="cart-item-details">
                    <Link to={`/products/${itemId}`} className="cart-item-name">
                      {item.name}
                    </Link>
                    <p className="cart-item-brand">{item.brand}</p>

                    {item.salePrice && (
                      <div className="cart-item-discount">
                        <span className="badge badge-sale">Sale</span>
                        <span className="original-price">{formatVND(item.price)}</span>
                      </div>
                    )}
                  </div>

                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(itemId, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"/>
                      </svg>
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(itemId, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14m-7-7h14"/>
                      </svg>
                    </button>
                  </div>

                  <div className="cart-item-price">
                    {formatVND(displayPrice * item.quantity)}
                  </div>

                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(itemId)}
                    aria-label="Remove item"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              )
            })}

            <button className="btn-clear-cart" onClick={clearCart}>
              Xóa tất cả
            </button>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h2 className="summary-title">Tổng đơn hàng</h2>

            <div className="summary-row">
              <span>Tạm tính</span>
              <span>{formatVND(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Vận chuyển</span>
              <span>{shipping === 0 ? 'Miễn phí' : formatVND(shipping)}</span>
            </div>

            <div className="summary-row">
              <span>Thuế (10%)</span>
              <span>{formatVND(tax)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Tổng cộng</span>
              <span>{formatVND(total)}</span>
            </div>

            {shipping > 0 && (
              <p className="shipping-notice">
                💡 Mua thêm {formatVND(500000 - subtotal)} để được miễn phí vận chuyển!
              </p>
            )}

            <Link to="/checkout" className="btn btn-primary btn-lg checkout-btn">
              Thanh toán
            </Link>

            <Link to="/products" className="continue-shopping">
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
