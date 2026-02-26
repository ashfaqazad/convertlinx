import HomeContent from "@/components/HomeContent"; // 👈 Client component import

// ✅ SEO Metadata (server-side) - Homepage

export const metadata = {
  metadataBase: new URL("https://pdflinx.com"),  // ✅ Perfect - non-www
  
  title: "PDF Linx - Free Online PDF Tools & Converters",
  description: "100% free online PDF tools: Convert, Merge, Split, Compress PDF, Word to PDF, QR Code Generator, Password Generator & more. No signup, no watermark.",
  keywords: "pdf tools, free pdf converter, merge pdf online, compress pdf, pdf editor free, online pdf tools",
  
  alternates: {
    canonical: "/",  // ✅ Relative - automatically https://pdflinx.com/ banega
  },
  
  openGraph: {
    title: "PDF Linx - Free Online PDF & Utility Tools",
    description: "Best free online tools for PDF conversion, merging, splitting, compression + many utility tools like QR code, password generator.",
    url: "/",
    siteName: "PDF Linx",
    images: [{
      url: "https://pdflinx.com/og-image.png",  // ✅ Full URL (better for sharing)
      width: 1200,
      height: 630,
      alt: "PDF Linx - Free PDF Tools"
    }],
    locale: "en_US",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "PDF Linx - Free PDF & Utility Tools",
    description: "Convert, merge, compress PDFs + many free online tools. No signup needed.",
    images: ["https://pdflinx.com/og-image.png"],  // ✅ Full URL + string array
  },
};

// ✅ Server component (no hooks)
export default function Home() {
  return <HomeContent />;
}






















// import HomeContent from "@/components/HomeContent"; // 👈 Client component import

// // ✅ SEO Metadata (server-side)

// export const metadata = {
//   metadataBase: new URL("https://pdflinx.com"),
//   title: "PDF Linx - Free Online PDF Tools & Converters",
//   description: "100% free online PDF tools: Convert, Merge, Split, Compress PDF, Word to PDF, QR Code Generator, Password Generator & more. No signup, no watermark.",
//   keywords: "pdf tools, free pdf converter, merge pdf online, compress pdf, pdf editor free, online pdf tools",
//   alternates: {
//     canonical: "/",
//   },
//   openGraph: {
//     title: "PDF Linx - Free Online PDF & Utility Tools",
//     description: "Best free online tools for PDF conversion, merging, splitting, compression + many utility tools like QR code, password generator.",
//     url: "/",
//     siteName: "PDF Linx",
//     images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Linx - Free PDF Tools" }],
//     locale: "en_US",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "PDF Linx - Free PDF & Utility Tools",
//     description: "Convert, merge, compress PDFs + many free online tools. No signup needed.",
//     images: ["/og-image.png"],
//   },
// };


// // ✅ Server component (no hooks)
// export default function Home() {
//   return <HomeContent />;
// }
