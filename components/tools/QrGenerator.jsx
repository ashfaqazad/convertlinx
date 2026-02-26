'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Link, Wifi, MessageCircle, Download, QrCode, ChevronDown } from 'lucide-react';
import Script from "next/script";

function PageStyles() {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

    * { box-sizing: border-box; }

    .qr-page {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #F5F3FF;
      color: #1a1a2e;
      min-height: 100vh;
    }

    .hero-bg {
      background: linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 40%, #FAF5FF 100%);
      position: relative;
      overflow: hidden;
    }
    .hero-blob-1 {
      position: absolute; width: 480px; height: 480px; border-radius: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
      top: -160px; right: -80px; pointer-events: none;
    }
    .hero-blob-2 {
      position: absolute; width: 320px; height: 320px; border-radius: 50%;
      background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
      bottom: -80px; left: -60px; pointer-events: none;
    }

    .tool-card {
      background: #ffffff;
      border: 1.5px solid rgba(99,102,241,0.12);
      box-shadow: 0 4px 6px -1px rgba(99,102,241,0.06), 0 20px 60px -10px rgba(99,102,241,0.1);
    }

    .qr-input {
      background: #F8F7FF;
      border: 1.5px solid #E0DCFF;
      color: #1a1a2e;
      font-family: 'Plus Jakarta Sans', sans-serif;
      transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    }
    .qr-input:focus {
      outline: none;
      border-color: #6366F1;
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
    }
    .qr-input::placeholder { color: #A5B4FC; }

    .qr-canvas-wrap {
      background: #ffffff;
      border: 1.5px solid #E0DCFF;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    .qr-canvas-wrap.active {
      border-color: #6366F1;
      box-shadow: 0 0 0 5px rgba(99,102,241,0.08), 0 8px 32px rgba(99,102,241,0.15);
    }

    .qr-placeholder-wrap {
      border: 2px dashed #D4D0FF;
      background: #F8F7FF;
    }

    .download-btn {
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      box-shadow: 0 4px 15px rgba(99,102,241,0.35), 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
    }
    .download-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99,102,241,0.45);
    }
    .download-btn:disabled {
      background: #D1D5DB;
      color: rgba(255,255,255,0.7);
      box-shadow: none;
      cursor: not-allowed;
      transform: none;
    }

    .benefit-card {
      background: #ffffff;
      border: 1.5px solid rgba(99,102,241,0.08);
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(99,102,241,0.05);
    }
    .benefit-card:hover {
      border-color: rgba(99,102,241,0.2);
      box-shadow: 0 8px 24px rgba(99,102,241,0.1);
      transform: translateY(-3px);
    }

    .step-card {
      background: #ffffff;
      border: 1.5px solid rgba(99,102,241,0.08);
      box-shadow: 0 2px 8px rgba(99,102,241,0.04);
    }
    .step-num {
      background: linear-gradient(135deg, #6366F1, #8B5CF6);
      font-weight: 800;
    }

    .faq-item {
      background: #ffffff;
      border: 1.5px solid rgba(99,102,241,0.08);
      transition: border-color 0.25s, box-shadow 0.25s;
    }
    .faq-item:hover {
      border-color: rgba(99,102,241,0.2);
      box-shadow: 0 4px 16px rgba(99,102,241,0.08);
    }
    .faq-item summary { list-style: none; cursor: pointer; }
    .faq-item summary::-webkit-details-marker { display: none; }

    .badge-pill {
      background: rgba(99,102,241,0.08);
      border: 1px solid rgba(99,102,241,0.2);
      color: #6366F1;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .ready-pill {
      background: rgba(99,102,241,0.06);
      border: 1px solid rgba(99,102,241,0.15);
    }

    .seo-box {
      background: #ffffff;
      border: 1.5px solid rgba(99,102,241,0.08);
    }
    .feature-dot {
      background: linear-gradient(135deg, #6366F1, #8B5CF6);
    }

    .alt-section { background: #ffffff; }
    .main-section { background: #F5F3FF; }

    .cta-section {
      background: linear-gradient(135deg, #6366F1 0%, #7C3AED 50%, #8B5CF6 100%);
    }
    .cta-main-btn {
      background: rgba(255,255,255,0.15);
      border: 1.5px solid rgba(255,255,255,0.4);
      backdrop-filter: blur(8px);
      transition: all 0.3s ease;
      font-weight: 700;
    }
    .cta-main-btn:hover {
      background: rgba(255,255,255,0.25);
      transform: translateY(-2px);
    }

    .mid-divider { border: none; border-top: 1px solid rgba(99,102,241,0.08); }
    .breadcrumb-link { color: #A5B4FC; transition: color 0.2s; }
    .breadcrumb-link:hover { color: #6366F1; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.5s ease forwards; }

    @keyframes scalePop {
      from { opacity: 0; transform: scale(0.96); }
      to   { opacity: 1; transform: scale(1); }
    }
    .scale-pop { animation: scalePop 0.35s ease forwards; }

    .grad-text {
      background: linear-gradient(135deg, #6366F1, #8B5CF6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

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
    a.download = 'qrcode-convertlyhub.png';
    a.click();
  };

  return (
    <>
      <PageStyles />

      <Script id="howto-schema-qr" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Create a QR Code Online for Free",
            description: "Generate QR codes for URLs, text, WiFi, vCard in seconds.",
            url: "https://convertlyhub.com/qr-generator",
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
              Why Use ConvertlyHub?
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
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Free QR Code Generator — ConvertlyHub
              </h2>
              <p className="leading-7 text-sm">
                The <span style={{ color: '#1a1a2e', fontWeight: 600 }}>ConvertlyHub QR Code Generator</span> lets
                you create high-quality QR codes in seconds — no sign-up, no watermarks, no software needed.
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
          </div>
        </section>

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
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

//         * { box-sizing: border-box; }

//         .qr-page {
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           background: #F5F3FF;
//           color: #1a1a2e;
//         }

//         .display-font { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; }

//         /* Hero soft gradient */
//         .hero-bg {
//           background: linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 40%, #FAF5FF 100%);
//           position: relative;
//           overflow: hidden;
//         }
//         .hero-blob-1 {
//           position: absolute; width: 500px; height: 500px; border-radius: 50%;
//           background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
//           top: -150px; right: -100px; pointer-events: none;
//         }
//         .hero-blob-2 {
//           position: absolute; width: 300px; height: 300px; border-radius: 50%;
//           background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
//           bottom: -80px; left: -60px; pointer-events: none;
//         }

//         /* Tool card */
//         .tool-card {
//           background: #ffffff;
//           border: 1.5px solid rgba(99,102,241,0.12);
//           box-shadow: 0 4px 6px -1px rgba(99,102,241,0.06), 0 20px 60px -10px rgba(99,102,241,0.1);
//         }

//         /* Input */
//         .qr-input {
//           background: #F8F7FF;
//           border: 1.5px solid #E0DCFF;
//           color: #1a1a2e;
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
//         }
//         .qr-input:focus {
//           outline: none;
//           border-color: #6366F1;
//           background: #ffffff;
//           box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
//         }
//         .qr-input::placeholder { color: #A5B4FC; }

//         /* QR canvas wrapper */
//         .qr-canvas-wrap {
//           background: #ffffff;
//           border: 1.5px solid #E0DCFF;
//           transition: border-color 0.3s, box-shadow 0.3s;
//         }
//         .qr-canvas-wrap.active {
//           border-color: #6366F1;
//           box-shadow: 0 0 0 6px rgba(99,102,241,0.08), 0 8px 32px rgba(99,102,241,0.15);
//         }

//         .qr-placeholder-wrap {
//           border: 2px dashed #D4D0FF;
//           background: #F8F7FF;
//         }

//         /* Download button */
//         .download-btn {
//           background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
//           box-shadow: 0 4px 15px rgba(99,102,241,0.35), 0 1px 3px rgba(0,0,0,0.1);
//           transition: all 0.3s ease;
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           font-weight: 600;
//         }
//         .download-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 25px rgba(99,102,241,0.45);
//         }
//         .download-btn:disabled {
//           background: #D1D5DB;
//           box-shadow: none;
//           cursor: not-allowed;
//           transform: none;
//         }

//         /* Benefit cards */
//         .benefit-card {
//           background: #ffffff;
//           border: 1.5px solid rgba(99,102,241,0.08);
//           transition: all 0.3s ease;
//           box-shadow: 0 2px 8px rgba(99,102,241,0.05);
//         }
//         .benefit-card:hover {
//           border-color: rgba(99,102,241,0.2);
//           box-shadow: 0 8px 24px rgba(99,102,241,0.1);
//           transform: translateY(-2px);
//         }

//         /* Steps */
//         .step-num {
//           background: linear-gradient(135deg, #6366F1, #8B5CF6);
//           font-weight: 800;
//           font-family: 'Plus Jakarta Sans', sans-serif;
//         }
//         .step-card {
//           background: #ffffff;
//           border: 1.5px solid rgba(99,102,241,0.08);
//           box-shadow: 0 2px 8px rgba(99,102,241,0.04);
//         }

//         /* FAQ */
//         .faq-item {
//           background: #ffffff;
//           border: 1.5px solid rgba(99,102,241,0.08);
//           transition: border-color 0.25s, box-shadow 0.25s;
//         }
//         .faq-item:hover {
//           border-color: rgba(99,102,241,0.2);
//           box-shadow: 0 4px 16px rgba(99,102,241,0.08);
//         }
//         .faq-item summary { list-style: none; cursor: pointer; }
//         .faq-item summary::-webkit-details-marker { display: none; }

//         /* Badge */
//         .badge-pill {
//           background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1));
//           border: 1px solid rgba(99,102,241,0.2);
//           color: #6366F1;
//           font-weight: 700;
//           font-size: 11px;
//           letter-spacing: 0.08em;
//           text-transform: uppercase;
//         }

//         /* SEO section */
//         .seo-section { background: #ffffff; border: 1.5px solid rgba(99,102,241,0.08); }
//         .feature-dot { background: linear-gradient(135deg, #6366F1, #8B5CF6); }

//         /* Bottom CTA */
//         .cta-section {
//           background: linear-gradient(135deg, #6366F1 0%, #7C3AED 50%, #8B5CF6 100%);
//         }
//         .cta-btn-outline {
//           background: rgba(255,255,255,0.15);
//           border: 1.5px solid rgba(255,255,255,0.4);
//           transition: all 0.3s ease;
//           backdrop-filter: blur(8px);
//         }
//         .cta-btn-outline:hover {
//           background: rgba(255,255,255,0.25);
//           transform: translateY(-2px);
//         }

//         /* Divider */
//         .light-divider { border: none; border-top: 1px solid rgba(99,102,241,0.08); }

//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .fade-up { animation: fadeUp 0.5s ease forwards; }

//         @keyframes scalePop {
//           from { opacity: 0; transform: scale(0.95); }
//           to   { opacity: 1; transform: scale(1); }
//         }
//         .scale-pop { animation: scalePop 0.4s ease forwards; }
//       `}</style>

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

//       <main className="qr-page min-h-screen">

//         {/* ── HERO ── */}
//         <section className="hero-bg py-16 px-6 text-center">
//           <div className="hero-blob-1" />
//           <div className="hero-blob-2" />
//           <div className="relative z-10 max-w-3xl mx-auto">

//             {/* Breadcrumb */}
//             <div className="flex items-center justify-center gap-2 text-sm text-indigo-400 mb-6 font-medium">
//               <a href="/" className="hover:text-indigo-600 transition">Home</a>
//               <span className="text-indigo-200">/</span>
//               <span className="text-indigo-600">QR Code Generator</span>
//             </div>

//             <span className="badge-pill inline-block px-4 py-1.5 rounded-full mb-5">
//               Free Tool
//             </span>

//             <h1 className="display-font text-4xl md:text-5xl leading-tight mb-4 text-gray-900">
//               QR Code{' '}
//               <span style={{
//                 background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//               }}>
//                 Generator
//               </span>
//             </h1>

//             <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
//               Create QR codes for URLs, WiFi, WhatsApp & more — instantly, free, no signup required.
//             </p>
//           </div>
//         </section>

//         {/* ── TOOL WORKSPACE ── */}
//         <section className="py-10 px-6 bg-[#F5F3FF]">
//           <div className="max-w-2xl mx-auto fade-up">
//             <div className="tool-card rounded-3xl p-8 md:p-10">

//               {/* Label */}
//               <label className="block text-sm font-semibold text-gray-500 mb-3 tracking-wide uppercase" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
//                 Enter your content
//               </label>

//               {/* Input */}
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
//                         style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))' }}>
//                         <QrCode className="w-8 h-8 text-indigo-400" />
//                       </div>
//                       <p className="text-indigo-300 text-sm text-center px-8 font-medium">
//                         Your QR code will appear here
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {isGenerated && (
//                   <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full"
//                     style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
//                     <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
//                     <span className="text-indigo-600 text-sm font-medium">QR code ready!</span>
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

//               {/* Trust */}
//               <div className="flex flex-wrap justify-center gap-4 mt-5">
//                 {['No signup', 'Unlimited use', 'Files not stored', '100% free'].map((t, i) => (
//                   <span key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
//                     <span className="w-1 h-1 rounded-full bg-indigo-300" />
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── BENEFITS ── */}
//         <hr className="light-divider" />
//         <section className="py-16 px-6 bg-[#F5F3FF]">
//           <div className="max-w-5xl mx-auto">
//             <h2 className="display-font text-3xl font-bold text-center text-gray-900 mb-10">
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
//                   <h3 className="font-bold text-gray-900 text-base mb-2">{b.title}</h3>
//                   <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── HOW TO ── */}
//         <hr className="light-divider" />
//         <section className="py-16 px-6 bg-white">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="display-font text-3xl font-bold text-center text-gray-900 mb-12">
//               3 Simple Steps
//             </h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {[
//                 { num: '1', title: 'Enter Your Data', desc: 'Type or paste a URL, text, WiFi details, or contact info in the input box.' },
//                 { num: '2', title: 'Instant Preview', desc: 'Your QR code generates live as you type — no button needed.' },
//                 { num: '3', title: 'Download & Share', desc: 'Save as high-quality PNG. Print it or use it on your website, cards, or posters.' },
//               ].map((s, i) => (
//                 <div key={i} className="step-card rounded-2xl p-7 text-center">
//                   <div className="step-num w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg text-white">
//                     {s.num}
//                   </div>
//                   <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
//                   <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── SEO CONTENT ── */}
//         <hr className="light-divider" />
//         <section className="py-16 px-6 bg-[#F5F3FF]">
//           <div className="max-w-3xl mx-auto space-y-8 text-gray-600">
//             <div>
//               <h2 className="display-font text-2xl font-bold text-gray-900 mb-4">
//                 Free QR Code Generator — ConvertlyHub
//               </h2>
//               <p className="leading-7 text-sm">
//                 The <span className="text-gray-900 font-semibold">ConvertlyHub QR Code Generator</span> lets
//                 you create high-quality QR codes in seconds — no sign-up, no watermarks, no software needed.
//                 Share website links, WiFi passwords, WhatsApp numbers, or contact details instantly.
//               </p>
//             </div>

//             <div>
//               <h3 className="font-bold text-gray-900 text-lg mb-3">What Is a QR Code?</h3>
//               <p className="leading-7 text-sm">
//                 A QR code (Quick Response code) is a scannable barcode that instantly opens digital content
//                 when scanned by a smartphone. It can store URLs, plain text, WiFi credentials, WhatsApp
//                 links, email addresses, or contact information — all in a single compact image.
//               </p>
//             </div>

//             <div>
//               <h3 className="font-bold text-gray-900 text-lg mb-4">Who Should Use This?</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Businesses — cards, flyers, packaging',
//                   'Restaurants — digital menus',
//                   'Event Organizers — tickets & info',
//                   'Students & Teachers — share resources',
//                   'Anyone — fast contactless sharing',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-2 text-sm">
//                     <span className="text-indigo-500 font-bold mt-0.5">→</span>
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="seo-section rounded-2xl p-6">
//               <h3 className="font-bold text-gray-900 text-lg mb-4">Features</h3>
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
//         <hr className="light-divider" />
//         <section className="py-16 px-6 bg-white">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="display-font text-3xl font-bold text-center text-gray-900 mb-10">
//               Frequently Asked Questions
//             </h2>
//             <div className="space-y-3">
//               {[
//                 { q: 'Is the QR Code Generator free?', a: 'Yes, completely free with no sign-up or hidden costs. Generate unlimited QR codes forever.' },
//                 { q: 'What types of QR codes can I create?', a: 'URLs, plain text, WiFi passwords, WhatsApp links, email addresses, and contact details.' },
//                 { q: 'Do I need to install anything?', a: 'No installation needed — everything runs directly in your browser.' },
//                 { q: 'Can I use QR codes for printing?', a: 'Yes — PNG output is high resolution, perfect for posters, flyers, and business cards.' },
//                 { q: 'Is my data private?', a: 'Absolutely. Your input is never stored or shared. Everything processes locally in your browser.' },
//                 { q: 'Does it work on mobile?', a: 'Yes — fully optimized for phones, tablets, and desktop computers.' },
//               ].map((faq, i) => (
//                 <details key={i} className="faq-item rounded-xl p-5">
//                   <summary className="flex items-center justify-between gap-4">
//                     <span className="font-semibold text-gray-800 text-sm">{faq.q}</span>
//                     <ChevronDown className="w-4 h-4 text-indigo-400 flex-shrink-0" />
//                   </summary>
//                   <p className="mt-3 text-gray-500 text-sm leading-relaxed">{faq.a}</p>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── BOTTOM CTA ── */}
//         <section className="cta-section py-20 px-6 text-center text-white">
//           <div className="max-w-xl mx-auto">
//             <h2 className="display-font text-3xl md:text-4xl font-bold mb-4">
//               Ready to create your QR code?
//             </h2>
//             <p className="text-indigo-200 mb-8 text-base">
//               Takes less than 10 seconds. No signup. No ads.
//             </p>
//             <button
//               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//               className="cta-btn-outline text-white font-semibold text-base px-10 py-4 rounded-xl inline-flex items-center gap-2"
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



























// // 'use client';

// // import { useState, useEffect, useRef } from 'react';
// // import QRCode from 'qrcode';
// // import { Link, Wifi, MessageCircle, Download, QrCode, ChevronDown } from 'lucide-react';
// // import Script from "next/script";

// // export default function QRGenerator() {
// //   const [text, setText] = useState('');
// //   const [isGenerated, setIsGenerated] = useState(false);
// //   const canvasRef = useRef(null);

// //   useEffect(() => {
// //     if (text && canvasRef.current) {
// //       QRCode.toCanvas(
// //         canvasRef.current,
// //         text,
// //         {
// //           width: 280,
// //           margin: 2,
// //           color: { dark: '#ffffff', light: '#0D0D14' },
// //         },
// //         (error) => {
// //           if (error) console.error(error);
// //           else setIsGenerated(true);
// //         }
// //       );
// //     } else {
// //       setIsGenerated(false);
// //     }
// //   }, [text]);

// //   const handleDownload = () => {
// //     if (!canvasRef.current) return;

// //     // Create a new canvas with padding and branding
// //     const src = canvasRef.current;
// //     const out = document.createElement('canvas');
// //     const pad = 24;
// //     out.width = src.width + pad * 2;
// //     out.height = src.height + pad * 2;
// //     const ctx = out.getContext('2d');
// //     ctx.fillStyle = '#0D0D14';
// //     ctx.fillRect(0, 0, out.width, out.height);
// //     ctx.drawImage(src, pad, pad);

// //     const url = out.toDataURL('image/png');
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = 'qrcode-convertlyhub.png';
// //     a.click();
// //   };

// //   return (
// //     <>
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

// //         .qr-page { font-family: 'DM Sans', sans-serif; }
// //         .display-font { font-family: 'Syne', sans-serif; }

// //         .grid-bg {
// //           background-image:
// //             linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
// //             linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
// //           background-size: 44px 44px;
// //         }

// //         .tool-workspace {
// //           background: rgba(255,255,255,0.025);
// //           border: 1px solid rgba(255,255,255,0.07);
// //           backdrop-filter: blur(12px);
// //         }

// //         .qr-input {
// //           background: rgba(255,255,255,0.04);
// //           border: 1px solid rgba(255,255,255,0.1);
// //           color: #fff;
// //           transition: border-color 0.25s ease, background 0.25s ease;
// //           font-family: 'DM Sans', sans-serif;
// //         }
// //         .qr-input:focus {
// //           outline: none;
// //           border-color: rgba(99,102,241,0.7);
// //           background: rgba(99,102,241,0.06);
// //         }
// //         .qr-input::placeholder { color: rgba(255,255,255,0.25); }

// //         .qr-canvas-wrap {
// //           background: #0D0D14;
// //           border: 1px solid rgba(255,255,255,0.08);
// //           transition: border-color 0.3s ease, box-shadow 0.3s ease;
// //         }
// //         .qr-canvas-wrap.active {
// //           border-color: rgba(99,102,241,0.5);
// //           box-shadow: 0 0 40px rgba(99,102,241,0.15);
// //         }

// //         .qr-placeholder {
// //           border: 1px dashed rgba(255,255,255,0.12);
// //         }

// //         .download-btn {
// //           background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
// //           box-shadow: 0 0 24px rgba(99,102,241,0.35);
// //           transition: all 0.3s ease;
// //           font-family: 'DM Sans', sans-serif;
// //         }
// //         .download-btn:hover {
// //           transform: translateY(-2px);
// //           box-shadow: 0 0 40px rgba(99,102,241,0.55);
// //         }
// //         .download-btn:disabled {
// //           opacity: 0.35;
// //           cursor: not-allowed;
// //           transform: none;
// //           box-shadow: none;
// //         }

// //         .benefit-card {
// //           background: rgba(255,255,255,0.02);
// //           border: 1px solid rgba(255,255,255,0.06);
// //           transition: border-color 0.3s ease, background 0.3s ease;
// //         }
// //         .benefit-card:hover {
// //           background: rgba(255,255,255,0.04);
// //           border-color: rgba(255,255,255,0.12);
// //         }

// //         .step-num {
// //           background: linear-gradient(135deg, #6366F1, #8B5CF6);
// //           font-family: 'Syne', sans-serif;
// //         }

// //         .faq-item {
// //           background: rgba(255,255,255,0.02);
// //           border: 1px solid rgba(255,255,255,0.06);
// //           transition: border-color 0.25s ease;
// //         }
// //         .faq-item:hover { border-color: rgba(255,255,255,0.1); }
// //         .faq-item summary {
// //           list-style: none;
// //           cursor: pointer;
// //         }
// //         .faq-item summary::-webkit-details-marker { display: none; }

// //         .badge {
// //           background: rgba(99,102,241,0.12);
// //           border: 1px solid rgba(99,102,241,0.25);
// //           color: #818CF8;
// //           font-family: 'Syne', sans-serif;
// //           font-size: 11px;
// //           font-weight: 600;
// //           letter-spacing: 0.08em;
// //           text-transform: uppercase;
// //         }

// //         @keyframes fadeUp {
// //           from { opacity: 0; transform: translateY(16px); }
// //           to   { opacity: 1; transform: translateY(0); }
// //         }
// //         .fade-up { animation: fadeUp 0.5s ease forwards; }

// //         .section-divider {
// //           border: none;
// //           border-top: 1px solid rgba(255,255,255,0.05);
// //         }
// //       `}</style>

// //       <Script id="howto-schema-qr" type="application/ld+json" strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "HowTo",
// //             name: "How to Create a QR Code Online for Free",
// //             description: "Generate QR codes for URLs, text, WiFi, vCard in seconds.",
// //             url: "https://convertlyhub.com/qr-generator",
// //             step: [
// //               { "@type": "HowToStep", name: "Enter Data", text: "Paste URL, text, or contact details." },
// //               { "@type": "HowToStep", name: "Preview", text: "QR code generates instantly." },
// //               { "@type": "HowToStep", name: "Download", text: "Download high-resolution PNG." }
// //             ],
// //             totalTime: "PT30S",
// //             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
// //           }, null, 2)
// //         }}
// //       />

// //       <main className="qr-page min-h-screen bg-[#0A0A0F] text-white">

// //         {/* ── PAGE HERO ── */}
// //         <section className="relative grid-bg pt-16 pb-10 px-6 text-center overflow-hidden">
// //           <div className="absolute inset-0 pointer-events-none"
// //             style={{ background: 'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(99,102,241,0.2) 0%, transparent 70%)' }}
// //           />
// //           <div className="relative z-10 max-w-3xl mx-auto">
// //             {/* Breadcrumb */}
// //             <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
// //               <a href="/" className="hover:text-gray-300 transition">Home</a>
// //               <span>/</span>
// //               <span className="text-gray-300">QR Code Generator</span>
// //             </div>

// //             <span className="badge inline-block px-3 py-1 rounded-full mb-5">Free Tool</span>

// //             <h1 className="display-font text-4xl md:text-5xl font-extrabold leading-tight mb-4">
// //               QR Code Generator
// //             </h1>
// //             <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
// //               Create QR codes for URLs, WiFi, WhatsApp & more — instantly, free, no signup.
// //             </p>
// //           </div>
// //         </section>

// //         {/* ── TOOL WORKSPACE ── */}
// //         <section className="py-10 px-6">
// //           <div className="max-w-2xl mx-auto">
// //             <div className="tool-workspace rounded-3xl p-8 md:p-10 fade-up">

// //               {/* Input */}
// //               <div className="mb-7">
// //                 <label className="block text-sm text-gray-400 font-medium mb-3">
// //                   Enter your URL, text, or any content
// //                 </label>
// //                 <input
// //                   type="text"
// //                   value={text}
// //                   onChange={(e) => setText(e.target.value)}
// //                   placeholder="e.g. https://convertlyhub.com or WiFi password..."
// //                   className="qr-input w-full px-5 py-4 rounded-xl text-base"
// //                 />
// //               </div>

// //               {/* QR Preview */}
// //               <div className="flex flex-col items-center mb-7">
// //                 <div className={`qr-canvas-wrap rounded-2xl p-5 ${isGenerated ? 'active' : ''}`}>
// //                   {text ? (
// //                     <canvas ref={canvasRef} className="rounded-xl block" />
// //                   ) : (
// //                     <div className="qr-placeholder w-[280px] h-[280px] rounded-xl flex flex-col items-center justify-center gap-3">
// //                       <QrCode className="w-12 h-12 text-gray-600" />
// //                       <p className="text-gray-600 text-sm text-center px-6">
// //                         Your QR code will appear here
// //                       </p>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {isGenerated && (
// //                   <p className="text-indigo-400 text-sm mt-4 flex items-center gap-2">
// //                     <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse inline-block" />
// //                     QR code ready to download
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Download Button */}
// //               <button
// //                 onClick={handleDownload}
// //                 disabled={!isGenerated}
// //                 className="download-btn w-full text-white font-semibold text-base py-4 rounded-xl flex items-center justify-center gap-2"
// //               >
// //                 <Download className="w-5 h-5" />
// //                 Download QR Code (PNG)
// //               </button>

// //               {/* Trust line */}
// //               <p className="text-center text-gray-600 text-xs mt-5">
// //                 No signup · Unlimited use · Files not stored · 100% free
// //               </p>
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── BENEFITS ── */}
// //         <hr className="section-divider max-w-5xl mx-auto" />
// //         <section className="py-16 px-6">
// //           <div className="max-w-5xl mx-auto">
// //             <h2 className="display-font text-3xl font-bold text-center text-white mb-10">
// //               Why Use ConvertlyHub QR Generator?
// //             </h2>
// //             <div className="grid md:grid-cols-3 gap-5">
// //               {[
// //                 {
// //                   icon: <Link className="w-6 h-6" />,
// //                   color: '#6366F1',
// //                   title: 'Any Content Type',
// //                   desc: 'URLs, text, WiFi, WhatsApp, vCard, email — all supported.',
// //                 },
// //                 {
// //                   icon: <Wifi className="w-6 h-6" />,
// //                   color: '#10B981',
// //                   title: 'High Quality',
// //                   desc: 'Sharp PNG output — works for print and digital. Fast scanning guaranteed.',
// //                 },
// //                 {
// //                   icon: <MessageCircle className="w-6 h-6" />,
// //                   color: '#F59E0B',
// //                   title: 'Private & Unlimited',
// //                   desc: 'Generate unlimited QR codes. No data stored. Completely private.',
// //                 },
// //               ].map((b, i) => (
// //                 <div key={i} className="benefit-card rounded-2xl p-7">
// //                   <div
// //                     className="p-3 rounded-xl inline-flex mb-5"
// //                     style={{ background: `${b.color}18`, color: b.color }}
// //                   >
// //                     {b.icon}
// //                   </div>
// //                   <h3 className="text-white font-semibold text-base mb-2">{b.title}</h3>
// //                   <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── HOW TO STEPS ── */}
// //         <hr className="section-divider max-w-5xl mx-auto" />
// //         <section className="py-16 px-6">
// //           <div className="max-w-4xl mx-auto">
// //             <h2 className="display-font text-3xl font-bold text-center text-white mb-12">
// //               How to Create a QR Code — 3 Steps
// //             </h2>
// //             <div className="grid md:grid-cols-3 gap-8">
// //               {[
// //                 { num: '1', title: 'Enter Your Data', desc: 'Type or paste a URL, text, WiFi details, or contact info.' },
// //                 { num: '2', title: 'Preview Instantly', desc: 'QR code generates live as you type — no button click needed.' },
// //                 { num: '3', title: 'Download & Use', desc: 'Save as high-quality PNG. Print it or use it digitally.' },
// //               ].map((s, i) => (
// //                 <div key={i} className="text-center">
// //                   <div className="step-num w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-xl font-bold text-white">
// //                     {s.num}
// //                   </div>
// //                   <h3 className="text-white font-semibold text-base mb-2">{s.title}</h3>
// //                   <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── SEO CONTENT ── */}
// //         <hr className="section-divider max-w-5xl mx-auto" />
// //         <section className="py-16 px-6">
// //           <div className="max-w-3xl mx-auto text-gray-400 space-y-8">
// //             <div>
// //               <h2 className="display-font text-2xl font-bold text-white mb-4">
// //                 Free QR Code Generator — ConvertlyHub
// //               </h2>
// //               <p className="leading-7 text-sm">
// //                 Need to share a website link, WiFi password, WhatsApp number, or contact details quickly?
// //                 The <span className="text-gray-200 font-medium">ConvertlyHub QR Code Generator</span> lets
// //                 you create high-quality QR codes in seconds — no sign-up, no watermarks, no software needed.
// //               </p>
// //             </div>

// //             <div>
// //               <h3 className="text-white font-semibold text-lg mb-3">What Is a QR Code?</h3>
// //               <p className="leading-7 text-sm">
// //                 A QR code (Quick Response code) is a scannable code that instantly opens digital information
// //                 when scanned with a smartphone. It can store URLs, plain text, WiFi credentials, WhatsApp
// //                 links, email addresses, or contact info.
// //               </p>
// //             </div>

// //             <div>
// //               <h3 className="text-white font-semibold text-lg mb-3">Who Should Use This?</h3>
// //               <div className="grid sm:grid-cols-2 gap-3">
// //                 {[
// //                   'Businesses — cards, flyers, packaging',
// //                   'Restaurants — digital menus',
// //                   'Event Organizers — tickets & info',
// //                   'Students & Teachers — share links easily',
// //                   'Anyone — fast contactless sharing',
// //                 ].map((item, i) => (
// //                   <div key={i} className="flex items-start gap-2 text-sm">
// //                     <span className="text-indigo-400 mt-0.5">→</span>
// //                     <span>{item}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             <div className="benefit-card rounded-2xl p-6">
// //               <h3 className="text-white font-semibold text-lg mb-4">Features</h3>
// //               <div className="grid sm:grid-cols-2 gap-2">
// //                 {[
// //                   'Completely free, no hidden costs',
// //                   'URLs, text, WiFi, WhatsApp, email',
// //                   'Live preview as you type',
// //                   'High-quality PNG download',
// //                   'Works on mobile & desktop',
// //                   'No data stored — full privacy',
// //                 ].map((f, i) => (
// //                   <div key={i} className="flex items-center gap-2 text-sm">
// //                     <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
// //                     <span>{f}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── FAQ ── */}
// //         <hr className="section-divider max-w-5xl mx-auto" />
// //         <section className="py-16 px-6">
// //           <div className="max-w-3xl mx-auto">
// //             <h2 className="display-font text-3xl font-bold text-center text-white mb-10">
// //               Frequently Asked Questions
// //             </h2>
// //             <div className="space-y-3">
// //               {[
// //                 { q: 'Is the QR Code Generator free to use?', a: 'Yes, completely free with no sign-up or hidden costs. Generate unlimited QR codes forever.' },
// //                 { q: 'What types of QR codes can I create?', a: 'URLs, plain text, WiFi passwords, WhatsApp links, email addresses, and contact details.' },
// //                 { q: 'Do I need to install any software?', a: 'No installation needed. Everything works directly in your browser.' },
// //                 { q: 'Will the QR code work for printing?', a: 'Yes — PNG output is high resolution and suitable for posters, flyers, and business cards.' },
// //                 { q: 'Is my data private?', a: 'Absolutely. We do not store your input. Everything is processed locally in your browser.' },
// //                 { q: 'Does it work on mobile?', a: 'Yes — fully optimized for phones, tablets, and desktops.' },
// //               ].map((faq, i) => (
// //                 <details key={i} className="faq-item rounded-xl p-5">
// //                   <summary className="flex items-center justify-between gap-4">
// //                     <span className="text-gray-200 font-medium text-sm">{faq.q}</span>
// //                     <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 transition-transform" />
// //                   </summary>
// //                   <p className="mt-3 text-gray-500 text-sm leading-relaxed">{faq.a}</p>
// //                 </details>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── BOTTOM CTA ── */}
// //         <hr className="section-divider max-w-5xl mx-auto" />
// //         <section className="py-20 px-6 text-center">
// //           <div className="max-w-xl mx-auto">
// //             <h2 className="display-font text-3xl md:text-4xl font-bold text-white mb-4">
// //               Ready to create your QR code?
// //             </h2>
// //             <p className="text-gray-500 mb-8 text-base">Scroll up — it takes less than 10 seconds.</p>
// //             <button
// //               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
// //               className="download-btn text-white font-semibold text-base px-10 py-4 rounded-xl inline-flex items-center gap-2"
// //             >
// //               <QrCode className="w-5 h-5" />
// //               Generate QR Code Now
// //             </button>
// //           </div>
// //         </section>

// //       </main>
// //     </>
// //   );
// // }





































// // // 'use client';

// // // import { useState, useEffect, useRef } from 'react';
// // // import QRCode from 'qrcode';
// // // import { Link, Wifi, MessageCircle, Download } from 'lucide-react'; // Icons ke liye
// // // import Script from "next/script";
// // // import RelatedToolsSection from "@/components/RelatedTools";




// // // export default function QRGenerator() {
// // //   const [text, setText] = useState('');
// // //   const canvasRef = useRef(null);

// // //   useEffect(() => {
// // //     if (text && canvasRef.current) {
// // //       QRCode.toCanvas(canvasRef.current, text, { width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } }, (error) => {
// // //         if (error) console.error(error);
// // //       });
// // //     }
// // //   }, [text]);

// // //   return (
// // //     <>


// // //       <Script id="howto-schema-qr" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
// // //         __html: JSON.stringify({
// // //           "@context": "https://schema.org",
// // //           "@type": "HowTo",
// // //           name: "How to Create Custom QR Code Online for Free",
// // //           description: "Generate QR codes for URLs, text, WiFi, vCard in seconds - completely free.",
// // //           url: "https://pdflinx.com/qr-generator",
// // //           step: [
// // //             { "@type": "HowToStep", name: "Enter Data", text: "Paste URL, text, or contact details." },
// // //             { "@type": "HowToStep", name: "Customize", text: "Add colors, logo, change style." },
// // //             { "@type": "HowToStep", name: "Download", text: "Download high-resolution PNG or SVG." }
// // //           ],
// // //           totalTime: "PT30S",
// // //           estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
// // //           image: "https://pdflinx.com/og-image.png"
// // //         }, null, 2)
// // //       }} />

// // //       <Script id="breadcrumb-schema-qr" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
// // //         __html: JSON.stringify({
// // //           "@context": "https://schema.org",
// // //           "@type": "BreadcrumbList",
// // //           itemListElement: [
// // //             { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
// // //             { "@type": "ListItem", position: 2, name: "QR Code Generator", item: "https://pdflinx.com/qr-generator" }
// // //           ]
// // //         }, null, 2)
// // //       }} />



// // //       {/* ==================== MAIN TOOL SECTION ==================== */}
// // //       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
// // //         <div className="max-w-4xl mx-auto">
// // //           {/* Header */}
// // //           <div className="text-center mb-8">
// // //             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
// // //               QR Code Generator Online (Free)
// // //             </h1>
// // //             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// // //               Create custom QR codes instantly for URLs, text, WiFi, WhatsApp, vCard & more — 100% free, no signup, high quality download.
// // //             </p>
// // //           </div>

// // //           {/* Tool Card */}
// // //           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
// // //             <input
// // //               type="text"
// // //               value={text}
// // //               onChange={(e) => setText(e.target.value)}
// // //               placeholder="Enter URL, text, Wi-Fi password, contact, WhatsApp number..."
// // //               className="w-full p-4 text-base border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none mb-6 transition"
// // //             />

// // //             <div className="flex justify-center mb-6">
// // //               {text ? (
// // //                 <canvas ref={canvasRef} className="border-2 border-purple-200 rounded-xl shadow-md" />
// // //               ) : (
// // //                 <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 text-center p-4">
// // //                   Enter text above to generate QR code
// // //                 </div>
// // //               )}
// // //             </div>

// // //             {text && (
// // //               <div className="text-center">
// // //                 <button
// // //                   onClick={() => {
// // //                     const url = canvasRef.current.toDataURL('image/png');
// // //                     const link = document.createElement('a');
// // //                     link.href = url;
// // //                     link.download = 'qr-code-pdflinx.png';
// // //                     link.click();
// // //                   }}
// // //                   className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg px-8 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition shadow-md flex items-center gap-2 mx-auto"
// // //                 >
// // //                   <Download size={20} />
// // //                   Download QR Code (PNG)
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>

// // //           <p className="text-center mt-6 text-gray-600 text-base">
// // //             No signup • Unlimited use • Files not stored • 100% free
// // //           </p>
// // //         </div>
// // //       </main>

// // //       {/* ==================== SEO CONTENT SECTION - QR CODE GENERATOR ==================== */}
// // //       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
// // //         {/* Main Heading */}
// // //         <div className="text-center mb-12">
// // //           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
// // //             QR Code Generator Online Free - Create Custom QR Instantly
// // //           </h2>
// // //           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
// // //             Generate professional QR codes for websites, WiFi, WhatsApp, contacts, text, and more. Fully customizable, high-resolution, and completely free with PDF Linx.
// // //           </p>
// // //         </div>

// // //         {/* Benefits Grid - 3 Cards */}
// // //         <div className="grid md:grid-cols-3 gap-8 mb-16">
// // //           <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
// // //             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
// // //               <Link className="w-8 h-8 text-white" />
// // //             </div>
// // //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Any Content Type</h3>
// // //             <p className="text-gray-600 text-sm">
// // //               Create QR for URLs, text, WiFi password, WhatsApp chat, vCard, email, phone — everything supported.
// // //             </p>
// // //           </div>

// // //           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
// // //             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
// // //               <Wifi className="w-8 h-8 text-white" />
// // //             </div>
// // //             <h3 className="text-xl font-semibold text-gray-800 mb-3">High Quality & Customizable</h3>
// // //             <p className="text-gray-600 text-sm">
// // //               Download in high-resolution PNG. Works perfectly on print and digital. Fast scanning guaranteed.
// // //             </p>
// // //           </div>

// // //           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
// // //             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
// // //               <MessageCircle className="w-8 h-8 text-white" />
// // //             </div>
// // //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast, Secure & Free</h3>
// // //             <p className="text-gray-600 text-sm">
// // //               Generate unlimited QR codes instantly. No signup, no data stored, completely private and free forever.
// // //             </p>
// // //           </div>
// // //         </div>

// // //         {/* How To Steps */}
// // //         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
// // //           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
// // //             How to Create QR Code in 3 Simple Steps
// // //           </h3>
// // //           <div className="grid md:grid-cols-3 gap-8">
// // //             <div className="text-center">
// // //               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// // //                 1
// // //               </div>
// // //               <h4 className="text-lg font-semibold mb-2">Enter Your Data</h4>
// // //               <p className="text-gray-600 text-sm">Type or paste URL, text, WiFi details, contact, or message.</p>
// // //             </div>

// // //             <div className="text-center">
// // //               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// // //                 2
// // //               </div>
// // //               <h4 className="text-lg font-semibold mb-2">QR Code Appears</h4>
// // //               <p className="text-gray-600 text-sm">Your custom QR code generates instantly with perfect quality.</p>
// // //             </div>

// // //             <div className="text-center">
// // //               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// // //                 3
// // //               </div>
// // //               <h4 className="text-lg font-semibold mb-2">Download & Use</h4>
// // //               <p className="text-gray-600 text-sm">Download high-quality PNG and use on posters, cards, websites.</p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Final CTA */}
// // //         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
// // //           Create professional QR codes every day with PDF Linx — trusted by thousands for fast, reliable, and free QR generation.
// // //         </p>
// // //       </section>


// // //       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
// // //   {/* Heading */}
// // //   <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
// // //     QR Code Generator – Free Online QR Code Generator by PDFLinx
// // //   </h2>

// // //   {/* Intro */}
// // //   <p className="text-base leading-7 mb-6">
// // //     Need to share a website link, WiFi password, WhatsApp number, or contact details quickly?
// // //     Typing long links or information can be frustrating and time-consuming.
// // //     That’s why we built the <span className="font-medium text-slate-900">PDFLinx QR Code Generator</span> —
// // //     a simple, fast, and completely free online tool that lets you create high-quality QR codes in seconds.
// // //     No sign-up, no watermarks, and no software installation required.
// // //   </p>

// // //   {/* What is */}
// // //   <h3 className="text-xl font-semibold text-slate-900 mb-3">
// // //     What Is a QR Code?
// // //   </h3>
// // //   <p className="leading-7 mb-6">
// // //     A QR code (Quick Response code) is a scannable code that instantly opens digital information
// // //     when scanned with a smartphone camera. It can store URLs, plain text, WiFi credentials,
// // //     WhatsApp chat links, email addresses, or contact information.
// // //     QR codes make sharing information faster, cleaner, and more convenient.
// // //   </p>

// // //   {/* Why use */}
// // //   <h3 className="text-xl font-semibold text-slate-900 mb-3">
// // //     Why Use a QR Code Generator?
// // //   </h3>
// // //   <ul className="space-y-2 mb-6 list-disc pl-6">
// // //     <li>Share website links instantly without typing</li>
// // //     <li>Let users connect to WiFi without revealing passwords</li>
// // //     <li>Create quick access to WhatsApp chats or phone numbers</li>
// // //     <li>Share contact details using a single scan</li>
// // //     <li>Perfect for posters, menus, business cards, and events</li>
// // //   </ul>

// // //   {/* Steps */}
// // //   <h3 className="text-xl font-semibold text-slate-900 mb-3">
// // //     How to Generate a QR Code Online
// // //   </h3>
// // //   <ol className="space-y-2 mb-6 list-decimal pl-6">
// // //     <li>Enter or paste your data (URL, text, WiFi details, WhatsApp number, or contact)</li>
// // //     <li>Your QR code is generated instantly with a live preview</li>
// // //     <li>Download the QR code in high-quality image format</li>
// // //     <li>Use it anywhere — print it or share it digitally</li>
// // //   </ol>

// // //   <p className="mb-6">
// // //     No registration, no usage limits, and no hidden restrictions — 100% free and easy to use.
// // //   </p>

// // //   {/* Features box */}
// // //   <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
// // //     <h3 className="text-xl font-semibold text-slate-900 mb-4">
// // //       Features of PDFLinx QR Code Generator
// // //     </h3>
// // //     <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
// // //       <li>Completely free QR code generator</li>
// // //       <li>Supports URLs, text, WiFi, WhatsApp, email, and contacts</li>
// // //       <li>Instant QR code generation with live preview</li>
// // //       <li>High-quality image downloads</li>
// // //       <li>Fast, reliable, and easy to use</li>
// // //       <li>Works perfectly on mobile and desktop</li>
// // //       <li>No data storage — full privacy protection</li>
// // //     </ul>
// // //   </div>

// // //   {/* Audience */}
// // //   <h3 className="text-xl font-semibold text-slate-900 mb-3">
// // //     Who Should Use This Tool?
// // //   </h3>
// // //   <ul className="space-y-2 mb-6 list-disc pl-6">
// // //     <li><strong>Businesses:</strong> Add QR codes to business cards, flyers, and packaging</li>
// // //     <li><strong>Restaurants:</strong> Share digital menus using QR codes</li>
// // //     <li><strong>Event Organizers:</strong> Provide instant access to tickets and event details</li>
// // //     <li><strong>Students & Teachers:</strong> Share study resources and links easily</li>
// // //     <li><strong>Anyone:</strong> Who wants fast, contactless information sharing</li>
// // //   </ul>

// // //   {/* Safety */}
// // //   <h3 className="text-xl font-semibold text-slate-900 mb-3">
// // //     Is PDFLinx QR Code Generator Safe to Use?
// // //   </h3>
// // //   <p className="leading-7 mb-6">
// // //     Yes, it is completely safe. Your input is only used to generate the QR code
// // //     and is not stored or shared.
// // //     We respect your privacy and ensure a secure, trustworthy experience every time.
// // //   </p>

// // //   {/* Closing */}
// // //   <h3 className="text-xl font-semibold text-slate-900 mb-3">
// // //     Create QR Codes Anytime, Anywhere
// // //   </h3>
// // //   <p className="leading-7">
// // //     PDFLinx QR Code Generator works smoothly on Windows, macOS, Linux, Android, and iOS.
// // //     Whether you are on a phone, tablet, or computer, you can generate QR codes instantly
// // //     using just your browser and an internet connection.
// // //   </p>
// // // </section>


// // // <section className="py-16 bg-gray-50">
// // //   <div className="max-w-4xl mx-auto px-4">

// // //     <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
// // //       Frequently Asked Questions
// // //     </h2>

// // //     <div className="space-y-4">

// // //       <details className="bg-white rounded-lg shadow-sm p-5">
// // //         <summary className="font-semibold cursor-pointer">
// // //           Is the QR Code Generator free to use?
// // //         </summary>
// // //         <p className="mt-2 text-gray-600">
// // //           Yes, it is completely free with no sign-up or hidden costs.
// // //         </p>
// // //       </details>

// // //       <details className="bg-white rounded-lg shadow-sm p-5">
// // //         <summary className="font-semibold cursor-pointer">
// // //           What types of QR codes can I create?
// // //         </summary>
// // //         <p className="mt-2 text-gray-600">
// // //           You can generate QR codes for websites, text, WiFi networks, WhatsApp chats,
// // //           email addresses, and contact details.
// // //         </p>
// // //       </details>

// // //       <details className="bg-white rounded-lg shadow-sm p-5">
// // //         <summary className="font-semibold cursor-pointer">
// // //           Do I need to install any software?
// // //         </summary>
// // //         <p className="mt-2 text-gray-600">
// // //           No installation is required. Everything works directly in your browser.
// // //         </p>
// // //       </details>

// // //       <details className="bg-white rounded-lg shadow-sm p-5">
// // //         <summary className="font-semibold cursor-pointer">
// // //           Will the QR code work for printing?
// // //         </summary>
// // //         <p className="mt-2 text-gray-600">
// // //           Yes, QR codes are generated in high quality and are suitable for printing on
// // //           posters, flyers, and business cards.
// // //         </p>
// // //       </details>

// // //       <details className="bg-white rounded-lg shadow-sm p-5">
// // //         <summary className="font-semibold cursor-pointer">
// // //           Are my QR codes private?
// // //         </summary>
// // //         <p className="mt-2 text-gray-600">
// // //           Yes. We do not store your data, and your content remains private.
// // //         </p>
// // //       </details>

// // //       <details className="bg-white rounded-lg shadow-sm p-5">
// // //         <summary className="font-semibold cursor-pointer">
// // //           Can I generate QR codes on my phone?
// // //         </summary>
// // //         <p className="mt-2 text-gray-600">
// // //           Absolutely. The tool works perfectly on mobile phones, tablets, and desktops.
// // //         </p>
// // //       </details>

// // //     </div>
// // //   </div>
// // // </section>



// // //       <RelatedToolsSection currentPage="qr-generator" />

// // //     </>
// // //   );
// // // }




















// // // // 'use client';

// // // // import { useState, useEffect, useRef } from 'react';
// // // // import QRCode from 'qrcode';
// // // // import { Link, Wifi, MessageCircle, Download } from 'lucide-react'; // Icons ke liye
// // // // import Script from "next/script";
// // // // import RelatedToolsSection from "@/components/RelatedTools";





// // // // export default function QRGenerator() {
// // // //   const [text, setText] = useState('');
// // // //   const canvasRef = useRef(null);

// // // //   useEffect(() => {
// // // //     if (text && canvasRef.current) {
// // // //       QRCode.toCanvas(canvasRef.current, text, { width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } }, (error) => {
// // // //         if (error) console.error(error);
// // // //       });
// // // //     }
// // // //   }, [text]);

// // // //   return (
// // // //     <>


// // // //       <Script id="howto-schema-qr" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
// // // //         __html: JSON.stringify({
// // // //           "@context": "https://schema.org",
// // // //           "@type": "HowTo",
// // // //           name: "How to Create Custom QR Code Online for Free",
// // // //           description: "Generate QR codes for URLs, text, WiFi, vCard in seconds - completely free.",
// // // //           url: "https://pdflinx.com/qr-generator",
// // // //           step: [
// // // //             { "@type": "HowToStep", name: "Enter Data", text: "Paste URL, text, or contact details." },
// // // //             { "@type": "HowToStep", name: "Customize", text: "Add colors, logo, change style." },
// // // //             { "@type": "HowToStep", name: "Download", text: "Download high-resolution PNG or SVG." }
// // // //           ],
// // // //           totalTime: "PT30S",
// // // //           estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
// // // //           image: "https://pdflinx.com/og-image.png"
// // // //         }, null, 2)
// // // //       }} />

// // // //       <Script id="breadcrumb-schema-qr" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
// // // //         __html: JSON.stringify({
// // // //           "@context": "https://schema.org",
// // // //           "@type": "BreadcrumbList",
// // // //           itemListElement: [
// // // //             { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
// // // //             { "@type": "ListItem", position: 2, name: "QR Code Generator", item: "https://pdflinx.com/qr-generator" }
// // // //           ]
// // // //         }, null, 2)
// // // //       }} />



// // // //       {/* ==================== MAIN TOOL SECTION ==================== */}
// // // //       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
// // // //         <div className="max-w-3xl mx-auto">
// // // //           {/* Header */}
// // // //           <div className="text-center mb-12">
// // // //             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
// // // //               QR Code Generator <br /> Online (Free)
// // // //             </h1>
// // // //             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
// // // //               Create custom QR codes instantly for URLs, text, WiFi, WhatsApp, vCard & more — 100% free, no signup, high quality download.
// // // //             </p>
// // // //           </div>

// // // //           {/* Tool Card */}
// // // //           <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
// // // //             <input
// // // //               type="text"
// // // //               value={text}
// // // //               onChange={(e) => setText(e.target.value)}
// // // //               placeholder="Enter URL, text, Wi-Fi password, contact, WhatsApp number..."
// // // //               className="w-full p-5 text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none mb-8 transition"
// // // //             />

// // // //             <div className="flex justify-center mb-8">
// // // //               {text ? (
// // // //                 <canvas ref={canvasRef} className="border-4 border-purple-200 rounded-2xl shadow-xl" />
// // // //               ) : (
// // // //                 <div className="w-80 h-80 border-4 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-500 text-center p-8">
// // // //                   Enter text above to generate QR code
// // // //                 </div>
// // // //               )}
// // // //             </div>

// // // //             {text && (
// // // //               <div className="text-center">
// // // //                 <button
// // // //                   onClick={() => {
// // // //                     const url = canvasRef.current.toDataURL('image/png');
// // // //                     const link = document.createElement('a');
// // // //                     link.href = url;
// // // //                     link.download = 'qr-code-pdflinx.png';
// // // //                     link.click();
// // // //                   }}
// // // //                   className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xl px-10 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition shadow-lg flex items-center gap-3 mx-auto"
// // // //                 >
// // // //                   <Download size={28} />
// // // //                   Download QR Code (PNG)
// // // //                 </button>
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           <p className="text-center mt-6 text-gray-600 text-sm">
// // // //             No signup • Unlimited use • Files not stored • 100% free
// // // //           </p>
// // // //         </div>
// // // //       </main>

// // // //       {/* ==================== SEO CONTENT SECTION - QR CODE GENERATOR ==================== */}
// // // //       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
// // // //         {/* Main Heading */}
// // // //         <div className="text-center mb-16">
// // // //           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
// // // //             QR Code Generator Online Free - Create Custom QR Instantly
// // // //           </h2>
// // // //           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
// // // //             Generate professional QR codes for websites, WiFi, WhatsApp, contacts, text, and more. Fully customizable, high-resolution, and completely free with PDF Linx.
// // // //           </p>
// // // //         </div>

// // // //         {/* Benefits Grid - 3 Cards */}
// // // //         <div className="grid md:grid-cols-3 gap-10 mb-20">
// // // //           <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-3xl shadow-xl border border-blue-100 text-center hover:shadow-2xl transition">
// // // //             <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
// // // //               <Link className="w-10 h-10 text-white" />
// // // //             </div>
// // // //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Any Content Type</h3>
// // // //             <p className="text-gray-600">
// // // //               Create QR for URLs, text, WiFi password, WhatsApp chat, vCard, email, phone — everything supported.
// // // //             </p>
// // // //           </div>

// // // //           <div className="bg-gradient-to-br from-purple-50 to-white p-10 rounded-3xl shadow-xl border border-purple-100 text-center hover:shadow-2xl transition">
// // // //             <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
// // // //               <Wifi className="w-10 h-10 text-white" />
// // // //             </div>
// // // //             <h3 className="text-2xl font-bold text-gray-800 mb-4">High Quality & Customizable</h3>
// // // //             <p className="text-gray-600">
// // // //               Download in high-resolution PNG. Works perfectly on print and digital. Fast scanning guaranteed.
// // // //             </p>
// // // //           </div>

// // // //           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
// // // //             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
// // // //               <MessageCircle className="w-10 h-10 text-white" />
// // // //             </div>
// // // //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast, Secure & Free</h3>
// // // //             <p className="text-gray-600">
// // // //               Generate unlimited QR codes instantly. No signup, no data stored, completely private and free forever.
// // // //             </p>
// // // //           </div>
// // // //         </div>

// // // //         {/* How To Steps */}
// // // //         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
// // // //           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
// // // //             How to Create QR Code in 3 Simple Steps
// // // //           </h3>
// // // //           <div className="grid md:grid-cols-3 gap-12">
// // // //             <div className="text-center">
// // // //               <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// // // //                 1
// // // //               </div>
// // // //               <h4 className="text-2xl font-semibold mb-4">Enter Your Data</h4>
// // // //               <p className="text-gray-600 text-lg">Type or paste URL, text, WiFi details, contact, or message.</p>
// // // //             </div>

// // // //             <div className="text-center">
// // // //               <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// // // //                 2
// // // //               </div>
// // // //               <h4 className="text-2xl font-semibold mb-4">QR Code Appears</h4>
// // // //               <p className="text-gray-600 text-lg">Your custom QR code generates instantly with perfect quality.</p>
// // // //             </div>

// // // //             <div className="text-center">
// // // //               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// // // //                 3
// // // //               </div>
// // // //               <h4 className="text-2xl font-semibold mb-4">Download & Use</h4>
// // // //               <p className="text-gray-600 text-lg">Download high-quality PNG and use on posters, cards, websites.</p>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Final CTA */}
// // // //         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
// // // //           Create professional QR codes every day with PDF Linx — trusted by thousands for fast, reliable, and free QR generation.
// // // //         </p>
// // // //       </section>
// // // //       <RelatedToolsSection currentPage="qr-generator" />

// // // //     </>
// // // //   );
// // // // }




















// // // // // 'use client';

// // // // // import { useState, useEffect, useRef } from 'react';
// // // // // import QRCode from 'qrcode';   // ← sirf ye install karna hai: npm install qrcode




// // // // // export default function QRGenerator() {
// // // // //   const [text, setText] = useState('');
// // // // //   const canvasRef = useRef(null);

// // // // //   useEffect(() => {
// // // // //     if (text && canvasRef.current) {
// // // // //       QRCode.toCanvas(canvasRef.current, text, { width: 280, margin: 2 }, (error) => {
// // // // //         if (error) console.error(error);
// // // // //       });
// // // // //     }
// // // // //   }, [text]);

// // // // //   return (


// // // // // <>
// // // // //     <div className="min-h-screen bg-gray-50 py-12 px-4">
// // // // //       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
// // // // //         <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
// // // // //           Free QR Code Generator
// // // // //         </h1>

// // // // //         <input
// // // // //           type="text"
// // // // //           value={text}
// // // // //           onChange={(e) => setText(e.target.value)}
// // // // //           placeholder="Enter URL, text, WhatsApp, Wi-Fi..."
// // // // //           className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none mb-6"
// // // // //         />


// // // // //         {/* Ye canvas hai — yahan QR banega */}
// // // // //         <div className="flex justify-center">
// // // // //           {text ? (
// // // // //             <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-lg" />
// // // // //           ) : (
// // // // //             <div className="w-72 h-72 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
// // // // //               Enter text to generate QR
// // // // //             </div>
// // // // //           )}
// // // // //         </div>

// // // // //         {/* Download button (optional bonus) */}
// // // // //         {text && (
// // // // //           <div className="text-center mt-6">
// // // // //             <a
// // // // //               href="#"
// // // // //               onClick={(e) => {
// // // // //                 e.preventDefault();
// // // // //                 const url = canvasRef.current.toDataURL('image/png');
// // // // //                 const link = document.createElement('a');
// // // // //                 link.href = url;
// // // // //                 link.download = 'qr-code.png';
// // // // //                 link.click();
// // // // //               }}
// // // // //               className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-block"
// // // // //             >
// // // // //               Download QR Code
// // // // //             </a>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //     </>
// // // // //   );
// // // // // }