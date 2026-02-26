import Link from "next/link";
import {
  FileText,
  FileType,
  FileImage,
  FileSpreadsheet,
  FilePlus,
  Scissors,
  FileMinus,
  Lock,
  Unlock,
  ShieldCheck,
  Zap,
  Globe,
  RotateCw,
  PenTool,
} from "lucide-react";

import { pdfToolsMeta } from "@/lib/pdfToolsMeta";

const icons = {
  "pdf-to-word": FileText,
  "word-to-pdf": FileType,
  "image-to-pdf": FileImage,
  "merge-pdf": FilePlus,
  "split-pdf": Scissors,
  "compress-pdf": FileMinus,
  "excel-pdf": FileSpreadsheet,
  "ppt-to-pdf": FileType,
  "protect-pdf": Lock,
  "unlock-pdf": Unlock,
  "rotate-pdf": RotateCw,
  "sign-pdf": PenTool,
};

export const metadata = {
  title: "Free PDF Tools – Convert, Merge, Compress PDFs | PDF Linx",
  description:
    "Use PDFLinx free online PDF tools to convert, merge, split, compress, protect, unlock, rotate, and sign PDFs instantly. No signup, no watermark, works on all devices.",
  alternates: {
    canonical: "https://pdflinx.com/free-pdf-tools",
  },
  openGraph: {
    title: "Free PDF Tools – Convert, Merge, Compress PDFs | PDF Linx",
    description:
      "Free online PDF tools: convert, merge, split, compress, protect, unlock, rotate and sign PDFs. No signup required.",
    url: "https://pdflinx.com/free-pdf-tools",
  },
};

export default function FreePdfToolsPage() {
  const getTool = (slug, fallbackHref = "#") =>
    Object.values(pdfToolsMeta).find((t) => t.slug === slug) || {
      href: fallbackHref,
      title: "",
      description: "",
      slug,
    };

  const tPdfToWord = getTool("pdf-to-word", "/pdf-to-word");
  const tWordToPdf = getTool("word-to-pdf", "/word-to-pdf");
  const tImageToPdf = getTool("image-to-pdf", "/image-to-pdf");
  const tMerge = getTool("merge-pdf", "/merge-pdf");
  const tSplit = getTool("split-pdf", "/split-pdf");
  const tCompress = getTool("compress-pdf", "/compress-pdf");
  const tProtect = getTool("protect-pdf", "/protect-pdf");
  const tUnlock = getTool("unlock-pdf", "/unlock-pdf");
  const tRotate = getTool("rotate-pdf", "/rotate-pdf");
  const tSign = getTool("sign-pdf", "/sign-pdf");
  const tExcel = getTool("excel-pdf", "/excel-pdf");
  const tPpt = getTool("ppt-to-pdf", "/ppt-to-pdf");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are free PDF tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Free PDF tools help you convert, merge, split, compress, protect, unlock, rotate, and sign PDF files online without installing software.",
        },
      },
      {
        "@type": "Question",
        name: "Are PDFLinx PDF tools completely free?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. PDFLinx tools are free to use with no signup, no watermark, and no hidden charges.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use PDF tools on mobile and desktop?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. PDFLinx works in your browser on Windows, macOS, Linux, Android, and iOS.",
        },
      },
      {
        "@type": "Question",
        name: "Is it safe to use online PDF tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "PDFLinx is designed to be privacy-friendly. Your files are processed to produce the output and are not meant to be stored permanently.",
        },
      },
      {
        "@type": "Question",
        name: "Which PDF tools are most popular?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Popular tools include Word to PDF, PDF to Word, Compress PDF, Merge PDF, Split PDF, Protect PDF, Unlock PDF, Rotate PDF, and Sign PDF.",
        },
      },
      {
        "@type": "Question",
        name: "How do I merge or split a PDF online?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Upload your PDF, choose merge or split options, and download the result instantly. No account required.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* HERO */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 text-center">
          Free Online PDF Tools
        </h1>

        <p className="text-gray-600 max-w-3xl mx-auto mb-10 text-center">
          PDFLinx offers a complete collection of free online PDF tools to help
          you convert, merge, compress, protect, unlock, rotate, and sign PDF
          files instantly. No signup required, no watermark, and works on all
          devices.
        </p>

        {/* SEO PILLAR CONTENT (HUB) */}
        <section className="max-w-4xl mx-auto mb-12 text-slate-700">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            PDF Tools Online Free – Convert, Edit, Compress & Secure PDFs in One
            Place
          </h2>

          <p className="leading-7 mb-5">
            PDFs are everywhere — resumes, invoices, assignments, contracts, and
            reports. But editing or sharing PDFs can be annoying when a file is
            too large, password-protected, or needs a quick format change.
            That’s where{" "}
            <span className="font-medium text-slate-900">
              PDFLinx Free PDF Tools
            </span>{" "}
            help. Use our web-based toolkit to convert documents to PDF,
            convert PDFs back to editable formats, merge and split pages,
            compress size for email, rotate pages, sign documents, and add
            security for sensitive files — all in your browser.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-indigo-600" size={18} />
                <h3 className="font-semibold text-slate-900">Fast & Simple</h3>
              </div>
              <p className="text-sm text-slate-600 leading-6">
                Upload → choose action → download. No complicated steps.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-indigo-600" size={18} />
                <h3 className="font-semibold text-slate-900">
                  Privacy-Friendly
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-6">
                Designed for safe processing — no signup required to use tools.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="text-indigo-600" size={18} />
                <h3 className="font-semibold text-slate-900">Works Everywhere</h3>
              </div>
              <p className="text-sm text-slate-600 leading-6">
                Use on Windows, macOS, Linux, Android, and iOS in your browser.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Popular PDF Tasks You Can Do Here
          </h3>
          <ul className="space-y-2 list-disc pl-6 mb-6">
            <li>
              Convert documents to PDF:{" "}
              <Link
                href={tWordToPdf.href}
                className="text-indigo-600 font-medium hover:underline"
              >
                Word to PDF
              </Link>{" "}
              /{" "}
              <Link
                href={tExcel.href}
                className="text-indigo-600 font-medium hover:underline"
              >
                Excel to PDF
              </Link>{" "}
              /{" "}
              <Link
                href={tPpt.href}
                className="text-indigo-600 font-medium hover:underline"
              >
                PPT to PDF
              </Link>
            </li>
            <li>
              Convert PDF to editable formats:{" "}
              <Link
                href={tPdfToWord.href}
                className="text-indigo-600 font-medium hover:underline"
              >
                PDF to Word
              </Link>
            </li>
            <li>
              Combine or extract pages:{" "}
              <Link
                href={tMerge.href}
                className="text-indigo-600 font-medium hover:underline"
              >
                Merge PDF
              </Link>{" "}
              /{" "}
              <Link
                href={tSplit.href}
                className="text-indigo-600 font-medium hover:underline"
              >
                Split PDF
              </Link>
            </li>
            <li>
              Reduce PDF size for email & sharing:{" "}
              <Link
                href={tCompress.href}
                className="text-indigo-600 font-medium hover:underline"
              >
                Compress PDF
              </Link>
            </li>
            <li>
              Secure & edit documents:{" "}
              <Link
                href={tProtect.href}
                className="text-indigo-600 font-medium hover:underline"
              >
                Protect PDF
              </Link>{" "}
              /{" "}
              <Link
                href={tUnlock.href}
                className="text-indigo-600 font-medium hover:underline"
              >
                Unlock PDF
              </Link>{" "}
              /{" "}
              <Link
                href={tRotate.href}
                className="text-indigo-600 font-medium hover:underline"
              >
                Rotate PDF
              </Link>{" "}
              /{" "}
              <Link
                href={tSign.href}
                className="text-indigo-600 font-medium hover:underline"
              >
                Sign PDF
              </Link>
            </li>
            <li>
              Convert images into PDF:{" "}
              <Link
                href={tImageToPdf.href}
                className="text-indigo-600 font-medium hover:underline"
              >
                Image to PDF
              </Link>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Which PDF Tool Should You Use?
          </h3>
          <p className="leading-7 mb-2">
            If your goal is sharing or printing, convert files to PDF. If you need
            editing, convert a PDF back to Word. If your PDF is too large,
            compress it. If it contains multiple documents, merge them. If you only
            need certain pages, split it. And if the file is sensitive, add
            password protection. You can also rotate pages to fix orientation and
            sign documents online.
          </p>
          <p className="leading-7">
            This hub page helps you find the right PDF tool quickly — choose a
            tool below and get started.
          </p>
        </section>

        {/* TOP TOOLS */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Most Popular PDF Tools
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Word to PDF", url: "/word-to-pdf", emoji: "📄" },
              { title: "PDF to Word", url: "/pdf-to-word", emoji: "📝" },
              { title: "Protect PDF", url: "/protect-pdf", emoji: "🔐" },
              { title: "Compress PDF", url: "/compress-pdf", emoji: "🗜️" },
            ].map((tool) => (
              <Link
                key={tool.url}
                href={tool.url}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition text-center"
              >
                <div className="text-3xl mb-2">{tool.emoji}</div>
                <h3 className="font-semibold text-gray-800">{tool.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* ALL TOOLS GRID */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            All PDF Tools
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(pdfToolsMeta).map((tool) => {
              const Icon = icons[tool.slug] || FileText;

              return (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <Icon size={28} className="text-indigo-600" />
                    <h3 className="text-lg font-semibold group-hover:text-indigo-600">
                      {tool.title.replace(" | PDF Linx", "")}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600">{tool.description}</p>

                  <span className="inline-block mt-4 text-sm font-medium text-indigo-600">
                    Use tool →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* EXTRA SEO MINI-FAQ (VISIBLE) */}
        <section className="max-w-4xl mx-auto mt-14">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Do I need to install any software?
              </summary>
              <p className="mt-2 text-gray-600">
                No. All PDFLinx tools work online in your browser — just upload,
                process, and download.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Which tool should I use to reduce PDF size?
              </summary>
              <p className="mt-2 text-gray-600">
                Use{" "}
                <Link
                  href={tCompress.href}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Compress PDF
                </Link>{" "}
                to reduce file size for email, WhatsApp, or faster uploads.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I convert Word, Excel, or PowerPoint to PDF?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — try{" "}
                <Link
                  href={tWordToPdf.href}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Word to PDF
                </Link>
                ,{" "}
                <Link
                  href={tExcel.href}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Excel to PDF
                </Link>{" "}
                and{" "}
                <Link
                  href={tPpt.href}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  PPT to PDF
                </Link>
                .
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                How do I secure a PDF with a password?
              </summary>
              <p className="mt-2 text-gray-600">
                Use{" "}
                <Link
                  href={tProtect.href}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Protect PDF
                </Link>{" "}
                to add password protection. If you own the file and need access,
                use{" "}
                <Link
                  href={tUnlock.href}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Unlock PDF
                </Link>
                .
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                How do I rotate pages or sign a PDF online?
              </summary>
              <p className="mt-2 text-gray-600">
                Use{" "}
                <Link
                  href={tRotate.href}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Rotate PDF
                </Link>{" "}
                to fix page orientation, and{" "}
                <Link
                  href={tSign.href}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Sign PDF
                </Link>{" "}
                to add your signature securely online.
              </p>
            </details>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <p className="text-sm text-gray-500 text-center mt-12">
          All tools work online without installation. Files are processed securely
          and removed automatically for your privacy.
        </p>
      </main>
    </>
  );
}























// import Link from "next/link";
// import {
//   FileText,
//   FileType,
//   FileImage,
//   FileSpreadsheet,
//   FilePlus,
//   Scissors,
//   FileMinus,
//   Lock,
//   Unlock,
//   ShieldCheck,
//   Zap,
//   Globe,
// } from "lucide-react";

// import { pdfToolsMeta } from "@/lib/pdfToolsMeta";

// const icons = {
//   "pdf-to-word": FileText,
//   "word-to-pdf": FileType,
//   "image-to-pdf": FileImage,
//   "merge-pdf": FilePlus,
//   "split-pdf": Scissors,
//   "compress-pdf": FileMinus,
//   "excel-pdf": FileSpreadsheet,
//   "ppt-to-pdf": FileType,
//   "protect-pdf": Lock,
//   "unlock-pdf": Unlock,
// };

// export const metadata = {
//   title: "Free PDF Tools – Convert, Merge, Compress PDFs | PDF Linx",
//   description:
//     "Use PDFLinx free online PDF tools to convert, merge, split, compress, protect, and unlock PDFs instantly. No signup, no watermark, works on all devices.",
//   alternates: {
//     canonical: "https://pdflinx.com/free-pdf-tools",
//   },
//   // Optional: openGraph add kar sakte ho agar chahiye
//   openGraph: {
//     title: "Free PDF Tools – Convert, Merge, Compress PDFs | PDF Linx",
//     description:
//       "Free online PDF tools: convert, merge, split, compress, protect PDFs. No signup required.",
//     url: "https://pdflinx.com/free-pdf-tools",
//   },
// };

// export default function FreePdfToolsPage() {
//   const getTool = (slug, fallbackHref = "#") =>
//     Object.values(pdfToolsMeta).find((t) => t.slug === slug) || {
//       href: fallbackHref,
//       title: "",
//       description: "",
//       slug,
//     };

//   const tPdfToWord = getTool("pdf-to-word", "/pdf-to-word");
//   const tWordToPdf = getTool("word-to-pdf", "/word-to-pdf");
//   const tImageToPdf = getTool("image-to-pdf", "/image-to-pdf");
//   const tMerge = getTool("merge-pdf", "/merge-pdf");
//   const tSplit = getTool("split-pdf", "/split-pdf");
//   const tCompress = getTool("compress-pdf", "/compress-pdf");
//   const tProtect = getTool("protect-pdf", "/protect-pdf");
//   const tUnlock = getTool("unlock-pdf", "/unlock-pdf");
//   const tExcel = getTool("excel-pdf", "/excel-pdf");
//   const tPpt = getTool("ppt-to-pdf", "/ppt-to-pdf");

//   const faqJsonLd = {
//     "@context": "https://schema.org",
//     "@type": "FAQPage",
//     mainEntity: [
//       {
//         "@type": "Question",
//         name: "What are free PDF tools?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text:
//             "Free PDF tools help you convert, merge, split, compress, protect, and unlock PDF files online without installing software.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "Are PDFLinx PDF tools completely free?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text:
//             "Yes. PDFLinx tools are free to use with no signup, no watermark, and no hidden charges.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "Can I use PDF tools on mobile and desktop?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text:
//             "Yes. PDFLinx works in your browser on Windows, macOS, Linux, Android, and iOS.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "Is it safe to use online PDF tools?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text:
//             "PDFLinx is designed to be privacy-friendly. Your files are processed to produce the output and are not meant to be stored permanently.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "Which PDF tools are most popular?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text:
//             "Popular tools include Word to PDF, PDF to Word, Compress PDF, Merge PDF, Split PDF, Protect PDF, and Unlock PDF.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "How do I merge or split a PDF online?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text:
//             "Upload your PDF, choose merge or split options, and download the result instantly. No account required.",
//         },
//       },
//     ],
//   };

//   return (
//     <>
//       {/* FAQ Schema - safe server-side */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
//         }}
//       />

//       <main className="max-w-6xl mx-auto px-4 py-12">
//         {/* HERO */}
//         <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 text-center">
//           Free Online PDF Tools
//         </h1>

//         <p className="text-gray-600 max-w-3xl mx-auto mb-10 text-center">
//           PDFLinx offers a complete collection of free online PDF tools to help you
//           convert, merge, compress, protect, and unlock PDF files instantly.
//           No signup required, no watermark, and works on all devices.
//         </p>

//         {/* SEO PILLAR CONTENT (HUB) */}
//         <section className="max-w-4xl mx-auto mb-12 text-slate-700">
//           <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
//             PDF Tools Online Free – Convert, Edit, Compress & Secure PDFs in One Place
//           </h2>

//           <p className="leading-7 mb-5">
//             PDFs are everywhere — resumes, invoices, assignments, contracts, and reports. But editing or sharing PDFs can
//             be annoying when a file is too large, password-protected, or needs a quick format change. That’s where{" "}
//             <span className="font-medium text-slate-900">PDFLinx Free PDF Tools</span> help.
//             Use our web-based toolkit to convert documents to PDF, convert PDFs back to editable formats, merge and split
//             pages, compress size for email, and add security for sensitive files — all in your browser.
//           </p>

//           <div className="grid sm:grid-cols-3 gap-4 mb-6">
//             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
//               <div className="flex items-center gap-2 mb-2">
//                 <Zap className="text-indigo-600" size={18} />
//                 <h3 className="font-semibold text-slate-900">Fast & Simple</h3>
//               </div>
//               <p className="text-sm text-slate-600 leading-6">
//                 Upload → choose action → download. No complicated steps.
//               </p>
//             </div>

//             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
//               <div className="flex items-center gap-2 mb-2">
//                 <ShieldCheck className="text-indigo-600" size={18} />
//                 <h3 className="font-semibold text-slate-900">Privacy-Friendly</h3>
//               </div>
//               <p className="text-sm text-slate-600 leading-6">
//                 Designed for safe processing — no signup required to use tools.
//               </p>
//             </div>

//             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
//               <div className="flex items-center gap-2 mb-2">
//                 <Globe className="text-indigo-600" size={18} />
//                 <h3 className="font-semibold text-slate-900">Works Everywhere</h3>
//               </div>
//               <p className="text-sm text-slate-600 leading-6">
//                 Use on Windows, macOS, Linux, Android, and iOS in your browser.
//               </p>
//             </div>
//           </div>

//           <h3 className="text-xl font-semibold text-slate-900 mb-3">
//             Popular PDF Tasks You Can Do Here
//           </h3>
//           <ul className="space-y-2 list-disc pl-6 mb-6">
//             <li>
//               Convert documents to PDF:{" "}
//               <Link href={tWordToPdf.href} className="text-indigo-600 font-medium hover:underline">
//                 Word to PDF
//               </Link>{" "}
//               /{" "}
//               <Link href={tExcel.href} className="text-indigo-600 font-medium hover:underline">
//                 Excel to PDF
//               </Link>{" "}
//               /{" "}
//               <Link href={tPpt.href} className="text-indigo-600 font-medium hover:underline">
//                 PPT to PDF
//               </Link>
//             </li>
//             <li>
//               Convert PDF to editable formats:{" "}
//               <Link href={tPdfToWord.href} className="text-indigo-600 font-medium hover:underline">
//                 PDF to Word
//               </Link>
//             </li>
//             <li>
//               Combine or extract pages:{" "}
//               <Link href={tMerge.href} className="text-indigo-600 font-medium hover:underline">
//                 Merge PDF
//               </Link>{" "}
//               /{" "}
//               <Link href={tSplit.href} className="text-indigo-600 font-medium hover:underline">
//                 Split PDF
//               </Link>
//             </li>
//             <li>
//               Reduce PDF size for email & sharing:{" "}
//               <Link href={tCompress.href} className="text-indigo-600 font-medium hover:underline">
//                 Compress PDF
//               </Link>
//             </li>
//             <li>
//               Secure sensitive documents:{" "}
//               <Link href={tProtect.href} className="text-indigo-600 font-medium hover:underline">
//                 Protect PDF
//               </Link>{" "}
//               /{" "}
//               <Link href={tUnlock.href} className="text-indigo-600 font-medium hover:underline">
//                 Unlock PDF
//               </Link>
//             </li>
//             <li>
//               Convert images into PDF:{" "}
//               <Link href={tImageToPdf.href} className="text-indigo-600 font-medium hover:underline">
//                 Image to PDF
//               </Link>
//             </li>
//           </ul>

//           <h3 className="text-xl font-semibold text-slate-900 mb-3">
//             Which PDF Tool Should You Use?
//           </h3>
//           <p className="leading-7 mb-2">
//             If your goal is sharing or printing, convert files to PDF. If you need editing, convert a PDF back to Word.
//             If your PDF is too large, compress it. If it contains multiple documents, merge them. If you only need certain
//             pages, split it. And if the file is sensitive, add password protection.
//           </p>
//           <p className="leading-7">
//             This hub page helps you find the right PDF tool quickly — choose a tool below and get started.
//           </p>
//         </section>

//         {/* TOP TOOLS */}
//         <section className="mb-14">
//           <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
//             Most Popular PDF Tools
//           </h2>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {[
//               { title: "Word to PDF", url: "/word-to-pdf", emoji: "📄" },
//               { title: "PDF to Word", url: "/pdf-to-word", emoji: "📝" },
//               { title: "Protect PDF", url: "/protect-pdf", emoji: "🔐" },
//               { title: "Compress PDF", url: "/compress-pdf", emoji: "🗜️" },
//             ].map((tool) => (
//               <Link
//                 key={tool.url}
//                 href={tool.url}
//                 className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition text-center"
//               >
//                 <div className="text-3xl mb-2">{tool.emoji}</div>
//                 <h3 className="font-semibold text-gray-800">{tool.title}</h3>
//               </Link>
//             ))}
//           </div>
//         </section>

//         {/* ALL TOOLS GRID */}
//         <section>
//           <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
//             All PDF Tools
//           </h2>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Object.values(pdfToolsMeta).map((tool) => {
//               const Icon = icons[tool.slug] || FileText;

//               return (
//                 <Link
//                   key={tool.slug}
//                   href={tool.href}
//                   className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all"
//                 >
//                   <div className="flex items-center gap-4 mb-3">
//                     <Icon size={28} className="text-indigo-600" />
//                     <h3 className="text-lg font-semibold group-hover:text-indigo-600">
//                       {tool.title.replace(" | PDF Linx", "")}
//                     </h3>
//                   </div>

//                   <p className="text-sm text-gray-600">{tool.description}</p>

//                   <span className="inline-block mt-4 text-sm font-medium text-indigo-600">
//                     Use tool →
//                   </span>
//                 </Link>
//               );
//             })}
//           </div>
//         </section>

//         {/* EXTRA SEO MINI-FAQ (VISIBLE) */}
//         <section className="max-w-4xl mx-auto mt-14">
//           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
//             Frequently Asked Questions
//           </h2>

//           <div className="space-y-4">
//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Do I need to install any software?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 No. All PDFLinx tools work online in your browser — just upload, process, and download.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Which tool should I use to reduce PDF size?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Use{" "}
//                 <Link href={tCompress.href} className="text-indigo-600 font-medium hover:underline">
//                   Compress PDF
//                 </Link>{" "}
//                 to reduce file size for email, WhatsApp, or faster uploads.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I convert Word, Excel, or PowerPoint to PDF?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — try{" "}
//                 <Link href={tWordToPdf.href} className="text-indigo-600 font-medium hover:underline">
//                   Word to PDF
//                 </Link>
//                 ,{" "}
//                 <Link href={tExcel.href} className="text-indigo-600 font-medium hover:underline">
//                   Excel to PDF
//                 </Link>{" "}
//                 and{" "}
//                 <Link href={tPpt.href} className="text-indigo-600 font-medium hover:underline">
//                   PPT to PDF
//                 </Link>
//                 .
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 How do I secure a PDF with a password?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Use{" "}
//                 <Link href={tProtect.href} className="text-indigo-600 font-medium hover:underline">
//                   Protect PDF
//                 </Link>{" "}
//                 to add password protection. If you own the file and need access, use{" "}
//                 <Link href={tUnlock.href} className="text-indigo-600 font-medium hover:underline">
//                   Unlock PDF
//                 </Link>
//                 .
//               </p>
//             </details>
//           </div>
//         </section>

//         {/* FOOTER NOTE */}
//         <p className="text-sm text-gray-500 text-center mt-12">
//           All tools work online without installation. Files are processed securely
//           and removed automatically for your privacy.
//         </p>
//       </main>
//     </>
//   );
// }

