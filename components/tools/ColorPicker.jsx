'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pipette, Copy, RefreshCw, Palette, ChevronDown } from 'lucide-react';
import '@/styles/ColorPicker.css';
import Link from 'next/link';

const SITE = 'https://convertlinx.com';
const PAGE_URL = `${SITE}/color-picker`;
const DEFAULT_HEX = '#7C3AED';

const linkClass = 'text-purple-600 hover:underline font-medium';
const faqLinkClass = 'text-purple-600 hover:underline';

// ── CONVERSION UTILITIES (pure functions, no React) ──
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function parseHex(input) {
  const clean = String(input).trim().replace(/^#/, '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(clean)) return null;
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  return (
    '#' +
    [r, g, b]
      .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

/* HSB and HSV are the same model. State is kept as HSV floats (h: 0-360, s/v: 0-1) so dragging
   a slider never loses hue or saturation to rounding. */
function hsvToRgb(h, s, v) {
  const c = v * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if (hp < 1)      { r1 = c; g1 = x; }
  else if (hp < 2) { r1 = x; g1 = c; }
  else if (hp < 3) { g1 = c; b1 = x; }
  else if (hp < 4) { g1 = x; b1 = c; }
  else if (hp < 5) { r1 = x; b1 = c; }
  else             { r1 = c; b1 = x; }
  const m = v - c;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function rgbToHsv({ r, g, b }, prevHue = 0) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = prevHue; // greys have no hue: keep the previous one so sliders do not jump
  if (d !== 0) {
    if (max === rn)      h = 60 * (((gn - bn) / d) % 6);
    else if (max === gn) h = 60 * ((bn - rn) / d + 2);
    else                 h = 60 * ((rn - gn) / d + 4);
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

function hsvToHsl({ h, s, v }) {
  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return { h, s: clamp(sl, 0, 1), l };
}

function hslToHsv({ h, s, l }) {
  const v = l + s * Math.min(l, 1 - l);
  const sv = v === 0 ? 0 : 2 * (1 - l / v);
  return { h, s: clamp(sv, 0, 1), v: clamp(v, 0, 1) };
}

function rgbToCmyk({ r, g, b }) {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  return {
    c: Math.round(((1 - rn - k) / (1 - k)) * 100),
    m: Math.round(((1 - gn - k) / (1 - k)) * 100),
    y: Math.round(((1 - bn - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function getLuminance({ r, g, b }) {
  const toLinear = (c) => {
    const n = c / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrast(rgb) {
  const lum = getLuminance(rgb);
  return { white: 1.05 / (lum + 0.05), black: (lum + 0.05) / 0.05 };
}

// Floor (not round) so a ratio like 4.497 never shows as 4.50 next to a "Fail" badge
const fmtRatio = (n) => (Math.floor(n * 100) / 100).toFixed(2);

function wcagLevel(ratio) {
  if (ratio >= 7)   return { cls: 'pass',     label: 'AAA Pass' };
  if (ratio >= 4.5) return { cls: 'pass',     label: 'AA Pass' };
  if (ratio >= 3)   return { cls: 'aa-large', label: 'AA Large' };
  return { cls: 'fail', label: 'Fail' };
}

const isLight = (rgb) => getLuminance(rgb) > 0.179;

/* Tailwind-style 50-900 names. Values are calculated from the picked color:
   lighter steps blend toward near-white, darker steps toward black (always in order). */
const SHADE_STEPS = [
  ['50', 0.92], ['100', 0.84], ['200', 0.68], ['300', 0.5], ['400', 0.25],
  ['500', 0],
  ['600', -0.18], ['700', -0.36], ['800', -0.54], ['900', -0.72],
];

function generateShades(hsv, baseHex) {
  const { h, s, l } = hsvToHsl(hsv);
  const top = Math.max(l, 0.97);
  return SHADE_STEPS.map(([label, t]) => {
    if (t === 0) return { label, hex: baseHex };
    const nl = t > 0 ? l + (top - l) * t : l * (1 + t);
    const v = hslToHsv({ h, s, l: nl });
    return { label, hex: rgbToHex(hsvToRgb(v.h, v.s, v.v)) };
  });
}
// ── END UTILITIES ──

const PRESET_COLORS = [
  '#EF4444','#F97316','#EAB308','#22C55E','#14B8A6',
  '#3B82F6','#8B5CF6','#EC4899','#06B6D4','#84CC16',
  '#F43F5E','#6366F1','#10B981','#F59E0B','#0EA5E9',
];

const HUE_TRACK = 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)';

/* ── FAQ data: `a` is what users see (with the contextual links), `aText` is the plain text for schema ── */
const faqs = [
  {
    q: 'What is a HEX color code?',
    a: (
      <span>
        A HEX color code is a 6-digit hexadecimal value prefixed with # that represents a color in the RGB color model. Each pair of digits represents the intensity of the Red, Green, and Blue channels. If you need to standardize casing in CSS or code configs, try our{' '}
        <Link href="/case-converter" className={faqLinkClass}>Case Converter</Link>.
      </span>
    ),
    aText:
      'A HEX color code is a 6-digit hexadecimal value prefixed with # that represents a color in the RGB color model. Each pair of digits represents the intensity of the Red, Green, and Blue channels. If you need to standardize casing in CSS or code configs, try our Case Converter.',
  },
  {
    q: 'How do I find the HEX code of a color?',
    a: 'Pick the color with the swatch, the sliders, or the Pick from screen button (Chrome and Edge). The HEX code appears in the HEX field and in the first row of All Color Formats, ready to copy.',
    aText:
      'Pick the color with the swatch, the sliders, or the Pick from screen button (Chrome and Edge). The HEX code appears in the HEX field and in the first row of All Color Formats, ready to copy.',
  },
  {
    q: 'How do I convert HEX to RGB?',
    a: 'Split the 6-digit HEX into three pairs, then convert each pair from base-16 to base-10. For example, #FF8800 becomes R=255, G=136, B=0. Our tool does this instantly without requiring manual code formatting or data parsing.',
    aText:
      'Split the 6-digit HEX into three pairs, then convert each pair from base-16 to base-10. For example, #FF8800 becomes R=255, G=136, B=0. Our tool does this instantly without requiring manual code formatting or data parsing.',
  },
  {
    q: 'What is HSB (HSV), and how is it different from HSL?',
    a: (
      <span>
        HSB (Hue, Saturation, Brightness) is the same model as HSV (Hue, Saturation, Value), and it is the model behind the color pickers in Photoshop and Figma. HSL (Hue, Saturation, Lightness) is the model CSS supports through the hsl() function. In HSB, 100% brightness gives the purest version of a hue; in HSL, 50% lightness does, and 100% lightness is white. HSL is widely used in CSS alongside mock copy from our{' '}
        <Link href="/lorem-ipsum" className={faqLinkClass}>Lorem Ipsum Generator</Link>.
      </span>
    ),
    aText:
      'HSB (Hue, Saturation, Brightness) is the same model as HSV (Hue, Saturation, Value), and it is the model behind the color pickers in Photoshop and Figma. HSL (Hue, Saturation, Lightness) is the model CSS supports through the hsl() function. In HSB, 100% brightness gives the purest version of a hue; in HSL, 50% lightness does, and 100% lightness is white. HSL is widely used in CSS alongside mock copy from our Lorem Ipsum Generator.',
  },
  {
    q: 'What is CMYK and when is it used?',
    a: 'CMYK (Cyan, Magenta, Yellow, Key/Black) is the color model used in color printing. Unlike RGB which adds light, CMYK subtracts light on a white medium. Use CMYK values when preparing physical media layouts. The CMYK shown here is a simple conversion from RGB, so a print shop may adjust it using a color profile.',
    aText:
      'CMYK (Cyan, Magenta, Yellow, Key/Black) is the color model used in color printing. Unlike RGB which adds light, CMYK subtracts light on a white medium. Use CMYK values when preparing physical media layouts. The CMYK shown here is a simple conversion from RGB, so a print shop may adjust it using a color profile.',
  },
  {
    q: 'What is contrast ratio and why does it matter?',
    a: (
      <span>
        Contrast ratio measures how distinguishable text is against its background. WCAG guidelines require at least 4.5:1 for normal text and 3:1 for large text. You can measure word density and text sizing using our{' '}
        <Link href="/word-counter" className={faqLinkClass}>Word Counter</Link>.
      </span>
    ),
    aText:
      'Contrast ratio measures how distinguishable text is against its background. WCAG guidelines require at least 4.5:1 for normal text and 3:1 for large text. You can measure word density and text sizing using our Word Counter.',
  },
  {
    q: 'Can I pick a color from my screen?',
    a: 'Yes, in browsers that support the EyeDropper API, mainly Chrome and Edge. A Pick from screen button appears next to the HEX field. Click it, then click any pixel on your screen. In other browsers, use the swatch, the HEX field, or the sliders.',
    aText:
      'Yes, in browsers that support the EyeDropper API, mainly Chrome and Edge. A Pick from screen button appears next to the HEX field. Click it, then click any pixel on your screen. In other browsers, use the swatch, the HEX field, or the sliders.',
  },
  {
    q: 'Can I use the color picker on mobile?',
    a: (
      <span>
        Yes. The tool is fully responsive and works on mobile devices. Tap the color swatch to open your native device color picker, or paste string values clean using our{' '}
        <Link href="/case-converter" className={faqLinkClass}>Case Converter</Link>.
      </span>
    ),
    aText:
      'Yes. The tool is fully responsive and works on mobile devices. Tap the color swatch to open your native device color picker, or paste string values clean using our Case Converter.',
  },
  {
    q: 'What are color shades and tints?',
    a: 'Shades are darker variations of a color (mixed with black) and tints are lighter variations (mixed with white). The palette uses Tailwind-style names (50 to 900) and is calculated from the color you picked, so it will not match the official Tailwind palette exactly.',
    aText:
      'Shades are darker variations of a color (mixed with black) and tints are lighter variations (mixed with white). The palette uses Tailwind-style names (50 to 900) and is calculated from the color you picked, so it will not match the official Tailwind palette exactly.',
  },
  {
    q: 'Is my color data stored anywhere?',
    a: (
      <span>
        No. Everything runs 100% in your browser, and no color data is sent to any server. If you work with web configuration files, you can also format your payloads securely using our browser-based{' '}
        <Link href="/json-formatter" className={faqLinkClass}>JSON Formatter</Link>{' '}
        or encode assets via{' '}
        <Link href="/base64-tool" className={faqLinkClass}>Base64 Encoder</Link>.
      </span>
    ),
    aText:
      'No. Everything runs 100% in your browser, and no color data is sent to any server. If you work with web configuration files, you can also format your payloads securely using our browser-based JSON Formatter or encode assets via Base64 Encoder.',
  },
];

const relatedTools = [
  { name: 'Lorem Ipsum Generator', href: '/lorem-ipsum'    },
  { name: 'Word Counter',          href: '/word-counter'   },
  { name: 'Case Converter',        href: '/case-converter' },
  { name: 'JSON Formatter',        href: '/json-formatter' },
  { name: 'Base64 Encoder',        href: '/base64-tool'    },
];

/* ── Structured data (plain <script> so it is in the server-rendered HTML) ── */
const JsonLd = ({ data }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Find HEX, RGB, HSB and HSL Color Codes Online for Free',
  description: 'Pick a color and instantly get its HEX, RGB, HSL, HSB (HSV), and CMYK codes with the free Color Picker tool.',
  url: PAGE_URL,
  totalTime: 'PT5S',
  estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
  supply: [{ '@type': 'HowToSupply', name: 'A color, or a HEX or RGB value' }],
  tool: [{ '@type': 'HowToTool', name: 'Color Picker' }],
  step: [
    { '@type': 'HowToStep', name: 'Pick or enter a color', text: 'Click the swatch, type a HEX code, drag the RGB, HSB or HSL sliders, or pick a color from your screen in Chrome or Edge.' },
    { '@type': 'HowToStep', name: 'View all formats', text: 'Instantly see HEX, RGB, HSL, HSB (HSV), and CMYK values. Editing any value updates the rest.' },
    { '@type': 'HowToStep', name: 'Copy and use', text: 'Click Copy next to any format and paste it into your CSS, Figma, or design tool.' },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: 'Color Picker', item: PAGE_URL },
  ],
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ConvertLinx Color Picker',
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

export default function ColorPicker() {
  // Single source of truth: the color as HSV floats. Everything else is derived from it.
  const [hsv, setHsv]             = useState(() => rgbToHsv(parseHex(DEFAULT_HEX)));
  const [hexDraft, setHexDraft]   = useState(null); // what the user is typing in the HEX box (null = show current)
  const [mode, setMode]           = useState('rgb'); // which slider set is visible: rgb | hsb | hsl
  const [copiedKey, setCopiedKey] = useState('');
  const [canEyedrop, setCanEyedrop] = useState(false);
  const pickerRef = useRef(null);
  const copyTimer = useRef(null);

  useEffect(() => {
    setCanEyedrop(typeof window !== 'undefined' && 'EyeDropper' in window);
    return () => clearTimeout(copyTimer.current);
  }, []);

  // ── derived values ──
  const rgb      = useMemo(() => hsvToRgb(hsv.h, hsv.s, hsv.v), [hsv]);
  const hex      = rgbToHex(rgb);
  const hsl      = hsvToHsl(hsv);
  const cmyk     = rgbToCmyk(rgb);
  const contrast = getContrast(rgb);
  const light    = isLight(rgb);
  const shades   = useMemo(() => generateShades(hsv, hex), [hsv, hex]);

  const H  = Math.round(hsv.h);
  const SB = Math.round(hsv.s * 100);
  const B  = Math.round(hsv.v * 100);
  const SL = Math.round(hsl.s * 100);
  const L  = Math.round(hsl.l * 100);

  const draftClean = hexDraft === null ? '' : hexDraft.trim().replace(/^#/, '');
  const hexError =
    hexDraft !== null && (/[^0-9a-f]/i.test(draftClean) || draftClean.length > 6)
      ? 'Use only 0-9 and A-F, for example #7C3AED'
      : '';

  // ── updates ──
  const applyHex = (value) => {
    const parsed = parseHex(value);
    if (!parsed) return;
    setHexDraft(null);
    setHsv((prev) => rgbToHsv(parsed, prev.h));
  };

  const handleHexInput = (e) => {
    const val = e.target.value;
    setHexDraft(val);
    const parsed = parseHex(val);
    if (parsed) setHsv((prev) => rgbToHsv(parsed, prev.h));
  };

  const handleRgb = (channel, val) => {
    const n = clamp(Math.round(Number(val) || 0), 0, 255);
    setHexDraft(null);
    setHsv((prev) => rgbToHsv({ ...hsvToRgb(prev.h, prev.s, prev.v), [channel]: n }, prev.h));
  };

  const handleHsb = (key, val) => {
    const n = Number(val) || 0;
    setHexDraft(null);
    setHsv((prev) =>
      key === 'h' ? { ...prev, h: clamp(n, 0, 360) } : { ...prev, [key]: clamp(n, 0, 100) / 100 }
    );
  };

  const handleHsl = (key, val) => {
    const n = Number(val) || 0;
    setHexDraft(null);
    setHsv((prev) => {
      const cur = hsvToHsl(prev);
      return hslToHsv(key === 'h' ? { ...cur, h: clamp(n, 0, 360) } : { ...cur, [key]: clamp(n, 0, 100) / 100 });
    });
  };

  const handleNativePicker = (e) => applyHex(e.target.value);

  const pickFromScreen = async () => {
    try {
      const result = await new window.EyeDropper().open();
      applyHex(result.sRGBHex);
    } catch {
      /* user pressed Esc or the browser blocked it: nothing to do */
    }
  };

  const copyValue = async (key, value) => {
    const ok = await copyText(value);
    if (!ok) return;
    setCopiedKey(key);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopiedKey(''), 2000);
  };

  const colorFormats = [
    { key: 'hex',  label: 'HEX',  value: hex },
    { key: 'rgb',  label: 'RGB',  value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { key: 'hsl',  label: 'HSL',  value: `hsl(${H}, ${SL}%, ${L}%)` },
    { key: 'hsb',  label: 'HSB',  value: `hsb(${H}, ${SB}%, ${B}%)` },
    { key: 'cmyk', label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];

  const sliderSets = {
    rgb: [
      { id: 'r', name: 'Red',   short: 'Red',   color: '#EF4444', min: 0, max: 255, value: rgb.r, track: `linear-gradient(to right, rgb(0,${rgb.g},${rgb.b}), rgb(255,${rgb.g},${rgb.b}))`, onChange: (v) => handleRgb('r', v) },
      { id: 'g', name: 'Green', short: 'Green', color: '#22C55E', min: 0, max: 255, value: rgb.g, track: `linear-gradient(to right, rgb(${rgb.r},0,${rgb.b}), rgb(${rgb.r},255,${rgb.b}))`, onChange: (v) => handleRgb('g', v) },
      { id: 'b', name: 'Blue',  short: 'Blue',  color: '#3B82F6', min: 0, max: 255, value: rgb.b, track: `linear-gradient(to right, rgb(${rgb.r},${rgb.g},0), rgb(${rgb.r},${rgb.g},255))`, onChange: (v) => handleRgb('b', v) },
    ],
    hsb: [
      { id: 'h', name: 'Hue',        short: 'Hue', color: '#7C3AED', min: 0, max: 360, value: H,  track: HUE_TRACK, onChange: (v) => handleHsb('h', v) },
      { id: 's', name: 'Saturation', short: 'Sat', color: '#7C3AED', min: 0, max: 100, value: SB, track: `linear-gradient(to right, ${rgbToHex(hsvToRgb(hsv.h, 0, hsv.v))}, ${rgbToHex(hsvToRgb(hsv.h, 1, hsv.v))})`, onChange: (v) => handleHsb('s', v) },
      { id: 'v', name: 'Brightness', short: 'Bri', color: '#7C3AED', min: 0, max: 100, value: B,  track: `linear-gradient(to right, #000000, ${rgbToHex(hsvToRgb(hsv.h, hsv.s, 1))})`, onChange: (v) => handleHsb('v', v) },
    ],
    hsl: [
      { id: 'h', name: 'Hue',        short: 'Hue',   color: '#7C3AED', min: 0, max: 360, value: H,  track: HUE_TRACK, onChange: (v) => handleHsl('h', v) },
      { id: 's', name: 'Saturation', short: 'Sat',   color: '#7C3AED', min: 0, max: 100, value: SL, track: `linear-gradient(to right, hsl(${H}, 0%, ${L}%), hsl(${H}, 100%, ${L}%))`, onChange: (v) => handleHsl('s', v) },
      { id: 'l', name: 'Lightness',  short: 'Light', color: '#7C3AED', min: 0, max: 100, value: L,  track: `linear-gradient(to right, #000000, hsl(${H}, ${SL}%, 50%), #ffffff)`, onChange: (v) => handleHsl('l', v) },
    ],
  };

  const modeLabels = { rgb: 'RGB', hsb: 'HSB', hsl: 'HSL' };
  const whiteLevel = wcagLevel(contrast.white);
  const blackLevel = wcagLevel(contrast.black);

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
              <span className="cp-breadcrumb-current">Color Picker</span>
            </div>
            <span className="cp-badge">Color Tool</span>
            <h1 className="cp-hero-title">
              Free <span className="cp-grad-text">Color Picker</span>: HEX, RGB, HSB &amp; HSL Codes
            </h1>
            <p className="cp-hero-sub">
              Pick any color and get its HEX, RGB, HSB (HSV), HSL, and CMYK codes instantly. Edit any value and the rest update,
              check contrast ratios, build a shade palette, and copy any format in one click.
              No signup, 100% browser-based.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="cp-section-main py-10 px-6">
          <div className="max-w-3xl mx-auto cp-fade-up">

            <div className="cp-tool-card">

              {/* ── COLOR PREVIEW + PICKER ROW ── */}
              <div className="cp-preview-row">
                <div
                  className="cp-swatch-large"
                  style={{ background: hex }}
                  role="button"
                  tabIndex={0}
                  aria-label="Open the color picker"
                  onClick={() => pickerRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      pickerRef.current?.click();
                    }
                  }}
                  title="Click to open color picker"
                >
                  <input
                    ref={pickerRef}
                    type="color"
                    className="cp-native-input"
                    value={hex.toLowerCase()}
                    onChange={handleNativePicker}
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                  <div className="cp-swatch-overlay">
                    <Pipette className="w-6 h-6" style={{ color: light ? '#00000066' : '#ffffff99' }} />
                  </div>
                </div>

                <div className="cp-hex-block">
                  <label className="cp-control-label" htmlFor="cp-hex-input">HEX Code</label>
                  <input
                    id="cp-hex-input"
                    type="text"
                    className={`cp-hex-input ${hexError ? 'cp-input-error' : ''}`}
                    value={hexDraft ?? hex}
                    onChange={handleHexInput}
                    onBlur={() => setHexDraft(null)}
                    onFocus={(e) => e.target.select()}
                    placeholder="#7C3AED"
                    spellCheck={false}
                    autoComplete="off"
                  />
                  {hexError && <p className="cp-error-msg">{hexError}</p>}
                  <p className="cp-hex-hint">Type a HEX code (with or without #) or click the swatch to pick</p>
                  {canEyedrop && (
                    <button type="button" className="cp-copy-btn" style={{ marginTop: 8 }} onClick={pickFromScreen}>
                      <Pipette className="w-3.5 h-3.5" />
                      Pick from screen
                    </button>
                  )}
                </div>
              </div>

              {/* ── SLIDERS (RGB / HSB / HSL) ── */}
              <div className="cp-sliders-section">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <span className="cp-control-label">Adjust Color</span>
                  <div className="flex items-center gap-2" role="group" aria-label="Slider model">
                    {Object.keys(modeLabels).map((m) => (
                      <button
                        key={m}
                        type="button"
                        className="cp-copy-btn"
                        aria-pressed={mode === m}
                        onClick={() => setMode(m)}
                        style={mode === m ? { background: '#7C3AED', color: '#ffffff', borderColor: '#7C3AED' } : undefined}
                      >
                        {modeLabels[m]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="cp-sliders-grid">
                  {sliderSets[mode].map((s) => (
                    <div key={`${mode}-${s.id}`} className="cp-slider-row">
                      <span className="cp-slider-label" style={{ color: s.color }}>{s.short}</span>
                      <input
                        type="range"
                        className="cp-range"
                        aria-label={`${modeLabels[mode]} ${s.name}`}
                        min={s.min}
                        max={s.max}
                        value={s.value}
                        style={{ '--track-bg': s.track }}
                        onChange={(e) => s.onChange(e.target.value)}
                      />
                      <input
                        type="number"
                        className="cp-num-input"
                        aria-label={`${modeLabels[mode]} ${s.name} value`}
                        min={s.min}
                        max={s.max}
                        value={s.value}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => s.onChange(e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── FORMAT OUTPUTS ── */}
              <div className="cp-formats-section">
                <span className="cp-control-label mb-3 block">All Color Formats</span>
                <div className="cp-formats-grid">
                  {colorFormats.map(({ key, label, value }) => (
                    <div key={key} className="cp-format-row">
                      <span className="cp-format-label">{label}</span>
                      <span className="cp-format-value">{value}</span>
                      <button
                        type="button"
                        className={`cp-copy-btn ${copiedKey === key ? 'copied' : ''}`}
                        onClick={() => copyValue(key, value)}
                        title={`Copy ${label}`}
                        aria-label={`Copy ${label} value`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedKey === key ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
                <p className="cp-hex-hint">HSB is the same color model as HSV.</p>
              </div>

              {/* ── CONTRAST RATIO ── */}
              <div className="cp-contrast-section">
                <span className="cp-control-label mb-3 block">Contrast Ratio (WCAG)</span>
                <div className="cp-contrast-grid">
                  <div className="cp-contrast-card" style={{ background: hex }}>
                    <span style={{ color: '#ffffff' }} className="cp-contrast-sample">Aa</span>
                    <div>
                      <p className="cp-contrast-num" style={{ color: '#ffffff' }}>{fmtRatio(contrast.white)}:1</p>
                      <p className="cp-contrast-desc" style={{ color: 'rgba(255,255,255,0.7)' }}>vs White</p>
                    </div>
                    <span className={`cp-wcag-badge ${whiteLevel.cls}`}>{whiteLevel.label}</span>
                  </div>
                  <div className="cp-contrast-card cp-contrast-card-black">
                    <span style={{ color: hex }} className="cp-contrast-sample">Aa</span>
                    <div>
                      <p className="cp-contrast-num" style={{ color: '#1C1917' }}>{fmtRatio(contrast.black)}:1</p>
                      <p className="cp-contrast-desc" style={{ color: '#78716C' }}>vs Black</p>
                    </div>
                    <span className={`cp-wcag-badge ${blackLevel.cls}`}>{blackLevel.label}</span>
                  </div>
                </div>
              </div>

              {/* ── SHADE PALETTE ── */}
              <div className="cp-shades-section">
                <span className="cp-control-label mb-3 block">Tints &amp; Shades (Tailwind-style 50-900)</span>
                <div className="cp-shades-row">
                  {shades.map(({ label, hex: sh }) => (
                    <button
                      key={label}
                      type="button"
                      className="cp-shade-swatch"
                      style={{ background: sh }}
                      title={`${label}: ${sh}`}
                      aria-label={`Use shade ${label}, ${sh}`}
                      onClick={() => applyHex(sh)}
                    >
                      <span className="cp-shade-label" style={{ color: isLight(parseHex(sh)) ? '#00000077' : '#ffffff99' }}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── PRESET COLORS ── */}
              <div className="cp-presets-section">
                <span className="cp-control-label mb-3 block">Quick Presets</span>
                <div className="cp-presets-row">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`cp-preset-dot ${hex === c.toUpperCase() ? 'active' : ''}`}
                      style={{ background: c }}
                      onClick={() => applyHex(c)}
                      title={c}
                      aria-label={`Use preset color ${c}`}
                    />
                  ))}
                </div>
              </div>

              <div className="cp-trust-strip">
                {['No sign-up', 'Instant conversion', 'Runs in your browser', 'Nothing stored', '100% free'].map((t, i) => (
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
                { num: '1', title: 'Pick or Enter a Color', desc: 'Click the swatch to open the native picker, type a HEX code, or drag the RGB, HSB, or HSL sliders. In Chrome and Edge you can also pick any color from your screen.' },
                { num: '2', title: 'View All Formats',      desc: 'Instantly see your color in HEX, RGB, HSL, HSB (HSV), and CMYK, plus contrast ratios and a full shade palette. Edit any value and the rest update.' },
                { num: '3', title: 'Copy & Use',            desc: 'Click the Copy button next to any format and paste it straight into Figma, CSS, Tailwind, or any design tool.' },
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
            <h2 className="cp-section-title text-center mb-10">Why Use Our Color Picker?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Palette className="w-6 h-6" />,
                  color: '#7C3AED',
                  bg: 'rgba(124,58,237,0.08)',
                  title: '5 Formats at Once',
                  desc: 'Convert to HEX, RGB, HSL, HSB, and CMYK simultaneously. Edit any of them and the others follow. No need to visit multiple tools.',
                },
                {
                  icon: <RefreshCw className="w-6 h-6" />,
                  color: '#D97706',
                  bg: 'rgba(217,119,6,0.08)',
                  title: 'WCAG Contrast Check',
                  desc: 'Instantly see accessibility contrast ratios against white and black backgrounds with WCAG pass/fail.',
                },
                {
                  icon: <Copy className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'Full Shade Palette',
                  desc: 'Get a complete 10-step, Tailwind-style shade palette from any color, ready for your design system.',
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
              <h2 className="cp-section-title text-2xl mb-4">HEX to RGB: What Does It Mean?</h2>
              <p className="cp-body-text leading-7 text-sm">
                HEX (hexadecimal) and RGB (Red, Green, Blue) are two ways to express the same color digitally.
                HEX codes like <code className="cp-code">#7C3AED</code> are common in CSS and HTML. RGB values
                like <code className="cp-code">rgb(124, 58, 237)</code> are used in CSS, design tools, and
                image processing. When designing structured documents or digital layouts, pairing solid colors with clear web text formatted using a <Link href="/lorem-ipsum" className={linkClass}>Lorem Ipsum Generator</Link> or checking layout character limits with our <Link href="/word-counter" className={linkClass}>Word Counter</Link> improves UI precision.
              </p>
              <p className="cp-body-text leading-7 text-sm mt-3">
                Our tool goes further. It also converts to HSL (used in modern CSS), HSB, also called HSV (the model behind
                the color pickers in Photoshop and Figma), and CMYK (used in print design). If you are preparing JSON data schemes or encoding color palettes into configuration strings, you can also process data formatted via our <Link href="/json-formatter" className={linkClass}>JSON Formatter</Link> or encode output using the <Link href="/base64-tool" className={linkClass}>Base64 Encoder</Link>.
              </p>
            </div>

            <div className="cp-seo-box">
              <h3 className="cp-section-subtitle font-bold text-lg mb-4">HEX vs RGB vs HSB vs HSL: Which One Should You Use?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  ['HEX', 'The shortest way to write a color in CSS and HTML. Best for copying a single brand color.'],
                  ['RGB', 'Red, green, and blue from 0 to 255. Best when you need to work with channels or transparency in code.'],
                  ['HSB (HSV)', 'Hue, saturation, brightness. How Photoshop and Figma pickers think, so it is great for choosing a color by eye.'],
                  ['HSL', 'Hue, saturation, lightness. Works directly in CSS and makes lighter or darker variants easy to build.'],
                  ['CMYK', 'Cyan, magenta, yellow, black. Used for print, so check the result with your printer.'],
                ].map(([name, text], i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="cp-arrow font-bold mt-0.5">→</span>
                    <span className="cp-body-text"><strong>{name}:</strong> {text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cp-seo-box">
              <h3 className="cp-section-subtitle font-bold text-lg mb-4">Common Use Cases</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Convert brand HEX colors to RGB for CSS variables',
                  'Find the HEX code of a color on your screen (Chrome and Edge)',
                  'Check WCAG accessibility contrast ratios',
                  'Generate Tailwind-style color palettes from a brand color',
                  'Convert RGB values to HEX for HTML attributes',
                  'Get HSB values to match Photoshop or Figma',
                  'Get CMYK values for print design workflows',
                  'Pick colors visually and copy to Figma or VS Code',
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
                  'UI/UX designers: work across color formats fast',
                  'Web developers: get exact CSS color values',
                  'Brand designers: build consistent color systems',
                  'Accessibility auditors: verify contrast compliance',
                  'Print designers: convert RGB to CMYK for print',
                  'Everyone: anyone working with digital color',
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
                  'Visual color picker with native browser input',
                  'RGB, HSB, and HSL sliders with live gradient tracks',
                  'HEX, RGB, HSL, HSB (HSV), CMYK all at once',
                  'Edit any value and every format updates',
                  'Pick a color from your screen (Chrome and Edge)',
                  'WCAG contrast ratio vs white and black',
                  '10-step Tailwind-style shade palette generator',
                  '15 quick-access preset colors',
                  'One-click copy for every format',
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
              Ready to convert your colors?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 2 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cp-cta-btn"
            >
              <Pipette className="w-5 h-5" />
              Pick a Color
            </button>
          </div>
        </section>

      </main>
    </>
  );
}




























































// 'use client';

// import { useState, useCallback, useRef } from 'react';
// import { Pipette, Copy, RefreshCw, Palette, ChevronDown } from 'lucide-react';
// import Script from 'next/script';
// import '@/styles/ColorPicker.css';
// import Link from 'next/link';

// // ── CONVERSION UTILITIES ──
// function hexToRgb(hex) {
//   const clean = hex.replace('#', '');
//   const full =
//     clean.length === 3
//       ? clean.split('').map(c => c + c).join('')
//       : clean;
//   if (!/^[0-9A-Fa-f]{6}$/.test(full)) return null;
//   return {
//     r: parseInt(full.slice(0, 2), 16),
//     g: parseInt(full.slice(2, 4), 16),
//     b: parseInt(full.slice(4, 6), 16),
//   };
// }

// function rgbToHex(r, g, b) {
//   return (
//     '#' +
//     [r, g, b]
//       .map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
//       .join('')
//       .toUpperCase()
//   );
// }

// function rgbToHsl(r, g, b) {
//   const rn = r / 255, gn = g / 255, bn = b / 255;
//   const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
//   let h, s;
//   const l = (max + min) / 2;
//   if (max === min) {
//     h = s = 0;
//   } else {
//     const d = max - min;
//     s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
//     switch (max) {
//       case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
//       case gn: h = ((bn - rn) / d + 2) / 6; break;
//       default: h = ((rn - gn) / d + 4) / 6;
//     }
//   }
//   return {
//     h: Math.round(h * 360),
//     s: Math.round(s * 100),
//     l: Math.round(l * 100),
//   };
// }

// function rgbToHsv(r, g, b) {
//   const rn = r / 255, gn = g / 255, bn = b / 255;
//   const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
//   const v = max;
//   const d = max - min;
//   const s = max === 0 ? 0 : d / max;
//   let h = 0;
//   if (max !== min) {
//     switch (max) {
//       case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
//       case gn: h = ((bn - rn) / d + 2) / 6; break;
//       default: h = ((rn - gn) / d + 4) / 6;
//     }
//   }
//   return {
//     h: Math.round(h * 360),
//     s: Math.round(s * 100),
//     v: Math.round(v * 100),
//   };
// }

// function rgbToCmyk(r, g, b) {
//   if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
//   const rn = r / 255, gn = g / 255, bn = b / 255;
//   const k = 1 - Math.max(rn, gn, bn);
//   const c = (1 - rn - k) / (1 - k);
//   const m = (1 - gn - k) / (1 - k);
//   const y = (1 - bn - k) / (1 - k);
//   return {
//     c: Math.round(c * 100),
//     m: Math.round(m * 100),
//     y: Math.round(y * 100),
//     k: Math.round(k * 100),
//   };
// }

// function getLuminance(r, g, b) {
//   const toLinear = c => {
//     const n = c / 255;
//     return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
//   };
//   return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
// }

// function getContrastRatio(r, g, b) {
//   const lum = getLuminance(r, g, b);
//   const white = 1;
//   const black = 0;
//   const contrastWhite = (white + 0.05) / (lum + 0.05);
//   const contrastBlack = (lum + 0.05) / (black + 0.05);
//   return { white: contrastWhite.toFixed(2), black: contrastBlack.toFixed(2) };
// }

// function isLight(r, g, b) {
//   return getLuminance(r, g, b) > 0.179;
// }

// function generateShades(hex) {
//   const rgb = hexToRgb(hex);
//   if (!rgb) return [];
//   const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
//   return [
//     { label: '50',  l: 97 },
//     { label: '100', l: 94 },
//     { label: '200', l: 86 },
//     { label: '300', l: 74 },
//     { label: '400', l: 62 },
//     { label: '500', l: hsl.l },
//     { label: '600', l: Math.max(0, hsl.l - 10) },
//     { label: '700', l: Math.max(0, hsl.l - 22) },
//     { label: '800', l: Math.max(0, hsl.l - 34) },
//     { label: '900', l: Math.max(0, hsl.l - 46) },
//   ].map(({ label, l }) => {
//     const h = hsl.h / 360, s = hsl.s / 100, ln = l / 100;
//     const q = ln < 0.5 ? ln * (1 + s) : ln + s - ln * s;
//     const p = 2 * ln - q;
//     const hue2rgb = (p2, q2, t) => {
//       let tt = t;
//       if (tt < 0) tt += 1;
//       if (tt > 1) tt -= 1;
//       if (tt < 1 / 6) return p2 + (q2 - p2) * 6 * tt;
//       if (tt < 1 / 2) return q2;
//       if (tt < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - tt) * 6;
//       return p2;
//     };
//     const rr = s === 0 ? ln : hue2rgb(p, q, h + 1 / 3);
//     const gg = s === 0 ? ln : hue2rgb(p, q, h);
//     const bb2 = s === 0 ? ln : hue2rgb(p, q, h - 1 / 3);
//     const hexVal = rgbToHex(Math.round(rr * 255), Math.round(gg * 255), Math.round(bb2 * 255));
//     return { label, hex: hexVal, l };
//   });
// }

// const PRESET_COLORS = [
//   '#EF4444','#F97316','#EAB308','#22C55E','#14B8A6',
//   '#3B82F6','#8B5CF6','#EC4899','#06B6D4','#84CC16',
//   '#F43F5E','#6366F1','#10B981','#F59E0B','#0EA5E9',
// ];

// export default function ColorPicker() {
//   const [hex,        setHex]        = useState('#7C3AED');
//   const [hexInput,   setHexInput]   = useState('#7C3AED');
//   const [rgb,        setRgb]        = useState({ r: 124, g: 58, b: 237 });
//   const [error,      setError]      = useState('');
//   const [copiedKey,  setCopiedKey]  = useState('');
//   const pickerRef = useRef(null);

//   const applyColor = useCallback((hexVal) => {
//     const result = hexToRgb(hexVal);
//     if (!result) { setError('Invalid HEX color'); return; }
//     setError('');
//     setHex(hexVal.length === 4 ? '#' + hexVal.slice(1).split('').map(c => c+c).join('') : hexVal);
//     setHexInput(hexVal);
//     setRgb(result);
//   }, []);

//   const handleHexInput = (e) => {
//     const val = e.target.value;
//     setHexInput(val);
//     if (/^#[0-9A-Fa-f]{3}$/.test(val) || /^#[0-9A-Fa-f]{6}$/.test(val)) {
//       applyColor(val);
//     } else {
//       setError(val.length > 1 ? 'Enter a valid HEX (e.g. #7C3AED)' : '');
//     }
//   };

//   const handleRgbChange = (channel, val) => {
//     const num = Math.max(0, Math.min(255, parseInt(val) || 0));
//     const newRgb = { ...rgb, [channel]: num };
//     setRgb(newRgb);
//     const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
//     setHex(newHex);
//     setHexInput(newHex);
//     setError('');
//   };

//   const handleNativePicker = (e) => {
//     const val = e.target.value.toUpperCase();
//     applyColor(val);
//   };

//   const copyValue = (key, value) => {
//     navigator.clipboard.writeText(value);
//     setCopiedKey(key);
//     setTimeout(() => setCopiedKey(''), 2000);
//   };

//   const hsl  = rgbToHsl(rgb.r, rgb.g, rgb.b);
//   const hsv  = rgbToHsv(rgb.r, rgb.g, rgb.b);
//   const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
//   const contrast = getContrastRatio(rgb.r, rgb.g, rgb.b);
//   const light = isLight(rgb.r, rgb.g, rgb.b);
//   const shades = generateShades(hex);

//   const colorFormats = [
//     { key: 'hex',  label: 'HEX',  value: hex.toUpperCase() },
//     { key: 'rgb',  label: 'RGB',  value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
//     { key: 'hsl',  label: 'HSL',  value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
//     { key: 'hsv',  label: 'HSV',  value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
//     { key: 'cmyk', label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
//   ];

//   const faqs = [
//     {
//       q: 'What is a HEX color code?',
//       a: 'A HEX color code is a 6-digit hexadecimal value prefixed with # that represents a color in the RGB color model. Each pair of digits represents the intensity of Red, Green, and Blue channels.'
//     },
//     {
//       q: 'How do I convert HEX to RGB?',
//       a: 'Split the 6-digit HEX into three pairs, then convert each pair from base-16 to base-10. For example, #FF8800 becomes R=255, G=136, B=0.'
//     },
//     {
//       q: 'What is the difference between HSL and HSV?',
//       a: 'HSL (Hue, Saturation, Lightness) and HSV (Hue, Saturation, Value) are both cylindrical color models. HSL defines pure colors at 50% lightness, while HSV defines pure colors at 100% value.'
//     },
//     {
//       q: 'What is CMYK and when is it used?',
//       a: 'CMYK (Cyan, Magenta, Yellow, Key/Black) is the color model used in color printing. Unlike RGB which adds light, CMYK subtracts light on a white medium.'
//     },
//     {
//       q: 'What is contrast ratio and why does it matter?',
//       a: 'Contrast ratio measures how distinguishable text is against its background. WCAG accessibility guidelines require at least 4.5:1 for normal text and 3:1 for large text.'
//     },
//     {
//       q: 'Can I use the color picker on mobile?',
//       a: 'Yes — the tool is fully responsive and works on all mobile devices. Tap the color swatch to open your native device color picker.'
//     },
//     {
//       q: 'What are color shades/tints?',
//       a: 'Shades are darker variations of a color (mixed with black) and tints are lighter variations (mixed with white). The shade palette follows the Tailwind CSS scale (50–900).'
//     },
//     {
//       q: 'Is my color data stored anywhere?',
//       a: 'No — everything runs 100% in your browser. No color data is sent to any server. Complete privacy guaranteed.'
//     },
//   ];

//   return (
//     <>
//       {/* ── SCHEMA: HowTo ── */}
//       <Script
//         id="howto-schema-cp"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             '@context': 'https://schema.org',
//             '@type': 'HowTo',
//             name: 'How to Convert HEX to RGB Online for Free',
//             description: 'Instantly convert any HEX color code to RGB, HSL, HSV, and CMYK using the free Color Picker tool.',
//             url: 'https://convertlinx.com/color-picker',
//             totalTime: 'PT5S',
//             estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
//             supply: [{ '@type': 'HowToSupply', name: 'A HEX or RGB color value' }],
//             tool: [{ '@type': 'HowToTool', name: 'Color Picker' }],
//             step: [
//               { '@type': 'HowToStep', name: 'Enter or pick a color', text: 'Type a HEX code, adjust RGB sliders, or use the native color picker.' },
//               { '@type': 'HowToStep', name: 'View all formats', text: 'Instantly see HEX, RGB, HSL, HSV, and CMYK values.' },
//               { '@type': 'HowToStep', name: 'Copy and use', text: 'Click the copy icon next to any format and paste it into your project.' },
//             ],
//           }),
//         }}
//       />

//       {/* ── SCHEMA: BreadcrumbList ── */}
//       <Script
//         id="breadcrumb-schema-cp"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             '@context': 'https://schema.org',
//             '@type': 'BreadcrumbList',
//             itemListElement: [
//               { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://convertlinx.com/' },
//               { '@type': 'ListItem', position: 2, name: 'Color Picker', item: 'https://convertlinx.com/color-picker' },
//             ],
//           }),
//         }}
//       />

//       <main className="cp-page">

//         {/* ── HERO ── */}
//         <section className="cp-hero">
//           <div className="cp-blob-1" />
//           <div className="cp-blob-2" />
//           <div className="relative z-10 max-w-3xl mx-auto">
//             <div className="flex items-center justify-center gap-2 text-sm mb-5">
//               <Link href="/" className="cp-breadcrumb-link">Home</Link>
//               <span className="cp-breadcrumb-sep">/</span>
//               <span className="cp-breadcrumb-current">Color Picker</span>
//             </div>
//             <span className="cp-badge">Color Tool</span>
//             <h1 className="cp-hero-title">
//               Free <span className="cp-grad-text">Color Picker</span> &amp; Converter
//             </h1>
//             <p className="cp-hero-sub">
//               Pick any color and instantly convert between HEX, RGB, HSL, HSV, and CMYK.
//               View contrast ratios, Tailwind tint/shade palettes, and copy any format in one click.
//               No signup, 100% browser-based.
//             </p>
//           </div>
//         </section>

//         {/* ── TOOL WORKSPACE ── */}
//         <section className="cp-section-main py-10 px-6">
//           <div className="max-w-3xl mx-auto cp-fade-up">

//             <div className="cp-tool-card">

//               {/* ── COLOR PREVIEW + PICKER ROW ── */}
//               <div className="cp-preview-row">
//                 <div
//                   className="cp-swatch-large"
//                   style={{ background: hex }}
//                   onClick={() => pickerRef.current?.click()}
//                   title="Click to open color picker"
//                 >
//                   <input
//                     ref={pickerRef}
//                     type="color"
//                     className="cp-native-input"
//                     value={hex.length === 7 ? hex : '#7C3AED'}
//                     onChange={handleNativePicker}
//                   />
//                   <div className="cp-swatch-overlay">
//                     <Pipette className="w-6 h-6" style={{ color: light ? '#00000066' : '#ffffff99' }} />
//                   </div>
//                 </div>

//                 <div className="cp-hex-block">
//                   <label className="cp-control-label">HEX Code</label>
//                   <input
//                     type="text"
//                     className={`cp-hex-input ${error ? 'cp-input-error' : ''}`}
//                     value={hexInput}
//                     onChange={handleHexInput}
//                     placeholder="#7C3AED"
//                     maxLength={7}
//                     spellCheck={false}
//                   />
//                   {error && <p className="cp-error-msg">{error}</p>}
//                   <p className="cp-hex-hint">Type a HEX code or click the swatch to pick</p>
//                 </div>
//               </div>

//               {/* ── RGB SLIDERS ── */}
//               <div className="cp-sliders-section">
//                 <label className="cp-control-label mb-3 block">RGB Channels</label>
//                 <div className="cp-sliders-grid">
//                   {[
//                     { ch: 'r', label: 'Red',   color: '#EF4444', track: 'linear-gradient(to right, #000, #EF4444)' },
//                     { ch: 'g', label: 'Green', color: '#22C55E', track: 'linear-gradient(to right, #000, #22C55E)' },
//                     { ch: 'b', label: 'Blue',  color: '#3B82F6', track: 'linear-gradient(to right, #000, #3B82F6)' },
//                   ].map(({ ch, label, color, track }) => (
//                     <div key={ch} className="cp-slider-row">
//                       <span className="cp-slider-label" style={{ color }}>{label}</span>
//                       <input
//                         type="range"
//                         className="cp-range"
//                         min={0} max={255}
//                         value={rgb[ch]}
//                         style={{ '--track-bg': track }}
//                         onChange={e => handleRgbChange(ch, e.target.value)}
//                       />
//                       <input
//                         type="number"
//                         className="cp-num-input"
//                         min={0} max={255}
//                         value={rgb[ch]}
//                         onChange={e => handleRgbChange(ch, e.target.value)}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* ── FORMAT OUTPUTS ── */}
//               <div className="cp-formats-section">
//                 <label className="cp-control-label mb-3 block">All Color Formats</label>
//                 <div className="cp-formats-grid">
//                   {colorFormats.map(({ key, label, value }) => (
//                     <div key={key} className="cp-format-row">
//                       <span className="cp-format-label">{label}</span>
//                       <span className="cp-format-value">{value}</span>
//                       <button
//                         className={`cp-copy-btn ${copiedKey === key ? 'copied' : ''}`}
//                         onClick={() => copyValue(key, value)}
//                         title={`Copy ${label}`}
//                       >
//                         <Copy className="w-3.5 h-3.5" />
//                         {copiedKey === key ? 'Copied!' : 'Copy'}
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* ── CONTRAST RATIO ── */}
//               <div className="cp-contrast-section">
//                 <label className="cp-control-label mb-3 block">Contrast Ratio (WCAG)</label>
//                 <div className="cp-contrast-grid">
//                   <div className="cp-contrast-card" style={{ background: hex }}>
//                     <span style={{ color: '#ffffff' }} className="cp-contrast-sample">Aa</span>
//                     <div>
//                       <p className="cp-contrast-num" style={{ color: '#ffffff' }}>{contrast.white}:1</p>
//                       <p className="cp-contrast-desc" style={{ color: 'rgba(255,255,255,0.7)' }}>vs White</p>
//                     </div>
//                     <span className={`cp-wcag-badge ${parseFloat(contrast.white) >= 4.5 ? 'pass' : parseFloat(contrast.white) >= 3 ? 'aa-large' : 'fail'}`}>
//                       {parseFloat(contrast.white) >= 4.5 ? 'AA Pass' : parseFloat(contrast.white) >= 3 ? 'AA Large' : 'Fail'}
//                     </span>
//                   </div>
//                   <div className="cp-contrast-card cp-contrast-card-black">
//                     <span style={{ color: hex }} className="cp-contrast-sample">Aa</span>
//                     <div>
//                       <p className="cp-contrast-num" style={{ color: '#1C1917' }}>{contrast.black}:1</p>
//                       <p className="cp-contrast-desc" style={{ color: '#78716C' }}>vs Black</p>
//                     </div>
//                     <span className={`cp-wcag-badge ${parseFloat(contrast.black) >= 4.5 ? 'pass' : parseFloat(contrast.black) >= 3 ? 'aa-large' : 'fail'}`}>
//                       {parseFloat(contrast.black) >= 4.5 ? 'AA Pass' : parseFloat(contrast.black) >= 3 ? 'AA Large' : 'Fail'}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* ── SHADE PALETTE ── */}
//               <div className="cp-shades-section">
//                 <label className="cp-control-label mb-3 block">Tints &amp; Shades (Tailwind Scale)</label>
//                 <div className="cp-shades-row">
//                   {shades.map(({ label, hex: sh }) => (
//                     <button
//                       key={label}
//                       className="cp-shade-swatch"
//                       style={{ background: sh }}
//                       title={`${label}: ${sh}`}
//                       onClick={() => applyColor(sh)}
//                     >
//                       <span className="cp-shade-label" style={{ color: isLight(...Object.values(hexToRgb(sh) || {r:0,g:0,b:0})) ? '#00000077' : '#ffffff99' }}>
//                         {label}
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* ── PRESET COLORS ── */}
//               <div className="cp-presets-section">
//                 <label className="cp-control-label mb-3 block">Quick Presets</label>
//                 <div className="cp-presets-row">
//                   {PRESET_COLORS.map(c => (
//                     <button
//                       key={c}
//                       className={`cp-preset-dot ${hex.toUpperCase() === c.toUpperCase() ? 'active' : ''}`}
//                       style={{ background: c }}
//                       onClick={() => applyColor(c)}
//                       title={c}
//                     />
//                   ))}
//                 </div>
//               </div>

//               <div className="cp-trust-strip">
//                 {['No sign-up','Instant conversion','Works offline','Nothing stored','100% free'].map((t, i) => (
//                   <span key={i} className="cp-trust-item">
//                     <span className="cp-trust-dot" />
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── HOW IT WORKS ── */}
//         <hr className="cp-divider" />
//         <section className="cp-section-alt py-16 px-6">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="cp-section-title text-center mb-12">3 Simple Steps</h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {[
//                 { num: '1', title: 'Pick or Enter a Color', desc: 'Click the color swatch to open the native picker, type a HEX code directly, or drag the RGB sliders to any value.' },
//                 { num: '2', title: 'View All Formats',      desc: 'Instantly see your color in HEX, RGB, HSL, HSV, and CMYK — plus contrast ratios and a full shade palette.' },
//                 { num: '3', title: 'Copy & Use',            desc: 'Click the Copy button next to any format and paste it straight into Figma, CSS, Tailwind, or any design tool.' },
//               ].map((s, i) => (
//                 <div key={i} className="cp-step-card">
//                   <div className="cp-step-num">{s.num}</div>
//                   <h3 className="cp-card-title font-bold text-base mb-2">{s.title}</h3>
//                   <p className="cp-card-desc text-sm leading-relaxed">{s.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── BENEFITS ── */}
//         <hr className="cp-divider" />
//         <section className="cp-section-main py-16 px-6">
//           <div className="max-w-5xl mx-auto">
//             <h2 className="cp-section-title text-center mb-10">Why Use Our Color Picker?</h2>
//             <div className="grid md:grid-cols-3 gap-5">
//               {[
//                 {
//                   icon: <Palette className="w-6 h-6" />,
//                   color: '#7C3AED',
//                   bg: 'rgba(124,58,237,0.08)',
//                   title: '5 Formats at Once',
//                   desc: 'Convert to HEX, RGB, HSL, HSV, and CMYK simultaneously — no need to visit multiple tools.',
//                 },
//                 {
//                   icon: <RefreshCw className="w-6 h-6" />,
//                   color: '#D97706',
//                   bg: 'rgba(217,119,6,0.08)',
//                   title: 'WCAG Contrast Check',
//                   desc: 'Instantly see accessibility contrast ratios against white and black backgrounds with WCAG pass/fail.',
//                 },
//                 {
//                   icon: <Copy className="w-6 h-6" />,
//                   color: '#059669',
//                   bg: 'rgba(5,150,105,0.08)',
//                   title: 'Full Shade Palette',
//                   desc: 'Get a complete 10-stop Tailwind-scale shade palette from any color, ready for your design system.',
//                 },
//               ].map((b, i) => (
//                 <div key={i} className="cp-benefit-card">
//                   <div className="cp-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
//                   <h3 className="cp-card-title font-bold text-base mb-2">{b.title}</h3>
//                   <p className="cp-card-desc text-sm leading-relaxed">{b.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── SEO CONTENT WITH CONTEXTUAL INTERLINKING ── */}
//         <hr className="cp-divider" />
//         <section className="cp-section-alt py-16 px-6">
//           <div className="max-w-3xl mx-auto space-y-8">

//             <div>
//               <h2 className="cp-section-title text-2xl mb-4">HEX to RGB — What Does It Mean?</h2>
//               <p className="cp-body-text leading-7 text-sm">
//                 HEX (hexadecimal) and RGB (Red, Green, Blue) are two ways to express the same color digitally.
//                 HEX codes like <code className="cp-code">#7C3AED</code> are common in CSS and HTML. RGB values
//                 like <code className="cp-code">rgb(124, 58, 237)</code> are used in CSS, design tools, and
//                 image processing. When designing structured documents or digital layouts, pairing solid colors with clear web text formatted using a <Link href="/lorem-ipsum" className="text-purple-600 hover:underline font-medium">Lorem Ipsum Generator</Link> or checking layout character limits with our <Link href="/word-counter" className="text-purple-600 hover:underline font-medium">Word Counter</Link> improves UI precision.
//               </p>
//               <p className="cp-body-text leading-7 text-sm mt-3">
//                 Our tool goes further — it also converts to HSL (used in modern CSS), HSV (used in Photoshop and
//                 Figma color pickers), and CMYK (used in print design). If you are preparing JSON data schemes or encoding color palettes into configuration strings, you can also process data formatted via our <Link href="/json-formatter" className="text-purple-600 hover:underline font-medium">JSON Formatter</Link> or encode output using the <Link href="/base64-tool" className="text-purple-600 hover:underline font-medium">Base64 Encoder</Link>.
//               </p>
//             </div>

//             <div className="cp-seo-box">
//               <h3 className="cp-section-subtitle font-bold text-lg mb-4">Common Use Cases</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Convert brand HEX colors to RGB for CSS variables',
//                   'Check WCAG accessibility contrast ratios',
//                   'Generate Tailwind color palettes from a brand color',
//                   'Convert RGB values to HEX for HTML attributes',
//                   'Get CMYK values for print design workflows',
//                   'Pick colors visually and copy to Figma or VS Code',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="cp-feature-dot" />
//                     <span className="cp-body-text">{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="cp-section-subtitle font-bold text-lg mb-4">Who Should Use This?</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'UI/UX designers — work across color formats fast',
//                   'Web developers — get exact CSS color values',
//                   'Brand designers — build consistent color systems',
//                   'Accessibility auditors — verify contrast compliance',
//                   'Print designers — convert RGB to CMYK for print',
//                   'Everyone — anyone working with digital color',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-2 text-sm">
//                     <span className="cp-arrow font-bold mt-0.5">→</span>
//                     <span className="cp-body-text">{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="cp-seo-box">
//               <h3 className="cp-section-subtitle font-bold text-lg mb-4">Features</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Visual color picker with native browser input',
//                   'Live RGB sliders with per-channel control',
//                   'HEX, RGB, HSL, HSV, CMYK — all at once',
//                   'WCAG contrast ratio vs white and black',
//                   '10-stop Tailwind shade palette generator',
//                   '15 quick-access preset colors',
//                   'One-click copy for every format',
//                   'Nothing stored — full privacy',
//                 ].map((f, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="cp-feature-dot" />
//                     <span className="cp-body-text">{f}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </section>

//         {/* ── FAQ WITH CONTEXTUAL INTERLINKING ── */}
//         <hr className="cp-divider" />
//         <section className="cp-section-main py-16 px-6">
//           <Script
//             id="faq-schema-cp"
//             type="application/ld+json"
//             strategy="afterInteractive"
//             dangerouslySetInnerHTML={{
//               __html: JSON.stringify({
//                 '@context': 'https://schema.org',
//                 '@type': 'FAQPage',
//                 mainEntity: faqs.map(faq => ({
//                   '@type': 'Question',
//                   name: faq.q,
//                   acceptedAnswer: { '@type': 'Answer', text: faq.a },
//                 })),
//               }),
//             }}
//           />
//           <div className="max-w-3xl mx-auto">
//             <h2 className="cp-section-title text-center mb-10">Frequently Asked Questions</h2>
//             <div className="space-y-3">
//               <details className="cp-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="cp-faq-question font-semibold text-sm">What is a HEX color code?</span>
//                   <ChevronDown className="cp-faq-icon w-4 h-4 shrink-0" />
//                 </summary>
//                 <p className="cp-faq-answer mt-3 text-sm leading-relaxed">
//                   A HEX color code is a 6-digit hexadecimal value prefixed with # that represents a color in the RGB color model. Each pair of digits represents the intensity of Red, Green, and Blue channels. If you need to standardize casing in CSS or code configs, try our <Link href="/case-converter" className="text-purple-600 hover:underline">Case Converter</Link>.
//                 </p>
//               </details>

//               <details className="cp-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="cp-faq-question font-semibold text-sm">How do I convert HEX to RGB?</span>
//                   <ChevronDown className="cp-faq-icon w-4 h-4 shrink-0" />
//                 </summary>
//                 <p className="cp-faq-answer mt-3 text-sm leading-relaxed">
//                   Split the 6-digit HEX into three pairs, then convert each pair from base-16 to base-10. For example, #FF8800 becomes R=255, G=136, B=0. Our tool does this instantly without requiring manual code formatting or data parsing.
//                 </p>
//               </details>

//               <details className="cp-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="cp-faq-question font-semibold text-sm">What is the difference between HSL and HSV?</span>
//                   <ChevronDown className="cp-faq-icon w-4 h-4 shrink-0" />
//                 </summary>
//                 <p className="cp-faq-answer mt-3 text-sm leading-relaxed">
//                   HSL (Hue, Saturation, Lightness) and HSV (Hue, Saturation, Value) are both cylindrical color models. HSL defines pure colors at 50% lightness, while HSV defines pure colors at 100% value. HSL is widely used in CSS alongside mock copy from our <Link href="/lorem-ipsum" className="text-purple-600 hover:underline">Lorem Ipsum Generator</Link>.
//                 </p>
//               </details>

//               <details className="cp-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="cp-faq-question font-semibold text-sm">What is CMYK and when is it used?</span>
//                   <ChevronDown className="cp-faq-icon w-4 h-4 shrink-0" />
//                 </summary>
//                 <p className="cp-faq-answer mt-3 text-sm leading-relaxed">
//                   CMYK (Cyan, Magenta, Yellow, Key/Black) is the color model used in color printing. Unlike RGB which adds light, CMYK subtracts light on a white medium. Use CMYK values when preparing physical media layouts.
//                 </p>
//               </details>

//               <details className="cp-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="cp-faq-question font-semibold text-sm">What is contrast ratio and why does it matter?</span>
//                   <ChevronDown className="cp-faq-icon w-4 h-4 shrink-0" />
//                 </summary>
//                 <p className="cp-faq-answer mt-3 text-sm leading-relaxed">
//                   Contrast ratio measures how distinguishable text is against its background. WCAG guidelines require at least 4.5:1 for normal text. You can measure word density and text sizing using our <Link href="/word-counter" className="text-purple-600 hover:underline">Word Counter</Link>.
//                 </p>
//               </details>

//               <details className="cp-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="cp-faq-question font-semibold text-sm">Can I use the color picker on mobile?</span>
//                   <ChevronDown className="cp-faq-icon w-4 h-4 shrink-0" />
//                 </summary>
//                 <p className="cp-faq-answer mt-3 text-sm leading-relaxed">
//                   Yes — the tool is fully responsive and works on all mobile devices. Tap the color swatch to open your native device color picker, or paste string values clean using our <Link href="/case-converter" className="text-purple-600 hover:underline">Case Converter</Link>.
//                 </p>
//               </details>

//               <details className="cp-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="cp-faq-question font-semibold text-sm">What are color shades/tints?</span>
//                   <ChevronDown className="cp-faq-icon w-4 h-4 shrink-0" />
//                 </summary>
//                 <p className="cp-faq-answer mt-3 text-sm leading-relaxed">
//                   Shades are darker variations of a color (mixed with black) and tints are lighter variations (mixed with white). The shade palette shown here follows the Tailwind CSS naming convention (50–900).
//                 </p>
//               </details>

//               <details className="cp-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="cp-faq-question font-semibold text-sm">Is my color data stored anywhere?</span>
//                   <ChevronDown className="cp-faq-icon w-4 h-4 shrink-0" />
//                 </summary>
//                 <p className="cp-faq-answer mt-3 text-sm leading-relaxed">
//                   No — everything runs 100% in your browser. No color data is sent to any server. If you work with web configuration files, you can also format your payloads securely using our browser-based <Link href="/json-formatter" className="text-purple-600 hover:underline">JSON Formatter</Link> or encode assets via <Link href="/base64-tool" className="text-purple-600 hover:underline">Base64 Encoder</Link>.
//                 </p>
//               </details>
//             </div>
//           </div>
//         </section>

//         {/* ── RELATED TOOLS ── */}
//         <hr className="cp-divider" />
//         <section className="cp-section-alt py-14 px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="cp-section-title text-center mb-5">You may also find these free tools helpful</h2>
//             <div className="flex flex-wrap justify-center gap-3">
//               {[
//                 { name: 'Lorem Ipsum Generator', href: '/lorem-ipsum'   },
//                 { name: 'Word Counter',          href: '/word-counter'  },
//                 { name: 'Case Converter',        href: '/case-converter'},
//                 { name: 'JSON Formatter',        href: '/json-formatter'},
//                 { name: 'Base64 Encoder',        href: '/base64-tool'   },
//               ].map((tool, i) => (
//                 <Link
//                   key={i}
//                   href={tool.href}
//                   className="px-4 py-2 rounded-full text-sm font-medium border cp-related-link"
//                 >
//                   {tool.name}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── BOTTOM CTA ── */}
//         <section className="cp-cta-section">
//           <div className="max-w-xl mx-auto">
//             <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
//               Ready to convert your colors?
//             </h2>
//             <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
//               Takes 2 seconds. No signup. No ads.
//             </p>
//             <button
//               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//               className="cp-cta-btn"
//             >
//               <Pipette className="w-5 h-5" />
//               Pick a Color
//             </button>
//           </div>
//         </section>

//       </main>
//     </>
//   );
// }






































































// // 'use client';

// // import { useState, useCallback, useRef } from 'react';
// // import { Pipette, Copy, RefreshCw, Palette, ChevronDown } from 'lucide-react';
// // import Script from 'next/script';
// // import '@/styles/ColorPicker.css';
// // import Link from 'next/link';

// // // ── CONVERSION UTILITIES ──
// // function hexToRgb(hex) {
// //   const clean = hex.replace('#', '');
// //   const full =
// //     clean.length === 3
// //       ? clean.split('').map(c => c + c).join('')
// //       : clean;
// //   if (!/^[0-9A-Fa-f]{6}$/.test(full)) return null;
// //   return {
// //     r: parseInt(full.slice(0, 2), 16),
// //     g: parseInt(full.slice(2, 4), 16),
// //     b: parseInt(full.slice(4, 6), 16),
// //   };
// // }

// // function rgbToHex(r, g, b) {
// //   return (
// //     '#' +
// //     [r, g, b]
// //       .map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
// //       .join('')
// //       .toUpperCase()
// //   );
// // }

// // function rgbToHsl(r, g, b) {
// //   const rn = r / 255, gn = g / 255, bn = b / 255;
// //   const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
// //   let h, s;
// //   const l = (max + min) / 2;
// //   if (max === min) {
// //     h = s = 0;
// //   } else {
// //     const d = max - min;
// //     s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
// //     switch (max) {
// //       case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
// //       case gn: h = ((bn - rn) / d + 2) / 6; break;
// //       default: h = ((rn - gn) / d + 4) / 6;
// //     }
// //   }
// //   return {
// //     h: Math.round(h * 360),
// //     s: Math.round(s * 100),
// //     l: Math.round(l * 100),
// //   };
// // }

// // function rgbToHsv(r, g, b) {
// //   const rn = r / 255, gn = g / 255, bn = b / 255;
// //   const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
// //   const v = max;
// //   const d = max - min;
// //   const s = max === 0 ? 0 : d / max;
// //   let h = 0;
// //   if (max !== min) {
// //     switch (max) {
// //       case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
// //       case gn: h = ((bn - rn) / d + 2) / 6; break;
// //       default: h = ((rn - gn) / d + 4) / 6;
// //     }
// //   }
// //   return {
// //     h: Math.round(h * 360),
// //     s: Math.round(s * 100),
// //     v: Math.round(v * 100),
// //   };
// // }

// // function rgbToCmyk(r, g, b) {
// //   if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
// //   const rn = r / 255, gn = g / 255, bn = b / 255;
// //   const k = 1 - Math.max(rn, gn, bn);
// //   const c = (1 - rn - k) / (1 - k);
// //   const m = (1 - gn - k) / (1 - k);
// //   const y = (1 - bn - k) / (1 - k);
// //   return {
// //     c: Math.round(c * 100),
// //     m: Math.round(m * 100),
// //     y: Math.round(y * 100),
// //     k: Math.round(k * 100),
// //   };
// // }

// // function getLuminance(r, g, b) {
// //   const toLinear = c => {
// //     const n = c / 255;
// //     return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
// //   };
// //   return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
// // }

// // function getContrastRatio(r, g, b) {
// //   const lum = getLuminance(r, g, b);
// //   const white = 1;
// //   const black = 0;
// //   const contrastWhite = (white + 0.05) / (lum + 0.05);
// //   const contrastBlack = (lum + 0.05) / (black + 0.05);
// //   return { white: contrastWhite.toFixed(2), black: contrastBlack.toFixed(2) };
// // }

// // function isLight(r, g, b) {
// //   return getLuminance(r, g, b) > 0.179;
// // }

// // function generateShades(hex) {
// //   const rgb = hexToRgb(hex);
// //   if (!rgb) return [];
// //   const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
// //   return [
// //     { label: '50',  l: 97 },
// //     { label: '100', l: 94 },
// //     { label: '200', l: 86 },
// //     { label: '300', l: 74 },
// //     { label: '400', l: 62 },
// //     { label: '500', l: hsl.l },
// //     { label: '600', l: Math.max(0, hsl.l - 10) },
// //     { label: '700', l: Math.max(0, hsl.l - 22) },
// //     { label: '800', l: Math.max(0, hsl.l - 34) },
// //     { label: '900', l: Math.max(0, hsl.l - 46) },
// //   ].map(({ label, l }) => {
// //     const r2 = Math.round(((hsl.h / 360) % 1) * 255);
// //     // Convert HSL back to RGB properly
// //     const h = hsl.h / 360, s = hsl.s / 100, ln = l / 100;
// //     const q = ln < 0.5 ? ln * (1 + s) : ln + s - ln * s;
// //     const p = 2 * ln - q;
// //     const hue2rgb = (p2, q2, t) => {
// //       let tt = t;
// //       if (tt < 0) tt += 1;
// //       if (tt > 1) tt -= 1;
// //       if (tt < 1 / 6) return p2 + (q2 - p2) * 6 * tt;
// //       if (tt < 1 / 2) return q2;
// //       if (tt < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - tt) * 6;
// //       return p2;
// //     };
// //     const rr = s === 0 ? ln : hue2rgb(p, q, h + 1 / 3);
// //     const gg = s === 0 ? ln : hue2rgb(p, q, h);
// //     const bb2 = s === 0 ? ln : hue2rgb(p, q, h - 1 / 3);
// //     const hexVal = rgbToHex(Math.round(rr * 255), Math.round(gg * 255), Math.round(bb2 * 255));
// //     return { label, hex: hexVal, l };
// //   });
// // }

// // const PRESET_COLORS = [
// //   '#EF4444','#F97316','#EAB308','#22C55E','#14B8A6',
// //   '#3B82F6','#8B5CF6','#EC4899','#06B6D4','#84CC16',
// //   '#F43F5E','#6366F1','#10B981','#F59E0B','#0EA5E9',
// // ];

// // export default function ColorPicker() {
// //   const [hex,        setHex]        = useState('#7C3AED');
// //   const [hexInput,   setHexInput]   = useState('#7C3AED');
// //   const [rgb,        setRgb]        = useState({ r: 124, g: 58, b: 237 });
// //   const [error,      setError]      = useState('');
// //   const [copiedKey,  setCopiedKey]  = useState('');
// //   const pickerRef = useRef(null);

// //   const applyColor = useCallback((hexVal) => {
// //     const result = hexToRgb(hexVal);
// //     if (!result) { setError('Invalid HEX color'); return; }
// //     setError('');
// //     setHex(hexVal.length === 4 ? '#' + hexVal.slice(1).split('').map(c => c+c).join('') : hexVal);
// //     setHexInput(hexVal);
// //     setRgb(result);
// //   }, []);

// //   const handleHexInput = (e) => {
// //     const val = e.target.value;
// //     setHexInput(val);
// //     if (/^#[0-9A-Fa-f]{3}$/.test(val) || /^#[0-9A-Fa-f]{6}$/.test(val)) {
// //       applyColor(val);
// //     } else {
// //       setError(val.length > 1 ? 'Enter a valid HEX (e.g. #7C3AED)' : '');
// //     }
// //   };

// //   const handleRgbChange = (channel, val) => {
// //     const num = Math.max(0, Math.min(255, parseInt(val) || 0));
// //     const newRgb = { ...rgb, [channel]: num };
// //     setRgb(newRgb);
// //     const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
// //     setHex(newHex);
// //     setHexInput(newHex);
// //     setError('');
// //   };

// //   const handleNativePicker = (e) => {
// //     const val = e.target.value.toUpperCase();
// //     applyColor(val);
// //   };

// //   const copyValue = (key, value) => {
// //     navigator.clipboard.writeText(value);
// //     setCopiedKey(key);
// //     setTimeout(() => setCopiedKey(''), 2000);
// //   };

// //   const hsl  = rgbToHsl(rgb.r, rgb.g, rgb.b);
// //   const hsv  = rgbToHsv(rgb.r, rgb.g, rgb.b);
// //   const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
// //   const contrast = getContrastRatio(rgb.r, rgb.g, rgb.b);
// //   const light = isLight(rgb.r, rgb.g, rgb.b);
// //   const shades = generateShades(hex);

// //   const colorFormats = [
// //     { key: 'hex',  label: 'HEX',  value: hex.toUpperCase() },
// //     { key: 'rgb',  label: 'RGB',  value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
// //     { key: 'hsl',  label: 'HSL',  value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
// //     { key: 'hsv',  label: 'HSV',  value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
// //     { key: 'cmyk', label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
// //   ];

// //   const faqs = [
// //     { q: 'What is a HEX color code?',            a: 'A HEX color code is a 6-digit hexadecimal value prefixed with # that represents a color in the RGB color model. Each pair of digits represents the intensity of Red, Green, and Blue channels from 00 (none) to FF (maximum).' },
// //     { q: 'How do I convert HEX to RGB?',          a: 'Split the 6-digit HEX into three pairs, then convert each pair from base-16 (hexadecimal) to base-10 (decimal). For example, #FF8800 becomes R=255, G=136, B=0. Our tool does this instantly.' },
// //     { q: 'What is the difference between HSL and HSV?', a: 'HSL (Hue, Saturation, Lightness) and HSV (Hue, Saturation, Value) are both cylindrical color models. HSL defines pure colors at 50% lightness, while HSV defines pure colors at 100% value. HSL is more common in CSS; HSV is widely used in design software like Photoshop.' },
// //     { q: 'What is CMYK and when is it used?',     a: 'CMYK (Cyan, Magenta, Yellow, Key/Black) is the color model used in color printing. Unlike RGB which adds light, CMYK subtracts light on a white medium. Use CMYK values when preparing designs for physical print.' },
// //     { q: 'What is contrast ratio and why does it matter?', a: 'Contrast ratio measures how distinguishable text is against its background. WCAG accessibility guidelines require at least 4.5:1 for normal text and 3:1 for large text to ensure readability for users with visual impairments.' },
// //     { q: 'Can I use the color picker on mobile?',  a: 'Yes — the tool is fully responsive and works on all devices. Tap the color swatch to open your device color picker, or manually type in any HEX or RGB value.' },
// //     { q: 'What are color shades/tints?',           a: 'Shades are darker variations of a color (mixed with black) and tints are lighter variations (mixed with white). The shade palette shown here follows the Tailwind CSS naming convention (50–900) and is useful for building design systems.' },
// //     { q: 'Is my color data stored anywhere?',      a: 'No — everything runs 100% in your browser. No color data is sent to any server. Complete privacy guaranteed.' },
// //   ];

// //   return (
// //     <>
// //       {/* ── SCHEMA: HowTo ── */}
// //       <Script
// //         id="howto-schema-cp"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             '@context': 'https://schema.org',
// //             '@type': 'HowTo',
// //             name: 'How to Convert HEX to RGB Online for Free',
// //             description: 'Instantly convert any HEX color code to RGB, HSL, HSV, and CMYK using the free ConvertLinx Color Picker tool.',
// //             url: 'https://convertlinx.com/color-picker',
// //             totalTime: 'PT5S',
// //             estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
// //             supply: [{ '@type': 'HowToSupply', name: 'A HEX or RGB color value' }],
// //             tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Color Picker' }],
// //             step: [
// //               { '@type': 'HowToStep', name: 'Enter or pick a color', text: 'Type a HEX code, adjust RGB sliders, or use the native color picker.' },
// //               { '@type': 'HowToStep', name: 'View all formats', text: 'Instantly see HEX, RGB, HSL, HSV, and CMYK values.' },
// //               { '@type': 'HowToStep', name: 'Copy and use', text: 'Click the copy icon next to any format and paste it into your project.' },
// //             ],
// //           }),
// //         }}
// //       />

// //       {/* ── SCHEMA: BreadcrumbList ── */}
// //       <Script
// //         id="breadcrumb-schema-cp"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             '@context': 'https://schema.org',
// //             '@type': 'BreadcrumbList',
// //             itemListElement: [
// //               { '@type': 'ListItem', position: 1, name: 'Home',         item: 'https://convertlinx.com/' },
// //               { '@type': 'ListItem', position: 2, name: 'Color Picker', item: 'https://convertlinx.com/color-picker' },
// //             ],
// //           }),
// //         }}
// //       />

// //       <main className="cp-page">

// //         {/* ── HERO ── */}
// //         <section className="cp-hero">
// //           <div className="cp-blob-1" />
// //           <div className="cp-blob-2" />
// //           <div className="relative z-10 max-w-3xl mx-auto">
// //             <div className="flex items-center justify-center gap-2 text-sm mb-5">
// //               <a href="/" className="cp-breadcrumb-link">Home</a>
// //               <span className="cp-breadcrumb-sep">/</span>
// //               <span className="cp-breadcrumb-current">Color Picker</span>
// //             </div>
// //             <span className="cp-badge">Color Tool</span>
// //             <h1 className="cp-hero-title">
// //               Free <span className="cp-grad-text">Color Picker</span> &amp; Converter
// //             </h1>
// //             <p className="cp-hero-sub">
// //               Pick any color and instantly convert between HEX, RGB, HSL, HSV, and CMYK.
// //               View contrast ratios, tint/shade palettes, and copy any format in one click.
// //               No signup, 100% browser-based.
// //             </p>
// //           </div>
// //         </section>

// //         {/* ── TOOL WORKSPACE ── */}
// //         <section className="cp-section-main py-10 px-6">
// //           <div className="max-w-3xl mx-auto cp-fade-up">

// //             <div className="cp-tool-card">

// //               {/* ── COLOR PREVIEW + PICKER ROW ── */}
// //               <div className="cp-preview-row">
// //                 {/* Big color swatch */}
// //                 <div
// //                   className="cp-swatch-large"
// //                   style={{ background: hex }}
// //                   onClick={() => pickerRef.current?.click()}
// //                   title="Click to open color picker"
// //                 >
// //                   <input
// //                     ref={pickerRef}
// //                     type="color"
// //                     className="cp-native-input"
// //                     value={hex.length === 7 ? hex : '#7C3AED'}
// //                     onChange={handleNativePicker}
// //                   />
// //                   <div className="cp-swatch-overlay">
// //                     <Pipette className="w-6 h-6" style={{ color: light ? '#00000066' : '#ffffff99' }} />
// //                   </div>
// //                 </div>

// //                 {/* HEX input */}
// //                 <div className="cp-hex-block">
// //                   <label className="cp-control-label">HEX Code</label>
// //                   <input
// //                     type="text"
// //                     className={`cp-hex-input ${error ? 'cp-input-error' : ''}`}
// //                     value={hexInput}
// //                     onChange={handleHexInput}
// //                     placeholder="#7C3AED"
// //                     maxLength={7}
// //                     spellCheck={false}
// //                   />
// //                   {error && <p className="cp-error-msg">{error}</p>}
// //                   <p className="cp-hex-hint">Type a HEX code or click the swatch to pick</p>
// //                 </div>
// //               </div>

// //               {/* ── RGB SLIDERS ── */}
// //               <div className="cp-sliders-section">
// //                 <label className="cp-control-label mb-3 block">RGB Channels</label>
// //                 <div className="cp-sliders-grid">
// //                   {[
// //                     { ch: 'r', label: 'Red',   color: '#EF4444', track: 'linear-gradient(to right, #000, #EF4444)' },
// //                     { ch: 'g', label: 'Green', color: '#22C55E', track: 'linear-gradient(to right, #000, #22C55E)' },
// //                     { ch: 'b', label: 'Blue',  color: '#3B82F6', track: 'linear-gradient(to right, #000, #3B82F6)' },
// //                   ].map(({ ch, label, color, track }) => (
// //                     <div key={ch} className="cp-slider-row">
// //                       <span className="cp-slider-label" style={{ color }}>{label}</span>
// //                       <input
// //                         type="range"
// //                         className="cp-range"
// //                         min={0} max={255}
// //                         value={rgb[ch]}
// //                         style={{ '--track-bg': track }}
// //                         onChange={e => handleRgbChange(ch, e.target.value)}
// //                       />
// //                       <input
// //                         type="number"
// //                         className="cp-num-input"
// //                         min={0} max={255}
// //                         value={rgb[ch]}
// //                         onChange={e => handleRgbChange(ch, e.target.value)}
// //                       />
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* ── FORMAT OUTPUTS ── */}
// //               <div className="cp-formats-section">
// //                 <label className="cp-control-label mb-3 block">All Color Formats</label>
// //                 <div className="cp-formats-grid">
// //                   {colorFormats.map(({ key, label, value }) => (
// //                     <div key={key} className="cp-format-row">
// //                       <span className="cp-format-label">{label}</span>
// //                       <span className="cp-format-value">{value}</span>
// //                       <button
// //                         className={`cp-copy-btn ${copiedKey === key ? 'copied' : ''}`}
// //                         onClick={() => copyValue(key, value)}
// //                         title={`Copy ${label}`}
// //                       >
// //                         <Copy className="w-3.5 h-3.5" />
// //                         {copiedKey === key ? 'Copied!' : 'Copy'}
// //                       </button>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* ── CONTRAST RATIO ── */}
// //               <div className="cp-contrast-section">
// //                 <label className="cp-control-label mb-3 block">Contrast Ratio (WCAG)</label>
// //                 <div className="cp-contrast-grid">
// //                   <div className="cp-contrast-card" style={{ background: hex }}>
// //                     <span style={{ color: '#ffffff' }} className="cp-contrast-sample">Aa</span>
// //                     <div>
// //                       <p className="cp-contrast-num" style={{ color: '#ffffff' }}>{contrast.white}:1</p>
// //                       <p className="cp-contrast-desc" style={{ color: 'rgba(255,255,255,0.7)' }}>vs White</p>
// //                     </div>
// //                     <span className={`cp-wcag-badge ${parseFloat(contrast.white) >= 4.5 ? 'pass' : parseFloat(contrast.white) >= 3 ? 'aa-large' : 'fail'}`}>
// //                       {parseFloat(contrast.white) >= 4.5 ? 'AA Pass' : parseFloat(contrast.white) >= 3 ? 'AA Large' : 'Fail'}
// //                     </span>
// //                   </div>
// //                   <div className="cp-contrast-card cp-contrast-card-black">
// //                     <span style={{ color: hex }} className="cp-contrast-sample">Aa</span>
// //                     <div>
// //                       <p className="cp-contrast-num" style={{ color: '#1C1917' }}>{contrast.black}:1</p>
// //                       <p className="cp-contrast-desc" style={{ color: '#78716C' }}>vs Black</p>
// //                     </div>
// //                     <span className={`cp-wcag-badge ${parseFloat(contrast.black) >= 4.5 ? 'pass' : parseFloat(contrast.black) >= 3 ? 'aa-large' : 'fail'}`}>
// //                       {parseFloat(contrast.black) >= 4.5 ? 'AA Pass' : parseFloat(contrast.black) >= 3 ? 'AA Large' : 'Fail'}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* ── SHADE PALETTE ── */}
// //               <div className="cp-shades-section">
// //                 <label className="cp-control-label mb-3 block">Tints &amp; Shades (Tailwind Scale)</label>
// //                 <div className="cp-shades-row">
// //                   {shades.map(({ label, hex: sh }) => (
// //                     <button
// //                       key={label}
// //                       className="cp-shade-swatch"
// //                       style={{ background: sh }}
// //                       title={`${label}: ${sh}`}
// //                       onClick={() => applyColor(sh)}
// //                     >
// //                       <span className="cp-shade-label" style={{ color: isLight(...Object.values(hexToRgb(sh) || {r:0,g:0,b:0})) ? '#00000077' : '#ffffff99' }}>
// //                         {label}
// //                       </span>
// //                     </button>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* ── PRESET COLORS ── */}
// //               <div className="cp-presets-section">
// //                 <label className="cp-control-label mb-3 block">Quick Presets</label>
// //                 <div className="cp-presets-row">
// //                   {PRESET_COLORS.map(c => (
// //                     <button
// //                       key={c}
// //                       className={`cp-preset-dot ${hex.toUpperCase() === c.toUpperCase() ? 'active' : ''}`}
// //                       style={{ background: c }}
// //                       onClick={() => applyColor(c)}
// //                       title={c}
// //                     />
// //                   ))}
// //                 </div>
// //               </div>

// //               <div className="cp-trust-strip">
// //                 {['No sign-up','Instant conversion','Works offline','Nothing stored','100% free'].map((t, i) => (
// //                   <span key={i} className="cp-trust-item">
// //                     <span className="cp-trust-dot" />
// //                     {t}
// //                   </span>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── HOW IT WORKS ── */}
// //         <hr className="cp-divider" />
// //         <section className="cp-section-alt py-16 px-6">
// //           <div className="max-w-4xl mx-auto">
// //             <h2 className="cp-section-title text-center mb-12">3 Simple Steps</h2>
// //             <div className="grid md:grid-cols-3 gap-6">
// //               {[
// //                 { num: '1', title: 'Pick or Enter a Color', desc: 'Click the color swatch to open the native picker, type a HEX code directly, or drag the RGB sliders to any value.' },
// //                 { num: '2', title: 'View All Formats',      desc: 'Instantly see your color in HEX, RGB, HSL, HSV, and CMYK — plus contrast ratios and a full shade palette.' },
// //                 { num: '3', title: 'Copy & Use',            desc: 'Click the Copy button next to any format and paste it straight into Figma, CSS, Tailwind, or any design tool.' },
// //               ].map((s, i) => (
// //                 <div key={i} className="cp-step-card">
// //                   <div className="cp-step-num">{s.num}</div>
// //                   <h3 className="cp-card-title font-bold text-base mb-2">{s.title}</h3>
// //                   <p className="cp-card-desc text-sm leading-relaxed">{s.desc}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── BENEFITS ── */}
// //         <hr className="cp-divider" />
// //         <section className="cp-section-main py-16 px-6">
// //           <div className="max-w-5xl mx-auto">
// //             <h2 className="cp-section-title text-center mb-10">Why Use ConvertLinx Color Picker?</h2>
// //             <div className="grid md:grid-cols-3 gap-5">
// //               {[
// //                 {
// //                   icon: <Palette className="w-6 h-6" />,
// //                   color: '#7C3AED',
// //                   bg: 'rgba(124,58,237,0.08)',
// //                   title: '5 Formats at Once',
// //                   desc: 'Convert to HEX, RGB, HSL, HSV, and CMYK simultaneously — no need to visit multiple tools.',
// //                 },
// //                 {
// //                   icon: <RefreshCw className="w-6 h-6" />,
// //                   color: '#D97706',
// //                   bg: 'rgba(217,119,6,0.08)',
// //                   title: 'WCAG Contrast Check',
// //                   desc: 'Instantly see accessibility contrast ratios against white and black backgrounds with WCAG pass/fail.',
// //                 },
// //                 {
// //                   icon: <Copy className="w-6 h-6" />,
// //                   color: '#059669',
// //                   bg: 'rgba(5,150,105,0.08)',
// //                   title: 'Full Shade Palette',
// //                   desc: 'Get a complete 10-stop Tailwind-scale shade palette from any color, ready for your design system.',
// //                 },
// //               ].map((b, i) => (
// //                 <div key={i} className="cp-benefit-card">
// //                   <div className="cp-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
// //                   <h3 className="cp-card-title font-bold text-base mb-2">{b.title}</h3>
// //                   <p className="cp-card-desc text-sm leading-relaxed">{b.desc}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── SEO CONTENT ── */}
// //         <hr className="cp-divider" />
// //         <section className="cp-section-alt py-16 px-6">
// //           <div className="max-w-3xl mx-auto space-y-8">

// //             <div>
// //               <h2 className="cp-section-title text-2xl mb-4">HEX to RGB — What Does It Mean?</h2>
// //               <p className="cp-body-text leading-7 text-sm">
// //                 HEX (hexadecimal) and RGB (Red, Green, Blue) are two ways to express the same color digitally.
// //                 HEX codes like <code className="cp-code">#7C3AED</code> are common in CSS and HTML. RGB values
// //                 like <code className="cp-code">rgb(124, 58, 237)</code> are used in CSS, design tools, and
// //                 image processing. Converting between them is essential for any web design or development workflow.
// //               </p>
// //               <p className="cp-body-text leading-7 text-sm mt-3">
// //                 Our tool goes further — it also converts to HSL (used in modern CSS), HSV (used in Photoshop and
// //                 Figma color pickers), and CMYK (used in print design). All conversions happen instantly in your
// //                 browser with no data sent anywhere.
// //               </p>
// //             </div>

// //             <div className="cp-seo-box">
// //               <h3 className="cp-section-subtitle font-bold text-lg mb-4">Common Use Cases</h3>
// //               <div className="grid sm:grid-cols-2 gap-3">
// //                 {[
// //                   'Convert brand HEX colors to RGB for CSS variables',
// //                   'Check WCAG accessibility contrast ratios',
// //                   'Generate Tailwind color palettes from a brand color',
// //                   'Convert RGB values to HEX for HTML attributes',
// //                   'Get CMYK values for print design workflows',
// //                   'Pick colors visually and copy to Figma or VS Code',
// //                 ].map((item, i) => (
// //                   <div key={i} className="flex items-center gap-2.5 text-sm">
// //                     <span className="cp-feature-dot" />
// //                     <span className="cp-body-text">{item}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             <div>
// //               <h3 className="cp-section-subtitle font-bold text-lg mb-4">Who Should Use This?</h3>
// //               <div className="grid sm:grid-cols-2 gap-3">
// //                 {[
// //                   'UI/UX designers — work across color formats fast',
// //                   'Web developers — get exact CSS color values',
// //                   'Brand designers — build consistent color systems',
// //                   'Accessibility auditors — verify contrast compliance',
// //                   'Print designers — convert RGB to CMYK for print',
// //                   'Everyone — anyone working with digital color',
// //                 ].map((item, i) => (
// //                   <div key={i} className="flex items-start gap-2 text-sm">
// //                     <span className="cp-arrow font-bold mt-0.5">→</span>
// //                     <span className="cp-body-text">{item}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             <div className="cp-seo-box">
// //               <h3 className="cp-section-subtitle font-bold text-lg mb-4">Features</h3>
// //               <div className="grid sm:grid-cols-2 gap-3">
// //                 {[
// //                   'Visual color picker with native browser input',
// //                   'Live RGB sliders with per-channel control',
// //                   'HEX, RGB, HSL, HSV, CMYK — all at once',
// //                   'WCAG contrast ratio vs white and black',
// //                   '10-stop Tailwind shade palette generator',
// //                   '15 quick-access preset colors',
// //                   'One-click copy for every format',
// //                   'Nothing stored — full privacy',
// //                 ].map((f, i) => (
// //                   <div key={i} className="flex items-center gap-2.5 text-sm">
// //                     <span className="cp-feature-dot" />
// //                     <span className="cp-body-text">{f}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //           </div>
// //         </section>

// //         {/* ── FAQ ── */}
// //         <hr className="cp-divider" />
// //         <section className="cp-section-main py-16 px-6">
// //           <Script
// //             id="faq-schema-cp"
// //             type="application/ld+json"
// //             strategy="afterInteractive"
// //             dangerouslySetInnerHTML={{
// //               __html: JSON.stringify({
// //                 '@context': 'https://schema.org',
// //                 '@type': 'FAQPage',
// //                 mainEntity: faqs.map(faq => ({
// //                   '@type': 'Question',
// //                   name: faq.q,
// //                   acceptedAnswer: { '@type': 'Answer', text: faq.a },
// //                 })),
// //               }),
// //             }}
// //           />
// //           <div className="max-w-3xl mx-auto">
// //             <h2 className="cp-section-title text-center mb-10">Frequently Asked Questions</h2>
// //             <div className="space-y-3">
// //               {faqs.map((faq, i) => (
// //                 <details key={i} className="cp-faq-item">
// //                   <summary className="flex items-center justify-between gap-4">
// //                     <span className="cp-faq-question font-semibold text-sm">{faq.q}</span>
// //                     <ChevronDown className="cp-faq-icon w-4 h-4 shrink-0" />
// //                   </summary>
// //                   <p className="cp-faq-answer mt-3 text-sm leading-relaxed">{faq.a}</p>
// //                 </details>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── RELATED TOOLS ── */}
// //         <hr className="cp-divider" />
// //         <section className="cp-section-alt py-14 px-6">
// //           <div className="max-w-3xl mx-auto">
// //             <h2 className="cp-section-title text-center mb-5">You may also find these free tools helpful</h2>
// //             <div className="flex flex-wrap justify-center gap-3">
// //               {[
// //                 { name: 'Lorem Ipsum Generator', href: '/lorem-ipsum'   },
// //                 { name: 'Word Counter',           href: '/word-counter'  },
// //                 { name: 'Case Converter',         href: '/case-converter'},
// //                 { name: 'JSON Formatter',         href: '/json-formatter'},
// //                 { name: 'Base64 Encoder',         href: '/base64-tool'   },
// //               ].map((tool, i) => (
// //                 <Link
// //                   key={i}
// //                   href={tool.href}
// //                   className="px-4 py-2 rounded-full text-sm font-medium border cp-related-link"
// //                 >
// //                   {tool.name}
// //                 </Link>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── BOTTOM CTA ── */}
// //         <section className="cp-cta-section">
// //           <div className="max-w-xl mx-auto">
// //             <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
// //               Ready to convert your colors?
// //             </h2>
// //             <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
// //               Takes 2 seconds. No signup. No ads.
// //             </p>
// //             <button
// //               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
// //               className="cp-cta-btn"
// //             >
// //               <Pipette className="w-5 h-5" />
// //               Pick a Color
// //             </button>
// //           </div>
// //         </section>

// //       </main>
// //     </>
// //   );
// // }