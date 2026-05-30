const API_TOKEN = '44050059-b4c6-4ce7-b8df-a0c36a275d3a';
const API_SECRET = '6874c7fd9c2722e5078f98015c12412e';
const BASE_URL = '/api/carapi'; // Proxied to https://carapi.app/api via Vite

// Helper to get or refresh JWT
async function getAuthToken() {
  const cached = localStorage.getItem('carapi_jwt');
  const exp = localStorage.getItem('carapi_jwt_exp');
  
  // If we have a valid token (not expiring within next hour), use it
  if (cached && exp && Date.now() < parseInt(exp) - 3600000) {
    return cached;
  }

  // Otherwise, fetch new token
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    },
    body: JSON.stringify({
      api_token: API_TOKEN,
      api_secret: API_SECRET
    })
  });

  if (!response.ok) {
    throw new Error(`Auth failed: ${response.statusText}`);
  }

  const jwt = await response.text();
  
  // Basic JWT decoding to get expiration
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    localStorage.setItem('carapi_jwt_exp', (payload.exp * 1000).toString());
  } catch (e) {
    // Fallback: 7 days default expiration
    localStorage.setItem('carapi_jwt_exp', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
  }

  localStorage.setItem('carapi_jwt', jwt);
  return jwt;
}

/**
 * Make an authenticated API request
 */
async function fetchCarApi(endpoint, options = {}) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Fetch a list of recent vehicles (e.g. year 2020-2024)
 * CarAPI typically uses /vehicles endpoint or similar. We will fetch generic models for the showroom.
 */
export async function getShowroomVehicles() {
  // Let's fetch some premium makes to populate the showroom
  const data = await fetchCarApi('/vehicles?year=2024&make=BMW&limit=5');
  const data2 = await fetchCarApi('/vehicles?year=2023&make=Mercedes-Benz&limit=5');
  const data3 = await fetchCarApi('/vehicles?year=2022&make=Audi&limit=5');
  
  const rawVehicles = [...(data.data || []), ...(data2.data || []), ...(data3.data || [])];
  
  // Format for our application
  return rawVehicles.map(v => mapCarApiToLocal(v));
}

/**
 * Fetch a specific vehicle by ID
 */
export async function getVehicleById(id) {
  // Try fetching the specific vehicle
  const v = await fetchCarApi(`/vehicles/${id}`);
  if (!v) return null;
  return mapCarApiToLocal(v);
}

/**
 * Map CarAPI vehicle format to our application's format
 * Generates deterministic fallback images and prices since CarAPI doesn't provide them.
 */
function mapCarApiToLocal(v) {
  // Generate a deterministic price between £25,000 and £120,000 based on year and string lengths
  const basePrice = 20000 + ((v.year - 2000) * 1500) + ((v.make.length + v.model.length) * 1000);
  
  // Deterministic images (Using random premium car images from Unsplash based on string length)
  const imageSeed = (v.make.length + v.model.length) % 5;
  const fallbackImages = [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80', // BMW style
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80', // Mercedes style
    'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=800&q=80', // Audi style
    'https://images.unsplash.com/photo-1503376710356-70e64ebcce5e?auto=format&fit=crop&w=800&q=80', // Porsche style
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80', // Aston Martin style
  ];

  return {
    id: v.id.toString(),
    make: v.make,
    model: v.model,
    year: v.year,
    price: basePrice,
    color: v.color || 'Obsidian Black', // Fallback color
    bodyType: v.type || 'Coupe',
    mileage: Math.max(100, (2025 - v.year) * 10500 + (v.model.length * 500)), // Deterministic mileage
    transmission: v.transmission || 'Automatic',
    fuelType: v.engine_type || 'Petrol',
    drivetrain: v.drive || 'AWD',
    engineSize: v.engine_size ? `${v.engine_size}L` : '3.0L',
    enginePower: v.power_hp ? `${v.power_hp} PS` : '450 PS',
    acceleration: v.acceleration ? `${v.acceleration}s` : '4.2s',
    topSpeed: '155 mph',
    mpg: v.city_mpg ? `${v.city_mpg} mpg` : '28.5 mpg',
    doors: v.doors || 4,
    ulezCompliant: v.year >= 2015,
    roadTax: '£180/year',
    images: [fallbackImages[imageSeed], fallbackImages[(imageSeed + 1) % 5]],
    description: `Stunning ${v.year} ${v.make} ${v.model} presented in immaculate condition. This vehicle comes with a full dealership service history, premium features, and has undergone a rigorous 142-point inspection.`,
    isFeatured: v.year >= 2023,
    status: 'Available'
  };
}
