"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import CartSidebar from "../components/CartSidebar"
import OrderStatus from "../components/OrderStatus"
import "../styles/CartPage.css"

// --- DUMMY DATA FOR TESTING ---
const items = [
  {
    id: 1,
    name: "Nasi Goreng",
    price: 25000,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Ayam Bakar",
    price: 30000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
  },
]
const updateQuantity = (id, qty) => alert(`Update quantity for item ${id} to ${qty}`)
const removeFromCart = (id) => alert(`Remove item ${id}`)
const clearCart = () => alert("Cart cleared")

function CartPage() {
  const [currentView, setCurrentView] = useState("cart") // "cart" or "status"
  const [orderData, setOrderData] = useState(null)

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = items.length > 0 ? 5000 : 0
  const total = subtotal + shipping

  const handleNavigateToStatus = (data) => {
    setOrderData(data)
    setCurrentView("status")
  }

  const handleBackToCart = () => {
    setCurrentView("cart")
    setOrderData(null)
  }

  if (currentView === "status" && orderData) {
    return (
      <div className="cart-page-container">
        <Header />
        <main className="cart-main-content">
          <OrderStatus orderData={orderData} onBackToCart={handleBackToCart} />
        </main>
        <footer className="cart-footer">
          <div className="footer-content">
            <div className="footer-text">
              <p>© 2023 FoodHub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="cart-page-container">
      <Header />

      <main className="cart-main-content">
        <div className="cart-header">
          <h1 className="cart-title">Your Cart</h1>
          <Link to="/" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="empty-cart-icon"
              >
                <path d="M2 3h2l3.4 7h11.2l3.4-7H22" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="17" cy="20" r="1" />
                <path d="M3 3h18v13H3z" />
              </svg>
            </div>
            <h2 className="empty-cart-title">Your cart is empty</h2>
            <p className="empty-cart-message">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="browse-button">
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items-column">
              <div className="cart-items-card">
                <div className="cart-card-header">
                  <h2 className="cart-card-title">Cart Items ({items.length})</h2>
                </div>
                <div className="cart-card-content">
                  <div className="cart-items-list">
                    {items.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-image-container">
                          <img src={item.image || "/placeholder.svg"} alt={item.name} className="cart-item-image" />
                        </div>
                        <div className="cart-item-content">
                          <div className="cart-item-header">
                            <h3 className="cart-item-name">{item.name}</h3>
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
                          <div className="cart-item-price">Rp {item.price.toLocaleString("id-ID")}</div>
                          <div className="cart-item-actions">
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
                            <button
                              className="quantity-button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
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
                            <div className="cart-item-total">
                              Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="cart-card-footer">
                  <button className="clear-cart-button" onClick={clearCart}>
                    Clear Cart
                  </button>
                  <Link to="/" className="add-more-button">
                    Add More Items
                  </Link>
                </div>
              </div>
            </div>

            <div className="order-summary-column">
              <CartSidebar onNavigateToStatus={handleNavigateToStatus} />
            </div>
          </div>
        )}
      </main>

      <footer className="cart-footer">
        <div className="footer-content">
          <div className="footer-text">
            <p>© 2023 FoodHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CartPage
