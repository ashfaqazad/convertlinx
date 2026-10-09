'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { Upload, Download, Layers, Shield, Code2, Check, Copy, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';
import '@/styles/PngToIco.css';

/* ───────────────────────── constants ───────────────────────── */
const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256];
const PRESETS = [
  { label: 'Favicon (16, 32, 48)', sizes: [16, 32, 48] },
  { label: 'Windows (16, 32, 48, 256)', sizes: [16, 32, 48, 256] },
  { label: 'All sizes', sizes: ICO_SIZES },
];
const MAX_BASE = 1024;

/* ───────────────────────── helpers ───────────────────────── */
const sizeKey = (arr) => [...arr].sort((a, b) => a - b).join(',');
const canvasToBlob = (canvas) => new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

// Build one big square canvas first (crop or fit), so every icon size is scaled from the same base
function makeBase(img, fit) {
  const iw = img.naturalWidth || 512;
  const ih = img.naturalHeight || 512;
  const side = fit === 'crop' ? Math.min(iw, ih) : Math.max(iw, ih);
  const scale = side > MAX_BASE ? MAX_BASE / side : 1;
  const B = Math.max(1, Math.round(side * scale));

  const c = document.createElement('canvas');
  c.width = B;
  c.height = B;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingQuality = 'high';

  if (fit === 'crop') {
    const sx = (iw - side) / 2;
    const sy = (ih - side) / 2;
    ctx.drawImage(img, sx, sy, side, side, 0, 0, B, B);
  } else {
    const dw = Math.round(iw * scale);
    const dh = Math.round(ih * scale);
    ctx.drawImage(img, (B - dw) / 2, (B - dh) / 2, dw, dh);
  }
  return c;
}

// Step-down halving = much sharper 16×16 / 32×32 than a single big downscale
function scaleTo(base, size) {
  let cur = base;
  while (cur.width / 2 >= size) {
    const next = document.createElement('canvas');
    next.width = next.height = Math.round(cur.width / 2);
    const nctx = next.getContext('2d');
    nctx.imageSmoothingQuality = 'high';
    nctx.drawImage(cur, 0, 0, next.width, next.height);
    cur = next;
  }
  const out = document.createElement('canvas');
  out.width = out.height = size;
  const octx = out.getContext('2d');
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(cur, 0, 0, size, size);
  return out;
}

// ICO container with PNG-compressed images (supported by all modern browsers and Windows Vista+)
function buildIco(entries) {
  const count = entries.length;
  const headerSize = 6 + 16 * count;
  const total = headerSize + entries.reduce((sum, e) => sum + e.buf.byteLength, 0);
  const out = new ArrayBuffer(total);
  const view = new DataView(out);
  const bytes = new Uint8Array(out);

  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, count, true);

  let offset = headerSize;
  entries.forEach((e, i) => {
    const p = 6 + i * 16;
    const dim = e.size >= 256 ? 0 : e.size; // 0 means 256
    view.setUint8(p, dim);
    view.setUint8(p + 1, dim);
    view.setUint8(p + 2, 0); // palette
    view.setUint8(p + 3, 0); // reserved
    view.setUint16(p + 4, 1, true); // planes
    view.setUint16(p + 6, 32, true); // bits per pixel
    view.setUint32(p + 8, e.buf.byteLength, true);
    view.setUint32(p + 12, offset, true);
    bytes.set(new Uint8Array(e.buf), offset);
    offset += e.buf.byteLength;
  });
  return new Blob([out], { type: 'image/x-icon' });
}

/* ── Rich text: strings + contextual internal links, one source for UI and schema ── */
const lk = (text, href) => ({ text, href });
const toPlain = (parts) => parts.map((p) => (typeof p === 'string' ? p : p.text)).join('');
const Rich = ({ parts }) => (
  <>
    {parts.map((p, i) =>
      typeof p === 'string' ? (
        <Fragment key={i}>{p}</Fragment>
      ) : (
        <Link key={i} href={p.href} className="pti-inline-link">
          {p.text}
        </Link>
      )
    )}
  </>
);

/* ───────────────────────── content ───────────────────────── */
const heroLine = [
  'Convert PNG to ICO online for free — create a multi-size favicon.ico (16×16 to 256×256) with transparency preserved. Runs entirely in your browser, no signup required. Need Apple Touch and Android icons as well? Try the ',
  lk('Favicon Generator', '/favicon-generator'),
  '.',
];

const seoIntro1 = [
  'An ICO file is a single container that holds several icon sizes — 16×16, 32×32, 48×48 and up to 256×256 — so browsers, Windows and desktop shortcuts can pick the sharpest version automatically. This free PNG to ICO converter turns any PNG into a real multi-size favicon.ico file in your browser and keeps transparent backgrounds intact. If you also need Apple Touch Icons, Android icons and a web manifest, use our ',
  lk('Favicon Generator', '/favicon-generator'),
  ' for the complete PNG favicon set.',
];
const seoIntro2 = [
  'Your logo is not a PNG yet? Convert it first with the ',
  lk('Image Converter', '/image-converter'),
  ' — or, if your source is a HEIC photo from an iPhone, run it through the ',
  lk('HEIC to JPG converter', '/heic-to-jpg'),
  ' before you create the icon. Everything runs locally, so your artwork is never uploaded.',
];
const seoHowTo = [
  'Start with a square PNG that is at least 256×256 pixels — 512×512 is ideal because the converter can scale it down cleanly. If your image is not square, crop it with the ',
  lk('Image Cropper', '/image-cropper'),
  ' or keep the "Fit" option selected so the whole image sits on a transparent square. Need an exact size first? Resize it with the ',
  lk('Image Resizer', '/image-resizer'),
  '. Then upload the PNG, pick your icon sizes and download the .ico file. The alpha channel stays untouched, so rounded logos and transparent backgrounds look exactly the same.',
];
const seoSizes = [
  'For a website favicon, 16×16, 32×32 and 48×48 cover browser tabs, bookmarks and Windows site shortcuts. Add 64×64 and 128×128 for sharper icons on high-DPI screens, and 256×256 when the icon will be used for a Windows app or large Explorer thumbnails. More sizes means a larger file, so keep it lean and compress oversized source art with the ',
  lk('Image Compressor', '/image-compressor'),
  ' before converting. Want the exact brand shade? Pick the hex value from your logo with the ',
  lk('Color Picker', '/color-picker'),
  '.',
];
const seoPngVsIco = [
  'Modern browsers can display PNG favicons, but many crawlers, feed readers, older browsers and Windows features still request /favicon.ico from the root of your domain by default. Shipping a multi-size ICO next to your PNG icons is the safest setup. Add the matching tag to your page head — the ',
  lk('Meta Tag Generator', '/metatag-generator'),
  ' can build the rest of your head section — and then test how your page looks when shared with the ',
  lk('OG Preview Checker', '/og-preview-checker'),
  '.',
];

const problems = [
  'Browser tab shows a blank page icon instead of your logo',
  'A PNG simply renamed to .ico not working as a Windows icon',
  'Blurry or pixelated icon at 16×16 or 32×32',
  'Need several icon sizes inside one .ico file',
  'Transparent background turning white or black after conversion',
  'Not sure which sizes a favicon.ico really needs',
];
const whoUses = [
  'Web developers — export a standards-compliant favicon.ico in seconds',
  'Bloggers — add a branded tab icon without design software',
  'Windows app makers — build a multi-size .ico for shortcuts and installers',
  'Agencies — deliver favicon.ico files for client websites quickly',
  'Site owners — convert a logo for any CMS or site builder that accepts ICO',
  'Designers — turn a transparent PNG logo into a clean ICO icon',
];
const features = [
  'Free PNG to ICO conversion, unlimited use',
  'Multi-size ICO: 16, 24, 32, 48, 64, 128 and 256px',
  'Transparency (alpha channel) preserved',
  'Fit or center-crop for non-square images',
  'Live preview of every icon size',
  'Ready-to-paste favicon HTML code',
  'Works on mobile and desktop',
  'No upload — files never leave your browser',
];
const bestUses = [
  'Create favicon.ico for a website or blog',
  'Fix a missing favicon on an existing site',
  'Make a custom desktop shortcut icon on Windows',
  ['Build ICO and PNG icon sets together with the ', lk('Favicon Generator', '/favicon-generator')],
  'Convert a transparent logo PNG to ICO',
  'Prepare an app icon for installers and software',
];

const faqs = [
  {
    q: 'How do I convert PNG to ICO online for free?',
    a: [
      'Upload your PNG, pick the icon sizes you want (16, 32 and 48 are the common favicon set) and click Download .ico. The conversion happens instantly in your browser with no signup. If you also want PNG icons for iOS and Android, create them with the ',
      lk('Favicon Generator', '/favicon-generator'),
      '.',
    ],
  },
  {
    q: 'Does the converter keep the transparent background?',
    a: [
      'Yes. The alpha channel of your PNG is preserved in every icon size, so rounded logos and cut-out shapes stay transparent instead of getting a white or black box. JPG files have no transparency, so use a PNG or WebP source when you need it.',
    ],
  },
  {
    q: 'What size should my PNG be before converting to ICO?',
    a: [
      'A square PNG of 256×256 pixels or larger works best, and 512×512 is ideal. Smaller images are upscaled for the larger icon sizes and can look soft. Use the ',
      lk('Image Resizer', '/image-resizer'),
      ' to set exact dimensions or the ',
      lk('Image Cropper', '/image-cropper'),
      ' to make the image square first.',
    ],
  },
  {
    q: 'Which ICO sizes should I include for a favicon?',
    a: [
      'For a website favicon, 16×16, 32×32 and 48×48 are enough. Add 256×256 if you also want the icon to look sharp as a Windows app or shortcut icon. Each extra size makes the file larger, so only select what you need — and compress heavy source images with the ',
      lk('Image Compressor', '/image-compressor'),
      ' first.',
    ],
  },
  {
    q: 'Can I convert JPG, WebP, SVG or HEIC to ICO?',
    a: [
      'JPG, WebP and SVG files can be uploaded directly. For HEIC photos, convert them first with the ',
      lk('HEIC to JPG converter', '/heic-to-jpg'),
      ', or switch any other format to PNG with the ',
      lk('Image Converter', '/image-converter'),
      '.',
    ],
  },
  {
    q: 'Is my image uploaded to a server?',
    a: [
      'No. The PNG to ICO conversion runs entirely in your browser using the Canvas API, so your image is never uploaded, stored or shared.',
    ],
  },
  {
    q: 'Do I still need a favicon.ico if I already have PNG favicons?',
    a: [
      'It is still recommended. Many crawlers, older browsers and Windows features request /favicon.ico automatically, so keeping one in your site root avoids missing-icon errors. Pair it with PNG icons from the ',
      lk('Favicon Generator', '/favicon-generator'),
      ' for full coverage.',
    ],
  },
  {
    q: 'How do I add favicon.ico to my website?',
    a: [
      'Upload favicon.ico to the root of your site (in a Next.js App Router project, place it inside the app folder) and add a link tag to your head: <link rel="icon" href="/favicon.ico" sizes="any">. The ',
      lk('Meta Tag Generator', '/metatag-generator'),
      ' helps with the remaining head tags, and the ',
      lk('OG Preview Checker', '/og-preview-checker'),
      ' lets you verify how your page looks when shared.',
    ],
  },
];

const relatedTools = [
  { name: 'Favicon Generator', href: '/favicon-generator' },
  { name: 'Image Converter', href: '/image-converter' },
  { name: 'Image Resizer', href: '/image-resizer' },
  { name: 'Image Cropper', href: '/image-cropper' },
  { name: 'Image Compressor', href: '/image-compressor' },
  { name: 'Meta Tag Generator', href: '/metatag-generator' },
];

const htmlSnippet = `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="shortcut icon" href="/favicon.ico">`;

/* ───────────────────────── component ───────────────────────── */
export default function PngToIco() {
  const [sourceUrl, setSourceUrl] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [selected, setSelected] = useState([16, 32, 48]);
  const [fit, setFit] = useState('fit');
  const [results, setResults] = useState([]);
  const [icoBlob, setIcoBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const urlsRef = useRef([]);

  // Generate preview + ICO whenever image, sizes or fit mode change
  useEffect(() => {
    if (!sourceUrl || selected.length === 0) {
      urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      urlsRef.current = [];
      setResults([]);
      setIcoBlob(null);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const img = new Image();
        img.src = sourceUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error('load failed'));
        });

        const base = makeBase(img, fit);
        const sizes = [...selected].sort((a, b) => a - b);
        const entries = [];
        const previews = [];

        for (const size of sizes) {
          const canvas = scaleTo(base, size);
          const blob = await canvasToBlob(canvas);
          entries.push({ size, buf: await blob.arrayBuffer() });
          previews.push({ size, url: URL.createObjectURL(blob) });
        }

        if (cancelled) {
          previews.forEach((p) => URL.revokeObjectURL(p.url));
          return;
        }
        urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
        urlsRef.current = previews.map((p) => p.url);
        setResults(previews);
        setIcoBlob(buildIco(entries));
      } catch {
        if (!cancelled) {
          setError('Could not read this image. Please try a PNG, JPG, WebP or SVG file.');
          setResults([]);
          setIcoBlob(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();

    return () => {
      cancelled = true;
    };
  }, [sourceUrl, selected, fit]);

  useEffect(
    () => () => {
      urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    },
    []
  );

  const loadFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (PNG recommended).');
      return;
    }
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    const url = URL.createObjectURL(file);
    setFileInfo(null);
    const probe = new Image();
    probe.onload = () =>
      setFileInfo({ name: file.name, w: probe.naturalWidth, h: probe.naturalHeight });
    probe.src = url;
    setError('');
    setSourceUrl(url);
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    loadFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    loadFile(e.dataTransfer.files && e.dataTransfer.files[0]);
  };

  const toggleSize = (s) =>
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const downloadIco = () => {
    if (!icoBlob) return;
    const url = URL.createObjectURL(icoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favicon.ico';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(htmlSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const smallWarn =
    fileInfo &&
    fileInfo.w &&
    selected.length > 0 &&
    Math.max(fileInfo.w, fileInfo.h) < Math.max(...selected);

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-png-to-ico"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Convert PNG to ICO Online for Free',
            description:
              'Upload a PNG, choose the icon sizes you need and download a multi-size favicon.ico file with transparency preserved.',
            url: 'https://convertlinx.com/png-to-ico',
            totalTime: 'PT15S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'Square PNG image, 256x256px or larger' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx PNG to ICO Converter' }],
            step: [
              { '@type': 'HowToStep', name: 'Upload Your PNG', text: 'Select a square PNG logo or image — 256x256 pixels or larger works best.' },
              { '@type': 'HowToStep', name: 'Choose ICO Sizes', text: 'Pick a preset or select sizes from 16x16 to 256x256 and preview every icon.' },
              { '@type': 'HowToStep', name: 'Download favicon.ico', text: 'Download the multi-size .ico file and add it to your website root or use it as a Windows icon.' },
            ],
          }),
        }}
      />

      <main className="pti-page">
        {/* ── HERO ── */}
        <section className="pti-hero">
          <div className="pti-blob-1" />
          <div className="pti-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <Link href="/" className="pti-breadcrumb-link">Home</Link>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#0F766E' }}>PNG to ICO Converter</span>
            </div>
            <span className="pti-badge">Free Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              PNG to ICO <span className="pti-grad-text">Converter</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              <Rich parts={heroLine} />
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="pti-section-tool py-10 px-6">
          <div className="max-w-2xl mx-auto pti-fade-up">
            <div className="pti-tool-card">

              {/* Upload */}
              {!sourceUrl && (
                <label
                  className={`pti-upload-area block cursor-pointer ${dragOver ? 'is-dragover' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <div className="pti-upload-icon">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
                    Drop your PNG here or click to upload
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                    PNG, JPG, WebP or SVG · Square image recommended · 256×256px or larger
                  </p>
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              )}

              {error && !sourceUrl && <p className="pti-note">{error}</p>}

              {sourceUrl && (
                <>
                  {/* Source row */}
                  <div className="pti-source">
                    <img src={sourceUrl} alt="Uploaded PNG source" className="pti-source-img pti-checker" />
                    <div className="pti-source-info">
                      <p className="pti-source-name">{fileInfo ? fileInfo.name : 'Your image'}</p>
                      <p className="pti-source-dim">
                        {fileInfo && fileInfo.w ? `${fileInfo.w} × ${fileInfo.h} px` : ''}
                      </p>
                    </div>
                    <label className="pti-btn pti-btn-secondary cursor-pointer">
                      Change Image
                      <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    </label>
                  </div>

                  {/* Options */}
                  <div className="pti-options">
                    <div>
                      <p className="pti-opt-title">Quick presets</p>
                      <div className="pti-chip-row">
                        {PRESETS.map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setSelected(p.sizes)}
                            className={`pti-chip ${sizeKey(selected) === sizeKey(p.sizes) ? 'is-active' : ''}`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="pti-opt-title">ICO sizes</p>
                      <div className="pti-chip-row">
                        {ICO_SIZES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleSize(s)}
                            className={`pti-chip ${selected.includes(s) ? 'is-active' : ''}`}
                            aria-pressed={selected.includes(s)}
                          >
                            {s}×{s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="pti-opt-title">Non-square image</p>
                      <div className="pti-seg">
                        <button type="button" className={fit === 'fit' ? 'is-active' : ''} onClick={() => setFit('fit')}>
                          Fit (keep full image)
                        </button>
                        <button type="button" className={fit === 'crop' ? 'is-active' : ''} onClick={() => setFit('crop')}>
                          Crop to square
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && <p className="pti-note">{error}</p>}
                  {smallWarn && (
                    <p className="pti-note">
                      Your image is {fileInfo.w}×{fileInfo.h}px — sizes larger than that are upscaled and may look soft.
                    </p>
                  )}
                  {selected.length === 0 && (
                    <p className="pti-note">Select at least one icon size to generate your .ico file.</p>
                  )}

                  {/* Loading */}
                  {loading && (
                    <div className="text-center py-8">
                      <div className="pti-spinner mb-4" />
                      <p className="text-sm font-semibold" style={{ color: '#0F766E' }}>
                        Creating your ICO file...
                      </p>
                    </div>
                  )}

                  {/* Results */}
                  {!loading && results.length > 0 && (
                    <div className="mt-6">
                      <div className="pti-results-grid mb-4">
                        {results.map((g) => {
                          const shown = g.size > 64 ? 64 : g.size;
                          return (
                            <div key={g.size} className="pti-result-card">
                              <img
                                src={g.url}
                                alt={`${g.size}x${g.size} ICO preview`}
                                width={shown}
                                height={shown}
                                className="pti-checker"
                              />
                              <p className="pti-result-label">{g.size} × {g.size}</p>
                            </div>
                          );
                        })}
                      </div>

                      {icoBlob && (
                        <p className="pti-ico-meta mb-4">
                          favicon.ico · {results.length} {results.length === 1 ? 'size' : 'sizes'} · {(icoBlob.size / 1024).toFixed(1)} KB
                        </p>
                      )}

                      <button onClick={downloadIco} disabled={!icoBlob} className="pti-btn pti-btn-primary w-full justify-center mb-4">
                        <Download className="w-5 h-5" />
                        Download .ico
                      </button>

                      <div className="pti-snippet-box">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: '#0F766E' }}>
                            <Code2 className="w-3.5 h-3.5" />
                            HTML Code
                          </p>
                          <button onClick={handleCopySnippet} className="pti-copy-btn">
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre className="pti-code-block">{htmlSnippet}</pre>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No signup', 'Unlimited conversions', 'Transparency kept', '100% free', 'Nothing uploaded'].map((t, i) => (
                  <span key={i} className="pti-trust-item">
                    <span className="pti-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="pti-divider" />
        <section className="pti-section-main py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload Your PNG', desc: 'Select a square PNG logo or image — drag and drop works too.' },
                { num: '2', title: 'Choose ICO Sizes', desc: 'Pick a preset or select any sizes from 16×16 to 256×256 and preview them.' },
                { num: '3', title: 'Download .ico', desc: 'Get one multi-size favicon.ico file, ready for your site or Windows shortcut.' },
              ].map((s, i) => (
                <div key={i} className="pti-step-card">
                  <div className="pti-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="pti-divider" />
        <section className="pti-section-alt py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Layers className="w-6 h-6" />,
                  color: '#0F766E',
                  bg: 'rgba(20,184,166,0.12)',
                  title: 'Real Multi-Size ICO',
                  desc: 'One file with up to 7 embedded sizes, so Windows and browsers always pick the sharpest icon.',
                },
                {
                  icon: <Code2 className="w-6 h-6" />,
                  color: '#0284C7',
                  bg: 'rgba(2,132,199,0.10)',
                  title: 'Transparency Preserved',
                  desc: 'The alpha channel of your PNG is kept in every size — no white or black boxes around your logo.',
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  color: '#6366F1',
                  bg: 'rgba(99,102,241,0.10)',
                  title: 'Secure & Private',
                  desc: 'Everything runs in your browser with the Canvas API — your image is never uploaded to a server.',
                },
              ].map((b, i) => (
                <div key={i} className="pti-benefit-card">
                  <div className="pti-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="pti-divider" />
        <section className="pti-section-main py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                PNG to ICO Converter — Create a Multi-Size favicon.ico Online
              </h2>
              <p className="leading-7 text-sm"><Rich parts={seoIntro1} /></p>
              <p className="leading-7 text-sm mt-3"><Rich parts={seoIntro2} /></p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                How to Convert PNG to ICO Without Losing Transparency
              </h3>
              <p className="leading-7 text-sm"><Rich parts={seoHowTo} /></p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                Which ICO Sizes Should You Include in Your Icon?
              </h3>
              <p className="leading-7 text-sm"><Rich parts={seoSizes} /></p>
            </div>

            <div className="pti-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Problems This PNG to ICO Tool Solves
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {problems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="pti-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                PNG vs ICO Favicon: Do You Still Need a favicon.ico File?
              </h3>
              <p className="leading-7 text-sm"><Rich parts={seoPngVsIco} /></p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {whoUses.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#0F766E' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pti-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="pti-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Best Uses for This Tool
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {bestUses.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="pti-feature-dot" />
                    <span><Rich parts={Array.isArray(item) ? item : [item]} /></span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="pti-divider" />
        <section className="pti-section-alt py-16 px-6">
          <Script
            id="faq-schema-png-to-ico"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: { '@type': 'Answer', text: toPlain(faq.a) },
                })),
              }),
            }}
          />
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="pti-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0F766E' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    <Rich parts={faq.a} />
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="pti-divider" />
        <section className="pti-section-main py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedTools.map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ color: '#0F766E', borderColor: '#A7F3D0', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="pti-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4" style={{ color: '#1a1a2e' }}>
              Ready to convert PNG to ICO?
            </h2>
            <p className="mb-8 text-base" style={{ color: '#6B7280' }}>
              Takes 10 seconds. No signup. No upload.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="pti-cta-btn"
            >
              <Upload className="w-5 h-5" />
              Convert Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}