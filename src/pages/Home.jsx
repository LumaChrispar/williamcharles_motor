import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedVehicles } from '../data/vehicles';
import VehicleCard from '../components/VehicleCard';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedVehicles().then(data => {
      setFeatured(data);
      setLoading(false);
    });
  }, []);
  return (
    <main className="home-page">
      <section className="hero" id="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80" alt="" />
          <div className="hero-gradient" />
        </div>
        <div className="hero-content container">
          <span className="hero-badge">Premium Pre-Owned Vehicles</span>
          <h1>Find Your <span className="hero-accent">Perfect Drive</span></h1>
          <p>Handpicked quality vehicles, fully inspected and prepared to the highest standard. Your journey starts here.</p>
          <div className="hero-cta">
            <Link to="/showroom" className="btn-primary">Browse Showroom →</Link>
            <Link to="/sell-your-car" className="btn-secondary">Sell Your Car</Link>
          </div>
        </div>
      </section>

      <section className="stats-section" id="stats">
        <div className="container stats-grid">
          {[
            { num: '500+', label: 'Cars Sold' },
            { num: '98%', label: 'Happy Customers' },
            { num: '15+', label: 'Years Experience' },
            { num: '4.9★', label: 'Customer Rating' },
          ].map(s => (
            <div className="stat-item" key={s.label}>
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-section" id="featured">
        <div className="container">
          <div className="section-header">
            <h2>Featured Vehicles</h2>
            <p>Our handpicked selection of premium vehicles currently available</p>
            <div className="gold-line" />
          </div>
          {loading ? (
            <div className="loading-spinner" style={{ textAlign: 'center', padding: '40px' }}>Loading premium vehicles...</div>
          ) : (
            <div className="vehicle-grid">
              {featured.map(v => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          )}
          <div className="section-cta">
            <Link to="/showroom" className="btn-secondary">View All Vehicles →</Link>
          </div>
        </div>
      </section>

      <section className="why-section" id="why-us">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Us</h2>
            <p>We go above and beyond to ensure your complete satisfaction</p>
            <div className="gold-line" />
          </div>
          <div className="why-grid">
            {[
              { icon: '🔍', title: 'Fully Inspected', desc: 'Every vehicle undergoes a comprehensive multi-point inspection before sale.' },
              { icon: '📋', title: 'Full History Check', desc: 'Complete HPI check and verified service history on all our vehicles.' },
              { icon: '🛡️', title: 'Warranty Included', desc: 'Drive with confidence with our included warranty on every purchase.' },
              { icon: '💰', title: 'Best Value', desc: 'Competitive pricing with flexible payment options to suit your budget.' },
              { icon: '🔄', title: 'Part Exchange', desc: 'We accept part exchanges — get a fair price for your current vehicle.' },
              { icon: '🚗', title: 'Nationwide Delivery', desc: 'We can deliver your new car directly to your door, anywhere in the UK.' },
            ].map(item => (
              <div className="why-card" key={item.title}>
                <span className="why-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner" id="cta-banner">
        <div className="container">
          <h2>Ready to Find Your Next Car?</h2>
          <p>Browse our showroom or get in touch — we're here to help.</p>
          <div className="hero-cta">
            <Link to="/showroom" className="btn-primary">View Showroom</Link>
            <Link to="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
