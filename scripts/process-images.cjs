const fs = require('fs');
const path = require('path');

const srcDir = '/home/luma/Desktop/customer webs/Cars/nqvH9b';
const destDir = '/home/luma/Desktop/customer webs/Cars/public/car-images';
const dataFile = '/home/luma/Desktop/customer webs/Cars/src/data/vehiclesData.json';

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

const folders = fs.readdirSync(srcDir).filter(f => {
  const stat = fs.statSync(path.join(srcDir, f));
  return stat.isDirectory() && !['css', 'js', 'logo'].includes(f);
});

let vehicles = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// Filter out sold ones and get them as references
let availableVehicles = vehicles.filter(v => !v.sold);

// Prioritize expensive cars for named folders and in general
availableVehicles.sort((a, b) => b.price - a.price);

// Reset all isPrimary
vehicles.forEach(v => {
  v.isPrimary = false;
  delete v.localImages; // clean up old mapping if any
});

let assignedCount = 0;

folders.forEach((folder) => {
  const folderNameLower = folder.toLowerCase();
  const isNamed = !folder.startsWith('vehicle-');
  let matchedCarIndex = -1;
  
  if (isNamed) {
    let make = '';
    if (folderNameLower.includes('audi')) make = 'Audi';
    else if (folderNameLower.includes('bmw')) make = 'BMW';
    else if (folderNameLower.includes('lamborghini')) make = 'Lamborghini';
    else if (folderNameLower.includes('mercedes')) make = 'Mercedes';
    
    if (make) {
      matchedCarIndex = availableVehicles.findIndex(v => v.make.toLowerCase().includes(make.toLowerCase()) && !v.isPrimary);
    }
  }
  
  // Fallback to any unassigned vehicle
  if (matchedCarIndex === -1) {
    matchedCarIndex = availableVehicles.findIndex(v => !v.isPrimary);
  }
  
  if (matchedCarIndex !== -1) {
    const car = availableVehicles[matchedCarIndex];
    car.isPrimary = true;
    
    const folderPath = path.join(srcDir, folder);
    const files = fs.readdirSync(folderPath).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    
    const destFolderPath = path.join(destDir, folder);
    if (!fs.existsSync(destFolderPath)) fs.mkdirSync(destFolderPath, { recursive: true });
    
    const localImages = [];
    files.forEach(f => {
      // Just copy to the public dir
      fs.copyFileSync(path.join(folderPath, f), path.join(destFolderPath, f));
      localImages.push(`/car-images/${folder}/${f}`);
    });
    
    car.localImages = localImages;
    assignedCount++;
  }
});

fs.writeFileSync(dataFile, JSON.stringify(vehicles, null, 2));
console.log(`Successfully mapped ${assignedCount} folders to vehicles.`);
