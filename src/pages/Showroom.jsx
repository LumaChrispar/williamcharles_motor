import { useState, useMemo, useEffect } from 'react';
import { getAvailableVehicles, getAllMakes, getAllBodyTypes } from '../data/vehicles';
import VehicleCard from '../components/VehicleCard';
import AnimatedSection from '../components/AnimatedSection';
import './Showroom.css';

export default function Showroom() {
  const [allVehicles, setAllVehicles] = useState([]);
  const [makes, setMakes] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ make: '', bodyType: '', fuelType: '', transmission: '', minPrice: '', maxPrice: '', sort: '' });
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    Promise.all([
      getAvailableVehicles(),
      getAllMakes(),
      getAllBodyTypes()
    ]).then(([vehiclesData, makesData, bodyTypesData]) => {
      setAllVehicles(vehiclesData);
      setMakes(makesData);
      setBodyTypes(bodyTypesData);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = allVehicles.filter(v => {
      const q = search.toLowerCase();
      const matchesSearch = !q || `${v.make} ${v.model}`.toLowerCase().includes(q);
      const matchesMake = !filters.make || v.make === filters.make;
      const matchesBody = !filters.bodyType || v.bodyType === filters.bodyType;
      const matchesFuel = !filters.fuelType || v.fuelType === filters.fuelType;
      const matchesTrans = !filters.transmission || v.transmission === filters.transmission;
      const matchesMin = !filters.minPrice || v.price >= Number(filters.minPrice);
      const matchesMax = !filters.maxPrice || v.price <= Number(filters.maxPrice);
      return matchesSearch && matchesMake && matchesBody && matchesFuel && matchesTrans && matchesMin && matchesMax;
    });
    if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (filters.sort === 'year-desc') result.sort((a, b) => b.year - a.year);
    if (filters.sort === 'mileage-asc') result.sort((a, b) => a.mileage - b.mileage);
    return result;
  }, [search, filters, allVehicles]);

  const updateFilter = (key, value) => { setFilters(prev => ({ ...prev, [key]: value })); setVisibleCount(8); };
  const clearFilters = () => { setFilters({ make: '', bodyType: '', fuelType: '', transmission: '', minPrice: '', maxPrice: '', sort: '' }); setSearch(''); };

  return (
    <main className="showroom-page">
      <section className="showroom-hero">
        <AnimatedSection className="container" animation="fade-up">
          <h1>Our Showroom</h1>
          <p>Browse our complete collection of premium pre-owned vehicles</p>
        </AnimatedSection>
      </section>
      <section className="showroom-content container">
        <aside className="filters-panel" id="filters">
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="clear-btn" onClick={clearFilters}>Clear All</button>
          </div>
          <div className="filter-group">
            <label>Search</label>
            <input type="text" placeholder="Search make or model..." value={search} onChange={e => setSearch(e.target.value)} id="search-input" />
          </div>
          <div className="filter-group">
            <label>Make</label>
            <select value={filters.make} onChange={e => updateFilter('make', e.target.value)}>
              <option value="">All Makes</option>
              {makes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Body Type</label>
            <select value={filters.bodyType} onChange={e => updateFilter('bodyType', e.target.value)}>
              <option value="">All Types</option>
              {bodyTypes.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Fuel Type</label>
            <select value={filters.fuelType} onChange={e => updateFilter('fuelType', e.target.value)}>
              <option value="">All Fuels</option>
              {['Petrol','Diesel','Hybrid','Electric'].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Transmission</label>
            <select value={filters.transmission} onChange={e => updateFilter('transmission', e.target.value)}>
              <option value="">All</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-row">
              <input type="number" placeholder="Min £" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} />
              <input type="number" placeholder="Max £" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} />
            </div>
          </div>
          <div className="filter-group">
            <label>Sort By</label>
            <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Newest First</option>
              <option value="mileage-asc">Lowest Mileage</option>
            </select>
          </div>
        </aside>
        <div className="showroom-results">
          {loading ? (
            <div className="loading-spinner" style={{ textAlign: 'center', padding: '60px' }}>Loading showroom vehicles...</div>
          ) : (
            <>
              <AnimatedSection animation="fade-in">
              <p className="results-count">{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} found</p>
              <div className="vehicle-grid">
                {filtered.slice(0, visibleCount).map((v, i) => (
                  <div key={v.id} style={{ animationDelay: `${(i % 8) * 100}ms` }} className="animate-section fade-up is-visible">
                    <VehicleCard vehicle={v} />
                  </div>
                ))}
              </div>
            </AnimatedSection>
              {filtered.length === 0 && <div className="no-results"><p>No vehicles match your criteria. Try adjusting your filters.</p></div>}
              {visibleCount < filtered.length && (
                <div className="load-more">
                  <button className="btn-secondary" onClick={() => setVisibleCount(c => c + 8)}>Load More</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
