'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Link, Wifi, MessageCircle, Download, QrCode, ChevronDown } from 'lucide-react';
import Script from "next/script";
import '@/styles/QrGenerator.css';
import PDFLinxEmbedWrapper from "@/components/embeds/PDFLinxEmbedWrapper";


export default function QRGenerator() {
  const [text, setText] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (text && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        text,
        {
          width: 280,
          margin: 2,
          color: { dark: '#1E1B4B', light: '#ffffff' },
        },
        (error) => {
          if (error) console.error(error);
          else setIsGenerated(true);
        }
      );
    } else {
      setIsGenerated(false);
    }
  }, [text]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const src = canvasRef.current;
    const out = document.createElement('canvas');
    const pad = 24;
    out.width = src.width + pad * 2;
    out.height = src.height + pad * 2;
    const ctx = out.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(src, pad, pad);
    const url = out.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode-convertlinx.png';
    a.click();
  };

  return (
    <>
      <Script id="howto-schema-qr" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Create a QR Code Online for Free",
            description: "Generate QR codes for URLs, text, WiFi, vCard in seconds.",
            url: "https://convertlinx.com/qr-generator",
            step: [
              { "@type": "HowToStep", name: "Enter Data", text: "Paste URL, text, or contact details." },
              { "@type": "HowToStep", name: "Preview", text: "QR code generates instantly." },
              { "@type": "HowToStep", name: "Download", text: "Download high-resolution PNG." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
          }, null, 2)
        }}
      />

      <Script
        id="breadcrumb-schema-qr"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://convertlinx.com"
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "QR Code Generator",
                item: "https://convertlinx.com/qr-generator"
              }
            ]
          })
        }}
      />

      <Script
        id="faq-schema-qr"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is the QR Code Generator free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, the QR Code Generator on Convertlinx is completely free. You can generate unlimited QR codes without sign-up."
                }
              },
              {
                "@type": "Question",
                name: "What types of QR codes can I create?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You can generate QR codes for URLs, text, WiFi passwords, WhatsApp links, email addresses, and contact details."
                }
              },
              {
                "@type": "Question",
                name: "Do I need to install anything?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No installation is required. The QR code generator works directly in your browser."
                }
              },
              {
                "@type": "Question",
                name: "Can I use QR codes for printing?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. The tool generates high-quality PNG QR codes suitable for posters, flyers, packaging, and business cards."
                }
              }
            ]
          })
        }}
      />

      <main className="qr-page">

        {/* ── HERO ── */}
        <section className="hero-bg py-16 px-6 text-center">
          <div className="hero-blob-1" />
          <div className="hero-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">

            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              <a href="/" className="breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#6366F1' }}>QR Code Generator</span>
            </div>

            <span className="badge-pill inline-block px-4 py-1.5 rounded-full mb-5">
              Free Tool
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: '#1a1a2e' }}>
              QR Code{' '}
              <span className="grad-text">Generator</span>
            </h1>

            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Create QR codes for URLs, WiFi, WhatsApp & more — instantly, free, no signup required.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="main-section py-10 px-6">
          <div className="max-w-2xl mx-auto fade-up">
            <div className="tool-card rounded-3xl p-8 md:p-10">

              <label className="block mb-3" style={{ color: '#6366F1', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                Enter your content
              </label>

              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste a URL, type text, WiFi password..."
                className="qr-input w-full px-5 py-4 rounded-xl text-base mb-7"
              />

              {/* QR Preview */}
              <div className="flex flex-col items-center mb-7">
                <div className={`qr-canvas-wrap rounded-2xl p-5 ${isGenerated ? 'active scale-pop' : ''}`}>
                  {text ? (
                    <canvas ref={canvasRef} className="rounded-xl block" />
                  ) : (
                    <div className="qr-placeholder-wrap w-[280px] h-[280px] rounded-xl flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                        <QrCode className="w-8 h-8" style={{ color: '#6366F1' }} />
                      </div>
                      <p className="text-sm text-center px-8" style={{ color: '#A5B4FC' }}>
                        Your QR code will appear here
                      </p>
                    </div>
                  )}
                </div>

                {isGenerated && (
                  <div className="ready-pill flex items-center gap-2 mt-4 px-4 py-2 rounded-full">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#6366F1' }} />
                    <span className="text-sm font-semibold" style={{ color: '#6366F1' }}>QR code ready!</span>
                  </div>
                )}
              </div>

              {/* Download */}
              <button
                onClick={handleDownload}
                disabled={!isGenerated}
                className="download-btn w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base"
              >
                <Download className="w-5 h-5" />
                Download QR Code (PNG)
              </button>

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-5">
                {['No signup', 'Unlimited use', 'Files not stored', '100% free'].map((t, i) => (
                  <span key={i} className="text-xs flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
                    <span className="w-1 h-1 rounded-full" style={{ background: '#A5B4FC' }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="mid-divider" />
        <section className="alt-section py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use Convertlinx?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: <Link className="w-6 h-6" />, color: '#6366F1', bg: 'rgba(99,102,241,0.08)', title: 'Any Content Type', desc: 'URLs, text, WiFi, WhatsApp, vCard, email — all fully supported.' },
                { icon: <Wifi className="w-6 h-6" />, color: '#10B981', bg: 'rgba(16,185,129,0.08)', title: 'High Quality Output', desc: 'Sharp PNG — perfect for print and digital. Scans every time.' },
                { icon: <MessageCircle className="w-6 h-6" />, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', title: 'Private & Unlimited', desc: 'Unlimited QR codes. Zero data stored. Your content stays yours.' },
              ].map((b, i) => (
                <div key={i} className="benefit-card rounded-2xl p-7">
                  <div className="p-3 rounded-xl inline-flex mb-5" style={{ background: b.bg, color: b.color }}>
                    {b.icon}
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW TO ── */}
        <hr className="mid-divider" />
        <section className="main-section py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Enter Your Data', desc: 'Type or paste a URL, text, WiFi details, or contact info.' },
                { num: '2', title: 'Instant Preview', desc: 'QR code generates live as you type — no button needed.' },
                { num: '3', title: 'Download & Share', desc: 'Save as high-quality PNG. Print or use it digitally.' },
              ].map((s, i) => (
                <div key={i} className="step-card rounded-2xl p-7 text-center">
                  <div className="step-num w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg text-white">
                    {s.num}
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="mid-divider" />
        <section className="alt-section py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            {/* <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Free QR Code Generator — ConvertlyHub
              </h2>
              <p className="leading-7 text-sm">
                The <span style={{ color: '#1a1a2e', fontWeight: 600 }}>ConvertlyHub QR Code Generator</span> lets
                you create high-quality QR codes in seconds — no sign-up, no watermarks, no software needed.
              </p>
            </div> */}

            <div>
              <h3 className="font-bold text-lg mb-3">Online QR Code Generator Tool</h3>

              <p className="leading-7 text-sm">
                Our <strong>free QR code generator</strong> allows you to instantly create {" "}
                <strong>QR codes for URLs, WiFi passwords, WhatsApp links, contact cards, and text</strong>.
                This browser-based <strong>online QR code maker</strong> works without signup and
                lets you download <strong>high-resolution QR code PNG files</strong>.
              </p>

              <p className="leading-7 text-sm mt-3">
                You can use this <strong>QR code creator</strong> for
                business cards, restaurant menus, product packaging,
                marketing flyers, and contactless payments.
                The generated codes are compatible with
                <strong>Android, iPhone, and all QR scanner apps</strong>.
              </p>
            </div>


            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>What Is a QR Code?</h3>
              <p className="leading-7 text-sm">
                A QR code (Quick Response code) is a scannable code that instantly opens digital content
                when scanned with a smartphone. It can store URLs, WiFi credentials, WhatsApp links,
                email addresses, or contact information.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Businesses — cards, flyers, packaging',
                  'Restaurants — digital menus',
                  'Event Organizers — tickets & info',
                  'Students & Teachers — share resources',
                  'Anyone — fast contactless sharing',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#6366F1' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="seo-box rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Completely free, no hidden costs',
                  'URLs, WiFi, WhatsApp, email & more',
                  'Live preview as you type',
                  'High-quality PNG download',
                  'Works on mobile & desktop',
                  'No data stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="feature-dot w-1.5 h-1.5 rounded-full flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

          {/* Related Tools (Tailwind) */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-5">
            <p className="text-sm font-semibold text-slate-700 mb-3">
              You may also find these free tools helpful:
            </p>

            <div className="flex flex-wrap gap-2">
              <a
                href="/image-to-text"
                className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
              >
                Image to Text
              </a>

              <a
                href="/image-compressor"
                className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
              >
                Image Compressor
              </a>

              <a
                href="/image-converter"
                className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
              >
                Image Converter
              </a>

              <a
                href="/text-to-pdf"
                className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
              >
                Text to PDF
              </a>

              <a
                href="/youtube-thumbnail"
                className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
              >
                YouTube Thumbnail
              </a>
            </div>
          </div>
          
          </div>

        </section>

<PDFLinxEmbedWrapper tool="compress-pdf" />

        {/* ── FAQ ── */}
        <hr className="mid-divider" />
        <section className="main-section py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                { q: 'Is the QR Code Generator free?', a: 'Yes, completely free with no sign-up or hidden costs. Generate unlimited QR codes forever.' },
                { q: 'What types of QR codes can I create?', a: 'URLs, plain text, WiFi passwords, WhatsApp links, email addresses, and contact details.' },
                { q: 'Do I need to install anything?', a: 'No installation needed — everything runs directly in your browser.' },
                { q: 'Can I use QR codes for printing?', a: 'Yes — PNG output is high resolution, perfect for posters, flyers, and business cards.' },
                { q: 'Is my data private?', a: 'Absolutely. Your input is never stored or shared. Everything processes locally.' },
                { q: 'Does it work on mobile?', a: 'Yes — fully optimized for phones, tablets, and desktops.' },
              ].map((faq, i) => (
                <details key={i} className="faq-item rounded-xl p-5">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#6366F1' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="cta-section py-20 px-6 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
              Ready to create your QR code?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes less than 10 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cta-main-btn text-white text-base px-10 py-4 rounded-xl inline-flex items-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              Generate QR Code Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}


















// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import QRCode from 'qrcode';
// import { Link, Wifi, MessageCircle, Download, QrCode, ChevronDown } from 'lucide-react';
// import Script from "next/script";

// function PageStyles() {
//   const css = `
//     @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

//     * { box-sizing: border-box; }

//     .qr-page {
//       font-family: 'Plus Jakarta Sans', sans-serif;
//       background: #F5F3FF;
//       color: #1a1a2e;
//       min-height: 100vh;
//     }

//     .hero-bg {
//       background: linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 40%, #FAF5FF 100%);
//       position: relative;
//       overflow: hidden;
//     }
//     .hero-blob-1 {
//       position: absolute; width: 480px; height: 480px; border-radius: 50%;
//       background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
//       top: -160px; right: -80px; pointer-events: none;
//     }
//     .hero-blob-2 {
//       position: absolute; width: 320px; height: 320px; border-radius: 50%;
//       background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
//       bottom: -80px; left: -60px; pointer-events: none;
//     }

//     .tool-card {
//       background: #ffffff;
//       border: 1.5px solid rgba(99,102,241,0.12);
//       box-shadow: 0 4px 6px -1px rgba(99,102,241,0.06), 0 20px 60px -10px rgba(99,102,241,0.1);
//     }

//     .qr-input {
//       background: #F8F7FF;
//       border: 1.5px solid #E0DCFF;
//       color: #1a1a2e;
//       font-family: 'Plus Jakarta Sans', sans-serif;
//       transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
//     }
//     .qr-input:focus {
//       outline: none;
//       border-color: #6366F1;
//       background: #ffffff;
//       box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
//     }
//     .qr-input::placeholder { color: #A5B4FC; }

//     .qr-canvas-wrap {
//       background: #ffffff;
//       border: 1.5px solid #E0DCFF;
//       transition: border-color 0.3s, box-shadow 0.3s;
//     }
//     .qr-canvas-wrap.active {
//       border-color: #6366F1;
//       box-shadow: 0 0 0 5px rgba(99,102,241,0.08), 0 8px 32px rgba(99,102,241,0.15);
//     }

//     .qr-placeholder-wrap {
//       border: 2px dashed #D4D0FF;
//       background: #F8F7FF;
//     }

//     .download-btn {
//       background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
//       box-shadow: 0 4px 15px rgba(99,102,241,0.35), 0 1px 3px rgba(0,0,0,0.1);
//       transition: all 0.3s ease;
//       font-family: 'Plus Jakarta Sans', sans-serif;
//       font-weight: 700;
//     }
//     .download-btn:hover {
//       transform: translateY(-2px);
//       box-shadow: 0 8px 25px rgba(99,102,241,0.45);
//     }
//     .download-btn:disabled {
//       background: #D1D5DB;
//       color: rgba(255,255,255,0.7);
//       box-shadow: none;
//       cursor: not-allowed;
//       transform: none;
//     }

//     .benefit-card {
//       background: #ffffff;
//       border: 1.5px solid rgba(99,102,241,0.08);
//       transition: all 0.3s ease;
//       box-shadow: 0 2px 8px rgba(99,102,241,0.05);
//     }
//     .benefit-card:hover {
//       border-color: rgba(99,102,241,0.2);
//       box-shadow: 0 8px 24px rgba(99,102,241,0.1);
//       transform: translateY(-3px);
//     }

//     .step-card {
//       background: #ffffff;
//       border: 1.5px solid rgba(99,102,241,0.08);
//       box-shadow: 0 2px 8px rgba(99,102,241,0.04);
//     }
//     .step-num {
//       background: linear-gradient(135deg, #6366F1, #8B5CF6);
//       font-weight: 800;
//     }

//     .faq-item {
//       background: #ffffff;
//       border: 1.5px solid rgba(99,102,241,0.08);
//       transition: border-color 0.25s, box-shadow 0.25s;
//     }
//     .faq-item:hover {
//       border-color: rgba(99,102,241,0.2);
//       box-shadow: 0 4px 16px rgba(99,102,241,0.08);
//     }
//     .faq-item summary { list-style: none; cursor: pointer; }
//     .faq-item summary::-webkit-details-marker { display: none; }

//     .badge-pill {
//       background: rgba(99,102,241,0.08);
//       border: 1px solid rgba(99,102,241,0.2);
//       color: #6366F1;
//       font-weight: 700;
//       font-size: 11px;
//       letter-spacing: 0.08em;
//       text-transform: uppercase;
//     }

//     .ready-pill {
//       background: rgba(99,102,241,0.06);
//       border: 1px solid rgba(99,102,241,0.15);
//     }

//     .seo-box {
//       background: #ffffff;
//       border: 1.5px solid rgba(99,102,241,0.08);
//     }
//     .feature-dot {
//       background: linear-gradient(135deg, #6366F1, #8B5CF6);
//     }

//     .alt-section { background: #ffffff; }
//     .main-section { background: #F5F3FF; }

//     .cta-section {
//       background: linear-gradient(135deg, #6366F1 0%, #7C3AED 50%, #8B5CF6 100%);
//     }
//     .cta-main-btn {
//       background: rgba(255,255,255,0.15);
//       border: 1.5px solid rgba(255,255,255,0.4);
//       backdrop-filter: blur(8px);
//       transition: all 0.3s ease;
//       font-weight: 700;
//     }
//     .cta-main-btn:hover {
//       background: rgba(255,255,255,0.25);
//       transform: translateY(-2px);
//     }

//     .mid-divider { border: none; border-top: 1px solid rgba(99,102,241,0.08); }
//     .breadcrumb-link { color: #A5B4FC; transition: color 0.2s; }
//     .breadcrumb-link:hover { color: #6366F1; }

//     @keyframes fadeUp {
//       from { opacity: 0; transform: translateY(18px); }
//       to   { opacity: 1; transform: translateY(0); }
//     }
//     .fade-up { animation: fadeUp 0.5s ease forwards; }

//     @keyframes scalePop {
//       from { opacity: 0; transform: scale(0.96); }
//       to   { opacity: 1; transform: scale(1); }
//     }
//     .scale-pop { animation: scalePop 0.35s ease forwards; }

//     .grad-text {
//       background: linear-gradient(135deg, #6366F1, #8B5CF6);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//     }
//   `;
//   return <style dangerouslySetInnerHTML={{ __html: css }} />;
// }

// export default function QRGenerator() {
//   const [text, setText] = useState('');
//   const [isGenerated, setIsGenerated] = useState(false);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (text && canvasRef.current) {
//       QRCode.toCanvas(
//         canvasRef.current,
//         text,
//         {
//           width: 280,
//           margin: 2,
//           color: { dark: '#1E1B4B', light: '#ffffff' },
//         },
//         (error) => {
//           if (error) console.error(error);
//           else setIsGenerated(true);
//         }
//       );
//     } else {
//       setIsGenerated(false);
//     }
//   }, [text]);

//   const handleDownload = () => {
//     if (!canvasRef.current) return;
//     const src = canvasRef.current;
//     const out = document.createElement('canvas');
//     const pad = 24;
//     out.width = src.width + pad * 2;
//     out.height = src.height + pad * 2;
//     const ctx = out.getContext('2d');
//     ctx.fillStyle = '#ffffff';
//     ctx.fillRect(0, 0, out.width, out.height);
//     ctx.drawImage(src, pad, pad);
//     const url = out.toDataURL('image/png');
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'qrcode-convertlyhub.png';
//     a.click();
//   };

//   return (
//     <>
//       <PageStyles />

//       <Script id="howto-schema-qr" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Create a QR Code Online for Free",
//             description: "Generate QR codes for URLs, text, WiFi, vCard in seconds.",
//             url: "https://convertlyhub.com/qr-generator",
//             step: [
//               { "@type": "HowToStep", name: "Enter Data", text: "Paste URL, text, or contact details." },
//               { "@type": "HowToStep", name: "Preview", text: "QR code generates instantly." },
//               { "@type": "HowToStep", name: "Download", text: "Download high-resolution PNG." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//           }, null, 2)
//         }}
//       />

//       <main className="qr-page">

//         {/* ── HERO ── */}
//         <section className="hero-bg py-16 px-6 text-center">
//           <div className="hero-blob-1" />
//           <div className="hero-blob-2" />
//           <div className="relative z-10 max-w-3xl mx-auto">

//             <div className="flex items-center justify-center gap-2 text-sm mb-6">
//               <a href="/" className="breadcrumb-link">Home</a>
//               <span style={{ color: '#C4B5FD' }}>/</span>
//               <span style={{ color: '#6366F1' }}>QR Code Generator</span>
//             </div>

//             <span className="badge-pill inline-block px-4 py-1.5 rounded-full mb-5">
//               Free Tool
//             </span>

//             <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: '#1a1a2e' }}>
//               QR Code{' '}
//               <span className="grad-text">Generator</span>
//             </h1>

//             <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
//               Create QR codes for URLs, WiFi, WhatsApp & more — instantly, free, no signup required.
//             </p>
//           </div>
//         </section>

//         {/* ── TOOL WORKSPACE ── */}
//         <section className="main-section py-10 px-6">
//           <div className="max-w-2xl mx-auto fade-up">
//             <div className="tool-card rounded-3xl p-8 md:p-10">

//               <label className="block mb-3" style={{ color: '#6366F1', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
//                 Enter your content
//               </label>

//               <input
//                 type="text"
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Paste a URL, type text, WiFi password..."
//                 className="qr-input w-full px-5 py-4 rounded-xl text-base mb-7"
//               />

//               {/* QR Preview */}
//               <div className="flex flex-col items-center mb-7">
//                 <div className={`qr-canvas-wrap rounded-2xl p-5 ${isGenerated ? 'active scale-pop' : ''}`}>
//                   {text ? (
//                     <canvas ref={canvasRef} className="rounded-xl block" />
//                   ) : (
//                     <div className="qr-placeholder-wrap w-[280px] h-[280px] rounded-xl flex flex-col items-center justify-center gap-3">
//                       <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
//                         style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
//                         <QrCode className="w-8 h-8" style={{ color: '#6366F1' }} />
//                       </div>
//                       <p className="text-sm text-center px-8" style={{ color: '#A5B4FC' }}>
//                         Your QR code will appear here
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {isGenerated && (
//                   <div className="ready-pill flex items-center gap-2 mt-4 px-4 py-2 rounded-full">
//                     <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#6366F1' }} />
//                     <span className="text-sm font-semibold" style={{ color: '#6366F1' }}>QR code ready!</span>
//                   </div>
//                 )}
//               </div>

//               {/* Download */}
//               <button
//                 onClick={handleDownload}
//                 disabled={!isGenerated}
//                 className="download-btn w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base"
//               >
//                 <Download className="w-5 h-5" />
//                 Download QR Code (PNG)
//               </button>

//               {/* Trust row */}
//               <div className="flex flex-wrap justify-center gap-5 mt-5">
//                 {['No signup', 'Unlimited use', 'Files not stored', '100% free'].map((t, i) => (
//                   <span key={i} className="text-xs flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
//                     <span className="w-1 h-1 rounded-full" style={{ background: '#A5B4FC' }} />
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── BENEFITS ── */}
//         <hr className="mid-divider" />
//         <section className="alt-section py-16 px-6">
//           <div className="max-w-5xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Why Use ConvertlyHub?
//             </h2>
//             <div className="grid md:grid-cols-3 gap-5">
//               {[
//                 { icon: <Link className="w-6 h-6" />, color: '#6366F1', bg: 'rgba(99,102,241,0.08)', title: 'Any Content Type', desc: 'URLs, text, WiFi, WhatsApp, vCard, email — all fully supported.' },
//                 { icon: <Wifi className="w-6 h-6" />, color: '#10B981', bg: 'rgba(16,185,129,0.08)', title: 'High Quality Output', desc: 'Sharp PNG — perfect for print and digital. Scans every time.' },
//                 { icon: <MessageCircle className="w-6 h-6" />, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', title: 'Private & Unlimited', desc: 'Unlimited QR codes. Zero data stored. Your content stays yours.' },
//               ].map((b, i) => (
//                 <div key={i} className="benefit-card rounded-2xl p-7">
//                   <div className="p-3 rounded-xl inline-flex mb-5" style={{ background: b.bg, color: b.color }}>
//                     {b.icon}
//                   </div>
//                   <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
//                   <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── HOW TO ── */}
//         <hr className="mid-divider" />
//         <section className="main-section py-16 px-6">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
//               3 Simple Steps
//             </h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {[
//                 { num: '1', title: 'Enter Your Data', desc: 'Type or paste a URL, text, WiFi details, or contact info.' },
//                 { num: '2', title: 'Instant Preview', desc: 'QR code generates live as you type — no button needed.' },
//                 { num: '3', title: 'Download & Share', desc: 'Save as high-quality PNG. Print or use it digitally.' },
//               ].map((s, i) => (
//                 <div key={i} className="step-card rounded-2xl p-7 text-center">
//                   <div className="step-num w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg text-white">
//                     {s.num}
//                   </div>
//                   <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
//                   <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── SEO CONTENT ── */}
//         <hr className="mid-divider" />
//         <section className="alt-section py-16 px-6">
//           <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>
//             <div>
//               <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
//                 Free QR Code Generator — ConvertlyHub
//               </h2>
//               <p className="leading-7 text-sm">
//                 The <span style={{ color: '#1a1a2e', fontWeight: 600 }}>ConvertlyHub QR Code Generator</span> lets
//                 you create high-quality QR codes in seconds — no sign-up, no watermarks, no software needed.
//               </p>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>What Is a QR Code?</h3>
//               <p className="leading-7 text-sm">
//                 A QR code (Quick Response code) is a scannable code that instantly opens digital content
//                 when scanned with a smartphone. It can store URLs, WiFi credentials, WhatsApp links,
//                 email addresses, or contact information.
//               </p>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Businesses — cards, flyers, packaging',
//                   'Restaurants — digital menus',
//                   'Event Organizers — tickets & info',
//                   'Students & Teachers — share resources',
//                   'Anyone — fast contactless sharing',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-2 text-sm">
//                     <span className="font-bold mt-0.5" style={{ color: '#6366F1' }}>→</span>
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="seo-box rounded-2xl p-6">
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Completely free, no hidden costs',
//                   'URLs, WiFi, WhatsApp, email & more',
//                   'Live preview as you type',
//                   'High-quality PNG download',
//                   'Works on mobile & desktop',
//                   'No data stored — full privacy',
//                 ].map((f, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="feature-dot w-1.5 h-1.5 rounded-full flex-shrink-0" />
//                     <span>{f}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── FAQ ── */}
//         <hr className="mid-divider" />
//         <section className="main-section py-16 px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Frequently Asked Questions
//             </h2>
//             <div className="space-y-3">
//               {[
//                 { q: 'Is the QR Code Generator free?', a: 'Yes, completely free with no sign-up or hidden costs. Generate unlimited QR codes forever.' },
//                 { q: 'What types of QR codes can I create?', a: 'URLs, plain text, WiFi passwords, WhatsApp links, email addresses, and contact details.' },
//                 { q: 'Do I need to install anything?', a: 'No installation needed — everything runs directly in your browser.' },
//                 { q: 'Can I use QR codes for printing?', a: 'Yes — PNG output is high resolution, perfect for posters, flyers, and business cards.' },
//                 { q: 'Is my data private?', a: 'Absolutely. Your input is never stored or shared. Everything processes locally.' },
//                 { q: 'Does it work on mobile?', a: 'Yes — fully optimized for phones, tablets, and desktops.' },
//               ].map((faq, i) => (
//                 <details key={i} className="faq-item rounded-xl p-5">
//                   <summary className="flex items-center justify-between gap-4">
//                     <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
//                     <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#6366F1' }} />
//                   </summary>
//                   <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── BOTTOM CTA ── */}
//         <section className="cta-section py-20 px-6 text-center">
//           <div className="max-w-xl mx-auto">
//             <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
//               Ready to create your QR code?
//             </h2>
//             <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
//               Takes less than 10 seconds. No signup. No ads.
//             </p>
//             <button
//               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//               className="cta-main-btn text-white text-base px-10 py-4 rounded-xl inline-flex items-center gap-2"
//             >
//               <QrCode className="w-5 h-5" />
//               Generate QR Code Now
//             </button>
//           </div>
//         </section>

//       </main>
//     </>
//   );
// }



