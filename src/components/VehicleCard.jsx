import { Link } from 'react-router-dom';
import './VehicleCard.css';

export default function VehicleCard({ vehicle }) {
  const { id, make, model, price, year, mileage, fuelType, transmission, images, sold } = vehicle;
  return (
    <div className={`vehicle-card${sold ? ' sold' : ''}`} id={`vehicle-card-${id}`}>
      <div className="card-image">
        <img src={images[0]} alt={`${make} ${model}`} loading="lazy" />
        {sold && <div className="sold-badge">SOLD</div>}
        <div className="card-overlay">
          <Link to={`/vehicle/${id}`} className="btn-primary">View Details</Link>
        </div>
      </div>
      <div className="card-body">
        <div className="card-title-row">
          <h3>{make} {model}</h3>
          <span className="card-price">£{price.toLocaleString()}</span>
        </div>
        <div className="card-specs">
          <span>📅 {year}</span>
          <span>🛣️ {mileage.toLocaleString()} mi</span>
          <span>⛽ {fuelType}</span>
          <span>⚙️ {transmission}</span>
        </div>
      </div>
    </div>
  );
}
