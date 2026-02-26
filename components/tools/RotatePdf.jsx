// app/rotate-pdf/page.jsx
"use client";

import { useMemo, useState } from "react";
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  X,
  RotateCw,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";

export default function RotatePdf() {
  const [files, setFiles] = useState([]);
  const [rotationAngle, setRotationAngle] = useState(90); // 90, 180, 270
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const totalSizeMb = useMemo(() => {
    return files.reduce((sum, f) => sum + (f?.size || 0), 0) / 1024 / 1024;
  }, [files]);

  const clearAll = () => {
    setFiles([]);
    setRotationAngle(90);
    setSuccess(false);
    setError("");
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setSuccess(false);
    setError("");
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length) {
      setError("Please select at least one PDF file first!");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData();
    for (const f of files) formData.append("files", f);
    formData.append("angle", String(rotationAngle));

    try {
      // NOTE: backend route you'll create: POST /convert/rotate-pdf
      const res = await fetch("/convert/rotate-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Rotation failed";
        try {
          const j = await res.json();
          msg = j?.error || msg;
        } catch { }
        throw new Error(msg);
      }

      const contentType = res.headers.get("content-type") || "";

      // ✅ SINGLE => PDF
      if (contentType.includes("application/pdf")) {
        const blob = await res.blob();
        const outName = files[0].name.replace(/\.pdf$/i, "") + "-rotated.pdf";
        downloadBlob(blob, outName);
        setSuccess(true);
        return;
      }

      // ✅ MULTIPLE => ZIP
      if (contentType.includes("application/zip")) {
        const blob = await res.blob();
        downloadBlob(blob, "pdflinx-rotated-pdfs.zip");
        setSuccess(true);
        return;
      }

      // fallback
      let data = null;
      try {
        data = await res.json();
      } catch { }
      throw new Error(data?.error || "Unexpected response from server");
    } catch (err) {
      const msg = (err?.message || "Something went wrong. Please try again.").toString();
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ==================== SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-rotate"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Rotate PDF Pages Online for Free",
              description:
                "Rotate PDF pages clockwise or counterclockwise by 90°, 180°, or 270°. Fix orientation of scanned documents, photos, and PDFs.",
              url: "https://pdflinx.com/rotate-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF file(s)",
                  text: "Upload a single PDF or select multiple PDFs at the same time.",
                },
                {
                  "@type": "HowToStep",
                  name: "Choose rotation angle",
                  text: "Select 90°, 180°, or 270° rotation angle.",
                },
                {
                  "@type": "HowToStep",
                  name: "Rotate and download",
                  text: "Click Rotate PDF. Download the rotated PDF (or ZIP if multiple files).",
                },
              ],
              totalTime: "PT15S",
              estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
              image: "https://pdflinx.com/og-image.png",
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="breadcrumb-schema-rotate"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "Rotate PDF", item: "https://pdflinx.com/rotate-pdf" },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="faq-schema-rotate"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What does Rotate PDF mean?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Rotate PDF means changing the orientation of PDF pages by turning them clockwise or counterclockwise. Common rotation angles are 90°, 180°, and 270°.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I rotate all pages at once?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Yes. When you upload a PDF and select a rotation angle, all pages in that PDF will be rotated by the same angle.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I rotate multiple PDFs at once?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Yes. Upload up to 10 PDFs. Each PDF's pages will be rotated by your chosen angle. Multiple files download as a ZIP.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will rotating a PDF reduce quality?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "No. Rotating a PDF is a lossless operation. Your text, images, and layout remain exactly the same quality.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Are my files safe?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Yes. Files are processed automatically and deleted after processing. No sign-up required.",
                  },
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              Rotate PDF Pages <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fix the orientation of your PDF pages in seconds.
              Rotate clockwise or counterclockwise by 90°, 180°, or 270°.
              Perfect for scanned documents and mobile photos.
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
                        : "border-gray-300 hover:border-orange-500 hover:bg-orange-50"
                      }`}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                    <p className="text-lg font-semibold text-gray-700">
                      {files.length ? `${files.length} file(s) selected` : "Drop your PDF file(s) here or click to upload"}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">Only .pdf files • Max 10 files • 25MB each</p>

                    {!!files.length && (
                      <p className="text-xs text-gray-500 mt-2">
                        Total selected: {totalSizeMb.toFixed(2)} MB
                      </p>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                      Tip: Single file downloads as PDF. Multiple files download as a ZIP.
                    </p>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      const picked = Array.from(e.target.files || []);
                      if (picked.length > 10) {
                        setError("Maximum 10 files allowed.");
                        return;
                      }
                      setFiles(picked);
                      setSuccess(false);
                      setError("");
                    }}
                    className="hidden"
                    required
                  />
                </label>
              </div>

              {/* Selected Files List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, idx) => (
                    <div
                      key={`${file.name}-${file.size}-${idx}`}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-5 h-5 text-red-600 shrink-0" />
                        <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                        <span className="text-xs text-gray-500 shrink-0">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-red-500 hover:bg-red-100 p-1 rounded"
                        aria-label="Remove file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-sm font-semibold text-gray-700 hover:text-gray-900 underline"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}

              {/* Rotation Options */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-orange-600" />
                  Select rotation angle
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {/* 90° Clockwise */}
                  <button
                    type="button"
                    onClick={() => setRotationAngle(90)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      rotationAngle === 90
                        ? "border-orange-600 bg-orange-50 shadow-md"
                        : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                    }`}
                  >
                    <RotateCw className="w-8 h-8 text-orange-600 mb-2" />
                    <span className="text-sm font-semibold text-gray-800">90° Right</span>
                    <span className="text-xs text-gray-500 mt-1">Clockwise</span>
                  </button>

                  {/* 180° */}
                  <button
                    type="button"
                    onClick={() => setRotationAngle(180)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      rotationAngle === 180
                        ? "border-orange-600 bg-orange-50 shadow-md"
                        : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                    }`}
                  >
                    <RefreshCw className="w-8 h-8 text-orange-600 mb-2" />
                    <span className="text-sm font-semibold text-gray-800">180°</span>
                    <span className="text-xs text-gray-500 mt-1">Flip</span>
                  </button>

                  {/* 270° Counter-clockwise */}
                  <button
                    type="button"
                    onClick={() => setRotationAngle(270)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      rotationAngle === 270
                        ? "border-orange-600 bg-orange-50 shadow-md"
                        : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                    }`}
                  >
                    <RotateCcw className="w-8 h-8 text-orange-600 mb-2" />
                    <span className="text-sm font-semibold text-gray-800">270° Left</span>
                    <span className="text-xs text-gray-500 mt-1">Counter-clockwise</span>
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  All pages in each PDF will be rotated by {rotationAngle}°
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
                  <p className="font-semibold">{error}</p>
                </div>
              )}

              {/* Button */}
              <button
                type="submit"
                disabled={loading || !files.length}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-orange-700 hover:to-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Rotating... hang tight!
                  </>
                ) : (
                  <>
                    <RotateCw className="w-5 h-5" />
                    Rotate PDF
                  </>
                )}
              </button>
            </form>

            {/* Success */}
            {success && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">
                  Done! Your {files.length === 1 ? "rotated PDF" : "ZIP"} is ready
                </p>
                <p className="text-sm text-green-700">Download started automatically.</p>
              </div>
            )}
          </div>

          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Files auto delete • Completely free • Supports single & bulk uploads
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Rotate PDF Pages Online Free – Fix Orientation in Seconds
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Scanned a document the wrong way? Photo came out sideways?
            PDFLinx Rotate PDF lets you fix the orientation instantly.
            Rotate by 90°, 180°, or 270° — works for single and bulk files.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg border border-orange-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCw className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quick Rotation</h3>
            <p className="text-gray-600 text-sm">
              Rotate PDF pages by 90°, 180°, or 270° in seconds.
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl shadow-lg border border-red-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Perfect for Scans</h3>
            <p className="text-gray-600 text-sm">
              Fix orientation of scanned documents, photos, and mobile uploads.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Bulk Support</h3>
            <p className="text-gray-600 text-sm">
              Rotate multiple PDFs at once. Download as ZIP.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Rotate PDF in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload PDF(s)</h4>
              <p className="text-gray-600 text-sm">Upload one PDF or multiple PDFs at once.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Choose Angle</h4>
              <p className="text-gray-600 text-sm">Select 90°, 180°, or 270° rotation.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download</h4>
              <p className="text-gray-600 text-sm">Download rotated PDF (or ZIP if multiple files).</p>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          PDFLinx helps you fix PDF orientation quickly — perfect for scans and mobile photos, always free.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Rotate PDF Pages – Fix Orientation Online by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Rotating PDF pages is essential when documents are scanned or photographed in the wrong orientation.
          Whether you took a photo with your phone sideways or a scanner captured the document upside down,
          <span className="font-medium text-slate-900"> PDFLinx Rotate PDF tool</span>{" "}
          allows you to fix the orientation online in seconds — no software installation needed.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Does Rotating a PDF Mean?
        </h3>
        <p className="leading-7 mb-6">
          Rotating a PDF means changing the orientation of the pages by turning them clockwise or counterclockwise.
          Common rotation angles are 90° (quarter turn), 180° (half turn/flip), and 270° (three-quarter turn).
          This is a lossless operation that doesn't affect the quality of your content.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Do You Need to Rotate PDF Pages?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Fix orientation of scanned documents that were placed wrong in the scanner</li>
          <li>Correct mobile photos taken in portrait when they should be landscape (or vice versa)</li>
          <li>Adjust PDFs received from others that display sideways or upside down</li>
          <li>Prepare documents for printing in the correct orientation</li>
          <li>Make multi-page PDFs easier to read when some pages are rotated incorrectly</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Rotate PDF Pages Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your PDF file using the Rotate PDF tool</li>
          <li>Choose rotation angle: 90° clockwise, 180° flip, or 270° counterclockwise</li>
          <li>Click the "Rotate PDF" button</li>
          <li>Download your rotated PDF instantly</li>
        </ol>

        <p className="mb-6">
          All pages in the PDF will be rotated by your selected angle. The process is fast and maintains original quality.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Rotate PDF Tool
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>Free online PDF rotation</li>
            <li>Rotate by 90°, 180°, or 270°</li>
            <li>No software installation needed</li>
            <li>Lossless quality (no degradation)</li>
            <li>Works on all devices and browsers</li>
            <li>Bulk rotation (multiple PDFs at once)</li>
            <li>No watermark on output files</li>
            <li>Files deleted after processing</li>
            <li>Fast processing in seconds</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use the Rotate PDF Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Fix scanned assignments and notes</li>
          <li><strong>Professionals:</strong> Correct orientation of business documents</li>
          <li><strong>Photographers:</strong> Adjust photo PDFs from mobile devices</li>
          <li><strong>Office Workers:</strong> Prepare documents for printing</li>
          <li><strong>Anyone:</strong> Fix PDFs received in wrong orientation</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Common Use Cases
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Scanned documents placed sideways in the scanner</li>
          <li>Phone photos converted to PDF in wrong orientation</li>
          <li>Multi-page documents with some pages rotated incorrectly</li>
          <li>Forms and applications that need to be right-side up</li>
          <li>Receipts and invoices photographed at wrong angle</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Rotate PDF Safe?
        </h3>
        <p className="leading-7 mb-6">
          Yes. PDFLinx is designed with privacy in mind. Uploaded PDF files are processed automatically
          and removed shortly after rotation. Your files are never shared, stored permanently, or accessed by anyone.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Rotate PDFs Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx works seamlessly on Windows, macOS, Linux, Android, and iOS.
          All you need is an internet connection and a modern browser to rotate your PDF pages
          anytime, anywhere — on desktop, tablet, or mobile phone.
        </p>
      </section>

      {/* FAQs (UI) */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Is the Rotate PDF tool free?</summary>
              <p className="mt-2 text-gray-600">
                Yes. PDFLinx Rotate PDF is free to use — no sign-up, no watermark.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">What rotation angles are available?</summary>
              <p className="mt-2 text-gray-600">
                You can rotate by 90° clockwise (right), 180° (flip upside down), or 270° counterclockwise (left).
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Can I rotate multiple PDFs at once?</summary>
              <p className="mt-2 text-gray-600">
                Yes. Upload up to 10 PDFs. Each PDF's pages will be rotated by your chosen angle. Multiple files download as a ZIP.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Will rotating a PDF reduce quality?</summary>
              <p className="mt-2 text-gray-600">
                No. Rotating a PDF is a lossless operation. Your text, images, and layout remain exactly the same quality.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Are my files safe?</summary>
              <p className="mt-2 text-gray-600">
                Yes. Files are processed automatically and deleted shortly after processing. We never store your files permanently.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Can I rotate individual pages or all pages?</summary>
              <p className="mt-2 text-gray-600">
                Currently, all pages in each PDF are rotated by the same angle. This is perfect for fixing scanned documents or mobile photos.
              </p>
            </details>
          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="rotate-pdf" />
    </>
  );
}






















// 'use client';

// import { useState } from 'react';
// import { PDFDocument } from 'pdf-lib';
// import { Upload, RotateCw, Download, CheckCircle } from 'lucide-react';
// import Script from 'next/script';

// export default function RotatePdf() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [rotatedUrl, setRotatedUrl] = useState(null);

//   const handleFile = (e) => {
//     const selected = e.target.files[0];
//     if (selected) setFile(selected);
//   };

//   const rotate = async (angle) => {
//     if (!file) return;
//     setLoading(true);

//     try {
//       const arrayBuffer = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(arrayBuffer);
//       const pages = pdfDoc.getPages();

//       pages.forEach((page) => {
//         const { width, height } = page.getSize();
//         page.setRotation((page.getRotation().angle + angle + 360) % 360);
//         // Adjust position if needed after rotation
//         if (angle === 90 || angle === 270) {
//           page.setSize(height, width);
//         }
//       });

//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//       setRotatedUrl(URL.createObjectURL(blob));
//     } catch (err) {
//       alert('Error rotating PDF. Please try again.');
//     }
//     setLoading(false);
//   };

//   return (
//     <>
//       <Script
//         id="howto-schema-rotate"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Rotate PDF Online for Free",
//             description: "Rotate PDF pages 90, 180, 270 degrees instantly.",
//             url: "https://pdflinx.com/rotate-pdf",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
//               { "@type": "HowToStep", name: "Choose Angle", text: "Select 90°, 180°, or 270° rotation." },
//               { "@type": "HowToStep", name: "Download", text: "Download rotated PDF instantly." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-rotate"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Rotate PDF", item: "https://pdflinx.com/rotate-pdf" }
//             ]
//           }, null, 2),
//         }}
//       />

//       <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
//               Rotate PDF <br /> Online (Free)
//             </h1>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Rotate PDF pages 90°, 180°, or 270° instantly. Fix upside-down or sideways PDFs — 100% free, no signup.
//             </p>
//           </div>

//           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
//             <label className="block cursor-pointer">
//               <div className="border-4 border-dashed border-orange-300 rounded-3xl p-20 text-center hover:border-amber-500 transition">
//                 <Upload className="w-24 h-24 mx-auto text-orange-600 mb-8" />
//                 <span className="text-3xl font-bold text-gray-800 block mb-4">
//                   Drop PDF here or click to upload
//                 </span>
//                 <span className="text-xl text-gray-600">Single or multi-page PDFs supported</span>
//               </div>
//               <input type="file" accept=".pdf" onChange={handleFile} className="hidden" />
//             </label>

//             {file && (
//               <div className="mt-12">
//                 <p className="text-center text-xl font-semibold mb-8">Selected: {file.name}</p>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <button
//                     onClick={() => rotate(90)}
//                     disabled={loading}
//                     className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold py-6 rounded-2xl hover:from-orange-700 hover:to-amber-700 transition shadow-xl flex items-center justify-center gap-4"
//                   >
//                     <RotateCw size={32} />
//                     Rotate 90° Clockwise
//                   </button>
//                   <button
//                     onClick={() => rotate(180)}
//                     disabled={loading}
//                     className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-6 rounded-2xl hover:from-amber-700 hover:to-orange-700 transition shadow-xl flex items-center justify-center gap-4"
//                   >
//                     <RotateCw size={32} className="rotate-180" />
//                     Rotate 180°
//                   </button>
//                   <button
//                     onClick={() => rotate(270)}
//                     disabled={loading}
//                     className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold py-6 rounded-2xl hover:from-orange-700 hover:to-amber-700 transition shadow-xl flex items-center justify-center gap-4"
//                   >
//                     <RotateCw size={32} className="rotate-90" />
//                     Rotate 270° Clockwise
//                   </button>
//                 </div>
//               </div>
//             )}

//             {loading && (
//               <div className="text-center mt-12">
//                 <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-600"></div>
//                 <p className="mt-6 text-2xl font-bold text-orange-600">Rotating PDF...</p>
//               </div>
//             )}

//             {rotatedUrl && (
//               <div className="text-center mt-12">
//                 <p className="text-3xl font-bold text-green-600 mb-6">PDF Rotated Successfully!</p>
//                 <a
//                   href={rotatedUrl}
//                   download="rotated-pdf.pdf"
//                   className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-xl px-12 py-6 rounded-2xl hover:from-green-700 hover:to-teal-700 transition shadow-2xl"
//                 >
//                   <Download size={36} />
//                   Download Rotated PDF
//                 </a>
//               </div>
//             )}
//           </div>

//           <p className="text-center mt-10 text-gray-600 text-lg">
//             No signup • Unlimited rotations • High quality • 100% free & private
//           </p>
//         </div>
//       </main>

//       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
//             Rotate PDF Online Free - Fix Orientation Instantly
//           </h2>
//           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
//             Rotate PDF pages 90°, 180°, or 270° in seconds. Perfect for fixing upside-down or sideways scanned documents — completely free with PDF Linx.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-10 mb-20">
//           <div className="bg-gradient-to-br from-orange-50 to-white p-10 rounded-3xl shadow-xl border border-orange-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <RotateCw className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Any Angle</h3>
//             <p className="text-gray-600">Rotate 90°, 180°, or 270° — fix any orientation issue.</p>
//           </div>

//           <div className="bg-gradient-to-br from-amber-50 to-white p-10 rounded-3xl shadow-xl border border-amber-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Perfect Quality</h3>
//             <p className="text-gray-600">No quality loss — original PDF preserved perfectly.</p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast & Free</h3>
//             <p className="text-gray-600">Rotate unlimited PDFs instantly — no signup, completely free.</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
//           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
//             How to Rotate PDF in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 1
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Upload PDF</h4>
//               <p className="text-gray-600 text-lg">Drop or select your PDF file.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 2
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Choose Rotation</h4>
//               <p className="text-gray-600 text-lg">Select 90°, 180°, or 270° rotation.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 3
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Download</h4>
//               <p className="text-gray-600 text-lg">Save your rotated PDF instantly.</p>
//             </div>
//           </div>
//         </div>

//         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
//           Rotate PDFs every day with PDF Linx — trusted by thousands for fast, accurate, and completely free PDF rotation.
//         </p>
//       </section>
//     </>
//   );
// }