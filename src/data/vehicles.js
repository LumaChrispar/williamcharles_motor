// High-quality body-type specific Unsplash images (at least 4 distinct images per body style)
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
  ],
  Hatchback: [
    'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=800&q=80'
  ],
  Convertible: [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80'
  ]
};

// Premium high-end luxury makes, trims, and unique variants
const CAR_TEMPLATES = [
  {
    make: 'BMW',
    trims: ['Competition', 'M Sport', 'Shadowline Edition', 'xDrive Premium', 'Carbon Edition'],
    models: [
      { name: 'M3', body: 'Saloon', basePrice: 62000, engine: '3.0L twin-turbo', hp: '510 bhp', accel: '3.9s', topSpeed: '155 mph', mpg: '32.1' },
      { name: 'X5', body: 'SUV', basePrice: 55000, engine: '3.0L turbo diesel', hp: '340 bhp', accel: '5.2s', topSpeed: '152 mph', mpg: '39.2' },
      { name: '4 Series', body: 'Coupe', basePrice: 38000, engine: '2.0L turbo petrol', hp: '258 bhp', accel: '5.8s', topSpeed: '155 mph', mpg: '38.2' },
      { name: 'M8 Grand', body: 'Coupe', basePrice: 95000, engine: '4.4L twin-turbo V8', hp: '625 bhp', accel: '3.2s', topSpeed: '190 mph', mpg: '24.8' },
    ]
  },
  {
    make: 'Mercedes-Benz',
    trims: ['AMG Line', 'Premium Plus', 'Night Edition', 'EQ Boost', 'Edition 1'],
    models: [
      { name: 'C300', body: 'Saloon', basePrice: 39000, engine: '2.0L turbo petrol', hp: '258 bhp', accel: '5.9s', topSpeed: '155 mph', mpg: '42.2' },
      { name: 'E300 Hybrid', body: 'Saloon', basePrice: 43000, engine: '2.0L mild-hybrid', hp: '320 bhp', accel: '5.7s', topSpeed: '155 mph', mpg: '47.9' },
      { name: 'GLC 300', body: 'SUV', basePrice: 47000, engine: '2.0L turbo petrol', hp: '258 bhp', accel: '6.2s', topSpeed: '149 mph', mpg: '38.7' },
      { name: 'AMG GT', body: 'Coupe', basePrice: 110000, engine: '4.0L twin-turbo V8', hp: '585 bhp', accel: '3.6s', topSpeed: '198 mph', mpg: '22.4' },
    ]
  },
  {
    make: 'Audi',
    trims: ['S Line', 'Black Edition', 'Vorsprung', 'quattro Premium', 'RS Sport Pack'],
    models: [
      { name: 'RS5', body: 'Coupe', basePrice: 59000, engine: '2.9L twin-turbo V6', hp: '450 bhp', accel: '3.9s', topSpeed: '155 mph', mpg: '29.4' },
      { name: 'A5', body: 'Coupe', basePrice: 35000, engine: '2.0L turbo diesel', hp: '204 bhp', accel: '6.7s', topSpeed: '153 mph', mpg: '52.3' },
      { name: 'Q7', body: 'SUV', basePrice: 51000, engine: '3.0L turbo diesel', hp: '286 bhp', accel: '6.3s', topSpeed: '152 mph', mpg: '37.7' },
      { name: 'R8 V10', body: 'Coupe', basePrice: 125000, engine: '5.2L naturally aspirated V10', hp: '620 bhp', accel: '3.1s', topSpeed: '205 mph', mpg: '19.8' }
    ]
  },
  {
    make: 'Porsche',
    trims: ['Carrera S', '4S E-Hybrid', 'GTS Sport', 'Turbo S Premium'],
    models: [
      { name: '911', body: 'Coupe', basePrice: 88000, engine: '3.0L twin-turbo flat-six', hp: '450 bhp', accel: '3.5s', topSpeed: '191 mph', mpg: '29.1' },
      { name: 'Taycan', body: 'Saloon', basePrice: 83000, engine: 'Dual Electric Motor', hp: '530 bhp', accel: '4.0s', topSpeed: '155 mph', mpg: '280 miles range' },
      { name: 'Cayenne', body: 'SUV', basePrice: 69000, engine: '3.0L V6 hybrid', hp: '462 bhp', accel: '5.0s', topSpeed: '157 mph', mpg: '78.4' }
    ]
  }
];

const COLORS = ['Obsidian Black', 'Nardo Grey', 'Carrara White', 'Phytonic Blue', 'Tanzanite Blue', 'Silicon Silver', 'Kings Red', 'Performance Blue', 'Emerald Green', 'Chalk Grey'];
const TRANSMISSIONS = ['Automatic', 'Manual'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const DRIVETRAINS = ['Rear-Wheel Drive', 'All-Wheel Drive', 'Front-Wheel Drive'];

// Generate a completely unique set of vehicles so there is absolutely no plain repetition
function generateVehicles() {
  const list = [];
  let currentId = 1;

  // Consistent seed for mock dataset
  let seed = 88;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const choice = (arr) => arr[Math.floor(random() * arr.length)];

  // Generate 120 uniquely custom spec vehicles
  for (let i = 0; i < 120; i++) {
    const template = choice(CAR_TEMPLATES);
    const modelTemplate = choice(template.models);
    const trim = choice(template.trims);
    
    const year = Math.floor(2018 + random() * 7); // 2018 to 2024
    const mileage = Math.floor(1200 + random() * 38000);
    const color = choice(COLORS);
    const transmission = choice(TRANSMISSIONS);
    const drivetrain = choice(DRIVETRAINS);
    
    let fuelType = choice(FUEL_TYPES);
    if (template.make === 'Tesla') {
      fuelType = 'Electric';
    }

    // Dynamic price calculation based on mileage, age, and premium trims
    const ageFactor = (2026 - year) * 0.07;
    const mileageFactor = mileage * 0.000005;
    const priceModifier = Math.max(0.48, 1 - ageFactor - mileageFactor);
    const trimPremium = trim.includes('Competition') || trim.includes('Turbo S') ? 8500 : 2500;
    const price = Math.round((modelTemplate.basePrice * priceModifier) + trimPremium);

    const sold = random() < 0.18; // ~18% sold cars
    const featured = !sold && random() < 0.08;

    // Grab body type specific image set to ensure we have at least 3-4 distinct Unsplash photos of that category!
    const baseImages = BODY_IMAGES[modelTemplate.body] || BODY_IMAGES['Saloon'];
    // Shuffle the images procedural to give each car a distinct order of slides
    const images = [...baseImages].sort(() => random() - 0.5);

    list.push({
      id: currentId++,
      make: template.make,
      model: `${modelTemplate.name} ${trim}`,
      price: price,
      year: year,
      mileage: mileage,
      fuelType: fuelType,
      transmission: transmission,
      drivetrain: drivetrain,
      engineSize: fuelType === 'Electric' ? 'Electric' : modelTemplate.engine.split(' ')[0],
      enginePower: modelTemplate.hp,
      acceleration: modelTemplate.accel,
      topSpeed: modelTemplate.topSpeed,
      mpg: fuelType === 'Electric' ? '320 miles range' : modelTemplate.mpg,
      ulezCompliant: true,
      roadTax: `£${Math.floor(145 + random() * 45)}/year`,
      color: color,
      bodyType: modelTemplate.body,
      doors: modelTemplate.body === 'Coupe' ? 2 : (modelTemplate.body === 'SUV' ? 5 : 4),
      sold: sold,
      featured: featured,
      description: `Introducing an absolutely stunning ${template.make} ${modelTemplate.name} ${trim} in premium ${color}. This carefully selected vehicle boasts a high-spec options pack, including an upgraded smart suspension, customizable dynamic driver assistance, high-fidelity premium acoustics, and pristine luxury cabin trim. Serviced meticulously at verified main dealer intervals and fully prepared to our rigorous showroom standards.`,
      images: images
    });
  }

  return list;
}

const vehicles = generateVehicles();

export const getAvailableVehicles = () => vehicles.filter(v => !v.sold);
export const getSoldVehicles = () => vehicles.filter(v => v.sold);
export const getFeaturedVehicles = () => vehicles.filter(v => v.featured && !v.sold).slice(0, 8);
export const getVehicleById = (id) => vehicles.find(v => v.id === parseInt(id));
export const getRelatedVehicles = (id, limit = 4) => {
  const current = getVehicleById(id);
  if (!current) return [];
  return vehicles
    .filter(v => v.id !== current.id && !v.sold)
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
export const getAllMakes = () => [...new Set(vehicles.filter(v => !v.sold).map(v => v.make))];
export const getAllBodyTypes = () => [...new Set(vehicles.filter(v => !v.sold).map(v => v.bodyType))];
export default vehicles;
