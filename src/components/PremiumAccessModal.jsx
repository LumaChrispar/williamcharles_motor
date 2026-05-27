import { useState } from 'react';
import { addVipLead } from '../data/leads';
import './PremiumAccessModal.css';

export default function PremiumAccessModal({ isOpen, onClose, onUnlock, carTitle }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add lead to LocalStorage database for admin panel
    addVipLead({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      carInterest: carTitle || 'General Showroom'
    });
    
    // Grant access locally
    localStorage.setItem('wc_premium_unlocked', 'true');
    onUnlock();
    onClose();
  };

  return (
    <div className="premium-modal-overlay" onClick={onClose} id="premium-vip-lock">
      <div className="premium-modal" onClick={e => e.stopPropagation()}>
        <button className="premium-modal-close" onClick={onClose}>✕</button>
        <div className="premium-modal-header">
          <span className="premium-gold-badge">👑 VIP PREMIUM ACCESS</span>
          <h2>Unlock Fast Response</h2>
          <p>Instant direct communication with the admin. Hidden from bots, secured for verified buyers.</p>
        </div>
        <form onSubmit={handleSubmit} className="premium-modal-form">
          <div className="premium-form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Lewis Hamilton" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>
          <div className="premium-form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. lewis@example.com" 
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              required 
            />
          </div>
          <div className="premium-form-group">
            <label>WhatsApp / Mobile Number</label>
            <input 
              type="tel" 
              placeholder="e.g. +44 7911 123456" 
              value={formData.phone} 
              onChange={e => setFormData({ ...formData, phone: e.target.value })} 
              required 
            />
          </div>
          <button type="submit" className="btn-premium-unlock">
            ⚡ Unlock Instant WhatsApp Chat
          </button>
        </form>
        <p className="premium-modal-footer">Your information is secure and only used for direct used car sales enquiry.</p>
      </div>
    </div>
  );
}
