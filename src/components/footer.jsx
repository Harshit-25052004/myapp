import { useEffect, useState } from 'react';
import './footer.css';

export default function HomePage() {
  const keyFeatures = [
    { 
      title: "Heritage Architecture", 
      desc: "Authentic Rajasthani design with intricate carvings and traditional craftsmanship", 
      icon: "🏛️" 
    },
    { 
      title: "Prime Locations", 
      desc: "Strategic heritage cities including Jaipur, Udaipur, and Jodhpur", 
      icon: "📍" 
    },
    { 
      title: "Royal Living", 
      desc: "Experience grandeur lifestyle with modern amenities in historic settings", 
      icon: "👑" 
    }
  ];

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/properties")
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="homepage">
      {/* Main About Section */}
      <section className="main-section">
        <div className="container">
          <div className="main-content">
            {/* Left Content */}
            <div className="content-left">
              <div className="intro-text">
                <h2>Your Royal Dream</h2>
                <h3>Heritage Awaits</h3>
                <p>
                  Discover magnificent havelis and heritage properties that blend traditional 
                  Rajasthani architecture with modern luxury. Each property tells a story of 
                  royal grandeur, featuring hand-carved pillars, intricate frescoes, and 
                  majestic courtyards that have witnessed centuries of history.
                </p>
              </div>

              <div className="stats-row">
                <div className="stat">
                  <span className="stat-number">150+</span>
                  <span className="stat-label">Heritage Properties</span>
                </div>
                <div className="stat">
                  <span className="stat-number">25+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5000+</span>
                  <span className="stat-label">Happy Families</span>
                </div>
              </div>

              <div className="features-compact">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-icon">{feature.icon}</span>
                    <div className="feature-text">
                      <h4>{feature.title}</h4>
                      <p>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="action-buttons">
                <button className="btn-primary">Explore Heritage</button>
                <button className="btn-secondary">Contact Us</button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="content-right">
              <div className="image-showcase">
                <div className="main-visual">
                  <img 
                    src="https://cdn.builder.io/api/v1/image/assets%2F1d6ab121b1c0492d95af0d621fbbafbc%2F90f0d4cb10d3461280d5d90341813992?format=webp&width=800" 
                    alt="Heritage Architecture - Magnificent Haveli with traditional Rajasthani dome and intricate stonework" 
                  />
                </div>
                <div className="small-visuals">
                  <div className="small-image">
                    <img 
                      src="https://cdn.builder.io/api/v1/image/assets%2F1d6ab121b1c0492d95af0d621fbbafbc%2F4746f427f244415fb6377f7228914aea?format=webp&width=300" 
                      alt="Traditional Royal Door - Ornate entrance with emerald green arches and golden details" 
                    />
                  </div>
                  <div className="small-image">
                    <img 
                      src="https://cdn.builder.io/api/v1/image/assets%2F1d6ab121b1c0492d95af0d621fbbafbc%2F44b84ba7b6dd4bf9a32f0338d2679d3f?format=webp&width=300" 
                      alt="Traditional Art - Hand-painted ceramic plate with royal fish motifs" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Types - Dynamic */}
          <div className="property-types">
            <h3>Our Heritage Collections</h3>
            <p className="collection-subtitle">
              Curated selection of royal properties across Rajasthan's heritage cities
            </p>
            {loading ? (
              <p>Loading collections...</p>
            ) : (
              <div className="types-grid">
                {collections.length > 0 ? (
                  collections.map((item, index) => (
                    <div className="type-item" key={index}>
                      <h5>{item.name || "Unnamed Property"}</h5>
                      <span>{item.description || "No description available"}</span>
                    </div>
                  ))
                ) : (
                  <p>No collections available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-minimal">
        <div className="container">
          <div className="footer-content">
            <div className="footer-info">
              <h4>HAVELI HOUSING</h4>
              <p>📍 Heritage Square, Pink City, Jaipur, Rajasthan 302001</p>
              <p>📞 +91-141-HAVELI (428354) | ✉️ royal@havelihousing.com</p>
              <p>🕒 Mon-Sat: 9:00 AM - 7:00 PM | Sun: 10:00 AM - 5:00 PM</p>
            </div>
            <div className="footer-tagline">
              <p>"Preserving Heritage, Creating Futures"</p>
              <p className="tagline-sub">Where Royal Dreams Come True</p>
              <div className="social-icons">
                <span title="Facebook">📘</span>
                <span title="Instagram">📷</span>
                <span title="LinkedIn">🔗</span>
                <span title="YouTube">▶️</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <div className="chat-widget">
        <div className="chat-button">
          <span>💬</span>
          <span className="chat-text">Royal Help</span>
        </div>
      </div>
    </div>
  );
}
