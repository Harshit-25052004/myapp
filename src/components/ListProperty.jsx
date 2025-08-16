import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link
import './ListProperty.css';

export default function ListProperty() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/properties') // Flask endpoint
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch properties");
        return res.json();
      })
      .then((data) => setProperties(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="list-property-page">
      <div className="container mx-auto px-4 py-8">
        <h1 className="page-title">LIST OF PROPERTY</h1>
        <p className="page-subtitle">Available Properties in Our Database</p>
        
        <div className="properties-list">
          <h2 className="section-title">All Properties</h2>
          <div className="property-names-grid">
            {properties.map((property) => (
              <Link 
                key={property._id} 
                to={`/property/${property._id}`} 
                 style={{ textDecoration: 'none', color: 'inherit' }}// ✅ Navigate to detail page
                className="property-link"
              >
                <div className="property-name-card">
                  <h3 className="property-name">{property.name}</h3>
                  <p className="property-rera">RERA: {property.rera_number}</p>
                  <p className="property-location">
                    {property.address?.area}, {property.address?.city}
                  </p>
                  <p className="property-spec">{property.specification}</p>
                  <div className="property-details">
                    <span className="property-rate">₹{property.rate}/sq.ft</span>
                    <span className="property-plots">{property.total_plots} plots</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="contact-section">
          <h2 className="section-title">Want to List Your Property?</h2>
          <p className="contact-text">Contact us to add your property to our premium listing</p>
          <button className="contact-btn">Contact Now</button>
        </div>
      </div>
    </div>
  );
}
