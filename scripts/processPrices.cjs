const fs = require('fs');
const path = require('path');

// Define brands and models to remove
const BRANDS_TO_REMOVE = ['FERRARI', 'LAMBORGHINI', 'LAMBORGHINI'];
const SUPERCAR_KEYWORDS = ['VALKYRIE', 'VALHALLA', 'SUPERLEGGERA', 'GT 63 S', 'R8 GT', 'MCLAREN'];

// Function to check if a car should be removed
function shouldRemove(car) {
  const make = car.make.toUpperCase();
  const model = car.model.toUpperCase();
  
  // Check if brand should be removed
  if (BRANDS_TO_REMOVE.includes(make)) {
    return true;
  }
  
  // Check for supercar keywords
  for (const keyword of SUPERCAR_KEYWORDS) {
    if (model.includes(keyword)) {
      return true;
    }
  }
  
  return false;
}

// Function to generate a realistic secondhand price for each car
function getRandomPrice(car) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - (car.year || 2020);

  if (car.isPrimary) {
    const min = 7000;
    const max = 12000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let minPrice = 2000;
  let maxPrice = 9500;
  if (age <= 1) {
    minPrice = 6000;
    maxPrice = 12000;
  } else if (age <= 3) {
    minPrice = 4500;
    maxPrice = 10500;
  } else if (age <= 6) {
    minPrice = 3000;
    maxPrice = 8500;
  } else {
    minPrice = 2000;
    maxPrice = 6500;
  }

  return Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
}

// Read the JSON file
const filePath = path.join(__dirname, '../src/data/vehiclesData.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`Total vehicles before: ${data.length}`);

// Filter out removed brands and assign random prices
const processedData = data
  .filter(car => !shouldRemove(car))
  .map(car => ({
    ...car,
    price: getRandomPrice(car) // Assign random price
  }));

console.log(`Total vehicles after: ${processedData.length}`);
console.log(`Removed: ${data.length - processedData.length} vehicles`);

// Write back to the file
fs.writeFileSync(filePath, JSON.stringify(processedData, null, 2));
console.log('✓ vehiclesData.json updated successfully!');
