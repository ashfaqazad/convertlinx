"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
} from "lucide-react";

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
    {
      title: "QR Code Generator",
      desc: "Make QR codes for links, WiFi passwords, menus – ready in seconds.",
      link: "/qr-generator",
      icon: <QrCode className="w-7 h-7" />,
      accent: "#FF6B35",
      tag: "Popular",
    },
    {
      title: "Password Generator",
      desc: "Create strong, random passwords that actually keep your accounts safe.",
      link: "/password-gen",
      icon: <Lock className="w-7 h-7" />,
      accent: "#7C3AED",
      tag: "Security",
    },
    {
      title: "Unit Converter",
      desc: "Quick conversions for length, weight, temperature – over 50 units supported.",
      link: "/unit-converter",
      icon: <Ruler className="w-7 h-7" />,
      accent: "#059669",
      tag: "Utility",
    },
    {
      title: "YouTube Thumbnail",
      desc: "Grab full HD thumbnails from any YouTube video in one click.",
      link: "/youtube-thumbnail",
      icon: <Youtube className="w-7 h-7" />,
      accent: "#DC2626",
      tag: "Media",
    },
    {
      title: "Image Compressor",
      desc: "Reduce image size by up to 80% while keeping them looking sharp.",
      link: "/image-compressor",
      icon: <ImageIcon className="w-7 h-7" />,
      accent: "#0284C7",
      tag: "Images",
    },
    {
      title: "Image to Text (OCR)",
      desc: "Extract text from photos, scans, or screenshots – surprisingly accurate.",
      link: "/image-to-text",
      icon: <ImageIcon className="w-7 h-7" />,
      accent: "#9333EA",
      tag: "OCR",
    },
    {
      title: "Signature Maker",
      desc: "Draw or type your signature and download it for documents.",
      link: "/signature-maker",
      icon: <PenTool className="w-7 h-7" />,
      accent: "#0F766E",
      tag: "Documents",
    },
    {
      title: "HEIC to JPG",
      desc: "Convert iPhone photos to regular JPGs that open everywhere.",
      link: "/heic-to-jpg",
      icon: <FileImage className="w-7 h-7" />,
      accent: "#EA580C",
      tag: "Convert",
    },
    {
      title: "Text to PDF",
      desc: "Turn plain text into a nicely formatted PDF with custom styling.",
      link: "/text-to-pdf",
      icon: <FileText className="w-7 h-7" />,
      accent: "#7C3AED",
      tag: "Convert",
    },
    {
      title: "Image Converter",
      desc: "Switch between JPG, PNG, WebP, GIF – transparency stays intact.",
      link: "/image-converter",
      icon: <RefreshCw className="w-7 h-7" />,
      accent: "#DB2777",
      tag: "Images",
    },
  ];

  const stats = [
    { value: "10+", label: "Free Tools" },
    { value: "0", label: "Ads" },
    { value: "100%", label: "Browser-based" },
    { value: "∞", label: "Free Forever" },
  ];

  return (
    <main
      style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}
      className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden"
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

        .hero-glow {
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.35) 0%, transparent 70%);
        }
        .grid-bg {
          background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .tool-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tool-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-4px);
        }
        .tag-badge {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .feature-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          transition: border-color 0.3s ease;
        }
        .feature-card:hover {
          border-color: rgba(255,255,255,0.12);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .float-anim { animation: float 4s ease-in-out infinite; }
        .cta-btn {
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
          transition: all 0.3s ease;
          box-shadow: 0 0 30px rgba(99,102,241,0.3);
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 50px rgba(99,102,241,0.5);
        }
        .secondary-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.3s ease;
        }
        .secondary-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.25);
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center grid-bg">
        <div className="hero-glow absolute inset-0 pointer-events-none" />

        {/* Floating blobs */}
        <div className="absolute top-32 left-16 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl float-anim pointer-events-none" />
        <div className="absolute bottom-32 right-16 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            10 Free Tools · No Signup · No Ads
          </div>

          {/* Heading */}
          <h1
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            className="text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight"
          >
            Every Tool You Need,{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Completely Free
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            QR codes, image tools, converters, OCR and more — all in one place.
            No signup, no ads, no nonsense.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button
              onClick={() =>
                document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
              }
              className="cta-btn text-white font-semibold text-base px-8 py-4 rounded-2xl"
            >
              Explore All Tools →
            </button>
            <a
              href="/qr-generator"
              className="secondary-btn text-gray-300 font-medium text-base px-8 py-4 rounded-2xl"
            >
              Try QR Generator
            </a>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="stat-card rounded-2xl px-4 py-5 text-center">
                <div
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  className="text-3xl font-bold text-white mb-1"
                >
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS GRID ── */}
      <section id="tools" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              All Tools
            </h2>
            <p className="text-gray-500 text-lg">Pick one — done in seconds</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tools.map((tool, i) => (
              <div
                key={i}
                onClick={() => router.push(tool.link)}
                onMouseEnter={() => setHoveredTool(i)}
                onMouseLeave={() => setHoveredTool(null)}
                className="tool-card rounded-2xl p-6 cursor-pointer relative overflow-hidden"
              >
                {/* Accent glow on hover */}
                {hoveredTool === i && (
                  <div
                    className="absolute inset-0 opacity-5 pointer-events-none rounded-2xl"
                    style={{ background: tool.accent }}
                  />
                )}

                {/* Top row: icon + tag */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: `${tool.accent}18`,
                      color: tool.accent,
                    }}
                  >
                    {tool.icon}
                  </div>
                  <span
                    className="tag-badge px-2.5 py-1 rounded-lg"
                    style={{
                      background: `${tool.accent}15`,
                      color: tool.accent,
                    }}
                  >
                    {tool.tag}
                  </span>
                </div>

                {/* Text */}
                <h3 className="text-white font-semibold text-base mb-2 leading-snug">
                  {tool.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {tool.desc}
                </p>

                {/* Link */}
                <div
                  className="text-sm font-medium flex items-center gap-1 transition-gap"
                  style={{ color: tool.accent }}
                >
                  Open Tool
                  <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-300"
                  style={{
                    background: tool.accent,
                    opacity: hoveredTool === i ? 0.6 : 0,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CONVERTLYHUB ── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              className="text-4xl font-bold text-white mb-4"
            >
              Why ConvertlyHub?
            </h2>
            <p className="text-gray-500 text-lg">Built different. Works better.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Blazing Fast",
                desc: "Everything runs in your browser. No waiting for server uploads or processing.",
                color: "#FBBF24",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "100% Private",
                desc: "Your files never leave your device. No uploads to shady servers, ever.",
                color: "#34D399",
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Actually Free",
                desc: "No hidden plans, no 'free trial', no credit card. Just tools that work.",
                color: "#818CF8",
              },
            ].map((item, i) => (
              <div key={i} className="feature-card rounded-2xl p-8">
                <div
                  className="p-3 rounded-xl inline-flex mb-5"
                  style={{ background: `${item.color}15`, color: item.color }}
                >
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            Ready to get started?
          </div>
          <h2
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            All tools. Zero cost.{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Right now.
            </span>
          </h2>
          <p className="text-gray-500 mb-10 text-lg">
            No account needed. Just open and use.
          </p>
          <button
            onClick={() =>
              document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
            }
            className="cta-btn text-white font-semibold text-lg px-10 py-4 rounded-2xl"
          >
            Browse All Tools →
          </button>
        </div>
      </section>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 hover:bg-indigo-500 transition-all z-50"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </main>
  );
}



































// "use client";

// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useState, useEffect } from "react";

// import {
//   ShieldCheck,
//   RotateCw,
//   PenTool,
//   FileText,
//   Image,
//   FileType,
//   FileArchive,
//   FileImage,
//   FileSpreadsheet,
//   Split,
//   QrCode,
//   Lock,
//   Ruler,
//   Youtube,
//   Image as ImageIcon,
//   Stamp,
//   ArrowUp
// } from "lucide-react";



// export default function HomeContent() {
//   const router = useRouter();
//   const [showBackToTop, setShowBackToTop] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setShowBackToTop(window.scrollY > 600);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const tools = [
//     { title: "PDF to Word Converter", desc: "Turn locked PDFs into editable Word files – formatting stays perfect, even with scanned docs.", link: "/pdf-to-word", icon: <FileType className="w-10 h-10" />, color: "from-rose-500 to-pink-600" },
//     { title: "Merge PDF Files", desc: "Combine multiple PDFs into one clean file – great for reports or presentations.", link: "/merge-pdf", icon: <FileArchive className="w-10 h-10" />, color: "from-orange-500 to-red-600" },
//     { title: "Split PDF Pages", desc: "Pull out specific pages from a big PDF – no need to keep the whole thing.", link: "/split-pdf", icon: <Split className="w-10 h-10" />, color: "from-amber-500 to-orange-600" },
//     { title: "Compress PDF", desc: "Shrink large PDFs down to email-friendly sizes without messing up the quality.", link: "/compress-pdf", icon: <FileText className="w-10 h-10" />, color: "from-yellow-500 to-amber-600" },
//     { title: "Word to PDF", desc: "Convert your Word docs to sharp, professional PDFs that look good everywhere.", link: "/word-to-pdf", icon: <FileSpreadsheet className="w-10 h-10" />, color: "from-blue-500 to-indigo-600" },
//     { title: "Image to PDF", desc: "Turn photos, screenshots, or scans into a single PDF – supports batch upload too.", link: "/image-to-pdf", icon: <FileImage className="w-10 h-10" />, color: "from-teal-500 to-emerald-600" },
//     { title: "Excel to PDF", desc: "Export your spreadsheets as clean, print-ready PDFs – all sheets included.", link: "/excel-pdf", icon: <FileSpreadsheet className="w-10 h-10" />, color: "from-green-500 to-emerald-600" },
//     {
//       title: "PDF to JPG", desc: "Extract every page from your PDF as high-quality JPG images. Single page → direct JPG, multiple pages → ZIP file.", link: "/pdf-to-jpg", icon: <Image className="w-10 h-10" />, color: "from-orange-500 to-amber-600"
//     },
//     { title: "QR Code Generator", desc: "Make QR codes for links, WiFi passwords, menus – ready in seconds.", link: "/qr-generator", icon: <QrCode className="w-10 h-10" />, color: "from-cyan-500 to-blue-600" },
//     { title: "Password Generator", desc: "Create strong, random passwords that actually keep your accounts safe.", link: "/password-gen", icon: <Lock className="w-10 h-10" />, color: "from-purple-500 to-violet-600" },
//     { title: "Unit Converter", desc: "Quick conversions for length, weight, temperature – over 50 units supported.", link: "/unit-converter", icon: <Ruler className="w-10 h-10" />, color: "from-lime-500 to-green-600" },
//     { title: "YouTube Thumbnail Downloader", desc: "Grab full HD thumbnails from any YouTube video in one click.", link: "/youtube-thumbnail", icon: <Youtube className="w-10 h-10" />, color: "from-red-600 to-rose-600" },
//     { title: "Image Compressor", desc: "Reduce image size by up to 80% while keeping them looking sharp.", link: "/image-compressor", icon: <ImageIcon className="w-10 h-10" />, color: "from-sky-500 to-cyan-600" },
//     { title: "Image to Text (OCR)", desc: "Extract text from photos, scans, or screenshots – surprisingly accurate.", link: "/image-to-text", icon: <ImageIcon className="w-10 h-10" />, color: "from-indigo-500 to-purple-600" },
//     { title: "Signature Maker", desc: "Draw or type your signature and download it for documents.", link: "/signature-maker", icon: <PenTool className="w-10 h-10" />, color: "from-emerald-500 to-teal-600" },
//     { title: "HEIC to JPG Converter", desc: "Convert iPhone photos to regular JPGs that open everywhere.", link: "/heic-to-jpg", icon: <FileImage className="w-10 h-10" />, color: "from-orange-500 to-amber-600" },
//     { title: "Text to PDF", desc: "Turn plain text into a nicely formatted PDF with custom styling.", link: "/text-to-pdf", icon: <FileText className="w-10 h-10" />, color: "from-violet-500 to-purple-600" },
//     { title: "Image Converter", desc: "Switch between JPG, PNG, WebP, GIF – transparency stays intact.", link: "/image-converter", icon: <FileImage className="w-10 h-10" />, color: "from-pink-500 to-rose-600" },
//     { title: "Add Watermark", desc: "Protect your images with text or logo watermarks – adjust position and transparency.", link: "/add-watermark", icon: <Stamp className="w-10 h-10" />, color: "from-blue-500 to-cyan-600" },

//     {
//       title: "protect-pdf",
//       desc: "Add password protection to your PDF files and keep your documents secure from unauthorized access.",
//       link: "/protect-pdf",
//       icon: <ShieldCheck className="w-10 h-10" />,
//       color: "from-purple-500 to-indigo-600"
//     },

//     {
//       title: "unlock-pdf",
//       desc: "Remove password protection from PDF files instantly and access your documents without restrictions.",
//       link: "/unlock-pdf",
//       icon: <Lock className="w-10 h-10" />,
//       color: "from-emerald-500 to-teal-600"
//     },

//     {
//       title: "rotate-pdf",
//       desc: "Rotate PDF pages 90°, 180°, or 270° to fix orientation quickly and easily online.",
//       link: "/rotate-pdf",
//       icon: <RotateCw className="w-10 h-10" />,
//       color: "from-orange-500 to-red-500"
//     },

//     {
//       title: "sign-pdf",
//       desc: "Add your digital signature to PDF documents. Draw, type, or upload your signature securely.",
//       link: "/sign-pdf",
//       icon: <PenTool className="w-10 h-10" />,
//       color: "from-blue-500 to-cyan-600"
//     },


//   ];

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">

//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white py-12 px-4 overflow-hidden">
//         {/* overlay */}
//         <div className="absolute inset-0 bg-black/20"></div>

//         <div className="relative z-10 max-w-6xl mx-auto text-center">

//           {/* Top badge */}
//           <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm font-medium">
//             🔒 Privacy-first PDF tools · No ads · No signup
//           </div>

//           {/* Main heading */}
//           <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
//             Free Online PDF Tools
//             <br />
//             Convert PDF to Word, Merge,
//             <br />
//             Split & Compress PDFs
//           </h1>

//           {/* Subtitle */}
//           <p className="text-lg md:text-xl max-w-4xl mx-auto mb-6 opacity-95 leading-relaxed">
//             PDF to Word, Word to PDF & other essential tools, fast, simple, and built for privacy.
//           </p>

//           {/* Personal line */}
//           <p className="text-base md:text-lg max-w-4xl mx-auto mb-6 opacity-90">
//             I built PDFLinx after getting tired of slow sites, intrusive pop-ups, and tools that upload files to shady servers.
//           </p>

//           {/* Emphasis line */}
//           <p className="text-lg md:text-xl font-semibold mb-10">
//             Everything runs in your browser, your files never leave your device.
//           </p>

//           {/* Feature pills */}
//           <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm md:text-base">
//             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
//               🔒 Files stay on your device
//             </div>
//             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
//               ⚡ Actually fast
//             </div>
//             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
//               🆓 Completely free
//             </div>
//           </div>

//           {/* CTA buttons */}
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button
//               onClick={() =>
//                 document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
//               }
//               className="bg-white text-indigo-700 font-bold text-lg px-10 py-4 rounded-2xl shadow-xl hover:scale-105 transition"
//             >
//               Check Out the Tools
//             </button>

//             <a
//               href="/pdf-to-word"
//               className="bg-white/10 border border-white/30 backdrop-blur text-white font-semibold text-lg px-10 py-4 rounded-2xl hover:bg-white/20 transition"
//             >
//               Try PDF to Word →
//             </a>
//           </div>

//         </div>
//       </section>



//       {/* Why Choose */}
//       <section className="py-20 px-4">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5">Why I Built This</h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">And why you might actually like using it</p>
//         </div>

//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
//           {[
//             { title: "No Creepy File Storage", text: "Most sites upload your files to their servers. Not here — everything processes locally in your browser.", emoji: "🔒" },
//             { title: "Zero Ads", text: "No popups, no video ads, no 'upgrade to premium' bullshit. Just a clean tool that works.", emoji: "🙅‍♂️" },
//             { title: "Built for Speed", text: "I hate waiting. These tools finish in seconds — no unnecessary loading screens.", emoji: "⚡" },
//             { title: "All Tools in One Place", text: "Stop jumping between 5 different websites. Everything you need is right here.", emoji: "🛠️" },
//             { title: "No Account Needed", text: "Just open the site and start using. No email, no password, no spam later.", emoji: "🚀" },
//             { title: "Works on Phone Too", text: "Tested on mobile — smooth drag-and-drop, no pinching or zooming hell.", emoji: "📱" },
//           ].map((item, i) => (
//             <div key={i} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
//               <div className="text-6xl mb-5">{item.emoji}</div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h3>
//               <p className="text-base text-gray-700 leading-relaxed">{item.text}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Tools Grid */}
//       <section id="tools" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5">
//             All the Tools You Need
//           </h2>
//           <p className="text-xl text-gray-600">
//             Pick one and get started — takes seconds
//           </p>
//         </div>

//         <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {tools.map((tool, i) => (
//             <div
//               key={i}
//               onClick={() => router.push(tool.link)}
//               className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
//             >
//               <div className={`h-3 bg-gradient-to-r ${tool.color}`}></div>
//               <div className="p-7 text-center">
//                 <div
//                   className={`p-5 rounded-2xl bg-gradient-to-br ${tool.color} text-white inline-flex mb-5 shadow-lg group-hover:scale-105 transition-all duration-300`}
//                 >
//                   {tool.icon}
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition">
//                   {tool.title}
//                 </h3>
//                 <p className="text-gray-600 text-sm mb-5 leading-relaxed">
//                   {tool.desc}
//                 </p>
//                 <span className="text-indigo-600 font-semibold text-base flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
//                   Open Tool →
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* 🔗 View All Tools Link */}
//         <div className="text-center mt-12">
//           <Link
//             href="/free-pdf-tools"
//             className="inline-block text-indigo-600 font-semibold text-lg hover:underline"
//           >
//             View all free PDF tools →
//           </Link>
//         </div>
//       </section>

//       {/* Back to Top */}
//       {showBackToTop && (
//         <button
//           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//           className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-indigo-700 transition-all z-50"
//         >
//           <ArrowUp className="w-6 h-6" />
//         </button>
//       )}
//     </main>
//   );
// }


