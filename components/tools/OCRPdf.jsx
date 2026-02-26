// app/ocr-pdf/page.jsx
"use client";
import { useState, useRef } from "react";
import { Download, CheckCircle, FileText, Search, Zap } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";

export default function OcrPdf() {
  const [files, setFiles] = useState([]); // array of Files
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const [language, setLanguage] = useState("eng"); // Default: English
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
    files.forEach((f) => formData.append("files", f));
    formData.append("language", language);

    try {
      const res = await fetch("/convert/ocr-pdf", {
        method: "POST",
        body: formData,
      });

      // ✅ Check if request failed
      if (!res.ok) {
        const data = await res.json();
        alert("OCR failed: " + (data.error || "Try again"));
        return;
      }

      // ✅ Success - Download file directly
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = getDownloadName();
      a.click();

      window.URL.revokeObjectURL(url);
      setSuccess(true);

      // Scroll to success section
      setTimeout(() => {
        const downloadSection = document.getElementById('download-section');
        if (downloadSection) {
          downloadSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 300);

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
        ? files[0].name.replace(/\.pdf$/i, "-searchable.pdf")
        : "searchable.pdf";
    }
    return "pdflinx-ocr-pdfs.zip";
  };

  // const handleDownload = async () => {
  //   if (!downloadUrl) return;

  //   try {
  //     const res = await fetch(downloadUrl);
  //     const blob = await res.blob();
  //     const url = window.URL.createObjectURL(blob);

  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = getDownloadName();
  //     a.click();

  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     alert("Download failed");
  //   }
  // };

  return (
    <>
      {/* ==================== SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-ocr"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to OCR PDF Online for Free (Make Scanned PDFs Searchable)",
              description:
                "Convert scanned PDFs to searchable PDFs using OCR. Extract text from images and make your documents searchable, text-selectable, and copyable. Single or multiple file upload supported.",
              url: "https://pdflinx.com/ocr-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload scanned PDF(s)",
                  text: "Upload one scanned PDF or select multiple PDFs at once.",
                },
                {
                  "@type": "HowToStep",
                  name: "Select language",
                  text: "Choose the language of your document (English, Spanish, French, etc.).",
                },
                {
                  "@type": "HowToStep",
                  name: "OCR and download",
                  text: "Click 'Make Searchable' and download your OCR-processed PDF. Multiple files download as ZIP.",
                },
              ],
              totalTime: "PT2M",
              estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
              image: "https://pdflinx.com/og-image.png",
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="breadcrumb-schema-ocr"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "OCR PDF", item: "https://pdflinx.com/ocr-pdf" },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="faq-schema-ocr"
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
                  name: "What is OCR PDF?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "OCR (Optical Character Recognition) converts scanned documents and images into searchable, selectable text. It makes image-based PDFs searchable and lets you copy text (Ctrl/Cmd + C).",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I OCR multiple PDFs at once?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Yes! Upload multiple scanned PDFs and we'll process them together. Download as a ZIP file.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What languages are supported?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "We support 100+ languages including English, Spanish, French, German, Chinese, Arabic, Hindi, and many more.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will OCR change my PDF layout?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "No. OCR adds a searchable text layer behind your images. The visual appearance stays exactly the same.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Are my files safe?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Yes. Files are processed securely and automatically deleted after OCR. No storage, no sharing.",
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
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              OCR PDF Online <br /> Make Scanned PDFs Searchable (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Got scanned documents or image-based PDFs? Our OCR tool extracts text and makes them searchable and text-selectable.
              <span className="font-semibold text-gray-800"> Upload single or multiple files together</span> — perfect for digitizing old documents, invoices, and books!
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Note: OCR makes text searchable/selectable; it doesn’t enable direct PDF editing.
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
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
                      }`}
                  >
                    <Search className="w-12 h-12 mx-auto mb-3 text-purple-600" />

                    <p className="text-lg font-semibold text-gray-700">
                      {files.length === 0
                        ? "Drop your scanned PDF(s) here or click to upload"
                        : files.length === 1
                          ? files[0].name
                          : `${files.length} files selected (batch OCR supported)`}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      PDF files only • Single or multiple upload • We'll extract text from images
                    </p>

                    {/* File preview for multiple */}
                    {files.length > 1 && (
                      <div className="mt-3 text-xs text-gray-600 max-h-20 overflow-auto rounded-lg bg-white/60 border border-purple-200 p-3">
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
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Language Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Document Language (for better accuracy)
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-700"
                >
                  <option value="eng">English</option>
                  <option value="spa">Spanish</option>
                  <option value="fra">French</option>
                  <option value="deu">German</option>
                  <option value="ita">Italian</option>
                  <option value="por">Portuguese</option>
                  <option value="rus">Russian</option>
                  <option value="ara">Arabic</option>
                  <option value="chi_sim">Chinese (Simplified)</option>
                  <option value="chi_tra">Chinese (Traditional)</option>
                  <option value="jpn">Japanese</option>
                  <option value="kor">Korean</option>
                  <option value="hin">Hindi</option>
                  <option value="urd">Urdu</option>
                  <option value="ben">Bengali</option>
                </select>
                <p className="text-xs text-gray-500">
                  💡 Select the language of your document for best OCR accuracy
                </p>
              </div>

              {/* Convert Button */}
              <button
                type="submit"
                disabled={loading || files.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing OCR... this may take 1-2 minutes
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Make Searchable with OCR
                  </>
                )}
              </button>

              {/* Helper note */}
              <p className="text-center text-sm text-gray-500">
                ✅ Upload <span className="font-semibold text-gray-700">one PDF</span> or{" "}
                <span className="font-semibold text-gray-700">multiple files</span> for batch OCR processing.
                Files are processed securely and deleted after conversion.
              </p>
            </form>

            {/* Success State */}
            {success && (
              <div
                id="download-section"
                className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl text-center"
              >
                <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-3" />

                <p className="text-xl font-bold text-purple-700 mb-2">OCR Complete! 🎉</p>

                <p className="text-base text-gray-700 mb-3">
                  {isSingle ? (
                    <>Your PDF is now searchable and text-selectable!</>
                  ) : (
                    <>
                      All <span className="font-semibold">{files.length}</span> PDFs are now searchable.
                      Download the ZIP to get all files.
                    </>
                  )}
                </p>

                {/* <button
                  onClick={handleDownload}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  {isSingle ? "Download Searchable PDF" : "Download ZIP"}
                </button> */}

              </div>
            )}
          </div>

          {/* Footer Note */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • 100+ languages • Batch processing • Files auto-deleted • Completely free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            OCR PDF Online Free – Make Scanned Documents Searchable
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Turn image-based PDFs into searchable PDFs with selectable, copyable text using our OCR technology.
            <span className="font-semibold text-gray-800"> Process single files or batch convert multiple PDFs together.</span>
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fully Searchable</h3>
            <p className="text-gray-600 text-sm">
              Extract text from images and make your PDFs searchable with Ctrl+F (single or batch).
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg border border-pink-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Text Extraction</h3>
            <p className="text-gray-600 text-sm">
              Copy-paste text from scanned documents. Perfect for data entry and reuse in Word/Docs.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">100+ Languages</h3>
            <p className="text-gray-600 text-sm">
              Supports English, Spanish, French, Arabic, Chinese, Hindi, and 100+ more languages.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            OCR PDF in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Scanned PDF(s)</h4>
              <p className="text-gray-600 text-sm">
                Drop your scanned PDF — or select multiple files for batch processing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Select Language</h4>
              <p className="text-gray-600 text-sm">
                Choose document language for best OCR accuracy (100+ languages supported).
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download</h4>
              <p className="text-gray-600 text-sm">
                Get your searchable PDF. Multiple files download as ZIP.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Join thousands who trust PDFLinx for accurate OCR — fast, reliable, and always free (single & batch processing).
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          OCR PDF – Free Online OCR Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Ever tried to search for text in a scanned PDF and found nothing? That's because scanned documents are just images.
          Our <span className="font-medium text-slate-900">PDFLinx OCR PDF tool</span> uses advanced
          Optical Character Recognition (OCR) technology to extract text from images and make your PDFs fully searchable.
          <span className="font-semibold text-slate-900"> Upload a single file or process multiple PDFs together</span> — completely free, no signup required.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">What is OCR (Optical Character Recognition)?</h3>
        <p className="leading-7 mb-6">
          OCR is a technology that converts images of text (like scanned documents, photos, or screenshots) into actual,
          machine-readable text. This makes the PDF searchable with Ctrl+F, allows you to copy-paste text,
          and enables screen readers for accessibility. The visual appearance of your PDF stays exactly the same —
          OCR just adds an invisible text layer behind the images.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Why Use OCR on Your PDFs?</h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Make scanned documents searchable with Ctrl+F or Cmd+F</li>
          <li>Copy and paste text from image-based PDFs</li>
          <li>Convert old books, magazines, and newspapers into digital text</li>
          <li>Extract data from invoices, receipts, and forms for data entry</li>
          <li>Improve accessibility for screen readers and assistive technology</li>
          <li>Archive documents in a searchable, organized way</li>
          <li>Process single file or batch convert multiple PDFs at once</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">How to OCR a PDF Online</h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your scanned PDF (or multiple PDFs for batch processing)</li>
          <li>Select the document language (English, Spanish, etc.) for best accuracy</li>
          <li>Click "Make Searchable with OCR" and wait 1-2 minutes</li>
          <li>Download your searchable PDF (or ZIP for multiple files)</li>
        </ol>

        <p className="mb-6">
          No software to install, no watermarks added, no file storage — completely private and free.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx OCR PDF Tool
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>100% free online OCR</li>
            <li>Supports 100+ languages</li>
            <li>High accuracy text recognition</li>
            <li>Batch processing (multiple PDFs)</li>
            <li>No watermarks or branding</li>
            <li>Preserves original layout</li>
            <li>Secure file processing</li>
            <li>Works on mobile & desktop</li>
            <li>No file storage or sharing</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Who Should Use OCR PDF?</h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Digitize textbooks and make notes searchable</li>
          <li><strong>Accountants:</strong> Extract data from scanned invoices and receipts</li>
          <li><strong>Lawyers:</strong> Make legal documents and contracts searchable</li>
          <li><strong>Librarians & Archivists:</strong> Digitize old books and historical documents</li>
          <li><strong>Business Professionals:</strong> Convert paper documents to searchable digital files</li>
          <li><strong>Anyone:</strong> Make old scanned PDFs useful again</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Supported Languages</h3>
        <p className="leading-7 mb-6">
          Our OCR tool supports over 100 languages including:
          English, Spanish, French, German, Italian, Portuguese, Russian, Arabic, Chinese (Simplified & Traditional),
          Japanese, Korean, Hindi, Urdu, Bengali, and many more.
          Select your document's language for the best recognition accuracy.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Is PDFLinx OCR Safe?</h3>
        <p className="leading-7 mb-6">
          Absolutely. Your privacy is our priority. All uploaded files are processed securely and automatically deleted
          from our servers immediately after OCR processing. We never store, access, or share your documents.
          This applies to both single-file and batch uploads.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">OCR Your PDFs Anywhere, Anytime</h3>
        <p className="leading-7">
          PDFLinx OCR works perfectly on all devices — Windows, macOS, Linux, Android, and iOS.
          All you need is a browser and an internet connection to transform your scanned PDFs into searchable,
          text-selectable documents in minutes (single file or batch processing).
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
                Is the OCR PDF tool free to use?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — completely free with no limits or hidden charges.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I OCR multiple PDFs at once?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! Upload multiple scanned PDFs and we'll process them together. Download as a ZIP file.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                What languages are supported?
              </summary>
              <p className="mt-2 text-gray-600">
                We support 100+ languages including English, Spanish, French, German, Chinese, Arabic, Hindi,
                Japanese, Korean, and many more.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                How long does OCR take?
              </summary>
              <p className="mt-2 text-gray-600">
                Typically 1-2 minutes per PDF, depending on file size and number of pages.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Will OCR change my PDF layout or quality?
              </summary>
              <p className="mt-2 text-gray-600">
                No. OCR adds a searchable text layer behind your images. The visual appearance stays exactly the same.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my files safe and private?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes. Files are processed securely and automatically deleted after OCR. We never store or share your documents.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I use this on my phone?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! Our OCR tool works perfectly on mobile phones, tablets, and desktop computers.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                What file types are supported?
              </summary>
              <p className="mt-2 text-gray-600">
                Currently, we support PDF files. The PDFs can contain scanned images, photos, or screenshots.
              </p>
            </details>
          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="ocr-pdf" />
    </>
  );
}

