"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import {
  QrCode,
  Lock,
  Ruler,
  Youtube,
  Image as ImageIcon,
  PenTool,
  FileImage,
  FileText,
  RefreshCw,
  ArrowUp,
  Zap,
  Shield,
  Star,
  Volume2,
  LinkIcon,
  Search,
} from "lucide-react";
import "@/styles/HomeContent.css";

const JsonLd = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
);

/* ───────────────── FAQ SCHEMA (unchanged) ───────────────── */
const faqSchemaData = [
  {
    q: "Is ConvertLinx completely free to use?",
    a: "Yes! All web utilities, converters, text processing, and developer tools on ConvertLinx are 100% free with no signups, daily limits, or hidden fees.",
  },
  {
    q: "Are my uploaded files and text safe?",
    a: "Absolutely. ConvertLinx processes everything client-side inside your browser. Your files, images, and text never reach external servers, ensuring 100% privacy and security.",
  },
  {
    q: "What text and content optimization tools are available?",
    a: "You can analyze text with our Word Counter, convert text casing with Case Converter, generate dummy text using Lorem Ipsum, create clean URLs with Text to Slug, and build SEO tags using the Meta Tag Generator.",
  },
  {
    q: "Which developer and web utility tools can I use?",
    a: "We offer essential developer tools like the JSON Formatter, Base64 Tool, Regex Tester, Favicon Generator, OG Preview Checker, and WhatsApp Link Generator.",
  },
  {
    q: "How do I edit or convert images on ConvertLinx?",
    a: "You can compress images via Image Compressor, resize with Image Resizer, crop using Image Cropper, convert formats with Image Converter, handle iPhone photos with HEIC to JPG, change PNG images to JPG with PNG to JPG, convert JFIF files using JFIF to JPG, make favicons with PNG to ICO, extract text using Image to Text (OCR), adjust orientation using Rotate & Flip Image, or protect photos with Add Watermark.",
  },
  {
    q: "Does ConvertLinx offer handy everyday utility tools?",
    a: "Yes, easily build codes using our QR Code Generator, generate secure passwords via Password Generator, convert units using Unit Converter, pick color codes with Color Picker, download media covers with YouTube Thumbnail, sign documents with Signature Maker, convert notes with Text to PDF, and create audio using Text to Speech.",
  },
  {
    q: "Looking for advanced PDF tools and document management?",
    a: "For dedicated PDF workflows such as merging, splitting, compressing, or converting document files, check out our sister tool site PDFLinx.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqSchemaData.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/* ───────────────── RICH TEXT HELPER ─────────────────
   parts = array of plain strings and [href, label, isExternal?]
   Output is real <a>/<Link> markup, same text + same URLs as before. */
const Rich = ({ parts }) =>
  parts.map((p, i) => {
    if (typeof p === "string") return <Fragment key={i}>{p}</Fragment>;
    const [href, label, external] = p;
    return external ? (
      <a
        key={i}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="home-inline-link"
      >
        {label}
      </a>
    ) : (
      <Link key={i} href={href} className="home-inline-link">
        {label}
      </Link>
    );
  });

const PDFLINX = ["https://pdflinx.com", "PDFLinx", true];

/* ───────────────── SEO PARAGRAPHS (same text + links) ───────────────── */
const seoParagraphs = [
  [
    "ConvertLinx provides a full range of online text utilities to help you manage and refine content effortlessly. You can quickly analyze text structure using our ",
    ["/word-counter", "Word Counter"],
    ", modify capitalization with the ",
    ["/case-converter", "Case Converter"],
    ", generate placeholder text using ",
    ["/lorem-ipsum", "Lorem Ipsum"],
    ", optimize web links via ",
    ["/text-to-slug", "Text to Slug"],
    ", and create essential search tags with the ",
    ["/metatag-generator", "Meta Tag Generator"],
    ".",
  ],
  [
    "Built for web developers and programmers, our browser-based utility suite includes a fast ",
    ["/json-formatter", "JSON Formatter"],
    ", reliable ",
    ["/base64-tool", "Base64 Tool"],
    ", precise ",
    ["/regex-tester", "Regex Tester"],
    ", ",
    ["/favicon-generator", "Favicon Generator"],
    ", ",
    ["/og-preview-checker", "OG Preview Checker"],
    ", and ",
    ["/whatsapp-link-generator", "WhatsApp Link Generator"],
    " to simplify daily coding and web workflows.",
  ],
  [
    "For everyday digital tasks, explore tools like our custom ",
    ["/color-picker", "Color Picker"],
    ", instant ",
    ["/qr-generator", "QR Generator"],
    ", secure ",
    ["/password-gen", "Password Generator"],
    ", comprehensive ",
    ["/unit-converter", "Unit Converter"],
    ", ",
    ["/youtube-thumbnail", "YouTube Thumbnail"],
    " downloader, custom ",
    ["/signature-maker", "Signature Maker"],
    ", ",
    ["/text-to-pdf", "Text to PDF"],
    " creator, and natural ",
    ["/text-to-speech", "Text to Speech"],
    " converter.",
  ],
  [
    "Easily process images right inside your browser with zero server uploads. Shrink file sizes using ",
    ["/image-compressor", "Image Compressor"],
    ", adjust dimensions with ",
    ["/image-resizer", "Image Resizer"],
    ", trim edges using ",
    ["/image-cropper", "Image Cropper"],
    ", change file formats with ",
    ["/image-converter", "Image Converter"],
    ", turn iPhone images to standard files via ",
    ["/heic-to-jpg", "HEIC to JPG"],
    ", turn PNG images into smaller JPG files with ",
    ["/png-to-jpg", "PNG to JPG"],
    ", open unusual photo files via ",
    ["/jfif-to-jpg", "JFIF to JPG"],
    ", create website icons using ",
    ["/png-to-ico", "PNG to ICO"],
    ", extract text using ",
    ["/image-to-text", "Image to Text (OCR)"],
    ", adjust orientations using ",
    ["/rotate-flip-image", "Rotate & Flip Image"],
    ", and secure artwork with ",
    ["/add-watermark", "Add Watermark"],
    ".",
  ],
  [
    "Looking for complete PDF management such as merging, splitting, compressing, or converting document files? Visit our specialized sister platform ",
    PDFLINX,
    ".",
  ],
];

/* ───────────────── FAQ ITEMS (same text + links) ───────────────── */
const faqItems = [
  {
    q: "Is ConvertLinx completely free to use?",
    parts: [
      "Yes! All web utilities, converters, text processing, and developer tools on ConvertLinx are 100% free with no signups, daily limits, or hidden fees.",
    ],
  },
  {
    q: "Are my uploaded files and text safe?",
    parts: [
      "Absolutely. ConvertLinx processes everything client-side inside your browser. Your files, images, and text never reach external servers, ensuring 100% privacy and security.",
    ],
  },
  {
    q: "What text and content optimization tools are available?",
    parts: [
      "You can analyze text with our ",
      ["/word-counter", "Word Counter"],
      ", convert text casing with ",
      ["/case-converter", "Case Converter"],
      ", generate dummy text using ",
      ["/lorem-ipsum", "Lorem Ipsum"],
      ", create clean URLs with ",
      ["/text-to-slug", "Text to Slug"],
      ", and build SEO tags using the ",
      ["/metatag-generator", "Meta Tag Generator"],
      ".",
    ],
  },
  {
    q: "Which developer and web utility tools can I use?",
    parts: [
      "We offer essential developer tools like the ",
      ["/json-formatter", "JSON Formatter"],
      ", ",
      ["/base64-tool", "Base64 Tool"],
      ", ",
      ["/regex-tester", "Regex Tester"],
      ", ",
      ["/favicon-generator", "Favicon Generator"],
      ", ",
      ["/og-preview-checker", "OG Preview Checker"],
      ", and ",
      ["/whatsapp-link-generator", "WhatsApp Link Generator"],
      ".",
    ],
  },
  {
    q: "How do I edit or convert images on ConvertLinx?",
    parts: [
      "You can compress images via ",
      ["/image-compressor", "Image Compressor"],
      ", resize with ",
      ["/image-resizer", "Image Resizer"],
      ", crop using ",
      ["/image-cropper", "Image Cropper"],
      ", convert formats with ",
      ["/image-converter", "Image Converter"],
      ", handle iPhone photos with ",
      ["/heic-to-jpg", "HEIC to JPG"],
      ", change PNG images to JPG with ",
      ["/png-to-jpg", "PNG to JPG"],
      ", convert JFIF files using ",
      ["/jfif-to-jpg", "JFIF to JPG"],
      ", make favicons with ",
      ["/png-to-ico", "PNG to ICO"],
      ", extract text using ",
      ["/image-to-text", "Image to Text (OCR)"],
      ", adjust orientation using ",
      ["/rotate-flip-image", "Rotate & Flip Image"],
      ", or protect photos with ",
      ["/add-watermark", "Add Watermark"],
      ".",
    ],
  },
  {
    q: "Does ConvertLinx offer handy everyday utility tools?",
    parts: [
      "Yes, easily build codes using our ",
      ["/qr-generator", "QR Code Generator"],
      ", generate secure passwords via ",
      ["/password-gen", "Password Generator"],
      ", convert units using ",
      ["/unit-converter", "Unit Converter"],
      ", pick color codes with ",
      ["/color-picker", "Color Picker"],
      ", download media covers with ",
      ["/youtube-thumbnail", "YouTube Thumbnail"],
      ", sign documents with ",
      ["/signature-maker", "Signature Maker"],
      ", convert notes with ",
      ["/text-to-pdf", "Text to PDF"],
      ", and create audio using ",
      ["/text-to-speech", "Text to Speech"],
      ".",
    ],
  },
  {
    q: "Looking for advanced PDF tools and document management?",
    parts: [
      "For dedicated PDF workflows such as merging, splitting, compressing, or converting document files, check out our sister tool site ",
      PDFLINX,
      ".",
    ],
  },
];

/* Popular tools shown first (in this order) when "All" is selected */
const popularLinks = [
  "/signature-maker",
  "/image-converter",
  "/qr-generator",
  "/image-compressor",
];

/* Category tabs */
const categories = [
  { id: "all", label: "All tools" },
  { id: "images", label: "Images" },
  { id: "convert", label: "Convert" },
  { id: "text", label: "Text" },
  { id: "developer", label: "Developer" },
  { id: "security", label: "Security" },
  { id: "utility", label: "Utility" },
];

/* Hero quick chips */
const heroChips = [
  "Signature Maker",
  "Image Converter",
  "QR Code",
  "Image Compressor",
];

export default function HomeContent() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeCat, setActiveCat] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTools = () =>
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });

  /* NOTE: titles, descriptions, links, accents and tags are unchanged.
     Only `cat` (for the tabs) was added. */
  const tools = [
    {
      title: "QR Code Generator",
      desc: "Make QR codes for links, WiFi passwords, menus – ready in seconds.",
      link: "/qr-generator",
      icon: <QrCode className="w-7 h-7" />,
      accent: "#6366F1",
      tag: "Popular",
      cat: "utility",
    },
    {
      title: "Password Generator",
      desc: "Create strong, random passwords that actually keep your accounts safe.",
      link: "/password-gen",
      icon: <Lock className="w-7 h-7" />,
      accent: "#7C3AED",
      tag: "Security",
      cat: "security",
    },
    {
      title: "Unit Converter",
      desc: "Quick conversions for length, weight, temperature – over 50 units supported.",
      link: "/unit-converter",
      icon: <Ruler className="w-7 h-7" />,
      accent: "#059669",
      tag: "Utility",
      cat: "utility",
    },
    {
      title: "YouTube Thumbnail",
      desc: "Grab full HD thumbnails from any YouTube video in one click.",
      link: "/youtube-thumbnail",
      icon: <Youtube className="w-7 h-7" />,
      accent: "#DC2626",
      tag: "Media",
      cat: "utility",
    },
    {
      title: "Image Compressor",
      desc: "Reduce image size by up to 80% while keeping them looking sharp.",
      link: "/image-compressor",
      icon: <ImageIcon className="w-7 h-7" />,
      accent: "#0284C7",
      tag: "Images",
      cat: "images",
    },
    {
      title: "Image to Text (OCR)",
      desc: "Extract text from photos, scans, or screenshots – surprisingly accurate.",
      link: "/image-to-text",
      icon: <ImageIcon className="w-7 h-7" />,
      accent: "#9333EA",
      tag: "OCR",
      cat: "images",
    },
    {
      title: "Signature Maker",
      desc: "Draw or type your signature and download it for documents.",
      link: "/signature-maker",
      icon: <PenTool className="w-7 h-7" />,
      accent: "#0F766E",
      tag: "Documents",
      cat: "utility",
    },
    {
      title: "HEIC to JPG",
      desc: "Convert iPhone photos to regular JPGs that open everywhere.",
      link: "/heic-to-jpg",
      icon: <FileImage className="w-7 h-7" />,
      accent: "#EA580C",
      tag: "Convert",
      cat: "convert",
    },
    {
      title: "Text to PDF",
      desc: "Turn plain text into a nicely formatted PDF with custom styling.",
      link: "/text-to-pdf",
      icon: <FileText className="w-7 h-7" />,
      accent: "#7C3AED",
      tag: "Convert",
      cat: "convert",
    },
    {
      title: "Image Converter",
      desc: "Switch between JPG, PNG, WebP, GIF – transparency stays intact.",
      link: "/image-converter",
      icon: <RefreshCw className="w-7 h-7" />,
      accent: "#DB2777",
      tag: "Images",
      cat: "convert",
    },
    {
      title: "Image Resizer",
      desc: "Resize images to any dimension without losing quality in seconds.",
      link: "/image-resizer",
      icon: <ImageIcon className="w-7 h-7" />,
      accent: "#0EA5E9",
      tag: "Images",
      cat: "images",
    },
    {
      title: "Image Cropper",
      desc: "Crop images to exact size or ratio with precision and ease.",
      link: "/image-cropper",
      icon: <ImageIcon className="w-7 h-7" />,
      accent: "#F59E0B",
      tag: "Images",
      cat: "images",
    },
    {
      title: "Word Counter",
      desc: "Count words, characters, sentences, and paragraphs instantly in your text.",
      link: "/word-counter",
      icon: <FileText className="w-7 h-7" />,
      accent: "#2563EB",
      tag: "Text",
      cat: "text",
    },
    {
      title: "Case Converter",
      desc: "Convert text to uppercase, lowercase, title case, or sentence case easily.",
      link: "/case-converter",
      icon: <RefreshCw className="w-7 h-7" />,
      accent: "#7C3AED",
      tag: "Text",
      cat: "text",
    },
    {
      title: "Lorem Ipsum Generator",
      desc: "Generate dummy placeholder text for design, layouts, or content testing.",
      link: "/lorem-ipsum",
      icon: <PenTool className="w-7 h-7" />,
      accent: "#059669",
      tag: "Text",
      cat: "text",
    },
    {
      title: "JSON Formatter",
      desc: "Format, beautify, and validate JSON data for better readability.",
      link: "/json-formatter",
      icon: <FileText className="w-7 h-7" />,
      accent: "#DC2626",
      tag: "Developer",
      cat: "developer",
    },
    {
      title: "Base64 Tool",
      desc: "Encode and decode Base64 strings quickly for development and data handling.",
      link: "/base64-tool",
      icon: <Lock className="w-7 h-7" />,
      accent: "#EA580C",
      tag: "Developer",
      cat: "developer",
    },
    {
      title: "Color Picker",
      desc: "Pick colors, get HEX/RGB values, and build your perfect color palette.",
      link: "/color-picker",
      icon: <ImageIcon className="w-7 h-7" />,
      accent: "#DB2777",
      tag: "Design",
      cat: "utility",
    },
    {
      title: "Add Watermark",
      desc: "Add text or logo watermark to your images to protect them from reuse.",
      link: "/add-watermark",
      icon: <ImageIcon className="w-7 h-7" />,
      accent: "#6366F1",
      tag: "Images",
      cat: "images",
    },
    {
      title: "PNG to JPG",
      desc: "Turn PNG images into lightweight JPG files in seconds, right in your browser.",
      link: "/png-to-jpg",
      icon: <FileImage className="w-7 h-7" />,
      accent: "#F43F5E",
      tag: "Convert",
      cat: "convert",
    },
    {
      title: "JFIF to JPG",
      desc: "Convert JFIF files to standard JPG images that open on any device.",
      link: "/jfif-to-jpg",
      icon: <FileImage className="w-7 h-7" />,
      accent: "#14B8A6",
      tag: "Convert",
      cat: "convert",
    },
    {
      title: "PNG to ICO",
      desc: "Convert PNG images to ICO files for favicons and Windows icons instantly.",
      link: "/png-to-ico",
      icon: <FileImage className="w-7 h-7" />,
      accent: "#8B5CF6",
      tag: "Convert",
      cat: "convert",
    },
    {
      title: "Regex Tester",
      desc: "Test and debug regular expressions live with match highlighting and instant results.",
      link: "/regex-tester",
      icon: <FileText className="w-7 h-7" />,
      accent: "#4F46E5",
      tag: "Developer",
      cat: "developer",
    },
    {
      title: "Favicon Generator",
      desc: "Create favicons in all required sizes from any image for your website.",
      link: "/favicon-generator",
      icon: <ImageIcon className="w-7 h-7" />,
      accent: "#D97706",
      tag: "Developer",
      cat: "developer",
    },
    {
      title: "OG Preview Checker",
      desc: "Preview how your link looks on Facebook, X, and LinkedIn before you share it.",
      link: "/og-preview-checker",
      icon: <LinkIcon className="w-7 h-7" />,
      accent: "#0891B2",
      tag: "SEO",
      cat: "developer",
    },
    {
      title: "WhatsApp Link Generator",
      desc: "Create click-to-chat WhatsApp links with a custom pre-filled message.",
      link: "/whatsapp-link-generator",
      icon: <LinkIcon className="w-7 h-7" />,
      accent: "#16A34A",
      tag: "Utility",
      cat: "utility",
    },
    {
      title: "Meta Tag Generator",
      desc: "Generate SEO meta tags including title, description, and Open Graph data easily.",
      link: "/metatag-generator",
      icon: <FileText className="w-7 h-7" />,
      accent: "#7C3AED",
      tag: "SEO",
      cat: "text",
    },
    {
      title: "Rotate & Flip Image",
      desc: "Rotate or flip images horizontally and vertically in seconds online.",
      link: "/rotate-flip-image",
      icon: <RefreshCw className="w-7 h-7" />,
      accent: "#059669",
      tag: "Images",
      cat: "images",
    },
    {
      title: "Text to Speech",
      desc: "Convert written text into natural sounding speech with multiple voice options.",
      link: "/text-to-speech",
      icon: <Volume2 className="w-7 h-7" />,
      accent: "#DC2626",
      tag: "AI",
      cat: "text",
    },
    {
      title: "Text to Slug",
      desc: "Convert text into clean, SEO-friendly URL slugs instantly for your website.",
      link: "/text-to-slug",
      icon: <LinkIcon className="w-7 h-7" />,
      accent: "#EA580C",
      tag: "SEO",
      cat: "text",
    },
  ];

  const stats = [
    { value: "30+", label: "Free Tools" },
    { value: "0", label: "Ads" },
    { value: "100%", label: "Browser-based" },
    { value: "∞", label: "Free Forever" },
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Blazing Fast",
      desc: "Everything runs in your browser. No waiting for server uploads or processing.",
      color: "#F59E0B",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "100% Private",
      desc: "Your files never leave your device. No uploads to shady servers, ever.",
      color: "#10B981",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Actually Free",
      desc: "No hidden plans, no free trial, no credit card. Just tools that work.",
      color: "#6366F1",
    },
  ];

  /* ── filter + order tools ── */
  const q = query.trim().toLowerCase();
  const filtered = tools.filter(
    (t) =>
      (activeCat === "all" || t.cat === activeCat) &&
      (!q || `${t.title} ${t.desc} ${t.tag}`.toLowerCase().includes(q))
  );
  const showPopular = activeCat === "all" && !q;
  const visibleTools = showPopular
    ? [
        ...popularLinks
          .map((l) => filtered.find((t) => t.link === l))
          .filter(Boolean),
        ...filtered.filter((t) => !popularLinks.includes(t.link)),
      ]
    : filtered;

  return (
    <>
      <JsonLd data={faqSchema} />

      <main className="home-page">
        {/* ── HERO ── */}
        <section className="home-hero">
          <div className="home-hero-grid" />
          <div className="home-hero-blob-1 home-float" />
          <div className="home-hero-blob-2" style={{ animationDelay: "2s" }} />

          <div className="home-hero-inner">
            {/* Left: text */}
            <div className="home-hero-text">
              <div className="home-hero-badge">
                <span className="home-hero-badge-dot" />
                27+ Free Tools · No Signup · No Ads
              </div>

              <h1 className="home-hero-title">
                What do you want to do?{" "}
                <span className="home-hero-grad">The tool is right here.</span>
              </h1>

              <p className="home-hero-sub">
                QR codes, image tools, converters, OCR and more. All free, all
                in your browser, and your files are never uploaded.
              </p>

              {/* Search */}
              <form
                className="home-search"
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  setActiveCat("all");
                  scrollToTools();
                }}
              >
                <Search className="home-search-icon" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a tool, e.g. compress image"
                  aria-label="Search tools"
                  autoComplete="off"
                />
                <button type="submit" className="home-search-btn">
                  Search
                </button>
              </form>

              {/* Popular chips */}
              <div className="home-chips">
                <span className="home-chips-label">Popular:</span>
                {heroChips.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="home-chip"
                    onClick={() => {
                      setActiveCat("all");
                      setQuery(c);
                      scrollToTools();
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* CTAs */}
              <div className="home-hero-ctas">
                <button onClick={scrollToTools} className="home-cta-primary">
                  Explore All Tools →
                </button>
                <a href="/qr-generator" className="home-cta-secondary">
                  Try QR Generator
                </a>
              </div>

              {/* Stats */}
              <div className="home-facts">
                {stats.map((s, i) => (
                  <div key={i} className="home-stat-card">
                    <div className="home-stat-value">{s.value}</div>
                    <div className="home-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: floating tool previews (decorative) */}
            <div className="home-hero-stack" aria-hidden="true">
              <div className="home-hcard home-hcard-a">
                <div className="home-hcard-head">
                  <span
                    className="home-hcard-ico"
                    style={{ background: "#0F766E14", color: "#0F766E" }}
                  >
                    <PenTool className="w-5 h-5" />
                  </span>
                  <div>
                    <h4>Signature Maker</h4>
                    <p>Draw or type, then download</p>
                  </div>
                </div>
                <svg
                  className="home-sign-svg"
                  viewBox="0 0 220 60"
                  fill="none"
                  stroke="#0F766E"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 40 C 22 8, 34 8, 30 34 S 40 50, 52 24 S 66 18, 70 36 S 92 44, 104 22 S 120 14, 124 34 C 136 50, 160 14, 178 30 S 200 44, 212 26" />
                </svg>
              </div>

              <div className="home-hcard home-hcard-b">
                <div className="home-hcard-head">
                  <span
                    className="home-hcard-ico"
                    style={{ background: "#DB277714", color: "#DB2777" }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </span>
                  <div>
                    <h4>Image Converter</h4>
                    <p>JPG, PNG, WebP, GIF</p>
                  </div>
                </div>
                <div className="home-fmt-row">
                  <span>JPG</span>
                  <b>→</b>
                  <span className="home-fmt-on">PNG</span>
                </div>
              </div>

              <div className="home-hcard home-hcard-c">
                <div className="home-hcard-head">
                  <span
                    className="home-hcard-ico"
                    style={{ background: "#6366F114", color: "#6366F1" }}
                  >
                    <QrCode className="w-5 h-5" />
                  </span>
                  <div>
                    <h4>QR Code Generator</h4>
                    <p>Links, WiFi, menus</p>
                  </div>
                </div>
                <div className="home-mini-qr" />
              </div>
            </div>
          </div>
        </section>

        {/* ── TOOLS GRID ── */}
        <section id="tools" className="home-section-alt home-tools-section">
          <div className="home-container">
            <div className="home-section-head">
              <h2 className="home-tools-title">All Tools</h2>
              <p className="home-section-sub">Pick one — done in seconds</p>
            </div>

            <div className="home-tabs" role="tablist" aria-label="Tool categories">
              {categories.map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  type="button"
                  aria-selected={activeCat === c.id}
                  className="home-tab"
                  onClick={() => setActiveCat(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="home-tools-grid">
              {visibleTools.map((tool) => {
                const isPopular = showPopular && popularLinks.includes(tool.link);
                return (
                  <Link
                    key={tool.link}
                    href={tool.link}
                    className={`home-tool-card${isPopular ? " is-popular" : ""}`}
                    style={{ "--accent": tool.accent }}
                  >
                    <div className="home-tool-top">
                      <div
                        className="home-tool-icon-wrap"
                        style={{
                          background: `${tool.accent}14`,
                          color: tool.accent,
                        }}
                      >
                        {tool.icon}
                      </div>
                      <div className="home-badges">
                        {isPopular && (
                          <span className="home-pop-badge">★ Popular</span>
                        )}
                        <span
                          className="home-tag-badge"
                          style={{
                            background: `${tool.accent}12`,
                            color: tool.accent,
                          }}
                        >
                          {tool.tag}
                        </span>
                      </div>
                    </div>

                    <h3 className="home-tool-title">{tool.title}</h3>
                    <p className="home-tool-desc">{tool.desc}</p>

                    <div className="home-tool-link" style={{ color: tool.accent }}>
                      Open Tool <span>→</span>
                    </div>
                  </Link>
                );
              })}

              {visibleTools.length === 0 && (
                <div className="home-empty">
                  No tool found. Try another word like “image” or “text”.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SEO CONTEXTUAL CONTENT ── */}
        <section className="home-seo-wrap">
          <div className="home-seo-box">
            <h2 className="home-seo-title">
              Everything You Need to Convert & Utility Tools Online
            </h2>
            {seoParagraphs.map((parts, i) => (
              <p key={i}>
                <Rich parts={parts} />
              </p>
            ))}
          </div>
        </section>

        {/* ── WHY ConvertLinx ── */}
        <section className="home-section-main home-why-section">
          <div className="home-container">
            <div className="home-section-head">
              <h2 className="home-tools-title">Why ConvertLinx?</h2>
              <p className="home-section-sub">Built different. Works better.</p>
            </div>

            <div className="home-features">
              {features.map((item, i) => (
                <div key={i} className="home-feature-card">
                  <div
                    className="home-feature-icon"
                    style={{ background: `${item.color}14`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="home-feature-title">{item.title}</h3>
                  <p className="home-feature-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ (accordion – answers stay in the HTML) ── */}
        <section className="home-faq-section">
          <div className="home-section-head">
            <h2 className="home-tools-title">Frequently Asked Questions</h2>
            <p className="home-section-sub">
              Everything you need to know about ConvertLinx
            </p>
          </div>

          <div className="home-faq">
            {faqItems.map((f, i) => (
              <details key={i} className="home-faq-item" open={i === 0}>
                <summary>
                  <h3>{f.q}</h3>
                </summary>
                <p>
                  <Rich parts={f.parts} />
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="home-bottom-cta">
          <div className="max-w-2xl mx-auto">
            <div className="home-bottom-cta-badge">Ready to get started?</div>
            <h2 className="home-bottom-cta-title">
              All tools. Zero cost. Right now.
            </h2>
            <p className="home-bottom-cta-sub">
              No account needed. Just open and use.
            </p>
            <button onClick={scrollToTools} className="home-bottom-cta-btn">
              Browse All Tools →
            </button>
          </div>
        </section>

        {/* Back to Top */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="home-back-top"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </main>
    </>
  );
}


































// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   QrCode,
//   Lock,
//   Ruler,
//   Youtube,
//   Image as ImageIcon,
//   PenTool,
//   FileImage,
//   FileText,
//   RefreshCw,
//   ArrowUp,
//   Zap,
//   Shield,
//   Star,
//   Volume2,
//   LinkIcon,
// } from "lucide-react";
// import "@/styles/HomeContent.css";

// const JsonLd = ({ data }) => (
//   <script
//     type="application/ld+json"
//     dangerouslySetInnerHTML={{
//       __html: JSON.stringify(data).replace(/</g, "\\u003c"),
//     }}
//   />
// );

// const faqSchemaData = [
//   {
//     q: "Is ConvertLinx completely free to use?",
//     a: "Yes! All web utilities, converters, text processing, and developer tools on ConvertLinx are 100% free with no signups, daily limits, or hidden fees.",
//   },
//   {
//     q: "Are my uploaded files and text safe?",
//     a: "Absolutely. ConvertLinx processes everything client-side inside your browser. Your files, images, and text never reach external servers, ensuring 100% privacy and security.",
//   },
//   {
//     q: "What text and content optimization tools are available?",
//     a: "You can analyze text with our Word Counter, convert text casing with Case Converter, generate dummy text using Lorem Ipsum, create clean URLs with Text to Slug, and build SEO tags using the Meta Tag Generator.",
//   },
//   {
//     q: "Which developer and web utility tools can I use?",
//     a: "We offer essential developer tools like the JSON Formatter, Base64 Tool, Regex Tester, Favicon Generator, OG Preview Checker, and WhatsApp Link Generator.",
//   },

//   {
//     q: "How do I edit or convert images on ConvertLinx?",
//     a: "You can compress images via Image Compressor, resize with Image Resizer, crop using Image Cropper, convert formats with Image Converter, handle iPhone photos with HEIC to JPG, change PNG images to JPG with PNG to JPG, convert JFIF files using JFIF to JPG, make favicons with PNG to ICO, extract text using Image to Text (OCR), adjust orientation using Rotate & Flip Image, or protect photos with Add Watermark.",
//   },

//   // {
//   //   q: "How do I edit or convert images on ConvertLinx?",
//   //   a: "You can compress images via Image Compressor, resize with Image Resizer, crop using Image Cropper, convert formats with Image Converter, handle iPhone photos with HEIC to JPG, extract text using Image to Text (OCR), adjust orientation using Rotate & Flip Image, or protect photos with Add Watermark.",
//   // },

//   {
//     q: "Does ConvertLinx offer handy everyday utility tools?",
//     a: "Yes, easily build codes using our QR Code Generator, generate secure passwords via Password Generator, convert units using Unit Converter, pick color codes with Color Picker, download media covers with YouTube Thumbnail, sign documents with Signature Maker, convert notes with Text to PDF, and create audio using Text to Speech.",
//   },
//   {
//     q: "Looking for advanced PDF tools and document management?",
//     a: "For dedicated PDF workflows such as merging, splitting, compressing, or converting document files, check out our sister tool site PDFLinx.",
//   },
// ];

// const faqSchema = {
//   "@context": "https://schema.org",
//   "@type": "FAQPage",
//   mainEntity: faqSchemaData.map((f) => ({
//     "@type": "Question",
//     name: f.q,
//     acceptedAnswer: { "@type": "Answer", text: f.a },
//   })),
// };

// export default function HomeContent() {
//   const [showBackToTop, setShowBackToTop] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setShowBackToTop(window.scrollY > 600);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const tools = [
//     {
//       title: "QR Code Generator",
//       desc: "Make QR codes for links, WiFi passwords, menus – ready in seconds.",
//       link: "/qr-generator",
//       icon: <QrCode className="w-7 h-7" />,
//       accent: "#6366F1",
//       tag: "Popular",
//     },
//     {
//       title: "Password Generator",
//       desc: "Create strong, random passwords that actually keep your accounts safe.",
//       link: "/password-gen",
//       icon: <Lock className="w-7 h-7" />,
//       accent: "#7C3AED",
//       tag: "Security",
//     },
//     {
//       title: "Unit Converter",
//       desc: "Quick conversions for length, weight, temperature – over 50 units supported.",
//       link: "/unit-converter",
//       icon: <Ruler className="w-7 h-7" />,
//       accent: "#059669",
//       tag: "Utility",
//     },
//     {
//       title: "YouTube Thumbnail",
//       desc: "Grab full HD thumbnails from any YouTube video in one click.",
//       link: "/youtube-thumbnail",
//       icon: <Youtube className="w-7 h-7" />,
//       accent: "#DC2626",
//       tag: "Media",
//     },
//     {
//       title: "Image Compressor",
//       desc: "Reduce image size by up to 80% while keeping them looking sharp.",
//       link: "/image-compressor",
//       icon: <ImageIcon className="w-7 h-7" />,
//       accent: "#0284C7",
//       tag: "Images",
//     },
//     {
//       title: "Image to Text (OCR)",
//       desc: "Extract text from photos, scans, or screenshots – surprisingly accurate.",
//       link: "/image-to-text",
//       icon: <ImageIcon className="w-7 h-7" />,
//       accent: "#9333EA",
//       tag: "OCR",
//     },
//     {
//       title: "Signature Maker",
//       desc: "Draw or type your signature and download it for documents.",
//       link: "/signature-maker",
//       icon: <PenTool className="w-7 h-7" />,
//       accent: "#0F766E",
//       tag: "Documents",
//     },
//     {
//       title: "HEIC to JPG",
//       desc: "Convert iPhone photos to regular JPGs that open everywhere.",
//       link: "/heic-to-jpg",
//       icon: <FileImage className="w-7 h-7" />,
//       accent: "#EA580C",
//       tag: "Convert",
//     },
//     {
//       title: "Text to PDF",
//       desc: "Turn plain text into a nicely formatted PDF with custom styling.",
//       link: "/text-to-pdf",
//       icon: <FileText className="w-7 h-7" />,
//       accent: "#7C3AED",
//       tag: "Convert",
//     },
//     {
//       title: "Image Converter",
//       desc: "Switch between JPG, PNG, WebP, GIF – transparency stays intact.",
//       link: "/image-converter",
//       icon: <RefreshCw className="w-7 h-7" />,
//       accent: "#DB2777",
//       tag: "Images",
//     },
//     {
//       title: "Image Resizer",
//       desc: "Resize images to any dimension without losing quality in seconds.",
//       link: "/image-resizer",
//       icon: <ImageIcon className="w-7 h-7" />,
//       accent: "#0EA5E9",
//       tag: "Images",
//     },
//     {
//       title: "Image Cropper",
//       desc: "Crop images to exact size or ratio with precision and ease.",
//       link: "/image-cropper",
//       icon: <ImageIcon className="w-7 h-7" />,
//       accent: "#F59E0B",
//       tag: "Images",
//     },
//     {
//       title: "Word Counter",
//       desc: "Count words, characters, sentences, and paragraphs instantly in your text.",
//       link: "/word-counter",
//       icon: <FileText className="w-7 h-7" />,
//       accent: "#2563EB",
//       tag: "Text",
//     },
//     {
//       title: "Case Converter",
//       desc: "Convert text to uppercase, lowercase, title case, or sentence case easily.",
//       link: "/case-converter",
//       icon: <RefreshCw className="w-7 h-7" />,
//       accent: "#7C3AED",
//       tag: "Text",
//     },
//     {
//       title: "Lorem Ipsum Generator",
//       desc: "Generate dummy placeholder text for design, layouts, or content testing.",
//       link: "/lorem-ipsum",
//       icon: <PenTool className="w-7 h-7" />,
//       accent: "#059669",
//       tag: "Text",
//     },
//     {
//       title: "JSON Formatter",
//       desc: "Format, beautify, and validate JSON data for better readability.",
//       link: "/json-formatter",
//       icon: <FileText className="w-7 h-7" />,
//       accent: "#DC2626",
//       tag: "Developer",
//     },
//     {
//       title: "Base64 Tool",
//       desc: "Encode and decode Base64 strings quickly for development and data handling.",
//       link: "/base64-tool",
//       icon: <Lock className="w-7 h-7" />,
//       accent: "#EA580C",
//       tag: "Developer",
//     },
//     {
//       title: "Color Picker",
//       desc: "Pick colors, get HEX/RGB values, and build your perfect color palette.",
//       link: "/color-picker",
//       icon: <ImageIcon className="w-7 h-7" />,
//       accent: "#DB2777",
//       tag: "Design",
//     },
//     {
//       title: "Add Watermark",
//       desc: "Add text or logo watermark to your images to protect them from reuse.",
//       link: "/add-watermark",
//       icon: <ImageIcon className="w-7 h-7" />,
//       accent: "#6366F1",
//       tag: "Images",
//     },
//     {
//       title: "PNG to JPG",
//       desc: "Turn PNG images into lightweight JPG files in seconds, right in your browser.",
//       link: "/png-to-jpg",
//       icon: <FileImage className="w-7 h-7" />,
//       accent: "#F43F5E",
//       tag: "Convert",
//     },
//     {
//       title: "JFIF to JPG",
//       desc: "Convert JFIF files to standard JPG images that open on any device.",
//       link: "/jfif-to-jpg",
//       icon: <FileImage className="w-7 h-7" />,
//       accent: "#14B8A6",
//       tag: "Convert",
//     },
//     {
//       title: "PNG to ICO",
//       desc: "Convert PNG images to ICO files for favicons and Windows icons instantly.",
//       link: "/png-to-ico",
//       icon: <FileImage className="w-7 h-7" />,
//       accent: "#8B5CF6",
//       tag: "Convert",
//     },

//     {
//       title: "Regex Tester",
//       desc: "Test and debug regular expressions live with match highlighting and instant results.",
//       link: "/regex-tester",
//       icon: <FileText className="w-7 h-7" />,
//       accent: "#4F46E5",
//       tag: "Developer",
//     },
//     {
//       title: "Favicon Generator",
//       desc: "Create favicons in all required sizes from any image for your website.",
//       link: "/favicon-generator",
//       icon: <ImageIcon className="w-7 h-7" />,
//       accent: "#D97706",
//       tag: "Developer",
//     },
//     {
//       title: "OG Preview Checker",
//       desc: "Preview how your link looks on Facebook, X, and LinkedIn before you share it.",
//       link: "/og-preview-checker",
//       icon: <LinkIcon className="w-7 h-7" />,
//       accent: "#0891B2",
//       tag: "SEO",
//     },
//     {
//       title: "WhatsApp Link Generator",
//       desc: "Create click-to-chat WhatsApp links with a custom pre-filled message.",
//       link: "/whatsapp-link-generator",
//       icon: <LinkIcon className="w-7 h-7" />,
//       accent: "#16A34A",
//       tag: "Utility",
//     },

//     {
//       title: "Meta Tag Generator",
//       desc: "Generate SEO meta tags including title, description, and Open Graph data easily.",
//       link: "/metatag-generator",
//       icon: <FileText className="w-7 h-7" />,
//       accent: "#7C3AED",
//       tag: "SEO",
//     },
//     {
//       title: "Rotate & Flip Image",
//       desc: "Rotate or flip images horizontally and vertically in seconds online.",
//       link: "/rotate-flip-image",
//       icon: <RefreshCw className="w-7 h-7" />,
//       accent: "#059669",
//       tag: "Images",
//     },
//     {
//       title: "Text to Speech",
//       desc: "Convert written text into natural sounding speech with multiple voice options.",
//       link: "/text-to-speech",
//       icon: <Volume2 className="w-7 h-7" />,
//       accent: "#DC2626",
//       tag: "AI",
//     },
//     {
//       title: "Text to Slug",
//       desc: "Convert text into clean, SEO-friendly URL slugs instantly for your website.",
//       link: "/text-to-slug",
//       icon: <LinkIcon className="w-7 h-7" />,
//       accent: "#EA580C",
//       tag: "SEO",
//     },
//   ];

//   const stats = [
//     { value: "30+", label: "Free Tools" },
//     { value: "0", label: "Ads" },
//     { value: "100%", label: "Browser-based" },
//     { value: "∞", label: "Free Forever" },
//   ];

//   const features = [
//     {
//       icon: <Zap className="w-6 h-6" />,
//       title: "Blazing Fast",
//       desc: "Everything runs in your browser. No waiting for server uploads or processing.",
//       color: "#F59E0B",
//     },
//     {
//       icon: <Shield className="w-6 h-6" />,
//       title: "100% Private",
//       desc: "Your files never leave your device. No uploads to shady servers, ever.",
//       color: "#10B981",
//     },
//     {
//       icon: <Star className="w-6 h-6" />,
//       title: "Actually Free",
//       desc: "No hidden plans, no free trial, no credit card. Just tools that work.",
//       color: "#6366F1",
//     },
//   ];

//   return (
//     <>
//       <JsonLd data={faqSchema} />

//       <main className="home-page">
//         {/* ── HERO ── */}
//         <section className="home-hero">
//           <div className="home-hero-grid" />
//           <div className="home-hero-blob-1 home-float" />
//           <div className="home-hero-blob-2" style={{ animationDelay: "2s" }} />

//           <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
//             {/* Badge */}
//             <div className="home-hero-badge">
//               <span className="home-hero-badge-dot" />
//               27+ Free Tools · No Signup · No Ads
//             </div>

//             {/* Heading */}
//             <h1 className="home-hero-title">
//               Every Tool You Need,{" "}
//               <span className="home-hero-grad">Completely Free</span>
//             </h1>

//             <p className="home-hero-sub">
//               QR codes, image tools, converters, OCR and more — all in one
//               place. No signup, no ads, no nonsense.
//             </p>

//             {/* CTAs */}
//             <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
//               <button
//                 onClick={() =>
//                   document
//                     .getElementById("tools")
//                     ?.scrollIntoView({ behavior: "smooth" })
//                 }
//                 className="home-cta-primary"
//               >
//                 Explore All Tools →
//               </button>
//               <a href="/qr-generator" className="home-cta-secondary">
//                 Try QR Generator
//               </a>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
//               {stats.map((s, i) => (
//                 <div key={i} className="home-stat-card">
//                   <div className="home-stat-value">{s.value}</div>
//                   <div className="home-stat-label">{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── SEO CONTEXTUAL CONTENT SECTION (LOCATION 1) ── */}
//         <section className="py-12 px-6 max-w-5xl mx-auto text-gray-700 leading-relaxed">
//           <div className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm">
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
//               Everything You Need to Convert & Utility Tools Online
//             </h2>

//             {/* Text & Writing Tools */}
//             <p className="mb-4">
//               ConvertLinx provides a full range of online text utilities to help
//               you manage and refine content effortlessly. You can quickly
//               analyze text structure using our{" "}
//               <Link
//                 href="/word-counter"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Word Counter
//               </Link>
//               , modify capitalization with the{" "}
//               <Link
//                 href="/case-converter"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Case Converter
//               </Link>
//               , generate placeholder text using{" "}
//               <Link
//                 href="/lorem-ipsum"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Lorem Ipsum
//               </Link>
//               , optimize web links via{" "}
//               <Link
//                 href="/text-to-slug"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Text to Slug
//               </Link>
//               , and create essential search tags with the{" "}
//               <Link
//                 href="/metatag-generator"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Meta Tag Generator
//               </Link>
//               .
//             </p>

//             {/* Developer Tools */}
//             <p className="mb-4">
//               Built for web developers and programmers, our browser-based
//               utility suite includes a fast{" "}
//               <Link
//                 href="/json-formatter"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 JSON Formatter
//               </Link>
//               , reliable{" "}
//               <Link
//                 href="/base64-tool"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Base64 Tool
//               </Link>
//               , precise{" "}
//               <Link
//                 href="/regex-tester"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Regex Tester
//               </Link>
//               ,{" "}
//               <Link
//                 href="/favicon-generator"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Favicon Generator
//               </Link>
//               ,{" "}
//               <Link
//                 href="/og-preview-checker"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 OG Preview Checker
//               </Link>
//               , and{" "}
//               <Link
//                 href="/whatsapp-link-generator"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 WhatsApp Link Generator
//               </Link>{" "}
//               to simplify daily coding and web workflows.
//             </p>

//             {/* Utilities & Media */}
//             <p className="mb-4">
//               For everyday digital tasks, explore tools like our custom{" "}
//               <Link
//                 href="/color-picker"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Color Picker
//               </Link>
//               , instant{" "}
//               <Link
//                 href="/qr-generator"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 QR Generator
//               </Link>
//               , secure{" "}
//               <Link
//                 href="/password-gen"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Password Generator
//               </Link>
//               , comprehensive{" "}
//               <Link
//                 href="/unit-converter"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Unit Converter
//               </Link>
//               ,{" "}
//               <Link
//                 href="/youtube-thumbnail"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 YouTube Thumbnail
//               </Link>{" "}
//               downloader, custom{" "}
//               <Link
//                 href="/signature-maker"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Signature Maker
//               </Link>
//               ,{" "}
//               <Link
//                 href="/text-to-pdf"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Text to PDF
//               </Link>{" "}
//               creator, and natural{" "}
//               <Link
//                 href="/text-to-speech"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Text to Speech
//               </Link>{" "}
//               converter.
//             </p>

//             {/* Image Tools */}
//             <p className="mb-4">
//               Easily process images right inside your browser with zero server
//               uploads. Shrink file sizes using{" "}
//               <Link
//                 href="/image-compressor"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Image Compressor
//               </Link>
//               , adjust dimensions with{" "}
//               <Link
//                 href="/image-resizer"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Image Resizer
//               </Link>
//               , trim edges using{" "}
//               <Link
//                 href="/image-cropper"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Image Cropper
//               </Link>
//               , change file formats with{" "}
//               <Link
//                 href="/image-converter"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Image Converter
//               </Link>
//               , turn iPhone images to standard files via{" "}
//               <Link
//                 href="/heic-to-jpg"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 HEIC to JPG
//               </Link>
//               , turn PNG images into smaller JPG files with{" "}
//               <Link
//                 href="/png-to-jpg"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 PNG to JPG
//               </Link>
//               , open unusual photo files via{" "}
//               <Link
//                 href="/jfif-to-jpg"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 JFIF to JPG
//               </Link>
//               , create website icons using{" "}
//               <Link
//                 href="/png-to-ico"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 PNG to ICO
//               </Link>
//               , extract text using{" "}
//               <Link
//                 href="/image-to-text"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Image to Text (OCR)
//               </Link>
//               , adjust orientations using{" "}
//               <Link
//                 href="/rotate-flip-image"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Rotate & Flip Image
//               </Link>
//               , and secure artwork with{" "}
//               <Link
//                 href="/add-watermark"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 Add Watermark
//               </Link>
//               .
//             </p>

//             {/* External PDFLinx Link */}
//             <p>
//               Looking for complete PDF management such as merging, splitting,
//               compressing, or converting document files? Visit our specialized
//               sister platform{" "}
//               <a
//                 href="https://pdflinx.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-indigo-600 hover:underline font-semibold"
//               >
//                 PDFLinx
//               </a>
//               .
//             </p>
//           </div>
//         </section>

//         {/* ── TOOLS GRID ── */}
//         {/* ── TOOLS GRID ── */}
//         <hr className="home-divider" />
//         <section id="tools" className="home-section-alt py-24 px-6">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-14">
//               <h2 className="home-tools-title">All Tools</h2>
//               <p style={{ color: "#6B7280", fontSize: "1.1rem" }}>
//                 Pick one — done in seconds
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//               {tools.map((tool) => (
//                 <Link
//                   key={tool.link}
//                   href={tool.link}
//                   className="home-tool-card"
//                   // className="home-tool-card block"
//                 >
//                   {/* Glow overlay */}
//                   <div
//                     className="home-tool-card-glow"
//                     style={{ background: tool.accent }}
//                   />

//                   {/* Top row */}
//                   <div className="flex items-start justify-between mb-4">
//                     <div
//                       className="home-tool-icon-wrap"
//                       style={{
//                         background: `${tool.accent}12`,
//                         color: tool.accent,
//                       }}
//                     >
//                       {tool.icon}
//                     </div>
//                     <span
//                       className="home-tag-badge"
//                       style={{
//                         background: `${tool.accent}10`,
//                         color: tool.accent,
//                       }}
//                     >
//                       {tool.tag}
//                     </span>
//                   </div>

//                   <h3 className="home-tool-title">{tool.title}</h3>
//                   <p className="home-tool-desc">{tool.desc}</p>

//                   <div
//                     className="home-tool-link"
//                     style={{ color: tool.accent }}
//                   >
//                     Open Tool <span>→</span>
//                   </div>

//                   {/* Bottom accent line */}
//                   <div
//                     className="home-tool-bottom-line"
//                     style={{ background: tool.accent }}
//                   />
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── WHY ConvertLinx ── */}
//         <hr className="home-divider" />
//         <section className="home-section-main py-20 px-6">
//           <div className="max-w-5xl mx-auto">
//             <div className="text-center mb-14">
//               <h2 className="home-tools-title">Why ConvertLinx?</h2>
//               <p style={{ color: "#6B7280", fontSize: "1.1rem" }}>
//                 Built different. Works better.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {features.map((item, i) => (
//                 <div key={i} className="home-feature-card">
//                   <div
//                     className="home-feature-icon"
//                     style={{ background: `${item.color}12`, color: item.color }}
//                   >
//                     {item.icon}
//                   </div>
//                   <h3
//                     style={{
//                       color: "#1a1a2e",
//                       fontWeight: 700,
//                       fontSize: "1.05rem",
//                       marginBottom: 10,
//                     }}
//                   >
//                     {item.title}
//                   </h3>
//                   <p
//                     style={{
//                       color: "#6B7280",
//                       fontSize: "0.875rem",
//                       lineHeight: 1.7,
//                     }}
//                   >
//                     {item.desc}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── SEO FAQ SECTION (LOCATION 2) ── */}
//         <hr className="home-divider" />
//         <section className="py-20 px-6 max-w-4xl mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="home-tools-title">Frequently Asked Questions</h2>
//             <p style={{ color: "#6B7280", fontSize: "1.1rem" }}>
//               Everything you need to know about ConvertLinx
//             </p>
//           </div>

//           <div className="space-y-6">
//             {/* FAQ 1: General */}
//             <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
//               <h3 className="text-lg font-bold text-gray-900 mb-2">
//                 Is ConvertLinx completely free to use?
//               </h3>
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 Yes! All web utilities, converters, text processing, and
//                 developer tools on ConvertLinx are 100% free with no signups,
//                 daily limits, or hidden fees.
//               </p>
//             </div>

//             {/* FAQ 2: Security */}
//             <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
//               <h3 className="text-lg font-bold text-gray-900 mb-2">
//                 Are my uploaded files and text safe?
//               </h3>
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 Absolutely. ConvertLinx processes everything client-side inside
//                 your browser. Your files, images, and text never reach external
//                 servers, ensuring 100% privacy and security.
//               </p>
//             </div>

//             {/* FAQ 3: Text Tools */}
//             <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
//               <h3 className="text-lg font-bold text-gray-900 mb-2">
//                 What text and content optimization tools are available?
//               </h3>
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 You can analyze text with our{" "}
//                 <Link
//                   href="/word-counter"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Word Counter
//                 </Link>
//                 , convert text casing with{" "}
//                 <Link
//                   href="/case-converter"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Case Converter
//                 </Link>
//                 , generate dummy text using{" "}
//                 <Link
//                   href="/lorem-ipsum"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Lorem Ipsum
//                 </Link>
//                 , create clean URLs with{" "}
//                 <Link
//                   href="/text-to-slug"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Text to Slug
//                 </Link>
//                 , and build SEO tags using the{" "}
//                 <Link
//                   href="/metatag-generator"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Meta Tag Generator
//                 </Link>
//                 .
//               </p>
//             </div>

//             {/* FAQ 4: Developer Tools */}
//             <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
//               <h3 className="text-lg font-bold text-gray-900 mb-2">
//                 Which developer and web utility tools can I use?
//               </h3>
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 We offer essential developer tools like the{" "}
//                 <Link
//                   href="/json-formatter"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   JSON Formatter
//                 </Link>
//                 ,{" "}
//                 <Link
//                   href="/base64-tool"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Base64 Tool
//                 </Link>
//                 ,{" "}
//                 <Link
//                   href="/regex-tester"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Regex Tester
//                 </Link>
//                 ,{" "}
//                 <Link
//                   href="/favicon-generator"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Favicon Generator
//                 </Link>
//                 ,{" "}
//                 <Link
//                   href="/og-preview-checker"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   OG Preview Checker
//                 </Link>
//                 , and{" "}
//                 <Link
//                   href="/whatsapp-link-generator"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   WhatsApp Link Generator
//                 </Link>
//                 .
//               </p>
//             </div>

//             {/* FAQ 5: Image Editing & Conversion */}
//             <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
//               <h3 className="text-lg font-bold text-gray-900 mb-2">
//                 How do I edit or convert images on ConvertLinx?
//               </h3>
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 You can compress images via{" "}
//                 <Link
//                   href="/image-compressor"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Image Compressor
//                 </Link>
//                 , resize with{" "}
//                 <Link
//                   href="/image-resizer"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Image Resizer
//                 </Link>
//                 , crop using{" "}
//                 <Link
//                   href="/image-cropper"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Image Cropper
//                 </Link>
//                 , convert formats with{" "}
//                 <Link
//                   href="/image-converter"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Image Converter
//                 </Link>
//                 , handle iPhone photos with{" "}
//                 <Link
//                   href="/heic-to-jpg"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   HEIC to JPG
//                 </Link>
//                 , change PNG images to JPG with{" "}
//                 <Link
//                   href="/png-to-jpg"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   PNG to JPG
//                 </Link>
//                 , convert JFIF files using{" "}
//                 <Link
//                   href="/jfif-to-jpg"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   JFIF to JPG
//                 </Link>
//                 , make favicons with{" "}
//                 <Link
//                   href="/png-to-ico"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   PNG to ICO
//                 </Link>
//                 , extract text using{" "}
//                 <Link
//                   href="/image-to-text"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Image to Text (OCR)
//                 </Link>
//                 , adjust orientation using{" "}
//                 <Link
//                   href="/rotate-flip-image"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Rotate & Flip Image
//                 </Link>
//                 , or protect photos with{" "}
//                 <Link
//                   href="/add-watermark"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Add Watermark
//                 </Link>
//                 .
//               </p>
//             </div>

//             {/* FAQ 6: General Utilities */}
//             <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
//               <h3 className="text-lg font-bold text-gray-900 mb-2">
//                 Does ConvertLinx offer handy everyday utility tools?
//               </h3>
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 Yes, easily build codes using our{" "}
//                 <Link
//                   href="/qr-generator"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   QR Code Generator
//                 </Link>
//                 , generate secure passwords via{" "}
//                 <Link
//                   href="/password-gen"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Password Generator
//                 </Link>
//                 , convert units using{" "}
//                 <Link
//                   href="/unit-converter"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Unit Converter
//                 </Link>
//                 , pick color codes with{" "}
//                 <Link
//                   href="/color-picker"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Color Picker
//                 </Link>
//                 , download media covers with{" "}
//                 <Link
//                   href="/youtube-thumbnail"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   YouTube Thumbnail
//                 </Link>
//                 , sign documents with{" "}
//                 <Link
//                   href="/signature-maker"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Signature Maker
//                 </Link>
//                 , convert notes with{" "}
//                 <Link
//                   href="/text-to-pdf"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Text to PDF
//                 </Link>
//                 , and create audio using{" "}
//                 <Link
//                   href="/text-to-speech"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Text to Speech
//                 </Link>
//                 .
//               </p>
//             </div>

//             {/* FAQ 7: PDF Sister Site Link */}
//             <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
//               <h3 className="text-lg font-bold text-gray-900 mb-2">
//                 Looking for advanced PDF tools and document management?
//               </h3>
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 For dedicated PDF workflows such as merging, splitting,
//                 compressing, or converting document files, check out our sister
//                 tool site{" "}
//                 <a
//                   href="https://pdflinx.com"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   PDFLinx
//                 </a>
//                 .
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* ── BOTTOM CTA ── */}
//         <section className="home-bottom-cta">
//           <div className="max-w-2xl mx-auto">
//             <div className="home-bottom-cta-badge">Ready to get started?</div>
//             <h2 className="home-bottom-cta-title">
//               All tools. Zero cost. Right now.
//             </h2>
//             <p
//               style={{
//                 color: "rgba(255,255,255,0.65)",
//                 marginBottom: 40,
//                 fontSize: "1.1rem",
//               }}
//             >
//               No account needed. Just open and use.
//             </p>
//             <button
//               onClick={() =>
//                 document
//                   .getElementById("tools")
//                   ?.scrollIntoView({ behavior: "smooth" })
//               }
//               className="home-bottom-cta-btn"
//             >
//               Browse All Tools →
//             </button>
//           </div>
//         </section>

//         {/* Back to Top */}
//         {showBackToTop && (
//           <button
//             onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//             className="home-back-top"
//           >
//             <ArrowUp className="w-5 h-5" />
//           </button>
//         )}
//       </main>
//     </>
//   );
// }



























// // import HomeContent from "@/components/HomeContent"; // 👈 Client component import

// // // ✅ SEO Metadata (server-side) - Homepage

// // export const metadata = {
// //   metadataBase: new URL("https://pdflinx.com"),  // ✅ Perfect - non-www

// //   title: "PDF Linx - Free Online PDF Tools & Converters",
// //   description: "100% free online PDF tools: Convert, Merge, Split, Compress PDF, Word to PDF, QR Code Generator, Password Generator & more. No signup, no watermark.",
// //   keywords: "pdf tools, free pdf converter, merge pdf online, compress pdf, pdf editor free, online pdf tools",

// //   alternates: {
// //     canonical: "/",  // ✅ Relative - automatically https://pdflinx.com/ banega
// //   },

// //   openGraph: {
// //     title: "PDF Linx - Free Online PDF & Utility Tools",
// //     description: "Best free online tools for PDF conversion, merging, splitting, compression + many utility tools like QR code, password generator.",
// //     url: "/",
// //     siteName: "PDF Linx",
// //     images: [{
// //       url: "https://pdflinx.com/og-image.png",  // ✅ Full URL (better for sharing)
// //       width: 1200,
// //       height: 630,
// //       alt: "PDF Linx - Free PDF Tools"
// //     }],
// //     locale: "en_US",
// //     type: "website",
// //   },

// //   twitter: {
// //     card: "summary_large_image",
// //     title: "PDF Linx - Free PDF & Utility Tools",
// //     description: "Convert, merge, compress PDFs + many free online tools. No signup needed.",
// //     images: ["https://pdflinx.com/og-image.png"],  // ✅ Full URL + string array
// //   },
// // };

// // // ✅ Server component (no hooks)
// // export default function Home() {
// //   return <HomeContent />;
// // }
