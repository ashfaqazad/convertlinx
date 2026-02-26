// app/word-to-pdf/page.js  (ya jsx—same)

"use client";
import { useState } from "react";
import { Upload, FileText, Download, CheckCircle } from "lucide-react";
import Script from "next/script"; // schemas
import RelatedToolsSection from "@/components/RelatedTools";

export default function WordToPdf() {
  const [files, setFiles] = useState([]); // ✅ multiple
  const [loading, setLoading] = useState(false);
  // const [downloadUrl, setDownloadUrl] = useState(null); // ✅ only used for ZIP case
  const [success, setSuccess] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return alert("Please select a Word file first!");

    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    for (const f of files) formData.append("files", f);

    try {
      const res = await fetch("/convert/word-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        // backend kabhi JSON error bhej sakta hai
        let msg = "Conversion failed";
        try {
          const maybeJson = await res.json();
          msg = maybeJson?.error || msg;
        } catch { }
        throw new Error(msg);
      }

      const contentType = (res.headers.get("content-type") || "").toLowerCase();

      // ✅ SINGLE: PDF stream
      if (contentType.includes("application/pdf")) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = files[0].name.replace(/\.(doc|docx)$/i, ".pdf");
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);

        setSuccess(true);
        setFiles([]);
        return;
      }

      // ✅ MULTIPLE: ZIP stream (PK...)
      if (contentType.includes("application/zip") || contentType.includes("application/octet-stream")) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        // a.download = `pdflinx-word-to-pdf-${Date.now()}.zip`;
        a.download = "pdflinx-word-to-pdf.zip";

        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);

        setSuccess(true);
        setFiles([]);
        return;
      }

      // fallback: agar backend kuch aur bhej de
      throw new Error("Unexpected response from server.");
    } catch (err) {
      alert(err.message || "Something went wrong, please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Client-Side Safe) ==================== */}
      <Script
        id="howto-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert Word to PDF Online for Free",
              description:
                "Convert one or multiple Word documents (DOC/DOCX) to PDF in just 3 simple steps — completely free, no signup needed.",
              url: "https://pdflinx.com/word-to-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload Word File(s)",
                  text: "Upload one Word file or select multiple DOC/DOCX files at the same time.",
                },
                {
                  "@type": "HowToStep",
                  name: "Click Convert",
                  text: "Press the 'Convert to PDF' button and wait a few seconds while your file(s) are processed.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download PDF (or ZIP)",
                  text: "Download your PDF instantly. If you converted multiple files, you'll get a ZIP with all PDFs inside.",
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
        id="breadcrumb-schema-word"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "Word to PDF", item: "https://pdflinx.com/word-to-pdf" },
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
              Word to PDF Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Got a Word doc that needs to become a PDF? Upload one file — or select multiple Word files at once —
              and we’ll convert them into high-quality PDFs in seconds. No sign-up, no watermark, looks exactly the same!
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Input */}
              <div className="relative">
                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                      }`}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <p className="text-lg font-semibold text-gray-700">
                      {files.length
                        ? `${files.length} file(s) selected`
                        : "Drop your Word file(s) here or click to upload"}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Only .doc & .docx files
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      Tip: Upload multiple Word files at once. A single file downloads as PDF, multiple files download as a ZIP.
                    </p>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="hidden"
                    required
                  />
                </label>
              </div>

              {/* Convert Button */}
              {/* <button
                type="submit"
                disabled={loading || !files.length}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Converting... hang tight!</>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Convert to PDF
                  </>
                )}
              </button>

              {files.length > 1 && (
                <div className="text-sm text-gray-600 text-center mt-4 space-y-1">
                  <p>
                    ⏱️ <strong>Multiple files conversion may take up to 1 minute.</strong> Please don’t close this tab.
                  </p>
                  <p>
                    🔢 You can convert up to <strong>10 Word files at once</strong>.
                  </p>
                </div>
              )} */}

              {/* Convert Button */}
              {/* Convert Button */}
              <button
                type="submit"
                disabled={loading || !files.length}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Converting... hang tight!</>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Convert to PDF
                  </>
                )}
              </button>

              {/* ✅ ALWAYS show UX notice */}
              <div className="text-sm text-gray-600 text-center mt-4 space-y-1">
                <p>
                  ⏱️ <strong>Multiple files conversion may take up to 1 minute.</strong>
                  Please don’t close this tab.
                </p>
                <p>
                  🔢 You can convert up to <strong>10 Word files at once</strong>.
                </p>
              </div>

            </form>

            {/* Success State */}
            {/* {success && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-3">
                  Done! Your {files.length === 1 ? "PDF" : "ZIP"} is ready
                </p> */}

            {/* ✅ Only show download button for ZIP */}
            {/* {files.length > 1 && downloadUrl && (
                  <button
                    onClick={handleDownloadZip}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                  >
                    <Download className="w-5 h-5" />
                    Download ZIP
                  </button>
                )} */}


            {/* </div>
            )} */}


            {success && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">
                  Done! Your file(s) downloaded automatically 🎉
                </p>
                <p className="text-base text-gray-700">
                  Check your downloads folder.
                </p>
              </div>
            )}

          </div>

          {/* Footer Note */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Files gone after 1 hour • Completely free • Supports single & bulk conversions
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Word to PDF Online Free – Turn DOC/DOCX into PDF in a Flash
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to send a Word file but want it to look the same on every device? Convert it to PDF here – formatting, fonts, images, tables stay perfect.
            You can also convert multiple Word files at once and download them together.
            Quick, clean, and always free on PDF Linx!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Everything Stays Perfect</h3>
            <p className="text-gray-600 text-sm">
              Fonts, pics, tables, headings – your doc looks exactly the same in PDF.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">DOC & DOCX Welcome</h3>
            <p className="text-gray-600 text-sm">
              Works with any Word file – even fancy ones with styles and layouts.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Worry-Free</h3>
            <p className="text-gray-600 text-sm">
              Instant conversion on any device — supports single and bulk uploads — no sign-up, no watermark, files deleted after 1 hour.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Convert Word to PDF in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your File(s)</h4>
              <p className="text-gray-600 text-sm">Upload one Word file or select multiple DOC/DOCX files at the same time.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
              <p className="text-gray-600 text-sm">We keep everything looking sharp.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download PDF (or ZIP)</h4>
              <p className="text-gray-600 text-sm">Single file downloads as PDF. Multiple files download as a ZIP with all PDFs inside.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Thousands use PDF Linx daily to turn Word into perfect PDFs – fast, reliable, and always free.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Word to PDF Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          A Word to PDF converter is an essential online tool that allows users to convert Word documents (DOC or DOCX) into secure, professional, and universally compatible PDF files.
          PDFs are widely used because they preserve formatting, layout, fonts, images, and structure across all devices.
          <span className="font-medium text-slate-900"> PDFLinx Word to PDF Converter</span>{" "}
          lets you convert files instantly without installing any software — and you can also convert multiple Word files at once.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">What is Word to PDF Conversion?</h3>
        <p className="leading-7 mb-6">
          Word to PDF conversion is the process of transforming editable Microsoft Word documents into fixed-layout PDF files.
          This ensures your document looks exactly the same on every device, browser, and operating system.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Why Convert Word Files to PDF?</h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Preserves fonts, margins, tables, and images</li>
          <li>Opens perfectly on all devices without Microsoft Word</li>
          <li>Gives a professional and polished appearance</li>
          <li>More secure and harder to edit accidentally</li>
          <li>Optimized file size for easy sharing</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">How to Convert Word to PDF Online</h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload one Word file — or select multiple Word files (DOC/DOCX)</li>
          <li>Click the “Convert to PDF” button</li>
          <li>Wait a few seconds while the file(s) are processed</li>
          <li>Download your PDF instantly (or a ZIP if you converted multiple files)</li>
        </ol>

        <p className="mb-6">No registration, no watermark, and no installation required.</p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Word to PDF Converter
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>Free online Word to PDF converter</li>
            <li>Supports DOC & DOCX formats</li>
            <li>Convert multiple Word files to PDF at once</li>
            <li>Bulk conversion with ZIP download for multiple files</li>
            <li>High-quality PDF output</li>
            <li>Original layout & formatting preserved</li>
            <li>Fast conversion speed</li>
            <li>Works on desktop & mobile</li>
            <li>No file storage – privacy protected</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Who Should Use This Tool?</h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Submit assignments in PDF format</li>
          <li><strong>Professionals:</strong> Share resumes and reports securely</li>
          <li><strong>Businesses:</strong> Convert invoices and contracts</li>
          <li><strong>Freelancers:</strong> Deliver polished documents to clients</li>
          <li><strong>Teachers:</strong> Distribute learning material easily</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Is PDFLinx Safe to Use?</h3>
        <p className="leading-7 mb-6">
          Yes. PDFLinx is privacy-focused. Uploaded files are processed automatically and deleted shortly after conversion.
          Your documents are never shared or stored permanently.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Convert Word to PDF Anytime, Anywhere</h3>
        <p className="leading-7">
          PDFLinx works on Windows, macOS, Linux, Android, and iOS devices. All you need is an internet connection and a modern browser
          to convert Word documents into professional PDFs in seconds — whether you upload one file or multiple files at once.
        </p>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Is the Word to PDF converter free to use?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes, PDFLinx offers a completely free Word to PDF converter with no hidden charges.
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
                Will my Word formatting be preserved?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes, fonts, tables, images, and layout are preserved accurately.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my files safe and private?
              </summary>
              <p className="mt-2 text-gray-600">
                Files are processed securely and deleted automatically after conversion.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I convert Word to PDF on mobile?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes, PDFLinx works perfectly on mobile, tablet, and desktop devices.
              </p>
            </details>


            {/* ✅ NEW FAQS (Bulk support) */}
            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I convert multiple Word files to PDF at once?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes. PDFLinx allows you to upload and convert multiple Word files at the same time.
                If you upload more than one file, all converted PDFs are downloaded together in a ZIP file.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                What happens if I upload only one Word file?
              </summary>
              <p className="mt-2 text-gray-600">
                If you upload a single Word file, it converts and downloads as a PDF directly — no ZIP file needed.
              </p>
            </details>
          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="word-to-pdf" />

      {/* 🔗 Comparison Links */}
        <section className="max-w-4xl mx-auto mb-16 px-4">
          <div className="rounded-2xl border bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-lg md:text-xl font-bold text-slate-900">
              Compare Word to PDF tools
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              See how PDF Linx compares with other Word to PDF converters.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href="/compare/pdflinx-vs-ilovepdf"
                className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      PDF Linx vs iLovePDF
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                      Free limits, ads, and output quality comparison.
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
                      PDF Linx vs Smallpdf
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                      Pricing, daily limits, and ease of use.
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


