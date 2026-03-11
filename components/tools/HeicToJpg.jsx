'use client';

import { useState } from 'react';
import { Upload, Download, Smartphone, Image as ImageIcon, CheckCircle, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/HeicToJpg.css';

export default function HeicToJpg() {
  const [converted, setConverted] = useState([]);
  const [loading, setLoading]     = useState(false);

  const convert = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    setLoading(true);
    setConverted([]);

    try {
      const heic2any = (await import('heic2any')).default;
      const results  = [];

      for (const file of files) {
        const jpgBlob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.94 });
        results.push({
          name:         file.name.replace(/\.heic$/i, '.jpg'),
          url:          URL.createObjectURL(jpgBlob),
          originalName: file.name,
        });
      }
      setConverted(results);
    } catch (err) {
      console.error(err);
      alert('Conversion failed. Make sure you uploaded valid HEIC files and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script id="howto-schema-heic" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert HEIC to JPG Online for Free",
            description: "Convert iPhone HEIC photos to JPG format instantly.",
            url: "https://convertlinx.com/heic-to-jpg",
            step: [
              { "@type": "HowToStep", name: "Upload HEIC", text: "Select one or multiple HEIC files." },
              { "@type": "HowToStep", name: "Convert",     text: "Wait a moment — conversion is instant." },
              { "@type": "HowToStep", name: "Download",    text: "Download converted JPG files." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
          }, null, 2),
        }}
      />

      <main className="hj-page">

        {/* ── HERO ── */}
        <section className="hj-hero">
          <div className="hj-blob-1" />
          <div className="hj-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="hj-breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#C026D3' }}>HEIC to JPG</span>
            </div>
            <span className="hj-badge">iPhone Photos</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              HEIC to{' '}
              <span className="hj-grad-text">JPG Converter</span>
            </h1>
            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Convert iPhone HEIC photos to universal JPG — batch upload, instant results, free.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="hj-section-main py-10 px-6">
          <div className="max-w-2xl mx-auto hj-fade-up">
            <div className="hj-tool-card">

              <label className="block mb-3" style={{ color: '#C026D3', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                Upload HEIC Photos
              </label>

              {/* Upload area */}
              <label className="hj-upload-area">
                <div className="hj-upload-icon">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
                  Drop HEIC photos here or click to browse
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                  Multiple files supported · Straight from iPhone or iPad
                </p>
                <input
                  type="file"
                  accept=".heic,.HEIC,.heif,.HEIF"
                  multiple
                  onChange={convert}
                  className="hidden"
                />
              </label>

              {/* Loader */}
              {loading && (
                <div className="text-center py-8 mt-4">
                  <div className="hj-spinner mb-3" />
                  <p className="text-sm font-semibold" style={{ color: '#C026D3' }}>
                    Converting your photos...
                  </p>
                </div>
              )}

              {/* Results */}
              {!loading && converted.length > 0 && (
                <div className="mt-7">
                  <p className="text-sm font-bold uppercase tracking-widest mb-5 text-center" style={{ color: '#C026D3' }}>
                    {converted.length} {converted.length === 1 ? 'Photo' : 'Photos'} Ready
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {converted.map((item, i) => (
                      <div key={i} className="hj-result-card">
                        <img src={item.url} alt={item.name} className="w-full h-44 object-cover" />
                        <div className="p-4 text-center">
                          <p className="text-xs font-medium mb-3 truncate" style={{ color: '#374151' }}>
                            {item.name}
                          </p>
                          <a href={item.url} download={item.name} className="hj-dl-btn w-full justify-center">
                            <Download className="w-4 h-4" />
                            Download JPG
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No sign-up', 'Batch convert', 'Quality preserved', 'Nothing stored', '100% free'].map((t, i) => (
                  <span key={i} className="hj-trust-item">
                    <span className="hj-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="hj-divider" />
        <section className="hj-section-alt py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: <Smartphone className="w-6 h-6" />,  color: '#C026D3', bg: 'rgba(192,38,211,0.08)',  title: 'iPhone Friendly',       desc: 'Converts HEIC shots into universal JPGs that open on Windows, Android, web — everywhere.' },
                { icon: <ImageIcon className="w-6 h-6" />,   color: '#7C3AED', bg: 'rgba(124,58,237,0.08)',  title: 'Batch Conversion',       desc: 'Upload a whole folder at once — saves tons of time when you have many photos.' },
                { icon: <CheckCircle className="w-6 h-6" />, color: '#10B981', bg: 'rgba(16,185,129,0.08)',  title: 'Top Quality, Zero Cost', desc: 'Photos stay crisp and sharp after conversion. Free forever, no watermark.' },
              ].map((b, i) => (
                <div key={i} className="hj-benefit-card">
                  <div className="hj-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW TO ── */}
        <hr className="hj-divider" />
        <section className="hj-section-main py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Drop Your Photos',  desc: 'Pick one or multiple HEIC files from your iPhone, iPad, or computer.' },
                { num: '2', title: 'We Do the Work',    desc: 'Conversion happens instantly in your browser — fast and smooth.' },
                { num: '3', title: 'Grab Your JPGs',    desc: 'Download converted photos one by one — ready for anything.' },
              ].map((s, i) => (
                <div key={i} className="hj-step-card">
                  <div className="hj-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="hj-divider" />
        <section className="hj-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Free HEIC to JPG Converter — ConvertLinx
              </h2>
              <p className="leading-7 text-sm">
                The <span style={{ color: '#1a1a2e', fontWeight: 600 }}>ConvertLinx HEIC to JPG</span> tool converts
                iPhone photos into universal JPG format instantly — no signup, no watermark, batch supported.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'iPhone users — easy HEIC to JPG sharing',
                  'Windows users — open iPhone images anywhere',
                  'Students — upload photos on portals easily',
                  'Office teams — images for docs & emails',
                  'Everyone — quick HEIC conversion without apps',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#C026D3' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hj-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Free, unlimited conversions',
                  'iPhone & iPad HEIC supported',
                  'Batch conversion — multiple files',
                  'Fast results in seconds',
                  'High-quality JPG output',
                  'Simple drag & drop upload',
                  'Works on mobile & desktop',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="hj-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="hj-divider" />
        <section className="hj-section-main py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                { q: 'Is HEIC to JPG conversion free?',          a: 'Yes — completely free with unlimited conversions and downloads.' },
                { q: 'Can I convert multiple HEIC files at once?', a: 'Yes — batch conversion is supported. Upload multiple photos and convert them together.' },
                { q: 'Will JPG quality be reduced?',              a: 'Conversion is optimized to keep photos sharp and clear. Quality depends on the original image.' },
                { q: 'Why does iPhone use HEIC?',                 a: 'HEIC saves storage while keeping high quality. But JPG is more compatible for sharing and uploads.' },
                { q: 'Are my photos stored anywhere?',            a: 'No — your photos are used only to generate the converted output. Nothing is stored.' },
                { q: 'Can I use this on mobile?',                 a: 'Yes — works perfectly on iPhone, Android, tablets, and desktops.' },
              ].map((faq, i) => (
                <details key={i} className="hj-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#C026D3' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="hj-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to convert your iPhone photos?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 5 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hj-cta-btn"
            >
              <Smartphone className="w-5 h-5" />
              Convert Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}