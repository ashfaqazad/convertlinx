// app/image-to-pdf/page.js

"use client";
import { useState } from "react";
import { Upload, Image, Download, CheckCircle, X } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";



export default function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [success, setSuccess] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setLoading(true);
    setDownloadUrl(null);
    setSuccess(false);

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("/convert/image-to-pdf", {
        method: "POST",
        body: formData,
      });

      // Read as text first (because 500 responses are often not JSON)
      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      // Try to parse JSON, otherwise treat it as plain error text
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: false, error: text || "Internal Server Error" };
      }

      // If server returned error status OR success false
      if (!res.ok || !data?.success) {
        alert("Conversion failed: " + (data?.error || `HTTP ${res.status}`));
        return;
      }

      // Success
      setDownloadUrl(data.download);
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

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const invalidFiles = selectedFiles.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      alert(
        `Only JPG, PNG, and WebP allowed.\nInvalid file: ${invalidFiles[0].name}`
      );
      e.target.value = ""; // reset file input
      return;
    }

    const hasWebP = selectedFiles.some((file) => file.type === "image/webp");
    if (hasWebP) {
      alert(
        "WebP image detected.\nBackend conversion support needed, warna 500 error aa sakta hai."
      );
    }

    setFiles(selectedFiles);
  };



  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files.length === 1 ? files[0].name.replace(/\.[^/.]+$/, ".pdf") : "images-converted.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed. Please try again.");
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <>

      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

      {/* HowTo Schema - Image to PDF */}
      <Script
        id="howto-schema-image-to-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert Images to PDF Online for Free",
            description: "Convert multiple JPG, PNG, WebP, or GIF images into a single PDF file in just 3 easy steps - 100% free, no signup required.",
            url: "https://pdflinx.com/image-to-pdf",
            step: [
              {
                "@type": "HowToStep",
                name: "Select Images",
                text: "Click the upload area and select one or multiple images (JPG, PNG, GIF, WebP supported)."
              },
              {
                "@type": "HowToStep",
                name: "Convert to PDF",
                text: "Click 'Convert to PDF' and wait a few seconds while we process your images."
              },
              {
                "@type": "HowToStep",
                name: "Download PDF",
                text: "Your PDF file will be ready - click download to save it instantly."
              }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      {/* Breadcrumb Schema - Image to PDF */}
      <Script
        id="breadcrumb-schema-image-to-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Image to PDF", item: "https://pdflinx.com/image-to-pdf" }
            ]
          }, null, 2),
        }}
      />
      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Image to PDF Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Got a bunch of photos or screenshots? Turn them into one neat PDF in seconds – perfect quality, super easy, and totally free!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Drop Zone */}
              <div className="relative">
                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'}`}>
                    <Image className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                    <p className="text-lg font-semibold text-gray-700">
                      {files.length > 0 ? `${files.length} image(s) ready` : "Drop images here or click to upload"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG, GIF, WebP • Up to 50 images</p>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                  />

                  {/* <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="hidden"
                  /> */}


                </label>

                {/* Selected Images Preview */}
                {files.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-3 max-h-56 overflow-y-auto p-3 bg-gray-50 rounded-xl">
                    {files.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-28 object-cover rounded-lg shadow"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-center mt-1 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Convert Button */}
              <button
                type="submit"
                disabled={loading || files.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Turning images into PDF..."
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Convert to PDF
                  </>
                )}
              </button>
            </form>


            {/* Success Message */}
            {success && (
              <div
                id="download-section"  // ✅ BAS YE EK LINE ADD KARO
                className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">All done!</p>
                <p className="text-base text-gray-700 mb-3">Your images are now one beautiful PDF</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  Download Your PDF
                </button>
              </div>
            )}


          </div>

          {/* Trust Footer */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No sign-up • No watermark • Files gone after 1 hour • 100% free & secure
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Image to PDF Online Free – Photos into One Clean PDF
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Turn your JPGs, PNGs, screenshots, or any pics into a single PDF – each on its own page, looking sharp. Great for portfolios, reports, or just keeping things organized. Fast and free on PDF Linx!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Any Image Works</h3>
            <p className="text-gray-600 text-sm">
              JPG, PNG, GIF, WebP – single or up to 50 at once.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Looks Professional</h3>
            <p className="text-gray-600 text-sm">
              Full quality, each image on its own page – clean and sharp.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
            <p className="text-gray-600 text-sm">
              Instant conversion – no sign-up, files deleted after 1 hour.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Turn Images into PDF in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Photos</h4>
              <p className="text-gray-600 text-sm">Drop one or many – easy preview.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Remove if Needed</h4>
              <p className="text-gray-600 text-sm">Click X on any you don’t want.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Get Your PDF</h4>
              <p className="text-gray-600 text-sm">Download your combined PDF instantly!</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          People turn photos into PDFs daily with PDF Linx – quick, clean, and always free.
        </p>
      </section>


      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          JPG to PDF Converter – Free Online Tool by PDFLinx
        </h2>

        {/* Intro */}
        <p className="text-base leading-7 mb-6">
          Got a bunch of photos or screenshots in JPG format that you need to share as a single, professional document?
          Maybe receipts, certificates, or product images?
          Our <span className="font-medium text-slate-900">PDFLinx JPG to PDF Converter</span> makes it super easy.
          It’s a 100% free online tool that combines one or multiple JPG images into a clean, high-quality PDF in seconds—no software, no watermarks, no complications.
        </p>

        {/* What is */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What is JPG to PDF Conversion?
        </h3>
        <p className="leading-7 mb-6">
          JPG to PDF conversion takes your image files (JPEG/JPG) and places them neatly into a portable PDF document.
          Each image becomes a full page (or you can fit multiple per page), preserving original quality, colors, and sharpness.
          The result is a professional, easy-to-share file that opens perfectly on any device.
        </p>

        {/* Why convert */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Convert JPG Images to PDF?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Combine multiple photos into one organized PDF file</li>
          <li>Preserves image quality, colors, and resolution</li>
          <li>Easier to share, print, or archive than separate image files</li>
          <li>Perfect for portfolios, reports, receipts, certificates, or scanned documents</li>
          <li>More professional and universally compatible format</li>
        </ul>

        {/* Steps */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Convert JPG to PDF Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload one or more JPG images (drag & drop or click to select)</li>
          <li>Arrange the order if needed</li>
          <li>Click the “Convert to PDF” button</li>
          <li>Download your ready PDF in seconds</li>
        </ol>

        <p className="mb-6">
          No sign-up, no watermark, no installation required—completely free and instant.
        </p>

        {/* Features box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx JPG to PDF Converter
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>100% free online converter</li>
            <li>Supports single or multiple JPG files</li>
            <li>High-quality image preservation</li>
            <li>Adjustable page layout options</li>
            <li>Lightning-fast processing</li>
            <li>Works on mobile & desktop</li>
            <li>No file storage – full privacy</li>
          </ul>
        </div>

        {/* Audience */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Compile assignment scans or project images</li>
          <li><strong>Business Owners:</strong> Create product catalogs or invoice attachments</li>
          <li><strong>Photographers:</strong> Share proof sheets or portfolios professionally</li>
          <li><strong>Professionals:</strong> Submit expense receipts or ID proofs in one file</li>
          <li><strong>Anyone:</strong> Turn phone photos into organized, printable PDFs</li>
        </ul>

        {/* Safety */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Safe to Use?
        </h3>
        <p className="leading-7 mb-6">
          Yes — completely safe and private.
          We respect your images and documents.
          All uploaded files are processed securely and automatically deleted from our servers shortly after conversion.
          Nothing is stored or shared.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Convert JPG to PDF Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx works perfectly on Windows, macOS, Linux, Android, and iOS.
          Whether you’re on your phone or laptop, just upload your JPGs and get a polished PDF in moments—no app needed.
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
                Is the JPG to PDF converter free to use?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — totally free, no limits or hidden charges.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Do I need to install any software?
              </summary>
              <p className="mt-2 text-gray-600">
                No — everything works right in your browser.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Will my image quality be preserved?
              </summary>
              <p className="mt-2 text-gray-600">
                Absolutely. Your JPGs are embedded at full quality with no compression or loss.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I convert multiple JPGs at once?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! Upload as many images as you need and they’ll be combined into one PDF.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my images safe and private?
              </summary>
              <p className="mt-2 text-gray-600">
                100% safe — files are deleted automatically after conversion.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I use this on my phone?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! Works perfectly on mobile phones, tablets, and desktops.
              </p>
            </details>

          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="image-to-pdf" />

    </>
  );
}

























// // app/image-to-pdf/page.js

// "use client";
// import { useState } from "react";
// import { Upload, Image, Download, CheckCircle, X } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";



// export default function ImageToPdf() {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [success, setSuccess] = useState(false);


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (files.length === 0) {
//       alert("Please select at least one image");
//       return;
//     }

//     setLoading(true);
//     setDownloadUrl(null);
//     setSuccess(false);

//     const formData = new FormData();
//     files.forEach((file) => formData.append("images", file));

//     try {
//       const res = await fetch("/convert/image-to-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       // Read as text first (because 500 responses are often not JSON)
//       const text = await res.text();
//       console.log("RAW RESPONSE:", text);

//       // Try to parse JSON, otherwise treat it as plain error text
//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch {
//         data = { success: false, error: text || "Internal Server Error" };
//       }

//       // If server returned error status OR success false
//       if (!res.ok || !data?.success) {
//         alert("Conversion failed: " + (data?.error || `HTTP ${res.status}`));
//         return;
//       }

//       // Success
//       setDownloadUrl(data.download);
//       setSuccess(true);
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files || []);

//     const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

//     const invalidFiles = selectedFiles.filter(
//       (file) => !allowedTypes.includes(file.type)
//     );

//     if (invalidFiles.length > 0) {
//       alert(
//         `Only JPG, PNG, and WebP allowed.\nInvalid file: ${invalidFiles[0].name}`
//       );
//       e.target.value = ""; // reset file input
//       return;
//     }

//     const hasWebP = selectedFiles.some((file) => file.type === "image/webp");
//     if (hasWebP) {
//       alert(
//         "WebP image detected.\nBackend conversion support needed, warna 500 error aa sakta hai."
//       );
//     }

//     setFiles(selectedFiles);
//   };



//   const handleDownload = async () => {
//     if (!downloadUrl) return;
//     try {
//       const res = await fetch(downloadUrl);
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = files.length === 1 ? files[0].name.replace(/\.[^/.]+$/, ".pdf") : "images-converted.pdf";
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("Download failed. Please try again.");
//     }
//   };

//   const removeFile = (index) => {
//     setFiles(files.filter((_, i) => i !== index));
//   };

//   return (
//     <>

//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

//       {/* HowTo Schema - Image to PDF */}
//       <Script
//         id="howto-schema-image-to-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert Images to PDF Online for Free",
//             description: "Convert multiple JPG, PNG, WebP, or GIF images into a single PDF file in just 3 easy steps - 100% free, no signup required.",
//             url: "https://pdflinx.com/image-to-pdf",
//             step: [
//               {
//                 "@type": "HowToStep",
//                 name: "Select Images",
//                 text: "Click the upload area and select one or multiple images (JPG, PNG, GIF, WebP supported)."
//               },
//               {
//                 "@type": "HowToStep",
//                 name: "Convert to PDF",
//                 text: "Click 'Convert to PDF' and wait a few seconds while we process your images."
//               },
//               {
//                 "@type": "HowToStep",
//                 name: "Download PDF",
//                 text: "Your PDF file will be ready - click download to save it instantly."
//               }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       {/* Breadcrumb Schema - Image to PDF */}
//       <Script
//         id="breadcrumb-schema-image-to-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Image to PDF", item: "https://pdflinx.com/image-to-pdf" }
//             ]
//           }, null, 2),
//         }}
//       />
//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
//               Image to PDF Converter <br /> Online (Free)
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Got a bunch of photos or screenshots? Turn them into one neat PDF in seconds – perfect quality, super easy, and totally free!
//             </p>
//           </div>

//           {/* Main Card */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Drop Zone */}
//               <div className="relative">
//                 <label className="block">
//                   <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'}`}>
//                     <Image className="w-12 h-12 mx-auto mb-3 text-purple-600" />
//                     <p className="text-lg font-semibold text-gray-700">
//                       {files.length > 0 ? `${files.length} image(s) ready` : "Drop images here or click to upload"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-2">JPG, PNG, GIF, WebP • Up to 50 images</p>
//                   </div>

//                   <input
//                     type="file"
//                     multiple
//                     accept="image/jpeg,image/png,image/webp"
//                     onChange={handleFileChange}
//                   />

//                   {/* <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={(e) => setFiles(Array.from(e.target.files || []))}
//                     className="hidden"
//                   /> */}


//                 </label>

//                 {/* Selected Images Preview */}
//                 {files.length > 0 && (
//                   <div className="mt-4 grid grid-cols-4 gap-3 max-h-56 overflow-y-auto p-3 bg-gray-50 rounded-xl">
//                     {files.map((file, index) => (
//                       <div key={index} className="relative group">
//                         <img
//                           src={URL.createObjectURL(file)}
//                           alt={file.name}
//                           className="w-full h-28 object-cover rounded-lg shadow"
//                         />
//                         <button
//                           onClick={() => removeFile(index)}
//                           className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                         <p className="text-xs text-center mt-1 truncate">{file.name}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Convert Button */}
//               <button
//                 type="submit"
//                 disabled={loading || files.length === 0}
//                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   "Turning images into PDF..."
//                 ) : (
//                   <>
//                     <Upload className="w-5 h-5" />
//                     Convert to PDF
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Success Message */}
//             {success && (
//               <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
//                 <p className="text-xl font-bold text-green-700 mb-2">All done!</p>
//                 <p className="text-base text-gray-700 mb-3">Your images are now one beautiful PDF</p>
//                 <button
//                   onClick={handleDownload}
//                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
//                 >
//                   <Download className="w-5 h-5" />
//                   Download Your PDF
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Trust Footer */}
//           <p className="text-center mt-6 text-gray-600 text-base">
//             No sign-up • No watermark • Files gone after 1 hour • 100% free & secure
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         {/* Main Heading */}
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
//             Image to PDF Online Free – Photos into One Clean PDF
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Turn your JPGs, PNGs, screenshots, or any pics into a single PDF – each on its own page, looking sharp. Great for portfolios, reports, or just keeping things organized. Fast and free on PDF Linx!
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Any Image Works</h3>
//             <p className="text-gray-600 text-sm">
//               JPG, PNG, GIF, WebP – single or up to 50 at once.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Looks Professional</h3>
//             <p className="text-gray-600 text-sm">
//               Full quality, each image on its own page – clean and sharp.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
//             <p className="text-gray-600 text-sm">
//               Instant conversion – no sign-up, files deleted after 1 hour.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Turn Images into PDF in 3 Easy Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload Photos</h4>
//               <p className="text-gray-600 text-sm">Drop one or many – easy preview.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Remove if Needed</h4>
//               <p className="text-gray-600 text-sm">Click X on any you don’t want.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Get Your PDF</h4>
//               <p className="text-gray-600 text-sm">Download your combined PDF instantly!</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           People turn photos into PDFs daily with PDF Linx – quick, clean, and always free.
//         </p>
//       </section>


//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//         {/* Heading */}
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//           JPG to PDF Converter – Free Online Tool by PDFLinx
//         </h2>

//         {/* Intro */}
//         <p className="text-base leading-7 mb-6">
//           Got a bunch of photos or screenshots in JPG format that you need to share as a single, professional document?
//           Maybe receipts, certificates, or product images?
//           Our <span className="font-medium text-slate-900">PDFLinx JPG to PDF Converter</span> makes it super easy.
//           It’s a 100% free online tool that combines one or multiple JPG images into a clean, high-quality PDF in seconds—no software, no watermarks, no complications.
//         </p>

//         {/* What is */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           What is JPG to PDF Conversion?
//         </h3>
//         <p className="leading-7 mb-6">
//           JPG to PDF conversion takes your image files (JPEG/JPG) and places them neatly into a portable PDF document.
//           Each image becomes a full page (or you can fit multiple per page), preserving original quality, colors, and sharpness.
//           The result is a professional, easy-to-share file that opens perfectly on any device.
//         </p>

//         {/* Why convert */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Why Convert JPG Images to PDF?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li>Combine multiple photos into one organized PDF file</li>
//           <li>Preserves image quality, colors, and resolution</li>
//           <li>Easier to share, print, or archive than separate image files</li>
//           <li>Perfect for portfolios, reports, receipts, certificates, or scanned documents</li>
//           <li>More professional and universally compatible format</li>
//         </ul>

//         {/* Steps */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           How to Convert JPG to PDF Online
//         </h3>
//         <ol className="space-y-2 mb-6 list-decimal pl-6">
//           <li>Upload one or more JPG images (drag & drop or click to select)</li>
//           <li>Arrange the order if needed</li>
//           <li>Click the “Convert to PDF” button</li>
//           <li>Download your ready PDF in seconds</li>
//         </ol>

//         <p className="mb-6">
//           No sign-up, no watermark, no installation required—completely free and instant.
//         </p>

//         {/* Features box */}
//         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
//           <h3 className="text-xl font-semibold text-slate-900 mb-4">
//             Features of PDFLinx JPG to PDF Converter
//           </h3>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
//             <li>100% free online converter</li>
//             <li>Supports single or multiple JPG files</li>
//             <li>High-quality image preservation</li>
//             <li>Adjustable page layout options</li>
//             <li>Lightning-fast processing</li>
//             <li>Works on mobile & desktop</li>
//             <li>No file storage – full privacy</li>
//           </ul>
//         </div>

//         {/* Audience */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Who Should Use This Tool?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li><strong>Students:</strong> Compile assignment scans or project images</li>
//           <li><strong>Business Owners:</strong> Create product catalogs or invoice attachments</li>
//           <li><strong>Photographers:</strong> Share proof sheets or portfolios professionally</li>
//           <li><strong>Professionals:</strong> Submit expense receipts or ID proofs in one file</li>
//           <li><strong>Anyone:</strong> Turn phone photos into organized, printable PDFs</li>
//         </ul>

//         {/* Safety */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Is PDFLinx Safe to Use?
//         </h3>
//         <p className="leading-7 mb-6">
//           Yes — completely safe and private.
//           We respect your images and documents.
//           All uploaded files are processed securely and automatically deleted from our servers shortly after conversion.
//           Nothing is stored or shared.
//         </p>

//         {/* Closing */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Convert JPG to PDF Anytime, Anywhere
//         </h3>
//         <p className="leading-7">
//           PDFLinx works perfectly on Windows, macOS, Linux, Android, and iOS.
//           Whether you’re on your phone or laptop, just upload your JPGs and get a polished PDF in moments—no app needed.
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
//                 Is the JPG to PDF converter free to use?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — totally free, no limits or hidden charges.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Do I need to install any software?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 No — everything works right in your browser.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Will my image quality be preserved?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Absolutely. Your JPGs are embedded at full quality with no compression or loss.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I convert multiple JPGs at once?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! Upload as many images as you need and they’ll be combined into one PDF.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Are my images safe and private?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 100% safe — files are deleted automatically after conversion.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I use this on my phone?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! Works perfectly on mobile phones, tablets, and desktops.
//               </p>
//             </details>

//           </div>
//         </div>
//       </section>

//       <RelatedToolsSection currentPage="image-to-pdf" />

//     </>
//   );
// }

