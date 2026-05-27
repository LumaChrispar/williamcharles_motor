import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVehicleById, getRelatedVehicles } from '../data/vehicles';
import VehicleCard from '../components/VehicleCard';
import './VehicleDetail.css';

export default function VehicleDetail() {
  const { id } = useParams();
  const vehicle = getVehicleById(id);
  const related = getRelatedVehicles(id);
  const [activeImg, setActiveImg] = useState(0);
  const [showForm, setShowForm] = useState(null);

  if (!vehicle) return (
    <main className="detail-page"><div className="container" style={{ paddingTop: '160px', textAlign: 'center' }}>
      <h1>Vehicle Not Found</h1><p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>This vehicle may have been removed.</p>
      <Link to="/showroom" className="btn-primary" style={{ marginTop: 24 }}>Back to Showroom</Link>
    </div></main>
  );

  const specs = [
    { label: 'Year', value: vehicle.year },
    { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} miles` },
    { label: 'Fuel Type', value: vehicle.fuelType },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Drivetrain', value: vehicle.drivetrain },
    { label: 'Engine Size', value: vehicle.engineSize },
    { label: 'Engine Power', value: vehicle.enginePower },
    { label: '0-62 mph', value: vehicle.acceleration },
    { label: 'Top Speed', value: vehicle.topSpeed },
    { label: 'MPG', value: vehicle.mpg },
    { label: 'ULEZ', value: vehicle.ulezCompliant ? 'Compliant ✅' : 'Non-Compliant' },
    { label: 'Road Tax', value: vehicle.roadTax },
  ];

  return (
    <main className="detail-page">
      <div className="detail-breadcrumb container">
        <Link to="/showroom">← Back to Showroom</Link>
      </div>
      <div className="detail-content container">
        <div className="detail-gallery" id="gallery">
          <div className="gallery-main">
            <img src={vehicle.images[activeImg]} alt={`${vehicle.make} ${vehicle.model}`} />
          </div>
          {vehicle.images.length > 1 && (
            <div className="gallery-thumbs">
              {vehicle.images.map((img, i) => (
                <button key={i} className={`thumb${i === activeImg ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="detail-info">
          <div className="detail-title">
            <h1>{vehicle.make} {vehicle.model}</h1>
            <span className="detail-price">£{vehicle.price.toLocaleString()}</span>
          </div>
          <div className="detail-badges">
            <span>{vehicle.year}</span><span>{vehicle.color}</span>
            <span>{vehicle.bodyType}</span><span>{vehicle.doors} doors</span>
          </div>
          <div className="specs-grid">
            {specs.map(s => (
              <div className="spec-item" key={s.label}>
                <span className="spec-label">{s.label}</span>
                <span className="spec-value">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="detail-desc">
            <h3>Description</h3>
            <p>{vehicle.description}</p>
          </div>
          <div className="detail-actions">
            <button className="btn-primary" onClick={() => setShowForm('viewing')}>Arrange Viewing</button>
            <button className="btn-secondary" onClick={() => setShowForm('enquiry')}>Contact Us</button>
          </div>
          <div className="detail-share">
            <span>Share:</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener">Facebook</a>
            <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this ${vehicle.make} ${vehicle.model}`} target="_blank" rel="noopener">X</a>
            <a href={`https://wa.me/?text=Check out this ${vehicle.make} ${vehicle.model} ${window.location.href}`} target="_blank" rel="noopener">WhatsApp</a>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(null)}>✕</button>
            <h2>{showForm === 'viewing' ? 'Arrange a Viewing' : 'Contact Us'}</h2>
            <p className="modal-sub">Re: {vehicle.make} {vehicle.model}</p>
            <form onSubmit={e => { e.preventDefault(); alert('Thank you! We will be in touch shortly.'); setShowForm(null); }}>
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email Address" required />
              <input type="tel" placeholder="Phone Number" required />
              {showForm === 'viewing' && <input type="date" placeholder="Preferred Date" />}
              <textarea placeholder="Your message..." rows={4}></textarea>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {showForm === 'viewing' ? 'Request Viewing' : 'Send Enquiry'}
              </button>
            </form>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="related-section container">
          <div className="section-header">
            <h2>Similar Vehicles</h2>
            <div className="gold-line" />
          </div>
          <div className="vehicle-grid">{related.map(v => <VehicleCard key={v.id} vehicle={v} />)}</div>
        </section>
      )}
    </main>
  );
}
