import { useState, useEffect } from 'react';
import './WelcomeOnboarding.css';

export default function WelcomeOnboarding() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedCarsApp');
    if (!hasVisited) {
      // Small delay to let the page load first
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    localStorage.setItem('hasVisitedCarsApp', 'true');
    setTimeout(() => setIsVisible(false), 500); // Wait for fade out animation
  };

  if (!isVisible) return null;

  return (
    <div className="onboarding-overlay" style={{ opacity: isClosing ? 0 : 1, transition: 'opacity 0.5s ease' }}>
      <div className="onboarding-modal" style={{ transform: isClosing ? 'translateY(20px) scale(0.95)' : undefined, transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
        <div className="onboarding-logo">
          WilliamCharles<span>Motor</span>
        </div>
        <h2 className="onboarding-title">Welcome to Premium Motoring</h2>
        <p className="onboarding-desc">
          Discover a handpicked selection of exceptional vehicles, rigorously inspected and beautifully presented for your journey ahead.
        </p>

        <div className="onboarding-features">
          <div className="onboarding-feature">
            <span>✨</span>
            <p>Curated Selection</p>
          </div>
          <div className="onboarding-feature">
            <span>🔍</span>
            <p>Full History Checks</p>
          </div>
          <div className="onboarding-feature">
            <span>🛡️</span>
            <p>Comprehensive Warranty</p>
          </div>
          <div className="onboarding-feature">
            <span>⭐</span>
            <p>5-Star Service</p>
          </div>
        </div>

        <button className="btn-primary btn-start" onClick={handleClose}>
          Enter Showroom
        </button>
      </div>
    </div>
  );
}
