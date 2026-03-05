'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Crop, RefreshCw, ChevronDown, Download } from 'lucide-react';
import Script from 'next/script';
import '@/styles/ImageCropper.css';

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
  const fmtSize = (b) =>
    b < 1024 ? b + ' B'
    : b < 1048576 ? (b / 1024).toFixed(1) + ' KB'
    : (b / 1048576).toFixed(2) + ' MB';

  // display-pixel → natural-pixel multiplier
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

  const onFileChange  = (e) => loadImage(e.target.files[0]);
  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
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
    const x = Math.round((displayW - w) / 2);
    const y = Math.round((displayH - h) / 2);
    const nc = clampCrop({ x, y, w, h });
    setCrop(nc); syncInputsFromCrop(nc);
  };

  /* ────────── manual W input ────────── */
  const onInputW = (val) => {
    setInputW(val);
    if (!val) return;
    const nw = parseInt(val);
    const p  = PRESETS.find(p => p.label === preset);
    let nh   = parseInt(inputH) || Math.round(naturalH);
    if (p?.ratio) { nh = Math.round(nw / p.ratio); setInputH(String(nh)); }
    applyCropFromNatural(nw, nh);
  };

  /* ────────── manual H input ────────── */
  const onInputH = (val) => {
    setInputH(val);
    if (!val) return;
    const nh = parseInt(val);
    const p  = PRESETS.find(p => p.label === preset);
    let nw   = parseInt(inputW) || Math.round(naturalW);
    if (p?.ratio) { nw = Math.round(nh * p.ratio); setInputW(String(nw)); }
    applyCropFromNatural(nw, nh);
  };

  /* ────────── pointer position on canvas ────────── */
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

    // resize
    let { x, y, w, h } = sc;
    switch (isResizing.current) {
      case 'br': w = sc.w + dx;        h = sc.h + dy;        break;
      case 'bl': x = sc.x + dx; w = sc.w - dx; h = sc.h + dy; break;
      case 'tr': w = sc.w + dx; y = sc.y + dy; h = sc.h - dy; break;
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
    left:   crop.x, top:    crop.y,
    width:  crop.w, height: crop.h,
    display: crop.w > 0 && crop.h > 0 ? 'block' : 'none',
  };

  return (
    <>
      <Script id="howto-schema-cropper" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context":"https://schema.org","@type":"HowTo",
          name:"How to Crop Images Online for Free",
          url:"https://convertlinx.com/image-cropper",
          step:[
            {"@type":"HowToStep","name":"Upload","text":"Upload JPG, PNG, or WebP image."},
            {"@type":"HowToStep","name":"Select","text":"Drag to select crop area or use presets."},
            {"@type":"HowToStep","name":"Download","text":"Click Crop & Download to save."},
          ],
          totalTime:"PT20S",
          estimatedCost:{"@type":"MonetaryAmount","value":"0","currency":"USD"},
        })}}
      />

      <canvas ref={outputRef} className="hidden" />

      <main className="icp-page">

        {/* ── HERO ── */}
        <section className="icp-hero-bg py-16 px-6 text-center">
          <div className="icp-hero-blob-1" /><div className="icp-hero-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              <a href="/" className="icp-breadcrumb-link">Home</a>
              <span style={{color:'#FCD34D'}}>/</span>
              <span style={{color:'#F59E0B'}}>Image Cropper</span>
            </div>
            <span className="icp-badge-pill inline-block px-4 py-1.5 rounded-full mb-5">Free Tool</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{color:'#1a1a2e'}}>
              Image <span className="icp-grad-text">Cropper</span>
            </h1>
            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{color:'#6B7280'}}>
              Crop JPG, PNG &amp; WebP images to any size or aspect ratio — instantly in your browser, no uploads, 100% private and free.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {['+ No upload needed','+ JPG · PNG · WebP · HEIC','+ Free crop & aspect ratios','+ 100% private'].map((t,i)=>(
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
                /* ── Upload drop zone ── */
                <div
                  className={`icp-upload-area flex flex-col items-center justify-center gap-4 py-14 px-6 ${dragOver?'drag-over':''}`}
                  onClick={()=>fileRef.current?.click()}
                  onDragOver={(e)=>{e.preventDefault();setDragOver(true);}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={onDrop}
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)'}}>
                    <Upload className="w-7 h-7" style={{color:'#F59E0B'}}/>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-base mb-1" style={{color:'#1a1a2e'}}>Drop your image here</p>
                    <p className="text-sm" style={{color:'#9CA3AF'}}>or click to browse — JPG, PNG, WebP supported</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange}/>
                </div>
              ) : (
                <>
                  {/* File name bar */}
                  <div className="icp-filename-bar flex items-center justify-between mb-4 px-4 py-2.5 rounded-xl"
                    style={{background:'#FFFBEB',border:'1px solid #FCD34D'}}>
                    <p className="text-xs font-semibold truncate" style={{color:'#92400E'}}>
                      ✅ {imgFile?.name} — {naturalW}×{naturalH}px
                    </p>
                    <button onClick={handleReset}
                      className="text-xs font-semibold flex items-center gap-1 ml-3 flex-shrink-0"
                      style={{color:'#F59E0B'}}>
                      <RefreshCw className="w-3 h-3"/> Change
                    </button>
                  </div>

                  {/* ── Canvas ── */}
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
                    <canvas ref={canvasRef} style={{display:'block',width:'100%'}}/>

                    {crop.w > 0 && crop.h > 0 && (
                      <div className="icp-crop-overlay" style={cropStyle}>
                        {/* rule-of-thirds */}
                        <div className="icp-grid-line" style={{left:'33.33%',top:0,width:'1px',height:'100%'}}/>
                        <div className="icp-grid-line" style={{left:'66.66%',top:0,width:'1px',height:'100%'}}/>
                        <div className="icp-grid-line" style={{top:'33.33%',left:0,height:'1px',width:'100%'}}/>
                        <div className="icp-grid-line" style={{top:'66.66%',left:0,height:'1px',width:'100%'}}/>
                        {/* handles */}
                        {['tl','tr','bl','br'].map(h=>(
                          <div key={h} className={`icp-handle ${h}`}
                            onMouseDown={(e)=>{e.stopPropagation();onMouseDown(e,h);}}
                            onTouchStart={(e)=>{e.stopPropagation();onMouseDown(e,h);}}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Crop size hint */}
                  <p className="text-xs text-center mb-5" style={{color:'#9CA3AF'}}>
                    Crop area:&nbsp;
                    <strong style={{color:'#92400E'}}>{cropNatW} × {cropNatH} px</strong>
                  </p>

                  {/* ── Aspect Ratio ── */}
                  <div className="mb-5">
                    <label className="icp-field-label block mb-2">Aspect ratio</label>
                    <div className="flex flex-wrap gap-2">
                      {PRESETS.map(p=>(
                        <button key={p.label} onClick={()=>applyPreset(p)}
                          className={`icp-preset-btn ${preset===p.label?'active':''}`}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Manual Width / Height ── */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div>
                      <label className="icp-field-label block mb-1.5">Width (px)</label>
                      <input type="number" min={1} value={inputW}
                        onChange={e=>onInputW(e.target.value)}
                        className="icp-input w-full px-3 py-2.5 rounded-xl text-sm"
                        placeholder="e.g. 800"
                      />
                    </div>
                    <div>
                      <label className="icp-field-label block mb-1.5">Height (px)</label>
                      <input type="number" min={1} value={inputH}
                        onChange={e=>onInputH(e.target.value)}
                        className="icp-input w-full px-3 py-2.5 rounded-xl text-sm"
                        placeholder="e.g. 600"
                      />
                    </div>
                  </div>

                  {/* ── Output Format + Quality ── */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div>
                      <label className="icp-field-label block mb-1.5">Output Format</label>
                      <select value={format} onChange={e=>setFormat(e.target.value)}
                        className="icp-select w-full px-3 py-2.5 rounded-xl text-sm">
                        <option value="original">Keep original</option>
                        <option value="jpg">JPG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                    <div>
                      <label className="icp-field-label block mb-1.5">Quality</label>
                      <select value={quality} onChange={e=>setQuality(parseFloat(e.target.value))}
                        className="icp-select w-full px-3 py-2.5 rounded-xl text-sm">
                        {QUALITY_OPTIONS.map(o=>(
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ── Crop & Download + Reset ── */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCropDownload}
                      disabled={processing || !crop.w || !crop.h}
                      className="icp-crop-btn flex-1 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base"
                    >
                      {processing
                        ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Processing...</>
                        : <><Crop className="w-5 h-5"/>✂️ Crop &amp; Download</>
                      }
                    </button>
                    <button onClick={handleReset}
                      className="icp-reset-btn px-5 py-4 rounded-xl text-sm font-bold flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4"/> Reset
                    </button>
                  </div>
                </>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No signup','Browser-based','Files not uploaded','100% free'].map((t,i)=>(
                  <span key={i} className="text-xs flex items-center gap-1.5" style={{color:'#9CA3AF'}}>
                    <span className="w-1 h-1 rounded-full" style={{background:'#FCD34D'}}/>
                    {t}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="icp-mid-divider"/>
        <section className="icp-alt-section py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{color:'#1a1a2e'}}>Why Use ConvertLinx?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {icon:<Upload className="w-6 h-6"/>,   color:'#F59E0B',bg:'rgba(245,158,11,0.08)', title:'100% Private',          desc:'Images are cropped entirely in your browser. Your files never leave your device.'},
                {icon:<Crop className="w-6 h-6"/>,     color:'#EA580C',bg:'rgba(234,88,12,0.08)',  title:'Free Crop & Presets',   desc:'Draw any crop area freely or use aspect ratio presets — square, 16:9, portrait, story and more.'},
                {icon:<Download className="w-6 h-6"/>, color:'#10B981',bg:'rgba(16,185,129,0.08)', title:'Perfect for Social Media',desc:'Crop images to exact ratios for Instagram, YouTube, Twitter and Facebook in one click.'},
              ].map((b,i)=>(
                <div key={i} className="icp-benefit-card rounded-2xl p-7">
                  <div className="p-3 rounded-xl inline-flex mb-5" style={{background:b.bg,color:b.color}}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{color:'#1a1a2e'}}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color:'#6B7280'}}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW TO ── */}
        <hr className="icp-mid-divider"/>
        <section className="icp-main-section py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{color:'#1a1a2e'}}>3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {num:'1',title:'Upload Image',   desc:'Drag & drop or click to upload your JPG, PNG, or WebP image.'},
                {num:'2',title:'Draw Your Crop', desc:'Drag on the image to select. Use presets or type exact pixel dimensions.'},
                {num:'3',title:'Crop & Download',desc:'Click the button — your cropped image downloads instantly.'},
              ].map((s,i)=>(
                <div key={i} className="icp-step-card rounded-2xl p-7 text-center">
                  <div className="icp-step-num w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg text-white">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{color:'#1a1a2e'}}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color:'#6B7280'}}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="icp-mid-divider"/>
        <section className="icp-alt-section py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{color:'#1a1a2e'}}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                {q:'How do I crop an image to a specific size online?',  a:'Upload your image, draw your crop area on the canvas, then click Crop & Download. Use the aspect ratio buttons for exact proportions like 1:1 square or 16:9 widescreen. Or type exact pixel dimensions in the width and height fields.'},
                {q:'Can I crop HEIC photos from my iPhone?',             a:'Yes — upload your HEIC file directly. It will be decoded in your browser so you can crop it and download as JPG, WebP or any other format. No app or conversion needed first.'},
                {q:'What aspect ratio should I use for Instagram?',      a:'Use 1:1 for square posts, 4:5 for portrait posts and 9:16 for Stories and Reels. The 9:16 Story preset is available with one click.'},
                {q:'Does cropping reduce image quality?',                a:'Cropping itself does not reduce quality — it simply removes the parts outside your selection. The cropped area keeps its full original resolution and sharpness.'},
                {q:'Can I set exact pixel dimensions manually?',         a:'Yes — type the exact width and height in pixels in the input fields below the canvas. The crop box will update automatically to match.'},
                {q:'What image formats can I crop?',                     a:'JPG, PNG, WebP and HEIC are all supported as input. You can download the cropped result as JPG, PNG, or WebP — whichever suits your needs best.'},
              ].map((faq,i)=>(
                <details key={i} className="icp-faq-item rounded-xl p-5">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{color:'#374151'}}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" style={{color:'#F59E0B'}}/>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{color:'#6B7280'}}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO + Related ── */}
        <hr className="icp-mid-divider"/>
        <section className="icp-main-section py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="icp-seo-box rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{color:'#1a1a2e'}}>Features</h3>
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
                ].map((f,i)=>(
                  <div key={i} className="flex items-center gap-2.5 text-sm" style={{color:'#6B7280'}}>
                    <span className="icp-feature-dot w-1.5 h-1.5 rounded-full flex-shrink-0"/>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5">
              <p className="text-sm font-semibold text-slate-700 mb-3">You may also find these free tools helpful:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  {href:'/image-resizer',   label:'Image Resizer'},
                  {href:'/image-compressor',label:'Image Compressor'},
                  {href:'/image-converter', label:'Image Converter'},
                  {href:'/image-to-text',   label:'Image to Text'},
                  {href:'/heic-to-jpg',     label:'HEIC to JPG'},
                ].map(t=>(
                  <a key={t.href} href={t.href}
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition"
                    style={{borderColor:'rgba(245,158,11,0.25)',background:'rgba(245,158,11,0.08)',color:'#92400E'}}>
                    {t.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="icp-cta-section py-20 px-6 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">Ready to crop your image?</h2>
            <p className="mb-8 text-base" style={{color:'rgba(255,255,255,0.75)'}}>
              Takes less than 10 seconds. No signup. No ads.
            </p>
            <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
              className="icp-cta-btn text-white text-base px-10 py-4 rounded-xl inline-flex items-center gap-2">
              <Crop className="w-5 h-5"/> Crop Image Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}





























// 'use client';

// import { useState, useRef, useCallback, useEffect } from 'react';
// import { Upload, Download, Crop, RefreshCw, ChevronDown } from 'lucide-react';
// import Script from 'next/script';
// import '@/styles/ImageCropper.css';

// /* ── Preset aspect ratios ── */
// const PRESETS = [
//   { label: 'Free',      ratio: null },
//   { label: '1:1',       ratio: 1 },
//   { label: '4:3',       ratio: 4 / 3 },
//   { label: '16:9',      ratio: 16 / 9 },
//   { label: '3:2',       ratio: 3 / 2 },
//   { label: '2:3',       ratio: 2 / 3 },
//   { label: 'A4',        ratio: 210 / 297 },
// ];

// const MIN_SIZE = 20;

// export default function ImageCropper() {
//   const [imgSrc, setImgSrc]       = useState(null);   // original object URL
//   const [imgFile, setImgFile]     = useState(null);
//   const [naturalW, setNaturalW]   = useState(0);
//   const [naturalH, setNaturalH]   = useState(0);
//   const [displayW, setDisplayW]   = useState(0);      // canvas render size
//   const [displayH, setDisplayH]   = useState(0);
//   const [crop, setCrop]           = useState({ x: 0, y: 0, w: 0, h: 0 });
//   const [preset, setPreset]       = useState('Free');
//   const [format, setFormat]       = useState('original');
//   const [result, setResult]       = useState(null);   // { url, size, w, h, mime }
//   const [dragOver, setDragOver]   = useState(false);

//   const fileRef     = useRef(null);
//   const canvasRef   = useRef(null);    // display canvas
//   const outputRef   = useRef(null);    // hidden output canvas
//   const imgRef      = useRef(null);    // loaded Image object
//   const dragging    = useRef(false);
//   const resizing    = useRef(null);    // 'tl'|'tr'|'bl'|'br' | null
//   const startPt     = useRef({ x: 0, y: 0 });
//   const startCrop   = useRef({ x: 0, y: 0, w: 0, h: 0 });
//   const containerRef = useRef(null);

//   /* ── helpers ── */
//   const fmtSize = (b) =>
//     b < 1024 ? b + ' B'
//     : b < 1048576 ? (b / 1024).toFixed(1) + ' KB'
//     : (b / 1048576).toFixed(2) + ' MB';

//   const getScaleFactor = () =>
//     naturalW ? naturalW / displayW : 1;

//   /* ── Load image file ── */
//   const loadImage = (file) => {
//     if (!file || !file.type.startsWith('image/')) return;
//     const url = URL.createObjectURL(file);
//     const img = new Image();
//     img.onload = () => {
//       imgRef.current = img;
//       setNaturalW(img.naturalWidth);
//       setNaturalH(img.naturalHeight);
//       setImgSrc(url);
//       setImgFile(file);
//       setResult(null);
//     };
//     img.src = url;
//   };

//   const onFileChange = (e) => loadImage(e.target.files[0]);
//   const onDrop = useCallback((e) => {
//     e.preventDefault(); setDragOver(false);
//     loadImage(e.dataTransfer.files[0]);
//   }, []);

//   /* ── Draw display canvas when imgSrc ready ── */
//   useEffect(() => {
//     if (!imgSrc || !canvasRef.current || !imgRef.current) return;
//     const container = containerRef.current;
//     const maxW = container ? container.clientWidth - 2 : 600;
//     const ratio = imgRef.current.naturalHeight / imgRef.current.naturalWidth;
//     const dw = Math.min(maxW, imgRef.current.naturalWidth);
//     const dh = Math.round(dw * ratio);
//     setDisplayW(dw);
//     setDisplayH(dh);
//     canvasRef.current.width  = dw;
//     canvasRef.current.height = dh;
//     const ctx = canvasRef.current.getContext('2d');
//     ctx.drawImage(imgRef.current, 0, 0, dw, dh);

//     // Default crop = full image
//     setCrop({ x: 0, y: 0, w: dw, h: dh });
//   }, [imgSrc]);

//   /* ── Apply preset ── */
//   const applyPreset = (p) => {
//     setPreset(p.label);
//     setResult(null);
//     if (!displayW || !displayH) return;
//     if (!p.ratio) {
//       setCrop({ x: 0, y: 0, w: displayW, h: displayH });
//       return;
//     }
//     let w = displayW, h = Math.round(w / p.ratio);
//     if (h > displayH) { h = displayH; w = Math.round(h * p.ratio); }
//     const x = Math.round((displayW - w) / 2);
//     const y = Math.round((displayH - h) / 2);
//     setCrop({ x, y, w, h });
//   };

//   /* ── Clamp crop inside canvas ── */
//   const clamp = (c) => ({
//     x: Math.max(0, Math.min(c.x, displayW - MIN_SIZE)),
//     y: Math.max(0, Math.min(c.y, displayH - MIN_SIZE)),
//     w: Math.max(MIN_SIZE, Math.min(c.w, displayW - Math.max(0, c.x))),
//     h: Math.max(MIN_SIZE, Math.min(c.h, displayH - Math.max(0, c.y))),
//   });

//   /* ── Mouse / Touch helpers ── */
//   const getPos = (e) => {
//     const rect = canvasRef.current.getBoundingClientRect();
//     const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
//     const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
//     return { x: cx, y: cy };
//   };

//   const onMouseDown = (e, handle = null) => {
//     e.preventDefault();
//     const pos = getPos(e);
//     startPt.current   = pos;
//     startCrop.current = { ...crop };

//     if (handle) {
//       resizing.current  = handle;
//       dragging.current  = false;
//     } else {
//       // Check if inside crop box → drag, else start new crop
//       const inside =
//         pos.x >= crop.x && pos.x <= crop.x + crop.w &&
//         pos.y >= crop.y && pos.y <= crop.y + crop.h;
//       dragging.current  = inside;
//       resizing.current  = null;
//       if (!inside) {
//         setCrop({ x: pos.x, y: pos.y, w: 0, h: 0 });
//         startCrop.current = { x: pos.x, y: pos.y, w: 0, h: 0 };
//       }
//     }
//   };

//   const onMouseMove = (e) => {
//     if (!dragging.current && !resizing.current) return;
//     e.preventDefault();
//     const pos = getPos(e);
//     const dx = pos.x - startPt.current.x;
//     const dy = pos.y - startPt.current.y;
//     const sc = startCrop.current;
//     const p  = PRESETS.find(p => p.label === preset);

//     if (dragging.current) {
//       setCrop(clamp({ x: sc.x + dx, y: sc.y + dy, w: sc.w, h: sc.h }));
//       return;
//     }

//     // Resizing handles
//     let { x, y, w, h } = sc;
//     switch (resizing.current) {
//       case 'br': w = sc.w + dx; h = sc.h + dy; break;
//       case 'bl': x = sc.x + dx; w = sc.w - dx; h = sc.h + dy; break;
//       case 'tr': w = sc.w + dx; y = sc.y + dy; h = sc.h - dy; break;
//       case 'tl': x = sc.x + dx; w = sc.w - dx; y = sc.y + dy; h = sc.h - dy; break;
//     }
//     // Enforce ratio if preset locked
//     if (p?.ratio) h = Math.round(w / p.ratio);
//     setCrop(clamp({ x, y, w: Math.max(MIN_SIZE, w), h: Math.max(MIN_SIZE, h) }));
//   };

//   const onMouseUp = () => {
//     dragging.current = false;
//     resizing.current = null;
//   };

//   /* ── Crop & export ── */
//   const handleCrop = () => {
//     if (!imgRef.current || !crop.w || !crop.h) return;
//     const scale = getScaleFactor();
//     const sx = Math.round(crop.x * scale);
//     const sy = Math.round(crop.y * scale);
//     const sw = Math.round(crop.w * scale);
//     const sh = Math.round(crop.h * scale);

//     const out = outputRef.current;
//     out.width  = sw;
//     out.height = sh;
//     const ctx = out.getContext('2d');
//     ctx.clearRect(0, 0, sw, sh);
//     ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, sw, sh);

//     const mimeMap = {
//       original: imgFile?.type || 'image/jpeg',
//       jpg:  'image/jpeg',
//       png:  'image/png',
//       webp: 'image/webp',
//     };
//     const mime = mimeMap[format] || 'image/jpeg';
//     out.toBlob((blob) => {
//       const url = URL.createObjectURL(blob);
//       setResult({ url, size: blob.size, w: sw, h: sh, mime });
//     }, mime, 0.92);
//   };

//   const handleDownload = () => {
//     if (!result) return;
//     const extMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
//     const ext = extMap[result.mime] || 'jpg';
//     const a   = document.createElement('a');
//     a.href     = result.url;
//     a.download = `cropped-convertlinx.${ext}`;
//     a.click();
//   };

//   const handleReset = () => {
//     setImgSrc(null); setImgFile(null); setResult(null);
//     setNaturalW(0); setNaturalH(0);
//     setCrop({ x: 0, y: 0, w: 0, h: 0 });
//     if (fileRef.current) fileRef.current.value = '';
//   };

//   /* ── Crop selection area style ── */
//   const cropStyle = {
//     left:   crop.x,
//     top:    crop.y,
//     width:  Math.abs(crop.w),
//     height: Math.abs(crop.h),
//     display: crop.w && crop.h ? 'block' : 'none',
//   };

//   /* ── Pixels in natural resolution ── */
//   const scale       = getScaleFactor();
//   const cropNatW    = Math.round(Math.abs(crop.w) * scale);
//   const cropNatH    = Math.round(Math.abs(crop.h) * scale);

//   return (
//     <>
//       <Script id="howto-schema-cropper" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Crop Images Online for Free",
//             description: "Crop JPG, PNG, WebP images with custom or preset aspect ratios.",
//             url: "https://convertlinx.com/image-cropper",
//             step: [
//               { "@type": "HowToStep", name: "Upload Image",   text: "Upload your image — JPG, PNG, or WebP." },
//               { "@type": "HowToStep", name: "Select Crop",    text: "Drag to select the area you want to keep." },
//               { "@type": "HowToStep", name: "Download",       text: "Click crop and download the result." },
//             ],
//             totalTime: "PT20S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//           }, null, 2)
//         }}
//       />

//       {/* Hidden output canvas */}
//       <canvas ref={outputRef} className="hidden" />

//       <main className="icp-page">

//         {/* ── HERO ── */}
//         <section className="icp-hero-bg py-16 px-6 text-center">
//           <div className="icp-hero-blob-1" />
//           <div className="icp-hero-blob-2" />
//           <div className="relative z-10 max-w-3xl mx-auto">
//             <div className="flex items-center justify-center gap-2 text-sm mb-6">
//               <a href="/" className="icp-breadcrumb-link">Home</a>
//               <span style={{ color: '#FCD34D' }}>/</span>
//               <span style={{ color: '#F59E0B' }}>Image Cropper</span>
//             </div>
//             <span className="icp-badge-pill inline-block px-4 py-1.5 rounded-full mb-5">Free Tool</span>
//             <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: '#1a1a2e' }}>
//               Image{' '}
//               <span className="icp-grad-text">Cropper</span>
//             </h1>
//             <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
//               Crop JPG, PNG & WebP images with free-form selection or preset ratios — instantly, free, 100% browser-based.
//             </p>
//           </div>
//         </section>

//         {/* ── TOOL WORKSPACE ── */}
//         <section className="icp-main-section py-10 px-6">
//           <div className="max-w-2xl mx-auto icp-fade-up" ref={containerRef}>
//             <div className="icp-tool-card rounded-3xl p-6 md:p-8">

//               {/* ── Upload ── */}
//               {!imgSrc ? (
//                 <div
//                   className={`icp-upload-area flex flex-col items-center justify-center gap-4 py-14 px-6 ${dragOver ? 'drag-over' : ''}`}
//                   onClick={() => fileRef.current?.click()}
//                   onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//                   onDragLeave={() => setDragOver(false)}
//                   onDrop={onDrop}
//                 >
//                   <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
//                     style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
//                     <Upload className="w-7 h-7" style={{ color: '#F59E0B' }} />
//                   </div>
//                   <div className="text-center">
//                     <p className="font-bold text-base mb-1" style={{ color: '#1a1a2e' }}>Drop your image here</p>
//                     <p className="text-sm" style={{ color: '#9CA3AF' }}>or click to browse — JPG, PNG, WebP supported</p>
//                   </div>
//                   <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
//                 </div>
//               ) : (
//                 <>
//                   {/* ── Preset Buttons ── */}
//                   <div className="mb-4">
//                     <label className="block mb-2" style={{ color: '#F59E0B', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
//                       Aspect Ratio
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       {PRESETS.map((p) => (
//                         <button
//                           key={p.label}
//                           onClick={() => applyPreset(p)}
//                           className={`icp-preset-btn ${preset === p.label ? 'active' : ''}`}
//                         >
//                           {p.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* ── Canvas crop area ── */}
//                   <div
//                     className="icp-canvas-container mb-4"
//                     style={{ width: displayW, maxWidth: '100%' }}
//                     onMouseDown={(e) => onMouseDown(e)}
//                     onMouseMove={onMouseMove}
//                     onMouseUp={onMouseUp}
//                     onMouseLeave={onMouseUp}
//                     onTouchStart={(e) => onMouseDown(e)}
//                     onTouchMove={onMouseMove}
//                     onTouchEnd={onMouseUp}
//                   >
//                     <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />

//                     {/* Crop overlay */}
//                     <div className="icp-crop-overlay" style={cropStyle}>
//                       {/* Corner handles */}
//                       {['tl','tr','bl','br'].map((h) => (
//                         <div
//                           key={h}
//                           className={`icp-handle ${h}`}
//                           onMouseDown={(e) => { e.stopPropagation(); onMouseDown(e, h); }}
//                           onTouchStart={(e) => { e.stopPropagation(); onMouseDown(e, h); }}
//                         />
//                       ))}
//                     </div>
//                   </div>

//                   {/* ── Crop info + reset ── */}
//                   <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
//                     <span className="icp-info-pill">
//                       {cropNatW} × {cropNatH} px
//                       {naturalW ? ` (original: ${naturalW} × ${naturalH})` : ''}
//                     </span>
//                     <button onClick={handleReset} className="text-xs font-semibold flex items-center gap-1"
//                       style={{ color: '#F59E0B' }}>
//                       <RefreshCw className="w-3 h-3" /> Change image
//                     </button>
//                   </div>

//                   {/* ── Format ── */}
//                   <div className="mb-6">
//                     <label className="block mb-2" style={{ color: '#F59E0B', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
//                       Output Format
//                     </label>
//                     <select value={format} onChange={(e) => setFormat(e.target.value)}
//                       className="icp-select w-full px-4 py-3 rounded-xl text-sm">
//                       <option value="original">Same as original</option>
//                       <option value="jpg">JPG</option>
//                       <option value="png">PNG (transparent background)</option>
//                       <option value="webp">WebP</option>
//                     </select>
//                   </div>

//                   {/* ── Crop button ── */}
//                   <button
//                     onClick={handleCrop}
//                     disabled={!crop.w || !crop.h}
//                     className="icp-crop-btn w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base mb-5"
//                   >
//                     <Crop className="w-5 h-5" />
//                     Crop Image
//                   </button>

//                   {/* ── Result ── */}
//                   {result && (
//                     <div className="icp-preview-wrap active icp-scale-pop">
//                       <img src={result.url} alt="Cropped" className="w-full max-h-56 object-contain" />
//                       <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-2"
//                         style={{ background: '#FFFBEB', borderTop: '1px solid #FCD34D' }}>
//                         <span className="icp-info-pill">
//                           {result.w} × {result.h}px • {fmtSize(result.size)}
//                         </span>
//                         <button onClick={handleDownload}
//                           className="icp-download-btn text-white text-sm font-bold px-5 py-2 rounded-xl flex items-center gap-1.5">
//                           <Download className="w-4 h-4" />
//                           Download
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}

//               {/* Trust row */}
//               <div className="flex flex-wrap justify-center gap-5 mt-6">
//                 {['No signup', 'Browser-based', 'Files not uploaded', '100% free'].map((t, i) => (
//                   <span key={i} className="text-xs flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
//                     <span className="w-1 h-1 rounded-full" style={{ background: '#FCD34D' }} />
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── BENEFITS ── */}
//         <hr className="icp-mid-divider" />
//         <section className="icp-alt-section py-16 px-6">
//           <div className="max-w-5xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Why Use ConvertLinx?
//             </h2>
//             <div className="grid md:grid-cols-3 gap-5">
//               {[
//                 { icon: <Crop className="w-6 h-6" />,     color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  title: 'Free-Form Cropping',    desc: 'Drag any area you want to keep. Handles on corners let you resize the selection precisely.' },
//                 { icon: <Upload className="w-6 h-6" />,   color: '#EA580C', bg: 'rgba(234,88,12,0.08)',   title: '100% Browser-Based',    desc: 'Your images never leave your device. Everything processes locally — completely private.' },
//                 { icon: <Download className="w-6 h-6" />, color: '#10B981', bg: 'rgba(16,185,129,0.08)',  title: 'Preset Aspect Ratios',  desc: 'One click for 1:1, 16:9, 4:3, A4, and more — perfect for social media and documents.' },
//               ].map((b, i) => (
//                 <div key={i} className="icp-benefit-card rounded-2xl p-7">
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
//         <hr className="icp-mid-divider" />
//         <section className="icp-main-section py-16 px-6">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
//               3 Simple Steps
//             </h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {[
//                 { num: '1', title: 'Upload Image',   desc: 'Drag & drop or click to upload your JPG, PNG, or WebP.' },
//                 { num: '2', title: 'Select Crop',    desc: 'Drag on the image to select. Use presets for exact ratios.' },
//                 { num: '3', title: 'Download Result',desc: 'Click Crop, choose format, and download your image.' },
//               ].map((s, i) => (
//                 <div key={i} className="icp-step-card rounded-2xl p-7 text-center">
//                   <div className="icp-step-num w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg text-white">
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
//         <hr className="icp-mid-divider" />
//         <section className="icp-alt-section py-16 px-6">
//           <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>
//             <div>
//               <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
//                 Free Image Cropper — ConvertLinx
//               </h2>
//               <p className="leading-7 text-sm">
//                 The <strong>ConvertLinx Image Cropper</strong> lets you crop JPG, PNG, and WebP images
//                 directly in your browser — no software, no signup, and nothing uploaded to any server.
//                 Use free-form drag selection or choose a preset ratio for social media, documents, and more.
//               </p>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>When Do You Need to Crop?</h3>
//               <p className="leading-7 text-sm">
//                 Profile pictures need to be square (1:1), YouTube thumbnails need 16:9, product photos
//                 need consistent framing, and documents need A4 proportions. Cropping is one of the most
//                 common image edits — and it should be fast and private.
//               </p>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Social media — square & 16:9 crops',
//                   'Designers — extract specific elements',
//                   'E-commerce — consistent product shots',
//                   'Developers — prepare image assets',
//                   'Anyone — remove unwanted edges',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-2 text-sm">
//                     <span className="font-bold mt-0.5" style={{ color: '#F59E0B' }}>→</span>
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="icp-seo-box rounded-2xl p-6">
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Free-form drag-to-crop selection',
//                   'Corner handles to resize selection',
//                   'Preset ratios — 1:1, 4:3, 16:9, A4',
//                   'Live pixel dimensions display',
//                   'Output as JPG, PNG, or WebP',
//                   '100% browser-based — no uploads',
//                   'Mobile & touch screen support',
//                   'No watermarks, completely free',
//                 ].map((f, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="icp-feature-dot w-1.5 h-1.5 rounded-full flex-shrink-0" />
//                     <span>{f}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Related Tools */}
//             <div className="rounded-2xl border border-slate-200 bg-white/70 p-5">
//               <p className="text-sm font-semibold text-slate-700 mb-3">You may also find these free tools helpful:</p>
//               <div className="flex flex-wrap gap-2">
//                 {[
//                   { href: '/image-resizer',   label: 'Image Resizer' },
//                   { href: '/image-compressor',label: 'Image Compressor' },
//                   { href: '/image-converter', label: 'Image Converter' },
//                   { href: '/image-to-text',   label: 'Image to Text' },
//                   { href: '/heic-to-jpg',     label: 'HEIC to JPG' },
//                 ].map((t) => (
//                   <a key={t.href} href={t.href}
//                     className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition"
//                     style={{ borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.08)', color: '#92400E' }}>
//                     {t.label}
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── FAQ ── */}
//         <hr className="icp-mid-divider" />
//         <section className="icp-main-section py-16 px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Frequently Asked Questions
//             </h2>
//             <div className="space-y-3">
//               {[
//                 { q: 'Is the image cropper free?',               a: 'Yes — completely free with no signup and no hidden charges.' },
//                 { q: 'Does it upload my image to a server?',     a: 'No. Everything processes locally in your browser. Your images never leave your device.' },
//                 { q: 'What formats are supported?',              a: 'JPG, PNG, WebP, and most common image formats are supported as input.' },
//                 { q: 'Can I crop to an exact ratio?',            a: 'Yes — use the preset buttons (1:1, 4:3, 16:9, A4, etc.) to lock the selection to a specific aspect ratio.' },
//                 { q: 'Does it work on mobile / touch screens?',  a: 'Yes — touch drag is supported for selecting and moving the crop area on phones and tablets.' },
//                 { q: 'Can I save the result as PNG?',            a: 'Yes — choose PNG as the output format. PNG supports transparency, perfect for logos or icons.' },
//               ].map((faq, i) => (
//                 <details key={i} className="icp-faq-item rounded-xl p-5">
//                   <summary className="flex items-center justify-between gap-4">
//                     <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
//                     <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#F59E0B' }} />
//                   </summary>
//                   <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── BOTTOM CTA ── */}
//         <section className="icp-cta-section py-20 px-6 text-center">
//           <div className="max-w-xl mx-auto">
//             <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
//               Ready to crop your image?
//             </h2>
//             <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
//               Takes less than 10 seconds. No signup. No ads.
//             </p>
//             <button
//               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//               className="icp-cta-btn text-white text-base px-10 py-4 rounded-xl inline-flex items-center gap-2"
//             >
//               <Crop className="w-5 h-5" />
//               Crop Image Now
//             </button>
//           </div>
//         </section>

//       </main>
//     </>
//   );
// }