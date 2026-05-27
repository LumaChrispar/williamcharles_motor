import './Contact.css';

export default function Contact() {
  const handleSubmit = (e) => { e.preventDefault(); alert('Thank you! We will be in touch shortly.'); };
  return (
    <main className="contact-page">
      <section className="contact-hero"><div className="container"><h1>Contact Us</h1><p>Get in touch — we'd love to hear from you</p></div></section>
      <section className="contact-content container">
        <div className="contact-info-grid">
          <div className="info-card">
            <span className="info-icon">📞</span>
            <h3>Call Us</h3>
            <p><a href="tel:+237683115837" style={{ color: 'var(--accent)' }}>+237 6 83 11 58 37</a></p>
            <p className="info-sub">Mon–Fri 9am–6pm</p>
          </div>
          <div className="info-card">
            <span className="info-icon">💬</span>
            <h3>WhatsApp Support</h3>
            <p><a href="https://wa.me/237683115837" target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', fontWeight: 600 }}>Chat with Admin</a></p>
            <p className="info-sub">Fast instant answers</p>
          </div>
          <div className="info-card">
            <span className="info-icon">✉️</span>
            <h3>Email Us</h3>
            <p><a href="mailto:williemcharles11@gmail.com" style={{ color: 'var(--text-primary)' }}>williemcharles11@gmail.com</a></p>
            <p className="info-sub">We reply within 24 hours</p>
          </div>
        </div>
        <div className="contact-form-section">
          <div className="contact-form-card">
            <h2>Send Us a Message</h2>
            <p>Fill out the form below and we'll get back to you as soon as possible.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><input type="text" placeholder="John Smith" required /></div>
                <div className="form-group"><label>Email</label><input type="email" placeholder="john@example.com" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Phone</label><input type="tel" placeholder="+237 6 83 11 58 37" /></div>
                <div className="form-group"><label>Subject</label>
                  <select><option>General Enquiry</option><option>Vehicle Enquiry</option><option>Arrange Viewing</option><option>Sell My Car</option></select>
                </div>
              </div>
              <div className="form-group"><label>Message</label><textarea rows={6} placeholder="Tell us how we can help..." required></textarea></div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
