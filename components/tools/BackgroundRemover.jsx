'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Download, Scissors, Zap, Shield, CheckCircle, ChevronDown, Eraser } from 'lucide-react';
import Script from 'next/script';
import '@/styles/BackgroundRemover.css';
import Link from 'next/link';

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────

// Output backgrounds
const BG_OPTIONS = [
  { id: 'transparent', label: 'Transparent', color: null },
  { id: 'white',       label: 'White',       color: '#FFFFFF' },
  { id: 'black',       label: 'Black',       color: '#000000' },
  { id: 'blue',        label: 'Passport blue', color: '#2B6CB0' },
  { id: 'red',         label: 'Red',         color: '#DC2626' },
  { id: 'custom',      label: 'Custom',      color: null },
];

const OUTPUT_FORMATS = [
  { value: 'png',  label: 'PNG — keeps transparency', mime: 'image/png'  },
  { value: 'webp', label: 'WebP — smaller file',      mime: 'image/webp' },
  { value: 'jpg',  label: 'JPG — needs solid color',  mime: 'image/jpeg' },
];

// "fast" = smallest model, "quality" = better edges (hair, fur)
const MODELS = {
  fast:    'isnet_quint8',
  quality: 'isnet_fp16',
};

const ACCEPT_TYPES = 'image/png,image/jpeg,image/webp,.heic,.heif';
const MAX_FILES = 20;

const linkCls = 'text-purple-600 font-semibold underline hover:text-purple-800';


// ⬇️ YE NAYA PASTE KAREIN
const downscale = (file, max = 1280) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      if (s === 1) { URL.revokeObjectURL(url); resolve(file); return; }
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      c.toBlob((b) => { URL.revokeObjectURL(url); resolve(b || file); }, 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });


export default function BackgroundRemover() {
  const [items, setItems]         = useState([]);   // { id, name, originalUrl, cutBlob, cutUrl, status }
  const [busy, setBusy]           = useState(false);
  const [modelPct, setModelPct]   = useState(null); // model download progress (first run only)
  const [bgId, setBgId]           = useState('transparent');
  const [customColor, setCustomColor] = useState('#9333EA');
  const [outFormat, setOutFormat] = useState('png');
  // const [mode, setMode]           = useState('quality');
  const [error, setError]         = useState('');
  const [mode, setMode]           = useState('fast');
  const itemsRef = useRef([]);
  itemsRef.current = items;

  // free object URLs when leaving the page
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((it) => {
        if (it.originalUrl) URL.revokeObjectURL(it.originalUrl);
        if (it.cutUrl) URL.revokeObjectURL(it.cutUrl);
      });
    };
  }, []);

  const isHEIC = (file) => {
    const ext = file.name.toLowerCase().split('.').pop();
    return ext === 'heic' || ext === 'heif' || file.type === 'image/heic' || file.type === 'image/heif';
  };

  const activeBg = () => {
    if (bgId === 'transparent') return null;
    if (bgId === 'custom') return customColor;
    return BG_OPTIONS.find((b) => b.id === bgId)?.color || null;
  };

  const patchItem = (id, patch) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  // ── main handler ──
  const handleFiles = async (e) => {
    const selected = Array.from(e.target.files || []).slice(0, MAX_FILES);
    e.target.value = '';
    if (!selected.length) return;

    setError('');
    setBusy(true);

    // clear previous results
    items.forEach((it) => {
      if (it.originalUrl) URL.revokeObjectURL(it.originalUrl);
      if (it.cutUrl) URL.revokeObjectURL(it.cutUrl);
    });

    const fresh = selected.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file,
      name: file.name,
      originalUrl: URL.createObjectURL(file),
      cutBlob: null,
      cutUrl: null,
      status: 'waiting',
    }));
    setItems(fresh);

    let removeBackground;
    try {
      // heavy library: loaded only when the user actually uses the tool
      ({ removeBackground } = await import(
        /* webpackIgnore: true */
        'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.5/+esm'
      ));
    } catch (err) {
      console.error(err);
      setError('Could not load the background remover. Please refresh the page and try again.');
      setBusy(false);
      return;
    }

    // process one by one (parallel runs crash low-memory phones)
    for (const it of fresh) {
      patchItem(it.id, { status: 'processing' });
      try {

          let input = it.file;
          if (isHEIC(it.file)) {
            const heic2any = (await import('heic2any')).default;
            const jpg = await heic2any({ blob: it.file, toType: 'image/jpeg', quality: 0.95 });
            input = Array.isArray(jpg) ? jpg[0] : jpg;
          }

          input = await downscale(input);   // ⬅️ NAYI LINE (3)

          const blob = await removeBackground(input, {
            model: MODELS[mode],
            device: 'gpu',                  // ⬅️ NAYI LINE (4)
            output: { format: 'image/png' },
            progress: (key, current, total) => {
              if (typeof key === 'string' && key.startsWith('fetch') && total) {
                setModelPct(Math.round((current / total) * 100));
              }
            },
          });

        // let input = it.file;
        // if (isHEIC(it.file)) {
        //   const heic2any = (await import('heic2any')).default;
        //   const jpg = await heic2any({ blob: it.file, toType: 'image/jpeg', quality: 0.95 });
        //   input = Array.isArray(jpg) ? jpg[0] : jpg;
        // }

        // const blob = await removeBackground(input, {
        //   model: MODELS[mode],
        //   output: { format: 'image/png' },
        //   progress: (key, current, total) => {
        //     if (typeof key === 'string' && key.startsWith('fetch') && total) {
        //       setModelPct(Math.round((current / total) * 100));
        //     }
        //   },
        // });

        setModelPct(null);
        patchItem(it.id, { status: 'done', cutBlob: blob, cutUrl: URL.createObjectURL(blob) });
      } catch (err) {
        console.error('Background removal failed', err);
        setModelPct(null);
        patchItem(it.id, { status: 'error' });
      }
    }
    setBusy(false);
  };

  // ── build final file (applies chosen background + format) ──
  const buildOutput = (item) =>
    new Promise((resolve) => {
      const color = activeBg();
      const fmt = OUTPUT_FORMATS.find((f) => f.value === outFormat) || OUTPUT_FORMATS[0];

      // fast path: transparent PNG straight from the model
      if (!color && fmt.value === 'png') {
        resolve({ blob: item.cutBlob, ext: 'png' });
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        // JPG cannot be transparent → fall back to white
        const fill = color || (fmt.value === 'jpg' ? '#FFFFFF' : null);
        if (fill) {
          ctx.fillStyle = fill;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => resolve({ blob, ext: fmt.value }),
          fmt.mime,
          fmt.value === 'png' ? undefined : 0.95
        );
      };
      img.onerror = () => resolve(null);
      img.src = item.cutUrl;
    });

  const saveBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const downloadOne = async (item) => {
    const out = await buildOutput(item);
    if (!out || !out.blob) return;
    saveBlob(out.blob, item.name.replace(/\.[^/.]+$/, '') + '-no-bg.' + out.ext);
  };

  const downloadAll = async () => {
    const ready = items.filter((it) => it.status === 'done');
    for (let i = 0; i < ready.length; i++) {
      await downloadOne(ready[i]);
      await new Promise((r) => setTimeout(r, 350));
    }
  };

  const doneCount = items.filter((it) => it.status === 'done').length;
  const color = activeBg();
  const previewStyle = color ? { background: color } : undefined;

  // ─────────────────────────────────────────────
  // FAQ: `text` = plain text for schema, `a` = optional JSX shown on page
  // ─────────────────────────────────────────────
  const faqs = [
    {
      q: 'Is this background remover free?',
      text: 'Yes. ConvertLinx Background Remover is free to use online with no signup, no watermark and no daily limit on how many images you process.',
    },
    {
      q: 'How do I remove the background from an image online?',
      text: 'Upload your photo, wait a few seconds while the AI cuts out the subject, choose a transparent or colored background and click download. The whole process takes place in your browser.',
    },
    {
      q: 'Are my photos uploaded to a server?',
      text: 'No. Your photos are processed locally in your browser, so they are never sent to our servers. The AI model itself is downloaded once to your browser the first time you use the tool and is cached for later visits.',
    },
    {
      q: 'Why does the first image take longer?',
      text: 'On your first use the browser downloads the AI model, which is a few dozen megabytes. After that the model is cached, so the next images are processed much faster.',
    },
    {
      q: 'How do I make a background transparent (transparent PNG)?',
      text: 'Keep the background option on Transparent and the output format on PNG. The downloaded file is a PNG cutout with a transparent background that you can place on any design, website or presentation.',
    },
    {
      q: 'Can I remove the background from a signature?',
      text: 'Yes. Upload a clear photo or scan of your signature on white paper to get a transparent PNG signature that you can place on PDFs and documents. For best results use good lighting and dark ink.',
      a: (
        <span>
          Yes. Upload a clear photo or scan of your signature on white paper to get a transparent PNG signature that you can place on PDFs and documents. For best results use good lighting and dark ink. You can also create a new one from scratch with our{' '}
          <Link href="/signature-maker" className={linkCls}>Signature Maker</Link>.
        </span>
      ),
    },
    {
      q: 'Can I change the background color instead of making it transparent?',
      text: 'Yes. Choose white, black, passport blue, red or any custom color. This is useful for ID photos, product listings and profile pictures that need a solid background.',
    },
    {
      q: 'Which image formats can I upload and download?',
      text: 'You can upload JPG, PNG, WebP and iPhone HEIC photos. You can download the result as PNG with transparency, WebP, or JPG with a solid background color.',
    },
    {
      q: 'What is the difference between Fast and High quality mode?',
      text: 'Fast mode uses a smaller AI model that is quicker and lighter on older phones. High quality mode uses a larger model that usually gives cleaner edges around hair, fur and fine details.',
    },
    {
      q: 'Can I remove the background from many images at once?',
      text: `Yes. You can select up to ${MAX_FILES} images at once. They are processed one after another to keep your browser fast, and you can download them individually or with Download All.`,
    },
    {
      q: 'Does the image quality or size change?',
      text: 'The cutout keeps the resolution of your original photo for the subject. Changing the output format or using a solid background does not resize the image.',
    },
    {
      q: 'Which photos give the best result?',
      text: 'Photos where the subject is clearly separated from the background, with good lighting and sharp focus, give the cleanest cutouts. Very busy backgrounds or subjects with the same color as the background can leave rough edges.',
    },
    {
      q: 'Can I reduce the size of the PNG or convert it afterwards?',
      text: 'Yes. Transparent PNG files can be large, so you can convert them to WebP or compress them with our other tools after removing the background.',
      a: (
        <span>
          Yes. Transparent PNG files can be large, so you can convert them to WebP with our{' '}
          <Link href="/image-converter" className={linkCls}>Image Converter</Link>{' '}
          or reduce the size with the{' '}
          <Link href="/image-compressor" className={linkCls}>Image Compressor</Link>{' '}
          after removing the background.
        </span>
      ),
    },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-background-remover"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Remove Background from an Image Online for Free',
            description: 'Remove the background from any photo in seconds, get a transparent PNG or add a solid color background. Free, no signup, no watermark, works in your browser.',
            url: 'https://convertlinx.com/background-remover',
            totalTime: 'PT20S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'JPG, PNG, WebP or HEIC photo' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Background Remover' }],
            step: [
              { '@type': 'HowToStep', name: 'Upload your photo', text: 'Select one or more JPG, PNG, WebP or HEIC images from your device.' },
              { '@type': 'HowToStep', name: 'Let the AI remove the background', text: 'The AI detects the subject and cuts out the background automatically inside your browser.' },
              { '@type': 'HowToStep', name: 'Pick a background and download', text: 'Keep it transparent or choose a solid color, select PNG, WebP or JPG and download the result.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: WebApplication ── */}
      <Script
        id="app-schema-background-remover"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'ConvertLinx Background Remover',
            url: 'https://convertlinx.com/background-remover',
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Any (web browser)',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />

      <main className="br-page">

        {/* ── HERO ── */}
        <section className="br-hero">
          <div className="br-blob-1" />
          <div className="br-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <Link href="/" className="br-breadcrumb-link">Home</Link>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#9333EA' }}>Background Remover</span>
            </div>
            <span className="br-badge">Free Online Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Free <span className="br-grad-text">Background Remover</span> — Remove Background from Image Online
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Remove the background from any photo in seconds and get a transparent PNG, or swap in a white,
              blue or custom color background. Works with JPG, PNG, WebP and iPhone HEIC photos. Bulk
              processing, no watermark, no signup. Your photos stay in your browser and are never uploaded.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="br-section-main py-10 px-6">
          <div className="max-w-4xl mx-auto br-fade-up">
            <div className="br-tool-card">

              <div className="grid md:grid-cols-2 gap-8">

                {/* LEFT — Upload */}
                <div>
                  <label className="br-label">Upload Images</label>
                  <label className="br-upload-area">
                    <div className="br-upload-icon">
                      <Upload className="w-7 h-7" />
                    </div>
                    <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
                      Drop images or click to browse
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                      JPG, PNG, WebP, HEIC · up to {MAX_FILES} images at once
                    </p>
                    <input
                      type="file"
                      accept={ACCEPT_TYPES}
                      multiple
                      onChange={handleFiles}
                      disabled={busy}
                      className="hidden"
                    />
                  </label>

                  <div className="mt-5">
                    <label className="br-label">Quality Mode</label>
                    <div className="flex gap-2">
                      {[
                        { id: 'quality', name: 'High quality' },
                        { id: 'fast',    name: 'Fast' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMode(m.id)}
                          disabled={busy}
                          className={`br-chip ${mode === m.id ? 'active' : 'inactive'}`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT — Background + format */}
                <div>
                  <label className="br-label">Background</label>
                  <div className="br-swatches">
                    {BG_OPTIONS.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setBgId(b.id)}
                        className={`br-swatch ${bgId === b.id ? 'selected' : ''}`}
                        title={b.label}
                        aria-label={b.label}
                        aria-pressed={bgId === b.id}
                      >
                        <span
                          className={`br-swatch-dot ${b.id === 'transparent' ? 'checker' : ''}`}
                          style={
                            b.id === 'custom'
                              ? { background: customColor }
                              : b.color ? { background: b.color } : undefined
                          }
                        />
                        <span className="br-swatch-name">{b.label}</span>
                      </button>
                    ))}
                  </div>

                  {bgId === 'custom' && (
                    <div className="flex items-center gap-3 mt-3">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="br-color-input"
                        aria-label="Custom background color"
                      />
                      <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>{customColor.toUpperCase()}</span>
                    </div>
                  )}

                  <label className="br-label mt-6">Download As</label>
                  <div className="br-format-list">
                    {OUTPUT_FORMATS.map((f) => (
                      <label key={f.value} className={`br-format-option ${outFormat === f.value ? 'selected' : ''}`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="outformat"
                            value={f.value}
                            checked={outFormat === f.value}
                            onChange={(e) => setOutFormat(e.target.value)}
                            className="br-format-radio"
                          />
                          <span className="text-sm font-medium" style={{ color: '#374151' }}>{f.label}</span>
                        </div>
                        {outFormat === f.value && (
                          <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#9333EA' }} />
                        )}
                      </label>
                    ))}
                  </div>
                  {outFormat === 'jpg' && !color && (
                    <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
                      JPG cannot be transparent, so the background will be white.
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <p className="text-sm text-center mt-6" style={{ color: '#DC2626' }}>{error}</p>
              )}

              {/* Model download progress (first use only) */}
              {busy && modelPct !== null && modelPct < 100 && (
                <div className="mt-6 text-center">
                  <p className="text-sm font-semibold mb-2" style={{ color: '#9333EA' }}>
                    Downloading AI model (first time only)… {modelPct}%
                  </p>
                  <div className="br-progress"><div className="br-progress-bar" style={{ width: `${modelPct}%` }} /></div>
                  <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>This is saved in your browser, so next time it starts instantly.</p>
                </div>
              )}

              {/* Results */}
              {items.length > 0 && (
                <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(147,51,234,0.08)' }}>
                  <p className="text-sm font-bold uppercase tracking-widest mb-5 text-center" style={{ color: '#9333EA' }}>
                    {busy
                      ? `Processing ${doneCount} / ${items.length}`
                      : `${doneCount} ${doneCount === 1 ? 'Image' : 'Images'} Ready`}
                  </p>

                  {doneCount > 1 && !busy && (
                    <div className="flex justify-center mb-5">
                      <button onClick={downloadAll} className="br-dl-btn justify-center">
                        <Download className="w-4 h-4" />
                        Download All ({doneCount})
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map((item) => (
                      <div key={item.id} className="br-result-card">
                        <div className="br-compare">
                          <div className="br-compare-col">
                            <span className="br-compare-tag">Original</span>
                            <img src={item.originalUrl} alt={`Original photo ${item.name}`} className="br-compare-img" />
                          </div>
                          <div className="br-compare-col">
                            <span className="br-compare-tag">Result</span>
                            <div
                              className={`br-compare-img br-result-box ${!color ? 'checker' : ''}`}
                              style={previewStyle}
                            >
                              {item.status === 'done' && (
                                <img src={item.cutUrl} alt={`Background removed from ${item.name}`} className="br-cut-img" />
                              )}
                              {(item.status === 'processing' || item.status === 'waiting') && (
                                <div className="br-overlay">
                                  <div className="br-spinner" />
                                  <span className="text-xs font-semibold mt-2" style={{ color: '#9333EA' }}>
                                    {item.status === 'waiting' ? 'Waiting…' : 'Removing background…'}
                                  </span>
                                </div>
                              )}
                              {item.status === 'error' && (
                                <div className="br-overlay">
                                  <span className="text-xs font-semibold px-3 text-center" style={{ color: '#DC2626' }}>
                                    Could not process this image. Try a different photo.
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 text-center">
                          <p className="text-xs font-medium mb-3 truncate" style={{ color: '#374151' }}>{item.name}</p>
                          <button
                            onClick={() => downloadOne(item)}
                            disabled={item.status !== 'done'}
                            className="br-dl-btn w-full justify-center"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No login required', 'No watermark', 'Photos never uploaded', 'Transparent PNG', 'Bulk background remover', 'Totally Free'].map((t, i) => (
                  <span key={i} className="br-trust-item">
                    <span className="br-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="br-divider" />
        <section className="br-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              How to Remove Background from an Image in 3 Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload Your Photo', desc: 'Drag and drop a JPG, PNG, WebP or iPhone HEIC photo. You can select several images to remove backgrounds in bulk.' },
                { num: '2', title: 'AI Removes the Background', desc: 'The AI finds the person, product or object and erases everything behind it, right inside your browser.' },
                { num: '3', title: 'Pick Background and Download', desc: 'Keep it transparent for a PNG cutout, or add white, blue or any custom color, then download the file.' },
              ].map((s, i) => (
                <div key={i} className="br-step-card">
                  <div className="br-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="br-divider" />
        <section className="br-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx Background Remover?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Scissors className="w-6 h-6" />,
                  color: '#9333EA',
                  bg: 'rgba(147,51,234,0.08)',
                  title: 'AI Background Eraser, Clean Cutouts',
                  desc: 'Remove the background from people, products, logos and signatures and download a transparent PNG with no watermark.',
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  color: '#F59E0B',
                  bg: 'rgba(245,158,11,0.08)',
                  title: 'Bulk Background Remover, No Signup',
                  desc: 'Process up to 20 images in one go. Choose Fast mode for quick results or High quality mode for cleaner edges.',
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  color: '#10B981',
                  bg: 'rgba(16,185,129,0.08)',
                  title: 'Private, Runs in Your Browser',
                  desc: 'Your photos are processed on your own device and are never uploaded to a server, so personal pictures stay private.',
                },
              ].map((b, i) => (
                <div key={i} className="br-benefit-card">
                  <div className="br-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT & CONTEXTUAL INTERLINKING ── */}
        <hr className="br-divider" />
        <section className="br-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Free Online Background Remover for Photos, Products and Logos
              </h2>
              <p className="leading-7 text-sm">
                A background remover cuts out the main subject of a photo and deletes everything behind it. Instead of spending time with the lasso tool in an editor, you upload the picture, and the AI finds the edges for you. The result is a transparent PNG you can place on a website, a presentation, a poster or a product listing. People also search for this as a remove bg tool, an image background eraser, a photo cutout tool or a transparent background maker. They all mean the same thing, and this page does all of them for free.
              </p>
              <p className="leading-7 text-sm mt-3">
                Because it runs inside your browser, it works like a private background remover online: nothing is sent to a server. It also works on phones, so you can remove the background from a photo straight from your gallery, including iPhone HEIC pictures.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                Remove Background from Signature and Make a Transparent Signature PNG
              </h3>
              <p className="leading-7 text-sm">
                One of the most common uses is turning a signed piece of paper into a transparent signature. Sign on plain white paper with a dark pen, take a bright, flat photo, upload it here and download the PNG. You can then place your signature on a PDF, a contract or an email footer without a white box around it. If you would rather not sign on paper, our <Link href="/signature-maker" className={linkCls}>Signature Maker</Link> lets you draw or type a digital signature and download it as a transparent image.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                Make a Background Transparent, or Change It to White, Blue or Any Color
              </h3>
              <p className="leading-7 text-sm">
                Keep the background on Transparent and download as PNG to get a clean cutout. Need a solid color instead? Pick white for marketplace product photos, a blue or red background for ID and passport style pictures, or any custom color for profile photos and social posts. If you need the exact color code from another image or brand, grab it with the <Link href="/color-picker" className={linkCls}>Color Picker</Link> and paste it into the custom color field.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                After You Remove the Background: Resize, Convert and Compress
              </h3>
              <p className="leading-7 text-sm">
                Transparent PNG files can get large. Once your cutout is ready, you can switch it to WebP with the <Link href="/image-converter" className={linkCls}>Image Converter</Link>, shrink the file with the <Link href="/image-compressor" className={linkCls}>Image Compressor</Link>, set exact dimensions with the <Link href="/image-resizer" className={linkCls}>Image Resizer</Link>, or trim the empty space with the <Link href="/image-cropper" className={linkCls}>Image Cropper</Link>. To protect your finished picture before posting it, add your logo with <Link href="/add-watermark" className={linkCls}>Add Watermark</Link>. If your image contains text you want to copy, <Link href="/image-to-text" className={linkCls}>Image to Text (OCR)</Link> can extract it.
              </p>
            </div>

            <div className="br-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                What You Can Do with This Background Remover
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Remove background from image and save a transparent PNG',
                  'Make a transparent signature for PDFs and documents',
                  'Change a photo background to white for product listings',
                  'Add a blue or red background for ID style photos',
                  'Cut out a logo to place on websites and slides',
                  'Remove the background from a person for a profile picture',
                  'Remove backgrounds from many photos in bulk',
                  'Remove background from iPhone HEIC photos',
                  'Download as PNG, WebP or JPG without a watermark',
                  'Remove background online without uploading your photo',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="br-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Uses a Background Remover?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Online sellers — clean white background product photos',
                  'Students and job seekers — transparent signatures and profile photos',
                  'Designers — quick cutouts for banners and mockups',
                  'Content creators — thumbnails and social media graphics',
                  'Small businesses — logos and product catalogs',
                  'Everyday users — remove an unwanted background from a personal photo',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#9333EA' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                Tips for a Cleaner Cutout
              </h3>
              <p className="leading-7 text-sm">
                Use a sharp photo with good lighting and a subject that clearly stands out from the background. Choose High quality mode for hair, fur and fine edges. If an edge looks rough, try a larger or better lit version of the photo. Busy backgrounds or a subject with a similar color to the background are the hardest cases for any automatic background remover.
              </p>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="br-divider" />
        <section className="br-section-main py-16 px-6">
          <Script
            id="faq-schema-background-remover"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: { '@type': 'Answer', text: faq.text },
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
                <details key={i} className="br-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#9333EA' }} />
                  </summary>
                  <div className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a ?? faq.text}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="br-divider" />
        <section className="br-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              Explore More Free Image Tools
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Signature Maker',  href: '/signature-maker' },
                { name: 'Image Converter',  href: '/image-converter' },
                { name: 'Image Compressor', href: '/image-compressor' },
                { name: 'Image Resizer',    href: '/image-resizer' },
                { name: 'Image Cropper',    href: '/image-cropper' },
                { name: 'Color Picker',     href: '/color-picker' },
                { name: 'Add Watermark',    href: '/add-watermark' },
                { name: 'Image to Text',    href: '/image-to-text' },
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
        <section className="br-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to remove your background?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Free background remover online. No signup. No watermark.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="br-cta-btn"
            >
              <Eraser className="w-5 h-5" />
              Remove Background
            </button>
          </div>
        </section>

      </main>
    </>
  );
}