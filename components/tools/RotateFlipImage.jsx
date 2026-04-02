'use client';

import { useState, useRef, useCallback } from 'react';
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Download, Upload, Trash2, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import NextImage from 'next/image';
import '@/styles/RotateFlipImage.css';
import Link from 'next/link';

export default function RotateFlipImage() {
  const [image,     setImage]     = useState(null);   // original dataURL
  const [fileName,  setFileName]  = useState('');
  const [rotation,  setRotation]  = useState(0);      // degrees
  const [flipH,     setFlipH]     = useState(false);
  const [flipV,     setFlipV]     = useState(false);
  const [dragging,  setDragging]  = useState(false);
  const fileRef  = useRef(null);
  const canvasRef = useRef(null);

  // ── LOAD IMAGE ──
  const loadFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setFileName(file.name);
    setRotation(0); setFlipH(false); setFlipV(false);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const onFileChange = (e) => loadFile(e.target.files[0]);
  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    loadFile(e.dataTransfer.files[0]);
  };

  // ── TRANSFORMS ──
  const rotateRight = () => setRotation(r => (r + 90) % 360);
  const rotateLeft  = () => setRotation(r => (r - 90 + 360) % 360);
  const doFlipH     = () => setFlipH(f => !f);
  const doFlipV     = () => setFlipV(f => !f);
  const resetAll    = () => { setRotation(0); setFlipH(false); setFlipV(false); };
  const clearImage  = () => { setImage(null); setFileName(''); resetAll(); };

  // ── DOWNLOAD — draw to canvas then export ──
  const download = useCallback(() => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      const rad = (rotation * Math.PI) / 180;
      const isRotated90 = rotation === 90 || rotation === 270;
      const w = isRotated90 ? img.height : img.width;
      const h = isRotated90 ? img.width  : img.height;
      const canvas = canvasRef.current;
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(rad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
      const ext  = fileName.split('.').pop() || 'png';
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
      const link = document.createElement('a');
      link.download = `rotated-${fileName}`;
      link.href = canvas.toDataURL(mime, 0.95);
      link.click();
    };
    img.src = image;
  }, [image, rotation, flipH, flipV, fileName]);

  // ── CSS TRANSFORM for preview ──
  const previewTransform = `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`;

  const faqs = [
    { q: 'What image formats are supported?',            a: 'The tool supports PNG, JPG/JPEG, WebP, GIF, BMP, and most other common image formats that browsers can read.' },
    { q: 'Is my image uploaded to any server?',          a: 'No — everything runs entirely in your browser. Your image never leaves your device. Full privacy guaranteed.' },
    { q: 'Can I rotate by custom angles?',               a: 'Currently the tool rotates in 90-degree steps (right or left). This covers the most common use cases for correcting photo orientation.' },
    { q: 'What does flipping do?',                       a: 'Flip Horizontal mirrors the image left-to-right (like a mirror reflection). Flip Vertical mirrors it top-to-bottom. You can combine both with rotation.' },
    { q: 'What format is the downloaded image?',         a: 'The output matches your original — JPG files download as JPG, and all other formats download as PNG to preserve quality.' },
    { q: 'Does it work on mobile?',                      a: 'Yes — works perfectly on iPhone, Android, tablets, and desktops. You can upload directly from your camera roll.' },
    { q: 'Will the image lose quality?',                 a: 'For PNG output there is no quality loss. For JPG output a high quality setting (95%) is used, so any loss is minimal and invisible in practice.' },
    { q: 'Can I rotate multiple images?',                a: 'Currently one image at a time. Upload, transform, download, then upload the next image. Batch support may be added in future.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-rfi"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Rotate or Flip an Image Online for Free',
            description: 'Learn how to instantly rotate or flip any image online using the free ConvertLinx Rotate & Flip Image tool — no upload, no signup, 100% browser-based.',
            url: 'https://convertlinx.com/rotate-flip-image',
            totalTime: 'PT10S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'Any JPG, PNG, or WebP image file' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Rotate & Flip Image Tool' }],
            step: [
              { '@type': 'HowToStep', name: 'Upload your image', text: 'Click the upload area or drag and drop any image file — JPG, PNG, WebP, and more are all supported.' },
              { '@type': 'HowToStep', name: 'Rotate or flip', text: 'Use the Rotate Right, Rotate Left, Flip Horizontal, and Flip Vertical buttons to transform your image.' },
              { '@type': 'HowToStep', name: 'Download', text: 'Click Download Image to save the transformed image to your device.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-rfi"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',                  item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Rotate & Flip Image',   item: 'https://convertlinx.com/rotate-flip-image' },
            ],
          }),
        }}
      />

      {/* Hidden canvas for export */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <main className="rfi-page">

        {/* ── HERO ── */}
        <section className="rfi-hero">
          <div className="rfi-blob-1" />
          <div className="rfi-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="rfi-breadcrumb-link">Home</a>
              <span className="rfi-breadcrumb-sep">/</span>
              <span className="rfi-breadcrumb-current">Rotate &amp; Flip Image</span>
            </div>
            <span className="rfi-badge">Image Tool</span>
            <h1 className="rfi-hero-title">
              Rotate &amp; Flip <span className="rfi-grad-text">Image Online</span>
            </h1>
            <p className="rfi-hero-sub">
              Rotate any image 90°, 180°, or 270° and flip it horizontally or vertically —
              instantly, in your browser. No upload to servers, no signup, 100% free.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="rfi-section-main py-10 px-6">
          <div className="max-w-4xl mx-auto rfi-fade-up">
            <div className="rfi-tool-card">

              {!image ? (
                /* ── DROP ZONE ── */
                <div
                  className={`rfi-dropzone ${dragging ? 'dragging' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                >
                  <div className="rfi-drop-icon">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="rfi-drop-title">Drop your image here</p>
                  <p className="rfi-drop-sub">or click to browse — JPG, PNG, WebP, GIF supported</p>
                  <button className="rfi-btn rfi-btn-primary rfi-upload-btn" type="button">
                    <Upload className="w-4 h-4" /> Choose Image
                  </button>
                </div>
              ) : (
                /* ── EDITOR ── */
                <div className="rfi-editor">

                  {/* Preview */}
                  <div className="rfi-preview-wrap">
                    <div className="rfi-preview-frame">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt="Preview"
                        className="rfi-preview-img"
                        style={{ transform: previewTransform }}
                      />
                    </div>
                    <p className="rfi-filename">{fileName}</p>
                    <p className="rfi-transform-info">
                      Rotation: <strong>{rotation}°</strong>
                      {flipH && <span> · Flipped H</span>}
                      {flipV && <span> · Flipped V</span>}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="rfi-controls">

                    <div className="rfi-ctrl-section">
                      <p className="rfi-ctrl-label">Rotate</p>
                      <div className="rfi-ctrl-row">
                        <button className="rfi-ctrl-btn" onClick={rotateLeft} title="Rotate Left 90°">
                          <RotateCcw className="w-5 h-5" />
                          <span>Left 90°</span>
                        </button>
                        <button className="rfi-ctrl-btn" onClick={rotateRight} title="Rotate Right 90°">
                          <RotateCw className="w-5 h-5" />
                          <span>Right 90°</span>
                        </button>
                      </div>
                    </div>

                    <div className="rfi-ctrl-section">
                      <p className="rfi-ctrl-label">Flip</p>
                      <div className="rfi-ctrl-row">
                        <button className={`rfi-ctrl-btn ${flipH ? 'active' : ''}`} onClick={doFlipH} title="Flip Horizontal">
                          <FlipHorizontal className="w-5 h-5" />
                          <span>Horizontal</span>
                        </button>
                        <button className={`rfi-ctrl-btn ${flipV ? 'active' : ''}`} onClick={doFlipV} title="Flip Vertical">
                          <FlipVertical className="w-5 h-5" />
                          <span>Vertical</span>
                        </button>
                      </div>
                    </div>

                    <div className="rfi-ctrl-section">
                      <p className="rfi-ctrl-label">Quick Presets</p>
                      <div className="rfi-presets">
                        {[
                          { label: '180°',        action: () => setRotation(180) },
                          { label: 'Mirror',      action: () => { setFlipH(true); setFlipV(false); setRotation(0); } },
                          { label: 'Flip Up',     action: () => { setFlipV(true); setFlipH(false); setRotation(0); } },
                          { label: 'Reset',       action: resetAll },
                        ].map((p, i) => (
                          <button key={i} className="rfi-preset-btn" onClick={p.action}>{p.label}</button>
                        ))}
                      </div>
                    </div>

                    <div className="rfi-ctrl-actions">
                      <button className="rfi-btn rfi-btn-primary" onClick={download}>
                        <Download className="w-4 h-4" /> Download Image
                      </button>
                      <button className="rfi-btn rfi-btn-ghost" onClick={() => fileRef.current?.click()}>
                        <Upload className="w-4 h-4" /> New Image
                      </button>
                      <button className="rfi-btn rfi-btn-danger" onClick={clearImage}>
                        <Trash2 className="w-4 h-4" /> Clear
                      </button>
                    </div>

                  </div>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={onFileChange}
              />

              <div className="rfi-trust-strip">
                {['No upload to servers', 'Private & secure', 'Works offline', 'Nothing stored', '100% free'].map((t, i) => (
                  <span key={i} className="rfi-trust-item">
                    <span className="rfi-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="rfi-divider" />
        <section className="rfi-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="rfi-section-title text-center mb-12">3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload Your Image',    desc: 'Click the upload area or drag and drop any JPG, PNG, WebP, or GIF image directly from your device.' },
                { num: '2', title: 'Rotate or Flip',       desc: 'Use the Rotate Left, Rotate Right, Flip Horizontal, and Flip Vertical buttons to get the exact orientation you need.' },
                { num: '3', title: 'Download',             desc: 'Click Download Image to save the transformed image to your device — same format, no quality loss for PNG.' },
              ].map((s, i) => (
                <div key={i} className="rfi-step-card">
                  <div className="rfi-step-num">{s.num}</div>
                  <h3 className="rfi-card-title font-bold text-base mb-2">{s.title}</h3>
                  <p className="rfi-card-desc text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="rfi-divider" />
        <section className="rfi-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="rfi-section-title text-center mb-10">Why Use ConvertLinx Rotate &amp; Flip Tool?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <RotateCw className="w-6 h-6" />,
                  color: '#0369A1',
                  bg: 'rgba(3,105,161,0.08)',
                  title: 'Rotate in 90° Steps',
                  desc: 'Correct sideways or upside-down photos instantly. Rotate right or left to get the perfect orientation.',
                },
                {
                  icon: <FlipHorizontal className="w-6 h-6" />,
                  color: '#0891B2',
                  bg: 'rgba(8,145,178,0.08)',
                  title: 'Flip Horizontally & Vertically',
                  desc: 'Mirror your image left-to-right or top-to-bottom. Combine with rotation for any orientation.',
                },
                {
                  icon: <Download className="w-6 h-6" />,
                  color: '#0E7490',
                  bg: 'rgba(14,116,144,0.08)',
                  title: 'Download Instantly',
                  desc: 'No waiting, no processing queue. Your transformed image is ready to download in seconds.',
                },
              ].map((b, i) => (
                <div key={i} className="rfi-benefit-card">
                  <div className="rfi-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="rfi-card-title font-bold text-base mb-2">{b.title}</h3>
                  <p className="rfi-card-desc text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="rfi-divider" />
        <section className="rfi-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8">

            <div>
              <h2 className="rfi-section-title text-2xl mb-4">Why You Might Need to Rotate or Flip an Image</h2>
              <p className="rfi-body-text leading-7 text-sm">
                Cameras and phones sometimes save photos sideways or upside down due to how they were held
                when the shot was taken. Social media platforms, design tools, and websites all expect images
                to be in the correct orientation. Fixing this manually used to require desktop software — now
                it takes seconds in your browser.
              </p>
              <p className="rfi-body-text leading-7 text-sm mt-3">
                Flipping is equally common — mirroring a logo for a watermark, creating a symmetrical
                design element, or producing a reflection effect all require a horizontal or vertical flip.
                Our tool handles both rotate and flip in a single step with no quality loss for PNG images.
              </p>
            </div>

            <div className="rfi-seo-box">
              <h3 className="rfi-section-subtitle font-bold text-lg mb-4">Common Use Cases</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Fix sideways or upside-down photos from your phone',
                  'Mirror images for symmetrical design layouts',
                  'Correct scanned document orientation',
                  'Flip product photos for e-commerce listings',
                  'Rotate images before uploading to social media',
                  'Create reflection effects for graphic design',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="rfi-feature-dot" />
                    <span className="rfi-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="rfi-section-subtitle font-bold text-lg mb-4">Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Photographers — fix orientation before sharing',
                  'Designers — flip assets for layout symmetry',
                  'E-commerce sellers — correct product photo angles',
                  'Social media managers — fix image orientation fast',
                  'Students — correct scanned assignment images',
                  'Everyone — anyone with a sideways photo',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="rfi-arrow font-bold mt-0.5">→</span>
                    <span className="rfi-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rfi-seo-box">
              <h3 className="rfi-section-subtitle font-bold text-lg mb-4">Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Rotate left or right in 90° steps',
                  'Flip horizontally (mirror) and vertically',
                  'Combine rotation and flip freely',
                  'Quick presets: 180°, Mirror, Flip Up, Reset',
                  'Live preview before downloading',
                  'Download as PNG or JPG',
                  'Works fully offline in browser',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="rfi-feature-dot" />
                    <span className="rfi-body-text">{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="rfi-divider" />
        <section className="rfi-section-main py-16 px-6">
          <Script
            id="faq-schema-rfi"
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
            <h2 className="rfi-section-title text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="rfi-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="rfi-faq-question font-semibold text-sm">{faq.q}</span>
                    <ChevronDown className="rfi-faq-icon w-4 h-4 shrink-0" />
                  </summary>
                  <p className="rfi-faq-answer mt-3 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="rfi-divider" />
        <section className="rfi-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="rfi-section-title text-center mb-5">You may also find these free tools helpful</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Image to Text (OCR)', href: '/image-to-text'  },
                { name: 'Image Compressor',    href: '/image-compressor'},
                { name: 'Image to PDF',        href: '/image-to-pdf'   },
                { name: 'Lorem Ipsum',         href: '/lorem-ipsum'    },
                { name: 'Color Picker',        href: '/color-picker'   },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border rfi-related-link"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="rfi-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to fix your image orientation?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 5 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="rfi-cta-btn"
            >
              <RotateCw className="w-5 h-5" />
              Rotate Image Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}