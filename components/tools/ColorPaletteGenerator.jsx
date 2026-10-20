'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Palette,
  Copy,
  Code2,
  ShieldCheck,
  ChevronDown,
  Trash2,
  Sparkles,
} from 'lucide-react';
import '@/styles/ColorPicker.css';
import '@/styles/Colorpalette.css';
import Link from 'next/link';

const SITE = 'https://convertlinx.com';
const PAGE_URL = `${SITE}/color-palette-generator`;
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const SAMPLE_MAX = 200;             // longest side (px) the image is shrunk to before reading pixels
const DEFAULT_COUNT = 6;
const COUNT_OPTIONS = [3, 4, 5, 6, 8];

const linkClass = 'text-purple-600 hover:underline font-medium';
const faqLinkClass = 'text-purple-600 hover:underline';

// ── COLOR + PALETTE UTILITIES (pure functions, no React) ──
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function rgbToHex({ r, g, b }) {
  return (
    '#' +
    [r, g, b]
      .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function getLuminance({ r, g, b }) {
  const toLinear = (c) => {
    const n = c / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

const isLight = (rgb) => getLuminance(rgb) > 0.179;

/* Step 1: group every pixel into a 32 x 32 x 32 histogram (5 bits per channel).
   A photo with a million pixels becomes a few thousand weighted points, so clustering stays instant. */
function buildPoints(data) {
  const size = 1 << 15;
  const counts = new Uint32Array(size);
  const sums = new Float64Array(size * 3);
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 125) continue; // skip transparent pixels
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const idx = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    counts[idx] += 1;
    const o = idx * 3;
    sums[o] += r;
    sums[o + 1] += g;
    sums[o + 2] += b;
  }
  const points = [];
  for (let i = 0; i < size; i++) {
    const n = counts[i];
    if (n) points.push({ r: sums[i * 3] / n, g: sums[i * 3 + 1] / n, b: sums[i * 3 + 2] / n, n });
  }
  return points;
}

const dist2 = (a, b) => (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2;

/* Step 2: k-means on the weighted points. Deterministic start (most common color, then the
   farthest ones), so the same image always gives the same palette. */
function extractPalette(points, k) {
  if (!points.length) return [];
  const total = points.reduce((s, p) => s + p.n, 0);
  const target = Math.min(k, points.length);

  const first = points.reduce((best, p) => (p.n > best.n ? p : best), points[0]);
  const centers = [{ r: first.r, g: first.g, b: first.b }];
  const minD = points.map((p) => dist2(p, first));
  while (centers.length < target) {
    let bestI = -1;
    let bestScore = 0;
    for (let i = 0; i < points.length; i++) {
      const score = minD[i] * Math.sqrt(points[i].n);
      if (score > bestScore) { bestScore = score; bestI = i; }
    }
    if (bestI < 0) break;
    const c = points[bestI];
    centers.push({ r: c.r, g: c.g, b: c.b });
    for (let i = 0; i < points.length; i++) {
      const d = dist2(points[i], c);
      if (d < minD[i]) minD[i] = d;
    }
  }

  const assign = new Int16Array(points.length);
  let acc = [];
  for (let iter = 0; iter < 14; iter++) {
    let moved = false;
    for (let i = 0; i < points.length; i++) {
      let best = 0;
      let bestD = Infinity;
      for (let j = 0; j < centers.length; j++) {
        const d = dist2(points[i], centers[j]);
        if (d < bestD) { bestD = d; best = j; }
      }
      if (assign[i] !== best) { assign[i] = best; moved = true; }
    }
    acc = centers.map(() => ({ r: 0, g: 0, b: 0, n: 0 }));
    for (let i = 0; i < points.length; i++) {
      const a = acc[assign[i]];
      const p = points[i];
      a.r += p.r * p.n;
      a.g += p.g * p.n;
      a.b += p.b * p.n;
      a.n += p.n;
    }
    acc.forEach((a, j) => {
      if (a.n) centers[j] = { r: a.r / a.n, g: a.g / a.n, b: a.b / a.n };
    });
    if (iter > 0 && !moved) break;
  }

  const seen = new Set();
  return centers
    .map((c, j) => {
      const rgb = { r: Math.round(c.r), g: Math.round(c.g), b: Math.round(c.b) };
      return { rgb, hex: rgbToHex(rgb), share: acc[j].n / total };
    })
    .filter((c) => c.share > 0)
    .sort((a, b) => b.share - a.share)
    .filter((c) => (seen.has(c.hex) ? false : (seen.add(c.hex), true)));
}

/* Read the image into a small canvas and turn its pixels into weighted points */
function readPoints(img) {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) throw new Error('empty image');
  const scale = Math.min(1, SAMPLE_MAX / Math.max(w, h));
  const cw = Math.max(1, Math.round(w * scale));
  const ch = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, cw, ch);
  return buildPoints(ctx.getImageData(0, 0, cw, ch).data);
}

const EXPORT_FORMATS = [
  { key: 'css',      label: 'CSS' },
  { key: 'tailwind', label: 'Tailwind' },
  { key: 'scss',     label: 'SCSS' },
  { key: 'json',     label: 'JSON' },
  { key: 'list',     label: 'HEX list' },
];

function buildExport(format, colors) {
  if (!colors.length) return '';
  switch (format) {
    case 'css':
      return `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
    case 'tailwind':
      return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        palette: {\n${colors
        .map((c, i) => `          ${i + 1}: '${c.hex}',`)
        .join('\n')}\n        },\n      },\n    },\n  },\n};`;
    case 'scss':
      return colors.map((c, i) => `$color-${i + 1}: ${c.hex};`).join('\n');
    case 'json':
      return JSON.stringify({ palette: colors.map((c) => c.hex) }, null, 2);
    default:
      return colors.map((c) => c.hex).join(', ');
  }
}

const fmtShare = (share) => {
  const pct = Math.round(share * 100);
  return pct < 1 ? '<1%' : `${pct}%`;
};
// ── END UTILITIES ──

/* ── FAQ data: `a` is what users see (with the contextual links), `aText` is the plain text for schema ── */
const faqs = [
  {
    q: 'How do I get a color palette from an image?',
    a: 'Upload or drag a photo into the box above, or paste one with Ctrl+V. The tool reads the pixels in your browser and shows the main colors as a palette with a HEX code for each one. Click any swatch to copy its code.',
    aText:
      'Upload or drag a photo into the box above, or paste one with Ctrl+V. The tool reads the pixels in your browser and shows the main colors as a palette with a HEX code for each one. Click any swatch to copy its code.',
  },
  {
    q: 'How does the tool find the dominant colors?',
    a: 'It shrinks your image, groups similar pixels together, and then uses k-means clustering to find the colors that best represent each group. Colors that cover more of the image come first. The same image always gives the same palette.',
    aText:
      'It shrinks your image, groups similar pixels together, and then uses k-means clustering to find the colors that best represent each group. Colors that cover more of the image come first. The same image always gives the same palette.',
  },
  {
    q: 'How do I get the exact HEX code of one spot in my image?',
    a: (
      <span>
        A palette shows the main colors of the whole image, not one pixel. To read the exact color of a single spot, open the image on your screen and use the Pick from screen button in our{' '}
        <Link href="/color-picker" className={faqLinkClass}>Color Picker</Link>{' '}
        (Chrome and Edge). It also gives you RGB, HSL, HSB and CMYK values.
      </span>
    ),
    aText:
      'A palette shows the main colors of the whole image, not one pixel. To read the exact color of a single spot, open the image on your screen and use the Pick from screen button in our Color Picker (Chrome and Edge). It also gives you RGB, HSL, HSB and CMYK values.',
  },
  {
    q: 'How many colors can I extract?',
    a: 'Choose 3, 4, 5, 6 or 8 colors. Use 3 to 5 for a simple brand-style palette and 6 to 8 for photos with many different tones. Changing the number updates the palette instantly without uploading the image again.',
    aText:
      'Choose 3, 4, 5, 6 or 8 colors. Use 3 to 5 for a simple brand-style palette and 6 to 8 for photos with many different tones. Changing the number updates the palette instantly without uploading the image again.',
  },
  {
    q: 'Which image formats work?',
    a: (
      <span>
        JPG, PNG, WebP, GIF and AVIF work in modern browsers. HEIC photos from an iPhone are not supported by most browsers, so convert them first with our{' '}
        <Link href="/heic-to-jpg" className={faqLinkClass}>HEIC to JPG converter</Link>{' '}
        and then upload the JPG.
      </span>
    ),
    aText:
      'JPG, PNG, WebP, GIF and AVIF work in modern browsers. HEIC photos from an iPhone are not supported by most browsers, so convert them first with our HEIC to JPG converter and then upload the JPG.',
  },
  {
    q: 'Why does the palette miss a small color in my image?',
    a: (
      <span>
        The palette is based on how much of the image each color covers, so a tiny logo or accent can be averaged into a bigger color. Crop the image to that area with our{' '}
        <Link href="/image-cropper" className={faqLinkClass}>Image Cropper</Link>{' '}
        and upload the cropped version, or raise the number of colors.
      </span>
    ),
    aText:
      'The palette is based on how much of the image each color covers, so a tiny logo or accent can be averaged into a bigger color. Crop the image to that area with our Image Cropper and upload the cropped version, or raise the number of colors.',
  },
  {
    q: 'Can I use the palette in CSS, Tailwind or SCSS?',
    a: (
      <span>
        Yes. Under the palette, choose CSS variables, a Tailwind config, SCSS variables, JSON or a plain HEX list and copy it in one click. If you want to clean up or check the JSON before using it, paste it into our{' '}
        <Link href="/json-formatter" className={faqLinkClass}>JSON Formatter</Link>.
      </span>
    ),
    aText:
      'Yes. Under the palette, choose CSS variables, a Tailwind config, SCSS variables, JSON or a plain HEX list and copy it in one click. If you want to clean up or check the JSON before using it, paste it into our JSON Formatter.',
  },
  {
    q: 'Is my image uploaded to a server?',
    a: 'No. The image is opened and read inside your browser, and nothing is sent to any server or stored. When you close or refresh the page, it is gone.',
    aText:
      'No. The image is opened and read inside your browser, and nothing is sent to any server or stored. When you close or refresh the page, it is gone.',
  },
  {
    q: 'Can I check if the palette colors are readable together?',
    a: (
      <span>
        Yes. Copy any HEX code from the palette and enter it in our{' '}
        <Link href="/color-picker" className={faqLinkClass}>Color Picker</Link>{' '}
        to see its WCAG contrast ratio against white and black, plus a full 50 to 900 shade scale.
      </span>
    ),
    aText:
      'Yes. Copy any HEX code from the palette and enter it in our Color Picker to see its WCAG contrast ratio against white and black, plus a full 50 to 900 shade scale.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes. Tap the upload box to choose a photo from your gallery or take a new one with your camera. The palette and export tools are fully responsive.',
    aText:
      'Yes. Tap the upload box to choose a photo from your gallery or take a new one with your camera. The palette and export tools are fully responsive.',
  },
];

const relatedTools = [
  { name: 'Color Picker',     href: '/color-picker'     },
  { name: 'Image Cropper',    href: '/image-cropper'    },
  { name: 'Image Resizer',    href: '/image-resizer'    },
  { name: 'Image Compressor', href: '/image-compressor' },
  { name: 'JSON Formatter',   href: '/json-formatter'   },
];

/* ── Structured data (plain <script> so it is in the server-rendered HTML) ── */
const JsonLd = ({ data }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Get a Color Palette and HEX Codes from an Image for Free',
  description: 'Upload any image and extract its dominant colors as a palette with HEX codes, then copy them as CSS, Tailwind, SCSS or JSON.',
  url: PAGE_URL,
  totalTime: 'PT10S',
  estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
  supply: [{ '@type': 'HowToSupply', name: 'An image (JPG, PNG, WebP, GIF or AVIF)' }],
  tool: [{ '@type': 'HowToTool', name: 'Color Palette Generator' }],
  step: [
    { '@type': 'HowToStep', name: 'Add your image', text: 'Click the upload box, drag an image into it, or paste one with Ctrl+V.' },
    { '@type': 'HowToStep', name: 'Choose how many colors', text: 'Pick 3, 4, 5, 6 or 8 colors. The palette updates instantly.' },
    { '@type': 'HowToStep', name: 'Copy your colors', text: 'Click a swatch to copy its HEX code, or copy the whole palette as CSS variables, a Tailwind config, SCSS or JSON.' },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: 'Color Palette Generator', item: PAGE_URL },
  ],
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ConvertLinx Color Palette Generator',
  url: PAGE_URL,
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.aText },
  })),
};

/* Copy helper with a fallback for browsers or contexts where the Clipboard API is blocked */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

const activeBtn = { background: '#7C3AED', color: '#ffffff', borderColor: '#7C3AED' };

export default function ColorPaletteGenerator() {
  const [image, setImage]           = useState(null);   // { url, name, width, height }
  const [points, setPoints]         = useState(null);   // weighted pixel points read from the image
  const [count, setCount]           = useState(DEFAULT_COUNT);
  const [sort, setSort]             = useState('dominant'); // dominant | light
  const [exportFormat, setExportFormat] = useState('css');
  const [error, setError]           = useState('');
  const [dragging, setDragging]     = useState(false);
  const [copiedKey, setCopiedKey]   = useState('');
  const inputRef  = useRef(null);
  const urlRef    = useRef(null);
  const copyTimer = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(copyTimer.current);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const loadFile = useCallback((file) => {
    if (!file) return;
    setError('');
    if (!file.type || !file.type.startsWith('image/')) {
      setError('That file is not an image. Choose a JPG, PNG, WebP, GIF or AVIF file.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('This image is larger than 25 MB. Choose a smaller one or compress it first.');
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const pts = readPoints(img);
        if (!pts.length) {
          URL.revokeObjectURL(url);
          setError('This image has no visible pixels. Try a different one.');
          return;
        }
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = url;
        setImage({ url, name: file.name || 'pasted-image', width: img.naturalWidth, height: img.naturalHeight });
        setPoints(pts);
      } catch {
        URL.revokeObjectURL(url);
        setError('Could not read this image. Try a different file.');
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError('Your browser cannot open this image. HEIC photos must be converted to JPG first.');
    };
    img.src = url;
  }, []);

  // Paste an image straight from the clipboard (Ctrl+V / Cmd+V)
  useEffect(() => {
    const onPaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            loadFile(file);
          }
          return;
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [loadFile]);

  const loadSample = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    const sky = ctx.createLinearGradient(0, 0, 0, 320);
    sky.addColorStop(0, '#1E1B4B');
    sky.addColorStop(0.35, '#7C3AED');
    sky.addColorStop(0.62, '#EC4899');
    sky.addColorStop(0.82, '#F97316');
    sky.addColorStop(1, '#FDE68A');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 480, 320);
    ctx.fillStyle = '#FEF3C7';
    ctx.beginPath();
    ctx.arc(340, 150, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(0, 320);
    ctx.lineTo(0, 250);
    ctx.quadraticCurveTo(120, 190, 240, 250);
    ctx.quadraticCurveTo(360, 200, 480, 255);
    ctx.lineTo(480, 320);
    ctx.closePath();
    ctx.fill();
    canvas.toBlob((blob) => {
      if (blob) loadFile(new File([blob], 'sample-sunset.png', { type: 'image/png' }));
    }, 'image/png');
  };

  const clearImage = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setImage(null);
    setPoints(null);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const handleInput = (e) => {
    loadFile(e.target.files?.[0]);
    e.target.value = ''; // lets the user pick the same file again
  };

  const openPicker = () => inputRef.current?.click();

  // ── derived values ──
  const palette = useMemo(() => (points ? extractPalette(points, count) : []), [points, count]);
  const shown = useMemo(
    () => (sort === 'light' ? [...palette].sort((a, b) => getLuminance(b.rgb) - getLuminance(a.rgb)) : palette),
    [palette, sort]
  );
  const exportText = useMemo(() => buildExport(exportFormat, shown), [exportFormat, shown]);

  const copyValue = async (key, value) => {
    const ok = await copyText(value);
    if (!ok) return;
    setCopiedKey(key);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopiedKey(''), 2000);
  };

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <main className="cp-page">

        {/* ── HERO ── */}
        <section className="cp-hero">
          <div className="cp-blob-1" />
          <div className="cp-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <Link href="/" className="cp-breadcrumb-link">Home</Link>
              <span className="cp-breadcrumb-sep">/</span>
              <span className="cp-breadcrumb-current">Color Palette Generator</span>
            </div>
            <span className="cp-badge">Color Tool</span>
            <h1 className="cp-hero-title">
              Free <span className="cp-grad-text">Color Palette Generator</span> from Image: Extract HEX Codes
            </h1>
            <p className="cp-hero-sub">
              Upload any photo and get its main colors as a palette with HEX and RGB codes. Choose how many colors you want,
              then copy them as CSS variables, a Tailwind config, SCSS or JSON.
              No signup, and your image never leaves your browser.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="cp-section-main py-10 px-6">
          <div className="max-w-3xl mx-auto cp-fade-up">

            <div className="cp-tool-card">

              {/* ── UPLOAD / PREVIEW ── */}
              <div className="pg-upload">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="pg-file-input"
                  onChange={handleInput}
                  aria-label="Choose an image to extract colors from"
                />

                {!image ? (
                  <div
                    className={`pg-dropzone ${dragging ? 'dragging' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload an image"
                    onClick={openPicker}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openPicker();
                      }
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                  >
                    <div className="pg-drop-icon"><Upload className="w-6 h-6" /></div>
                    <p className="pg-drop-title">Drop an image here, or click to upload</p>
                    <p className="pg-drop-sub">JPG, PNG, WebP, GIF or AVIF, up to 25 MB. You can also paste with Ctrl+V.</p>
                    <button
                      type="button"
                      className="cp-copy-btn"
                      style={{ marginTop: 6 }}
                      onClick={(e) => { e.stopPropagation(); loadSample(); }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Try a sample image
                    </button>
                  </div>
                ) : (
                  <div className="pg-preview">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt="Your uploaded image" className="pg-preview-img" />
                    <div className="pg-preview-meta">
                      <span className="pg-file-name" title={image.name}>{image.name}</span>
                      <span className="cp-hex-hint" style={{ margin: 0 }}>{image.width} x {image.height} px</span>
                    </div>
                    <div className="pg-actions">
                      <button type="button" className="cp-copy-btn" onClick={openPicker}>
                        <ImageIcon className="w-3.5 h-3.5" />
                        Change image
                      </button>
                      <button type="button" className="cp-copy-btn" onClick={clearImage}>
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {error && <p className="cp-error-msg" role="alert" style={{ marginTop: 12, textAlign: 'center' }}>{error}</p>}
              </div>

              {/* ── PALETTE RESULT ── */}
              {image && shown.length > 0 && (
                <>
                  {/* options */}
                  <div className="cp-sliders-section">
                    <div className="pg-options">
                      <div className="pg-option-group" role="group" aria-label="Number of colors">
                        <span className="cp-control-label">Colors</span>
                        {COUNT_OPTIONS.map((n) => (
                          <button
                            key={n}
                            type="button"
                            className="cp-copy-btn"
                            aria-pressed={count === n}
                            onClick={() => setCount(n)}
                            style={count === n ? activeBtn : undefined}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <div className="pg-option-group" role="group" aria-label="Sort order">
                        <span className="cp-control-label">Order</span>
                        <button
                          type="button"
                          className="cp-copy-btn"
                          aria-pressed={sort === 'dominant'}
                          onClick={() => setSort('dominant')}
                          style={sort === 'dominant' ? activeBtn : undefined}
                        >
                          Most used
                        </button>
                        <button
                          type="button"
                          className="cp-copy-btn"
                          aria-pressed={sort === 'light'}
                          onClick={() => setSort('light')}
                          style={sort === 'light' ? activeBtn : undefined}
                        >
                          Light to dark
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* swatch strip */}
                  <div className="cp-shades-section">
                    <span className="cp-control-label mb-3 block">Your Palette</span>
                    <div className="pg-strip">
                      {shown.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          className="pg-swatch"
                          style={{ background: c.hex, color: isLight(c.rgb) ? '#1C1917' : '#ffffff' }}
                          onClick={() => copyValue(`sw-${c.hex}`, c.hex)}
                          title={`Copy ${c.hex}`}
                          aria-label={`Copy ${c.hex}`}
                        >
                          <span>{copiedKey === `sw-${c.hex}` ? 'Copied!' : c.hex}</span>
                        </button>
                      ))}
                    </div>
                    <p className="cp-hex-hint">Click any swatch to copy its HEX code.</p>
                  </div>

                  {/* color list */}
                  <div className="cp-formats-section">
                    <span className="cp-control-label mb-3 block">Color Codes</span>
                    <div className="cp-formats-grid">
                      {shown.map((c, i) => (
                        <div key={c.hex} className="cp-format-row">
                          <span className="cp-format-label">{String(i + 1).padStart(2, '0')}</span>
                          <span className="cp-format-value">
                            {c.hex} / rgb({c.rgb.r}, {c.rgb.g}, {c.rgb.b}) / {fmtShare(c.share)}
                          </span>
                          <button
                            type="button"
                            className={`cp-copy-btn ${copiedKey === `row-${c.hex}` ? 'copied' : ''}`}
                            onClick={() => copyValue(`row-${c.hex}`, c.hex)}
                            title={`Copy ${c.hex}`}
                            aria-label={`Copy ${c.hex}`}
                          >
                            <Copy className="w-3.5 h-3.5" />
                            {copiedKey === `row-${c.hex}` ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="cp-hex-hint">The percentage shows how much of the image is close to that color.</p>
                  </div>

                  {/* export */}
                  <div className="cp-presets-section">
                    <div className="pg-export-head">
                      <span className="cp-control-label">Export Palette</span>
                      <div className="pg-option-group" role="group" aria-label="Export format">
                        {EXPORT_FORMATS.map((f) => (
                          <button
                            key={f.key}
                            type="button"
                            className="cp-copy-btn"
                            aria-pressed={exportFormat === f.key}
                            onClick={() => setExportFormat(f.key)}
                            style={exportFormat === f.key ? activeBtn : undefined}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <pre className="pg-code" tabIndex={0}><code>{exportText}</code></pre>
                    <button
                      type="button"
                      className={`cp-copy-btn ${copiedKey === 'export' ? 'copied' : ''}`}
                      style={{ marginTop: 10 }}
                      onClick={() => copyValue('export', exportText)}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedKey === 'export' ? 'Copied!' : 'Copy code'}
                    </button>
                  </div>
                </>
              )}

              <div className="cp-trust-strip">
                {['No sign-up', 'Instant results', 'Runs in your browser', 'Image never uploaded', '100% free'].map((t, i) => (
                  <span key={i} className="cp-trust-item">
                    <span className="cp-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="cp-divider" />
        <section className="cp-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="cp-section-title text-center mb-12">3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Add Your Image',        desc: 'Click the upload box, drag a photo into it, or paste one with Ctrl+V. No image handy? Try the sample to see how it works.' },
                { num: '2', title: 'Choose How Many Colors', desc: 'Pick 3, 4, 5, 6 or 8 colors. The palette updates instantly, and you can sort it by most used or from light to dark.' },
                { num: '3', title: 'Copy & Use',             desc: 'Click a swatch to copy its HEX code, or export the whole palette as CSS variables, a Tailwind config, SCSS or JSON.' },
              ].map((s, i) => (
                <div key={i} className="cp-step-card">
                  <div className="cp-step-num">{s.num}</div>
                  <h3 className="cp-card-title font-bold text-base mb-2">{s.title}</h3>
                  <p className="cp-card-desc text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="cp-divider" />
        <section className="cp-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="cp-section-title text-center mb-10">Why Use Our Color Palette Generator?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Palette className="w-6 h-6" />,
                  color: '#7C3AED',
                  bg: 'rgba(124,58,237,0.08)',
                  title: 'True Dominant Colors',
                  desc: 'Colors are grouped with k-means clustering, so you get the tones that really make up your image, not random pixels.',
                },
                {
                  icon: <Code2 className="w-6 h-6" />,
                  color: '#D97706',
                  bg: 'rgba(217,119,6,0.08)',
                  title: 'Ready-to-Paste Code',
                  desc: 'Export your palette as CSS variables, a Tailwind config, SCSS variables, JSON or a plain HEX list in one click.',
                },
                {
                  icon: <ShieldCheck className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'Private by Design',
                  desc: 'Your image is read inside your browser. Nothing is uploaded, nothing is stored, and there is no signup.',
                },
              ].map((b, i) => (
                <div key={i} className="cp-benefit-card">
                  <div className="cp-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="cp-card-title font-bold text-base mb-2">{b.title}</h3>
                  <p className="cp-card-desc text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT WITH CONTEXTUAL INTERLINKING ── */}
        <hr className="cp-divider" />
        <section className="cp-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8">

            <div>
              <h2 className="cp-section-title text-2xl mb-4">How to Extract Colors from an Image</h2>
              <p className="cp-body-text leading-7 text-sm">
                A color palette from an image is a short list of the colors that appear most in a photo, such as
                <code className="cp-code">#7C3AED</code>, <code className="cp-code">#EC4899</code> and
                <code className="cp-code">#F97316</code>. Designers use it to build a brand style from a logo, match a website
                to a hero photo, or pick colors for a presentation. Upload your image above and the tool finds the main colors for you.
              </p>
              <p className="cp-body-text leading-7 text-sm mt-3">
                If the colors will go on a website, copy them as CSS variables or a Tailwind config. If you need to check whether
                a color is readable on white or black, paste its HEX code into our <Link href="/color-picker" className={linkClass}>Color Picker</Link>,
                which shows the WCAG contrast ratio and a full shade scale. For a large photo, you can first cut out the part you care about
                with our <Link href="/image-cropper" className={linkClass}>Image Cropper</Link>, or make the file smaller with the <Link href="/image-compressor" className={linkClass}>Image Compressor</Link>.
              </p>
            </div>

            <div className="cp-seo-box">
              <h3 className="cp-section-subtitle font-bold text-lg mb-4">Palette Generator vs Color Picker: Which One Do You Need?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  ['Palette generator', 'Reads the whole image and gives you its main colors. Best when you want a set of colors that work together.'],
                  ['Color picker', 'Gives the exact value of one color in many formats (HEX, RGB, HSL, HSB, CMYK). Best when you already know which color you want.'],
                  ['Use both together', 'Generate a palette here, then open a color in the Color Picker to check contrast and build shades.'],
                  ['Exports', 'Palette codes copy as CSS, Tailwind, SCSS or JSON. Use the JSON Formatter if you want to tidy the output.'],
                ].map(([name, text], i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="cp-arrow font-bold mt-0.5">→</span>
                    <span className="cp-body-text">
                      <strong>{name}:</strong> {text}
                    </span>
                  </div>
                ))}
              </div>
              <p className="cp-body-text leading-7 text-sm mt-4">
                Need one exact color instead? Open the <Link href="/color-picker" className={linkClass}>Color Picker</Link>. Want to tidy the exported JSON? Use the <Link href="/json-formatter" className={linkClass}>JSON Formatter</Link>.
              </p>
            </div>

            <div className="cp-seo-box">
              <h3 className="cp-section-subtitle font-bold text-lg mb-4">Common Use Cases</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Build a brand color palette from a logo or product photo',
                  'Match website colors to a hero image',
                  'Get HEX codes from a mood board or inspiration photo',
                  'Create a color scheme for slides or social posts',
                  'Pick interior or fashion colors from a photograph',
                  'Turn a painting or screenshot into CSS variables',
                  'Create a Tailwind color set from any image',
                  'Find colors for illustrations, banners and thumbnails',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="cp-feature-dot" />
                    <span className="cp-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="cp-section-subtitle font-bold text-lg mb-4">Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Web developers: copy palettes as CSS or Tailwind',
                  'UI/UX designers: start a design from a reference photo',
                  'Brand designers: pull brand colors from a logo',
                  'Photographers: see the color story of a shot',
                  'Students and teachers: color schemes for projects',
                  'Social media creators: match posts to a photo',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="cp-arrow font-bold mt-0.5">→</span>
                    <span className="cp-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cp-seo-box">
              <h3 className="cp-section-subtitle font-bold text-lg mb-4">Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Upload, drag and drop, or paste an image',
                  '3, 4, 5, 6 or 8 colors from one upload',
                  'HEX, RGB and usage percentage for every color',
                  'Sort by most used or light to dark',
                  'One-click copy for each swatch',
                  'Export as CSS, Tailwind, SCSS, JSON or HEX list',
                  'Same result every time for the same image',
                  'Works on mobile, tablet and desktop',
                  'Image processed in your browser only',
                  'Nothing stored, full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="cp-feature-dot" />
                    <span className="cp-body-text">{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ WITH CONTEXTUAL INTERLINKING ── */}
        <hr className="cp-divider" />
        <section className="cp-section-main py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="cp-section-title text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="cp-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="cp-faq-question font-semibold text-sm">{faq.q}</span>
                    <ChevronDown className="cp-faq-icon w-4 h-4 shrink-0" />
                  </summary>
                  <p className="cp-faq-answer mt-3 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="cp-divider" />
        <section className="cp-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="cp-section-title text-center mb-5">You may also find these free tools helpful</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedTools.map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border cp-related-link"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="cp-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to get your palette?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes a few seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cp-cta-btn"
            >
              <Upload className="w-5 h-5" />
              Upload an Image
            </button>
          </div>
        </section>

      </main>
    </>
  );
}