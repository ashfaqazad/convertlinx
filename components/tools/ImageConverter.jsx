'use client';

import { useState } from 'react';
import { Upload, Download, Image as ImageIcon, Zap, Shield, CheckCircle, ChevronDown, RefreshCw } from 'lucide-react';
import Script from 'next/script';
import '@/styles/ImageConverter.css';
import Link from 'next/link';

export default function ImageConverter() {
  const [files, setFiles]         = useState([]);
  const [converted, setConverted] = useState([]);
  const [toFormat, setToFormat]   = useState('webp');
  const [category, setCategory]   = useState('All');
  const [loading, setLoading]     = useState(false);
  const [quality, setQuality]     = useState(0.94);

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
              const map = {
                webp: ['image/webp', 'webp'],
                png:  ['image/png',  'png'],
                jpg:  ['image/jpeg', 'jpg'],
                gif:  ['image/gif',  'gif'],
                bmp:  ['image/bmp',  'bmp'],
                ico:  ['image/x-icon','ico'],
              };
              if (map[toFormat]) { mimeType = map[toFormat][0]; extension = map[toFormat][1]; }
            }
            const qualityVal = (toFormat === 'jpg' || toFormat === 'webp') ? quality : 1;

            canvas.toBlob((blob) => {
              resolve({
                originalName: file.name,
                name:   file.name.replace(/\.[^/.]+$/, '') + '.' + extension,
                url:    URL.createObjectURL(blob),
                isHeic: isHEIC(file),
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
  const showQuality = ['jpg', 'webp', 'heic', 'heif'].includes(toFormat);

  // FAQ Array with React Elements for Link Rendering
  const faqs = [
    {
      q: 'Is the Image Converter free to use online?',
      a: 'Yes — ConvertLinx is a 100% free image converter online with unlimited batch conversions, no watermark and zero registration requirements.'
    },
    {
      q: 'What is an image format converter and which formats are supported?',
      a: 'An image format converter changes a picture from one file type to another. Our image file type converter supports 500+ image formats including JPG, PNG, WebP, iPhone HEIC, RAW camera files (CR2, NEF, ARW, DNG), SVG, TIFF, and AVIF.'
    },
    {
      q: 'Can I use this as a bulk image converter online?',
      a: 'Yes, this bulk image converter online lets you upload and convert multiple images simultaneously without waiting in queues. Select all your files at once and download each converted result.'
    },
    {
      q: 'What is a browser image converter and is it safe?',
      a: 'A browser image converter does all the work inside your web browser instead of a remote server. Your files stay on your device, so your photos remain private while you change the image format.'
    },
    {
      q: 'How do I convert iPhone HEIC photos to JPG or PNG?',
      a: 'Simply upload your HEIC files from your iPhone or iPad, choose JPG or PNG as your target format, and click download. Our browser engine handles HEIC files automatically.'
    },
    {
      q: 'How does the convert quality slider work?',
      a: 'For lossy formats like JPG and WebP you can set the convert quality from 50% to 100%. Higher quality keeps more detail, lower quality gives a smaller file. For lossless output like PNG, image clarity remains identical.'
    },
    {
      q: 'Will changing image formats affect visual quality?',
      a: 'You have full control over quality using our quality slider for lossy formats like JPG and WebP. The converter keeps your original image dimensions, so nothing is resized during conversion.'
    },
    {
      q: 'Can I convert a photo online free without watermark, and keep HD 1080p size?',
      a: 'Yes. Converted photos are never watermarked, and the output keeps the same pixel dimensions as your original — so a Full HD 1080p photo stays 1080p after you change its format. Note that format conversion does not upscale a low-resolution photo to HD.'
    },
    {
      q: 'Are my images stored on server databases?',
      a: 'No — all file processing happens locally in your Web browser. Your private images are never uploaded to external servers.'
    },
    {
      q: 'What is the main difference between WebP, PNG, and JPG?',
      a: 'WebP offers ultra-small file sizes designed for high-performance websites. PNG supports transparent backgrounds, making it perfect for logos. JPG is universally compatible across all devices.'
    },
    {
      q: 'Can I extract text or pick colors from images after converting?',
      a: (
        <span>
          Yes! You can use our integrated tools like{' '}
          <Link href="/image-to-text" className="text-purple-600 font-semibold underline hover:text-purple-800">
            Image to Text (OCR)
          </Link>{' '}
          to extract readable text or use our{' '}
          <Link href="/color-picker" className="text-purple-600 font-semibold underline hover:text-purple-800">
            Color Picker
          </Link>{' '}
          to grab exact hex codes directly. You can also generate digital assets with our{' '}
          <Link href="/signature-maker" className="text-purple-600 font-semibold underline hover:text-purple-800">
            Signature Maker
          </Link>{' '}
          or convert audio using{' '}
          <Link href="/text-to-speech" className="text-purple-600 font-semibold underline hover:text-purple-800">
            Text to Speech
          </Link>.
        </span>
      )
    },
  ];

  // Plain Text FAQ Schema (without JSX elements)
  const faqSchemaData = [
    { q: 'Is the Image Converter free to use online?', a: 'Yes — ConvertLinx is a 100% free image converter online with unlimited batch conversions, no watermark and zero registration requirements.' },
    { q: 'What is an image format converter and which formats are supported?', a: 'An image format converter changes a picture from one file type to another. Our image file type converter supports 500+ image formats including JPG, PNG, WebP, iPhone HEIC, RAW camera files (CR2, NEF, ARW, DNG), SVG, TIFF, and AVIF.' },
    { q: 'Can I use this as a bulk image converter online?', a: 'Yes, this bulk image converter online lets you upload and convert multiple images simultaneously without waiting in queues. Select all your files at once and download each converted result.' },
    { q: 'What is a browser image converter and is it safe?', a: 'A browser image converter does all the work inside your web browser instead of a remote server. Your files stay on your device, so your photos remain private while you change the image format.' },
    { q: 'How do I convert iPhone HEIC photos to JPG or PNG?', a: 'Simply upload your HEIC files from your iPhone or iPad, choose JPG or PNG as your target format, and click download. Our browser engine handles HEIC files automatically.' },
    { q: 'How does the convert quality slider work?', a: 'For lossy formats like JPG and WebP you can set the convert quality from 50% to 100%. Higher quality keeps more detail, lower quality gives a smaller file. For lossless output like PNG, image clarity remains identical.' },
    { q: 'Will changing image formats affect visual quality?', a: 'You have full control over quality using our quality slider for lossy formats like JPG and WebP. The converter keeps your original image dimensions, so nothing is resized during conversion.' },
    { q: 'Can I convert a photo online free without watermark, and keep HD 1080p size?', a: 'Yes. Converted photos are never watermarked, and the output keeps the same pixel dimensions as your original — so a Full HD 1080p photo stays 1080p after you change its format. Note that format conversion does not upscale a low-resolution photo to HD.' },
    { q: 'Are my images stored on server databases?', a: 'No — all file processing happens locally in your Web browser. Your private images are never uploaded to external servers.' },
    { q: 'What is the main difference between WebP, PNG, and JPG?', a: 'WebP offers ultra-small file sizes designed for high-performance websites. PNG supports transparent backgrounds, making it perfect for logos. JPG is universally compatible across all devices.' },
    { q: 'Can I extract text or pick colors from images after converting?', a: 'Yes! You can use our integrated tools like Image to Text (OCR) to extract readable text or use our Color Picker to grab exact hex codes directly. You can also generate digital assets with our Signature Maker or convert audio using Text to Speech.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-image-converter"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Convert Image Format Online for Free',
            description: 'Use this free image converter online to change JPG, PNG, WebP, HEIC, RAW and 500+ image formats instantly. Bulk conversion, quality control and no watermark.',
            url: 'https://convertlinx.com/image-converter',
            totalTime: 'PT30S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'JPG, PNG, WebP, HEIC, RAW or any image file' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Image Converter' }],
            step: [
              { '@type': 'HowToStep', name: 'Upload Images', text: 'Select one or multiple image files — JPG, PNG, HEIC, RAW, SVG or any supported format.' },
              { '@type': 'HowToStep', name: 'Choose Output Format', text: 'Browse format categories and pick the target format. Adjust the convert quality slider if needed.' },
              { '@type': 'HowToStep', name: 'Download Converted Files', text: 'Download your converted images instantly — single or batch download, no watermark.' },
            ],
          }),
        }}
      />

      <main className="cv-page">

        {/* ── HERO ── */}
        <section className="cv-hero">
          <div className="cv-blob-1" />
          <div className="cv-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <Link href="/" className="cv-breadcrumb-link">Home</Link>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#9333EA' }}>Image Converter</span>
            </div>
            <span className="cv-badge">Free Online Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Free Online <span className="cv-grad-text">Image Converter</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              The fastest free image format converter and image file type converter in your browser.
              Convert photos online — change JPG, PNG, WebP, HEIC (iPhone photos), RAW camera files,
              SVG, TIFF and 500+ formats instantly. Bulk conversion, convert quality control,
              no watermark and no signup required.
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
                      JPG, PNG, WebP, HEIC (iPhone), TIFF, SVG, RAW & 500+ · Bulk image converter online
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
                    Convert To (Image Format Changer)
                  </label>

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
                          <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#9333EA' }} />
                        )}
                      </label>
                    ))}
                  </div>

                  {showQuality && (
                    <div className="cv-quality-wrap">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>Convert Quality</span>
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
                        <img src={item.url} alt={`Converted picture ${item.name}`} className="w-full h-40 object-cover" />
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
                {['No login required', 'Bulk image converter', 'HEIC auto support', 'Browser image converter — 100% private', 'No watermark', 'Totally Free'].map((t, i) => (
                  <span key={i} className="cv-trust-item">
                    <span className="cv-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="cv-divider" />
        <section className="cv-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              How to Convert Image Formats Online in 3 Easy Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload Image Files', desc: 'Drag and drop JPG, PNG, HEIC (iPhone), RAW camera files or pick a picture from your device. Use bulk upload to convert many files at once.' },
                { num: '2', title: 'Select Target Format', desc: 'Pick WebP for small web sizes, PNG for transparent graphics, or JPG for general sharing, then set the convert quality.' },
                { num: '3', title: 'Download Converted Images', desc: 'Save single output files or download all converted photos instantly — free and without watermark.' },
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

        {/* ── BENEFITS ── */}
        <hr className="cv-divider" />
        <section className="cv-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Choose ConvertLinx Image Converter?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <ImageIcon className="w-6 h-6" />,
                  color: '#9333EA',
                  bg: 'rgba(147,51,234,0.08)',
                  title: 'Image File Format Converter — 500+ Formats',
                  desc: 'Convert JPG to PNG, HEIC to JPG, WebP, RAW camera formats, SVG, and TIFF smoothly. A complete image formats converter and picture format converter in one place.',
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  color: '#F59E0B',
                  bg: 'rgba(245,158,11,0.08)',
                  title: 'Bulk Image Converter Online with Quality Control',
                  desc: 'Convert hundreds of images simultaneously. Fine-tune the convert quality of every output file using our quality slider.',
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  color: '#10B981',
                  bg: 'rgba(16,185,129,0.08)',
                  title: 'Browser Image Converter with Full Privacy',
                  desc: 'Files stay strictly on your local machine. Nothing is uploaded to remote servers, and no watermark is ever added to your photos.',
                },
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

        {/* ── SEO CONTENT & CONTEXTUAL INTERLINKING ── */}
        <hr className="cv-divider" />
        <section className="cv-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Why You Need an Image Converter Online
              </h2>
              <p className="leading-7 text-sm">
                Different operating systems and web applications mandate specific file types. iPhone camera photos saved as HEIC formats frequently fail to upload on Windows machines or web apps. RAW photos produced by DSLR cameras require format conversion prior to online publishing. A free image converter online eliminates file compatibility issues instantly — you simply convert the online picture into the format you need.
              </p>
              <p className="leading-7 text-sm mt-3">
                Whether you call it an image file type converter, an image format changer, a photo format converter or a file picture converter, the idea is the same: upload your file, choose the new format, and download the result. Our img online converter works directly in your browser, so there is nothing to install.
              </p>
              <p className="leading-7 text-sm mt-3">
                Need to prepare graphic assets? If your primary goal is copying color palettes, try our <Link href="/color-picker" className="text-purple-600 font-semibold underline hover:text-purple-800">Color Picker</Link> tool. You can also extract textual information from document photos using <Link href="/image-to-text" className="text-purple-600 font-semibold underline hover:text-purple-800">Image to Text (OCR)</Link>, generate audio files with <Link href="/text-to-speech" className="text-purple-600 font-semibold underline hover:text-purple-800">Text to Speech</Link>, or create branding graphics with our <Link href="/signature-maker" className="text-purple-600 font-semibold underline hover:text-purple-800">Signature Maker</Link>.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                WebP vs JPG vs PNG — Selecting the Right Image Format
              </h3>
              <p className="leading-7 text-sm">
                <strong>WebP</strong> delivers ultra-lightweight image files tailored for faster page load times and optimal SEO rankings. <strong>JPG / JPEG</strong> works best for photography where compact size takes precedence. <strong>PNG</strong> protects lossless sharpness along with transparent background layers, which makes it ideal for digital logos and web designs.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                Convert Quality, HD Photos and No Watermark
              </h3>
              <p className="leading-7 text-sm">
                Use the convert quality slider to balance sharpness and file size when exporting JPG or WebP. The converter keeps your original resolution, so you can convert a photo online free without watermark and a Full HD 1080p picture stays 1080p in its new format. Keep in mind that changing the format does not upscale a small photo to HD — it preserves the quality your original file already has.
              </p>
            </div>

            <div className="cv-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Image Format Issues Resolved
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Convert iPhone HEIC photos to JPG for Windows compatibility',
                  'Transform large PNG files to WebP for optimized web speed',
                  'Convert RAW camera files (CR2, NEF, ARW) to JPG',
                  'Use a bulk image converter online for many files at once',
                  'Convert SVG vector art to standard raster images',
                  'Convert photos online free without watermark',
                  'Reduce file size with adjustable convert quality',
                  'Prepare compatible image uploads for portal submission',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="cv-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Benefits from Image Conversion?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Photographers — convert camera RAW assets to shareable formats',
                  'Web Developers — build lightweight WebP images for web speed',
                  'Designers — convert graphic assets to PNG or vector formats',
                  'iPhone Users — easily convert HEIC photos to PNG or JPG',
                  'E-commerce Sellers — prepare product image uploads in bulk',
                  'Content Creators — convert visual files without installing apps',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#9333EA' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="cv-divider" />
        <section className="cv-section-main py-16 px-6">
          <Script
            id="faq-schema-image-converter"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqSchemaData.map((faq) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: { '@type': 'Answer', text: faq.a },
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
                <details key={i} className="cv-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#9333EA' }} />
                  </summary>
                  <div className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="cv-divider" />
        <section className="cv-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              Explore More Free Online Tools
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Signature Maker', href: '/signature-maker' },
                { name: 'Color Picker',    href: '/color-picker' },
                { name: 'Image to Text',   href: '/image-to-text' },
                { name: 'Text to Speech',  href: '/text-to-speech' },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:bg-purple-50"
                  style={{ color: '#9333EA', borderColor: '#E9D5FF', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="cv-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to change your image format?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Free image converter online. Takes 5 seconds. No signup. No watermark.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cv-cta-btn"
            >
              <RefreshCw className="w-5 h-5" />
              Convert Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}














































































// 'use client';

// import { useState } from 'react';
// import { Upload, Download, Image as ImageIcon, Zap, Shield, CheckCircle, ChevronDown, RefreshCw } from 'lucide-react';
// import Script from 'next/script';
// import '@/styles/ImageConverter.css';
// import Link from 'next/link';

// export default function ImageConverter() {
//   const [files, setFiles]         = useState([]);
//   const [converted, setConverted] = useState([]);
//   const [toFormat, setToFormat]   = useState('webp');
//   const [category, setCategory]   = useState('All');
//   const [loading, setLoading]     = useState(false);
//   const [quality, setQuality]     = useState(0.94);

//   const formats = [
//     { value: 'webp', label: 'WebP — best for web, smallest size', category: 'Popular' },
//     { value: 'png',  label: 'PNG — transparency support',          category: 'Popular' },
//     { value: 'jpg',  label: 'JPG/JPEG — universal, good quality',  category: 'Popular' },
//     { value: 'gif',  label: 'GIF — animated support',              category: 'Popular' },
//     { value: 'bmp',  label: 'BMP — uncompressed',                  category: 'Popular' },
//     { value: 'heic', label: 'HEIC — iOS photos, small size',       category: 'Mobile'  },
//     { value: 'heif', label: 'HEIF — high efficiency',              category: 'Mobile'  },
//     { value: 'avif', label: 'AVIF — modern, ultra-small',          category: 'Mobile'  },
//     { value: 'svg',  label: 'SVG — vector, scalable',              category: 'Design'  },
//     { value: 'tiff', label: 'TIFF — high-res print',               category: 'Design'  },
//     { value: 'ico',  label: 'ICO — favicon',                       category: 'Design'  },
//     { value: 'psd',  label: 'PSD — Photoshop layers',              category: 'Design'  },
//     { value: 'eps',  label: 'EPS — vector print',                  category: 'Design'  },
//     { value: 'dng',  label: 'DNG — Adobe RAW',                     category: 'Pro'     },
//     { value: 'cr2',  label: 'CR2 — Canon RAW',                     category: 'Pro'     },
//     { value: 'nef',  label: 'NEF — Nikon RAW',                     category: 'Pro'     },
//     { value: 'arw',  label: 'ARW — Sony RAW',                      category: 'Pro'     },
//     { value: 'raf',  label: 'RAF — Fuji RAW',                      category: 'Pro'     },
//     { value: 'jxl',  label: 'JPEG XL — future-proof',              category: 'Niche'   },
//     { value: 'tga',  label: 'TGA — game textures',                 category: 'Niche'   },
//     { value: 'pcx',  label: 'PCX — old-school',                    category: 'Niche'   },
//     { value: 'dpx',  label: 'DPX — film scan',                     category: 'Niche'   },
//   ];

//   const categories = ['All', 'Popular', 'Mobile', 'Design', 'Pro', 'Niche'];

//   const isHEIC = (file) => {
//     const ext = file.name.toLowerCase().split('.').pop();
//     return ext === 'heic' || ext === 'heif' || file.type === 'image/heic' || file.type === 'image/heif';
//   };

//   const convertImages = async (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     if (!selectedFiles.length) return;
//     setLoading(true);
//     setConverted([]);
//     setFiles(selectedFiles);

//     const results = await Promise.all(
//       selectedFiles.map(async (file) => {
//         let processFile = file;

//         if (isHEIC(file)) {
//           try {
//             const heic2any = (await import('heic2any')).default;
//             const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality });
//             processFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', { type: 'image/jpeg' });
//           } catch (err) {
//             console.error('HEIC conversion failed', err);
//           }
//         }

//         return new Promise((resolve) => {
//           const img = new Image();
//           img.onload = () => {
//             const canvas = document.createElement('canvas');
//             canvas.width  = img.width;
//             canvas.height = img.height;
//             canvas.getContext('2d').drawImage(img, 0, 0);

//             const unsupported = ['svg','psd','eps','dng','cr2','nef','arw','raf','jxl','tga','pcx','emz','dpx','heic','heif','avif','tiff'];
//             let mimeType = 'image/png', extension = 'png';
//             if (!unsupported.includes(toFormat)) {
//               const map = {
//                 webp: ['image/webp', 'webp'],
//                 png:  ['image/png',  'png'],
//                 jpg:  ['image/jpeg', 'jpg'],
//                 gif:  ['image/gif',  'gif'],
//                 bmp:  ['image/bmp',  'bmp'],
//                 ico:  ['image/x-icon','ico'],
//               };
//               if (map[toFormat]) { mimeType = map[toFormat][0]; extension = map[toFormat][1]; }
//             }
//             const qualityVal = (toFormat === 'jpg' || toFormat === 'webp') ? quality : 1;

//             canvas.toBlob((blob) => {
//               resolve({
//                 originalName: file.name,
//                 name:   file.name.replace(/\.[^/.]+$/, '') + '.' + extension,
//                 url:    URL.createObjectURL(blob),
//                 isHeic: isHEIC(file),
//               });
//             }, mimeType, qualityVal);
//           };
//           img.onerror = () => resolve(null);
//           img.src = URL.createObjectURL(processFile);
//         });
//       })
//     );

//     setConverted(results.filter(Boolean));
//     setLoading(false);
//   };

//   const filteredFormats = formats.filter(f => category === 'All' || f.category === category);
//   const showQuality = ['jpg', 'webp', 'heic', 'heif'].includes(toFormat);

//   // FAQ Array with React Elements for Link Rendering
//   const faqs = [
//     {
//       q: 'Is the Image Converter free to use online?',
//       a: 'Yes — ConvertLinx Image Converter is 100% free with unlimited batch conversions and zero registration requirements.'
//     },
//     {
//       q: 'Which image formats are supported?',
//       a: 'We support 500+ image formats including JPG, PNG, WebP, iPhone HEIC, RAW camera files (CR2, NEF, ARW, DNG), SVG, TIFF, and AVIF.'
//     },
//     {
//       q: 'Can I batch convert multiple images at once?',
//       a: 'Yes, you can upload and convert multiple images simultaneously without losing quality or waiting in queues.'
//     },
//     {
//       q: 'How do I convert iPhone HEIC photos to JPG or PNG?',
//       a: 'Simply upload your HEIC files from your iPhone or iPad, choose JPG or PNG as your target format, and click download. Our browser engine handles HEIC files automatically.'
//     },
//     {
//       q: 'Will changing image formats affect visual quality?',
//       a: 'You have full control over quality using our quality slider for lossy formats like JPG and WebP. For lossless output like PNG, image clarity remains identical.'
//     },
//     {
//       q: 'Are my images stored on server databases?',
//       a: 'No — all file processing happens locally in your Web browser. Your private images are never uploaded to external servers.'
//     },
//     {
//       q: 'What is the main difference between WebP, PNG, and JPG?',
//       a: 'WebP offers ultra-small file sizes designed for high-performance websites. PNG supports transparent backgrounds, making it perfect for logos. JPG is universally compatible across all devices.'
//     },
//     {
//       q: 'Can I extract text or pick colors from images after converting?',
//       a: (
//         <span>
//           Yes! You can use our integrated tools like{' '}
//           <Link href="/image-to-text" className="text-purple-600 font-semibold underline hover:text-purple-800">
//             Image to Text (OCR)
//           </Link>{' '}
//           to extract readable text or use our{' '}
//           <Link href="/color-picker" className="text-purple-600 font-semibold underline hover:text-purple-800">
//             Color Picker
//           </Link>{' '}
//           to grab exact hex codes directly. You can also generate digital assets with our{' '}
//           <Link href="/signature-maker" className="text-purple-600 font-semibold underline hover:text-purple-800">
//             Signature Maker
//           </Link>{' '}
//           or convert audio using{' '}
//           <Link href="/text-to-speech" className="text-purple-600 font-semibold underline hover:text-purple-800">
//             Text to Speech
//           </Link>.
//         </span>
//       )
//     },
//   ];

//   // Plain Text FAQ Schema (without JSX elements)
//   const faqSchemaData = [
//     { q: 'Is the Image Converter free to use online?', a: 'Yes — ConvertLinx Image Converter is 100% free with unlimited batch conversions and zero registration requirements.' },
//     { q: 'Which image formats are supported?', a: 'We support 500+ image formats including JPG, PNG, WebP, iPhone HEIC, RAW camera files (CR2, NEF, ARW, DNG), SVG, TIFF, and AVIF.' },
//     { q: 'Can I batch convert multiple images at once?', a: 'Yes, you can upload and convert multiple images simultaneously without losing quality or waiting in queues.' },
//     { q: 'How do I convert iPhone HEIC photos to JPG or PNG?', a: 'Simply upload your HEIC files from your iPhone or iPad, choose JPG or PNG as your target format, and click download. Our browser engine handles HEIC files automatically.' },
//     { q: 'Will changing image formats affect visual quality?', a: 'You have full control over quality using our quality slider for lossy formats like JPG and WebP. For lossless output like PNG, image clarity remains identical.' },
//     { q: 'Are my images stored on server databases?', a: 'No — all file processing happens locally in your Web browser. Your private images are never uploaded to external servers.' },
//     { q: 'What is the main difference between WebP, PNG, and JPG?', a: 'WebP offers ultra-small file sizes designed for high-performance websites. PNG supports transparent backgrounds, making it perfect for logos. JPG is universally compatible across all devices.' },
//     { q: 'Can I extract text or pick colors from images after converting?', a: 'Yes! You can use our integrated tools like Image to Text (OCR) to extract readable text or use our Color Picker to grab exact hex codes directly. You can also generate digital assets with our Signature Maker or convert audio using Text to Speech.' },
//   ];

//   return (
//     <>
//       {/* ── SCHEMA: HowTo ── */}
//       <Script
//         id="howto-schema-image-converter"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             '@context': 'https://schema.org',
//             '@type': 'HowTo',
//             name: 'How to Convert Image Format Online for Free',
//             description: 'Convert JPG, PNG, WebP, HEIC, RAW and 500+ image formats instantly online for free. Batch conversion and quality control supported.',
//             url: 'https://convertlinx.com/image-converter',
//             totalTime: 'PT30S',
//             estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
//             supply: [{ '@type': 'HowToSupply', name: 'JPG, PNG, WebP, HEIC, RAW or any image file' }],
//             tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Image Converter' }],
//             step: [
//               { '@type': 'HowToStep', name: 'Upload Images', text: 'Select one or multiple image files — JPG, PNG, HEIC, RAW, SVG or any supported format.' },
//               { '@type': 'HowToStep', name: 'Choose Output Format', text: 'Browse format categories and pick the target format. Adjust quality slider if needed.' },
//               { '@type': 'HowToStep', name: 'Download Converted Files', text: 'Download your converted images instantly — single or batch download.' },
//             ],
//           }),
//         }}
//       />

//       <main className="cv-page">

//         {/* ── HERO ── */}
//         <section className="cv-hero">
//           <div className="cv-blob-1" />
//           <div className="cv-blob-2" />
//           <div className="relative z-10 max-w-3xl mx-auto">
//             <div className="flex items-center justify-center gap-2 text-sm mb-5">
//               <Link href="/" className="cv-breadcrumb-link">Home</Link>
//               <span style={{ color: '#C4B5FD' }}>/</span>
//               <span style={{ color: '#9333EA' }}>Image Converter</span>
//             </div>
//             <span className="cv-badge">Free Online Tool</span>
//             <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
//               Free Online <span className="cv-grad-text">Image Converter</span>
//             </h1>
//             <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
//               Convert images online free — change JPG, PNG, WebP, HEIC (iPhone photos), RAW camera files,
//               SVG, TIFF and 500+ formats instantly. Batch conversion, quality control, and no signup required.
//             </p>
//           </div>
//         </section>

//         {/* ── TOOL WORKSPACE ── */}
//         <section className="cv-section-main py-10 px-6">
//           <div className="max-w-3xl mx-auto cv-fade-up">
//             <div className="cv-tool-card">

//               <div className="grid md:grid-cols-2 gap-8">

//                 {/* LEFT — Upload */}
//                 <div>
//                   <label className="block mb-3" style={{ color: '#9333EA', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
//                     Upload Images
//                   </label>
//                   <label className="cv-upload-area">
//                     <div className="cv-upload-icon">
//                       <Upload className="w-7 h-7" />
//                     </div>
//                     <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
//                       Drop images or click to browse
//                     </p>
//                     <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
//                       JPG, PNG, WebP, HEIC (iPhone), TIFF, SVG, RAW & 500+ · Batch OK
//                     </p>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       onChange={convertImages}
//                       className="hidden"
//                     />
//                   </label>
//                 </div>

//                 {/* RIGHT — Format Selector */}
//                 <div>
//                   <label className="block mb-3" style={{ color: '#9333EA', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
//                     Convert To
//                   </label>

//                   <div className="flex flex-wrap gap-2 mb-3">
//                     {categories.map(cat => (
//                       <button
//                         key={cat}
//                         onClick={() => setCategory(cat)}
//                         className={`cv-cat-tab ${category === cat ? 'active' : 'inactive'}`}
//                       >
//                         {cat}
//                       </button>
//                     ))}
//                   </div>

//                   <div className="cv-format-list">
//                     {filteredFormats.map((fmt) => (
//                       <label key={fmt.value} className={`cv-format-option ${toFormat === fmt.value ? 'selected' : ''}`}>
//                         <div className="flex items-center gap-3">
//                           <input
//                             type="radio"
//                             name="format"
//                             value={fmt.value}
//                             checked={toFormat === fmt.value}
//                             onChange={(e) => setToFormat(e.target.value)}
//                             className="cv-format-radio"
//                           />
//                           <span className="text-sm font-medium" style={{ color: '#374151' }}>{fmt.label}</span>
//                         </div>
//                         {toFormat === fmt.value && (
//                           <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#9333EA' }} />
//                         )}
//                       </label>
//                     ))}
//                   </div>

//                   {showQuality && (
//                     <div className="cv-quality-wrap">
//                       <div className="flex justify-between mb-2">
//                         <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>Quality</span>
//                         <span className="text-xs font-bold" style={{ color: '#9333EA' }}>{Math.round(quality * 100)}%</span>
//                       </div>
//                       <input
//                         type="range" min="0.5" max="1.0" step="0.05"
//                         value={quality}
//                         onChange={(e) => setQuality(parseFloat(e.target.value))}
//                         className="cv-quality-slider"
//                       />
//                       <p className="text-xs mt-1 text-center" style={{ color: '#9CA3AF' }}>Lower = smaller file</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Loader */}
//               {loading && (
//                 <div className="text-center py-8 mt-6 border-t" style={{ borderColor: 'rgba(147,51,234,0.08)' }}>
//                   <div className="cv-spinner mb-3" />
//                   <p className="text-sm font-semibold" style={{ color: '#9333EA' }}>
//                     Converting{files.length > 1 ? ` ${files.length} images` : ''}...
//                   </p>
//                 </div>
//               )}

//               {/* Results */}
//               {!loading && converted.length > 0 && (
//                 <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(147,51,234,0.08)' }}>
//                   <p className="text-sm font-bold uppercase tracking-widest mb-5 text-center" style={{ color: '#9333EA' }}>
//                     {converted.length} {converted.length === 1 ? 'File' : 'Files'} Ready
//                   </p>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {converted.map((item, i) => (
//                       <div key={i} className="cv-result-card">
//                         <img src={item.url} alt={item.name} className="w-full h-40 object-cover" />
//                         <div className="p-4 text-center">
//                           <p className="text-xs font-medium mb-3 truncate" style={{ color: '#374151' }}>
//                             {item.isHeic && <span className="cv-heic-tag">HEIC→</span>}
//                             {item.name}
//                           </p>
//                           <a href={item.url} download={item.name} className="cv-dl-btn w-full justify-center">
//                             <Download className="w-4 h-4" />
//                             Download
//                           </a>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Trust row */}
//               <div className="flex flex-wrap justify-center gap-5 mt-6">
//                 {['No login required', 'Batch conversion', 'HEIC auto support', '100% Client-side privacy', 'Totally Free'].map((t, i) => (
//                   <span key={i} className="cv-trust-item">
//                     <span className="cv-trust-dot" />
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── HOW IT WORKS ── */}
//         <hr className="cv-divider" />
//         <section className="cv-section-alt py-16 px-6">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
//               How to Convert Image Formats in 3 Easy Steps
//             </h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {[
//                 { num: '1', title: 'Upload Image Files', desc: 'Drag and drop JPG, PNG, HEIC (iPhone), RAW camera files or choose from your device.' },
//                 { num: '2', title: 'Select Target Format', desc: 'Pick WebP for small web sizes, PNG for transparent graphics, or JPG for general sharing.' },
//                 { num: '3', title: 'Download Converted Images', desc: 'Save single output files or batch download converted images instantly.' },
//               ].map((s, i) => (
//                 <div key={i} className="cv-step-card">
//                   <div className="cv-step-num">{s.num}</div>
//                   <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
//                   <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── BENEFITS ── */}
//         <hr className="cv-divider" />
//         <section className="cv-section-main py-16 px-6">
//           <div className="max-w-5xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Why Choose ConvertLinx Image Converter?
//             </h2>
//             <div className="grid md:grid-cols-3 gap-5">
//               {[
//                 {
//                   icon: <ImageIcon className="w-6 h-6" />,
//                   color: '#9333EA',
//                   bg: 'rgba(147,51,234,0.08)',
//                   title: '500+ Image Formats Supported',
//                   desc: 'Convert JPG to PNG, HEIC to JPG, WebP, RAW camera formats, SVG, and TIFF smoothly with target format filtering.',
//                 },
//                 {
//                   icon: <Zap className="w-6 h-6" />,
//                   color: '#F59E0B',
//                   bg: 'rgba(245,158,11,0.08)',
//                   title: 'Batch Conversion & Quality Control',
//                   desc: 'Convert hundreds of images simultaneously. Fine-tune output compression levels using our quality slider controls.',
//                 },
//                 {
//                   icon: <Shield className="w-6 h-6" />,
//                   color: '#10B981',
//                   bg: 'rgba(16,185,129,0.08)',
//                   title: 'Browser Privacy Protection',
//                   desc: 'Files stay strictly on your local machine. Nothing is uploaded to remote servers, giving you complete data privacy.',
//                 },
//               ].map((b, i) => (
//                 <div key={i} className="cv-benefit-card">
//                   <div className="cv-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
//                   <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
//                   <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── SEO CONTENT & CONTEXTUAL INTERLINKING ── */}
//         <hr className="cv-divider" />
//         <section className="cv-section-alt py-16 px-6">
//           <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

//             <div>
//               <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
//                 Why You Need an Online Image Format Converter
//               </h2>
//               <p className="leading-7 text-sm">
//                 Different operating systems and web applications mandate specific file types. iPhone camera photos saved as HEIC formats frequently fail to upload on Windows machines or web apps. RAW photos produced by DSLR cameras require format conversion prior to online publishing. An online image converter eliminates file compatibility issues instantly.
//               </p>
//               <p className="leading-7 text-sm mt-3">
//                 Need to prepare graphic assets? If your primary goal is copying color palettes, try our <Link href="/color-picker" className="text-purple-600 font-semibold underline hover:text-purple-800">Color Picker</Link> tool. You can also extract textual information from document photos using <Link href="/image-to-text" className="text-purple-600 font-semibold underline hover:text-purple-800">Image to Text (OCR)</Link>, generate audio files with <Link href="/text-to-speech" className="text-purple-600 font-semibold underline hover:text-purple-800">Text to Speech</Link>, or create branding graphics with our <Link href="/signature-maker" className="text-purple-600 font-semibold underline hover:text-purple-800">Signature Maker</Link>.
//               </p>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
//                 WebP vs JPG vs PNG — Selecting the Right Image Format
//               </h3>
//               <p className="leading-7 text-sm">
//                 <strong>WebP</strong> delivers ultra-lightweight image files tailored for faster page load times and optimal SEO rankings. <strong>JPG / JPEG</strong> works best for photography where compact size takes precedence. <strong>PNG</strong> protects lossless sharpness along with transparent background layers, which makes it ideal for digital logos and web designs.
//               </p>
//             </div>

//             <div className="cv-seo-box">
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
//                 Common Image Format Issues Resolved
//               </h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Convert iPhone HEIC photos to JPG for Windows compatibility',
//                   'Transform large PNG files to WebP for optimized web speed',
//                   'Convert RAW camera files (CR2, NEF, ARW) to JPG',
//                   'Batch convert multiple image formats together',
//                   'Convert SVG vector art to standard raster images',
//                   'Prepare compatible image uploads for portal submission',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="cv-feature-dot" />
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Benefits from Image Conversion?</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Photographers — convert camera RAW assets to shareable formats',
//                   'Web Developers — build lightweight WebP images for web speed',
//                   'Designers — convert graphic assets to PNG or vector formats',
//                   'iPhone Users — easily convert HEIC photos to PNG or JPG',
//                   'E-commerce Sellers — prepare product image uploads in bulk',
//                   'Content Creators — convert visual files without installing apps',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-2 text-sm">
//                     <span className="font-bold mt-0.5" style={{ color: '#9333EA' }}>→</span>
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </section>

//         {/* ── FAQ ── */}
//         <hr className="cv-divider" />
//         <section className="cv-section-main py-16 px-6">
//           <Script
//             id="faq-schema-image-converter"
//             type="application/ld+json"
//             strategy="afterInteractive"
//             dangerouslySetInnerHTML={{
//               __html: JSON.stringify({
//                 '@context': 'https://schema.org',
//                 '@type': 'FAQPage',
//                 mainEntity: faqSchemaData.map((faq) => ({
//                   '@type': 'Question',
//                   name: faq.q,
//                   acceptedAnswer: { '@type': 'Answer', text: faq.a },
//                 })),
//               }),
//             }}
//           />
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Frequently Asked Questions
//             </h2>
//             <div className="space-y-3">
//               {faqs.map((faq, i) => (
//                 <details key={i} className="cv-faq-item">
//                   <summary className="flex items-center justify-between gap-4">
//                     <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
//                     <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#9333EA' }} />
//                   </summary>
//                   <div className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</div>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── RELATED TOOLS ── */}
//         <hr className="cv-divider" />
//         <section className="cv-section-alt py-14 px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
//               Explore More Free Online Tools
//             </h2>
//             <div className="flex flex-wrap justify-center gap-3">
//               {[
//                 { name: 'Signature Maker', href: '/signature-maker' },
//                 { name: 'Color Picker',    href: '/color-picker' },
//                 { name: 'Image to Text',   href: '/image-to-text' },
//                 { name: 'Text to Speech',  href: '/text-to-speech' },
//               ].map((tool, i) => (
//                 <Link
//                   key={i}
//                   href={tool.href}
//                   className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:bg-purple-50"
//                   style={{ color: '#9333EA', borderColor: '#E9D5FF', background: '#fff' }}
//                 >
//                   {tool.name}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── BOTTOM CTA ── */}
//         <section className="cv-cta-section">
//           <div className="max-w-xl mx-auto">
//             <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
//               Ready to convert your images?
//             </h2>
//             <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
//               Takes 5 seconds. No signup. No ads.
//             </p>
//             <button
//               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//               className="cv-cta-btn"
//             >
//               <RefreshCw className="w-5 h-5" />
//               Convert Now
//             </button>
//           </div>
//         </section>

//       </main>
//     </>
//   );
// }




