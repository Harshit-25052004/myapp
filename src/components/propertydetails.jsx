import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar';
import Contact from './ContactForm';
import Footer from './footer'
import './propertydetails.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Force navbar to be non-transparent on this page
  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.remove('transparent');
      navbar.classList.add('scrolled');
    }
    return () => {
      if (navbar) {
        navbar.classList.remove('scrolled');
        navbar.classList.add('transparent');
      }
    };
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/properties/${id}`)
      .then((res) => {
        setProperty(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching property details:', err);
        setError('Failed to fetch property details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="property-detail-page">
        <Navbar />
        <div className="container">Loading property details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-detail-page">
        <Navbar />
        <div className="container text-red-500">{error}</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-not-found">
        <Navbar />
        <div className="container">
          <h1>Property not found</h1>
          <Link to="/" className="back-link">Back to Home</Link>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in the property: ${property.name} (Ref: ${property.reference}) priced at ${property.price}`;
    const whatsappUrl = `https://wa.me/971501234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="property-detail-page">
      <Navbar />
      <Contact property={property} />

      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">HOME</Link>
          <span className="breadcrumb-separator">•</span>
          <Link to="/properties" className="breadcrumb-link">PROPERTY</Link>
          <span className="breadcrumb-separator">•</span>
          <span className="breadcrumb-current">
            {property.location?.community?.toUpperCase() || 'PROPERTY DETAILS'}
          </span>
        </div>
      </div>

      <div className="complete-box">
        <div className="property-detail-container">
          <div className="property-content">

            {/* Property Header */}
            <div className="property-header">
              <div className="property-title-section">
                <h1 className="property-title">{property.name}</h1>
                <h3 className="mt-2 font-semibold">{property.specification}</h3>
                <p className="mt-1">
                  {property.address && `${property.address.area}, ${property.address.city}`}
                </p>
                <div className="property-meta-line">
                  <p><strong>Total Plots:</strong> {property.totalPlots || 'N/A'}</p>
                  <p><strong>Rate:</strong> {property.rate ? `${property.rate} per sq ft` : 'N/A'}</p>
                  <p><strong>Total Size:</strong> 10 acres</p>
                </div>
              </div>
            </div>

            {/* Property Images */}
            <div className="property-images">
              <div className="main-image">
                <img
                  src={
                    (property.images && property.images[selectedImageIndex]) ||
                    property.img ||
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={property.name}
                  className="featured-image"
                />
              </div>
              <div className="image-thumbnails">
                {(property.images || [property.img]).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Property view ${index + 1}`}
                    className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            <p><strong>Property RERA Number:</strong> {property.rera_number}</p>

            {/* Haveli Housing Statement */}
            <p>
              Haveli Housing is proud to present this premium residential project,
              offering spacious plots and modern living spaces in a well-planned gated community.
              Designed to combine comfort, elegance, and convenience, this development provides
              an ideal setting for families and investors seeking quality living in a prime location.
            </p>

            {/* Property Description */}
            <div className="property-description">

              <h3>Property Details:</h3>
              <ul>
                <li>Spacious living and dining areas with abundant natural light</li>
                <li>Modern open-plan kitchen with premium finishes</li>
                <li>Large master suite with private balcony</li>
                <li>Multiple guest rooms with attached bathrooms</li>
                <li>Energy-efficient lighting and climate control</li>
                <li>High ceilings and large windows for ventilation</li>
                <li>Landscaped garden and outdoor seating area</li>
              </ul>

              <h3>Amenities:</h3>
              <ul>
                <li>Private parking for multiple vehicles</li>
                <li>24/7 security and gated access</li>
                <li>Swimming pool and fitness center</li>
                <li>Children’s play area and community park</li>
                <li>Backup power supply and water storage</li>
                <li>Clubhouse with indoor activities</li>
                <li>High-speed internet connectivity</li>
              </ul>

              <p>
                This premium property offers a perfect blend of comfort and style,
                featuring spacious interiors, modern design, and eco-friendly features.
                Residents can enjoy landscaped outdoor spaces, ample natural light,
                and premium finishes throughout. The community provides top-notch
                amenities including a swimming pool, gym, and security services,
                making it an ideal choice for families and professionals.
                Perfectly located, it ensures convenience without compromising on luxury.
              </p>

              {/* Contact Info */}
              <div className="contact-info mt-4">
                <p><strong>For more information, please contact Haveli Housing</strong></p>
                <p>Email: info@havelihousing.com</p>
                <p>Website: havelihousing.com</p>
                <p>(Harshit, Shantanu)</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default PropertyDetail;
