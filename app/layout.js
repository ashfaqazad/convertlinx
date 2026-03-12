import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
// import HistatsTracker from "@/components/HistatsTracker";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0072FF",
};

export const metadata = {
  metadataBase: new URL("https://convertlinx.com"),

  title: {
    default: "ConvertLinx - Free Online Converter & Utility Tools",
    template: "%s | ConvertLinx",
  },

  description:
    "ConvertLinx is a free online toolkit with powerful utilities — QR code generator, password generator, unit converter, YouTube thumbnail downloader, image compressor, image to text (OCR), signature maker, HEIC to JPG, text to PDF, image converter, image resizer, and image cropper. All tools are fast, private, and free.",

  keywords: [
    "ConvertLinx",
    "convertlinx",
    "convertlinx.com",
    "free online tools",
    "online converter tools",
    "qr code generator",
    "free qr code maker",
    "password generator",
    "strong password generator",
    "unit converter",
    "length converter",
    "weight converter",
    "temperature converter",
    "youtube thumbnail downloader",
    "download youtube thumbnail",
    "image compressor",
    "compress image online",
    "image to text",
    "ocr online",
    "extract text from image",
    "signature maker",
    "online signature creator",
    "heic to jpg",
    "convert heic to jpeg",
    "text to pdf",
    "convert text to pdf online",
    "image converter",
    "convert image format",
    "image resizer",
    "resize image online",
    "image cropper",
    "crop image online",
    "free image tools",
    "online utility tools",
  ],

  authors: [{ name: "ConvertLinx", url: "https://convertlinx.com" }],
  creator: "ConvertLinx",
  publisher: "ConvertLinx",

  verification: {
    pinterest: "c1ab788f2cb7d222782d9d6ed6196669",
  },

  openGraph: {
    title: "ConvertLinx — Free Online Converter & Utility Tools",
    description:
      "QR codes, password generator, unit converter, image tools, OCR, signature maker, YouTube thumbnail downloader — all free & private.",
    url: "https://convertlinx.com/",
    siteName: "ConvertLinx",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ConvertLinx — Free Online Converter & Utility Tools",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ConvertLinx — Free Online Converter & Utility Tools",
    description:
      "QR codes, password generator, unit converter, image tools, OCR, signature maker, YouTube thumbnail downloader — all free & private.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    // ✅ SVG favicon — browser tab mein circular logo
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon-32x32.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ SVG Favicon — browser tab circular logo */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        {/* ✅ Pinterest domain verification */}
        <meta
          name="p:domain_verify"
          content="c1ab788f2cb7d222782d9d6ed6196669"
        />

        <meta name="ai-access" content="allow" />
      </head>

      <body className="flex min-h-screen flex-col bg-gray-50 font-sans">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />

        {/* ================= Google Analytics (GA4) =================
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-3PSZFQJYJ8"
        />
        <Script id="ga-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3PSZFQJYJ8');
          `}
        </Script> */}

        {/* ================= Schema (JSON-LD) ================= */}
        <Script
          id="org-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "ConvertLinx",
                url: "https://convertlinx.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://convertlinx.com/favicon.svg",
                  width: 512,
                  height: 512,
                },
                sameAs: [],
              },
              null,
              2
            ),
          }}
        />

        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "ConvertLinx",
                url: "https://convertlinx.com",
                description:
                  "Free online utility tools — QR code generator, password generator, unit converter, image tools, OCR, signature maker, and more.",
                publisher: { "@type": "Organization", name: "ConvertLinx" },
              },
              null,
              2
            ),
          }}
        />

        <Script
          id="webapp-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "ConvertLinx — Free Online Converter & Utility Tools",
                url: "https://convertlinx.com",
                applicationCategory: "UtilityApplication",
                operatingSystem: "All",
                browserRequirements: "Requires JavaScript and a modern browser",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                description:
                  "Free online tools including QR code generator, password generator, unit converter, YouTube thumbnail downloader, image compressor, image to text (OCR), signature maker, HEIC to JPG, text to PDF, image converter, image resizer, and image cropper.",
                featureList: [
                  "QR Code Generator",
                  "Password Generator",
                  "Unit Converter",
                  "YouTube Thumbnail Downloader",
                  "Image Compressor",
                  "Image to Text (OCR)",
                  "Signature Maker",
                  "HEIC to JPG Converter",
                  "Text to PDF",
                  "Image Converter",
                  "Image Resizer",
                  "Image Cropper",
                ],
                creator: { "@type": "Organization", name: "ConvertLinx" },
              },
              null,
              2
            ),
          }}
        />

        <Script
          id="breadcrumb-schema-home"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://convertlinx.com/",
                  },
                ],
              },
              null,
              2
            ),
          }}
        />

        {/* <HistatsTracker />

        <noscript style={{ display: "none" }}>
          <img
            src="//sstatic1.histats.com/0.gif?4996996&101"
            alt="Website visitor tracking pixel"
            width="0"
            height="0"
            aria-hidden="true"
          />
        </noscript> */}

      </body>
    </html>
  );
}


























// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import Script from "next/script";
// import HistatsTracker from "@/components/HistatsTracker";

// // ✅ NEXT.JS FIX: move these OUT of metadata
// export const viewport = {
//   width: "device-width",
//   initialScale: 1,
//   themeColor: "#4f46e5",
// };

// export const metadata = {
//   metadataBase: new URL("https://pdflinx.com"),

//   title: {
//     default: "PDF Linx - Free Online PDF Tools (Convert, Merge, Split, Compress)",
//     template: "%s | PDF Linx",
//   },

//   description:
//     "PDF Linx is a free online PDF toolkit to convert PDF to Word, merge, split, compress, and protect PDFs — plus handy utilities like QR codes, password generator, image compressor, unit converter, and more.",

//   keywords: [
//     "PDF Linx",
//     "pdflinx",
//     "free pdf tools",
//     "online pdf tools",
//     "pdf converter",
//     "pdf to word",
//     "word to pdf",
//     "merge pdf",
//     "split pdf",
//     "compress pdf",
//     "excel to pdf",
//     "powerpoint to pdf",
//     "jpg to pdf",
//     "pdf to jpg",
//     "protect pdf",
//     "unlock pdf",
//     "qr code generator",
//     "password generator",
//     "image compressor",
//     "image converter",
//     "unit converter",
//     "youtube thumbnail downloader",
//     "text to pdf",
//   ],

//   authors: [{ name: "PDF Linx", url: "https://pdflinx.com" }],
//   creator: "PDF Linx",
//   publisher: "PDF Linx",

//   // alternates: {
//   //   canonical: "https://pdflinx.com/",
//   //   languages: { "en-US": "https://pdflinx.com/" },
//   // },

//   verification: {
//     pinterest: "c1ab788f2cb7d222782d9d6ed6196669",
//   },

//   openGraph: {
//     title: "PDF Linx — Free Online PDF Tools",
//     description:
//       "Convert PDF to Word, merge, split, compress and protect PDFs — fast, private, and free.",
//     url: "https://pdflinx.com/",
//     siteName: "PDF Linx",
//     images: [
//       {
//         url: "/og-image.png",
//         width: 1200,
//         height: 630,
//         alt: "PDF Linx — Free Online PDF Tools",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },

//   twitter: {
//     card: "summary_large_image",
//     title: "PDF Linx — Free Online PDF Tools",
//     description:
//       "Convert PDF to Word, merge, split, compress and protect PDFs — fast, private, and free.",
//     images: ["/og-image.png"],
//   },

//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//       "max-video-preview": -1,
//     },
//   },

//   icons: {
//     icon: [
//       { url: "/favicon.ico" },
//       { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
//       { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
//     ],
//     apple: "/favicon-32x32.png",
//   },
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         {/* ✅ Pinterest domain verification */}
//         <meta
//           name="p:domain_verify"
//           content="c1ab788f2cb7d222782d9d6ed6196669"
//         />

//         {/* Optional */}
//         <meta name="ai-access" content="allow" />
//       </head>

//       <body className="flex min-h-screen flex-col bg-gray-50 font-sans">
//         <Navbar />
//         <main className="flex-grow">{children}</main>
//         <Footer />

//         {/* ================= Google Analytics (GA4) ================= */}
//         <Script
//           strategy="afterInteractive"
//           src="https://www.googletagmanager.com/gtag/js?id=G-3PSZFQJYJ8"
//         />
//         <Script id="ga-config" strategy="afterInteractive">
//           {`
//             window.dataLayer = window.dataLayer || [];
//             function gtag(){dataLayer.push(arguments);}
//             gtag('js', new Date());
//             gtag('config', 'G-3PSZFQJYJ8');
//           `}
//         </Script>

//         {/* ================= Schema (JSON-LD) ================= */}
//         <Script
//           id="org-schema"
//           type="application/ld+json"
//           strategy="beforeInteractive"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(
//               {
//                 "@context": "https://schema.org",
//                 "@type": "Organization",
//                 name: "PDF Linx",
//                 url: "https://pdflinx.com",
//                 logo: {
//                   "@type": "ImageObject",
//                   url: "https://pdflinx.com/logo.png",
//                   width: 512,
//                   height: 512,
//                 },
//                 sameAs: [],
//               },
//               null,
//               2
//             ),
//           }}
//         />

//         <Script
//           id="website-schema"
//           type="application/ld+json"
//           strategy="beforeInteractive"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(
//               {
//                 "@context": "https://schema.org",
//                 "@type": "WebSite",
//                 name: "PDF Linx",
//                 url: "https://pdflinx.com",
//                 description:
//                   "Free online PDF tools to convert, merge, split, compress, protect, and edit PDFs instantly.",
//                 publisher: { "@type": "Organization", name: "PDF Linx" },
//               },
//               null,
//               2
//             ),
//           }}
//         />

//         <Script
//           id="webapp-schema"
//           type="application/ld+json"
//           strategy="beforeInteractive"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(
//               {
//                 "@context": "https://schema.org",
//                 "@type": "WebApplication",
//                 name: "PDF Linx — Free PDF & Utility Tools",
//                 url: "https://pdflinx.com",
//                 applicationCategory: "UtilityApplication",
//                 operatingSystem: "All",
//                 browserRequirements: "Requires JavaScript and a modern browser",
//                 offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
//                 description:
//                   "Free online tools to convert, merge, split, compress, and protect PDFs — plus useful utilities.",
//                 featureList: [
//                   "Merge PDF",
//                   "Split PDF",
//                   "Compress PDF",
//                   "Protect PDF",
//                   "Unlock PDF",
//                   "PDF to Word",
//                   "Word to PDF",
//                   "Excel to PDF",
//                   "PowerPoint to PDF",
//                   "JPG to PDF",
//                   "PDF to JPG",
//                   "Password Generator",
//                   "QR Code Generator",
//                   "Image Compressor",
//                   "Image Converter",
//                   "YouTube Thumbnail Downloader",
//                   "Unit Converter",
//                   "Text to PDF",
//                 ],
//                 creator: { "@type": "Organization", name: "PDF Linx" },
//               },
//               null,
//               2
//             ),
//           }}
//         />

//         <Script
//           id="breadcrumb-schema-home"
//           type="application/ld+json"
//           strategy="beforeInteractive"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(
//               {
//                 "@context": "https://schema.org",
//                 "@type": "BreadcrumbList",
//                 itemListElement: [
//                   {
//                     "@type": "ListItem",
//                     position: 1,
//                     name: "Home",
//                     item: "https://pdflinx.com/",
//                   },
//                 ],
//               },
//               null,
//               2
//             ),
//           }}
//         />

//         <HistatsTracker />

//         <noscript style={{ display: "none" }}>
//           <img
//             src="//sstatic1.histats.com/0.gif?4996996&101"
//             alt="Website visitor tracking pixel"
//             width="0"
//             height="0"
//             aria-hidden="true"
//           />
//         </noscript>
//       </body>
//     </html>
//   );
// }


























// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import Script from "next/script";
// import HistatsTracker from "@/components/HistatsTracker";

// export const metadata = {
//   title: {
//     default:
//       "PDF Linx - Free Online PDF & Utility Tools | Merge, Convert & Compress",
//     template: "%s | PDF Linx",
//   },

//   description:
//     "PDF Linx (pdflinx.com) - Free online tools to convert, merge, split, and compress PDF files easily. Also includes Password Generator, QR Code Generator, Image Compressor, Unit Converter, YouTube Thumbnail Downloader, and Text to PDF tools.",

//   keywords: [
//     "PDF Linx",
//     "pdflinx",
//     "PDF converter",
//     "merge PDF",
//     "split PDF",
//     "compress PDF",
//     "Word to PDF",
//     "PDF to Word",
//     "PorwerPoint to PDF",
//     "Excel PDF",
//     "JPG to PDF",
//     "PDF to JPG",
//     "online PDF tools",
//     "Password Generator",
//     "QR Code Generator",
//     "Image Compressor",
//     "Image Converter",
//     "Unit Converter",
//     "YouTube Thumbnail Downloader",
//     "Free Online Tools",
//   ],

//   authors: [{ name: "PDF Linx", url: "https://pdflinx.com" }],
//   creator: "PDF Linx",
//   publisher: "PDF Linx",
//   metadataBase: new URL("https://pdflinx.com"),

//   // Optional: Keep it (no harm). Manual meta tag below is the real fix.
//   verification: {
//     pinterest: "c1ab788f2cb7d222782d9d6ed6196669",
//   },

//   openGraph: {
//     title: "PDF Linx - Free Online PDF & Utility Tools",
//     description:
//       "Convert, merge, and compress PDFs online — plus many utility tools on PDF Linx.",
//     url: "https://pdflinx.com/",
//     siteName: "PDF Linx",
//     images: [
//       {
//         url: "https://pdflinx.com/og-image.png",
//         width: 1200,
//         height: 630,
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },

//   twitter: {
//     card: "summary_large_image",
//     title: "PDF Linx - Free Online PDF & Utility Tools",
//     description: "Best free online PDF converter & utility tools",
//     images: ["https://pdflinx.com/og-image.png"],
//   },

//   robots: {
//     index: true,
//     follow: true,
//   },

//   icons: {
//     icon: [
//       { url: "/favicon.ico" },
//       { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
//       { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
//     ],
//     apple: "/favicon-32x32.png",
//   },
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         {/* ✅ Pinterest domain verification (GUARANTEED) */}
//         <meta
//           name="p:domain_verify"
//           content="c1ab788f2cb7d222782d9d6ed6196669"
//         />

//         {/* Existing meta tags */}
//         <meta name="robots" content="index, follow" />
//         <meta name="ai-access" content="allow" />
//       </head>

//       <body className="flex flex-col min-h-screen bg-gray-50 font-sans">
//         <Navbar />
//         <main className="flex-grow">{children}</main>
//         <Footer />

//         {/* ================= Google Analytics (GA4) ================= */}
//         <Script
//           strategy="afterInteractive"
//           src="https://www.googletagmanager.com/gtag/js?id=G-3PSZFQJYJ8"
//         />
//         <Script id="ga-config" strategy="afterInteractive">
//           {`
//             window.dataLayer = window.dataLayer || [];
//             function gtag(){dataLayer.push(arguments);}
//             gtag('js', new Date());
//             gtag('config', 'G-3PSZFQJYJ8');
//           `}
//         </Script>

//         {/* ================= Site-Wide Schemas ================= */}
//         <Script
//           id="org-schema"
//           type="application/ld+json"
//           strategy="afterInteractive"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(
//               {
//                 "@context": "https://schema.org",
//                 "@type": "Organization",
//                 name: "PDF Linx",
//                 url: "https://pdflinx.com",
//                 logo: {
//                   "@type": "ImageObject",
//                   url: "https://pdflinx.com/logo.png",
//                   width: 512,
//                   height: 512,
//                 },
//                 sameAs: [],
//               },
//               null,
//               2
//             ),
//           }}
//         />

//         <Script
//           id="website-schema"
//           type="application/ld+json"
//           strategy="afterInteractive"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(
//               {
//                 "@context": "https://schema.org",
//                 "@type": "WebSite",
//                 name: "PDF Linx",
//                 url: "https://pdflinx.com",
//                 description:
//                   "Free online PDF tools to merge, convert, compress, and edit PDF files instantly.",
//                 publisher: { "@type": "Organization", name: "PDF Linx" },
//               },
//               null,
//               2
//             ),
//           }}
//         />

//         <Script
//           id="webapp-schema"
//           type="application/ld+json"
//           strategy="afterInteractive"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(
//               {
//                 "@context": "https://schema.org",
//                 "@type": "WebApplication",
//                 name: "PDF Linx - Free PDF & Utility Tools",
//                 url: "https://pdflinx.com",
//                 applicationCategory: "UtilityApplication",
//                 operatingSystem: "All",
//                 browserRequirements: "Requires JavaScript and a modern browser",
//                 offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
//                 description:
//                   "100% free online PDF converter, merger, splitter, compressor + many utility tools.",
//                 featureList: [
//                   "Merge PDF",
//                   "Split PDF",
//                   "Compress PDF",
//                   "Word to PDF",
//                   "PDF to Word",
//                   "Excel to PDF",
//                   "PowerPoint to PDF",
//                   "JPG to PDF",
//                   "PDF to JPG",
//                   "Password Generator",
//                   "QR Code Generator",
//                   "Image Compressor",
//                   "Image Converter",
//                   "YouTube Thumbnail Downloader",
//                   "Unit Converter",
//                   "Text to PDF",
//                 ],
//                 creator: { "@type": "Organization", name: "PDF Linx" },
//               },
//               null,
//               2
//             ),
//           }}
//         />

//         <Script
//           id="breadcrumb-schema-home"
//           type="application/ld+json"
//           strategy="afterInteractive"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(
//               {
//                 "@context": "https://schema.org",
//                 "@type": "BreadcrumbList",
//                 itemListElement: [
//                   {
//                     "@type": "ListItem",
//                     position: 1,
//                     name: "Home",
//                     item: "https://pdflinx.com",
//                   },
//                 ],
//               },
//               null,
//               2
//             ),
//           }}
//         />

//         <HistatsTracker />

//         <noscript style={{ display: "none" }}>
//           <img
//             src="//sstatic1.histats.com/0.gif?4996996&101"
//             alt="Website visitor tracking pixel"
//             width="0"
//             height="0"
//             aria-hidden="true"
//           />
//         </noscript>
//       </body>
//     </html>
//   );
// }




























// // import "./globals.css";
// // import Navbar from "@/components/Navbar";
// // import Footer from "@/components/Footer";
// // import Script from "next/script";
// // import HistatsTracker from '@/components/HistatsTracker';


// // export const metadata = {
// //   title: {
// //     default: "PDF Linx - Free Online PDF & Utility Tools | Merge, Convert & Compress",
// //     template: "%s | PDF Linx",
// //   },

// //   description:
// //     "PDF Linx (pdflinx.com) - Free online tools to convert, merge, split, and compress PDF files easily. Also includes Password Generator, QR Code Generator, Image Compressor, Unit Converter, YouTube Thumbnail Downloader, and Text to PDF tools.",

// //   keywords: [
// //     "PDF Linx",
// //     "pdflinx",
// //     "PDF converter",
// //     "merge PDF",
// //     "split PDF",
// //     "compress PDF",
// //     "Word to PDF",
// //     "PDF to Word",
// //     "PorwerPoint to PDF",
// //     "Excel PDF",
// //     "JPG to PDF",
// //     "PDF to JPG",
// //     "online PDF tools",
// //     "Password Generator",
// //     "QR Code Generator",
// //     "Image Compressor",
// //     "Image Converter",
// //     "Unit Converter",
// //     "YouTube Thumbnail Downloader",
// //     "Free Online Tools",
// //   ],

// //   authors: [{ name: "PDF Linx", url: "https://pdflinx.com" }],
// //   creator: "PDF Linx",
// //   publisher: "PDF Linx",
// //   metadataBase: new URL("https://pdflinx.com"),

// //   // ✅ Pinterest Domain Verification
// //   verification: {
// //     pinterest: "c1ab788f2cb7d222782d9d6ed6196669",
// //   },

// //   openGraph: {
// //     title: "PDF Linx - Free Online PDF & Utility Tools",
// //     description:
// //       "Convert, merge, and compress PDFs online — plus many utility tools on PDF Linx.",
// //     url: "https://pdflinx.com/",
// //     siteName: "PDF Linx",
// //     images: [
// //       {
// //         url: "https://pdflinx.com/og-image.png",
// //         width: 1200,
// //         height: 630,
// //       },
// //     ],
// //     locale: "en_US",
// //     type: "website",
// //   },

// //   twitter: {
// //     card: "summary_large_image",
// //     title: "PDF Linx - Free Online PDF & Utility Tools",
// //     description: "Best free online PDF converter & utility tools",
// //     images: ["https://pdflinx.com/og-image.png"],
// //   },

// //   robots: {
// //     index: true,
// //     follow: true,
// //   },

// //   icons: {
// //     icon: [
// //       { url: "/favicon.ico" },
// //       { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
// //       { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
// //     ],
// //     apple: "/favicon-32x32.png",
// //   },
// // };



// // export default function RootLayout({ children }) {
// //   return (
// //     <html lang="en">
// //       <head>
// //         {/* Crawlers – Yeh auto handle hoga metadata se, but extra for safety */}
// //         <meta name="robots" content="index, follow" />
// //         <meta name="ai-access" content="allow" />
// //       </head>
// //       <body className="flex flex-col min-h-screen bg-gray-50 font-sans">
// //         <Navbar />
// //         <main className="flex-grow">{children}</main>
// //         <Footer />

// //         {/* ================= Google Analytics (GA4) ================= */}
// //         <Script
// //           strategy="afterInteractive"
// //           src="https://www.googletagmanager.com/gtag/js?id=G-3PSZFQJYJ8"
// //         />
// //         <Script id="ga-config" strategy="afterInteractive">
// //           {`
// //             window.dataLayer = window.dataLayer || [];
// //             function gtag(){dataLayer.push(arguments);}
// //             gtag('js', new Date());
// //             gtag('config', 'G-3PSZFQJYJ8');
// //           `}
// //         </Script>

// //         {/* ================= Site-Wide Schemas ================= */}
// //         {/* Organization Schema */}
// //         <Script
// //           id="org-schema"
// //           type="application/ld+json"
// //           strategy="afterInteractive"
// //           dangerouslySetInnerHTML={{
// //             __html: JSON.stringify({
// //               "@context": "https://schema.org",
// //               "@type": "Organization",
// //               name: "PDF Linx",
// //               url: "https://pdflinx.com",  // ✅ Without www
// //               logo: {
// //                 "@type": "ImageObject",
// //                 url: "https://pdflinx.com/logo.png",  // ✅ Without www
// //                 width: 512,
// //                 height: 512,
// //               },
// //               sameAs: [],
// //             }, null, 2),
// //           }}
// //         />

// //         {/* WebSite Schema */}
// //         <Script
// //           id="website-schema"
// //           type="application/ld+json"
// //           strategy="afterInteractive"
// //           dangerouslySetInnerHTML={{
// //             __html: JSON.stringify({
// //               "@context": "https://schema.org",
// //               "@type": "WebSite",
// //               name: "PDF Linx",
// //               url: "https://pdflinx.com",  // ✅ Without www
// //               description: "Free online PDF tools to merge, convert, compress, and edit PDF files instantly.",
// //               publisher: { "@type": "Organization", name: "PDF Linx" },
// //             }, null, 2),
// //           }}
// //         />

// //         {/* WebApplication Schema */}
// //         <Script
// //           id="webapp-schema"
// //           type="application/ld+json"
// //           strategy="afterInteractive"
// //           dangerouslySetInnerHTML={{
// //             __html: JSON.stringify({
// //               "@context": "https://schema.org",
// //               "@type": "WebApplication",
// //               name: "PDF Linx - Free PDF & Utility Tools",
// //               url: "https://pdflinx.com",  // ✅ Without www
// //               applicationCategory: "UtilityApplication",
// //               operatingSystem: "All",
// //               browserRequirements: "Requires JavaScript and a modern browser",
// //               offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
// //               description: "100% free online PDF converter, merger, splitter, compressor + many utility tools.",
// //               featureList: [
// //                 "Merge PDF", "Split PDF", "Compress PDF",
// //                 "Word to PDF", "PDF to Word", "Image to PDF",
// //                 "Password Generator", "QR Code Generator",
// //                 "Image Compressor", "YouTube Thumbnail Downloader",
// //                 "Unit Converter", "Text to PDF"
// //               ],
// //               creator: { "@type": "Organization", name: "PDF Linx" },
// //             }, null, 2),
// //           }}
// //         />

// //         {/* Breadcrumb Schema (Homepage) */}
// //         <Script
// //           id="breadcrumb-schema-home"
// //           type="application/ld+json"
// //           strategy="afterInteractive"
// //           dangerouslySetInnerHTML={{
// //             __html: JSON.stringify({
// //               "@context": "https://schema.org",
// //               "@type": "BreadcrumbList",
// //               itemListElement: [
// //                 {
// //                   "@type": "ListItem",
// //                   position: 1,
// //                   name: "Home",
// //                   item: "https://pdflinx.com",  // ✅ Without www
// //                 },
// //               ],
// //             }, null, 2),
// //           }}
// //         />

// //         <HistatsTracker />

// //         {/* Optional noscript fallback */}
// //         {/* <noscript style={{ display: 'none' }}>
// //           <img src="//sstatic1.histats.com/0.gif?4996996&101" alt="" width="0" height="0" />
// //         </noscript> */}
// //         <noscript style={{ display: 'none' }}>
// //           <img
// //             src="//sstatic1.histats.com/0.gif?4996996&101"
// //             alt="Website visitor tracking pixel"
// //             width="0"
// //             height="0"
// //             aria-hidden="true"
// //           />
// //         </noscript>
// //       </body>
// //     </html>
// //   );
// // }


