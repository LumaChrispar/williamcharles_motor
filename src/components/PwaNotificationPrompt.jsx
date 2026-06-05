import { useState, useEffect } from 'react';
import './PwaNotificationPrompt.css';

export default function PwaNotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) return;

    // Check if user already made a choice or we dismissed it recently
    if (Notification.permission === 'granted' || Notification.permission === 'denied') return;
    
    const dismissed = localStorage.getItem('pwa_notification_dismissed');
    if (dismissed) return;

    // Show prompt after a short delay
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleAllow = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // We could subscribe to push notifications here if we had a push service
        new Notification('Notifications Enabled!', {
          body: 'You will now receive updates on our premium cars.',
          icon: '/logo.png',
        });
      }
    } catch (err) {
      console.error('Failed to request notification permission:', err);
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_notification_dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-notification-prompt">
      <div className="pwa-notification-content">
        <h4>Stay Updated</h4>
        <p>Get instant alerts when new premium vehicles arrive in our showroom.</p>
      </div>
      <div className="pwa-notification-actions">
        <button className="pwa-notification-btn dismiss" onClick={handleDismiss}>Not Now</button>
        <button className="pwa-notification-btn allow" onClick={handleAllow}>Enable</button>
      </div>
    </div>
  );
}
