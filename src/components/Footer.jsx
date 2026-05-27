import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PremiumAccessModal from './PremiumAccessModal';
import './Footer.css';

export default function Footer() {
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('wc_premium_unlocked') === 'true') {
      setPremiumUnlocked(true);
    }
  }, []);

  const handleSupportClick = (e) => {
    if (!premiumUnlocked) {
      e.preventDefault();
      setModalOpen(true);
    }
  };

  return (
    <>
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
                {premiumUnlocked ? (
                  <>
                    <li><a href="tel:+237683115837" className="footer-contact-link">📞 Direct Support Call</a></li>
                    <li><a href="https://wa.me/237683115837" target="_blank" rel="noopener noreferrer" className="footer-contact-link" style={{ color: '#25d366' }}>💬 Live WhatsApp Chat</a></li>
                  </>
                ) : (
                  <>
                    <li>
                      <button onClick={() => setModalOpen(true)} className="footer-vip-unlock-btn">
                        👑 Unlock VIP Support Phone
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setModalOpen(true)} className="footer-vip-unlock-btn" style={{ color: '#25d366' }}>
                        💬 Unlock WhatsApp Live Chat
                      </button>
                    </li>
                  </>
                )}
                <li><a href="mailto:williemcharles11@gmail.com" className="footer-contact-link">✉️ williemcharles11@gmail.com</a></li>
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

      <PremiumAccessModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onUnlock={() => {
          setPremiumUnlocked(true);
          window.open("https://wa.me/237683115837", "_blank");
        }} 
        carTitle="Footer Nav Quick Access"
      />
    </>
  );
}
