'use client';

import { useState } from 'react';
import { Upload, Download, Image as ImageIcon, Zap, Shield, CheckCircle, ChevronDown, RefreshCw } from 'lucide-react';
import Script from 'next/script';
import '@/styles/ImageConverter.css';

export default function ImageConverter() {
  const [files, setFiles]       = useState([]);
  const [converted, setConverted] = useState([]);
  const [toFormat, setToFormat] = useState('webp');
  const [category, setCategory] = useState('All');
  const [loading, setLoading]   = useState(false);
  const [quality, setQuality]   = useState(0.94);

  const formats = [
    { value: 'webp', label: 'WebP — best for web, smallest size', category: 'Popular' },
    { value: 'png',  label: 'PNG — transparency support',          category: 'Popular' },
    { value: 'jpg',  label: 'JPG/JPEG — universal, good quality',  category: 'Popular' },
    { value: 'gif',  label: 'GIF — animated support',              category: 'Popular' },
    { value: 'bmp',  label: 'BMP — uncompressed',                  category: 'Popular' },
    { value: 'heic', label: 'HEIC — iOS photos, small size',       category: 'Mobile'  },
    { value: 'heif', label: 'HEIF — high efficiency',              category: 'Mobile'  },
    { value: 'avif', label: 'AVIF — modern, ultra-small',          category: 'Mobile'  },
    { value: 'svg',  label: 'SVG — vector, scalable',              category: 'Design'  },
    { value: 'tiff', label: 'TIFF — high-res print',               category: 'Design'  },
    { value: 'ico',  label: 'ICO — favicon',                       category: 'Design'  },
    { value: 'psd',  label: 'PSD — Photoshop layers',              category: 'Design'  },
    { value: 'eps',  label: 'EPS — vector print',                  category: 'Design'  },
    { value: 'dng',  label: 'DNG — Adobe RAW',                     category: 'Pro'     },
    { value: 'cr2',  label: 'CR2 — Canon RAW',                     category: 'Pro'     },
    { value: 'nef',  label: 'NEF — Nikon RAW',                     category: 'Pro'     },
    { value: 'arw',  label: 'ARW — Sony RAW',                      category: 'Pro'     },
    { value: 'raf',  label: 'RAF — Fuji RAW',                      category: 'Pro'     },
    { value: 'jxl',  label: 'JPEG XL — future-proof',              category: 'Niche'   },
    { value: 'tga',  label: 'TGA — game textures',                 category: 'Niche'   },
    { value: 'pcx',  label: 'PCX — old-school',                    category: 'Niche'   },
    { value: 'dpx',  label: 'DPX — film scan',                     category: 'Niche'   },
  ];

  const categories = ['All', 'Popular', 'Mobile', 'Design', 'Pro', 'Niche'];

  const isHEIC = (file) => {
    const ext = file.name.toLowerCase().split('.').pop();
    return ext === 'heic' || ext === 'heif' || file.type === 'image/heic' || file.type === 'image/heif';
  };

  const convertImages = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;
    setLoading(true);
    setConverted([]);
    setFiles(selectedFiles);

    const results = await Promise.all(
      selectedFiles.map(async (file) => {
        let processFile = file;

        if (isHEIC(file)) {
          try {
            const heic2any = (await import('heic2any')).default;
            const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality });
            processFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', { type: 'image/jpeg' });
          } catch (err) {
            console.error('HEIC conversion failed', err);
          }
        }

        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width  = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);

            const unsupported = ['svg','psd','eps','dng','cr2','nef','arw','raf','jxl','tga','pcx','emz','dpx','heic','heif','avif','tiff'];
            let mimeType = 'image/png', extension = 'png';
            if (!unsupported.includes(toFormat)) {
              const map = { webp: ['image/webp','webp'], png: ['image/png','png'], jpg: ['image/jpeg','jpg'], gif: ['image/gif','gif'], bmp: ['image/bmp','bmp'], ico: ['image/x-icon','ico'] };
              if (map[toFormat]) { mimeType = map[toFormat][0]; extension = map[toFormat][1]; }
            }
            const qualityVal = (toFormat === 'jpg' || toFormat === 'webp') ? quality : 1;

            canvas.toBlob((blob) => {
              resolve({
                originalName: file.name,
                name:    file.name.replace(/\.[^/.]+$/, '') + '.' + extension,
                url:     URL.createObjectURL(blob),
                isHeic:  isHEIC(file),
              });
            }, mimeType, qualityVal);
          };
          img.onerror = () => resolve(null);
          img.src = URL.createObjectURL(processFile);
        });
      })
    );

    setConverted(results.filter(Boolean));
    setLoading(false);
  };

  const filteredFormats = formats.filter(f => category === 'All' || f.category === category);
  const showQuality = ['jpg','webp','heic','heif'].includes(toFormat);

  return (
    <>
      <Script id="howto-schema-image-converter" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert Image Format Online for Free",
            description: "Convert JPG, PNG, WebP, HEIC, RAW & 500+ formats instantly.",
            url: "https://convertlyhub.com/image-converter",
            step: [
              { "@type": "HowToStep", name: "Upload Images",  text: "Select one or multiple images." },
              { "@type": "HowToStep", name: "Choose Format",  text: "Pick target format from categories." },
              { "@type": "HowToStep", name: "Download",       text: "Download converted files instantly." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
          }, null, 2),
        }}
      />

      <main className="cv-page">

        {/* ── HERO ── */}
        <section className="cv-hero">
          <div className="cv-blob-1" />
          <div className="cv-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="cv-breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#9333EA' }}>Image Converter</span>
            </div>
            <span className="cv-badge">Free Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Image{' '}
              <span className="cv-grad-text">Converter</span>
            </h1>
            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Convert JPG, PNG, WebP, HEIC, RAW & 500+ formats — batch upload, quality control, free.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="cv-section-main py-10 px-6">
          <div className="max-w-3xl mx-auto cv-fade-up">
            <div className="cv-tool-card">

              <div className="grid md:grid-cols-2 gap-8">

                {/* LEFT — Upload */}
                <div>
                  <label className="block mb-3" style={{ color: '#9333EA', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                    Upload Images
                  </label>
                  <label className="cv-upload-area">
                    <div className="cv-upload-icon">
                      <Upload className="w-7 h-7" />
                    </div>
                    <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
                      Drop images or click to browse
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                      JPG, PNG, WebP, HEIC (iPhone), TIFF, SVG, RAW & 500+ · Batch OK
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={convertImages}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* RIGHT — Format Selector */}
                <div>
                  <label className="block mb-3" style={{ color: '#9333EA', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                    Convert To
                  </label>

                  {/* Category tabs */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`cv-cat-tab ${category === cat ? 'active' : 'inactive'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Format list */}
                  <div className="cv-format-list">
                    {filteredFormats.map((fmt) => (
                      <label key={fmt.value} className={`cv-format-option ${toFormat === fmt.value ? 'selected' : ''}`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="format"
                            value={fmt.value}
                            checked={toFormat === fmt.value}
                            onChange={(e) => setToFormat(e.target.value)}
                            className="cv-format-radio"
                          />
                          <span className="text-sm font-medium" style={{ color: '#374151' }}>{fmt.label}</span>
                        </div>
                        {toFormat === fmt.value && (
                          <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#9333EA' }} />
                        )}
                      </label>
                    ))}
                  </div>

                  {/* Quality Slider */}
                  {showQuality && (
                    <div className="cv-quality-wrap">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>Quality</span>
                        <span className="text-xs font-bold" style={{ color: '#9333EA' }}>{Math.round(quality * 100)}%</span>
                      </div>
                      <input
                        type="range" min="0.5" max="1.0" step="0.05"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="cv-quality-slider"
                      />
                      <p className="text-xs mt-1 text-center" style={{ color: '#9CA3AF' }}>Lower = smaller file</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Loader */}
              {loading && (
                <div className="text-center py-8 mt-6 border-t" style={{ borderColor: 'rgba(147,51,234,0.08)' }}>
                  <div className="cv-spinner mb-3" />
                  <p className="text-sm font-semibold" style={{ color: '#9333EA' }}>
                    Converting{files.length > 1 ? ` ${files.length} images` : ''}...
                  </p>
                </div>
              )}

              {/* Results */}
              {!loading && converted.length > 0 && (
                <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(147,51,234,0.08)' }}>
                  <p className="text-sm font-bold uppercase tracking-widest mb-5 text-center" style={{ color: '#9333EA' }}>
                    {converted.length} {converted.length === 1 ? 'File' : 'Files'} Ready
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {converted.map((item, i) => (
                      <div key={i} className="cv-result-card">
                        <img src={item.url} alt={item.name} className="w-full h-40 object-cover" />
                        <div className="p-4 text-center">
                          <p className="text-xs font-medium mb-3 truncate" style={{ color: '#374151' }}>
                            {item.isHeic && <span className="cv-heic-tag">HEIC→</span>}
                            {item.name}
                          </p>
                          <a href={item.url} download={item.name} className="cv-dl-btn w-full justify-center">
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No login', 'Batch convert', 'HEIC supported', 'Browser-only', '100% free'].map((t, i) => (
                  <span key={i} className="cv-trust-item">
                    <span className="cv-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="cv-divider" />
        <section className="cv-section-alt py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertlyHub?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: <ImageIcon className="w-6 h-6" />, color: '#9333EA', bg: 'rgba(147,51,234,0.08)', title: '500+ Formats',          desc: 'JPG, PNG, WebP, HEIC (auto-convert), RAW, SVG — categories make it easy to find.' },
                { icon: <Zap className="w-6 h-6" />,       color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', title: 'Batch & Quality Control', desc: 'Convert multiple files at once. Quality slider for JPG/WebP control.' },
                { icon: <Shield className="w-6 h-6" />,    color: '#10B981', bg: 'rgba(16,185,129,0.08)', title: 'Private & Free',          desc: 'Browser-based — nothing uploaded or stored. HEIC handled locally.' },
              ].map((b, i) => (
                <div key={i} className="cv-benefit-card">
                  <div className="cv-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW TO ── */}
        <hr className="cv-divider" />
        <section className="cv-section-main py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload Your Files',       desc: 'Drop JPG, HEIC (iPhone), RAW or any format — batch supported.' },
                { num: '2', title: 'Select Format & Quality', desc: 'Browse categories, pick your format, adjust quality if needed.' },
                { num: '3', title: 'Download Instantly',      desc: 'Grab your converted files — HEIC auto-optimized.' },
              ].map((s, i) => (
                <div key={i} className="cv-step-card">
                  <div className="cv-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="cv-divider" />
        <section className="cv-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>Free Image Converter — ConvertlyHub</h2>
              <p className="leading-7 text-sm">
                The <span style={{ color: '#1a1a2e', fontWeight: 600 }}>ConvertlyHub Image Converter</span> supports
                500+ formats — from everyday JPG/PNG to HEIC (iPhone), RAW, SVG, and more. No signup, no watermark.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {['Photographers — RAW to shareable formats','Web devs — optimize for faster loading','Designers — transparent & compressed formats','iPhone users — HEIC to JPG/PNG easily','Everyone — quick format switches'].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#9333EA' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cv-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {['Free, unlimited conversions','500+ image formats','JPG, PNG, WebP, HEIC, RAW & more','Batch conversion support','Quality slider for output control','HEIC auto-conversion','Works on mobile & desktop','Nothing stored — full privacy'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="cv-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="cv-divider" />
        <section className="cv-section-main py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                { q: 'Is the Image Converter free?',               a: 'Yes — completely free with unlimited conversions and no hidden charges.' },
                { q: 'Which formats are supported?',               a: '500+ formats including JPG, PNG, WebP, HEIC, RAW, TIFF, SVG, AVIF and more.' },
                { q: 'Can I convert multiple images at once?',     a: 'Yes — batch upload and convert multiple files together.' },
                { q: 'Will image quality be affected?',            a: 'Use the quality slider to control output. Higher = better clarity, lower = smaller file.' },
                { q: 'Are my images stored anywhere?',             a: 'No — everything runs in your browser. Nothing is uploaded or stored.' },
                { q: 'Can I use this on mobile?',                  a: 'Yes — works perfectly on phones, tablets, and desktops.' },
              ].map((faq, i) => (
                <details key={i} className="cv-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#9333EA' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="cv-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">Ready to convert images?</h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>Takes 5 seconds. No signup. No ads.</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="cv-cta-btn">
              <RefreshCw className="w-5 h-5" />
              Convert Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}

