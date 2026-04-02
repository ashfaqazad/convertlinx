'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Shield, Layers, Type, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/AddWatermark.css';
import Link from 'next/link';

const POSITIONS = [
  { id: 'top-left',     label: 'Top Left' },
  { id: 'top-center',   label: 'Top Center' },
  { id: 'top-right',    label: 'Top Right' },
  { id: 'mid-left',     label: 'Mid Left' },
  { id: 'center',       label: 'Center' },
  { id: 'mid-right',    label: 'Mid Right' },
  { id: 'bot-left',     label: 'Bot Left' },
  { id: 'bot-center',   label: 'Bot Center' },
  { id: 'bot-right',    label: 'Bot Right' },
];

export default function AddWatermark() {
  const [image,       setImage]       = useState(null);   // { src, name, width, height }
  const [wmType,      setWmType]      = useState('text'); // 'text' | 'logo'
  const [wmText,      setWmText]      = useState('© My Brand');
  const [wmLogo,      setWmLogo]      = useState(null);   // dataURL
  const [wmLogoName,  setWmLogoName]  = useState('');
  const [color,       setColor]       = useState('#ffffff');
  const [opacity,     setOpacity]     = useState(70);
  const [fontSize,    setFontSize]    = useState(32);
  const [logoSize,    setLogoSize]    = useState(20);     // % of image width
  const [position,    setPosition]    = useState('bot-right');
  const [rotation,    setRotation]    = useState(0);
  const [rendered,    setRendered]    = useState(false);

  const canvasRef  = useRef(null);
  const imgObjRef  = useRef(null);
  const logoObjRef = useRef(null);

  // ── Draw watermark on canvas ──
  const drawWatermark = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const img    = imgObjRef.current;

    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    const alpha = opacity / 100;
    ctx.globalAlpha = alpha;
    ctx.save();

    const PAD = Math.round(img.naturalWidth * 0.03);

    const getXY = (wmW, wmH) => {
      const W = canvas.width;
      const H = canvas.height;
      const map = {
        'top-left':    [PAD + wmW / 2,     PAD + wmH / 2],
        'top-center':  [W / 2,             PAD + wmH / 2],
        'top-right':   [W - PAD - wmW / 2, PAD + wmH / 2],
        'mid-left':    [PAD + wmW / 2,     H / 2],
        'center':      [W / 2,             H / 2],
        'mid-right':   [W - PAD - wmW / 2, H / 2],
        'bot-left':    [PAD + wmW / 2,     H - PAD - wmH / 2],
        'bot-center':  [W / 2,             H - PAD - wmH / 2],
        'bot-right':   [W - PAD - wmW / 2, H - PAD - wmH / 2],
      };
      return map[position] || [W / 2, H / 2];
    };

    if (wmType === 'text') {
      const fs = Math.round((img.naturalWidth / 800) * fontSize);
      ctx.font         = `bold ${fs}px Plus Jakarta Sans, sans-serif`;
      ctx.fillStyle    = color;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';

      const metrics = ctx.measureText(wmText);
      const wmW     = metrics.width;
      const wmH     = fs * 1.2;
      const [cx, cy] = getXY(wmW, wmH);

      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillText(wmText, 0, 0);

    } else if (wmType === 'logo' && logoObjRef.current) {
      const logo  = logoObjRef.current;
      const wmW   = Math.round(canvas.width * (logoSize / 100));
      const wmH   = Math.round((logo.naturalHeight / logo.naturalWidth) * wmW);
      const [cx, cy] = getXY(wmW, wmH);

      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(logo, -wmW / 2, -wmH / 2, wmW, wmH);
    }

    ctx.restore();
    ctx.globalAlpha = 1;
    setRendered(true);
  }, [image, wmType, wmText, wmLogo, color, opacity, fontSize, logoSize, position, rotation]);

  // Re-draw whenever settings change
  useEffect(() => {
    if (image) drawWatermark();
  }, [drawWatermark, image]);

  // ── Load main image ──
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgObjRef.current = img;
      setImage({ src: url, name: file.name });
      setRendered(false);
    };
    img.src = url;
  };

  // ── Load logo ──
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setWmLogoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const logo = new Image();
      logo.onload = () => {
        logoObjRef.current = logo;
        setWmLogo(ev.target.result);
      };
      logo.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // ── Download ──
  const handleDownload = () => {
    if (!canvasRef.current || !rendered) return;
    const ext  = image.name.split('.').pop().toLowerCase();
    const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
    const link = document.createElement('a');
    link.download = image.name.replace(/\.[^.]+$/, '') + '-watermarked.' + ext;
    link.href     = canvasRef.current.toDataURL(mime, 0.95);
    link.click();
  };

  const handleReset = () => {
    setImage(null);
    setRendered(false);
    imgObjRef.current  = null;
    logoObjRef.current = null;
    setWmLogo(null);
    setWmLogoName('');
  };

  const faqs = [
    { q: 'Is this watermark tool free?',                   a: 'Yes — completely free with no signup required. Add watermarks to unlimited images at any time.' },
    { q: 'Will the original image quality be affected?',   a: 'No. The tool processes your image at full original resolution using your browser\'s Canvas API. Output quality is preserved at 95% for JPEG and lossless for PNG.' },
    { q: 'Can I use my logo as a watermark?',              a: 'Yes — switch to the Logo tab and upload any PNG or image file as your watermark logo. You can control the size and position just like text watermarks.' },
    { q: 'What image formats are supported?',              a: 'JPG, JPEG, PNG, and WebP images are all supported for uploading. Output is saved in the same format as the original — JPG stays JPG, PNG stays PNG.' },
    { q: 'Can I control where the watermark appears?',     a: 'Yes — choose from 9 position options including all four corners, all four edge centers, and the exact center of the image.' },
    { q: 'Can I rotate the watermark text?',               a: 'Yes — use the Rotation setting to tilt the watermark at any angle from 0 to 360 degrees. Diagonal watermarks are popular for document protection.' },
    { q: 'Is my image uploaded to any server?',            a: 'No — everything runs entirely in your browser using the Canvas API. Your images never leave your device. Full privacy guaranteed.' },
    { q: 'Can I add a transparent watermark?',             a: 'Yes — use the Opacity slider to control how visible the watermark is. Lower opacity creates a subtle, semi-transparent watermark that does not distract from the image.' },
    { q: 'Does it work on mobile?',                        a: 'Yes — works on iPhone, Android, tablets, and desktops. The layout adapts to any screen size and the canvas processing works on all modern mobile browsers.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-aw"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Add a Watermark to an Image Online for Free',
            description: 'Learn how to add text or logo watermarks to images online for free using ConvertLinx — with full control over position, opacity, size, and rotation.',
            url: 'https://convertlinx.com/add-watermark',
            totalTime: 'PT30S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'Any JPG, PNG, or WebP image file' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Add Watermark Tool' }],
            step: [
              { '@type': 'HowToStep', name: 'Upload your image',       text: 'Click the upload area and select any JPG, PNG, or WebP image from your device.' },
              { '@type': 'HowToStep', name: 'Customise your watermark', text: 'Choose text or logo mode, set the text or upload a logo, then adjust position, opacity, size, color, and rotation.' },
              { '@type': 'HowToStep', name: 'Download the result',     text: 'Click Download to save your watermarked image at full original resolution.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-aw"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',               item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Add Watermark',      item: 'https://convertlinx.com/add-watermark' },
            ],
          }),
        }}
      />

      <main className="aw-page">

        {/* ── HERO ── */}
        <section className="aw-hero">
          <div className="aw-blob-1" />
          <div className="aw-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="aw-breadcrumb-link">Home</a>
              <span style={{ color: '#6EE7B7' }}>/</span>
              <span style={{ color: '#059669' }}>Add Watermark</span>
            </div>
            <span className="aw-badge">Image Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Add <span className="aw-grad-text">Watermark to Image</span> Free
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Add text or logo watermarks to any image online — free, instant, and fully
              browser-based. Control position, opacity, size, color, and rotation.
              No signup, no upload to servers. Your images stay on your device.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="aw-section-main py-10 px-6">
          <div className="max-w-2xl mx-auto aw-fade-up">
            <div className="aw-tool-card">

              {/* Step 1 — Upload image */}
              {!image ? (
                <>
                  <label className="aw-section-label">Step 1 — Upload Your Image</label>
                  <label className="aw-upload-area">
                    <div className="aw-upload-icon">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
                      Drop your image here or click to browse
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                      JPG, PNG, WebP supported · Processed entirely in your browser
                    </p>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </>
              ) : (
                <>
                  {/* Step 2 — Watermark settings */}
                  <label className="aw-section-label">Step 2 — Watermark Settings</label>

                  {/* Watermark type toggle */}
                  <div className="aw-type-wrap">
                    <button className={`aw-type-btn ${wmType === 'text' ? 'active' : ''}`} onClick={() => setWmType('text')}>
                      Text
                    </button>
                    <button className={`aw-type-btn ${wmType === 'logo' ? 'active' : ''}`} onClick={() => setWmType('logo')}>
                      Logo / Image
                    </button>
                  </div>

                  {/* Text settings */}
                  {wmType === 'text' && (
                    <>
                      <input
                        className="aw-input-text"
                        type="text"
                        placeholder="Enter watermark text…"
                        value={wmText}
                        onChange={e => setWmText(e.target.value)}
                      />
                      <div className="aw-settings-grid">
                        <div className="aw-field">
                          <span className="aw-field-label">Text Color</span>
                          <div className="aw-color-row">
                            <label className="aw-color-swatch">
                              <input type="color" value={color} onChange={e => setColor(e.target.value)} />
                            </label>
                            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'monospace' }}>{color}</span>
                          </div>
                        </div>
                        <div className="aw-field">
                          <span className="aw-field-label">Font Size — {fontSize}px</span>
                          <input type="range" className="aw-range" min={12} max={120} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Logo settings */}
                  {wmType === 'logo' && (
                    <>
                      <label className="aw-upload-area" style={{ padding: '24px', marginBottom: '16px' }}>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        <p className="font-semibold text-sm" style={{ color: '#1a1a2e' }}>
                          {wmLogoName ? `✓ ${wmLogoName}` : 'Click to upload your logo or watermark image'}
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>PNG with transparency recommended</p>
                      </label>
                      <div className="aw-field" style={{ marginBottom: '16px' }}>
                        <span className="aw-field-label">Logo Size — {logoSize}% of image width</span>
                        <input type="range" className="aw-range" min={5} max={60} value={logoSize} onChange={e => setLogoSize(Number(e.target.value))} />
                      </div>
                    </>
                  )}

                  {/* Common settings — opacity + rotation */}
                  <div className="aw-settings-grid" style={{ marginBottom: '20px' }}>
                    <div className="aw-field">
                      <span className="aw-field-label">Opacity — {opacity}%</span>
                      <input type="range" className="aw-range" min={10} max={100} value={opacity} onChange={e => setOpacity(Number(e.target.value))} />
                    </div>
                    <div className="aw-field">
                      <span className="aw-field-label">Rotation — {rotation}°</span>
                      <input type="range" className="aw-range" min={0} max={360} value={rotation} onChange={e => setRotation(Number(e.target.value))} />
                    </div>
                  </div>

                  {/* Position picker */}
                  <span className="aw-section-label">Watermark Position</span>
                  <div className="aw-position-grid">
                    {POSITIONS.map(p => (
                      <button
                        key={p.id}
                        className={`aw-pos-btn ${position === p.id ? 'active' : ''}`}
                        onClick={() => setPosition(p.id)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Canvas preview */}
                  <span className="aw-section-label">Preview</span>
                  <div className="aw-preview-wrap">
                    <canvas ref={canvasRef} className="aw-canvas" />
                  </div>

                  {/* Toolbar */}
                  <div className="aw-toolbar">
                    {rendered && (
                      <button className="aw-btn aw-btn-primary" onClick={handleDownload}>
                        <Download className="w-4 h-4" />
                        Download Image
                      </button>
                    )}
                    <button className="aw-btn aw-btn-ghost" onClick={handleReset}>
                      Upload New Image
                    </button>
                  </div>
                </>
              )}

              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No sign-up', 'Text & logo support', 'Full resolution', 'Nothing stored', '100% free'].map((t, i) => (
                  <span key={i} className="aw-trust-item">
                    <span className="aw-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="aw-divider" />
        <section className="aw-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload Your Image',        desc: 'Select any JPG, PNG, or WebP image from your device. It loads instantly — no server upload needed.' },
                { num: '2', title: 'Customise the Watermark',  desc: 'Choose text or logo mode. Adjust position, opacity, size, color, and rotation. Preview updates live.' },
                { num: '3', title: 'Download Full Resolution', desc: 'Hit Download and get your watermarked image at original quality — ready to use anywhere.' },
              ].map((s, i) => (
                <div key={i} className="aw-step-card">
                  <div className="aw-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="aw-divider" />
        <section className="aw-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx Watermark Tool?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Type className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(16,185,129,0.08)',
                  title: 'Text & Logo Watermarks',
                  desc: 'Add your brand name, copyright notice, or upload a PNG logo. Both modes give you full control over size, position, color, opacity, and rotation.',
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  color: '#3B82F6',
                  bg: 'rgba(59,130,246,0.08)',
                  title: 'Protect Your Work',
                  desc: 'Photographers, designers, and content creators use watermarks to protect images from unauthorised use and to keep their brand visible when photos are shared.',
                },
                {
                  icon: <Layers className="w-6 h-6" />,
                  color: '#7C3AED',
                  bg: 'rgba(124,58,237,0.08)',
                  title: 'Full Resolution Output',
                  desc: 'Canvas API processes your image at original dimensions. No resizing, no quality loss — the downloaded file is full resolution and ready for professional use.',
                },
              ].map((b, i) => (
                <div key={i} className="aw-benefit-card">
                  <div className="aw-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="aw-divider" />
        <section className="aw-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Why Add a Watermark to Your Images?
              </h2>
              <p className="leading-7 text-sm">
                A watermark is a visible text or logo overlaid on an image to identify its owner,
                protect copyright, or promote a brand. Photographers watermark portfolio shots to
                prevent theft, businesses watermark product photos before sharing them online, and
                content creators add their handle or logo to social media visuals so their work
                stays attributed even after it is shared or downloaded.
              </p>
              <p className="leading-7 text-sm mt-3">
                Adding watermarks used to require desktop software like Photoshop or Lightroom.
                Our free browser-based tool does the same job in seconds — no installation, no
                subscription, and your images never leave your device.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                Text vs Logo Watermark — Which Should You Use?
              </h3>
              <p className="leading-7 text-sm">
                <strong style={{ color: '#1a1a2e' }}>Text watermarks</strong> are great for copyright
                notices, photographer names, website URLs, or social media handles. They are quick
                to set up and easy to read at any size. Use a contrasting color and moderate opacity
                so the watermark is visible without overpowering the image.
              </p>
              <p className="leading-7 text-sm mt-3">
                <strong style={{ color: '#1a1a2e' }}>Logo watermarks</strong> work best for businesses
                and brands that want their visual identity on every image. Upload a PNG with a
                transparent background for the cleanest result. Position it in a corner at around
                15–20% of the image width for a professional, unobtrusive look.
              </p>
            </div>

            <div className="aw-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Use Cases for Adding Watermarks
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Protect portfolio photos from being used without credit',
                  'Brand product images before listing on online stores',
                  'Add copyright notice to social media and blog images',
                  'Watermark client proofs before final delivery',
                  'Add a logo to event photos before sharing publicly',
                  'Mark internal documents with confidential or draft labels',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="aw-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Photographers — protect portfolio and client preview images',
                  'Online sellers — brand product photos before uploading',
                  'Graphic designers — mark mockups and concepts for clients',
                  'Bloggers — add website URL to images before publishing',
                  'Social media creators — keep branding on shareable content',
                  'Everyone — protect any image you create or own',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#059669' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="aw-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Text watermark with custom color and font size',
                  'Logo watermark — upload any PNG or image',
                  '9 position options for precise placement',
                  'Opacity control from subtle to fully visible',
                  'Rotation — add diagonal or angled watermarks',
                  'Live canvas preview before downloading',
                  'Full original resolution output',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="aw-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Best Uses for an Online Watermark Tool
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Add copyright text to photography before sharing online',
                  'Place a logo watermark on product images for e-commerce',
                  'Watermark client proofs with a diagonal semi-transparent text',
                  'Brand social media images with a corner logo',
                  'Add a website URL watermark to blog post images',
                  'Mark draft documents with a "Confidential" text overlay',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="aw-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="aw-divider" />
        <section className="aw-section-main py-16 px-6">
          <Script
            id="faq-schema-aw"
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
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="aw-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#059669' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="aw-divider" />
        <section className="aw-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Image Compressor', href: '/image-compressor' },
                { name: 'Image Converter',  href: '/image-converter' },
                { name: 'Image Resizer',    href: '/image-resizer' },
                { name: 'Image Cropper',    href: '/image-cropper' },
                { name: 'Image to Text',    href: '/image-to-text' },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ color: '#059669', borderColor: '#A7F3D0', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="aw-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to protect your images?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 30 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="aw-cta-btn"
            >
              <Shield className="w-5 h-5" />
              Add Watermark Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}