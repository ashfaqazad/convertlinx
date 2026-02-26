"use client";
import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, Presentation } from "lucide-react";
import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";

export default function PptToPdf() {
  // ✅ Single + Multiple dono support (same input)
  const [files, setFiles] = useState([]); // 1 file ho to bhi array me 1 item
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null); // single pdf OR zip link
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const isSingle = files.length === 1;
  const isMultiple = files.length > 1;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setSuccess(false);
    setDownloadUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return alert("Please select a PowerPoint file (or multiple files) first!");

    setLoading(true);
    setDownloadUrl(null);
    setSuccess(false);

    const formData = new FormData();

    // ✅ Single + multiple (same loop) — field name "files"
    files.forEach((f) => formData.append("files", f));

    // optional hint
    formData.append("mode", isSingle ? "single" : "multiple");

    try {
      // 🔹 API call
      const res = await fetch("/convert/ppt-to-pdf", {
        method: "POST",
        body: formData,
      });

      // safer: read JSON only if ok
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Server error: ${res.status} ${text?.slice(0, 200)}`);
      }

      const data = await res.json();

      if (data.success) {
        // ✅ same pattern as excel: backend returns relative download path
        // recommended: backend returns "/converted/xxx.pdf" for single
        // and "/converted/xxx.zip" for multiple
        setDownloadUrl(`/api${data.download}`);
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
        alert("Conversion failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDownloadName = () => {
    if (isSingle) {
      return files[0]?.name
        ? files[0].name.replace(/\.(ppt|pptx)$/i, ".pdf")
        : "converted.pdf";
    }
    return "pdflinx-ppt-to-pdf.zip";
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("File not found");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = getDownloadName();
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed – file not ready yet. Try again in a few seconds.");
    }
  };

  return (
    <>
      {/* ==================== SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert PowerPoint to PDF Online for Free (Single or Multiple Files)",
              description:
                "Convert PPT or PPTX presentations to PDF in seconds. You can upload a single file or select multiple files together — slides preserved perfectly.",
              url: "https://pdflinx.com/ppt-to-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PowerPoint (single or multiple)",
                  text: "Drop your .ppt or .pptx file here — you can also select multiple files at once.",
                },
                {
                  "@type": "HowToStep",
                  name: "Click Convert",
                  text: "Wait a few seconds for processing. If you uploaded multiple files, we convert them together.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download",
                  text: "Download your converted PDF. For multiple files, you can download a ZIP containing all PDFs.",
                },
              ],
              totalTime: "PT30S",
              estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
              image: "https://pdflinx.com/og-image.png",
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "PowerPoint to PDF", item: "https://pdflinx.com/ppt-to-pdf" },
              ],
            },
            null,
            2
          ),
        }}
      />

      {/* ==================== MAIN TOOL ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              PowerPoint to PDF Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Got a presentation that needs to be shared safely? Drop your PPT or PPTX here — we’ll turn it into a perfect
              PDF with all slides and formatting intact.
              <span className="font-semibold text-gray-800"> You can upload a single file or select multiple files together.</span>{" "}
              No sign-up, no watermark!
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
                      }`}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-3 text-purple-600" />

                    <p className="text-lg font-semibold text-gray-700">
                      {files.length === 0
                        ? "Drop your PowerPoint file(s) here or click to upload"
                        : files.length === 1
                          ? files[0].name
                          : `${files.length} files selected (single + multiple upload supported)`}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Only .ppt & .pptx files • Up to 100MB • Select 1 file or select multiple files at once
                    </p>

                    {/* Optional: list preview for multiple */}
                    {files.length > 1 && (
                      <div className="mt-3 text-xs text-gray-600 max-h-20 overflow-auto rounded-lg bg-white/60 border border-green-200 p-3">
                        <p className="font-semibold mb-2 text-gray-700">Selected files:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {files.slice(0, 10).map((f) => (
                            <li key={`${f.name}-${f.size}-${f.lastModified}`}>{f.name}</li>
                          ))}
                          {files.length > 10 && <li>...and {files.length - 10} more</li>}
                        </ul>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || files.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Converting... hang tight!</>
                ) : (
                  <>
                    <Presentation className="w-5 h-5" />
                    Convert to PDF
                  </>
                )}
              </button>

              {/* helper note */}
              <p className="text-center text-sm text-gray-500">
                ✅ Upload <span className="font-semibold text-gray-700">one PPT/PPTX</span> for a single PDF, or{" "}
                <span className="font-semibold text-gray-700">select multiple files</span> to convert in one go
                (recommended: download as ZIP).
              </p>
            </form>

            {/* Success State */}
            {success && (
              <div 
              id="download-section"  // ✅ BAS YE EK LINE ADD KARO

              className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />

                <p className="text-xl font-bold text-green-700 mb-3">
                  {isSingle ? "Done! Your PDF is ready" : "Done! Your ZIP is ready"}
                </p>

                <p className="text-gray-600 mb-4">
                  {isSingle ? (
                    <>All slides and formatting preserved perfectly.</>
                  ) : (
                    <>
                      Your <span className="font-semibold">{files.length}</span> presentations are converted. Download the ZIP to
                      get all PDFs together.
                    </>
                  )}
                </p>

                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  {isSingle ? "Download PDF" : "Download ZIP"}
                </button>
              </div>
            )}
          </div>

          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Single + multiple uploads supported • Files gone after 1 hour • Completely free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            PowerPoint to PDF Online Free – Preserve Your Slides Perfectly
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert PPT or PPTX presentations to PDF without losing fonts, layout, or design. Whether you have{" "}
            <span className="font-semibold text-gray-800">one file</span> or{" "}
            <span className="font-semibold text-gray-800">multiple presentations</span>, you can upload and convert in one go.
            Fast and always free on PDF Linx!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Presentation className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Perfect Slides</h3>
            <p className="text-gray-600 text-sm">Layout, images, and text stay exactly the same (single or batch conversion).</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">PPT & PPTX Supported</h3>
            <p className="text-gray-600 text-sm">Works with old and new PowerPoint files — and supports single + multiple upload.</p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg border border-pink-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Secure</h3>
            <p className="text-gray-600 text-sm">Instant conversion, no signup, files deleted after 1 hour.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Convert PowerPoint to PDF in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Presentation(s)</h4>
              <p className="text-gray-600 text-sm">Drop one PPT/PPTX — or select multiple files together.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
              <p className="text-gray-600 text-sm">We preserve every detail perfectly (single or batch conversion).</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download</h4>
              <p className="text-gray-600 text-sm">Download PDF — for multiple files, download a ZIP with all PDFs.</p>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Thousands use PDF Linx daily to convert presentations to PDF — reliable, fast, and always free (single + multiple uploads supported).
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PowerPoint to PDF Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Ever created a beautiful PowerPoint presentation and then worried it might look messed up on someone else’s computer?
          Missing fonts, broken animations, or shifted layouts—no thanks!
          That’s why we made the <span className="font-medium text-slate-900">PDFLinx PowerPoint to PDF Converter</span>.
          It’s a completely free online tool that turns your PPT or PPTX files into perfect, professional PDFs in seconds—no software needed, no watermarks, no stress.
          <span className="font-semibold text-slate-900"> Plus:</span> you can upload a single presentation or select multiple files to convert in one go.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">What is PowerPoint to PDF Conversion?</h3>
        <p className="leading-7 mb-6">
          PowerPoint to PDF conversion transforms your editable slides into a fixed-layout PDF document.
          Every slide—text, images, charts, and formatting—stays exactly as you designed it.
          If you have multiple PPTs, you can convert them together and download all PDFs as a ZIP.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Why Convert PowerPoint Files to PDF?</h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Preserves slide layout, fonts, images, and design perfectly</li>
          <li>Looks the same on any device—no missing fonts or broken elements</li>
          <li>Protects your content from accidental edits</li>
          <li>Ideal for sharing presentations, handouts, or portfolios professionally</li>
          <li>Supports single and multiple file conversion (batch)</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">How to Convert PowerPoint to PDF Online</h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your PowerPoint file (PPT or PPTX) — or select multiple files together</li>
          <li>Click the “Convert to PDF” button</li>
          <li>Wait a few seconds while we process it</li>
          <li>Download your PDF instantly (for multiple files, download a ZIP containing all PDFs)</li>
        </ol>

        <p className="mb-6">No account required, no watermark added, no installation—100% free and simple.</p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx PowerPoint to PDF Converter
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>100% free online converter</li>
            <li>Supports PPT and PPTX formats</li>
            <li>Full slide design & layout preserved</li>
            <li>High-quality, print-ready PDFs</li>
            <li>Single & multiple file upload supported</li>
            <li>Works on mobile & desktop</li>
            <li>No file storage – total privacy</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Is PDFLinx Safe to Use?</h3>
        <p className="leading-7 mb-6">
          Absolutely safe. We value your privacy above everything.
          Your uploaded presentations are processed securely and deleted automatically shortly after conversion.
          This applies to both single-file and multiple-file uploads.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Convert PowerPoint to PDF Anytime, Anywhere</h3>
        <p className="leading-7">
          PDFLinx works flawlessly on Windows, macOS, Linux, Android, and iOS.
          Just open your browser, upload one presentation or multiple files, and get polished PDFs in seconds—no matter where you are.
        </p>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Is the PowerPoint to PDF converter free to use?</summary>
              <p className="mt-2 text-gray-600">Yes — completely free with no hidden fees or restrictions.</p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Can I upload multiple PPT/PPTX files together?</summary>
              <p className="mt-2 text-gray-600">
                Yes. You can upload a single file or select multiple presentations at once. For multiple files, you can download a ZIP containing all converted PDFs.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Do I need to install any software?</summary>
              <p className="mt-2 text-gray-600">No — it all happens directly in your browser.</p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Will my slides and animations be preserved?</summary>
              <p className="mt-2 text-gray-600">
                Yes! All text, images, layouts, fonts, and designs are preserved accurately. (Animations appear as static frames in PDFs.)
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Are my files safe and private?</summary>
              <p className="mt-2 text-gray-600">
                100% safe — files are deleted automatically shortly after conversion (single or multiple uploads).
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Can I convert PowerPoint to PDF on my phone?</summary>
              <p className="mt-2 text-gray-600">Yes! Works perfectly on mobile phones, tablets, and desktops.</p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Does it support older PPT files?</summary>
              <p className="mt-2 text-gray-600">Yes — both PPT and PPTX formats are fully supported.</p>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}



























// "use client";
// import { useState } from "react";
// import { Upload, FileText, Download, CheckCircle, Presentation } from "lucide-react";
// import Script from "next/script";
// // import RelatedToolsSection from "@/components/RelatedTools";

// export default function PptToPdf() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [success, setSuccess] = useState(false);



//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select a PowerPoint file first!");

//     setLoading(true);
//     setDownloadUrl(null);
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       // 🔹 API call
//       const res = await fetch("/api/convert/ppt-to-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error(`Server error: ${res.status}`);
//       }

//       const data = await res.json();

//       if (data.success) {
//         // 🔹 backend jo path de, wahi use karo (BEST)
//         setDownloadUrl(data.download || `/converted/${data.filename}`);
//         setSuccess(true);
//       } else {
//         alert("Conversion failed: " + (data.error || "Unknown error"));
//       }
//     }
//     catch (err) {
//       console.error("Error:", err);
//       alert("Something went wrong, please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     if (!downloadUrl) return;

//     try {
//       const response = await fetch(downloadUrl);
//       if (!response.ok) throw new Error("File not found");

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = file.name.replace(/\.(ppt|pptx)$/i, ".pdf");
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("Download failed – file not ready yet. Try again in a few seconds.");
//     }
//   };


//   return (
//     <>
//       {/* ==================== SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert PowerPoint to PDF Online for Free",
//             description: "Convert PPT or PPTX presentations to PDF in seconds – formatting, animations, and slides preserved perfectly.",
//             url: "https://pdflinx.com/ppt-to-pdf",
//             step: [
//               { "@type": "HowToStep", name: "Upload PowerPoint", text: "Drop your .ppt or .pptx file here." },
//               { "@type": "HowToStep", name: "Click Convert", text: "Wait a few seconds for processing." },
//               { "@type": "HowToStep", name: "Download PDF", text: "Get your ready-to-share PDF instantly." },
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png",
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "PowerPoint to PDF", item: "https://pdflinx.com/ppt-to-pdf" },
//             ],
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
//               PowerPoint to PDF Converter <br /> Online (Free)
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Got a presentation that needs to be shared safely? Drop your PPT or PPTX here – we’ll turn it into a perfect PDF with all slides, animations, and formatting intact. No sign-up, no watermark!
//             </p>
//           </div>

//           {/* Upload Card */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="relative">
//                 <label className="block">
//                   <div
//                     className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file
//                       ? "border-green-500 bg-green-50"
//                       : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
//                       }`}
//                   >
//                     <Upload className="w-12 h-12 mx-auto mb-3 text-purple-600" />
//                     <p className="text-lg font-semibold text-gray-700">
//                       {file ? file.name : "Drop your PowerPoint file here or click to upload"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Only .ppt & .pptx files • Up to 100MB
//                     </p>
//                   </div>
//                   <input
//                     type="file"
//                     accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
//                     onChange={(e) => setFile(e.target.files?.[0] || null)}
//                     className="hidden"
//                     required
//                   />
//                 </label>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading || !file}
//                 className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>Converting... hang tight!</>
//                 ) : (
//                   <>
//                     {/* <FilePresentation className="w-5 h-5" /> */}
//                     <Presentation className="w-5 h-5" />
//                     Convert to PDF
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Success State */}
//             {success && (
//               <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
//                 <p className="text-xl font-bold text-green-700 mb-3">
//                   Done! Your PDF is ready
//                 </p>
//                 <p className="text-gray-600 mb-4">
//                   All slides, formatting, and animations preserved perfectly
//                 </p>
//                 <button
//                   onClick={handleDownload}
//                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
//                 >
//                   <Download className="w-5 h-5" />
//                   Download PDF
//                 </button>
//               </div>
//             )}
//           </div>

//           <p className="text-center mt-6 text-gray-600 text-base">
//             No account • No watermark • Files gone after 1 hour • Completely free
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
//             PowerPoint to PDF Online Free – Preserve Your Slides Perfectly
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Convert PPT or PPTX presentations to PDF without losing formatting, animations, fonts, or layout. Ideal for sharing slides safely – fast and always free on PDF Linx!
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               {/* <FilePresentation className="w-8 h-8 text-white" /> */}
//               <Presentation className="w-12 h-12 text-green-600 mx-auto mb-3" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Perfect Slides</h3>
//             <p className="text-gray-600 text-sm">
//               Layout, animations, images, and text stay exactly the same
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">PPT & PPTX Supported</h3>
//             <p className="text-gray-600 text-sm">
//               Works with old and new PowerPoint files – no issues
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg border border-pink-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Secure</h3>
//             <p className="text-gray-600 text-sm">
//               Instant conversion, no signup, files deleted after 1 hour
//             </p>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Convert PowerPoint to PDF in 3 Easy Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload Presentation</h4>
//               <p className="text-gray-600 text-sm">Drop your PPT or PPTX file here</p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
//               <p className="text-gray-600 text-sm">We preserve every detail perfectly</p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download PDF</h4>
//               <p className="text-gray-600 text-sm">Share your slides safely!</p>
//             </div>
//           </div>
//         </div>

//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           Thousands use PDF Linx daily to convert presentations to PDF – reliable, fast, and always free.
//         </p>
//       </section>


//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//         {/* Heading */}
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//           PowerPoint to PDF Converter – Free Online Tool by PDFLinx
//         </h2>

//         {/* Intro */}
//         <p className="text-base leading-7 mb-6">
//           Ever created a beautiful PowerPoint presentation and then worried it might look messed up on someone else’s computer?
//           Missing fonts, broken animations, or shifted layouts—no thanks!
//           That’s why we made the <span className="font-medium text-slate-900">PDFLinx PowerPoint to PDF Converter</span>.
//           It’s a completely free online tool that turns your PPT or PPTX files into perfect, professional PDFs in seconds—no software needed, no watermarks, no stress.
//         </p>

//         {/* What is */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           What is PowerPoint to PDF Conversion?
//         </h3>
//         <p className="leading-7 mb-6">
//           PowerPoint to PDF conversion transforms your editable presentation slides into a fixed-layout PDF document.
//           Every slide—text, images, animations (as static frames), charts, transitions, and formatting—stays exactly as you designed it.
//           The result is a clean, shareable file that looks identical on any device, whether the viewer has PowerPoint or not.
//         </p>

//         {/* Why convert */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Why Convert PowerPoint Files to PDF?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li>Preserves slide layout, fonts, images, and design perfectly</li>
//           <li>Looks the same on any device—no missing fonts or broken elements</li>
//           <li>Protects your content from accidental edits</li>
//           <li>Ideal for sharing presentations, handouts, or portfolios professionally</li>
//           <li>Smaller file size and easier to print or email</li>
//         </ul>

//         {/* Steps */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           How to Convert PowerPoint to PDF Online
//         </h3>
//         <ol className="space-y-2 mb-6 list-decimal pl-6">
//           <li>Upload your PowerPoint file (PPT or PPTX) – drag & drop or click to select</li>
//           <li>Click the “Convert to PDF” button</li>
//           <li>Wait just a few seconds while we process it</li>
//           <li>Download your high-quality PDF instantly</li>
//         </ol>

//         <p className="mb-6">
//           No account required, no watermark added, no installation—100% free and simple.
//         </p>

//         {/* Features box */}
//         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
//           <h3 className="text-xl font-semibold text-slate-900 mb-4">
//             Features of PDFLinx PowerPoint to PDF Converter
//           </h3>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
//             <li>100% free online converter</li>
//             <li>Supports PPT and PPTX formats</li>
//             <li>Full slide design & layout preserved</li>
//             <li>High-quality, print-ready PDFs</li>
//             <li>Super-fast conversion speed</li>
//             <li>Works on mobile & desktop</li>
//             <li>No file storage – total privacy</li>
//           </ul>
//         </div>

//         {/* Audience */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Who Should Use This Tool?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li><strong>Teachers & Educators:</strong> Share lesson slides as clean handouts</li>
//           <li><strong>Students:</strong> Submit assignments or project presentations neatly</li>
//           <li><strong>Business Professionals:</strong> Send pitch decks or reports confidently</li>
//           <li><strong>Trainers & Speakers:</strong> Distribute slide decks without formatting worries</li>
//           <li><strong>Designers:</strong> Showcase portfolios in a universal format</li>
//         </ul>

//         {/* Safety */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Is PDFLinx Safe to Use?
//         </h3>
//         <p className="leading-7 mb-6">
//           Absolutely safe. We value your privacy above everything.
//           Your uploaded presentations are processed securely and automatically deleted from our servers right after conversion.
//           We never store or share your files with anyone.
//         </p>

//         {/* Closing */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Convert PowerPoint to PDF Anytime, Anywhere
//         </h3>
//         <p className="leading-7">
//           PDFLinx works flawlessly on Windows, macOS, Linux, Android, and iOS.
//           Just open your browser, upload your slides, and get a polished PDF in seconds—no matter where you are.
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
//                 Is the PowerPoint to PDF converter free to use?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — completely free with no hidden fees or restrictions.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Do I need to install any software?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 No — it all happens directly in your browser.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Will my slides and animations be preserved?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! All text, images, layouts, fonts, and designs are preserved accurately.
//                 Animations appear as static frames in the correct order.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Are my files safe and private?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 100% safe — files are deleted automatically shortly after conversion.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I convert PowerPoint to PDF on my phone?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! Works perfectly on mobile phones, tablets, and desktops.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Does it support older PPT files?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — both PPT and PPTX formats are fully supported.
//               </p>
//             </details>

//           </div>
//         </div>
//       </section>
//     </>
//   );
// }






















// // "use client";
// // import { useState } from "react";
// // import { Upload, FileText, Download, CheckCircle, Presentation } from "lucide-react";
// // import Script from "next/script";
// // import RelatedToolsSection from "@/components/RelatedTools";

// // export default function PptToPdf() {
// //   const [file, setFile] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [downloadUrl, setDownloadUrl] = useState(null);
// //   const [success, setSuccess] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!file) return alert("Please select a PowerPoint file first!");

// //     setLoading(true);
// //     setDownloadUrl(null);
// //     setSuccess(false);

// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       const res = await fetch("/convert/ppt-to-pdf", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       const data = await res.json();

// //       if (data.success) {
// //         setDownloadUrl(`/converted/${data.filename}`);
// //         setSuccess(true);
// //       } else {
// //         alert("Conversion failed: " + (data.error || "Unknown error"));
// //       }
// //     } catch (err) {
// //       alert("Something went wrong, please try again.");
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDownload = () => {
// //     if (!downloadUrl) return;
// //     const link = document.createElement("a");
// //     link.href = downloadUrl;
// //     link.download = file.name.replace(/\.(ppt|pptx)$/i, ".pdf");
// //     link.click();
// //   };

// //   return (
// //     <>
// //       {/* ==================== SEO SCHEMAS ==================== */}
// //       <Script
// //         id="howto-schema"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "HowTo",
// //             name: "How to Convert PowerPoint to PDF Online for Free",
// //             description: "Convert PPT or PPTX presentations to PDF in seconds – formatting, animations, and slides preserved perfectly.",
// //             url: "https://pdflinx.com/ppt-to-pdf",
// //             step: [
// //               { "@type": "HowToStep", name: "Upload PowerPoint", text: "Drop your .ppt or .pptx file here." },
// //               { "@type": "HowToStep", name: "Click Convert", text: "Wait a few seconds for processing." },
// //               { "@type": "HowToStep", name: "Download PDF", text: "Get your ready-to-share PDF instantly." },
// //             ],
// //             totalTime: "PT30S",
// //             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
// //             image: "https://pdflinx.com/og-image.png",
// //           }, null, 2),
// //         }}
// //       />

// //       <Script
// //         id="breadcrumb-schema"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "BreadcrumbList",
// //             itemListElement: [
// //               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
// //               { "@type": "ListItem", position: 2, name: "PowerPoint to PDF", item: "https://pdflinx.com/ppt-to-pdf" },
// //             ],
// //           }, null, 2),
// //         }}
// //       />

// //       {/* ==================== MAIN TOOL ==================== */}
// //       <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4">
// //         <div className="max-w-4xl mx-auto">
// //           {/* Header */}
// //           <div className="text-center mb-8">
// //             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
// //               PowerPoint to PDF Converter <br /> Online (Free)
// //             </h1>
// //             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// //               Got a presentation that needs to be shared safely? Drop your PPT or PPTX here – we’ll turn it into a perfect PDF with all slides, animations, and formatting intact. No sign-up, no watermark!
// //             </p>
// //           </div>

// //           {/* Upload Card */}
// //           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               <div className="relative">
// //                 <label className="block">
// //                   <div
// //                     className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file
// //                       ? "border-green-500 bg-green-50"
// //                       : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
// //                       }`}
// //                   >
// //                     <Upload className="w-12 h-12 mx-auto mb-3 text-purple-600" />
// //                     <p className="text-lg font-semibold text-gray-700">
// //                       {file ? file.name : "Drop your PowerPoint file here or click to upload"}
// //                     </p>
// //                     <p className="text-sm text-gray-500 mt-1">
// //                       Only .ppt & .pptx files • Up to 100MB
// //                     </p>
// //                   </div>
// //                   <input
// //                     type="file"
// //                     accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
// //                     onChange={(e) => setFile(e.target.files?.[0] || null)}
// //                     className="hidden"
// //                     required
// //                   />
// //                 </label>
// //               </div>

// //               <button
// //                 type="submit"
// //                 disabled={loading || !file}
// //                 className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
// //               >
// //                 {loading ? (
// //                   <>Converting... hang tight!</>
// //                 ) : (
// //                   <>
// //                     {/* <FilePresentation className="w-5 h-5" /> */}
// //                     <Presentation className="w-5 h-5" />
// //                     Convert to PDF
// //                   </>
// //                 )}
// //               </button>
// //             </form>

// //             {/* Success State */}
// //             {success && (
// //               <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
// //                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
// //                 <p className="text-xl font-bold text-green-700 mb-3">
// //                   Done! Your PDF is ready
// //                 </p>
// //                 <p className="text-gray-600 mb-4">
// //                   All slides, formatting, and animations preserved perfectly
// //                 </p>
// //                 <button
// //                   onClick={handleDownload}
// //                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
// //                 >
// //                   <Download className="w-5 h-5" />
// //                   Download PDF
// //                 </button>
// //               </div>
// //             )}
// //           </div>

// //           <p className="text-center mt-6 text-gray-600 text-base">
// //             No account • No watermark • Files gone after 1 hour • Completely free
// //           </p>
// //         </div>
// //       </main>

// //       {/* ==================== SEO CONTENT SECTION ==================== */}
// //       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
// //         <div className="text-center mb-12">
// //           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
// //             PowerPoint to PDF Online Free – Preserve Your Slides Perfectly
// //           </h2>
// //           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
// //             Convert PPT or PPTX presentations to PDF without losing formatting, animations, fonts, or layout. Ideal for sharing slides safely – fast and always free on PDF Linx!
// //           </p>
// //         </div>

// //         <div className="grid md:grid-cols-3 gap-8 mb-16">
// //           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
// //             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
// //               {/* <FilePresentation className="w-8 h-8 text-white" /> */}
// //               <Presentation className="w-12 h-12 text-green-600 mx-auto mb-3" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Perfect Slides</h3>
// //             <p className="text-gray-600 text-sm">
// //               Layout, animations, images, and text stay exactly the same
// //             </p>
// //           </div>

// //           <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
// //             <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <CheckCircle className="w-8 h-8 text-white" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">PPT & PPTX Supported</h3>
// //             <p className="text-gray-600 text-sm">
// //               Works with old and new PowerPoint files – no issues
// //             </p>
// //           </div>

// //           <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg border border-pink-100 text-center hover:shadow-xl transition">
// //             <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <Download className="w-8 h-8 text-white" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Secure</h3>
// //             <p className="text-gray-600 text-sm">
// //               Instant conversion, no signup, files deleted after 1 hour
// //             </p>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
// //           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
// //             Convert PowerPoint to PDF in 3 Easy Steps
// //           </h3>
// //           <div className="grid md:grid-cols-3 gap-8">
// //             <div className="text-center">
// //               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// //                 1
// //               </div>
// //               <h4 className="text-lg font-semibold mb-2">Upload Presentation</h4>
// //               <p className="text-gray-600 text-sm">Drop your PPT or PPTX file here</p>
// //             </div>
// //             <div className="text-center">
// //               <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// //                 2
// //               </div>
// //               <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
// //               <p className="text-gray-600 text-sm">We preserve every detail perfectly</p>
// //             </div>
// //             <div className="text-center">
// //               <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// //                 3
// //               </div>
// //               <h4 className="text-lg font-semibold mb-2">Download PDF</h4>
// //               <p className="text-gray-600 text-sm">Share your slides safely!</p>
// //             </div>
// //           </div>
// //         </div>

// //         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
// //           Thousands use PDF Linx daily to convert presentations to PDF – reliable, fast, and always free.
// //         </p>
// //       </section>

// //       <RelatedToolsSection currentPage="ppt-to-pdf" />
// //     </>
// //   );
// // }