'use client';

import { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { Upload, Copy, FileText, Zap, Shield, CheckCircle } from 'lucide-react';
import Script from 'next/script';
import RelatedToolsSection from "@/components/RelatedTools";


export default function ImageToText() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const doOCR = (file) => {
    if (!file) return;

    setLoading(true);
    setText('');
    setProgress(0);
    setImage(URL.createObjectURL(file));

    Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100));
        }
      },
    })
      .then(({ data: { text } }) => {
        const cleanText = text.trim() || 'No text found in the image. Try a clearer photo with visible text.';
        setText(cleanText);
      })
      .catch((err) => {
        console.error(err);
        setText('Oops! Something went wrong. Try a sharper image with clear text.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      doOCR(file);
    }
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-img-text"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Extract Text from Image Online for Free",
            description: "Use OCR to convert images to editable text instantly.",
            url: "https://pdflinx.com/image-to-text",
            step: [
              { "@type": "HowToStep", name: "Upload Image", text: "Drop or select image containing text." },
              { "@type": "HowToStep", name: "Wait", text: "OCR processes in seconds." },
              { "@type": "HowToStep", name: "Copy Text", text: "Copy extracted text easily." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-img-text"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Image to Text (OCR)", item: "https://pdflinx.com/image-to-text" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Image to Text OCR Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Extract text from photos, screenshots, scanned notes, receipts — fast and accurate. No signup, nothing uploaded, works right in your browser.
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
            <label className="block cursor-pointer">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-4 border-dashed border-cyan-300 rounded-2xl p-16 text-center hover:border-teal-500 transition bg-gray-50/50"
              >
                <Upload className="w-16 h-16 mx-auto text-cyan-600 mb-4" />
                <span className="text-xl font-semibold text-gray-800 block mb-2">
                  Drop your image here or click to upload
                </span>
                <span className="text-base text-gray-600">
                  JPG, PNG, WebP • Screenshots, scans, photos with text
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) doOCR(file);
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* Progress */}
          {loading && (
            <div className="text-center mb-8">
              <div className="bg-gray-200 rounded-full h-4 overflow-hidden max-w-md mx-auto mb-4">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-teal-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-lg font-medium text-teal-600">
                Extracting text... {progress}%
              </p>
            </div>
          )}

          {/* Result */}
          {text && !loading && (
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Original Image */}
              {image && (
                <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Image</h3>
                  <img src={image} alt="Uploaded" className="max-w-full rounded-xl shadow-md mx-auto" />
                </div>
              )}

              {/* Extracted Text */}
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-200">
                <h3 className="text-xl font-semibold text-teal-700 mb-4">Extracted Text</h3>
                <textarea
                  value={text}
                  readOnly
                  className="w-full h-64 p-4 text-base bg-white border border-cyan-300 rounded-xl font-mono resize-none shadow-inner focus:outline-none"
                />
                <button
                  onClick={copyText}
                  className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-medium py-3 rounded-xl hover:from-cyan-700 hover:to-teal-700 transition flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-base text-gray-600">
            No signup • Works in browser • Nothing uploaded • 100% private & free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Image to Text OCR Online Free - Extract Text from Photos & Screenshots
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Turn images, screenshots, scanned documents, or handwritten notes into editable text instantly. Works great for receipts, books, whiteboards — accurate and completely free with PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl shadow-lg border border-cyan-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">High Accuracy</h3>
            <p className="text-gray-600 text-sm">
              Extracts text from photos, scans, screenshots, even handwriting (if clear).
            </p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl shadow-lg border border-teal-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast Processing</h3>
            <p className="text-gray-600 text-sm">
              Results in seconds — no waiting, no server delay.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">100% Private</h3>
            <p className="text-gray-600 text-sm">
              Nothing leaves your device — no upload, no storage, fully secure.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Extract Text from Image in 3 Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Image</h4>
              <p className="text-gray-600 text-sm">Drop or click to select photo/screenshot.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Wait a Few Seconds</h4>
              <p className="text-gray-600 text-sm">OCR runs automatically in your browser.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Copy Text</h4>
              <p className="text-gray-600 text-sm">View result and copy with one click.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-lg text-gray-600 italic max-w-3xl mx-auto">
          Extract text from images anytime with PDF Linx — fast, private, and completely free OCR tool.
        </p>
      </section>


      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Image to Text OCR Online (Free) – Extract Text from Photos & Screenshots by PDFLinx
        </h2>

        {/* Intro */}
        <p className="text-base leading-7 mb-6">
          Kabhi screenshot, scanned notes, receipt ya kisi photo me text hota hai — aur aapko bas woh text copy karna hota hai.
          Lekin typing manually time waste karta hai. Is liye humne banaya{" "}
          <span className="font-medium text-slate-900">PDFLinx Image to Text OCR</span> —
          ek fast, accurate, aur free online OCR tool jo image se text extract karta hai seconds me.
          Bas image upload karo, kuch seconds wait karo, aur extracted text copy/download kar lo.
          No signup, no clutter — works perfectly on mobile and desktop.
        </p>

        {/* What is */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is Image to Text OCR?
        </h3>
        <p className="leading-7 mb-6">
          OCR (Optical Character Recognition) ek technology hai jo images ke andar likha hua text read karke usay editable text
          me convert karti hai. Matlab aap photos, screenshots, scanned documents, receipts, posters, ya whiteboard images se
          text nikaal kar copy/paste kar sakte ho — bina manually type kiye.
        </p>

        {/* Why use */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Use an Online OCR Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Extract text instantly from photos, screenshots, and scans</li>
          <li>Save time — no manual typing</li>
          <li>Useful for receipts, notes, study material, and documents</li>
          <li>Copy text with one click for emails, reports, and edits</li>
          <li>Works on any device — just a browser needed</li>
        </ul>

        {/* Steps */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Extract Text from an Image
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your image (JPG, PNG, WebP, etc.)</li>
          <li>Wait a few seconds — OCR runs automatically</li>
          <li>Review the extracted text</li>
          <li>Copy the text with one click (or download if available)</li>
          <li>Use it anywhere: documents, notes, emails, blogs, etc.</li>
        </ol>

        <p className="mb-6">
          No signup, unlimited OCR, accurate results — 100% free and easy.
        </p>

        {/* Features box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Image to Text OCR
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>Free online OCR tool (Image to Text)</li>
            <li>Extract text from photos, screenshots, and scans</li>
            <li>Fast processing — results in seconds</li>
            <li>High accuracy for clear printed text</li>
            <li>Copy text instantly (one click)</li>
            <li>Works on mobile, tablet, and desktop</li>
            <li>No signup, no watermark, no clutter</li>
            <li>Privacy-friendly workflow</li>
          </ul>
        </div>

        {/* Audience */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Extract text from notes, books, and study screenshots</li>
          <li><strong>Office users:</strong> Convert scanned documents into editable text</li>
          <li><strong>Freelancers:</strong> Copy text from receipts, invoices, or client screenshots</li>
          <li><strong>Researchers:</strong> Grab quotes from images and scans quickly</li>
          <li><strong>Anyone:</strong> Who wants quick copyable text from an image</li>
        </ul>

        {/* Privacy / Safety */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx OCR Safe and Private?
        </h3>
        <p className="leading-7 mb-6">
          Yes. No account is required. Your image is used only to extract text and generate the result.
          If you’re working with sensitive screenshots or receipts, this tool keeps the process simple and privacy-friendly.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Convert Image to Text Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx Image to Text OCR works smoothly on Windows, macOS, Linux, Android, and iOS.
          Upload your image and get editable text instantly — directly in your browser.
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
                Is Image to Text OCR free to use?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — it’s completely free with unlimited usage and no hidden charges.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Which image formats are supported?
              </summary>
              <p className="mt-2 text-gray-600">
                You can upload common formats like JPG, PNG, and WebP (and other formats based on browser support).
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                How accurate is the OCR?
              </summary>
              <p className="mt-2 text-gray-600">
                Accuracy is high for clear printed text. Blurry images or messy handwriting may reduce accuracy.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can it read handwritten text?
              </summary>
              <p className="mt-2 text-gray-600">
                It may work for clean handwriting, but printed/clear text gives the best results.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Do you store my images or extracted text?
              </summary>
              <p className="mt-2 text-gray-600">
                No — your input is used only to generate the OCR result. Nothing is stored.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I use this on mobile?
              </summary>
              <p className="mt-2 text-gray-600">
                Absolutely — it works perfectly on phones, tablets, and desktops.
              </p>
            </details>
          </div>
        </div>
      </section>


      <RelatedToolsSection currentPage="image-to-text" />

    </>
  );
}

























// 'use client';

// import { useState } from 'react';
// import Tesseract from 'tesseract.js';
// import { Upload, Copy, FileText, Zap, Shield, CheckCircle } from 'lucide-react';
// import Script from 'next/script';

// export default function ImageToText() {
//   const [image, setImage] = useState(null);
//   const [text, setText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [copied, setCopied] = useState(false);

//   const doOCR = (file) => {
//     if (!file) return;

//     setLoading(true);
//     setText('');
//     setProgress(0);

//     Tesseract.recognize(file, 'eng', {
//       logger: (m) => {
//         if (m.status === 'recognizing text') {
//           setProgress(Math.round(m.progress * 100));
//         }
//       },
//     })
//       .then(({ data: { text } }) => {
//         const cleanText = text.trim() || 'No text detected in the image.';
//         setText(cleanText);
//       })
//       .catch((err) => {
//         console.error(err);
//         setText('Error: Unable to extract text. Try a clearer image with visible text.');
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const copyText = () => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-img-text"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Extract Text from Image Online for Free",
//             description: "Use OCR to convert images to editable text instantly.",
//             url: "https://pdflinx.com/image-to-text",
//             step: [
//               { "@type": "HowToStep", name: "Upload Image", text: "Select image containing text." },
//               { "@type": "HowToStep", name: "Extract", text: "Click extract and wait for OCR processing." },
//               { "@type": "HowToStep", name: "Copy Text", text: "Copy extracted text to clipboard." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-img-text"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Image to Text", item: "https://pdflinx.com/image-to-text" }
//             ]
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 py-12 px-4">
//         <div className="max-w-5xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-6">
//               Image to Text OCR <br /> Online (Free)
//             </h1>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Extract text from images instantly using powerful OCR. Supports scanned documents, photos, screenshots — 100% free, no signup, works offline in browser.
//             </p>
//           </div>

//           {/* Upload Area */}
//           {/* <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 mb-12">
//             <div className="border-4 border-dashed border-cyan-300 rounded-3xl p-20 text-center hover:border-teal-500 transition cursor-pointer">
//               <Upload className="w-24 h-24 mx-auto text-cyan-600 mb-8" />
//               <label className="cursor-pointer block">
//                 <span className="text-3xl font-bold text-gray-800 block mb-4">
//                   Drop image here or click to upload
//                 </span>
//                 <span className="text-xl text-gray-600">
//                   Supports JPG, PNG, WebP, scanned PDFs & screenshots
//                 </span>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     if (file) {
//                       setImage(URL.createObjectURL(file));
//                       doOCR(file);
//                     }
//                   }}
//                   className="hidden"
//                 />
//               </label>
//             </div>
//           </div> */}

//           {/* Upload Area */}
//           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 mb-12">
//             <label className="block cursor-pointer">
//               <div className="border-4 border-dashed border-cyan-300 rounded-3xl p-20 text-center hover:border-teal-500 transition">
//                 <Upload className="w-24 h-24 mx-auto text-cyan-600 mb-8" />
//                 <span className="text-3xl font-bold text-gray-800 block mb-4">
//                   Drop image here or click to upload
//                 </span>
//                 <span className="text-xl text-gray-600">
//                   Supports JPG, PNG, WebP, scanned PDFs & screenshots
//                 </span>
//               </div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) {
//                     setImage(URL.createObjectURL(file));
//                     doOCR(file);
//                   }
//                 }}
//                 className="hidden"
//               />
//             </label>
//           </div>

//           {/* Progress Bar */}
//           {loading && (
//             <div className="max-w-2xl mx-auto mb-12">
//               <div className="bg-gray-200 rounded-full h-16 overflow-hidden shadow-inner">
//                 <div
//                   className="bg-gradient-to-r from-cyan-500 to-teal-600 h-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-500"
//                   style={{ width: `${progress}%` }}
//                 >
//                   {progress}%
//                 </div>
//               </div>
//               <p className="text-center mt-6 text-2xl font-bold text-teal-600">
//                 Extracting text... (usually 3-8 seconds)
//               </p>
//             </div>
//           )}

//           {/* Result Section */}
//           {text && !loading && (
//             <div className="grid md:grid-cols-2 gap-12">
//               {/* Original Image */}
//               {image && (
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl p-8 text-center border border-gray-200">
//                   <h3 className="text-3xl font-bold text-gray-800 mb-6">Uploaded Image</h3>
//                   <img
//                     src={image}
//                     alt="Uploaded"
//                     className="max-w-full rounded-2xl shadow-2xl mx-auto"
//                   />
//                 </div>
//               )}

//               {/* Extracted Text */}
//               <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl shadow-xl p-8 border-4 border-teal-400">
//                 <h3 className="text-3xl font-bold text-teal-600 mb-6">Extracted Text</h3>
//                 <textarea
//                   value={text}
//                   readOnly
//                   className="w-full h-96 p-8 text-lg bg-white border-2 border-cyan-300 rounded-2xl font-mono resize-none shadow-inner focus:outline-none"
//                 />
//                 <button
//                   onClick={copyText}
//                   className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold text-xl py-5 rounded-2xl hover:from-cyan-700 hover:to-teal-700 transition shadow-2xl flex items-center justify-center gap-4"
//                 >
//                   <Copy size={28} />
//                   {copied ? 'Copied to Clipboard!' : 'Copy Text'}
//                 </button>
//               </div>
//             </div>
//           )}

//           <p className="text-center mt-12 text-gray-600 text-lg">
//             No signup • Works offline in browser • Nothing uploaded • 100% free & private
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
//         {/* Main Heading */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-6">
//             Image to Text OCR Online Free - Extract Text from Photos Instantly
//           </h2>
//           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
//             Convert images, screenshots, scanned documents to editable text using advanced OCR technology. Accurate, fast, and completely free — no signup or installation required with PDF Linx.
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-10 mb-20">
//           <div className="bg-gradient-to-br from-cyan-50 to-white p-10 rounded-3xl shadow-xl border border-cyan-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <FileText className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">High Accuracy OCR</h3>
//             <p className="text-gray-600">
//               Extracts text from photos, screenshots, books, receipts, and scanned documents with excellent precision.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-teal-50 to-white p-10 rounded-3xl shadow-xl border border-teal-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Zap className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast & Browser-Based</h3>
//             <p className="text-gray-600">
//               Works directly in your browser — no software install, processing in seconds.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Shield className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Private & Secure</h3>
//             <p className="text-gray-600">
//               Images never leave your device — fully private, no upload, nothing stored.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
//           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
//             How to Extract Text from Image in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 1
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Upload Image</h4>
//               <p className="text-gray-600 text-lg">Drop or select any image with text (photo, screenshot, scan).</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 2
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">OCR Processing</h4>
//               <p className="text-gray-600 text-lg">Advanced OCR extracts text automatically in seconds.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 3
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Copy Text</h4>
//               <p className="text-gray-600 text-lg">View extracted text and copy it instantly.</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
//           Extract text from images every day with PDF Linx — trusted by thousands for accurate, fast, and completely private OCR processing.
//         </p>
//       </section>
//     </>
//   );
// }



















// 'use client';

// import { useState } from 'react';
// import Tesseract from 'tesseract.js';

// export default function ImageToText() {
//   const [image, setImage] = useState(null);
//   const [text, setText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const doOCR = (file) => {
//     if (!file) return;

//     setLoading(true);
//     setText('');
//     setProgress(0);

//     // Browser-safe version: direct Tesseract call (no createWorker)
//     Tesseract.recognize(file, 'eng', {
//       logger: (m) => {
//         if (m.status === 'recognizing text') {
//           setProgress(Math.round(m.progress * 100));
//         }
//       },
//     })
//       .then(({ data: { text } }) => {
//         setText(text.trim() || 'No text found');
//       })
//       .catch((err) => {
//         console.error(err);
//         setText('Error: Try again or use clearer image.');
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4">
//       <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center">
//         {/* <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
//           Image to Text (Offline OCR)
//         </h1> */}
//         <h1
//           className="text-5xl sm:text-5xl font-bold mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent leading-[1.2] pb-2"
//         >
//           Image to Text (Offline OCR)
//         </h1>

//         <p className="text-xl text-gray-600 mb-10">
//           Upload any image and extract text using!
//         </p>

//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) {
//               setImage(URL.createObjectURL(file));
//               doOCR(file);
//             }
//           }}
//           className="block w-full max-w-md mx-auto text-lg border-4 border-dashed border-teal-400 rounded-3xl cursor-pointer bg-teal-50 p-16 hover:bg-teal-100 transition"
//         />

//         {loading && (
//           <div className="my-20">
//             <div className="w-96 mx-auto bg-gray-200 rounded-full h-12 overflow-hidden">
//               <div
//                 className="bg-gradient-to-r from-teal-500 to-cyan-600 h-full transition-all duration-300 flex items-center justify-center text-white font-bold"
//                 style={{ width: `${progress}%` }}
//               >
//                 {progress > 0 && `${progress}%`}
//               </div>
//             </div>
//             <p className="mt-6 text-2xl font-bold text-teal-600">
//               Extracting text... (2-5 sec)
//             </p>
//           </div>
//         )}

//         {text && !loading && (
//           <div className="grid md:grid-cols-2 gap-10 mt-10">
//             {image && (
//               <div>
//                 <h3 className="text-2xl font-bold mb-4">Uploaded Image</h3>
//                 <img
//                   src={image}
//                   alt="uploaded"
//                   className="max-w-full rounded-2xl shadow-2xl"
//                 />
//               </div>
//             )}
//             <div>
//               <h3 className="text-3xl font-bold mb-4 text-cyan-600">
//                 Extracted Text
//               </h3>
//               <textarea
//                 value={text}
//                 readOnly
//                 className="w-full h-80 p-6 text-lg border-2 border-cyan-300 rounded-2xl bg-cyan-50 font-mono resize-none"
//               />
//               <button
//                 onClick={() => navigator.clipboard.writeText(text)}
//                 className="mt-4 w-full bg-cyan-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-cyan-700 transition"
//               >
//                 Copy Text
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
