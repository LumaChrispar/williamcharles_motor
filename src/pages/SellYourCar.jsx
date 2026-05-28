import './SellYourCar.css';

export default function SellYourCar() {
  const handleSubmit = (e) => { e.preventDefault(); alert('Thank you! We will review your vehicle details and get back to you within 24 hours.'); };
  return (
    <main className="sell-page">
      <section className="sell-hero"><div className="container"><h1>Sell Your Car</h1><p>Get a fair, no-obligation valuation on your vehicle</p></div></section>
      <section className="sell-content container">
        <div className="how-it-works">
          <div className="section-header"><h2>How It Works</h2><div className="gold-line" /></div>
          <div className="steps-grid">
            {[
              { num: '01', title: 'Submit Details', desc: 'Fill in the form below with your vehicle information and photos.' },
              { num: '02', title: 'Get a Valuation', desc: 'Our team will review your vehicle and provide a fair market valuation.' },
              { num: '03', title: 'Complete the Sale', desc: 'Accept the offer, we handle the paperwork. Payment within 24 hours.' },
            ].map(s => (
              <div className="step-card" key={s.num}>
                <span className="step-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="sell-form-card">
          <h2>Vehicle Details</h2>
          <p>Provide as much detail as possible for an accurate valuation.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-row"><div className="form-group"><label>Make</label><input type="text" placeholder="e.g. BMW" required /></div>
              <div className="form-group"><label>Model</label><input type="text" placeholder="e.g. 3 Series" required /></div></div>
            <div className="form-row"><div className="form-group"><label>Year</label><input type="number" placeholder="e.g. 2022" required /></div>
              <div className="form-group"><label>Mileage</label><input type="number" placeholder="e.g. 25000" required /></div></div>
            <div className="form-row"><div className="form-group"><label>Fuel Type</label>
              <select><option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option></select></div>
              <div className="form-group"><label>Transmission</label>
              <select><option>Automatic</option><option>Manual</option></select></div></div>
            <div className="form-row"><div className="form-group"><label>Registration</label><input type="text" placeholder="e.g. AB12 CDE" /></div>
              <div className="form-group"><label>Colour</label><input type="text" placeholder="e.g. Black" /></div></div>
            <div className="form-group"><label>Additional Info</label><textarea rows={4} placeholder="Service history, condition, modifications, etc."></textarea></div>
            <h3 className="form-divider">Your Contact Details</h3>
            <div className="form-row"><div className="form-group"><label>Full Name</label><input type="text" required /></div>
              <div className="form-group"><label>Email</label><input type="email" required /></div></div>
            <div className="form-group"><label>Phone Number</label><input type="tel" required /></div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Request Valuation</button>
          </form>
        </div>
      </section>
    </main>
  );
}
