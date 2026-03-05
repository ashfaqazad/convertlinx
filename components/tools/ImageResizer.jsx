'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Maximize2, Lock, Unlock, RefreshCw, ChevronDown, ImageIcon, X, CheckCircle } from 'lucide-react';
import Script from 'next/script';
import '@/styles/ImageResizer.css';

const MAX_FILES = 20;

/* ── Social Media Presets ── */
const PRESETS = [
  { category:'Instagram', name:'Square Post',    w:1080, h:1080 },
  { category:'Instagram', name:'Portrait Post',  w:1080, h:1350 },
  { category:'Instagram', name:'Story / Reel',   w:1080, h:1920 },
  { category:'Instagram', name:'Landscape Post', w:1080, h:566  },
  { category:'YouTube',   name:'Thumbnail',      w:1280, h:720  },
  { category:'YouTube',   name:'Channel Art',    w:2560, h:1440 },
  { category:'Twitter/X', name:'Post Image',     w:1600, h:900  },
  { category:'Twitter/X', name:'Profile Photo',  w:400,  h:400  },
  { category:'Twitter/X', name:'Header',         w:1500, h:500  },
  { category:'Facebook',  name:'Cover Photo',    w:820,  h:312  },
  { category:'Facebook',  name:'Post Image',     w:1200, h:630  },
  { category:'Facebook',  name:'Profile Photo',  w:170,  h:170  },
  { category:'LinkedIn',  name:'Cover Photo',    w:1584, h:396  },
  { category:'LinkedIn',  name:'Post Image',     w:1200, h:627  },
  { category:'General',   name:'HD (1280×720)',  w:1280, h:720  },
  { category:'General',   name:'Full HD',        w:1920, h:1080 },
  { category:'General',   name:'4K UHD',         w:3840, h:2160 },
  { category:'General',   name:'A4 (300dpi)',    w:2480, h:3508 },
];
const CATEGORIES = [...new Set(PRESETS.map(p => p.category))];
const TABS = ['Pixels', 'Percentage', 'Presets'];

/* ── resize one file → blob ── */
const resizeFile = (file, targetW, targetH, mime, quality) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetW; canvas.height = targetH;
      canvas.getContext('2d').drawImage(img, 0, 0, targetW, targetH);
      const q = mime === 'image/png' ? 1 : quality / 100;
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        resolve({ blob, w: targetW, h: targetH, mime, name: file.name });
      }, mime, q);
    };
    img.src = url;
  });

export default function ImageResizer() {
  /* ── files state ──
     each item: { file, url, w, h, status:'idle'|'done'|'error', resultUrl, resultSize }
  */
  const [files,       setFiles]       = useState([]);   // array of file items
  const [activeTab,   setActiveTab]   = useState('Pixels');

  /* Pixels */
  const [pxW,         setPxW]         = useState('');
  const [pxH,         setPxH]         = useState('');
  const [locked,      setLocked]      = useState(true);

  /* Percentage */
  const [pct,         setPct]         = useState(100);

  /* Presets */
  const [activePreset,setActivePreset]= useState(null);
  const [activeCat,   setActiveCat]   = useState('Instagram');

  /* shared */
  const [format,      setFormat]      = useState('original');
  const [quality,     setQuality]     = useState(90);
  const [loading,     setLoading]     = useState(false);
  const [dragOver,    setDragOver]    = useState(false);

  /* single-file preview (first file dims used for lock ratio) */
  const firstFile = files[0] || null;

  const fileRef = useRef(null);

  /* ── helpers ── */
  const fmtSize = (b) =>
    b < 1024 ? b + ' B'
    : b < 1048576 ? (b / 1024).toFixed(1) + ' KB'
    : (b / 1048576).toFixed(2) + ' MB';

  const getMime = (file) => {
    const map = { original: file.type || 'image/jpeg', jpg:'image/jpeg', png:'image/png', webp:'image/webp' };
    return map[format] || 'image/jpeg';
  };

  const getExt = (mime) => ({ 'image/jpeg':'jpg','image/png':'png','image/webp':'webp' }[mime] || 'jpg');

  /* ── load files ── */
  const loadFiles = (fileList) => {
    const arr = Array.from(fileList).filter(f => f.type.startsWith('image/')).slice(0, MAX_FILES);
    if (!arr.length) return;

    const promises = arr.map(file => new Promise(resolve => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => resolve({ file, url, w: img.naturalWidth, h: img.naturalHeight, status:'idle', resultUrl:null, resultSize:0 });
      img.src = url;
    }));

    Promise.all(promises).then(items => {
      setFiles(prev => {
        const combined = [...prev, ...items].slice(0, MAX_FILES);
        // seed Pixels inputs from first file
        if (!prev.length && items.length) {
          setPxW(String(items[0].w));
          setPxH(String(items[0].h));
        }
        return combined;
      });
      setActivePreset(null);
    });
  };

  const onFileChange = (e) => { loadFiles(e.target.files); e.target.value = ''; };
  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    loadFiles(e.dataTransfer.files);
  }, []);

  const removeFile = (idx) => setFiles(prev => prev.filter((_,i) => i !== idx));
  const handleReset = () => {
    setFiles([]); setPxW(''); setPxH(''); setPct(100); setActivePreset(null);
  };

  /* ── Pixels lock ratio (based on first file) ── */
  const onPxW = (val) => {
    setPxW(val);
    if (locked && firstFile && val) {
      const ratio = firstFile.h / firstFile.w;
      setPxH(String(Math.round(parseInt(val) * ratio)));
    }
  };
  const onPxH = (val) => {
    setPxH(val);
    if (locked && firstFile && val) {
      const ratio = firstFile.w / firstFile.h;
      setPxW(String(Math.round(parseInt(val) * ratio)));
    }
  };

  /* ── get target dims ── */
  const getTargetDims = (item) => {
    if (activeTab === 'Pixels') {
      return { w: parseInt(pxW) || item.w, h: parseInt(pxH) || item.h };
    }
    if (activeTab === 'Percentage') {
      return { w: Math.round(item.w * pct / 100), h: Math.round(item.h * pct / 100) };
    }
    if (activeTab === 'Presets' && activePreset) {
      return { w: activePreset.w, h: activePreset.h };
    }
    return { w: item.w, h: item.h };
  };

  /* ── Resize All ── */
  const handleResizeAll = async () => {
    if (!files.length) return;
    setLoading(true);

    const updated = [...files];
    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      const { w, h } = getTargetDims(item);
      const mime = getMime(item.file);
      try {
        const { blob } = await resizeFile(item.file, w, h, mime, quality);
        updated[i] = { ...item, status:'done', resultUrl: URL.createObjectURL(blob), resultSize: blob.size, resultW: w, resultH: h, mime };
      } catch {
        updated[i] = { ...item, status:'error' };
      }
      setFiles([...updated]); // live progress
    }
    setLoading(false);
  };

  /* ── Download single ── */
  const downloadOne = (item) => {
    if (!item.resultUrl) return;
    const a = document.createElement('a');
    a.href     = item.resultUrl;
    a.download = `resized-${item.file.name.replace(/\.[^.]+$/, '')}.${getExt(item.mime)}`;
    a.click();
  };

  /* ── Download All as ZIP ── */
  const [zipping, setZipping] = useState(false);

  const downloadAll = async () => {
    const done = files.filter(f => f.status === 'done');
    if (!done.length) return;
    setZipping(true);
    try {
      // Load JSZip from CDN dynamically
      await new Promise((resolve, reject) => {
        if (window.JSZip) { resolve(); return; }
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
      });
      const zip = new window.JSZip();
      for (const item of done) {
        const resp = await fetch(item.resultUrl);
        const blob = await resp.blob();
        const extMap = { 'image/jpeg':'jpg','image/png':'png','image/webp':'webp' };
        const ext  = extMap[item.mime] || 'jpg';
        const name = `resized-${item.file.name.replace(/\.[^.]+$/, '')}.${ext}`;
        zip.file(name, blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob',
        compression: 'DEFLATE', compressionOptions: { level: 6 } });
      const a = document.createElement('a');
      a.href     = URL.createObjectURL(zipBlob);
      a.download = `resized-convertlinx-${done.length}images.zip`;
      a.click();
    } catch (err) {
      console.error('ZIP failed, falling back:', err);
      for (const item of done) {
        downloadOne(item);
        await new Promise(r => setTimeout(r, 150));
      }
    }
    setZipping(false);
  };

  /* ── Percentage preview dims for first file ── */
  const pctW = firstFile ? Math.round(firstFile.w * pct / 100) : 0;
  const pctH = firstFile ? Math.round(firstFile.h * pct / 100) : 0;

  const doneCount  = files.filter(f => f.status === 'done').length;
  const canResize  = files.length > 0 && (activeTab !== 'Presets' || activePreset);
  const switchTab  = (t) => { setActiveTab(t); setFiles(prev => prev.map(f => ({...f, status:'idle', resultUrl:null}))); };

  return (
    <>
      <Script id="howto-schema-resizer" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context":"https://schema.org","@type":"HowTo",
          name:"How to Resize Images Online for Free",
          url:"https://convertlinx.com/image-resizer",
          step:[
            {"@type":"HowToStep","name":"Upload","text":"Upload up to 20 images at once."},
            {"@type":"HowToStep","name":"Set Dimensions","text":"Choose Pixels, Percentage, or a Preset."},
            {"@type":"HowToStep","name":"Download","text":"Resize and download individually or all at once."},
          ],
          totalTime:"PT30S",
          estimatedCost:{"@type":"MonetaryAmount","value":"0","currency":"USD"},
        })}}
      />

      <main className="ir-page">

        {/* ── HERO ── */}
        <section className="ir-hero-bg py-16 px-6 text-center">
          <div className="ir-hero-blob-1"/><div className="ir-hero-blob-2"/>
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              <a href="/" className="ir-breadcrumb-link">Home</a>
              <span style={{color:'#FDA4AF'}}>/</span>
              <span style={{color:'#F43F5E'}}>Image Resizer</span>
            </div>
            <span className="ir-badge-pill inline-block px-4 py-1.5 rounded-full mb-5">Free Tool</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{color:'#1a1a2e'}}>
              Image <span className="ir-grad-text">Resizer</span>
            </h1>
            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{color:'#6B7280'}}>
              Resize JPG, PNG, WebP and HEIC images to exact pixel dimensions or by percentage — instantly in your browser, no uploads, 100% free.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {['+ No upload needed','+ JPG · PNG · WebP · HEIC','+ Batch up to 20 images','+ Social media presets'].map((t,i)=>(
                <span key={i} className="ir-badge-pill px-3 py-1 rounded-full text-xs">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOOL ── */}
        <section className="ir-main-section py-10 px-6">
          <div className="max-w-2xl mx-auto ir-fade-up">
            <div className="ir-tool-card rounded-3xl p-6 md:p-8">

              {/* ── Upload Drop Zone (always visible if under limit) ── */}
              {files.length < MAX_FILES && (
                <div
                  className={`ir-upload-area flex flex-col items-center justify-center gap-3 py-10 px-6 mb-5 ${dragOver?'drag-over':''}`}
                  onClick={()=>fileRef.current?.click()}
                  onDragOver={(e)=>{e.preventDefault();setDragOver(true);}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={onDrop}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{background:'rgba(244,63,94,0.08)',border:'1px solid rgba(244,63,94,0.15)'}}>
                    <Upload className="w-6 h-6" style={{color:'#F43F5E'}}/>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-base mb-0.5" style={{color:'#1a1a2e'}}>
                      {files.length === 0 ? 'Drop images here' : `Add more images (${files.length}/${MAX_FILES})`}
                    </p>
                    <p className="text-xs" style={{color:'#9CA3AF'}}>
                      Click to browse — JPG, PNG, WebP · up to {MAX_FILES} images
                    </p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFileChange}/>
                </div>
              )}

              {/* ── File List ── */}
              {files.length > 0 && (
                <>
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold" style={{color:'#1a1a2e'}}>
                      {files.length} image{files.length>1?'s':''} selected
                      {doneCount > 0 && <span style={{color:'#10B981'}}> · {doneCount} resized</span>}
                    </p>
                    <button onClick={handleReset}
                      className="text-xs font-semibold flex items-center gap-1" style={{color:'#F43F5E'}}>
                      <RefreshCw className="w-3 h-3"/> Clear all
                    </button>
                  </div>

                  {/* Scrollable file list */}
                  <div className="ir-file-list mb-5">
                    {files.map((item, idx) => (
                      <div key={idx} className={`ir-file-row ${item.status}`}>
                        {/* Thumbnail */}
                        <img src={item.url} alt={item.file.name}
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                          style={{border:'1px solid #FECDD3'}}/>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{color:'#1a1a2e'}}>
                            {item.file.name}
                          </p>
                          <p className="text-xs" style={{color:'#9CA3AF'}}>
                            {item.w}×{item.h}px · {fmtSize(item.file.size)}
                            {item.status==='done' && (
                              <span style={{color:'#10B981'}}>
                                {' '}→ {item.resultW}×{item.resultH}px · {fmtSize(item.resultSize)}
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {item.status === 'done' && (
                            <button onClick={()=>downloadOne(item)}
                              className="ir-dl-single-btn text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                              <Download className="w-3 h-3"/> Save
                            </button>
                          )}
                          {item.status === 'idle' && loading && (
                            <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                              style={{borderColor:'#FECDD3',borderTopColor:'#F43F5E'}}/>
                          )}
                          {item.status === 'done' && (
                            <CheckCircle className="w-4 h-4" style={{color:'#10B981'}}/>
                          )}
                          <button onClick={()=>removeFile(idx)}
                            className="w-6 h-6 rounded-full flex items-center justify-center transition"
                            style={{background:'rgba(244,63,94,0.08)',color:'#F43F5E'}}>
                            <X className="w-3 h-3"/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Original dims hint */}
                  {firstFile && (
                    <div className="ir-size-bar mb-5">
                      {files.length === 1
                        ? <>Original: <strong>{firstFile.w} × {firstFile.h} px</strong> · {fmtSize(firstFile.file.size)}</>
                        : <><strong>{files.length} images</strong> selected · set dimensions below then click Resize</>
                      }
                    </div>
                  )}

                  {/* ── TAB BAR ── */}
                  <div className="ir-tab-bar mb-6">
                    {TABS.map(t=>(
                      <button key={t} onClick={()=>switchTab(t)}
                        className={`ir-tab ${activeTab===t?'active':''}`}>{t}</button>
                    ))}
                  </div>

                  {/* ════ PIXELS TAB ════ */}
                  {activeTab==='Pixels' && (
                    <>
                      <div className="grid grid-cols-3 gap-3 mb-3 items-end">
                        <div>
                          <label className="ir-field-label block mb-1.5">Width (px)</label>
                          <input type="number" min={1} value={pxW}
                            onChange={e=>onPxW(e.target.value)}
                            className="ir-input w-full px-3 py-3 rounded-xl text-sm"
                            placeholder={firstFile?.w || ''}/>
                        </div>
                        <div>
                          <label className="ir-field-label block mb-1.5">Height (px)</label>
                          <input type="number" min={1} value={pxH}
                            onChange={e=>onPxH(e.target.value)}
                            className="ir-input w-full px-3 py-3 rounded-xl text-sm"
                            placeholder={firstFile?.h || ''}/>
                        </div>
                        <div>
                          <label className="ir-field-label block mb-1.5">Format</label>
                          <select value={format} onChange={e=>setFormat(e.target.value)}
                            className="ir-select w-full px-3 py-3 rounded-xl text-sm">
                            <option value="original">Keep original</option>
                            <option value="jpg">JPG</option>
                            <option value="png">PNG</option>
                            <option value="webp">WebP</option>
                          </select>
                        </div>
                      </div>
                      <label className="ir-lock-row mb-5">
                        <input type="checkbox" checked={locked} onChange={e=>setLocked(e.target.checked)}/>
                        <span style={{fontSize:'15px'}}>🔒</span>
                        <span className="ir-lock-label">Lock aspect ratio</span>
                        {files.length > 1 && <span className="text-xs ml-1" style={{color:'#9CA3AF'}}>(based on first image)</span>}
                      </label>
                    </>
                  )}

                  {/* ════ PERCENTAGE TAB ════ */}
                  {activeTab==='Percentage' && (
                    <div className="mb-5">
                      <div className="text-center mb-4">
                        <div className="ir-pct-value">{pct}%</div>
                        {firstFile && (
                          <p className="text-sm mt-1" style={{color:'#9CA3AF'}}>
                            {files.length === 1
                              ? `→ ${pctW} × ${pctH} px`
                              : `Each image scaled to ${pct}% of its original size`}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 mb-5">
                        {[25,50,75,100,125,150,200].map(v=>(
                          <button key={v} onClick={()=>setPct(v)}
                            className="ir-badge-pill px-3 py-1.5 rounded-full text-xs cursor-pointer transition"
                            style={pct===v?{background:'rgba(244,63,94,0.15)',borderColor:'#F43F5E',color:'#BE123C'}:{}}>
                            {v}%
                          </button>
                        ))}
                      </div>
                      <input type="range" min={1} max={300} value={pct}
                        onChange={e=>setPct(parseInt(e.target.value))}
                        className="ir-quality-slider w-full mb-1"/>
                      <div className="flex justify-between text-xs mb-4" style={{color:'#FDA4AF'}}>
                        <span>1%</span><span>300%</span>
                      </div>
                      <div>
                        <label className="ir-field-label block mb-1.5">Format</label>
                        <select value={format} onChange={e=>setFormat(e.target.value)}
                          className="ir-select w-full px-3 py-3 rounded-xl text-sm">
                          <option value="original">Keep original</option>
                          <option value="jpg">JPG</option>
                          <option value="png">PNG</option>
                          <option value="webp">WebP</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* ════ PRESETS TAB ════ */}
                  {activeTab==='Presets' && (
                    <div className="mb-5">
                      {files.length > 1 && (
                        <p className="text-xs mb-3 px-1" style={{color:'#9CA3AF'}}>
                          ⚠️ All {files.length} images will be resized to the same preset dimensions.
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {CATEGORIES.map(cat=>(
                          <button key={cat} onClick={()=>setActiveCat(cat)}
                            className="ir-tab text-xs px-4 py-1.5 rounded-full transition"
                            style={{
                              flex:'none',
                              background: activeCat===cat ? '#ffffff' : '#FFF1F2',
                              border: activeCat===cat ? '1.5px solid #F43F5E' : '1.5px solid #FECDD3',
                              color: activeCat===cat ? '#F43F5E' : '#9CA3AF',
                              boxShadow: activeCat===cat ? '0 2px 8px rgba(244,63,94,0.15)' : 'none',
                            }}>
                            {cat}
                          </button>
                        ))}
                      </div>
                      <div className="ir-preset-grid mb-4">
                        {PRESETS.filter(p=>p.category===activeCat).map((p,i)=>(
                          <button key={i} onClick={()=>setActivePreset(p)}
                            className={`ir-preset-btn ${activePreset===p?'active':''}`}>
                            <div className="ir-preset-name">{p.name}</div>
                            <div className="ir-preset-size">{p.w} × {p.h} px</div>
                          </button>
                        ))}
                      </div>
                      <div>
                        <label className="ir-field-label block mb-1.5">Format</label>
                        <select value={format} onChange={e=>setFormat(e.target.value)}
                          className="ir-select w-full px-3 py-3 rounded-xl text-sm">
                          <option value="original">Keep original</option>
                          <option value="jpg">JPG</option>
                          <option value="png">PNG</option>
                          <option value="webp">WebP</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* ── Quality slider ── */}
                  {format !== 'png' && (
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <label className="ir-field-label">Quality</label>
                        <span className="text-sm font-bold" style={{color:'#F43F5E'}}>{quality}%</span>
                      </div>
                      <input type="range" min={10} max={100} step={5} value={quality}
                        onChange={e=>setQuality(parseInt(e.target.value))}
                        className="ir-quality-slider"/>
                      <div className="flex justify-between text-xs mt-1" style={{color:'#FDA4AF'}}>
                        <span>Smaller file</span><span>Best quality</span>
                      </div>
                    </div>
                  )}

                  {/* ── Resize Button ── */}
                  <button onClick={handleResizeAll}
                    disabled={loading || !canResize}
                    className="ir-resize-btn w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base mb-2">
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                          Resizing {files.filter(f=>f.status==='done').length}/{files.length}...</>
                      : <><Maximize2 className="w-5 h-5"/>
                          Resize {files.length > 1 ? `${files.length} Images` : 'Image'}</>
                    }
                  </button>

                  {/* hint / Download All */}
                  {doneCount === 0 && !loading && (
                    <p className="text-center text-xs mb-1" style={{color:'#9CA3AF'}}>
                      Set your dimensions and click Resize
                    </p>
                  )}
                  {doneCount > 0 && (
                    <button onClick={downloadAll} disabled={zipping}
                      className="ir-download-all-btn w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold mt-1">
                      {zipping
                        ? <><span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                            style={{borderColor:'rgba(244,63,94,0.3)',borderTopColor:'#F43F5E'}}/>
                            Creating ZIP...</>
                        : <><Download className="w-4 h-4"/>
                            Download All as ZIP ({doneCount} image{doneCount>1?'s':''})</>
                      }
                    </button>
                  )}
                </>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No signup','Browser-based','Files not uploaded','100% free'].map((t,i)=>(
                  <span key={i} className="text-xs flex items-center gap-1.5" style={{color:'#9CA3AF'}}>
                    <span className="w-1 h-1 rounded-full" style={{background:'#FDA4AF'}}/>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="ir-mid-divider"/>
        <section className="ir-alt-section py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{color:'#1a1a2e'}}>Why Use ConvertLinx?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {icon:<Lock className="w-6 h-6"/>,      color:'#F43F5E',bg:'rgba(244,63,94,0.08)', title:'100% Private',        desc:'Images are resized entirely in your browser. Nothing is ever uploaded to any server.'},
                {icon:<Maximize2 className="w-6 h-6"/>, color:'#8B5CF6',bg:'rgba(139,92,246,0.08)',title:'Aspect Ratio Lock',   desc:'Enter width or height and the other dimension updates automatically — no distortion ever.'},
                {icon:<ImageIcon className="w-6 h-6"/>, color:'#10B981',bg:'rgba(16,185,129,0.08)', title:'Social Media Presets',desc:'One-click presets for Instagram, Facebook, Twitter, YouTube and more — perfectly sized every time.'},
              ].map((b,i)=>(
                <div key={i} className="ir-benefit-card rounded-2xl p-7">
                  <div className="p-3 rounded-xl inline-flex mb-5" style={{background:b.bg,color:b.color}}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{color:'#1a1a2e'}}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color:'#6B7280'}}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW TO ── */}
        <hr className="ir-mid-divider"/>
        <section className="ir-main-section py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{color:'#1a1a2e'}}>3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {num:'1',title:'Upload Images',   desc:'Drag & drop or click to upload — single image or up to 20 at once.'},
                {num:'2',title:'Set Dimensions',  desc:'Use Pixels for exact size, Percentage to scale, or Presets for social media.'},
                {num:'3',title:'Download Results',desc:'Click Resize and download each file individually or all at once.'},
              ].map((s,i)=>(
                <div key={i} className="ir-step-card rounded-2xl p-7 text-center">
                  <div className="ir-step-num w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg text-white">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{color:'#1a1a2e'}}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color:'#6B7280'}}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="ir-mid-divider"/>
        <section className="ir-alt-section py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{color:'#1a1a2e'}}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                {q:'How do I resize an image without losing quality?',  a:'Shrinking an image always maintains quality since you\'re removing pixels. Enlarging beyond original size will reduce sharpness — always work with high resolution originals for best results.'},
                {q:'Can I resize HEIC photos from my iPhone?',          a:'Yes — upload your HEIC files directly. They\'ll be decoded in your browser and resized to your chosen dimensions. Perfect for resizing iPhone photos before sharing on Windows or Android devices.'},
                {q:'What does locking the aspect ratio mean?',          a:'Aspect ratio is the proportional relationship between width and height. Locking it means when you change one dimension the other adjusts automatically — keeping your image proportional and preventing distortion.'},
                {q:'What size should I use for Instagram?',             a:'1080×1080 for square posts, 1080×1350 for portrait posts and 1080×1920 for Stories and Reels. Use our Instagram presets for one-click sizing.'},
                {q:'Can I resize multiple images at once?',             a:'Yes — upload up to 20 images at once and they\'ll all be resized to the same dimensions. Download individually or use Download All.'},
                {q:'Can I resize by percentage instead of pixels?',     a:'Yes — switch to the Percentage tab and use the slider or quick buttons (25%, 50%, 75%, etc.) to scale images by any percentage from 1% to 300%.'},
              ].map((faq,i)=>(
                <details key={i} className="ir-faq-item rounded-xl p-5">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{color:'#374151'}}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" style={{color:'#F43F5E'}}/>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{color:'#6B7280'}}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO + Related ── */}
        <hr className="ir-mid-divider"/>
        <section className="ir-main-section py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="ir-seo-box rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{color:'#1a1a2e'}}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Batch resize — up to 20 images at once',
                  'Pixels tab — exact W × H dimensions',
                  'Percentage tab — scale by % (1–300%)',
                  'Presets — Instagram, YouTube, Twitter…',
                  'Lock / unlock aspect ratio',
                  'Output as JPG, PNG, or WebP',
                  'Quality slider for file size control',
                  '100% browser-based — no uploads',
                ].map((f,i)=>(
                  <div key={i} className="flex items-center gap-2.5 text-sm" style={{color:'#6B7280'}}>
                    <span className="ir-feature-dot w-1.5 h-1.5 rounded-full"/>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5">
              <p className="text-sm font-semibold text-slate-700 mb-3">You may also find these free tools helpful:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  {href:'/image-cropper',   label:'Image Cropper'},
                  {href:'/image-compressor',label:'Image Compressor'},
                  {href:'/image-converter', label:'Image Converter'},
                  {href:'/image-to-text',   label:'Image to Text'},
                  {href:'/heic-to-jpg',     label:'HEIC to JPG'},
                ].map(t=>(
                  <a key={t.href} href={t.href}
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition"
                    style={{borderColor:'rgba(244,63,94,0.2)',background:'rgba(244,63,94,0.06)',color:'#BE123C'}}>
                    {t.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ir-cta-section py-20 px-6 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">Ready to resize your images?</h2>
            <p className="mb-8 text-base" style={{color:'rgba(255,255,255,0.75)'}}>
              Single or batch — takes seconds. No signup. No ads.
            </p>
            <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
              className="ir-cta-btn text-white text-base px-10 py-4 rounded-xl inline-flex items-center gap-2">
              <Maximize2 className="w-5 h-5"/> Resize Images Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}