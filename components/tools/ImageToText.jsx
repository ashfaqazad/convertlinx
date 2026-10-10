'use client';

import { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Upload, Copy, FileText, Zap, Shield, CheckCircle, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';
import '@/styles/ImageToText.css';

export default function ImageToText() {
  const [image,    setImage]    = useState(null);
  const [text,     setText]     = useState('');
  const [loading,  setLoading]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied,   setCopied]   = useState(false);

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

  const faqs = [
    {
      q: 'Is Image to Text OCR free?',
      a: 'Yes — completely free with unlimited usage and no hidden charges or signup required.'
    },
    {
      q: 'Which image formats are supported?',
      a: 'JPG, PNG, WebP, and other common image formats are supported. If you have HEIC photos from an iPhone, convert them first using our HEIC to JPG converter.'
    },
    {
      q: 'How accurate is the OCR?',
      a: 'Very accurate for clear printed text. Blurry images or low resolution may reduce accuracy. You can pre-process or adjust your files using our Image Converter for best results.'
    },
    {
      q: 'Can it read handwritten text?',
      a: 'It may work for neat, clean handwriting, but printed text gives the best results. Once extracted, you can check text details or word count with our Word Counter.'
    },
    {
      q: 'Do you store my images or extracted text?',
      a: 'No — everything runs entirely in your browser. Your images are never uploaded to any server and nothing is stored or logged.'
    },
    {
      q: 'Can I use this on mobile?',
      a: 'Yes — fully optimized for mobile devices and desktops. You can also quickly generate access links or QR codes for your files using our QR Code Generator.'
    },
    {
      q: 'Can I extract text from a screenshot?',
      a: 'Yes — screenshots work perfectly. If you need to compress large screenshot files before sharing, try our Image Compressor.'
    },
    {
      q: 'Can I extract text from a scanned PDF page?',
      a: 'Yes — export your scanned PDF page as an image or take a screenshot, then upload it here. You can also tweak casing on extracted text with our Case Converter.'
    },
    {
      q: 'What languages does the OCR support?',
      a: 'The tool currently processes English text with high accuracy. Use images containing printed text with good contrast and resolution.'
    },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script id="howto-schema-img-text" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'HowTo',
            name: 'How to Extract Text from Image Online for Free',
            description: 'Use OCR to convert photos, screenshots, and scanned documents to editable text instantly — free, private, no uploads.',
            url: 'https://convertlinx.com/image-to-text',
            totalTime: 'PT30S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'JPG, PNG, or WebP image containing text' }],
            tool:  [{ '@type': 'HowToTool',   name: 'ConvertLinx Image to Text OCR'            }],
            step: [
              { '@type': 'HowToStep', name: 'Upload Image',       text: 'Drop or click to select a photo, screenshot, or scanned document containing text.' },
              { '@type': 'HowToStep', name: 'Wait a Few Seconds', text: 'OCR runs automatically in your browser — no server needed. A progress bar shows the status.' },
              { '@type': 'HowToStep', name: 'Copy Text',          text: 'Review the extracted text in the editable textarea and copy it to your clipboard with one click.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: FAQPage ── */}
      <Script id="faq-schema-img-text" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />

      <main className="it-page">

        {/* ── HERO ── */}
        <section className="it-hero">
          <div className="it-blob-1" />
          <div className="it-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <Link href="/" className="it-breadcrumb-link">Home</Link>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#0891B2' }}>Image to Text</span>
            </div>
            <span className="it-badge">OCR Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Image to <span className="it-grad-text">Text (OCR)</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Extract text from photos, screenshots, scans, and documents instantly using
              browser-based OCR. Copy editable text in seconds — 100% private,
              nothing uploaded, no signup required.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {['No upload needed', 'JPG · PNG · WebP', 'Screenshots & scans', 'Unlimited OCR', '100% private'].map((t, i) => (
                <span key={i} className="it-badge px-3 py-1 rounded-full text-xs">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="it-section-main py-10 px-6">
          <div className="max-w-3xl mx-auto it-fade-up">
            <div className="it-tool-card">

              {/* Upload Area */}
              {!image && !loading && (
                <>
                  <label className="block mb-2"
                    style={{ color: '#0891B2', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                    Upload Image
                  </label>
                  <label className="it-upload-area" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
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
                      type="file" accept="image/*"
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
                  <div className="it-image-card">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
                      Your Image
                    </p>
                    <img src={image} alt="Uploaded" className="w-full rounded-xl object-cover" />
                    <label className="block mt-4 text-center text-xs font-semibold cursor-pointer" style={{ color: '#0891B2' }}>
                      <input
                        type="file" accept="image/*"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) doOCR(f); }}
                        className="hidden"
                      />
                      ↺ Try another image
                    </label>
                  </div>
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
                    <button onClick={copyText} className={`it-copy-btn ${copied ? 'copied' : ''}`}>
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
              Why Use ConvertLinx OCR?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: <FileText className="w-6 h-6" />, color: '#0891B2', bg: 'rgba(6,182,212,0.08)',   title: 'High Accuracy',    desc: 'Extracts text from photos, scans, and screenshots with high accuracy — even handles clear handwriting.' },
                { icon: <Zap className="w-6 h-6" />,      color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  title: 'Fast Processing',  desc: 'Results in seconds — OCR runs directly in your browser with no server delay or queue.' },
                { icon: <Shield className="w-6 h-6" />,   color: '#10B981', bg: 'rgba(16,185,129,0.08)',  title: '100% Private',     desc: 'Nothing ever leaves your device — no upload, no storage, no server. Fully secure and private.' },
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

        {/* ── HOW IT WORKS ── */}
        <hr className="it-divider" />
        <section className="it-section-main py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload Image',       desc: 'Drop or click to select a photo, screenshot, or scanned document containing text.' },
                { num: '2', title: 'Wait a Few Seconds', desc: 'OCR runs automatically in your browser — no server needed. Progress bar shows status.' },
                { num: '3', title: 'Copy Text',          desc: 'Review the result in the editable textarea and copy extracted text with one click.' },
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

        {/* ── SEO CONTENT WITH CONTEXTUAL INTERLINKING ── */}
        <hr className="it-divider" />
        <section className="it-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Why You Need a Free Image to Text OCR Tool
              </h2>
              <p className="leading-7 text-sm">
                Text trapped inside images cannot be copied, searched, or edited. Whether it is
                a screenshot of an article, a photo of a receipt, a scanned contract, or a
                picture of handwritten notes — you need OCR to unlock that text. Manually
                retyping it wastes time and introduces errors. After extracting your text, you can calculate word density using our <Link href="/word-counter" className="text-cyan-600 hover:underline font-medium">Word Counter</Link> or format text casing effortlessly via the <Link href="/case-converter" className="text-cyan-600 hover:underline font-medium">Case Converter</Link>.
              </p>
              <p className="leading-7 text-sm mt-3">
                This free image to text converter uses Tesseract OCR running entirely in your
                browser — no file is ever sent to a server. If you are working with mobile camera photos or iOS screenshots, consider optimizing them with our <Link href="/heic-to-jpg" className="text-cyan-600 hover:underline font-medium">HEIC to JPG Converter</Link> or resizing large documents through our <Link href="/image-resizer" className="text-cyan-600 hover:underline font-medium">Image Resizer</Link> before processing.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                What Makes OCR Accurate?
              </h3>
              <p className="leading-7 text-sm">
                OCR accuracy depends heavily on image quality. High-contrast text on a clean
                background gives near-perfect results. If you need to convert file formats before running recognition, check out our <Link href="/image-converter" className="text-cyan-600 hover:underline font-medium">Image Converter</Link>. Furthermore, if you are compressing images to save storage, our <Link href="/image-compressor" className="text-cyan-600 hover:underline font-medium">Image Compressor</Link> keeps image dimensions intact for optimal text detection.
              </p>
            </div>

            <div className="it-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Problems This Tool Solves
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Copy text from a screenshot you cannot select',
                  'Extract text from a scanned PDF or document',
                  'Convert a photo of a receipt or invoice to text',
                  'Get editable text from an image of a book or article',
                  'Extract address or phone number from a photo',
                  'Convert handwritten notes to typed text',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="it-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Students — extract notes, books, and study screenshots',
                  'Office users — convert scanned docs to editable text',
                  'Freelancers — pull text from receipts and invoices',
                  'Researchers — extract quotes from image-based sources',
                  'Writers — reuse content from screenshots or scans',
                  'Anyone — quick copyable text from any image',
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
                  'Free, unlimited OCR — no daily limits',
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

        {/* ── FAQ WITH CONTEXTUAL INTERLINKING ── */}
        <hr className="it-divider" />
        <section className="it-section-main py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Is Image to Text OCR free?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  Yes — completely free with unlimited usage and no hidden charges or signup required.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Which image formats are supported?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  JPG, PNG, WebP, and other common image formats are supported. If you have HEIC photos from an iPhone, convert them first using our <Link href="/heic-to-jpg" className="text-cyan-600 hover:underline">HEIC to JPG Converter</Link>.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>How accurate is the OCR?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  Very accurate for clear printed text. Blurry images or low resolution may reduce accuracy. You can pre-process or adjust your files using our <Link href="/image-converter" className="text-cyan-600 hover:underline">Image Converter</Link> for best results.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can it read handwritten text?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  It may work for neat, clean handwriting, but printed text gives the best results. Once extracted, you can check text details or word count with our <Link href="/word-counter" className="text-cyan-600 hover:underline">Word Counter</Link>.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Do you store my images or extracted text?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  No — everything runs entirely in your browser. Your images are never uploaded to any server and nothing is stored or logged.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can I use this on mobile?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  Yes — fully optimized for mobile devices and desktops. You can also quickly generate access links or QR codes for your files using our <Link href="/qr-generator" className="text-cyan-600 hover:underline">QR Code Generator</Link>.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can I extract text from a screenshot?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  Yes — screenshots work perfectly. If you need to compress large screenshot files before sharing, try our <Link href="/image-compressor" className="text-cyan-600 hover:underline">Image Compressor</Link>.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can I extract text from a scanned PDF page?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  Yes — export your scanned PDF page as an image or take a screenshot, then upload it here. You can also tweak casing on extracted text with our <Link href="/case-converter" className="text-cyan-600 hover:underline">Case Converter</Link>.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>What languages does the OCR support?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  The tool currently processes English text with high accuracy. Use images containing printed text with good contrast and resolution.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="it-divider" />
        <section className="it-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Image Compressor', href: '/image-compressor' },
                { name: 'Image Converter',  href: '/image-converter'  },
                { name: 'HEIC to JPG',       href: '/heic-to-jpg'      },
                { name: 'QR Generator',     href: '/qr-generator'     },
                { name: 'Word Counter',     href: '/word-counter'     },
                { name: 'Case Converter',   href: '/case-converter'   },
                { name: 'Image Resizer',    href: '/image-resizer'    },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:border-cyan-600"
                  style={{ color: '#0891B2', borderColor: '#A5F3FC', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
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
              <Upload className="w-5 h-5" /> Extract Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}






