import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  X, MapPin, Tag, IndianRupee, Home, Clock,
  CheckCircle, Compass, Square
} from 'lucide-react';
import './ViewPropertyPopup.css';
import BookingPopup from './BookingPopup';

const statusConfig = {
  all: { label: 'All', countClass: 'all' },
  available: { label: 'Available', countClass: 'available' },
  booked: { label: 'Booked', countClass: 'booked' },
  hold: { label: 'Hold', countClass: 'hold' },
  complete: { label: 'Complete', countClass: 'complete' },
};

export default function ViewPropertyPopup({ isOpen, onClose, property }) {
  const [plotData, setPlotData] = useState({
    all: [], available: [], booked: [], hold: [], complete: []
  });
  const [bookingData, setBookingData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (property?._id) {
      axios
        .get(`http://localhost:5000/api/properties/${property._id}/plots`)
        .then((res) => {
          if (res.data && res.data.plots) {
            const grouped = res.data.plots;
            const allPlots = [
              ...grouped.available,
              ...grouped.booked,
              ...grouped.hold,
              ...grouped.complete,
            ];
            setPlotData({ ...grouped, all: allPlots });
          } else {
            console.warn('Unexpected plots API response:', res.data);
            setPlotData({ all: [], available: [], booked: [], hold: [], complete: [] });
          }
        })
        .catch((err) => {
          console.error('Error fetching plots:', err);
          setPlotData({ all: [], available: [], booked: [], hold: [], complete: [] });
        });
    }
  }, [property]);

  if (!isOpen || !property) return null;

  const handleBookClick = (plot) => {
    setBookingData(plot);
  };

  const handleBookingClose = () => {
    setBookingData(null);
  };

  const safeRender = (value) => {
    if (!value) return '';
    if (typeof value === 'object') {
      try {
        return Object.values(value).filter(Boolean).join(', ');
      } catch {
        return '';
      }
    }
    return value;
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {/* Header */}
        <div className="popup-header">
          <button className="popup-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
          <div className="popup-header-content">
            <h2 className="popup-title">{safeRender(property.name)}</h2>
            <div className="popup-meta">
              <div className="meta-item"><MapPin size={16} /> {safeRender(property.address)}</div>
              <div className="meta-item"><Tag size={16} /> {safeRender(property.rera_number)}</div>
              <div className="meta-item"><IndianRupee size={16} /> {safeRender(property.rate)}</div>
              <div className="meta-item"><Home size={16} /> {safeRender(property.total_plots)}</div>
              <div className="meta-item"><Clock size={16} /> {safeRender(property.specification)}</div>
              <div className="meta-item"><CheckCircle size={16} /> {safeRender(property.description)}</div>
              <div className="meta-item"><Compass size={16} />
                <a className="info-link" href={safeRender(property.map_url)} target="_blank" rel="noopener noreferrer">
                  View Map
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="status-tabs-container">
          <div className="status-tabs">
            {Object.entries(statusConfig).map(([status, config]) => (
              <button
                key={status}
                className={`status-tab ${selectedStatus === status ? 'active' : ''}`}
                onClick={() => setSelectedStatus(status)}
              >
                {config.label}
                <span className={`tab-count ${config.countClass}`}>
                  {plotData[status]?.length || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Plots List */}
        <div className="plots-content">
          {plotData[selectedStatus]?.length > 0 ? (
            <div className="plots-grid">
              {plotData[selectedStatus].map((plot, index) => (
                <div
                  key={plot._id || `${selectedStatus}-${index}`}
                  className={`plot-card ${plot.status?.toLowerCase() || 'available'}`}
                >
                  <Square size={16} /> {safeRender(plot.plot_number)}
                  {plot.status?.toLowerCase() === 'available' && (
                    <button className="book-btn" onClick={() => handleBookClick(plot)}>Book</button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-text">No plots found for {statusConfig[selectedStatus].label}</p>
            </div>
          )}
        </div>

        {/* Booking Popup */}
        {bookingData && (
          <BookingPopup
            plot={bookingData}
            property={property}
            onClose={handleBookingClose}
          />
        )}
      </div>
    </div>
  );
}
