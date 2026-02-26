// app/pdf-excel/page.js  (or pdf-excel/page.js)

"use client";
import { useState, useRef } from "react";
import { Download, CheckCircle, FileSpreadsheet, FileText } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";

export default function PdfToExcel() {
  // ✅ Single + Multiple dono support
  const [files, setFiles] = useState([]); // array of PDFs
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(""); // single xlsx OR zip link
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const isSingle = files.length === 1;
  const isMultiple = files.length > 1;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setSuccess(false);
    setDownloadUrl("");
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!files.length) return alert("Please select a PDF file (or multiple files) first");

    setLoading(true);
    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();

    // ✅ Multiple + Single: same loop
    files.forEach((f) => formData.append("files", f));

    // Optional: backend ko hint
    formData.append("mode", isSingle ? "single" : "multiple");

    try {
      const res = await fetch("/convert/pdf-excel", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // ✅ Backend recommended behavior:
        // - single => data.download => "/convert/xyz.xlsx"
        // - multiple => data.download => "/convert/xyz.zip"
        setDownloadUrl(`/api${data.download}`);
        setSuccess(true);

        // ✅ smooth scroll to download section
        setTimeout(() => {
          const downloadSection = document.getElementById("download-section");
          if (downloadSection) {
            downloadSection.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 300);
      } else {
        alert("Conversion failed: " + (data.error || "Try again"));
      }
    } catch (error) {
      alert("Oops! Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getDownloadName = () => {
    if (isSingle) {
      return files[0]?.name
        ? files[0].name.replace(/\.pdf$/i, ".xlsx")
        : "converted.xlsx";
    }
    return "pdflinx-pdf-to-excel.zip";
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;

    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = getDownloadName();
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}

      {/* HowTo Schema - PDF to Excel (single + multiple mention) */}
      <Script
        id="howto-schema-pdf-excel"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert PDF to Excel Online for Free (Single or Multiple Files)",
              description:
                "Convert PDF tables into Excel (XLSX) in seconds. Upload a single PDF or select multiple PDFs together — free, no signup required.",
              url: "https://pdflinx.com/pdf-excel",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF (single or multiple)",
                  text: "Click the upload area and select one PDF file — or select multiple PDF files at once.",
                },
                {
                  "@type": "HowToStep",
                  name: "Convert to Excel",
                  text: "Click 'Convert to Excel' and wait a few seconds. If you uploaded multiple files, we convert them together.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download",
                  text: "Download your converted Excel file. For multiple PDFs, you can download a ZIP containing all XLSX files.",
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

      {/* Breadcrumb Schema - PDF to Excel */}
      <Script
        id="breadcrumb-schema-pdf-excel"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "PDF to Excel", item: "https://pdflinx.com/pdf-excel" },
              ],
            },
            null,
            2
          ),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              PDF to Excel Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Need to extract tables from a PDF into Excel? Drop it here — we’ll convert it into a clean{" "}
              <span className="font-semibold text-gray-800">XLSX</span>.
              <span className="font-semibold text-gray-800"> Upload a single PDF or select multiple PDFs together.</span>{" "}
              Fast and totally free!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleConvert} className="space-y-6">
              {/* Upload Area */}
              <div className="relative">
                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      files.length
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <FileText className="w-10 h-10 text-blue-600" />
                      <FileSpreadsheet className="w-10 h-10 text-green-600" />
                    </div>

                    {/* ✅ Single + Multiple UX */}
                    <p className="text-lg font-semibold text-gray-700">
                      {files.length === 0
                        ? "Drop your PDF file(s) here or click to upload"
                        : files.length === 1
                        ? files[0].name
                        : `${files.length} files selected (single + multiple upload supported)`}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Supports .pdf — select 1 file or select multiple files at once (we’ll convert them together)
                    </p>

                    {/* Optional small list preview */}
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
                    type="file"
                    multiple
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Convert Button */}
              <button
                type="submit"
                disabled={loading || files.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Converting... hang tight!</>
                ) : (
                  <>
                    <FileSpreadsheet className="w-5 h-5" />
                    Convert to Excel
                  </>
                )}
              </button>

              {/* Helper note */}
              <p className="text-center text-sm text-gray-500">
                ✅ Upload <span className="font-semibold text-gray-700">one PDF</span> for a single XLSX, or{" "}
                <span className="font-semibold text-gray-700">select multiple PDFs</span> to convert in one go
                (recommended: download as ZIP).
              </p>

              {/* Tiny disclaimer for scanned PDFs (optional but helpful) */}
              <p className="text-center text-xs text-gray-400">
                Tip: Best results for PDFs that contain selectable text/tables. Scanned image PDFs may need OCR.
              </p>
            </form>

            {/* Success State */}
            {success && (
              <div
                id="download-section"
                className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center"
              >
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />

                <p className="text-xl font-bold text-green-700 mb-2">All set!</p>

                <p className="text-base text-gray-700 mb-3">
                  {isSingle ? (
                    <>Your PDF is now converted into an Excel file (XLSX).</>
                  ) : (
                    <>
                      Your <span className="font-semibold">{files.length}</span> PDFs are converted. Download the ZIP to get
                      all XLSX files together.
                    </>
                  )}
                </p>

                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  {isSingle ? "Download XLSX" : "Download ZIP"}
                </button>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Single + multiple uploads supported • Files gone after 1 hour • Completely free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION (short + clean) ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            PDF to Excel Online Free – Extract Tables Fast
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert PDF tables into editable Excel spreadsheets. Upload{" "}
            <span className="font-semibold text-gray-800">one PDF</span> or{" "}
            <span className="font-semibold text-gray-800">multiple PDFs</span> to convert in one go.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800">
            Convert PDF to Excel in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload PDF(s)</h4>
              <p className="text-gray-600 text-sm">Select one PDF or choose multiple PDFs together.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Convert</h4>
              <p className="text-gray-600 text-sm">We extract tables and export to Excel (XLSX).</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download</h4>
              <p className="text-gray-600 text-sm">Single file = XLSX, multiple files = ZIP.</p>
            </div>
          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="pdf-excel" />
    </>
  );
}





































// "use client";
// import { useState } from "react";
// import { Upload, FileSpreadsheet, Download, CheckCircle } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";

// export default function PdfToExcel() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select a PDF file first!");

//     setLoading(true);
//     setDownloadUrl(null);
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/convert/pdf-to-excel", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         setDownloadUrl(`/converted/${data.filename}`);
//         setSuccess(true);
//       } else {
//         alert("Conversion failed: " + (data.error || "Unknown error"));
//       }
//     } catch (err) {
//       alert("Something went wrong, please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = () => {
//     if (!downloadUrl) return;
//     const link = document.createElement("a");
//     link.href = downloadUrl;
//     // link.download = file.name.replace(/\.pdf$/i, ".xlsx");
//     a.download = file.name.replace(/\.pdf$/i, ".xls");
//     link.click();
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
//             name: "How to Convert PDF to Excel Online for Free",
//             description: "Extract tables from PDF to editable Excel (XLSX) in seconds – completely free, no signup.",
//             url: "https://pdflinx.com/pdf-to-excel",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDF", text: "Drop or select your PDF file with tables." },
//               { "@type": "HowToStep", name: "Click Convert", text: "Wait a few seconds for processing." },
//               { "@type": "HowToStep", name: "Download Excel", text: "Get your editable XLSX file instantly." },
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
//               { "@type": "ListItem", position: 2, name: "PDF to Excel", item: "https://pdflinx.com/pdf-to-excel" },
//             ],
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
//               PDF to Excel Converter <br /> Online (Free)
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Got tables trapped in a PDF? Drop it here – we’ll pull them out into a clean, editable Excel file in seconds. No sign-up, no watermark!
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
//                       : "border-gray-300 hover:border-emerald-500 hover:bg-emerald-50"
//                       }`}
//                   >
//                     <Upload className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
//                     <p className="text-lg font-semibold text-gray-700">
//                       {file ? file.name : "Drop your PDF file here or click to upload"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Only .pdf files • Up to 100MB
//                     </p>
//                   </div>
//                   <input
//                     type="file"
//                     accept="application/pdf"
//                     onChange={(e) => setFile(e.target.files?.[0] || null)}
//                     className="hidden"
//                     required
//                   />
//                 </label>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading || !file}
//                 className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>Converting... hang tight!</>
//                 ) : (
//                   <>
//                     <FileSpreadsheet className="w-5 h-5" />
//                     Convert to Excel
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Success State */}
//             {success && (
//               <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
//                 <p className="text-xl font-bold text-green-700 mb-3">
//                   Done! Your Excel file is ready
//                 </p>
//                 <p className="text-gray-600 mb-4">
//                   Tables extracted and ready to edit in Excel
//                 </p>
//                 <button
//                   onClick={handleDownload}
//                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
//                 >
//                   <Download className="w-5 h-5" />
//                   Download Excel (.xls)
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
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
//             PDF to Excel Online Free – Extract Tables Perfectly
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Turn scanned or digital PDFs with tables into editable Excel spreadsheets. Accurate table detection, formulas preserved where possible – fast and always free on PDF Linx!
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FileSpreadsheet className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Tables Extracted</h3>
//             <p className="text-gray-600 text-sm">
//               Rows, columns, and data pulled accurately into Excel sheets
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border border-emerald-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Editable XLSX</h3>
//             <p className="text-gray-600 text-sm">
//               Open in Excel, Google Sheets – edit, calculate, sort freely
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
//             <p className="text-gray-600 text-sm">
//               Instant conversion, no signup, files deleted after 1 hour
//             </p>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Convert PDF to Excel in 3 Easy Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload Your PDF</h4>
//               <p className="text-gray-600 text-sm">Drop the file with tables here</p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
//               <p className="text-gray-600 text-sm">We extract tables intelligently</p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download Excel</h4>
//               <p className="text-gray-600 text-sm">Get your editable spreadsheet!</p>
//             </div>
//           </div>
//         </div>

//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           Thousands use PDF Linx daily to free trapped data from PDFs into Excel – accurate, fast, and always free.
//         </p>
//       </section>

//       <RelatedToolsSection currentPage="pdf-to-excel" />
//     </>
//   )