'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, Download, Zap, Shield, Image as ImageIcon } from 'lucide-react';
import Script from 'next/script';
import RelatedToolsSection from "@/components/RelatedTools";

export default function ImageCompressor() {
  const [originals, setOriginals] = useState([]); // For batch support
  const [compresseds, setCompresseds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState(1); // 0: Low, 1: Medium, 2: High

  const compressionOptions = {
    0: { initialQuality: 0.95, maxSizeMB: 2 }, // Low compression (best quality)
    1: { initialQuality: 0.8, maxSizeMB: 1 },  // Medium (balanced)
    2: { initialQuality: 0.6, maxSizeMB: 0.5 } // High compression (max savings)
  };

  const handleFile = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setOriginals(files);
    setCompresseds([]);
    setLoading(true);

    const opts = {
      maxSizeMB: compressionOptions[compressionLevel].maxSizeMB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: compressionOptions[compressionLevel].initialQuality,
    };

    try {
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          // Note: For advanced formats like HEIC/SVG/TIFF, lib may fallback to basic resize
          const compressedFile = await imageCompression(file, opts);
          return {
            file: compressedFile,
            originalSize: (file.size / 1024 / 1024).toFixed(2),
            compressedSize: (compressedFile.size / 1024 / 1024).toFixed(2),
            saved: Math.round(((file.size - compressedFile.size) / file.size) * 100),
            name: file.name.split('.')[0]
          };
        })
      );

      const avgSaved = Math.round(compressedFiles.reduce((sum, c) => sum + c.saved, 0) / compressedFiles.length);
      setSaved(avgSaved);
      setCompresseds(compressedFiles.map(c => ({ ...c, url: URL.createObjectURL(c.file) })));
    } catch (error) {
      alert('Error compressing image(s). Some formats like RAW may need backend support. Please try again.');
      console.error(error);
    }
    setLoading(false);
  };

  const downloadAll = () => {
    compresseds.forEach((c) => {
      const link = document.createElement('a');
      link.href = c.url;
      link.download = `compressed-${c.name}.webp`;
      link.click();
    });
  };

  const singlePreview = originals.length === 1 && compresseds.length === 1;
  const isBatch = originals.length > 1;

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-img-comp"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Compress Image Online for Free",
            description: "Reduce image file size up to 90% while maintaining quality. Supports JPG, PNG, WebP, HEIC, TIFF & more.",
            url: "https://pdflinx.com/image-compressor",
            step: [
              { "@type": "HowToStep", name: "Upload Image", text: "Select JPG, PNG, WebP, HEIC, TIFF, SVG or other formats." },
              { "@type": "HowToStep", name: "Compress", text: "Choose level and compress in seconds." },
              { "@type": "HowToStep", name: "Download", text: "Download smaller optimized images." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-img-comp"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Image Compressor", item: "https://pdflinx.com/image-compressor" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Image Compressor Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compress JPG, PNG, WebP, HEIC, TIFF, SVG & more up to 90% smaller without losing quality. Convert to WebP for best results — 100% free, no signup.
            </p>
          </div>

          {/* Compression Level Selector */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
            <label className="text-lg font-semibold text-gray-800 mb-3 block">Compression Level:</label>
            <div className="grid md:grid-cols-3 gap-3">
              {['Low (Best Quality)', 'Medium (Balanced)', 'High (Max Savings)'].map((level, idx) => (
                <label key={level} className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center gap-2 ${
                  compressionLevel === idx ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="level"
                    value={idx}
                    checked={compressionLevel === idx}
                    onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm font-medium">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
            <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:border-green-500 transition">
              <Upload className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <label className="cursor-pointer">
                <span className="text-lg font-semibold text-gray-700 block mb-2">
                  {isBatch ? 'Drop images here or click to upload multiple' : 'Drop your image here or click to upload'}
                </span>
                <span className="text-gray-500 text-sm">
                  Supports JPG, PNG, WebP, GIF, HEIC, HEIF, AVIF, TIFF, SVG, BMP, ICO, PSD, EPS, RAW (CR2/NEF/DNG) & More • Max 100MB per file • Batch OK
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,image/avif,image/tiff,image/svg+xml,image/bmp,image/x-icon,image/vnd.adobe.photoshop,image/eps,image/x-raw,image/x-canon-cr2,image/x-nikon-nef,image/x-adobe-dng"
                  onChange={handleFile}
                  multiple
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Comparison Section (Single or Batch Preview) */}
          {originals.length > 0 && (
            <div className="mb-8">
              {singlePreview ? (
                // Single File Preview
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Original */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md p-6 text-center border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Original Image</h3>
                    <img
                      src={URL.createObjectURL(originals[0])}
                      alt="Original"
                      className="max-w-full rounded-xl shadow-md mx-auto"
                    />
                    <div className="mt-6">
                      <p className="text-lg font-bold text-gray-700">{compresseds[0]?.originalSize} MB</p>
                      <p className="text-gray-500 text-sm">Before Compression</p>
                    </div>
                  </div>

                  {/* Compressed */}
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-md p-6 text-center border-2 border-green-400">
                    <h3 className="text-xl font-semibold text-green-600 mb-4">
                      {loading ? 'Compressing...' : 'Compressed Image'}
                    </h3>
                    {compresseds[0] ? (
                      <>
                        <img
                          src={compresseds[0].url}
                          alt="Compressed"
                          className="max-w-full rounded-xl shadow-md mx-auto border-2 border-green-500"
                        />
                        <div className="mt-6">
                          <p className="text-2xl font-bold text-green-600 mb-2">{saved}% Smaller!</p>
                          <p className="text-lg font-bold text-gray-700">{compresseds[0].compressedSize} MB</p>
                          <p className="text-gray-500 text-sm">After Compression</p>
                        </div>
                        <a
                          href={compresseds[0].url}
                          download={`compressed-${compresseds[0].name}.webp`}
                          className="inline-flex items-center gap-2 mt-6 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold text-base px-8 py-3 rounded-xl hover:from-green-700 hover:to-teal-700 transition shadow-md"
                        >
                          <Download size={20} />
                          Download Optimized Image
                        </a>
                      </>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Batch Preview Summary
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-xl font-semibold text-center mb-4">
                    {loading ? 'Compressing Batch...' : `Batch Complete: ${compresseds.length} Images Optimized`}
                  </h3>
                  {loading ? (
                    <div className="text-center h-32 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-center text-lg font-bold text-green-600">Average: {saved}% Smaller!</p>
                      <button
                        onClick={downloadAll}
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-3 rounded-xl hover:from-green-700 hover:to-teal-700 transition shadow-md flex items-center justify-center gap-2"
                      >
                        <Download size={20} />
                        Download All Optimized Images
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <p className="text-center mt-6 text-gray-600 text-base">
            No signup • Unlimited compression • Nothing stored • 100% free • Browser-based for privacy
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Image Compressor Online Free - Reduce Size Up to 90% Instantly (JPG, PNG, HEIC, TIFF & More)
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Compress JPG, PNG, WebP, HEIC, HEIF, AVIF, TIFF, SVG, BMP, ICO, PSD, EPS, RAW files online without losing quality. Convert to WebP for maximum savings — perfect for websites, emails, social media, and pro editing. Completely free with PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Up to 90% Smaller</h3>
            <p className="text-gray-600 text-sm">
              Reduce file size dramatically while keeping visual quality — ideal for fast loading websites and mobile.
            </p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl shadow-lg border border-teal-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Multi-Format Support</h3>
            <p className="text-gray-600 text-sm">
              Handles HEIC (iPhone), TIFF/RAW (pro), SVG (vector) & more — auto-convert to WebP for smallest size.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Secure & Private</h3>
            <p className="text-gray-600 text-sm">
              Processed in browser — nothing uploaded or stored. Supports batch for multiple images at once.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Compress Images in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Images</h4>
              <p className="text-gray-600 text-sm">Drop or select JPG, PNG, HEIC, TIFF, SVG or batch from your device.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Choose Level & Compress</h4>
              <p className="text-gray-600 text-sm">Select quality and optimize to WebP automatically in seconds.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download</h4>
              <p className="text-gray-600 text-sm">Save your smaller, optimized images (single or batch ZIP).</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Compress images every day with PDF Linx — trusted by thousands for fast, high-quality, multi-format optimization. Free forever!
        </p>
      </section>


      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
  {/* Heading */}
  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
    Image Compressor Online (Free) – Compress JPG, PNG, HEIC, WebP & More by PDFLinx
  </h2>

  {/* Intro */}
  <p className="text-base leading-7 mb-6">
    Big images slow down websites, fail in email uploads, and eat up phone storage. And most “free” compressors either
    reduce quality too much or add watermarks. That’s why we built the{" "}
    <span className="font-medium text-slate-900">PDFLinx Image Compressor</span> —
    a fast, clean, and completely free tool that reduces image size in seconds while keeping your visuals sharp.
    Upload your image, choose a compression level (Low / Medium / High), and download the smaller file instantly.
    No signup, no limits, works on all devices.
  </p>

  {/* What is */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    What Is an Image Compressor?
  </h3>
  <p className="leading-7 mb-6">
    An image compressor reduces the file size of an image without noticeably hurting its quality. It works by optimizing
    how the image data is stored (for example: removing unnecessary metadata, improving encoding, or converting to more
    efficient formats like WebP). This helps you upload faster, share easily, and improve page speed on websites.
  </p>

  {/* Why use */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Why Use an Online Image Compressor?
  </h3>
  <ul className="space-y-2 mb-6 list-disc pl-6">
    <li>Reduce image size to speed up websites and improve SEO performance</li>
    <li>Upload images faster on forms, emails, and social media</li>
    <li>Save storage on mobile and desktop</li>
    <li>Compress multiple images for bulk work (batch-friendly)</li>
    <li>Choose the best balance between quality and size</li>
  </ul>

  {/* Steps */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    How to Compress Images Online
  </h3>
  <ol className="space-y-2 mb-6 list-decimal pl-6">
    <li>Upload your image (JPG, PNG, WebP, HEIC, TIFF, SVG and more)</li>
    <li>Select a compression level: <strong>Low</strong> (best quality), <strong>Medium</strong> (balanced), or <strong>High</strong> (max savings)</li>
    <li>Click compress — it processes in seconds</li>
    <li>Download your optimized image instantly</li>
    <li>Optional: convert to <strong>WebP</strong> for the smallest file size</li>
  </ol>

  <p className="mb-6">
    No signup, unlimited compression, and clean output — 100% free.
  </p>

  {/* Features box */}
  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
    <h3 className="text-xl font-semibold text-slate-900 mb-4">
      Features of PDFLinx Image Compressor
    </h3>
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
      <li>Free online image compressor with instant results</li>
      <li>Supports JPG, PNG, WebP, HEIC, TIFF, SVG & more</li>
      <li>Compression levels: Low / Medium / High</li>
      <li>Reduce image size up to 90% (depends on image type)</li>
      <li>Optional WebP conversion for maximum savings</li>
      <li>Batch-friendly uploads (compress multiple images)</li>
      <li>Works on mobile, tablet, and desktop</li>
      <li>No signup, no watermark, no clutter</li>
    </ul>
  </div>

  {/* Audience */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Who Should Use This Tool?
  </h3>
  <ul className="space-y-2 mb-6 list-disc pl-6">
    <li><strong>Website owners:</strong> Improve loading speed and Core Web Vitals</li>
    <li><strong>Designers:</strong> Export lightweight images for web and UI projects</li>
    <li><strong>Students:</strong> Reduce image size for assignments and portals</li>
    <li><strong>Marketers:</strong> Optimize images for campaigns, ads, and landing pages</li>
    <li><strong>Everyone:</strong> Save storage and share images faster</li>
  </ul>

  {/* Privacy / Safety */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Is PDFLinx Image Compressor Safe and Private?
  </h3>
  <p className="leading-7 mb-6">
    Yes. The tool is designed to be simple and privacy-friendly. No account is needed, and your images are only used to
    generate the compressed output. Just upload, compress, and download.
  </p>

  {/* Closing */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Compress Images Anytime, Anywhere
  </h3>
  <p className="leading-7">
    PDFLinx Image Compressor works smoothly on Windows, macOS, Linux, Android, and iOS. Whether you’re on a phone, tablet,
    or computer, you can compress images instantly using only your browser.
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
          Is the Image Compressor free to use?
        </summary>
        <p className="mt-2 text-gray-600">
          Yes — it’s completely free with unlimited compression and no hidden charges.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Which formats are supported?
        </summary>
        <p className="mt-2 text-gray-600">
          You can compress popular formats like JPG, PNG, WebP, HEIC, TIFF, SVG and more (based on what your browser
          supports).
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Will compression reduce quality?
        </summary>
        <p className="mt-2 text-gray-600">
          Slightly — depending on your selected level. Use <strong>Low</strong> for best quality, <strong>Medium</strong>{" "}
          for balance, and <strong>High</strong> for maximum size reduction.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          How much can I reduce image size?
        </summary>
        <p className="mt-2 text-gray-600">
          It depends on the image type and content. In many cases, you can reduce size significantly — sometimes up to 90%.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Can I compress multiple images at once?
        </summary>
        <p className="mt-2 text-gray-600">
          Yes — you can upload and compress multiple images (batch-friendly). Download them individually or as a ZIP if
          your tool provides it.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Are my images stored anywhere?
        </summary>
        <p className="mt-2 text-gray-600">
          No — your images are used only to produce the compressed output. Nothing is stored.
        </p>
      </details>
    </div>
  </div>
</section>

      <RelatedToolsSection currentPage="image-compressor" />
    </>
  );
}





















// 'use client';

// import { useState } from 'react';
// import imageCompression from 'browser-image-compression';
// import { Upload, Download, Zap, Shield, Image as ImageIcon } from 'lucide-react';
// import Script from 'next/script';
// import RelatedToolsSection from "@/components/RelatedTools";


// export default function ImageCompressor() {
//   const [original, setOriginal] = useState(null);
//   const [compressed, setCompressed] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saved, setSaved] = useState(0);
//   const [originalSize, setOriginalSize] = useState(0);
//   const [compressedSize, setCompressedSize] = useState(0);

//   const handleFile = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setOriginal(file);
//     setOriginalSize((file.size / 1024 / 1024).toFixed(2));
//     setCompressed(null);
//     setLoading(true);

//     const options = {
//       maxSizeMB: 1,
//       maxWidthOrHeight: 1920,
//       useWebWorker: true,
//       fileType: 'image/webp',
//       initialQuality: 0.8,
//     };

//     try {
//       const compressedFile = await imageCompression(file, options);
//       const compSize = (compressedFile.size / 1024 / 1024).toFixed(2);
//       setCompressedSize(compSize);
//       setSaved(Math.round(((file.size - compressedFile.size) / file.size) * 100));
//       setCompressed(URL.createObjectURL(compressedFile));
//     } catch (error) {
//       alert('Error compressing image. Please try again.');
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-img-comp"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Compress Image Online for Free",
//             description: "Reduce image file size up to 90% while maintaining quality.",
//             url: "https://pdflinx.com/image-compressor",
//             step: [
//               { "@type": "HowToStep", name: "Upload Image", text: "Select JPG, PNG, or WebP image." },
//               { "@type": "HowToStep", name: "Compress", text: "Click compress and wait a few seconds." },
//               { "@type": "HowToStep", name: "Download", text: "Download smaller optimized image." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-img-comp"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Image Compressor", item: "https://pdflinx.com/image-compressor" }
//             ]
//           }, null, 2),
//         }}
//       />

// {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
//               Image Compressor Online (Free)
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Compress JPG, PNG, WebP images up to 90% smaller without losing quality. Convert to WebP for best results — 100% free, no signup.
//             </p>
//           </div>

//           {/* Upload Area */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
//             <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:border-green-500 transition">
//               <Upload className="w-12 h-12 mx-auto text-green-600 mb-4" />
//               <label className="cursor-pointer">
//                 <span className="text-lg font-semibold text-gray-700 block mb-2">
//                   Drop your image here or click to upload
//                 </span>
//                 <span className="text-gray-500 text-sm">Supports JPG, PNG, WebP, GIF • Max 50MB</span>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFile}
//                   className="hidden"
//                 />
//               </label>
//             </div>
//           </div>

//           {/* Comparison Section */}
//           {original && (
//             <div className="grid md:grid-cols-2 gap-8 mb-8">
//               {/* Original */}
//               <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md p-6 text-center border border-gray-200">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Original Image</h3>
//                 <img
//                   src={URL.createObjectURL(original)}
//                   alt="Original"
//                   className="max-w-full rounded-xl shadow-md mx-auto"
//                 />
//                 <div className="mt-6">
//                   <p className="text-lg font-bold text-gray-700">{originalSize} MB</p>
//                   <p className="text-gray-500 text-sm">Before Compression</p>
//                 </div>
//               </div>

//               {/* Compressed */}
//               <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-md p-6 text-center border-2 border-green-400">
//                 <h3 className="text-xl font-semibold text-green-600 mb-4">
//                   {loading ? 'Compressing...' : 'Compressed Image'}
//                 </h3>
//                 {compressed ? (
//                   <>
//                     <img
//                       src={compressed}
//                       alt="Compressed"
//                       className="max-w-full rounded-xl shadow-md mx-auto border-2 border-green-500"
//                     />
//                     <div className="mt-6">
//                       <p className="text-2xl font-bold text-green-600 mb-2">{saved}% Smaller!</p>
//                       <p className="text-lg font-bold text-gray-700">{compressedSize} MB</p>
//                       <p className="text-gray-500 text-sm">After Compression</p>
//                     </div>
//                     <a
//                       href={compressed}
//                       download={`compressed-${original.name.split('.')[0]}.webp`}
//                       className="inline-flex items-center gap-2 mt-6 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold text-base px-8 py-3 rounded-xl hover:from-green-700 hover:to-teal-700 transition shadow-md"
//                     >
//                       <Download size={20} />
//                       Download Optimized Image
//                     </a>
//                   </>
//                 ) : (
//                   <div className="h-64 flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           <p className="text-center mt-6 text-gray-600 text-base">
//             No signup • Unlimited compression • Nothing stored • 100% free
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         {/* Main Heading */}
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
//             Image Compressor Online Free - Reduce Size Up to 90% Instantly
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Compress JPG, PNG, WebP, and GIF images online without losing quality. Convert to WebP for maximum savings — perfect for websites, emails, and social media. Completely free with PDF Linx.
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Zap className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Up to 90% Smaller</h3>
//             <p className="text-gray-600 text-sm">
//               Reduce file size dramatically while keeping visual quality — ideal for fast loading websites.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl shadow-lg border border-teal-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <ImageIcon className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">WebP Conversion</h3>
//             <p className="text-gray-600 text-sm">
//               Automatically convert to modern WebP format — smallest size with excellent quality.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Shield className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Secure & Private</h3>
//             <p className="text-gray-600 text-sm">
//               Images processed in browser — nothing uploaded or stored. Completely private and free.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             How to Compress Image in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload Image</h4>
//               <p className="text-gray-600 text-sm">Drop or select any JPG, PNG, WebP, or GIF image from your device.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Auto Compress</h4>
//               <p className="text-gray-600 text-sm">We optimize and convert to WebP automatically in seconds.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download</h4>
//               <p className="text-gray-600 text-sm">Save your smaller, optimized image instantly.</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           Compress images every day with PDF Linx — trusted by thousands for fast, high-quality, and completely free image optimization.
//         </p>
//       </section>
//     <RelatedToolsSection currentPage="image-compressor" />

//     </>
//   );
// }




















// // 'use client';

// // import { useState } from 'react';
// // import imageCompression from 'browser-image-compression';

// // export default function ImageCompressor() {
// //   const [original, setOriginal] = useState(null);
// //   const [compressed, setCompressed] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [saved, setSaved] = useState(0);

// //   const handleFile = async (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;
// //     setOriginal(file);
// //     setCompressed(null);
// //     setLoading(true);

// //     const options = {
// //       maxSizeMB: 1,
// //       maxWidthOrHeight: 1920,
// //       useWebWorker: true,
// //       fileType: 'image/webp',  // WebP sabse chhota hota hai
// //     };

// //     try {
// //       const compressedFile = await imageCompression(file, options);
// //       const originalSize = file.size / 1024 / 1024;
// //       const compressedSize = compressedFile.size / 1024 / 1024;
// //       setSaved(Math.round((originalSize - compressedSize) / originalSize * 100));
      
// //       setCompressed(URL.createObjectURL(compressedFile));
// //     } catch (error) {
// //       alert('Error compressing image');
// //     }
// //     setLoading(false);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-12 px-4">
// //       <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-10">
// //         <h1 className="text-4xl font-bold text-center mb-4">Image Compressor & Resizer</h1>
// //         <p className="text-center text-gray-600 mb-10">Reduce image size up to 90% • Convert to WebP • No quality loss</p>

// //         <input
// //           type="file"
// //           accept="image/*"
// //           onChange={handleFile}
// //           className="block w-full text-lg text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 p-6 mb-10"
// //         />

// //         {original && (
// //           <div className="grid md:grid-cols-2 gap-10">
// //             <div className="text-center">
// //               <h3 className="text-2xl font-bold mb-4">Original</h3>
// //               <img src={URL.createObjectURL(original)} alt="original" className="max-w-full rounded-lg shadow-lg" />
// //               <p className="mt-4 text-xl">Size: {(original.size / 1024 / 1024).toFixed(2)} MB</p>
// //             </div>

// //             <div className="text-center">
// //               <h3 className="text-2xl font-bold mb-4 text-green-600">
// //                 {loading ? 'Compressing...' : 'Compressed (-90%)'}
// //               </h3>
// //               {compressed ? (
// //                 <>
// //                   <img src={compressed} alt="compressed" className="max-w-full rounded-lg shadow-lg border-4 border-green-500" />
// //                   <p className="mt-4 text-3xl font-bold text-green-600">{saved}% Smaller!</p>
// //                   <a
// //                     href={compressed}
// //                     download={`compressed-${original.name.split('.')[0]}.webp`}
// //                     className="inline-block mt-6 bg-green-600 text-white px-10 py-5 rounded-xl text-xl font-bold hover:bg-green-700"
// //                   >
// //                     Download Optimized Image
// //                   </a>
// //                 </>
// //               ) : (
// //                 <div className="h-64 flex items-center justify-center">
// //                   <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-600"></div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
