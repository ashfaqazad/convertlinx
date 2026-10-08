'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Crop, RefreshCw, ChevronDown, Download } from 'lucide-react';
import Script from 'next/script';
import '@/styles/ImageCropper.css';
import Link from 'next/link';

const PRESETS = [
  { label: 'Free',       ratio: null },
  { label: '1:1',        ratio: 1 },
  { label: '4:3',        ratio: 4 / 3 },
  { label: '16:9',       ratio: 16 / 9 },
  { label: '3:2',        ratio: 3 / 2 },
  { label: '2:3',        ratio: 2 / 3 },
  { label: '9:16 Story', ratio: 9 / 16 },
  { label: 'A4',         ratio: 210 / 297 },
];

const QUALITY_OPTIONS = [
  { label: 'Maximum (100%)', value: 1.0  },
  { label: 'High (90%)',     value: 0.9  },
  { label: 'Standard (85%)', value: 0.85 },
  { label: 'Medium (75%)',   value: 0.75 },
  { label: 'Low (60%)',      value: 0.6  },
];

const MIN_PX = 10;

export default function ImageCropper() {
  const [imgLoaded,   setImgLoaded]   = useState(false);
  const [imgFile,     setImgFile]     = useState(null);
  const [naturalW,    setNaturalW]    = useState(0);
  const [naturalH,    setNaturalH]    = useState(0);
  const [displayW,    setDisplayW]    = useState(0);
  const [displayH,    setDisplayH]    = useState(0);
  const [crop,        setCrop]        = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [inputW,      setInputW]      = useState('');
  const [inputH,      setInputH]      = useState('');
  const [preset,      setPreset]      = useState('Free');
  const [format,      setFormat]      = useState('original');
  const [quality,     setQuality]     = useState(0.85);
  const [dragOver,    setDragOver]    = useState(false);
  const [processing,  setProcessing]  = useState(false);

  const fileRef   = useRef(null);
  const canvasRef = useRef(null);
  const outputRef = useRef(null);
  const imgRef    = useRef(null);
  const wrapRef   = useRef(null);

  const isDragging  = useRef(false);
  const isResizing  = useRef(null);
  const isMoving    = useRef(false);
  const dragStart   = useRef({ x: 0, y: 0 });
  const cropStart   = useRef({ x: 0, y: 0, w: 0, h: 0 });

  /* ────────── helpers ────────── */
  const getScale = () => (displayW ? naturalW / displayW : 1);

  const clampCrop = (c) => {
    const x = Math.max(0, Math.min(c.x, displayW - MIN_PX));
    const y = Math.max(0, Math.min(c.y, displayH - MIN_PX));
    const w = Math.max(MIN_PX, Math.min(Math.abs(c.w), displayW - x));
    const h = Math.max(MIN_PX, Math.min(Math.abs(c.h), displayH - y));
    return { x, y, w, h };
  };

  const syncInputsFromCrop = (c) => {
    const sc = getScale();
    setInputW(String(Math.round(c.w * sc)));
    setInputH(String(Math.round(c.h * sc)));
  };

  const applyCropFromNatural = (nw, nh) => {
    if (!displayW || !nw || !nh) return;
    const sc = getScale();
    const dw = Math.round(nw / sc);
    const dh = Math.round(nh / sc);
    const x  = Math.round((displayW - dw) / 2);
    const y  = Math.round((displayH - dh) / 2);
    setCrop(clampCrop({ x, y, w: dw, h: dh }));
  };

  /* ────────── load image ────────── */
  const loadImage = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);
      setImgFile(file);
      setImgLoaded(true);
    };
    img.src = url;
  };

  const onFileChange = (e) => loadImage(e.target.files[0]);
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    loadImage(e.dataTransfer.files[0]);
  }, []);

  /* ────────── draw canvas ────────── */
  useEffect(() => {
    if (!imgLoaded || !canvasRef.current || !imgRef.current || !wrapRef.current) return;
    const maxW = wrapRef.current.clientWidth - 4;
    const ratio = imgRef.current.naturalHeight / imgRef.current.naturalWidth;
    const dw = Math.min(maxW, imgRef.current.naturalWidth);
    const dh = Math.round(dw * ratio);
    canvasRef.current.width  = dw;
    canvasRef.current.height = dh;
    canvasRef.current.getContext('2d').drawImage(imgRef.current, 0, 0, dw, dh);
    setDisplayW(dw);
    setDisplayH(dh);
    const initCrop = { x: 0, y: 0, w: dw, h: dh };
    setCrop(initCrop);
    setInputW(String(imgRef.current.naturalWidth));
    setInputH(String(imgRef.current.naturalHeight));
  }, [imgLoaded]);

  /* ────────── presets ────────── */
  const applyPreset = (p) => {
    setPreset(p.label);
    if (!displayW || !displayH) return;
    if (!p.ratio) {
      const full = { x: 0, y: 0, w: displayW, h: displayH };
      setCrop(full); syncInputsFromCrop(full); return;
    }
    let w = displayW, h = Math.round(w / p.ratio);
    if (h > displayH) { h = displayH; w = Math.round(h * p.ratio); }
    const x  = Math.round((displayW - w) / 2);
    const y  = Math.round((displayH - h) / 2);
    const nc = clampCrop({ x, y, w, h });
    setCrop(nc); syncInputsFromCrop(nc);
  };

  /* ────────── manual W/H input ────────── */
  const onInputW = (val) => {
    setInputW(val);
    if (!val) return;
    const nw = parseInt(val);
    const p  = PRESETS.find(p => p.label === preset);
    let nh   = parseInt(inputH) || Math.round(naturalH);
    if (p?.ratio) { nh = Math.round(nw / p.ratio); setInputH(String(nh)); }
    applyCropFromNatural(nw, nh);
  };

  const onInputH = (val) => {
    setInputH(val);
    if (!val) return;
    const nh = parseInt(val);
    const p  = PRESETS.find(p => p.label === preset);
    let nw   = parseInt(inputW) || Math.round(naturalW);
    if (p?.ratio) { nw = Math.round(nh * p.ratio); setInputW(String(nw)); }
    applyCropFromNatural(nw, nh);
  };

  /* ────────── pointer position ────────── */
  const getPos = (e) => {
    const rect   = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width  / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (cx - rect.left) * scaleX, y: (cy - rect.top) * scaleY };
  };

  /* ────────── mouse down ────────── */
  const onMouseDown = (e, handle = null) => {
    e.preventDefault();
    const pos = getPos(e);
    dragStart.current = pos;
    cropStart.current = { ...crop };

    if (handle) {
      isResizing.current = handle;
      isMoving.current = isDragging.current = false;
      return;
    }
    const inside =
      pos.x >= crop.x && pos.x <= crop.x + crop.w &&
      pos.y >= crop.y && pos.y <= crop.y + crop.h;

    if (inside) {
      isMoving.current   = true;
      isResizing.current = null;
      isDragging.current = false;
    } else {
      isDragging.current = true;
      isMoving.current   = false;
      isResizing.current = null;
      const nc = { x: pos.x, y: pos.y, w: 0, h: 0 };
      setCrop(nc);
      cropStart.current = nc;
    }
  };

  /* ────────── mouse move ────────── */
  const onMouseMove = (e) => {
    if (!isDragging.current && !isResizing.current && !isMoving.current) return;
    e.preventDefault();
    const pos = getPos(e);
    const dx  = pos.x - dragStart.current.x;
    const dy  = pos.y - dragStart.current.y;
    const sc  = cropStart.current;
    const p   = PRESETS.find(p => p.label === preset);

    if (isMoving.current) {
      const nc = clampCrop({ x: sc.x + dx, y: sc.y + dy, w: sc.w, h: sc.h });
      setCrop(nc); syncInputsFromCrop(nc); return;
    }

    if (isDragging.current) {
      let w = dx, h = dy;
      if (p?.ratio) h = w / p.ratio;
      const nx = dx < 0 ? pos.x  : sc.x;
      const ny = p?.ratio
        ? (h < 0 ? sc.y + h : sc.y)
        : (dy < 0 ? pos.y : sc.y);
      const nc = clampCrop({ x: nx, y: ny, w: Math.abs(w), h: Math.abs(h) });
      setCrop(nc); syncInputsFromCrop(nc); return;
    }

    let { x, y, w, h } = sc;
    switch (isResizing.current) {
      case 'br': w = sc.w + dx;              h = sc.h + dy;        break;
      case 'bl': x = sc.x + dx; w = sc.w - dx; h = sc.h + dy;     break;
      case 'tr': w = sc.w + dx; y = sc.y + dy; h = sc.h - dy;     break;
      case 'tl': x = sc.x + dx; w = sc.w - dx; y = sc.y + dy; h = sc.h - dy; break;
    }
    if (p?.ratio) h = w / p.ratio;
    const nc = clampCrop({ x, y, w: Math.max(MIN_PX, w), h: Math.max(MIN_PX, h) });
    setCrop(nc); syncInputsFromCrop(nc);
  };

  const onMouseUp = () => {
    isDragging.current = false;
    isResizing.current = null;
    isMoving.current   = false;
  };

  /* ────────── Crop & Download ────────── */
  const handleCropDownload = () => {
    if (!imgRef.current || !crop.w || !crop.h) return;
    setProcessing(true);
    const sc = getScale();
    const sx = Math.round(crop.x * sc);
    const sy = Math.round(crop.y * sc);
    const sw = Math.round(crop.w * sc);
    const sh = Math.round(crop.h * sc);

    const out = outputRef.current;
    out.width = sw; out.height = sh;
    const ctx = out.getContext('2d');
    ctx.clearRect(0, 0, sw, sh);
    ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, sw, sh);

    const mimeMap = {
      original: imgFile?.type || 'image/jpeg',
      jpg:  'image/jpeg',
      png:  'image/png',
      webp: 'image/webp',
    };
    const mime = mimeMap[format] || 'image/jpeg';
    const q    = mime === 'image/png' ? 1 : quality;

    out.toBlob((blob) => {
      const extMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
      const ext = extMap[mime] || 'jpg';
      const a   = document.createElement('a');
      a.href     = URL.createObjectURL(blob);
      a.download = `cropped-convertlinx.${ext}`;
      a.click();
      setProcessing(false);
    }, mime, q);
  };

  const handleReset = () => {
    setImgLoaded(false); setImgFile(null);
    setNaturalW(0); setNaturalH(0);
    setDisplayW(0); setDisplayH(0);
    setCrop({ x: 0, y: 0, w: 0, h: 0 });
    setInputW(''); setInputH('');
    setPreset('Free');
    if (fileRef.current) fileRef.current.value = '';
  };

  /* ────────── derived values ────────── */
  const cropNatW = Math.round(crop.w * getScale());
  const cropNatH = Math.round(crop.h * getScale());
  const cropStyle = {
    left:    crop.x,
    top:     crop.y,
    width:   crop.w,
    height:  crop.h,
    display: crop.w > 0 && crop.h > 0 ? 'block' : 'none',
  };

  /* ────────── FAQs Data with Contextual Links ────────── */
  const faqs = [
    {
      q: 'How do I crop an image to a specific size online?',
      a: (
        <>
          Upload your image, draw your crop area on the canvas, then click <strong>Crop &amp; Download</strong>. Use preset aspect ratios or type exact pixel dimensions. If you also need to adjust dimensions without cutting out parts, check out our <Link href="/image-resizer" className="text-amber-600 underline hover:text-amber-700">Free Image Resizer</Link> tool.
        </>
      ),
      plainText: 'Upload your image, draw your crop area on the canvas, then click Crop & Download. Use preset aspect ratios or type exact pixel dimensions. If you also need to adjust dimensions without cutting out parts, check out our Free Image Resizer tool.'
    },
    {
      q: 'Can I crop HEIC photos from my iPhone?',
      a: (
        <>
          Yes — upload your HEIC photo directly. It will be decoded right inside your browser so you can crop it effortlessly. If you want to convert the entire image format without cropping, try our dedicated <Link href="/heic-to-jpg" className="text-amber-600 underline hover:text-amber-700">HEIC to JPG Converter</Link>.
        </>
      ),
      plainText: 'Yes — upload your HEIC photo directly. It will be decoded right inside your browser so you can crop it effortlessly. If you want to convert the entire image format without cropping, try our dedicated HEIC to JPG Converter.'
    },
    {
      q: 'What aspect ratio should I use for Instagram and Social Media?',
      a: 'Use 1:1 for square posts, 4:5 for portrait posts, and 9:16 for Stories and Reels. The 9:16 Story preset is available with one click in this tool.',
      plainText: 'Use 1:1 for square posts, 4:5 for portrait posts, and 9:16 for Stories and Reels. The 9:16 Story preset is available with one click in this tool.'
    },
    {
      q: 'Does cropping reduce image file size?',
      a: (
        <>
          Cropping removes unwanted outer areas, which naturally lowers the total pixel count and file size. However, if your file is still too heavy for web upload, you can compress it further with our <Link href="/image-compressor" className="text-amber-600 underline hover:text-amber-700">Online Image Compressor</Link>.
        </>
      ),
      plainText: 'Cropping removes unwanted outer areas, which naturally lowers the total pixel count and file size. However, if your file is still too heavy for web upload, you can compress it further with our Online Image Compressor.'
    },
    {
      q: 'Can I convert my image format after cropping?',
      a: (
        <>
          Yes, you can choose to save your cropped image as JPG, PNG, or WebP directly. If you ever need standalone file conversion, feel free to use our <Link href="/image-converter" className="text-amber-600 underline hover:text-amber-700">Universal Image Converter</Link>.
        </>
      ),
      plainText: 'Yes, you can choose to save your cropped image as JPG, PNG, or WebP directly. If you ever need standalone file conversion, feel free to use our Universal Image Converter.'
    },
    {
      q: 'Can I extract text from an image after cropping?',
      a: (
        <>
          Yes! If you crop an image containing text or documents, you can extract that text easily by uploading the cropped photo into our <Link href="/image-to-text" className="text-amber-600 underline hover:text-amber-700">Image to Text OCR Tool</Link>.
        </>
      ),
      plainText: 'Yes! If you crop an image containing text or documents, you can extract that text easily by uploading the cropped photo into our Image to Text OCR Tool.'
    },
    {
      q: 'Is my image uploaded to any server when I crop it?',
      a: 'No — all cropping operations happen 100% locally in your browser. Your images stay completely private on your device and are never uploaded or stored on any server.',
      plainText: 'No — all cropping operations happen 100% locally in your browser. Your images stay completely private on your device and are never uploaded or stored on any server.'
    },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-cropper"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Crop Images Online for Free',
            description: 'Crop JPG, PNG, WebP and HEIC images to any size or aspect ratio instantly in your browser — free, private, no uploads.',
            url: 'https://convertlinx.com/image-cropper',
            totalTime: 'PT20S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'JPG, PNG, WebP, or HEIC image file' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Image Cropper' }],
            step: [
              { '@type': 'HowToStep', name: 'Upload Image', text: 'Upload your JPG, PNG, WebP, or HEIC image by dragging and dropping or clicking to browse.' },
              { '@type': 'HowToStep', name: 'Select Crop Area', text: 'Drag on the image to select your crop area. Use aspect ratio presets or type exact pixel dimensions.' },
              { '@type': 'HowToStep', name: 'Crop & Download', text: 'Click Crop & Download to save your cropped image instantly.' },
            ],
          }),
        }}
      />

      <canvas ref={outputRef} className="hidden" />

      <main className="icp-page">

        {/* ── HERO ── */}
        <section className="icp-hero-bg py-16 px-6 text-center">
          <div className="icp-hero-blob-1" />
          <div className="icp-hero-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              <Link href="/" className="icp-breadcrumb-link">Home</Link>
              <span style={{ color: '#FCD34D' }}>/</span>
              <span style={{ color: '#F59E0B' }}>Image Cropper</span>
            </div>
            <span className="icp-badge-pill inline-block px-4 py-1.5 rounded-full mb-5">Free Tool</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: '#1a1a2e' }}>
              Image <span className="icp-grad-text">Cropper</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Crop images online free — resize and crop JPG, PNG, WebP, and HEIC photos to any size or
              aspect ratio instantly. Use presets for Instagram, YouTube, Twitter, and Stories, or set
              exact pixel dimensions. 100% private — nothing uploaded, no signup required.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {['No upload needed', 'JPG · PNG · WebP · HEIC', 'Aspect ratio presets', '100% private'].map((t, i) => (
                <span key={i} className="icp-badge-pill px-3 py-1 rounded-full text-xs">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOOL ── */}
        <section className="icp-main-section py-10 px-6">
          <div className="max-w-2xl mx-auto icp-fade-up" ref={wrapRef}>
            <div className="icp-tool-card rounded-3xl p-6 md:p-8">

              {!imgLoaded ? (
                <div
                  className={`icp-upload-area flex flex-col items-center justify-center gap-4 py-14 px-6 ${dragOver ? 'drag-over' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <Upload className="w-7 h-7" style={{ color: '#F59E0B' }} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-base mb-1" style={{ color: '#1a1a2e' }}>Drop your image here</p>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>or click to browse — JPG, PNG, WebP, HEIC supported</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                </div>
              ) : (
                <>
                  <div className="icp-filename-bar flex items-center justify-between mb-4 px-4 py-2.5 rounded-xl"
                    style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
                    <p className="text-xs font-semibold truncate" style={{ color: '#92400E' }}>
                      ✅ {imgFile?.name} — {naturalW}×{naturalH}px
                    </p>
                    <button onClick={handleReset}
                      className="text-xs font-semibold flex items-center gap-1 ml-3 shrink-0"
                      style={{ color: '#F59E0B' }}>
                      <RefreshCw className="w-3 h-3" /> Change
                    </button>
                  </div>

                  <div
                    className="icp-canvas-container mb-2"
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onTouchStart={onMouseDown}
                    onTouchMove={onMouseMove}
                    onTouchEnd={onMouseUp}
                  >
                    <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />

                    {crop.w > 0 && crop.h > 0 && (
                      <div className="icp-crop-overlay" style={cropStyle}>
                        <div className="icp-grid-line" style={{ left: '33.33%', top: 0, width: '1px', height: '100%' }} />
                        <div className="icp-grid-line" style={{ left: '66.66%', top: 0, width: '1px', height: '100%' }} />
                        <div className="icp-grid-line" style={{ top: '33.33%', left: 0, height: '1px', width: '100%' }} />
                        <div className="icp-grid-line" style={{ top: '66.66%', left: 0, height: '1px', width: '100%' }} />
                        {['tl', 'tr', 'bl', 'br'].map(h => (
                          <div key={h} className={`icp-handle ${h}`}
                            onMouseDown={(e) => { e.stopPropagation(); onMouseDown(e, h); }}
                            onTouchStart={(e) => { e.stopPropagation(); onMouseDown(e, h); }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-center mb-5" style={{ color: '#9CA3AF' }}>
                    Crop area: <strong style={{ color: '#92400E' }}>{cropNatW} × {cropNatH} px</strong>
                  </p>

                  <div className="mb-5">
                    <label className="icp-field-label block mb-2">Aspect ratio</label>
                    <div className="flex flex-wrap gap-2">
                      {PRESETS.map(p => (
                        <button key={p.label} onClick={() => applyPreset(p)}
                          className={`icp-preset-btn ${preset === p.label ? 'active' : ''}`}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div>
                      <label className="icp-field-label block mb-1.5">Width (px)</label>
                      <input type="number" min={1} value={inputW}
                        onChange={e => onInputW(e.target.value)}
                        className="icp-input w-full px-3 py-2.5 rounded-xl text-sm"
                        placeholder="e.g. 800"
                      />
                    </div>
                    <div>
                      <label className="icp-field-label block mb-1.5">Height (px)</label>
                      <input type="number" min={1} value={inputH}
                        onChange={e => onInputH(e.target.value)}
                        className="icp-input w-full px-3 py-2.5 rounded-xl text-sm"
                        placeholder="e.g. 600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div>
                      <label className="icp-field-label block mb-1.5">Output Format</label>
                      <select value={format} onChange={e => setFormat(e.target.value)}
                        className="icp-select w-full px-3 py-2.5 rounded-xl text-sm">
                        <option value="original">Keep original</option>
                        <option value="jpg">JPG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                    <div>
                      <label className="icp-field-label block mb-1.5">Quality</label>
                      <select value={quality} onChange={e => setQuality(parseFloat(e.target.value))}
                        className="icp-select w-full px-3 py-2.5 rounded-xl text-sm">
                        {QUALITY_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCropDownload}
                      disabled={processing || !crop.w || !crop.h}
                      className="icp-crop-btn flex-1 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base"
                    >
                      {processing
                        ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                        : <><Crop className="w-5 h-5" />✂️ Crop &amp; Download</>
                      }
                    </button>
                    <button onClick={handleReset}
                      className="icp-reset-btn px-5 py-4 rounded-xl text-sm font-bold flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4" /> Reset
                    </button>
                  </div>
                </>
              )}

              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No signup', 'Browser-based', 'Files not uploaded', '100% free'].map((t, i) => (
                  <span key={i} className="text-xs flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
                    <span className="w-1 h-1 rounded-full" style={{ background: '#FCD34D' }} />
                    {t}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="icp-mid-divider" />
        <section className="icp-alt-section py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload Image',    desc: 'Drag & drop or click to upload your JPG, PNG, WebP, or HEIC image.' },
                { num: '2', title: 'Draw Your Crop',  desc: 'Drag on the image to select your area. Use presets or type exact pixel dimensions.' },
                { num: '3', title: 'Crop & Download', desc: 'Click the button — your cropped image downloads instantly to your device.' },
              ].map((s, i) => (
                <div key={i} className="icp-step-card rounded-2xl p-7 text-center">
                  <div className="icp-step-num w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg text-white">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="icp-mid-divider" />
        <section className="icp-main-section py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>Why Use ConvertLinx?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: <Upload className="w-6 h-6" />,   color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  title: '100% Private',           desc: 'Images are cropped entirely in your browser. Your files never leave your device and are never uploaded to any server.' },
                { icon: <Crop className="w-6 h-6" />,     color: '#EA580C', bg: 'rgba(234,88,12,0.08)',   title: 'Free Crop & Presets',    desc: 'Draw any crop area freely or use aspect ratio presets — square (1:1), widescreen (16:9), portrait, Stories (9:16) and more.' },
                { icon: <Download className="w-6 h-6" />, color: '#10B981', bg: 'rgba(16,185,129,0.08)',  title: 'Perfect for Social Media', desc: 'Crop images to exact ratios for Instagram, YouTube, Twitter, Facebook, and TikTok in one click — no guesswork needed.' },
              ].map((b, i) => (
                <div key={i} className="icp-benefit-card rounded-2xl p-7">
                  <div className="p-3 rounded-xl inline-flex mb-5" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT WITH CONTEXTUAL INTERLINKING ── */}
        <hr className="icp-mid-divider" />
        <section className="icp-alt-section py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Why You Need an Online Image Cropper
              </h2>
              <p className="leading-7 text-sm">
                Every social media platform, website, and app expects images in different sizes and ratios.
                Instagram needs square or portrait crops, YouTube thumbnails need 16:9 widescreen, and
                passport photos need exact pixel dimensions. Cropping images manually to the right size
                and ratio saves time, ensures your photos fit perfectly, and avoids awkward stretching
                or blank spaces when you upload them. If you also need to decrease overall dimensions without cutting framing, use our <Link href="/image-resizer" className="text-amber-600 font-semibold underline hover:text-amber-700">Image Resizer</Link>.
              </p>
              <p className="leading-7 text-sm mt-3">
                This free online image cropper works directly in your browser — no software to install,
                no file uploads, and no account needed. Drag to select any area, use one-click aspect
                ratio presets, or type exact pixel dimensions for precise results every time. Need to reduce photo file sizes for website speed? Combine cropping with our <Link href="/image-compressor" className="text-amber-600 font-semibold underline hover:text-amber-700">Image Compressor</Link>.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                Crop Images to the Right Size for Every Platform
              </h3>
              <p className="leading-7 text-sm">
                Different platforms require different image dimensions. Instagram square posts need 1:1
                ratio, Instagram Stories and TikTok need 9:16 portrait, YouTube thumbnails need 16:9
                widescreen, and Facebook cover photos have their own specific sizes. Instead of guessing
                or resizing after the fact, use the built-in aspect ratio presets to crop your images. If you are uploading iPhone photos, you can also process them via our <Link href="/heic-to-jpg" className="text-amber-600 font-semibold underline hover:text-amber-700">HEIC to JPG Converter</Link>.
              </p>
            </div>

            <div className="icp-seo-box rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Problems This Tool Solves
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Instagram post not fitting — need 1:1 or 4:5 crop',
                  'YouTube thumbnail needs exact 16:9 aspect ratio',
                  'Profile picture needs square crop without distortion',
                  'Need to remove unwanted background or borders from image',
                  'Passport or ID photo needs specific pixel dimensions',
                  'PNG transparency needs to be preserved while cropping',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="icp-feature-dot w-1.5 h-1.5 rounded-full shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Social media creators — crop photos to exact platform ratios',
                  'Designers — cut logos, icons, or UI elements from screenshots',
                  'Students — crop images for assignments, reports, and presentations',
                  'Online sellers — prepare product photos with clean square crops',
                  'Bloggers — resize and crop featured images for websites',
                  'Everyone — quick crop and trim without installing software',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#F59E0B' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="icp-seo-box rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features &amp; Companion Tools</h3>
              <p className="text-xs mb-3 text-slate-500">
                Beyond cropping, you can utilize our <Link href="/image-converter" className="text-amber-600 underline font-semibold">Image Converter</Link> for format switching, or extract readable content using <Link href="/image-to-text" className="text-amber-600 underline font-semibold">Image to Text OCR</Link>.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Free-form drag-to-crop selection',
                  'Rule-of-thirds grid overlay',
                  'Corner handles for precise resize',
                  'Preset ratios — 1:1, 4:3, 16:9, 9:16, A4',
                  'Manual width & height pixel inputs',
                  'Quality control dropdown',
                  'Output as JPG, PNG, or WebP',
                  '100% browser-based — no uploads',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="icp-feature-dot w-1.5 h-1.5 rounded-full shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Best Uses for Image Cropping
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Crop photos to 1:1 square for Instagram posts',
                  'Crop images to 16:9 for YouTube thumbnails',
                  'Crop to 9:16 for Instagram Stories and TikTok',
                  'Trim unwanted borders and backgrounds from photos',
                  'Crop iPhone HEIC photos and download as JPG or PNG',
                  'Crop product images to square for e-commerce listings',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="icp-feature-dot w-1.5 h-1.5 rounded-full shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="icp-mid-divider" />
        <section className="icp-main-section py-16 px-6">
          <Script
            id="faq-schema-cropper"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: { '@type': 'Answer', text: faq.plainText },
                })),
              }),
            }}
          />
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="icp-faq-item rounded-xl p-5">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#F59E0B' }} />
                  </summary>
                  <div className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="icp-mid-divider" />
        <section className="icp-alt-section py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Image Resizer',    href: '/image-resizer'    },
                { name: 'Image Compressor', href: '/image-compressor' },
                { name: 'Image Converter',  href: '/image-converter'  },
                { name: 'HEIC to JPG',      href: '/heic-to-jpg'      },
                { name: 'Image to Text',    href: '/image-to-text'    },
                { name: 'QR Generator',     href: '/qr-generator'     },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border transition hover:bg-amber-50"
                  style={{ color: '#92400E', borderColor: '#FCD34D', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="icp-cta-section py-20 px-6 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
              Ready to crop your image?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Takes less than 10 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="icp-cta-btn text-white text-base px-10 py-4 rounded-xl inline-flex items-center gap-2"
            >
              <Crop className="w-5 h-5" /> Crop Image Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}

