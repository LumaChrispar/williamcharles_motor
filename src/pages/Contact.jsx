import './Contact.css';
import { addInquiry } from '../data/leads';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    addInquiry({
      name: form.elements['contact-name'].value,
      email: form.elements['contact-email'].value,
      phone: form.elements['contact-phone'].value || '',
      subject: form.elements['contact-subject'].value,
      message: form.elements['contact-message'].value,
      car: ''
    });
    alert('Thank you! We will be in touch shortly.');
    form.reset();
  };

  return (
    <main className="contact-page">
      <section className="contact-hero"><div className="container"><h1>Contact Us</h1><p>Get in touch — we'd love to hear from you</p></div></section>
      <section className="contact-content container">
        <div className="contact-info-grid">
          <div className="info-card">
            <span className="info-icon">💬</span>
            <h3>Live Chat</h3>
            <p style={{ color: 'var(--accent)' }}>Use our chat widget</p>
            <p className="info-sub">Click the chat bubble in the bottom right for instant help</p>
          </div>
          <div className="info-card">
            <span className="info-icon">⚡</span>
            <h3>Quick Response</h3>
            <p style={{ color: 'var(--text-primary)' }}>We reply fast</p>
            <p className="info-sub">Typical response time under 30 minutes</p>
          </div>
          <div className="info-card">
            <span className="info-icon">📍</span>
            <h3>Visit Us</h3>
            <p style={{ color: 'var(--text-primary)' }}>123 Motor Lane, London, UK</p>
            <p className="info-sub">Mon–Fri 9am–6pm • Sat 10am–5pm</p>
          </div>
        </div>
        <div className="contact-form-section">
          <div className="contact-form-card">
            <h2>Send Us a Message</h2>
            <p>Fill out the form below and we'll get back to you as soon as possible.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><input name="contact-name" type="text" placeholder="John Smith" required /></div>
                <div className="form-group"><label>Email</label><input name="contact-email" type="email" placeholder="john@example.com" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Phone (optional)</label><input name="contact-phone" type="tel" placeholder="+44 7911 123456" /></div>
                <div className="form-group"><label>Subject</label>
                  <select name="contact-subject"><option>General Enquiry</option><option>Vehicle Enquiry</option><option>Arrange Viewing</option><option>Sell My Car</option></select>
                </div>
              </div>
              <div className="form-group"><label>Message</label><textarea name="contact-message" rows={6} placeholder="Tell us how we can help..." required></textarea></div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
