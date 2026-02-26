"use client";
import Link from "next/link";
import { useState } from "react";



import {
  ChevronDown,
  FileText,
  FileType,
  FileImage,
  FileSpreadsheet,
  FileMinus,
  FilePlus,
  QrCode,
  Lock,
  Ruler,
  Youtube,
  Image as ImageIcon,
  PenTool,
  ScanLine,
  FileEdit,
  // RotateCw,
  // Droplet

} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (href) => () => {
    window.location.href = href;
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center py-3">
            <img
              src="/pdflinx-logo.svg"
              alt="PDF Linx logo"
              className="h-11 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              Home
            </Link>

            <Link
              href="/merge-pdf"
              className="text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              Merge PDF
            </Link>

            <Link
              href="/split-pdf"
              className="text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              Split PDF
            </Link>

            <Link
              href="/compress-pdf"
              className="text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              Compress PDF
            </Link>

{/* === PDF TOOLS Dropdown (Desktop) – Polished === */}
<div className="relative group">
  <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition">
    PDF Tools{" "}
    <ChevronDown size={16} className="group-hover:rotate-180 transition" />
  </button>

  <div
    className="
      absolute top-14 left-1/2 -translate-x-1/2 w-[820px]
      bg-white/95 backdrop-blur-md
      rounded-2xl border border-gray-100
      shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]
      opacity-0 invisible group-hover:opacity-100 group-hover:visible
      transition-all duration-300
      overflow-hidden
    "
  >
    {/* Top accent line */}
    <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

    <div className="grid grid-cols-4 gap-5 px-5 py-4 bg-gradient-to-b from-gray-50 to-white">
      {/* Hub link */}
      <div className="col-span-4">
        <Link
          href="/free-pdf-tools"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "/free-pdf-tools";
          }}
          className="
            flex items-center justify-center gap-2
            px-4 py-2 rounded-xl
            bg-indigo-50 text-indigo-700 font-semibold
            hover:bg-indigo-100 transition text-sm
          "
        >
          🔹 All PDF Tools
        </Link>
      </div>

      {/* Convert TO PDF */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
          Convert to PDF
        </h3>
        <div className="space-y-1">
          <Link
            href="/word-to-pdf"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/word-to-pdf";
            }}
            className="
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm
              hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1
            "
          >
            <FileType size={20} className="text-blue-600" />
            <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              WORD to PDF
            </span>
          </Link>

          <Link
            href="/excel-pdf"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/excel-pdf";
            }}
            className="
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm
              hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1
            "
          >
            <FileSpreadsheet size={20} className="text-green-600" />
            <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              EXCEL to PDF
            </span>
          </Link>

          <Link
            href="/ppt-to-pdf"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/ppt-to-pdf";
            }}
            className="
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm
              hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1
            "
          >
            {/* <FileSpreadsheet size={20} className="text-green-600" /> */}
            <FileSpreadsheet size={20} className="text-green-600 flex-shrink-0" />
            {/* <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              POWERPOINT to PDF
            </span> */}
            <span className="font-medium text-gray-700 group-hover:text-indigo-600 whitespace-nowrap">
              POWERPOINT to PDF
            </span>

          </Link>

          <Link
            href="/image-to-pdf"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/image-to-pdf";
            }}
            className="
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm
              hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1
            "
          >
            <FileImage size={20} className="text-orange-600" />
            <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              JPG to PDF
            </span>
          </Link>
        </div>
      </div>

      {/* Convert FROM PDF */}
      <div className="border-l border-gray-100 pl-6">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
          Convert from PDF
        </h3>
        <div className="space-y-1">
          <Link
            href="/pdf-to-word"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/pdf-to-word";
            }}
            className="
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm
              hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1
            "
          >
            <FileText size={20} className="text-red-600" />
            <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              PDF to WORD
            </span>
          </Link>

          <Link
            href="/pdf-to-jpg"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/pdf-to-jpg";
            }}
            className="
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm
              hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1
            "
          >
            <ImageIcon size={20} className="text-orange-600" />
            <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              PDF to JPG
            </span>
          </Link>
        </div>
      </div>

      {/* PDF Security */}
      <div className="border-l border-gray-100 pl-6">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
          PDF security
        </h3>
        <div className="space-y-1">
          <Link
            href="/protect-pdf"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/protect-pdf";
            }}
            className="
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm
              hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1
            "
          >
            <FileMinus size={20} className="text-purple-600" />
            <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              Protect PDF
            </span>
          </Link>

          <Link
            href="/unlock-pdf"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/unlock-pdf";
            }}
            className="
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm
              hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1
            "
          >
            <FilePlus size={20} className="text-emerald-600" />
            <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              Unlock PDF
            </span>
          </Link>

          <Link
            href="/sign-pdf"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/sign-pdf";
            }}
            className="
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm
              hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1
            "
          >
            <FilePlus size={20} className="text-emerald-600" />
            <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              Sign PDF
            </span>
          </Link>
        </div>
      </div>

      {/* Edit PDF */}
      <div className="border-l border-gray-100 pl-6">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
          Edit PDF
        </h3>
        <div className="space-y-1">
          <Link
            href="/rotate-pdf"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/rotate-pdf";
            }}
            className="
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm
              hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1
            "
          >
            <FileMinus size={20} className="text-purple-600" />
            <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              Rotate PDF
            </span>
          </Link>

          <Link
            href="/ocr-pdf"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/ocr-pdf";
            }}
            className="
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm
              hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1
            "
          >
            <ScanLine size={20} className="text-blue-600" />
            <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              OCR PDF
            </span>
          </Link>

          <Link
            href="/edit-pdf"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/edit-pdf";
            }}
            className="
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm
              hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1
            "
          >
            <FileEdit size={20} className="text-orange-600" />
            <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              Edit PDF
            </span>
          </Link>


          <Link
            href="/add-watermark"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/add-watermark";
            }}
            className="
              flex items-center gap-3 px-3 py-2 rounded-xl text-sm
              hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1
            "
          >
            <FilePlus size={20} className="text-emerald-600" />
            {/* <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              Add Watermark
            </span> */}
            <span className="font-medium text-gray-700 group-hover:text-indigo-600 whitespace-nowrap">
              Add Watermark
            </span>

          </Link>
        </div>
      </div>
    </div>
  </div>
</div>

{/* === Utility Tools Dropdown (Desktop) – Polished + Icon & Text on Same Line === */}
<div className="relative group">
  <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition">
    Utility Tools{" "}
    <ChevronDown size={16} className="group-hover:rotate-180 transition" />
  </button>

  <div
    className="
      absolute top-14 left-1/2 -translate-x-1/2 w-[520px]
      bg-white/95 backdrop-blur-md
      rounded-2xl border border-gray-100
      shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]
      opacity-0 invisible group-hover:opacity-100 group-hover:visible
      transition-all duration-300
      overflow-hidden
    "
  >
    {/* Top accent line */}
    <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

    <div className="p-5 bg-gradient-to-b from-gray-50 to-white">
      <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4 text-center">
        All Utility Tools
      </h3>

      {/* ✅ 1 line items: icon + label */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { href: "/qr-generator", icon: QrCode, color: "text-sky-600", label: "QR Generator" },
          { href: "/password-gen", icon: Lock, color: "text-amber-600", label: "Password Gen" },
          { href: "/unit-converter", icon: Ruler, color: "text-lime-600", label: "Unit Converter" },
          { href: "/youtube-thumbnail", icon: Youtube, color: "text-red-600", label: "YT Thumbnail" },
          { href: "/image-compressor", icon: ImageIcon, color: "text-cyan-600", label: "Image Compress" },
          { href: "/image-to-text", icon: ImageIcon, color: "text-indigo-600", label: "Image to Text" },
          { href: "/signature-maker", icon: PenTool, color: "text-emerald-600", label: "Signature Maker" },
          { href: "/text-to-pdf", icon: FileText, color: "text-purple-600", label: "Text to PDF" },
          { href: "/heic-to-jpg", icon: FileImage, color: "text-orange-600", label: "HEIC to JPG" },
          { href: "/image-converter", icon: ImageIcon, color: "text-blue-600", label: "Image Converter" },
        ].map((item) => (
          <button
            key={item.href}
            onClick={go(item.href)}
            className="
              flex items-center gap-3 w-full
              px-3 py-2 rounded-xl
              transition-all duration-200
              hover:bg-indigo-50 hover:translate-x-1
              group
            "
          >
            <item.icon size={20} className={item.color} />
            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 whitespace-nowrap">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
</div>

            <Link
              href="/blog"
              className="text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-gray-700 hover:text-indigo-600 text-3xl"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-6 py-6 space-y-4">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
              className="block font-semibold text-gray-800 py-2"
            >
              Home
            </Link>

            <Link
              href="/merge-pdf"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/merge-pdf";
              }}
              className="block font-semibold text-gray-800 py-2"
            >
              Merge PDF
            </Link>

            <Link
              href="/split-pdf"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/split-pdf";
              }}
              className="block font-semibold text-gray-800 py-2"
            >
              Split PDF
            </Link>

            <Link
              href="/compress-pdf"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/compress-pdf";
              }}
              className="block font-semibold text-gray-800 py-2"
            >
              Compress PDF
            </Link>

            {/* PDF Tools (Mobile) - NOW with divisions like Desktop */}
            <details className="group">
              <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
                PDF Tools{" "}
                <ChevronDown className="group-open:rotate-180 transition" />
              </summary>

              {/* Hub link */}
              <Link
                href="/free-pdf-tools"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/free-pdf-tools";
                }}
                className="block font-semibold text-indigo-600 py-2 border-b border-gray-100"
              >
                🔹 All PDF Tools
              </Link>

              {/* ✅ Mobile divisions (2 columns like desktop feel) */}
              <div className="mt-3 rounded-xl border border-gray-100 bg-white shadow-sm p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Convert TO PDF */}
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 mb-2">
                      Convert TO PDF
                    </h3>
                    <div className="space-y-2 text-sm">
                      <Link
                        href="/word-to-pdf"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/word-to-pdf";
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <FileType size={16} className="text-blue-600" />
                        Word to PDF
                      </Link>

                      <Link
                        href="/excel-pdf"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/excel-pdf";
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <FileSpreadsheet size={16} className="text-green-600" />
                        Excel to PDF
                      </Link>

                      <Link
                        href="/ppt-to-pdf"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/ppt-to-pdf";
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <FileSpreadsheet size={16} className="text-green-600" />
                        PowerPoint to PDF
                      </Link>

                      <Link
                        href="/image-to-pdf"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/image-to-pdf";
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <FileImage size={16} className="text-orange-600" />
                        JPG to PDF
                      </Link>
                    </div>
                  </div>

                  {/* Convert FROM PDF */}
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 mb-2">
                      Convert FROM PDF
                    </h3>
                    <div className="space-y-2 text-sm">
                      <Link
                        href="/pdf-to-word"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/pdf-to-word";
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <FileText size={16} className="text-red-600" />
                        PDF to Word
                      </Link>

                      <Link
                        href="/pdf-to-jpg"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/pdf-to-jpg";
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <ImageIcon size={16} className="text-orange-600" />
                        PDF to JPG
                      </Link>
                    </div>
                  </div>

                  {/* PDF Security */}
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 mb-2">
                      PDF SECURITY
                    </h3>
                    <div className="space-y-2 text-sm">
                      <Link
                        href="/protect-pdf"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/protect-pdf";
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <FileMinus size={16} className="text-purple-600" />
                        Protect PDF
                      </Link>

                      <Link
                        href="/unlock-pdf"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/unlock-pdf";
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <FilePlus size={16} className="text-emerald-600" />
                        Unlock PDF
                      </Link>

                      <Link
                        href="/sign-pdf"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/sign-pdf";
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <FilePlus size={16} className="text-emerald-600" />
                        Sign PDF
                      </Link>
                    </div>
                  </div>


                  {/* Edit PDF */}
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 mb-2">
                      Edit PDF
                    </h3>
                    <div className="space-y-2 text-sm">
                      <Link
                        href="/rotate-pdf"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/rotate-pdf";
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <FileMinus size={16} className="text-purple-600" />
                        Rotate PDF
                      </Link>
                      
                      <Link
                        href="/ocr-pdf"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/ocr-pdf";
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <ScanLine size={16} className="text-blue-600" />
                        OCR PDF
                      </Link>

                      <Link
                        href="/edit-pdf"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/edit-pdf";
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <FileEdit size={16} className="text-orange-600" />
                        Edit PDF
                      </Link>

                      <Link
                        href="/add-watermark"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/add-watermark";
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <FilePlus size={16} className="text-emerald-600" />
                        Add Watermark
                      </Link>
                    </div>
                  </div>


                </div>
              </div>
            </details>

            {/* Utility Tools (Mobile) - keep simple list (as you had) */}
            {/* <details className="group">
              <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
                Utility Tools{" "}
                <ChevronDown className="group-open:rotate-180 transition" />
              </summary>
              <div className="pl-6 mt-2 space-y-2 text-sm">
                <Link
                  href="/qr-generator"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/qr-generator";
                  }}
                  className="block text-gray-600 hover:text-indigo-600 py-1"
                >
                  QR Generator
                </Link>
                <Link
                  href="/password-gen"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/password-gen";
                  }}
                  className="block text-gray-600 hover:text-indigo-600 py-1"
                >
                  Password Generator
                </Link>
                <Link
                  href="/unit-converter"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/unit-converter";
                  }}
                  className="block text-gray-600 hover:text-indigo-600 py-1"
                >
                  Unit Converter
                </Link>
                <Link
                  href="/youtube-thumbnail"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/youtube-thumbnail";
                  }}
                  className="block text-gray-600 hover:text-indigo-600 py-1"
                >
                  YouTube Thumbnail
                </Link>
                <Link
                  href="/image-compressor"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/image-compressor";
                  }}
                  className="block text-gray-600 hover:text-indigo-600 py-1"
                >
                  Image Compressor
                </Link>
                <Link
                  href="/image-to-text"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/image-to-text";
                  }}
                  className="block text-gray-600 hover:text-indigo-600 py-1"
                >
                  Image to Text
                </Link>
                <Link
                  href="/signature-maker"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/signature-maker";
                  }}
                  className="block text-gray-600 hover:text-indigo-600 py-1"
                >
                  Signature Maker
                </Link>
                <Link
                  href="/text-to-pdf"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/text-to-pdf";
                  }}
                  className="block text-gray-600 hover:text-indigo-600 py-1"
                >
                  Text to PDF
                </Link>
                <Link
                  href="/heic-to-jpg"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/heic-to-jpg";
                  }}
                  className="block text-gray-600 hover:text-indigo-600 py-1"
                >
                  HEIC to JPG
                </Link>
                <Link
                  href="/image-converter"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/image-converter";
                  }}
                  className="block text-gray-600 hover:text-indigo-600 py-1"
                >
                  Image Converter
                </Link>
              </div>
            </details> */}


            {/* Utility Tools (Mobile) - Left aligned with Icons */}
            <details className="group">
              <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
                Utility Tools <ChevronDown className="group-open:rotate-180 transition" />
              </summary>

              <div className="pl-6 mt-2 space-y-2 text-sm">

                <Link
                  href="/qr-generator"
                  onClick={(e) => { e.preventDefault(); window.location.href = "/qr-generator"; }}
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                >
                  <QrCode size={16} className="text-sky-600" />
                  QR Generator
                </Link>

                <Link
                  href="/password-gen"
                  onClick={(e) => { e.preventDefault(); window.location.href = "/password-gen"; }}
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                >
                  <Lock size={16} className="text-amber-600" />
                  Password Generator
                </Link>

                <Link
                  href="/unit-converter"
                  onClick={(e) => { e.preventDefault(); window.location.href = "/unit-converter"; }}
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                >
                  <Ruler size={16} className="text-lime-600" />
                  Unit Converter
                </Link>

                <Link
                  href="/youtube-thumbnail"
                  onClick={(e) => { e.preventDefault(); window.location.href = "/youtube-thumbnail"; }}
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                >
                  <Youtube size={16} className="text-red-600" />
                  YouTube Thumbnail
                </Link>

                <Link
                  href="/image-compressor"
                  onClick={(e) => { e.preventDefault(); window.location.href = "/image-compressor"; }}
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                >
                  <ImageIcon size={16} className="text-cyan-600" />
                  Image Compressor
                </Link>

                <Link
                  href="/image-to-text"
                  onClick={(e) => { e.preventDefault(); window.location.href = "/image-to-text"; }}
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                >
                  <ImageIcon size={16} className="text-indigo-600" />
                  Image to Text
                </Link>

                <Link
                  href="/signature-maker"
                  onClick={(e) => { e.preventDefault(); window.location.href = "/signature-maker"; }}
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                >
                  <PenTool size={16} className="text-emerald-600" />
                  Signature Maker
                </Link>

                <Link
                  href="/text-to-pdf"
                  onClick={(e) => { e.preventDefault(); window.location.href = "/text-to-pdf"; }}
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                >
                  <FileText size={16} className="text-purple-600" />
                  Text to PDF
                </Link>

                <Link
                  href="/heic-to-jpg"
                  onClick={(e) => { e.preventDefault(); window.location.href = "/heic-to-jpg"; }}
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                >
                  <FileImage size={16} className="text-orange-600" />
                  HEIC to JPG
                </Link>

                <Link
                  href="/image-converter"
                  onClick={(e) => { e.preventDefault(); window.location.href = "/image-converter"; }}
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                >
                  <ImageIcon size={16} className="text-blue-600" />
                  Image Converter
                </Link>

              </div>
            </details>

            <Link
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/blog";
              }}
              className="block font-semibold text-gray-800 py-2"
            >
              Blog
            </Link>
            <Link
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/about";
              }}
              className="block font-semibold text-gray-800 py-2"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/contact";
              }}
              className="block font-semibold text-gray-800 py-2"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

























// "use client";
// import Link from "next/link";
// import { useState } from "react";
// import { Image } from "lucide-react";  // ya Camera / FileImage jo pasand aaye
// import {
//   ChevronDown,
//   FileText,
//   FileType,
//   FileImage,
//   FileSpreadsheet,
//   Scissors,
//   FileMinus,
//   FilePlus,
//   QrCode,
//   Lock,
//   Ruler,
//   Youtube,
//   Image as ImageIcon,
//   PenTool,
//   RotateCw,
//   Stamp,
//   ShieldCheck,
// } from "lucide-react";

// export default function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   return (
//     <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="flex justify-between items-center h-18">

//           {/* Logo */}
//           <Link href="/" className="flex items-center py-3">
//             <img src="/pdflinx-logo.svg" alt="PDF Linx logo" className="h-11 w-auto" />
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden lg:flex items-center space-x-10">

//             <Link href="/" className="text-gray-700 hover:text-indigo-600 font-semibold transition">
//               Home
//           </Link>

//           <Link href="/merge-pdf" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Merge PDF</Link>

//         <Link href="/split-pdf" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Split PDF</Link>

//         <Link href="/compress-pdf" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Compress PDF</Link>




//       {/* === PDF TOOLS Dropdown (Compact) === */}
//       <div className="relative group">
//         <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition">
//           PDF Tools <ChevronDown size={16} className="group-hover:rotate-180 transition" />
//         </button>
//             <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[900px] bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">

//         {/* <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[520px] bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"> */}
//           {/* <div className="grid grid-cols-2 gap-6 p-5 bg-gradient-to-b from-gray-50 to-white"> */}
//           <div className="grid grid-cols-4 gap-3 p-3 bg-gradient-to-b from-gray-50 to-white">


//             {/* 🔹 ALL PDF TOOLS (HUB LINK) */}
//             <div className="col-span-4 mb-2">
//               <Link
//                 href="/free-pdf-tools"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   window.location.href = "/free-pdf-tools";
//                 }}
//                 className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg
//                           bg-indigo-50 text-indigo-700 font-semibold
//                           hover:bg-indigo-100 transition text-sm"
//               >
//                 🔹 All PDF Tools
//               </Link>
//             </div>

//             {/* Convert TO PDF */}
//             <div>
//               <h3 className="font-bold text-base text-gray-800 mb-3">Convert TO PDF</h3>
//               <div className="space-y-2">
//                 <Link
//                   href="/word-to-pdf"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/word-to-pdf"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FileType size={20} className="text-blue-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     WORD to PDF
//                   </span>
//                 </Link>

//                 <Link
//                   href="/excel-pdf"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/excel-pdf"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FileSpreadsheet size={20} className="text-green-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     EXCEL to PDF
//                   </span>
//                 </Link>

//                 <Link
//                   href="/ppt-to-pdf"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/ppt-to-pdf"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FileSpreadsheet size={20} className="text-green-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     POWERPOINT to PDF
//                   </span>
//                 </Link>

//                 <Link
//                   href="/image-to-pdf"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/image-to-pdf"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FileImage size={20} className="text-orange-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     JPG to PDF
//                   </span>
//                 </Link>
//               </div>
//             </div>

//             {/* Convert FROM PDF */}
//             <div>
//               <h3 className="font-bold text-base text-gray-800 mb-3">Convert FROM PDF</h3>
//               <div className="space-y-2">
//                 <Link
//                   href="/pdf-to-word"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/pdf-to-word"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FileText size={20} className="text-red-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     PDF to WORD
//                   </span>
//                 </Link>

//                 <Link
//                   href="/pdf-to-jpg"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/pdf-to-jpg"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <Image size={20} className="text-orange-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     PDF to JPG
//                   </span>
//                 </Link>

//                 {/* <Link
//                   href="/protect-pdf"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/protect-pdf"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FileMinus size={20} className="text-purple-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     Protect PDF
//                   </span>
//                 </Link>

//                 <Link
//                   href="/unlock-pdf"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/unlock-pdf"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FilePlus size={20} className="text-emerald-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     Unlock PDF
//                   </span>
//                 </Link> */}
//               </div>
//             </div>

            
//             {/* PDF Security */}
//             <div>
//               <h3 className="font-bold text-base text-gray-800 mb-3">PDF SECURITY</h3>
//               <div className="space-y-2">
//                 {/* <Link
//                   href="/pdf-to-word"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/pdf-to-word"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FileText size={20} className="text-red-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     PDF to WORD
//                   </span>
//                 </Link>

//                 <Link
//                   href="/pdf-to-jpg"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/pdf-to-jpg"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <Image size={20} className="text-orange-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     PDF to JPG
//                   </span>
//                 </Link> */}

//                 <Link
//                   href="/protect-pdf"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/protect-pdf"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FileMinus size={20} className="text-purple-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     Protect PDF
//                   </span>
//                 </Link>

//                 <Link
//                   href="/unlock-pdf"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/unlock-pdf"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FilePlus size={20} className="text-emerald-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     Unlock PDF
//                   </span>
//                 </Link>

//                   <Link
//                   href="/sign-pdf"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/sign-pdf"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FilePlus size={20} className="text-emerald-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     Sign PDF
//                   </span>
//                 </Link>


                  

//               </div>
//             </div>

            
//             {/* Edit PDF */}
//             <div>
//               <h3 className="font-bold text-base text-gray-800 mb-3">Edit PDF</h3>
//               <div className="space-y-2">

//                 <Link
//                   href="/rotate-pdf"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/rotate-pdf"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FileMinus size={20} className="text-purple-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     Rotate PDF
//                   </span>
//                 </Link>

//                 <Link
//                   href="/add-watermark"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/add-watermark"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FilePlus size={20} className="text-emerald-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     Add Watermark
//                   </span>
//                 </Link>

//                   {/* <Link
//                   href="/sign-pdf"
//                   onClick={(e) => { e.preventDefault(); window.location.href = "/sign-pdf"; }}
//                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
//                 >
//                   <FilePlus size={20} className="text-emerald-600" />
//                   <span className="font-medium text-gray-700 hover:text-indigo-600">
//                     Sign PDF
//                   </span>
//                 </Link> */}


                  

//               </div>
//             </div>



//           </div>
//         </div>
//       </div>

//             {/* === ALL TOOLS Dropdown (Compact) === */}
//             <div className="relative group">
//               <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition">
//                 Utility Tools <ChevronDown size={16} className="group-hover:rotate-180 transition" />
//               </button>

//               <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[480px] bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
//                 <div className="p-4">
//                   <h3 className="font-bold text-base text-gray-800 mb-4 text-center">
//                     All Utility Tools
//                   </h3>

//                   <div className="grid grid-cols-3 gap-3">
//                     {[
//                       { href: "/qr-generator", icon: QrCode, color: "text-sky-600", label: "QR Generator" },
//                       { href: "/password-gen", icon: Lock, color: "text-amber-600", label: "Password Gen" },
//                       { href: "/unit-converter", icon: Ruler, color: "text-lime-600", label: "Unit Converter" },
//                       { href: "/youtube-thumbnail", icon: Youtube, color: "text-red-600", label: "YT Thumbnail" },
//                       { href: "/image-compressor", icon: ImageIcon, color: "text-cyan-600", label: "Image Compress" },
//                       { href: "/image-to-text", icon: ImageIcon, color: "text-indigo-600", label: "Image to Text" },
//                       { href: "/signature-maker", icon: PenTool, color: "text-emerald-600", label: "Signature Maker" },
//                       { href: "/text-to-pdf", icon: FileText, color: "text-purple-600", label: "Text to PDF" },
//                       { href: "/heic-to-jpg", icon: FileImage, color: "text-orange-600", label: "HEIC to JPG" },
//                       { href: "/image-converter", icon: ImageIcon, color: "text-blue-600", label: "Image Converter" },
//                       // { href: "/add-watermark", icon: Stamp, color: "text-teal-600", label: "Add Watermark" },
//                     ].map((item) => (
//                       <button
//                         key={item.href}
//                         onClick={(e) => {
//                           e.preventDefault();
//                           window.location.href = item.href;
//                         }}
//                         className="flex flex-col items-center gap-2 w-full p-3 rounded-lg transition hover:bg-indigo-50 group"
//                       >
//                         <item.icon size={22} className={`${item.color}`} />
//                         <span className="text-xs font-medium text-gray-700 group-hover:text-indigo-600 text-center">
//                           {item.label}
//                         </span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <Link href="/blog" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Blog</Link>
//             <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-semibold transition">About</Link>
//             <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Contact</Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setMobileOpen(!mobileOpen)}
//             className="lg:hidden text-gray-700 hover:text-indigo-600 text-3xl"
//           >
//             {mobileOpen ? "×" : "☰"}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <div className="lg:hidden bg-white border-t border-gray-100">
//           <div className="px-6 py-6 space-y-4">
//             <Link href="/" 
//               onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
//               className="block font-semibold text-gray-800 py-2">Home</Link>

//             <details className="group">
//               <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
//                 PDF Tools <ChevronDown className="group-open:rotate-180 transition" />
//               </summary>

//               {/* 🔹 All PDF Tools (Mobile Hub Link) */}
//               <Link
//                 href="/free-pdf-tools"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   window.location.href = "/free-pdf-tools";
//                 }}
//                 className="block font-semibold text-indigo-600 py-2 border-b border-gray-100"
//               >
//                 🔹 All PDF Tools
//               </Link>

//               <div className="pl-6 mt-2 space-y-2">
//                 <Link href="/pdf-to-word" onClick={(e) => { e.preventDefault(); window.location.href = '/pdf-to-word'; }} className="block text-gray-600 hover:text-indigo-600 py-1">PDF to Word</Link>
//                 <Link href="/word-to-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/word-to-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Word to PDF</Link>
//                 <Link href="/image-to-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/image-to-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Image to PDF</Link>
//                 <Link href="/merge-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/merge-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Merge PDF</Link>
//                 <Link href="/split-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/split-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Split PDF</Link>
//                 <Link href="/compress-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/compress-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Compress PDF</Link>
//                 <Link href="/excel-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/excel-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Excel to PDF</Link>
//                 <Link href="/ppt-to-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/ppt-to-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">PowerPoint to PDF</Link>
//                 <Link href="/pdf-to-jpg" onClick={(e) => { e.preventDefault(); window.location.href = '/pdf-to-jpg'; }} className="block text-gray-600 hover:text-indigo-600 py-1">PDF to JPG</Link>
//                 <Link href="/protect-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/protect-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Protect PDF</Link>

//                 <Link href="/unlock-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/unlock-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Unlock PDF</Link>


//               </div>
//             </details>
//             <details className="group">
//               <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
//                 Utility Tools <ChevronDown className="group-open:rotate-180 transition" />
//               </summary>
//               <div className="pl-6 mt-2 space-y-2 text-sm">
//                 <Link href="/qr-generator" onClick={(e) => { e.preventDefault(); window.location.href = '/qr-generator'; }} className="block text-gray-600 hover:text-indigo-600 py-1">QR Generator</Link>
//                 <Link href="/password-gen" onClick={(e) => { e.preventDefault(); window.location.href = '/password-gen'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Password Generator</Link>
//                 <Link href="/unit-converter" onClick={(e) => { e.preventDefault(); window.location.href = '/unit-converter'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Unit Converter</Link>
//                 <Link href="/youtube-thumbnail" onClick={(e) => { e.preventDefault(); window.location.href = '/youtube-thumbnail'; }} className="block text-gray-600 hover:text-indigo-600 py-1">YouTube Thumbnail</Link>
//                 <Link href="/image-compressor" onClick={(e) => { e.preventDefault(); window.location.href = '/image-compressor'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Image Compressor</Link>
//                 <Link href="/image-to-text" onClick={(e) => { e.preventDefault(); window.location.href = '/image-to-text'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Image to Text</Link>
//                 <Link href="/signature-maker" onClick={(e) => { e.preventDefault(); window.location.href = '/signature-maker'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Signature Maker</Link>
//                 <Link href="/text-to-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/text-to-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Text to PDF</Link>
//                 <Link href="/heic-to-jpg" onClick={(e) => { e.preventDefault(); window.location.href = '/heic-to-jpg'; }} className="block text-gray-600 hover:text-indigo-600 py-1">HEIC to JPG</Link>
//                 <Link href="/image-converter" onClick={(e) => { e.preventDefault(); window.location.href = '/image-converter'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Image Converter</Link>
//                 {/* <Link href="/add-watermark" onClick={(e) => { e.preventDefault(); window.location.href = '/add-watermark'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Add Watermark</Link> */}
//               </div>
//             </details>
//             <Link href="/blog" onClick={(e) => { e.preventDefault(); window.location.href = '/blog'; }} className="block font-semibold text-gray-800 py-2">Blog</Link>
//             <Link href="/about" onClick={(e) => { e.preventDefault(); window.location.href = '/about'; }} className="block font-semibold text-gray-800 py-2">About</Link>
//             <Link href="/contact" onClick={(e) => { e.preventDefault(); window.location.href = '/contact'; }} className="block font-semibold text-gray-800 py-2">Contact</Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }























// // "use client";
// // import Link from "next/link";
// // import { useState } from "react";
// // import { Image } from "lucide-react";  // ya Camera / FileImage jo pasand aaye
// // import {
// //   ChevronDown,
// //   FileText,
// //   FileType,
// //   FileImage,
// //   FileSpreadsheet,
// //   Scissors,
// //   FileMinus,
// //   FilePlus,
// //   QrCode,
// //   Lock,
// //   Ruler,
// //   Youtube,
// //   Image as ImageIcon,
// //   PenTool,
// //   RotateCw,
// //   Stamp,
// //   ShieldCheck,
// // } from "lucide-react";

// // export default function Navbar() {
// //   const [mobileOpen, setMobileOpen] = useState(false);

// //   return (
// //     <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
// //       <div className="max-w-7xl mx-auto px-6">
// //         <div className="flex justify-between items-center h-18">

// //           {/* Logo */}
// //           <Link href="/" className="flex items-center py-3">
// //             <img src="/pdflinx-logo.svg" alt="PDF Linx logo" className="h-11 w-auto" />
// //           </Link>

// //           {/* Desktop Menu */}
// //           <div className="hidden lg:flex items-center space-x-10">

// //             <Link href="/" className="text-gray-700 hover:text-indigo-600 font-semibold transition">
// //               Home
// //           </Link>

// //           <Link href="/merge-pdf" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Merge PDF</Link>

// //         <Link href="/split-pdf" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Split PDF</Link>

// //         <Link href="/compress-pdf" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Compress PDF</Link>




// //       {/* === PDF TOOLS Dropdown (Compact) === */}
// //       <div className="relative group">
// //         <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition">
// //           PDF Tools <ChevronDown size={16} className="group-hover:rotate-180 transition" />
// //         </button>
// //             <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[900px] bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">

// //         {/* <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[520px] bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"> */}
// //           {/* <div className="grid grid-cols-2 gap-6 p-5 bg-gradient-to-b from-gray-50 to-white"> */}
// //           <div className="grid grid-cols-4 gap-3 p-3 bg-gradient-to-b from-gray-50 to-white">


// //             {/* 🔹 ALL PDF TOOLS (HUB LINK) */}
// //             <div className="col-span-4 mb-2">
// //               <Link
// //                 href="/free-pdf-tools"
// //                 onClick={(e) => {
// //                   e.preventDefault();
// //                   window.location.href = "/free-pdf-tools";
// //                 }}
// //                 className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg
// //                           bg-indigo-50 text-indigo-700 font-semibold
// //                           hover:bg-indigo-100 transition text-sm"
// //               >
// //                 🔹 All PDF Tools
// //               </Link>
// //             </div>

// //             {/* Convert TO PDF */}
// //             <div>
// //               <h3 className="font-bold text-base text-gray-800 mb-3">Convert TO PDF</h3>
// //               <div className="space-y-2">
// //                 <Link
// //                   href="/word-to-pdf"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/word-to-pdf"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FileType size={20} className="text-blue-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     WORD to PDF
// //                   </span>
// //                 </Link>

// //                 <Link
// //                   href="/excel-pdf"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/excel-pdf"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FileSpreadsheet size={20} className="text-green-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     EXCEL to PDF
// //                   </span>
// //                 </Link>

// //                 <Link
// //                   href="/ppt-to-pdf"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/ppt-to-pdf"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FileSpreadsheet size={20} className="text-green-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     POWERPOINT to PDF
// //                   </span>
// //                 </Link>

// //                 <Link
// //                   href="/image-to-pdf"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/image-to-pdf"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FileImage size={20} className="text-orange-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     JPG to PDF
// //                   </span>
// //                 </Link>
// //               </div>
// //             </div>

// //             {/* Convert FROM PDF */}
// //             <div>
// //               <h3 className="font-bold text-base text-gray-800 mb-3">Convert FROM PDF</h3>
// //               <div className="space-y-2">
// //                 <Link
// //                   href="/pdf-to-word"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/pdf-to-word"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FileText size={20} className="text-red-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     PDF to WORD
// //                   </span>
// //                 </Link>

// //                 <Link
// //                   href="/pdf-to-jpg"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/pdf-to-jpg"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <Image size={20} className="text-orange-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     PDF to JPG
// //                   </span>
// //                 </Link>

// //                 {/* <Link
// //                   href="/protect-pdf"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/protect-pdf"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FileMinus size={20} className="text-purple-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     Protect PDF
// //                   </span>
// //                 </Link>

// //                 <Link
// //                   href="/unlock-pdf"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/unlock-pdf"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FilePlus size={20} className="text-emerald-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     Unlock PDF
// //                   </span>
// //                 </Link> */}
// //               </div>
// //             </div>

            
// //             {/* PDF Security */}
// //             <div>
// //               <h3 className="font-bold text-base text-gray-800 mb-3">PDF SECURITY</h3>
// //               <div className="space-y-2">
// //                 {/* <Link
// //                   href="/pdf-to-word"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/pdf-to-word"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FileText size={20} className="text-red-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     PDF to WORD
// //                   </span>
// //                 </Link>

// //                 <Link
// //                   href="/pdf-to-jpg"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/pdf-to-jpg"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <Image size={20} className="text-orange-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     PDF to JPG
// //                   </span>
// //                 </Link> */}

// //                 <Link
// //                   href="/protect-pdf"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/protect-pdf"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FileMinus size={20} className="text-purple-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     Protect PDF
// //                   </span>
// //                 </Link>

// //                 <Link
// //                   href="/unlock-pdf"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/unlock-pdf"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FilePlus size={20} className="text-emerald-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     Unlock PDF
// //                   </span>
// //                 </Link>

// //                   <Link
// //                   href="/sign-pdf"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/sign-pdf"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FilePlus size={20} className="text-emerald-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     Sign PDF
// //                   </span>
// //                 </Link>


                  

// //               </div>
// //             </div>

            
// //             {/* Edit PDF */}
// //             <div>
// //               <h3 className="font-bold text-base text-gray-800 mb-3">Edit PDF</h3>
// //               <div className="space-y-2">

// //                 <Link
// //                   href="/rotate-pdf"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/rotate-pdf"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FileMinus size={20} className="text-purple-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     Rotate PDF
// //                   </span>
// //                 </Link>

// //                 <Link
// //                   href="/add-watermark"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/add-watermark"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FilePlus size={20} className="text-emerald-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     Add Watermark
// //                   </span>
// //                 </Link>

// //                   {/* <Link
// //                   href="/sign-pdf"
// //                   onClick={(e) => { e.preventDefault(); window.location.href = "/sign-pdf"; }}
// //                   className="flex items-center gap-3 hover:bg-indigo-50 px-3 py-2 rounded-lg transition text-sm"
// //                 >
// //                   <FilePlus size={20} className="text-emerald-600" />
// //                   <span className="font-medium text-gray-700 hover:text-indigo-600">
// //                     Sign PDF
// //                   </span>
// //                 </Link> */}


                  

// //               </div>
// //             </div>



// //           </div>
// //         </div>
// //       </div>

// //             {/* === ALL TOOLS Dropdown (Compact) === */}
// //             <div className="relative group">
// //               <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition">
// //                 Utility Tools <ChevronDown size={16} className="group-hover:rotate-180 transition" />
// //               </button>

// //               <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[480px] bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
// //                 <div className="p-4">
// //                   <h3 className="font-bold text-base text-gray-800 mb-4 text-center">
// //                     All Utility Tools
// //                   </h3>

// //                   <div className="grid grid-cols-3 gap-3">
// //                     {[
// //                       { href: "/qr-generator", icon: QrCode, color: "text-sky-600", label: "QR Generator" },
// //                       { href: "/password-gen", icon: Lock, color: "text-amber-600", label: "Password Gen" },
// //                       { href: "/unit-converter", icon: Ruler, color: "text-lime-600", label: "Unit Converter" },
// //                       { href: "/youtube-thumbnail", icon: Youtube, color: "text-red-600", label: "YT Thumbnail" },
// //                       { href: "/image-compressor", icon: ImageIcon, color: "text-cyan-600", label: "Image Compress" },
// //                       { href: "/image-to-text", icon: ImageIcon, color: "text-indigo-600", label: "Image to Text" },
// //                       { href: "/signature-maker", icon: PenTool, color: "text-emerald-600", label: "Signature Maker" },
// //                       { href: "/text-to-pdf", icon: FileText, color: "text-purple-600", label: "Text to PDF" },
// //                       { href: "/heic-to-jpg", icon: FileImage, color: "text-orange-600", label: "HEIC to JPG" },
// //                       { href: "/image-converter", icon: ImageIcon, color: "text-blue-600", label: "Image Converter" },
// //                       // { href: "/add-watermark", icon: Stamp, color: "text-teal-600", label: "Add Watermark" },
// //                     ].map((item) => (
// //                       <button
// //                         key={item.href}
// //                         onClick={(e) => {
// //                           e.preventDefault();
// //                           window.location.href = item.href;
// //                         }}
// //                         className="flex flex-col items-center gap-2 w-full p-3 rounded-lg transition hover:bg-indigo-50 group"
// //                       >
// //                         <item.icon size={22} className={`${item.color}`} />
// //                         <span className="text-xs font-medium text-gray-700 group-hover:text-indigo-600 text-center">
// //                           {item.label}
// //                         </span>
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             <Link href="/blog" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Blog</Link>
// //             <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-semibold transition">About</Link>
// //             <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Contact</Link>
// //           </div>

// //           {/* Mobile Menu Button */}
// //           <button
// //             onClick={() => setMobileOpen(!mobileOpen)}
// //             className="lg:hidden text-gray-700 hover:text-indigo-600 text-3xl"
// //           >
// //             {mobileOpen ? "×" : "☰"}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Mobile Menu */}
// //       {mobileOpen && (
// //         <div className="lg:hidden bg-white border-t border-gray-100">
// //           <div className="px-6 py-6 space-y-4">
// //             <Link href="/" 
// //               onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
// //               className="block font-semibold text-gray-800 py-2">Home</Link>

// //             <details className="group">
// //               <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
// //                 PDF Tools <ChevronDown className="group-open:rotate-180 transition" />
// //               </summary>

// //               {/* 🔹 All PDF Tools (Mobile Hub Link) */}
// //               <Link
// //                 href="/free-pdf-tools"
// //                 onClick={(e) => {
// //                   e.preventDefault();
// //                   window.location.href = "/free-pdf-tools";
// //                 }}
// //                 className="block font-semibold text-indigo-600 py-2 border-b border-gray-100"
// //               >
// //                 🔹 All PDF Tools
// //               </Link>

// //               <div className="pl-6 mt-2 space-y-2">
// //                 <Link href="/pdf-to-word" onClick={(e) => { e.preventDefault(); window.location.href = '/pdf-to-word'; }} className="block text-gray-600 hover:text-indigo-600 py-1">PDF to Word</Link>
// //                 <Link href="/word-to-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/word-to-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Word to PDF</Link>
// //                 <Link href="/image-to-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/image-to-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Image to PDF</Link>
// //                 <Link href="/merge-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/merge-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Merge PDF</Link>
// //                 <Link href="/split-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/split-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Split PDF</Link>
// //                 <Link href="/compress-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/compress-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Compress PDF</Link>
// //                 <Link href="/excel-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/excel-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Excel to PDF</Link>
// //                 <Link href="/ppt-to-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/ppt-to-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">PowerPoint to PDF</Link>
// //                 <Link href="/pdf-to-jpg" onClick={(e) => { e.preventDefault(); window.location.href = '/pdf-to-jpg'; }} className="block text-gray-600 hover:text-indigo-600 py-1">PDF to JPG</Link>
// //                 <Link href="/protect-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/protect-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Protect PDF</Link>

// //                 <Link href="/unlock-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/unlock-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Unlock PDF</Link>


// //               </div>
// //             </details>
// //             <details className="group">
// //               <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
// //                 Utility Tools <ChevronDown className="group-open:rotate-180 transition" />
// //               </summary>
// //               <div className="pl-6 mt-2 space-y-2 text-sm">
// //                 <Link href="/qr-generator" onClick={(e) => { e.preventDefault(); window.location.href = '/qr-generator'; }} className="block text-gray-600 hover:text-indigo-600 py-1">QR Generator</Link>
// //                 <Link href="/password-gen" onClick={(e) => { e.preventDefault(); window.location.href = '/password-gen'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Password Generator</Link>
// //                 <Link href="/unit-converter" onClick={(e) => { e.preventDefault(); window.location.href = '/unit-converter'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Unit Converter</Link>
// //                 <Link href="/youtube-thumbnail" onClick={(e) => { e.preventDefault(); window.location.href = '/youtube-thumbnail'; }} className="block text-gray-600 hover:text-indigo-600 py-1">YouTube Thumbnail</Link>
// //                 <Link href="/image-compressor" onClick={(e) => { e.preventDefault(); window.location.href = '/image-compressor'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Image Compressor</Link>
// //                 <Link href="/image-to-text" onClick={(e) => { e.preventDefault(); window.location.href = '/image-to-text'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Image to Text</Link>
// //                 <Link href="/signature-maker" onClick={(e) => { e.preventDefault(); window.location.href = '/signature-maker'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Signature Maker</Link>
// //                 <Link href="/text-to-pdf" onClick={(e) => { e.preventDefault(); window.location.href = '/text-to-pdf'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Text to PDF</Link>
// //                 <Link href="/heic-to-jpg" onClick={(e) => { e.preventDefault(); window.location.href = '/heic-to-jpg'; }} className="block text-gray-600 hover:text-indigo-600 py-1">HEIC to JPG</Link>
// //                 <Link href="/image-converter" onClick={(e) => { e.preventDefault(); window.location.href = '/image-converter'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Image Converter</Link>
// //                 {/* <Link href="/add-watermark" onClick={(e) => { e.preventDefault(); window.location.href = '/add-watermark'; }} className="block text-gray-600 hover:text-indigo-600 py-1">Add Watermark</Link> */}
// //               </div>
// //             </details>
// //             <Link href="/blog" onClick={(e) => { e.preventDefault(); window.location.href = '/blog'; }} className="block font-semibold text-gray-800 py-2">Blog</Link>
// //             <Link href="/about" onClick={(e) => { e.preventDefault(); window.location.href = '/about'; }} className="block font-semibold text-gray-800 py-2">About</Link>
// //             <Link href="/contact" onClick={(e) => { e.preventDefault(); window.location.href = '/contact'; }} className="block font-semibold text-gray-800 py-2">Contact</Link>
// //           </div>
// //         </div>
// //       )}
// //     </nav>
// //   );
// // }



