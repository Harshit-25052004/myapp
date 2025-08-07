import { useState, useEffect } from 'react';
import './ViewPropertyPopup.css';
import BookingPopup from './BookingPopup';
import axios from 'axios';

export default function ViewPropertyPopup({ isOpen, onClose, propertyId, propertyName }) {
  const [plots, setPlots] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && propertyId) {
      console.log("Fetching plots for property ID:", propertyId);
      setLoading(true);
      setError(null);
      
      // Ensure propertyId is a string and clean it
      const cleanPropertyId = String(propertyId).trim();
      
      axios.get(`http://localhost:5000/api/properties/${cleanPropertyId}/plots`)
        .then(res => {
          console.log("Plots API response:", res.data);
          if (res.data && res.data.all) {
            setPlots(res.data.all);
            setError(null);
          } else {
            console.error("Unexpected data format:", res.data);
            setError("Invalid data format received");
            setPlots([]);
          }
        })
        .catch(err => {
          console.error("Error loading data from backend:", err);
          console.error("Request details:", {
            url: `http://localhost:5000/api/properties/${cleanPropertyId}/plots`,
            propertyId: cleanPropertyId,
            status: err.response?.status,
            data: err.response?.data
          });
          
          if (err.response?.status === 404) {
            setError("Property not found or has no plots");
          } else if (err.response?.status === 400) {
            setError("Invalid property ID format");
          } else {
            setError("Failed to load plots data");
          }
          setPlots([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, propertyId]);

  const openBookingPopup = (plot) => {
    setSelectedPlot(plot);
    setIsBookingPopupOpen(true);
  };

  const closeBookingPopup = () => {
    setSelectedPlot(null);
    setIsBookingPopupOpen(false);
  };

  const filterPlots = (status) => plots.filter(plot => plot.status?.toLowerCase() === status);

  const availablePlots = plots.filter(plot => 
    !['booked', 'hold', 'complete'].includes(plot.status?.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="view-property-overlay" onClick={onClose}>
      <div className="view-property-popup" onClick={e => e.stopPropagation()}>
        <div className="view-property-header">
          <h2 className="view-property-title">{propertyName || 'Property Details'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="tab-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading plots...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>Error: {error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : (
            <>
              <div className="section-header">Plot Summary</div>
              <div className="plots-summary">
                <div className="plot-row">
                  <span className="plot-number">Total Plots:</span>
                  <span>{plots.length}</span>
                </div>
                <div className="plot-row">
                  <span className="plot-number">Available:</span>
                  <span className="status-box available-box">{availablePlots.length}</span>
                </div>
                <div className="plot-row">
                  <span className="plot-number">Booked:</span>
                  <span className="status-box booked-box">{filterPlots('booked').length}</span>
                </div>
                <div className="plot-row">
                  <span className="plot-number">On Hold:</span>
                  <span className="status-box hold-box">{filterPlots('hold').length}</span>
                </div>
                <div className="plot-row">
                  <span className="plot-number">Complete:</span>
                  <span className="status-box complete-box">{filterPlots('complete').length}</span>
                </div>
              </div>
              
              <div className="section-header">Plot Details</div>
              {plots.length > 0 ? (
                <div className="plots-list">
                  {plots.map((plot, index) => (
                    <div key={plot.id || index} className="plot-row">
                      <div className="plot-info">
                        <span className="plot-number">Plot {plot.number || index + 1}</span>
                        {plot.size && <span className="plot-details"> - {plot.size}</span>}
                        {plot.price && <span className="plot-details"> - ₹{plot.price}</span>}
                        {plot.facing && <span className="plot-details"> - {plot.facing}</span>}
                      </div>
                      
                      <div className="plot-actions">
                        <span className={`status-box ${plot.status?.toLowerCase() || 'unknown'}-box`}>
                          {plot.status || 'Unknown'}
                        </span>
                        
                        {availablePlots.includes(plot) && (
                          <button 
                            className="book-btn"
                            onClick={() => openBookingPopup(plot)}
                          >
                            Book
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  No plots available for this property.
                </div>
              )}
            </>
          )}
        </div>

        <div className="view-property-footer">
          <button className="close-popup-btn" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Booking Popup for individual plot */}
        {isBookingPopupOpen && selectedPlot && (
          <BookingPopup
            isOpen={isBookingPopupOpen}
            onClose={closeBookingPopup}
            plot={selectedPlot}
            propertyName={propertyName}
          />
        )}
      </div>
    </div>
  );
}