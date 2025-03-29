const fs = require('fs');
const path = require('path');

// Read the logos directory
const logoDir = __dirname;
const files = fs.readdirSync(logoDir);

// Filter for image files
const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'];
const logoFiles = files.filter(file => {
  const ext = path.extname(file).toLowerCase();
  return imageExtensions.includes(ext) && !file.startsWith('.');
});

// Create manifest object
const manifest = {
  logos: logoFiles
};

// Write to manifest.json
fs.writeFileSync(
  path.join(logoDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log(`Updated manifest.json with ${logoFiles.length} logo files`);
