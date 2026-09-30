'use client';

import { useRef, useState, useEffect } from 'react';
import NextLink from 'next/link';
import { Download, PenTool, Palette, Trash2, CheckCircle, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/SignatureMaker.css';

export default function SignatureMaker() {
  const canvasRef  = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor]     = useState('#1a1a2e');
  const [stroke, setStroke]   = useState(3); // 2, 3, 5

  /* Fill white background on mount */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  /* Coordinate helper — supports mouse + touch */
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const src    = e.touches?.[0] ?? e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top)  * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth   = stroke;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'my-digital-signature.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const strokeSizes = [
    { size: 2, label: 'S' },
    { size: 3, label: 'M' },
    { size: 5, label: 'L' },
  ];

  /* ── FAQ Data with Rich Contextual Links ── */
  const faqs = [
    {
      q: 'Is this digital signature maker completely free to use?',
      a: 'Yes — our online signature creator is 100% free with no signup, watermarks, or usage limits. Generate and download high-resolution e-signatures anytime.'
    },
    {
      q: 'How do I add my electronic signature to PDF files or documents?',
      a: (
        <span>
          After downloading your transparent PNG signature, you can easily insert it into any PDF document or agreement form. If you need to convert text files or documents first, try our{' '}
          <NextLink href="/text-to-pdf" className="text-indigo-600 hover:underline font-medium">Text to PDF</NextLink>{' '}
          or{' '}
          <NextLink href="/word-to-pdf" className="text-indigo-600 hover:underline font-medium">Word to PDF</NextLink>{' '}
          converters before signing.
        </span>
      )
    },
    {
      q: 'Can I draw a handwritten signature on mobile phones and tablets?',
      a: 'Yes — you can draw naturally with your finger on Android or iPhone touchscreens, or use a stylus/Apple Pencil on tablets.'
    },
    {
      q: 'Does it download signatures with a transparent background?',
      a: 'Yes — the generated file is saved as a clean, transparent PNG format, making it effortless to place on top of any document or electronic form.'
    },
    {
      q: 'Are my signatures or personal data stored on your server?',
      a: 'No — your digital signature is rendered strictly in your web browser. Nothing is uploaded, saved, or logged on any server, ensuring total privacy.'
    },
    {
      q: 'How can I extract text from a physical document before signing?',
      a: (
        <span>
          If you have paper documents or images with text that you want to convert into digital text first, use our free{' '}
          <NextLink href="/image-to-text" className="text-indigo-600 hover:underline font-medium">
            Image to Text (OCR)
          </NextLink>{' '}
          tool before attaching your online signature.
        </span>
      )
    },
    {
      q: 'Can I optimize image size or change formats of signed documents?',
      a: (
        <span>
          Yes! If you need to compress heavy images before attaching signatures, use our{' '}
          <NextLink href="/image-compressor" className="text-indigo-600 hover:underline font-medium">Image Compressor</NextLink>{' '}
          or convert formats with our{' '}
          <NextLink href="/image-converter" className="text-indigo-600 hover:underline font-medium">Image Converter</NextLink>{' '}
          and{' '}
          <NextLink href="/compress-pdf" className="text-indigo-600 hover:underline font-medium">PDF Compressor</NextLink>.
        </span>
      )
    },
    {
      q: 'Can I use encoded parameters or custom links along with my signature?',
      a: (
        <span>
          If you are working with digital signature payloads or API links, you can format them using our{' '}
          <NextLink href="/json-formatter" className="text-indigo-600 hover:underline font-medium">JSON Formatter</NextLink>{' '}
          or clean parameters using the{' '}
          <NextLink href="/url-encoder-decoder" className="text-indigo-600 hover:underline font-medium">URL Encoder Decoder</NextLink>.
        </span>
      )
    }
  ];

  return (
    <>
      <Script id="howto-schema-signature" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Create Digital Signature Online for Free",
            description: "Create professional handwritten electronic signatures by drawing with mouse or touch screen.",
            url: "https://pdflinx.com/signature-maker",
            step: [
              { "@type": "HowToStep", name: "Draw Signature", text: "Draw your custom digital signature with mouse or finger." },
              { "@type": "HowToStep", name: "Customize Style", text: "Choose pen color and adjust stroke thickness." },
              { "@type": "HowToStep", name: "Download PNG",    text: "Download transparent background PNG e-signature." }
            ],
            totalTime: "PT40S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
          }, null, 2),
        }}
      />

      <Script id="breadcrumb-schema-signature" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Signature Maker", item: "https://pdflinx.com/signature-maker" }
            ]
          }, null, 2),
        }}
      />

      {/* ── FAQ SCHEMA ── */}
      <Script id="faq-schema-signature" type="application/ld+json" strategy="afterInteractive"
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

      <main className="sm-page">

        {/* ── HERO ── */}
        <section className="sm-hero">
          <div className="sm-blob-1" />
          <div className="sm-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="sm-breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#6366F1' }}>Signature Maker</span>
            </div>
            <span className="sm-badge">Free Digital Signature Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Digital Signature{' '}
              <span className="sm-grad-text">Maker Online</span>
            </h1>
            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Create electronic handwritten signatures with mouse or touchscreen — download transparent PNG, 100% free.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="sm-section-main py-10 px-6">
          <div className="max-w-2xl mx-auto sm-fade-up">
            <div className="sm-tool-card">

              {/* Controls row */}
              <div className="sm-controls">

                {/* Pen color */}
                <div className="sm-color-wrap">
                  <Palette className="w-4 h-4" style={{ color: '#6366F1' }} />
                  <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>Pen</span>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="sm-color-input"
                    title="Pick pen color"
                  />
                </div>

                {/* Stroke size */}
                <div className="flex items-center gap-2">
                  {strokeSizes.map(({ size, label }) => (
                    <button
                      key={size}
                      onClick={() => setStroke(size)}
                      className={`sm-stroke-btn ${stroke === size ? 'active' : ''}`}
                      title={`Stroke ${label}`}
                    >
                      <div
                        style={{
                          width:        `${size * 3}px`,
                          height:       `${size * 3}px`,
                          borderRadius: '50%',
                          background:   stroke === size ? '#6366F1' : '#9CA3AF',
                        }}
                      />
                    </button>
                  ))}
                </div>

                {/* Clear */}
                <button onClick={clear} className="sm-clear-btn">
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>

                {/* Download */}
                <button onClick={download} className="sm-dl-btn">
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>
              </div>

              {/* Canvas */}
              <div className="sm-canvas-wrap">
                <canvas
                  ref={canvasRef}
                  width={900}
                  height={400}
                  className="sm-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>

              {/* Tip */}
              <div className="sm-tip">
                💡 Swipe your finger on mobile or drag the mouse on desktop — creates realistic handwritten e-signatures instantly!
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-5">
                {['No login', 'Unlimited signatures', 'Transparent PNG', 'Nothing stored', '100% free'].map((t, i) => (
                  <span key={i} className="sm-trust-item">
                    <span className="sm-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="sm-divider" />
        <section className="sm-section-alt py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use Our Online Digital Signature Creator?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: <PenTool className="w-6 h-6" />,    color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  title: 'Real Ink Experience', desc: 'Draw with mouse, finger, or stylus — natural, smooth handwritten signature creation.' },
                { icon: <Palette className="w-6 h-6" />,    color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)',  title: 'Custom Electronic Style', desc: 'Adjust pen colors and line thickness — classic blue, dark black, or custom shades.' },
                { icon: <CheckCircle className="w-6 h-6" />,color: '#10B981', bg: 'rgba(16,185,129,0.08)',  title: 'Transparent PNG Download', desc: 'Instant high-res transparent PNG downloads — place on PDFs, contracts, and agreements.' },
              ].map((b, i) => (
                <div key={i} className="sm-benefit-card">
                  <div className="sm-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW TO ── */}
        <hr className="sm-divider" />
        <section className="sm-section-main py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              How to Draw a Digital Signature in 3 Easy Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Sketch & Draw',   desc: 'Use your mouse, finger, or touch stylus to draw your handwritten electronic signature.' },
                { num: '2', title: 'Customize Pen',   desc: 'Choose pen color and stroke weight to get your exact preferred signing style.' },
                { num: '3', title: 'Download PNG',    desc: 'Download transparent PNG signature file to attach to PDFs, forms, or emails.' },
              ].map((s, i) => (
                <div key={i} className="sm-step-card">
                  <div className="sm-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT (Enhanced Internal Linking & Keywords) ── */}
        <hr className="sm-divider" />
        <section className="sm-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>
            
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Free Digital Signature Maker — Create Online Electronic Signatures
              </h2>
              <p className="leading-7 text-sm">
                The <span style={{ color: '#1a1a2e', fontWeight: 600 }}>PDFLinx Digital Signature Maker</span> is an online electronic signature generator designed to create clean, handwritten signatures instantly. Whether signing PDF agreements, online forms, invoices, or business documents, this tool generates a transparent PNG signature without printing or scanning. If you need to turn raw text or office files into PDF documents first, check out our{' '}
                <NextLink href="/text-to-pdf" className="text-indigo-600 hover:underline font-medium">Text to PDF</NextLink>{' '}
                and{' '}
                <NextLink href="/word-to-pdf" className="text-indigo-600 hover:underline font-medium">Word to PDF</NextLink>{' '}
                converters.
              </p>
              <p className="leading-7 text-sm mt-3">
                Drawing your online signature takes only seconds. You can easily share direct messaging links for document review using our{' '}
                <NextLink href="/whatsapp-link-generator" className="text-indigo-600 hover:underline font-medium">WhatsApp Link Generator</NextLink>, 
                or extract text content from paper documents with our{' '}
                <NextLink href="/image-to-text" className="text-indigo-600 hover:underline font-medium">Image to Text (OCR)</NextLink>{' '}
                tool prior to adding your electronic signature.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                What Is an Online Electronic Signature Creator?
              </h3>
              <p className="leading-7 text-sm">
                An online signature creator or e-signature tool allows users to draw handwritten digital signatures on touchscreens or desktops. By saving signatures as transparent PNG images, you can insert them directly into PDF files, Google Docs, Word files, and email signatures. For developer workflows or digital API signatures, you can format JSON parameters with our{' '}
                <NextLink href="/json-formatter" className="text-indigo-600 hover:underline font-medium">JSON Formatter</NextLink>{' '}
                or encode/decode query strings using the{' '}
                <NextLink href="/url-encoder-decoder" className="text-indigo-600 hover:underline font-medium">URL Encoder Decoder</NextLink>.
              </p>
            </div>

            <div className="sm-seo-box rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Optimizing Signed Documents & Media
              </h3>
              <p className="leading-7 text-sm">
                When attaching digital signatures to large document sets or email attachments, keeping file sizes small is essential. Optimize document media using our{' '}
                <NextLink href="/image-compressor" className="text-indigo-600 hover:underline font-medium">Image Compressor</NextLink>, 
                convert image formats with our{' '}
                <NextLink href="/image-converter" className="text-indigo-600 hover:underline font-medium">Image Converter</NextLink>, 
                or shrink large PDF files using our{' '}
                <NextLink href="/compress-pdf" className="text-indigo-600 hover:underline font-medium">PDF Compressor</NextLink>.
              </p>
            </div>

            <div className="sm-seo-box rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This Signature Tool?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Business professionals — sign electronic contracts & NDAs',
                  'Freelancers & agencies — sign invoices & work agreements',
                  'Students — sign online forms & academic documents',
                  'Remote teams — sign paperwork without printing',
                  'Anyone wanting a reusable transparent e-signature',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#6366F1' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sm-seo-box rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Key Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  '100% free, unlimited e-signatures',
                  'Draw with mouse, stylus, or mobile touch',
                  'Custom pen color selection',
                  'Stroke size customization (Small, Medium, Large)',
                  'Download transparent PNG format',
                  'Clear & redraw canvas anytime',
                  'Works on Android, iOS, Windows & Mac',
                  'Privacy guaranteed — nothing saved on servers',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="sm-feature-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1', display: 'inline-block' }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="sm-divider" />
        <section className="sm-section-main py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="sm-faq-item rounded-xl p-5 border border-indigo-100 bg-white shadow-sm">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#6366F1' }} />
                  </summary>
                  <div className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── EXPANDED RELATED TOOLS SECTION ── */}
        <hr className="sm-divider" />
        <section className="sm-section-alt py-14 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#1a1a2e' }}>
              Explore More Free Online PDF & Web Tools
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'QR Code Generator',     href: '/qr-generator'             },
                { name: 'Text to PDF Converter', href: '/text-to-pdf'              },
                { name: 'Word to PDF',           href: '/word-to-pdf'              },
                { name: 'Image to Text (OCR)',   href: '/image-to-text'            },
                { name: 'Image Compressor',      href: '/image-compressor'         },
                { name: 'Image Converter',       href: '/image-converter'          },
                { name: 'PDF Compressor',        href: '/compress-pdf'             },
                { name: 'WhatsApp Link Creator', href: '/whatsapp-link-generator' },
                { name: 'JSON Formatter',        href: '/json-formatter'           },
                { name: 'URL Encoder / Decoder', href: '/url-encoder-decoder'      },
              ].map((tool, i) => (
                <NextLink
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ 
                    color: '#4F46E5', 
                    borderColor: '#E0E7FF', 
                    background: '#EEF2FF' 
                  }}
                >
                  {tool.name}
                </NextLink>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="sm-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to create your digital signature?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 10 seconds. No signup required. Transparent PNG download.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="sm-cta-btn"
            >
              <PenTool className="w-5 h-5" />
              Sign Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}








































// 'use client';

// import { useRef, useState, useEffect } from 'react';
// import { Download, PenTool, Palette, Trash2, CheckCircle, ChevronDown } from 'lucide-react';
// import Script from 'next/script';
// import '@/styles/SignatureMaker.css';

// export default function SignatureMaker() {
//   const canvasRef  = useRef(null);
//   const [drawing, setDrawing] = useState(false);
//   const [color, setColor]     = useState('#1a1a2e');
//   const [stroke, setStroke]   = useState(3); // 2, 3, 5

//   /* Fill white background on mount */
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     ctx.fillStyle = '#ffffff';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   }, []);

//   /* Coordinate helper — supports mouse + touch */
//   const getCoords = (e) => {
//     const canvas = canvasRef.current;
//     const rect   = canvas.getBoundingClientRect();
//     const scaleX = canvas.width  / rect.width;
//     const scaleY = canvas.height / rect.height;
//     const src    = e.touches?.[0] ?? e;
//     return {
//       x: (src.clientX - rect.left) * scaleX,
//       y: (src.clientY - rect.top)  * scaleY,
//     };
//   };

//   const startDrawing = (e) => {
//     e.preventDefault();
//     const { x, y } = getCoords(e);
//     const ctx = canvasRef.current.getContext('2d');
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     setDrawing(true);
//   };

//   const draw = (e) => {
//     e.preventDefault();
//     if (!drawing) return;
//     const { x, y } = getCoords(e);
//     const ctx = canvasRef.current.getContext('2d');
//     ctx.lineWidth  = stroke;
//     ctx.lineCap    = 'round';
//     ctx.lineJoin   = 'round';
//     ctx.strokeStyle = color;
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => setDrawing(false);

//   const clear = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = '#ffffff';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   };

//   const download = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const link = document.createElement('a');
//     link.download = 'my-signature.png';
//     link.href = canvas.toDataURL('image/png');
//     link.click();
//   };

//   const strokeSizes = [
//     { size: 2, label: 'S' },
//     { size: 3, label: 'M' },
//     { size: 5, label: 'L' },
//   ];

//   return (
//     <>
//       <Script id="howto-schema-signature" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Create Digital Signature Online for Free",
//             description: "Make professional signatures by drawing with mouse or finger.",
//             url: "https://convertlinx.com/signature-maker",
//             step: [
//               { "@type": "HowToStep", name: "Draw",      text: "Draw your signature with mouse or finger." },
//               { "@type": "HowToStep", name: "Customize", text: "Change pen color and stroke size." },
//               { "@type": "HowToStep", name: "Download",  text: "Download transparent PNG signature." }
//             ],
//             totalTime: "PT40S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//           }, null, 2),
//         }}
//       />

//       <main className="sm-page">

//         {/* ── HERO ── */}
//         <section className="sm-hero">
//           <div className="sm-blob-1" />
//           <div className="sm-blob-2" />
//           <div className="relative z-10 max-w-3xl mx-auto">
//             <div className="flex items-center justify-center gap-2 text-sm mb-5">
//               <a href="/" className="sm-breadcrumb-link">Home</a>
//               <span style={{ color: '#C4B5FD' }}>/</span>
//               <span style={{ color: '#6366F1' }}>Signature Maker</span>
//             </div>
//             <span className="sm-badge">Free Tool</span>
//             <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
//               Signature{' '}
//               <span className="sm-grad-text">Maker</span>
//             </h1>
//             <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
//               Draw your digital signature with mouse or finger — download as transparent PNG, free.
//             </p>
//           </div>
//         </section>

//         {/* ── TOOL WORKSPACE ── */}
//         <section className="sm-section-main py-10 px-6">
//           <div className="max-w-2xl mx-auto sm-fade-up">
//             <div className="sm-tool-card">

//               {/* Controls row */}
//               <div className="sm-controls">

//                 {/* Pen color */}
//                 <div className="sm-color-wrap">
//                   <Palette className="w-4 h-4" style={{ color: '#6366F1' }} />
//                   <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>Pen</span>
//                   <input
//                     type="color"
//                     value={color}
//                     onChange={(e) => setColor(e.target.value)}
//                     className="sm-color-input"
//                     title="Pick pen color"
//                   />
//                 </div>

//                 {/* Stroke size */}
//                 <div className="flex items-center gap-2">
//                   {strokeSizes.map(({ size, label }) => (
//                     <button
//                       key={size}
//                       onClick={() => setStroke(size)}
//                       className={`sm-stroke-btn ${stroke === size ? 'active' : ''}`}
//                       title={`Stroke ${label}`}
//                     >
//                       <div
//                         style={{
//                           width:        `${size * 3}px`,
//                           height:       `${size * 3}px`,
//                           borderRadius: '50%',
//                           background:   stroke === size ? '#6366F1' : '#9CA3AF',
//                         }}
//                       />
//                     </button>
//                   ))}
//                 </div>

//                 {/* Clear */}
//                 <button onClick={clear} className="sm-clear-btn">
//                   <Trash2 className="w-4 h-4" />
//                   Clear
//                 </button>

//                 {/* Download */}
//                 <button onClick={download} className="sm-dl-btn">
//                   <Download className="w-4 h-4" />
//                   Download PNG
//                 </button>
//               </div>

//               {/* Canvas */}
//               <div className="sm-canvas-wrap">
//                 <canvas
//                   ref={canvasRef}
//                   width={900}
//                   height={400}
//                   className="sm-canvas"
//                   onMouseDown={startDrawing}
//                   onMouseMove={draw}
//                   onMouseUp={stopDrawing}
//                   onMouseLeave={stopDrawing}
//                   onTouchStart={startDrawing}
//                   onTouchMove={draw}
//                   onTouchEnd={stopDrawing}
//                 />
//               </div>

//               {/* Tip */}
//               <div className="sm-tip">
//                 💡 Swipe your finger on mobile or drag the mouse on desktop — just like signing on paper!
//               </div>

//               {/* Trust row */}
//               <div className="flex flex-wrap justify-center gap-5 mt-5">
//                 {['No login', 'Unlimited signatures', 'Transparent PNG', 'Nothing stored', '100% free'].map((t, i) => (
//                   <span key={i} className="sm-trust-item">
//                     <span className="sm-trust-dot" />
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── BENEFITS ── */}
//         <hr className="sm-divider" />
//         <section className="sm-section-alt py-16 px-6">
//           <div className="max-w-5xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Why Use ConvertlyHub?
//             </h2>
//             <div className="grid md:grid-cols-3 gap-5">
//               {[
//                 { icon: <PenTool className="w-6 h-6" />,    color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  title: 'Feels Like Real Ink',  desc: 'Draw with mouse or finger — natural, smooth, just like signing on paper.' },
//                 { icon: <Palette className="w-6 h-6" />,    color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)',  title: 'Your Style, Your Way', desc: 'Pick any pen color and stroke size — classic black, bold blue, anything.' },
//                 { icon: <CheckCircle className="w-6 h-6" />,color: '#10B981', bg: 'rgba(16,185,129,0.08)',  title: 'Ready to Use',         desc: 'Transparent PNG downloads in one click — add to PDFs, emails, contracts.' },
//               ].map((b, i) => (
//                 <div key={i} className="sm-benefit-card">
//                   <div className="sm-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
//                   <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
//                   <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── HOW TO ── */}
//         <hr className="sm-divider" />
//         <section className="sm-section-main py-16 px-6">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
//               3 Simple Steps
//             </h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {[
//                 { num: '1', title: 'Sketch It Out',   desc: 'Use your mouse or finger to draw your signature naturally on the canvas.' },
//                 { num: '2', title: 'Add Some Flair',  desc: 'Pick a pen color and stroke size that feels right — blue, black, or bold red.' },
//                 { num: '3', title: 'Save & Use',      desc: 'Download transparent PNG and add it to PDFs, docs, emails, or contracts.' },
//               ].map((s, i) => (
//                 <div key={i} className="sm-step-card">
//                   <div className="sm-step-num">{s.num}</div>
//                   <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
//                   <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── SEO CONTENT ── */}
//         <hr className="sm-divider" />
//         <section className="sm-section-alt py-16 px-6">
//           <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>
//             <div>
//               <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
//                 Free Signature Maker — ConvertlyHub
//               </h2>
//               <p className="leading-7 text-sm">
//                 The <span style={{ color: '#1a1a2e', fontWeight: 600 }}>ConvertlyHub Signature Maker</span> lets
//                 you draw handwritten-style signatures online and download as transparent PNG — no signup, no watermark.
//               </p>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Business professionals — contracts & agreements',
//                   'Freelancers — invoices & proposals',
//                   'Students — academic forms & documents',
//                   'Remote workers — sign without printing',
//                   'Anyone — quick reusable digital signature',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-2 text-sm">
//                     <span className="font-bold mt-0.5" style={{ color: '#6366F1' }}>→</span>
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="sm-seo-box">
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Free, unlimited signatures',
//                   'Draw with mouse, stylus, or touch',
//                   'Custom pen color picker',
//                   'Stroke size — Small, Medium, Large',
//                   'Transparent PNG download',
//                   'Clear & redraw anytime',
//                   'Works on mobile & desktop',
//                   'Nothing stored — full privacy',
//                 ].map((f, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="sm-feature-dot" />
//                     <span>{f}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── FAQ ── */}
//         <hr className="sm-divider" />
//         <section className="sm-section-main py-16 px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Frequently Asked Questions
//             </h2>
//             <div className="space-y-3">
//               {[
//                 { q: 'Is the Signature Maker free?',            a: 'Yes — completely free with unlimited signature creation and downloads.' },
//                 { q: 'Can I create signatures on mobile?',      a: 'Yes — draw using your finger on mobile or stylus on tablets.' },
//                 { q: 'What format does it download?',           a: 'Transparent PNG — perfect for placing on documents and PDFs.' },
//                 { q: 'Can I change the pen color?',             a: 'Yes — pick any color using the color picker before or while drawing.' },
//                 { q: 'Are my signatures stored anywhere?',      a: 'No — signature is generated only for download. Nothing is stored.' },
//                 { q: 'Can I reuse my signature?',               a: 'Yes — save the downloaded PNG and reuse it in any document or form.' },
//               ].map((faq, i) => (
//                 <details key={i} className="sm-faq-item">
//                   <summary className="flex items-center justify-between gap-4">
//                     <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
//                     <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#6366F1' }} />
//                   </summary>
//                   <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── BOTTOM CTA ── */}
//         <section className="sm-cta-section">
//           <div className="max-w-xl mx-auto">
//             <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
//               Ready to create your signature?
//             </h2>
//             <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
//               Takes 10 seconds. No signup. No ads.
//             </p>
//             <button
//               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//               className="sm-cta-btn"
//             >
//               <PenTool className="w-5 h-5" />
//               Sign Now
//             </button>
//           </div>
//         </section>

//       </main>
//     </>
//   );
// }
























// // 'use client';

// // import { useRef, useState, useEffect } from 'react';
// // import { Download, PenTool, Palette, Trash2, CheckCircle } from 'lucide-react';
// // import Script from 'next/script';
// // import RelatedToolsSection from "@/components/RelatedTools";


// // export default function SignatureMakerClient() {
// //   const canvasRef = useRef(null);
// //   const [drawing, setDrawing] = useState(false);
// //   const [color, setColor] = useState("#000000");
// //   const [bgColor, setBgColor] = useState("#ffffff");

// //   useEffect(() => {
// //     const canvas = canvasRef.current;
// //     if (!canvas) return;
// //     const ctx = canvas.getContext("2d");
// //     ctx.fillStyle = bgColor;
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
// //   }, [bgColor]);

// //   const getCoordinates = (e) => {
// //     const canvas = canvasRef.current;
// //     if (!canvas) return { x: 0, y: 0 };
// //     const rect = canvas.getBoundingClientRect();
// //     let x, y;

// //     if (e.touches && e.touches.length > 0) {
// //       x = e.touches[0].clientX - rect.left;
// //       y = e.touches[0].clientY - rect.top;
// //     } else {
// //       x = e.clientX - rect.left;
// //       y = e.clientY - rect.top;
// //     }

// //     const scaleX = canvas.width / rect.width;
// //     const scaleY = canvas.height / rect.height;

// //     return {
// //       x: x * scaleX,
// //       y: y * scaleY,
// //     };
// //   };

// //   const startDrawing = (e) => {
// //     e.preventDefault();
// //     const { x, y } = getCoordinates(e);
// //     const ctx = canvasRef.current.getContext("2d");
// //     ctx.beginPath();
// //     ctx.moveTo(x, y);
// //     setDrawing(true);
// //   };

// //   const draw = (e) => {
// //     e.preventDefault();
// //     if (!drawing) return;
// //     const { x, y } = getCoordinates(e);
// //     const ctx = canvasRef.current.getContext("2d");
// //     ctx.lineWidth = 3;
// //     ctx.lineCap = "round";
// //     ctx.strokeStyle = color;
// //     ctx.lineTo(x, y);
// //     ctx.stroke();
// //   };

// //   const stopDrawing = () => {
// //     setDrawing(false);
// //   };

// //   const clear = () => {
// //     const canvas = canvasRef.current;
// //     if (!canvas) return;
// //     const ctx = canvas.getContext("2d");
// //     ctx.clearRect(0, 0, canvas.width, canvas.height);
// //     ctx.fillStyle = bgColor;
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
// //   };

// //   const download = () => {
// //     const canvas = canvasRef.current;
// //     if (!canvas) return;
// //     const link = document.createElement("a");
// //     link.download = "my-signature.png";
// //     link.href = canvas.toDataURL("image/png");
// //     link.click();
// //   };

// //   return (
// //     <>
// //       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
// //       <Script
// //         id="howto-schema-signature"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "HowTo",
// //             name: "How to Create Digital Signature Online for Free",
// //             description: "Make professional signatures by drawing or typing instantly.",
// //             url: "https://pdflinx.com/signature-maker",
// //             step: [
// //               { "@type": "HowToStep", name: "Choose Method", text: "Draw with mouse/finger or type your name." },
// //               { "@type": "HowToStep", name: "Customize", text: "Change color, style, and thickness." },
// //               { "@type": "HowToStep", name: "Download", text: "Download transparent PNG signature." }
// //             ],
// //             totalTime: "PT40S",
// //             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
// //             image: "https://pdflinx.com/og-image.png"
// //           }, null, 2),
// //         }}
// //       />

// //       <Script
// //         id="breadcrumb-schema-signature"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "BreadcrumbList",
// //             itemListElement: [
// //               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
// //               { "@type": "ListItem", position: 2, name: "Signature Maker", item: "https://pdflinx.com/signature-maker" }
// //             ]
// //           }, null, 2),
// //         }}
// //       />

// //       {/* ==================== MAIN TOOL SECTION ==================== */}
// //       <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
// //         <div className="max-w-4xl mx-auto">
// //           {/* Header */}
// //           <div className="text-center mb-8">
// //             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
// //               Signature Maker <br /> Online (Free)
// //             </h1>
// //             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// //               Hey, whip up a cool digital signature in seconds! Just doodle with your mouse or finger, tweak the color to match your vibe, and snag it as a clean PNG. Totally free, no fuss.
// //             </p>
// //           </div>

// //           {/* Tool Card */}
// //           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
// //             {/* Controls */}
// //             <div className="flex flex-wrap justify-center gap-4 mb-6">
// //               <div className="flex items-center gap-3">
// //                 <Palette className="w-6 h-6 text-indigo-600" />
// //                 <span className="font-semibold text-sm">Pen Color:</span>
// //                 <input
// //                   type="color"
// //                   value={color}
// //                   onChange={(e) => setColor(e.target.value)}
// //                   className="w-12 h-12 rounded-full cursor-pointer border-2 border-indigo-200"
// //                 />
// //               </div>

// //               <button
// //                 onClick={clear}
// //                 className="bg-red-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-700 transition flex items-center gap-2 shadow-md text-sm"
// //               >
// //                 <Trash2 size={18} />
// //                 Clear Canvas
// //               </button>

// //               <button
// //                 onClick={download}
// //                 className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-green-700 hover:to-teal-700 transition flex items-center gap-2 shadow-md text-sm"
// //               >
// //                 <Download size={18} />
// //                 Download Signature (PNG)
// //               </button>
// //             </div>

// //             {/* Canvas */}
// //             <div className="w-full max-w-3xl mx-auto">
// //               <canvas
// //                 ref={canvasRef}
// //                 width={900}
// //                 height={350}
// //                 className="w-full h-[200px] sm:h-[250px] md:h-[300px] border-2 border-indigo-300 rounded-xl shadow-md cursor-crosshair bg-white touch-none"
// //                 onMouseDown={startDrawing}
// //                 onMouseMove={draw}
// //                 onMouseUp={stopDrawing}
// //                 onMouseLeave={stopDrawing}
// //                 onTouchStart={startDrawing}
// //                 onTouchMove={draw}
// //                 onTouchEnd={stopDrawing}
// //               />
// //             </div>

// //             <p className="text-center mt-6 text-gray-600 text-base">
// //               💡 Quick tip: Swipe with your finger on mobile or drag the mouse on desktop – it'll feel just like scribbling on paper!
// //             </p>
// //           </div>

// //           <p className="text-center mt-6 text-gray-600 text-base">
// //             No login hassle • Make as many as you want • See-through background • All yours for free
// //           </p>
// //         </div>
// //       </main>

// //       {/* ==================== SEO CONTENT SECTION ==================== */}
// //       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
// //         {/* Main Heading */}
// //         <div className="text-center mb-12">
// //           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
// //             Signature Maker Online Free - Whip Up Your Digital Sig in a Flash
// //           </h2>
// //           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
// //             Need a slick digital signature that looks hand-drawn? Just sketch it out right here – mouse, finger, whatever works. Pick a color that screams "you," and download a crystal-clear PNG with no background drama. Perfect for docs, emails, or anywhere you wanna sign off in style. Oh, and it's all free on PDF Linx – no strings attached!
// //           </p>
// //         </div>

// //         {/* Benefits Grid */}
// //         <div className="grid md:grid-cols-3 gap-8 mb-16">
// //           <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
// //             <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <PenTool className="w-8 h-8 text-white" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Feels Like Real Ink</h3>
// //             <p className="text-gray-600 text-sm">
// //               Scribble away with your mouse or finger – it's so natural, you'll forget it's digital!
// //             </p>
// //           </div>

// //           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
// //             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <Palette className="w-8 h-8 text-white" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Style, Your Way</h3>
// //             <p className="text-gray-600 text-sm">
// //               Go bold with colors or keep it classic – match it to your brand or just your mood today.
// //             </p>
// //           </div>

// //           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
// //             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <CheckCircle className="w-8 h-8 text-white" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Ready to Rock</h3>
// //             <p className="text-gray-600 text-sm">
// //               Grab that transparent PNG and slap it on PDFs, emails, or contracts – instant pro vibe.
// //             </p>
// //           </div>
// //         </div>

// //         {/* How To Steps */}
// //         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
// //           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
// //             Nail Your Digital Signature in 3 Easy Moves
// //           </h3>
// //           <div className="grid md:grid-cols-3 gap-8">
// //             <div className="text-center">
// //               <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// //                 1
// //               </div>
// //               <h4 className="text-lg font-semibold mb-2">Sketch It Out</h4>
// //               <p className="text-gray-600 text-sm">Grab your mouse (or poke the screen on mobile) and just sign like it's no big deal.</p>
// //             </div>

// //             <div className="text-center">
// //               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// //                 2
// //               </div>
// //               <h4 className="text-lg font-semibold mb-2">Add Some Flair</h4>
// //               <p className="text-gray-600 text-sm">Pick a pen color that feels right – blue for chill, red for boss mode.</p>
// //             </div>

// //             <div className="text-center">
// //               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// //                 3
// //               </div>
// //               <h4 className="text-lg font-semibold mb-2">Save & Shine</h4>
// //               <p className="text-gray-600 text-sm">Hit download for your see-through PNG – ready to sign anything, anywhere.</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Final CTA */}
// //         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
// //           Folks love firing up fresh signatures daily with PDF Linx – it's that quick, fun, and zero-cost way to add your personal touch.
// //         </p>
// //       </section>


// //       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
// //         {/* Heading */}
// //         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
// //           Signature Maker Online (Free) – Create Digital Signatures Instantly by PDFLinx
// //         </h2>

// //         {/* Intro */}
// //         <p className="text-base leading-7 mb-6">
// //           Need a quick digital signature for documents, contracts, or emails — but don’t want to print, sign, and scan every time?
// //           That’s why we built the{" "}
// //           <span className="font-medium text-slate-900">PDFLinx Signature Maker</span>.
// //           Simply draw your signature using your mouse, stylus, or finger, customize its color, and download it as a clean PNG file.
// //           No signup, no watermark, and works smoothly on mobile and desktop.
// //         </p>

// //         {/* What is */}
// //         <h3 className="text-xl font-semibold text-slate-900 mb-3">
// //           What Is a Digital Signature Maker?
// //         </h3>
// //         <p className="leading-7 mb-6">
// //           A digital signature maker allows you to create handwritten-style signatures online.
// //           Instead of signing documents manually on paper, you can draw your signature digitally and reuse it for PDFs,
// //           contracts, forms, and online paperwork. It saves time, reduces printing, and makes document signing faster and easier.
// //         </p>

// //         {/* Why use */}
// //         <h3 className="text-xl font-semibold text-slate-900 mb-3">
// //           Why Use an Online Signature Maker?
// //         </h3>
// //         <ul className="space-y-2 mb-6 list-disc pl-6">
// //           <li>Create signatures instantly without printing or scanning</li>
// //           <li>Draw signatures using mouse, stylus, or mobile touch</li>
// //           <li>Customize signature color and style</li>
// //           <li>Download transparent PNG signatures for documents</li>
// //           <li>Save time when signing contracts, PDFs, and forms</li>
// //         </ul>

// //         {/* Steps */}
// //         <h3 className="text-xl font-semibold text-slate-900 mb-3">
// //           How to Create a Digital Signature Online
// //         </h3>
// //         <ol className="space-y-2 mb-6 list-decimal pl-6">
// //           <li>Draw your signature using mouse, stylus, or finger</li>
// //           <li>Choose your preferred pen color</li>
// //           <li>Adjust or redraw until it looks perfect</li>
// //           <li>Download the signature as PNG (transparent background)</li>
// //           <li>Use it in PDFs, documents, emails, and forms</li>
// //         </ol>

// //         <p className="mb-6">
// //           Unlimited signatures, instant downloads — completely free and easy to use.
// //         </p>

// //         {/* Features box */}
// //         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
// //           <h3 className="text-xl font-semibold text-slate-900 mb-4">
// //             Features of PDFLinx Signature Maker
// //           </h3>
// //           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
// //             <li>Free online handwritten signature creator</li>
// //             <li>Draw signatures using mouse, stylus, or touch</li>
// //             <li>Custom pen color selection</li>
// //             <li>Download transparent PNG signature</li>
// //             <li>Clear canvas and redraw anytime</li>
// //             <li>Works on mobile, tablet, and desktop</li>
// //             <li>No signup, no watermark, no installation</li>
// //             <li>Simple and user-friendly interface</li>
// //           </ul>
// //         </div>

// //         {/* Audience */}
// //         <h3 className="text-xl font-semibold text-slate-900 mb-3">
// //           Who Should Use This Tool?
// //         </h3>
// //         <ul className="space-y-2 mb-6 list-disc pl-6">
// //           <li><strong>Business professionals:</strong> Sign contracts, agreements, and forms</li>
// //           <li><strong>Freelancers:</strong> Add signatures to invoices and proposals</li>
// //           <li><strong>Students:</strong> Sign academic forms and documents</li>
// //           <li><strong>Remote workers:</strong> Sign documents without printing</li>
// //           <li><strong>Anyone:</strong> Who wants a quick reusable digital signature</li>
// //         </ul>

// //         {/* Safety */}
// //         <h3 className="text-xl font-semibold text-slate-900 mb-3">
// //           Is PDFLinx Signature Maker Safe to Use?
// //         </h3>
// //         <p className="leading-7 mb-6">
// //           Yes. You don’t need to create an account or upload personal documents.
// //           Your signature is generated directly on your device and downloaded instantly.
// //           The tool is designed to be fast, simple, and privacy-friendly.
// //         </p>

// //         {/* Closing */}
// //         <h3 className="text-xl font-semibold text-slate-900 mb-3">
// //           Create Digital Signatures Anytime, Anywhere
// //         </h3>
// //         <p className="leading-7">
// //           PDFLinx Signature Maker works smoothly on Windows, macOS, Linux, Android, and iOS.
// //           Whether you’re using a phone, tablet, or computer, you can create and download signatures instantly using your browser.
// //         </p>
// //       </section>

// //       <section className="py-16 bg-gray-50">
// //         <div className="max-w-4xl mx-auto px-4">
// //           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
// //             Frequently Asked Questions
// //           </h2>

// //           <div className="space-y-4">
// //             <details className="bg-white rounded-lg shadow-sm p-5">
// //               <summary className="font-semibold cursor-pointer">
// //                 Is the Signature Maker free to use?
// //               </summary>
// //               <p className="mt-2 text-gray-600">
// //                 Yes — it’s completely free with unlimited signature creation and downloads.
// //               </p>
// //             </details>

// //             <details className="bg-white rounded-lg shadow-sm p-5">
// //               <summary className="font-semibold cursor-pointer">
// //                 Can I create signatures on mobile?
// //               </summary>
// //               <p className="mt-2 text-gray-600">
// //                 Yes — you can draw your signature using your finger on mobile devices or stylus on tablets.
// //               </p>
// //             </details>

// //             <details className="bg-white rounded-lg shadow-sm p-5">
// //               <summary className="font-semibold cursor-pointer">
// //                 In which format can I download my signature?
// //               </summary>
// //               <p className="mt-2 text-gray-600">
// //                 You can download your signature as a transparent PNG file for easy use in documents and PDFs.
// //               </p>
// //             </details>

// //             <details className="bg-white rounded-lg shadow-sm p-5">
// //               <summary className="font-semibold cursor-pointer">
// //                 Can I change signature color?
// //               </summary>
// //               <p className="mt-2 text-gray-600">
// //                 Yes — you can choose different pen colors before downloading your signature.
// //               </p>
// //             </details>

// //             <details className="bg-white rounded-lg shadow-sm p-5">
// //               <summary className="font-semibold cursor-pointer">
// //                 Are my signatures stored anywhere?
// //               </summary>
// //               <p className="mt-2 text-gray-600">
// //                 No — your signature is generated only for download. Nothing is stored.
// //               </p>
// //             </details>

// //             <details className="bg-white rounded-lg shadow-sm p-5">
// //               <summary className="font-semibold cursor-pointer">
// //                 Can I reuse my signature later?
// //               </summary>
// //               <p className="mt-2 text-gray-600">
// //                 Yes — simply save the downloaded PNG file and reuse it in any document or form.
// //               </p>
// //             </details>
// //           </div>
// //         </div>
// //       </section>


// //       <RelatedToolsSection currentPage="signature-maker" />
// //     </>
// //   );
// // }




















// // // 'use client';

// // // import { useRef, useState, useEffect } from 'react';
// // // import { Download, PenTool, Palette, Trash2, CheckCircle } from 'lucide-react';
// // // import Script from 'next/script';
// // // import RelatedToolsSection from "@/components/RelatedTools";


// // // export default function SignatureMakerClient() {
// // //   const canvasRef = useRef(null);
// // //   const [drawing, setDrawing] = useState(false);
// // //   const [color, setColor] = useState("#000000");
// // //   const [bgColor, setBgColor] = useState("#ffffff");

// // //   useEffect(() => {
// // //     const canvas = canvasRef.current;
// // //     if (!canvas) return;
// // //     const ctx = canvas.getContext("2d");
// // //     ctx.fillStyle = bgColor;
// // //     ctx.fillRect(0, 0, canvas.width, canvas.height);
// // //   }, [bgColor]);

// // //   const getCoordinates = (e) => {
// // //     const canvas = canvasRef.current;
// // //     if (!canvas) return { x: 0, y: 0 };
// // //     const rect = canvas.getBoundingClientRect();
// // //     let x, y;

// // //     if (e.touches && e.touches.length > 0) {
// // //       x = e.touches[0].clientX - rect.left;
// // //       y = e.touches[0].clientY - rect.top;
// // //     } else {
// // //       x = e.clientX - rect.left;
// // //       y = e.clientY - rect.top;
// // //     }

// // //     const scaleX = canvas.width / rect.width;
// // //     const scaleY = canvas.height / rect.height;

// // //     return {
// // //       x: x * scaleX,
// // //       y: y * scaleY,
// // //     };
// // //   };

// // //   const startDrawing = (e) => {
// // //     e.preventDefault();
// // //     const { x, y } = getCoordinates(e);
// // //     const ctx = canvasRef.current.getContext("2d");
// // //     ctx.beginPath();
// // //     ctx.moveTo(x, y);
// // //     setDrawing(true);
// // //   };

// // //   const draw = (e) => {
// // //     e.preventDefault();
// // //     if (!drawing) return;
// // //     const { x, y } = getCoordinates(e);
// // //     const ctx = canvasRef.current.getContext("2d");
// // //     ctx.lineWidth = 3;
// // //     ctx.lineCap = "round";
// // //     ctx.strokeStyle = color;
// // //     ctx.lineTo(x, y);
// // //     ctx.stroke();
// // //   };

// // //   const stopDrawing = () => {
// // //     setDrawing(false);
// // //   };

// // //   const clear = () => {
// // //     const canvas = canvasRef.current;
// // //     if (!canvas) return;
// // //     const ctx = canvas.getContext("2d");
// // //     ctx.clearRect(0, 0, canvas.width, canvas.height);
// // //     ctx.fillStyle = bgColor;
// // //     ctx.fillRect(0, 0, canvas.width, canvas.height);
// // //   };

// // //   const download = () => {
// // //     const canvas = canvasRef.current;
// // //     if (!canvas) return;
// // //     const link = document.createElement("a");
// // //     link.download = "my-signature.png";
// // //     link.href = canvas.toDataURL("image/png");
// // //     link.click();
// // //   };

// // //   return (
// // //     <>
// // //       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
// // //       <Script
// // //         id="howto-schema-signature"
// // //         type="application/ld+json"
// // //         strategy="afterInteractive"
// // //         dangerouslySetInnerHTML={{
// // //           __html: JSON.stringify({
// // //             "@context": "https://schema.org",
// // //             "@type": "HowTo",
// // //             name: "How to Create Digital Signature Online for Free",
// // //             description: "Make professional signatures by drawing or typing instantly.",
// // //             url: "https://pdflinx.com/signature-maker",
// // //             step: [
// // //               { "@type": "HowToStep", name: "Choose Method", text: "Draw with mouse/finger or type your name." },
// // //               { "@type": "HowToStep", name: "Customize", text: "Change color, style, and thickness." },
// // //               { "@type": "HowToStep", name: "Download", text: "Download transparent PNG signature." }
// // //             ],
// // //             totalTime: "PT40S",
// // //             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
// // //             image: "https://pdflinx.com/og-image.png"
// // //           }, null, 2),
// // //         }}
// // //       />

// // //       <Script
// // //         id="breadcrumb-schema-signature"
// // //         type="application/ld+json"
// // //         strategy="afterInteractive"
// // //         dangerouslySetInnerHTML={{
// // //           __html: JSON.stringify({
// // //             "@context": "https://schema.org",
// // //             "@type": "BreadcrumbList",
// // //             itemListElement: [
// // //               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
// // //               { "@type": "ListItem", position: 2, name: "Signature Maker", item: "https://pdflinx.com/signature-maker" }
// // //             ]
// // //           }, null, 2),
// // //         }}
// // //       />

// // //       {/* ==================== MAIN TOOL SECTION ==================== */}
// // //       <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
// // //         <div className="max-w-5xl mx-auto">
// // //           {/* Header */}
// // //           <div className="text-center mb-12">
// // //             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
// // //               Signature Maker <br /> Online (Free)
// // //             </h1>
// // //             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
// // //               Create professional digital signatures instantly. Draw with mouse/finger, customize color — download transparent PNG. 100% free, no signup.
// // //             </p>
// // //           </div>

// // //           {/* Tool Card */}
// // //           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
// // //             {/* Controls */}
// // //             <div className="flex flex-wrap justify-center gap-6 mb-10">
// // //               <div className="flex items-center gap-4">
// // //                 <Palette className="w-8 h-8 text-indigo-600" />
// // //                 <span className="font-semibold">Pen Color:</span>
// // //                 <input
// // //                   type="color"
// // //                   value={color}
// // //                   onChange={(e) => setColor(e.target.value)}
// // //                   className="w-16 h-16 rounded-full cursor-pointer border-4 border-indigo-200"
// // //                 />
// // //               </div>

// // //               <button
// // //                 onClick={clear}
// // //                 className="bg-red-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-red-700 transition flex items-center gap-3 shadow-lg"
// // //               >
// // //                 <Trash2 size={24} />
// // //                 Clear Canvas
// // //               </button>

// // //               <button
// // //                 onClick={download}
// // //                 className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold px-10 py-4 rounded-xl hover:from-green-700 hover:to-teal-700 transition flex items-center gap-3 shadow-lg"
// // //               >
// // //                 <Download size={28} />
// // //                 Download Signature (PNG)
// // //               </button>
// // //             </div>

// // //             {/* Canvas */}
// // //             <div className="w-full max-w-4xl mx-auto">
// // //               <canvas
// // //                 ref={canvasRef}
// // //                 width={900}
// // //                 height={350}
// // //                 className="w-full h-[250px] sm:h-[300px] md:h-[350px] border-4 border-indigo-300 rounded-3xl shadow-2xl cursor-crosshair bg-white touch-none"
// // //                 onMouseDown={startDrawing}
// // //                 onMouseMove={draw}
// // //                 onMouseUp={stopDrawing}
// // //                 onMouseLeave={stopDrawing}
// // //                 onTouchStart={startDrawing}
// // //                 onTouchMove={draw}
// // //                 onTouchEnd={stopDrawing}
// // //               />
// // //             </div>

// // //             <p className="text-center mt-8 text-gray-600 text-lg">
// // //               💡 Tip: Use mouse on desktop or finger on mobile/tablet for natural handwriting!
// // //             </p>
// // //           </div>

// // //           <p className="text-center mt-10 text-gray-600">
// // //             No signup • Unlimited signatures • Transparent background • 100% free
// // //           </p>
// // //         </div>
// // //       </main>

// // //       {/* ==================== SEO CONTENT SECTION ==================== */}
// // //       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
// // //         {/* Main Heading */}
// // //         <div className="text-center mb-16">
// // //           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
// // //             Signature Maker Online Free - Create Digital Signature Instantly
// // //           </h2>
// // //           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
// // //             Design professional handwritten or styled signatures online. Draw naturally with mouse or finger, customize color — download transparent PNG for documents, emails, and forms. Completely free with PDF Linx.
// // //           </p>
// // //         </div>

// // //         {/* Benefits Grid */}
// // //         <div className="grid md:grid-cols-3 gap-10 mb-20">
// // //           <div className="bg-gradient-to-br from-indigo-50 to-white p-10 rounded-3xl shadow-xl border border-indigo-100 text-center hover:shadow-2xl transition">
// // //             <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
// // //               <PenTool className="w-10 h-10 text-white" />
// // //             </div>
// // //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Natural Handwriting</h3>
// // //             <p className="text-gray-600">
// // //               Draw freely with mouse or finger — feels like signing on paper.
// // //             </p>
// // //           </div>

// // //           <div className="bg-gradient-to-br from-purple-50 to-white p-10 rounded-3xl shadow-xl border border-purple-100 text-center hover:shadow-2xl transition">
// // //             <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
// // //               <Palette className="w-10 h-10 text-white" />
// // //             </div>
// // //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Fully Customizable</h3>
// // //             <p className="text-gray-600">
// // //               Choose any color for pen — perfect for matching brand or style.
// // //             </p>
// // //           </div>

// // //           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
// // //             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
// // //               <CheckCircle className="w-10 h-10 text-white" />
// // //             </div>
// // //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Transparent & Ready</h3>
// // //             <p className="text-gray-600">
// // //               Download as transparent PNG — ready for Word, PDF, email signatures.
// // //             </p>
// // //           </div>
// // //         </div>

// // //         {/* How To Steps */}
// // //         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
// // //           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
// // //             How to Create Digital Signature in 3 Simple Steps
// // //           </h3>
// // //           <div className="grid md:grid-cols-3 gap-12">
// // //             <div className="text-center">
// // //               <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// // //                 1
// // //               </div>
// // //               <h4 className="text-2xl font-semibold mb-4">Draw Your Signature</h4>
// // //               <p className="text-gray-600 text-lg">Use mouse or finger to sign naturally on the canvas.</p>
// // //             </div>

// // //             <div className="text-center">
// // //               <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// // //                 2
// // //               </div>
// // //               <h4 className="text-2xl font-semibold mb-4">Customize Color</h4>
// // //               <p className="text-gray-600 text-lg">Pick any pen color to match your style or brand.</p>
// // //             </div>

// // //             <div className="text-center">
// // //               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// // //                 3
// // //               </div>
// // //               <h4 className="text-2xl font-semibold mb-4">Download PNG</h4>
// // //               <p className="text-gray-600 text-lg">Save transparent signature for documents and emails.</p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Final CTA */}
// // //         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
// // //           Create professional signatures every day with PDF Linx — trusted by thousands for easy, fast, and completely free digital signature creation.
// // //         </p>
// // //       </section>
// // //     </>
// // //   );
// // // }






















// // // // "use client";

// // // // import { useRef, useState, useEffect } from "react";

// // // // export default function SignatureMakerClient() {
// // // //   const canvasRef = useRef(null);
// // // //   const [drawing, setDrawing] = useState(false);
// // // //   const [color, setColor] = useState("#000000");
// // // //   const [bgColor, setBgColor] = useState("#ffffff");

// // // //   useEffect(() => {
// // // //     const canvas = canvasRef.current;
// // // //     const ctx = canvas.getContext("2d");
// // // //     ctx.fillStyle = bgColor;
// // // //     ctx.fillRect(0, 0, canvas.width, canvas.height);
// // // //   }, [bgColor]);

// // // //   const getCoordinates = (e) => {
// // // //     const canvas = canvasRef.current;
// // // //     const rect = canvas.getBoundingClientRect();
// // // //     let x, y;

// // // //     if (e.touches && e.touches.length > 0) {
// // // //       x = e.touches[0].clientX - rect.left;
// // // //       y = e.touches[0].clientY - rect.top;
// // // //     } else {
// // // //       x = e.clientX - rect.left;
// // // //       y = e.clientY - rect.top;
// // // //     }

// // // //     // Scaling fix (for responsive canvas)
// // // //     const scaleX = canvas.width / rect.width;
// // // //     const scaleY = canvas.height / rect.height;

// // // //     return {
// // // //       x: x * scaleX,
// // // //       y: y * scaleY,
// // // //     };
// // // //   };

// // // //   const startDrawing = (e) => {
// // // //     const { x, y } = getCoordinates(e);
// // // //     const ctx = canvasRef.current.getContext("2d");
// // // //     ctx.beginPath();
// // // //     ctx.moveTo(x, y);
// // // //     setDrawing(true);
// // // //   };

// // // //   const draw = (e) => {
// // // //     if (!drawing) return;
// // // //     const { x, y } = getCoordinates(e);
// // // //     const ctx = canvasRef.current.getContext("2d");
// // // //     ctx.lineWidth = 2;
// // // //     ctx.lineCap = "round";
// // // //     ctx.strokeStyle = color;
// // // //     ctx.lineTo(x, y);
// // // //     ctx.stroke();
// // // //   };

// // // //   const stopDrawing = () => {
// // // //     setDrawing(false);
// // // //   };

// // // //   const clear = () => {
// // // //     const canvas = canvasRef.current;
// // // //     const ctx = canvas.getContext("2d");
// // // //     ctx.clearRect(0, 0, canvas.width, canvas.height);
// // // //     ctx.fillStyle = bgColor;
// // // //     ctx.fillRect(0, 0, canvas.width, canvas.height);
// // // //   };

// // // //   const download = () => {
// // // //     const canvas = canvasRef.current;
// // // //     const link = document.createElement("a");
// // // //     link.download = "signature.png";
// // // //     link.href = canvas.toDataURL("image/png");
// // // //     link.click();
// // // //   };

// // // //   return (
// // // //     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
// // // //       <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center">
// // // //         <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-2">
// // // //           Free Signature Maker
// // // //         </h1>
// // // //         <p className="text-lg md:text-xl text-gray-600 mb-10">
// // // //           Draw or type → Download transparent PNG signature!
// // // //         </p>

// // // //         <div className="flex justify-center gap-4 mb-8 flex-wrap">
// // // //           <input
// // // //             type="color"
// // // //             value={color}
// // // //             onChange={(e) => setColor(e.target.value)}
// // // //             className="w-12 h-12 md:w-16 md:h-16 rounded-full cursor-pointer"
// // // //           />
// // // //           <button
// // // //             onClick={clear}
// // // //             className="bg-red-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold hover:bg-red-700"
// // // //           >
// // // //             Clear
// // // //           </button>
// // // //           <button
// // // //             onClick={download}
// // // //             className="bg-green-600 text-white px-8 py-3 md:px-10 md:py-4 rounded-xl font-bold hover:bg-green-700"
// // // //           >
// // // //             Download PNG
// // // //           </button>
// // // //         </div>

// // // //         <div className="w-full max-w-[800px] mx-auto">
// // // //           <canvas
// // // //             ref={canvasRef}
// // // //             width={800}
// // // //             height={300}
// // // //             className="w-full h-[180px] sm:h-[220px] md:h-[300px] border-4 border-indigo-300 rounded-2xl shadow-2xl cursor-crosshair bg-white"
// // // //             onMouseDown={startDrawing}
// // // //             onMouseMove={draw}
// // // //             onMouseUp={stopDrawing}
// // // //             onMouseLeave={stopDrawing}
// // // //             onTouchStart={startDrawing}
// // // //             onTouchMove={draw}
// // // //             onTouchEnd={stopDrawing}
// // // //           />
// // // //         </div>

// // // //         <p className="mt-10 text-gray-600 text-sm md:text-base">
// // // //           Tip: Sign with your mouse or finger on mobile!
// // // //         </p>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }


