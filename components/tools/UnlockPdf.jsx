"use client";

import { useMemo, useState } from "react";
import { Upload, FileText, Download, CheckCircle, X, Key, LockOpen } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";

export default function UnlockPdf() {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const totalSizeMb = useMemo(() => {
    return files.reduce((sum, f) => sum + (f?.size || 0), 0) / 1024 / 1024;
  }, [files]);

  const clearAll = () => {
    setFiles([]);
    setPassword("");
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
    // optional password (send only if user entered)
    if (password.trim()) formData.append("password", password.trim());

    try {
      const res = await fetch("/convert/unlock-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Unlock failed";
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
        const outName = files[0].name.replace(/\.pdf$/i, "") + "-unlocked.pdf";
        downloadBlob(blob, outName);
        setSuccess(true);
        return;
      }

      // ✅ MULTIPLE => ZIP
      if (contentType.includes("application/zip")) {
        const blob = await res.blob();
        downloadBlob(blob, "pdflinx-unlocked-pdfs.zip");
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

      // Friendly hints
      if (msg.toLowerCase().includes("password")) {
        setError(
          "This PDF requires a password to open (user password). Please enter the correct password and try again."
        );
      } else {
        setError(msg);
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ==================== SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-unlock"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Unlock a PDF Online for Free",
              description:
                "Unlock PDFs online by removing printing/copying/editing restrictions. If your PDF requires a password to open, enter it to unlock.",
              url: "https://pdflinx.com/unlock-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF file(s)",
                  text: "Upload a single PDF or select multiple PDFs at the same time.",
                },
                {
                  "@type": "HowToStep",
                  name: "Enter password (only if required)",
                  text: "If your PDF requires a password to open, enter it. Otherwise leave it blank.",
                },
                {
                  "@type": "HowToStep",
                  name: "Unlock and download",
                  text: "Click Unlock. Download the unlocked PDF (or ZIP if multiple files).",
                },
              ],
              totalTime: "PT20S",
              estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
              image: "https://pdflinx.com/og-image.png",
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="breadcrumb-schema-unlock"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "Unlock PDF", item: "https://pdflinx.com/unlock-pdf" },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="faq-schema-unlock"
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
                  name: "Can I unlock a PDF without a password?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Yes, if the PDF only has printing/copying/editing restrictions (owner password). If the PDF requires a password to open (user password), you must enter the correct password.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is the difference between user password and owner password?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "A user password is required to open the PDF. An owner password typically restricts actions like printing, copying, or editing. Owner restrictions can often be removed without needing a password.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is PDFLinx demonstrating or cracking passwords?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "No. PDFLinx unlocks PDFs by removing permission restrictions or by using the password you provide. PDFs that require an opening password cannot be unlocked without the correct password.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Are my files safe?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Yes. Files are processed automatically and deleted shortly after processing. No sign-up required.",
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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Unlock PDF <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Remove printing, copying, and editing restrictions from PDF files.
              Upload one PDF or multiple PDFs — and if your file needs an opening password, enter it to continue.
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

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  Password (optional)
                </label>
                <input
                  type="password"
                  placeholder="Enter only if PDF requires a password to open"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSuccess(false);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <p className="text-xs text-gray-500">
                  Leave blank for PDFs with only printing/copying/editing restrictions (owner lock).
                  If the PDF requires a password to open (user lock), you must enter the correct password.
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
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Unlocking... hang tight!</>
                ) : (
                  <>
                    <LockOpen className="w-5 h-5" />
                    Unlock PDF
                  </>
                )}
              </button>
            </form>

            {/* Success */}
            {success && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">
                  Done! Your {files.length === 1 ? "PDF" : "ZIP"} is ready
                </p>
                <p className="text-sm text-green-700">
                  Download started automatically.
                </p>
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
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Unlock PDF Online Free – Remove Restrictions in Seconds
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Some PDFs restrict printing, copying, or editing. PDFLinx Unlock PDF removes these restrictions fast.
            If your PDF requires a password to open, just enter the password — and we’ll unlock it for you.
            No sign-up, no watermark, and your files are processed securely.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LockOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Remove Restrictions</h3>
            <p className="text-gray-600 text-sm">
              Unlock printing/copying/editing restrictions (owner protection) in one click.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Password When Needed</h3>
            <p className="text-gray-600 text-sm">
              If your PDF requires a password to open (user protection), enter it to unlock safely.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast Downloads</h3>
            <p className="text-gray-600 text-sm">
              Single file downloads as PDF. Multiple files download as a ZIP — quick and clean.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Unlock PDF in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload PDF(s)</h4>
              <p className="text-gray-600 text-sm">
                Upload one PDF or multiple PDFs at once.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Enter Password (Optional)</h4>
              <p className="text-gray-600 text-sm">
                Only needed if the PDF requires a password to open.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download</h4>
              <p className="text-gray-600 text-sm">
                Download unlocked PDF (or ZIP if multiple).
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          PDFLinx helps you unlock permission-restricted PDFs fast — safe, simple, and always free.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Unlock PDF Online – Remove PDF Password Free with PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Password-protected PDF files can be difficult to access when you forget the password or
          receive a secured document for legitimate use.
          <span className="font-medium text-slate-900"> PDFLinx Unlock PDF tool</span>{" "}
          allows you to remove password protection from PDF files online so you can open, view,
          and edit them freely.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Does Unlocking a PDF Mean?
        </h3>
        <p className="leading-7 mb-6">
          Unlocking a PDF means removing its password protection so the file can be accessed without
          entering a password each time. Once unlocked, the PDF behaves like a normal document,
          allowing you to read, print, or edit it without restrictions.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Would You Need to Unlock a PDF?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>You forgot the password of your own PDF file</li>
          <li>You received a password-protected PDF for authorized use</li>
          <li>You want to edit or extract content from a secured PDF</li>
          <li>You need to print or share the PDF without restrictions</li>
          <li>You want easier access to frequently used documents</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Unlock a PDF Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload the password-protected PDF file</li>
          <li>Enter the correct PDF password</li>
          <li>Click the “Unlock PDF” button</li>
          <li>Download your unlocked PDF instantly</li>
        </ol>

        <p className="mb-6">
          No registration required. Files are processed securely and deleted shortly after unlocking.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Unlock PDF Tool
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>Free online PDF password remover</li>
            <li>Unlock PDFs securely using correct password</li>
            <li>No software installation required</li>
            <li>Fast and easy PDF unlocking</li>
            <li>Works on desktop and mobile devices</li>
            <li>No watermark added</li>
            <li>Privacy-focused file processing</li>
            <li>Supports most encrypted PDF files</li>
            <li>Simple and clean user interface</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use the Unlock PDF Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Professionals:</strong> Edit and reuse secured documents</li>
          <li><strong>Businesses:</strong> Access archived or shared PDFs easily</li>
          <li><strong>Students:</strong> Unlock study materials and notes</li>
          <li><strong>Freelancers:</strong> Modify client-shared protected files</li>
          <li><strong>Individuals:</strong> Regain access to personal PDFs</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Unlock PDF Safe?
        </h3>
        <p className="leading-7 mb-6">
          Yes. PDFLinx prioritizes your privacy and security. Files are unlocked only after
          the correct password is provided and are automatically deleted after processing.
          Your documents are never stored or shared.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Unlock PDFs Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx works on Windows, macOS, Linux, Android, and iOS devices.
          With just a browser and internet connection, you can unlock PDF files
          anytime and anywhere without installing any software.
        </p>
      </section>


      {/* FAQs */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Can I unlock a PDF without a password?</summary>
              <p className="mt-2 text-gray-600">
                Yes — if it only has printing/copying/editing restrictions (owner lock). If it requires a password to open (user lock),
                you must enter the correct password.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">What’s the difference between user password and owner password?</summary>
              <p className="mt-2 text-gray-600">
                User password is required to open the PDF. Owner password is usually for permissions (print/copy/edit). Owner restrictions
                can often be removed without a password.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Will my unlocked PDF look the same?</summary>
              <p className="mt-2 text-gray-600">
                Yes. Unlocking removes restrictions — it does not change your content or layout.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Are my files safe and private?</summary>
              <p className="mt-2 text-gray-600">
                Yes. Files are processed securely and deleted automatically after processing.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">Can I unlock multiple PDFs at once?</summary>
              <p className="mt-2 text-gray-600">
                Yes. Upload up to 10 PDFs. If you upload multiple files, you’ll download a ZIP with all unlocked PDFs.
              </p>
            </details>
          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="unlock-pdf" />
    </>
  );
}

























// "use client";

// import { useMemo, useState } from "react";
// import { Upload, LockOpen, CheckCircle, X, FileText, Key } from "lucide-react";
// import Script from "next/script";

// export default function UnlockPdf() {
//   const [files, setFiles] = useState([]);
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");

//   const totalSizeMb = useMemo(() => {
//     return files.reduce((sum, f) => sum + (f?.size || 0), 0) / 1024 / 1024;
//   }, [files]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!files.length) {
//       setError("Please select at least one PDF file.");
//       return;
//     }

//     setLoading(true);
//     setSuccess(false);
//     setError("");

//     const formData = new FormData();
//     files.forEach((f) => formData.append("files", f));
//     if (password.trim()) formData.append("password", password.trim());

//     try {
//       const res = await fetch("/convert/unlock-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         let msg = "Unlock failed";
//         try {
//           const j = await res.json();
//           msg = j?.error || msg;
//         } catch {}
//         throw new Error(msg);
//       }

//       const type = res.headers.get("content-type") || "";

//       // Single PDF
//       if (type.includes("application/pdf")) {
//         const blob = await res.blob();
//         const url = URL.createObjectURL(blob);
//         download(url, files[0].name.replace(/\.pdf$/i, "") + "-unlocked.pdf");
//         setSuccess(true);
//         return;
//       }

//       // ZIP
//       if (type.includes("application/zip")) {
//         const blob = await res.blob();
//         const url = URL.createObjectURL(blob);
//         download(url, "pdflinx-unlocked-pdfs.zip");
//         setSuccess(true);
//         return;
//       }

//       throw new Error("Unexpected server response.");
//     } catch (err) {
//       const msg = err?.message || "Something went wrong.";
//       if (msg.toLowerCase().includes("password")) {
//         setError(
//           "This PDF requires a password to open. Please enter the correct password and try again."
//         );
//       } else {
//         setError(msg);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const download = (url, name) => {
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = name;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const removeFile = (i) => {
//     setFiles((p) => p.filter((_, idx) => idx !== i));
//     setError("");
//     setSuccess(false);
//   };

//   const clearAll = () => {
//     setFiles([]);
//     setPassword("");
//     setError("");
//     setSuccess(false);
//   };

//   return (
//     <>
//       {/* ================= SEO: FAQ SCHEMA ================= */}
//       <Script
//         id="faq-unlock-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "FAQPage",
//             mainEntity: [
//               {
//                 "@type": "Question",
//                 name: "Can I unlock a PDF without a password?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text:
//                     "Yes, if the PDF only has printing or editing restrictions (owner password). PDFs that require a password to open need the correct password.",
//                 },
//               },
//               {
//                 "@type": "Question",
//                 name: "Why does my PDF ask for a password?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text:
//                     "Some PDFs are protected with an open (user) password. These cannot be unlocked without entering the correct password.",
//                 },
//               },
//               {
//                 "@type": "Question",
//                 name: "Is Unlock PDF free on PDFLinx?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text:
//                     "Yes. PDFLinx Unlock PDF is completely free with no watermark and no sign-up required.",
//                 },
//               },
//             ],
//           }),
//         }}
//       />

//       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-10 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-4">
//               Unlock PDF Online – Free & Secure
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Remove printing, copying, and editing restrictions from PDFs.
//               If your file requires a password to open, simply enter it below.
//             </p>
//           </div>

//           {/* Card */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Upload */}
//               <label className="block">
//                 <div
//                   className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
//                     files.length
//                       ? "border-green-500 bg-green-50"
//                       : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
//                   }`}
//                 >
//                   <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
//                   <p className="font-semibold">
//                     {files.length
//                       ? `${files.length} file(s) selected`
//                       : "Drop PDF files here or click to upload"}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Max 10 files • 25MB each
//                   </p>
//                   {!!files.length && (
//                     <p className="text-xs text-gray-500 mt-2">
//                       Total size: {totalSizeMb.toFixed(2)} MB
//                     </p>
//                   )}
//                 </div>
//                 <input
//                   type="file"
//                   multiple
//                   accept="application/pdf,.pdf"
//                   className="hidden"
//                   onChange={(e) => {
//                     setFiles(Array.from(e.target.files || []));
//                     setPassword("");
//                     setError("");
//                     setSuccess(false);
//                   }}
//                 />
//               </label>

//               {/* File List */}
//               {files.map((f, i) => (
//                 <div
//                   key={i}
//                   className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
//                 >
//                   <div className="flex gap-2 items-center">
//                     <FileText className="w-5 h-5 text-red-600" />
//                     <span className="text-sm truncate max-w-xs">{f.name}</span>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => removeFile(i)}
//                     className="text-red-500"
//                   >
//                     <X />
//                   </button>
//                 </div>
//               ))}

//               {files.length > 0 && (
//                 <button
//                   type="button"
//                   onClick={clearAll}
//                   className="text-sm underline text-right block w-full"
//                 >
//                   Clear all
//                 </button>
//               )}

//               {/* Password */}
//               <div>
//                 <label className="flex items-center gap-2 text-sm font-medium">
//                   <Key className="w-5 h-5 text-blue-600" />
//                   Password (optional)
//                 </label>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Only if PDF requires password to open"
//                   className="w-full mt-2 px-4 py-3 border rounded-xl"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Leave blank for PDFs with only printing/editing restrictions.
//                 </p>
//               </div>

//               {/* Error */}
//               {error && (
//                 <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700">
//                   {error}
//                 </div>
//               )}

//               {/* Button */}
//               <button
//                 type="submit"
//                 disabled={loading || !files.length}
//                 className="w-full py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-green-600 disabled:opacity-60"
//               >
//                 {loading ? "Unlocking…" : "Unlock PDF"}
//               </button>
//             </form>

//             {success && (
//               <div className="mt-6 text-center bg-green-50 border border-green-200 p-4 rounded-xl">
//                 <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
//                 <p className="font-bold text-green-700">
//                   PDF successfully unlocked!
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }



















// // "use client";

// // import { useMemo, useState } from "react";
// // import { Upload, LockOpen, CheckCircle, X, FileText, Key } from "lucide-react";

// // export default function UnlockPdf() {
// //   const [files, setFiles] = useState([]);
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [success, setSuccess] = useState(false);
// //   const [error, setError] = useState("");

// //   const totalSizeMb = useMemo(() => {
// //     return files.reduce((sum, f) => sum + (f?.size || 0), 0) / 1024 / 1024;
// //   }, [files]);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!files.length) {
// //       setError("Please select at least one PDF file!");
// //       return;
// //     }

// //     setLoading(true);
// //     setSuccess(false);
// //     setError("");

// //     const formData = new FormData();
// //     files.forEach((f) => formData.append("files", f));

// //     // ✅ optional password (send only if user entered)
// //     if (password.trim()) formData.append("password", password.trim());

// //     try {
// //       const res = await fetch("/convert/unlock-pdf", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       if (!res.ok) {
// //         let msg = "Unlock failed";
// //         try {
// //           const j = await res.json();
// //           msg = j?.error || msg;
// //         } catch {}
// //         throw new Error(msg);
// //       }

// //       const contentType = res.headers.get("content-type") || "";

// //       // ✅ Single file → direct PDF download
// //       if (contentType.includes("application/pdf")) {
// //         const blob = await res.blob();
// //         const url = URL.createObjectURL(blob);

// //         const a = document.createElement("a");
// //         a.href = url;
// //         a.download = files[0].name.replace(/\.pdf$/i, "") + "-unlocked.pdf";
// //         a.click();

// //         URL.revokeObjectURL(url);
// //         setSuccess(true);
// //         return;
// //       }

// //       // ✅ Multiple files → ZIP download
// //       if (contentType.includes("application/zip")) {
// //         const blob = await res.blob();
// //         const url = URL.createObjectURL(blob);

// //         const a = document.createElement("a");
// //         a.href = url;
// //         a.download = "pdflinx-unlocked-pdfs.zip";
// //         a.click();

// //         URL.revokeObjectURL(url);
// //         setSuccess(true);
// //         return;
// //       }

// //       // fallback (unexpected)
// //       let data = null;
// //       try {
// //         data = await res.json();
// //       } catch {}
// //       throw new Error(data?.error || "Unexpected response from server");
// //     } catch (err) {
// //       const msg = (err?.message || "Something went wrong. Please try again.").toString();

// //       // ✅ Friendly hint for password-protected PDFs
// //       if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("protected")) {
// //         setError("This PDF requires a password to open. Please enter the password and try again.");
// //       } else {
// //         setError(msg);
// //       }

// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const removeFile = (index) => {
// //     setFiles((prev) => prev.filter((_, i) => i !== index));
// //     setSuccess(false);
// //     setError("");
// //   };

// //   const clearAll = () => {
// //     setFiles([]);
// //     setPassword("");
// //     setSuccess(false);
// //     setError("");
// //   };

// //   return (
// //     <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
// //       <div className="max-w-4xl mx-auto">
// //         <div className="text-center mb-8">
// //           <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
// //             Unlock PDF Online (Free)
// //           </h1>
// //           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// //             Remove printing, copying, and editing restrictions from PDF files.
// //             Upload single or multiple PDFs — password optional (only if the PDF requires it).
// //           </p>
// //         </div>

// //         <div className="bg-white rounded-2xl shadow-lg p-8 border">
// //           <form onSubmit={handleSubmit} className="space-y-6">
// //             {/* Upload Area */}
// //             <label className="block">
// //               <div
// //                 className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
// //                   files.length
// //                     ? "border-green-500 bg-green-50"
// //                     : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
// //                 }`}
// //               >
// //                 <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
// //                 <p className="text-lg font-semibold">
// //                   {files.length
// //                     ? `${files.length} file(s) selected`
// //                     : "Drop PDF file(s) here or click to upload"}
// //                 </p>
// //                 <p className="text-sm text-gray-500 mt-1">
// //                   PDF files only • Max 10 files • 25MB each
// //                 </p>
// //                 {!!files.length && (
// //                   <p className="text-xs text-gray-500 mt-2">
// //                     Total selected: {totalSizeMb.toFixed(2)} MB
// //                   </p>
// //                 )}
// //               </div>

// //               <input
// //                 type="file"
// //                 multiple
// //                 accept=".pdf,application/pdf"
// //                 className="hidden"
// //                 onChange={(e) => {
// //                   const newFiles = Array.from(e.target.files || []);

// //                   if (newFiles.length > 10) {
// //                     setError("Maximum 10 files allowed");
// //                     return;
// //                   }

// //                   setFiles(newFiles);
// //                   setPassword(""); // ✅ reset password on new selection
// //                   setSuccess(false);
// //                   setError("");
// //                 }}
// //               />
// //             </label>

// //             {/* Selected Files List */}
// //             {files.length > 0 && (
// //               <div className="space-y-2">
// //                 {files.map((file, idx) => (
// //                   <div
// //                     key={`${file.name}-${file.size}-${idx}`}
// //                     className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
// //                   >
// //                     <div className="flex items-center gap-2 min-w-0">
// //                       <FileText className="w-5 h-5 text-red-600 shrink-0" />
// //                       <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
// //                       <span className="text-xs text-gray-500 shrink-0">
// //                         ({(file.size / 1024 / 1024).toFixed(2)} MB)
// //                       </span>
// //                     </div>
// //                     <button
// //                       type="button"
// //                       onClick={() => removeFile(idx)}
// //                       className="text-red-500 hover:bg-red-100 p-1 rounded"
// //                       aria-label="Remove file"
// //                     >
// //                       <X className="w-5 h-5" />
// //                     </button>
// //                   </div>
// //                 ))}

// //                 <div className="flex justify-end">
// //                   <button
// //                     type="button"
// //                     onClick={clearAll}
// //                     className="text-sm font-semibold text-gray-700 hover:text-gray-900 underline"
// //                   >
// //                     Clear all
// //                   </button>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Password Field (Optional) */}
// //             <div className="space-y-2">
// //               <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
// //                 <Key className="w-5 h-5 text-blue-600" />
// //                 Password (optional)
// //               </label>
// //               <input
// //                 type="password"
// //                 placeholder="Enter only if PDF requires a password to open"
// //                 value={password}
// //                 onChange={(e) => {
// //                   setPassword(e.target.value);
// //                   setSuccess(false);
// //                 }}
// //                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
// //               />
// //               <p className="text-xs text-gray-500">
// //                 Leave blank for files with only printing/copying/editing restrictions — we’ll remove them automatically.
// //               </p>
// //             </div>

// //             {/* Error Message */}
// //             {error && (
// //               <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
// //                 <p className="font-semibold">{error}</p>
// //               </div>
// //             )}

// //             {/* Submit Button */}
// //             <button
// //               type="submit"
// //               disabled={loading || !files.length}
// //               className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg transition-all"
// //             >
// //               {loading ? (
// //                 <>
// //                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// //                   Unlocking...
// //                 </>
// //               ) : (
// //                 <>
// //                   <LockOpen className="w-5 h-5" />
// //                   {password.trim() ? "Unlock PDF with Password" : "Unlock PDF"}
// //                 </>
// //               )}
// //             </button>
// //           </form>

// //           {/* Success Message */}
// //           {success && (
// //             <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center animate-in fade-in duration-300">
// //               <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
// //               <p className="font-bold text-green-700 text-lg">
// //                 ✅ {files.length === 1 ? "PDF Unlocked!" : "PDFs Unlocked & Downloaded!"}
// //               </p>
// //               <p className="text-sm text-green-600 mt-1">
// //                 Your file(s) have been unlocked successfully.
// //               </p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Features */}
// //         <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-gray-600">
// //           <div>🔒 Password Optional</div>
// //           <div>💧 No Watermark</div>
// //           <div>🗑️ Files Auto Delete</div>
// //           <div>📦 Up to 10 Files</div>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // }


