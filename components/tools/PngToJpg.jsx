'use client';

import { useState } from 'react';
import { Upload, Download, Image as ImageIcon, CheckCircle, ChevronDown, Layers } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';
import '@/styles/HeicToJpg.css'; // same hj-* classes reused, no new CSS needed

const linkStyle = { color: '#7C3AED', textDecoration: 'underline', fontWeight: 600 };

/* FAQ answers use [anchor text](/tool-slug) markup.
   - UI renders them as <Link>
   - FAQ schema gets the plain text (markup stripped) */
const faqs = [
  {
    q: 'Is PNG to JPG conversion free?',
    a: 'Yes — completely free, with unlimited conversions and no signup.',
  },
  {
    q: 'How do I convert PNG to JPG online?',
    a: 'Upload one or more PNG files, adjust the quality slider if you want, and download the JPG files. Everything runs in your browser.',
  },
  {
    q: 'What happens to transparent backgrounds when I convert PNG to JPG?',
    a: 'JPG does not support transparency, so transparent areas are filled with white. If you need to keep transparency, keep the PNG or use the [Image Converter](/image-converter) to switch to WebP instead.',
  },
  {
    q: 'Will converting PNG to JPG reduce image quality?',
    a: 'JPG uses lossy compression, so a small amount of detail is lost. At 90% quality and above the difference is hard to notice on photos. Sharp text, logos and flat graphics may show slight softening, so PNG is better for those.',
  },
  {
    q: 'Why is my JPG file smaller than the PNG?',
    a: 'PNG stores every pixel without loss, while JPG compresses image data. That is why JPG files are usually much smaller. If you want it even smaller, run the result through the [Image Compressor](/image-compressor).',
  },
  {
    q: 'Can I convert multiple PNG files at once?',
    a: 'Yes — batch conversion is supported. Select several PNG files together and download each converted JPG.',
  },
  {
    q: 'Can I change the image size after converting?',
    a: 'Yes. Use the [Image Resizer](/image-resizer) to set exact dimensions, or the [Image Cropper](/image-cropper) to trim the image to a specific area.',
  },
  {
    q: 'I have iPhone photos, not PNG. What should I use?',
    a: 'Use the [HEIC to JPG converter](/heic-to-jpg) for iPhone photos. For other formats such as WebP or GIF, try the [Image Converter](/image-converter).',
  },
  {
    q: 'Are my images uploaded to a server?',
    a: 'No. The conversion happens locally in your browser, so your files are not stored or sent anywhere.',
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

const pngToJpgBlob = (file, quality) =>
  new Promise((resolve, reject) => {
    const src = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF'; // JPG has no alpha, so fill transparent areas with white
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(src);
          blob ? resolve(blob) : reject(new Error('Conversion failed'));
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

export default function PngToJpg() {
  const [converted, setConverted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(92);

  const convert = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setLoading(true);
    converted.forEach((c) => URL.revokeObjectURL(c.url));
    setConverted([]);

    try {
      const results = [];
      for (const file of files) {
        const blob = await pngToJpgBlob(file, quality / 100);
        results.push({
          name: file.name.replace(/\.png$/i, '') + '.jpg',
          url: URL.createObjectURL(blob),
          before: file.size,
          after: blob.size,
        });
      }
      setConverted(results);
    } catch (err) {
      console.error(err);
      alert('Conversion failed. Make sure you uploaded valid PNG files and try again.');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-png-jpg"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Convert PNG to JPG Online for Free',
            description:
              'Convert PNG images to JPG online for free. Batch conversion, adjustable quality, and no upload to any server.',
            url: 'https://convertlinx.com/png-to-jpg',
            totalTime: 'PT30S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'PNG image file' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx PNG to JPG Converter' }],
            step: [
              { '@type': 'HowToStep', name: 'Upload PNG images', text: 'Select one or more PNG files from your device.' },
              { '@type': 'HowToStep', name: 'Set JPG quality', text: 'Choose the output quality with the slider, or keep the default of 92%.' },
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
              <span style={{ color: '#C026D3' }}>PNG to JPG</span>
            </div>
            <span className="hj-badge">Image Converter</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              PNG to <span className="hj-grad-text">JPG Converter</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Convert PNG to JPG online for free. Turn heavy PNG images into lightweight JPG files that are
              easier to upload, email and share. Batch conversion, adjustable quality, no signup required.
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
                Upload PNG Images
              </label>

              <label className="hj-upload-area">
                <div className="hj-upload-icon">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
                  Drop PNG images here or click to browse
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                  Multiple files supported · Converted in your browser
                </p>
                <input
                  type="file"
                  accept=".png,image/png"
                  multiple
                  onChange={convert}
                  className="hidden"
                />
              </label>

              {/* Quality slider */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color: '#374151' }}>JPG Quality</span>
                  <span className="text-xs font-bold" style={{ color: '#C026D3' }}>{quality}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                  aria-label="JPG quality"
                />
                <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                  Lower quality = smaller file. Set the quality before uploading.
                </p>
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
                {['No sign-up', 'Batch convert', 'Adjustable quality', 'Nothing uploaded', '100% free'].map((t, i) => (
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
              How to Convert PNG to JPG in 3 Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload PNG Files', desc: 'Pick one or more PNG images from your phone or computer.' },
                { num: '2', title: 'Choose Quality', desc: 'Keep the default 92% or lower it for a smaller file size.' },
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
                  title: 'Smaller File Sizes',
                  desc: 'JPG files are usually far smaller than PNG, which makes pages load faster and uploads quicker.',
                },
                {
                  icon: <Layers className="w-6 h-6" />,
                  color: '#7C3AED',
                  bg: 'rgba(124,58,237,0.08)',
                  title: 'Batch Conversion',
                  desc: 'Select many PNG files at once and convert them in one go instead of one by one.',
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
                Why Convert PNG to JPG?
              </h2>
              <p className="leading-7 text-sm">
                PNG is great for logos, screenshots and graphics with sharp edges or transparency, but the files
                can get large. Many websites, forms and email services limit upload size, and a big PNG can slow
                down a page. Converting PNG to JPG gives you a much lighter file that is accepted almost everywhere.
              </p>
              <p className="leading-7 text-sm mt-3">
                After converting, you can shrink the file further with the{' '}
                <Link href="/image-compressor" style={linkStyle}>Image Compressor</Link>, set exact dimensions with the{' '}
                <Link href="/image-resizer" style={linkStyle}>Image Resizer</Link>, or trim the picture with the{' '}
                <Link href="/image-cropper" style={linkStyle}>Image Cropper</Link>. If your photos come from an iPhone
                instead, the <Link href="/heic-to-jpg" style={linkStyle}>HEIC to JPG converter</Link> is the right tool,
                and for other formats like WebP or GIF you can use the general{' '}
                <Link href="/image-converter" style={linkStyle}>Image Converter</Link>.
              </p>
              <p className="leading-7 text-sm mt-3">
                Need to protect your pictures before sharing? Add a{' '}
                <Link href="/add-watermark" style={linkStyle}>watermark to your image</Link> after conversion, or fix
                a sideways photo with the{' '}
                <Link href="/rotate-flip-image" style={linkStyle}>Rotate &amp; Flip Image</Link> tool. If the picture
                contains text you want to copy, the <Link href="/image-to-text" style={linkStyle}>Image to Text</Link>{' '}
                tool can extract it.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                PNG vs JPG — What's the Difference?
              </h3>
              <p className="leading-7 text-sm">
                PNG uses lossless compression and supports transparent backgrounds, so it keeps every detail but
                produces larger files. JPG uses lossy compression and has no transparency, but it is much smaller and
                works well for photographs. Use PNG when you need transparency or crisp text, and JPG when you need a
                small file for sharing or uploading. Need a PNG as an icon instead? Try{' '}
                <Link href="/png-to-ico" style={linkStyle}>PNG to ICO</Link> or the{' '}
                <Link href="/favicon-generator" style={linkStyle}>Favicon Generator</Link>.
              </p>
            </div>

            <div className="hj-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Good to Know Before You Convert
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Transparent areas become white in the JPG',
                  'JPG is lossy, so keep the original PNG as a backup',
                  'Quality 85–92% is a good balance for photos',
                  'Logos and text look best as PNG',
                  'Screenshots convert well at 90%+ quality',
                  'Batch convert many files in one go',
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
                  'Students — meet upload size limits on school portals',
                  'Bloggers — publish lighter images for faster pages',
                  'Online sellers — prepare product photos for marketplaces',
                  'Office teams — attach smaller images to emails and reports',
                  'Designers — export client previews as JPG',
                  'Everyone — change PNG to JPG without installing software',
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
            id="faq-schema-png-jpg"
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
                { name: 'Image Converter', href: '/image-converter' },
                { name: 'HEIC to JPG', href: '/heic-to-jpg' },
                { name: 'Image Compressor', href: '/image-compressor' },
                { name: 'Image Resizer', href: '/image-resizer' },
                { name: 'PNG to ICO', href: '/png-to-ico' },
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
              Ready to convert PNG to JPG?
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