// app/pdf-to-word/page.js

"use client";
import { useState } from "react";
import { Upload, Download, CheckCircle, FileText } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";

// export default function PdfToWord() {
export default function PdfToWord({ seo }) {

  const [files, setFiles] = useState([]); // ✅ multiple PDFs
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);


  // ✅ only for ZIP downloads (multiple files)
  const [downloadUrl, setDownloadUrl] = useState(null);


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!files.length) return alert("Please select at least one PDF file");

  setLoading(true);
  setSuccess(false);
  setError("");
  setProgress(0);

  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));

  const pollIntervalMs = 1500;
  const maxWaitMs = 15 * 60 * 1000;
  const startedAt = Date.now();

  // Helper: fetch JSON with better errors
  const fetchJson = async (url, options) => {
    const r = await fetch(url, { cache: "no-store", ...options });
    const ct = r.headers.get("content-type") || "";
    let payload = null;

    if (ct.includes("json")) {
      try { payload = await r.json(); } catch {}
    }

    if (!r.ok) {
      const msg =
        payload?.detail || payload?.error || `Request failed ${r.status} ${r.statusText}`;
      const err = new Error(msg);
      err.status = r.status;
      err.payload = payload;
      throw err;
    }

    return payload ?? {};
  };

  // Helper: download file as blob (safer than window.location.href)
  const downloadViaBlob = async (url, filenameFallback) => {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`Download failed ${r.status}`);

    const blob = await r.blob();
    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObj;

    // Try filename from header if present
    const cd = r.headers.get("content-disposition") || "";
    const match = cd.match(/filename\*?=(?:UTF-8''|")?([^;"\n]+)"?/i);
    const filename = match ? decodeURIComponent(match[1]) : filenameFallback;

    a.download = filename || "pdflinx-download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlObj);
  };

  // Try /api first (Next/Python), fallback to /convert (Node) if 404
  const getJobStatus = async (jobId) => {
    try {
      return await fetchJson(`/api/convert/job/${jobId}`);
    } catch (err) {
      if (err?.status === 404) {
        return await fetchJson(`/convert/job/${jobId}`);
      }
      throw err;
    }
  };

  const downloadResult = async (jobId) => {
    // same fallback logic
    try {
      await downloadViaBlob(`/api/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
    } catch (err) {
      if (err?.message?.includes("404")) {
        await downloadViaBlob(`/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
        return;
      }
      // if API download failed for non-404, try convert once as well
      try {
        await downloadViaBlob(`/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
      } catch {
        throw err;
      }
    }
  };

  // Poll using setTimeout to avoid overlapping async calls
  let stopped = false;
  const poll = async (jobId) => {
    if (stopped) return;

    if (Date.now() - startedAt > maxWaitMs) {
      setLoading(false);
      setError("Conversion timeout. Please try again.");
      return;
    }

    try {
      const statusData = await getJobStatus(jobId);

      const status = statusData?.status;
      if (status === "queued") {
        setProgress(0);
      } else if (status === "processing") {
        setProgress(statusData?.progress ?? 10);
      } else if (status === "done") {
        setProgress(100);
        setSuccess(true);
        setFiles([]);
        setLoading(false);

        // download
        await downloadResult(jobId);
        return;
      } else if (status === "failed") {
        setLoading(false);
        setError(statusData?.error || "Conversion failed on server");
        return;
      } else {
        // unknown status
        setProgress((p) => Math.max(p, 5));
      }

      setTimeout(() => poll(jobId), pollIntervalMs);
    } catch (err) {
      setLoading(false);
      setError(err?.message || "Polling failed");
    }
  };

  try {
    const res = await fetch("/convert/pdf-to-word", { method: "POST", body: formData });
    const ct = res.headers.get("content-type") || "";

    if (!res.ok) {
      let msg = `Server error ${res.status}`;
      if (ct.includes("json")) {
        try {
          const err = await res.json();
          msg = err.detail || err.error || msg;
        } catch {}
      }
      throw new Error(msg);
    }

    // CASE A: ZIP directly
    if (ct.includes("application/zip") || ct.includes("zip")) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "pdflinx-pdf-to-word.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setProgress(100);
      setSuccess(true);
      setFiles([]);
      setLoading(false);
      return;
    }

    // CASE B: JSON job
    if (!ct.includes("json")) {
      throw new Error(`Unexpected response type: ${ct}`);
    }

    const data = await res.json();
    const jobId = data?.jobId;
    if (!jobId) throw new Error("Job ID not received from server");

    // start polling
    poll(jobId);
  } catch (err) {
    stopped = true;
    setLoading(false);
    setError(err?.message || "Something went wrong");
  }
};



  // ✅ Only for ZIP downloads (multiple PDFs)
  const handleDownloadZip = async () => {
    if (!downloadUrl) return;

    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "pdflinx-pdf-to-word.zip";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("There was a problem with the download.");
      console.error(err);
    }
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}

      {/* HowTo Schema - PDF to Word */}
      <Script
        id="howto-schema-pdf-to-word"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert PDF to Word Online for Free",
              description:
                "Convert one or multiple PDF files into editable Word (DOCX) in seconds with PDFLinx — free, fast, and no signup required.",
              url: "https://pdflinx.com/pdf-to-word",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF File(s)",
                  text: "Upload a single PDF or select multiple PDFs at once.",
                },
                {
                  "@type": "HowToStep",
                  name: "Click Convert",
                  text: "Press 'Convert to Word' and wait a few seconds while we process your file(s).",
                },
                {
                  "@type": "HowToStep",
                  name: "Download DOCX (or ZIP)",
                  text: "Single file downloads as DOCX. Multiple files download as a ZIP containing all DOCX files.",
                },
              ],
              totalTime: "PT30S",
              estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
              tool: [{ "@type": "HowToTool", name: "PDFLinx PDF to Word Converter" }],
              image: "https://pdflinx.com/og-image.png",
            },
            null,
            2
          ),
        }}
      />

      {/* Breadcrumb Schema - PDF to Word */}
      <Script
        id="breadcrumb-schema-pdf-to-word"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "PDF to Word", item: "https://pdflinx.com/pdf-to-word" },
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
                
                {seo?.h1 || "PDF to Word Converter (Free & Online)"}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {seo?.hero?.subtitle || "Got a PDF you need to edit? Upload one file for a quick DOCX..."}
              </p>


            {/* <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            
              PDF to Word Converter <br />(Free & Online)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Got a PDF you need to edit? Upload one file for a quick DOCX — or select multiple PDFs together and download
              everything in one ZIP. Clean output, no watermark, no signup.
            </p> */}

          </div>

          {/* <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-center">
            <h3 className="mb-1 text-sm font-semibold text-yellow-800">
              🚧 Tool Under Maintenance
            </h3>
            <p className="text-sm text-yellow-700">
              We’re fixing an issue to make conversions faster and more accurate.
              <br />
              Please check back shortly — <strong>PDFLinx</strong> will be ready for you.
            </p>
          </div>  */}
 

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <p className="text-lg font-semibold text-gray-700">
                      {files.length
                        ? `${files.length} file(s) selected`
                        : "Drop your PDF file(s) here or click to upload"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Converts PDF to editable Word (DOCX)
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Tip: Single PDF downloads as DOCX. Multiple PDFs download as a ZIP with all DOCX files inside.
                    </p>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="application/pdf"
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="hidden"
                    required
                  />
                </label>
              </div>


                {/* Convert Button */}
                
                <button
                  type="submit"
                  disabled={loading || !files.length}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
                >
                   {loading ? (
                    <>Converting… please wait</>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Convert to Word
                    </>
                  )} 
                 </button> 



                {/* <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg bg-gray-300 py-3 text-sm font-semibold text-gray-600"
                >
                  Temporarily Unavailable
                </button>
 */}
                

                {/* UX Notice (✅ button ke neeche, form ke andar) */}
                <div className="text-sm text-gray-600 text-center mt-4 space-y-1">
                  <p>
                    ⏱️ <strong>Multiple files conversion may take up to 1 minute.</strong> Please don’t close this tab.
                  </p>
                  <p>
                    🔢 You can convert up to <strong>10 PDF files at once</strong>.
                  </p>
                </div>
                </form>

          

                  {/* MS Word Compatibility Notice (✅ form ke baad, bilkul sahi) */}
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700">
                    <p className="font-semibold mb-1">ℹ️ Microsoft Word Compatibility</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Converted files open best in <strong>Microsoft Word 2013 or newer</strong>.
                      </li>
                      <li>
                        When opening the file, click <strong>“Enable Editing”</strong> if prompted.
                      </li>
                      <li>
                        Older versions of Word may not fully support modern DOCX files.
                      </li>
                    </ul>
                  </div>



            {success && (
          <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-xl font-bold text-green-700 mb-2">
              Done! Your file(s) downloaded automatically 🎉
            </p>
            <p className="text-base text-gray-700">
              {files.length === 1 
                ? "Check your downloads for the editable Word file." 
                : "Check your downloads – ZIP contains all converted DOCX files."}
            </p>
          </div>


        )}
    </div>

          {/* Footer */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Files gone after 1 hour • Completely free • Single & bulk conversions supported
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            PDF to Word Online Free – Make Your PDFs Editable
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to tweak a PDF? Convert it to Word here — text, tables, images, everything stays in place so you can edit easily.
            Converting a bunch of PDFs? Upload multiple files together and download a ZIP with all DOCX files inside.
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
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Super Accurate</h3>
            <p className="text-gray-600 text-sm">
              Text, tables, and layout move over neatly so editing feels easy.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Single + Bulk Support</h3>
            <p className="text-gray-600 text-sm">
              Convert one PDF to DOCX or upload multiple PDFs and download a ZIP — your choice.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
            <p className="text-gray-600 text-sm">
              No sign-up, no watermark, and files are removed after 1 hour.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Convert PDF to Word in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload PDF File(s)</h4>
              <p className="text-gray-600 text-sm">
                Upload a single PDF — or select multiple PDFs at once.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
              <p className="text-gray-600 text-sm">We extract content and keep it editable.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download DOCX (or ZIP)</h4>
              <p className="text-gray-600 text-sm">
                Single file downloads as DOCX. Multiple files download as a ZIP.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Convert PDFs into editable Word files with PDF Linx — fast, accurate, and always free.
        </p>
      </section>

      {/* Long-form content (Human touch + bulk mention) */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PDF to Word Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Ever had a PDF that you needed to edit “right now” — but it wouldn’t let you? That’s the exact pain this tool solves.
          The <span className="font-medium text-slate-900">PDFLinx PDF to Word Converter</span> turns PDFs into editable Word (DOCX)
          in seconds. And the best part? If you have a bunch of PDFs, you can upload multiple files at once and download everything in a single ZIP.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What is PDF to Word conversion?
        </h3>
        <p className="leading-7 mb-6">
          PDF to Word conversion means taking a PDF (which is usually fixed and hard to edit) and turning it into a Word document
          you can change freely — edit text, fix typos, update tables, or copy content into your own template.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Single file or multiple files — both supported
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Single PDF:</strong> converts and downloads as a Word (DOCX) file directly.</li>
          <li><strong>Multiple PDFs:</strong> converts all files and gives you a ZIP containing all DOCX files.</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why use PDFLinx?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Fast conversion with clean, editable output</li>
          <li>No watermark, no signup, no annoying limits</li>
          <li>Great for resumes, reports, contracts, and assignments</li>
          <li>Supports bulk conversion when you’re working with many files</li>
          <li>Privacy-first: files are removed after processing</li>
        </ul>
      </section>




      {/* FAQ */}
<section className="py-16 bg-gray-50">
  <div className="max-w-4xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
      Frequently Asked Questions
    </h2>

    <div className="space-y-4">
      {(seo?.faqs || [
        { q: "Is the PDF to Word converter free to use?", a: "Yes — it's completely free with no hidden charges." },
        { q: "Do I need to install any software?", a: "No. Everything works directly in your browser." },
        { q: "Will the formatting from my PDF be preserved?", a: "We try to keep formatting (tables, spacing, headings) as close as possible. Very complex PDFs may need minor cleanup afterward." },
        { q: "Are my files safe and private?", a: "Yes — files are processed securely and removed after conversion." },
        { q: "Can I convert multiple PDFs to Word at the same time?", a: "Yes. Upload multiple PDFs together and you'll get a ZIP containing all converted DOCX files." },
        { q: "What happens if I upload only one PDF?", a: "If you upload a single PDF, it downloads as a DOCX directly — no ZIP." },
        { q: "Can I use this on my phone?", a: "Absolutely. It works smoothly on mobile, tablet, and desktop." },
        { q: "Why does Word ask me to \"Enable Editing\"?", a: "This is a normal Microsoft Word security prompt for downloaded files. Click \"Enable Editing\" to start editing your converted document." },
      ]).map((faq, i) => (
        <details key={i} className="bg-white rounded-lg shadow-sm p-5">
          <summary className="font-semibold cursor-pointer">{faq.q}</summary>
          <p className="mt-2 text-gray-600">{faq.a}</p>
        </details>
      ))}
    </div>
  </div>
</section>

      {/* FAQ */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Is the PDF to Word converter free to use?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — it’s completely free with no hidden charges.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Do I need to install any software?
              </summary>
              <p className="mt-2 text-gray-600">
                No. Everything works directly in your browser.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Will the formatting from my PDF be preserved?
              </summary>
              <p className="mt-2 text-gray-600">
                We try to keep formatting (tables, spacing, headings) as close as possible. Very complex PDFs may need minor cleanup afterward.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my files safe and private?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — files are processed securely and removed after conversion.
              </p>
            </details> */}

            {/* ✅ NEW FAQS (bulk support) */}
            {/* <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I convert multiple PDFs to Word at the same time?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes. Upload multiple PDFs together and you’ll get a ZIP containing all converted DOCX files.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                What happens if I upload only one PDF?
              </summary>
              <p className="mt-2 text-gray-600">
                If you upload a single PDF, it downloads as a DOCX directly — no ZIP.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I use this on my phone?
              </summary>
              <p className="mt-2 text-gray-600">
                Absolutely. It works smoothly on mobile, tablet, and desktop.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Why does Word ask me to “Enable Editing”?
              </summary>
              <p className="mt-2 text-gray-600">
                This is a normal Microsoft Word security prompt for downloaded files. Click “Enable Editing” to start editing your converted document.
              </p>
            </details>

          </div>
        </div>
      </section> */}
      {seo?.extraContent && (
        <section className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{seo.extraContent.heading}</h2>
          <p className="text-gray-600 leading-7">{seo.extraContent.body}</p>
        </section>
      )}


      <RelatedToolsSection currentPage="pdf-to-word" />


{/* 🔗 Comparison Links (Styled) */}
      <section className="max-w-4xl mx-auto mb-16 px-4">
        <div className="rounded-2xl border bg-white p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                Compare PDF Linx with other PDF tools
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                See differences in limits, ads, pricing, and privacy — before you choose.
              </p>
            </div>

            <a
              href="/free-pdf-tools"
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Explore all tools →
            </a>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href="/compare/pdflinx-vs-ilovepdf"
              className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    PDF Linx vs iLovePDF
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Limits, ads, batch conversion, and privacy comparison.
                  </div>
                </div>
                <span className="text-indigo-600 group-hover:translate-x-0.5 transition">→</span>
              </div>
            </a>

            <a
              href="/compare/pdflinx-vs-smallpdf"
              className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    PDF Linx vs Smallpdf
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Free tier limits, pricing, and user experience.
                  </div>
                </div>
                <span className="text-indigo-600 group-hover:translate-x-0.5 transition">→</span>
              </div>
            </a>
          </div>
        </div>
      </section>

    </>
  );
}























































// // app/pdf-to-word/page.js

// "use client";
// import { useState } from "react";
// import { Upload, Download, CheckCircle, FileText } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";

// export default function PdfToWord() {
//   const [files, setFiles] = useState([]); // ✅ multiple PDFs
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const [progress, setProgress] = useState(0);


//   // ✅ only for ZIP downloads (multiple files)
//   const [downloadUrl, setDownloadUrl] = useState(null);


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!files.length) return alert("Please select at least one PDF file");

//   setLoading(true);
//   setSuccess(false);
//   setError("");
//   setProgress(0);

//   const formData = new FormData();
//   files.forEach((f) => formData.append("files", f));

//   const pollIntervalMs = 1500;
//   const maxWaitMs = 15 * 60 * 1000;
//   const startedAt = Date.now();

//   // Helper: fetch JSON with better errors
//   const fetchJson = async (url, options) => {
//     const r = await fetch(url, { cache: "no-store", ...options });
//     const ct = r.headers.get("content-type") || "";
//     let payload = null;

//     if (ct.includes("json")) {
//       try { payload = await r.json(); } catch {}
//     }

//     if (!r.ok) {
//       const msg =
//         payload?.detail || payload?.error || `Request failed ${r.status} ${r.statusText}`;
//       const err = new Error(msg);
//       err.status = r.status;
//       err.payload = payload;
//       throw err;
//     }

//     return payload ?? {};
//   };

//   // Helper: download file as blob (safer than window.location.href)
//   const downloadViaBlob = async (url, filenameFallback) => {
//     const r = await fetch(url, { cache: "no-store" });
//     if (!r.ok) throw new Error(`Download failed ${r.status}`);

//     const blob = await r.blob();
//     const urlObj = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = urlObj;

//     // Try filename from header if present
//     const cd = r.headers.get("content-disposition") || "";
//     const match = cd.match(/filename\*?=(?:UTF-8''|")?([^;"\n]+)"?/i);
//     const filename = match ? decodeURIComponent(match[1]) : filenameFallback;

//     a.download = filename || "pdflinx-download";
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(urlObj);
//   };

//   // Try /api first (Next/Python), fallback to /convert (Node) if 404
//   const getJobStatus = async (jobId) => {
//     try {
//       return await fetchJson(`/api/convert/job/${jobId}`);
//     } catch (err) {
//       if (err?.status === 404) {
//         return await fetchJson(`/convert/job/${jobId}`);
//       }
//       throw err;
//     }
//   };

//   const downloadResult = async (jobId) => {
//     // same fallback logic
//     try {
//       await downloadViaBlob(`/api/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
//     } catch (err) {
//       if (err?.message?.includes("404")) {
//         await downloadViaBlob(`/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
//         return;
//       }
//       // if API download failed for non-404, try convert once as well
//       try {
//         await downloadViaBlob(`/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
//       } catch {
//         throw err;
//       }
//     }
//   };

//   // Poll using setTimeout to avoid overlapping async calls
//   let stopped = false;
//   const poll = async (jobId) => {
//     if (stopped) return;

//     if (Date.now() - startedAt > maxWaitMs) {
//       setLoading(false);
//       setError("Conversion timeout. Please try again.");
//       return;
//     }

//     try {
//       const statusData = await getJobStatus(jobId);

//       const status = statusData?.status;
//       if (status === "queued") {
//         setProgress(0);
//       } else if (status === "processing") {
//         setProgress(statusData?.progress ?? 10);
//       } else if (status === "done") {
//         setProgress(100);
//         setSuccess(true);
//         setFiles([]);
//         setLoading(false);

//         // download
//         await downloadResult(jobId);
//         return;
//       } else if (status === "failed") {
//         setLoading(false);
//         setError(statusData?.error || "Conversion failed on server");
//         return;
//       } else {
//         // unknown status
//         setProgress((p) => Math.max(p, 5));
//       }

//       setTimeout(() => poll(jobId), pollIntervalMs);
//     } catch (err) {
//       setLoading(false);
//       setError(err?.message || "Polling failed");
//     }
//   };

//   try {
//     const res = await fetch("/convert/pdf-to-word", { method: "POST", body: formData });
//     const ct = res.headers.get("content-type") || "";

//     if (!res.ok) {
//       let msg = `Server error ${res.status}`;
//       if (ct.includes("json")) {
//         try {
//           const err = await res.json();
//           msg = err.detail || err.error || msg;
//         } catch {}
//       }
//       throw new Error(msg);
//     }

//     // CASE A: ZIP directly
//     if (ct.includes("application/zip") || ct.includes("zip")) {
//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "pdflinx-pdf-to-word.zip";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       URL.revokeObjectURL(url);

//       setProgress(100);
//       setSuccess(true);
//       setFiles([]);
//       setLoading(false);
//       return;
//     }

//     // CASE B: JSON job
//     if (!ct.includes("json")) {
//       throw new Error(`Unexpected response type: ${ct}`);
//     }

//     const data = await res.json();
//     const jobId = data?.jobId;
//     if (!jobId) throw new Error("Job ID not received from server");

//     // start polling
//     poll(jobId);
//   } catch (err) {
//     stopped = true;
//     setLoading(false);
//     setError(err?.message || "Something went wrong");
//   }
// };



//   // ✅ Only for ZIP downloads (multiple PDFs)
//   const handleDownloadZip = async () => {
//     if (!downloadUrl) return;

//     try {
//       const res = await fetch(downloadUrl);
//       if (!res.ok) throw new Error("Download failed");

//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "pdflinx-pdf-to-word.zip";
//       a.click();

//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("There was a problem with the download.");
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}

//       {/* HowTo Schema - PDF to Word */}
//       <Script
//         id="howto-schema-pdf-to-word"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "HowTo",
//               name: "How to Convert PDF to Word Online for Free",
//               description:
//                 "Convert one or multiple PDF files into editable Word (DOCX) in seconds with PDFLinx — free, fast, and no signup required.",
//               url: "https://pdflinx.com/pdf-to-word",
//               step: [
//                 {
//                   "@type": "HowToStep",
//                   name: "Upload PDF File(s)",
//                   text: "Upload a single PDF or select multiple PDFs at once.",
//                 },
//                 {
//                   "@type": "HowToStep",
//                   name: "Click Convert",
//                   text: "Press 'Convert to Word' and wait a few seconds while we process your file(s).",
//                 },
//                 {
//                   "@type": "HowToStep",
//                   name: "Download DOCX (or ZIP)",
//                   text: "Single file downloads as DOCX. Multiple files download as a ZIP containing all DOCX files.",
//                 },
//               ],
//               totalTime: "PT30S",
//               estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//               tool: [{ "@type": "HowToTool", name: "PDFLinx PDF to Word Converter" }],
//               image: "https://pdflinx.com/og-image.png",
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       {/* Breadcrumb Schema - PDF to Word */}
//       <Script
//         id="breadcrumb-schema-pdf-to-word"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "BreadcrumbList",
//               itemListElement: [
//                 { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//                 { "@type": "ListItem", position: 2, name: "PDF to Word", item: "https://pdflinx.com/pdf-to-word" },
//               ],
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
//               PDF to Word Converter <br />(Free & Online)
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Got a PDF you need to edit? Upload one file for a quick DOCX — or select multiple PDFs together and download
//               everything in one ZIP. Clean output, no watermark, no signup.
//             </p>
//           </div>

//           {/* <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-center">
//             <h3 className="mb-1 text-sm font-semibold text-yellow-800">
//               🚧 Tool Under Maintenance
//             </h3>
//             <p className="text-sm text-yellow-700">
//               We’re fixing an issue to make conversions faster and more accurate.
//               <br />
//               Please check back shortly — <strong>PDFLinx</strong> will be ready for you.
//             </p>
//           </div>  */}
 

//           {/* Main Card */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Upload Area */}
//               <div className="relative">
//                 <label className="block">
//                   <div
//                     className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
//                       files.length
//                         ? "border-green-500 bg-green-50"
//                         : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
//                     }`}
//                   >
//                     <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
//                     <p className="text-lg font-semibold text-gray-700">
//                       {files.length
//                         ? `${files.length} file(s) selected`
//                         : "Drop your PDF file(s) here or click to upload"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Converts PDF to editable Word (DOCX)
//                     </p>
//                     <p className="text-xs text-gray-500 mt-2">
//                       Tip: Single PDF downloads as DOCX. Multiple PDFs download as a ZIP with all DOCX files inside.
//                     </p>
//                   </div>

//                   <input
//                     type="file"
//                     multiple
//                     accept="application/pdf"
//                     onChange={(e) => setFiles(Array.from(e.target.files || []))}
//                     className="hidden"
//                     required
//                   />
//                 </label>
//               </div>


//                 {/* Convert Button */}
                
//                 <button
//                   type="submit"
//                   disabled={loading || !files.length}
//                   className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
//                 >
//                    {loading ? (
//                     <>Converting… please wait</>
//                   ) : (
//                     <>
//                       <FileText className="w-5 h-5" />
//                       Convert to Word
//                     </>
//                   )} 
//                  </button> 



//                 {/* <button
//                   disabled
//                   className="w-full cursor-not-allowed rounded-lg bg-gray-300 py-3 text-sm font-semibold text-gray-600"
//                 >
//                   Temporarily Unavailable
//                 </button>
//  */}
                

//                 {/* UX Notice (✅ button ke neeche, form ke andar) */}
//                 <div className="text-sm text-gray-600 text-center mt-4 space-y-1">
//                   <p>
//                     ⏱️ <strong>Multiple files conversion may take up to 1 minute.</strong> Please don’t close this tab.
//                   </p>
//                   <p>
//                     🔢 You can convert up to <strong>10 PDF files at once</strong>.
//                   </p>
//                 </div>
//                 </form>

          

//                   {/* MS Word Compatibility Notice (✅ form ke baad, bilkul sahi) */}
//                   <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700">
//                     <p className="font-semibold mb-1">ℹ️ Microsoft Word Compatibility</p>
//                     <ul className="list-disc pl-5 space-y-1">
//                       <li>
//                         Converted files open best in <strong>Microsoft Word 2013 or newer</strong>.
//                       </li>
//                       <li>
//                         When opening the file, click <strong>“Enable Editing”</strong> if prompted.
//                       </li>
//                       <li>
//                         Older versions of Word may not fully support modern DOCX files.
//                       </li>
//                     </ul>
//                   </div>



//             {success && (
//           <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//             <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
//             <p className="text-xl font-bold text-green-700 mb-2">
//               Done! Your file(s) downloaded automatically 🎉
//             </p>
//             <p className="text-base text-gray-700">
//               {files.length === 1 
//                 ? "Check your downloads for the editable Word file." 
//                 : "Check your downloads – ZIP contains all converted DOCX files."}
//             </p>
//           </div>


//         )}
//     </div>

//           {/* Footer */}
//           <p className="text-center mt-6 text-gray-600 text-base">
//             No account • No watermark • Files gone after 1 hour • Completely free • Single & bulk conversions supported
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
//             PDF to Word Online Free – Make Your PDFs Editable
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Need to tweak a PDF? Convert it to Word here — text, tables, images, everything stays in place so you can edit easily.
//             Converting a bunch of PDFs? Upload multiple files together and download a ZIP with all DOCX files inside.
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Super Accurate</h3>
//             <p className="text-gray-600 text-sm">
//               Text, tables, and layout move over neatly so editing feels easy.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Single + Bulk Support</h3>
//             <p className="text-gray-600 text-sm">
//               Convert one PDF to DOCX or upload multiple PDFs and download a ZIP — your choice.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
//             <p className="text-gray-600 text-sm">
//               No sign-up, no watermark, and files are removed after 1 hour.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Convert PDF to Word in 3 Easy Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload PDF File(s)</h4>
//               <p className="text-gray-600 text-sm">
//                 Upload a single PDF — or select multiple PDFs at once.
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
//               <p className="text-gray-600 text-sm">We extract content and keep it editable.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download DOCX (or ZIP)</h4>
//               <p className="text-gray-600 text-sm">
//                 Single file downloads as DOCX. Multiple files download as a ZIP.
//               </p>
//             </div>
//           </div>
//         </div>

//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           Convert PDFs into editable Word files with PDF Linx — fast, accurate, and always free.
//         </p>
//       </section>

//       {/* Long-form content (Human touch + bulk mention) */}
//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//           PDF to Word Converter – Free Online Tool by PDFLinx
//         </h2>

//         <p className="text-base leading-7 mb-6">
//           Ever had a PDF that you needed to edit “right now” — but it wouldn’t let you? That’s the exact pain this tool solves.
//           The <span className="font-medium text-slate-900">PDFLinx PDF to Word Converter</span> turns PDFs into editable Word (DOCX)
//           in seconds. And the best part? If you have a bunch of PDFs, you can upload multiple files at once and download everything in a single ZIP.
//         </p>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           What is PDF to Word conversion?
//         </h3>
//         <p className="leading-7 mb-6">
//           PDF to Word conversion means taking a PDF (which is usually fixed and hard to edit) and turning it into a Word document
//           you can change freely — edit text, fix typos, update tables, or copy content into your own template.
//         </p>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Single file or multiple files — both supported
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li><strong>Single PDF:</strong> converts and downloads as a Word (DOCX) file directly.</li>
//           <li><strong>Multiple PDFs:</strong> converts all files and gives you a ZIP containing all DOCX files.</li>
//         </ul>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Why use PDFLinx?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li>Fast conversion with clean, editable output</li>
//           <li>No watermark, no signup, no annoying limits</li>
//           <li>Great for resumes, reports, contracts, and assignments</li>
//           <li>Supports bulk conversion when you’re working with many files</li>
//           <li>Privacy-first: files are removed after processing</li>
//         </ul>
//       </section>

//       {/* FAQ */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
//             Frequently Asked Questions
//           </h2>

//           <div className="space-y-4">
//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Is the PDF to Word converter free to use?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — it’s completely free with no hidden charges.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Do I need to install any software?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 No. Everything works directly in your browser.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Will the formatting from my PDF be preserved?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 We try to keep formatting (tables, spacing, headings) as close as possible. Very complex PDFs may need minor cleanup afterward.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Are my files safe and private?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — files are processed securely and removed after conversion.
//               </p>
//             </details>

//             {/* ✅ NEW FAQS (bulk support) */}
//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I convert multiple PDFs to Word at the same time?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes. Upload multiple PDFs together and you’ll get a ZIP containing all converted DOCX files.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 What happens if I upload only one PDF?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 If you upload a single PDF, it downloads as a DOCX directly — no ZIP.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I use this on my phone?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Absolutely. It works smoothly on mobile, tablet, and desktop.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Why does Word ask me to “Enable Editing”?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 This is a normal Microsoft Word security prompt for downloaded files. Click “Enable Editing” to start editing your converted document.
//               </p>
//             </details>

//           </div>
//         </div>
//       </section>


//       <RelatedToolsSection currentPage="pdf-to-word" />


// {/* 🔗 Comparison Links (Styled) */}
//       <section className="max-w-4xl mx-auto mb-16 px-4">
//         <div className="rounded-2xl border bg-white p-6 md:p-8 shadow-sm">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h3 className="text-lg md:text-xl font-bold text-slate-900">
//                 Compare PDF Linx with other PDF tools
//               </h3>
//               <p className="mt-1 text-sm text-slate-600">
//                 See differences in limits, ads, pricing, and privacy — before you choose.
//               </p>
//             </div>

//             <a
//               href="/free-pdf-tools"
//               className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//             >
//               Explore all tools →
//             </a>
//           </div>

//           <div className="mt-6 grid gap-3 sm:grid-cols-2">
//             <a
//               href="/compare/pdflinx-vs-ilovepdf"
//               className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div>
//                   <div className="text-sm font-semibold text-slate-900">
//                     PDF Linx vs iLovePDF
//                   </div>
//                   <div className="mt-1 text-xs text-slate-600">
//                     Limits, ads, batch conversion, and privacy comparison.
//                   </div>
//                 </div>
//                 <span className="text-indigo-600 group-hover:translate-x-0.5 transition">→</span>
//               </div>
//             </a>

//             <a
//               href="/compare/pdflinx-vs-smallpdf"
//               className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div>
//                   <div className="text-sm font-semibold text-slate-900">
//                     PDF Linx vs Smallpdf
//                   </div>
//                   <div className="mt-1 text-xs text-slate-600">
//                     Free tier limits, pricing, and user experience.
//                   </div>
//                 </div>
//                 <span className="text-indigo-600 group-hover:translate-x-0.5 transition">→</span>
//               </div>
//             </a>
//           </div>
//         </div>
//       </section>




//     </>
//   );
// }












