const vehicles = [
  {
    id: 1, make: 'BMW', model: 'M3 Competition', price: 62995, year: 2023, mileage: 8420,
    fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'Rear-Wheel Drive',
    engineSize: '3.0L', enginePower: '510 bhp', acceleration: '3.9s', topSpeed: '155 mph',
    mpg: '32.1', ulezCompliant: true, roadTax: '£180/year', color: 'Black Sapphire',
    bodyType: 'Saloon', doors: 4, sold: false, featured: true,
    description: 'Stunning BMW M3 Competition in Black Sapphire metallic. This exceptional sports saloon combines everyday practicality with breathtaking performance. Features include M Sport differential, adaptive M suspension, head-up display, Harman Kardon surround sound, and full leather Merino interior. Full BMW service history and two keys.',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 2, make: 'Mercedes-Benz', model: 'C300 AMG Line', price: 38995, year: 2022, mileage: 15230,
    fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'Rear-Wheel Drive',
    engineSize: '2.0L', enginePower: '258 bhp', acceleration: '5.9s', topSpeed: '155 mph',
    mpg: '42.2', ulezCompliant: true, roadTax: '£165/year', color: 'Polar White',
    bodyType: 'Saloon', doors: 4, sold: false, featured: true,
    description: 'Elegant Mercedes-Benz C300 AMG Line in Polar White. Packed with premium features including MBUX infotainment, 360-degree camera, ambient lighting, heated leather seats, and advanced driver assistance. Impeccable condition throughout with full Mercedes service history.',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 3, make: 'Audi', model: 'RS5 Sportback', price: 58995, year: 2023, mileage: 5100,
    fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'All-Wheel Drive',
    engineSize: '2.9L', enginePower: '450 bhp', acceleration: '3.9s', topSpeed: '155 mph',
    mpg: '29.4', ulezCompliant: true, roadTax: '£180/year', color: 'Nardo Grey',
    bodyType: 'Coupe', doors: 4, sold: false, featured: true,
    description: 'Head-turning Audi RS5 Sportback in iconic Nardo Grey. This quattro-equipped performance machine features the RS sport exhaust, dynamic ride control, virtual cockpit plus, Bang & Olufsen 3D sound, and carbon fibre inlays. Low mileage with full Audi history.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 4, make: 'Range Rover', model: 'Sport HSE Dynamic', price: 72995, year: 2022, mileage: 18750,
    fuelType: 'Diesel', transmission: 'Automatic', drivetrain: 'All-Wheel Drive',
    engineSize: '3.0L', enginePower: '350 bhp', acceleration: '6.2s', topSpeed: '140 mph',
    mpg: '35.7', ulezCompliant: true, roadTax: '£190/year', color: 'Silicon Silver',
    bodyType: 'SUV', doors: 5, sold: false, featured: true,
    description: 'Commanding Range Rover Sport HSE Dynamic in Silicon Silver. This luxury SUV features Terrain Response 2, air suspension, panoramic sunroof, Meridian surround sound, heated and cooled seats, and a comprehensive suite of driver assistance technologies. Full Land Rover service history.',
    images: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 5, make: 'Porsche', model: '911 Carrera S', price: 89995, year: 2021, mileage: 12300,
    fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'Rear-Wheel Drive',
    engineSize: '3.0L', enginePower: '450 bhp', acceleration: '3.5s', topSpeed: '191 mph',
    mpg: '29.1', ulezCompliant: true, roadTax: '£180/year', color: 'Carrara White',
    bodyType: 'Coupe', doors: 2, sold: false, featured: false,
    description: 'Iconic Porsche 911 Carrera S in Carrara White metallic. Spec includes Sport Chrono Package, PASM sport suspension, sport exhaust, Porsche Communication Management, Bose surround sound, and full leather interior in black. Porsche approved with warranty.',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3b?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 6, make: 'Volkswagen', model: 'Golf GTI', price: 32995, year: 2023, mileage: 6800,
    fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'Front-Wheel Drive',
    engineSize: '2.0L', enginePower: '245 bhp', acceleration: '6.3s', topSpeed: '155 mph',
    mpg: '40.9', ulezCompliant: true, roadTax: '£165/year', color: 'Kings Red',
    bodyType: 'Hatchback', doors: 5, sold: false, featured: false,
    description: 'Thrilling Volkswagen Golf GTI in Kings Red metallic. Features the iconic tartan sport seats, digital cockpit pro, 10-inch infotainment display, dynamic chassis control, LED matrix headlights, and Harman Kardon sound system. One owner from new.',
    images: [
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 7, make: 'Ford', model: 'Focus ST', price: 28995, year: 2022, mileage: 14200,
    fuelType: 'Petrol', transmission: 'Manual', drivetrain: 'Front-Wheel Drive',
    engineSize: '2.3L', enginePower: '280 bhp', acceleration: '5.7s', topSpeed: '155 mph',
    mpg: '36.7', ulezCompliant: true, roadTax: '£165/year', color: 'Performance Blue',
    bodyType: 'Hatchback', doors: 5, sold: false, featured: false,
    description: 'Exciting Ford Focus ST in Performance Blue. This hot hatch features the ST Performance Pack with limited-slip differential, launch control, shift indicator lights, Recaro sport seats, SYNC 3 infotainment, and B&O premium audio. Full Ford service history.',
    images: [
      'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1525609004556-c46c3653d6e4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 8, make: 'Toyota', model: 'GR Supra 3.0', price: 49995, year: 2023, mileage: 3200,
    fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'Rear-Wheel Drive',
    engineSize: '3.0L', enginePower: '340 bhp', acceleration: '4.3s', topSpeed: '155 mph',
    mpg: '34.4', ulezCompliant: true, roadTax: '£180/year', color: 'Prominence Red',
    bodyType: 'Coupe', doors: 2, sold: false, featured: false,
    description: 'Breathtaking Toyota GR Supra 3.0 in Prominence Red. This reborn legend features adaptive variable suspension, active rear differential, 8.8-inch touchscreen, JBL premium audio, and a head-up display. Delivery miles only with full Toyota warranty remaining.',
    images: [
      'https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 9, make: 'BMW', model: 'X5 M Sport', price: 54995, year: 2022, mileage: 22100,
    fuelType: 'Diesel', transmission: 'Automatic', drivetrain: 'All-Wheel Drive',
    engineSize: '3.0L', enginePower: '340 bhp', acceleration: '5.2s', topSpeed: '152 mph',
    mpg: '39.2', ulezCompliant: true, roadTax: '£180/year', color: 'Phytonic Blue',
    bodyType: 'SUV', doors: 5, sold: false, featured: false,
    description: 'Imposing BMW X5 M Sport in Phytonic Blue metallic. This premium SUV offers the perfect blend of luxury and sportiness with M Sport suspension, 20-inch alloys, panoramic glass roof, Vernasca leather, gesture control, and driving assistant professional. Two keys, full history.',
    images: [
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 10, make: 'Mercedes-Benz', model: 'E300 AMG Line', price: 42995, year: 2021, mileage: 28500,
    fuelType: 'Hybrid', transmission: 'Automatic', drivetrain: 'Rear-Wheel Drive',
    engineSize: '2.0L', enginePower: '320 bhp', acceleration: '5.7s', topSpeed: '155 mph',
    mpg: '47.9', ulezCompliant: true, roadTax: '£150/year', color: 'Obsidian Black',
    bodyType: 'Saloon', doors: 4, sold: false, featured: false,
    description: 'Sophisticated Mercedes-Benz E300 AMG Line in Obsidian Black. This executive saloon features the EQ Boost mild-hybrid system, Widescreen cockpit, Burmester surround sound, multibeam LED headlights, air body control, and designo leather upholstery. Outstanding condition.',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 11, make: 'Audi', model: 'A5 S Line', price: 36995, year: 2023, mileage: 9800,
    fuelType: 'Diesel', transmission: 'Automatic', drivetrain: 'Front-Wheel Drive',
    engineSize: '2.0L', enginePower: '204 bhp', acceleration: '6.7s', topSpeed: '153 mph',
    mpg: '52.3', ulezCompliant: true, roadTax: '£165/year', color: 'Mythos Black',
    bodyType: 'Coupe', doors: 2, sold: false, featured: false,
    description: 'Sleek Audi A5 S Line in Mythos Black metallic. Specification includes S line sport package, virtual cockpit, MMI navigation plus, wireless charging, matrix LED headlights, and heated sport seats with fine Nappa leather. Audi approved pre-owned.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 12, make: 'Jaguar', model: 'F-Type R-Dynamic', price: 55995, year: 2022, mileage: 11400,
    fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'Rear-Wheel Drive',
    engineSize: '2.0L', enginePower: '300 bhp', acceleration: '5.4s', topSpeed: '155 mph',
    mpg: '34.9', ulezCompliant: true, roadTax: '£180/year', color: 'Eiger Grey',
    bodyType: 'Convertible', doors: 2, sold: false, featured: false,
    description: 'Gorgeous Jaguar F-Type R-Dynamic in Eiger Grey. This British sports car features the active exhaust, configurable dynamics, 12.3-inch interactive driver display, meridian sound system, Windsor leather seats, and an electrically operated fabric hood. Stunning example.',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Previously Sold
  {
    id: 13, make: 'Tesla', model: 'Model 3 Long Range', price: 41995, year: 2022, mileage: 19500,
    fuelType: 'Electric', transmission: 'Automatic', drivetrain: 'All-Wheel Drive',
    engineSize: 'Electric', enginePower: '449 bhp', acceleration: '4.2s', topSpeed: '145 mph',
    mpg: '340 miles range', ulezCompliant: true, roadTax: '£0/year', color: 'Pearl White',
    bodyType: 'Saloon', doors: 4, sold: true, featured: false,
    description: 'Tesla Model 3 Long Range in Pearl White. Dual motor all-wheel drive with Autopilot, 15-inch touchscreen, glass roof, premium audio, and heated seats all round.',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 14, make: 'BMW', model: '4 Series M Sport', price: 39995, year: 2021, mileage: 24800,
    fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'Rear-Wheel Drive',
    engineSize: '2.0L', enginePower: '258 bhp', acceleration: '5.8s', topSpeed: '155 mph',
    mpg: '38.2', ulezCompliant: true, roadTax: '£165/year', color: 'Tanzanite Blue',
    bodyType: 'Coupe', doors: 2, sold: true, featured: false,
    description: 'BMW 430i M Sport in Tanzanite Blue. Featuring M Sport package, live cockpit professional, Harman Kardon, adaptive LED headlights, and Vernasca leather.',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 15, make: 'Audi', model: 'Q7 S Line', price: 52995, year: 2022, mileage: 20100,
    fuelType: 'Diesel', transmission: 'Automatic', drivetrain: 'All-Wheel Drive',
    engineSize: '3.0L', enginePower: '286 bhp', acceleration: '6.3s', topSpeed: '152 mph',
    mpg: '37.7', ulezCompliant: true, roadTax: '£180/year', color: 'Glacier White',
    bodyType: 'SUV', doors: 5, sold: true, featured: false,
    description: 'Audi Q7 50 TDI S Line in Glacier White. Seven seats, adaptive air suspension, virtual cockpit, panoramic sunroof, and quattro all-wheel drive.',
    images: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 16, make: 'Mercedes-Benz', model: 'GLC 300 AMG Line', price: 46995, year: 2023, mileage: 8900,
    fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'All-Wheel Drive',
    engineSize: '2.0L', enginePower: '258 bhp', acceleration: '6.2s', topSpeed: '149 mph',
    mpg: '38.7', ulezCompliant: true, roadTax: '£165/year', color: 'Selenite Grey',
    bodyType: 'SUV', doors: 5, sold: true, featured: false,
    description: 'Mercedes-Benz GLC 300 4MATIC AMG Line in Selenite Grey. MBUX with augmented reality, Burmester audio, 360 camera, and AMG body styling.',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

export const getAvailableVehicles = () => vehicles.filter(v => !v.sold);
export const getSoldVehicles = () => vehicles.filter(v => v.sold);
export const getFeaturedVehicles = () => vehicles.filter(v => v.featured && !v.sold);
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
