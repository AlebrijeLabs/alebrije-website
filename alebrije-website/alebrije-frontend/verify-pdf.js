import fs from 'fs';
import path from 'path';

const PDF_PATH = path.join('public', 'whitepaper.pdf');
const DIST_PATH = path.join('dist', 'whitepaper.pdf');

console.log('🔍 Verifying whitepaper.pdf...');

try {
  // Check if PDF exists
  if (!fs.existsSync(PDF_PATH)) {
    console.error('❌ Error: whitepaper.pdf not found in public directory');
    process.exit(1);
  }

  // Get PDF stats
  const stats = fs.statSync(PDF_PATH);
  const fileSizeInMB = stats.size / (1024 * 1024);
  
  console.log('📋 PDF details:');
  console.log(`   - Path: ${PDF_PATH}`);
  console.log(`   - Size: ${fileSizeInMB.toFixed(2)} MB`);

  // Check file size
  if (fileSizeInMB > 10) {
    console.warn(`⚠️  Warning: PDF file is large (${fileSizeInMB.toFixed(2)} MB)`);
    console.warn('   This may cause loading issues for some users.');
  }

  // Verify PDF header
  const buffer = Buffer.alloc(5);
  const fd = fs.openSync(PDF_PATH, 'r');
  fs.readSync(fd, buffer, 0, 5, 0);
  fs.closeSync(fd);

  if (buffer.toString() !== '%PDF-') {
    console.error('❌ Error: Invalid PDF file');
    process.exit(1);
  }
  console.log('✅ PDF header check passed');

  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Copy PDF to dist
  fs.copyFileSync(PDF_PATH, DIST_PATH);
  console.log('✅ PDF copied to dist folder');
  console.log('✅ Verification complete!');

} catch (error) {
  console.error('❌ Error during verification:', error.message);
  process.exit(1);
} 