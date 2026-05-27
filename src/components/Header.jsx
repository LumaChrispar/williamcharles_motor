import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
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

  return (
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
          <a href="tel:+447123456789" className="header-phone">📞 07123 456 789</a>
        </div>
        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" id="hamburger-btn">
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
