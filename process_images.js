const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'vdoo');
const outputDir = path.join(__dirname, 'public', 'sequence');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir)
  .filter(f => f.endsWith('.jpg'))
  .sort(); // ezgif-frame-001.jpg ... ezgif-frame-196.jpg

const totalInput = files.length;
const totalOutput = 121; // 0 to 120

console.log(`Found ${totalInput} images. Processing into ${totalOutput} images...`);

async function processImages() {
  for (let i = 0; i < totalOutput; i++) {
    // map i (0 to 120) to input index (0 to 195)
    const inputIndex = Math.min(Math.floor((i / (totalOutput - 1)) * (totalInput - 1)), totalInput - 1);
    const inputPath = path.join(inputDir, files[inputIndex]);
    const outputPath = path.join(outputDir, `frame_${i}.webp`);
    
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
      
    console.log(`Processed frame_${i}.webp (from ${files[inputIndex]})`);
  }
  console.log('Done!');
}

processImages().catch(console.error);
