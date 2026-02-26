// app/compress-pdf/CompressPdfClient.jsx

"use client";
import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, FileDown, Scissors } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";



export default function CompressPDF() {
  // const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // const handleFileChange = (e) => setFile(e.target.files[0] || null);
  const handleFileChange = (e) => setFiles(Array.from(e.target.files || []));


  const handleCompress = async (e) => {
    e.preventDefault();
    // if (!file) return alert("Please select a PDF file first");
    if (!files.length) return alert("Please select PDF file(s) first");


    setLoading(true);
    setDownloadUrl("");
    setSuccess(false);

    // const formData = new FormData();
    // formData.append("file", file);
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/convert/compress-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        // setDownloadUrl(data.download);


        setSuccess(true);
        // ✅ YE 8 LINES ADD KARO
        setTimeout(() => {
          const downloadSection = document.getElementById('download-section');
          if (downloadSection) {
            downloadSection.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }, 300);

      } else {
        alert("Compression failed: " + (data.error || "Try again"));
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // a.download = file ? file.name.replace(/\.pdf$/i, "-compressed.pdf") : "compressed.pdf";
      a.download = files.length > 1 ? "compressed-files.zip" : files[0].name.replace(/\.pdf$/i, "-compressed.pdf");

      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

      {/* HowTo Schema - Compress PDF */}
      <Script
        id="howto-schema-compress"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Compress PDF Online for Free",
            description: "Reduce PDF file size up to 90% while keeping quality intact. Completely free, no signup needed.",
            url: "https://pdflinx.com/compress-pdf",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Click the upload area and select your PDF file." },
              { "@type": "HowToStep", name: "Compress", text: "Click 'Compress PDF' and wait a few seconds." },
              { "@type": "HowToStep", name: "Download", text: "Download your smaller, optimized PDF file instantly." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      {/* Breadcrumb Schema - Compress PDF */}
      <Script
        id="breadcrumb-schema-compress"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Compress PDF", item: "https://pdflinx.com/compress-pdf" }
            ]
          }, null, 2),
        }}
      />
      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Compress PDF Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Got a huge PDF that's too big to email or upload? We'll shrink it down (up to 90% smaller) while keeping it looking sharp. Super quick and totally free!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleCompress} className="space-y-6">
              {/* Upload Area */}
              <div className="relative">
                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all 
                    ${files.length > 0 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}
                          `}>
                    <FileDown className="w-12 h-12 mx-auto mb-3 text-blue-600" />

                    {/* <p className="text-lg font-semibold text-gray-700"> */}
                      {/* {file ? file.name : "Drop your PDF here or click to upload"} */}
                      {/* {files.length > 0 && (
                        <ul className="mt-3 text-left text-sm text-gray-700 space-y-1">
                          {files.map((f) => (
                            <li key={f.name} className="truncate">• {f.name}</li>
                          ))}
                        </ul>
                      )}
                    </p> */}

                    <p className="text-lg font-semibold text-gray-700">
                      {files.length === 0
                        ? "Drop your PDF here or click to upload"
                        : `${files.length} PDF(s) selected`}
                    </p>

                    {files.length > 0 && (
                      <ul className="mt-3 text-left text-sm text-gray-700 space-y-1">
                        {files.map((f) => (
                          <li key={f.name} className="truncate">• {f.name}</li>
                        ))}
                      </ul>
                    )}


                    <p className="text-sm text-gray-500 mt-1">We'll make it smaller without losing quality</p>
                    <p className="text-sm text-gray-500 mt-1">
                    Compress up to 15 PDFs at once • Max 25MB per file • Fast & secure
                    </p>

                  </div>
                  {/* <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  /> */}

                    <input
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />

                </label>
              </div>

              {/* Compress Button */}
              <button
                type="submit"
                // disabled={loading || !file}
                disabled={loading || files.length === 0}

                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Compressing... almost done!</>
                ) : (
                  <>
                    <FileDown className="w-5 h-5" />
                    Compress PDF
                  </>
                )}
              </button>
            </form>

            {/* Success State */}
            {success && (
              <div 
              id="download-section"  // ✅ BAS YE EK LINE ADD KARO
              className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">Nice! PDF is smaller now</p>
                <p className="text-base text-gray-700 mb-3">Ready to send or upload anywhere</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  Download Compressed PDF
                </button>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Files gone after 1 hour • Completely free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Compress PDF Online Free – Shrink Files Without Losing Quality
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Big PDFs slowing you down? Compress them here in seconds – make files tiny (up to 90% smaller) but still crystal clear. Perfect for emails, uploads, or just saving space. All free on PDF Linx!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-white rotate-90" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Shrink Up To 90%</h3>
            <p className="text-gray-600 text-sm">
              Turn massive PDFs into lightweight ones – easy to share anywhere.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality Stays Sharp</h3>
            <p className="text-gray-600 text-sm">
              Text and images look just as good – smart compression magic.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
            <p className="text-gray-600 text-sm">
              Works instantly – no sign-up, files deleted after 1 hour.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Compress PDF in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDF</h4>
              <p className="text-gray-600 text-sm">Drop it in or click to pick any file.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Hit Compress</h4>
              <p className="text-gray-600 text-sm">We shrink it smartly in seconds.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download Smaller PDF</h4>
              <p className="text-gray-600 text-sm">Your lighter file is ready to go!</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Folks compress PDFs daily with PDF Linx – smaller files, faster sharing, zero hassle.
        </p>
      </section>


      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Compress PDF – Free Online PDF Compressor by PDFLinx
        </h2>

        {/* Intro */}
        <p className="text-base leading-7 mb-6">
          Ever tried emailing a PDF only to get that annoying “file too large” error?
          Or struggled to upload a document because it’s taking forever?
          We’ve all been there. That’s why we created the <span className="font-medium text-slate-900">PDFLinx Compress PDF tool</span>—a completely free online compressor that shrinks your PDF files quickly while keeping the quality sharp. No software, no watermarks, no sign-up needed.
        </p>

        {/* What is */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What is PDF Compression?
        </h3>
        <p className="leading-7 mb-6">
          PDF compression reduces the file size of your document by removing unnecessary data—like embedded fonts, hidden layers, or high-resolution images—without ruining how it looks.
          The result? A smaller, faster-loading PDF that’s perfect for emailing, uploading, or storing, while still looking clear and professional.
        </p>

        {/* Why compress */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Compress Your PDF Files?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Reduce file size dramatically—often by 50-90%</li>
          <li>Send large PDFs via email without attachment limits</li>
          <li>Upload documents faster to websites or cloud storage</li>
          <li>Save storage space on your phone or computer</li>
          <li>Maintain readable text and clear images</li>
        </ul>

        {/* Steps */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Compress PDF Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your PDF file (drag & drop or click to select)</li>
          <li>Choose your compression level (if options available)</li>
          <li>Click “Compress PDF”</li>
          <li>Download your smaller, optimized PDF instantly</li>
        </ol>

        <p className="mb-6">
          No registration, no watermark, no installation—100% free and secure.
        </p>

        {/* Features box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx PDF Compressor
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>100% free online compression</li>
            <li>Significant file size reduction</li>
            <li>Preserves text and image quality</li>
            <li>Fast and reliable processing</li>
            <li>Works on mobile & desktop</li>
            <li>No file storage – complete privacy</li>
            <li>No watermarks or limits</li>
          </ul>
        </div>

        {/* Audience */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Submit large scanned assignments or projects</li>
          <li><strong>Professionals:</strong> Email reports, resumes, or contracts quickly</li>
          <li><strong>Businesses:</strong> Share invoices, proposals, or brochures easily</li>
          <li><strong>Job Applicants:</strong> Send CVs under email size limits</li>
          <li><strong>Anyone:</strong> Free up space or speed up uploads with big PDFs</li>
        </ul>

        {/* Safety */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Safe to Use?
        </h3>
        <p className="leading-7 mb-6">
          Absolutely. Your privacy is our priority.
          Every PDF you upload is processed securely on our servers and automatically deleted shortly after compression.
          We never store, share, or access your documents.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Compress PDF Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx works smoothly on Windows, macOS, Linux, Android, and iOS.
          Whether you're on your phone during a commute or at your desk, shrink any PDF in seconds with just a browser and internet connection.
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
                Is the PDF compressor free to use?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — completely free with no hidden fees or limits.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Do I need to install any software?
              </summary>
              <p className="mt-2 text-gray-600">
                No — everything works directly in your browser.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Will compressing affect the quality of my PDF?
              </summary>
              <p className="mt-2 text-gray-600">
                We use smart compression to reduce size while keeping text sharp and images clear.
                You’ll notice the smaller file size, not the difference in quality.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my files safe and private?
              </summary>
              <p className="mt-2 text-gray-600">
                100% safe — your PDFs are deleted automatically shortly after processing.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I compress PDF on my phone?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! Works perfectly on mobile phones, tablets, and desktops.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                How much can the file size be reduced?
              </summary>
              <p className="mt-2 text-gray-600">
                It depends on the original PDF, but most files shrink by 40-90% while staying fully readable.
              </p>
            </details>
          </div>
        </div>
      </section>

      

      <RelatedToolsSection currentPage="compress-pdf" />
    </>
  );
}







































// app/compress-pdf/CompressPdfClient.jsx

// "use client";
// import { useState, useRef } from "react";
// import { Upload, Download, CheckCircle, FileDown, Scissors } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";



// export default function CompressPDF() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [success, setSuccess] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => setFile(e.target.files[0] || null);

//   const handleCompress = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select a PDF file first");

//     setLoading(true);
//     setDownloadUrl("");
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/convert/compress-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         setDownloadUrl(`/api${data.download}`);
//         setSuccess(true);
//         // ✅ YE 8 LINES ADD KARO
//         setTimeout(() => {
//           const downloadSection = document.getElementById('download-section');
//           if (downloadSection) {
//             downloadSection.scrollIntoView({
//               behavior: 'smooth',
//               block: 'center'
//             });
//           }
//         }, 300);

//       } else {
//         alert("Compression failed: " + (data.error || "Try again"));
//       }
//     } catch (error) {
//       alert("Something went wrong. Please try again.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     if (!downloadUrl) return;
//     try {
//       const res = await fetch(downloadUrl);
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = file ? file.name.replace(/\.pdf$/i, "-compressed.pdf") : "compressed.pdf";
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("Download failed");
//     }
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

//       {/* HowTo Schema - Compress PDF */}
//       <Script
//         id="howto-schema-compress"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Compress PDF Online for Free",
//             description: "Reduce PDF file size up to 90% while keeping quality intact. Completely free, no signup needed.",
//             url: "https://pdflinx.com/compress-pdf",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDF", text: "Click the upload area and select your PDF file." },
//               { "@type": "HowToStep", name: "Compress", text: "Click 'Compress PDF' and wait a few seconds." },
//               { "@type": "HowToStep", name: "Download", text: "Download your smaller, optimized PDF file instantly." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       {/* Breadcrumb Schema - Compress PDF */}
//       <Script
//         id="breadcrumb-schema-compress"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Compress PDF", item: "https://pdflinx.com/compress-pdf" }
//             ]
//           }, null, 2),
//         }}
//       />
//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
//               Compress PDF Online (Free)
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Got a huge PDF that's too big to email or upload? We'll shrink it down (up to 90% smaller) while keeping it looking sharp. Super quick and totally free!
//             </p>
//           </div>

//           {/* Main Card */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <form onSubmit={handleCompress} className="space-y-6">
//               {/* Upload Area */}
//               <div className="relative">
//                 <label className="block">
//                   <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
//                     <FileDown className="w-12 h-12 mx-auto mb-3 text-blue-600" />
//                     <p className="text-lg font-semibold text-gray-700">
//                       {file ? file.name : "Drop your PDF here or click to upload"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">We'll make it smaller without losing quality</p>
//                   </div>
//                   <input
//                     type="file"
//                     accept="application/pdf"
//                     onChange={handleFileChange}
//                     ref={fileInputRef}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               {/* Compress Button */}
//               <button
//                 type="submit"
//                 disabled={loading || !file}
//                 className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>Compressing... almost done!</>
//                 ) : (
//                   <>
//                     <FileDown className="w-5 h-5" />
//                     Compress PDF
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Success State */}
//             {success && (
//               <div 
//               id="download-section"  // ✅ BAS YE EK LINE ADD KARO
//               className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
//                 <p className="text-xl font-bold text-green-700 mb-2">Nice! PDF is smaller now</p>
//                 <p className="text-base text-gray-700 mb-3">Ready to send or upload anywhere</p>
//                 <button
//                   onClick={handleDownload}
//                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
//                 >
//                   <Download className="w-5 h-5" />
//                   Download Compressed PDF
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Footer Note */}
//           <p className="text-center mt-6 text-gray-600 text-base">
//             No account • No watermark • Files gone after 1 hour • Completely free
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         {/* Main Heading */}
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
//             Compress PDF Online Free – Shrink Files Without Losing Quality
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Big PDFs slowing you down? Compress them here in seconds – make files tiny (up to 90% smaller) but still crystal clear. Perfect for emails, uploads, or just saving space. All free on PDF Linx!
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Scissors className="w-8 h-8 text-white rotate-90" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Shrink Up To 90%</h3>
//             <p className="text-gray-600 text-sm">
//               Turn massive PDFs into lightweight ones – easy to share anywhere.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality Stays Sharp</h3>
//             <p className="text-gray-600 text-sm">
//               Text and images look just as good – smart compression magic.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
//             <p className="text-gray-600 text-sm">
//               Works instantly – no sign-up, files deleted after 1 hour.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Compress PDF in 3 Easy Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload Your PDF</h4>
//               <p className="text-gray-600 text-sm">Drop it in or click to pick any file.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Hit Compress</h4>
//               <p className="text-gray-600 text-sm">We shrink it smartly in seconds.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download Smaller PDF</h4>
//               <p className="text-gray-600 text-sm">Your lighter file is ready to go!</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           Folks compress PDFs daily with PDF Linx – smaller files, faster sharing, zero hassle.
//         </p>
//       </section>


//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//         {/* Heading */}
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//           Compress PDF – Free Online PDF Compressor by PDFLinx
//         </h2>

//         {/* Intro */}
//         <p className="text-base leading-7 mb-6">
//           Ever tried emailing a PDF only to get that annoying “file too large” error?
//           Or struggled to upload a document because it’s taking forever?
//           We’ve all been there. That’s why we created the <span className="font-medium text-slate-900">PDFLinx Compress PDF tool</span>—a completely free online compressor that shrinks your PDF files quickly while keeping the quality sharp. No software, no watermarks, no sign-up needed.
//         </p>

//         {/* What is */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           What is PDF Compression?
//         </h3>
//         <p className="leading-7 mb-6">
//           PDF compression reduces the file size of your document by removing unnecessary data—like embedded fonts, hidden layers, or high-resolution images—without ruining how it looks.
//           The result? A smaller, faster-loading PDF that’s perfect for emailing, uploading, or storing, while still looking clear and professional.
//         </p>

//         {/* Why compress */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Why Compress Your PDF Files?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li>Reduce file size dramatically—often by 50-90%</li>
//           <li>Send large PDFs via email without attachment limits</li>
//           <li>Upload documents faster to websites or cloud storage</li>
//           <li>Save storage space on your phone or computer</li>
//           <li>Maintain readable text and clear images</li>
//         </ul>

//         {/* Steps */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           How to Compress PDF Online
//         </h3>
//         <ol className="space-y-2 mb-6 list-decimal pl-6">
//           <li>Upload your PDF file (drag & drop or click to select)</li>
//           <li>Choose your compression level (if options available)</li>
//           <li>Click “Compress PDF”</li>
//           <li>Download your smaller, optimized PDF instantly</li>
//         </ol>

//         <p className="mb-6">
//           No registration, no watermark, no installation—100% free and secure.
//         </p>

//         {/* Features box */}
//         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
//           <h3 className="text-xl font-semibold text-slate-900 mb-4">
//             Features of PDFLinx PDF Compressor
//           </h3>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
//             <li>100% free online compression</li>
//             <li>Significant file size reduction</li>
//             <li>Preserves text and image quality</li>
//             <li>Fast and reliable processing</li>
//             <li>Works on mobile & desktop</li>
//             <li>No file storage – complete privacy</li>
//             <li>No watermarks or limits</li>
//           </ul>
//         </div>

//         {/* Audience */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Who Should Use This Tool?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li><strong>Students:</strong> Submit large scanned assignments or projects</li>
//           <li><strong>Professionals:</strong> Email reports, resumes, or contracts quickly</li>
//           <li><strong>Businesses:</strong> Share invoices, proposals, or brochures easily</li>
//           <li><strong>Job Applicants:</strong> Send CVs under email size limits</li>
//           <li><strong>Anyone:</strong> Free up space or speed up uploads with big PDFs</li>
//         </ul>

//         {/* Safety */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Is PDFLinx Safe to Use?
//         </h3>
//         <p className="leading-7 mb-6">
//           Absolutely. Your privacy is our priority.
//           Every PDF you upload is processed securely on our servers and automatically deleted shortly after compression.
//           We never store, share, or access your documents.
//         </p>

//         {/* Closing */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Compress PDF Anytime, Anywhere
//         </h3>
//         <p className="leading-7">
//           PDFLinx works smoothly on Windows, macOS, Linux, Android, and iOS.
//           Whether you're on your phone during a commute or at your desk, shrink any PDF in seconds with just a browser and internet connection.
//         </p>
//       </section>


//       <section className="py-16 bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4">

//           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
//             Frequently Asked Questions
//           </h2>

//           <div className="space-y-4">

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Is the PDF compressor free to use?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — completely free with no hidden fees or limits.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Do I need to install any software?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 No — everything works directly in your browser.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Will compressing affect the quality of my PDF?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 We use smart compression to reduce size while keeping text sharp and images clear.
//                 You’ll notice the smaller file size, not the difference in quality.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Are my files safe and private?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 100% safe — your PDFs are deleted automatically shortly after processing.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I compress PDF on my phone?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! Works perfectly on mobile phones, tablets, and desktops.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 How much can the file size be reduced?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 It depends on the original PDF, but most files shrink by 40-90% while staying fully readable.
//               </p>
//             </details>
//           </div>
//         </div>
//       </section>

      

//       <RelatedToolsSection currentPage="compress-pdf" />
//     </>
//   );
// }

