const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const inputPath = path.join(__dirname, '../Cars Datasets 2025.csv');
const outputPath = path.join(__dirname, '../src/data/vehiclesData.json');

const results = [];
let currentId = 1;

fs.createReadStream(inputPath)
  .pipe(csv())
  .on('data', (data) => {
    // Parse numeric string with potential $ and commas
    const parsePrice = (priceStr) => {
      if (!priceStr) return 0;
      const clean = priceStr.replace(/[^0-9.-]+/g, "");
      // Handle ranges like "$12,000-$15,000" by taking the lower bound
      const parts = clean.split('-');
      return parseInt(parts[0], 10) || 0;
    };

    // Columns: Company Names, Cars Names, Engines, CC/Battery Capacity, HorsePower, Total Speed, Performance(0 - 100 )KM/H, Cars Prices, Fuel Types, Seats, Torque
    
    // Some basic mapping logic
    const make = data['Company Names'] ? data['Company Names'].trim() : 'Unknown';
    const model = data['Cars Names'] ? data['Cars Names'].trim() : 'Model';
    const price = parsePrice(data['Cars Prices']);
    
    // Normalize fuel type
    let rawFuel = (data['Fuel Types'] || 'Petrol').toLowerCase();
    let fuelType = 'Petrol';
    if (rawFuel.includes('diesel')) fuelType = 'Diesel';
    else if (rawFuel.includes('hybrid')) fuelType = 'Hybrid';
    else if (rawFuel.includes('electric') || rawFuel.includes('ev')) fuelType = 'Electric';
    
    // Extract transmission (default to Automatic for modern cars since it's missing)
    const transmission = 'Automatic';

    // Derive a body type based on seats or arbitrary rules (default to Coupe/Saloon)
    const seats = parseInt(data['Seats']) || 4;
    let bodyType = 'Saloon';
    if (seats <= 2) bodyType = 'Coupe';
    else if (seats >= 5) {
      if (model.toLowerCase().includes('x') || model.toLowerCase().includes('suv') || model.toLowerCase().includes('rover')) {
         bodyType = 'SUV';
      } else {
         bodyType = 'Saloon'; // Default 5 seater
      }
    }
    
    // Clean up horsepower
    const hpStr = data['HorsePower'] || '';
    const hpClean = hpStr.replace(/[^\d-]/g, '').split('-')[0] || '200';
    
    const year = 2024; // Dataset is "2025" cars but we'll list as 2024/2025
    
    const mileage = Math.floor(1000 + Math.random() * 25000); // Generate some mileage

    results.push({
      id: currentId++,
      make: make,
      model: model,
      price: price > 0 ? price : 35000 + Math.floor(Math.random() * 50000), // Fallback price
      year: year,
      mileage: mileage,
      fuelType: fuelType,
      transmission: transmission,
      drivetrain: 'AWD', // Default
      engineSize: data['Engines'] || '2.0L',
      enginePower: `${hpClean} bhp`,
      acceleration: data['Performance(0 - 100 )KM/H'] || '5.0s',
      topSpeed: data['Total Speed'] || '155 mph',
      mpg: fuelType === 'Electric' ? '300 miles range' : '35 mpg',
      ulezCompliant: true,
      roadTax: '£180/year',
      color: 'Obsidian Black', // Fallback color
      bodyType: bodyType,
      doors: seats <= 2 ? 2 : (seats === 4 ? 4 : 5),
      sold: Math.random() < 0.15,
      featured: Math.random() < 0.1,
      description: `Introducing an absolutely stunning ${year} ${make} ${model}. This carefully selected vehicle boasts a high-spec options pack, including an upgraded smart suspension, customizable dynamic driver assistance, high-fidelity premium acoustics, and pristine luxury cabin trim.`,
      // We don't add images here; we'll attach them dynamically in vehicles.js
    });
  })
  .on('end', () => {
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Successfully converted ${results.length} vehicles to JSON.`);
  });
