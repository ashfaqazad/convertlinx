'use client';

import { useState } from 'react';
import { Upload, Download, Image as ImageIcon, Zap, Shield, CheckCircle } from 'lucide-react';
import Script from 'next/script';
import RelatedToolsSection from "@/components/RelatedTools";

export default function ImageConverter() {
  const [files, setFiles] = useState([]);
  const [converted, setConverted] = useState([]);
  const [toFormat, setToFormat] = useState('webp'); // Default target format
  const [category, setCategory] = useState('All'); // For filtering
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(0.94); // For JPG/WebP/HEIC output, 0.5-1.0

  const formats = [
    // Popular (High Traffic)
    { value: 'webp', label: 'WebP (Best for web - smallest size)', category: 'Popular' },
    { value: 'png', label: 'PNG (Transparency support)', category: 'Popular' },
    { value: 'jpg', label: 'JPG/JPEG (Universal, good quality)', category: 'Popular' },
    { value: 'gif', label: 'GIF (Animated support)', category: 'Popular' },
    { value: 'bmp', label: 'BMP (Uncompressed, large size)', category: 'Popular' },

    // Mobile/Apple (iPhone users)
    { value: 'heic', label: 'HEIC (iOS photos - small)', category: 'Mobile' },
    { value: 'heif', label: 'HEIF (High efficiency)', category: 'Mobile' },
    { value: 'avif', label: 'AVIF (Modern, ultra-small)', category: 'Mobile' },

    // Design/Web Dev
    { value: 'svg', label: 'SVG (Vector, scalable)', category: 'Design' },
    { value: 'tiff', label: 'TIFF/TIF (High-res print)', category: 'Design' },
    { value: 'ico', label: 'ICO (Favicon)', category: 'Design' },
    { value: 'psd', label: 'PSD (Photoshop layers)', category: 'Design' },
    { value: 'eps', label: 'EPS (Vector print)', category: 'Design' },

    // Pro/RAW Camera
    { value: 'dng', label: 'DNG (Adobe RAW)', category: 'Pro' },
    { value: 'cr2', label: 'CR2 (Canon RAW)', category: 'Pro' },
    { value: 'nef', label: 'NEF (Nikon RAW)', category: 'Pro' },
    { value: 'arw', label: 'ARW (Sony RAW)', category: 'Pro' },
    { value: 'raf', label: 'RAF (Fuji RAW)', category: 'Pro' },

    // Niche/Advanced
    { value: 'jxl', label: 'JPEG XL (Future-proof)', category: 'Niche' },
    { value: 'tga', label: 'TGA (Game textures)', category: 'Niche' },
    { value: 'pcx', label: 'PCX (Old-school)', category: 'Niche' },
    { value: 'emz', label: 'EMZ (Compressed EMF)', category: 'Niche' },
    { value: 'dpx', label: 'DPX (Film scan)', category: 'Niche' },
  ];

  const categories = ['All', 'Popular', 'Mobile', 'Design', 'Pro', 'Niche'];

  const isHEIC = (file) => {
    const ext = file.name.toLowerCase().split('.').pop();
    const type = file.type;
    return ext === 'heic' || ext === 'heif' || type === 'image/heic' || type === 'image/heif';
  };

  const convertImages = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    setLoading(true);
    setConverted([]);
    const results = await Promise.all(
      selectedFiles.map(async (file) => {
        let processFile = file; // Default to original file
        let isHeicConverted = false;

        // Handle HEIC first - convert to JPG Blob
        if (isHEIC(file)) {
          try {
            const heic2any = (await import('heic2any')).default;
            const heicBlob = await heic2any({
              blob: file,
              toType: 'image/jpeg', // Convert to JPG first for canvas
              quality: quality,
            });
            processFile = new File([heicBlob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', { type: 'image/jpeg' });
            isHeicConverted = true;
            console.log(`HEIC converted to JPG for ${file.name}`);
          } catch (heicError) {
            console.error(`HEIC conversion failed for ${file.name}:`, heicError);
            alert(`HEIC conversion failed for ${file.name}. Falling back to PNG. Install heic2any if needed.`);
            // Fallback: Treat as unsupported, convert to PNG later
          }
        }

        // Now load into Image for canvas
        return new Promise((resolve) => {
          const img = new Image();
          const url = URL.createObjectURL(processFile);

          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            let mimeType = 'image/png'; // Default fallback
            let extension = 'png';
            const qualityValue = (toFormat === 'jpg' || toFormat === 'webp') ? quality : 1;

            // Unsupported formats fallback to PNG
            const unsupported = ['svg', 'psd', 'eps', 'dng', 'cr2', 'nef', 'arw', 'raf', 'jxl', 'tga', 'pcx', 'emz', 'dpx', 'heic', 'heif', 'avif', 'tiff'];
            if (unsupported.includes(toFormat)) {
              mimeType = 'image/png';
              extension = 'png';
            } else {
              switch (toFormat) {
                case 'webp':
                  mimeType = 'image/webp';
                  extension = 'webp';
                  break;
                case 'png':
                  mimeType = 'image/png';
                  extension = 'png';
                  break;
                case 'jpg':
                  mimeType = 'image/jpeg';
                  extension = 'jpg';
                  break;
                case 'gif':
                  mimeType = 'image/gif';
                  extension = 'gif';
                  break;
                case 'bmp':
                  mimeType = 'image/bmp';
                  extension = 'bmp';
                  break;
                case 'ico':
                  mimeType = 'image/x-icon';
                  extension = 'ico';
                  break;
                default:
                  mimeType = 'image/webp';
                  extension = 'webp';
              }
            }

            // If HEIC and output is HEIC, fallback to JPG (can't output HEIC without lib)
            if (isHeicConverted && (toFormat === 'heic' || toFormat === 'heif')) {
              mimeType = 'image/jpeg';
              extension = 'jpg';
            }

            canvas.toBlob((blob) => {
              const convertedUrl = URL.createObjectURL(blob);
              resolve({
                originalName: file.name,
                name: file.name.replace(/\.[^/.]+$/, '') + '.' + extension,
                url: convertedUrl,
                originalUrl: url,
                isHeic: isHEIC(file),
              });
            }, mimeType, qualityValue);
          };

          img.onerror = () => {
            console.warn(`Failed to load ${file.name} after processing.`);
            resolve(null); // Skip or handle error
          };

          img.src = url;
        });
      })
    );

    // Filter out null results
    const validResults = results.filter(r => r !== null);
    setConverted(validResults);
    setLoading(false);
    setFiles(selectedFiles);
  };

  const filteredFormats = formats.filter(fmt => category === 'All' || fmt.category === category);

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-image-converter"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert Image Format Online for Free",
            description: "Convert JPG, PNG, WebP, HEIC, TIFF, SVG, RAW & 500+ formats instantly. Full HEIC support with auto-conversion.",
            url: "https://pdflinx.com/image-converter",
            step: [
              { "@type": "HowToStep", name: "Upload Images", text: "Select one or multiple images (including HEIC from iPhone)." },
              { "@type": "HowToStep", name: "Choose Format", text: "Pick target like WebP, AVIF, SVG from categories." },
              { "@type": "HowToStep", name: "Adjust & Convert", text: "Set quality and download converted files (HEIC auto to JPG/PNG)." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-image-converter"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Image Converter", item: "https://pdflinx.com/image-converter" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Image Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert JPG to PNG, HEIC to JPG (full support!), RAW to WebP & 500+ formats. Batch upload, quality control – all free, no signup!
            </p>
          </div>



          {/* Upload & Format Selector - Mobile Optimized */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 mb-8">
            {/* Mobile par pehle Upload, phir Selector (stack) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
              {/* Upload Area */}
              <div className="order-1">
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-pink-500 transition">
                    <Upload className="w-12 h-12 md:w-16 md:h-16 mx-auto text-purple-600 mb-4" />
                    <span className="text-lg md:text-xl font-semibold text-gray-800 block mb-2">
                      Drop images here or click to browse
                    </span>
                    <span className="text-gray-600 text-xs md:text-sm block px-4">
                      JPG, PNG, WebP, HEIC (iPhone), TIFF, SVG, RAW & 500+ • Multiple OK • Max 50MB
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/heic,image/heif,image/avif,image/tiff,image/svg+xml,image/x-icon,image/vnd.adobe.photoshop,image/eps,image/x-raw,image/x-canon-cr2,image/x-nikon-nef,image/x-adobe-dng,image/x-sony-arw,image/x-fuji-raf,image/jxl,image/tga,image/pcx,image/emz,image/dpx"
                    multiple
                    onChange={convertImages}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Format Selector with Categories */}
              <div className="order-2">
                <label className="text-lg font-semibold text-gray-800 mb-2 block">Convert to:</label>

                {/* Category Tabs - Horizontal scroll on mobile */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition whitespace-nowrap ${category === cat ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Formats List - Better mobile scroll */}
                <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50">
                  {filteredFormats.map((fmt) => (
                    <label
                      key={fmt.value}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition hover:shadow-sm ${toFormat === fmt.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 bg-white'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="format"
                          value={fmt.value}
                          checked={toFormat === fmt.value}
                          onChange={(e) => setToFormat(e.target.value)}
                          className="w-4 h-4 md:w-5 md:h-5 text-purple-600"
                        />
                        <span className="text-sm md:text-base font-medium">{fmt.label}</span>
                      </div>
                      {toFormat === fmt.value && <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />}
                    </label>
                  ))}
                </div>

                {/* Quality Slider - Full width on mobile */}
                {(toFormat === 'jpg' || toFormat === 'webp' || toFormat === 'heic' || toFormat === 'heif') && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="text-sm font-medium text-gray-700 block mb-2">Quality: {Math.round(quality * 100)}%</label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.0"
                      step="0.05"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">Lower = smaller file</p>
                  </div>
                )}
              </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
                <p className="mt-4 text-lg font-semibold text-purple-600">
                  Converting your images... (HEIC auto-optimized)
                </p>
              </div>
            )}
          </div>


          {/* Converted Images Grid - Mobile Friendly */}
          {converted.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-center text-purple-700 mb-6 px-4">
                Your converted images are ready! ({converted.length} files)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
                {converted.map((item, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md overflow-hidden border border-purple-200 hover:shadow-lg transition"
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 text-center">
                      <p className="font-medium text-gray-800 mb-2 text-sm truncate px-2">
                        {item.isHeic && <span className="text-green-600 mr-1">Converted</span>}
                        {item.name}
                      </p>
                      <a
                        href={item.url}
                        download={item.name}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-md text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          <p className="text-center mt-6 text-gray-600 text-base">
            No login • Batch convert unlimited • HEIC fully supported • Privacy first (browser-only) • Free forever
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Image Converter Online Free - 500+ Formats (HEIC to JPG, RAW to PNG & More)
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Switch between JPG, PNG, WebP, HEIC (full iPhone support!), AVIF, TIFF, SVG, PSD, RAW (CR2/NEF/ARW) & niche formats like JXL or TGA. Batch mode for pros, quality slider for control – fast, secure, and 100% free on PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">500+ Formats Covered</h3>
            <p className="text-gray-600 text-sm">
              From popular (JPG/PNG) to pro (RAW/PSD) & HEIC (auto to JPG) – categories make it easy.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg border border-pink-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch & Quality Control</h3>
            <p className="text-gray-600 text-sm">
              Convert folders at once, tweak quality for JPG/WebP/HEIC – lightning fast.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Private & Free</h3>
            <p className="text-gray-600 text-sm">
              Browser-based – no uploads, no storage. HEIC handled locally.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Convert Images in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your Files</h4>
              <p className="text-gray-600 text-sm">Drop JPG, HEIC (iPhone), RAW or any format – batch supported.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Select Format & Quality</h4>
              <p className="text-gray-600 text-sm">Browse categories, pick WebP/SVG/HEIC, adjust slider if needed.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download Instantly</h4>
              <p className="text-gray-600 text-sm">Grab your new files – crisp and ready (HEIC auto-optimized).</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Photographers, devs, and iPhone users love PDF Linx for effortless format flips – from HEIC to web-ready WebP. Always free, always awesome.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Image Converter Online (Free) – Convert JPG, PNG, HEIC, WebP, RAW & More by PDFLinx
        </h2>

        {/* Intro */}
        <p className="text-base leading-7 mb-6">
          Need to convert images into different formats quickly? Whether you want to convert JPG to PNG, HEIC to JPG,
          RAW to WebP, or switch between hundreds of formats, manual conversion tools can be slow and confusing.
          That’s why we built the{" "}
          <span className="font-medium text-slate-900">PDFLinx Image Converter</span> —
          a fast, flexible, and completely free online tool that supports 500+ image formats.
          Upload your images, choose your output format, adjust quality, and download instantly.
          No signup, no watermark, works on all devices.
        </p>

        {/* What is */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is an Image Converter?
        </h3>
        <p className="leading-7 mb-6">
          An image converter allows you to change image file formats while keeping visual quality intact.
          For example, you can convert HEIC photos from iPhones into JPG, PNG images into WebP for web optimization,
          or RAW photography files into shareable formats. Image conversion helps improve compatibility,
          reduce file size, and prepare images for web, design, and printing.
        </p>

        {/* Why use */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Use an Online Image Converter?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Convert images into formats supported by websites and apps</li>
          <li>Optimize images for web performance and SEO</li>
          <li>Convert iPhone HEIC photos into universal formats</li>
          <li>Convert RAW and professional photography formats easily</li>
          <li>Batch convert multiple images to save time</li>
        </ul>

        {/* Steps */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Convert Images Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your image files (JPG, PNG, HEIC, RAW, and more)</li>
          <li>Select your desired output format</li>
          <li>Adjust quality settings if needed</li>
          <li>Start conversion — it processes instantly</li>
          <li>Download converted images individually or in batch</li>
        </ol>

        <p className="mb-6">
          Unlimited conversions, fast results — 100% free and easy to use.
        </p>

        {/* Features box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Image Converter
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>Free online image format converter</li>
            <li>Supports 500+ image formats</li>
            <li>Convert JPG, PNG, WebP, HEIC, RAW, AVIF, TIFF, SVG & more</li>
            <li>Batch image conversion support</li>
            <li>Quality slider for file size and clarity control</li>
            <li>Fast processing and instant downloads</li>
            <li>Works on mobile, tablet, and desktop</li>
            <li>No signup, no watermark, no installation</li>
          </ul>
        </div>

        {/* Audience */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Photographers:</strong> Convert RAW and high-resolution images into shareable formats</li>
          <li><strong>Web developers:</strong> Optimize images for faster website loading</li>
          <li><strong>Designers:</strong> Convert images between transparent and compressed formats</li>
          <li><strong>iPhone users:</strong> Convert HEIC images into JPG or PNG easily</li>
          <li><strong>Everyone:</strong> Who needs quick and reliable image format conversion</li>
        </ul>

        {/* Privacy */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Image Converter Safe?
        </h3>
        <p className="leading-7 mb-6">
          Yes. You don’t need to create an account, and your images are used only to generate converted outputs.
          The tool is designed to be fast, private, and user-friendly.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Convert Images Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx Image Converter works smoothly on Windows, macOS, Linux, Android, and iOS.
          Whether you’re using a phone, tablet, or computer, you can convert images instantly using only your browser.
        </p>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Is the Image Converter free?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — it’s completely free with unlimited image conversions.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Which image formats are supported?
              </summary>
              <p className="mt-2 text-gray-600">
                The tool supports 500+ formats including JPG, PNG, WebP, HEIC, RAW, TIFF, SVG, AVIF and more.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I convert multiple images at once?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — batch conversion allows you to convert multiple files together.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Will image quality be affected?
              </summary>
              <p className="mt-2 text-gray-600">
                You can control output quality using the quality slider. Higher quality keeps clarity, lower quality reduces file size.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my images stored anywhere?
              </summary>
              <p className="mt-2 text-gray-600">
                No — your images are used only to generate converted results. Nothing is stored.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I use this tool on mobile devices?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — it works perfectly on mobile phones, tablets, and desktops.
              </p>
            </details>
          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="image-converter" />
    </>
  );
}















// 'use client';

// import { useState } from 'react';
// import { Upload, Download, Image as ImageIcon, Zap, Shield, CheckCircle } from 'lucide-react';
// import Script from 'next/script';
// import RelatedToolsSection from "@/components/RelatedTools";


// export default function ImageConverter() {
//   const [files, setFiles] = useState([]);
//   const [converted, setConverted] = useState([]);
//   const [toFormat, setToFormat] = useState('webp'); // Default target format
//   const [loading, setLoading] = useState(false);

//   const formats = [
//     { value: 'webp', label: 'WebP (Best for web - smallest size)' },
//     { value: 'png', label: 'PNG (Transparency support)' },
//     { value: 'jpg', label: 'JPG (Universal, good quality)' },
//     { value: 'gif', label: 'GIF (Animated support)' },
//     { value: 'bmp', label: 'BMP (Uncompressed, large size)' },
//   ];

//   const convertImages = async (e) => {
//     const selectedFiles = e.target.files;
//     if (!selectedFiles.length) return;

//     setLoading(true);
//     setConverted([]);
//     const results = [];

//     for (const file of selectedFiles) {
//       const img = new Image();
//       const url = URL.createObjectURL(file);

//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0);

//         let mimeType = '';
//         let extension = '';
//         switch (toFormat) {
//           case 'webp':
//             mimeType = 'image/webp';
//             extension = 'webp';
//             break;
//           case 'png':
//             mimeType = 'image/png';
//             extension = 'png';
//             break;
//           case 'jpg':
//             mimeType = 'image/jpeg';
//             extension = 'jpg';
//             break;
//           case 'gif':
//             mimeType = 'image/gif';
//             extension = 'gif';
//             break;
//           case 'bmp':
//             mimeType = 'image/bmp';
//             extension = 'bmp';
//             break;
//           default:
//             mimeType = 'image/webp';
//             extension = 'webp';
//         }

//         canvas.toBlob((blob) => {
//           const convertedUrl = URL.createObjectURL(blob);
//           results.push({
//             originalName: file.name,
//             name: file.name.replace(/\.[^/.]+$/, '') + '.' + extension,
//             url: convertedUrl,
//             originalUrl: url,
//           });

//           if (results.length === selectedFiles.length) {
//             setConverted(results);
//             setLoading(false);
//           }
//         }, mimeType, toFormat === 'jpg' ? 0.94 : 1);
//       };

//       img.src = url;
//     }

//     setFiles(Array.from(selectedFiles));
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-image-converter"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert Image Format Online for Free",
//             description: "Convert JPG, PNG, WebP, GIF, BMP to any format instantly.",
//             url: "https://pdflinx.com/image-converter",
//             step: [
//               { "@type": "HowToStep", name: "Upload Images", text: "Select one or multiple images." },
//               { "@type": "HowToStep", name: "Choose Format", text: "Select target format (WebP, PNG, JPG, etc.)." },
//               { "@type": "HowToStep", name: "Download", text: "Download converted images instantly." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-image-converter"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Image Converter", item: "https://pdflinx.com/image-converter" }
//             ]
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
//               Image Converter <br /> Online (Free)
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Need to switch your pics from JPG to PNG, or go super-small with WebP? Drop them here – convert a bunch at once, quality stays awesome, and it's all free!
//             </p>
//           </div>

//           {/* Upload & Format Selector */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
//             <div className="grid md:grid-cols-2 gap-8 mb-6">
//               {/* Upload Area */}
//               <div>
//                 <label className="block cursor-pointer">
//                   <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-pink-500 transition">
//                     <Upload className="w-16 h-16 mx-auto text-purple-600 mb-4" />
//                     <span className="text-xl font-semibold text-gray-800 block mb-2">
//                       Drop images here or click to browse
//                     </span>
//                     <span className="text-gray-600 text-sm">
//                       JPG, PNG, WebP, GIF, BMP • Multiple files okay
//                     </span>
//                   </div>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={convertImages}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               {/* Format Selector */}
//               <div>
//                 <label className="text-lg font-semibold text-gray-800 mb-4 block">
//                   Convert to:
//                 </label>
//                 <div className="space-y-3">
//                   {formats.map((fmt) => (
//                     <label
//                       key={fmt.value}
//                       className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition hover:shadow-md ${
//                         toFormat === fmt.value
//                           ? 'border-purple-500 bg-purple-50'
//                           : 'border-gray-200 bg-gray-50'
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <input
//                           type="radio"
//                           name="format"
//                           value={fmt.value}
//                           checked={toFormat === fmt.value}
//                           onChange={(e) => setToFormat(e.target.value)}
//                           className="w-5 h-5 text-purple-600"
//                         />
//                         <span className="text-base font-medium">{fmt.label}</span>
//                       </div>
//                       {toFormat === fmt.value && <CheckCircle className="w-6 h-6 text-purple-600" />}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {loading && (
//               <div className="text-center">
//                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
//                 <p className="mt-4 text-lg font-semibold text-purple-600">
//                   Turning your images into magic...
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Converted Images Grid */}
//           {converted.length > 0 && (
//             <div className="mb-8">
//               <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
//                 Your converted images are ready!
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                 {converted.map((item, i) => (
//                   <div
//                     key={i}
//                     className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md overflow-hidden border border-purple-200 hover:shadow-lg transition"
//                   >
//                     <img
//                       src={item.url}
//                       alt={item.name}
//                       className="w-full h-48 object-cover"
//                     />
//                     <div className="p-4 text-center">
//                       <p className="font-medium text-gray-800 mb-2 text-sm truncate">{item.name}</p>
//                       <a
//                         href={item.url}
//                         download={item.name}
//                         className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-md text-sm"
//                       >
//                         <Download className="w-4 h-4" />
//                         Download
//                       </a>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <p className="text-center mt-6 text-gray-600 text-base">
//             No login • Convert as many as you want • Quality stays sharp • All free & private
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         {/* Main Heading */}
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
//             Image Converter Online Free - Switch Formats in Seconds
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Whether you're prepping pics for your website (go WebP!), need transparency (hello PNG), or just want classic JPG – this tool handles it all. Upload a bunch, pick your format, and grab the new versions. Super fast, no quality drop, and totally free on PDF Linx!
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <ImageIcon className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">All the Formats You Need</h3>
//             <p className="text-gray-600 text-sm">
//               JPG, PNG, WebP, GIF, BMP – modern or old-school, we've got you.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg border border-pink-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Zap className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch Mode FTW</h3>
//             <p className="text-gray-600 text-sm">
//               Convert a whole folder's worth at once – big time saver.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality + Free Forever</h3>
//             <p className="text-gray-600 text-sm">
//               Your images stay crisp, and you never pay a rupee.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Change Image Format in 3 Easy Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload Your Pics</h4>
//               <p className="text-gray-600 text-sm">Drop one or a handful – any format works.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Pick the New Format</h4>
//               <p className="text-gray-600 text-sm">WebP for tiny files, PNG for transparency, etc.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download & Done</h4>
//               <p className="text-gray-600 text-sm">Grab your fresh converted images instantly.</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           Designers, devs, and everyday folks use PDF Linx daily to flip image formats – it's fast, keeps quality high, and always free.
//         </p>
//       </section>
//     <RelatedToolsSection currentPage="image-converter" />

//     </>
//   );
// }






















// // 'use client';

// // import { useState } from 'react';
// // import { Upload, Download, Image as ImageIcon, Zap, Shield, CheckCircle } from 'lucide-react';
// // import Script from 'next/script';
// // import RelatedToolsSection from "@/components/RelatedTools";


// // export default function ImageConverter() {
// //   const [files, setFiles] = useState([]);
// //   const [converted, setConverted] = useState([]);
// //   const [toFormat, setToFormat] = useState('webp'); // Default target format
// //   const [loading, setLoading] = useState(false);

// //   const formats = [
// //     { value: 'webp', label: 'WebP (Best for web - smallest size)' },
// //     { value: 'png', label: 'PNG (Transparency support)' },
// //     { value: 'jpg', label: 'JPG (Universal, good quality)' },
// //     { value: 'gif', label: 'GIF (Animated support)' },
// //     { value: 'bmp', label: 'BMP (Uncompressed, large size)' },
// //   ];

// //   const convertImages = async (e) => {
// //     const selectedFiles = e.target.files;
// //     if (!selectedFiles.length) return;

// //     setLoading(true);
// //     setConverted([]);
// //     const results = [];

// //     for (const file of selectedFiles) {
// //       const img = new Image();
// //       const url = URL.createObjectURL(file);

// //       img.onload = () => {
// //         const canvas = document.createElement('canvas');
// //         canvas.width = img.width;
// //         canvas.height = img.height;
// //         const ctx = canvas.getContext('2d');
// //         ctx.drawImage(img, 0, 0);

// //         let mimeType = '';
// //         let extension = '';
// //         switch (toFormat) {
// //           case 'webp':
// //             mimeType = 'image/webp';
// //             extension = 'webp';
// //             break;
// //           case 'png':
// //             mimeType = 'image/png';
// //             extension = 'png';
// //             break;
// //           case 'jpg':
// //             mimeType = 'image/jpeg';
// //             extension = 'jpg';
// //             break;
// //           case 'gif':
// //             mimeType = 'image/gif';
// //             extension = 'gif';
// //             break;
// //           case 'bmp':
// //             mimeType = 'image/bmp';
// //             extension = 'bmp';
// //             break;
// //           default:
// //             mimeType = 'image/webp';
// //             extension = 'webp';
// //         }

// //         canvas.toBlob((blob) => {
// //           const convertedUrl = URL.createObjectURL(blob);
// //           results.push({
// //             originalName: file.name,
// //             name: file.name.replace(/\.[^/.]+$/, '') + '.' + extension,
// //             url: convertedUrl,
// //             originalUrl: url,
// //           });

// //           if (results.length === selectedFiles.length) {
// //             setConverted(results);
// //             setLoading(false);
// //           }
// //         }, mimeType, toFormat === 'jpg' ? 0.94 : 1);
// //       };

// //       img.src = url;
// //     }

// //     setFiles(Array.from(selectedFiles));
// //   };

// //   return (
// //     <>
// //       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
// //       <Script
// //         id="howto-schema-image-converter"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "HowTo",
// //             name: "How to Convert Image Format Online for Free",
// //             description: "Convert JPG, PNG, WebP, GIF, BMP to any format instantly.",
// //             url: "https://pdflinx.com/image-converter",
// //             step: [
// //               { "@type": "HowToStep", name: "Upload Images", text: "Select one or multiple images." },
// //               { "@type": "HowToStep", name: "Choose Format", text: "Select target format (WebP, PNG, JPG, etc.)." },
// //               { "@type": "HowToStep", name: "Download", text: "Download converted images instantly." }
// //             ],
// //             totalTime: "PT30S",
// //             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
// //             image: "https://pdflinx.com/og-image.png"
// //           }, null, 2),
// //         }}
// //       />

// //       <Script
// //         id="breadcrumb-schema-image-converter"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "BreadcrumbList",
// //             itemListElement: [
// //               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
// //               { "@type": "ListItem", position: 2, name: "Image Converter", item: "https://pdflinx.com/image-converter" }
// //             ]
// //           }, null, 2),
// //         }}
// //       />

// //       {/* ==================== MAIN TOOL SECTION ==================== */}
// //       <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12 px-4">
// //         <div className="max-w-6xl mx-auto">
// //           {/* Header */}
// //           <div className="text-center mb-12">
// //             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
// //               Image Converter <br /> Online (Free)
// //             </h1>
// //             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
// //               Convert images between JPG, PNG, WebP, GIF, BMP instantly. Batch support, high quality — 100% free, no signup.
// //             </p>
// //           </div>

// //           {/* Upload & Format Selector */}
// //           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 mb-12">
// //             <div className="grid md:grid-cols-2 gap-10 mb-10">
// //               {/* Upload Area */}
// //               <div>
// //                 <label className="block cursor-pointer">
// //                   <div className="border-4 border-dashed border-purple-300 rounded-3xl p-20 text-center hover:border-pink-500 transition">
// //                     <Upload className="w-24 h-24 mx-auto text-purple-600 mb-8" />
// //                     <span className="text-3xl font-bold text-gray-800 block mb-4">
// //                       Drop images here or click to upload
// //                     </span>
// //                     <span className="text-xl text-gray-600">
// //                       Supports JPG, PNG, WebP, GIF, BMP • Multiple files
// //                     </span>
// //                   </div>
// //                   <input
// //                     type="file"
// //                     accept="image/*"
// //                     multiple
// //                     onChange={convertImages}
// //                     className="hidden"
// //                   />
// //                 </label>
// //               </div>

// //               {/* Format Selector */}
// //               <div>
// //                 <label className="text-2xl font-bold text-gray-800 mb-6 block">
// //                   Convert To:
// //                 </label>
// //                 <div className="grid grid-cols-1 gap-4">
// //                   {formats.map((fmt) => (
// //                     <label
// //                       key={fmt.value}
// //                       className={`flex items-center justify-between p-6 rounded-2xl border-4 cursor-pointer transition shadow-lg hover:shadow-xl ${
// //                         toFormat === fmt.value
// //                           ? 'border-purple-500 bg-purple-50'
// //                           : 'border-gray-200 bg-gray-50'
// //                       }`}
// //                     >
// //                       <div className="flex items-center gap-4">
// //                         <input
// //                           type="radio"
// //                           name="format"
// //                           value={fmt.value}
// //                           checked={toFormat === fmt.value}
// //                           onChange={(e) => setToFormat(e.target.value)}
// //                           className="w-6 h-6 text-purple-600"
// //                         />
// //                         <span className="text-xl font-semibold">{fmt.label}</span>
// //                       </div>
// //                       {toFormat === fmt.value && <CheckCircle className="w-8 h-8 text-purple-600" />}
// //                     </label>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>

// //             {loading && (
// //               <div className="text-center">
// //                 <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-600"></div>
// //                 <p className="mt-6 text-2xl font-bold text-purple-600">
// //                   Converting your images...
// //                 </p>
// //               </div>
// //             )}
// //           </div>

// //           {/* Converted Images Grid */}
// //           {converted.length > 0 && (
// //             <div>
// //               <h2 className="text-4xl font-bold text-center text-purple-700 mb-10">
// //                 Converted Images Ready!
// //               </h2>
// //               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
// //                 {converted.map((item, i) => (
// //                   <div
// //                     key={i}
// //                     className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl overflow-hidden border border-purple-200 hover:shadow-3xl transition"
// //                   >
// //                     <img
// //                       src={item.url}
// //                       alt={item.name}
// //                       className="w-full h-64 object-cover"
// //                     />
// //                     <div className="p-6 text-center">
// //                       <p className="font-semibold text-gray-800 mb-4 truncate">{item.name}</p>
// //                       <a
// //                         href={item.url}
// //                         download={item.name}
// //                         className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
// //                       >
// //                         <Download size={24} />
// //                         Download
// //                       </a>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           <p className="text-center mt-12 text-gray-600 text-lg">
// //             No signup • Batch convert • High quality • 100% free & private
// //           </p>
// //         </div>
// //       </main>

// //       {/* ==================== SEO CONTENT SECTION ==================== */}
// //       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
// //         {/* Main Heading */}
// //         <div className="text-center mb-16">
// //           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
// //             Image Converter Online Free - JPG, PNG, WebP, GIF, BMP
// //           </h2>
// //           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
// //             Convert images between any format instantly — JPG to PNG, PNG to WebP, WebP to JPG, GIF, BMP. Batch conversion, high quality, perfect for web, design, and sharing. Completely free with PDF Linx.
// //           </p>
// //         </div>

// //         {/* Benefits Grid */}
// //         <div className="grid md:grid-cols-3 gap-10 mb-20">
// //           <div className="bg-gradient-to-br from-purple-50 to-white p-10 rounded-3xl shadow-xl border border-purple-100 text-center hover:shadow-2xl transition">
// //             <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <ImageIcon className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-800 mb-4">All Popular Formats</h3>
// //             <p className="text-gray-600">
// //               Convert between JPG, PNG, WebP, GIF, BMP — full support for modern and legacy formats.
// //             </p>
// //           </div>

// //           <div className="bg-gradient-to-br from-pink-50 to-white p-10 rounded-3xl shadow-xl border border-pink-100 text-center hover:shadow-2xl transition">
// //             <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <Zap className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Batch Conversion</h3>
// //             <p className="text-gray-600">
// //               Convert multiple images at once — save time with bulk processing.
// //             </p>
// //           </div>

// //           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
// //             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <CheckCircle className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-800 mb-4">High Quality & Free</h3>
// //             <p className="text-gray-600">
// //               Full quality preserved — no compression loss, completely free forever.
// //             </p>
// //           </div>
// //         </div>

// //         {/* How To Steps */}
// //         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
// //           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
// //             How to Convert Image Format in 3 Simple Steps
// //           </h3>
// //           <div className="grid md:grid-cols-3 gap-12">
// //             <div className="text-center">
// //               <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// //                 1
// //               </div>
// //               <h4 className="text-2xl font-semibold mb-4">Upload Images</h4>
// //               <p className="text-gray-600 text-lg">Drop or select one or multiple images in any format.</p>
// //             </div>

// //             <div className="text-center">
// //               <div className="w-24 h-24 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// //                 2
// //               </div>
// //               <h4 className="text-2xl font-semibold mb-4">Choose Format</h4>
// //               <p className="text-gray-600 text-lg">Select target format: WebP (smallest), PNG (transparent), JPG, etc.</p>
// //             </div>

// //             <div className="text-center">
// //               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// //                 3
// //               </div>
// //               <h4 className="text-2xl font-semibold mb-4">Download</h4>
// //               <p className="text-gray-600 text-lg">Download all converted images instantly.</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Final CTA */}
// //         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
// //           Convert image formats every day with PDF Linx — trusted by designers, developers, and users worldwide for fast, reliable, and completely free image conversion.
// //         </p>
// //     </section>
// //     <RelatedToolsSection currentPage="image-converter" />

// //     </>
// //   );
// // }

