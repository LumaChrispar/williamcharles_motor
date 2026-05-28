import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PremiumAccessModal from './PremiumAccessModal';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    
    // Check if user has already unlocked VIP premium access
    if (localStorage.getItem('wc_premium_unlocked') === 'true') {
      setPremiumUnlocked(true);
    }
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/showroom', label: 'Showroom' },
    { path: '/previously-sold', label: 'Previously Sold' },
    { path: '/sell-your-car', label: 'Sell Your Car' },
    { path: '/contact', label: 'Contact Us' },
  ];

  const handleSupportClick = (e) => {
    if (!premiumUnlocked) {
      e.preventDefault();
      setModalOpen(true);
    }
  };

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="site-header">
        <div className="header-inner container">
          <Link to="/" className="logo" id="logo-link">
            <img src="/logo.png" alt="williamcharles_motor logo" className="logo-img" />
            <span className="logo-text">williamcharles<span className="logo-accent">_motor</span></span>
          </Link>
          <nav className={`nav${menuOpen ? ' open' : ''}`} id="main-nav">
            {navLinks.map(l => (
              <Link key={l.path} to={l.path} className={`nav-link${location.pathname === l.path ? ' active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="header-contact">
            {premiumUnlocked ? (
              <>
                <a href="https://wa.me/237683115837" target="_blank" rel="noopener noreferrer" className="header-whatsapp" title="Chat on WhatsApp">
                  💬 Chat Live
                </a>
                <a href="tel:+237683115837" className="header-phone" title="Call Admin">📞 Call Support</a>
              </>
            ) : (
              <button className="btn-unlock-vip-header" onClick={() => setModalOpen(true)}>
                👑 Unlock Premium Support
              </button>
            )}
          </div>
          <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" id="hamburger-btn">
            <span /><span /><span />
          </button>
        </div>
      </header>

      <PremiumAccessModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onUnlock={() => {
          setPremiumUnlocked(true);
          window.open("https://wa.me/237683115837", "_blank");
        }} 
        carTitle="Header Nav Quick Access"
      />
    </>
  );
}
