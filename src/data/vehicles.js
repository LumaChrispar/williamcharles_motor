let cachedVehicles = null;
let fetchingPromise = null;

// High-quality body-type specific Unsplash images
const BODY_IMAGES = {
  Saloon: [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80'
  ],
  SUV: [
    'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80'
  ],
  Coupe: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3b?auto=format&fit=crop&w=800&q=80'
  ]
};

function assignImages(vehicles) {
  return vehicles.map(v => {
    const baseImages = BODY_IMAGES[v.bodyType] || BODY_IMAGES['Saloon'];
    const shuffled = [...baseImages].sort(() => (Math.sin(v.id) * 10000 % 1) - 0.5);
    return { ...v, images: shuffled };
  });
}

export async function fetchAllVehicles() {
  if (cachedVehicles) return cachedVehicles;
  if (fetchingPromise) return fetchingPromise;
  
  fetchingPromise = import('./vehiclesData.json').then(module => {
    cachedVehicles = assignImages(module.default);
    return cachedVehicles;
  }).catch(err => {
    console.error('Failed to load JSON dataset:', err);
    return []; // Return empty array on failure
  });
  
  return fetchingPromise;
}

export const getAvailableVehicles = async () => {
  const cars = await fetchAllVehicles();
  return cars.filter(v => !v.sold && v.price <= 10000);
};

export const getSoldVehicles = async () => {
  const cars = await fetchAllVehicles();
  return cars.filter(v => v.sold);
};

export const getFeaturedVehicles = async () => {
  const cars = await fetchAllVehicles();
  return cars
    .filter(v => !v.sold && v.price >= 5000 && v.price <= 20000)
    .sort((a, b) => b.price - a.price)
    .slice(0, 6);
};

export const getVehicleById = async (id) => {
  const cars = await fetchAllVehicles();
  // Using == instead of === since id from URL is a string and our JSON might have numbers
  return cars.find(v => v.id == id);
};

export const getRelatedVehicles = async (id, limit = 4) => {
  const current = await getVehicleById(id);
  if (!current) return [];
  const cars = await fetchAllVehicles();
  return cars
    .filter(v => v.id != current.id && !v.sold)
    .sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      if (a.make === current.make) scoreA += 3;
      if (b.make === current.make) scoreB += 3;
      if (a.bodyType === current.bodyType) scoreA += 2;
      if (b.bodyType === current.bodyType) scoreB += 2;
      if (a.fuelType === current.fuelType) scoreA += 1;
      if (b.fuelType === current.fuelType) scoreB += 1;
      return scoreB - scoreA;
    })
    .slice(0, limit);
};

export const getAllMakes = async () => {
  const cars = await fetchAllVehicles();
  return [...new Set(cars.filter(v => !v.sold).map(v => v.make))].sort();
};

export const getAllBodyTypes = async () => {
  const cars = await fetchAllVehicles();
  return [...new Set(cars.filter(v => !v.sold).map(v => v.bodyType))].sort();
};
