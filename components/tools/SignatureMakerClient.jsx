"use client";

import { useRef, useState } from "react";
import NextLink from "next/link";
import {
  Download,
  PenTool,
  Palette,
  Trash2,
  CheckCircle,
  ChevronDown,
  Upload,
} from "lucide-react";
import "@/styles/SignatureMaker.css";

const SITE = "https://convertlinx.com";
const PAGE_URL = `${SITE}/signature-maker`;

const linkClass = "text-indigo-600 hover:underline font-medium";

// const strokeSizes = [
//   { size: 2, label: 'S' },
//   { size: 3, label: 'M' },
//   { size: 5, label: 'L' },
// ];

const strokeSizes = [
  { size: 3, label: "S" },
  { size: 5, label: "M" },
  { size: 7, label: "L" },
];

/* ── FAQ data: `a` = what users see (can contain links), `aText` = plain text for schema ── */
const faqs = [
  {
    q: "Is this free online signature maker and signature converter completely free to use?",
    a: "Yes. Our online signature maker and signature converter is 100% free with no signup, watermarks, or usage limits. You can create a digital signature online free, or convert image to digital signature online free, as many times as you need.",
    aText:
      "Yes. Our online signature maker and signature converter is 100% free with no signup, watermarks, or usage limits. You can create a digital signature online free, or convert image to digital signature online free, as many times as you need.",
  },
  {
    q: "How do I convert my handwritten signature on paper to digital?",
    a: 'Sign on plain white paper with a dark pen and take a clear, well-lit photo. Click "Upload signature photo", then move the background slider to convert signature on paper to digital until the paper disappears. This lets you scan signature online free using only your phone camera. Pick your pen color if you like and download the transparent PNG.',
    aText:
      "Sign on plain white paper with a dark pen and take a clear, well-lit photo. Click Upload signature photo, then move the background slider to convert signature on paper to digital until the paper disappears. This lets you scan signature online free using only your phone camera. Pick your pen color if you like and download the transparent PNG.",
  },
  {
    q: "How do I add my electronic signature to PDF files or documents?",
    a: (
      <span>
        After you convert signature to digital with this e signature free online
        tool and download your transparent PNG signature, insert it into your
        PDF or Word document using any editor's "insert image" option. If your
        document starts as plain text, convert it first with our{" "}
        <NextLink href="/text-to-pdf" className={linkClass}>
          Text to PDF
        </NextLink>{" "}
        tool. To trim or resize the signature image, use the{" "}
        <NextLink href="/image-cropper" className={linkClass}>
          Image Cropper
        </NextLink>{" "}
        or{" "}
        <NextLink href="/image-resizer" className={linkClass}>
          Image Resizer
        </NextLink>
        .
      </span>
    ),
    aText:
      "After you convert signature to digital with this e signature free online tool and download your transparent PNG signature, insert it into your PDF or Word document using any editor's insert image option. If your document starts as plain text, convert it first with the Text to PDF tool. To trim or resize the signature image, use the Image Cropper or Image Resizer.",
  },
  {
    q: "Can I draw or capture my signature online on mobile phones and tablets?",
    a: "Yes. You can convert to signature by drawing with your finger on Android or iPhone touchscreens, or use a stylus or Apple Pencil on tablets. It works as a signature capture online tool on any phone, tablet, or computer.",
    aText:
      "Yes. You can convert to signature by drawing with your finger on Android or iPhone touchscreens, or use a stylus or Apple Pencil on tablets. It works as a signature capture online tool on any phone, tablet, or computer.",
  },
  {
    q: "Can I make a digital signature online free without signing up?",
    a: "Yes. This online signature tool is an electronic signature free no sign up option: there is no account, no email, and no login. Open the page, create your digital signature free online by drawing or uploading a photo, and download the PNG.",
    aText:
      "Yes. This online signature tool is an electronic signature free no sign up option: there is no account, no email, and no login. Open the page, create your digital signature free online by drawing or uploading a photo, and download the PNG.",
  },
  {
    q: "Does this digital signature maker download signatures with a transparent background?",
    a: "Yes. When you convert image to digital signature online free, the signature is saved as a transparent PNG, with the empty space around it trimmed, so you can place it on top of any document or form.",
    aText:
      "Yes. When you convert image to digital signature online free, the signature is saved as a transparent PNG, with the empty space around it trimmed, so you can place it on top of any document or form.",
  },
  {
    q: "My signature photo is from an iPhone (HEIC). Can I upload it?",
    a: (
      <span>
        Browsers often cannot open HEIC photos. Convert the photo first with our{" "}
        <NextLink href="/heic-to-jpg" className={linkClass}>
          HEIC to JPG
        </NextLink>{" "}
        converter, then upload the JPG here to convert signature to digital. If
        the photo is sideways or upside down, fix it with{" "}
        <NextLink href="/rotate-flip-image" className={linkClass}>
          Rotate &amp; Flip Image
        </NextLink>
        .
      </span>
    ),
    aText:
      "Browsers often cannot open HEIC photos. Convert the photo first with the HEIC to JPG converter, then upload the JPG here to convert signature to digital. If the photo is sideways or upside down, fix it with Rotate and Flip Image.",
  },
  {
    q: "Is this a virtual signature free tool I can use for online forms?",
    a: "Yes. Use it as a virtual signature free tool for online forms, job applications, rental agreements, and school paperwork. Make a signature online free, download the transparent PNG, and upload or paste it wherever a signature image is accepted.",
    aText:
      "Yes. Use it as a virtual signature free tool for online forms, job applications, rental agreements, and school paperwork. Make a signature online free, download the transparent PNG, and upload or paste it wherever a signature image is accepted.",
  },
  {
    q: "Are my signatures or photos stored on your server?",
    a: "No. Your signature and any photo you upload to our signature converter are processed only in your web browser. Nothing is uploaded, saved, or logged on a server, so this online signature tool is safe for private documents.",
    aText:
      "No. Your signature and any photo you upload to our signature converter are processed only in your web browser. Nothing is uploaded, saved, or logged on a server, so this online signature tool is safe for private documents.",
  },
  {
    q: "Can I reduce the size or change the format of my signature image?",
    a: (
      <span>
        Yes. Shrink the file with our{" "}
        <NextLink href="/image-compressor" className={linkClass}>
          Image Compressor
        </NextLink>{" "}
        or switch formats, for example PNG to WebP, with our{" "}
        <NextLink href="/image-converter" className={linkClass}>
          Image Converter
        </NextLink>
        . Note that JPG does not support transparency, so keep PNG if you need a
        transparent background.
      </span>
    ),
    aText:
      "Yes. Shrink the file with the Image Compressor or switch formats, for example PNG to WebP, with the Image Converter. Note that JPG does not support transparency, so keep PNG if you need a transparent background.",
  },
  {
    q: "Is an image of my e signature legally valid?",
    a: "Many forms and agreements accept an image when you convert signature on paper to digital, but rules differ by country and document type. Some contracts require a certificate-based digital signature instead. Check the requirements with the person or organization you are signing for.",
    aText:
      "Many forms and agreements accept an image when you convert signature on paper to digital, but rules differ by country and document type. Some contracts require a certificate-based digital signature instead. Check the requirements with the person or organization you are signing for.",
  },
];

const relatedTools = [
  { name: "Text to PDF", href: "/text-to-pdf" },
  { name: "Image Cropper", href: "/image-cropper" },
  { name: "Image Resizer", href: "/image-resizer" },
  { name: "Image Compressor", href: "/image-compressor" },
  { name: "Image Converter", href: "/image-converter" },
  { name: "HEIC to JPG", href: "/heic-to-jpg" },
  { name: "Add Watermark", href: "/add-watermark" },
  { name: "Rotate & Flip Image", href: "/rotate-flip-image" },
];

/* ── Structured data (plain <script>, so it is in the server-rendered HTML) ── */
const JsonLd = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Create a Digital Signature Online Free or Convert a Signature to Digital",
  description:
    "Draw your signature or upload a photo of it, remove the background, and download a transparent PNG. A free online signature maker with no sign up.",
  url: PAGE_URL,
  step: [
    {
      "@type": "HowToStep",
      name: "Draw or upload",
      text: "Draw your signature with a mouse or finger, or upload a photo of your signature on white paper to scan signature online free.",
    },
    {
      "@type": "HowToStep",
      name: "Adjust",
      text: "Choose a pen color, set the stroke thickness, or move the background slider until the paper disappears.",
    },
    {
      "@type": "HowToStep",
      name: "Download PNG",
      text: "Download your digital signature as a transparent background PNG.",
    },
  ],
  totalTime: "PT40S",
  estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
};

// const breadcrumbSchema = {
//   "@context": "https://schema.org",
//   "@type": "BreadcrumbList",
//   itemListElement: [
//     { "@type": "ListItem", position: 1, name: "Home", item: SITE },
//     {
//       "@type": "ListItem",
//       position: 2,
//       name: "Signature Maker",
//       item: PAGE_URL,
//     },
//   ],
// };

// const webAppSchema = {
//   "@context": "https://schema.org",
//   "@type": "WebApplication",
//   name: "ConvertLinx Signature Maker",
//   url: PAGE_URL,
//   applicationCategory: "UtilitiesApplication",
//   operatingSystem: "Any",
//   browserRequirements: "Requires JavaScript",
//   offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
// };

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.aText },
  })),
};

/* ── Helpers ── */
const hexToRgb = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/* Returns a PNG data URL cropped to the signature's bounding box (transparent margins removed) */
const getTrimmedDataUrl = (canvas) => {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  let minX = width,
    minY = height,
    maxX = -1,
    maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null; // nothing drawn

  const pad = 10;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  out.getContext("2d").drawImage(canvas, minX, minY, w, h, 0, 0, w, h);
  return out.toDataURL("image/png");
};

export default function SignatureMaker() {
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#1a1a2e");
  const [stroke, setStroke] = useState(5); // 2, 3, 5
  const [srcImg, setSrcImg] = useState(null);
  const [threshold, setThreshold] = useState(190);
  const [notice, setNotice] = useState("");

  /* Coordinate helper — supports mouse + touch */
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = e.touches?.[0] ?? e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    if (srcImg) return; // an uploaded photo is loaded: press Clear to draw again
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
    setNotice("");
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = stroke;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setDrawing(false);

  /* Canvas stays transparent: the white you see is only CSS, so the PNG keeps a transparent background */
  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setSrcImg(null);
    setNotice("");
    if (fileRef.current) fileRef.current.value = "";
  };

  /* Upload: draw the photo, turn light paper transparent, recolor the ink */
  const processImage = (img, t, penColor) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const scale = Math.min(
      canvas.width / img.width,
      canvas.height / img.height,
    );
    const w = img.width * scale;
    const h = img.height * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imageData.data;
    const [r, g, b] = hexToRgb(penColor);

    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      // paper (light) -> transparent, ink (dark) -> pen color, soft edge in between
      const a = lum >= t ? 0 : lum <= t - 40 ? 255 : ((t - lum) / 40) * 255;
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = a;
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setSrcImg(img);
      setNotice("");
      processImage(img, threshold, color);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setNotice(
        "This image could not be opened. Try a JPG or PNG photo (iPhone HEIC photos need converting first).",
      );
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const onThreshold = (e) => {
    const v = Number(e.target.value);
    setThreshold(v);
    if (srcImg) processImage(srcImg, v, color);
  };

  const onColor = (e) => {
    const v = e.target.value;
    setColor(v);
    if (srcImg) processImage(srcImg, threshold, v);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = getTrimmedDataUrl(canvas);
    if (!url) {
      setNotice("Draw or upload your signature first.");
      return;
    }
    const link = document.createElement("a");
    link.download = "my-digital-signature.png";
    link.href = url;
    link.click();
  };

  return (
    <>
      {/* <JsonLd data={webAppSchema} /> */}
      <JsonLd data={howToSchema} />
      {/* <JsonLd data={breadcrumbSchema} /> */}
      <JsonLd data={faqSchema} />

      <main className="sm-page">
        {/* ── HERO ── */}
        <section className="sm-hero">
          <div className="sm-blob-1" />
          <div className="sm-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <NextLink href="/" className="sm-breadcrumb-link">
                Home
              </NextLink>
              <span style={{ color: "#C4B5FD" }}>/</span>
              <span style={{ color: "#6366F1" }}>Signature Maker</span>
            </div>
            <span className="sm-badge">Free Digital Signature Maker</span>
            <h1
              className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2"
              style={{ color: "#1a1a2e" }}
            >
              Free Online Signature Maker:{" "}
              <span className="sm-grad-text">
                Create or Convert Signature to Digital
              </span>
            </h1>
            <p
              className="text-base md:text-lg max-w-xl mx-auto leading-relaxed"
              style={{ color: "#6B7280" }}
            >
              Create a digital signature online free: draw your signature, or
              scan signature online free by uploading a photo and removing the
              background. Download a transparent PNG with no sign up, right in
              your browser.
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
                  <Palette className="w-4 h-4" style={{ color: "#6366F1" }} />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    Pen
                  </span>
                  <input
                    type="color"
                    value={color}
                    onChange={onColor}
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
                      className={`sm-stroke-btn ${stroke === size ? "active" : ""}`}
                      title={`Stroke ${label}`}
                    >
                      <div
                        style={{
                          width: `${size * 3}px`,
                          height: `${size * 3}px`,
                          borderRadius: "50%",
                          background: stroke === size ? "#6366F1" : "#9CA3AF",
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

              {/* Upload + background slider */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                <label className="sm-clear-btn cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload signature photo
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={onUpload}
                    hidden
                  />
                </label>
                {srcImg && (
                  <label
                    className="text-xs font-semibold flex items-center gap-2"
                    style={{ color: "#6B7280" }}
                  >
                    Background removal
                    <input
                      type="range"
                      min="100"
                      max="250"
                      value={threshold}
                      onChange={onThreshold}
                    />
                  </label>
                )}
              </div>

              {/* Canvas (white background is CSS only, the exported PNG is transparent) */}
              <div className="sm-canvas-wrap">
                <canvas
                  ref={canvasRef}
                  width={900}
                  height={400}
                  className="sm-canvas"
                  style={{ background: "#ffffff", touchAction: "none" }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>

              {notice && (
                <p
                  role="alert"
                  className="text-sm text-center mt-3"
                  style={{ color: "#B91C1C" }}
                >
                  {notice}
                </p>
              )}

              {/* Tip */}
              <div className="sm-tip">
                💡 Draw with your mouse or finger to make a signature online
                free. Or upload a photo of your signature on white paper to
                convert it to a digital signature, then use the slider until the
                paper disappears. Press Clear to start over.
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-5">
                {[
                  "No login or sign up",
                  "Draw or upload",
                  "Transparent PNG",
                  "Nothing stored",
                  "100% free online signature",
                ].map((t, i) => (
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
            <h2
              className="text-2xl font-bold text-center mb-10"
              style={{ color: "#1a1a2e" }}
            >
              Why Use Our Free Online Signature Creator?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <PenTool className="w-6 h-6" />,
                  color: "#6366F1",
                  bg: "rgba(99,102,241,0.08)",
                  title: "Draw or Upload",
                  desc: "Draw with a mouse, finger, or stylus, or upload a photo of your signature and convert it to a digital signature online free.",
                },
                {
                  icon: <Palette className="w-6 h-6" />,
                  color: "#8B5CF6",
                  bg: "rgba(139,92,246,0.08)",
                  title: "Your Pen Style",
                  desc: "Pick any pen color and line thickness for your digital signature: classic blue, deep black, or a custom shade.",
                },
                {
                  icon: <CheckCircle className="w-6 h-6" />,
                  color: "#10B981",
                  bg: "rgba(16,185,129,0.08)",
                  title: "Transparent PNG Download",
                  desc: "Get a transparent PNG e signature, trimmed to your signature, ready to place on PDFs, contracts, and forms.",
                },
              ].map((b, i) => (
                <div key={i} className="sm-benefit-card">
                  <div
                    className="sm-benefit-icon"
                    style={{ background: b.bg, color: b.color }}
                  >
                    {b.icon}
                  </div>
                  <h3
                    className="font-bold text-base mb-2"
                    style={{ color: "#1a1a2e" }}
                  >
                    {b.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6B7280" }}
                  >
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW TO ── */}
        <hr className="sm-divider" />
        <section className="sm-section-main py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl font-bold text-center mb-12"
              style={{ color: "#1a1a2e" }}
            >
              How to Create a Digital Signature Online Free or Convert a
              Signature in 3 Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  num: "1",
                  title: "Draw or Upload",
                  desc: "Draw your signature with a mouse or finger, or upload a photo of your signature on white paper to scan signature online free.",
                },
                {
                  num: "2",
                  title: "Adjust",
                  desc: "Choose pen color and thickness, or move the background slider until the paper disappears.",
                },
                {
                  num: "3",
                  title: "Download PNG",
                  desc: "Download the transparent PNG and add it to PDFs, forms, Word files, or emails.",
                },
              ].map((s, i) => (
                <div key={i} className="sm-step-card">
                  <div className="sm-step-num">{s.num}</div>
                  <h3
                    className="font-bold text-base mb-2"
                    style={{ color: "#1a1a2e" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6B7280" }}
                  >
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="sm-divider" />
        <section className="sm-section-alt py-16 px-6">
          <div
            className="max-w-3xl mx-auto space-y-8"
            style={{ color: "#6B7280" }}
          >
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Free Online Signature Maker: Create a Digital Signature or
                Convert Signature to Digital
              </h2>
              <p className="leading-7 text-sm">
                The{" "}
                <span style={{ color: "#1a1a2e", fontWeight: 600 }}>
                  ConvertLinx Signature Maker
                </span>{" "}
                is a free online signature tool and signature converter that
                creates a clean digital signature with a transparent background.
                Draw with your mouse or finger to make a signature online free,
                or upload a photo of your signed paper and let the tool remove
                the background. Download a PNG you can place on PDF agreements,
                online forms, invoices, or Word documents, with no printing or
                scanning. Everything runs in your browser, so your signature is
                never uploaded. If you want to turn plain text into a PDF before
                adding your signature, try our{" "}
                <NextLink href="/text-to-pdf" className={linkClass}>
                  Text to PDF
                </NextLink>{" "}
                tool, and use the{" "}
                <NextLink href="/image-cropper" className={linkClass}>
                  Image Cropper
                </NextLink>{" "}
                or{" "}
                <NextLink href="/image-resizer" className={linkClass}>
                  Image Resizer
                </NextLink>{" "}
                to trim and resize your signature image.
              </p>
              <p className="leading-7 text-sm mt-3">
                To convert a handwritten signature to digital, sign on plain
                white paper with a dark pen and take a sharp photo in good
                light, without shadows. Upload it to scan signature online free,
                adjust the background slider until only the ink remains, and
                download your transparent PNG. This is the fastest way to
                convert signature on paper to digital without a scanner. If your
                photo is an iPhone HEIC file, convert it first with our{" "}
                <NextLink href="/heic-to-jpg" className={linkClass}>
                  HEIC to JPG
                </NextLink>{" "}
                tool.
              </p>
            </div>

            <div>
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#1a1a2e" }}
              >
                What Is an Online Electronic Signature Creator?
              </h3>
              <p className="leading-7 text-sm">
                An online signature creator, also called a digital signature
                maker or e signature free online tool, lets you make an image of
                your handwritten signature on a touchscreen or desktop, or from
                a photo. It works as a virtual signature free option and a
                signature capture online tool, with no sign up needed. By saving
                it as a transparent PNG, you can insert it into PDF files,
                Google Docs, Word files, and email signatures. A signature image
                is not the same as a certificate-based digital signature. If a
                contract requires one, check the requirements with the other
                party.
              </p>
            </div>

            <div className="sm-seo-box rounded-2xl p-6">
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Optimizing Your Signature Image
              </h3>
              <p className="leading-7 text-sm">
                Small files are easier to send and upload. Reduce the file size
                of your digital signature with our{" "}
                <NextLink href="/image-compressor" className={linkClass}>
                  Image Compressor
                </NextLink>
                , change formats with our{" "}
                <NextLink href="/image-converter" className={linkClass}>
                  Image Converter
                </NextLink>
                , or protect signed images from reuse with{" "}
                <NextLink href="/add-watermark" className={linkClass}>
                  Add Watermark
                </NextLink>
                .
              </p>
            </div>

            <div className="sm-seo-box rounded-2xl p-6">
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Who Should Use This Online Signature Tool?
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Business professionals who sign contracts and NDAs with a free e signature",
                  "Freelancers and agencies who sign invoices and work agreements",
                  "Students who fill in online forms and academic documents",
                  "Remote teams who sign paperwork without printing",
                  "Anyone who wants a reusable transparent digital signature",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span
                      className="font-bold mt-0.5"
                      style={{ color: "#6366F1" }}
                    >
                      →
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sm-seo-box rounded-2xl p-6">
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Key Features
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "100% free, unlimited online signatures",
                  "Draw with mouse, stylus, or mobile touch",
                  "Upload a signature photo and remove the background",
                  "Custom pen color selection",
                  "Stroke size customization (Small, Medium, Large)",
                  "Transparent PNG, trimmed to your signature",
                  "Works on Android, iOS, Windows & Mac",
                  "Electronic signature free, no sign up needed",
                  "Private: nothing is uploaded or saved on servers",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span
                      className="sm-feature-dot"
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#6366F1",
                        display: "inline-block",
                      }}
                    />
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
            <h2
              className="text-2xl font-bold text-center mb-10"
              style={{ color: "#1a1a2e" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="sm-faq-item rounded-xl p-5 border border-indigo-100 bg-white shadow-sm"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: "#374151" }}
                    >
                      {faq.q}
                    </span>
                    <ChevronDown
                      className="w-4 h-4 shrink-0"
                      style={{ color: "#6366F1" }}
                    />
                  </summary>
                  <div
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: "#6B7280" }}
                  >
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="sm-divider" />
        <section className="sm-section-alt py-14 px-6">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl font-bold mb-6 text-center"
              style={{ color: "#1a1a2e" }}
            >
              More Free Image & Document Tools
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedTools.map((tool, i) => (
                <NextLink
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{
                    color: "#4F46E5",
                    borderColor: "#E0E7FF",
                    background: "#EEF2FF",
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
              Ready to create your digital signature online free?
            </h2>
            <p
              className="mb-8 text-base"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Takes 10 seconds. No signup required. Transparent PNG download.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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













































// "use client";

// import { useRef, useState } from "react";
// import NextLink from "next/link";
// import {
//   Download,
//   PenTool,
//   Palette,
//   Trash2,
//   CheckCircle,
//   ChevronDown,
//   Upload,
// } from "lucide-react";
// import "@/styles/SignatureMaker.css";

// const SITE = "https://convertlinx.com";
// const PAGE_URL = `${SITE}/signature-maker`;

// const linkClass = "text-indigo-600 hover:underline font-medium";

// // const strokeSizes = [
// //   { size: 2, label: 'S' },
// //   { size: 3, label: 'M' },
// //   { size: 5, label: 'L' },
// // ];

// const strokeSizes = [
//   { size: 3, label: "S" },
//   { size: 5, label: "M" },
//   { size: 7, label: "L" },
// ];

// /* ── FAQ data: `a` = what users see (can contain links), `aText` = plain text for schema ── */
// const faqs = [
//   {
//     q: "Is this online signature converter completely free to use?",
//     a: "Yes. Our signature converter is 100% free with no signup, watermarks, or usage limits. You can convert image to digital signature online free as many times as you need.",
//     aText:
//       "Yes. Our signature converter is 100% free with no signup, watermarks, or usage limits. You can convert image to digital signature online free as many times as you need.",
//   },
//   {
//     q: "How do I convert my handwritten signature on paper to digital?",
//     a: 'Sign on plain white paper with a dark pen and take a clear, well-lit photo. Click "Upload signature photo", then move the background slider to convert signature on paper to digital until the paper disappears. Pick your pen color if you like and download the transparent PNG.',
//     aText:
//       "Sign on plain white paper with a dark pen and take a clear, well-lit photo. Click Upload signature photo, then move the background slider to convert signature on paper to digital until the paper disappears. Pick your pen color if you like and download the transparent PNG.",
//   },
//   {
//     q: "How do I add my electronic signature to PDF files or documents?",
//     a: (
//       <span>
//         After you convert signature to digital and download your transparent PNG
//         signature, insert it into your PDF or Word document using any editor's
//         "insert image" option. If your document starts as plain text, convert it
//         first with our{" "}
//         <NextLink href="/text-to-pdf" className={linkClass}>
//           Text to PDF
//         </NextLink>{" "}
//         tool. To trim or resize the signature image, use the{" "}
//         <NextLink href="/image-cropper" className={linkClass}>
//           Image Cropper
//         </NextLink>{" "}
//         or{" "}
//         <NextLink href="/image-resizer" className={linkClass}>
//           Image Resizer
//         </NextLink>
//         .
//       </span>
//     ),
//     aText:
//       "After you convert signature to digital and download your transparent PNG signature, insert it into your PDF or Word document using any editor's insert image option. If your document starts as plain text, convert it first with the Text to PDF tool. To trim or resize the signature image, use the Image Cropper or Image Resizer.",
//   },
//   {
//     q: "Can I draw or convert to signature on mobile phones and tablets?",
//     a: "Yes. You can convert to signature by drawing with your finger on Android or iPhone touchscreens, or use a stylus or Apple Pencil on tablets.",
//     aText:
//       "Yes. You can convert to signature by drawing with your finger on Android or iPhone touchscreens, or use a stylus or Apple Pencil on tablets.",
//   },
//   {
//     q: "Does it download signatures with a transparent background?",
//     a: "Yes. When you convert image to digital signature online free, the signature is saved as a transparent PNG, with the empty space around it trimmed, so you can place it on top of any document or form.",
//     aText:
//       "Yes. When you convert image to digital signature online free, the signature is saved as a transparent PNG, with the empty space around it trimmed, so you can place it on top of any document or form.",
//   },
//   {
//     q: "My signature photo is from an iPhone (HEIC). Can I upload it?",
//     a: (
//       <span>
//         Browsers often cannot open HEIC photos. Convert the photo first with our{" "}
//         <NextLink href="/heic-to-jpg" className={linkClass}>
//           HEIC to JPG
//         </NextLink>{" "}
//         converter, then upload the JPG here to convert signature to digital. If
//         the photo is sideways or upside down, fix it with{" "}
//         <NextLink href="/rotate-flip-image" className={linkClass}>
//           Rotate &amp; Flip Image
//         </NextLink>
//         .
//       </span>
//     ),
//     aText:
//       "Browsers often cannot open HEIC photos. Convert the photo first with the HEIC to JPG converter, then upload the JPG here to convert signature to digital. If the photo is sideways or upside down, fix it with Rotate and Flip Image.",
//   },
//   {
//     q: "Are my signatures or photos stored on your server?",
//     a: "No. Your signature and any photo you upload to our signature converter are processed only in your web browser. Nothing is uploaded, saved, or logged on a server.",
//     aText:
//       "No. Your signature and any photo you upload to our signature converter are processed only in your web browser. Nothing is uploaded, saved, or logged on a server.",
//   },
//   {
//     q: "Can I reduce the size or change the format of my signature image?",
//     a: (
//       <span>
//         Yes. Shrink the file with our{" "}
//         <NextLink href="/image-compressor" className={linkClass}>
//           Image Compressor
//         </NextLink>{" "}
//         or switch formats, for example PNG to WebP, with our{" "}
//         <NextLink href="/image-converter" className={linkClass}>
//           Image Converter
//         </NextLink>
//         . Note that JPG does not support transparency, so keep PNG if you need a
//         transparent background.
//       </span>
//     ),
//     aText:
//       "Yes. Shrink the file with the Image Compressor or switch formats, for example PNG to WebP, with the Image Converter. Note that JPG does not support transparency, so keep PNG if you need a transparent background.",
//   },
//   {
//     q: "Is an image of my signature legally valid?",
//     a: "Many forms and agreements accept an image when you convert signature on paper to digital, but rules differ by country and document type. Some contracts require a certificate-based digital signature instead. Check the requirements with the person or organization you are signing for.",
//     aText:
//       "Many forms and agreements accept an image when you convert signature on paper to digital, but rules differ by country and document type. Some contracts require a certificate-based digital signature instead. Check the requirements with the person or organization you are signing for.",
//   },
// ];

// const relatedTools = [
//   { name: "Text to PDF", href: "/text-to-pdf" },
//   { name: "Image Cropper", href: "/image-cropper" },
//   { name: "Image Resizer", href: "/image-resizer" },
//   { name: "Image Compressor", href: "/image-compressor" },
//   { name: "Image Converter", href: "/image-converter" },
//   { name: "HEIC to JPG", href: "/heic-to-jpg" },
//   { name: "Add Watermark", href: "/add-watermark" },
//   { name: "Rotate & Flip Image", href: "/rotate-flip-image" },
// ];

// /* ── Structured data (plain <script>, so it is in the server-rendered HTML) ── */
// const JsonLd = ({ data }) => (
//   <script
//     type="application/ld+json"
//     dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
//   />
// );

// const howToSchema = {
//   "@context": "https://schema.org",
//   "@type": "HowTo",
//   name: "How to Create or Convert a Signature to Digital Online for Free",
//   description:
//     "Draw your signature or upload a photo of it, remove the background, and download a transparent PNG.",
//   url: PAGE_URL,
//   step: [
//     {
//       "@type": "HowToStep",
//       name: "Draw or upload",
//       text: "Draw your signature with a mouse or finger, or upload a photo of your signature on white paper.",
//     },
//     {
//       "@type": "HowToStep",
//       name: "Adjust",
//       text: "Choose a pen color, set the stroke thickness, or move the background slider until the paper disappears.",
//     },
//     {
//       "@type": "HowToStep",
//       name: "Download PNG",
//       text: "Download your signature as a transparent background PNG.",
//     },
//   ],
//   totalTime: "PT40S",
//   estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
// };

// // const breadcrumbSchema = {
// //   "@context": "https://schema.org",
// //   "@type": "BreadcrumbList",
// //   itemListElement: [
// //     { "@type": "ListItem", position: 1, name: "Home", item: SITE },
// //     {
// //       "@type": "ListItem",
// //       position: 2,
// //       name: "Signature Maker",
// //       item: PAGE_URL,
// //     },
// //   ],
// // };

// // const webAppSchema = {
// //   "@context": "https://schema.org",
// //   "@type": "WebApplication",
// //   name: "ConvertLinx Signature Maker",
// //   url: PAGE_URL,
// //   applicationCategory: "UtilitiesApplication",
// //   operatingSystem: "Any",
// //   browserRequirements: "Requires JavaScript",
// //   offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
// // };

// const faqSchema = {
//   "@context": "https://schema.org",
//   "@type": "FAQPage",
//   mainEntity: faqs.map((faq) => ({
//     "@type": "Question",
//     name: faq.q,
//     acceptedAnswer: { "@type": "Answer", text: faq.aText },
//   })),
// };

// /* ── Helpers ── */
// const hexToRgb = (hex) =>
//   [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

// /* Returns a PNG data URL cropped to the signature's bounding box (transparent margins removed) */
// const getTrimmedDataUrl = (canvas) => {
//   const ctx = canvas.getContext("2d");
//   const { width, height } = canvas;
//   const data = ctx.getImageData(0, 0, width, height).data;
//   let minX = width,
//     minY = height,
//     maxX = -1,
//     maxY = -1;

//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       if (data[(y * width + x) * 4 + 3] > 10) {
//         if (x < minX) minX = x;
//         if (x > maxX) maxX = x;
//         if (y < minY) minY = y;
//         if (y > maxY) maxY = y;
//       }
//     }
//   }
//   if (maxX < 0) return null; // nothing drawn

//   const pad = 10;
//   minX = Math.max(0, minX - pad);
//   minY = Math.max(0, minY - pad);
//   maxX = Math.min(width - 1, maxX + pad);
//   maxY = Math.min(height - 1, maxY + pad);

//   const w = maxX - minX + 1;
//   const h = maxY - minY + 1;
//   const out = document.createElement("canvas");
//   out.width = w;
//   out.height = h;
//   out.getContext("2d").drawImage(canvas, minX, minY, w, h, 0, 0, w, h);
//   return out.toDataURL("image/png");
// };

// export default function SignatureMaker() {
//   const canvasRef = useRef(null);
//   const fileRef = useRef(null);
//   const [drawing, setDrawing] = useState(false);
//   const [color, setColor] = useState("#1a1a2e");
//   const [stroke, setStroke] = useState(5); // 2, 3, 5
//   const [srcImg, setSrcImg] = useState(null);
//   const [threshold, setThreshold] = useState(190);
//   const [notice, setNotice] = useState("");

//   /* Coordinate helper — supports mouse + touch */
//   const getCoords = (e) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const scaleX = canvas.width / rect.width;
//     const scaleY = canvas.height / rect.height;
//     const src = e.touches?.[0] ?? e;
//     return {
//       x: (src.clientX - rect.left) * scaleX,
//       y: (src.clientY - rect.top) * scaleY,
//     };
//   };

//   const startDrawing = (e) => {
//     e.preventDefault();
//     if (srcImg) return; // an uploaded photo is loaded: press Clear to draw again
//     const { x, y } = getCoords(e);
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     setDrawing(true);
//     setNotice("");
//   };

//   const draw = (e) => {
//     e.preventDefault();
//     if (!drawing) return;
//     const { x, y } = getCoords(e);
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.lineWidth = stroke;
//     ctx.lineCap = "round";
//     ctx.lineJoin = "round";
//     ctx.strokeStyle = color;
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => setDrawing(false);

//   /* Canvas stays transparent: the white you see is only CSS, so the PNG keeps a transparent background */
//   const clear = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
//     setSrcImg(null);
//     setNotice("");
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   /* Upload: draw the photo, turn light paper transparent, recolor the ink */
//   const processImage = (img, t, penColor) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     const scale = Math.min(
//       canvas.width / img.width,
//       canvas.height / img.height,
//     );
//     const w = img.width * scale;
//     const h = img.height * scale;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);

//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const d = imageData.data;
//     const [r, g, b] = hexToRgb(penColor);

//     for (let i = 0; i < d.length; i += 4) {
//       if (d[i + 3] === 0) continue;
//       const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
//       // paper (light) -> transparent, ink (dark) -> pen color, soft edge in between
//       const a = lum >= t ? 0 : lum <= t - 40 ? 255 : ((t - lum) / 40) * 255;
//       d[i] = r;
//       d[i + 1] = g;
//       d[i + 2] = b;
//       d[i + 3] = a;
//     }
//     ctx.putImageData(imageData, 0, 0);
//   };

//   const onUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const url = URL.createObjectURL(file);
//     const img = new Image();
//     img.onload = () => {
//       setSrcImg(img);
//       setNotice("");
//       processImage(img, threshold, color);
//       URL.revokeObjectURL(url);
//     };
//     img.onerror = () => {
//       setNotice(
//         "This image could not be opened. Try a JPG or PNG photo (iPhone HEIC photos need converting first).",
//       );
//       URL.revokeObjectURL(url);
//     };
//     img.src = url;
//   };

//   const onThreshold = (e) => {
//     const v = Number(e.target.value);
//     setThreshold(v);
//     if (srcImg) processImage(srcImg, v, color);
//   };

//   const onColor = (e) => {
//     const v = e.target.value;
//     setColor(v);
//     if (srcImg) processImage(srcImg, threshold, v);
//   };

//   const download = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const url = getTrimmedDataUrl(canvas);
//     if (!url) {
//       setNotice("Draw or upload your signature first.");
//       return;
//     }
//     const link = document.createElement("a");
//     link.download = "my-digital-signature.png";
//     link.href = url;
//     link.click();
//   };

//   return (
//     <>
//       {/* <JsonLd data={webAppSchema} /> */}
//       <JsonLd data={howToSchema} />
//       {/* <JsonLd data={breadcrumbSchema} /> */}
//       <JsonLd data={faqSchema} />

//       <main className="sm-page">
//         {/* ── HERO ── */}
//         <section className="sm-hero">
//           <div className="sm-blob-1" />
//           <div className="sm-blob-2" />
//           <div className="relative z-10 max-w-3xl mx-auto">
//             <div className="flex items-center justify-center gap-2 text-sm mb-5">
//               <NextLink href="/" className="sm-breadcrumb-link">
//                 Home
//               </NextLink>
//               <span style={{ color: "#C4B5FD" }}>/</span>
//               <span style={{ color: "#6366F1" }}>Signature Maker</span>
//             </div>
//             <span className="sm-badge">Free Digital Signature Tool</span>
//             <h1
//               className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2"
//               style={{ color: "#1a1a2e" }}
//             >
//               Free Online Signature Maker:{" "}
//               <span className="sm-grad-text">Draw or Convert to Digital</span>
//             </h1>
//             <p
//               className="text-base md:text-lg max-w-xl mx-auto leading-relaxed"
//               style={{ color: "#6B7280" }}
//             >
//               Draw your signature, or upload a photo of it and remove the
//               background. Download a transparent PNG, free and in your browser.
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
//                   <Palette className="w-4 h-4" style={{ color: "#6366F1" }} />
//                   <span
//                     className="text-xs font-semibold"
//                     style={{ color: "#6B7280" }}
//                   >
//                     Pen
//                   </span>
//                   <input
//                     type="color"
//                     value={color}
//                     onChange={onColor}
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
//                       className={`sm-stroke-btn ${stroke === size ? "active" : ""}`}
//                       title={`Stroke ${label}`}
//                     >
//                       <div
//                         style={{
//                           width: `${size * 3}px`,
//                           height: `${size * 3}px`,
//                           borderRadius: "50%",
//                           background: stroke === size ? "#6366F1" : "#9CA3AF",
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

//               {/* Upload + background slider */}
//               <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
//                 <label className="sm-clear-btn cursor-pointer">
//                   <Upload className="w-4 h-4" />
//                   Upload signature photo
//                   <input
//                     ref={fileRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={onUpload}
//                     hidden
//                   />
//                 </label>
//                 {srcImg && (
//                   <label
//                     className="text-xs font-semibold flex items-center gap-2"
//                     style={{ color: "#6B7280" }}
//                   >
//                     Background removal
//                     <input
//                       type="range"
//                       min="100"
//                       max="250"
//                       value={threshold}
//                       onChange={onThreshold}
//                     />
//                   </label>
//                 )}
//               </div>

//               {/* Canvas (white background is CSS only, the exported PNG is transparent) */}
//               <div className="sm-canvas-wrap">
//                 <canvas
//                   ref={canvasRef}
//                   width={900}
//                   height={400}
//                   className="sm-canvas"
//                   style={{ background: "#ffffff", touchAction: "none" }}
//                   onMouseDown={startDrawing}
//                   onMouseMove={draw}
//                   onMouseUp={stopDrawing}
//                   onMouseLeave={stopDrawing}
//                   onTouchStart={startDrawing}
//                   onTouchMove={draw}
//                   onTouchEnd={stopDrawing}
//                 />
//               </div>

//               {notice && (
//                 <p
//                   role="alert"
//                   className="text-sm text-center mt-3"
//                   style={{ color: "#B91C1C" }}
//                 >
//                   {notice}
//                 </p>
//               )}

//               {/* Tip */}
//               <div className="sm-tip">
//                 💡 Draw with your mouse or finger. Or upload a photo of your
//                 signature on white paper, then use the slider until the paper
//                 disappears. Press Clear to start over.
//               </div>

//               {/* Trust row */}
//               <div className="flex flex-wrap justify-center gap-5 mt-5">
//                 {[
//                   "No login",
//                   "Draw or upload",
//                   "Transparent PNG",
//                   "Nothing stored",
//                   "100% free",
//                 ].map((t, i) => (
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
//             <h2
//               className="text-2xl font-bold text-center mb-10"
//               style={{ color: "#1a1a2e" }}
//             >
//               Why Use Our Online Signature Creator?
//             </h2>
//             <div className="grid md:grid-cols-3 gap-5">
//               {[
//                 {
//                   icon: <PenTool className="w-6 h-6" />,
//                   color: "#6366F1",
//                   bg: "rgba(99,102,241,0.08)",
//                   title: "Draw or Upload",
//                   desc: "Draw with a mouse, finger, or stylus, or upload a photo of your signature and turn it into a digital one.",
//                 },
//                 {
//                   icon: <Palette className="w-6 h-6" />,
//                   color: "#8B5CF6",
//                   bg: "rgba(139,92,246,0.08)",
//                   title: "Your Pen Style",
//                   desc: "Pick any pen color and line thickness: classic blue, deep black, or a custom shade.",
//                 },
//                 {
//                   icon: <CheckCircle className="w-6 h-6" />,
//                   color: "#10B981",
//                   bg: "rgba(16,185,129,0.08)",
//                   title: "Transparent PNG Download",
//                   desc: "Get a transparent PNG, trimmed to your signature, ready to place on PDFs, contracts, and forms.",
//                 },
//               ].map((b, i) => (
//                 <div key={i} className="sm-benefit-card">
//                   <div
//                     className="sm-benefit-icon"
//                     style={{ background: b.bg, color: b.color }}
//                   >
//                     {b.icon}
//                   </div>
//                   <h3
//                     className="font-bold text-base mb-2"
//                     style={{ color: "#1a1a2e" }}
//                   >
//                     {b.title}
//                   </h3>
//                   <p
//                     className="text-sm leading-relaxed"
//                     style={{ color: "#6B7280" }}
//                   >
//                     {b.desc}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── HOW TO ── */}
//         <hr className="sm-divider" />
//         <section className="sm-section-main py-16 px-6">
//           <div className="max-w-4xl mx-auto">
//             <h2
//               className="text-2xl font-bold text-center mb-12"
//               style={{ color: "#1a1a2e" }}
//             >
//               How to Create or Convert a Signature to Digital in 3 Steps
//             </h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {[
//                 {
//                   num: "1",
//                   title: "Draw or Upload",
//                   desc: "Draw your signature with a mouse or finger, or upload a photo of your signature on white paper.",
//                 },
//                 {
//                   num: "2",
//                   title: "Adjust",
//                   desc: "Choose pen color and thickness, or move the background slider until the paper disappears.",
//                 },
//                 {
//                   num: "3",
//                   title: "Download PNG",
//                   desc: "Download the transparent PNG and add it to PDFs, forms, Word files, or emails.",
//                 },
//               ].map((s, i) => (
//                 <div key={i} className="sm-step-card">
//                   <div className="sm-step-num">{s.num}</div>
//                   <h3
//                     className="font-bold text-base mb-2"
//                     style={{ color: "#1a1a2e" }}
//                   >
//                     {s.title}
//                   </h3>
//                   <p
//                     className="text-sm leading-relaxed"
//                     style={{ color: "#6B7280" }}
//                   >
//                     {s.desc}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── SEO CONTENT ── */}
//         <hr className="sm-divider" />
//         <section className="sm-section-alt py-16 px-6">
//           <div
//             className="max-w-3xl mx-auto space-y-8"
//             style={{ color: "#6B7280" }}
//           >
//             <div>
//               <h2
//                 className="text-2xl font-bold mb-4"
//                 style={{ color: "#1a1a2e" }}
//               >
//                 Free Online Signature Maker: Create or Convert a Signature to
//                 Digital
//               </h2>
//               <p className="leading-7 text-sm">
//                 The{" "}
//                 <span style={{ color: "#1a1a2e", fontWeight: 600 }}>
//                   ConvertLinx Signature Maker
//                 </span>{" "}
//                 is a free online tool that creates a clean signature with a
//                 transparent background. Draw with your mouse or finger, or
//                 upload a photo of your signed paper and let the tool remove the
//                 background. Download a PNG you can place on PDF agreements,
//                 online forms, invoices, or Word documents, with no printing or
//                 scanning. Everything runs in your browser, so your signature is
//                 never uploaded. If you want to turn plain text into a PDF before
//                 adding your signature, try our{" "}
//                 <NextLink href="/text-to-pdf" className={linkClass}>
//                   Text to PDF
//                 </NextLink>{" "}
//                 tool, and use the{" "}
//                 <NextLink href="/image-cropper" className={linkClass}>
//                   Image Cropper
//                 </NextLink>{" "}
//                 or{" "}
//                 <NextLink href="/image-resizer" className={linkClass}>
//                   Image Resizer
//                 </NextLink>{" "}
//                 to trim and resize your signature image.
//               </p>
//               <p className="leading-7 text-sm mt-3">
//                 To convert a handwritten signature to digital, sign on plain
//                 white paper with a dark pen and take a sharp photo in good
//                 light, without shadows. Upload it, adjust the background slider
//                 until only the ink remains, and download your transparent PNG.
//                 If your photo is an iPhone HEIC file, convert it first with our{" "}
//                 <NextLink href="/heic-to-jpg" className={linkClass}>
//                   HEIC to JPG
//                 </NextLink>{" "}
//                 tool.
//               </p>
//             </div>

//             <div>
//               <h3
//                 className="font-bold text-lg mb-3"
//                 style={{ color: "#1a1a2e" }}
//               >
//                 What Is an Online Electronic Signature Creator?
//               </h3>
//               <p className="leading-7 text-sm">
//                 An online signature creator lets you make an image of your
//                 handwritten signature on a touchscreen or desktop, or from a
//                 photo. By saving it as a transparent PNG, you can insert it into
//                 PDF files, Google Docs, Word files, and email signatures. A
//                 signature image is not the same as a certificate-based digital
//                 signature. If a contract requires one, check the requirements
//                 with the other party.
//               </p>
//             </div>

//             <div className="sm-seo-box rounded-2xl p-6">
//               <h3
//                 className="font-bold text-lg mb-4"
//                 style={{ color: "#1a1a2e" }}
//               >
//                 Optimizing Your Signature Image
//               </h3>
//               <p className="leading-7 text-sm">
//                 Small files are easier to send and upload. Reduce the file size
//                 with our{" "}
//                 <NextLink href="/image-compressor" className={linkClass}>
//                   Image Compressor
//                 </NextLink>
//                 , change formats with our{" "}
//                 <NextLink href="/image-converter" className={linkClass}>
//                   Image Converter
//                 </NextLink>
//                 , or protect signed images from reuse with{" "}
//                 <NextLink href="/add-watermark" className={linkClass}>
//                   Add Watermark
//                 </NextLink>
//                 .
//               </p>
//             </div>

//             <div className="sm-seo-box rounded-2xl p-6">
//               <h3
//                 className="font-bold text-lg mb-4"
//                 style={{ color: "#1a1a2e" }}
//               >
//                 Who Should Use This Signature Tool?
//               </h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   "Business professionals who sign contracts and NDAs",
//                   "Freelancers and agencies who sign invoices and work agreements",
//                   "Students who fill in online forms and academic documents",
//                   "Remote teams who sign paperwork without printing",
//                   "Anyone who wants a reusable transparent signature",
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-2 text-sm">
//                     <span
//                       className="font-bold mt-0.5"
//                       style={{ color: "#6366F1" }}
//                     >
//                       →
//                     </span>
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="sm-seo-box rounded-2xl p-6">
//               <h3
//                 className="font-bold text-lg mb-4"
//                 style={{ color: "#1a1a2e" }}
//               >
//                 Key Features
//               </h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   "100% free, unlimited signatures",
//                   "Draw with mouse, stylus, or mobile touch",
//                   "Upload a signature photo and remove the background",
//                   "Custom pen color selection",
//                   "Stroke size customization (Small, Medium, Large)",
//                   "Transparent PNG, trimmed to your signature",
//                   "Works on Android, iOS, Windows & Mac",
//                   "Private: nothing is uploaded or saved on servers",
//                 ].map((f, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span
//                       className="sm-feature-dot"
//                       style={{
//                         width: "6px",
//                         height: "6px",
//                         borderRadius: "50%",
//                         background: "#6366F1",
//                         display: "inline-block",
//                       }}
//                     />
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
//             <h2
//               className="text-2xl font-bold text-center mb-10"
//               style={{ color: "#1a1a2e" }}
//             >
//               Frequently Asked Questions
//             </h2>
//             <div className="space-y-3">
//               {faqs.map((faq, i) => (
//                 <details
//                   key={i}
//                   className="sm-faq-item rounded-xl p-5 border border-indigo-100 bg-white shadow-sm"
//                 >
//                   <summary className="flex items-center justify-between gap-4 cursor-pointer">
//                     <span
//                       className="font-semibold text-sm"
//                       style={{ color: "#374151" }}
//                     >
//                       {faq.q}
//                     </span>
//                     <ChevronDown
//                       className="w-4 h-4 shrink-0"
//                       style={{ color: "#6366F1" }}
//                     />
//                   </summary>
//                   <div
//                     className="mt-3 text-sm leading-relaxed"
//                     style={{ color: "#6B7280" }}
//                   >
//                     {faq.a}
//                   </div>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── RELATED TOOLS ── */}
//         <hr className="sm-divider" />
//         <section className="sm-section-alt py-14 px-6">
//           <div className="max-w-4xl mx-auto">
//             <h2
//               className="text-2xl font-bold mb-6 text-center"
//               style={{ color: "#1a1a2e" }}
//             >
//               More Free Image & Document Tools
//             </h2>
//             <div className="flex flex-wrap justify-center gap-3">
//               {relatedTools.map((tool, i) => (
//                 <NextLink
//                   key={i}
//                   href={tool.href}
//                   className="px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:shadow-md hover:-translate-y-0.5"
//                   style={{
//                     color: "#4F46E5",
//                     borderColor: "#E0E7FF",
//                     background: "#EEF2FF",
//                   }}
//                 >
//                   {tool.name}
//                 </NextLink>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── BOTTOM CTA ── */}
//         <section className="sm-cta-section">
//           <div className="max-w-xl mx-auto">
//             <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
//               Ready to create your digital signature?
//             </h2>
//             <p
//               className="mb-8 text-base"
//               style={{ color: "rgba(255,255,255,0.7)" }}
//             >
//               Takes 10 seconds. No signup required. Transparent PNG download.
//             </p>
//             <button
//               onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
