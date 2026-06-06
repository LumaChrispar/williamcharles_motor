const fs = require('fs');

const dataFile = './src/data/vehiclesData.json';
let vehicles = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

let priceFixCount = 0;
let imageFixCount = 0;

vehicles = vehicles.map(v => {
  let changed = false;

  // Remove any localImages that contain 0x0ca0c
  if (v.localImages && v.localImages.length > 0) {
    const filtered = v.localImages.filter(img => !img.includes('0x0ca0c'));
    if (filtered.length !== v.localImages.length) {
      v.localImages = filtered;
      imageFixCount += (v.localImages.length - filtered.length);
      changed = true;
    }
    // If no images left, remove the flag
    if (filtered.length === 0) {
      delete v.localImages;
      v.isPrimary = false;
    }
  }

  // Cap prices of primary cars at £12,000 for more realistic secondhand listings
  if (v.isPrimary && v.price > 12000) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - (v.year || 2020);
    const baseFraction = Math.max(0.1, 1 - (age * 0.07));
    v.price = Math.min(12000, Math.max(5000, Math.round(12000 * baseFraction / 500) * 500));
    priceFixCount++;
    changed = true;
  }

  return v;
});

fs.writeFileSync(dataFile, JSON.stringify(vehicles, null, 2));
console.log(`Done! Fixed prices for ${priceFixCount} cars. Cleaned image references for ${imageFixCount} entries.`);
