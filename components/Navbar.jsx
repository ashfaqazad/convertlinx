"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  ChevronDown,
  QrCode,
  Lock,
  Ruler,
  Youtube,
  Image as ImageIcon,
  PenTool,
  FileText,
  FileImage,
} from "lucide-react";

export default function Navbar() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // ✅ Route change hote hi mobile menu close
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ✅ Link click par bhi close (extra safety)
  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-18">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center py-3">
            <span className="text-xl font-extrabold" style={{ color: "#1a1a2e" }}>
              Convertly<span style={{ color: "#6366F1" }}>Hub</span>
            </span>
          </Link>

          {/* ── Desktop Menu ── */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-semibold transition">
              Home
            </Link>

            {/* Utility Tools Dropdown */}
            {/* <div className="relative group">
              <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition">
                Utility Tools
                <ChevronDown size={16} className="group-hover:rotate-180 transition" />
              </button>

              <div
                className="absolute top-14 left-1/2 -translate-x-1/2 w-[520px]
                bg-white rounded-2xl border border-gray-100 shadow-xl
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-300 overflow-hidden"
              >
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

                <div className="p-5 bg-gradient-to-b from-gray-50 to-white">
                  <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4 text-center">
                    All Utility Tools
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { href: "/qr-generator", icon: QrCode, color: "text-sky-600", label: "QR Generator" },
                      { href: "/password-gen", icon: Lock, color: "text-amber-600", label: "Password Generator" },
                      { href: "/unit-converter", icon: Ruler, color: "text-lime-600", label: "Unit Converter" },
                      { href: "/youtube-thumbnail", icon: Youtube, color: "text-red-600", label: "YouTube Thumbnail" },
                      { href: "/image-compressor", icon: ImageIcon, color: "text-cyan-600", label: "Image Compressor" },
                      { href: "/image-to-text", icon: ImageIcon, color: "text-indigo-600", label: "Image to Text" },
                      { href: "/signature-maker", icon: PenTool, color: "text-emerald-600", label: "Signature Maker" },
                      { href: "/text-to-pdf", icon: FileText, color: "text-purple-600", label: "Text to PDF" },
                      { href: "/heic-to-jpg", icon: FileImage, color: "text-orange-600", label: "HEIC to JPG" },
                      { href: "/image-converter", icon: ImageIcon, color: "text-blue-600", label: "Image Converter" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl
                          hover:bg-indigo-50 hover:translate-x-1 transition-all duration-200 group"
                      >
                        <item.icon size={20} className={item.color} />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div> */}


            {/* Utility Tools Dropdown (Desktop) */}
            <div
              className="relative"
              onMouseEnter={() => setIsToolsOpen(true)}
              onMouseLeave={() => setIsToolsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsToolsOpen((v) => !v)}
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition"
                aria-haspopup="menu"
                aria-expanded={isToolsOpen}
              >
                Utility Tools
                <ChevronDown
                  size={16}
                  className={`${isToolsOpen ? "rotate-180" : ""} transition`}
                />
              </button>

              <div
                className={`absolute top-14 left-1/2 -translate-x-1/2 w-[520px]
      bg-white rounded-2xl border border-gray-100 shadow-xl
      transition-all duration-200 overflow-hidden
      ${isToolsOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
              >
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

                <div className="p-5 bg-gradient-to-b from-gray-50 to-white">
                  <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4 text-center">
                    All Utility Tools
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { href: "/qr-generator", icon: QrCode, color: "text-sky-600", label: "QR Generator" },
                      { href: "/password-gen", icon: Lock, color: "text-amber-600", label: "Password Generator" },
                      { href: "/unit-converter", icon: Ruler, color: "text-lime-600", label: "Unit Converter" },
                      { href: "/youtube-thumbnail", icon: Youtube, color: "text-red-600", label: "YouTube Thumbnail" },
                      { href: "/image-compressor", icon: ImageIcon, color: "text-cyan-600", label: "Image Compressor" },
                      { href: "/image-to-text", icon: ImageIcon, color: "text-indigo-600", label: "Image to Text" },
                      { href: "/signature-maker", icon: PenTool, color: "text-emerald-600", label: "Signature Maker" },
                      { href: "/text-to-pdf", icon: FileText, color: "text-purple-600", label: "Text to PDF" },
                      { href: "/heic-to-jpg", icon: FileImage, color: "text-orange-600", label: "HEIC to JPG" },
                      { href: "/image-converter", icon: ImageIcon, color: "text-blue-600", label: "Image Converter" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsToolsOpen(false)}   // ✅ click par dropdown close
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl
              hover:bg-indigo-50 hover:translate-x-1 transition-all duration-200 group"
                      >
                        <item.icon size={20} className={item.color} />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>


            <Link href="/blog" className="text-gray-700 hover:text-indigo-600 font-semibold transition">
              Blog
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-semibold transition">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-semibold transition">
              Contact
            </Link>
          </div>

          {/* ── Mobile Button ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden text-gray-700 hover:text-indigo-600 text-3xl"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-6 py-6 space-y-4">
            <Link href="/" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">
              Home
            </Link>

            {/* Utility Tools Mobile */}
            <details className="group">
              <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
                Utility Tools
                <ChevronDown className="group-open:rotate-180 transition" />
              </summary>

              <div className="pl-4 mt-3 space-y-2 text-sm">
                {[
                  { href: "/qr-generator", icon: QrCode, label: "QR Generator" },
                  { href: "/password-gen", icon: Lock, label: "Password Generator" },
                  { href: "/unit-converter", icon: Ruler, label: "Unit Converter" },
                  { href: "/youtube-thumbnail", icon: Youtube, label: "YouTube Thumbnail" },
                  { href: "/image-compressor", icon: ImageIcon, label: "Image Compressor" },
                  { href: "/image-to-text", icon: ImageIcon, label: "Image to Text" },
                  { href: "/signature-maker", icon: PenTool, label: "Signature Maker" },
                  { href: "/text-to-pdf", icon: FileText, label: "Text to PDF" },
                  { href: "/heic-to-jpg", icon: FileImage, label: "HEIC to JPG" },
                  { href: "/image-converter", icon: ImageIcon, label: "Image Converter" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>

            <Link href="/blog" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">
              Blog
            </Link>
            <Link href="/about" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">
              About
            </Link>
            <Link href="/contact" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}