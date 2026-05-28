import { useState, useEffect } from 'react';
import './CookieConsent.css';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const accepted = localStorage.getItem('wc_cookies_accepted');
    if (!accepted) setTimeout(() => setVisible(true), 2000);
  }, []);
  const accept = () => { localStorage.setItem('wc_cookies_accepted', 'true'); setVisible(false); };
  if (!visible) return null;
  return (
    <div className="cookie-banner" id="cookie-consent">
      <p>We use cookies to enhance your browsing experience. By continuing to use this site, you agree to our use of cookies.</p>
      <div className="cookie-actions">
        <button className="btn-primary" onClick={accept}>Accept All</button>
        <button className="btn-secondary" onClick={accept}>Necessary Only</button>
      </div>
    </div>
  );
}
