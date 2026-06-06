const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '../public/logo.png');
const targetDir = path.join(__dirname, '../public/car-images');

async function processImages() {
  console.log('Starting watermark process...');
  // Load the logo
  const originalLogoBuffer = await sharp(logoPath).toBuffer();

  let count = 0;

  const processDir = async (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await processDir(fullPath);
      } else if (entry.isFile() && /\.(jpg|jpeg|png)$/i.test(entry.name)) {
        try {
          const image = sharp(fullPath);
          const metadata = await image.metadata();
          
          // Size the logo to be 20% of the image width
          const logoWidth = Math.max(150, Math.round(metadata.width * 0.22));
          const resizedLogo = await sharp(originalLogoBuffer).resize({ width: logoWidth }).toBuffer();
          
          // Composite the logo on top-left and top-right with a slight offset
          const buffer = await image
            .composite([
              { input: resizedLogo, gravity: 'northwest' },
              { input: resizedLogo, gravity: 'northeast' }
            ])
            .toBuffer();
            
          fs.writeFileSync(fullPath, buffer);
          count++;
          if (count % 100 === 0) {
            console.log(`Processed ${count} images...`);
          }
        } catch (e) {
          console.error('Failed to process:', fullPath, e.message);
        }
      }
    }
  };

  await processDir(targetDir);
  console.log(`Finished processing all ${count} images.`);
}

processImages().catch(console.error);
