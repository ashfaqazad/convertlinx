"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'linear-gradient(to top, #1a1a2e, #1e1b4b, #1a1a2e)' }} className="text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">

          {/* ── Brand & Intro ── */}
          <div>
            <h3 className="text-xl font-extrabold text-white mb-3">
              Convert<span style={{ color: '#818CF8' }}>Linx</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Free online tools for images, PDFs & files — no signup, no ads, no watermarks.
              <br />Just simple stuff that works.
            </p>
          </div>

          {/* ── Tools Col 1 ── */}
          <div>
            <h4 className="text-base font-semibold text-white mb-3">Converters</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/image-to-text" className="hover:text-indigo-400 transition">Image to Text (OCR)</Link></li>
              <li><Link href="/image-compressor" className="hover:text-indigo-400 transition">Image Compressor</Link></li>
              <li><Link href="/image-converter" className="hover:text-indigo-400 transition">Image Converter</Link></li>
              <li><Link href="/heic-to-jpg" className="hover:text-indigo-400 transition">HEIC to JPG</Link></li>
              <li><Link href="/text-to-pdf" className="hover:text-indigo-400 transition">Text to PDF</Link></li>
              <li><Link href="/unit-converter" className="hover:text-indigo-400 transition">Unit Converter</Link></li>

            </ul>
          </div>

          {/* ── Tools Col 2 ── */}
          <div>
            <h4 className="text-base font-semibold text-white mb-3">Free Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/qr-generator" className="hover:text-indigo-400 transition">QR Code Generator</Link></li>
              <li><Link href="/password-gen" className="hover:text-indigo-400 transition">Password Generator</Link></li>
              <li><Link href="/youtube-thumbnail" className="hover:text-indigo-400 transition">YouTube Thumbnail</Link></li>
              <li><Link href="/signature-maker" className="hover:text-indigo-400 transition">Signature Maker</Link></li>
              <li><Link href="/image-resizer" className="hover:text-indigo-400 transition">Image Resizer</Link></li>
              <li><Link href="/image-cropper" className="hover:text-indigo-400 transition">Image Cropper</Link></li>

            </ul>
          </div>

          {/* ── Text & Dev Tools ── */}
          <div>
            <h4 className="text-base font-semibold text-white mb-3">Text & Dev</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/word-counter" className="hover:text-indigo-400 transition">Word Counter</Link></li>
              <li><Link href="/case-converter" className="hover:text-indigo-400 transition">Case Converter</Link></li>
              <li><Link href="/lorem-ipsum" className="hover:text-indigo-400 transition">Lorem Ipsum Generator</Link></li>
              <li><Link href="/json-formatter" className="hover:text-indigo-400 transition">JSON Formatter</Link></li>
              <li><Link href="/base64-tool" className="hover:text-indigo-400 transition">Base64 Tool</Link></li>
              <li><Link href="/color-picker" className="hover:text-indigo-400 transition">Color Picker</Link></li>
            </ul>
          </div>

          {/* ── Connect ── */}
          <div>
            <h4 className="text-base font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm mb-5">
              <li><Link href="/about" className="hover:text-indigo-400 transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-indigo-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-indigo-400 transition">Terms of Service</Link></li>
            </ul>
            <Link
              href="/contact"
              className="inline-block text-white font-semibold px-5 py-2 rounded-lg text-sm transition"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}
            >
              Get in Touch →
            </Link>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t pt-6 text-center" style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
          <p className="text-gray-500 text-sm">
            © {year} ConvertLinx • All Rights Reserved • Made with ❤️ for people who hate slow, bloated tools
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Free tools • No data stored • No tracking • Processed in your browser
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
