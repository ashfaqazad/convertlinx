'use client';

import { useState, useCallback, useRef } from 'react';
import { Pipette, Copy, RefreshCw, Palette, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/ColorPicker.css';
import Link from 'next/link';

// ── CONVERSION UTILITIES ──
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean.split('').map(c => c + c).join('')
      : clean;
  if (!/^[0-9A-Fa-f]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function rgbToHsl(r, g, b) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      default: h = ((rn - gn) / d + 4) / 6;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToHsv(r, g, b) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (max !== min) {
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      default: h = ((rn - gn) / d + 4) / 6;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function rgbToCmyk(r, g, b) {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  const c = (1 - rn - k) / (1 - k);
  const m = (1 - gn - k) / (1 - k);
  const y = (1 - bn - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

function getLuminance(r, g, b) {
  const toLinear = c => {
    const n = c / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(r, g, b) {
  const lum = getLuminance(r, g, b);
  const white = 1;
  const black = 0;
  const contrastWhite = (white + 0.05) / (lum + 0.05);
  const contrastBlack = (lum + 0.05) / (black + 0.05);
  return { white: contrastWhite.toFixed(2), black: contrastBlack.toFixed(2) };
}

function isLight(r, g, b) {
  return getLuminance(r, g, b) > 0.179;
}

function generateShades(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return [
    { label: '50',  l: 97 },
    { label: '100', l: 94 },
    { label: '200', l: 86 },
    { label: '300', l: 74 },
    { label: '400', l: 62 },
    { label: '500', l: hsl.l },
    { label: '600', l: Math.max(0, hsl.l - 10) },
    { label: '700', l: Math.max(0, hsl.l - 22) },
    { label: '800', l: Math.max(0, hsl.l - 34) },
    { label: '900', l: Math.max(0, hsl.l - 46) },
  ].map(({ label, l }) => {
    const r2 = Math.round(((hsl.h / 360) % 1) * 255);
    // Convert HSL back to RGB properly
    const h = hsl.h / 360, s = hsl.s / 100, ln = l / 100;
    const q = ln < 0.5 ? ln * (1 + s) : ln + s - ln * s;
    const p = 2 * ln - q;
    const hue2rgb = (p2, q2, t) => {
      let tt = t;
      if (tt < 0) tt += 1;
      if (tt > 1) tt -= 1;
      if (tt < 1 / 6) return p2 + (q2 - p2) * 6 * tt;
      if (tt < 1 / 2) return q2;
      if (tt < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - tt) * 6;
      return p2;
    };
    const rr = s === 0 ? ln : hue2rgb(p, q, h + 1 / 3);
    const gg = s === 0 ? ln : hue2rgb(p, q, h);
    const bb2 = s === 0 ? ln : hue2rgb(p, q, h - 1 / 3);
    const hexVal = rgbToHex(Math.round(rr * 255), Math.round(gg * 255), Math.round(bb2 * 255));
    return { label, hex: hexVal, l };
  });
}

const PRESET_COLORS = [
  '#EF4444','#F97316','#EAB308','#22C55E','#14B8A6',
  '#3B82F6','#8B5CF6','#EC4899','#06B6D4','#84CC16',
  '#F43F5E','#6366F1','#10B981','#F59E0B','#0EA5E9',
];

export default function ColorPicker() {
  const [hex,        setHex]        = useState('#7C3AED');
  const [hexInput,   setHexInput]   = useState('#7C3AED');
  const [rgb,        setRgb]        = useState({ r: 124, g: 58, b: 237 });
  const [error,      setError]      = useState('');
  const [copiedKey,  setCopiedKey]  = useState('');
  const pickerRef = useRef(null);

  const applyColor = useCallback((hexVal) => {
    const result = hexToRgb(hexVal);
    if (!result) { setError('Invalid HEX color'); return; }
    setError('');
    setHex(hexVal.length === 4 ? '#' + hexVal.slice(1).split('').map(c => c+c).join('') : hexVal);
    setHexInput(hexVal);
    setRgb(result);
  }, []);

  const handleHexInput = (e) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{3}$/.test(val) || /^#[0-9A-Fa-f]{6}$/.test(val)) {
      applyColor(val);
    } else {
      setError(val.length > 1 ? 'Enter a valid HEX (e.g. #7C3AED)' : '');
    }
  };

  const handleRgbChange = (channel, val) => {
    const num = Math.max(0, Math.min(255, parseInt(val) || 0));
    const newRgb = { ...rgb, [channel]: num };
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHex(newHex);
    setHexInput(newHex);
    setError('');
  };

  const handleNativePicker = (e) => {
    const val = e.target.value.toUpperCase();
    applyColor(val);
  };

  const copyValue = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const hsl  = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv  = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const contrast = getContrastRatio(rgb.r, rgb.g, rgb.b);
  const light = isLight(rgb.r, rgb.g, rgb.b);
  const shades = generateShades(hex);

  const colorFormats = [
    { key: 'hex',  label: 'HEX',  value: hex.toUpperCase() },
    { key: 'rgb',  label: 'RGB',  value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { key: 'hsl',  label: 'HSL',  value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { key: 'hsv',  label: 'HSV',  value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
    { key: 'cmyk', label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];

  const faqs = [
    { q: 'What is a HEX color code?',            a: 'A HEX color code is a 6-digit hexadecimal value prefixed with # that represents a color in the RGB color model. Each pair of digits represents the intensity of Red, Green, and Blue channels from 00 (none) to FF (maximum).' },
    { q: 'How do I convert HEX to RGB?',          a: 'Split the 6-digit HEX into three pairs, then convert each pair from base-16 (hexadecimal) to base-10 (decimal). For example, #FF8800 becomes R=255, G=136, B=0. Our tool does this instantly.' },
    { q: 'What is the difference between HSL and HSV?', a: 'HSL (Hue, Saturation, Lightness) and HSV (Hue, Saturation, Value) are both cylindrical color models. HSL defines pure colors at 50% lightness, while HSV defines pure colors at 100% value. HSL is more common in CSS; HSV is widely used in design software like Photoshop.' },
    { q: 'What is CMYK and when is it used?',     a: 'CMYK (Cyan, Magenta, Yellow, Key/Black) is the color model used in color printing. Unlike RGB which adds light, CMYK subtracts light on a white medium. Use CMYK values when preparing designs for physical print.' },
    { q: 'What is contrast ratio and why does it matter?', a: 'Contrast ratio measures how distinguishable text is against its background. WCAG accessibility guidelines require at least 4.5:1 for normal text and 3:1 for large text to ensure readability for users with visual impairments.' },
    { q: 'Can I use the color picker on mobile?',  a: 'Yes — the tool is fully responsive and works on all devices. Tap the color swatch to open your device color picker, or manually type in any HEX or RGB value.' },
    { q: 'What are color shades/tints?',           a: 'Shades are darker variations of a color (mixed with black) and tints are lighter variations (mixed with white). The shade palette shown here follows the Tailwind CSS naming convention (50–900) and is useful for building design systems.' },
    { q: 'Is my color data stored anywhere?',      a: 'No — everything runs 100% in your browser. No color data is sent to any server. Complete privacy guaranteed.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-cp"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Convert HEX to RGB Online for Free',
            description: 'Instantly convert any HEX color code to RGB, HSL, HSV, and CMYK using the free ConvertLinx Color Picker tool.',
            url: 'https://convertlinx.com/color-picker',
            totalTime: 'PT5S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'A HEX or RGB color value' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Color Picker' }],
            step: [
              { '@type': 'HowToStep', name: 'Enter or pick a color', text: 'Type a HEX code, adjust RGB sliders, or use the native color picker.' },
              { '@type': 'HowToStep', name: 'View all formats', text: 'Instantly see HEX, RGB, HSL, HSV, and CMYK values.' },
              { '@type': 'HowToStep', name: 'Copy and use', text: 'Click the copy icon next to any format and paste it into your project.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-cp"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',         item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Color Picker', item: 'https://convertlinx.com/color-picker' },
            ],
          }),
        }}
      />

      <main className="cp-page">

        {/* ── HERO ── */}
        <section className="cp-hero">
          <div className="cp-blob-1" />
          <div className="cp-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="cp-breadcrumb-link">Home</a>
              <span className="cp-breadcrumb-sep">/</span>
              <span className="cp-breadcrumb-current">Color Picker</span>
            </div>
            <span className="cp-badge">Color Tool</span>
            <h1 className="cp-hero-title">
              Free <span className="cp-grad-text">Color Picker</span> &amp; Converter
            </h1>
            <p className="cp-hero-sub">
              Pick any color and instantly convert between HEX, RGB, HSL, HSV, and CMYK.
              View contrast ratios, tint/shade palettes, and copy any format in one click.
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
                {/* Big color swatch */}
                <div
                  className="cp-swatch-large"
                  style={{ background: hex }}
                  onClick={() => pickerRef.current?.click()}
                  title="Click to open color picker"
                >
                  <input
                    ref={pickerRef}
                    type="color"
                    className="cp-native-input"
                    value={hex.length === 7 ? hex : '#7C3AED'}
                    onChange={handleNativePicker}
                  />
                  <div className="cp-swatch-overlay">
                    <Pipette className="w-6 h-6" style={{ color: light ? '#00000066' : '#ffffff99' }} />
                  </div>
                </div>

                {/* HEX input */}
                <div className="cp-hex-block">
                  <label className="cp-control-label">HEX Code</label>
                  <input
                    type="text"
                    className={`cp-hex-input ${error ? 'cp-input-error' : ''}`}
                    value={hexInput}
                    onChange={handleHexInput}
                    placeholder="#7C3AED"
                    maxLength={7}
                    spellCheck={false}
                  />
                  {error && <p className="cp-error-msg">{error}</p>}
                  <p className="cp-hex-hint">Type a HEX code or click the swatch to pick</p>
                </div>
              </div>

              {/* ── RGB SLIDERS ── */}
              <div className="cp-sliders-section">
                <label className="cp-control-label mb-3 block">RGB Channels</label>
                <div className="cp-sliders-grid">
                  {[
                    { ch: 'r', label: 'Red',   color: '#EF4444', track: 'linear-gradient(to right, #000, #EF4444)' },
                    { ch: 'g', label: 'Green', color: '#22C55E', track: 'linear-gradient(to right, #000, #22C55E)' },
                    { ch: 'b', label: 'Blue',  color: '#3B82F6', track: 'linear-gradient(to right, #000, #3B82F6)' },
                  ].map(({ ch, label, color, track }) => (
                    <div key={ch} className="cp-slider-row">
                      <span className="cp-slider-label" style={{ color }}>{label}</span>
                      <input
                        type="range"
                        className="cp-range"
                        min={0} max={255}
                        value={rgb[ch]}
                        style={{ '--track-bg': track }}
                        onChange={e => handleRgbChange(ch, e.target.value)}
                      />
                      <input
                        type="number"
                        className="cp-num-input"
                        min={0} max={255}
                        value={rgb[ch]}
                        onChange={e => handleRgbChange(ch, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── FORMAT OUTPUTS ── */}
              <div className="cp-formats-section">
                <label className="cp-control-label mb-3 block">All Color Formats</label>
                <div className="cp-formats-grid">
                  {colorFormats.map(({ key, label, value }) => (
                    <div key={key} className="cp-format-row">
                      <span className="cp-format-label">{label}</span>
                      <span className="cp-format-value">{value}</span>
                      <button
                        className={`cp-copy-btn ${copiedKey === key ? 'copied' : ''}`}
                        onClick={() => copyValue(key, value)}
                        title={`Copy ${label}`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedKey === key ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── CONTRAST RATIO ── */}
              <div className="cp-contrast-section">
                <label className="cp-control-label mb-3 block">Contrast Ratio (WCAG)</label>
                <div className="cp-contrast-grid">
                  <div className="cp-contrast-card" style={{ background: hex }}>
                    <span style={{ color: '#ffffff' }} className="cp-contrast-sample">Aa</span>
                    <div>
                      <p className="cp-contrast-num" style={{ color: '#ffffff' }}>{contrast.white}:1</p>
                      <p className="cp-contrast-desc" style={{ color: 'rgba(255,255,255,0.7)' }}>vs White</p>
                    </div>
                    <span className={`cp-wcag-badge ${parseFloat(contrast.white) >= 4.5 ? 'pass' : parseFloat(contrast.white) >= 3 ? 'aa-large' : 'fail'}`}>
                      {parseFloat(contrast.white) >= 4.5 ? 'AA Pass' : parseFloat(contrast.white) >= 3 ? 'AA Large' : 'Fail'}
                    </span>
                  </div>
                  <div className="cp-contrast-card cp-contrast-card-black">
                    <span style={{ color: hex }} className="cp-contrast-sample">Aa</span>
                    <div>
                      <p className="cp-contrast-num" style={{ color: '#1C1917' }}>{contrast.black}:1</p>
                      <p className="cp-contrast-desc" style={{ color: '#78716C' }}>vs Black</p>
                    </div>
                    <span className={`cp-wcag-badge ${parseFloat(contrast.black) >= 4.5 ? 'pass' : parseFloat(contrast.black) >= 3 ? 'aa-large' : 'fail'}`}>
                      {parseFloat(contrast.black) >= 4.5 ? 'AA Pass' : parseFloat(contrast.black) >= 3 ? 'AA Large' : 'Fail'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── SHADE PALETTE ── */}
              <div className="cp-shades-section">
                <label className="cp-control-label mb-3 block">Tints &amp; Shades (Tailwind Scale)</label>
                <div className="cp-shades-row">
                  {shades.map(({ label, hex: sh }) => (
                    <button
                      key={label}
                      className="cp-shade-swatch"
                      style={{ background: sh }}
                      title={`${label}: ${sh}`}
                      onClick={() => applyColor(sh)}
                    >
                      <span className="cp-shade-label" style={{ color: isLight(...Object.values(hexToRgb(sh) || {r:0,g:0,b:0})) ? '#00000077' : '#ffffff99' }}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── PRESET COLORS ── */}
              <div className="cp-presets-section">
                <label className="cp-control-label mb-3 block">Quick Presets</label>
                <div className="cp-presets-row">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      className={`cp-preset-dot ${hex.toUpperCase() === c.toUpperCase() ? 'active' : ''}`}
                      style={{ background: c }}
                      onClick={() => applyColor(c)}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div className="cp-trust-strip">
                {['No sign-up','Instant conversion','Works offline','Nothing stored','100% free'].map((t, i) => (
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
                { num: '1', title: 'Pick or Enter a Color', desc: 'Click the color swatch to open the native picker, type a HEX code directly, or drag the RGB sliders to any value.' },
                { num: '2', title: 'View All Formats',      desc: 'Instantly see your color in HEX, RGB, HSL, HSV, and CMYK — plus contrast ratios and a full shade palette.' },
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
            <h2 className="cp-section-title text-center mb-10">Why Use ConvertLinx Color Picker?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Palette className="w-6 h-6" />,
                  color: '#7C3AED',
                  bg: 'rgba(124,58,237,0.08)',
                  title: '5 Formats at Once',
                  desc: 'Convert to HEX, RGB, HSL, HSV, and CMYK simultaneously — no need to visit multiple tools.',
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
                  desc: 'Get a complete 10-stop Tailwind-scale shade palette from any color, ready for your design system.',
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

        {/* ── SEO CONTENT ── */}
        <hr className="cp-divider" />
        <section className="cp-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8">

            <div>
              <h2 className="cp-section-title text-2xl mb-4">HEX to RGB — What Does It Mean?</h2>
              <p className="cp-body-text leading-7 text-sm">
                HEX (hexadecimal) and RGB (Red, Green, Blue) are two ways to express the same color digitally.
                HEX codes like <code className="cp-code">#7C3AED</code> are common in CSS and HTML. RGB values
                like <code className="cp-code">rgb(124, 58, 237)</code> are used in CSS, design tools, and
                image processing. Converting between them is essential for any web design or development workflow.
              </p>
              <p className="cp-body-text leading-7 text-sm mt-3">
                Our tool goes further — it also converts to HSL (used in modern CSS), HSV (used in Photoshop and
                Figma color pickers), and CMYK (used in print design). All conversions happen instantly in your
                browser with no data sent anywhere.
              </p>
            </div>

            <div className="cp-seo-box">
              <h3 className="cp-section-subtitle font-bold text-lg mb-4">Common Use Cases</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Convert brand HEX colors to RGB for CSS variables',
                  'Check WCAG accessibility contrast ratios',
                  'Generate Tailwind color palettes from a brand color',
                  'Convert RGB values to HEX for HTML attributes',
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
                  'UI/UX designers — work across color formats fast',
                  'Web developers — get exact CSS color values',
                  'Brand designers — build consistent color systems',
                  'Accessibility auditors — verify contrast compliance',
                  'Print designers — convert RGB to CMYK for print',
                  'Everyone — anyone working with digital color',
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
                  'Live RGB sliders with per-channel control',
                  'HEX, RGB, HSL, HSV, CMYK — all at once',
                  'WCAG contrast ratio vs white and black',
                  '10-stop Tailwind shade palette generator',
                  '15 quick-access preset colors',
                  'One-click copy for every format',
                  'Nothing stored — full privacy',
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

        {/* ── FAQ ── */}
        <hr className="cp-divider" />
        <section className="cp-section-main py-16 px-6">
          <Script
            id="faq-schema-cp"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map(faq => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: { '@type': 'Answer', text: faq.a },
                })),
              }),
            }}
          />
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
              {[
                { name: 'Lorem Ipsum Generator', href: '/lorem-ipsum'   },
                { name: 'Word Counter',           href: '/word-counter'  },
                { name: 'Case Converter',         href: '/case-converter'},
                { name: 'JSON Formatter',         href: '/json-formatter'},
                { name: 'Base64 Encoder',         href: '/base64-tool'   },
              ].map((tool, i) => (
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