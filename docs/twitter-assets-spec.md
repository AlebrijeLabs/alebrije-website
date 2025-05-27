# Twitter Profile Assets Specification

## Profile Picture (ALBJ Logo)
- Dimensions: 400x400px (Twitter displays as 200x200px)
- Format: PNG with transparency
- Style: 
  - ALBJ logo centered
  - Retro green glow effect (#00ff00)
  - TV static overlay (subtle)
  - Dark background (#000000)
  - Pixelated border effect

## Banner Image
- Dimensions: 1500x500px
- Format: PNG/JPG
- Style:
  - Dark background (#000000)
  - Retro TV static effect overlay
  - Alebrije spirits artwork arranged in a mystical pattern
  - Green phosphor glow effect (#00ff00)
  - Text elements:
    - "Alebrije Token" (Press Start 2P font)
    - "Bringing Ancient Spirits to Web3" (Comic Sans MS)
  - Scan lines effect
  - Subtle pixelation

## Design Elements
1. TV Static Effect:
   - Noise texture
   - Scan lines
   - CRT screen curve
   - Phosphor glow

2. Color Palette:
   - Primary: #00ff00 (Retro Green)
   - Secondary: #808080 (Gray)
   - Background: #000000 (Black)
   - Accent: #ffffff (White)

3. Typography:
   - Headers: 'Press Start 2P'
   - Body: 'Comic Sans MS'
   - Sizes:
     - Banner Title: 48px
     - Banner Subtitle: 24px
     - Profile Text: 16px

## Asset Requirements

### Profile Picture
1. Main Version:
   - 400x400px
   - Transparent background
   - ALBJ logo with glow
   - TV static overlay

2. Thumbnail Version:
   - 200x200px
   - Same design, optimized for small display

### Banner Image
1. Full Version:
   - 1500x500px
   - Dark background
   - Alebrije spirits artwork
   - TV static effect
   - Text elements
   - Scan lines

2. Mobile Version:
   - 1500x500px
   - Same design, but with text elements repositioned for mobile view

## Implementation Notes
1. Profile Picture:
   - Keep the design simple and recognizable at small sizes
   - Ensure the glow effect is visible but not overwhelming
   - Maintain brand consistency with website

2. Banner Image:
   - Important elements should be centered
   - Text should be readable on both desktop and mobile
   - TV static effect should be subtle
   - Include space for Twitter's UI elements

## File Naming Convention
- Profile Picture: `alebrije_twitter_profile_[size].png`
- Banner: `alebrije_twitter_banner_[size].jpg`

## Delivery Format
- Source files: .psd or .ai
- Web-ready: .png (profile), .jpg (banner)
- All files should be optimized for web 