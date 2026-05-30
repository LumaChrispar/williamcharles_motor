import { useState, useEffect } from 'react';
import { getSoldVehicles } from '../data/vehicles';
import VehicleCard from '../components/VehicleCard';
import './PreviouslySold.css';

export default function PreviouslySold() {
  const [sold, setSold] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSoldVehicles().then(data => {
      setSold(data);
      setLoading(false);
    });
  }, []);

  return (
    <main className="sold-page">
      <section className="sold-hero"><div className="container"><h1>Previously Sold</h1><p>A selection of vehicles we've recently sold — quality speaks for itself</p></div></section>
      <section className="sold-content container">
        {loading ? (
          <div className="loading-spinner" style={{ textAlign: 'center', padding: '60px' }}>Loading previously sold vehicles...</div>
        ) : (
          <>
            <div className="vehicle-grid">
              {sold.map(v => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
            {sold.length === 0 && <p className="no-results" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '80px 0' }}>No previously sold vehicles to display.</p>}
          </>
        )}
      </section>
    </main>
  );
}
