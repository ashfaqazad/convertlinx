'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { Upload, Download, Layers, Shield, Code2, Check, Copy, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/FaviconGenerator.css';
import Link from 'next/link';

const SIZES = [
  { size: 16, label: 'Favicon 16×16', file: 'favicon-16x16.png' },
  { size: 32, label: 'Favicon 32×32', file: 'favicon-32x32.png' },
  { size: 48, label: 'Windows 48×48', file: 'favicon-48x48.png' },
  { size: 96, label: 'Android 96×96', file: 'favicon-96x96.png' },
  { size: 180, label: 'Apple Touch 180×180', file: 'apple-touch-icon.png' },
  { size: 192, label: 'Android Chrome 192×192', file: 'android-chrome-192x192.png' },
  { size: 512, label: 'Web App 512×512', file: 'android-chrome-512x512.png' },
];

export default function FaviconGenerator() {
  const [sourceImg, setSourceImg] = useState(null);
  const [sourcePreview, setSourcePreview] = useState('');
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  const htmlSnippet = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="manifest" href="/site.webmanifest">`;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGenerated([]);
    setSourceImg(file);
    setSourcePreview(URL.createObjectURL(file));
  };

  const generateFavicons = async () => {
    if (!sourceImg) return;
    setLoading(true);

    const img = new Image();
    img.src = sourcePreview;
    await new Promise((resolve) => { img.onload = resolve; });

    // Center-crop to square first
    const side = Math.min(img.width, img.height);
    const sx = (img.width - side) / 2;
    const sy = (img.height - side) / 2;

    const results = [];
    for (const { size, label, file } of SIZES) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      results.push({
        size, label, file,
        url: URL.createObjectURL(blob),
        blob,
      });
    }

    setGenerated(results);
    setLoading(false);
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    generated.forEach((g) => zip.file(g.file, g.blob));

    const manifest = {
      name: 'App',
      icons: [
        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
    };
    zip.file('site.webmanifest', JSON.stringify(manifest, null, 2));

    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'favicons.zip';
    a.click();
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

  const faqs = [
    { q: 'Is the Favicon Generator free?', a: 'Yes — completely free, unlimited favicon generation, no signup required.' },
    { q: 'What image should I upload?', a: 'A square image at least 512×512 pixels works best — logos, icons, or simple graphics with a clear subject produce the sharpest favicons.' },
    { q: 'What sizes does this tool generate?', a: 'It generates 16×16, 32×32, 48×48, 96×96, 180×180 (Apple Touch Icon), 192×192, and 512×512 PNG files — covering browsers, iOS home screen, and Android/PWA icons.' },
    { q: 'Do I get the HTML code to add the favicon to my site?', a: 'Yes — a ready-to-paste <link> tag snippet is generated automatically, including the web manifest reference.' },
    { q: 'What is the site.webmanifest file for?', a: 'It is required for Progressive Web Apps (PWAs) and lets Android Chrome show your icon when users add your site to their home screen.' },
    { q: 'Is my image uploaded to a server?', a: 'No — all resizing happens directly in your browser using the Canvas API. Your image is never uploaded or stored anywhere.' },
    { q: 'Why do I need multiple favicon sizes instead of just one?', a: 'Different browsers, operating systems, and devices request different icon sizes — using the correct set ensures your icon looks crisp everywhere instead of blurry or stretched.' },
    { q: 'Can I use a non-square image?', a: 'Yes — the tool automatically center-crops your image into a square before generating all favicon sizes.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-favicon"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Generate a Favicon for Your Website for Free',
            description: 'Upload a logo or image and generate every favicon size your website needs — 16x16 to 512x512 — plus ready-to-paste HTML code.',
            url: 'https://convertlinx.com/favicon-generator',
            totalTime: 'PT20S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'Square logo or image, 512x512px or larger' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Favicon Generator' }],
            step: [
              { '@type': 'HowToStep', name: 'Upload Your Image', text: 'Select a logo or image — square images work best.' },
              { '@type': 'HowToStep', name: 'Generate All Sizes', text: 'The tool creates every favicon size automatically, from 16x16 to 512x512.' },
              { '@type': 'HowToStep', name: 'Download & Add to Your Site', text: 'Download the ZIP file and paste the provided HTML code into your site\'s <head>.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-favicon"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Favicon Generator', item: 'https://convertlinx.com/favicon-generator' },
            ],
          }),
        }}
      />

      <main className="fg-page">

        {/* ── HERO ── */}
        <section className="fg-hero">
          <div className="fg-blob-1" />
          <div className="fg-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="fg-breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#059669' }}>Favicon Generator</span>
            </div>
            <span className="fg-badge">Free Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Favicon <span className="fg-grad-text">Generator</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Generate every favicon size your website needs — from a single image, in seconds.
              Includes browser icons, Apple Touch Icon, Android/PWA icons, web manifest, and
              ready-to-paste HTML code. No signup required.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="fg-section-main py-10 px-6">
          <div className="max-w-2xl mx-auto fg-fade-up">
            <div className="fg-tool-card">

              {/* Upload Area */}
              {!sourcePreview && (
                <label className="fg-upload-area block cursor-pointer mb-2">
                  <div className="fg-upload-icon">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
                    Drop your logo or image here
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                    JPG, PNG, WebP or SVG · Square image recommended · Min 512×512px
                  </p>
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              )}

              {/* Source Preview + Generate */}
              {sourcePreview && generated.length === 0 && (
                <div className="text-center mb-2">
                  <img src={sourcePreview} alt="Uploaded source" className="fg-source-preview" />
                  <div className="flex flex-wrap justify-center gap-3 mt-5">
                    <button onClick={generateFavicons} disabled={loading} className="fg-btn fg-btn-primary">
                      <Layers className="w-4 h-4" />
                      {loading ? 'Generating...' : 'Generate All Favicons'}
                    </button>
                    <label className="fg-btn fg-btn-secondary cursor-pointer">
                      Change Image
                      <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="text-center py-8">
                  <div className="fg-spinner mb-4" />
                  <p className="text-sm font-semibold" style={{ color: '#059669' }}>
                    Generating all sizes...
                  </p>
                </div>
              )}

              {/* Results Grid */}
              {!loading && generated.length > 0 && (
                <div>
                  <div className="fg-results-grid mb-6">
                    {generated.map((g, i) => (
                      <div key={i} className="fg-result-card">
                        <img src={g.url} alt={g.label} width={g.size > 64 ? 64 : g.size} height={g.size > 64 ? 64 : g.size} />
                        <p className="fg-result-label">{g.label}</p>
                      </div>
                    ))}
                  </div>

                  <button onClick={downloadAll} className="fg-btn fg-btn-primary w-full justify-center mb-4">
                    <Download className="w-5 h-5" />
                    Download All (.zip)
                  </button>

                  <div className="fg-snippet-box">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: '#059669' }}>
                        <Code2 className="w-3.5 h-3.5" />
                        HTML Code
                      </p>
                      <button onClick={handleCopySnippet} className="fg-copy-btn">
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="fg-code-block">{htmlSnippet}</pre>
                  </div>

                  <div className="text-center mt-5">
                    <label className="fg-btn fg-btn-secondary cursor-pointer">
                      Start Over With New Image
                      <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No signup', 'Unlimited generations', 'Nothing stored', '100% free', 'Includes HTML code'].map((t, i) => (
                  <span key={i} className="fg-trust-item">
                    <span className="fg-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="fg-divider" />
        <section className="fg-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload Your Logo', desc: 'Select a square logo or image — the tool auto-crops if it isn\'t already square.' },
                { num: '2', title: 'Generate All Sizes', desc: 'One click creates all 7 favicon sizes needed for browsers, iOS, and Android/PWA.' },
                { num: '3', title: 'Download & Install', desc: 'Download the ZIP and paste the ready-made HTML code into your site\'s <head>.' },
              ].map((s, i) => (
                <div key={i} className="fg-step-card">
                  <div className="fg-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="fg-divider" />
        <section className="fg-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Layers className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'Every Size, One Click',
                  desc: 'Get all 7 favicon sizes — browser tabs, Apple Touch Icon, Android and PWA icons — generated together, no manual resizing.',
                },
                {
                  icon: <Code2 className="w-6 h-6" />,
                  color: '#0284C7',
                  bg: 'rgba(2,132,199,0.08)',
                  title: 'Ready-to-Paste HTML',
                  desc: 'No guessing which <link> tags to use — copy the exact code block and paste it straight into your site\'s <head>.',
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  color: '#6366F1',
                  bg: 'rgba(99,102,241,0.08)',
                  title: 'Secure & Private',
                  desc: 'All resizing happens directly in your browser using the Canvas API — your logo is never uploaded to a server.',
                },
              ].map((b, i) => (
                <div key={i} className="fg-benefit-card">
                  <div className="fg-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="fg-divider" />
        <section className="fg-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Why Every Website Needs a Favicon
              </h2>
              <p className="leading-7 text-sm">
                A favicon is the small icon shown in browser tabs, bookmarks, and search results next
                to your site's title. It might look tiny, but it plays a big role in brand recognition —
                visitors with multiple tabs open can instantly spot your site, and a missing favicon
                (shown as a blank page icon) makes a site look unfinished or untrustworthy.
              </p>
              <p className="leading-7 text-sm mt-3">
                Modern websites also need favicon variants beyond the classic 16×16 browser tab icon —
                Apple Touch Icons for iOS home screens, Android Chrome icons for home screen shortcuts,
                and larger icons for Progressive Web Apps (PWAs). This tool generates the full set at once.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                Which Favicon Sizes Do You Actually Need?
              </h3>
              <p className="leading-7 text-sm">
                16×16 and 32×32 cover standard browser tabs and bookmarks. 48×48 is used by Windows
                site shortcuts. 96×96 and 192×192 are used by Android Chrome. 180×180 is Apple's
                required size for the iOS home screen (Apple Touch Icon). 512×512 is the high-resolution
                icon used for Progressive Web Apps and app splash screens — this tool generates all of them.
              </p>
            </div>

            <div className="fg-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Problems This Tool Solves
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Blank or broken favicon showing in browser tabs',
                  'Blurry icon on iPhone/Android home screen shortcuts',
                  'No idea which favicon sizes are actually required',
                  'Manually resizing a logo into 7 different files',
                  'Missing web manifest for PWA/Add to Home Screen support',
                  'Need the exact HTML <link> tags without searching docs',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="fg-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Web developers — generate a full favicon set in seconds',
                  'Bloggers — add a professional favicon without design tools',
                  'Startups — turn a new logo into all required icon sizes',
                  'Agencies — quickly deliver favicons for client websites',
                  'No-code builders — get files ready for Webflow, WordPress, Shopify',
                  'Anyone launching a site who needs a proper browser icon',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#059669' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="fg-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Free, unlimited favicon generation',
                  'Generates 7 sizes: 16 to 512px',
                  'Auto center-crop for non-square images',
                  'Includes site.webmanifest for PWA support',
                  'Ready-to-paste HTML <link> code',
                  'One-click ZIP download',
                  'Works on mobile & desktop',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="fg-feature-dot" />
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
                {[
                  'Convert a logo into a complete favicon package',
                  'Fix a missing or broken favicon on an existing site',
                  'Prepare icons for a WordPress, Shopify, or Webflow site',
                  'Generate Apple Touch Icon for an iOS web app',
                  'Create Android/PWA icons for "Add to Home Screen"',
                  'Get correct HTML code without reading documentation',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="fg-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="fg-divider" />
        <section className="fg-section-main py-16 px-6">
          <Script
            id="faq-schema-favicon"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
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
                <details key={i} className="fg-faq-item">
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
        <hr className="fg-divider" />
        <section className="fg-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Meta Tag Generator', href: '/metatag-generator' },
                { name: 'Image Resizer', href: '/image-resizer' },
                { name: 'Image Converter', href: '/image-converter' },
                { name: 'Image Cropper', href: '/image-cropper' },
                { name: 'Image Compressor', href: '/image-compressor' },
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
        <section className="fg-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to generate your favicon?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 10 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fg-cta-btn"
            >
              <Upload className="w-5 h-5" />
              Generate Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}



