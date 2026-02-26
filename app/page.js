"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

import {
  ShieldCheck,
  RotateCw,
  PenTool,
  FileText,
  Image,
  FileType,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  Split,
  QrCode,
  Lock,
  Ruler,
  Youtube,
  Image as ImageIcon,
  Stamp,
  ArrowUp
} from "lucide-react";



export default function HomeContent() {
  const router = useRouter();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tools = [
    { title: "PDF to Word Converter", desc: "Turn locked PDFs into editable Word files – formatting stays perfect, even with scanned docs.", link: "/pdf-to-word", icon: <FileType className="w-10 h-10" />, color: "from-rose-500 to-pink-600" },
    { title: "Merge PDF Files", desc: "Combine multiple PDFs into one clean file – great for reports or presentations.", link: "/merge-pdf", icon: <FileArchive className="w-10 h-10" />, color: "from-orange-500 to-red-600" },
    { title: "Split PDF Pages", desc: "Pull out specific pages from a big PDF – no need to keep the whole thing.", link: "/split-pdf", icon: <Split className="w-10 h-10" />, color: "from-amber-500 to-orange-600" },
    { title: "Compress PDF", desc: "Shrink large PDFs down to email-friendly sizes without messing up the quality.", link: "/compress-pdf", icon: <FileText className="w-10 h-10" />, color: "from-yellow-500 to-amber-600" },
    { title: "Word to PDF", desc: "Convert your Word docs to sharp, professional PDFs that look good everywhere.", link: "/word-to-pdf", icon: <FileSpreadsheet className="w-10 h-10" />, color: "from-blue-500 to-indigo-600" },
    { title: "Image to PDF", desc: "Turn photos, screenshots, or scans into a single PDF – supports batch upload too.", link: "/image-to-pdf", icon: <FileImage className="w-10 h-10" />, color: "from-teal-500 to-emerald-600" },
    { title: "Excel to PDF", desc: "Export your spreadsheets as clean, print-ready PDFs – all sheets included.", link: "/excel-pdf", icon: <FileSpreadsheet className="w-10 h-10" />, color: "from-green-500 to-emerald-600" },
    {
      title: "PDF to JPG", desc: "Extract every page from your PDF as high-quality JPG images. Single page → direct JPG, multiple pages → ZIP file.", link: "/pdf-to-jpg", icon: <Image className="w-10 h-10" />, color: "from-orange-500 to-amber-600"
    },
    { title: "QR Code Generator", desc: "Make QR codes for links, WiFi passwords, menus – ready in seconds.", link: "/qr-generator", icon: <QrCode className="w-10 h-10" />, color: "from-cyan-500 to-blue-600" },
    { title: "Password Generator", desc: "Create strong, random passwords that actually keep your accounts safe.", link: "/password-gen", icon: <Lock className="w-10 h-10" />, color: "from-purple-500 to-violet-600" },
    { title: "Unit Converter", desc: "Quick conversions for length, weight, temperature – over 50 units supported.", link: "/unit-converter", icon: <Ruler className="w-10 h-10" />, color: "from-lime-500 to-green-600" },
    { title: "YouTube Thumbnail Downloader", desc: "Grab full HD thumbnails from any YouTube video in one click.", link: "/youtube-thumbnail", icon: <Youtube className="w-10 h-10" />, color: "from-red-600 to-rose-600" },
    { title: "Image Compressor", desc: "Reduce image size by up to 80% while keeping them looking sharp.", link: "/image-compressor", icon: <ImageIcon className="w-10 h-10" />, color: "from-sky-500 to-cyan-600" },
    { title: "Image to Text (OCR)", desc: "Extract text from photos, scans, or screenshots – surprisingly accurate.", link: "/image-to-text", icon: <ImageIcon className="w-10 h-10" />, color: "from-indigo-500 to-purple-600" },
    { title: "Signature Maker", desc: "Draw or type your signature and download it for documents.", link: "/signature-maker", icon: <PenTool className="w-10 h-10" />, color: "from-emerald-500 to-teal-600" },
    { title: "HEIC to JPG Converter", desc: "Convert iPhone photos to regular JPGs that open everywhere.", link: "/heic-to-jpg", icon: <FileImage className="w-10 h-10" />, color: "from-orange-500 to-amber-600" },
    { title: "Text to PDF", desc: "Turn plain text into a nicely formatted PDF with custom styling.", link: "/text-to-pdf", icon: <FileText className="w-10 h-10" />, color: "from-violet-500 to-purple-600" },
    { title: "Image Converter", desc: "Switch between JPG, PNG, WebP, GIF – transparency stays intact.", link: "/image-converter", icon: <FileImage className="w-10 h-10" />, color: "from-pink-500 to-rose-600" },
    { title: "Add Watermark", desc: "Protect your images with text or logo watermarks – adjust position and transparency.", link: "/add-watermark", icon: <Stamp className="w-10 h-10" />, color: "from-blue-500 to-cyan-600" },

    {
      title: "protect-pdf",
      desc: "Add password protection to your PDF files and keep your documents secure from unauthorized access.",
      link: "/protect-pdf",
      icon: <ShieldCheck className="w-10 h-10" />,
      color: "from-purple-500 to-indigo-600"
    },

    {
      title: "unlock-pdf",
      desc: "Remove password protection from PDF files instantly and access your documents without restrictions.",
      link: "/unlock-pdf",
      icon: <Lock className="w-10 h-10" />,
      color: "from-emerald-500 to-teal-600"
    },

    {
      title: "rotate-pdf",
      desc: "Rotate PDF pages 90°, 180°, or 270° to fix orientation quickly and easily online.",
      link: "/rotate-pdf",
      icon: <RotateCw className="w-10 h-10" />,
      color: "from-orange-500 to-red-500"
    },

    {
      title: "sign-pdf",
      desc: "Add your digital signature to PDF documents. Draw, type, or upload your signature securely.",
      link: "/sign-pdf",
      icon: <PenTool className="w-10 h-10" />,
      color: "from-blue-500 to-cyan-600"
    },


  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white py-12 px-4 overflow-hidden">
        {/* overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">

          {/* Top badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm font-medium">
            🔒 Privacy-first PDF tools · No ads · No signup
          </div>

          {/* Main heading */}
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
            Free Online PDF Tools
            <br />
            Convert PDF to Word, Merge,
            <br />
            Split & Compress PDFs
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl max-w-4xl mx-auto mb-6 opacity-95 leading-relaxed">
            PDF to Word, Word to PDF & other essential tools, fast, simple, and built for privacy.
          </p>

          {/* Personal line */}
          <p className="text-base md:text-lg max-w-4xl mx-auto mb-6 opacity-90">
            I built PDFLinx after getting tired of slow sites, intrusive pop-ups, and tools that upload files to shady servers.
          </p>

          {/* Emphasis line */}
          <p className="text-lg md:text-xl font-semibold mb-10">
            Everything runs in your browser, your files never leave your device.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm md:text-base">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
              🔒 Files stay on your device
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
              ⚡ Actually fast
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
              🆓 Completely free
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() =>
                document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white text-indigo-700 font-bold text-lg px-10 py-4 rounded-2xl shadow-xl hover:scale-105 transition"
            >
              Check Out the Tools
            </button>

            <a
              href="/pdf-to-word"
              className="bg-white/10 border border-white/30 backdrop-blur text-white font-semibold text-lg px-10 py-4 rounded-2xl hover:bg-white/20 transition"
            >
              Try PDF to Word →
            </a>
          </div>

        </div>
      </section>



      {/* Why Choose */}
      <section className="py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5">Why I Built This</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">And why you might actually like using it</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: "No Creepy File Storage", text: "Most sites upload your files to their servers. Not here — everything processes locally in your browser.", emoji: "🔒" },
            { title: "Zero Ads", text: "No popups, no video ads, no 'upgrade to premium' bullshit. Just a clean tool that works.", emoji: "🙅‍♂️" },
            { title: "Built for Speed", text: "I hate waiting. These tools finish in seconds — no unnecessary loading screens.", emoji: "⚡" },
            { title: "All Tools in One Place", text: "Stop jumping between 5 different websites. Everything you need is right here.", emoji: "🛠️" },
            { title: "No Account Needed", text: "Just open the site and start using. No email, no password, no spam later.", emoji: "🚀" },
            { title: "Works on Phone Too", text: "Tested on mobile — smooth drag-and-drop, no pinching or zooming hell.", emoji: "📱" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="text-6xl mb-5">{item.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h3>
              <p className="text-base text-gray-700 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5">
            All the Tools You Need
          </h2>
          <p className="text-xl text-gray-600">
            Pick one and get started — takes seconds
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tools.map((tool, i) => (
            <div
              key={i}
              onClick={() => router.push(tool.link)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`h-3 bg-gradient-to-r ${tool.color}`}></div>
              <div className="p-7 text-center">
                <div
                  className={`p-5 rounded-2xl bg-gradient-to-br ${tool.color} text-white inline-flex mb-5 shadow-lg group-hover:scale-105 transition-all duration-300`}
                >
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                  {tool.desc}
                </p>
                <span className="text-indigo-600 font-semibold text-base flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                  Open Tool →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 🔗 View All Tools Link */}
        <div className="text-center mt-12">
          <Link
            href="/free-pdf-tools"
            className="inline-block text-indigo-600 font-semibold text-lg hover:underline"
          >
            View all free PDF tools →
          </Link>
        </div>
      </section>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-indigo-700 transition-all z-50"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </main>
  );
}


