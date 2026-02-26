'use client';

import { useState } from 'react';
import { Upload, Download, Smartphone, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Script from 'next/script';
import RelatedToolsSection from "@/components/RelatedTools";


export default function HeicToJpg() {
  const [converted, setConverted] = useState([]);
  const [loading, setLoading] = useState(false);

  const convert = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    setLoading(true);
    setConverted([]);

    try {
      const heic2any = (await import('heic2any')).default;

      const results = [];
      for (const file of files) {
        const jpgBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.94,
        });

        const jpgUrl = URL.createObjectURL(jpgBlob);
        results.push({
          name: file.name.replace(/\.heic$/i, '.jpg'),
          url: jpgUrl,
          originalName: file.name,
        });
      }

      setConverted(results);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Oops! Something went wrong with the conversion. Make sure you uploaded valid HEIC files and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-heic"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert HEIC to JPG Online for Free",
            description: "Convert iPhone HEIC photos to JPG format instantly.",
            url: "https://pdflinx.com/heic-to-jpg",
            step: [
              { "@type": "HowToStep", name: "Upload HEIC", text: "Select one or multiple HEIC files." },
              { "@type": "HowToStep", name: "Convert", text: "Click convert and wait." },
              { "@type": "HowToStep", name: "Download JPG", text: "Download converted JPG files." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-heic"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "HEIC to JPG", item: "https://pdflinx.com/heic-to-jpg" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              HEIC to JPG Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Got iPhone photos stuck in HEIC? Turn them into good old JPGs in seconds – works on any device, no quality loss, and you can do a bunch at once!
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-pink-300 rounded-xl p-10 text-center hover:border-purple-500 transition">
                <Upload className="w-16 h-16 mx-auto text-pink-600 mb-4" />
                <span className="text-xl font-semibold text-gray-800 block mb-2">
                  Drop your HEIC photos here or click to browse
                </span>
                <span className="text-gray-600 text-sm">
                  You can select multiple files • Straight from iPhone or iPad
                </span>
              </div>
              <input
                type="file"
                accept=".heic,.HEIC"
                multiple
                onChange={convert}
                className="hidden"
              />
            </label>

            {loading && (
              <div className="text-center mt-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
                <p className="mt-4 text-lg font-semibold text-purple-600">
                  Working on your photos...
                </p>
              </div>
            )}
          </div>

          {/* Converted Images */}
          {converted.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
                Your JPGs are ready!
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                      <p className="font-medium text-gray-800 mb-2 text-sm truncate">{item.name}</p>
                      <a
                        href={item.url}
                        download={item.name}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-md text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download JPG
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-center mt-6 text-gray-600 text-base">
            No sign-up • Convert as many as you want • Quality stays perfect • Totally free & private
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            HEIC to JPG Converter Online Free - iPhone Photos Made Simple
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            iPhones save pics in HEIC to save space, but that format doesn't play nice everywhere. Here, just drop your photos and grab JPG versions that open anywhere – Windows, Android, web, you name it. Batch mode, super fast, and zero cost on PDF Linx!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg border border-pink-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">iPhone Friendly</h3>
            <p className="text-gray-600 text-sm">
              Turns those fancy HEIC shots into classic JPGs everyone can open.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch Magic</h3>
            <p className="text-gray-600 text-sm">
              Upload a whole bunch at once – saves you tons of time.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Top Quality, Zero Cost</h3>
            <p className="text-gray-600 text-sm">
              Your photos stay crisp and beautiful – and it's always free.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Convert HEIC to JPG in 3 Quick Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Drop Your Photos</h4>
              <p className="text-gray-600 text-sm">Pick one or a bunch of HEIC files from your phone or computer.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">We Do the Work</h4>
              <p className="text-gray-600 text-sm">Conversion happens right in your browser – fast and smooth.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Grab Your JPGs</h4>
              <p className="text-gray-600 text-sm">Download them one by one – ready for anything.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          iPhone users hit up PDF Linx daily to turn HEIC into JPG – it's quick, keeps quality high, and never costs a penny.
        </p>
      </section>


      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          HEIC to JPG Converter Online (Free) – Convert iPhone HEIC Photos to JPG by PDFLinx
        </h2>

        {/* Intro */}
        <p className="text-base leading-7 mb-6">
          iPhone photos aksar HEIC format me save hoti hain — quality great hoti hai, lekin problem ye hai ke HEIC har jagah
          easily open ya upload nahi hota (Windows, websites, forms, etc.). Is liye humne banaya{" "}
          <span className="font-medium text-slate-900">PDFLinx HEIC to JPG Converter</span> —
          ek fast, free, aur easy tool jo aapki HEIC photos ko seconds me JPG me convert kar deta hai.
          Bas files upload karo, convert karo, aur JPG download kar lo. No signup, no watermark — batch conversion bhi supported.
        </p>

        {/* What is */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is HEIC and Why Convert It to JPG?
        </h3>
        <p className="leading-7 mb-6">
          HEIC (High Efficiency Image Container) Apple ka modern image format hai jo high quality ke sath less storage use karta
          hai. But HEIC compatibility limited ho sakti hai — especially Windows PCs, older Android devices, and many online
          platforms par. JPG is universally supported, is liye HEIC ko JPG me convert karna sharing, uploading, printing aur
          editing ke liye best option hota hai.
        </p>

        {/* Why use */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Use an Online HEIC to JPG Converter?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Open iPhone photos easily on Windows, Android, and any device</li>
          <li>Upload images on websites, forms, and social platforms without errors</li>
          <li>Convert multiple HEIC files in one go (batch mode)</li>
          <li>Keep images sharp and clean after conversion</li>
          <li>Save time — no apps or installs needed</li>
        </ul>

        {/* Steps */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Convert HEIC to JPG Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your HEIC photos (single or multiple files)</li>
          <li>Wait a moment — conversion happens instantly</li>
          <li>Preview the output (if available)</li>
          <li>Download your JPG images one by one (or as a batch if supported)</li>
          <li>Use JPGs anywhere: WhatsApp, emails, websites, editing tools, etc.</li>
        </ol>

        <p className="mb-6">
          No signup, unlimited conversions, high quality output — 100% free.
        </p>

        {/* Features box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx HEIC to JPG Converter
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>Free online HEIC to JPG converter</li>
            <li>iPhone & iPad HEIC photos supported</li>
            <li>Batch conversion (multiple files at once)</li>
            <li>Fast processing — results in seconds</li>
            <li>High-quality JPG output</li>
            <li>Works on mobile, tablet, and desktop</li>
            <li>No signup, no watermark, no installation</li>
            <li>Simple drag & drop upload</li>
          </ul>
        </div>

        {/* Audience */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>iPhone users:</strong> Convert HEIC photos to JPG for easy sharing</li>
          <li><strong>Windows users:</strong> Open iPhone images without compatibility issues</li>
          <li><strong>Students:</strong> Upload photos on portals and assignments easily</li>
          <li><strong>Office teams:</strong> Use images in documents, presentations, and emails</li>
          <li><strong>Everyone:</strong> Who wants quick HEIC to JPG conversion without apps</li>
        </ul>

        {/* Privacy */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx HEIC to JPG Converter Safe?
        </h3>
        <p className="leading-7 mb-6">
          Yes. No account is required, and the conversion is designed to be quick and privacy-friendly.
          Just upload your HEIC photos, convert them, and download JPGs instantly.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Convert iPhone HEIC Photos Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx HEIC to JPG works smoothly on Windows, macOS, Linux, Android, and iOS.
          Whether you’re on a phone, tablet, or desktop, you can convert HEIC photos into JPG in seconds using only your browser.
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
                Is HEIC to JPG conversion free?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — it’s completely free with unlimited conversions and downloads.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I convert multiple HEIC files at once?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — batch conversion is supported. Upload multiple HEIC photos and convert them together.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Will JPG quality be reduced?
              </summary>
              <p className="mt-2 text-gray-600">
                The conversion is optimized to keep your photos sharp and clear. Output quality depends on the original image.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Why does iPhone use HEIC?
              </summary>
              <p className="mt-2 text-gray-600">
                HEIC saves space while keeping high quality. But JPG is more compatible, so converting helps for sharing and uploads.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my photos stored anywhere?
              </summary>
              <p className="mt-2 text-gray-600">
                No — your photos are used only to generate the converted output. Nothing is stored.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I use this converter on mobile?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — it works perfectly on iPhone, Android, tablets, and desktops.
              </p>
            </details>
          </div>
        </div>
      </section>


      <RelatedToolsSection currentPage="heic-to-jpg" />

    </>
  );
}
























// 'use client';

// import { useState } from 'react';
// import { Upload, Download, Smartphone, Image as ImageIcon, CheckCircle } from 'lucide-react';
// import Script from 'next/script';
// import RelatedToolsSection from "@/components/RelatedTools";


// export default function HeicToJpg() {
//   const [converted, setConverted] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const convert = async (e) => {
//     const files = e.target.files;
//     if (!files?.length) return;

//     setLoading(true);
//     setConverted([]);

//     try {
//       const heic2any = (await import('heic2any')).default;

//       const results = [];
//       for (const file of files) {
//         const jpgBlob = await heic2any({
//           blob: file,
//           toType: 'image/jpeg',
//           quality: 0.94,
//         });

//         const jpgUrl = URL.createObjectURL(jpgBlob);
//         results.push({
//           name: file.name.replace(/\.heic$/i, '.jpg'),
//           url: jpgUrl,
//           originalName: file.name,
//         });
//       }

//       setConverted(results);
//     } catch (error) {
//       console.error('Conversion failed:', error);
//       alert('Error converting HEIC files. Please try again with valid HEIC images.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-heic"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert HEIC to JPG Online for Free",
//             description: "Convert iPhone HEIC photos to JPG format instantly.",
//             url: "https://pdflinx.com/heic-to-jpg",
//             step: [
//               { "@type": "HowToStep", name: "Upload HEIC", text: "Select one or multiple HEIC files." },
//               { "@type": "HowToStep", name: "Convert", text: "Click convert and wait." },
//               { "@type": "HowToStep", name: "Download JPG", text: "Download converted JPG files." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-heic"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "HEIC to JPG", item: "https://pdflinx.com/heic-to-jpg" }
//             ]
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6">
//               HEIC to JPG Converter <br /> Online (Free)
//             </h1>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Convert iPhone HEIC photos to JPG instantly. Batch support, high quality — perfect for Windows, Android, or sharing. 100% free, no signup.
//             </p>
//           </div>

//           {/* Upload Area */}
//           <div className="bg-white rounded-3xl shadow-2xl p-16 border border-gray-100 mb-12">
//             <label className="block cursor-pointer">
//               <div className="border-4 border-dashed border-pink-300 rounded-3xl p-24 text-center hover:border-purple-500 transition">
//                 <Upload className="w-28 h-28 mx-auto text-pink-600 mb-8" />
//                 <span className="text-3xl font-bold text-gray-800 block mb-4">
//                   Drop HEIC files here or click to upload
//                 </span>
//                 <span className="text-xl text-gray-600">
//                   Supports multiple files • iPhone & iPad photos
//                 </span>
//               </div>
//               <input
//                 type="file"
//                 accept=".heic,.HEIC"
//                 multiple
//                 onChange={convert}
//                 className="hidden"
//               />
//             </label>

//             {loading && (
//               <div className="text-center mt-12">
//                 <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-600"></div>
//                 <p className="mt-6 text-2xl font-bold text-purple-600">
//                   Converting your HEIC files...
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Converted Images */}
//           {converted.length > 0 && (
//             <div className="mb-12">
//               <h2 className="text-4xl font-bold text-center text-purple-700 mb-10">
//                 Converted JPG Files Ready!
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
//                 {converted.map((item, i) => (
//                   <div
//                     key={i}
//                     className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl overflow-hidden border border-purple-200 hover:shadow-3xl transition"
//                   >
//                     <img
//                       src={item.url}
//                       alt={item.name}
//                       className="w-full h-64 object-cover"
//                     />
//                     <div className="p-6 text-center">
//                       <p className="font-semibold text-gray-800 mb-4 truncate">{item.name}</p>
//                       <a
//                         href={item.url}
//                         download={item.name}
//                         className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
//                       >
//                         <Download size={24} />
//                         Download JPG
//                       </a>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <p className="text-center text-gray-600 text-lg">
//             No signup • Batch convert • High quality • 100% free & private
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
//         {/* Main Heading */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6">
//             HEIC to JPG Converter Online Free - Convert iPhone Photos Instantly
//           </h2>
//           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
//             Convert HEIC images from iPhone/iPad to JPG format in seconds. Batch conversion, high quality — perfect for viewing on Windows, Android, or sharing online. Completely free with PDF Linx.
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-10 mb-20">
//           <div className="bg-gradient-to-br from-pink-50 to-white p-10 rounded-3xl shadow-xl border border-pink-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Smartphone className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">iPhone Photos Compatible</h3>
//             <p className="text-gray-600">
//               Convert HEIC (iPhone default format) to universally supported JPG.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-10 rounded-3xl shadow-xl border border-purple-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <ImageIcon className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Batch Conversion</h3>
//             <p className="text-gray-600">
//               Convert multiple HEIC files at once — save time with bulk processing.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">High Quality & Free</h3>
//             <p className="text-gray-600">
//               Full quality preserved — no compression loss, completely free forever.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
//           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
//             How to Convert HEIC to JPG in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 1
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Upload HEIC Files</h4>
//               <p className="text-gray-600 text-lg">Drop or select one or multiple HEIC photos from your device.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 2
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Auto Convert</h4>
//               <p className="text-gray-600 text-lg">We convert HEIC to high-quality JPG instantly in browser.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 3
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Download JPG</h4>
//               <p className="text-gray-600 text-lg">Save your converted JPG files — ready for any device.</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
//           Convert HEIC to JPG every day with PDF Linx — trusted by iPhone users worldwide for fast, reliable, and completely free photo conversion.
//         </p>
//       </section>
//    <RelatedToolsSection currentPage="heic-to-jpg" />

//     </>
//   );
// }




















// "use client";

// import { useState } from "react";

// export default function HeicToJpg() {
//   const [converted, setConverted] = useState([]);

//   const convert = async (e) => {
//     const files = e.target.files;
//     if (!files?.length) return;

//     // ✅ Import heic2any dynamically inside client-only block
//     if (typeof window !== "undefined") {
//       try {
//         const heic2any = (await import("heic2any")).default;

//         const results = [];
//         for (const file of files) {
//           const jpgBlob = await heic2any({
//             blob: file,
//             toType: "image/jpeg",
//             quality: 0.94,
//           });
//           const jpgUrl = window.URL.createObjectURL(jpgBlob);
//           results.push({
//             name: file.name.replace(/\.heic$/i, ".jpg"),
//             url: jpgUrl,
//           });
//         }

//         setConverted(results);
//       } catch (error) {
//         console.error("Conversion failed:", error);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4">
//       <div className="max-w-6xl mx-auto text-center">
//         <h1 className="text-7xl font-black bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
//           HEIC → JPG Converter
//         </h1>
//         <p className="text-3xl text-gray-700 mb-10">
//           Convert iPhone photos to JPG — open them easily on Windows or Android!
//         </p>

//         <label className="cursor-pointer">
//           <input
//             type="file"
//             accept=".heic,.HEIC"
//             multiple
//             onChange={convert}
//             className="hidden"
//           />
//           <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-20 py-16 rounded-3xl shadow-2xl hover:scale-105 transition text-3xl font-bold">
//             Select HEIC Files
//           </div>
//         </label>

//         {converted.length > 0 && (
//           <div className="mt-16">
//             <h2 className="text-4xl font-bold text-purple-700 mb-8">
//               Converted JPGs Ready!
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//               {converted.map((item, i) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition"
//                 >
//                   <img
//                     src={item.url}
//                     alt="Converted preview"
//                     className="w-full h-48 object-cover"
//                   />
//                   <a
//                     href={item.url}
//                     download={item.name}
//                     className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 font-bold hover:opacity-90"
//                   >
//                     Download {item.name}
//                   </a>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


