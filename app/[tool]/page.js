import { notFound } from "next/navigation";
import { seoData } from "@/lib/seoData";

const SITE_URL = "https://pdflinx.com";

// 🔹 Lazy import map (BASE tools only)
const componentMap = {
  "pdf-to-word": () => import("@/components/tools/PdfToWord"),
  "word-to-pdf": () => import("@/components/tools/WordToPdf"),
  "image-to-pdf": () => import("@/components/tools/ImageToPdf"),

  "excel-pdf": () => import("@/components/tools/ExcelToPdf"),
  "qr-generator": () => import("@/components/tools/QrGenerator"),
  "password-gen": () => import("@/components/tools/PasswordGen"),
  "unit-converter": () => import("@/components/tools/UnitConverter"),
  "youtube-thumbnail": () => import("@/components/tools/YoutubeThumbnail"),
  "image-compressor": () => import("@/components/tools/ImageCompressor"),
  "image-to-text": () => import("@/components/tools/ImageToText"),
  "signature-maker": () => import("@/components/tools/SignatureMaker"),
  "heic-to-jpg": () => import("@/components/tools/HeicToJpg"),
  "text-to-pdf": () => import("@/components/tools/TextToPdf"),
  "image-converter": () => import("@/components/tools/ImageConverter"),
  "pdf-to-jpg": () => import("@/components/tools/PdfToJpg"),
  "add-watermark": () => import("@/components/tools/AddWatermark"),
  "ppt-to-pdf": () => import("@/components/tools/PptToPdf"),
  "protect-pdf": () => import("@/components/tools/ProtectPdf"),
  "unlock-pdf": () => import("@/components/tools/UnlockPdf"),
  "rotate-pdf": () => import("@/components/tools/RotatePdf"),
  "sign-pdf": () => import("@/components/tools/SignPdf"),
  "ocr-pdf": () => import("@/components/tools/OCRPdf"),
  "edit-pdf": () => import("@/components/tools/EditPdf"),
  // "pdf-to-excel": () => import("@/components/tools/PdfToExcel"),

};

// 🔹 Resolve base tool (for variants)
function resolveBaseTool(slug) {
  const meta = seoData[slug];
  if (!meta) return null;
  return meta.baseTool || slug;
}

// ✅ Keep your no-trailing-slash URLs ("/merge-pdf" style)
function normalizePath(path = "/") {
  if (!path.startsWith("/")) path = "/" + path;
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}

function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return SITE_URL;
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return SITE_URL + normalizePath(pathOrUrl);
}

// 🔹 Metadata (SEO) ✅ FIXED
export async function generateMetadata({ params }) {
  const { tool } = params;
  const pageData = seoData[tool];
  if (!pageData) notFound();

  const canonicalAbs = absoluteUrl(pageData.canonical);

  const og = pageData.openGraph || {};
  const ogUrlAbs = absoluteUrl(og.url || pageData.canonical);

  const ogImages = (og.images || []).map((img) => ({
    ...img,
    url: absoluteUrl(img.url),
  }));

  return {
    metadataBase: new URL(SITE_URL),

    title: pageData.title,
    description: pageData.description,

    // ✅ Next.js likes array (don’t join)
    keywords: pageData.keywords,

    // ✅ Canonical must be absolute
    alternates: {
      canonical: canonicalAbs,
    },

    openGraph: {
      ...og,
      url: ogUrlAbs,
      images: ogImages,
    },

    twitter: {
      card: "summary_large_image",
      title: og.title || pageData.title,
      description: og.description || pageData.description,
      images: ogImages.map((img) => img.url),
    },
  };
}

// 🔹 Dynamic Page Loader (BASE + VARIANTS)
export default async function ToolPage({ params }) {
  const { tool } = params;

  const pageData = seoData[tool];
  if (!pageData) notFound();

  const baseTool = resolveBaseTool(tool);
  if (!baseTool || !componentMap[baseTool]) notFound();

  const Component = (await componentMap[baseTool]()).default;

  // ✅ seo prop pass (variants + base dono ke liye)
  return <Component seo={pageData} />;
}




























// import { notFound } from "next/navigation";
// import { seoData } from "@/lib/seoData";

// // 🔹 Lazy import map (BASE tools only)
// const componentMap = {
//   "pdf-to-word": () => import("@/components/tools/PdfToWord"),
//   "word-to-pdf": () => import("@/components/tools/WordToPdf"),
//   "image-to-pdf": () => import("@/components/tools/ImageToPdf"),

//   "excel-pdf": () => import("@/components/tools/ExcelToPdf"),
//   "qr-generator": () => import("@/components/tools/QrGenerator"),
//   "password-gen": () => import("@/components/tools/PasswordGen"),
//   "unit-converter": () => import("@/components/tools/UnitConverter"),
//   "youtube-thumbnail": () => import("@/components/tools/YoutubeThumbnail"),
//   "image-compressor": () => import("@/components/tools/ImageCompressor"),
//   "image-to-text": () => import("@/components/tools/ImageToText"),
//   "signature-maker": () => import("@/components/tools/SignatureMaker"),
//   "heic-to-jpg": () => import("@/components/tools/HeicToJpg"),
//   "text-to-pdf": () => import("@/components/tools/TextToPdf"),
//   "image-converter": () => import("@/components/tools/ImageConverter"),
//   "pdf-to-jpg": () => import("@/components/tools/PdfToJpg"),
//   "add-watermark": () => import("@/components/tools/AddWatermark"),
//   "ppt-to-pdf": () => import("@/components/tools/PptToPdf"),
//   "protect-pdf": () => import("@/components/tools/ProtectPdf"),
//   "unlock-pdf": () => import("@/components/tools/UnlockPdf"),
// };

// // 🔹 Resolve base tool (for variants)
// function resolveBaseTool(slug) {
//   const meta = seoData[slug];
//   if (!meta) return null;
//   return meta.baseTool || slug;
// }

// // 🔹 Metadata (SEO)
// export async function generateMetadata({ params }) {
//   const { tool } = params;
//   const pageData = seoData[tool];
//   if (!pageData) notFound();

//   return {
//     metadataBase: new URL("https://pdflinx.com"),

//     title: pageData.title,
//     description: pageData.description,
//     keywords: pageData.keywords.join(", "),

//     alternates: {
//       canonical: pageData.canonical,
//     },

//     openGraph: {
//       ...pageData.openGraph,
//       images: pageData.openGraph.images.map((img) => ({
//         ...img,
//         url: img.url.startsWith("http")
//           ? img.url
//           : "https://pdflinx.com" + img.url,
//       })),
//     },

//     twitter: {
//       card: "summary_large_image",
//       title: pageData.openGraph.title,
//       description: pageData.openGraph.description,
//       images: pageData.openGraph.images.map((img) =>
//         img.url.startsWith("http")
//           ? img.url
//           : "https://pdflinx.com" + img.url
//       ),
//     },
//   };
// }

// // 🔹 Dynamic Page Loader (BASE + VARIANTS)
// export default async function ToolPage({ params }) {
//   const { tool } = params;

//   const pageData = seoData[tool];
//   if (!pageData) notFound();

//   const baseTool = resolveBaseTool(tool);
//   if (!baseTool || !componentMap[baseTool]) notFound();

//   const Component = (await componentMap[baseTool]()).default;

//   // ✅ seo prop pass (variants + base dono ke liye)
//   return <Component seo={pageData} />;
// }























// // import { notFound } from "next/navigation";
// // import { seoData } from "@/lib/seoData";

// // // 🔹 Lazy import map (same as before – perfect)
// // const componentMap = {
// //   "pdf-to-word": () => import("@/components/tools/PdfToWord"),
// //   "word-to-pdf": () => import("@/components/tools/WordToPdf"),
// //   "image-to-pdf": () => import("@/components/tools/ImageToPdf"),
// //   // "merge-pdf": () => import("@/components/tools/MergePdf"),
// //   // "split-pdf": () => import("@/components/tools/SplitPdf"),
// //   // "compress-pdf": () => import("@/components/tools/CompressPdf"),
// //   "excel-pdf": () => import("@/components/tools/ExcelToPdf"),
// //   "qr-generator": () => import("@/components/tools/QrGenerator"),
// //   "password-gen": () => import("@/components/tools/PasswordGen"),
// //   "unit-converter": () => import("@/components/tools/UnitConverter"),
// //   "youtube-thumbnail": () => import("@/components/tools/YoutubeThumbnail"),
// //   "image-compressor": () => import("@/components/tools/ImageCompressor"),
// //   "image-to-text": () => import("@/components/tools/ImageToText"),
// //   "signature-maker": () => import("@/components/tools/SignatureMaker"),
// //   "heic-to-jpg": () => import("@/components/tools/HeicToJpg"),
// //   "text-to-pdf": () => import("@/components/tools/TextToPdf"),
// //   "image-converter": () => import("@/components/tools/ImageConverter"),
// //   "pdf-to-jpg": () => import("@/components/tools/PdfToJpg"),
// //   "add-watermark": () => import("@/components/tools/AddWatermark"),
// //   "ppt-to-pdf": () => import("@/components/tools/PptToPdf"),
// //   "protect-pdf": () => import("@/components/tools/ProtectPdf"),
// //   "unlock-pdf": () => import("@/components/tools/UnlockPdf"),

// // };


// // // "rotate-pdf": () => import("@/components/tools/RotatePdf"),
// //   // "pdf-to-jpg": () => import("@/components/tools/PdfToJpg"),
// //   // "pdf-to-excel": () => import("@/components/tools/PdfToExcel"),

// // export async function generateMetadata({ params }) {
// //   const { tool } = params;
// //   const pageData = seoData[tool];
// //   if (!pageData) notFound();

// //   return {
// //     // ✅ Fix 1: non-www base URL
// //     metadataBase: new URL("https://pdflinx.com"),
    
// //     title: pageData.title,
// //     description: pageData.description,
// //     keywords: pageData.keywords.join(", "),
    
// //     alternates: {
// //       canonical: pageData.canonical,  // Relative "/pdf-to-word" → automatically https://pdflinx.com/pdf-to-word banega
// //     },
    
// //     openGraph: {
// //       ...pageData.openGraph,
// //       // ✅ Fix 2: Ensure images have full non-www URL (safety)
// //       images: pageData.openGraph.images.map(img => ({
// //         ...img,
// //         url: img.url.startsWith("http") ? img.url : "https://pdflinx.com" + img.url,
// //       })),
// //     },
    
// //     twitter: {
// //       card: "summary_large_image",
// //       title: pageData.openGraph.title,
// //       description: pageData.openGraph.description,
// //       // ✅ Fix 3: Twitter expects array of strings or objects with url
// //       images: pageData.openGraph.images.map(img => 
// //         img.url.startsWith("http") ? img.url : "https://pdflinx.com" + img.url
// //       ),
// //     },
// //   };
// // }

// // // 🔹 Dynamic Page Loader (unchanged – perfect)
// // export default async function ToolPage({ params }) {
// //   const { tool } = params;
// //   const ComponentImport = componentMap[tool];
// //   if (!ComponentImport) notFound();

// //   const Component = (await ComponentImport()).default;
// //   return <Component />;
// // }



















// // // import { notFound } from "next/navigation";
// // // import { seoData } from "@/lib/seoData";

// // // // 🔹 Lazy import map
// // // const componentMap = {
// // //   "pdf-to-word": () => import("@/components/tools/PdfToWord"),
// // //   "word-to-pdf": () => import("@/components/tools/WordToPdf"),
// // //   "image-to-pdf": () => import("@/components/tools/ImageToPdf"),
// // //   "merge-pdf": () => import("@/components/tools/MergePdf"),
// // //   "split-pdf": () => import("@/components/tools/SplitPdf"),
// // //   "compress-pdf": () => import("@/components/tools/CompressPdf"),
// // //   "excel-pdf": () => import("@/components/tools/ExcelToPdf"),
// // //   "qr-generator": () => import("@/components/tools/QrGenerator"),
// // //   "password-gen": () => import("@/components/tools/PasswordGen"),
// // //   "unit-converter": () => import("@/components/tools/UnitConverter"),
// // //   "youtube-thumbnail": () => import("@/components/tools/YoutubeThumbnail"),
// // //   "image-compressor": () => import("@/components/tools/ImageCompressor"),
// // //   "image-to-text": () => import("@/components/tools/ImageToText"),
// // //   "signature-maker": () => import("@/components/tools/SignatureMaker"),
// // //   "heic-to-jpg": () => import("@/components/tools/HeicToJpg"),
// // //   "text-to-pdf": () => import("@/components/tools/TextToPdf"),
// // //   "image-converter": () => import("@/components/tools/ImageConverter"),
// // //   "rotate-pdf": () => import("@/components/tools/RotatePdf"),
// // //   "pdf-to-jpg": () => import("@/components/tools/PdfToJpg"),
// // //   "add-watermark": () => import("@/components/tools/AddWatermark"),
// // //   "protect-pdf": () => import("@/components/tools/ProtectPdf"),
// // // };


// // // export async function generateMetadata({ params }) {
// // //   const { tool } = params;
// // //   const pageData = seoData[tool];
// // //   if (!pageData) notFound();

// // //   return {
// // //     // metadataBase: new URL("https://pdflinx.com"),
// // //     metadataBase: new URL("https://pdflinx.com"),
// // //     title: pageData.title,
// // //     description: pageData.description,
// // //     keywords: pageData.keywords.join(", "),
// // //     alternates: {
// // //       canonical: pageData.canonical,
// // //     },
// // //     openGraph: pageData.openGraph,
// // //     twitter: {
// // //       card: "summary_large_image",
// // //       title: pageData.openGraph.title,
// // //       description: pageData.openGraph.description,
// // //       images: pageData.openGraph.images,  // Ye already array of objects hai seoData mein → perfect
// // //     },
// // //   };
// // // }

// // // // 🔹 Dynamic Page Loader
// // // export default async function ToolPage({ params }) {
// // //   const { tool } = params;
// // //   const ComponentImport = componentMap[tool];
// // //   if (!ComponentImport) notFound();

// // //   const Component = (await ComponentImport()).default;
// // //   return <Component />;
// // // }

