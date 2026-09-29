"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  QrCode, Lock, Ruler, Youtube,
  Image as ImageIcon, PenTool, FileImage,
  FileText, RefreshCw, ArrowUp, Zap, Shield, Star, Volume2, LinkIcon
} from "lucide-react";
import "@/styles/HomeContent.css";

export default function HomeContent() {
  const router = useRouter();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tools = [
    { title: "QR Code Generator", desc: "Make QR codes for links, WiFi passwords, menus – ready in seconds.", link: "/qr-generator", icon: <QrCode className="w-7 h-7" />, accent: "#6366F1", tag: "Popular" },
    { title: "Password Generator", desc: "Create strong, random passwords that actually keep your accounts safe.", link: "/password-gen", icon: <Lock className="w-7 h-7" />, accent: "#7C3AED", tag: "Security" },
    { title: "Unit Converter", desc: "Quick conversions for length, weight, temperature – over 50 units supported.", link: "/unit-converter", icon: <Ruler className="w-7 h-7" />, accent: "#059669", tag: "Utility" },
    { title: "YouTube Thumbnail", desc: "Grab full HD thumbnails from any YouTube video in one click.", link: "/youtube-thumbnail", icon: <Youtube className="w-7 h-7" />, accent: "#DC2626", tag: "Media" },
    { title: "Image Compressor", desc: "Reduce image size by up to 80% while keeping them looking sharp.", link: "/image-compressor", icon: <ImageIcon className="w-7 h-7" />, accent: "#0284C7", tag: "Images" },
    { title: "Image to Text (OCR)", desc: "Extract text from photos, scans, or screenshots – surprisingly accurate.", link: "/image-to-text", icon: <ImageIcon className="w-7 h-7" />, accent: "#9333EA", tag: "OCR" },
    { title: "Signature Maker", desc: "Draw or type your signature and download it for documents.", link: "/signature-maker", icon: <PenTool className="w-7 h-7" />, accent: "#0F766E", tag: "Documents" },
    { title: "HEIC to JPG", desc: "Convert iPhone photos to regular JPGs that open everywhere.", link: "/heic-to-jpg", icon: <FileImage className="w-7 h-7" />, accent: "#EA580C", tag: "Convert" },
    { title: "Text to PDF", desc: "Turn plain text into a nicely formatted PDF with custom styling.", link: "/text-to-pdf", icon: <FileText className="w-7 h-7" />, accent: "#7C3AED", tag: "Convert" },
    { title: "Image Converter", desc: "Switch between JPG, PNG, WebP, GIF – transparency stays intact.", link: "/image-converter", icon: <RefreshCw className="w-7 h-7" />, accent: "#DB2777", tag: "Images" },
    { title: "Image Resizer", desc: "Resize images to any dimension without losing quality in seconds.", link: "/image-resizer", icon: <ImageIcon className="w-7 h-7" />, accent: "#0EA5E9", tag: "Images" },
    { title: "Image Cropper", desc: "Crop images to exact size or ratio with precision and ease.", link: "/image-cropper", icon: <ImageIcon className="w-7 h-7" />, accent: "#F59E0B", tag: "Images" },
    { title: "Word Counter", desc: "Count words, characters, sentences, and paragraphs instantly in your text.", link: "/word-counter", icon: <FileText className="w-7 h-7" />, accent: "#2563EB", tag: "Text" },
    { title: "Case Converter", desc: "Convert text to uppercase, lowercase, title case, or sentence case easily.", link: "/case-converter", icon: <RefreshCw className="w-7 h-7" />, accent: "#7C3AED", tag: "Text" },
    { title: "Lorem Ipsum Generator", desc: "Generate dummy placeholder text for design, layouts, or content testing.", link: "/lorem-ipsum", icon: <PenTool className="w-7 h-7" />, accent: "#059669", tag: "Text" },
    { title: "JSON Formatter", desc: "Format, beautify, and validate JSON data for better readability.", link: "/json-formatter", icon: <FileText className="w-7 h-7" />, accent: "#DC2626", tag: "Developer" },
    { title: "Base64 Tool", desc: "Encode and decode Base64 strings quickly for development and data handling.", link: "/base64-tool", icon: <Lock className="w-7 h-7" />, accent: "#EA580C", tag: "Developer" },
    { title: "Color Picker", desc: "Pick colors, get HEX/RGB values, and build your perfect color palette.", link: "/color-picker", icon: <ImageIcon className="w-7 h-7" />, accent: "#DB2777", tag: "Design" },
    { title: "Add Watermark", desc: "Add text or logo watermark to your images to protect them from reuse.", link: "/add-watermark", icon: <ImageIcon className="w-7 h-7" />, accent: "#6366F1", tag: "Images" },
    { title: "Meta Tag Generator", desc: "Generate SEO meta tags including title, description, and Open Graph data easily.", link: "/metatag-generator", icon: <FileText className="w-7 h-7" />, accent: "#7C3AED", tag: "SEO" },
    { title: "Rotate & Flip Image", desc: "Rotate or flip images horizontally and vertically in seconds online.", link: "/rotate-flip-image", icon: <RefreshCw className="w-7 h-7" />, accent: "#059669", tag: "Images" },
    { title: "Text to Speech", desc: "Convert written text into natural sounding speech with multiple voice options.", link: "/text-to-speech", icon: <Volume2 className="w-7 h-7" />, accent: "#DC2626", tag: "AI" },
    { title: "Text to Slug", desc: "Convert text into clean, SEO-friendly URL slugs instantly for your website.", link: "/text-to-slug", icon: <LinkIcon className="w-7 h-7" />, accent: "#EA580C", tag: "SEO" },
  ];

  const stats = [
    { value: "20+", label: "Free Tools" },
    { value: "0", label: "Ads" },
    { value: "100%", label: "Browser-based" },
    { value: "∞", label: "Free Forever" },
  ];

  const features = [
    { icon: <Zap className="w-6 h-6" />, title: "Blazing Fast", desc: "Everything runs in your browser. No waiting for server uploads or processing.", color: "#F59E0B" },
    { icon: <Shield className="w-6 h-6" />, title: "100% Private", desc: "Your files never leave your device. No uploads to shady servers, ever.", color: "#10B981" },
    { icon: <Star className="w-6 h-6" />, title: "Actually Free", desc: "No hidden plans, no free trial, no credit card. Just tools that work.", color: "#6366F1" },
  ];

  const faqs = [
    {
      q: "Is ConvertLinx completely free to use?",
      a: "Yes! All web utilities, converters, and text processing tools on ConvertLinx are 100% free with no signups, daily limits, or hidden fees."
    },
    {
      q: "Are my uploaded files and text safe?",
      a: "Absolutely. ConvertLinx processes everything client-side inside your browser. Your files, images, and text never reach external servers, ensuring 100% privacy."
    },
    {
      q: "How do I compress images or convert formats on ConvertLinx?",
      a: <>You can easily compress images using our <Link href="/image-compressor" className="text-indigo-600 hover:underline font-medium">Image Compressor</Link> or convert file formats with our <Link href="/image-converter" className="text-indigo-600 hover:underline font-medium">Image Converter</Link> and <Link href="/heic-to-jpg" className="text-indigo-600 hover:underline font-medium">HEIC to JPG</Link> tool in just one click.</>
    },
    {
      q: "Can I convert text, format JSON, or generate URL slugs?",
      a: <>Yes! Use our <Link href="/word-counter" className="text-indigo-600 hover:underline font-medium">Word Counter</Link>, <Link href="/case-converter" className="text-indigo-600 hover:underline font-medium">Case Converter</Link>, <Link href="/json-formatter" className="text-indigo-600 hover:underline font-medium">JSON Formatter</Link>, and <Link href="/text-to-slug" className="text-indigo-600 hover:underline font-medium">Text to Slug</Link> tools to streamline your daily editing tasks.</>
    },
    {
      q: "Looking for advanced PDF tools and document management?",
      a: <>For dedicated PDF workflows such as merging, splitting, or converting document files, check out our sister tool site <a href="https://pdflinx.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">PDFLinx</a>.</>
    }
  ];

  return (
    <main className="home-page">

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero-grid" />
        <div className="home-hero-blob-1 home-float" />
        <div className="home-hero-blob-2" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="home-hero-badge">
            <span className="home-hero-badge-dot" />
            20+ Free Tools · No Signup · No Ads
          </div>

          {/* Heading */}
          <h1 className="home-hero-title">
            Every Tool You Need,{" "}
            <span className="home-hero-grad">Completely Free</span>
          </h1>

          <p className="home-hero-sub">
            QR codes, image tools, converters, OCR and more — all in one place.
            No signup, no ads, no nonsense.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button
              onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
              className="home-cta-primary"
            >
              Explore All Tools →
            </button>
            <a href="/qr-generator" className="home-cta-secondary">
              Try QR Generator
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="home-stat-card">
                <div className="home-stat-value">{s.value}</div>
                <div className="home-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── SEO CONTEXTUAL CONTENT SECTION (LOCATION 1) ── */}
      <section className="py-12 px-6 max-w-5xl mx-auto text-gray-700 leading-relaxed">
        <div className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Everything You Need to Convert & Utility Tools Online
          </h2>

          {/* Text & Writing Tools */}
          <p className="mb-4">
            ConvertLinx provides a full range of online text utilities to help you manage and refine content effortlessly. You can quickly analyze text structure using our <Link href="/word-counter" className="text-indigo-600 hover:underline font-semibold">Word Counter</Link>, modify capitalization with the <Link href="/case-converter" className="text-indigo-600 hover:underline font-semibold">Case Converter</Link>, generate placeholder text using <Link href="/lorem-ipsum" className="text-indigo-600 hover:underline font-semibold">Lorem Ipsum</Link>, optimize web links via <Link href="/text-to-slug" className="text-indigo-600 hover:underline font-semibold">Text to Slug</Link>, and create essential search tags with the <Link href="/metatag-generator" className="text-indigo-600 hover:underline font-semibold">Meta Tag Generator</Link>.
          </p>

          {/* Developer Tools */}
          <p className="mb-4">
            Built for web developers and programmers, our browser-based utility suite includes a fast <Link href="/json-formatter" className="text-indigo-600 hover:underline font-semibold">JSON Formatter</Link>, reliable <Link href="/base64-tool" className="text-indigo-600 hover:underline font-semibold">Base64 Tool</Link>, precise <Link href="/regex-tester" className="text-indigo-600 hover:underline font-semibold">Regex Tester</Link>, <Link href="/favicon-generator" className="text-indigo-600 hover:underline font-semibold">Favicon Generator</Link>, <Link href="/og-preview-checker" className="text-indigo-600 hover:underline font-semibold">OG Preview Checker</Link>, and <Link href="/whatsapp-link-generator" className="text-indigo-600 hover:underline font-semibold">WhatsApp Link Generator</Link> to simplify daily coding and web workflows.
          </p>

          {/* Utilities & Media */}
          <p className="mb-4">
            For everyday digital tasks, explore tools like our custom <Link href="/color-picker" className="text-indigo-600 hover:underline font-semibold">Color Picker</Link>, instant <Link href="/qr-generator" className="text-indigo-600 hover:underline font-semibold">QR Generator</Link>, secure <Link href="/password-gen" className="text-indigo-600 hover:underline font-semibold">Password Generator</Link>, comprehensive <Link href="/unit-converter" className="text-indigo-600 hover:underline font-semibold">Unit Converter</Link>, <Link href="/youtube-thumbnail" className="text-indigo-600 hover:underline font-semibold">YouTube Thumbnail</Link> downloader, custom <Link href="/signature-maker" className="text-indigo-600 hover:underline font-semibold">Signature Maker</Link>, <Link href="/text-to-pdf" className="text-indigo-600 hover:underline font-semibold">Text to PDF</Link> creator, and natural <Link href="/text-to-speech" className="text-indigo-600 hover:underline font-semibold">Text to Speech</Link> converter.
          </p>

          {/* Image Tools */}
          <p className="mb-4">
            Easily process images right inside your browser with zero server uploads. Shrink file sizes using <Link href="/image-compressor" className="text-indigo-600 hover:underline font-semibold">Image Compressor</Link>, adjust dimensions with <Link href="/image-resizer" className="text-indigo-600 hover:underline font-semibold">Image Resizer</Link>, trim edges using <Link href="/image-cropper" className="text-indigo-600 hover:underline font-semibold">Image Cropper</Link>, change file formats with <Link href="/image-converter" className="text-indigo-600 hover:underline font-semibold">Image Converter</Link>, turn iPhone images to standard files via <Link href="/heic-to-jpg" className="text-indigo-600 hover:underline font-semibold">HEIC to JPG</Link>, extract text using <Link href="/image-to-text" className="text-indigo-600 hover:underline font-semibold">Image to Text (OCR)</Link>, adjust orientations using <Link href="/rotate-flip-image" className="text-indigo-600 hover:underline font-semibold">Rotate & Flip Image</Link>, and secure artwork with <Link href="/add-watermark" className="text-indigo-600 hover:underline font-semibold">Add Watermark</Link>.
          </p>

          {/* External PDFLinx Link */}
          <p>
            Looking for complete PDF management such as merging, splitting, compressing, or converting document files? Visit our specialized sister platform <a href="https://pdflinx.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">PDFLinx</a>.
          </p>
        </div>
      </section>


      {/* ── TOOLS GRID ── */}
      <hr className="home-divider" />
      <section id="tools" className="home-section-alt py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="home-tools-title">All Tools</h2>
            <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Pick one — done in seconds</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tools.map((tool, i) => (
              <div
                key={i}
                onClick={() => router.push(tool.link)}
                onMouseEnter={() => setHoveredTool(i)}
                onMouseLeave={() => setHoveredTool(null)}
                className="home-tool-card"
              >
                {/* Glow overlay */}
                <div
                  className="home-tool-card-glow"
                  style={{ background: tool.accent }}
                />

                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="home-tool-icon-wrap"
                    style={{ background: `${tool.accent}12`, color: tool.accent }}
                  >
                    {tool.icon}
                  </div>
                  <span
                    className="home-tag-badge"
                    style={{ background: `${tool.accent}10`, color: tool.accent }}
                  >
                    {tool.tag}
                  </span>
                </div>

                <h3 className="home-tool-title">{tool.title}</h3>
                <p className="home-tool-desc">{tool.desc}</p>

                <div className="home-tool-link" style={{ color: tool.accent }}>
                  Open Tool <span>→</span>
                </div>

                {/* Bottom accent line */}
                <div
                  className="home-tool-bottom-line"
                  style={{ background: tool.accent }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ConvertLinx ── */}
      <hr className="home-divider" />
      <section className="home-section-main py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="home-tools-title">Why ConvertLinx?</h2>
            <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Built different. Works better.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((item, i) => (
              <div key={i} className="home-feature-card">
                <div
                  className="home-feature-icon"
                  style={{ background: `${item.color}12`, color: item.color }}
                >
                  {item.icon}
                </div>
                <h3 style={{ color: '#1a1a2e', fontWeight: 700, fontSize: '1.05rem', marginBottom: 10 }}>
                  {item.title}
                </h3>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── SEO FAQ SECTION (LOCATION 2) ── */}
      <hr className="home-divider" />
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="home-tools-title">Frequently Asked Questions</h2>
          <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Everything you need to know about ConvertLinx</p>
        </div>

        <div className="space-y-6">
          {/* FAQ 1: General */}
          <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Is ConvertLinx completely free to use?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Yes! All web utilities, converters, text processing, and developer tools on ConvertLinx are 100% free with no signups, daily limits, or hidden fees.
            </p>
          </div>

          {/* FAQ 2: Security */}
          <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Are my uploaded files and text safe?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Absolutely. ConvertLinx processes everything client-side inside your browser. Your files, images, and text never reach external servers, ensuring 100% privacy and security.
            </p>
          </div>

          {/* FAQ 3: Text Tools */}
          <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">What text and content optimization tools are available?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              You can analyze text with our <Link href="/word-counter" className="text-indigo-600 hover:underline font-medium">Word Counter</Link>, convert text casing with <Link href="/case-converter" className="text-indigo-600 hover:underline font-medium">Case Converter</Link>, generate dummy text using <Link href="/lorem-ipsum" className="text-indigo-600 hover:underline font-medium">Lorem Ipsum</Link>, create clean URLs with <Link href="/text-to-slug" className="text-indigo-600 hover:underline font-medium">Text to Slug</Link>, and build SEO tags using the <Link href="/metatag-generator" className="text-indigo-600 hover:underline font-medium">Meta Tag Generator</Link>.
            </p>
          </div>

          {/* FAQ 4: Developer Tools */}
          <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Which developer and web utility tools can I use?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We offer essential developer tools like the <Link href="/json-formatter" className="text-indigo-600 hover:underline font-medium">JSON Formatter</Link>, <Link href="/base64-tool" className="text-indigo-600 hover:underline font-medium">Base64 Tool</Link>, <Link href="/regex-tester" className="text-indigo-600 hover:underline font-medium">Regex Tester</Link>, <Link href="/favicon-generator" className="text-indigo-600 hover:underline font-medium">Favicon Generator</Link>, <Link href="/og-preview-checker" className="text-indigo-600 hover:underline font-medium">OG Preview Checker</Link>, and <Link href="/whatsapp-link-generator" className="text-indigo-600 hover:underline font-medium">WhatsApp Link Generator</Link>.
            </p>
          </div>

          {/* FAQ 5: Image Editing & Conversion */}
          <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">How do I edit or convert images on ConvertLinx?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              You can compress images via <Link href="/image-compressor" className="text-indigo-600 hover:underline font-medium">Image Compressor</Link>, resize with <Link href="/image-resizer" className="text-indigo-600 hover:underline font-medium">Image Resizer</Link>, crop using <Link href="/image-cropper" className="text-indigo-600 hover:underline font-medium">Image Cropper</Link>, convert formats with <Link href="/image-converter" className="text-indigo-600 hover:underline font-medium">Image Converter</Link>, handle iPhone photos with <Link href="/heic-to-jpg" className="text-indigo-600 hover:underline font-medium">HEIC to JPG</Link>, extract text using <Link href="/image-to-text" className="text-indigo-600 hover:underline font-medium">Image to Text (OCR)</Link>, adjust orientation using <Link href="/rotate-flip-image" className="text-indigo-600 hover:underline font-medium">Rotate & Flip Image</Link>, or protect photos with <Link href="/add-watermark" className="text-indigo-600 hover:underline font-medium">Add Watermark</Link>.
            </p>
          </div>

          {/* FAQ 6: General Utilities */}
          <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Does ConvertLinx offer handy everyday utility tools?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Yes, easily build codes using our <Link href="/qr-generator" className="text-indigo-600 hover:underline font-medium">QR Code Generator</Link>, generate secure passwords via <Link href="/password-gen" className="text-indigo-600 hover:underline font-medium">Password Generator</Link>, convert units using <Link href="/unit-converter" className="text-indigo-600 hover:underline font-medium">Unit Converter</Link>, pick color codes with <Link href="/color-picker" className="text-indigo-600 hover:underline font-medium">Color Picker</Link>, download media covers with <Link href="/youtube-thumbnail" className="text-indigo-600 hover:underline font-medium">YouTube Thumbnail</Link>, sign documents with <Link href="/signature-maker" className="text-indigo-600 hover:underline font-medium">Signature Maker</Link>, convert notes with <Link href="/text-to-pdf" className="text-indigo-600 hover:underline font-medium">Text to PDF</Link>, and create audio using <Link href="/text-to-speech" className="text-indigo-600 hover:underline font-medium">Text to Speech</Link>.
            </p>
          </div>

          {/* FAQ 7: PDF Sister Site Link */}
          <div className="bg-white/80 border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Looking for advanced PDF tools and document management?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              For dedicated PDF workflows such as merging, splitting, compressing, or converting document files, check out our sister tool site <a href="https://pdflinx.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">PDFLinx</a>.
            </p>
          </div>
        </div>
      </section>


      {/* ── BOTTOM CTA ── */}
      <section className="home-bottom-cta">
        <div className="max-w-2xl mx-auto">
          <div className="home-bottom-cta-badge">Ready to get started?</div>
          <h2 className="home-bottom-cta-title">
            All tools. Zero cost. Right now.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 40, fontSize: '1.1rem' }}>
            No account needed. Just open and use.
          </p>
          <button
            onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
            className="home-bottom-cta-btn"
          >
            Browse All Tools →
          </button>
        </div>
      </section>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="home-back-top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </main>
  );
}





















































// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import {
//   QrCode, Lock, Ruler, Youtube,
//   Image as ImageIcon, PenTool, FileImage,
//   FileText, RefreshCw, ArrowUp, Zap, Shield, Star, Volume2, LinkIcon
// } from "lucide-react";
// import "@/styles/HomeContent.css";

// export default function HomeContent() {
//   const router = useRouter();
//   const [showBackToTop, setShowBackToTop] = useState(false);
//   const [hoveredTool, setHoveredTool] = useState(null);

//   useEffect(() => {
//     const handleScroll = () => setShowBackToTop(window.scrollY > 600);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const tools = [
//     { title: "QR Code Generator", desc: "Make QR codes for links, WiFi passwords, menus – ready in seconds.", link: "/qr-generator", icon: <QrCode className="w-7 h-7" />, accent: "#6366F1", tag: "Popular" },
//     { title: "Password Generator", desc: "Create strong, random passwords that actually keep your accounts safe.", link: "/password-gen", icon: <Lock className="w-7 h-7" />, accent: "#7C3AED", tag: "Security" },
//     { title: "Unit Converter", desc: "Quick conversions for length, weight, temperature – over 50 units supported.", link: "/unit-converter", icon: <Ruler className="w-7 h-7" />, accent: "#059669", tag: "Utility" },
//     { title: "YouTube Thumbnail", desc: "Grab full HD thumbnails from any YouTube video in one click.", link: "/youtube-thumbnail", icon: <Youtube className="w-7 h-7" />, accent: "#DC2626", tag: "Media" },
//     { title: "Image Compressor", desc: "Reduce image size by up to 80% while keeping them looking sharp.", link: "/image-compressor", icon: <ImageIcon className="w-7 h-7" />, accent: "#0284C7", tag: "Images" },
//     { title: "Image to Text (OCR)", desc: "Extract text from photos, scans, or screenshots – surprisingly accurate.", link: "/image-to-text", icon: <ImageIcon className="w-7 h-7" />, accent: "#9333EA", tag: "OCR" },
//     { title: "Signature Maker", desc: "Draw or type your signature and download it for documents.", link: "/signature-maker", icon: <PenTool className="w-7 h-7" />, accent: "#0F766E", tag: "Documents" },
//     { title: "HEIC to JPG", desc: "Convert iPhone photos to regular JPGs that open everywhere.", link: "/heic-to-jpg", icon: <FileImage className="w-7 h-7" />, accent: "#EA580C", tag: "Convert" },
//     { title: "Text to PDF", desc: "Turn plain text into a nicely formatted PDF with custom styling.", link: "/text-to-pdf", icon: <FileText className="w-7 h-7" />, accent: "#7C3AED", tag: "Convert" },
//     { title: "Image Converter", desc: "Switch between JPG, PNG, WebP, GIF – transparency stays intact.", link: "/image-converter", icon: <RefreshCw className="w-7 h-7" />, accent: "#DB2777", tag: "Images" },
//     { title: "Image Resizer", desc: "Resize images to any dimension without losing quality in seconds.", link: "/image-resizer", icon: <ImageIcon className="w-7 h-7" />, accent: "#0EA5E9", tag: "Images" },

//     { title: "Image Cropper", desc: "Crop images to exact size or ratio with precision and ease.", link: "/image-cropper", icon: <ImageIcon className="w-7 h-7" />, accent: "#F59E0B", tag: "Images" },
//     // 🔥 NEW TOOLS (ADD BELOW)

//     { title: "Word Counter", desc: "Count words, characters, sentences, and paragraphs instantly in your text.", link: "/word-counter", icon: <FileText className="w-7 h-7" />, accent: "#2563EB", tag: "Text" },

//     { title: "Case Converter", desc: "Convert text to uppercase, lowercase, title case, or sentence case easily.", link: "/case-converter", icon: <RefreshCw className="w-7 h-7" />, accent: "#7C3AED", tag: "Text" },

//     { title: "Lorem Ipsum Generator", desc: "Generate dummy placeholder text for design, layouts, or content testing.", link: "/lorem-ipsum", icon: <PenTool className="w-7 h-7" />, accent: "#059669", tag: "Text" },

//     { title: "JSON Formatter", desc: "Format, beautify, and validate JSON data for better readability.", link: "/json-formatter", icon: <FileText className="w-7 h-7" />, accent: "#DC2626", tag: "Developer" },

//     { title: "Base64 Tool", desc: "Encode and decode Base64 strings quickly for development and data handling.", link: "/base64-tool", icon: <Lock className="w-7 h-7" />, accent: "#EA580C", tag: "Developer" },

//     { title: "Color Picker", desc: "Pick colors, get HEX/RGB values, and build your perfect color palette.", link: "/color-picker", icon: <ImageIcon className="w-7 h-7" />, accent: "#DB2777", tag: "Design" },

//     // 🔥 NEW IMAGE + SEO TOOLS

//     { title: "Add Watermark", desc: "Add text or logo watermark to your images to protect them from reuse.", link: "/add-watermark", icon: <ImageIcon className="w-7 h-7" />, accent: "#6366F1", tag: "Images" },

//     { title: "Meta Tag Generator", desc: "Generate SEO meta tags including title, description, and Open Graph data easily.", link: "/metatag-generator", icon: <FileText className="w-7 h-7" />, accent: "#7C3AED", tag: "SEO" },

//     { title: "Rotate & Flip Image", desc: "Rotate or flip images horizontally and vertically in seconds online.", link: "/rotate-flip-image", icon: <RefreshCw className="w-7 h-7" />, accent: "#059669", tag: "Images" },

//     { title: "Text to Speech", desc: "Convert written text into natural sounding speech with multiple voice options.", link: "/text-to-speech", icon: <Volume2 className="w-7 h-7" />, accent: "#DC2626", tag: "AI" },

//     { title: "Text to Slug", desc: "Convert text into clean, SEO-friendly URL slugs instantly for your website.", link: "/text-to-slug", icon: <LinkIcon className="w-7 h-7" />, accent: "#EA580C", tag: "SEO" },

//   ];


//   const externalTools = [
//     {
//       title: "JPG to PDF",
//       desc: "Convert images into PDF files quickly and easily.",
//       link: "https://pdflinx.com/jpg-to-pdf",
//       icon: <FileImage className="w-7 h-7" />,
//       accent: "#EF4444",
//     },
//     {
//       title: "PDF to JPG",
//       desc: "Extract images from PDF files in high quality.",
//       link: "https://pdflinx.com/pdf-to-jpg",
//       icon: <FileImage className="w-7 h-7" />,
//       accent: "#F97316",
//     },
//     {
//       title: "Compress PDF",
//       desc: "Reduce PDF file size without losing quality.",
//       link: "https://pdflinx.com/compress-pdf",
//       icon: <FileText className="w-7 h-7" />,
//       accent: "#EC4899",
//     },
//   ];

//   const stats = [
//     { value: "10+", label: "Free Tools" },
//     { value: "0", label: "Ads" },
//     { value: "100%", label: "Browser-based" },
//     { value: "∞", label: "Free Forever" },
//   ];

//   const features = [
//     { icon: <Zap className="w-6 h-6" />, title: "Blazing Fast", desc: "Everything runs in your browser. No waiting for server uploads or processing.", color: "#F59E0B" },
//     { icon: <Shield className="w-6 h-6" />, title: "100% Private", desc: "Your files never leave your device. No uploads to shady servers, ever.", color: "#10B981" },
//     { icon: <Star className="w-6 h-6" />, title: "Actually Free", desc: "No hidden plans, no free trial, no credit card. Just tools that work.", color: "#6366F1" },
//   ];

//   return (
//     <main className="home-page">

//       {/* ── HERO ── */}
//       <section className="home-hero">
//         <div className="home-hero-grid" />
//         <div className="home-hero-blob-1 home-float" />
//         <div className="home-hero-blob-2" style={{ animationDelay: "2s" }} />

//         <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

//           {/* Badge */}
//           <div className="home-hero-badge">
//             <span className="home-hero-badge-dot" />
//             10 Free Tools · No Signup · No Ads
//           </div>

//           {/* Heading */}
//           <h1 className="home-hero-title">
//             Every Tool You Need,{" "}
//             <span className="home-hero-grad">Completely Free</span>
//           </h1>

//           <p className="home-hero-sub">
//             QR codes, image tools, converters, OCR and more — all in one place.
//             No signup, no ads, no nonsense.
//           </p>

//           {/* CTAs */}
//           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
//             <button
//               onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
//               className="home-cta-primary"
//             >
//               Explore All Tools →
//             </button>
//             <a href="/qr-generator" className="home-cta-secondary">
//               Try QR Generator
//             </a>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
//             {stats.map((s, i) => (
//               <div key={i} className="home-stat-card">
//                 <div className="home-stat-value">{s.value}</div>
//                 <div className="home-stat-label">{s.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>



//       {/* ── TOOLS GRID ── */}
//       <hr className="home-divider" />
//       <section id="tools" className="home-section-alt py-24 px-6">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-14">
//             <h2 className="home-tools-title">All Tools</h2>
//             <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Pick one — done in seconds</p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {tools.map((tool, i) => (
//               <div
//                 key={i}
//                 onClick={() => router.push(tool.link)}
//                 onMouseEnter={() => setHoveredTool(i)}
//                 onMouseLeave={() => setHoveredTool(null)}
//                 className="home-tool-card"
//               >
//                 {/* Glow overlay */}
//                 <div
//                   className="home-tool-card-glow"
//                   style={{ background: tool.accent }}
//                 />

//                 {/* Top row */}
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className="home-tool-icon-wrap"
//                     style={{ background: `${tool.accent}12`, color: tool.accent }}
//                   >
//                     {tool.icon}
//                   </div>
//                   <span
//                     className="home-tag-badge"
//                     style={{ background: `${tool.accent}10`, color: tool.accent }}
//                   >
//                     {tool.tag}
//                   </span>
//                 </div>

//                 <h3 className="home-tool-title">{tool.title}</h3>
//                 <p className="home-tool-desc">{tool.desc}</p>

//                 <div className="home-tool-link" style={{ color: tool.accent }}>
//                   Open Tool <span>→</span>
//                 </div>

//                 {/* Bottom accent line */}
//                 <div
//                   className="home-tool-bottom-line"
//                   style={{ background: tool.accent }}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>


//       {/* ── WHY ConvertLinx ── */}
//       <hr className="home-divider" />
//       <section className="home-section-main py-20 px-6">
//         <div className="max-w-5xl mx-auto">
//           <div className="text-center mb-14">
//             <h2 className="home-tools-title">Why ConvertLinx?</h2>
//             <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Built different. Works better.</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {features.map((item, i) => (
//               <div key={i} className="home-feature-card">
//                 <div
//                   className="home-feature-icon"
//                   style={{ background: `${item.color}12`, color: item.color }}
//                 >
//                   {item.icon}
//                 </div>
//                 <h3 style={{ color: '#1a1a2e', fontWeight: 700, fontSize: '1.05rem', marginBottom: 10 }}>
//                   {item.title}
//                 </h3>
//                 <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.7 }}>
//                   {item.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── BOTTOM CTA ── */}
//       <section className="home-bottom-cta">
//         <div className="max-w-2xl mx-auto">
//           <div className="home-bottom-cta-badge">Ready to get started?</div>
//           <h2 className="home-bottom-cta-title">
//             All tools. Zero cost. Right now.
//           </h2>
//           <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 40, fontSize: '1.1rem' }}>
//             No account needed. Just open and use.
//           </p>
//           <button
//             onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
//             className="home-bottom-cta-btn"
//           >
//             Browse All Tools →
//           </button>
//         </div>
//       </section>

//       {/* Back to Top */}
//       {showBackToTop && (
//         <button
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           className="home-back-top"
//         >
//           <ArrowUp className="w-5 h-5" />
//         </button>
//       )}
//     </main>
//   );
// }




























































// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import {
//   QrCode, Lock, Ruler, Youtube,
//   Image as ImageIcon, PenTool, FileImage,
//   FileText, RefreshCw, ArrowUp, Zap, Shield, Star,
// } from "lucide-react";
// import "@/styles/HomeContent.css";

// export default function HomeContent() {
//   const router = useRouter();
//   const [showBackToTop, setShowBackToTop] = useState(false);
//   const [hoveredTool, setHoveredTool] = useState(null);

//   useEffect(() => {
//     const handleScroll = () => setShowBackToTop(window.scrollY > 600);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const tools = [
//     { title: "QR Code Generator",   desc: "Make QR codes for links, WiFi passwords, menus – ready in seconds.",             link: "/qr-generator",    icon: <QrCode className="w-7 h-7" />,    accent: "#6366F1", tag: "Popular"   },
//     { title: "Password Generator",  desc: "Create strong, random passwords that actually keep your accounts safe.",          link: "/password-gen",    icon: <Lock className="w-7 h-7" />,      accent: "#7C3AED", tag: "Security"  },
//     { title: "Unit Converter",      desc: "Quick conversions for length, weight, temperature – over 50 units supported.",    link: "/unit-converter",  icon: <Ruler className="w-7 h-7" />,     accent: "#059669", tag: "Utility"   },
//     { title: "YouTube Thumbnail",   desc: "Grab full HD thumbnails from any YouTube video in one click.",                    link: "/youtube-thumbnail",icon: <Youtube className="w-7 h-7" />,  accent: "#DC2626", tag: "Media"     },
//     { title: "Image Compressor",    desc: "Reduce image size by up to 80% while keeping them looking sharp.",               link: "/image-compressor", icon: <ImageIcon className="w-7 h-7" />, accent: "#0284C7", tag: "Images"    },
//     { title: "Image to Text (OCR)", desc: "Extract text from photos, scans, or screenshots – surprisingly accurate.",       link: "/image-to-text",   icon: <ImageIcon className="w-7 h-7" />, accent: "#9333EA", tag: "OCR"       },
//     { title: "Signature Maker",     desc: "Draw or type your signature and download it for documents.",                     link: "/signature-maker", icon: <PenTool className="w-7 h-7" />,   accent: "#0F766E", tag: "Documents" },
//     { title: "HEIC to JPG",         desc: "Convert iPhone photos to regular JPGs that open everywhere.",                    link: "/heic-to-jpg",     icon: <FileImage className="w-7 h-7" />, accent: "#EA580C", tag: "Convert"   },
//     { title: "Text to PDF",         desc: "Turn plain text into a nicely formatted PDF with custom styling.",               link: "/text-to-pdf",     icon: <FileText className="w-7 h-7" />,  accent: "#7C3AED", tag: "Convert"   },
//     { title: "Image Converter",     desc: "Switch between JPG, PNG, WebP, GIF – transparency stays intact.",               link: "/image-converter", icon: <RefreshCw className="w-7 h-7" />, accent: "#DB2777", tag: "Images"    },
//   ];

//   const stats = [
//     { value: "10+", label: "Free Tools"    },
//     { value: "0",   label: "Ads"           },
//     { value: "100%",label: "Browser-based" },
//     { value: "∞",   label: "Free Forever"  },
//   ];

//   const features = [
//     { icon: <Zap className="w-6 h-6" />,    title: "Blazing Fast",  desc: "Everything runs in your browser. No waiting for server uploads or processing.", color: "#F59E0B" },
//     { icon: <Shield className="w-6 h-6" />, title: "100% Private",  desc: "Your files never leave your device. No uploads to shady servers, ever.",         color: "#10B981" },
//     { icon: <Star className="w-6 h-6" />,   title: "Actually Free", desc: "No hidden plans, no free trial, no credit card. Just tools that work.",          color: "#6366F1" },
//   ];

//   return (
//     <main className="home-page">

//       {/* ── HERO ── */}
//       <section className="home-hero">
//         <div className="home-hero-grid" />
//         <div className="home-hero-blob-1 home-float" />
//         <div className="home-hero-blob-2" style={{ animationDelay: "2s" }} />

//         <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

//           {/* Badge */}
//           <div className="home-hero-badge">
//             <span className="home-hero-badge-dot" />
//             10 Free Tools · No Signup · No Ads
//           </div>

//           {/* Heading */}
//           <h1 className="home-hero-title">
//             Every Tool You Need,{" "}
//             <span className="home-hero-grad">Completely Free</span>
//           </h1>

//           <p className="home-hero-sub">
//             QR codes, image tools, converters, OCR and more — all in one place.
//             No signup, no ads, no nonsense.
//           </p>

//           {/* CTAs */}
//           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
//             <button
//               onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
//               className="home-cta-primary"
//             >
//               Explore All Tools →
//             </button>
//             <a href="/qr-generator" className="home-cta-secondary">
//               Try QR Generator
//             </a>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
//             {stats.map((s, i) => (
//               <div key={i} className="home-stat-card">
//                 <div className="home-stat-value">{s.value}</div>
//                 <div className="home-stat-label">{s.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── TOOLS GRID ── */}
//       <hr className="home-divider" />
//       <section id="tools" className="home-section-alt py-24 px-6">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-14">
//             <h2 className="home-tools-title">All Tools</h2>
//             <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Pick one — done in seconds</p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {tools.map((tool, i) => (
//               <div
//                 key={i}
//                 onClick={() => router.push(tool.link)}
//                 onMouseEnter={() => setHoveredTool(i)}
//                 onMouseLeave={() => setHoveredTool(null)}
//                 className="home-tool-card"
//               >
//                 {/* Glow overlay */}
//                 <div
//                   className="home-tool-card-glow"
//                   style={{ background: tool.accent }}
//                 />

//                 {/* Top row */}
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className="home-tool-icon-wrap"
//                     style={{ background: `${tool.accent}12`, color: tool.accent }}
//                   >
//                     {tool.icon}
//                   </div>
//                   <span
//                     className="home-tag-badge"
//                     style={{ background: `${tool.accent}10`, color: tool.accent }}
//                   >
//                     {tool.tag}
//                   </span>
//                 </div>

//                 <h3 className="home-tool-title">{tool.title}</h3>
//                 <p className="home-tool-desc">{tool.desc}</p>

//                 <div className="home-tool-link" style={{ color: tool.accent }}>
//                   Open Tool <span>→</span>
//                 </div>

//                 {/* Bottom accent line */}
//                 <div
//                   className="home-tool-bottom-line"
//                   style={{ background: tool.accent }}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── WHY ConvertLinx ── */}
//       <hr className="home-divider" />
//       <section className="home-section-main py-20 px-6">
//         <div className="max-w-5xl mx-auto">
//           <div className="text-center mb-14">
//             <h2 className="home-tools-title">Why ConvertLinx?</h2>
//             <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Built different. Works better.</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {features.map((item, i) => (
//               <div key={i} className="home-feature-card">
//                 <div
//                   className="home-feature-icon"
//                   style={{ background: `${item.color}12`, color: item.color }}
//                 >
//                   {item.icon}
//                 </div>
//                 <h3 style={{ color: '#1a1a2e', fontWeight: 700, fontSize: '1.05rem', marginBottom: 10 }}>
//                   {item.title}
//                 </h3>
//                 <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.7 }}>
//                   {item.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── BOTTOM CTA ── */}
//       <section className="home-bottom-cta">
//         <div className="max-w-2xl mx-auto">
//           <div className="home-bottom-cta-badge">Ready to get started?</div>
//           <h2 className="home-bottom-cta-title">
//             All tools. Zero cost. Right now.
//           </h2>
//           <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 40, fontSize: '1.1rem' }}>
//             No account needed. Just open and use.
//           </p>
//           <button
//             onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
//             className="home-bottom-cta-btn"
//           >
//             Browse All Tools →
//           </button>
//         </div>
//       </section>

//       {/* Back to Top */}
//       {showBackToTop && (
//         <button
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           className="home-back-top"
//         >
//           <ArrowUp className="w-5 h-5" />
//         </button>
//       )}
//     </main>
//   );
// }



















// // "use client";

// // import { useRouter } from "next/navigation";
// // import { useState, useEffect } from "react";
// // import {
// //   QrCode,
// //   Lock,
// //   Ruler,
// //   Youtube,
// //   Image as ImageIcon,
// //   PenTool,
// //   FileImage,
// //   FileText,
// //   RefreshCw,
// //   ArrowUp,
// //   Zap,
// //   Shield,
// //   Star,
// // } from "lucide-react";

// // export default function HomeContent() {
// //   const router = useRouter();
// //   const [showBackToTop, setShowBackToTop] = useState(false);
// //   const [hoveredTool, setHoveredTool] = useState(null);

// //   useEffect(() => {
// //     const handleScroll = () => setShowBackToTop(window.scrollY > 600);
// //     window.addEventListener("scroll", handleScroll);
// //     return () => window.removeEventListener("scroll", handleScroll);
// //   }, []);

// //   const tools = [
// //     {
// //       title: "QR Code Generator",
// //       desc: "Make QR codes for links, WiFi passwords, menus – ready in seconds.",
// //       link: "/qr-generator",
// //       icon: <QrCode className="w-7 h-7" />,
// //       accent: "#FF6B35",
// //       tag: "Popular",
// //     },
// //     {
// //       title: "Password Generator",
// //       desc: "Create strong, random passwords that actually keep your accounts safe.",
// //       link: "/password-gen",
// //       icon: <Lock className="w-7 h-7" />,
// //       accent: "#7C3AED",
// //       tag: "Security",
// //     },
// //     {
// //       title: "Unit Converter",
// //       desc: "Quick conversions for length, weight, temperature – over 50 units supported.",
// //       link: "/unit-converter",
// //       icon: <Ruler className="w-7 h-7" />,
// //       accent: "#059669",
// //       tag: "Utility",
// //     },
// //     {
// //       title: "YouTube Thumbnail",
// //       desc: "Grab full HD thumbnails from any YouTube video in one click.",
// //       link: "/youtube-thumbnail",
// //       icon: <Youtube className="w-7 h-7" />,
// //       accent: "#DC2626",
// //       tag: "Media",
// //     },
// //     {
// //       title: "Image Compressor",
// //       desc: "Reduce image size by up to 80% while keeping them looking sharp.",
// //       link: "/image-compressor",
// //       icon: <ImageIcon className="w-7 h-7" />,
// //       accent: "#0284C7",
// //       tag: "Images",
// //     },
// //     {
// //       title: "Image to Text (OCR)",
// //       desc: "Extract text from photos, scans, or screenshots – surprisingly accurate.",
// //       link: "/image-to-text",
// //       icon: <ImageIcon className="w-7 h-7" />,
// //       accent: "#9333EA",
// //       tag: "OCR",
// //     },
// //     {
// //       title: "Signature Maker",
// //       desc: "Draw or type your signature and download it for documents.",
// //       link: "/signature-maker",
// //       icon: <PenTool className="w-7 h-7" />,
// //       accent: "#0F766E",
// //       tag: "Documents",
// //     },
// //     {
// //       title: "HEIC to JPG",
// //       desc: "Convert iPhone photos to regular JPGs that open everywhere.",
// //       link: "/heic-to-jpg",
// //       icon: <FileImage className="w-7 h-7" />,
// //       accent: "#EA580C",
// //       tag: "Convert",
// //     },
// //     {
// //       title: "Text to PDF",
// //       desc: "Turn plain text into a nicely formatted PDF with custom styling.",
// //       link: "/text-to-pdf",
// //       icon: <FileText className="w-7 h-7" />,
// //       accent: "#7C3AED",
// //       tag: "Convert",
// //     },
// //     {
// //       title: "Image Converter",
// //       desc: "Switch between JPG, PNG, WebP, GIF – transparency stays intact.",
// //       link: "/image-converter",
// //       icon: <RefreshCw className="w-7 h-7" />,
// //       accent: "#DB2777",
// //       tag: "Images",
// //     },
// //   ];

// //   const stats = [
// //     { value: "10+", label: "Free Tools" },
// //     { value: "0", label: "Ads" },
// //     { value: "100%", label: "Browser-based" },
// //     { value: "∞", label: "Free Forever" },
// //   ];

// //   return (
// //     <main
// //       style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}
// //       className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden"
// //     >
// //       {/* Google Fonts */}
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

// //         .hero-glow {
// //           background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.35) 0%, transparent 70%);
// //         }
// //         .grid-bg {
// //           background-image:
// //             linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
// //             linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
// //           background-size: 40px 40px;
// //         }
// //         .tool-card {
// //           background: rgba(255,255,255,0.03);
// //           border: 1px solid rgba(255,255,255,0.07);
// //           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
// //         }
// //         .tool-card:hover {
// //           background: rgba(255,255,255,0.07);
// //           border-color: rgba(255,255,255,0.15);
// //           transform: translateY(-4px);
// //         }
// //         .tag-badge {
// //           font-size: 10px;
// //           font-weight: 600;
// //           letter-spacing: 0.08em;
// //           text-transform: uppercase;
// //         }
// //         .stat-card {
// //           background: rgba(255,255,255,0.03);
// //           border: 1px solid rgba(255,255,255,0.07);
// //         }
// //         .feature-card {
// //           background: rgba(255,255,255,0.02);
// //           border: 1px solid rgba(255,255,255,0.06);
// //           transition: border-color 0.3s ease;
// //         }
// //         .feature-card:hover {
// //           border-color: rgba(255,255,255,0.12);
// //         }
// //         @keyframes float {
// //           0%, 100% { transform: translateY(0px); }
// //           50% { transform: translateY(-8px); }
// //         }
// //         @keyframes pulse-glow {
// //           0%, 100% { opacity: 0.6; }
// //           50% { opacity: 1; }
// //         }
// //         .float-anim { animation: float 4s ease-in-out infinite; }
// //         .cta-btn {
// //           background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
// //           transition: all 0.3s ease;
// //           box-shadow: 0 0 30px rgba(99,102,241,0.3);
// //         }
// //         .cta-btn:hover {
// //           transform: translateY(-2px);
// //           box-shadow: 0 0 50px rgba(99,102,241,0.5);
// //         }
// //         .secondary-btn {
// //           background: rgba(255,255,255,0.05);
// //           border: 1px solid rgba(255,255,255,0.12);
// //           transition: all 0.3s ease;
// //         }
// //         .secondary-btn:hover {
// //           background: rgba(255,255,255,0.1);
// //           border-color: rgba(255,255,255,0.25);
// //         }
// //       `}</style>

// //       {/* ── HERO ── */}
// //       <section className="relative min-h-[90vh] flex items-center justify-center grid-bg">
// //         <div className="hero-glow absolute inset-0 pointer-events-none" />

// //         {/* Floating blobs */}
// //         <div className="absolute top-32 left-16 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl float-anim pointer-events-none" />
// //         <div className="absolute bottom-32 right-16 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" style={{ animationDelay: "2s" }} />

// //         <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
// //           {/* Badge */}
// //           <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium">
// //             <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
// //             10 Free Tools · No Signup · No Ads
// //           </div>

// //           {/* Heading */}
// //           <h1
// //             style={{ fontFamily: "'Space Grotesk', sans-serif" }}
// //             className="text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight"
// //           >
// //             Every Tool You Need,{" "}
// //             <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
// //               Completely Free
// //             </span>
// //           </h1>

// //           <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
// //             QR codes, image tools, converters, OCR and more — all in one place.
// //             No signup, no ads, no nonsense.
// //           </p>

// //           {/* CTAs */}
// //           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
// //             <button
// //               onClick={() =>
// //                 document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
// //               }
// //               className="cta-btn text-white font-semibold text-base px-8 py-4 rounded-2xl"
// //             >
// //               Explore All Tools →
// //             </button>
// //             <a
// //               href="/qr-generator"
// //               className="secondary-btn text-gray-300 font-medium text-base px-8 py-4 rounded-2xl"
// //             >
// //               Try QR Generator
// //             </a>
// //           </div>

// //           {/* Stats Row */}
// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
// //             {stats.map((s, i) => (
// //               <div key={i} className="stat-card rounded-2xl px-4 py-5 text-center">
// //                 <div
// //                   style={{ fontFamily: "'Space Grotesk', sans-serif" }}
// //                   className="text-3xl font-bold text-white mb-1"
// //                 >
// //                   {s.value}
// //                 </div>
// //                 <div className="text-xs text-gray-500 uppercase tracking-widest font-medium">
// //                   {s.label}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ── TOOLS GRID ── */}
// //       <section id="tools" className="py-24 px-6">
// //         <div className="max-w-6xl mx-auto">
// //           <div className="text-center mb-14">
// //             <h2
// //               style={{ fontFamily: "'Space Grotesk', sans-serif" }}
// //               className="text-4xl md:text-5xl font-bold text-white mb-4"
// //             >
// //               All Tools
// //             </h2>
// //             <p className="text-gray-500 text-lg">Pick one — done in seconds</p>
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
// //             {tools.map((tool, i) => (
// //               <div
// //                 key={i}
// //                 onClick={() => router.push(tool.link)}
// //                 onMouseEnter={() => setHoveredTool(i)}
// //                 onMouseLeave={() => setHoveredTool(null)}
// //                 className="tool-card rounded-2xl p-6 cursor-pointer relative overflow-hidden"
// //               >
// //                 {/* Accent glow on hover */}
// //                 {hoveredTool === i && (
// //                   <div
// //                     className="absolute inset-0 opacity-5 pointer-events-none rounded-2xl"
// //                     style={{ background: tool.accent }}
// //                   />
// //                 )}

// //                 {/* Top row: icon + tag */}
// //                 <div className="flex items-start justify-between mb-5">
// //                   <div
// //                     className="p-3 rounded-xl"
// //                     style={{
// //                       background: `${tool.accent}18`,
// //                       color: tool.accent,
// //                     }}
// //                   >
// //                     {tool.icon}
// //                   </div>
// //                   <span
// //                     className="tag-badge px-2.5 py-1 rounded-lg"
// //                     style={{
// //                       background: `${tool.accent}15`,
// //                       color: tool.accent,
// //                     }}
// //                   >
// //                     {tool.tag}
// //                   </span>
// //                 </div>

// //                 {/* Text */}
// //                 <h3 className="text-white font-semibold text-base mb-2 leading-snug">
// //                   {tool.title}
// //                 </h3>
// //                 <p className="text-gray-500 text-sm leading-relaxed mb-5">
// //                   {tool.desc}
// //                 </p>

// //                 {/* Link */}
// //                 <div
// //                   className="text-sm font-medium flex items-center gap-1 transition-gap"
// //                   style={{ color: tool.accent }}
// //                 >
// //                   Open Tool
// //                   <span className="ml-1 group-hover:ml-2 transition-all">→</span>
// //                 </div>

// //                 {/* Bottom accent line */}
// //                 <div
// //                   className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-300"
// //                   style={{
// //                     background: tool.accent,
// //                     opacity: hoveredTool === i ? 0.6 : 0,
// //                   }}
// //                 />
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ── WHY ConvertLinx ── */}
// //       <section className="py-20 px-6 border-t border-white/5">
// //         <div className="max-w-5xl mx-auto">
// //           <div className="text-center mb-14">
// //             <h2
// //               style={{ fontFamily: "'Space Grotesk', sans-serif" }}
// //               className="text-4xl font-bold text-white mb-4"
// //             >
// //               Why ConvertLinx?
// //             </h2>
// //             <p className="text-gray-500 text-lg">Built different. Works better.</p>
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //             {[
// //               {
// //                 icon: <Zap className="w-6 h-6" />,
// //                 title: "Blazing Fast",
// //                 desc: "Everything runs in your browser. No waiting for server uploads or processing.",
// //                 color: "#FBBF24",
// //               },
// //               {
// //                 icon: <Shield className="w-6 h-6" />,
// //                 title: "100% Private",
// //                 desc: "Your files never leave your device. No uploads to shady servers, ever.",
// //                 color: "#34D399",
// //               },
// //               {
// //                 icon: <Star className="w-6 h-6" />,
// //                 title: "Actually Free",
// //                 desc: "No hidden plans, no 'free trial', no credit card. Just tools that work.",
// //                 color: "#818CF8",
// //               },
// //             ].map((item, i) => (
// //               <div key={i} className="feature-card rounded-2xl p-8">
// //                 <div
// //                   className="p-3 rounded-xl inline-flex mb-5"
// //                   style={{ background: `${item.color}15`, color: item.color }}
// //                 >
// //                   {item.icon}
// //                 </div>
// //                 <h3 className="text-white font-semibold text-lg mb-3">{item.title}</h3>
// //                 <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ── BOTTOM CTA ── */}
// //       <section className="py-24 px-6">
// //         <div className="max-w-2xl mx-auto text-center">
// //           <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
// //             Ready to get started?
// //           </div>
// //           <h2
// //             style={{ fontFamily: "'Space Grotesk', sans-serif" }}
// //             className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
// //           >
// //             All tools. Zero cost.{" "}
// //             <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
// //               Right now.
// //             </span>
// //           </h2>
// //           <p className="text-gray-500 mb-10 text-lg">
// //             No account needed. Just open and use.
// //           </p>
// //           <button
// //             onClick={() =>
// //               document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
// //             }
// //             className="cta-btn text-white font-semibold text-lg px-10 py-4 rounded-2xl"
// //           >
// //             Browse All Tools →
// //           </button>
// //         </div>
// //       </section>

// //       {/* Back to Top */}
// //       {showBackToTop && (
// //         <button
// //           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
// //           className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 hover:bg-indigo-500 transition-all z-50"
// //         >
// //           <ArrowUp className="w-5 h-5" />
// //         </button>
// //       )}
// //     </main>
// //   );
// // }



