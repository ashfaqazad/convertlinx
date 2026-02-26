// app/excel-pdf/page.js  (or excel-pdf/page.js)

"use client";
import { useState, useRef } from "react";
import { Download, CheckCircle, FileSpreadsheet } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";

export default function ExcelToPDF() {
  // ✅ Single + Multiple dono support (same input)
  const [files, setFiles] = useState([]); // array of Files (1 file ho to bhi array me 1 item)
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(""); // single pdf OR zip link (backend par depend)
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
    if (!files.length) return alert("Please select an Excel file (or multiple files) first");

    setLoading(true);
    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();

    // ✅ Multiple + Single: same loop (1 file ho to loop 1 bar chalega)
    files.forEach((f) => formData.append("files", f));

    // Optional: backend ko hint de do
    formData.append("mode", isSingle ? "single" : "multiple");

    try {
      const res = await fetch("/convert/excel-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // ✅ Backend recommended behavior:
        // - single file => data.download => "/convert/xyz.pdf"
        // - multiple files => data.download => "/convert/xyz.zip"
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
        ? files[0].name.replace(/\.(xlsx|xls)$/i, ".pdf")
        : "converted.pdf";
    }
    // multiple files => zip
    return "pdflinx-excel-pdf.zip";
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

      {/* HowTo Schema - Excel to PDF (single + multiple mention) */}
      <Script
        id="howto-schema-excel-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert Excel to PDF Online for Free (Single or Multiple Files)",
              description:
                "Convert Excel spreadsheets (XLSX, XLS) to PDF in seconds. You can upload a single file or select multiple files together — free, no signup required.",
              url: "https://pdflinx.com/excel-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload Excel (single or multiple)",
                  text: "Click the upload area and select one Excel file — or select multiple Excel files at once.",
                },
                {
                  "@type": "HowToStep",
                  name: "Convert to PDF",
                  text: "Click 'Convert to PDF' and wait a few seconds. If you uploaded multiple files, we convert them together.",
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

      {/* Breadcrumb Schema - Excel to PDF */}
      <Script
        id="breadcrumb-schema-excel-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "Excel to PDF", item: "https://pdflinx.com/excel-pdf" },
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
              Excel to PDF Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Got an Excel sheet you want to share as PDF? Drop it here — tables, formulas, charts stay perfect.
              <span className="font-semibold text-gray-800"> You can upload a single file or select multiple files together.</span>{" "}
              Quick and totally free!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleConvert} className="space-y-6">
              {/* Upload Area */}
              <div className="relative">
                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                      }`}
                  >
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-blue-600" />

                    {/* ✅ Single + Multiple UX */}
                    <p className="text-lg font-semibold text-gray-700">
                      {files.length === 0
                        ? "Drop your Excel file(s) here or click to upload"
                        : files.length === 1
                          ? files[0].name
                          : `${files.length} files selected (single + multiple upload supported)`}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Supports .xlsx & .xls — select 1 file or select multiple files at once (we’ll convert them together)
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
                    accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
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
                    Convert to PDF
                  </>
                )}
              </button>

              {/* Small helper note inside card */}
              <p className="text-center text-sm text-gray-500">
                ✅ Upload <span className="font-semibold text-gray-700">one Excel file</span> for a single PDF, or{" "}
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

                <p className="text-xl font-bold text-green-700 mb-2">All set!</p>

                <p className="text-base text-gray-700 mb-3">
                  {isSingle ? (
                    <>Your spreadsheet is now a crisp PDF.</>
                  ) : (
                    <>
                      Your <span className="font-semibold">{files.length}</span> files are converted. Download the ZIP to get
                      all PDFs together.
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

          {/* Footer Note */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Single + multiple uploads supported • Files gone after 1 hour • Completely free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Excel to PDF Online Free – Spreadsheets Made Shareable
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Turn your Excel files into clean PDFs — tables, charts, formulas stay exactly as they are. Whether you have{" "}
            <span className="font-semibold text-gray-800">one file</span> or{" "}
            <span className="font-semibold text-gray-800">multiple Excel files</span>, you can upload and convert in one go.
            Great for reports, invoices, or sharing without worries. Fast and free on PDF Linx!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l1 10h10l1-10h2M7 7v10m4-10v10m4-10v10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Everything Looks Perfect</h3>
            <p className="text-gray-600 text-sm">
              Tables, charts, formulas — your sheet stays beautiful in PDF (single file or batch conversion).
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">XLS & XLSX Ready</h3>
            <p className="text-gray-600 text-sm">
              Works with any Excel file — even multi-sheet ones. You can upload one or multiple files.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
            <p className="text-gray-600 text-sm">
              Instant conversion — no sign-up, no watermark, files deleted after 1 hour (single + multiple supported).
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Convert Excel to PDF in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your Sheet(s)</h4>
              <p className="text-gray-600 text-sm">
                Drop your XLS or XLSX file — or select multiple Excel files together.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
              <p className="text-gray-600 text-sm">
                We keep the layout spot-on (single file or batch conversion).
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download</h4>
              <p className="text-gray-600 text-sm">
                Download your PDF — for multiple files, download a ZIP with all PDFs.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Thousands turn to PDF Linx daily to make Excel into perfect PDFs — fast, reliable, and always free (single + multiple uploads supported).
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Excel to PDF Converter – Free Online Tool by PDFLinx
        </h2>

        {/* Intro */}
        <p className="text-base leading-7 mb-6">
          Ever needed to share an Excel spreadsheet but worried it’ll look different on someone else’s computer?
          Or maybe you want to lock down those formulas and formatting so nothing gets accidentally changed?
          That’s where our <span className="font-medium text-slate-900">PDFLinx Excel to PDF Converter</span> comes in.
          It’s a 100% free online tool that turns your Excel files (XLS or XLSX) into clean, professional PDFs in seconds—no installation, no watermarks, no fuss.
          <span className="font-semibold text-slate-900"> Best part:</span> you can upload a single file or select multiple Excel files together.
        </p>

        {/* What is */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">What is Excel to PDF Conversion?</h3>
        <p className="leading-7 mb-6">
          Excel to PDF conversion takes your editable spreadsheet and transforms it into a fixed-layout PDF document.
          Everything—formulas, charts, tables, colors, and formatting—stays exactly as you designed it,
          no matter what device or software the recipient uses. It’s the perfect way to share reports, budgets, invoices, or data tables professionally.
          And if you have multiple spreadsheets, you can convert them together in one batch.
        </p>

        {/* Why convert */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">Why Convert Excel Files to PDF?</h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Preserves all formatting, charts, colors, and grid lines perfectly</li>
          <li>Looks identical on any device—no missing fonts or shifted columns</li>
          <li>Protects your data and formulas from accidental edits</li>
          <li>Ideal for sharing financial reports, invoices, budgets, or dashboards</li>
          <li>Convert single file or multiple Excel files at once (batch conversion)</li>
        </ul>

        {/* Steps */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">How to Convert Excel to PDF Online</h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your Excel file (XLS or XLSX) — or select multiple files together</li>
          <li>Click the “Convert to PDF” button</li>
          <li>Wait a few seconds while we process it</li>
          <li>Download your PDF instantly (for multiple files, download a ZIP containing all PDFs)</li>
        </ol>

        <p className="mb-6">No registration, no watermark, no software needed—completely free and fast.</p>

        {/* Features box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Excel to PDF Converter
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>100% free online converter</li>
            <li>Supports XLS and XLSX formats</li>
            <li>Full preservation of charts & formulas</li>
            <li>High-quality, print-ready output</li>
            <li>Single & multiple file upload support</li>
            <li>Works on mobile & desktop</li>
            <li>No file storage – complete privacy</li>
          </ul>
        </div>

        {/* Audience */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">Who Should Use This Tool?</h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Accountants & Finance Teams:</strong> Share monthly reports and budgets securely</li>
          <li><strong>Business Owners:</strong> Send professional invoices and quotes</li>
          <li><strong>Students:</strong> Submit data analysis or project spreadsheets neatly</li>
          <li><strong>Analysts:</strong> Present dashboards and charts without formatting issues</li>
          <li><strong>Anyone with Excel:</strong> Lock in your hard work and share confidently</li>
        </ul>

        {/* Safety */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">Is PDFLinx Safe to Use?</h3>
        <p className="leading-7 mb-6">
          Yes — completely safe. We take your privacy seriously.
          Your uploaded files are processed securely and automatically deleted from our servers shortly after conversion.
          We never store or share your documents. This applies to both single-file and multiple-file uploads.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">Convert Excel to PDF Anytime, Anywhere</h3>
        <p className="leading-7">
          PDFLinx works perfectly on Windows, macOS, Linux, Android, and iOS devices.
          All you need is a browser and an internet connection—turn any Excel spreadsheet (single or multiple) into polished PDFs in just a few clicks.
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
                Is the Excel to PDF converter free to use?
              </summary>
              <p className="mt-2 text-gray-600">Yes — totally free, no hidden charges or limits.</p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I upload multiple Excel files together?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes. You can select a single Excel file or select multiple files at once. If you upload multiple files,
                you can download them together as a ZIP.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Do I need to install any software?
              </summary>
              <p className="mt-2 text-gray-600">No — everything works directly in your browser.</p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Will my charts and formatting be preserved?
              </summary>
              <p className="mt-2 text-gray-600">
                Absolutely. Tables, charts, colors, fonts, and layout are preserved with high accuracy.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my files safe and private?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — files are securely processed and deleted automatically after conversion (single or multiple uploads).
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I convert Excel to PDF on my phone?
              </summary>
              <p className="mt-2 text-gray-600">Yes! It works smoothly on mobile phones, tablets, and desktops.</p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Does it support older XLS files?
              </summary>
              <p className="mt-2 text-gray-600">Yes — both XLS and XLSX formats are fully supported.</p>
            </details>
          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="excel-pdf" />
    </>
  );
}



























// // app/excel-pdf/page.js   (or excel-pdf/page.js)

// "use client";
// import { useState, useRef } from "react";
// import { Upload, Download, CheckCircle, FileSpreadsheet } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";



// export default function ExcelToPDF() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [success, setSuccess] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => setFile(e.target.files[0] || null);

//   const handleConvert = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select an Excel file first");

//     setLoading(true);
//     setDownloadUrl("");
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/api/convert/excel-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         setDownloadUrl(`/api${data.download}`);
//         setSuccess(true);
//       } else {
//         alert("Conversion failed: " + (data.error || "Try again"));
//       }
//     } catch (error) {
//       alert("Oops! Something went wrong. Please try again.");
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
//       a.download = file ? file.name.replace(/\.(xlsx|xls)$/i, ".pdf") : "converted.pdf";
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("Download failed");
//     }
//   };

//   return (
//     <>

//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}

//       {/* HowTo Schema - Excel to PDF */}
//       <Script
//         id="howto-schema-excel-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert Excel to PDF Online for Free",
//             description: "Convert any Excel spreadsheet (XLSX, XLS) to PDF in seconds - completely free, no signup required.",
//             url: "https://pdflinx.com/excel-pdf",
//             step: [
//               { "@type": "HowToStep", name: "Upload Excel", text: "Click the upload area and select your .xlsx or .xls file." },
//               { "@type": "HowToStep", name: "Convert to PDF", text: "Click 'Convert to PDF' and wait a few seconds." },
//               { "@type": "HowToStep", name: "Download", text: "Download your perfectly formatted PDF file instantly." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       {/* Breadcrumb Schema - Excel to PDF */}
//       <Script
//         id="breadcrumb-schema-excel-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Excel to PDF", item: "https://pdflinx.com/excel-pdf" }
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
//               Excel to PDF Converter <br /> Online (Free)
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Got an Excel sheet you want to share as PDF? Drop it here – tables, formulas, charts stay perfect. Quick and totally free!
//             </p>
//           </div>

//           {/* Main Card */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <form onSubmit={handleConvert} className="space-y-6">
//               {/* Upload Area */}
//               <div className="relative">
//                 <label className="block">
//                   <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
//                     <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-blue-600" />
//                     <p className="text-lg font-semibold text-gray-700">
//                       {file ? file.name : "Drop your Excel file here or click to upload"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">Supports .xlsx & .xls – layout stays perfect</p>
//                   </div>
//                   <input
//                     type="file"
//                     accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
//                     onChange={handleFileChange}
//                     ref={fileInputRef}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               {/* Convert Button */}
//               <button
//                 type="submit"
//                 disabled={loading || !file}
//                 className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>Converting... hang tight!</>
//                 ) : (
//                   <>
//                     <FileSpreadsheet className="w-5 h-5" />
//                     Convert to PDF
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Success State */}
//             {success && (
//               <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
//                 <p className="text-xl font-bold text-green-700 mb-2">All set!</p>
//                 <p className="text-base text-gray-700 mb-3">Your spreadsheet is now a crisp PDF</p>
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
//             Excel to PDF Online Free – Spreadsheets Made Shareable
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Turn your Excel files into clean PDFs – tables, charts, formulas stay exactly as they are. Great for reports, invoices, or just sharing without worries. Fast and free on PDF Linx!
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l1 10h10l1-10h2M7 7v10m4-10v10m4-10v10" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Everything Looks Perfect</h3>
//             <p className="text-gray-600 text-sm">
//               Tables, charts, formulas – your sheet stays beautiful in PDF.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">XLS & XLSX Ready</h3>
//             <p className="text-gray-600 text-sm">
//               Works with any Excel file – even multi-sheet ones.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
//             <p className="text-gray-600 text-sm">
//               Instant conversion – no sign-up, no watermark, files deleted after 1 hour.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Convert Excel to PDF in 3 Easy Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload Your Sheet</h4>
//               <p className="text-gray-600 text-sm">Drop your XLS or XLSX file here.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
//               <p className="text-gray-600 text-sm">We keep the layout spot-on.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download PDF</h4>
//               <p className="text-gray-600 text-sm">Your ready-to-share PDF is here!</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           Thousands turn to PDF Linx daily to make Excel into perfect PDFs – fast, reliable, and always free.
//         </p>
//       </section>


//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//         {/* Heading */}
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//           Excel to PDF Converter – Free Online Tool by PDFLinx
//         </h2>

//         {/* Intro */}
//         <p className="text-base leading-7 mb-6">
//           Ever needed to share an Excel spreadsheet but worried it’ll look different on someone else’s computer?
//           Or maybe you want to lock down those formulas and formatting so nothing gets accidentally changed?
//           That’s where our <span className="font-medium text-slate-900">PDFLinx Excel to PDF Converter</span> comes in.
//           It’s a 100% free online tool that turns your Excel files (XLS or XLSX) into clean, professional PDFs in seconds—no installation, no watermarks, no fuss.
//         </p>

//         {/* What is */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           What is Excel to PDF Conversion?
//         </h3>
//         <p className="leading-7 mb-6">
//           Excel to PDF conversion takes your editable spreadsheet and transforms it into a fixed-layout PDF document.
//           Everything—formulas, charts, tables, colors, and formatting—stays exactly as you designed it,
//           no matter what device or software the recipient uses. It’s the perfect way to share reports, budgets, invoices, or data tables professionally.
//         </p>

//         {/* Why convert */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Why Convert Excel Files to PDF?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li>Preserves all formatting, charts, colors, and grid lines perfectly</li>
//           <li>Looks identical on any device—no missing fonts or shifted columns</li>
//           <li>Protects your data and formulas from accidental edits</li>
//           <li>Ideal for sharing financial reports, invoices, budgets, or dashboards</li>
//           <li>Smaller file size and easier to print or archive</li>
//         </ul>

//         {/* Steps */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           How to Convert Excel to PDF Online
//         </h3>
//         <ol className="space-y-2 mb-6 list-decimal pl-6">
//           <li>Upload your Excel file (XLS or XLSX) – just drag & drop or click</li>
//           <li>Click the “Convert to PDF” button</li>
//           <li>Wait a few seconds while we process it</li>
//           <li>Download your perfect PDF instantly</li>
//         </ol>

//         <p className="mb-6">
//           No registration, no watermark, no software needed—completely free and fast.
//         </p>

//         {/* Features box */}
//         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
//           <h3 className="text-xl font-semibold text-slate-900 mb-4">
//             Features of PDFLinx Excel to PDF Converter
//           </h3>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
//             <li>100% free online converter</li>
//             <li>Supports XLS and XLSX formats</li>
//             <li>Full preservation of charts & formulas</li>
//             <li>High-quality, print-ready output</li>
//             <li>Super-fast conversion</li>
//             <li>Works on mobile & desktop</li>
//             <li>No file storage – complete privacy</li>
//           </ul>
//         </div>

//         {/* Audience */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Who Should Use This Tool?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li><strong>Accountants & Finance Teams:</strong> Share monthly reports and budgets securely</li>
//           <li><strong>Business Owners:</strong> Send professional invoices and quotes</li>
//           <li><strong>Students:</strong> Submit data analysis or project spreadsheets neatly</li>
//           <li><strong>Analysts:</strong> Present dashboards and charts without formatting issues</li>
//           <li><strong>Anyone with Excel:</strong> Lock in your hard work and share confidently</li>
//         </ul>

//         {/* Safety */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Is PDFLinx Safe to Use?
//         </h3>
//         <p className="leading-7 mb-6">
//           Yes — completely safe. We take your privacy seriously.
//           Your uploaded files are processed securely and automatically deleted from our servers shortly after conversion.
//           We never store or share your documents.
//         </p>

//         {/* Closing */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Convert Excel to PDF Anytime, Anywhere
//         </h3>
//         <p className="leading-7">
//           PDFLinx works perfectly on Windows, macOS, Linux, Android, and iOS devices.
//           All you need is a browser and an internet connection—turn any Excel spreadsheet into a polished PDF in just a few clicks.
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
//                 Is the Excel to PDF converter free to use?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — totally free, no hidden charges or limits.
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
//                 Will my charts and formatting be preserved?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Absolutely. Tables, charts, colors, fonts, and layout are preserved with high accuracy.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Are my files safe and private?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — files are securely processed and deleted automatically after conversion.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I convert Excel to PDF on my phone?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! It works smoothly on mobile phones, tablets, and desktops.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Does it support older XLS files?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — both XLS and XLSX formats are fully supported.
//               </p>
//             </details>

//           </div>
//         </div>
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

//       <RelatedToolsSection currentPage="excel-pdf" />

//     </>
//   );
// }




