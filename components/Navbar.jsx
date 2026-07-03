"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
  Crop,
  Maximize2,
  AlignLeft,
  CaseSensitive,
  Braces,
  Binary,
  Pipette,
  FileOutput,
  FileInput,
  FileDown,
  Layers,
  RotateCw,
  Droplets,
  Tag,
  Volume2,
  Link2,
  Shield,
  Globe,
  Code2,
  MessageCircle,
  Palette,
} from "lucide-react";
// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const textTools = [
  {
    group: "Writing Tools",
    tools: [
      { href: "/word-counter",       icon: AlignLeft,     color: "#6366F1", label: "Word Counter"       },
      { href: "/case-converter",     icon: CaseSensitive, color: "#8B5CF6", label: "Case Converter"     },
      { href: "/lorem-ipsum",        icon: FileText,      color: "#A855F7", label: "Lorem Ipsum"        },
      { href: "/text-to-slug",       icon: Link2,         color: "#0EA5E9", label: "Text to Slug"       },
      { href: "/metatag-generator",  icon: Tag,           color: "#10B981", label: "Meta Tag Generator" },
    ],
  },

  // {
  //   group: "Developer Tools",
  //   tools: [
  //     { href: "/json-formatter", icon: Braces, color: "#10B981", label: "JSON Formatter" },
  //     { href: "/base64-tool",    icon: Binary, color: "#14B8A6", label: "Base64 Tool"    },
  //   ],
  // },


  {
  group: "Developer Tools",
  tools: [
    { href: "/json-formatter",         icon: Braces,         color: "#10B981", label: "JSON Formatter" },
    { href: "/base64-tool",            icon: Binary,         color: "#14B8A6", label: "Base64 Tool" },
    { href: "/regex-tester",           icon: Code2,          color: "#8B5CF6", label: "Regex Tester" },
    { href: "/favicon-generator",      icon: Palette,        color: "#F59E0B", label: "Favicon Generator" },
    { href: "/og-preview-checker",     icon: Globe,          color: "#3B82F6", label: "OG Preview Checker" },
    { href: "/whatsapp-link-generator", icon: MessageCircle, color: "#22C55E", label: "WhatsApp Link Generator" },
  ],
},

  {
    group: "Other Utilities",
    tools: [
      { href: "/color-picker",      icon: Pipette,  color: "#EC4899", label: "Color Picker"       },
      { href: "/qr-generator",      icon: QrCode,   color: "#0EA5E9", label: "QR Generator"       },
      { href: "/password-gen",      icon: Lock,     color: "#F59E0B", label: "Password Generator" },
      { href: "/unit-converter",    icon: Ruler,    color: "#84CC16", label: "Unit Converter"     },
      { href: "/youtube-thumbnail", icon: Youtube,  color: "#EF4444", label: "YouTube Thumbnail"  },
      { href: "/signature-maker",   icon: PenTool,  color: "#F97316", label: "Signature Maker"    },
      { href: "/text-to-pdf",       icon: FileText, color: "#D946EF", label: "Text to PDF"        },
      { href: "/text-to-speech",    icon: Volume2,  color: "#6366F1", label: "Text to Speech"     },
    ],
  },
];

const imageTools = [
  { href: "/image-compressor",   icon: Layers,    color: "#06B6D4", label: "Image Compressor"    },
  { href: "/image-resizer",      icon: Maximize2, color: "#8B5CF6", label: "Image Resizer"       },
  { href: "/image-cropper",      icon: Crop,      color: "#D946EF", label: "Image Cropper"       },
  { href: "/image-converter",    icon: ImageIcon, color: "#3B82F6", label: "Image Converter"     },
  { href: "/heic-to-jpg",        icon: FileImage, color: "#F97316", label: "HEIC to JPG"         },
  { href: "/image-to-text",      icon: ImageIcon, color: "#6366F1", label: "Image to Text"       },
  { href: "/rotate-flip-image",  icon: RotateCw,  color: "#0D9488", label: "Rotate & Flip Image" },
  { href: "/add-watermark",      icon: Shield,    color: "#059669", label: "Add Watermark"       },
];

const pdfTools = [
  { href: "https://pdflinx.com/image-to-pdf",   icon: FileOutput, color: "#EF4444", label: "JPG to PDF"   },
  { href: "https://pdflinx.com/pdf-to-jpg",     icon: FileInput,  color: "#F97316", label: "PDF to JPG"   },
  { href: "https://pdflinx.com/compress-pdf",   icon: FileDown,   color: "#EC4899", label: "Compress PDF" },
];

// ─────────────────────────────────────────
// TOOL LINK — Desktop
// ─────────────────────────────────────────

function ToolLink({ href, icon: Icon, color, label, external, onClose }) {
  const cls =
    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-150 group cursor-pointer";

  const inner = (
    <>
      <span
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={16} style={{ color }} />
      </span>
      <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-900 leading-tight">
        {label}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClose} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClose} className={cls}>
      {inner}
    </Link>
  );
}

// ─────────────────────────────────────────
// SECTION LABEL
// ─────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1 mb-2 mt-5 first:mt-0">
      {children}
    </p>
  );
}

// ─────────────────────────────────────────
// DESKTOP DROPDOWN WRAPPER
// ─────────────────────────────────────────

function DesktopDropdown({ label, accentFrom, accentTo, open, onOpen, onClose, onClick, width, children }) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 text-[14px] text-gray-700 hover:text-indigo-600 font-semibold transition-colors duration-150"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2
          bg-white rounded-2xl shadow-2xl border border-gray-100
          transition-all duration-200 origin-top
          ${open ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95"}`}
        style={{ width }}
      >
        {/* Accent bar */}
        <div
          className="h-[3px] rounded-t-2xl"
          style={{ background: `linear-gradient(to right, ${accentFrom}, ${accentTo})` }}
        />
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// MOBILE GROUP
// ─────────────────────────────────────────

function MobileGroup({ title, accentColor, children }) {
  return (
    <details className="group rounded-xl overflow-hidden">
      <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2.5 px-3 rounded-xl hover:bg-gray-50 list-none select-none">
        <span className="flex items-center gap-2.5">
          <span className="w-1.5 h-4 rounded-full" style={{ background: accentColor }} />
          <span className="text-[14px]">{title}</span>
        </span>
        <ChevronDown size={14} className="text-gray-400 group-open:rotate-180 transition-transform duration-200" />
      </summary>
      <div className="pt-1 pb-2 pl-2">{children}</div>
    </details>
  );
}

// ─────────────────────────────────────────
// MOBILE TOOL LINK
// ─────────────────────────────────────────

function MobileToolLink({ href, icon: Icon, color, label, external, onClose }) {
  const cls =
    "flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-150 group";

  const inner = (
    <>
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={14} style={{ color }} />
      </span>
      <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClose} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClose} className={cls}>
      {inner}
    </Link>
  );
}

// ─────────────────────────────────────────
// MAIN NAVBAR
// ─────────────────────────────────────────

export default function Navbar() {
  const [open, setOpen]             = useState(null); // "text" | "image" | "pdf" | null
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const navRef   = useRef(null);

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (key) => setOpen((prev) => (prev === key ? null : key));

  return (
    <nav ref={navRef} className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-extrabold tracking-tight" style={{ color: "#1a1a2e" }}>
              Convert<span style={{ color: "#6366F1" }}>Linx</span>
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div className="hidden lg:flex items-center gap-8">

            <Link href="/" className="text-[14px] text-gray-700 hover:text-indigo-600 font-semibold transition-colors duration-150">
              Home
            </Link>

            {/* TEXT TOOLS — width 580 to fit 3-col grid + bigger Writing Tools group */}
            <DesktopDropdown
              label="Text Tools"
              accentFrom="#6366F1" accentTo="#A855F7"
              open={open === "text"}
              onOpen={() => setOpen("text")}
              onClose={() => setOpen(null)}
              onClick={() => toggle("text")}
              width={580}
            >
              <div className="p-5">
                {textTools.map((section) => (
                  <div key={section.group}>
                    <SectionLabel>{section.group}</SectionLabel>
                    <div className="grid grid-cols-3 gap-0.5">
                      {section.tools.map((t) => (
                        <ToolLink key={t.href} {...t} onClose={() => setOpen(null)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </DesktopDropdown>

            {/* IMAGE TOOLS — width 380 to fit 2-col grid with 8 tools */}
            <DesktopDropdown
              label="Image Tools"
              accentFrom="#06B6D4" accentTo="#6366F1"
              open={open === "image"}
              onOpen={() => setOpen("image")}
              onClose={() => setOpen(null)}
              onClick={() => toggle("image")}
              width={380}
            >
              <div className="p-5">
                <div className="grid grid-cols-2 gap-0.5">
                  {imageTools.map((t) => (
                    <ToolLink key={t.href} {...t} onClose={() => setOpen(null)} />
                  ))}
                </div>
              </div>
            </DesktopDropdown>

            {/* PDF TOOLS */}
            <DesktopDropdown
              label="PDF Tools"
              accentFrom="#EF4444" accentTo="#F97316"
              open={open === "pdf"}
              onOpen={() => setOpen("pdf")}
              onClose={() => setOpen(null)}
              onClick={() => toggle("pdf")}
              width={260}
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                    pdflinx.com
                  </span>
                  <span className="text-[10px] text-gray-400">Opens in new tab</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {pdfTools.map((t) => (
                    <ToolLink key={t.href} {...t} external onClose={() => setOpen(null)} />
                  ))}
                </div>
              </div>
            </DesktopDropdown>

            <Link href="/blog" className="text-[14px] text-gray-700 hover:text-indigo-600 font-semibold transition-colors duration-150">
              Blog
            </Link>
            <Link href="/about" className="text-[14px] text-gray-700 hover:text-indigo-600 font-semibold transition-colors duration-150">
              About
            </Link>
            <Link href="/contact" className="text-[14px] text-gray-700 hover:text-indigo-600 font-semibold transition-colors duration-150">
              Contact
            </Link>

          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <span className="text-2xl leading-none select-none">×</span>
              : <span className="text-xl leading-none select-none">☰</span>}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">

            <Link href="/" onClick={() => setMobileOpen(false)}
              className="block text-[14px] font-semibold text-gray-800 py-2.5 px-3 rounded-xl hover:bg-gray-50">
              Home
            </Link>

            {/* Text Tools Mobile */}
            <MobileGroup title="Text Tools" accentColor="#6366F1">
              {textTools.map((section) => (
                <div key={section.group} className="mb-2 mt-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-1">
                    {section.group}
                  </p>
                  {section.tools.map((t) => (
                    <MobileToolLink key={t.href} {...t} onClose={() => setMobileOpen(false)} />
                  ))}
                </div>
              ))}
            </MobileGroup>

            {/* Image Tools Mobile */}
            <MobileGroup title="Image Tools" accentColor="#06B6D4">
              {imageTools.map((t) => (
                <MobileToolLink key={t.href} {...t} onClose={() => setMobileOpen(false)} />
              ))}
            </MobileGroup>

            {/* PDF Tools Mobile */}
            <MobileGroup title="PDF Tools" accentColor="#EF4444">
              <div className="flex items-center gap-2 px-3 mb-2 mt-1">
                <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                  pdflinx.com
                </span>
                <span className="text-[10px] text-gray-400">Opens in new tab</span>
              </div>
              {pdfTools.map((t) => (
                <MobileToolLink key={t.href} {...t} external onClose={() => setMobileOpen(false)} />
              ))}
            </MobileGroup>

            <Link href="/blog" onClick={() => setMobileOpen(false)}
              className="block text-[14px] font-semibold text-gray-800 py-2.5 px-3 rounded-xl hover:bg-gray-50">
              Blog
            </Link>
            <Link href="/about" onClick={() => setMobileOpen(false)}
              className="block text-[14px] font-semibold text-gray-800 py-2.5 px-3 rounded-xl hover:bg-gray-50">
              About
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}
              className="block text-[14px] font-semibold text-gray-800 py-2.5 px-3 rounded-xl hover:bg-gray-50">
              Contact
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}




