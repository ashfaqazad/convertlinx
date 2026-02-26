'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Link, Wifi, MessageCircle, Download } from 'lucide-react'; // Icons ke liye
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";




export default function QRGenerator() {
  const [text, setText] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (text && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, text, { width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [text]);

  return (
    <>


      <Script id="howto-schema-qr" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Create Custom QR Code Online for Free",
          description: "Generate QR codes for URLs, text, WiFi, vCard in seconds - completely free.",
          url: "https://pdflinx.com/qr-generator",
          step: [
            { "@type": "HowToStep", name: "Enter Data", text: "Paste URL, text, or contact details." },
            { "@type": "HowToStep", name: "Customize", text: "Add colors, logo, change style." },
            { "@type": "HowToStep", name: "Download", text: "Download high-resolution PNG or SVG." }
          ],
          totalTime: "PT30S",
          estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
          image: "https://pdflinx.com/og-image.png"
        }, null, 2)
      }} />

      <Script id="breadcrumb-schema-qr" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
            { "@type": "ListItem", position: 2, name: "QR Code Generator", item: "https://pdflinx.com/qr-generator" }
          ]
        }, null, 2)
      }} />



      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              QR Code Generator Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create custom QR codes instantly for URLs, text, WiFi, WhatsApp, vCard & more — 100% free, no signup, high quality download.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL, text, Wi-Fi password, contact, WhatsApp number..."
              className="w-full p-4 text-base border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none mb-6 transition"
            />

            <div className="flex justify-center mb-6">
              {text ? (
                <canvas ref={canvasRef} className="border-2 border-purple-200 rounded-xl shadow-md" />
              ) : (
                <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 text-center p-4">
                  Enter text above to generate QR code
                </div>
              )}
            </div>

            {text && (
              <div className="text-center">
                <button
                  onClick={() => {
                    const url = canvasRef.current.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'qr-code-pdflinx.png';
                    link.click();
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg px-8 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition shadow-md flex items-center gap-2 mx-auto"
                >
                  <Download size={20} />
                  Download QR Code (PNG)
                </button>
              </div>
            )}
          </div>

          <p className="text-center mt-6 text-gray-600 text-base">
            No signup • Unlimited use • Files not stored • 100% free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION - QR CODE GENERATOR ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            QR Code Generator Online Free - Create Custom QR Instantly
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Generate professional QR codes for websites, WiFi, WhatsApp, contacts, text, and more. Fully customizable, high-resolution, and completely free with PDF Linx.
          </p>
        </div>

        {/* Benefits Grid - 3 Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Any Content Type</h3>
            <p className="text-gray-600 text-sm">
              Create QR for URLs, text, WiFi password, WhatsApp chat, vCard, email, phone — everything supported.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wifi className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">High Quality & Customizable</h3>
            <p className="text-gray-600 text-sm">
              Download in high-resolution PNG. Works perfectly on print and digital. Fast scanning guaranteed.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast, Secure & Free</h3>
            <p className="text-gray-600 text-sm">
              Generate unlimited QR codes instantly. No signup, no data stored, completely private and free forever.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Create QR Code in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Enter Your Data</h4>
              <p className="text-gray-600 text-sm">Type or paste URL, text, WiFi details, contact, or message.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">QR Code Appears</h4>
              <p className="text-gray-600 text-sm">Your custom QR code generates instantly with perfect quality.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download & Use</h4>
              <p className="text-gray-600 text-sm">Download high-quality PNG and use on posters, cards, websites.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Create professional QR codes every day with PDF Linx — trusted by thousands for fast, reliable, and free QR generation.
        </p>
      </section>


      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
  {/* Heading */}
  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
    QR Code Generator – Free Online QR Code Generator by PDFLinx
  </h2>

  {/* Intro */}
  <p className="text-base leading-7 mb-6">
    Need to share a website link, WiFi password, WhatsApp number, or contact details quickly?
    Typing long links or information can be frustrating and time-consuming.
    That’s why we built the <span className="font-medium text-slate-900">PDFLinx QR Code Generator</span> —
    a simple, fast, and completely free online tool that lets you create high-quality QR codes in seconds.
    No sign-up, no watermarks, and no software installation required.
  </p>

  {/* What is */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    What Is a QR Code?
  </h3>
  <p className="leading-7 mb-6">
    A QR code (Quick Response code) is a scannable code that instantly opens digital information
    when scanned with a smartphone camera. It can store URLs, plain text, WiFi credentials,
    WhatsApp chat links, email addresses, or contact information.
    QR codes make sharing information faster, cleaner, and more convenient.
  </p>

  {/* Why use */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Why Use a QR Code Generator?
  </h3>
  <ul className="space-y-2 mb-6 list-disc pl-6">
    <li>Share website links instantly without typing</li>
    <li>Let users connect to WiFi without revealing passwords</li>
    <li>Create quick access to WhatsApp chats or phone numbers</li>
    <li>Share contact details using a single scan</li>
    <li>Perfect for posters, menus, business cards, and events</li>
  </ul>

  {/* Steps */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    How to Generate a QR Code Online
  </h3>
  <ol className="space-y-2 mb-6 list-decimal pl-6">
    <li>Enter or paste your data (URL, text, WiFi details, WhatsApp number, or contact)</li>
    <li>Your QR code is generated instantly with a live preview</li>
    <li>Download the QR code in high-quality image format</li>
    <li>Use it anywhere — print it or share it digitally</li>
  </ol>

  <p className="mb-6">
    No registration, no usage limits, and no hidden restrictions — 100% free and easy to use.
  </p>

  {/* Features box */}
  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
    <h3 className="text-xl font-semibold text-slate-900 mb-4">
      Features of PDFLinx QR Code Generator
    </h3>
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
      <li>Completely free QR code generator</li>
      <li>Supports URLs, text, WiFi, WhatsApp, email, and contacts</li>
      <li>Instant QR code generation with live preview</li>
      <li>High-quality image downloads</li>
      <li>Fast, reliable, and easy to use</li>
      <li>Works perfectly on mobile and desktop</li>
      <li>No data storage — full privacy protection</li>
    </ul>
  </div>

  {/* Audience */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Who Should Use This Tool?
  </h3>
  <ul className="space-y-2 mb-6 list-disc pl-6">
    <li><strong>Businesses:</strong> Add QR codes to business cards, flyers, and packaging</li>
    <li><strong>Restaurants:</strong> Share digital menus using QR codes</li>
    <li><strong>Event Organizers:</strong> Provide instant access to tickets and event details</li>
    <li><strong>Students & Teachers:</strong> Share study resources and links easily</li>
    <li><strong>Anyone:</strong> Who wants fast, contactless information sharing</li>
  </ul>

  {/* Safety */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Is PDFLinx QR Code Generator Safe to Use?
  </h3>
  <p className="leading-7 mb-6">
    Yes, it is completely safe. Your input is only used to generate the QR code
    and is not stored or shared.
    We respect your privacy and ensure a secure, trustworthy experience every time.
  </p>

  {/* Closing */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Create QR Codes Anytime, Anywhere
  </h3>
  <p className="leading-7">
    PDFLinx QR Code Generator works smoothly on Windows, macOS, Linux, Android, and iOS.
    Whether you are on a phone, tablet, or computer, you can generate QR codes instantly
    using just your browser and an internet connection.
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
          Is the QR Code Generator free to use?
        </summary>
        <p className="mt-2 text-gray-600">
          Yes, it is completely free with no sign-up or hidden costs.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          What types of QR codes can I create?
        </summary>
        <p className="mt-2 text-gray-600">
          You can generate QR codes for websites, text, WiFi networks, WhatsApp chats,
          email addresses, and contact details.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Do I need to install any software?
        </summary>
        <p className="mt-2 text-gray-600">
          No installation is required. Everything works directly in your browser.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Will the QR code work for printing?
        </summary>
        <p className="mt-2 text-gray-600">
          Yes, QR codes are generated in high quality and are suitable for printing on
          posters, flyers, and business cards.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Are my QR codes private?
        </summary>
        <p className="mt-2 text-gray-600">
          Yes. We do not store your data, and your content remains private.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Can I generate QR codes on my phone?
        </summary>
        <p className="mt-2 text-gray-600">
          Absolutely. The tool works perfectly on mobile phones, tablets, and desktops.
        </p>
      </details>

    </div>
  </div>
</section>



      <RelatedToolsSection currentPage="qr-generator" />

    </>
  );
}




















// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import QRCode from 'qrcode';
// import { Link, Wifi, MessageCircle, Download } from 'lucide-react'; // Icons ke liye
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";





// export default function QRGenerator() {
//   const [text, setText] = useState('');
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (text && canvasRef.current) {
//       QRCode.toCanvas(canvasRef.current, text, { width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } }, (error) => {
//         if (error) console.error(error);
//       });
//     }
//   }, [text]);

//   return (
//     <>


//       <Script id="howto-schema-qr" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
//         __html: JSON.stringify({
//           "@context": "https://schema.org",
//           "@type": "HowTo",
//           name: "How to Create Custom QR Code Online for Free",
//           description: "Generate QR codes for URLs, text, WiFi, vCard in seconds - completely free.",
//           url: "https://pdflinx.com/qr-generator",
//           step: [
//             { "@type": "HowToStep", name: "Enter Data", text: "Paste URL, text, or contact details." },
//             { "@type": "HowToStep", name: "Customize", text: "Add colors, logo, change style." },
//             { "@type": "HowToStep", name: "Download", text: "Download high-resolution PNG or SVG." }
//           ],
//           totalTime: "PT30S",
//           estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//           image: "https://pdflinx.com/og-image.png"
//         }, null, 2)
//       }} />

//       <Script id="breadcrumb-schema-qr" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
//         __html: JSON.stringify({
//           "@context": "https://schema.org",
//           "@type": "BreadcrumbList",
//           itemListElement: [
//             { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//             { "@type": "ListItem", position: 2, name: "QR Code Generator", item: "https://pdflinx.com/qr-generator" }
//           ]
//         }, null, 2)
//       }} />



//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
//         <div className="max-w-3xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
//               QR Code Generator <br /> Online (Free)
//             </h1>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Create custom QR codes instantly for URLs, text, WiFi, WhatsApp, vCard & more — 100% free, no signup, high quality download.
//             </p>
//           </div>

//           {/* Tool Card */}
//           <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
//             <input
//               type="text"
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder="Enter URL, text, Wi-Fi password, contact, WhatsApp number..."
//               className="w-full p-5 text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none mb-8 transition"
//             />

//             <div className="flex justify-center mb-8">
//               {text ? (
//                 <canvas ref={canvasRef} className="border-4 border-purple-200 rounded-2xl shadow-xl" />
//               ) : (
//                 <div className="w-80 h-80 border-4 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-500 text-center p-8">
//                   Enter text above to generate QR code
//                 </div>
//               )}
//             </div>

//             {text && (
//               <div className="text-center">
//                 <button
//                   onClick={() => {
//                     const url = canvasRef.current.toDataURL('image/png');
//                     const link = document.createElement('a');
//                     link.href = url;
//                     link.download = 'qr-code-pdflinx.png';
//                     link.click();
//                   }}
//                   className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xl px-10 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition shadow-lg flex items-center gap-3 mx-auto"
//                 >
//                   <Download size={28} />
//                   Download QR Code (PNG)
//                 </button>
//               </div>
//             )}
//           </div>

//           <p className="text-center mt-6 text-gray-600 text-sm">
//             No signup • Unlimited use • Files not stored • 100% free
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION - QR CODE GENERATOR ==================== */}
//       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
//         {/* Main Heading */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
//             QR Code Generator Online Free - Create Custom QR Instantly
//           </h2>
//           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
//             Generate professional QR codes for websites, WiFi, WhatsApp, contacts, text, and more. Fully customizable, high-resolution, and completely free with PDF Linx.
//           </p>
//         </div>

//         {/* Benefits Grid - 3 Cards */}
//         <div className="grid md:grid-cols-3 gap-10 mb-20">
//           <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-3xl shadow-xl border border-blue-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Link className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Any Content Type</h3>
//             <p className="text-gray-600">
//               Create QR for URLs, text, WiFi password, WhatsApp chat, vCard, email, phone — everything supported.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-10 rounded-3xl shadow-xl border border-purple-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Wifi className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">High Quality & Customizable</h3>
//             <p className="text-gray-600">
//               Download in high-resolution PNG. Works perfectly on print and digital. Fast scanning guaranteed.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <MessageCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast, Secure & Free</h3>
//             <p className="text-gray-600">
//               Generate unlimited QR codes instantly. No signup, no data stored, completely private and free forever.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
//           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
//             How to Create QR Code in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 1
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Enter Your Data</h4>
//               <p className="text-gray-600 text-lg">Type or paste URL, text, WiFi details, contact, or message.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 2
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">QR Code Appears</h4>
//               <p className="text-gray-600 text-lg">Your custom QR code generates instantly with perfect quality.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 3
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Download & Use</h4>
//               <p className="text-gray-600 text-lg">Download high-quality PNG and use on posters, cards, websites.</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
//           Create professional QR codes every day with PDF Linx — trusted by thousands for fast, reliable, and free QR generation.
//         </p>
//       </section>
//       <RelatedToolsSection currentPage="qr-generator" />

//     </>
//   );
// }




















// // 'use client';

// // import { useState, useEffect, useRef } from 'react';
// // import QRCode from 'qrcode';   // ← sirf ye install karna hai: npm install qrcode




// // export default function QRGenerator() {
// //   const [text, setText] = useState('');
// //   const canvasRef = useRef(null);

// //   useEffect(() => {
// //     if (text && canvasRef.current) {
// //       QRCode.toCanvas(canvasRef.current, text, { width: 280, margin: 2 }, (error) => {
// //         if (error) console.error(error);
// //       });
// //     }
// //   }, [text]);

// //   return (


// // <>
// //     <div className="min-h-screen bg-gray-50 py-12 px-4">
// //       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
// //         <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
// //           Free QR Code Generator
// //         </h1>

// //         <input
// //           type="text"
// //           value={text}
// //           onChange={(e) => setText(e.target.value)}
// //           placeholder="Enter URL, text, WhatsApp, Wi-Fi..."
// //           className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none mb-6"
// //         />


// //         {/* Ye canvas hai — yahan QR banega */}
// //         <div className="flex justify-center">
// //           {text ? (
// //             <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-lg" />
// //           ) : (
// //             <div className="w-72 h-72 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
// //               Enter text to generate QR
// //             </div>
// //           )}
// //         </div>

// //         {/* Download button (optional bonus) */}
// //         {text && (
// //           <div className="text-center mt-6">
// //             <a
// //               href="#"
// //               onClick={(e) => {
// //                 e.preventDefault();
// //                 const url = canvasRef.current.toDataURL('image/png');
// //                 const link = document.createElement('a');
// //                 link.href = url;
// //                 link.download = 'qr-code.png';
// //                 link.click();
// //               }}
// //               className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-block"
// //             >
// //               Download QR Code
// //             </a>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //     </>
// //   );
// // }