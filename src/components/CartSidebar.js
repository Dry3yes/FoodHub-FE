"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../hooks/useCart"

const CheckoutModal = ({ isOpen, onClose, items, total, onOrderSubmit }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: "",
  })
  const [paymentProof, setPaymentProof] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.phone) {
      setStep(2)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPaymentProof(file)
    }
  }

  const handleFinalSubmit = () => {
    setIsSubmitting(true)

    setTimeout(() => {
      const orderData = {
        items,
        customerData: formData,
        total,
        paymentProof,
        status: "pending_verification",
        orderId: "ORD-" + Date.now(),
        createdAt: new Date().toISOString(),
      }

      onOrderSubmit(orderData)
      setIsSubmitting(false)
      onClose()

      // Reset form
      setStep(1)
      setFormData({ name: "", phone: "", notes: "" })
      setPaymentProof(null)
    }, 2000)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content checkout-modal" onClick={(e) => e.stopPropagation()}>
        {step === 1 && (
          <>
            <div className="modal-header">
              <h3 className="modal-title">Data Pemesanan</h3>
              <button className="modal-close" onClick={onClose}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="order-summary-mini">
                <h4>Ringkasan Pesanan</h4>
                <div className="mini-items">
                  {items.map((item) => (
                    <div key={item.id} className="mini-item">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
                <div className="mini-total">
                  <strong>Total: Rp {total.toLocaleString("id-ID")}</strong>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="checkout-form">
                <div className="form-group">
                  <label>Nama Lengkap *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div className="form-group">
                  <label>Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div className="form-group">
                  <label>Catatan (Opsional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Catatan khusus untuk pesanan"
                    rows="3"
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Lanjut ke Pembayaran
                </button>
              </form>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="modal-header">
              <h3 className="modal-title">Pembayaran QRIS</h3>
              <button className="modal-close" onClick={onClose}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="payment-info">
                <div className="total-payment">
                  <h4>Total Pembayaran</h4>
                  <div className="amount">Rp {total.toLocaleString("id-ID")}</div>
                </div>

                <div className="qris-section">
                  <h4>📱 Scan QRIS untuk Pembayaran</h4>

                  <div className="qris-container">
                    <div className="qris-image">
                      <img src="/placeholder.svg?height=200&width=200" alt="QRIS Code" className="qris-code" />
                    </div>
                    <div className="qris-info">
                      <p>
                        <strong>Warung Makan Sederhana</strong>
                      </p>
                      <p>Scan dengan aplikasi:</p>
                      <div className="payment-apps">
                        <span className="app-badge">DANA</span>
                        <span className="app-badge">GoPay</span>
                        <span className="app-badge">OVO</span>
                        <span className="app-badge">ShopeePay</span>
                        <span className="app-badge">LinkAja</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="payment-notes">
                  <h5>⚠️ Penting:</h5>
                  <ul>
                    <li>
                      Bayar sesuai nominal exact: <strong>Rp {total.toLocaleString("id-ID")}</strong>
                    </li>
                    <li>Scan QRIS dengan aplikasi e-wallet Anda</li>
                    <li>Screenshot bukti pembayaran setelah berhasil</li>
                    <li>Upload bukti pembayaran di step selanjutnya</li>
                    <li>Pesanan akan diproses setelah pembayaran terverifikasi</li>
                  </ul>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setStep(1)}>
                  Kembali
                </button>
                <button className="btn-primary" onClick={() => setStep(3)}>
                  Sudah Bayar
                </button>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="modal-header">
              <h3 className="modal-title">Upload Bukti Pembayaran</h3>
              <button className="modal-close" onClick={onClose}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="upload-section">
                <h4>Upload Bukti Pembayaran QRIS</h4>
                <p>Upload screenshot bukti pembayaran dari aplikasi e-wallet Anda</p>

                <div className="file-upload">
                  <input
                    type="file"
                    id="payment-proof"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="payment-proof" className="upload-area">
                    {paymentProof ? (
                      <div className="file-preview">
                        <div className="file-icon">📄</div>
                        <div className="file-name">{paymentProof.name}</div>
                        <div className="file-size">{(paymentProof.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <div className="upload-icon">📷</div>
                        <div>Klik untuk upload bukti pembayaran</div>
                        <div className="upload-hint">Format: JPG, PNG (Max 5MB)</div>
                      </div>
                    )}
                  </label>
                </div>

                <div className="customer-summary">
                  <h5>Data Pemesanan:</h5>
                  <p>
                    <strong>Nama:</strong> {formData.name}
                  </p>
                  <p>
                    <strong>WhatsApp:</strong> {formData.phone}
                  </p>
                  {formData.notes && (
                    <p>
                      <strong>Catatan:</strong> {formData.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setStep(2)}>
                  Kembali
                </button>
                <button className="btn-primary" onClick={handleFinalSubmit} disabled={!paymentProof || isSubmitting}>
                  {isSubmitting ? "Mengirim Pesanan..." : "Kirim Pesanan"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CartSidebar() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart()
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const navigate = useNavigate()

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = items.length > 0 ? 5000 : 0
  const total = subtotal + shipping

  const handleOrderSubmit = (orderData) => {
    console.log("Order submitted:", orderData)

    // Save order data to localStorage for StatusPage
    localStorage.setItem("currentOrder", JSON.stringify(orderData))

    clearCart()

    // Navigate to status page
    navigate("/order-status")
  }

  if (items.length === 0) {
    return (
      <div className="cart-sidebar-card">
        <div className="cart-sidebar-header">
          <h2 className="cart-sidebar-title">Order Summary</h2>
        </div>
        <div className="cart-sidebar-content">
          <div className="empty-cart-message">
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
            {typeof window !== "undefined" && localStorage.getItem("token") ? (
              <>
                <h3 className="empty-cart-title">Your cart is empty</h3>
                <p className="empty-cart-text">Add items to your cart to see them here.</p>
              </>
            ) : (
              <>
                <h3 className="empty-cart-title">Login to see your cart</h3>
                <p className="empty-cart-text">Login to see your cart items.</p>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="cart-sidebar-card">
        <div className="cart-sidebar-header">
          <h2 className="cart-sidebar-title">Order Summary</h2>
        </div>
        <div className="cart-sidebar-content">
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
                    <div className="cart-item-price">Rp {item.price.toLocaleString("id-ID")}</div>
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
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Rp {shipping.toLocaleString("id-ID")}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="cart-sidebar-footer">
            <button className="checkout-button" onClick={() => setShowCheckoutModal(true)}>
              Complete your purchase
            </button>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        items={items}
        total={total}
        onOrderSubmit={handleOrderSubmit}
      />
    </>
  )
}

export default CartSidebar
