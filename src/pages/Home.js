import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import FoodCategories from "../components/FoodCategories"
import FoodItems from "../components/FoodItems"
import CartSidebar from "../components/CartSidebar"
import Footer from "../components/Footer"
import { fetchStores, getSellerReviews } from "../services/Api"
import "../styles/Home.css"

function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const loadStores = async () => {
      try {
        setLoading(true)
        const stores = await fetchStores()
        
        // Map stores to the format needed for display
        // Fetch ratings for each store //rating
        const mappedStores = await Promise.all(stores.map(async store => {
          let rating = null;
          let totalReviews = 0;
          
          try {
            const ratingData = await getSellerReviews(store.sellerId, 1, 0);
            if (ratingData && ratingData.totalReviews > 0) {
              rating = ratingData.averageRating;
              totalReviews = ratingData.totalReviews;
            }
          } catch (error) {
            console.error(`Failed to fetch rating for store ${store.sellerId}:`, error);
          }
          
          return {
            id: store.sellerId,
            name: store.storeName,
            slug: store.storeName.toLowerCase().replace(/\s+/g, ''),
            image: store.storeImageUrl || "/placeholder.svg?height=200&width=300",
            deliveryTime: store.deliveryTimeEstimate + " min",
            rating: rating,
            totalReviews: totalReviews
          }
        }))
        
        setRestaurants(mappedStores)
      } catch (err) {
        console.error("Failed to fetch stores:", err)
        setError("Failed to load restaurants. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    loadStores()
  }, [])
  return (
    <div className="home-container">
      <Header />

      <main className="main-content">
        <div className="grid-layout">
          <div className="main-column">
            <h1 className="page-title">Pesan Makanan Lezat Secara Online</h1>

            <FoodCategories 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <div className="section">
              <h2 className="section-title">Restoran Populer</h2>
              {loading ? (
                <div className="loading-container">
                  <p>Loading restaurants...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p>{error}</p>
                </div>
              ) : (
              <div className="restaurant-grid">
                {restaurants.map((restaurant) => (
                  <Link to={`/store/${restaurant.slug}`} key={restaurant.id} className="restaurant-card-link">
                    <div className="restaurant-card">
                      <div className="restaurant-image-container">
                        <img
                          src={restaurant.image || "/placeholder.svg"}
                          alt={restaurant.name}
                          className="restaurant-image"
                        />
                      </div>
                      <div className="restaurant-content">
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <div className="restaurant-info">
                          <div className="restaurant-rating">
                            {restaurant.rating !== null ? (
                              <>
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`star-icon ${i < Math.floor(restaurant.rating) ? "filled" : "empty"}`}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                  </svg>
                                ))}
                                <span className="rating-value">{restaurant.rating.toFixed(1)}</span>
                              </>
                            ) : (
                              <>
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className="star-icon empty"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                  </svg>
                                ))}
                                <span className="rating-value">N/A</span>
                              </>
                            )}
                          </div>
                          <span className="info-separator">•</span>
                          <span>{restaurant.deliveryTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              )}
            </div>

            <div className="section">
              <h2 className="section-title">Menu Andalan</h2>
              <FoodItems selectedCategory={selectedCategory} />
            </div>
          </div>

          <div className="sidebar-column">
            <CartSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
