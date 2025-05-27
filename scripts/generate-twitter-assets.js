const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  profilePicture: {
    input: path.join(__dirname, '../public/logo.png'),
    output: {
      main: path.join(__dirname, '../public/twitter/alebrije_twitter_profile_400.png'),
      thumb: path.join(__dirname, '../public/twitter/alebrije_twitter_profile_200.png')
    },
    size: {
      main: 400,
      thumb: 200
    },
    effects: {
      glow: {
        color: '#00ffff', // Light green-blueish
        blur: 15,
        opacity: 0.7
      },
      static: {
        noise: 0.1,
        scanlines: true
      }
    }
  },
  banner: {
    output: {
      main: path.join(__dirname, '../public/twitter/alebrije_twitter_banner_1500x500.jpg'),
      mobile: path.join(__dirname, '../public/twitter/alebrije_twitter_banner_mobile.jpg')
    },
    size: {
      width: 1500,
      height: 500
    },
    effects: {
      static: {
        noise: 0.15,
        scanlines: true,
        crtCurve: true
      },
      glow: {
        color: '#00ffff',
        intensity: 0.3
      }
    }
  }
};

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../public/twitter');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate TV static effect
async function generateStaticEffect(width, height, options = {}) {
  const { noise = 0.1, scanlines = true, crtCurve = false } = options;
  
  // Create noise texture
  const noiseBuffer = Buffer.alloc(width * height * 4);
  for (let i = 0; i < noiseBuffer.length; i += 4) {
    const value = Math.random() * 255 * noise;
    noiseBuffer[i] = value;     // R
    noiseBuffer[i + 1] = value; // G
    noiseBuffer[i + 2] = value; // B
    noiseBuffer[i + 3] = 255;   // A
  }

  // Create base noise image
  const noiseImage = sharp(noiseBuffer, {
    raw: {
      width,
      height,
      channels: 4
    }
  });

  // Create scanlines if requested
  if (scanlines) {
    const scanlineBuffer = Buffer.alloc(2 * 2 * 4);
    scanlineBuffer[0] = 0;     // R
    scanlineBuffer[1] = 0;     // G
    scanlineBuffer[2] = 0;     // B
    scanlineBuffer[3] = 255;   // A (opaque)
    scanlineBuffer[4] = 0;     // R
    scanlineBuffer[5] = 0;     // G
    scanlineBuffer[6] = 0;     // B
    scanlineBuffer[7] = 26;    // A (semi-transparent)
    scanlineBuffer[8] = 0;     // R
    scanlineBuffer[9] = 0;     // G
    scanlineBuffer[10] = 0;    // B
    scanlineBuffer[11] = 26;   // A (semi-transparent)
    scanlineBuffer[12] = 0;    // R
    scanlineBuffer[13] = 0;    // G
    scanlineBuffer[14] = 0;    // B
    scanlineBuffer[15] = 255;  // A (opaque)

    const scanlineImage = sharp(scanlineBuffer, {
      raw: {
        width: 2,
        height: 2,
        channels: 4
      }
    }).resize(width, height, {
      fit: 'fill'
    });

    return noiseImage.composite([{
      input: await scanlineImage.toBuffer(),
      blend: 'overlay'
    }]);
  }

  return noiseImage;
}

// Generate profile picture
async function generateProfilePicture() {
  console.log('Generating profile picture...');

  try {
    // Debug: Log file path and size
    const logoPath = config.profilePicture.input;
    console.log('Logo path:', logoPath);
    try {
      const stats = fs.statSync(logoPath);
      console.log('Logo file size:', stats.size, 'bytes');
    } catch (e) {
      console.error('Could not stat logo file:', e);
    }
    // Debug: Try to read metadata
    try {
      const meta = await sharp(logoPath).metadata();
      console.log('Logo metadata:', meta);
    } catch (e) {
      console.error('Sharp could not read metadata:', e);
    }

    // Create a base image with the logo
    const baseImage = sharp(logoPath)
      .resize(config.profilePicture.size.main, config.profilePicture.size.main, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .ensureAlpha();

    // Generate static effect
    const staticEffect = await generateStaticEffect(
      config.profilePicture.size.main,
      config.profilePicture.size.main,
      config.profilePicture.effects.static
    );

    // Composite the static effect onto the base image
    const finalImage = baseImage.composite([{
      input: await staticEffect.toBuffer(),
      blend: 'overlay'
    }]);

    // Save main version
    await finalImage
      .resize(config.profilePicture.size.main)
      .toFile(config.profilePicture.output.main);

    // Save thumbnail version
    await finalImage
      .resize(config.profilePicture.size.thumb)
      .toFile(config.profilePicture.output.thumb);

    console.log('Profile picture generated successfully!');
  } catch (error) {
    console.error('Error generating profile picture:', error);
    if (error.stack) {
      console.error(error.stack);
    }
    throw error;
  }
}

// Generate banner
async function generateBanner() {
  console.log('Generating banner...');

  try {
    // Create base banner with gradient background
    const baseBanner = await sharp({
      create: {
        width: config.banner.size.width,
        height: config.banner.size.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })
    .linear(1, 0) // Add some contrast
    .toBuffer();

    // Generate static effect
    const staticEffect = await generateStaticEffect(
      config.banner.size.width,
      config.banner.size.height,
      config.banner.effects.static
    );

    // Combine base banner with effects
    const banner = await sharp(baseBanner)
      .composite([{
        input: await staticEffect.toBuffer(),
        blend: 'overlay'
      }])
      .toBuffer();

    // Save main version
    await sharp(banner)
      .toFile(config.banner.output.main);

    // Save mobile version (same dimensions but with adjusted text position)
    await sharp(banner)
      .toFile(config.banner.output.mobile);

    console.log('Banner generated successfully!');
  } catch (error) {
    console.error('Error generating banner:', error);
    throw error;
  }
}

// Run the generation
async function generateAssets() {
  try {
    await generateProfilePicture();
    await generateBanner();
    console.log('All assets generated successfully!');
  } catch (error) {
    console.error('Error generating assets:', error);
    process.exit(1);
  }
}

generateAssets(); 