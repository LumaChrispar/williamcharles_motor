import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef(null);

  const handleCopyrightClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        navigate('/admin');
        return 0;
      }
      return newCount;
    });

    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setClickCount(0), 1500);
  };

  return (
    <footer className="site-footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-brand">williamcharles<span>_motor</span></h3>
            <p className="footer-about">Your trusted destination for premium pre-owned vehicles. Every car in our collection is handpicked, inspected, and prepared to the highest standard.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/showroom">Showroom</Link></li>
              <li><Link to="/previously-sold">Previously Sold</Link></li>
              <li><Link to="/sell-your-car">Sell Your Car</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Get In Touch</h4>
            <ul>
              <li>💬 Use our Live Chat widget</li>
              <li><Link to="/contact" className="footer-contact-link">📋 Contact Form</Link></li>
              <li>📍 123 Motor Lane, London, UK</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Opening Hours</h4>
            <ul>
              <li>Mon – Fri: 9:00 – 18:00</li>
              <li>Saturday: 10:00 – 17:00</li>
              <li>Sunday: By Appointment</li>
            </ul>
            <div className="social-links">
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="Twitter">X</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p onClick={handleCopyrightClick} style={{ cursor: 'text', userSelect: 'none' }}>
            &copy; {new Date().getFullYear()} williamcharles_motor. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/admin" className="secret-admin-link" aria-label="Staff Login" title="Staff Login">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </Link>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
