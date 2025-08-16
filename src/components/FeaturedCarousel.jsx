import { useState, useEffect } from 'react';
import axios from 'axios';
import './FeaturedCarousel.css';
import { useAuth } from '../context/AuthContext';
import BookingPopup from './BookingPopup';
import ViewPropertyPopup from './ViewPropertyPopup';
import { useNavigate } from 'react-router-dom';

export default function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false);
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/properties')
      .then(res => {
        console.log("Fetched properties:", res.data);
        if (Array.isArray(res.data)) {
          setProperties(res.data);
          setError(null);
        } else {
          console.error("Expected array but got:", res.data);
          setError("Invalid data format received");
          setProperties([]);
        }
      })
      .catch(err => {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties");
        setProperties([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex(prevIndex =>
      prevIndex >= totalPages - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prevIndex =>
      prevIndex <= 0 ? totalPages - 1 : prevIndex - 1
    );
  };

  const getCurrentProperties = () => {
    const startIndex = currentIndex * itemsPerPage;
    return properties.slice(startIndex, startIndex + itemsPerPage);
  };

  const currentProperties = getCurrentProperties();

  const openBookingPopup = (property, e) => {
    e.stopPropagation(); // prevent card click
    setSelectedProperty(property);
    setIsBookingPopupOpen(true);
  };

  const closeBookingPopup = () => {
    setIsBookingPopupOpen(false);
    setSelectedProperty(null);
  };

  const openViewPropertyPopup = (property, e) => {
    e.stopPropagation(); // prevent card click
    console.log("Opening view popup for property:", property);
    setSelectedProperty(property);
    setIsViewPopupOpen(true);
  };

  const closeViewPropertyPopup = () => {
    setIsViewPopupOpen(false);
    setSelectedProperty(null);
  };

  if (loading) {
    return <div className="featured-carousel loading">Loading properties...</div>;
  }

  if (error) {
    return <div className="featured-carousel error">Error: {error}</div>;
  }

  if (properties.length === 0) {
    return <div className="featured-carousel no-data">No properties available</div>;
  }

  return (
    <div className="featured-carousel">
      <h2 className="carousel-title">FEATURED PROPERTIES</h2>

      <div className="carousel-container">
        {totalPages > 1 && (
          <button className="carousel-btn carousel-btn-left" onClick={prevSlide}>‹</button>
        )}

        <div className="properties-grid">
          {currentProperties.map((property, index) => (
            <div
              key={property._id || index}
              className="property-card"
              onClick={() => navigate(`/property/${property._id}`)} // Navigate on card click
            >
              <div className="property-image-container">
                {property.image ? (
                  <img src={property.image} alt={property.name} className="property-image" />
                ) : (
                  <div className="property-image placeholder-image">No Image</div>
                )}

                <div className="property-overlay">
                  <button
                    className="view-details-btn"
                    onClick={(e) => openViewPropertyPopup(property, e)}
                  >
                    View Details
                  </button>
                </div>
              </div>

              <div className="property-content">
                <div className="property-price">
                  ₹ {property.rate ? (property.rate * 1000).toLocaleString() : 'Price not available'}
                </div>

                <h3 className="property-name">{property.name || 'Unnamed Property'}</h3>

                <div className="property-location">
                  {(property.address?.area || 'Unknown Area') + ' | ' + (property.address?.city || 'Unknown City')}
                </div>

                <div className="property-specs">
                  {property.specification || 'No specs'} | {property.total_plots || '0'} Plots
                </div>

                <div className="property-actions">
                  {isAuthenticated ? (
                    <div className="button-group">
                      <button
                        className="book-btn"
                        onClick={(e) => openBookingPopup(property, e)}
                      >
                        Book
                      </button>
                      <button
                        className="view-btn"
                        onClick={(e) => openViewPropertyPopup(property, e)}
                      >
                        View
                      </button>
                    </div>
                  ) : (
                    <button className="buy-btn" onClick={(e) => e.stopPropagation()}>
                      Buy
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <button className="carousel-btn carousel-btn-right" onClick={nextSlide}>›</button>
        )}
      </div>

      {totalPages > 1 && (
        <div className="carousel-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Booking Popup */}
      {isBookingPopupOpen && selectedProperty && (
        <BookingPopup
          isOpen={isBookingPopupOpen}
          onClose={closeBookingPopup}
          property={selectedProperty}
        />
      )}

      {/* View Property Popup */}
      {isViewPopupOpen && selectedProperty && (
        <ViewPropertyPopup
          isOpen={isViewPopupOpen}
          onClose={closeViewPropertyPopup}
          property={selectedProperty}
        />
      )}
    </div>
  );
}
