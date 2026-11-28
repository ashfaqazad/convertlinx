"use client";

// One component for the format pair pages (WebP to JPG, JPG to WebP, WebP to PNG,
// AVIF to JPG). Decoding and encoding come from lib/imageCodecs, the same code as
// the Image Converter, and the page layout follows the PNG to JPG page.

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Upload, Download, Image as ImageIcon, CheckCircle, ChevronDown, Layers, ShieldCheck } from "lucide-react";
import { Rich } from "@/components/ToolSections";
import { decodeFile, encodeCanvas, OUTPUT_META } from "@/lib/imageCodecs";
import { sniffImage, canDecode, FORMAT_NAMES } from "@/lib/imageSniff";
import { CONVERTER_CONTENT } from "@/lib/converterContent";
import "@/styles/HeicToJpg.css";

const HEADING = { color: "#1a1a2e" };
const MUTED = { color: "#6B7280" };
const LABEL = { color: "#374151" };
const PINK = { color: "#C026D3" };

const formatSize = (bytes) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

async function convertFile(file, from, to, quality, background) {
  const type = await sniffImage(file);
  if (type !== from) {
    const found = type ? `It looks like a ${FORMAT_NAMES[type]} file.` : "It is not a supported image.";
    const article = from === "avif" ? "an" : "a";
    throw new Error(`This is not ${article} ${FORMAT_NAMES[from]} file. ${found}`);
  }
  const { canvas } = await decodeFile(file);
  const blob = await encodeCanvas(canvas, to, quality / 100, background);
  canvas.width = canvas.height = 0; // free the pixel memory before the next file
  if (!blob) throw new Error("This image is too large for your browser to convert.");
  return blob;
}

// "photo.webp" -> "photo.jpg", adding (2), (3) when two files share a name
function outputName(name, ext, used) {
  const base = name.replace(/\.[^/.]+$/, "") || "image";
  let candidate = `${base}.${ext}`;
  for (let n = 2; used.has(candidate); n++) candidate = `${base} (${n}).${ext}`;
  used.add(candidate);
  return candidate;
}

function saveBlobURL(url, name) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function FormatConverter({ seo }) {
  const slug = seo.canonical.slice(1);
  const { from, to } = seo;
  const content = CONVERTER_CONTENT[slug];
  const fromName = FORMAT_NAMES[from];
  const toName = FORMAT_NAMES[to];
  const ext = OUTPUT_META[to].ext;
  const usesQuality = to !== "png";
  const usesBackground = to === "jpg";
  const accept = from === "jpg" ? ".jpg,.jpeg,.jfif,image/jpeg" : `.${from},image/${from}`;

  const [files, setFiles] = useState([]);
  const [results, setResults] = useState({});
  const [quality, setQuality] = useState(to === "webp" ? 85 : 92);
  const [background, setBackground] = useState("#ffffff");
  const [settings, setSettings] = useState({ quality, background }); // debounced copy used for converting
  const [supported, setSupported] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [zipping, setZipping] = useState(false);

  const resultsRef = useRef({});
  const batchRef = useRef(0);

  const key = `${usesQuality ? settings.quality : "-"}|${usesBackground ? settings.background : "-"}`;

  useEffect(() => {
    let active = true;
    canDecode(from).then((ok) => { if (active) setSupported(ok); });
    return () => { active = false; };
  }, [from]);

  useEffect(() => {
    const t = setTimeout(() => setSettings({ quality, background }), 350);
    return () => clearTimeout(t);
  }, [quality, background]);

  useEffect(() => () => {
    Object.values(resultsRef.current).forEach((r) => r.url && URL.revokeObjectURL(r.url));
  }, []);

  // Convert one file at a time, and again whenever the settings change
  useEffect(() => {
    let cancelled = false;
    const write = (id, value) => {
      const previous = resultsRef.current[id];
      if (previous?.url) URL.revokeObjectURL(previous.url);
      resultsRef.current = { ...resultsRef.current, [id]: value };
      setResults(resultsRef.current);
    };

    (async () => {
      for (const { id, file } of files) {
        if (cancelled) return;
        if (resultsRef.current[id]?.key === key) continue;
        try {
          const blob = await convertFile(file, from, to, settings.quality, settings.background);
          if (cancelled) return;
          write(id, { key, url: URL.createObjectURL(blob), size: blob.size });
        } catch (err) {
          console.warn("Conversion failed", file.name, err);
          if (cancelled) return;
          write(id, { key, error: err?.message || "Could not convert this file." });
        }
      }
    })();

    return () => { cancelled = true; };
  }, [files, key, from, to, settings]);

  const addFiles = (list) => {
    const selected = Array.from(list || []);
    if (!selected.length || !supported) return;
    const batch = ++batchRef.current;
    Object.values(resultsRef.current).forEach((r) => r.url && URL.revokeObjectURL(r.url));
    resultsRef.current = {};
    setResults({});
    const used = new Set();
    setFiles(selected.map((file, i) => ({ id: `${batch}-${i}`, file, name: outputName(file.name, ext, used) })));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const done = files.filter((f) => results[f.id]?.key === key && results[f.id].url);
  const busy = files.some((f) => results[f.id]?.key !== key);

  const downloadZip = async () => {
    setZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const f of done) zip.file(f.name, await (await fetch(results[f.id].url)).blob());
      const url = URL.createObjectURL(await zip.generateAsync({ type: "blob" }));
      saveBlobURL(url, `${slug}-convertlinx.zip`);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("ZIP failed", err);
      alert("Could not create the ZIP. Please download the files one by one.");
    } finally {
      setZipping(false);
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const benefits = [
    { icon: ImageIcon, color: "#C026D3", ...content.benefit },
    { icon: Layers, color: "#7C3AED", title: "Batch and ZIP", desc: "Convert many files in one go and download them together." },
    { icon: ShieldCheck, color: "#10B981", title: "Private by Design", desc: "Your images stay in your browser and are never uploaded." },
  ];

  return (
    <main className="hj-page">
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />

      <section className="hj-hero">
        <div className="hj-blob-1" />
        <div className="hj-blob-2" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm mb-5">
            <Link href="/" className="hj-breadcrumb-link">Home</Link>
            <span style={{ color: "#C4B5FD" }}>/</span>
            <span style={PINK}>{`${fromName} to ${toName}`}</span>
          </nav>
          <span className="hj-badge">Image Converter</span>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={HEADING}>
            {fromName} to <span className="hj-grad-text">{toName} Converter</span>
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={MUTED}>{content.intro}</p>
        </div>
      </section>

      <section className="hj-section-main py-10 px-6">
        <div className="max-w-2xl mx-auto hj-fade-up">
          <div className="hj-tool-card">
            {!supported && (
              <p role="alert" className="hj-alert mb-5">
                Your browser cannot open {fromName} images, so this converter will not work here. Please update your
                browser, or use a current version of Chrome, Edge, Firefox or Safari.
              </p>
            )}

            <label className={`hj-upload-area ${dragging ? "hj-dragging" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}>
              <div className="hj-upload-icon">
                <Upload className="w-8 h-8" />
              </div>
              <p className="font-semibold text-base mb-1" style={HEADING}>
                Drop {fromName} images here or click to browse
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
                Multiple files supported · Converted in your browser, never uploaded
              </p>
              <input type="file" accept={accept} multiple className="sr-only" disabled={!supported}
                onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
            </label>

            {usesQuality && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="fc-quality" className="text-xs font-semibold" style={LABEL}>{toName} Quality</label>
                  <span className="text-xs font-bold" style={PINK}>{quality}%</span>
                </div>
                <input id="fc-quality" type="range" min="50" max="100" value={quality} className="w-full"
                  onChange={(e) => setQuality(Number(e.target.value))} />
                <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                  Lower quality = smaller file. Files are converted again when you move the slider.
                </p>
              </div>
            )}

            {usesBackground && (
              <div className="mt-5 flex items-center justify-between gap-4">
                <label htmlFor="fc-background" className="text-xs font-semibold" style={LABEL}>
                  Background colour for transparent areas
                </label>
                <input id="fc-background" type="color" value={background} className="hj-color"
                  onChange={(e) => setBackground(e.target.value)} />
              </div>
            )}

            <div aria-live="polite">
              {files.length > 0 && busy && (
                <div className="text-center py-6 mt-4">
                  <div className="hj-spinner mb-3" />
                  <p className="text-sm font-semibold" style={PINK}>Converting your images...</p>
                </div>
              )}
              {files.length > 0 && !busy && (
                <p className="text-sm font-bold uppercase tracking-widest mt-7 mb-4 text-center" style={PINK}>
                  {done.length} of {files.length} {files.length === 1 ? "image" : "images"} ready
                </p>
              )}
            </div>

            {!busy && done.length > 1 && (
              <div className="text-center mb-5">
                <button type="button" className="hj-dl-btn cursor-pointer" onClick={downloadZip} disabled={zipping}>
                  <Download className="w-4 h-4" />
                  {zipping ? "Creating ZIP..." : `Download All as ZIP (${done.length})`}
                </button>
              </div>
            )}

            {files.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {files.map(({ id, file, name }) => {
                  const result = results[id];
                  if (!result || result.key !== key) return null;
                  if (result.error) {
                    return (
                      <div key={id} className="hj-alert">
                        <p className="font-semibold truncate">{file.name}</p>
                        <p>{result.error}</p>
                      </div>
                    );
                  }
                  return (
                    <div key={id} className="hj-result-card">
                      <img src={result.url} alt={name} loading="lazy" className="w-full h-44 object-contain hj-checker" />
                      <div className="p-4 text-center">
                        <p className="text-xs font-medium mb-1 truncate" style={LABEL}>{name}</p>
                        <p className="text-xs mb-3" style={{ color: "#9CA3AF" }}>
                          {formatSize(file.size)} → {formatSize(result.size)}
                        </p>
                        <a href={result.url} download={name} className="hj-dl-btn w-full justify-center">
                          <Download className="w-4 h-4" />
                          Download {toName}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-5 mt-6">
              {["No sign-up", "Batch convert", "Nothing uploaded", "100% free"].map((t) => (
                <span key={t} className="hj-trust-item">
                  <span className="hj-trust-dot" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <p className="hj-privacy mt-4">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span><strong>Your files never leave your browser.</strong> The conversion happens on your own device, and nothing is uploaded to a server.</span>
          </p>
        </div>
      </section>

      <hr className="hj-divider" />
      <section className="hj-section-alt py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12" style={HEADING}>
            How to Convert {fromName} to {toName} in 3 Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {seo.howItWorks.map((step, i) => (
              <div key={step} className="hj-step-card">
                <div className="hj-step-num">{i + 1}</div>
                <h3 className="font-bold text-base mb-2" style={HEADING}>{content.stepTitles[i]}</h3>
                <p className="text-sm leading-relaxed" style={MUTED}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="hj-divider" />
      <section className="hj-section-main py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10" style={HEADING}>Why Use ConvertLinx?</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {benefits.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="hj-benefit-card">
                <div className="hj-benefit-icon" style={{ background: `${color}14`, color }}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base mb-2" style={HEADING}>{title}</h3>
                <p className="text-sm leading-relaxed" style={MUTED}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="hj-divider" />
      <section className="hj-section-alt py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8 text-sm leading-7" style={MUTED}>
          {content.sections.map((section, index) => (
            <Fragment key={section.title}>
              <div>
                {index === 0
                  ? <h2 className="text-2xl font-bold mb-4" style={HEADING}>{section.title}</h2>
                  : <h3 className="font-bold text-lg mb-3" style={HEADING}>{section.title}</h3>}
                {section.paras.map((p) => (
                  <p key={p} className="mb-3"><Rich text={p} linkClass="hj-link" /></p>
                ))}
              </div>
            </Fragment>
          ))}

          <div className="hj-seo-box">
            <h3 className="font-bold text-lg mb-4" style={HEADING}>Good to Know Before You Convert</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {content.tips.map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="hj-feature-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4" style={HEADING}>Who Should Use This?</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {content.who.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="font-bold" style={PINK}>→</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="hj-divider" />
      <section className="hj-section-main py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10" style={HEADING}>Frequently Asked Questions</h2>
          <div className="space-y-3">
            {content.faqs.map((faq) => (
              <details key={faq.q} className="hj-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={LABEL}>{faq.q}</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={PINK} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={MUTED}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <hr className="hj-divider" />
      <section className="hj-section-alt py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-5 text-center" style={HEADING}>You may also find these free tools helpful</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {content.related.map(([href, name]) => (
              <Link key={href} href={href} className="px-4 py-2 rounded-full text-sm font-medium border"
                style={{ color: "#7C3AED", borderColor: "#D8B4FE", background: "#fff" }}>
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hj-cta-section">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">Ready to convert {fromName} to {toName}?</h2>
          <p className="mb-8 text-base" style={{ color: "rgba(255,255,255,0.7)" }}>Free, no signup, no watermark.</p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hj-cta-btn">
            <ImageIcon className="w-5 h-5" />
            Convert Now
          </button>
        </div>
      </section>
    </main>
  );
}
