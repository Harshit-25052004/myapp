import React, { useState } from 'react';
import axios from 'axios';
import './BookingPopup.css';

export default function BookingPopup({ isOpen, onClose, property }) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    aadharNumber: '',
    panNumber: '',
    plotNumber: property?.plotNumber || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bookingData = {
        ...formData,
        propertyName: property?.name,
        propertyId: property?._id,
        date: new Date().toISOString(),
      };

      await axios.post("http://localhost:5000/api/clients",
      JSON.stringify(bookingData), // explicitly serialize
      { headers: { "Content-Type": "application/json" } }
);


      alert('Booking successful!');
      onClose(); // Close popup
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to book. Try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="booking-popup-overlay" onClick={onClose}>
      <div className="booking-popup" onClick={(e) => e.stopPropagation()}>
        <div className="booking-popup-header">
          <h2 className="booking-popup-title">Book Property</h2>
          <button className="close-btn" onClick={onClose}>
            &#10006;
          </button>
        </div>

        <div className="property-name-display">
          <h3>{property.name}</h3>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clientName">Client Name *</label>
              <input type="text" name="clientName" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="clientPhone">Phone Number *</label>
              <input type="tel" name="clientPhone" maxLength="10" required onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="aadharNumber">Aadhar Card Number *</label>
              <input type="text" name="aadharNumber" maxLength="12" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="panNumber">PAN Card Number</label>
              <input type="text" name="panNumber" maxLength="10" onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="plotNumber">Plot Number *</label>
              <input type="text" name="plotNumber" required value={formData.plotNumber} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Submit Booking
          </button>
        </form>
      </div>
    </div>
  );
}
