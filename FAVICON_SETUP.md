# Favicon Setup Guide

Your website currently has placeholder favicon files. To properly display your ZUG logo as the favicon, you need to convert your `zug_logo.svg` to the proper favicon formats.

## Current Status
- ✅ Layout configuration updated to use proper favicon formats
- ✅ Placeholder files created
- ❌ Need to convert SVG to actual favicon formats

## Required Favicon Files

Based on your layout configuration, you need these files in your `public` directory:

1. **favicon.ico** - Main favicon (16x16, 32x32 multi-size)
2. **favicon-16x16.png** - 16x16 PNG version
3. **favicon-32x32.png** - 32x32 PNG version  
4. **apple-touch-icon.png** - 180x180 PNG for iOS devices

## How to Convert Your SVG to Favicons

### Option 1: Online Tools (Recommended for quick setup)

1. **favicon.io** - https://favicon.io/
   - Upload your `zug_logo.svg`
   - Download the generated favicon package
   - Replace the placeholder files in your `public` directory

2. **Convertio** - https://convertio.co/svg-ico/
   - Convert SVG to ICO format
   - Convert SVG to PNG in different sizes

### Option 2: Command Line (if you have ImageMagick)

```bash
# Install ImageMagick first, then run:
magick convert public/zug_logo.svg -resize 16x16 public/favicon-16x16.png
magick convert public/zug_logo.svg -resize 32x32 public/favicon-32x32.png
magick convert public/zug_logo.svg -resize 180x180 public/apple-touch-icon.png
magick convert public/zug_logo.svg -resize 16x16 public/favicon.ico
```

### Option 3: Design Software
- Use Adobe Illustrator, Figma, or similar to export your logo in the required sizes
- Save as PNG files with the exact names specified above

## File Replacement

Once you have the proper favicon files:

1. Replace the placeholder files in your `public` directory
2. Ensure the file names match exactly:
   - `favicon.ico`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png`

## Testing

After replacing the files:

1. Clear your browser cache
2. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
3. Check the browser tab to see your ZUG logo
4. Test on different devices and browsers

## Why This Fixes the Vercel Icon Issue

- **SVG Compatibility**: SVG files don't work well as favicons in all browsers
- **Proper Format**: ICO and PNG formats are universally supported
- **Multiple Sizes**: Different sizes ensure compatibility across devices
- **Clean Configuration**: Removed duplicate favicon declarations that could cause conflicts

## Current Configuration

Your `layout.tsx` is now properly configured with:

```tsx
icons: {
  icon: [
    { url: '/favicon.ico', sizes: 'any' },
    { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
  ],
  shortcut: '/favicon.ico',
  apple: '/apple-touch-icon.png',
},
```

Once you replace the placeholder files with actual favicon images, your ZUG logo will appear in browser tabs instead of the Vercel icon.
