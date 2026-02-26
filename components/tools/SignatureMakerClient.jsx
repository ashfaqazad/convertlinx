'use client';

import { useRef, useState, useEffect } from 'react';
import { Download, PenTool, Palette, Trash2, CheckCircle } from 'lucide-react';
import Script from 'next/script';
import RelatedToolsSection from "@/components/RelatedTools";


export default function SignatureMakerClient() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [bgColor]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: x * scaleX,
      y: y * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "my-signature.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-signature"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Create Digital Signature Online for Free",
            description: "Make professional signatures by drawing or typing instantly.",
            url: "https://pdflinx.com/signature-maker",
            step: [
              { "@type": "HowToStep", name: "Choose Method", text: "Draw with mouse/finger or type your name." },
              { "@type": "HowToStep", name: "Customize", text: "Change color, style, and thickness." },
              { "@type": "HowToStep", name: "Download", text: "Download transparent PNG signature." }
            ],
            totalTime: "PT40S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-signature"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Signature Maker", item: "https://pdflinx.com/signature-maker" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Signature Maker <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hey, whip up a cool digital signature in seconds! Just doodle with your mouse or finger, tweak the color to match your vibe, and snag it as a clean PNG. Totally free, no fuss.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-indigo-600" />
                <span className="font-semibold text-sm">Pen Color:</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 rounded-full cursor-pointer border-2 border-indigo-200"
                />
              </div>

              <button
                onClick={clear}
                className="bg-red-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-700 transition flex items-center gap-2 shadow-md text-sm"
              >
                <Trash2 size={18} />
                Clear Canvas
              </button>

              <button
                onClick={download}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-green-700 hover:to-teal-700 transition flex items-center gap-2 shadow-md text-sm"
              >
                <Download size={18} />
                Download Signature (PNG)
              </button>
            </div>

            {/* Canvas */}
            <div className="w-full max-w-3xl mx-auto">
              <canvas
                ref={canvasRef}
                width={900}
                height={350}
                className="w-full h-[200px] sm:h-[250px] md:h-[300px] border-2 border-indigo-300 rounded-xl shadow-md cursor-crosshair bg-white touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            <p className="text-center mt-6 text-gray-600 text-base">
              💡 Quick tip: Swipe with your finger on mobile or drag the mouse on desktop – it'll feel just like scribbling on paper!
            </p>
          </div>

          <p className="text-center mt-6 text-gray-600 text-base">
            No login hassle • Make as many as you want • See-through background • All yours for free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Signature Maker Online Free - Whip Up Your Digital Sig in a Flash
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need a slick digital signature that looks hand-drawn? Just sketch it out right here – mouse, finger, whatever works. Pick a color that screams "you," and download a crystal-clear PNG with no background drama. Perfect for docs, emails, or anywhere you wanna sign off in style. Oh, and it's all free on PDF Linx – no strings attached!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Feels Like Real Ink</h3>
            <p className="text-gray-600 text-sm">
              Scribble away with your mouse or finger – it's so natural, you'll forget it's digital!
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Style, Your Way</h3>
            <p className="text-gray-600 text-sm">
              Go bold with colors or keep it classic – match it to your brand or just your mood today.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Ready to Rock</h3>
            <p className="text-gray-600 text-sm">
              Grab that transparent PNG and slap it on PDFs, emails, or contracts – instant pro vibe.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Nail Your Digital Signature in 3 Easy Moves
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Sketch It Out</h4>
              <p className="text-gray-600 text-sm">Grab your mouse (or poke the screen on mobile) and just sign like it's no big deal.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Add Some Flair</h4>
              <p className="text-gray-600 text-sm">Pick a pen color that feels right – blue for chill, red for boss mode.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Save & Shine</h4>
              <p className="text-gray-600 text-sm">Hit download for your see-through PNG – ready to sign anything, anywhere.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Folks love firing up fresh signatures daily with PDF Linx – it's that quick, fun, and zero-cost way to add your personal touch.
        </p>
      </section>


      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Signature Maker Online (Free) – Create Digital Signatures Instantly by PDFLinx
        </h2>

        {/* Intro */}
        <p className="text-base leading-7 mb-6">
          Need a quick digital signature for documents, contracts, or emails — but don’t want to print, sign, and scan every time?
          That’s why we built the{" "}
          <span className="font-medium text-slate-900">PDFLinx Signature Maker</span>.
          Simply draw your signature using your mouse, stylus, or finger, customize its color, and download it as a clean PNG file.
          No signup, no watermark, and works smoothly on mobile and desktop.
        </p>

        {/* What is */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is a Digital Signature Maker?
        </h3>
        <p className="leading-7 mb-6">
          A digital signature maker allows you to create handwritten-style signatures online.
          Instead of signing documents manually on paper, you can draw your signature digitally and reuse it for PDFs,
          contracts, forms, and online paperwork. It saves time, reduces printing, and makes document signing faster and easier.
        </p>

        {/* Why use */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Use an Online Signature Maker?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Create signatures instantly without printing or scanning</li>
          <li>Draw signatures using mouse, stylus, or mobile touch</li>
          <li>Customize signature color and style</li>
          <li>Download transparent PNG signatures for documents</li>
          <li>Save time when signing contracts, PDFs, and forms</li>
        </ul>

        {/* Steps */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Create a Digital Signature Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Draw your signature using mouse, stylus, or finger</li>
          <li>Choose your preferred pen color</li>
          <li>Adjust or redraw until it looks perfect</li>
          <li>Download the signature as PNG (transparent background)</li>
          <li>Use it in PDFs, documents, emails, and forms</li>
        </ol>

        <p className="mb-6">
          Unlimited signatures, instant downloads — completely free and easy to use.
        </p>

        {/* Features box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Signature Maker
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>Free online handwritten signature creator</li>
            <li>Draw signatures using mouse, stylus, or touch</li>
            <li>Custom pen color selection</li>
            <li>Download transparent PNG signature</li>
            <li>Clear canvas and redraw anytime</li>
            <li>Works on mobile, tablet, and desktop</li>
            <li>No signup, no watermark, no installation</li>
            <li>Simple and user-friendly interface</li>
          </ul>
        </div>

        {/* Audience */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Business professionals:</strong> Sign contracts, agreements, and forms</li>
          <li><strong>Freelancers:</strong> Add signatures to invoices and proposals</li>
          <li><strong>Students:</strong> Sign academic forms and documents</li>
          <li><strong>Remote workers:</strong> Sign documents without printing</li>
          <li><strong>Anyone:</strong> Who wants a quick reusable digital signature</li>
        </ul>

        {/* Safety */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Signature Maker Safe to Use?
        </h3>
        <p className="leading-7 mb-6">
          Yes. You don’t need to create an account or upload personal documents.
          Your signature is generated directly on your device and downloaded instantly.
          The tool is designed to be fast, simple, and privacy-friendly.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Create Digital Signatures Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx Signature Maker works smoothly on Windows, macOS, Linux, Android, and iOS.
          Whether you’re using a phone, tablet, or computer, you can create and download signatures instantly using your browser.
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
                Is the Signature Maker free to use?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — it’s completely free with unlimited signature creation and downloads.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I create signatures on mobile?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — you can draw your signature using your finger on mobile devices or stylus on tablets.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                In which format can I download my signature?
              </summary>
              <p className="mt-2 text-gray-600">
                You can download your signature as a transparent PNG file for easy use in documents and PDFs.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I change signature color?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — you can choose different pen colors before downloading your signature.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my signatures stored anywhere?
              </summary>
              <p className="mt-2 text-gray-600">
                No — your signature is generated only for download. Nothing is stored.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I reuse my signature later?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — simply save the downloaded PNG file and reuse it in any document or form.
              </p>
            </details>
          </div>
        </div>
      </section>


      <RelatedToolsSection currentPage="signature-maker" />
    </>
  );
}




















// 'use client';

// import { useRef, useState, useEffect } from 'react';
// import { Download, PenTool, Palette, Trash2, CheckCircle } from 'lucide-react';
// import Script from 'next/script';
// import RelatedToolsSection from "@/components/RelatedTools";


// export default function SignatureMakerClient() {
//   const canvasRef = useRef(null);
//   const [drawing, setDrawing] = useState(false);
//   const [color, setColor] = useState("#000000");
//   const [bgColor, setBgColor] = useState("#ffffff");

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     ctx.fillStyle = bgColor;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   }, [bgColor]);

//   const getCoordinates = (e) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return { x: 0, y: 0 };
//     const rect = canvas.getBoundingClientRect();
//     let x, y;

//     if (e.touches && e.touches.length > 0) {
//       x = e.touches[0].clientX - rect.left;
//       y = e.touches[0].clientY - rect.top;
//     } else {
//       x = e.clientX - rect.left;
//       y = e.clientY - rect.top;
//     }

//     const scaleX = canvas.width / rect.width;
//     const scaleY = canvas.height / rect.height;

//     return {
//       x: x * scaleX,
//       y: y * scaleY,
//     };
//   };

//   const startDrawing = (e) => {
//     e.preventDefault();
//     const { x, y } = getCoordinates(e);
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     setDrawing(true);
//   };

//   const draw = (e) => {
//     e.preventDefault();
//     if (!drawing) return;
//     const { x, y } = getCoordinates(e);
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.lineWidth = 3;
//     ctx.lineCap = "round";
//     ctx.strokeStyle = color;
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     setDrawing(false);
//   };

//   const clear = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = bgColor;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   };

//   const download = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const link = document.createElement("a");
//     link.download = "my-signature.png";
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-signature"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Create Digital Signature Online for Free",
//             description: "Make professional signatures by drawing or typing instantly.",
//             url: "https://pdflinx.com/signature-maker",
//             step: [
//               { "@type": "HowToStep", name: "Choose Method", text: "Draw with mouse/finger or type your name." },
//               { "@type": "HowToStep", name: "Customize", text: "Change color, style, and thickness." },
//               { "@type": "HowToStep", name: "Download", text: "Download transparent PNG signature." }
//             ],
//             totalTime: "PT40S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-signature"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Signature Maker", item: "https://pdflinx.com/signature-maker" }
//             ]
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
//         <div className="max-w-5xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
//               Signature Maker <br /> Online (Free)
//             </h1>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Create professional digital signatures instantly. Draw with mouse/finger, customize color — download transparent PNG. 100% free, no signup.
//             </p>
//           </div>

//           {/* Tool Card */}
//           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
//             {/* Controls */}
//             <div className="flex flex-wrap justify-center gap-6 mb-10">
//               <div className="flex items-center gap-4">
//                 <Palette className="w-8 h-8 text-indigo-600" />
//                 <span className="font-semibold">Pen Color:</span>
//                 <input
//                   type="color"
//                   value={color}
//                   onChange={(e) => setColor(e.target.value)}
//                   className="w-16 h-16 rounded-full cursor-pointer border-4 border-indigo-200"
//                 />
//               </div>

//               <button
//                 onClick={clear}
//                 className="bg-red-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-red-700 transition flex items-center gap-3 shadow-lg"
//               >
//                 <Trash2 size={24} />
//                 Clear Canvas
//               </button>

//               <button
//                 onClick={download}
//                 className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold px-10 py-4 rounded-xl hover:from-green-700 hover:to-teal-700 transition flex items-center gap-3 shadow-lg"
//               >
//                 <Download size={28} />
//                 Download Signature (PNG)
//               </button>
//             </div>

//             {/* Canvas */}
//             <div className="w-full max-w-4xl mx-auto">
//               <canvas
//                 ref={canvasRef}
//                 width={900}
//                 height={350}
//                 className="w-full h-[250px] sm:h-[300px] md:h-[350px] border-4 border-indigo-300 rounded-3xl shadow-2xl cursor-crosshair bg-white touch-none"
//                 onMouseDown={startDrawing}
//                 onMouseMove={draw}
//                 onMouseUp={stopDrawing}
//                 onMouseLeave={stopDrawing}
//                 onTouchStart={startDrawing}
//                 onTouchMove={draw}
//                 onTouchEnd={stopDrawing}
//               />
//             </div>

//             <p className="text-center mt-8 text-gray-600 text-lg">
//               💡 Tip: Use mouse on desktop or finger on mobile/tablet for natural handwriting!
//             </p>
//           </div>

//           <p className="text-center mt-10 text-gray-600">
//             No signup • Unlimited signatures • Transparent background • 100% free
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
//         {/* Main Heading */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
//             Signature Maker Online Free - Create Digital Signature Instantly
//           </h2>
//           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
//             Design professional handwritten or styled signatures online. Draw naturally with mouse or finger, customize color — download transparent PNG for documents, emails, and forms. Completely free with PDF Linx.
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-10 mb-20">
//           <div className="bg-gradient-to-br from-indigo-50 to-white p-10 rounded-3xl shadow-xl border border-indigo-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <PenTool className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Natural Handwriting</h3>
//             <p className="text-gray-600">
//               Draw freely with mouse or finger — feels like signing on paper.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-10 rounded-3xl shadow-xl border border-purple-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Palette className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Fully Customizable</h3>
//             <p className="text-gray-600">
//               Choose any color for pen — perfect for matching brand or style.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Transparent & Ready</h3>
//             <p className="text-gray-600">
//               Download as transparent PNG — ready for Word, PDF, email signatures.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
//           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
//             How to Create Digital Signature in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 1
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Draw Your Signature</h4>
//               <p className="text-gray-600 text-lg">Use mouse or finger to sign naturally on the canvas.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 2
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Customize Color</h4>
//               <p className="text-gray-600 text-lg">Pick any pen color to match your style or brand.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 3
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Download PNG</h4>
//               <p className="text-gray-600 text-lg">Save transparent signature for documents and emails.</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
//           Create professional signatures every day with PDF Linx — trusted by thousands for easy, fast, and completely free digital signature creation.
//         </p>
//       </section>
//     </>
//   );
// }






















// // "use client";

// // import { useRef, useState, useEffect } from "react";

// // export default function SignatureMakerClient() {
// //   const canvasRef = useRef(null);
// //   const [drawing, setDrawing] = useState(false);
// //   const [color, setColor] = useState("#000000");
// //   const [bgColor, setBgColor] = useState("#ffffff");

// //   useEffect(() => {
// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext("2d");
// //     ctx.fillStyle = bgColor;
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
// //   }, [bgColor]);

// //   const getCoordinates = (e) => {
// //     const canvas = canvasRef.current;
// //     const rect = canvas.getBoundingClientRect();
// //     let x, y;

// //     if (e.touches && e.touches.length > 0) {
// //       x = e.touches[0].clientX - rect.left;
// //       y = e.touches[0].clientY - rect.top;
// //     } else {
// //       x = e.clientX - rect.left;
// //       y = e.clientY - rect.top;
// //     }

// //     // Scaling fix (for responsive canvas)
// //     const scaleX = canvas.width / rect.width;
// //     const scaleY = canvas.height / rect.height;

// //     return {
// //       x: x * scaleX,
// //       y: y * scaleY,
// //     };
// //   };

// //   const startDrawing = (e) => {
// //     const { x, y } = getCoordinates(e);
// //     const ctx = canvasRef.current.getContext("2d");
// //     ctx.beginPath();
// //     ctx.moveTo(x, y);
// //     setDrawing(true);
// //   };

// //   const draw = (e) => {
// //     if (!drawing) return;
// //     const { x, y } = getCoordinates(e);
// //     const ctx = canvasRef.current.getContext("2d");
// //     ctx.lineWidth = 2;
// //     ctx.lineCap = "round";
// //     ctx.strokeStyle = color;
// //     ctx.lineTo(x, y);
// //     ctx.stroke();
// //   };

// //   const stopDrawing = () => {
// //     setDrawing(false);
// //   };

// //   const clear = () => {
// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext("2d");
// //     ctx.clearRect(0, 0, canvas.width, canvas.height);
// //     ctx.fillStyle = bgColor;
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
// //   };

// //   const download = () => {
// //     const canvas = canvasRef.current;
// //     const link = document.createElement("a");
// //     link.download = "signature.png";
// //     link.href = canvas.toDataURL("image/png");
// //     link.click();
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
// //       <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center">
// //         <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-2">
// //           Free Signature Maker
// //         </h1>
// //         <p className="text-lg md:text-xl text-gray-600 mb-10">
// //           Draw or type → Download transparent PNG signature!
// //         </p>

// //         <div className="flex justify-center gap-4 mb-8 flex-wrap">
// //           <input
// //             type="color"
// //             value={color}
// //             onChange={(e) => setColor(e.target.value)}
// //             className="w-12 h-12 md:w-16 md:h-16 rounded-full cursor-pointer"
// //           />
// //           <button
// //             onClick={clear}
// //             className="bg-red-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold hover:bg-red-700"
// //           >
// //             Clear
// //           </button>
// //           <button
// //             onClick={download}
// //             className="bg-green-600 text-white px-8 py-3 md:px-10 md:py-4 rounded-xl font-bold hover:bg-green-700"
// //           >
// //             Download PNG
// //           </button>
// //         </div>

// //         <div className="w-full max-w-[800px] mx-auto">
// //           <canvas
// //             ref={canvasRef}
// //             width={800}
// //             height={300}
// //             className="w-full h-[180px] sm:h-[220px] md:h-[300px] border-4 border-indigo-300 rounded-2xl shadow-2xl cursor-crosshair bg-white"
// //             onMouseDown={startDrawing}
// //             onMouseMove={draw}
// //             onMouseUp={stopDrawing}
// //             onMouseLeave={stopDrawing}
// //             onTouchStart={startDrawing}
// //             onTouchMove={draw}
// //             onTouchEnd={stopDrawing}
// //           />
// //         </div>

// //         <p className="mt-10 text-gray-600 text-sm md:text-base">
// //           Tip: Sign with your mouse or finger on mobile!
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }


