// app/pdf-to-word-multiple-files/page.jsx
import Link from "next/link";
import PdfToWord from "@/components/tools/PdfToWord";
import RelatedToolsSection from "@/components/RelatedTools";
import { seoData } from "@/lib/seoData";

export async function generateMetadata() {
  const data = seoData["pdf-to-word-multiple-files"];

  if (!data) {
    return {
      title: "Bulk PDF to Word Converter (Multiple Files) | PDF Linx",
      description:
        "Convert multiple PDFs to Word (DOCX) in one go. Bulk conversion with ZIP download, no signup, no watermark.",
      alternates: { canonical: "/pdf-to-word-multiple-files" },
    };
  }

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    alternates: { canonical: data.canonical },
    openGraph: {
      title: data.openGraph?.title || data.title,
      description: data.openGraph?.description || data.description,
      url: data.openGraph?.url || data.canonical,
      siteName: data.openGraph?.siteName || "PDF Linx",
      images: data.openGraph?.images || [],
      locale: data.openGraph?.locale || "en_US",
      type: data.openGraph?.type || "website",
    },
  };
}

// ✅ FAQ Schema (unique to bulk intent)
function BulkFaqSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I convert multiple PDF files to Word at the same time?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. This page supports bulk conversion: upload multiple PDFs, convert them together, and download the results in one go.",
        },
      },
      {
        "@type": "Question",
        name: "How do I download all converted Word files?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "After bulk conversion, you can download all DOCX results together (often as a ZIP) to save time instead of downloading each file separately.",
        },
      },
      {
        "@type": "Question",
        name: "Will formatting stay the same in bulk conversion?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Text-based PDFs usually convert cleanly. Highly designed layouts (columns, complex tables, heavy graphics) may need minor touch-ups in Word.",
        },
      },
      {
        "@type": "Question",
        name: "What if my PDFs are scanned images?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Scanned PDFs require OCR to become editable text. Run OCR first, then convert the OCR output to Word for best results.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function PdfToWordMultipleFilesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <BulkFaqSchema />

      {/* ✅ Hero — bulk-focused */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Bulk PDF to Word Converter (Multiple Files)
        </h1>

        <p className="mt-2 text-base text-muted-foreground">
          Convert multiple PDF files to editable Word (DOCX) in one go. Perfect
          for resumes, invoices, assignments, or any batch of PDFs — no signup,
          no watermark.
        </p>

        {/* Internal links (cluster) */}
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link className="underline" href="/pdf-to-word">
            Convert a single PDF →
          </Link>
          <Link className="underline" href="/ocr-pdf">
            Scanned PDFs? Run OCR first →
          </Link>
          <Link className="underline" href="/compress-pdf">
            PDFs too large? Compress first →
          </Link>
        </div>
      </section>

      {/* ✅ Tool UI */}
      <section className="rounded-2xl border p-4 md:p-6">
        {/* If your component supports "mode", keep it; otherwise remove mode prop */}
        <PdfToWord mode="multiple" />
      </section>

      {/* ✅ Bulk workflow explainer (unique content) */}
      <section className="mt-10 rounded-2xl border p-5">
        <h2 className="text-xl font-semibold">How bulk PDF to Word works</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
          <div className="rounded-xl border p-4">
            <p className="font-medium text-foreground">1) Upload a batch</p>
            <p className="mt-1">
              Select multiple PDFs at once (resumes, contracts, notes, etc.).
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="font-medium text-foreground">2) Convert together</p>
            <p className="mt-1">
              The tool processes each PDF and generates editable DOCX output.
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="font-medium text-foreground">3) Download all files</p>
            <p className="mt-1">
              Download results in one go (often as a ZIP) to save time.
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Bulk conversion is built for speed: you don’t have to repeat the same
          steps for every file. It’s the fastest way to convert a folder of PDFs
          into Word documents.
        </p>
      </section>

      {/* ✅ Single vs Bulk comparison (unique) */}
      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <h2 className="text-xl font-semibold">Bulk conversion is best for</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Converting 5–10 resumes quickly (HR / hiring)</li>
            <li>Processing invoices or reports in batches</li>
            <li>Students converting multiple assignments</li>
            <li>Teams converting PDF forms for editing</li>
          </ul>
        </div>

        <div className="rounded-2xl border p-5">
          <h2 className="text-xl font-semibold">Single file conversion is best for</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>One-off edits (a single PDF document)</li>
            <li>Testing formatting before a full batch</li>
            <li>Complex layout PDFs you want to check carefully</li>
          </ul>

          <div className="mt-4">
            <Link className="underline text-sm" href="/pdf-to-word">
              Go to single PDF to Word →
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ Tips for bulk output quality (unique) */}
      <section className="mt-10 rounded-2xl border p-5">
        <h2 className="text-xl font-semibold">Tips for best bulk results</h2>
        <div className="mt-3 grid gap-6 md:grid-cols-2 text-sm text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground">
              Keep PDFs text-based (for clean DOCX)
            </h3>
            <p className="mt-1">
              Bulk conversion works best when PDFs contain selectable text. If
              your PDFs are scans (image-only), run OCR first.
            </p>
            <div className="mt-2">
              <Link className="underline" href="/ocr-pdf">
                Open OCR tool →
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-foreground">
              Expect minor edits for complex layouts
            </h3>
            <p className="mt-1">
              Columns, dense tables, or heavy graphics can shift during
              conversion. This is normal — a quick formatting touch-up in Word
              usually fixes it.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-foreground">
              Reduce file size before uploading big batches
            </h3>
            <p className="mt-1">
              If you’re converting many large PDFs, compressing them first can
              speed up processing and downloads.
            </p>
            <div className="mt-2">
              <Link className="underline" href="/compress-pdf">
                Compress PDFs →
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-foreground">
              Batch workflow: organize → convert → download
            </h3>
            <p className="mt-1">
              Keep related PDFs together (e.g., “Resumes”, “Invoices”, “Forms”).
              Convert each batch separately so your ZIP downloads are organized.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Bulk-focused FAQs (unique, not same as main page) */}
      <section className="mt-10 rounded-2xl border p-5">
        <h2 className="text-xl font-semibold">Bulk conversion FAQs</h2>

        <div className="mt-4 space-y-5 text-sm text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground">
              Can I upload multiple PDFs at once?
            </h3>
            <p className="mt-1">
              Yes — this page is specifically built for converting multiple PDF
              files together.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-foreground">
              How do I download all DOCX files together?
            </h3>
            <p className="mt-1">
              After conversion, you can download all converted DOCX files in one
              go (often as a ZIP) so you don’t need to download each file
              separately.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-foreground">
              What if some PDFs are scanned?
            </h3>
            <p className="mt-1">
              Scanned PDFs need OCR. For best results: run OCR first, then
              convert the OCR output to Word.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-foreground">
              Will the formatting be identical?
            </h3>
            <p className="mt-1">
              Text-based PDFs usually convert cleanly. Complex designs may need
              small formatting fixes in Word (especially tables/columns).
            </p>
          </div>
        </div>
      </section>

      {/* Related tools */}
      <div className="mt-10">
        <RelatedToolsSection currentTool="pdf-to-word" />
      </div>
    </main>
  );
}

















// // app/pdf-to-word-multiple-files/page.jsx
// import Link from "next/link";
// import PdfToWord from "@/components/tools/PdfToWord";
// import RelatedToolsSection from "@/components/RelatedTools"; // agar tum use kar rahe ho
// import { seoData } from "@/lib/seoData";

// // ✅ Metadata (Title/Description/Canonical/OpenGraph etc.)
// export async function generateMetadata() {
//   const data = seoData["pdf-to-word-multiple-files"];

//   // fallback safety
//   if (!data) {
//     return {
//       title: "PDF to Word Multiple Files | PDF Linx",
//       description:
//         "Convert multiple PDF files to editable Word documents in one go — fast, private, and free.",
//       alternates: { canonical: "/pdf-to-word-multiple-files" },
//     };
//   }

//   // Tumhara existing SEO system agar already build hai, to bas yahi return kar do:
//   return {
//     title: data.title,
//     description: data.description,
//     keywords: data.keywords,
//     alternates: { canonical: data.canonical },
//     openGraph: {
//       title: data.openGraph?.title || data.title,
//       description: data.openGraph?.description || data.description,
//       url: data.openGraph?.url || data.canonical,
//       siteName: data.openGraph?.siteName || "PDF Linx",
//       images: data.openGraph?.images || [],
//       locale: data.openGraph?.locale || "en_US",
//       type: data.openGraph?.type || "website",
//     },
//   };
// }

// export default function PdfToWordMultipleFilesPage() {
//   return (
//     <main className="mx-auto max-w-6xl px-4 py-8">
//       {/* Hero */}
//       <section className="mb-6">
//         <h1 className="text-3xl font-bold tracking-tight">
//           PDF to Word – Convert Multiple Files
//         </h1>
//         <p className="mt-2 text-base text-muted-foreground">
//           Upload multiple PDFs and convert them to editable Word documents in one
//           go. Your files stay on your device (privacy-first).
//         </p>

//         {/* Internal links (cluster) */}
//         <div className="mt-4 flex flex-wrap gap-3 text-sm">
//           <Link className="underline" href="/pdf-to-word">
//             Convert single PDF instead →
//           </Link>
//           <Link className="underline" href="/ocr-pdf">
//             Scanned PDF? Use OCR →
//           </Link>
//         </div>
//       </section>

//       {/* Tool UI (same component reuse) */}
//       <section className="rounded-2xl border p-4 md:p-6">
//         <PdfToWord mode="multiple" />
//         {/* 
//           ✅ IMPORTANT:
//           Agar tumhara PdfToWord component "mode" prop support nahi karta,
//           to simply <PdfToWord /> rehne do.
//           Page ka unique intent content neeche cover ho jayega.
//         */}
//       </section>

//       {/* Unique intent blocks (SEO differentiation) */}
//       <section className="mt-10 grid gap-8 md:grid-cols-2">
//         <div className="rounded-2xl border p-5">
//           <h2 className="text-xl font-semibold">When to use bulk conversion</h2>
//           <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
//             <li>You have many PDFs and want Word versions quickly.</li>
//             <li>You’re converting invoices, notes, or assignments in batches.</li>
//             <li>You want to avoid repeating the same steps for each file.</li>
//           </ul>
//         </div>

//         <div className="rounded-2xl border p-5">
//           <h2 className="text-xl font-semibold">Tips for best output</h2>
//           <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
//             <li>For scanned PDFs, run OCR first for editable text.</li>
//             <li>Complex layouts may need quick formatting touch-ups.</li>
//             <li>Keep PDFs text-based for the cleanest conversion.</li>
//           </ul>
//         </div>
//       </section>

//       {/* FAQ (Unique) */}
//       <section className="mt-10 rounded-2xl border p-5">
//         <h2 className="text-xl font-semibold">FAQs</h2>

//         <div className="mt-4 space-y-5 text-sm text-muted-foreground">
//           <div>
//             <h3 className="font-medium text-foreground">
//               Can I upload multiple PDFs at once?
//             </h3>
//             <p className="mt-1">
//               Yes — this page is designed for batch conversion. Upload multiple
//               files and convert them together.
//             </p>
//           </div>

//           <div>
//             <h3 className="font-medium text-foreground">
//               Will the formatting stay the same?
//             </h3>
//             <p className="mt-1">
//               Most text-based PDFs convert cleanly. Highly designed layouts may
//               need minor adjustments in Word.
//             </p>
//           </div>

//           <div>
//             <h3 className="font-medium text-foreground">
//               What if my PDF is scanned?
//             </h3>
//             <p className="mt-1">
//               Scanned PDFs need OCR to become editable text. Use the OCR tool,
//               then convert to Word.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Related tools (optional) */}
//       <div className="mt-10">
//         <RelatedToolsSection currentTool="pdf-to-word" />
//       </div>
//     </main>
//   );
// }

