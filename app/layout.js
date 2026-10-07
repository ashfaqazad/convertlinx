import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import HistatsTracker from "@/components/HistatsTracker";

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
    "ConvertLinx is a free online toolkit with powerful utilities — QR code generator, password generator, unit converter, YouTube thumbnail downloader, image compressor, image to text (OCR), signature converter to convert paper signature to digital, HEIC to JPG, text to PDF, image converter, image resizer, and image cropper. All tools are fast, private, and free.",

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
    "signature converter",
    "convert signature on paper to digital",
    "convert signature to digital",
    "convert to signature",
    "convert image to digital signature online free",
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

      {/* ✅ SaaSHub verification */}
      <meta
        name="saashub-verification"
        content="3x0zxjnb57d4"
      />

      <meta name="ai-access" content="allow" />
    </head>


      <body className="flex min-h-screen flex-col bg-gray-50 font-sans">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />

        {/* ================= Google Analytics GA4 - convertlinx.com ================= */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-03HBVKEYBK"
        />
        <Script id="ga-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-03HBVKEYBK');
          `}
        </Script>

        
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
      </body>
    </html>
  );
}
