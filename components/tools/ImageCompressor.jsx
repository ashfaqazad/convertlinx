'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, Download, Zap, Shield, Image as ImageIcon, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/ImageCompressor.css';
import Link from 'next/link';

export default function ImageCompressor() {
  const [originals, setOriginals] = useState([]);
  const [compresseds, setCompresseds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(0);
  const [compressionLevel, setCompression] = useState(1); // 0:Low 1:Medium 2:High

  const compressionOptions = {
    0: { initialQuality: 0.95, maxSizeMB: 2 },
    1: { initialQuality: 0.8, maxSizeMB: 1 },
    2: { initialQuality: 0.6, maxSizeMB: 0.5 },
  };

  const levels = [
    { label: 'Low', sub: 'Best Quality' },
    { label: 'Medium', sub: 'Balanced' },
    { label: 'High', sub: 'Max Savings' },
  ];

  const handleFile = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setOriginals(files);
    setCompresseds([]);
    setLoading(true);

    const opts = {
      maxSizeMB: compressionOptions[compressionLevel].maxSizeMB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: compressionOptions[compressionLevel].initialQuality,
    };

    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const compressed = await imageCompression(file, opts);
          return {
            file: compressed,
            originalSize: (file.size / 1024 / 1024).toFixed(2),
            compressedSize: (compressed.size / 1024 / 1024).toFixed(2),
            saved: Math.round(((file.size - compressed.size) / file.size) * 100),
            name: file.name.split('.')[0],
            url: URL.createObjectURL(compressed),
            origUrl: URL.createObjectURL(file),
          };
        })
      );
      const avg = Math.round(results.reduce((s, c) => s + c.saved, 0) / results.length);
      setSaved(avg);
      setCompresseds(results);
    } catch (err) {
      alert('Error compressing image(s). Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  const downloadAll = () => {
    compresseds.forEach((c) => {
      const a = document.createElement('a');
      a.href = c.url;
      a.download = `compressed-${c.name}.webp`;
      a.click();
    });
  };

  const isSingle = originals.length === 1 && compresseds.length === 1;
  const isBatch = originals.length > 1;

  const faqs = [
    { q: 'Is the Image Compressor free?', a: 'Yes — completely free with unlimited compression and no hidden charges.' },
    { q: 'Which image formats are supported?', a: 'JPG, PNG, WebP, HEIC, TIFF, SVG, BMP, AVIF and more — anything supported by your browser.' },
    { q: 'Will compression reduce image quality?', a: 'Slightly — use Low for best quality, Medium for a balanced result, and High for maximum file size reduction.' },
    { q: 'How much can I reduce image file size?', a: 'Depends on the image type and content — in many cases up to 90% reduction is possible, especially for large JPG and PNG photos.' },
    { q: 'Can I compress multiple images at once?', a: 'Yes — batch upload is fully supported. Upload multiple files and download them all at once.' },
    { q: 'Are my images uploaded to a server?', a: 'No — all compression happens entirely in your browser. Your images are never uploaded or stored anywhere.' },
    { q: 'Why compress images for a website?', a: 'Smaller images load faster, improve Google PageSpeed scores, reduce bandwidth usage, and help your website rank better in search results.' },
    { q: 'What is WebP and why does the tool use it?', a: 'WebP is a modern image format developed by Google that offers significantly smaller file sizes compared to JPG and PNG while keeping good visual quality. It is supported by all modern browsers.' },
    { q: 'Can I compress iPhone HEIC photos with this tool?', a: 'Yes — HEIC files from iPhone and iPad are supported. The tool compresses and converts them to WebP automatically for maximum compatibility and smaller file size.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-img-comp"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Compress Images Online for Free',
            description: 'Reduce image file size up to 90% while maintaining visual quality. Works with JPG, PNG, WebP, HEIC, TIFF, SVG and more.',
            url: 'https://convertlinx.com/image-compressor',
            totalTime: 'PT30S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'JPG, PNG, WebP, HEIC or other image file' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Image Compressor' }],
            step: [
              { '@type': 'HowToStep', name: 'Upload Images', text: 'Select one or more image files — JPG, PNG, WebP, HEIC, TIFF, SVG or other formats.' },
              { '@type': 'HowToStep', name: 'Choose Compression Level', text: 'Pick Low, Medium, or High compression based on your quality and size needs.' },
              { '@type': 'HowToStep', name: 'Download Compressed Images', text: 'Download your smaller optimized images — single or batch download available.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-img"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Image Compressor', item: 'https://convertlinx.com/image-compressor' },
            ],
          }),
        }}
      />

      <main className="ic-page">

        {/* ── HERO ── */}
        <section className="ic-hero">
          <div className="ic-blob-1" />
          <div className="ic-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="ic-breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#059669' }}>Image Compressor</span>
            </div>
            <span className="ic-badge">Free Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Image <span className="ic-grad-text">Compressor</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Compress images online free — reduce JPG, PNG, WebP, HEIC, TIFF, SVG file size up to 90%
              without losing quality. Optimize images for websites, speed up page loading, save storage,
              and share photos faster. Batch compression supported. No signup required.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="ic-section-main py-10 px-6">
          <div className="max-w-2xl mx-auto ic-fade-up">
            <div className="ic-tool-card">

              {/* Compression Level */}
              <div className="mb-7">
                <label className="block mb-3" style={{ color: '#059669', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                  Compression Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {levels.map((lv, idx) => (
                    <label key={idx} className={`ic-level-option ${compressionLevel === idx ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="level"
                        value={idx}
                        checked={compressionLevel === idx}
                        onChange={() => setCompression(idx)}
                        className="ic-level-radio"
                      />
                      <div>
                        <div className="ic-level-label">{lv.label}</div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{lv.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Upload Area */}
              <label className="ic-upload-area block cursor-pointer mb-7">
                <div className="ic-upload-icon">
                  <Upload className="w-7 h-7" />
                </div>
                <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
                  Drop images here or click to upload
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                  JPG, PNG, WebP, HEIC, AVIF, TIFF, SVG, BMP & more · Max 100MB · Batch OK
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  multiple
                  className="hidden"
                />
              </label>

              {/* Loading */}
              {loading && (
                <div className="text-center py-8">
                  <div className="ic-spinner mb-4" />
                  <p className="text-sm font-semibold" style={{ color: '#059669' }}>
                    Compressing{isBatch ? ' batch' : ''}...
                  </p>
                </div>
              )}

              {/* Single Preview */}
              {!loading && isSingle && compresseds[0] && (
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  <div className="ic-preview-card text-center">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Original</p>
                    <img src={compresseds[0].origUrl} alt="Original" className="w-full rounded-xl mb-3 object-cover" />
                    <p className="font-bold text-lg" style={{ color: '#1a1a2e' }}>{compresseds[0].originalSize} MB</p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>Before</p>
                  </div>
                  <div className="ic-preview-card compressed text-center">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>Compressed</p>
                    <img src={compresseds[0].url} alt="Compressed" className="w-full rounded-xl mb-3 object-cover" />
                    <div className="ic-savings-badge">{saved}% Smaller!</div>
                    <p className="font-bold text-lg" style={{ color: '#1a1a2e' }}>{compresseds[0].compressedSize} MB</p>
                    <p className="text-xs mb-4" style={{ color: '#9CA3AF' }}>After</p>
                    <a
                      href={compresseds[0].url}
                      download={`compressed-${compresseds[0].name}.webp`}
                      className="ic-dl-btn w-full justify-center"
                    >
                      <Download className="w-5 h-5" />
                      Download Optimized
                    </a>
                  </div>
                </div>
              )}

              {/* Batch Result */}
              {!loading && isBatch && compresseds.length > 0 && (
                <div className="ic-batch-card mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#059669' }}>
                    Batch Complete — {compresseds.length} Images
                  </p>
                  <div className="ic-savings-badge mb-4">Average {saved}% Smaller!</div>
                  <button onClick={downloadAll} className="ic-dl-btn w-full justify-center">
                    <Download className="w-5 h-5" />
                    Download All Optimized Images
                  </button>
                </div>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-2">
                {['No signup', 'Unlimited compression', 'Nothing stored', '100% free', 'Browser-based'].map((t, i) => (
                  <span key={i} className="ic-trust-item">
                    <span className="ic-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="ic-divider" />
        <section className="ic-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload Images', desc: 'Drop or select JPG, PNG, HEIC, TIFF, SVG — or batch upload multiple files at once.' },
                { num: '2', title: 'Choose Level & Compress', desc: 'Pick Low, Medium, or High compression quality and let the tool do the work instantly.' },
                { num: '3', title: 'Download', desc: 'Save your smaller optimized images — single file or all at once with batch download.' },
              ].map((s, i) => (
                <div key={i} className="ic-step-card">
                  <div className="ic-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="ic-divider" />
        <section className="ic-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'Up to 90% Smaller',
                  desc: 'Reduce image file size dramatically while keeping visuals sharp — ideal for fast websites, email attachments, and storage savings.',
                },
                {
                  icon: <ImageIcon className="w-6 h-6" />,
                  color: '#0284C7',
                  bg: 'rgba(2,132,199,0.08)',
                  title: 'Multi-Format Support',
                  desc: 'Compress JPG, PNG, WebP, HEIC (iPhone photos), TIFF, SVG and more. Auto-converts to WebP for the best balance of size and quality.',
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  color: '#6366F1',
                  bg: 'rgba(99,102,241,0.08)',
                  title: 'Secure & Private',
                  desc: 'All compression happens directly in your browser — nothing is uploaded to any server. Batch compression also supported.',
                },
              ].map((b, i) => (
                <div key={i} className="ic-benefit-card">
                  <div className="ic-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="ic-divider" />
        <section className="ic-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Why Image Compression Matters
              </h2>
              <p className="leading-7 text-sm">
                Large image files slow down websites, take up storage space, and are harder to share by
                email or WhatsApp. Compressing images reduces their file size without making them look
                blurry or low quality — which is why image compression is one of the most important
                steps for web performance, SEO, and everyday use.
              </p>
              <p className="leading-7 text-sm mt-3">
                Whether you are a web developer optimizing a website, a student uploading photos to a
                school portal, or someone who wants to share images faster on WhatsApp, reducing image
                size with a free tool like this saves time and data without needing any software.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                JPG vs PNG vs WebP — Which Format to Use?
              </h3>
              <p className="leading-7 text-sm">
                JPG is best for photos and realistic images where small file size matters more than
                perfect sharpness. PNG is better for logos, screenshots, and images with transparent
                backgrounds where quality must be exact. WebP is a modern format from Google that
                gives smaller file sizes than both JPG and PNG while keeping good visual quality —
                which is why this tool auto-converts to WebP for maximum compression results.
              </p>
            </div>

            <div className="ic-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Problems This Tool Solves
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Images too large to upload to websites or forms',
                  'Slow website loading due to heavy image files',
                  'PNG or JPG photos too big to send by email',
                  'Need to reduce image size without losing quality',
                  'HEIC iPhone photos need compression before sharing',
                  'Need batch compression for multiple images at once',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="ic-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Website owners — faster loading and better SEO scores',
                  'Designers — lightweight exports for web and app use',
                  'Students — compress photos for school portals and assignments',
                  'Marketers — smaller images for ads, emails, and landing pages',
                  'Online sellers — upload product images faster on e-commerce sites',
                  'Everyone — save storage and share images faster on WhatsApp or email',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#059669' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ic-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Free, unlimited compression',
                  'JPG, PNG, WebP, HEIC, TIFF, SVG & more',
                  'Low / Medium / High quality levels',
                  'Auto-converts to WebP for max savings',
                  'Before/after size comparison',
                  'Batch upload and download support',
                  'Works on mobile & desktop',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="ic-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Best Uses for Image Compression
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Compress JPG photos for faster website loading',
                  'Reduce PNG file size for web and app design',
                  'Compress iPhone HEIC photos before uploading',
                  'Optimize images for Google PageSpeed and SEO',
                  'Shrink images for email and WhatsApp attachments',
                  'Batch compress product photos for e-commerce listings',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="ic-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="ic-divider" />
        <section className="ic-section-main py-16 px-6">
          <Script
            id="faq-schema-img"
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
                <details key={i} className="ic-faq-item">
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
        <hr className="ic-divider" />
        <section className="ic-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Image Converter', href: '/image-converter' },
                { name: 'Image Resizer', href: '/image-resizer' },
                { name: 'HEIC to JPG', href: '/heic-to-jpg' },
                { name: 'Image to Text', href: '/image-to-text' },
                { name: 'Image Cropper', href: '/image-cropper' },
                { name: 'QR Generator', href: '/qr-generator' },
                { name: 'YouTube Thumbnail', href: '/youtube-thumbnail' },
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
        <section className="ic-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to compress your images?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 5 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="ic-cta-btn"
            >
              <Upload className="w-5 h-5" />
              Compress Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}

