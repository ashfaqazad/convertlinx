'use client';

import { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { Upload, Copy, FileText, Zap, Shield, CheckCircle, ChevronDown, Download, Camera } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';
import '@/styles/ImageToText.css';

// Number of FAQs that are written out by hand in the JSX below.
// Anything after this index in the `faqs` array is rendered automatically.
const HAND_WRITTEN_FAQ_COUNT = 9;

// OCR languages (Tesseract language codes)
const LANGUAGES = [
  { code: 'eng',     label: 'English' },
  { code: 'urd',     label: 'Urdu (اردو)' },
  { code: 'urd+eng', label: 'Urdu + English' },
  { code: 'ara',     label: 'Arabic (العربية)' },
  { code: 'hin',     label: 'Hindi (हिन्दी)' },
  { code: 'spa',     label: 'Spanish' },
  { code: 'fra',     label: 'French' },
  { code: 'deu',     label: 'German' },
  { code: 'por',     label: 'Portuguese' },
  { code: 'ita',     label: 'Italian' },
];
const RTL_LANGS = ['urd', 'urd+eng', 'ara'];

export default function ImageToText({ seo }) {
  const [image,    setImage]    = useState(null);
  const [text,     setText]     = useState('');
  const [loading,  setLoading]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [status,   setStatus]   = useState('Extracting text...');
  const [copied,   setCopied]   = useState(false);
  const [lang,     setLang]     = useState(seo?.defaultLang || 'eng');
  const [enhance,  setEnhance]  = useState(false);
  const [lastFile, setLastFile] = useState(null);

  const isRTL = RTL_LANGS.includes(lang);

  // NEW: optional pre-processing (upscale small images + grayscale + contrast)
  const prepareImage = (file) =>
    new Promise((resolve) => {
      if (!enhance) return resolve(file);
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(3, Math.max(1, 1600 / Math.max(img.width, 1)));
          let w = Math.round(img.width * scale);
          let h = Math.round(img.height * scale);
          if (w * h > 25000000) { w = img.width; h = img.height; }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);
          const data = ctx.getImageData(0, 0, w, h);
          const px = data.data;
          for (let i = 0; i < px.length; i += 4) {
            const g = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
            const c = Math.max(0, Math.min(255, (g - 128) * 1.3 + 128));
            px[i] = px[i + 1] = px[i + 2] = c;
          }
          ctx.putImageData(data, 0, 0);
          URL.revokeObjectURL(url);
          resolve(canvas);
        } catch (err) {
          URL.revokeObjectURL(url);
          resolve(file);
        }
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });

  const doOCR = async (file, langOverride) => {
    if (!file) return;
    const runLang = langOverride || lang;
    setLoading(true);
    setText('');
    setProgress(0);
    setStatus('Preparing image...');
    setLastFile(file);
    if (image) URL.revokeObjectURL(image);
    setImage(URL.createObjectURL(file));

    const source = await prepareImage(file);

    Tesseract.recognize(source, runLang, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setStatus('Extracting text...');
          setProgress(Math.round(m.progress * 100));
        } else if (typeof m.status === 'string' && m.status.includes('language')) {
          setStatus('Loading language data (first time can take a little longer)...');
        }
      },
    })
      .then(({ data: { text } }) => {
        setText(text.trim() || 'No text found. Try a clearer image with visible text.');
      })
      .catch(() => {
        setText('Something went wrong. Try a sharper image with clear text.');
      })
      .finally(() => setLoading(false));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) doOCR(file);
  };

  // NEW: paste a screenshot with Ctrl+V / Cmd+V
  useEffect(() => {
    const onPaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type && item.type.startsWith('image/')) {
          const f = item.getAsFile();
          if (f) { e.preventDefault(); doOCR(f); break; }
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, enhance, image]);

  // NEW: changing language after an upload re-scans the same image
  const changeLang = (e) => {
    const next = e.target.value;
    setLang(next);
    if (lastFile) doOCR(lastFile, next);
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      q: 'Is Image to Text OCR free?',
      a: 'Yes — completely free with unlimited usage and no hidden charges or signup required.'
    },
    {
      q: 'Which image formats are supported?',
      a: 'JPG, PNG, WebP, and other common image formats are supported. If you have HEIC photos from an iPhone, convert them first using our HEIC to JPG converter.'
    },
    {
      q: 'How accurate is the OCR?',
      a: 'Very accurate for clear printed text. Blurry images or low resolution may reduce accuracy. You can pre-process or adjust your files using our Image Converter for best results.'
    },
    {
      q: 'Can it read handwritten text?',
      a: 'It may work for neat, clean handwriting, but printed text gives the best results. Once extracted, you can check text details or word count with our Word Counter.'
    },
    {
      q: 'Do you store my images or extracted text?',
      a: 'No — everything runs entirely in your browser. Your images are never uploaded to any server and nothing is stored or logged.'
    },
    {
      q: 'Can I use this on mobile?',
      a: 'Yes — fully optimized for mobile devices and desktops. You can also quickly generate access links or QR codes for your files using our QR Code Generator.'
    },
    {
      q: 'Can I extract text from a screenshot?',
      a: 'Yes — screenshots work perfectly. If you need to compress large screenshot files before sharing, try our Image Compressor.'
    },
    {
      q: 'Can I extract text from a scanned PDF page?',
      a: 'Yes — export your scanned PDF page as an image or take a screenshot, then upload it here. You can also tweak casing on extracted text with our Case Converter.'
    },
    {
      // UPDATED: the old answer said "English only", which is no longer true now that a language menu exists
      q: 'What languages does the OCR support?',
      a: 'You can choose English, Urdu, Arabic, Hindi, Spanish, French, German, Portuguese or Italian from the language menu. English gives the highest accuracy. Urdu and Arabic work best on clear printed text and are less accurate on decorative fonts or handwriting.'
    },

    // ── NEW FAQs (rendered automatically + included in FAQ schema) ──
    {
      q: 'How do I convert image to text online?',
      a: 'Upload your picture, wait a few seconds while the OCR reads it, then copy the extracted text or download it as a TXT file. It works as an image to text converter for photos, screenshots and scanned pages, with no signup.'
    },
    {
      q: 'Is this a scan to text converter I can use online?',
      a: 'Yes. Take a clear photo or scan of your page, upload it, and the tool converts the scanned image to text. It works as an online text scanner: you scan text online without installing any app or software.'
    },
    {
      q: 'Can I convert an image to a TXT file?',
      a: 'Yes. After the text is extracted, press the Download TXT button to convert the image to a TXT file and save it on your device. You can also copy the text to your clipboard.'
    },
    {
      q: 'How do I turn a photo into text on my phone?',
      a: 'Open this page on your phone, tap Take photo or the upload box, choose a photo and wait for the result. Good light and a straight, sharp photo of printed text give the best result.'
    },
    {
      q: 'Does the OCR keep the original formatting?',
      a: 'The tool extracts the words and keeps line breaks as plain text. It does not keep fonts, bold text, colours or table layouts, so you may need to format the text again in your editor after copying it.'
    },
    {
      q: 'Is this an image text extractor for handwriting too?',
      a: 'It works best on printed text. Neat, clear handwriting may be recognised, but messy or cursive handwriting often needs manual corrections, which you can do in the editable text box.'
    },
    {
      q: 'Can I extract Urdu text from an image?',
      a: 'Yes. Choose Urdu or Urdu + English from the language menu and upload your image. Urdu OCR works best on clear, high-resolution printed text such as screenshots and digital documents. Calligraphic Nastaliq fonts and handwriting are harder to read, so expect some mistakes. Tick the Enhance image option and fix small errors in the editable box.'
    },
    {
      q: 'Can I paste a screenshot instead of uploading it?',
      a: 'Yes. On a computer, take a screenshot, open this page and press Ctrl+V (Cmd+V on Mac). The screenshot is pasted and the text is extracted automatically.'
    },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script id="howto-schema-img-text" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'HowTo',
            name: 'How to Extract Text from Image Online for Free',
            description: 'Use OCR to convert photos, screenshots, and scanned documents to editable text instantly — free, private, no uploads.',
            url: `https://convertlinx.com${seo?.canonical || '/image-to-text'}`,
            totalTime: 'PT30S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'JPG, PNG, or WebP image containing text' }],
            tool:  [{ '@type': 'HowToTool',   name: 'ConvertLinx Image to Text OCR'            }],
            step: [
              { '@type': 'HowToStep', name: 'Upload Image',       text: 'Drop or click to select a photo, screenshot, or scanned document containing text.' },
              { '@type': 'HowToStep', name: 'Wait a Few Seconds', text: 'OCR runs automatically in your browser — no server needed. A progress bar shows the status.' },
              { '@type': 'HowToStep', name: 'Copy Text',          text: 'Review the extracted text in the editable textarea and copy it to your clipboard with one click.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: FAQPage ── */}
      <Script id="faq-schema-img-text" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />

      <main className="it-page">

        {/* ── HERO ── */}
        <section className="it-hero">
          <div className="it-blob-1" />
          <div className="it-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <Link href="/" className="it-breadcrumb-link">Home</Link>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#0891B2' }}>{seo?.breadcrumb || 'Image to Text'}</span>
            </div>
            <span className="it-badge">OCR Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              {seo?.h1
                ? seo.h1
                : <>Image to <span className="it-grad-text">Text (OCR)</span></>}
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Extract text from photos, screenshots, scans, and documents instantly using
              browser-based OCR. Copy editable text in seconds — 100% private,
              nothing uploaded, no signup required.
            </p>
            <p className="text-sm max-w-2xl mx-auto leading-relaxed mt-3" style={{ color: '#6B7280' }}>
              {seo?.intro ||
                'Use it as an image to text converter, photo to text converter or online text scanner: upload a picture, scan text online, then copy the result or download it as a TXT file.'}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {['No upload needed', 'JPG · PNG · WebP', 'Screenshots & scans', 'Unlimited OCR', '100% private'].map((t, i) => (
                <span key={i} className="it-badge px-3 py-1 rounded-full text-xs">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="it-section-main py-10 px-6">
          <div className="max-w-3xl mx-auto it-fade-up">
            <div className="it-tool-card">

              {/* NEW: language + enhance options */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <label htmlFor="ocr-lang"
                    style={{ color: '#0891B2', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                    Language
                  </label>
                  <select
                    id="ocr-lang"
                    value={lang}
                    onChange={changeLang}
                    disabled={loading}
                    style={{ border: '1px solid #A5F3FC', borderRadius: '10px', padding: '6px 10px', fontSize: '13px', color: '#374151', background: '#fff' }}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer" style={{ color: '#6B7280' }}>
                  <input
                    type="checkbox"
                    checked={enhance}
                    onChange={(e) => setEnhance(e.target.checked)}
                    disabled={loading}
                  />
                  Enhance image (helps small or blurry text)
                </label>
              </div>
              {(lang === 'urd' || lang === 'urd+eng' || lang === 'ara') && (
                <p className="text-xs mb-4" style={{ color: '#9CA3AF' }}>
                  Urdu and Arabic OCR works best on clear, high-resolution printed text. Decorative (Nastaliq) fonts and handwriting may give mistakes — you can fix them in the editable box. The language data downloads once the first time you use it.
                </p>
              )}

              {/* Upload Area */}
              {!image && !loading && (
                <>
                  <label className="block mb-2"
                    style={{ color: '#0891B2', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                    Upload Image
                  </label>
                  <label className="it-upload-area" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                    <div className="it-upload-icon">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
                      Drop image here or click to upload
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                      JPG, PNG, WebP · Screenshots, scans, photos with text
                    </p>
                    <p className="text-xs leading-relaxed mt-1 hidden md:block" style={{ color: '#9CA3AF' }}>
                      Tip: take a screenshot and press Ctrl+V to paste it here
                    </p>
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) doOCR(f); }}
                      className="hidden"
                    />
                  </label>

                  {/* NEW: camera button (phones) */}
                  <label className="md:hidden flex items-center justify-center gap-2 mt-3 text-sm font-semibold cursor-pointer"
                    style={{ color: '#0891B2' }}>
                    <Camera className="w-5 h-5" /> Take photo
                    <input
                      type="file" accept="image/*" capture="environment"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) doOCR(f); }}
                      className="hidden"
                    />
                  </label>
                </>
              )}

              {/* Loading / Progress */}
              {loading && (
                <div className="text-center py-10">
                  <div className="it-progress-wrap mb-3">
                    <div className="it-progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#0891B2' }}>
                    {status} {progress > 0 ? `${progress}%` : ''}
                  </p>
                </div>
              )}

              {/* Result — Image + Text side by side */}
              {!loading && text && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="it-image-card">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
                      Your Image
                    </p>
                    <img src={image} alt="Uploaded" className="w-full rounded-xl object-cover" />
                    <label className="block mt-4 text-center text-xs font-semibold cursor-pointer" style={{ color: '#0891B2' }}>
                      <input
                        type="file" accept="image/*"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) doOCR(f); }}
                        className="hidden"
                      />
                      ↺ Try another image
                    </label>
                  </div>
                  <div className="it-text-card">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#0891B2' }}>
                      Extracted Text
                    </p>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="it-textarea"
                      spellCheck={false}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      style={isRTL ? { textAlign: 'right', lineHeight: 1.9, fontSize: '16px' } : undefined}
                    />
                    <button onClick={copyText} className={`it-copy-btn ${copied ? 'copied' : ''}`}>
                      {copied
                        ? <><CheckCircle className="w-5 h-5" /> Copied!</>
                        : <><Copy className="w-5 h-5" /> Copy to Clipboard</>
                      }
                    </button>
                    <button onClick={downloadTxt} className="it-copy-btn" style={{ marginTop: '10px' }}>
                      <Download className="w-5 h-5" /> Download TXT
                    </button>
                  </div>
                </div>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No signup', 'Nothing uploaded', '100% private', 'Unlimited OCR', 'Free forever'].map((t, i) => (
                  <span key={i} className="it-trust-item">
                    <span className="it-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="it-divider" />
        <section className="it-section-alt py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx OCR?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: <FileText className="w-6 h-6" />, color: '#0891B2', bg: 'rgba(6,182,212,0.08)',   title: 'High Accuracy',    desc: 'Extracts text from photos, scans, and screenshots with high accuracy — even handles clear handwriting.' },
                { icon: <Zap className="w-6 h-6" />,      color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  title: 'Fast Processing',  desc: 'Results in seconds — OCR runs directly in your browser with no server delay or queue.' },
                { icon: <Shield className="w-6 h-6" />,   color: '#10B981', bg: 'rgba(16,185,129,0.08)',  title: '100% Private',     desc: 'Nothing ever leaves your device — no upload, no storage, no server. Fully secure and private.' },
              ].map((b, i) => (
                <div key={i} className="it-benefit-card">
                  <div className="it-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="it-divider" />
        <section className="it-section-main py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Upload Image',       desc: 'Drop or click to select a photo, screenshot, or scanned document containing text.' },
                { num: '2', title: 'Wait a Few Seconds', desc: 'OCR runs automatically in your browser — no server needed. Progress bar shows status.' },
                { num: '3', title: 'Copy Text',          desc: 'Review the result in the editable textarea and copy extracted text with one click.' },
              ].map((s, i) => (
                <div key={i} className="it-step-card">
                  <div className="it-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT WITH CONTEXTUAL INTERLINKING ── */}
        <hr className="it-divider" />
        <section className="it-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            {/* NEW: unique paragraph per variant page (comes from seoData `extra`) */}
            {seo?.extra && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                  {seo.extraTitle || seo.h1}
                </h2>
                <p className="leading-7 text-sm">{seo.extra}</p>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Why You Need a Free Image to Text OCR Tool
              </h2>
              <p className="leading-7 text-sm">
                Text trapped inside images cannot be copied, searched, or edited. Whether it is
                a screenshot of an article, a photo of a receipt, a scanned contract, or a
                picture of handwritten notes — you need OCR to unlock that text. Manually
                retyping it wastes time and introduces errors. After extracting your text, you can calculate word density using our <Link href="/word-counter" className="text-cyan-600 hover:underline font-medium">Word Counter</Link> or format text casing effortlessly via the <Link href="/case-converter" className="text-cyan-600 hover:underline font-medium">Case Converter</Link>.
              </p>
              <p className="leading-7 text-sm mt-3">
                This free image to text converter uses Tesseract OCR running entirely in your
                browser — no file is ever sent to a server. If you are working with mobile camera photos or iOS screenshots, consider optimizing them with our <Link href="/heic-to-jpg" className="text-cyan-600 hover:underline font-medium">HEIC to JPG Converter</Link> or resizing large documents through our <Link href="/image-resizer" className="text-cyan-600 hover:underline font-medium">Image Resizer</Link> before processing.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Convert Image to Text Online — Image Text Extractor for Photos, Scans and Screenshots
              </h2>
              <p className="leading-7 text-sm">
                If you search for an image to text converter, a photo to text converter or a picture to text OCR tool, you are looking for the same thing: a way to convert image to text so you can copy, edit and search it. This image text extractor reads the words in your picture and gives you plain, editable text. You can also use it as an online text scanner: scan text online by uploading a photo of a page, a sign, a receipt or a screenshot.
              </p>
              <p className="leading-7 text-sm mt-3">
                People describe this tool in many ways: scan to text, scan image to text, scanned image to text, image to text reader, text scanner from image, image scanner to text, image to OCR, or OCR text extraction. They all mean optical character recognition (OCR), where the software finds letters in the pixels and turns them into text characters. Whether you want to turn a photo into text, convert a picture to text, convert an image into text or convert image to TXT, the steps are the same.
              </p>

              <h3 className="font-bold text-lg mt-6 mb-3" style={{ color: '#1a1a2e' }}>
                How to Convert a Scanned Image to Text
              </h3>
              <p className="leading-7 text-sm">
                Take a clear photo or scan of the page, upload it, wait a few seconds and copy the result. To convert scan to text for a document with many pages, process one page image at a time. If you need a file, press the Download TXT button to convert the image to a TXT file and save the text on your device.
              </p>

              <h3 className="font-bold text-lg mt-6 mb-3" style={{ color: '#1a1a2e' }}>
                Screenshot to Text and Handwriting
              </h3>
              <p className="leading-7 text-sm">
                A screenshot to text converter gives the best results because screenshots have sharp, high-contrast letters. On a computer you can simply press Ctrl+V to paste a screenshot, and on a phone you can use the Take photo button. For handwriting, the result depends on how neat the writing is: tidy block letters can work, while cursive and messy notes often need manual fixing in the editable box. Printed text always gives the most accurate result.
              </p>

              <h3 className="font-bold text-lg mt-6 mb-3" style={{ color: '#1a1a2e' }}>
                Urdu, Arabic, Hindi and Other Languages
              </h3>
              <p className="leading-7 text-sm">
                Choose your language from the menu above the upload box before or after you upload. You can extract Urdu text from an image (Urdu or Urdu + English), as well as Arabic, Hindi, Spanish, French, German, Portuguese and Italian. Urdu OCR works best on clear printed text. Calligraphic Nastaliq fonts and handwriting are much harder for OCR software, so check the result and correct small mistakes in the editable box.
              </p>

              <h3 className="font-bold text-lg mt-6 mb-3" style={{ color: '#1a1a2e' }}>
                About Formatted Text, Parsing and Decoding
              </h3>
              <p className="leading-7 text-sm">
                Some people search for an image to formatted text converter, or a way to parse text from an image or decode an image to text. This tool extracts the words and keeps line breaks as plain text. It does not keep fonts, bold text, colours or table layouts, so you may need to format the text again in your editor after copying it.
              </p>

              <h3 className="font-bold text-lg mt-6 mb-3" style={{ color: '#1a1a2e' }}>
                Tips for Better OCR Results
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm leading-7">
                <li>Use good light and keep the camera straight above the page, not tilted</li>
                <li>Choose a sharp, high-resolution picture with dark text on a light background</li>
                <li>Tick Enhance image if the text is small, faint or slightly blurry</li>
                <li>Crop away borders and other objects with our <Link href="/image-cropper" className="text-cyan-600 hover:underline font-medium">Image Cropper</Link> so only the text remains</li>
                <li>Convert unusual file types to JPG or PNG first using the <Link href="/image-converter" className="text-cyan-600 hover:underline font-medium">Image Converter</Link></li>
                <li>Check the extracted text and fix small mistakes in the editable box before copying</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                What Makes OCR Accurate?
              </h3>
              <p className="leading-7 text-sm">
                OCR accuracy depends heavily on image quality. High-contrast text on a clean
                background gives near-perfect results. If you need to convert file formats before running recognition, check out our <Link href="/image-converter" className="text-cyan-600 hover:underline font-medium">Image Converter</Link>. Furthermore, if you are compressing images to save storage, our <Link href="/image-compressor" className="text-cyan-600 hover:underline font-medium">Image Compressor</Link> keeps image dimensions intact for optimal text detection.
              </p>
            </div>

            <div className="it-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Problems This Tool Solves
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Copy text from a screenshot you cannot select',
                  'Extract text from a scanned PDF or document',
                  'Convert a photo of a receipt or invoice to text',
                  'Get editable text from an image of a book or article',
                  'Extract address or phone number from a photo',
                  'Convert handwritten notes to typed text',
                  'Convert a scanned image to text without installing software',
                  'Save extracted text as a TXT file',
                  'Extract Urdu or Arabic text from a clear printed image',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="it-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Students — extract notes, books, and study screenshots',
                  'Office users — convert scanned docs to editable text',
                  'Freelancers — pull text from receipts and invoices',
                  'Researchers — extract quotes from image-based sources',
                  'Writers — reuse content from screenshots or scans',
                  'Anyone — quick copyable text from any image',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#0891B2' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="it-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Free, unlimited OCR — no daily limits',
                  'Photos, screenshots & scans supported',
                  'Fast results in seconds',
                  'High accuracy for clear printed text',
                  'One-click copy to clipboard',
                  'Download the result as a TXT file',
                  'Paste screenshots with Ctrl+V',
                  'Take a photo directly on your phone',
                  'Multiple languages including Urdu and Arabic',
                  'Editable textarea — fix errors manually',
                  'Works on mobile & desktop',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="it-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ WITH CONTEXTUAL INTERLINKING ── */}
        <hr className="it-divider" />
        <section className="it-section-main py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Is Image to Text OCR free?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  Yes — completely free with unlimited usage and no hidden charges or signup required.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Which image formats are supported?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  JPG, PNG, WebP, and other common image formats are supported. If you have HEIC photos from an iPhone, convert them first using our <Link href="/heic-to-jpg" className="text-cyan-600 hover:underline">HEIC to JPG Converter</Link>.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>How accurate is the OCR?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  Very accurate for clear printed text. Blurry images or low resolution may reduce accuracy. You can pre-process or adjust your files using our <Link href="/image-converter" className="text-cyan-600 hover:underline">Image Converter</Link> for best results.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can it read handwritten text?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  It may work for neat, clean handwriting, but printed text gives the best results. Once extracted, you can check text details or word count with our <Link href="/word-counter" className="text-cyan-600 hover:underline">Word Counter</Link>.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Do you store my images or extracted text?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  No — everything runs entirely in your browser. Your images are never uploaded to any server and nothing is stored or logged.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can I use this on mobile?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  Yes — fully optimized for mobile devices and desktops. You can also quickly generate access links or QR codes for your files using our <Link href="/qr-generator" className="text-cyan-600 hover:underline">QR Code Generator</Link>.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can I extract text from a screenshot?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  Yes — screenshots work perfectly. If you need to compress large screenshot files before sharing, try our <Link href="/image-compressor" className="text-cyan-600 hover:underline">Image Compressor</Link>.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can I extract text from a scanned PDF page?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  Yes — export your scanned PDF page as an image or take a screenshot, then upload it here. You can also tweak casing on extracted text with our <Link href="/case-converter" className="text-cyan-600 hover:underline">Case Converter</Link>.
                </p>
              </details>

              <details className="it-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#374151' }}>What languages does the OCR support?</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  You can choose English, Urdu, Arabic, Hindi, Spanish, French, German, Portuguese or Italian from the language menu. English gives the highest accuracy. Urdu and Arabic work best on clear printed text and are less accurate on decorative fonts or handwriting.
                </p>
              </details>

              {/* NEW FAQs — rendered from the faqs array (same text as in the FAQ schema) */}
              {faqs.slice(HAND_WRITTEN_FAQ_COUNT).map((faq, i) => (
                <details key={`new-${i}`} className="it-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="it-divider" />
        <section className="it-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Image Compressor', href: '/image-compressor' },
                { name: 'Image Converter',  href: '/image-converter'  },
                { name: 'HEIC to JPG',       href: '/heic-to-jpg'      },
                { name: 'QR Generator',     href: '/qr-generator'     },
                { name: 'Word Counter',     href: '/word-counter'     },
                { name: 'Case Converter',   href: '/case-converter'   },
                { name: 'Image Resizer',    href: '/image-resizer'    },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:border-cyan-600"
                  style={{ color: '#0891B2', borderColor: '#A5F3FC', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="it-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to extract text from your image?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 5 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="it-cta-btn"
            >
              <Upload className="w-5 h-5" /> Extract Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}













































// 'use client';

// import { useState } from 'react';
// import Tesseract from 'tesseract.js';
// import { Upload, Copy, FileText, Zap, Shield, CheckCircle, ChevronDown, Download } from 'lucide-react';
// import Script from 'next/script';
// import Link from 'next/link';
// import '@/styles/ImageToText.css';

// // Number of FAQs that are written out by hand in the JSX below.
// // Anything after this index in the `faqs` array is rendered automatically.
// const HAND_WRITTEN_FAQ_COUNT = 9;

// export default function ImageToText() {
//   const [image,    setImage]    = useState(null);
//   const [text,     setText]     = useState('');
//   const [loading,  setLoading]  = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [copied,   setCopied]   = useState(false);

//   const doOCR = (file) => {
//     if (!file) return;
//     setLoading(true);
//     setText('');
//     setProgress(0);
//     setImage(URL.createObjectURL(file));

//     Tesseract.recognize(file, 'eng', {
//       logger: (m) => {
//         if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100));
//       },
//     })
//       .then(({ data: { text } }) => {
//         setText(text.trim() || 'No text found. Try a clearer image with visible text.');
//       })
//       .catch(() => {
//         setText('Something went wrong. Try a sharper image with clear text.');
//       })
//       .finally(() => setLoading(false));
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith('image/')) doOCR(file);
//   };

//   const copyText = () => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   // NEW: save the extracted text as a .txt file
//   const downloadTxt = () => {
//     const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'extracted-text.txt';
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   };

//   const faqs = [
//     {
//       q: 'Is Image to Text OCR free?',
//       a: 'Yes — completely free with unlimited usage and no hidden charges or signup required.'
//     },
//     {
//       q: 'Which image formats are supported?',
//       a: 'JPG, PNG, WebP, and other common image formats are supported. If you have HEIC photos from an iPhone, convert them first using our HEIC to JPG converter.'
//     },
//     {
//       q: 'How accurate is the OCR?',
//       a: 'Very accurate for clear printed text. Blurry images or low resolution may reduce accuracy. You can pre-process or adjust your files using our Image Converter for best results.'
//     },
//     {
//       q: 'Can it read handwritten text?',
//       a: 'It may work for neat, clean handwriting, but printed text gives the best results. Once extracted, you can check text details or word count with our Word Counter.'
//     },
//     {
//       q: 'Do you store my images or extracted text?',
//       a: 'No — everything runs entirely in your browser. Your images are never uploaded to any server and nothing is stored or logged.'
//     },
//     {
//       q: 'Can I use this on mobile?',
//       a: 'Yes — fully optimized for mobile devices and desktops. You can also quickly generate access links or QR codes for your files using our QR Code Generator.'
//     },
//     {
//       q: 'Can I extract text from a screenshot?',
//       a: 'Yes — screenshots work perfectly. If you need to compress large screenshot files before sharing, try our Image Compressor.'
//     },
//     {
//       q: 'Can I extract text from a scanned PDF page?',
//       a: 'Yes — export your scanned PDF page as an image or take a screenshot, then upload it here. You can also tweak casing on extracted text with our Case Converter.'
//     },
//     {
//       q: 'What languages does the OCR support?',
//       a: 'The tool currently processes English text with high accuracy. Use images containing printed text with good contrast and resolution.'
//     },

//     // ── NEW FAQs (rendered automatically + included in FAQ schema) ──
//     {
//       q: 'How do I convert image to text online?',
//       a: 'Upload your picture, wait a few seconds while the OCR reads it, then copy the extracted text or download it as a TXT file. It works as an image to text converter for photos, screenshots and scanned pages, with no signup.'
//     },
//     {
//       q: 'Is this a scan to text converter I can use online?',
//       a: 'Yes. Take a clear photo or scan of your page, upload it, and the tool converts the scanned image to text. It works as an online text scanner: you scan text online without installing any app or software.'
//     },
//     {
//       q: 'Can I convert an image to a TXT file?',
//       a: 'Yes. After the text is extracted, press the Download TXT button to convert the image to a TXT file and save it on your device. You can also copy the text to your clipboard.'
//     },
//     {
//       q: 'How do I turn a photo into text on my phone?',
//       a: 'Open this page on your phone, tap the upload box, take or choose a photo and wait for the result. Good light and a straight, sharp photo of printed text give the best result.'
//     },
//     {
//       q: 'Does the OCR keep the original formatting?',
//       a: 'The tool extracts the words and keeps line breaks as plain text. It does not keep fonts, bold text, colours or table layouts, so you may need to format the text again in your editor after copying it.'
//     },
//     {
//       q: 'Is this an image text extractor for handwriting too?',
//       a: 'It works best on printed text. Neat, clear handwriting may be recognised, but messy or cursive handwriting often needs manual corrections, which you can do in the editable text box.'
//     },
//   ];

//   return (
//     <>
//       {/* ── SCHEMA: HowTo ── */}
//       <Script id="howto-schema-img-text" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             '@context': 'https://schema.org', '@type': 'HowTo',
//             name: 'How to Extract Text from Image Online for Free',
//             description: 'Use OCR to convert photos, screenshots, and scanned documents to editable text instantly — free, private, no uploads.',
//             url: 'https://convertlinx.com/image-to-text',
//             totalTime: 'PT30S',
//             estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
//             supply: [{ '@type': 'HowToSupply', name: 'JPG, PNG, or WebP image containing text' }],
//             tool:  [{ '@type': 'HowToTool',   name: 'ConvertLinx Image to Text OCR'            }],
//             step: [
//               { '@type': 'HowToStep', name: 'Upload Image',       text: 'Drop or click to select a photo, screenshot, or scanned document containing text.' },
//               { '@type': 'HowToStep', name: 'Wait a Few Seconds', text: 'OCR runs automatically in your browser — no server needed. A progress bar shows the status.' },
//               { '@type': 'HowToStep', name: 'Copy Text',          text: 'Review the extracted text in the editable textarea and copy it to your clipboard with one click.' },
//             ],
//           }),
//         }}
//       />

//       {/* ── SCHEMA: FAQPage ── */}
//       <Script id="faq-schema-img-text" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             '@context': 'https://schema.org', '@type': 'FAQPage',
//             mainEntity: faqs.map(faq => ({
//               '@type': 'Question',
//               name: faq.q,
//               acceptedAnswer: { '@type': 'Answer', text: faq.a },
//             })),
//           }),
//         }}
//       />

//       <main className="it-page">

//         {/* ── HERO ── */}
//         <section className="it-hero">
//           <div className="it-blob-1" />
//           <div className="it-blob-2" />
//           <div className="relative z-10 max-w-3xl mx-auto">
//             <div className="flex items-center justify-center gap-2 text-sm mb-5">
//               <Link href="/" className="it-breadcrumb-link">Home</Link>
//               <span style={{ color: '#C4B5FD' }}>/</span>
//               <span style={{ color: '#0891B2' }}>Image to Text</span>
//             </div>
//             <span className="it-badge">OCR Tool</span>
//             <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
//               Image to <span className="it-grad-text">Text (OCR)</span>
//             </h1>
//             <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
//               Extract text from photos, screenshots, scans, and documents instantly using
//               browser-based OCR. Copy editable text in seconds — 100% private,
//               nothing uploaded, no signup required.
//             </p>
//             {/* NEW: extra keyword line (original paragraph above is unchanged) */}
//             <p className="text-sm max-w-2xl mx-auto leading-relaxed mt-3" style={{ color: '#6B7280' }}>
//               Use it as an image to text converter, photo to text converter or online text scanner:
//               upload a picture, scan text online, then copy the result or download it as a TXT file.
//             </p>
//             <div className="flex flex-wrap justify-center gap-2 mt-5">
//               {['No upload needed', 'JPG · PNG · WebP', 'Screenshots & scans', 'Unlimited OCR', '100% private'].map((t, i) => (
//                 <span key={i} className="it-badge px-3 py-1 rounded-full text-xs">{t}</span>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── TOOL WORKSPACE ── */}
//         <section className="it-section-main py-10 px-6">
//           <div className="max-w-3xl mx-auto it-fade-up">
//             <div className="it-tool-card">

//               {/* Upload Area */}
//               {!image && !loading && (
//                 <>
//                   <label className="block mb-2"
//                     style={{ color: '#0891B2', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
//                     Upload Image
//                   </label>
//                   <label className="it-upload-area" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
//                     <div className="it-upload-icon">
//                       <Upload className="w-8 h-8" />
//                     </div>
//                     <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
//                       Drop image here or click to upload
//                     </p>
//                     <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
//                       JPG, PNG, WebP · Screenshots, scans, photos with text
//                     </p>
//                     <input
//                       type="file" accept="image/*"
//                       onChange={(e) => { const f = e.target.files?.[0]; if (f) doOCR(f); }}
//                       className="hidden"
//                     />
//                   </label>
//                 </>
//               )}

//               {/* Loading / Progress */}
//               {loading && (
//                 <div className="text-center py-10">
//                   <div className="it-progress-wrap mb-3">
//                     <div className="it-progress-bar" style={{ width: `${progress}%` }} />
//                   </div>
//                   <p className="text-sm font-bold" style={{ color: '#0891B2' }}>
//                     Extracting text... {progress}%
//                   </p>
//                 </div>
//               )}

//               {/* Result — Image + Text side by side */}
//               {!loading && text && (
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="it-image-card">
//                     <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
//                       Your Image
//                     </p>
//                     <img src={image} alt="Uploaded" className="w-full rounded-xl object-cover" />
//                     <label className="block mt-4 text-center text-xs font-semibold cursor-pointer" style={{ color: '#0891B2' }}>
//                       <input
//                         type="file" accept="image/*"
//                         onChange={(e) => { const f = e.target.files?.[0]; if (f) doOCR(f); }}
//                         className="hidden"
//                       />
//                       ↺ Try another image
//                     </label>
//                   </div>
//                   <div className="it-text-card">
//                     <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#0891B2' }}>
//                       Extracted Text
//                     </p>
//                     <textarea
//                       value={text}
//                       onChange={(e) => setText(e.target.value)}
//                       className="it-textarea"
//                       spellCheck={false}
//                     />
//                     <button onClick={copyText} className={`it-copy-btn ${copied ? 'copied' : ''}`}>
//                       {copied
//                         ? <><CheckCircle className="w-5 h-5" /> Copied!</>
//                         : <><Copy className="w-5 h-5" /> Copy to Clipboard</>
//                       }
//                     </button>
//                     {/* NEW: download as TXT */}
//                     <button onClick={downloadTxt} className="it-copy-btn" style={{ marginTop: '10px' }}>
//                       <Download className="w-5 h-5" /> Download TXT
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Trust row */}
//               <div className="flex flex-wrap justify-center gap-5 mt-6">
//                 {['No signup', 'Nothing uploaded', '100% private', 'Unlimited OCR', 'Free forever'].map((t, i) => (
//                   <span key={i} className="it-trust-item">
//                     <span className="it-trust-dot" />
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── BENEFITS ── */}
//         <hr className="it-divider" />
//         <section className="it-section-alt py-16 px-6">
//           <div className="max-w-5xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Why Use ConvertLinx OCR?
//             </h2>
//             <div className="grid md:grid-cols-3 gap-5">
//               {[
//                 { icon: <FileText className="w-6 h-6" />, color: '#0891B2', bg: 'rgba(6,182,212,0.08)',   title: 'High Accuracy',    desc: 'Extracts text from photos, scans, and screenshots with high accuracy — even handles clear handwriting.' },
//                 { icon: <Zap className="w-6 h-6" />,      color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  title: 'Fast Processing',  desc: 'Results in seconds — OCR runs directly in your browser with no server delay or queue.' },
//                 { icon: <Shield className="w-6 h-6" />,   color: '#10B981', bg: 'rgba(16,185,129,0.08)',  title: '100% Private',     desc: 'Nothing ever leaves your device — no upload, no storage, no server. Fully secure and private.' },
//               ].map((b, i) => (
//                 <div key={i} className="it-benefit-card">
//                   <div className="it-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
//                   <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
//                   <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── HOW IT WORKS ── */}
//         <hr className="it-divider" />
//         <section className="it-section-main py-16 px-6">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>3 Simple Steps</h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {[
//                 { num: '1', title: 'Upload Image',       desc: 'Drop or click to select a photo, screenshot, or scanned document containing text.' },
//                 { num: '2', title: 'Wait a Few Seconds', desc: 'OCR runs automatically in your browser — no server needed. Progress bar shows status.' },
//                 { num: '3', title: 'Copy Text',          desc: 'Review the result in the editable textarea and copy extracted text with one click.' },
//               ].map((s, i) => (
//                 <div key={i} className="it-step-card">
//                   <div className="it-step-num">{s.num}</div>
//                   <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
//                   <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── SEO CONTENT WITH CONTEXTUAL INTERLINKING ── */}
//         <hr className="it-divider" />
//         <section className="it-section-alt py-16 px-6">
//           <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

//             <div>
//               <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
//                 Why You Need a Free Image to Text OCR Tool
//               </h2>
//               <p className="leading-7 text-sm">
//                 Text trapped inside images cannot be copied, searched, or edited. Whether it is
//                 a screenshot of an article, a photo of a receipt, a scanned contract, or a
//                 picture of handwritten notes — you need OCR to unlock that text. Manually
//                 retyping it wastes time and introduces errors. After extracting your text, you can calculate word density using our <Link href="/word-counter" className="text-cyan-600 hover:underline font-medium">Word Counter</Link> or format text casing effortlessly via the <Link href="/case-converter" className="text-cyan-600 hover:underline font-medium">Case Converter</Link>.
//               </p>
//               <p className="leading-7 text-sm mt-3">
//                 This free image to text converter uses Tesseract OCR running entirely in your
//                 browser — no file is ever sent to a server. If you are working with mobile camera photos or iOS screenshots, consider optimizing them with our <Link href="/heic-to-jpg" className="text-cyan-600 hover:underline font-medium">HEIC to JPG Converter</Link> or resizing large documents through our <Link href="/image-resizer" className="text-cyan-600 hover:underline font-medium">Image Resizer</Link> before processing.
//               </p>
//             </div>

//             {/* ── NEW: covers queries that were missing or weak ── */}
//             <div>
//               <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
//                 Convert Image to Text Online — Image Text Extractor for Photos, Scans and Screenshots
//               </h2>
//               <p className="leading-7 text-sm">
//                 If you search for an image to text converter, a photo to text converter or a picture to text OCR tool, you are looking for the same thing: a way to convert image to text so you can copy, edit and search it. This image text extractor reads the words in your picture and gives you plain, editable text. You can also use it as an online text scanner: scan text online by uploading a photo of a page, a sign, a receipt or a screenshot.
//               </p>
//               <p className="leading-7 text-sm mt-3">
//                 People describe this tool in many ways: scan to text, scan image to text, scanned image to text, image to text reader, text scanner from image, image scanner to text, image to OCR, or OCR text extraction. They all mean optical character recognition (OCR), where the software finds letters in the pixels and turns them into text characters. Whether you want to turn a photo into text, convert a picture to text, convert an image into text or convert image to TXT, the steps are the same.
//               </p>

//               <h3 className="font-bold text-lg mt-6 mb-3" style={{ color: '#1a1a2e' }}>
//                 How to Convert a Scanned Image to Text
//               </h3>
//               <p className="leading-7 text-sm">
//                 Take a clear photo or scan of the page, upload it, wait a few seconds and copy the result. To convert scan to text for a document with many pages, process one page image at a time. If you need a file, press the Download TXT button to convert the image to a TXT file and save the text on your device.
//               </p>

//               <h3 className="font-bold text-lg mt-6 mb-3" style={{ color: '#1a1a2e' }}>
//                 Screenshot to Text and Handwriting
//               </h3>
//               <p className="leading-7 text-sm">
//                 A screenshot to text converter gives the best results because screenshots have sharp, high-contrast letters. For handwriting, the result depends on how neat the writing is: tidy block letters can work, while cursive and messy notes often need manual fixing in the editable box. Printed text always gives the most accurate result.
//               </p>

//               <h3 className="font-bold text-lg mt-6 mb-3" style={{ color: '#1a1a2e' }}>
//                 About Formatted Text, Parsing and Decoding
//               </h3>
//               <p className="leading-7 text-sm">
//                 Some people search for an image to formatted text converter, or a way to parse text from an image or decode an image to text. This tool extracts the words and keeps line breaks as plain text. It does not keep fonts, bold text, colours or table layouts, so you may need to format the text again in your editor after copying it.
//               </p>

//               <h3 className="font-bold text-lg mt-6 mb-3" style={{ color: '#1a1a2e' }}>
//                 Tips for Better OCR Results
//               </h3>
//               <ul className="list-disc list-inside space-y-2 text-sm leading-7">
//                 <li>Use good light and keep the camera straight above the page, not tilted</li>
//                 <li>Choose a sharp, high-resolution picture with dark text on a light background</li>
//                 <li>Crop away borders and other objects with our <Link href="/image-cropper" className="text-cyan-600 hover:underline font-medium">Image Cropper</Link> so only the text remains</li>
//                 <li>Convert unusual file types to JPG or PNG first using the <Link href="/image-converter" className="text-cyan-600 hover:underline font-medium">Image Converter</Link></li>
//                 <li>Check the extracted text and fix small mistakes in the editable box before copying</li>
//               </ul>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
//                 What Makes OCR Accurate?
//               </h3>
//               <p className="leading-7 text-sm">
//                 OCR accuracy depends heavily on image quality. High-contrast text on a clean
//                 background gives near-perfect results. If you need to convert file formats before running recognition, check out our <Link href="/image-converter" className="text-cyan-600 hover:underline font-medium">Image Converter</Link>. Furthermore, if you are compressing images to save storage, our <Link href="/image-compressor" className="text-cyan-600 hover:underline font-medium">Image Compressor</Link> keeps image dimensions intact for optimal text detection.
//               </p>
//             </div>

//             <div className="it-seo-box">
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
//                 Common Problems This Tool Solves
//               </h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Copy text from a screenshot you cannot select',
//                   'Extract text from a scanned PDF or document',
//                   'Convert a photo of a receipt or invoice to text',
//                   'Get editable text from an image of a book or article',
//                   'Extract address or phone number from a photo',
//                   'Convert handwritten notes to typed text',
//                   'Convert a scanned image to text without installing software',
//                   'Save extracted text as a TXT file',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="it-feature-dot" />
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Students — extract notes, books, and study screenshots',
//                   'Office users — convert scanned docs to editable text',
//                   'Freelancers — pull text from receipts and invoices',
//                   'Researchers — extract quotes from image-based sources',
//                   'Writers — reuse content from screenshots or scans',
//                   'Anyone — quick copyable text from any image',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-2 text-sm">
//                     <span className="font-bold mt-0.5" style={{ color: '#0891B2' }}>→</span>
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="it-seo-box">
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Free, unlimited OCR — no daily limits',
//                   'Photos, screenshots & scans supported',
//                   'Fast results in seconds',
//                   'High accuracy for clear printed text',
//                   'One-click copy to clipboard',
//                   'Download the result as a TXT file',
//                   'Editable textarea — fix errors manually',
//                   'Works on mobile & desktop',
//                   'Nothing stored — full privacy',
//                 ].map((f, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="it-feature-dot" />
//                     <span>{f}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </section>

//         {/* ── FAQ WITH CONTEXTUAL INTERLINKING ── */}
//         <hr className="it-divider" />
//         <section className="it-section-main py-16 px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Frequently Asked Questions
//             </h2>
//             <div className="space-y-3">
//               <details className="it-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Is Image to Text OCR free?</span>
//                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
//                 </summary>
//                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
//                   Yes — completely free with unlimited usage and no hidden charges or signup required.
//                 </p>
//               </details>

//               <details className="it-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Which image formats are supported?</span>
//                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
//                 </summary>
//                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
//                   JPG, PNG, WebP, and other common image formats are supported. If you have HEIC photos from an iPhone, convert them first using our <Link href="/heic-to-jpg" className="text-cyan-600 hover:underline">HEIC to JPG Converter</Link>.
//                 </p>
//               </details>

//               <details className="it-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>How accurate is the OCR?</span>
//                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
//                 </summary>
//                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
//                   Very accurate for clear printed text. Blurry images or low resolution may reduce accuracy. You can pre-process or adjust your files using our <Link href="/image-converter" className="text-cyan-600 hover:underline">Image Converter</Link> for best results.
//                 </p>
//               </details>

//               <details className="it-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can it read handwritten text?</span>
//                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
//                 </summary>
//                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
//                   It may work for neat, clean handwriting, but printed text gives the best results. Once extracted, you can check text details or word count with our <Link href="/word-counter" className="text-cyan-600 hover:underline">Word Counter</Link>.
//                 </p>
//               </details>

//               <details className="it-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Do you store my images or extracted text?</span>
//                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
//                 </summary>
//                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
//                   No — everything runs entirely in your browser. Your images are never uploaded to any server and nothing is stored or logged.
//                 </p>
//               </details>

//               <details className="it-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can I use this on mobile?</span>
//                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
//                 </summary>
//                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
//                   Yes — fully optimized for mobile devices and desktops. You can also quickly generate access links or QR codes for your files using our <Link href="/qr-generator" className="text-cyan-600 hover:underline">QR Code Generator</Link>.
//                 </p>
//               </details>

//               <details className="it-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can I extract text from a screenshot?</span>
//                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
//                 </summary>
//                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
//                   Yes — screenshots work perfectly. If you need to compress large screenshot files before sharing, try our <Link href="/image-compressor" className="text-cyan-600 hover:underline">Image Compressor</Link>.
//                 </p>
//               </details>

//               <details className="it-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can I extract text from a scanned PDF page?</span>
//                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
//                 </summary>
//                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
//                   Yes — export your scanned PDF page as an image or take a screenshot, then upload it here. You can also tweak casing on extracted text with our <Link href="/case-converter" className="text-cyan-600 hover:underline">Case Converter</Link>.
//                 </p>
//               </details>

//               <details className="it-faq-item">
//                 <summary className="flex items-center justify-between gap-4">
//                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>What languages does the OCR support?</span>
//                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
//                 </summary>
//                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
//                   The tool currently processes English text with high accuracy. Use images containing printed text with good contrast and resolution.
//                 </p>
//               </details>

//               {/* NEW FAQs — rendered from the faqs array (same text as in the FAQ schema) */}
//               {faqs.slice(HAND_WRITTEN_FAQ_COUNT).map((faq, i) => (
//                 <details key={`new-${i}`} className="it-faq-item">
//                   <summary className="flex items-center justify-between gap-4">
//                     <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
//                     <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
//                   </summary>
//                   <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
//                     {faq.a}
//                   </p>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── RELATED TOOLS ── */}
//         <hr className="it-divider" />
//         <section className="it-section-alt py-14 px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
//               You may also find these free tools helpful
//             </h2>
//             <div className="flex flex-wrap justify-center gap-3">
//               {[
//                 { name: 'Image Compressor', href: '/image-compressor' },
//                 { name: 'Image Converter',  href: '/image-converter'  },
//                 { name: 'HEIC to JPG',       href: '/heic-to-jpg'      },
//                 { name: 'QR Generator',     href: '/qr-generator'     },
//                 { name: 'Word Counter',     href: '/word-counter'     },
//                 { name: 'Case Converter',   href: '/case-converter'   },
//                 { name: 'Image Resizer',    href: '/image-resizer'    },
//               ].map((tool, i) => (
//                 <Link
//                   key={i}
//                   href={tool.href}
//                   className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:border-cyan-600"
//                   style={{ color: '#0891B2', borderColor: '#A5F3FC', background: '#fff' }}
//                 >
//                   {tool.name}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── CTA ── */}
//         <section className="it-cta-section">
//           <div className="max-w-xl mx-auto">
//             <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
//               Ready to extract text from your image?
//             </h2>
//             <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
//               Takes 5 seconds. No signup. No ads.
//             </p>
//             <button
//               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//               className="it-cta-btn"
//             >
//               <Upload className="w-5 h-5" /> Extract Now
//             </button>
//           </div>
//         </section>

//       </main>
//     </>
//   );
// }




































// // 'use client';

// // import { useState } from 'react';
// // import Tesseract from 'tesseract.js';
// // import { Upload, Copy, FileText, Zap, Shield, CheckCircle, ChevronDown } from 'lucide-react';
// // import Script from 'next/script';
// // import Link from 'next/link';
// // import '@/styles/ImageToText.css';

// // export default function ImageToText() {
// //   const [image,    setImage]    = useState(null);
// //   const [text,     setText]     = useState('');
// //   const [loading,  setLoading]  = useState(false);
// //   const [progress, setProgress] = useState(0);
// //   const [copied,   setCopied]   = useState(false);

// //   const doOCR = (file) => {
// //     if (!file) return;
// //     setLoading(true);
// //     setText('');
// //     setProgress(0);
// //     setImage(URL.createObjectURL(file));

// //     Tesseract.recognize(file, 'eng', {
// //       logger: (m) => {
// //         if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100));
// //       },
// //     })
// //       .then(({ data: { text } }) => {
// //         setText(text.trim() || 'No text found. Try a clearer image with visible text.');
// //       })
// //       .catch(() => {
// //         setText('Something went wrong. Try a sharper image with clear text.');
// //       })
// //       .finally(() => setLoading(false));
// //   };

// //   const handleDrop = (e) => {
// //     e.preventDefault();
// //     const file = e.dataTransfer.files[0];
// //     if (file && file.type.startsWith('image/')) doOCR(file);
// //   };

// //   const copyText = () => {
// //     navigator.clipboard.writeText(text);
// //     setCopied(true);
// //     setTimeout(() => setCopied(false), 2000);
// //   };

// //   const faqs = [
// //     {
// //       q: 'Is Image to Text OCR free?',
// //       a: 'Yes — completely free with unlimited usage and no hidden charges or signup required.'
// //     },
// //     {
// //       q: 'Which image formats are supported?',
// //       a: 'JPG, PNG, WebP, and other common image formats are supported. If you have HEIC photos from an iPhone, convert them first using our HEIC to JPG converter.'
// //     },
// //     {
// //       q: 'How accurate is the OCR?',
// //       a: 'Very accurate for clear printed text. Blurry images or low resolution may reduce accuracy. You can pre-process or adjust your files using our Image Converter for best results.'
// //     },
// //     {
// //       q: 'Can it read handwritten text?',
// //       a: 'It may work for neat, clean handwriting, but printed text gives the best results. Once extracted, you can check text details or word count with our Word Counter.'
// //     },
// //     {
// //       q: 'Do you store my images or extracted text?',
// //       a: 'No — everything runs entirely in your browser. Your images are never uploaded to any server and nothing is stored or logged.'
// //     },
// //     {
// //       q: 'Can I use this on mobile?',
// //       a: 'Yes — fully optimized for mobile devices and desktops. You can also quickly generate access links or QR codes for your files using our QR Code Generator.'
// //     },
// //     {
// //       q: 'Can I extract text from a screenshot?',
// //       a: 'Yes — screenshots work perfectly. If you need to compress large screenshot files before sharing, try our Image Compressor.'
// //     },
// //     {
// //       q: 'Can I extract text from a scanned PDF page?',
// //       a: 'Yes — export your scanned PDF page as an image or take a screenshot, then upload it here. You can also tweak casing on extracted text with our Case Converter.'
// //     },
// //     {
// //       q: 'What languages does the OCR support?',
// //       a: 'The tool currently processes English text with high accuracy. Use images containing printed text with good contrast and resolution.'
// //     },
// //   ];

// //   return (
// //     <>
// //       {/* ── SCHEMA: HowTo ── */}
// //       <Script id="howto-schema-img-text" type="application/ld+json" strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             '@context': 'https://schema.org', '@type': 'HowTo',
// //             name: 'How to Extract Text from Image Online for Free',
// //             description: 'Use OCR to convert photos, screenshots, and scanned documents to editable text instantly — free, private, no uploads.',
// //             url: 'https://convertlinx.com/image-to-text',
// //             totalTime: 'PT30S',
// //             estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
// //             supply: [{ '@type': 'HowToSupply', name: 'JPG, PNG, or WebP image containing text' }],
// //             tool:  [{ '@type': 'HowToTool',   name: 'ConvertLinx Image to Text OCR'            }],
// //             step: [
// //               { '@type': 'HowToStep', name: 'Upload Image',       text: 'Drop or click to select a photo, screenshot, or scanned document containing text.' },
// //               { '@type': 'HowToStep', name: 'Wait a Few Seconds', text: 'OCR runs automatically in your browser — no server needed. A progress bar shows the status.' },
// //               { '@type': 'HowToStep', name: 'Copy Text',          text: 'Review the extracted text in the editable textarea and copy it to your clipboard with one click.' },
// //             ],
// //           }),
// //         }}
// //       />

// //       {/* ── SCHEMA: FAQPage ── */}
// //       <Script id="faq-schema-img-text" type="application/ld+json" strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             '@context': 'https://schema.org', '@type': 'FAQPage',
// //             mainEntity: faqs.map(faq => ({
// //               '@type': 'Question',
// //               name: faq.q,
// //               acceptedAnswer: { '@type': 'Answer', text: faq.a },
// //             })),
// //           }),
// //         }}
// //       />

// //       <main className="it-page">

// //         {/* ── HERO ── */}
// //         <section className="it-hero">
// //           <div className="it-blob-1" />
// //           <div className="it-blob-2" />
// //           <div className="relative z-10 max-w-3xl mx-auto">
// //             <div className="flex items-center justify-center gap-2 text-sm mb-5">
// //               <Link href="/" className="it-breadcrumb-link">Home</Link>
// //               <span style={{ color: '#C4B5FD' }}>/</span>
// //               <span style={{ color: '#0891B2' }}>Image to Text</span>
// //             </div>
// //             <span className="it-badge">OCR Tool</span>
// //             <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
// //               Image to <span className="it-grad-text">Text (OCR)</span>
// //             </h1>
// //             <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
// //               Extract text from photos, screenshots, scans, and documents instantly using
// //               browser-based OCR. Copy editable text in seconds — 100% private,
// //               nothing uploaded, no signup required.
// //             </p>
// //             <div className="flex flex-wrap justify-center gap-2 mt-5">
// //               {['No upload needed', 'JPG · PNG · WebP', 'Screenshots & scans', 'Unlimited OCR', '100% private'].map((t, i) => (
// //                 <span key={i} className="it-badge px-3 py-1 rounded-full text-xs">{t}</span>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── TOOL WORKSPACE ── */}
// //         <section className="it-section-main py-10 px-6">
// //           <div className="max-w-3xl mx-auto it-fade-up">
// //             <div className="it-tool-card">

// //               {/* Upload Area */}
// //               {!image && !loading && (
// //                 <>
// //                   <label className="block mb-2"
// //                     style={{ color: '#0891B2', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
// //                     Upload Image
// //                   </label>
// //                   <label className="it-upload-area" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
// //                     <div className="it-upload-icon">
// //                       <Upload className="w-8 h-8" />
// //                     </div>
// //                     <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
// //                       Drop image here or click to upload
// //                     </p>
// //                     <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
// //                       JPG, PNG, WebP · Screenshots, scans, photos with text
// //                     </p>
// //                     <input
// //                       type="file" accept="image/*"
// //                       onChange={(e) => { const f = e.target.files?.[0]; if (f) doOCR(f); }}
// //                       className="hidden"
// //                     />
// //                   </label>
// //                 </>
// //               )}

// //               {/* Loading / Progress */}
// //               {loading && (
// //                 <div className="text-center py-10">
// //                   <div className="it-progress-wrap mb-3">
// //                     <div className="it-progress-bar" style={{ width: `${progress}%` }} />
// //                   </div>
// //                   <p className="text-sm font-bold" style={{ color: '#0891B2' }}>
// //                     Extracting text... {progress}%
// //                   </p>
// //                 </div>
// //               )}

// //               {/* Result — Image + Text side by side */}
// //               {!loading && text && (
// //                 <div className="grid md:grid-cols-2 gap-6">
// //                   <div className="it-image-card">
// //                     <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
// //                       Your Image
// //                     </p>
// //                     <img src={image} alt="Uploaded" className="w-full rounded-xl object-cover" />
// //                     <label className="block mt-4 text-center text-xs font-semibold cursor-pointer" style={{ color: '#0891B2' }}>
// //                       <input
// //                         type="file" accept="image/*"
// //                         onChange={(e) => { const f = e.target.files?.[0]; if (f) doOCR(f); }}
// //                         className="hidden"
// //                       />
// //                       ↺ Try another image
// //                     </label>
// //                   </div>
// //                   <div className="it-text-card">
// //                     <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#0891B2' }}>
// //                       Extracted Text
// //                     </p>
// //                     <textarea
// //                       value={text}
// //                       onChange={(e) => setText(e.target.value)}
// //                       className="it-textarea"
// //                       spellCheck={false}
// //                     />
// //                     <button onClick={copyText} className={`it-copy-btn ${copied ? 'copied' : ''}`}>
// //                       {copied
// //                         ? <><CheckCircle className="w-5 h-5" /> Copied!</>
// //                         : <><Copy className="w-5 h-5" /> Copy to Clipboard</>
// //                       }
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Trust row */}
// //               <div className="flex flex-wrap justify-center gap-5 mt-6">
// //                 {['No signup', 'Nothing uploaded', '100% private', 'Unlimited OCR', 'Free forever'].map((t, i) => (
// //                   <span key={i} className="it-trust-item">
// //                     <span className="it-trust-dot" />
// //                     {t}
// //                   </span>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── BENEFITS ── */}
// //         <hr className="it-divider" />
// //         <section className="it-section-alt py-16 px-6">
// //           <div className="max-w-5xl mx-auto">
// //             <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
// //               Why Use ConvertLinx OCR?
// //             </h2>
// //             <div className="grid md:grid-cols-3 gap-5">
// //               {[
// //                 { icon: <FileText className="w-6 h-6" />, color: '#0891B2', bg: 'rgba(6,182,212,0.08)',   title: 'High Accuracy',    desc: 'Extracts text from photos, scans, and screenshots with high accuracy — even handles clear handwriting.' },
// //                 { icon: <Zap className="w-6 h-6" />,      color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  title: 'Fast Processing',  desc: 'Results in seconds — OCR runs directly in your browser with no server delay or queue.' },
// //                 { icon: <Shield className="w-6 h-6" />,   color: '#10B981', bg: 'rgba(16,185,129,0.08)',  title: '100% Private',     desc: 'Nothing ever leaves your device — no upload, no storage, no server. Fully secure and private.' },
// //               ].map((b, i) => (
// //                 <div key={i} className="it-benefit-card">
// //                   <div className="it-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
// //                   <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
// //                   <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── HOW IT WORKS ── */}
// //         <hr className="it-divider" />
// //         <section className="it-section-main py-16 px-6">
// //           <div className="max-w-4xl mx-auto">
// //             <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>3 Simple Steps</h2>
// //             <div className="grid md:grid-cols-3 gap-6">
// //               {[
// //                 { num: '1', title: 'Upload Image',       desc: 'Drop or click to select a photo, screenshot, or scanned document containing text.' },
// //                 { num: '2', title: 'Wait a Few Seconds', desc: 'OCR runs automatically in your browser — no server needed. Progress bar shows status.' },
// //                 { num: '3', title: 'Copy Text',          desc: 'Review the result in the editable textarea and copy extracted text with one click.' },
// //               ].map((s, i) => (
// //                 <div key={i} className="it-step-card">
// //                   <div className="it-step-num">{s.num}</div>
// //                   <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
// //                   <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── SEO CONTENT WITH CONTEXTUAL INTERLINKING ── */}
// //         <hr className="it-divider" />
// //         <section className="it-section-alt py-16 px-6">
// //           <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

// //             <div>
// //               <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
// //                 Why You Need a Free Image to Text OCR Tool
// //               </h2>
// //               <p className="leading-7 text-sm">
// //                 Text trapped inside images cannot be copied, searched, or edited. Whether it is
// //                 a screenshot of an article, a photo of a receipt, a scanned contract, or a
// //                 picture of handwritten notes — you need OCR to unlock that text. Manually
// //                 retyping it wastes time and introduces errors. After extracting your text, you can calculate word density using our <Link href="/word-counter" className="text-cyan-600 hover:underline font-medium">Word Counter</Link> or format text casing effortlessly via the <Link href="/case-converter" className="text-cyan-600 hover:underline font-medium">Case Converter</Link>.
// //               </p>
// //               <p className="leading-7 text-sm mt-3">
// //                 This free image to text converter uses Tesseract OCR running entirely in your
// //                 browser — no file is ever sent to a server. If you are working with mobile camera photos or iOS screenshots, consider optimizing them with our <Link href="/heic-to-jpg" className="text-cyan-600 hover:underline font-medium">HEIC to JPG Converter</Link> or resizing large documents through our <Link href="/image-resizer" className="text-cyan-600 hover:underline font-medium">Image Resizer</Link> before processing.
// //               </p>
// //             </div>

// //             <div>
// //               <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
// //                 What Makes OCR Accurate?
// //               </h3>
// //               <p className="leading-7 text-sm">
// //                 OCR accuracy depends heavily on image quality. High-contrast text on a clean
// //                 background gives near-perfect results. If you need to convert file formats before running recognition, check out our <Link href="/image-converter" className="text-cyan-600 hover:underline font-medium">Image Converter</Link>. Furthermore, if you are compressing images to save storage, our <Link href="/image-compressor" className="text-cyan-600 hover:underline font-medium">Image Compressor</Link> keeps image dimensions intact for optimal text detection.
// //               </p>
// //             </div>

// //             <div className="it-seo-box">
// //               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
// //                 Common Problems This Tool Solves
// //               </h3>
// //               <div className="grid sm:grid-cols-2 gap-3">
// //                 {[
// //                   'Copy text from a screenshot you cannot select',
// //                   'Extract text from a scanned PDF or document',
// //                   'Convert a photo of a receipt or invoice to text',
// //                   'Get editable text from an image of a book or article',
// //                   'Extract address or phone number from a photo',
// //                   'Convert handwritten notes to typed text',
// //                 ].map((item, i) => (
// //                   <div key={i} className="flex items-center gap-2.5 text-sm">
// //                     <span className="it-feature-dot" />
// //                     <span>{item}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             <div>
// //               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
// //               <div className="grid sm:grid-cols-2 gap-3">
// //                 {[
// //                   'Students — extract notes, books, and study screenshots',
// //                   'Office users — convert scanned docs to editable text',
// //                   'Freelancers — pull text from receipts and invoices',
// //                   'Researchers — extract quotes from image-based sources',
// //                   'Writers — reuse content from screenshots or scans',
// //                   'Anyone — quick copyable text from any image',
// //                 ].map((item, i) => (
// //                   <div key={i} className="flex items-start gap-2 text-sm">
// //                     <span className="font-bold mt-0.5" style={{ color: '#0891B2' }}>→</span>
// //                     <span>{item}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             <div className="it-seo-box">
// //               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
// //               <div className="grid sm:grid-cols-2 gap-3">
// //                 {[
// //                   'Free, unlimited OCR — no daily limits',
// //                   'Photos, screenshots & scans supported',
// //                   'Fast results in seconds',
// //                   'High accuracy for clear printed text',
// //                   'One-click copy to clipboard',
// //                   'Editable textarea — fix errors manually',
// //                   'Works on mobile & desktop',
// //                   'Nothing stored — full privacy',
// //                 ].map((f, i) => (
// //                   <div key={i} className="flex items-center gap-2.5 text-sm">
// //                     <span className="it-feature-dot" />
// //                     <span>{f}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //           </div>
// //         </section>

// //         {/* ── FAQ WITH CONTEXTUAL INTERLINKING ── */}
// //         <hr className="it-divider" />
// //         <section className="it-section-main py-16 px-6">
// //           <div className="max-w-3xl mx-auto">
// //             <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
// //               Frequently Asked Questions
// //             </h2>
// //             <div className="space-y-3">
// //               <details className="it-faq-item">
// //                 <summary className="flex items-center justify-between gap-4">
// //                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Is Image to Text OCR free?</span>
// //                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
// //                 </summary>
// //                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
// //                   Yes — completely free with unlimited usage and no hidden charges or signup required.
// //                 </p>
// //               </details>

// //               <details className="it-faq-item">
// //                 <summary className="flex items-center justify-between gap-4">
// //                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Which image formats are supported?</span>
// //                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
// //                 </summary>
// //                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
// //                   JPG, PNG, WebP, and other common image formats are supported. If you have HEIC photos from an iPhone, convert them first using our <Link href="/heic-to-jpg" className="text-cyan-600 hover:underline">HEIC to JPG Converter</Link>.
// //                 </p>
// //               </details>

// //               <details className="it-faq-item">
// //                 <summary className="flex items-center justify-between gap-4">
// //                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>How accurate is the OCR?</span>
// //                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
// //                 </summary>
// //                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
// //                   Very accurate for clear printed text. Blurry images or low resolution may reduce accuracy. You can pre-process or adjust your files using our <Link href="/image-converter" className="text-cyan-600 hover:underline">Image Converter</Link> for best results.
// //                 </p>
// //               </details>

// //               <details className="it-faq-item">
// //                 <summary className="flex items-center justify-between gap-4">
// //                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can it read handwritten text?</span>
// //                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
// //                 </summary>
// //                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
// //                   It may work for neat, clean handwriting, but printed text gives the best results. Once extracted, you can check text details or word count with our <Link href="/word-counter" className="text-cyan-600 hover:underline">Word Counter</Link>.
// //                 </p>
// //               </details>

// //               <details className="it-faq-item">
// //                 <summary className="flex items-center justify-between gap-4">
// //                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Do you store my images or extracted text?</span>
// //                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
// //                 </summary>
// //                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
// //                   No — everything runs entirely in your browser. Your images are never uploaded to any server and nothing is stored or logged.
// //                 </p>
// //               </details>

// //               <details className="it-faq-item">
// //                 <summary className="flex items-center justify-between gap-4">
// //                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can I use this on mobile?</span>
// //                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
// //                 </summary>
// //                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
// //                   Yes — fully optimized for mobile devices and desktops. You can also quickly generate access links or QR codes for your files using our <Link href="/qr-generator" className="text-cyan-600 hover:underline">QR Code Generator</Link>.
// //                 </p>
// //               </details>

// //               <details className="it-faq-item">
// //                 <summary className="flex items-center justify-between gap-4">
// //                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can I extract text from a screenshot?</span>
// //                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
// //                 </summary>
// //                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
// //                   Yes — screenshots work perfectly. If you need to compress large screenshot files before sharing, try our <Link href="/image-compressor" className="text-cyan-600 hover:underline">Image Compressor</Link>.
// //                 </p>
// //               </details>

// //               <details className="it-faq-item">
// //                 <summary className="flex items-center justify-between gap-4">
// //                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>Can I extract text from a scanned PDF page?</span>
// //                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
// //                 </summary>
// //                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
// //                   Yes — export your scanned PDF page as an image or take a screenshot, then upload it here. You can also tweak casing on extracted text with our <Link href="/case-converter" className="text-cyan-600 hover:underline">Case Converter</Link>.
// //                 </p>
// //               </details>

// //               <details className="it-faq-item">
// //                 <summary className="flex items-center justify-between gap-4">
// //                   <span className="font-semibold text-sm" style={{ color: '#374151' }}>What languages does the OCR support?</span>
// //                   <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#0891B2' }} />
// //                 </summary>
// //                 <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
// //                   The tool currently processes English text with high accuracy. Use images containing printed text with good contrast and resolution.
// //                 </p>
// //               </details>
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── RELATED TOOLS ── */}
// //         <hr className="it-divider" />
// //         <section className="it-section-alt py-14 px-6">
// //           <div className="max-w-3xl mx-auto">
// //             <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
// //               You may also find these free tools helpful
// //             </h2>
// //             <div className="flex flex-wrap justify-center gap-3">
// //               {[
// //                 { name: 'Image Compressor', href: '/image-compressor' },
// //                 { name: 'Image Converter',  href: '/image-converter'  },
// //                 { name: 'HEIC to JPG',       href: '/heic-to-jpg'      },
// //                 { name: 'QR Generator',     href: '/qr-generator'     },
// //                 { name: 'Word Counter',     href: '/word-counter'     },
// //                 { name: 'Case Converter',   href: '/case-converter'   },
// //                 { name: 'Image Resizer',    href: '/image-resizer'    },
// //               ].map((tool, i) => (
// //                 <Link
// //                   key={i}
// //                   href={tool.href}
// //                   className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:border-cyan-600"
// //                   style={{ color: '#0891B2', borderColor: '#A5F3FC', background: '#fff' }}
// //                 >
// //                   {tool.name}
// //                 </Link>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── CTA ── */}
// //         <section className="it-cta-section">
// //           <div className="max-w-xl mx-auto">
// //             <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
// //               Ready to extract text from your image?
// //             </h2>
// //             <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
// //               Takes 5 seconds. No signup. No ads.
// //             </p>
// //             <button
// //               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
// //               className="it-cta-btn"
// //             >
// //               <Upload className="w-5 h-5" /> Extract Now
// //             </button>
// //           </div>
// //         </section>

// //       </main>
// //     </>
// //   );
// // }






