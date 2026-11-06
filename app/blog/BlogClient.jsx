"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

// type Blog = {
//   title: string;
//   description: string;
//   date: string; // ISO: YYYY-MM-DD
//   slug: string;
//   category: string;
// };

// const blogs: Blog[] = [
const blogs = [
  {
    title: "How to Generate QR Codes Instantly — Free, No Signup, Fully Customizable",
    description:
      "Create QR codes for URLs, Wi-Fi passwords, business cards, and more in under 20 seconds. No watermarks, no signup — just a clean, downloadable PNG ready to use anywhere.",
    date: "2025-12-02",
    slug: "how-to-generate-qr-code-online-free",
    category: "Utilities",
  },
  {
    title: "How to Create Strong Passwords Instantly — Free Password Generator",
    description:
      "Generate cryptographically random, highly secure passwords with custom length and character rules. Runs entirely in your browser — nothing is ever stored or sent to a server.",
    date: "2025-12-03",
    slug: "how-to-create-strong-password-online",
    category: "Security",
  },
  {
    title: "Free Online Unit Converter — Convert Length, Weight, Temperature & More",
    description:
      "Convert meters to feet, kg to pounds, Celsius to Fahrenheit, liters to gallons, and dozens more unit types instantly. No formula lookup, no math — just type and get the answer.",
    date: "2025-12-04",
    slug: "free-online-unit-converter-guide",
    category: "Utilities",
  },
  {
    title: "How to Download YouTube Thumbnails in HD — Free, One Click, No Signup",
    description:
      "Grab any YouTube video thumbnail in HD, Full HD, or maximum resolution in seconds. Perfect for creators, designers, developers, and anyone who wants the full-quality image.",
    date: "2025-12-05",
    slug: "download-youtube-thumbnail-hd-free",
    category: "Utilities",
  },
  {
    title: "How to Compress Images Without Losing Quality — Free Online Image Compressor",
    description:
      "Reduce image file sizes by up to 80% with no visible quality loss. Supports JPG, PNG, and WebP — drag multiple files for batch compression. Perfect for websites and email.",
    date: "2025-12-06",
    slug: "compress-images-without-losing-quality",
    category: "Image Tools",
  },
  {
    title: "How to Extract Text from Images Online Free — AI-Powered OCR Tool",
    description:
      "Extract editable text from any photo, screenshot, or scanned document using AI OCR. Works on printed text, receipts, whiteboards, book pages, and more — no signup needed.",
    date: "2025-12-07",
    slug: "extract-text-from-image-ocr-free",
    category: "Image Tools",
  },
  {
    title: "Free Online Signature Maker — Create & Download Digital Signatures Instantly",
    description:
      "Draw your handwritten signature in the browser and download it as a transparent PNG. Works on mouse, trackpad, or finger — ready to overlay on any document or PDF.",
    date: "2025-12-08",
    slug: "create-digital-signature-online-free",
    category: "Utilities",
  },
  {
    title: "How to Convert HEIC to JPG Free Online — iPhone Photos Made Compatible",
    description:
      "Convert Apple's HEIC photos to universally compatible JPEG instantly. No software to install, no quality loss, batch conversion supported — works on Windows, Android, and everywhere.",
    date: "2025-12-09",
    slug: "convert-heic-to-jpg-free-online",
    category: "Image Tools",
  },
  {
    title: "How to Convert Text to PDF Instantly — Free Online Text to PDF Converter",
    description:
      "Paste any plain text and download a clean, print-ready PDF in seconds. No Word, no Acrobat, no signup — perfect for notes, letters, essays, and archiving important text.",
    date: "2025-12-10",
    slug: "convert-text-to-pdf-online-free",
    category: "PDF & Text",
  },
  {
    title: "Convert Images to Any Format Free — JPG, PNG, WebP, HEIC & More",
    description:
      "Convert between 20+ image formats — JPG, PNG, WebP, HEIC, GIF, BMP, TIFF, ICO and more. Batch conversion supported, no watermarks, no signup, instant download.",
    date: "2025-12-11",
    slug: "convert-image-format-online-free",
    category: "Image Tools",
  },
  {
    title: "How to Resize Images Online Free — Change Width, Height & Dimensions Instantly",
    description:
      "Resize any image to exact pixel dimensions, scale by percentage, or fit within max constraints. Includes a handy reference for social media image sizes across all major platforms.",
    date: "2025-12-12",
    slug: "resize-image-online-free-tool",
    category: "Image Tools",
  },
  {
    title: "How to Crop Images Online Free — Cut, Trim & Resize Photos Instantly",
    description:
      "Crop images with freeform selection, locked aspect ratios (1:1, 16:9, 4:5), or exact pixel coordinates. Perfect for social media sizing, profile photos, and composition adjustments.",
    date: "2025-12-13",
    slug: "crop-image-online-free-tool",
    category: "Image Tools",
  },
  {
    title: "Free Online Word Counter — Count Words, Characters, Sentences & Reading Time",
    description:
      "Get a live count of words, characters (with and without spaces), sentences, paragraphs, and estimated reading time as you type. Includes word count guidelines for SEO, social media, and essays.",
    date: "2025-12-14",
    slug: "free-online-word-counter-tool",
    category: "PDF & Text",
  },
  {
    title: "Free Online Case Converter — Convert Text to UPPERCASE, lowercase, Title Case & More",
    description:
      "Convert text between uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, and kebab-case instantly. One click, one copy — that's it.",
    date: "2025-12-15",
    slug: "text-case-converter-uppercase-lowercase",
    category: "PDF & Text",
  },
  {
    title: "Free Base64 Encoder & Decoder Online — Encode and Decode Text & Images",
    description:
      "Encode any text or image to Base64, or decode any Base64 string back to readable content. Runs entirely in your browser — nothing is sent to any server. Essential for developers.",
    date: "2025-12-16",
    slug: "base64-encode-decode-online-free",
    category: "Developer",
  },
  {
    title: "Free Online JSON Formatter & Validator — Beautify, Minify & Fix JSON",
    description:
      "Format messy JSON into readable, indented output — or minify it for production. Validates your JSON and catches common errors like trailing commas, single quotes, and missing brackets.",
    date: "2025-12-17",
    slug: "json-formatter-validator-online-free",
    category: "Developer",
  },
  {
    title: "Free Lorem Ipsum Generator — Generate Placeholder Text for Designs & Layouts",
    description:
      "Generate Lorem Ipsum placeholder text by paragraph, sentence, word count, or character count. The standard dummy text for wireframes, mockups, templates, and layout testing.",
    date: "2025-12-18",
    slug: "lorem-ipsum-generator-free-placeholder-text",
    category: "Developer",
  },
  {
    title: "Free Online Color Picker — Get HEX, RGB, HSL & Color Codes Instantly",
    description:
      "Pick any color visually and get its HEX, RGB, and HSL codes with one click. Includes a practical guide to color theory, accessibility contrast ratios, and building design system palettes.",
    date: "2025-12-19",
    slug: "online-color-picker-hex-rgb-hsl",
    category: "Developer",
  },
  {
    title: "How to Add a Watermark to Images Online Free — Text & Logo Watermarks",
    description:
      "Add text or transparent PNG logo watermarks to your photos online. Customize position, opacity, font, and size. Protect your work and brand every image before sharing.",
    date: "2025-12-20",
    slug: "add-watermark-to-image-online-free",
    category: "Image Tools",
  },
  {
    title: "How to Rotate and Flip Images Online Free — Fix Photo Orientation Instantly",
    description:
      "Rotate images 90°, 180°, 270° or flip horizontally and vertically in one click. Fix sideways phone photos, upside-down scans, and create mirror effects — no software needed.",
    date: "2025-12-21",
    slug: "rotate-flip-image-online-free",
    category: "Image Tools",
  },
  {
    title: "Free Meta Tag Generator — Create SEO & Open Graph Tags Instantly",
    description:
      "Generate complete HTML meta tags for SEO, Open Graph (Facebook/LinkedIn), and Twitter Cards. Fill in your page details and copy production-ready code straight into your site's head.",
    date: "2025-12-22",
    slug: "free-meta-tag-generator-seo-tool",
    category: "Developer",
  },
  {
    title: "Free Online Text to Speech — Convert Text to Audio Instantly",
    description:
      "Convert any text to natural-sounding audio in your browser. Choose voice, language, and speed — listen instantly or download as audio. Great for proofreading, accessibility, and voiceovers.",
    date: "2025-12-23",
    slug: "free-text-to-speech-converter-online",
    category: "Utilities",
  },
  {
    title: "Free Text to URL Slug Converter — Create SEO-Friendly Slugs Instantly",
    description:
      "Convert any page title or text into a clean, lowercase, hyphenated URL slug. Removes special characters, accents, and stop words. One click and your slug is ready to paste.",
    date: "2025-12-24",
    slug: "text-to-url-slug-converter-free",
    category: "Developer",
  },
  {
    title: "5 Best Free Online PDF Tools in 2026",
    description:
      "Looking for a free PDF tool with no signup and no watermark? We compared the top 5 online PDF tools for converting, compressing, protecting and unlocking PDFs. See which one wins in 2026.",
    date: "2026-10-11",
    slug: "best-free-pdf-tools-online",
    category: "Comparisons",
  },
  {
    title: "5 Best Free Online Image Converter & Utility Tools in 2026",
    description:
      "Need to convert HEIC, WebP, PNG or JPG without signup or watermarks? We compared the 5 best free image converter and utility tools for 2026, including ConvertLinx.",
    date: "2026-10-11",
    slug: "best-free-image-converter-utility-tools",
    category: "Comparisons",
  },
  {
    title: "Image Converter Guide: How to Convert Image Formats Online (JPG, PNG, WebP, HEIC)",
    description:
      "Learn how to convert image format online for free. Compare JPG, PNG, WebP and HEIC, pick the right format and change pic format in seconds, privately.",
    date: "2026-10-18",
    slug: "image-converter",
    category: "Image Tools",
  },
];

// Newest first
const sortedBlogs = [...blogs].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];

// function formatDate(iso: string) {
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogClient() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortedBlogs.filter((b) => {
      const matchCategory =
        activeCategory === "All" || b.category === activeCategory;
      const matchQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [query, activeCategory]);

  const isDefaultView = query.trim() === "" && activeCategory === "All";
  const featured = isDefaultView ? filtered[0] : null;
  const rest = isDefaultView ? filtered.slice(1) : filtered;

  return (
    <main className="bg-slate-50 min-h-screen">
            {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-teal-100 bg-gradient-to-b from-teal-50 via-white to-slate-50">
        {/* glow blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-teal-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
        {/* subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#0F766E 1px, transparent 1px), linear-gradient(90deg, #0F766E 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-teal-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
            GUIDES &amp; TUTORIALS
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
            ConvertLinx{" "}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Blog &amp; Guides
            </span>
          </h1>

          <p className="mt-5 mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-slate-600">
            Step-by-step guides for every tool on ConvertLinx — compress images,
            extract text from photos, convert HEIC files, generate QR codes,
            format JSON and more. <strong className="text-slate-900">100% free</strong>,
            no fluff, written from real hands-on use.
          </p>

          {/* search */}
          <div className="mt-8 mx-auto max-w-xl">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search guides… e.g. HEIC, QR code, JSON"
                aria-label="Search blog guides"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          {/* stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
            <span>
              <strong className="text-teal-700">{blogs.length}+</strong> guides
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span>
              <strong className="text-teal-700">No signup</strong> needed
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span>
              <strong className="text-teal-700">Privacy-first</strong> tools
            </span>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {/* category pills */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
          role="tablist"
          aria-label="Filter guides by category"
        >
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "text-white shadow-md shadow-teal-700/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-teal-400 hover:text-teal-700"
                }`}
                style={
                  active
                    ? { background: "linear-gradient(135deg, #0F766E, #14B8A6)" }
                    : undefined
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* featured post */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group relative mb-10 block overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-8 md:p-10 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/10"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal-200/50 blur-3xl transition-opacity group-hover:opacity-80" />
            <div className="relative max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                  ★ Latest
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {featured.category}
                </span>
              </div>
              <h2 className="mt-4 text-2xl md:text-3xl font-bold leading-snug text-slate-900">
                {featured.title}
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600">
                {featured.description}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <span
                  className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
                  style={{ background: "linear-gradient(135deg, #0F766E, #14B8A6)" }}
                >
                  Read Guide
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
                <time
                  dateTime={featured.date}
                  className="text-sm text-slate-500"
                >
                  {formatDate(featured.date)}
                </time>
              </div>
            </div>
          </Link>
        )}


        {/* grid */}
        {rest.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((blog) => (
              <article
                key={blog.slug}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/10"
              >
                {/* top accent line */}
                <div
                  className="h-1 w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{ background: "linear-gradient(90deg, #0F766E, #14B8A6)" }}
                />

                <div className="flex flex-grow flex-col p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                      {blog.category}
                    </span>
                    <time
                      dateTime={blog.date}
                      className="text-xs text-slate-400"
                    >
                      {formatDate(blog.date)}
                    </time>
                  </div>

                  <h2 className="mb-2 text-lg font-bold leading-snug text-slate-800 line-clamp-2 transition-colors group-hover:text-teal-700">
                    {blog.title}
                  </h2>

                  <p className="mb-5 flex-grow text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {blog.description}
                  </p>

                  <Link
                    href={`/blog/${blog.slug}`}
                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-900 after:absolute after:inset-0 after:content-['']"
                    aria-label={`Read guide: ${blog.title}`}
                  >
                    Read Guide
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          !featured && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <p className="text-lg font-semibold text-slate-700">
                No guides found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different keyword or category.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All");
                }}
                className="mt-5 rounded-lg px-5 py-2 text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #0F766E, #14B8A6)" }}
              >
                Reset filters
              </button>
            </div>
          )
        )}
      </section>

      {/* ================= BOTTOM CTA ================= */}
      {/* ================= BOTTOM CTA ================= */}
      <section className="px-6 pb-16">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-emerald-50 px-8 py-12 text-center shadow-sm">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-teal-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Ready to try the tools?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Convert, compress and generate — free, fast and with no signup.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-7 py-3 font-semibold text-white shadow-lg shadow-teal-700/20 transition hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #0F766E, #14B8A6)" }}
            >
              Explore All Tools →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
































// "use client";

// import Link from "next/link";

// export default function BlogClient() {

//   const blogs = [
//     {
//       title: "How to Generate QR Codes Instantly — Free, No Signup, Fully Customizable",
//       description:
//         "Create QR codes for URLs, Wi-Fi passwords, business cards, and more in under 20 seconds. No watermarks, no signup — just a clean, downloadable PNG ready to use anywhere.",
//       date: "Dec 2, 2025",
//       slug: "how-to-generate-qr-code-online-free",
//     },
//     {
//       title: "How to Create Strong Passwords Instantly — Free Password Generator",
//       description:
//         "Generate cryptographically random, highly secure passwords with custom length and character rules. Runs entirely in your browser — nothing is ever stored or sent to a server.",
//       date: "Dec 3, 2025",
//       slug: "how-to-create-strong-password-online",
//     },
//     {
//       title: "Free Online Unit Converter — Convert Length, Weight, Temperature & More",
//       description:
//         "Convert meters to feet, kg to pounds, Celsius to Fahrenheit, liters to gallons, and dozens more unit types instantly. No formula lookup, no math — just type and get the answer.",
//       date: "Dec 4, 2025",
//       slug: "free-online-unit-converter-guide",
//     },
//     {
//       title: "How to Download YouTube Thumbnails in HD — Free, One Click, No Signup",
//       description:
//         "Grab any YouTube video thumbnail in HD, Full HD, or maximum resolution in seconds. Perfect for creators, designers, developers, and anyone who wants the full-quality image.",
//       date: "Dec 5, 2025",
//       slug: "download-youtube-thumbnail-hd-free",
//     },
//     {
//       title: "How to Compress Images Without Losing Quality — Free Online Image Compressor",
//       description:
//         "Reduce image file sizes by up to 80% with no visible quality loss. Supports JPG, PNG, and WebP — drag multiple files for batch compression. Perfect for websites and email.",
//       date: "Dec 6, 2025",
//       slug: "compress-images-without-losing-quality",
//     },
//     {
//       title: "How to Extract Text from Images Online Free — AI-Powered OCR Tool",
//       description:
//         "Extract editable text from any photo, screenshot, or scanned document using AI OCR. Works on printed text, receipts, whiteboards, book pages, and more — no signup needed.",
//       date: "Dec 7, 2025",
//       slug: "extract-text-from-image-ocr-free",
//     },
//     {
//       title: "Free Online Signature Maker — Create & Download Digital Signatures Instantly",
//       description:
//         "Draw your handwritten signature in the browser and download it as a transparent PNG. Works on mouse, trackpad, or finger — ready to overlay on any document or PDF.",
//       date: "Dec 8, 2025",
//       slug: "create-digital-signature-online-free",
//     },
//     {
//       title: "How to Convert HEIC to JPG Free Online — iPhone Photos Made Compatible",
//       description:
//         "Convert Apple's HEIC photos to universally compatible JPEG instantly. No software to install, no quality loss, batch conversion supported — works on Windows, Android, and everywhere.",
//       date: "Dec 9, 2025",
//       slug: "convert-heic-to-jpg-free-online",
//     },
//     {
//       title: "How to Convert Text to PDF Instantly — Free Online Text to PDF Converter",
//       description:
//         "Paste any plain text and download a clean, print-ready PDF in seconds. No Word, no Acrobat, no signup — perfect for notes, letters, essays, and archiving important text.",
//       date: "Dec 10, 2025",
//       slug: "convert-text-to-pdf-online-free",
//     },
//     {
//       title: "Convert Images to Any Format Free — JPG, PNG, WebP, HEIC & More",
//       description:
//         "Convert between 20+ image formats — JPG, PNG, WebP, HEIC, GIF, BMP, TIFF, ICO and more. Batch conversion supported, no watermarks, no signup, instant download.",
//       date: "Dec 11, 2025",
//       slug: "convert-image-format-online-free",
//     },
//     {
//       title: "How to Resize Images Online Free — Change Width, Height & Dimensions Instantly",
//       description:
//         "Resize any image to exact pixel dimensions, scale by percentage, or fit within max constraints. Includes a handy reference for social media image sizes across all major platforms.",
//       date: "Dec 12, 2025",
//       slug: "resize-image-online-free-tool",
//     },
//     {
//       title: "How to Crop Images Online Free — Cut, Trim & Resize Photos Instantly",
//       description:
//         "Crop images with freeform selection, locked aspect ratios (1:1, 16:9, 4:5), or exact pixel coordinates. Perfect for social media sizing, profile photos, and composition adjustments.",
//       date: "Dec 13, 2025",
//       slug: "crop-image-online-free-tool",
//     },
//     {
//       title: "Free Online Word Counter — Count Words, Characters, Sentences & Reading Time",
//       description:
//         "Get a live count of words, characters (with and without spaces), sentences, paragraphs, and estimated reading time as you type. Includes word count guidelines for SEO, social media, and essays.",
//       date: "Dec 14, 2025",
//       slug: "free-online-word-counter-tool",
//     },
//     {
//       title: "Free Online Case Converter — Convert Text to UPPERCASE, lowercase, Title Case & More",
//       description:
//         "Convert text between uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, and kebab-case instantly. One click, one copy — that's it.",
//       date: "Dec 15, 2025",
//       slug: "text-case-converter-uppercase-lowercase",
//     },
//     {
//       title: "Free Base64 Encoder & Decoder Online — Encode and Decode Text & Images",
//       description:
//         "Encode any text or image to Base64, or decode any Base64 string back to readable content. Runs entirely in your browser — nothing is sent to any server. Essential for developers.",
//       date: "Dec 16, 2025",
//       slug: "base64-encode-decode-online-free",
//     },
//     {
//       title: "Free Online JSON Formatter & Validator — Beautify, Minify & Fix JSON",
//       description:
//         "Format messy JSON into readable, indented output — or minify it for production. Validates your JSON and catches common errors like trailing commas, single quotes, and missing brackets.",
//       date: "Dec 17, 2025",
//       slug: "json-formatter-validator-online-free",
//     },
//     {
//       title: "Free Lorem Ipsum Generator — Generate Placeholder Text for Designs & Layouts",
//       description:
//         "Generate Lorem Ipsum placeholder text by paragraph, sentence, word count, or character count. The standard dummy text for wireframes, mockups, templates, and layout testing.",
//       date: "Dec 18, 2025",
//       slug: "lorem-ipsum-generator-free-placeholder-text",
//     },
//     {
//       title: "Free Online Color Picker — Get HEX, RGB, HSL & Color Codes Instantly",
//       description:
//         "Pick any color visually and get its HEX, RGB, and HSL codes with one click. Includes a practical guide to color theory, accessibility contrast ratios, and building design system palettes.",
//       date: "Dec 19, 2025",
//       slug: "online-color-picker-hex-rgb-hsl",
//     },
//     {
//       title: "How to Add a Watermark to Images Online Free — Text & Logo Watermarks",
//       description:
//         "Add text or transparent PNG logo watermarks to your photos online. Customize position, opacity, font, and size. Protect your work and brand every image before sharing.",
//       date: "Dec 20, 2025",
//       slug: "add-watermark-to-image-online-free",
//     },
//     {
//       title: "How to Rotate and Flip Images Online Free — Fix Photo Orientation Instantly",
//       description:
//         "Rotate images 90°, 180°, 270° or flip horizontally and vertically in one click. Fix sideways phone photos, upside-down scans, and create mirror effects — no software needed.",
//       date: "Dec 21, 2025",
//       slug: "rotate-flip-image-online-free",
//     },
//     {
//       title: "Free Meta Tag Generator — Create SEO & Open Graph Tags Instantly",
//       description:
//         "Generate complete HTML meta tags for SEO, Open Graph (Facebook/LinkedIn), and Twitter Cards. Fill in your page details and copy production-ready code straight into your site's head.",
//       date: "Dec 22, 2025",
//       slug: "free-meta-tag-generator-seo-tool",
//     },
//     {
//       title: "Free Online Text to Speech — Convert Text to Audio Instantly",
//       description:
//         "Convert any text to natural-sounding audio in your browser. Choose voice, language, and speed — listen instantly or download as audio. Great for proofreading, accessibility, and voiceovers.",
//       date: "Dec 23, 2025",
//       slug: "free-text-to-speech-converter-online",
//     },

//     {
//       title: "Free Text to URL Slug Converter — Create SEO-Friendly Slugs Instantly",
//       description:
//         "Convert any page title or text into a clean, lowercase, hyphenated URL slug. Removes special characters, accents, and stop words. One click and your slug is ready to paste.",
//       date: "Dec 24, 2025",
//       slug: "text-to-url-slug-converter-free",
//     },

//     {
//   title: "5 Best Free Online PDF Tools in 2026",
//   description:
//     "Looking for a free PDF tool with no signup and no watermark? We compared the top 5 online PDF tools for converting, compressing, protecting and unlocking PDFs. See which one wins in 2026.",
//   date: "Oct 11, 2026",
//   slug: "best-free-pdf-tools-online",
// },

// {
//   title: "5 Best Free Online Image Converter & Utility Tools in 2026",
//   description:
//     "Need to convert HEIC, WebP, PNG or JPG without signup or watermarks? We compared the 5 best free image converter and utility tools for 2026, including FreeConverto.",
//   date: "Oct 11, 2026",
//   slug: "best-free-image-converter-utility-tools",
// },

//     {
//       title: "Image Converter Guide: How to Convert Image Formats Online (JPG, PNG, WebP, HEIC)",
//       description:
//         "Learn how to convert image format online for free. Compare JPG, PNG, WebP and HEIC, pick the right format and change pic format in seconds, privately.",
//       date: "Oct 18, 2026",
//       slug: "image-converter",
//     },

//   ];

//   return (
//     <main className="max-w-6xl mx-auto py-12 px-6">
//       <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent leading-tight">
//         ConvertLinx Blog & Guides
//       </h1>

//       <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-base leading-relaxed">
//         Step-by-step guides for every tool on ConvertLinx — how to compress
//         images, extract text from photos, convert HEIC files, generate QR
//         codes, format JSON, and everything else.
//         <br />
//         <br />
//         Everything is <strong>free</strong>, no fluff, written from real
//         hands-on use. Save time and get things done faster.
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {blogs.map((blog, index) => (
//           <div
//             key={index}
//             className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
//           >
//             <div className="p-5 flex flex-col flex-grow">
//               <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 hover:text-teal-600 transition">
//                 {blog.title}
//               </h2>
//               <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-3 flex-grow">
//                 {blog.description}
//               </p>
//               <p className="text-xs text-gray-500 mb-4">{blog.date}</p>

//               <div className="mt-auto">
//                 <Link
//                   href={`/blog/${blog.slug}`}
//                   className="inline-block text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
//                   style={{ background: "linear-gradient(135deg, #0F766E, #14B8A6)" }}
//                 >
//                   Read Guide →
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }





























// // "use client";

// // import Link from "next/link";

// // export default function BlogClient() {

// //   const blogs = [
// //     {
// //       title: "Generate QR Codes Instantly for Links, Text & Contacts",
// //       description:
// //         "Need a quick QR code for your website, Wi-Fi password, or contact info? Here's how I make clean, custom ones in seconds — perfect for menus, business cards, or sharing links easily.",
// //       date: "Dec 2, 2025",
// //       slug: "qr-generator",
// //     },
// //     {
// //       title: "Create Strong Passwords Instantly with Our Password Generator",
// //       description:
// //         "Tired of using the same weak passwords everywhere? Here's how I create super-strong, random ones in seconds — perfect for new accounts, emails, or just tightening up your security.",
// //       date: "Dec 3, 2025",
// //       slug: "password-gen",
// //     },
// //     {
// //       title: "Convert Units Easily with Our Free Online Unit Converter",
// //       description:
// //         "Need to switch between meters and feet, kg and pounds, or Celsius and Fahrenheit? Here's the dead-simple unit converter I use all the time — instant, accurate, and completely free.",
// //       date: "Dec 4, 2025",
// //       slug: "unit-converter",
// //     },
// //     {
// //       title: "Download HD YouTube Thumbnails Instantly in One Click",
// //       description:
// //         "Need a clean, high-quality thumbnail from a YouTube video? Here's how I grab them in HD or even 4K in seconds — perfect for creators, editors, or just saving cool covers.",
// //       date: "Dec 5, 2025",
// //       slug: "youtube-thumbnail",
// //     },
// //     {
// //       title: "Compress Images Online Without Losing Quality",
// //       description:
// //         "Got heavy photos slowing down your site or eating storage? Here's how I shrink JPGs, PNGs, and WebPs down to tiny sizes while keeping them looking sharp — free and super fast.",
// //       date: "Dec 6, 2025",
// //       slug: "image-compressor",
// //     },
// //     {
// //       title: "Convert Images to Text Using AI (Image to Text Extractor)",
// //       description:
// //         "Need to pull text out of a photo, screenshot, or scanned page? Here's how I quickly turn images into editable text — perfect for notes, receipts, books, or anything with words in it.",
// //       date: "Dec 7, 2025",
// //       slug: "image-to-text",
// //     },
// //     {
// //       title: "Draw & Download Signatures Online with Signature Maker",
// //       description:
// //         "Need a clean digital signature for documents? Here's how I quickly draw or type one and download it as a transparent PNG — perfect for contracts, forms, or anything official.",
// //       date: "Dec 8, 2025",
// //       slug: "signature-maker",
// //     },
// //     {
// //       title: "Convert HEIC to JPG Instantly Online",
// //       description:
// //         "Got iPhone photos in HEIC format that won't open on Windows or Android? Here's how I quickly turn them into regular JPGs — keeps quality perfect, no software needed.",
// //       date: "Dec 9, 2025",
// //       slug: "heic-to-jpg",
// //     },
// //     {
// //       title: "Convert Text to PDF Instantly Online (Free & Secure)",
// //       description:
// //         "Got plain text or notes you need to turn into a proper PDF? Here's how I quickly make clean, professional PDFs from any text — great for essays, letters, or just saving stuff neatly.",
// //       date: "Dec 10, 2025",
// //       slug: "text-to-pdf",
// //     },
// //     {
// //       title: "Convert Images to Any Format Online Free (JPG, PNG, WebP & More)",
// //       description:
// //         "Need to convert a JPG to PNG, WebP to JPEG, or HEIC to any format? Here's how I quickly switch between 20+ image formats in seconds — no software, no signup, perfect quality every time.",
// //       date: "Dec 11, 2025",
// //       slug: "image-converter",
// //     },
// //   ];

// //   return (
// //     <main className="max-w-6xl mx-auto py-12 px-6">
// //       <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
// //         ConvertLinx Blog & Guides
// //       </h1>

// //       <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-base leading-relaxed">
// //         Welcome to the blog! Here I've written simple, no-nonsense guides for
// //         all the tools — how to compress images, extract text from photos,
// //         convert HEIC files, generate QR codes, and everything else.
// //         <br />
// //         <br />
// //         Everything is <strong>free</strong>, no fluff, and I've tested it all
// //         myself in real life. Hope these help you save time and get stuff done
// //         easier.
// //       </p>

// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {blogs.map((blog, index) => (
// //           <div
// //             key={index}
// //             className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
// //           >
// //             <div className="p-5 flex flex-col flex-grow">
// //               <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 hover:text-indigo-600 transition">
// //                 {blog.title}
// //               </h2>
// //               <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-3 flex-grow">
// //                 {blog.description}
// //               </p>
// //               <p className="text-xs text-gray-500 mb-4">{blog.date}</p>

// //               <div className="mt-auto">
// //                 <Link
// //                   href={`/blog/${blog.slug}`}
// //                   className="inline-block text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
// //                   style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
// //                 >
// //                   Read More →
// //                 </Link>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </main>
// //   );
// // }

