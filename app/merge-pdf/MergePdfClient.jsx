// app/merge-pdf/page.js

"use client";
import { useState, useRef } from "react";
import { Upload, FileText, Download, CheckCircle, X, Files } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";


export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
    }
  };

  const handleMerge = async (e) => {
    e.preventDefault();
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }

    setLoading(true);
    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/convert/merge-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
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
        alert("Merge failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error merging PDFs. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged-pdf.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download merged PDF");
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <>


      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

      {/* HowTo Schema - Merge PDF */}
      <Script
        id="howto-schema-merge-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Merge Multiple PDF Files Online for Free",
            description: "Combine 2 or more PDF files into one single document in seconds - 100% free, no registration required.",
            url: "https://pdflinx.com/merge-pdf",
            step: [
              {
                "@type": "HowToStep",
                name: "Select PDF Files",
                text: "Click 'Select Files' and choose 2 or more PDF files from your device. You can select multiple files at once."
              },
              {
                "@type": "HowToStep",
                name: "Click Merge PDFs",
                text: "Press the 'Merge PDFs' button and wait a few seconds while we combine your files."
              },
              {
                "@type": "HowToStep",
                name: "Download Merged PDF",
                text: "Your merged PDF will be ready instantly - click download to save the combined file."
              }
            ],
            totalTime: "PT45S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            tool: [{ "@type": "HowToTool", name: "PDF Linx Merge Tool" }],
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      {/* Breadcrumb Schema - Merge PDF */}
      <Script
        id="breadcrumb-schema-merge-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Merge PDF", item: "https://pdflinx.com/merge-pdf" }
            ]
          }, null, 2),
        }}
      />


      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Merge PDF Files Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Need to combine a few PDFs into one? Drop them here – we’ll stitch them together perfectly. Fast, easy, and totally free!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="space-y-6">
              {/* Upload Area */}
              <div>
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                >
                  <Files className="w-12 h-12 mx-auto mb-3 text-indigo-600" />
                  <p className="text-lg font-semibold text-gray-800">
                    {files.length > 0 ? `${files.length} PDF${files.length > 1 ? 's' : ''} ready` : "Drop PDFs here or click to upload"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Combine 2 or more into one clean file</p>
                </div>

                {/* Selected Files Preview */}
                {files.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-xl">
                    {files.map((file, index) => (
                      <div key={index} className="relative group bg-white p-3 rounded-lg shadow hover:shadow-md transition">
                        <FileText className="w-10 h-10 text-indigo-600 mx-auto mb-1" />
                        <p className="text-xs text-center font-medium truncate">{file.name}</p>
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Merge Button */}
              <button
                onClick={handleMerge}
                disabled={loading || files.length < 2}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Merging your PDFs..."
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Merge PDFs Now
                  </>
                )}
              </button>
            </div>

            {/* Success State */}
            {success && (
              <div
              id="download-section"  // ✅ BAS YE EK LINE ADD KARO

              className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">All merged!</p>
                <p className="text-base text-gray-700 mb-3">Your PDFs are now one perfect file</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  Download Merged PDF
                </button>
              </div>
            )}
          </div>

          {/* Trust Footer */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No sign-up • No limits • Files gone after 1 hour • 100% free & secure
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Merge PDF Online Free – Combine Files in Seconds
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Got multiple PDFs that belong together? Merge them into one clean document here – order stays perfect, super fast, and always free on PDF Linx!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Merge as Many as You Want</h3>
            <p className="text-gray-600 text-sm">
              Combine 2 or 200 PDFs – no limits, no fees.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Everything Stays Perfect</h3>
            <p className="text-gray-600 text-sm">
              Formatting, quality, order – just like the originals.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
            <p className="text-gray-600 text-sm">
              Works instantly – files deleted after 1 hour, no sign-up needed.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Merge PDFs in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDFs</h4>
              <p className="text-gray-600 text-sm">Drop multiple files – easy preview.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Remove if Needed</h4>
              <p className="text-gray-600 text-sm">Click X on any you don’t want.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Merge & Download</h4>
              <p className="text-gray-600 text-sm">Your combined PDF is ready!</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Thousands merge PDFs daily with PDF Linx – simple, reliable, and always free.
        </p>
      </section>


      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Merge PDF – Free Online PDF Merger by PDFLinx
        </h2>

        {/* Intro */}
        <p className="text-base leading-7 mb-6">
          Ever ended up with a bunch of separate PDF files—like invoices, reports, scanned pages, or contracts—that you wish were in one clean document?
          It’s frustrating to send multiple files or keep track of them.
          That’s why we built the <span className="font-medium text-slate-900">PDFLinx Merge PDF tool</span>—a completely free online merger that combines multiple PDFs into a single, organized file in seconds. No software, no watermarks, no hassle.
        </p>

        {/* What is */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What is PDF Merging?
        </h3>
        <p className="leading-7 mb-6">
          PDF merging (also called combining) takes two or more PDF files and joins them into one seamless document.
          You can rearrange pages, mix different documents, and create a single PDF that flows perfectly from start to finish—ideal for reports, applications, e-books, or project submissions.
        </p>

        {/* Why merge */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Merge Your PDF Files?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Combine multiple PDFs into one easy-to-share file</li>
          <li>Organize scanned documents, receipts, or chapters neatly</li>
          <li>Rearrange pages exactly the way you want</li>
          <li>Simplify emailing, uploading, or archiving</li>
          <li>Create professional-looking compilations quickly</li>
        </ul>

        {/* Steps */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Merge PDFs Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload all your PDF files (drag & drop or click to add)</li>
          <li>Drag to rearrange the order of files or pages</li>
          <li>Click “Merge PDF”</li>
          <li>Download your combined PDF instantly</li>
        </ol>

        <p className="mb-6">
          No account needed, no watermark added, no installation—100% free and super simple.
        </p>

        {/* Features box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx PDF Merger
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>100% free online merger</li>
            <li>Merge unlimited PDFs (within reason)</li>
            <li>Easy drag-and-drop reordering</li>
            <li>Preserves original quality & formatting</li>
            <li>Fast and reliable processing</li>
            <li>Works on mobile & desktop</li>
            <li>No file storage – complete privacy</li>
          </ul>
        </div>

        {/* Audience */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Combine assignment pages or research papers</li>
          <li><strong>Professionals:</strong> Merge reports, proposals, or appendices</li>
          <li><strong>Businesses:</strong> Create single invoices or contract packages</li>
          <li><strong>Job Seekers:</strong> Attach cover letter + resume + certificates in one file</li>
          <li><strong>Anyone:</strong> Organize scanned documents or e-books easily</li>
        </ul>

        {/* Safety */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Safe to Use?
        </h3>
        <p className="leading-7 mb-6">
          Yes — completely safe. We care about your privacy.
          All uploaded PDFs are processed securely and automatically deleted from our servers shortly after merging.
          Your files are never stored permanently or shared with anyone.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Merge PDFs Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx works perfectly on Windows, macOS, Linux, Android, and iOS devices.
          Whether you're at home, in the office, or on the go, combine your PDFs into one organized file in just a few clicks.
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
                Is the PDF merger free to use?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — completely free with no limits or hidden charges.
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
                Can I rearrange the pages before merging?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! Just drag and drop files or pages to get the perfect order.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Will the quality of my PDFs be affected?
              </summary>
              <p className="mt-2 text-gray-600">
                No — we preserve the original formatting, images, and text quality.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my files safe and private?
              </summary>
              <p className="mt-2 text-gray-600">
                100% safe — all files are deleted automatically after processing.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I merge PDFs on my phone?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! Works smoothly on mobile phones, tablets, and desktops.
              </p>
            </details>

          </div>
        </div>
      </section>
      <RelatedToolsSection currentPage="merge-pdf" />

      {/* 🔗 Comparison Links */}
      <section className="max-w-4xl mx-auto mb-16 px-4">
        <div className="rounded-2xl border bg-white p-6 md:p-8 shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-slate-900">
            Compare PDF Merge tools
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Compare PDF Linx merge tool with other popular PDF mergers.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href="/compare/pdflinx-vs-ilovepdf"
              className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    PDF Linx vs iLovePDF (Merge PDF)
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Ads, file limits, and merge order control.
                  </div>
                </div>
                <span className="text-indigo-600">→</span>
              </div>
            </a>

            <a
              href="/compare/pdflinx-vs-smallpdf"
              className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    PDF Linx vs Smallpdf (Merge)
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Free usage limits and signup requirements.
                  </div>
                </div>
                <span className="text-indigo-600">→</span>
              </div>
            </a>
          </div>
        </div>
      </section>


    </>
  );
}
