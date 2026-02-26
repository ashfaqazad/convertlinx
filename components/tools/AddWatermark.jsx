'use client';

import { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { Upload, Download, Type, CheckCircle } from 'lucide-react';
import Script from 'next/script';
import RelatedToolsSection from "@/components/RelatedTools";


export default function AddWatermark() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [loading, setLoading] = useState(false);
  const [watermarkedUrl, setWatermarkedUrl] = useState(null);

  const addWatermark = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
  };

  const applyWatermark = async () => {
    if (!file || !text) return;
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(text, {
          x: width / 2 - 100,
          y: height / 2,
          size: 80,
          color: rgb(0.8, 0.8, 0.8),
          opacity: opacity,
          rotate: { type: 'degrees', angle: -45 },
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setWatermarkedUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert('Oops! Something went wrong while adding the watermark. Try again?');
    }
    setLoading(false);
  };

  return (
    <>
      <Script
        id="howto-schema-watermark"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Add Watermark to PDF Online for Free",
            description: "Add text watermark to PDF pages instantly.",
            url: "https://pdflinx.com/add-watermark",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
              { "@type": "HowToStep", name: "Enter Text", text: "Type watermark text." },
              { "@type": "HowToStep", name: "Download", text: "Download watermarked PDF." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-watermark"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Add Watermark", item: "https://pdflinx.com/add-watermark" }
            ]
          }, null, 2),
        }}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent mb-4">
              Add Watermark to PDF <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Want to slap “CONFIDENTIAL”, “DRAFT”, or your name across a PDF? Do it in seconds – looks pro, super easy, and totally free!
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <label className="block cursor-pointer mb-8">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-slate-500 transition">
                <Upload className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <span className="text-xl font-semibold text-gray-800 block mb-2">
                  Drop your PDF here or click to upload
                </span>
              </div>
              <input type="file" accept=".pdf" onChange={addWatermark} className="hidden" />
            </label>

            {file && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                    <Type className="w-6 h-6 text-gray-600" />
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., CONFIDENTIAL, DRAFT, © Your Name 2026"
                    className="w-full p-4 text-xl text-center border-2 border-gray-300 rounded-xl focus:border-slate-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Opacity: {Math.round(opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                  />
                </div>

                <div className="text-center">
                  <button
                    onClick={applyWatermark}
                    disabled={loading}
                    className="bg-gradient-to-r from-gray-600 to-slate-600 text-white font-semibold text-lg px-10 py-4 rounded-xl hover:from-gray-700 hover:to-slate-700 disabled:opacity-60 transition shadow-md"
                  >
                    {loading ? 'Adding Watermark...' : 'Apply Watermark'}
                  </button>
                </div>
              </div>
            )}

            {watermarkedUrl && (
              <div className="text-center mt-8">
                <p className="text-2xl font-bold text-green-600 mb-4">Watermark added – looking sharp!</p>
                <a
                  href={watermarkedUrl}
                  download="watermarked-pdf.pdf"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold text-base px-8 py-3 rounded-xl hover:from-green-700 hover:to-teal-700 transition shadow-md"
                >
                  <Download className="w-5 h-5" />
                  Download Watermarked PDF
                </a>
              </div>
            )}
          </div>

          <p className="text-center mt-6 text-gray-600 text-base">
            No account • Unlimited use • Everything stays private • All free
          </p>
        </div>
      </main>

      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent mb-4">
            Add Watermark to PDF Online Free – Keep Your Docs Safe
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to mark a PDF as “CONFIDENTIAL”, “DRAFT”, or just add your copyright? This tool does it across every page in one click – clean, subtle, and professional. All on PDF Linx, fast and free!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Type className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Text, Your Way</h3>
            <p className="text-gray-600 text-sm">Write whatever you want – “CONFIDENTIAL”, “DO NOT COPY”, your name, anything.</p>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Every Page Covered</h3>
            <p className="text-gray-600 text-sm">Watermark shows up neatly on all pages – no extra work.</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Free & Super Private</h3>
            <p className="text-gray-600 text-sm">Do it as many times as you like – nothing leaves your browser.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Add Watermark in 3 Quick Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDF</h4>
              <p className="text-gray-600 text-sm">Drop it in or click to pick from your device.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Type the Text</h4>
              <p className="text-gray-600 text-sm">Add your message and tweak how faint or bold it looks.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download</h4>
              <p className="text-gray-600 text-sm">Grab your protected PDF – done!</p>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Pros and everyday folks use PDF Linx to watermark PDFs quickly – it's reliable, simple, and always free.
        </p>
      </section>


      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
  {/* Heading */}
  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
    Add Watermark to PDF Online (Free) – Protect Documents with Text Watermarks by PDFLinx
  </h2>

  {/* Intro */}
  <p className="text-base leading-7 mb-6">
    Want to mark a PDF as <strong>CONFIDENTIAL</strong>, <strong>DRAFT</strong>, <strong>DO NOT COPY</strong>, or add your
    name/brand on every page? Doing this manually is slow and messy. That’s why we built the{" "}
    <span className="font-medium text-slate-900">PDFLinx Add Watermark to PDF</span> tool —
    a fast and free way to add clean text watermarks across your entire PDF in seconds.
    Upload your file, type the watermark text, customize how it looks, and download your watermarked PDF instantly.
    No signup, no watermark on your watermark — just simple, professional results.
  </p>

  {/* What is */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    What Is a PDF Watermark?
  </h3>
  <p className="leading-7 mb-6">
    A watermark is a visible text label added on top of a document to show ownership, status, or confidentiality.
    Common examples include “CONFIDENTIAL”, “DRAFT”, “SAMPLE”, “COPY”, or a company name/logo.
    Watermarks help discourage unauthorized sharing, protect branding, and clearly communicate document status.
  </p>

  {/* Why use */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Why Add a Watermark to a PDF?
  </h3>
  <ul className="space-y-2 mb-6 list-disc pl-6">
    <li>Protect documents by marking them confidential or draft</li>
    <li>Add ownership or branding (name, company, copyright notice)</li>
    <li>Prevent misuse by clearly labeling “DO NOT COPY” or “SAMPLE”</li>
    <li>Apply watermark automatically on every page (no manual editing)</li>
    <li>Make PDFs look professional for sharing and review</li>
  </ul>

  {/* Steps */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    How to Add Watermark to PDF Online
  </h3>
  <ol className="space-y-2 mb-6 list-decimal pl-6">
    <li>Upload your PDF file</li>
    <li>Type the watermark text (e.g., CONFIDENTIAL / DRAFT / Your Name)</li>
    <li>Adjust the style (size, opacity, position, rotation — if available)</li>
    <li>Apply watermark — it adds across all pages</li>
    <li>Download your watermarked PDF instantly</li>
  </ol>

  <p className="mb-6">
    No account needed, unlimited use — fast and clean results, totally free.
  </p>

  {/* Features box */}
  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
    <h3 className="text-xl font-semibold text-slate-900 mb-4">
      Features of PDFLinx Add Watermark Tool
    </h3>
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
      <li>Free online PDF watermark tool</li>
      <li>Add text watermark to all pages automatically</li>
      <li>Great for CONFIDENTIAL, DRAFT, SAMPLE, DO NOT COPY</li>
      <li>Clean, professional watermark output</li>
      <li>Fast processing — watermark in seconds</li>
      <li>Works on mobile, tablet, and desktop</li>
      <li>No signup, no watermark ads, no installation</li>
      <li>Privacy-friendly workflow</li>
    </ul>
  </div>

  {/* Audience */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Who Should Use This Tool?
  </h3>
  <ul className="space-y-2 mb-6 list-disc pl-6">
    <li><strong>Businesses:</strong> Mark contracts and reports as confidential</li>
    <li><strong>Students:</strong> Add “DRAFT” or name on assignments and submissions</li>
    <li><strong>Freelancers:</strong> Protect proposals and client documents</li>
    <li><strong>Teams:</strong> Share review files with “SAMPLE” or “INTERNAL” labels</li>
    <li><strong>Anyone:</strong> Who wants fast watermarking without editing apps</li>
  </ul>

  {/* Safety */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Is PDFLinx Watermark Tool Safe?
  </h3>
  <p className="leading-7 mb-6">
    Yes. You don’t need to create an account. Your PDF is used only to generate the watermarked output, and then you
    download the final file. The tool is designed to be simple, secure, and privacy-friendly.
  </p>

  {/* Closing */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Watermark PDFs Anytime, Anywhere
  </h3>
  <p className="leading-7">
    PDFLinx Add Watermark works smoothly on Windows, macOS, Linux, Android, and iOS.
    Upload your PDF, add your watermark text, and download a protected PDF instantly — directly in your browser.
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
          Is the Add Watermark to PDF tool free?
        </summary>
        <p className="mt-2 text-gray-600">
          Yes — it’s completely free with unlimited watermarking and downloads.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Can I add watermark to every page automatically?
        </summary>
        <p className="mt-2 text-gray-600">
          Yes — the watermark is applied across all pages of your PDF automatically.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          What watermark text can I use?
        </summary>
        <p className="mt-2 text-gray-600">
          You can use anything like “CONFIDENTIAL”, “DRAFT”, “SAMPLE”, “DO NOT COPY”, your name, or your company branding.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Will watermark affect PDF readability?
        </summary>
        <p className="mt-2 text-gray-600">
          You can keep it subtle by using lower opacity and clean placement (depending on the options available).
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Are my PDFs stored anywhere?
        </summary>
        <p className="mt-2 text-gray-600">
          No — your PDF is used only to create the watermarked output. Nothing is stored.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Can I use this watermark tool on mobile?
        </summary>
        <p className="mt-2 text-gray-600">
          Yes — it works perfectly on phones, tablets, and desktops.
        </p>
      </details>
    </div>
  </div>
</section>


    <RelatedToolsSection currentPage="add-watermark" />
      
    </>
  );
}



























// 'use client';

// import { useState } from 'react';
// import { PDFDocument, rgb } from 'pdf-lib';
// import { Upload, Download, Type, CheckCircle } from 'lucide-react';
// import Script from 'next/script';
// import RelatedToolsSection from "@/components/RelatedTools";


// export default function AddWatermark() {
//   const [file, setFile] = useState(null);
//   const [text, setText] = useState('CONFIDENTIAL');
//   const [opacity, setOpacity] = useState(0.3);
//   const [loading, setLoading] = useState(false);
//   const [watermarkedUrl, setWatermarkedUrl] = useState(null);

//   const addWatermark = async (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;
//     setFile(selected);
//   };

//   const applyWatermark = async () => {
//     if (!file || !text) return;
//     setLoading(true);

//     try {
//       const arrayBuffer = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(arrayBuffer);
//       const pages = pdfDoc.getPages();

//       pages.forEach((page) => {
//         const { width, height } = page.getSize();
//         page.drawText(text, {
//           x: width / 2 - 100,
//           y: height / 2,
//           size: 80,
//           color: rgb(0.8, 0.8, 0.8),
//           opacity: opacity,
//           rotate: { type: 'degrees', angle: -45 },
//         });
//       });

//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//       setWatermarkedUrl(URL.createObjectURL(blob));
//     } catch (err) {
//       alert('Error adding watermark');
//     }
//     setLoading(false);
//   };

//   return (
//     <>
//       <Script
//         id="howto-schema-watermark"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Add Watermark to PDF Online for Free",
//             description: "Add text watermark to PDF pages instantly.",
//             url: "https://pdflinx.com/add-watermark",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
//               { "@type": "HowToStep", name: "Enter Text", text: "Type watermark text." },
//               { "@type": "HowToStep", name: "Download", text: "Download watermarked PDF." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-watermark"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Add Watermark", item: "https://pdflinx.com/add-watermark" }
//             ]
//           }, null, 2),
//         }}
//       />

//       <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 py-12 px-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent mb-6">
//               Add Watermark to PDF <br /> Online (Free)
//             </h1>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Add text watermark to your PDF pages instantly. Perfect for "CONFIDENTIAL", "DRAFT", or copyright — 100% free.
//             </p>
//           </div>

//           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
//             <label className="block cursor-pointer mb-10">
//               <div className="border-4 border-dashed border-gray-300 rounded-3xl p-20 text-center hover:border-slate-500 transition">
//                 <Upload className="w-24 h-24 mx-auto text-gray-600 mb-8" />
//                 <span className="text-3xl font-bold text-gray-800 block mb-4">
//                   Drop PDF here or click to upload
//                 </span>
//               </div>
//               <input type="file" accept=".pdf" onChange={addWatermark} className="hidden" />
//             </label>

//             {file && (
//               <div className="space-y-8">
//                 <div>
//                   <label className="flex items-center gap-3 text-xl font-semibold text-gray-700 mb-4">
//                     <Type size={28} className="text-gray-600" />
//                     Watermark Text
//                   </label>
//                   <input
//                     type="text"
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     placeholder="e.g., CONFIDENTIAL, DRAFT, © 2025"
//                     className="w-full p-6 text-2xl text-center border-2 border-gray-300 rounded-2xl focus:border-slate-500 outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xl font-semibold text-gray-700 mb-4">
//                     Opacity: {Math.round(opacity * 100)}%
//                   </label>
//                   <input
//                     type="range"
//                     min="0.1"
//                     max="0.8"
//                     step="0.1"
//                     value={opacity}
//                     onChange={(e) => setOpacity(parseFloat(e.target.value))}
//                     className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
//                   />
//                 </div>

//                 <div className="text-center">
//                   <button
//                     onClick={applyWatermark}
//                     disabled={loading}
//                     className="bg-gradient-to-r from-gray-600 to-slate-600 text-white font-bold text-2xl px-16 py-6 rounded-full hover:from-gray-700 hover:to-slate-700 disabled:opacity-60 transition shadow-2xl"
//                   >
//                     {loading ? 'Adding Watermark...' : 'Apply Watermark'}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {watermarkedUrl && (
//               <div className="text-center mt-12">
//                 <p className="text-3xl font-bold text-green-600 mb-6">Watermark Added Successfully!</p>
//                 <a
//                   href={watermarkedUrl}
//                   download="watermarked-pdf.pdf"
//                   className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-xl px-12 py-6 rounded-2xl hover:from-green-700 hover:to-teal-700 transition shadow-2xl"
//                 >
//                   <Download size={36} />
//                   Download Watermarked PDF
//                 </a>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent mb-6">
//             Add Watermark to PDF Online Free - Protect Your Documents
//           </h2>
//           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
//             Add text watermark like "CONFIDENTIAL", "DRAFT", or copyright to all PDF pages instantly. Professional protection — completely free with PDF Linx.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-10 mb-20">
//           <div className="bg-gradient-to-br from-gray-50 to-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Type className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Custom Text</h3>
//             <p className="text-gray-600">Add any text — "CONFIDENTIAL", "DRAFT", "COPYRIGHT" etc.</p>
//           </div>

//           <div className="bg-gradient-to-br from-slate-50 to-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">All Pages</h3>
//             <p className="text-gray-600">Watermark applied to every page automatically.</p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Free & Private</h3>
//             <p className="text-gray-600">Add watermark unlimited times — no signup, no upload.</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
//           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
//             How to Add Watermark to PDF in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 1
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Upload PDF</h4>
//               <p className="text-gray-600 text-lg">Drop or select your PDF document.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 2
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Enter Text</h4>
//               <p className="text-gray-600 text-lg">Type your watermark text and adjust opacity.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 3
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Download</h4>
//               <p className="text-gray-600 text-lg">Save watermarked PDF instantly.</p>
//             </div>
//           </div>
//         </div>

//         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
//           Add watermark to PDFs every day with PDF Linx — trusted by professionals for fast, reliable, and completely free document protection.
//         </p>
//       </section>

//     <RelatedToolsSection currentPage="add-watermark" />
      
//     </>
//   );
// }

