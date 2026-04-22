#!/usr/bin/env node

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, '..', 'public', 'assets', 'images');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function createOGImage() {
  try {
    console.log('Creating Propel Open Graph image...');

    const width = 1200;
    const height = 630;

    // Brand colours
    const colors = {
      background:   '#0F0D11',   // Deep dark background
      purpleDark:   '#7c3aed',   // Primary purple
      purpleMid:    '#9d67f5',   // Mid purple (chevron layer 2)
      purpleLight:  '#c4b5fd',   // Light purple (chevron top / gradient end)
      purpleAccent: '#A78BFA',   // Top bar accent / wordmark highlight
      white:        '#FFFFFF',
      tagline:      'rgba(255,255,255,0.30)',
    };

    // ── Base canvas ───────────────────────────────────────────────────────────
    const base = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 15, g: 13, b: 17, alpha: 1 }, // #0F0D11
      },
    })
      .png()
      .toBuffer();

    // ── SVG overlay ───────────────────────────────────────────────────────────
    // Mirrors the HTML Option A exactly:
    //   • Soft radial purple glow centred behind the mark
    //   • Three-layer chevron mark (opacity 0.28 / 0.60 / 1.0)
    //   • Italic serif wordmark  "Pro[p]el"  — highlight on the second "p"
    //   • ALL-CAPS spaced tagline below
    //   • Thin gradient accent bars top & bottom
    const svgOverlay = Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>

          <!-- Chevron gradient: dark purple → light purple, bottom-left to top-right -->
          <linearGradient id="chevronGrad" x1="0" y1="208" x2="208" y2="0"
                          gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stop-color="${colors.purpleDark}"/>
            <stop offset="100%" stop-color="${colors.purpleLight}"/>
          </linearGradient>

          <!-- Wide outer glow behind the mark -->
          <radialGradient id="glowOuter" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="${colors.purpleAccent}" stop-opacity="0.17"/>
            <stop offset="100%" stop-color="${colors.purpleAccent}" stop-opacity="0"/>
          </radialGradient>

          <!-- Tighter inner glow for the core bloom -->
          <radialGradient id="glowInner" cx="50%" cy="45%" r="50%">
            <stop offset="0%"   stop-color="${colors.purpleDark}" stop-opacity="0.20"/>
            <stop offset="100%" stop-color="${colors.purpleDark}" stop-opacity="0"/>
          </radialGradient>

          <!-- Top bar: transparent → accent purple → transparent -->
          <linearGradient id="barTop" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="${colors.purpleAccent}" stop-opacity="0"/>
            <stop offset="40%"  stop-color="${colors.purpleAccent}" stop-opacity="1"/>
            <stop offset="60%"  stop-color="${colors.purpleAccent}" stop-opacity="1"/>
            <stop offset="100%" stop-color="${colors.purpleAccent}" stop-opacity="0"/>
          </linearGradient>

          <!-- Bottom bar: transparent → dark purple → transparent -->
          <linearGradient id="barBottom" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="${colors.purpleDark}" stop-opacity="0"/>
            <stop offset="40%"  stop-color="${colors.purpleDark}" stop-opacity="1"/>
            <stop offset="60%"  stop-color="${colors.purpleDark}" stop-opacity="1"/>
            <stop offset="100%" stop-color="${colors.purpleDark}" stop-opacity="0"/>
          </linearGradient>

        </defs>

        <!-- ── Accent bars ── -->
        <rect x="0" y="0"           width="${width}" height="3" fill="url(#barTop)"/>
        <rect x="0" y="${height - 3}" width="${width}" height="3" fill="url(#barBottom)"/>

        <!-- ── Radial glows (wide → tight) ── -->
        <ellipse cx="${width / 2}" cy="${height / 2}"
                 rx="${width * 0.28}" ry="${height * 0.40}"
                 fill="url(#glowOuter)"/>
        <ellipse cx="${width / 2}" cy="${height / 2 - 30}"
                 rx="${width * 0.13}" ry="${height * 0.23}"
                 fill="url(#glowInner)"/>

        <!-- ── Three-layer chevron mark (centred at 600, 218) ──
              Each chevron is a flat "V" pointing upward.
              Layer 1 (bottom): opacity 0.28 — darkest purple
              Layer 2 (mid):    opacity 0.60 — mid purple
              Layer 3 (top):    opacity 1.00 — gradient purple  -->

        <!-- Layer 1 – bottom chevron -->
        <path d="M600 260 L496 196 L520 196 L600 242 L680 196 L704 196 Z"
              fill="${colors.purpleDark}" opacity="0.28"/>

        <!-- Layer 2 – middle chevron -->
        <path d="M600 230 L496 166 L520 166 L600 212 L680 166 L704 166 Z"
              fill="${colors.purpleMid}" opacity="0.60"/>

        <!-- Layer 3 – top chevron (gradient) -->
        <path d="M600 200 L496 136 L520 136 L600 182 L680 136 L704 136 Z"
              fill="url(#chevronGrad)"/>

        <!-- ── Wordmark: "Propel" italic serif ──
              Sharp doesn't embed web fonts, so we use a generic serif stack.
              The second "p" is highlighted in accent purple. -->

        <!-- "Pro" in white -->
        <text x="462" y="360"
              font-family="Georgia, 'Times New Roman', serif"
              font-size="72"
              font-weight="700"
              font-style="italic"
              fill="${colors.white}"
              letter-spacing="-2">Pro</text>

        <!-- "p" in accent purple (offset to sit flush after "Pro") -->
        <text x="600" y="360"
              font-family="Georgia, 'Times New Roman', serif"
              font-size="72"
              font-weight="700"
              font-style="italic"
              fill="${colors.purpleAccent}"
              letter-spacing="-2">p</text>

        <!-- "el" in white -->
        <text x="641" y="360"
              font-family="Georgia, 'Times New Roman', serif"
              font-size="72"
              font-weight="700"
              font-style="italic"
              fill="${colors.white}"
              letter-spacing="-2">el</text>

        <!-- ── Tagline ── -->
        <text x="${width / 2}" y="410"
              font-family="'Helvetica Neue', Arial, sans-serif"
              font-size="18"
              font-weight="300"
              fill="${colors.white}"
              fill-opacity="0.30"
              letter-spacing="6"
              text-anchor="middle">PROJECT MANAGEMENT PLATFORM</text>

      </svg>
    `);

    // ── Composite & save ──────────────────────────────────────────────────────
    const outputPath = path.join(outputDir, 'og-image.png');

    const result = await sharp(base)
      .composite([{ input: svgOverlay, top: 0, left: 0 }])
      .png({ quality: 90 })
      .toFile(outputPath);

    console.log('✅ Propel OG image created successfully!');
    console.log(`   Location : ${outputPath}`);
    console.log(`   Size     : ${result.width}x${result.height}px`);
    console.log(`   File size: ${(result.size / 1024).toFixed(2)} KB`);
    console.log('\n📱 Your image is ready for social media sharing!');

  } catch (error) {
    console.error('❌ Error creating OG image:', error.message);
    process.exit(1);
  }
}

createOGImage();