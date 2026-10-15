'use client';

import { useState } from 'react';
import { Upload, Download, Image as ImageIcon, CheckCircle, ChevronDown, Layers } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';
import '@/styles/HeicToJpg.css'; // same hj-* classes reused, no new CSS needed

const linkStyle = { color: '#7C3AED', textDecoration: 'underline', fontWeight: 600 };

/* FAQ answers use [anchor text](/tool-slug) markup.
   UI renders them as <Link>; FAQ schema gets plain text. */
const faqs = [
  {
    q: 'What is a JFIF file?',
    a: 'JFIF (JPEG File Interchange Format) is a way of storing JPEG image data. A .jfif file is essentially a JPEG image with a different extension, which is why some apps and websites do not recognise it.',
  },
  {
    q: 'How do I convert JFIF to JPG?',
    a: 'Upload your .jfif files, keep the default setting, and download the JPG files. By default the image data is kept exactly as it is and only the file format label changes, so there is no quality loss.',
  },
  {
    q: 'Is JFIF to JPG conversion free?',
    a: 'Yes — completely free, with unlimited conversions and no signup.',
  },
  {
    q: 'Will I lose quality when converting JFIF to JPG?',
    a: 'Not with the default option, because JFIF and JPG use the same compression. If you choose the smaller-file option, the image is re-compressed and a small amount of detail is lost.',
  },
  {
    q: 'Why does my image download as JFIF instead of JPG?',
    a: 'Some browsers and apps save images from the web as .jfif. The picture itself is a normal JPEG, so converting it to .jpg fixes upload errors on sites that only accept .jpg or .jpeg.',
  },
  {
    q: 'Can I convert multiple JFIF files at once?',
    a: 'Yes — batch conversion is supported. Select several JFIF files together and download each converted JPG.',
  },
  {
    q: 'My JFIF file is too large. How can I make it smaller?',
    a: 'Use the smaller-file option here, or run the result through the [Image Compressor](/image-compressor). You can also change dimensions with the [Image Resizer](/image-resizer).',
  },
  {
    q: 'What if my image is PNG or HEIC, not JFIF?',
    a: 'Use the [PNG to JPG converter](/png-to-jpg) for PNG files, the [HEIC to JPG converter](/heic-to-jpg) for iPhone photos, or the [Image Converter](/image-converter) for other formats.',
  },
  {
    q: 'Are my images uploaded to a server?',
    a: 'No. Everything happens in your browser, so your files are not stored or sent anywhere.',
  },
];

const stripLinks = (text) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

const renderLinks = (text) => {
  const parts = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <Link key={k++} href={m[2]} style={linkStyle}>
        {m[1]}
      </Link>
    );
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
};

// Re-encode through canvas (used only for the "smaller file" option)
const recompress = (blob, quality) =>
  new Promise((resolve, reject) => {
    const src = URL.createObjectURL(blob);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (out) => {
          URL.revokeObjectURL(src);
          out ? resolve(out) : reject(new Error('Conversion failed'));
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error('Could not read image'));
    };
    img.src = src;
  });

const formatSize = (bytes) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${Math.round(bytes / 1024)} KB`;

export default function JfifToJpg() {
  const [converted, setConverted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('keep'); // 'keep' = no quality loss, 'compress' = smaller file
  const [quality, setQuality] = useState(85);

  const convert = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setLoading(true);
    converted.forEach((c) => URL.revokeObjectURL(c.url));
    setConverted([]);

    try {
      const results = [];
      for (const file of files) {
        // Force JPEG mime type: browsers often report .jfif as empty or image/jfif
        const asJpeg = new Blob([file], { type: 'image/jpeg' });
        const out = mode === 'keep' ? asJpeg : await recompress(asJpeg, quality / 100);
        results.push({
          name: file.name.replace(/\.(jfif|pjpeg|pjp)$/i, '') + '.jpg',
          url: URL.createObjectURL(out),
          before: file.size,
          after: out.size,
        });
      }
      setConverted(results);
    } catch (err) {
      console.error(err);
      alert('Conversion failed. Make sure you uploaded valid JFIF files and try again.');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-jfif-jpg"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Convert JFIF to JPG Online for Free',
            description:
              'Convert JFIF images to JPG online for free. Batch conversion with no quality loss and no upload to any server.',
            url: 'https://convertlinx.com/jfif-to-jpg',
            totalTime: 'PT30S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'JFIF image file' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx JFIF to JPG Converter' }],
            step: [
              { '@type': 'HowToStep', name: 'Upload JFIF files', text: 'Select one or more .jfif files from your device.' },
              { '@type': 'HowToStep', name: 'Choose output option', text: 'Keep original quality, or pick the smaller file option and set the quality.' },
              { '@type': 'HowToStep', name: 'Download JPG files', text: 'Download each converted JPG and use it anywhere.' },
            ],
          }),
        }}
      />

      <main className="hj-page">
        {/* ── HERO ── */}
        <section className="hj-hero">
          <div className="hj-blob-1" />
          <div className="hj-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <Link href="/" className="hj-breadcrumb-link">Home</Link>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#C026D3' }}>JFIF to JPG</span>
            </div>
            <span className="hj-badge">Image Converter</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              JFIF to <span className="hj-grad-text">JPG Converter</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Convert JFIF to JPG online for free. Turn .jfif images into standard JPG files that upload
              and open everywhere, with no quality loss. Batch conversion, no signup required.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="hj-section-main py-10 px-6">
          <div className="max-w-2xl mx-auto hj-fade-up">
            <div className="hj-tool-card">
              <label
                className="block mb-3"
                style={{ color: '#C026D3', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}
              >
                Upload JFIF Images
              </label>

              <label className="hj-upload-area">
                <div className="hj-upload-icon">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
                  Drop JFIF images here or click to browse
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                  Multiple files supported · Converted in your browser
                </p>
                <input
                  type="file"
                  accept=".jfif,.JFIF,.pjpeg,.pjp,image/jfif,image/pjpeg"
                  multiple
                  onChange={convert}
                  className="hidden"
                />
              </label>

              {/* Output option */}
              <div className="mt-6">
                <p className="text-xs font-semibold mb-2" style={{ color: '#374151' }}>Output option</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { id: 'keep', title: 'Keep original quality', desc: 'No quality loss. Recommended.' },
                    { id: 'compress', title: 'Make file smaller', desc: 'Re-compress with a quality slider.' },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className="flex items-start gap-2 p-3 rounded-xl border cursor-pointer text-sm"
                      style={{
                        borderColor: mode === o.id ? '#C026D3' : '#E5E7EB',
                        background: mode === o.id ? 'rgba(192,38,211,0.05)' : '#fff',
                      }}
                    >
                      <input
                        type="radio"
                        name="jfif-mode"
                        checked={mode === o.id}
                        onChange={() => setMode(o.id)}
                        className="mt-1"
                      />
                      <span>
                        <span className="font-semibold block" style={{ color: '#1a1a2e' }}>{o.title}</span>
                        <span className="text-xs" style={{ color: '#9CA3AF' }}>{o.desc}</span>
                      </span>
                    </label>
                  ))}
                </div>

                {mode === 'compress' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold" style={{ color: '#374151' }}>JPG Quality</span>
                      <span className="text-xs font-bold" style={{ color: '#C026D3' }}>{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full"
                      aria-label="JPG quality"
                    />
                  </div>
                )}
                <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>Set your option before uploading.</p>
              </div>

              {loading && (
                <div className="text-center py-8 mt-4">
                  <div className="hj-spinner mb-3" />
                  <p className="text-sm font-semibold" style={{ color: '#C026D3' }}>Converting your images...</p>
                </div>
              )}

              {!loading && converted.length > 0 && (
                <div className="mt-7">
                  <p className="text-sm font-bold uppercase tracking-widest mb-5 text-center" style={{ color: '#C026D3' }}>
                    {converted.length} {converted.length === 1 ? 'Image' : 'Images'} Ready
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {converted.map((item, i) => (
                      <div key={i} className="hj-result-card">
                        <img src={item.url} alt={item.name} className="w-full h-44 object-cover" />
                        <div className="p-4 text-center">
                          <p className="text-xs font-medium mb-1 truncate" style={{ color: '#374151' }}>{item.name}</p>
                          <p className="text-xs mb-3" style={{ color: '#9CA3AF' }}>
                            {formatSize(item.before)} → {formatSize(item.after)}
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

              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No sign-up', 'Batch convert', 'No quality loss', 'Nothing uploaded', '100% free'].map((t, i) => (
                  <span key={i} className="hj-trust-item">
                    <span className="hj-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="hj-divider" />
        <section className="hj-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              How to Convert JFIF to JPG in 3 Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload JFIF Files', desc: 'Pick one or more .jfif images from your phone or computer.' },
                { num: '2', title: 'Choose Output', desc: 'Keep original quality, or make the file smaller if needed.' },
                { num: '3', title: 'Download JPG', desc: 'Save each converted JPG, ready to upload or share.' },
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

        {/* ── BENEFITS ── */}
        <hr className="hj-divider" />
        <section className="hj-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <ImageIcon className="w-6 h-6" />,
                  color: '#C026D3',
                  bg: 'rgba(192,38,211,0.08)',
                  title: 'No Quality Loss',
                  desc: 'JFIF and JPG share the same image data, so the default option keeps your picture exactly as it is.',
                },
                {
                  icon: <Layers className="w-6 h-6" />,
                  color: '#7C3AED',
                  bg: 'rgba(124,58,237,0.08)',
                  title: 'Batch Conversion',
                  desc: 'Select many JFIF files at once and convert them in one go instead of renaming each one.',
                },
                {
                  icon: <CheckCircle className="w-6 h-6" />,
                  color: '#10B981',
                  bg: 'rgba(16,185,129,0.08)',
                  title: 'Private by Design',
                  desc: 'Conversion runs inside your browser. Your images are never uploaded or stored.',
                },
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

        {/* ── SEO CONTENT (with contextual interlinking) ── */}
        <hr className="hj-divider" />
        <section className="hj-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Why Do JFIF Files Not Open or Upload?
              </h2>
              <p className="leading-7 text-sm">
                JFIF is a JPEG-based image format that some browsers and apps use when saving pictures from the
                web. The image itself is a normal JPEG, but the .jfif extension is not recognised by many websites,
                online forms, document portals and editing tools. The result is an "unsupported file type" error
                even though the picture looks fine.
              </p>
              <p className="leading-7 text-sm mt-3">
                Converting JFIF to JPG gives the file the extension those sites expect. Once converted, you can
                reduce its size with the <Link href="/image-compressor" style={linkStyle}>Image Compressor</Link>,
                change dimensions with the <Link href="/image-resizer" style={linkStyle}>Image Resizer</Link>, or
                crop it with the <Link href="/image-cropper" style={linkStyle}>Image Cropper</Link>.
              </p>
              <p className="leading-7 text-sm mt-3">
                If your file is a PNG instead, use the <Link href="/png-to-jpg" style={linkStyle}>PNG to JPG converter</Link>.
                For iPhone photos, the <Link href="/heic-to-jpg" style={linkStyle}>HEIC to JPG converter</Link> is the
                right tool, and for other formats such as WebP or GIF the general{' '}
                <Link href="/image-converter" style={linkStyle}>Image Converter</Link> covers them. You can also{' '}
                <Link href="/add-watermark" style={linkStyle}>add a watermark</Link> to protect the final image, or
                pull text out of it with <Link href="/image-to-text" style={linkStyle}>Image to Text</Link>.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                JFIF vs JPG — What's the Difference?
              </h3>
              <p className="leading-7 text-sm">
                Technically, JFIF is a file container for JPEG image data, and a .jpg file is the same thing with the
                more common extension. They use the same compression, so converting between them does not need to
                change the picture. The difference is compatibility: .jpg and .jpeg are accepted almost everywhere,
                while .jfif is often rejected.
              </p>
            </div>

            <div className="hj-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Problems This Tool Solves
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Website says the .jfif file type is not allowed',
                  'Image saved from the browser downloads as JFIF',
                  'JFIF file will not open in some editing apps',
                  'Need JPG for forms, portals or job applications',
                  'Need to convert many JFIF files quickly',
                  'Want a normal JPG without losing quality',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="hj-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Students — upload images to school forms and portals',
                  'Job seekers — attach photos that sites accept',
                  'Bloggers — publish images in a standard format',
                  'Online sellers — prepare product photos for marketplaces',
                  'Office teams — attach images to emails and documents',
                  'Everyone — change JFIF to JPG without installing software',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#C026D3' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ (with contextual interlinking) ── */}
        <hr className="hj-divider" />
        <section className="hj-section-main py-16 px-6">
          <Script
            id="faq-schema-jfif-jpg"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: { '@type': 'Answer', text: stripLinks(faq.a) },
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
                <details key={i} className="hj-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#C026D3' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {renderLinks(faq.a)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="hj-divider" />
        <section className="hj-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'PNG to JPG', href: '/png-to-jpg' },
                { name: 'HEIC to JPG', href: '/heic-to-jpg' },
                { name: 'Image Converter', href: '/image-converter' },
                { name: 'Image Compressor', href: '/image-compressor' },
                { name: 'Image Resizer', href: '/image-resizer' },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ color: '#7C3AED', borderColor: '#D8B4FE', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="hj-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to convert JFIF to JPG?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 5 seconds. No signup. No watermark.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hj-cta-btn"
            >
              <ImageIcon className="w-5 h-5" />
              Convert Now
            </button>
          </div>
        </section>
      </main>
    </>
  );
}