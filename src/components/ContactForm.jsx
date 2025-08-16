import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm = ({property}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          property: property?.name || "Unknown Property",
          price: property?.price || "N/A",
        }),
      });

      if (response.ok) {
        alert("Thank you for your interest! We will contact you soon.");
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Something went wrong."}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in the property: ${property?.name || 'Property'} listed at ${property?.price || 'N/A'}`;
    const phoneNumber = '+971501234567'; // Agent's WhatsApp number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhone = () => {
    window.location.href = 'tel:+971501234567';
  };

  return (
    <div className="contact-form-container">
      {/* Price & Contact Buttons */}
      <div className="price-section">
        <div className="price-amount">
          ${property?.price} 
        </div>
        <div className="contact-buttons">
          <button className="phone-btn" onClick={handlePhone}>
            📞 PHONE
          </button>
          <button className="whatsapp-btn" onClick={handleWhatsApp}>
            💬 WHATSAPP
          </button>
        </div>
        <div className="rental-yield">
          <span className="star">★</span>
          <span>Calculate Rental Yield</span>
        </div>
      </div>

      {/* Agent Info */}
      <div className="agent-section">
        <div className="agent-info">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
            alt="Agent" 
            className="agent-photo"
          />
          <div className="agent-details">
            <div className="agent-name">Mohammad Sarfraz Haider</div>
            <div className="agent-title">Investment Advisor</div>
            <div className="agent-language">Language: Data Unavailable</div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-row">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-row">
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-row">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-row">
          <textarea
            name="message"
            placeholder={`Message about ${property?.name || 'this property'}`}
            value={formData.message}
            onChange={handleInputChange}
            className="form-textarea"
            rows="4"
          />
        </div>
        
        <button type="submit" className="submit-btn">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
