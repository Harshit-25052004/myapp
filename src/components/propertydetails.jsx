import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar';
import Contact from './ContactForm';
import Footer from './footer';
import './propertydetails.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Navbar transparency on scroll
  useEffect(() => {
    const navbar = document.querySelector('.navbar');

    const handleScroll = () => {
      if (window.scrollY > 0) {
        navbar.classList.add('scrolled');
        navbar.classList.remove('transparent');
      } else {
        navbar.classList.remove('scrolled');
        navbar.classList.add('transparent'); // White before scroll
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // run on load

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/properties/${id}`)
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

  // Prepare images for the grid display
  const imageList = property.images && property.images.length > 0 ? property.images : [property.img];
  const mainImage = imageList[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
  const secondaryImage1 = imageList[1];
  const secondaryImage2 = imageList[2];

  return (
    <div className="property-detail-page">
      <Navbar />

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

      {/* Two-column layout */}
      <div className="property-detail-container">

        {/* Left side */}
        <div className="complete-box">
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

            {/* Property Images Grid */}
            <div className="property-images-grid">
              <div className="main-image-container">
                <img src={mainImage} alt={property.name} className="main-grid-image" />
              </div>
              <div className="secondary-images-container">
                {secondaryImage1 && (
                  <img src={secondaryImage1} alt={`${property.name} - view 2`} className="secondary-grid-image" />
                )}
                {secondaryImage2 && (
                  <img src={secondaryImage2} alt={`${property.name} - view 3`} className="secondary-grid-image" />
                )}
              </div>
            </div>


            <p><strong>Property RERA Number:</strong> {property.rera_number}</p>

            {/* Haveli Housing Statement */}
            <p>
              Haveli Housing is proud to present this premium residential project,
              offering spacious plots and modern living spaces in a well-planned gated community.
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
                and premium finishes throughout.
              </p>

              {/* Contact Info */}
              <div className="contact-info mt-4">
                <p><strong>For more information, please contact Haveli Housing</strong></p>
                <p>Email: info@havelihousing.com</p>
                <p>Website: havelihousing.com</p>
                <p>(Harshit, Shantanu)</p>
              </div>
            </div>
             {/* NEW: Property Details Section */}
            <div className="property-details-section">
              <h2 className="section-title">DETAILS</h2>
              <div className="details-grid">
                <div className="detail-item total-plots">
                  <div className="detail-icon"></div>
                  <div className="detail-label-value-container">
                    <span className="detail-label">Total Plots</span>
                    <span className="detail-value">{property.total_plots || 'N/A'}</span>
                  </div>
                </div>
                <div className="detail-item rera-number">
                  <div className="detail-icon"></div>
                  <div className="detail-label-value-container">
                    <span className="detail-label">RERA Number</span>
                    <span className="detail-value">{property.rera_number || 'N/A'}</span>
                  </div>
                </div>
                <div className="detail-item rate">
                  <div className="detail-icon"></div>
                  <div className="detail-label-value-container">
                    <span className="detail-label">Rate</span>
                    <span className="detail-value">{property.rate ? `₹${property.rate.toLocaleString()} / sq ft` : 'N/A'}</span>
                  </div>
                </div>
                <div className="detail-item specification">
                  <div className="detail-icon"></div>
                  <div className="detail-label-value-container">
                    <span className="detail-label">Specification</span>
                    <span className="detail-value">{property.specification || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* NEW: Location Section */}
            <div className="property-location-section">
                <h2 className="section-title">LOCATION</h2>
                <div className="map-wrapper">
                    <iframe
                        src={property.map_url}
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${property.name} Location Map`}
                    ></iframe>
                </div>
            </div>


          </div>
        </div>

        {/* Right side - Contact form */}
        <Contact property={property} />

      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetail;