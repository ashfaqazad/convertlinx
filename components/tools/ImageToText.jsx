'use client';

import { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Upload, Copy, FileText, Zap, Shield, CheckCircle, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/ImageToText.css';

export default function ImageToText() {
  const [image, setImage]   = useState(null);
  const [text, setText]     = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const doOCR = (file) => {
    if (!file) return;
    setLoading(true);
    setText('');
    setProgress(0);
    setImage(URL.createObjectURL(file));

    Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100));
      },
    })
      .then(({ data: { text } }) => {
        setText(text.trim() || 'No text found. Try a clearer image with visible text.');
      })
      .catch(() => {
        setText('Something went wrong. Try a sharper image with clear text.');
      })
      .finally(() => setLoading(false));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) doOCR(file);
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Script id="howto-schema-img-text" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Extract Text from Image Online for Free",
            description: "Use OCR to convert images to editable text instantly.",
            url: "https://convertlyhub.com/image-to-text",
            step: [
              { "@type": "HowToStep", name: "Upload Image", text: "Drop or select image containing text." },
              { "@type": "HowToStep", name: "Wait",         text: "OCR processes automatically in seconds." },
              { "@type": "HowToStep", name: "Copy Text",    text: "Copy extracted text with one click." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
          }, null, 2),
        }}
      />

      <main className="it-page">

        {/* ── HERO ── */}
        <section className="it-hero">
          <div className="it-blob-1" />
          <div className="it-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="it-breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#0891B2' }}>Image to Text</span>
            </div>
            <span className="it-badge">OCR Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Image to{' '}
              <span className="it-grad-text">Text (OCR)</span>
            </h1>
            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Extract text from photos, screenshots, scans — instantly, free, nothing uploaded.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="it-section-main py-10 px-6">
          <div className="max-w-3xl mx-auto it-fade-up">
            <div className="it-tool-card">

              {/* Upload Area */}
              {!image && !loading && (
                <>
                  <label className="block mb-2" style={{ color: '#0891B2', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                    Upload Image
                  </label>
                  <label
                    className="it-upload-area"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="it-upload-icon">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
                      Drop image here or click to upload
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                      JPG, PNG, WebP · Screenshots, scans, photos with text
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) doOCR(f); }}
                      className="hidden"
                    />
                  </label>
                </>
              )}

              {/* Loading / Progress */}
              {loading && (
                <div className="text-center py-10">
                  <div className="it-progress-wrap mb-3">
                    <div className="it-progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#0891B2' }}>
                    Extracting text... {progress}%
                  </p>
                </div>
              )}

              {/* Result — Image + Text side by side */}
              {!loading && text && (
                <div className="grid md:grid-cols-2 gap-6">

                  {/* Left — Image preview */}
                  <div className="it-image-card">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
                      Your Image
                    </p>
                    <img src={image} alt="Uploaded" className="w-full rounded-xl object-cover" />
                    <label
                      className="block mt-4 text-center text-xs font-semibold cursor-pointer"
                      style={{ color: '#0891B2' }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) doOCR(f); }}
                        className="hidden"
                      />
                      ↺ Try another image
                    </label>
                  </div>

                  {/* Right — Extracted text */}
                  <div className="it-text-card">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#0891B2' }}>
                      Extracted Text
                    </p>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="it-textarea"
                      spellCheck={false}
                    />
                    <button
                      onClick={copyText}
                      className={`it-copy-btn ${copied ? 'copied' : ''}`}
                    >
                      {copied
                        ? <><CheckCircle className="w-5 h-5" /> Copied!</>
                        : <><Copy className="w-5 h-5" /> Copy to Clipboard</>
                      }
                    </button>
                  </div>
                </div>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No signup', 'Nothing uploaded', '100% private', 'Unlimited OCR', 'Free forever'].map((t, i) => (
                  <span key={i} className="it-trust-item">
                    <span className="it-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="it-divider" />
        <section className="it-section-alt py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertlyHub OCR?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: <FileText className="w-6 h-6" />, color: '#0891B2', bg: 'rgba(6,182,212,0.08)',  title: 'High Accuracy',    desc: 'Extracts text from photos, scans, screenshots — even handwriting (if clear).' },
                { icon: <Zap className="w-6 h-6" />,      color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', title: 'Fast Processing',  desc: 'Results in seconds — OCR runs directly in your browser, no server delay.' },
                { icon: <Shield className="w-6 h-6" />,   color: '#10B981', bg: 'rgba(16,185,129,0.08)', title: '100% Private',     desc: 'Nothing leaves your device — no upload, no storage, fully secure.' },
              ].map((b, i) => (
                <div key={i} className="it-benefit-card">
                  <div className="it-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW TO ── */}
        <hr className="it-divider" />
        <section className="it-section-main py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload Image',        desc: 'Drop or click to select photo, screenshot, or scanned document.' },
                { num: '2', title: 'Wait a Few Seconds',  desc: 'OCR runs automatically in your browser — no server needed.' },
                { num: '3', title: 'Copy Text',           desc: 'Review the result and copy extracted text with one click.' },
              ].map((s, i) => (
                <div key={i} className="it-step-card">
                  <div className="it-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="it-divider" />
        <section className="it-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Free Image to Text OCR — ConvertlyHub
              </h2>
              <p className="leading-7 text-sm">
                The <span style={{ color: '#1a1a2e', fontWeight: 600 }}>ConvertlyHub Image to Text</span> tool uses
                OCR to extract editable text from photos, scans, and screenshots — instantly, free, nothing uploaded.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Students — notes, books & study screenshots',
                  'Office users — scanned docs to editable text',
                  'Freelancers — receipts, invoices & screenshots',
                  'Researchers — quotes from images & scans',
                  'Anyone — quick copyable text from an image',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#0891B2' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="it-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Free, unlimited OCR',
                  'Photos, screenshots & scans supported',
                  'Fast results in seconds',
                  'High accuracy for clear printed text',
                  'One-click copy to clipboard',
                  'Editable textarea — fix errors manually',
                  'Works on mobile & desktop',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="it-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="it-divider" />
        <section className="it-section-main py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                { q: 'Is Image to Text OCR free?',               a: 'Yes — completely free with unlimited usage and no hidden charges.' },
                { q: 'Which image formats are supported?',       a: 'JPG, PNG, WebP and other common formats supported by your browser.' },
                { q: 'How accurate is the OCR?',                 a: 'Very accurate for clear printed text. Blurry images or messy handwriting may reduce accuracy.' },
                { q: 'Can it read handwritten text?',            a: 'It may work for clean handwriting, but printed/clear text gives the best results.' },
                { q: 'Do you store my images or text?',          a: 'No — everything runs in your browser. Nothing is uploaded or stored.' },
                { q: 'Can I use this on mobile?',                a: 'Yes — works perfectly on phones, tablets, and desktops.' },
              ].map((faq, i) => (
                <details key={i} className="it-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#0891B2' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="it-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to extract text from your image?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 5 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="it-cta-btn"
            >
              <Upload className="w-5 h-5" />
              Extract Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}