'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Link as LucideLink, Wifi, MessageCircle, Download, QrCode, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import NextLink from 'next/link';
import '@/styles/QrGenerator.css';
// import PDFLinxEmbedWrapper from "@/components/embeds/PDFLinxEmbedWrapper";


/* ── FAQ data (Expanded with Internal Links) ── */
const faqs = [
  { 
    q: 'Is the QR Code Generator free?',
    a: 'Yes — completely free with no signup or hidden costs. Generate unlimited QR codes forever, directly in your browser.' 
  },
  { 
    q: 'What types of QR codes can I create?',
    a: (
      <span>
        You can generate QR codes for URLs, plain text, WiFi passwords, and direct messaging links. If you need to prepare formatted documents first, you can use our{' '}
        <NextLink href="/text-to-pdf" className="text-indigo-600 hover:underline font-medium">Text to PDF</NextLink>{' '}
        or{' '}
        <NextLink href="/word-to-pdf" className="text-indigo-600 hover:underline font-medium">Word to PDF</NextLink>{' '}
        converters before generating your QR codes.
      </span>
    )
  },
  { 
    q: 'Do I need to install anything?',
    a: 'No installation needed. The QR code generator works entirely in your browser on any device — phone, tablet, or desktop.' 
  },
  { 
    q: 'Can I use QR codes for printing?',
    a: 'Yes — the PNG output is high resolution and suitable for posters, flyers, business cards, product packaging, and restaurant menus.' 
  },
  { 
    q: 'Is my data private?',
    a: 'Absolutely. Your input is never sent to any server or stored anywhere. Everything processes locally in your browser.' 
  },
  { 
    q: 'Can I create a QR code for a WhatsApp link?',
    a: (
      <span>
        Yes — you can instantly format your quick-chat link using our free{' '}
        <NextLink href="/whatsapp-link-generator" className="text-indigo-600 hover:underline font-medium">
          WhatsApp Link Generator
        </NextLink>{' '}
        and paste it here to generate a scannable QR code.
      </span>
    )
  },
  { 
    q: 'How can I share text or image data via QR code?',
    a: (
      <span>
        You can paste any text directly to create a QR code. If you have text inside an image, use our{' '}
        <NextLink href="/image-to-text" className="text-indigo-600 hover:underline font-medium">Image to Text (OCR)</NextLink>{' '}
        tool to extract the plain text first, then generate your QR code.
      </span>
    )
  },
  { 
    q: 'Can I convert image links or optimize images for QR codes?',
    a: (
      <span>
        Yes, you can link to any image URL. If you need to reduce image file sizes before uploading or sharing, try our{' '}
        <NextLink href="/image-compressor" className="text-indigo-600 hover:underline font-medium">Image Compressor</NextLink>{' '}
        or change file formats with our{' '}
        <NextLink href="/image-converter" className="text-indigo-600 hover:underline font-medium">Image Converter</NextLink>.
      </span>
    )
  },
  { 
    q: 'How do I handle complex URLs or encoded parameters in QR codes?',
    a: (
      <span>
        If your URL contains special characters or encoded strings, you can clean or decode them using our{' '}
        <NextLink href="/url-encoder-decoder" className="text-indigo-600 hover:underline font-medium">URL Encoder Decoder</NextLink>{' '}
        or format API payload strings with the{' '}
        <NextLink href="/json-formatter" className="text-indigo-600 hover:underline font-medium">JSON Formatter</NextLink>{' '}
        before creating your QR code.
      </span>
    )
  },
  { 
    q: 'Can I create a QR code for PDF documents?',
    a: (
      <span>
        Yes — host your PDF online and paste the direct link here. If your PDF file size is too large to share efficiently, use our{' '}
        <NextLink href="/compress-pdf" className="text-indigo-600 hover:underline font-medium">PDF Compressor</NextLink>{' '}
        to reduce its size first.
      </span>
    )
  },
];


export default function QRGenerator() {
  const [text, setText] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (text && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        text,
        { width: 280, margin: 2, color: { dark: '#1E1B4B', light: '#ffffff' } },
        (error) => { if (error) console.error(error); else setIsGenerated(true); }
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
    out.width  = src.width  + pad * 2;
    out.height = src.height + pad * 2;
    const ctx = out.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(src, pad, pad);
    const url = out.toDataURL('image/png');
    const a   = document.createElement('a');
    a.href     = url;
    a.download = 'qrcode-convertlinx.png';
    a.click();
  };

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script id="howto-schema-qr" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'HowTo',
            name: 'How to Create a QR Code Online for Free',
            description: 'Generate QR codes for URLs, text, WiFi, WhatsApp, and contact cards in seconds — free, private, no signup.',
            url: 'https://convertlinx.com/qr-generator',
            totalTime: 'PT30S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'No files needed — works in browser' }],
            tool:  [{ '@type': 'HowToTool',   name: 'ConvertLinx QR Code Generator'      }],
            step: [
              { '@type': 'HowToStep', name: 'Enter Your Data',   text: 'Type or paste a URL, text, WiFi details, WhatsApp link, or contact information into the input field.' },
              { '@type': 'HowToStep', name: 'Instant Preview',   text: 'The QR code generates live as you type — no button needed.' },
              { '@type': 'HowToStep', name: 'Download & Share',  text: 'Click Download QR Code to save a high-quality PNG. Print it or use it digitally.' },
            ],
          }),
        }}
      />


      {/* ── SCHEMA: FAQPage ── */}
      <Script id="faq-schema-qr" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: typeof faq.a === 'string' ? faq.a : faq.q,
              },
            })),
          }),
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
            <span className="badge-pill inline-block px-4 py-1.5 rounded-full mb-5">Free Tool</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: '#1a1a2e' }}>
              QR Code <span className="grad-text">Generator</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Create QR codes for URLs, WiFi passwords, WhatsApp links, contact cards, and plain
              text — instantly in your browser. High-quality PNG download, 100% private,
              no signup required.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {['No signup needed', 'URLs · WiFi · WhatsApp · vCard', 'High-res PNG download', 'Unlimited use', '100% private'].map((t, i) => (
                <span key={i} className="badge-pill px-3 py-1 rounded-full text-xs">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="main-section py-10 px-6">
          <div className="max-w-2xl mx-auto fade-up">
            <div className="tool-card rounded-3xl p-8 md:p-10">

              <label className="block mb-3"
                style={{ color: '#6366F1', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
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
                    <div className="qr-placeholder-wrap w-70 h-70 rounded-xl flex flex-col items-center justify-center gap-3">
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
              <button onClick={handleDownload} disabled={!isGenerated}
                className="download-btn w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base">
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

        {/* ── HOW IT WORKS ── */}
        <hr className="mid-divider" />
        <section className="main-section py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Enter Your Data',  desc: 'Type or paste a URL, text, WiFi details, WhatsApp link, or contact info into the input field.' },
                { num: '2', title: 'Instant Preview',  desc: 'QR code generates live as you type — no button needed. See it appear in real time.' },
                { num: '3', title: 'Download & Share', desc: 'Save as high-quality PNG. Print it on materials or use it digitally anywhere.' },
              ].map((s, i) => (
                <div key={i} className="step-card rounded-2xl p-7 text-center">
                  <div className="step-num w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg text-white">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}

        {/* ── SEO CONTENT (Enhanced Internal Linking) ── */}
          <hr className="mid-divider" />
          <section className="alt-section py-16 px-6">
            <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                  Why You Need a Free Online QR Code Generator
                </h2>
                
                <p className="leading-7 text-sm">
                  QR codes are the fastest way to share digital content in the physical world.
                  Instead of asking someone to type a long URL, remember a WiFi password, or
                  manually save a contact — a single scan does it all instantly. If you need to convert textual details or documents to readable formats first, tools like our{' '}
                  <NextLink href="/text-to-pdf" className="text-indigo-600 hover:underline font-medium">Text to PDF</NextLink>{' '}
                  and{' '}
                  <NextLink href="/word-to-pdf" className="text-indigo-600 hover:underline font-medium">Word to PDF</NextLink>{' '}
                  converters can help prepare your documents efficiently.
                </p>
                
                <p className="leading-7 text-sm mt-3">
                  This free QR code generator works entirely in your browser — no software to
                  install, no data sent to any server, and no account needed. Type or paste your
                  content, or generate direct chat links with our{' '}
                  <NextLink href="/whatsapp-link-generator" className="text-indigo-600 hover:underline font-medium">WhatsApp Link Generator</NextLink>, 
                  and the QR code appears live. If you ever need to extract raw text from image files before creating a code, use our{' '}
                  <NextLink href="/image-to-text" className="text-indigo-600 hover:underline font-medium">Image to Text (OCR)</NextLink>{' '}
                  tool.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>What Is a QR Code?</h3>
                <p className="leading-7 text-sm">
                  A QR code (Quick Response code) is a scannable two-dimensional barcode that
                  instantly opens digital content when scanned with a smartphone camera. It can
                  store URLs, WiFi credentials, WhatsApp links, email addresses, plain text, or
                  contact information. If you're embedding encoded data or API payloads in your QR codes, you can format them using our{' '}
                  <NextLink href="/json-formatter" className="text-indigo-600 hover:underline font-medium">JSON Formatter</NextLink>{' '}
                  or clean parameters with the{' '}
                  <NextLink href="/url-encoder-decoder" className="text-indigo-600 hover:underline font-medium">URL Encoder Decoder</NextLink>{' '}
                  first.
                </p>
              </div>

              <div className="seo-box rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                  Optimizing Media and Documents for QR Codes
                </h3>
                <p className="leading-7 text-sm mb-3">
                  When linking QR codes to web assets or hosted media, keep file sizes lightweight for fast scanning and loading. You can optimize image sizes with our{' '}
                  <NextLink href="/image-compressor" className="text-indigo-600 hover:underline font-medium">Image Compressor</NextLink>, 
                  convert formats using the{' '}
                  <NextLink href="/image-converter" className="text-indigo-600 hover:underline font-medium">Image Converter</NextLink>, 
                  or reduce large PDF attachments using our{' '}
                  <NextLink href="/compress-pdf" className="text-indigo-600 hover:underline font-medium">PDF Compressor</NextLink>.
                </p>
              </div>

              <div className="seo-box rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                  Common Problems This Tool Solves
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    'Share a website URL without people typing it manually',
                    'Let guests connect to WiFi by scanning instead of typing',
                    'Add a WhatsApp link to a business card or flyer',
                    'Share contact details at events without paper exchange',
                    'Add QR codes to restaurant menus for digital ordering',
                    'Link product packaging to instructional videos or websites',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm">
                      <span className="feature-dot w-1.5 h-1.5 rounded-full shrink-0" />
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
                    'Compatible with iPhone & Android cameras',
                    'Works on mobile & desktop',
                    'No watermarks on downloaded QR codes',
                    'No data stored — full privacy',
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm">
                      <span className="feature-dot w-1.5 h-1.5 rounded-full shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        

        {/* ── PDF EMBED ── */}
        {/* <PDFLinxEmbedWrapper tool="compress-pdf" /> */}

        {/* ── FAQ ── */}
        <hr className="mid-divider" />
        <section className="main-section py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="faq-item rounded-xl p-5">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#6366F1' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>


        {/* ── RELATED TOOLS ── */}
        <hr className="mid-divider" />
        <section className="alt-section py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Image to Text',        href: '/image-to-text'            },
                { name: 'Image Compressor',     href: '/image-compressor'         },
                { name: 'Image Converter',      href: '/image-converter'          },
                { name: 'Text to PDF',          href: '/text-to-pdf'              },
                { name: 'WhatsApp Link Generator', href: '/whatsapp-link-generator' },
                { name: 'JSON Formatter',       href: '/json-formatter'           },
              ].map((tool, i) => (
                <NextLink
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border hover:border-rose-400 transition"
                  style={{ color: '#9f1239', borderColor: '#FDA4AF', background: '#fff' }}
                >
                  {tool.name}
                </NextLink>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section py-20 px-6 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
              Ready to create your QR code?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes less than 10 seconds. No signup. No ads.
            </p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cta-main-btn text-white text-base px-10 py-4 rounded-xl inline-flex items-center gap-2">
              <QrCode className="w-5 h-5" /> Generate QR Code Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}


