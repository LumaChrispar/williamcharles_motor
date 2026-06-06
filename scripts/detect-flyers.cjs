const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/car-images');
const nqvH9bDir = path.join(__dirname, '../nqvH9b');
const dataFile = path.join(__dirname, '../src/data/vehiclesData.json');

async function analyzeImage(filePath) {
  try {
    const { dominant } = await sharp(filePath)
      .resize(50, 50, { fit: 'fill' }) // shrink for speed
      .toColorspace('srgb')
      .stats();
    return dominant;
  } catch {
    return null;
  }
}

function isFlyer(dominant) {
  if (!dominant) return false;
  const { r, g, b } = dominant;
  // AA flyers are bright yellow: high R, high G, low B
  // Also catch white-background promotional sheets
  const isYellow = r > 180 && g > 180 && b < 100;
  const isVeryBright = r > 220 && g > 220 && b > 200; // white/near-white info sheets
  return isYellow || isVeryBright;
}

async function main() {
  // Collect all unique suffix patterns from filenames
  const allFiles = [];
  const walkDir = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walkDir(fullPath);
      else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) allFiles.push(fullPath);
    }
  };
  walkDir(targetDir);

  // Group by suffix (the hex part after last 0x)
  const suffixGroups = {};
  for (const file of allFiles) {
    const match = file.match(/0x([a-f0-9]+)\.[^.]+$/i);
    if (match) {
      const suffix = match[0];
      if (!suffixGroups[suffix]) suffixGroups[suffix] = [];
      suffixGroups[suffix].push(file);
    }
  }

  console.log(`Found ${Object.keys(suffixGroups).length} unique suffix patterns.`);

  const badSuffixes = [];
  for (const [suffix, files] of Object.entries(suffixGroups)) {
    // Sample first file from this group
    const sample = files[0];
    const dominant = await analyzeImage(sample);
    if (isFlyer(dominant)) {
      console.log(`🗑 Flagging suffix "${suffix}" as flyer (R:${dominant?.r} G:${dominant?.g} B:${dominant?.b}) — ${files.length} files`);
      badSuffixes.push(suffix);
    }
  }

  if (badSuffixes.length === 0) {
    console.log('No flyer suffixes detected!');
    return;
  }

  // Delete all files from bad suffix groups in public/car-images
  let deletedCount = 0;
  for (const file of allFiles) {
    if (badSuffixes.some(suffix => file.includes(suffix))) {
      fs.unlinkSync(file);
      deletedCount++;
    }
  }
  console.log(`Deleted ${deletedCount} flyer images from public/car-images.`);

  // Also delete from nqvH9b source
  let sourceDeleted = 0;
  const nqvH9bFiles = [];
  const walkSource = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walkSource(fullPath);
      else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) nqvH9bFiles.push(fullPath);
    }
  };
  walkSource(nqvH9bDir);
  for (const file of nqvH9bFiles) {
    if (badSuffixes.some(suffix => file.includes(suffix))) {
      fs.unlinkSync(file);
      sourceDeleted++;
    }
  }
  console.log(`Deleted ${sourceDeleted} flyer images from nqvH9b source.`);

  // Update vehiclesData.json to remove references to deleted images
  let vehicles = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  vehicles = vehicles.map(v => {
    if (v.localImages) {
      v.localImages = v.localImages.filter(img =>
        !badSuffixes.some(suffix => img.includes(suffix))
      );
      if (v.localImages.length === 0) {
        delete v.localImages;
        v.isPrimary = false;
      }
    }
    return v;
  });
  fs.writeFileSync(dataFile, JSON.stringify(vehicles, null, 2));
  console.log('Updated vehiclesData.json to remove flyer image references.');
  console.log(`\nAll done! Removed images with suffixes: ${badSuffixes.join(', ')}`);
}

main().catch(console.error);
