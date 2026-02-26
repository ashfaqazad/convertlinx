// app/split-pdf/page.js

"use client";
import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, Scissors } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";




export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => setFile(e.target.files[0] || null);

  const handleSplit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    setLoading(true);
    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/convert/split-pdf", { method: "POST", body: formData });
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
        alert("Split failed: " + (data.error || "Try again"));
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
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
      a.download = file ? file.name.replace(/\.pdf$/i, "-split-pages.zip") : "split-pages.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <>


      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

      {/* HowTo Schema - Split PDF */}
      <Script
        id="howto-schema-split-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Split a PDF into Individual Pages Online",
            description: "Split any PDF into separate pages instantly using PDF Linx - completely free, no signup required.",
            url: "https://pdflinx.com/split-pdf",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Click the upload area and select your PDF file." },
              { "@type": "HowToStep", name: "Click Split", text: "Press 'Split PDF' and wait a few seconds." },
              { "@type": "HowToStep", name: "Download", text: "Download the ZIP containing all individual pages." }
            ],
            totalTime: "PT40S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      {/* Breadcrumb Schema - Split PDF */}
      <Script
        id="breadcrumb-schema-split-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Split PDF", item: "https://pdflinx.com/split-pdf" }
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
              Split PDF Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Need just one or a few pages from a big PDF? Drop it here – we’ll split it into separate pages for you in seconds. Super simple and totally free!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSplit} className="space-y-6">
              {/* Upload Area */}
              <div className="relative">
                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
                    <Scissors className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <p className="text-lg font-semibold text-gray-700">
                      {file ? file.name : "Drop your PDF here or click to upload"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">We’ll split it page by page – easy peasy!</p>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Split Button */}
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Splitting your PDF...</>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    Split PDF
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
                <p className="text-xl font-bold text-green-700 mb-2">All split!</p>
                <p className="text-base text-gray-700 mb-3">Your pages are ready in a handy ZIP</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  Download ZIP File
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
            Split PDF Online Free – Pull Out Pages in Seconds
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Big PDF with just a few pages you need? Split it here – every page becomes its own file, packed in a ZIP for easy download. Fast, clean, and always free on PDF Linx!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Instant Split</h3>
            <p className="text-gray-600 text-sm">
              One click and every page is separated – ready to use.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality Never Drops</h3>
            <p className="text-gray-600 text-sm">
              Pages look exactly like the original – crisp and clear.
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
            Split PDF in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload PDF</h4>
              <p className="text-gray-600 text-sm">Drop your file – big or small.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Hit Split</h4>
              <p className="text-gray-600 text-sm">We separate every page neatly.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download ZIP</h4>
              <p className="text-gray-600 text-sm">Grab all pages in one handy file!</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Folks split PDFs daily with PDF Linx – quick, reliable, and always free.
        </p>
      </section>



      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Split PDF – Free Online PDF Splitter by PDFLinx
        </h2>

        {/* Intro */}
        <p className="text-base leading-7 mb-6">
          Ever received a huge PDF with hundreds of pages and only needed a few specific ones?
          Or wanted to break a big report into smaller, manageable files?
          It’s such a pain to do it manually. That’s why we made the <span className="font-medium text-slate-900">PDFLinx Split PDF tool</span>—a completely free online splitter that lets you extract pages or divide your PDF exactly how you want, in seconds. No software, no watermarks, no complications.
        </p>

        {/* What is */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What is PDF Splitting?
        </h3>
        <p className="leading-7 mb-6">
          PDF splitting means breaking a single PDF document into multiple smaller PDFs.
          You can extract specific pages, split by range, or even take out just one page.
          It’s perfect when you need to share only part of a file, separate chapters, or reduce a large document into bite-sized pieces.
        </p>

        {/* Why split */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Split Your PDF Files?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Extract only the pages you need from a large PDF</li>
          <li>Create separate files for different sections or chapters</li>
          <li>Reduce file size by removing unnecessary pages</li>
          <li>Share specific parts without sending the entire document</li>
          <li>Organize scanned books, reports, or contracts easily</li>
        </ul>

        {/* Steps */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Split PDF Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your PDF file (drag & drop or click to select)</li>
          <li>Choose how to split: by page range, extract specific pages, or split into equal parts</li>
          <li>Click “Split PDF”</li>
          <li>Download your new PDF files instantly (individually or as a ZIP)</li>
        </ol>

        <p className="mb-6">
          No sign-up, no watermark, no installation required—100% free and fast.
        </p>

        {/* Features box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx PDF Splitter
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>100% free online splitter</li>
            <li>Split by page range or selection</li>
            <li>Extract single or multiple pages</li>
            <li>Preserves original quality & formatting</li>
            <li>Fast and accurate processing</li>
            <li>Works on mobile & desktop</li>
            <li>No file storage – full privacy</li>
          </ul>
        </div>

        {/* Audience */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Extract chapters from textbooks or study notes</li>
          <li><strong>Professionals:</strong> Pull specific sections from reports or contracts</li>
          <li><strong>Businesses:</strong> Separate invoices or receipts from monthly statements</li>
          <li><strong>Job Seekers:</strong> Send only relevant pages from a large certificate bundle</li>
          <li><strong>Anyone:</strong> Break down big scanned documents into manageable parts</li>
        </ul>

        {/* Safety */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Safe to Use?
        </h3>
        <p className="leading-7 mb-6">
          Absolutely safe. We take your privacy very seriously.
          Your uploaded PDF is processed securely and automatically deleted from our servers shortly after splitting.
          We never store or share your files with anyone.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Split PDFs Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx works smoothly on Windows, macOS, Linux, Android, and iOS.
          Whether you’re on your phone, tablet, or computer, split any PDF quickly and easily—just a browser and internet connection needed.
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
                Is the PDF splitter free to use?
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
                Can I extract just one page from a PDF?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! You can select any single page or multiple pages to extract.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Will the quality of extracted pages change?
              </summary>
              <p className="mt-2 text-gray-600">
                No — all text, images, and formatting stay exactly as in the original.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my files safe and private?
              </summary>
              <p className="mt-2 text-gray-600">
                100% safe — files are deleted automatically shortly after processing.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I split PDF on my phone?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! Works perfectly on mobile phones, tablets, and desktops.
              </p>
            </details>

          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="split-pdf" />
    </>
  );
}



