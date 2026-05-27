import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
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
            <h4>Contact</h4>
            <ul>
              <li>📞 07123 456 789</li>
              <li>✉️ info@williamcharlesmotor.co.uk</li>
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
          <p>&copy; {new Date().getFullYear()} williamcharles_motor. All rights reserved.</p>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
