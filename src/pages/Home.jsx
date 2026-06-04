import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedVehicles, getAvailableVehicles } from '../data/vehicles';
import VehicleCard from '../components/VehicleCard';
import AnimatedSection from '../components/AnimatedSection';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getFeaturedVehicles(),
      getAvailableVehicles()
    ]).then(([featuredData, availableData]) => {
      setFeatured(featuredData);
      setTotalStock(availableData.length);
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
        <AnimatedSection className="hero-content container" animation="fade-up" delay={200}>
          <span className="hero-badge">Premium Pre-Owned Vehicles</span>
          <h1>Find Your <span className="hero-accent">Perfect Drive</span></h1>
          <p>Handpicked quality vehicles, fully inspected and prepared to the highest standard. Your journey starts here.</p>
          <div className="hero-cta">
            <Link to="/showroom" className="btn-primary">Browse Showroom →</Link>
            <Link to="/sell-your-car" className="btn-secondary">Sell Your Car</Link>
          </div>
        </AnimatedSection>
      </section>

      <section className="stats-section" id="stats">
        <AnimatedSection className="container stats-grid" animation="scale-up">
          {[
            { num: totalStock, label: 'Cars In Stock' },
            { num: '500+', label: 'Cars Sold' },
            { num: '98%', label: 'Happy Customers' },
            { num: '4.9★', label: 'Customer Rating' },
          ].map((s, i) => (
            <div className="stat-item" key={s.label} style={{ transitionDelay: `${i * 100}ms` }}>
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </AnimatedSection>
      </section>

      <section className="featured-section" id="featured">
        <AnimatedSection className="container" animation="fade-up">
          <div className="section-header">
            <h2>Featured Vehicles</h2>
            <p>Our handpicked selection of premium vehicles currently available</p>
            <div className="gold-line" />
          </div>
          {loading ? (
            <div className="loading-spinner" style={{ textAlign: 'center', padding: '40px' }}>Loading premium vehicles...</div>
          ) : (
            <div className="vehicle-grid">
              {featured.map((v, i) => (
                <div key={v.id} style={{ animationDelay: `${i * 150}ms` }} className="animate-section fade-up is-visible">
                  <VehicleCard vehicle={v} />
                </div>
              ))}
            </div>
          )}
          <div className="section-cta">
            <Link to="/showroom" className="btn-secondary">View All Vehicles →</Link>
          </div>
        </AnimatedSection>
      </section>

      <section className="why-section" id="why-us">
        <AnimatedSection className="container" animation="fade-up">
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
            ].map((item, i) => (
              <div className="why-card animate-section fade-up is-visible" key={item.title} style={{ animationDelay: `${i * 100}ms` }}>
                <span className="why-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section className="testimonials-section" id="testimonials">
        <AnimatedSection className="container" animation="fade-up">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Don't just take our word for it — read about real experiences from our valued clients.</p>
            <div className="gold-line" />
          </div>
          <div className="testimonials-grid">
            {[
              { text: "The team here made buying my dream car effortless. The car was in immaculate condition, and the service was 5-star from start to finish.", author: "James T.", role: "Bought a Porsche 911" },
              { text: "Unbelievable transparency. They walked me through the entire history of the vehicle and gave me a fantastic part-exchange price.", author: "Sarah M.", role: "Bought an Audi Q7" },
              { text: "I was nervous about buying a premium car online, but their nationwide delivery was flawless. The car arrived exactly as described.", author: "David W.", role: "Bought a BMW M4" }
            ].map((t, i) => (
              <div className="testimonial-card animate-section fade-up is-visible" key={i} style={{ animationDelay: `${i * 150}ms` }}>
                <div className="stars">★★★★★</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <h4>{t.author}</h4>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section className="cta-banner" id="cta-banner">
        <AnimatedSection className="container" animation="scale-up">
          <h2>Ready to Find Your Next Car?</h2>
          <p>Browse our showroom or get in touch — we're here to help.</p>
          <div className="hero-cta">
            <Link to="/showroom" className="btn-primary">View Showroom</Link>
            <Link to="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </AnimatedSection>
      </section>
    </main>
  );
}
