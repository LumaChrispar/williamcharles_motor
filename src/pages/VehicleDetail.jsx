import { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { getVehicleById, getRelatedVehicles } from '../data/vehicles';
import { getVehicleImages } from '../data/imageService';
import VehicleCard from '../components/VehicleCard';
import './VehicleDetail.css';

export default function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wikiImages, setWikiImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  
  const [activeImg, setActiveImg] = useState(0);
  const [showForm, setShowForm] = useState(null);

  useEffect(() => {
    setLoading(true);
    setWikiImages([]);
    Promise.all([
      getVehicleById(id),
      getRelatedVehicles(id)
    ]).then(([v, r]) => {
      setVehicle(v);
      setRelated(r);
      setLoading(false);
      setActiveImg(0);
    });
  }, [id]);

  // Fetch all Wikipedia images for carousel once vehicle is loaded
  useEffect(() => {
    if (!vehicle) return;
    setImagesLoading(true);
    setWikiImages([]);
    setActiveImg(0);
    getVehicleImages(vehicle.make, vehicle.model).then(urls => {
      setWikiImages(urls.length > 0 ? urls : []);
      setImagesLoading(false);
    }).catch(() => {
      setImagesLoading(false);
    });
  }, [vehicle]);

  // Get the chat trigger from App context
  let triggerChat = null;
  try {
    const ctx = useOutletContext();
    if (ctx) triggerChat = ctx.triggerChat;
  } catch {
    // Not inside an Outlet, that's fine
  }

  if (loading) return (
    <main className="detail-page"><div className="container" style={{ paddingTop: '160px', textAlign: 'center' }}>
      <div className="loading-spinner">Loading vehicle details...</div>
    </div></main>
  );

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

  const handleChatAboutCar = () => {
    if (triggerChat) {
      triggerChat(vehicle);
    } else {
      // Fallback: dispatch a custom event for the ChatWidget
      window.dispatchEvent(new CustomEvent('openChatWithVehicle', { detail: vehicle }));
    }
  };

  return (
    <main className="detail-page">
      <div className="detail-breadcrumb container">
        <Link to="/showroom">← Back to Showroom</Link>
      </div>
      <div className="detail-content container">
        <div className="detail-gallery" id="gallery">
          <div className="gallery-main">
            {imagesLoading ? (
              <div className="vehicle-img-skeleton" style={{ width: '100%', height: '100%' }} />
            ) : wikiImages.length > 0 ? (
              <img src={wikiImages[activeImg] || wikiImages[0]} alt={`${vehicle.make} ${vehicle.model}`} />
            ) : (
              <div className="vehicle-img-placeholder" style={{ height: '100%' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/>
                  <rect x="9" y="11" width="14" height="10" rx="2"/>
                  <circle cx="12" cy="17" r="1"/>
                  <circle cx="20" cy="17" r="1"/>
                </svg>
                <span style={{ fontSize: '1rem', marginTop: '10px' }}>No photos available</span>
              </div>
            )}
          </div>
          {!imagesLoading && wikiImages.length > 1 && (
            <div className="gallery-thumbs">
              {wikiImages.map((img, i) => (
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
          
          {/* Chat About This Car Button */}
          <div className="premium-quick-reach">
            <button onClick={handleChatAboutCar} className="btn-chat-car">
              <span className="icon">💬</span> Chat About This Car
            </button>
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
