"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../hooks/useCart"
import "../styles/CartSidebar.css"
import CheckoutModal from "./CheckoutModal"

function CartSidebar() {
  const { items, updateQuantity, removeFromCart, clearCart, isLoading, error, isOnline, isAuthenticated } = useCart()
  const navigate = useNavigate()
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const feeservice = 2000
  const total = subtotal + feeservice

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      // Redirect to login page if not authenticated
      navigate('/login')
      return
    }
    // Show the checkout modal for authenticated users
    setShowCheckoutModal(true)
  }

  if (items.length === 0) {
    return (
      <div className="cart-sidebar-card">
        <div className="cart-sidebar-header">
          <h2 className="cart-sidebar-title">Detail Pesanan</h2>
        </div>
        <div className="cart-sidebar-content">
          <div className="empty-cart-message">
            <div className="empty-cart-icon-container">
            <img
             src="/add-to-cart.png" // Pastikan file ini ada di public/images/
            alt="Empty cart"
            className="empty-cart-icon"
             />
              </div>
            <h3 className="empty-cart-title">Keranjang Anda kosong</h3>
            <p className="empty-cart-text">Tambahkan item ke keranjang Anda untuk melihatnya.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="cart-sidebar-card">
        <div className="cart-sidebar-header">
          <h2 className="cart-sidebar-title">Ringkasan Pesanan</h2>
          {!isOnline && (
            <div className="cart-status-indicator offline">
              <span>Mode Offline</span>
            </div>
          )}
          {error && (
            <div className="cart-error-message">
              <span>{error}</span>
            </div>
          )}
        </div>
        <div className="cart-sidebar-content">
          {isLoading && (
            <div className="cart-loading">
              <span>Updating cart...</span>
            </div>
          )}
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image-container">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="cart-item-image" />
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <div className="cart-item-name">{item.name}</div>
                    <button className="remove-item-button" onClick={() => removeFromCart(item.id)}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="remove-icon"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      <span className="sr-only">Remove</span>
                    </button>
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-price">Rp {item.price.toLocaleString('id-ID')}</div>
                  </div>
                  <div className="cart-item-quantity">
                    <button
                      className="quantity-button"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="minus-icon"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      <span className="sr-only">Decrease quantity</span>
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button className="quantity-button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="plus-icon"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      <span className="sr-only">Increase quantity</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-divider"></div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="summary-row">
              <span>Biaya Layanan</span>
              <span>Rp {feeservice.toLocaleString('id-ID')}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>        {/* Moved checkout button here, directly below the summary */}
          <div className="cart-sidebar-footer">
            <button className="checkout-button" onClick={handleCheckout}>
              Selesaikan Proses Pembelian
            </button>
          </div>
        </div>
      </div>
      
      {showCheckoutModal && (
        <CheckoutModal onClose={() => setShowCheckoutModal(false)} />
      )}
    </>
  )
}

export default CartSidebar
