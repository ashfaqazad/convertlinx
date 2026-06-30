"use client";

import Link from "next/link";

export default function BlogClient() {

  const blogs = [
    {
      title: "How to Generate QR Codes Instantly — Free, No Signup, Fully Customizable",
      description:
        "Create QR codes for URLs, Wi-Fi passwords, business cards, and more in under 20 seconds. No watermarks, no signup — just a clean, downloadable PNG ready to use anywhere.",
      date: "Dec 2, 2025",
      slug: "how-to-generate-qr-code-online-free",
    },
    {
      title: "How to Create Strong Passwords Instantly — Free Password Generator",
      description:
        "Generate cryptographically random, highly secure passwords with custom length and character rules. Runs entirely in your browser — nothing is ever stored or sent to a server.",
      date: "Dec 3, 2025",
      slug: "how-to-create-strong-password-online",
    },
    {
      title: "Free Online Unit Converter — Convert Length, Weight, Temperature & More",
      description:
        "Convert meters to feet, kg to pounds, Celsius to Fahrenheit, liters to gallons, and dozens more unit types instantly. No formula lookup, no math — just type and get the answer.",
      date: "Dec 4, 2025",
      slug: "free-online-unit-converter-guide",
    },
    {
      title: "How to Download YouTube Thumbnails in HD — Free, One Click, No Signup",
      description:
        "Grab any YouTube video thumbnail in HD, Full HD, or maximum resolution in seconds. Perfect for creators, designers, developers, and anyone who wants the full-quality image.",
      date: "Dec 5, 2025",
      slug: "download-youtube-thumbnail-hd-free",
    },
    {
      title: "How to Compress Images Without Losing Quality — Free Online Image Compressor",
      description:
        "Reduce image file sizes by up to 80% with no visible quality loss. Supports JPG, PNG, and WebP — drag multiple files for batch compression. Perfect for websites and email.",
      date: "Dec 6, 2025",
      slug: "compress-images-without-losing-quality",
    },
    {
      title: "How to Extract Text from Images Online Free — AI-Powered OCR Tool",
      description:
        "Extract editable text from any photo, screenshot, or scanned document using AI OCR. Works on printed text, receipts, whiteboards, book pages, and more — no signup needed.",
      date: "Dec 7, 2025",
      slug: "extract-text-from-image-ocr-free",
    },
    {
      title: "Free Online Signature Maker — Create & Download Digital Signatures Instantly",
      description:
        "Draw your handwritten signature in the browser and download it as a transparent PNG. Works on mouse, trackpad, or finger — ready to overlay on any document or PDF.",
      date: "Dec 8, 2025",
      slug: "create-digital-signature-online-free",
    },
    {
      title: "How to Convert HEIC to JPG Free Online — iPhone Photos Made Compatible",
      description:
        "Convert Apple's HEIC photos to universally compatible JPEG instantly. No software to install, no quality loss, batch conversion supported — works on Windows, Android, and everywhere.",
      date: "Dec 9, 2025",
      slug: "convert-heic-to-jpg-free-online",
    },
    {
      title: "How to Convert Text to PDF Instantly — Free Online Text to PDF Converter",
      description:
        "Paste any plain text and download a clean, print-ready PDF in seconds. No Word, no Acrobat, no signup — perfect for notes, letters, essays, and archiving important text.",
      date: "Dec 10, 2025",
      slug: "convert-text-to-pdf-online-free",
    },
    {
      title: "Convert Images to Any Format Free — JPG, PNG, WebP, HEIC & More",
      description:
        "Convert between 20+ image formats — JPG, PNG, WebP, HEIC, GIF, BMP, TIFF, ICO and more. Batch conversion supported, no watermarks, no signup, instant download.",
      date: "Dec 11, 2025",
      slug: "convert-image-format-online-free",
    },
    {
      title: "How to Resize Images Online Free — Change Width, Height & Dimensions Instantly",
      description:
        "Resize any image to exact pixel dimensions, scale by percentage, or fit within max constraints. Includes a handy reference for social media image sizes across all major platforms.",
      date: "Dec 12, 2025",
      slug: "resize-image-online-free-tool",
    },
    {
      title: "How to Crop Images Online Free — Cut, Trim & Resize Photos Instantly",
      description:
        "Crop images with freeform selection, locked aspect ratios (1:1, 16:9, 4:5), or exact pixel coordinates. Perfect for social media sizing, profile photos, and composition adjustments.",
      date: "Dec 13, 2025",
      slug: "crop-image-online-free-tool",
    },
    {
      title: "Free Online Word Counter — Count Words, Characters, Sentences & Reading Time",
      description:
        "Get a live count of words, characters (with and without spaces), sentences, paragraphs, and estimated reading time as you type. Includes word count guidelines for SEO, social media, and essays.",
      date: "Dec 14, 2025",
      slug: "free-online-word-counter-tool",
    },
    {
      title: "Free Online Case Converter — Convert Text to UPPERCASE, lowercase, Title Case & More",
      description:
        "Convert text between uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, and kebab-case instantly. One click, one copy — that's it.",
      date: "Dec 15, 2025",
      slug: "text-case-converter-uppercase-lowercase",
    },
    {
      title: "Free Base64 Encoder & Decoder Online — Encode and Decode Text & Images",
      description:
        "Encode any text or image to Base64, or decode any Base64 string back to readable content. Runs entirely in your browser — nothing is sent to any server. Essential for developers.",
      date: "Dec 16, 2025",
      slug: "base64-encode-decode-online-free",
    },
    {
      title: "Free Online JSON Formatter & Validator — Beautify, Minify & Fix JSON",
      description:
        "Format messy JSON into readable, indented output — or minify it for production. Validates your JSON and catches common errors like trailing commas, single quotes, and missing brackets.",
      date: "Dec 17, 2025",
      slug: "json-formatter-validator-online-free",
    },
    {
      title: "Free Lorem Ipsum Generator — Generate Placeholder Text for Designs & Layouts",
      description:
        "Generate Lorem Ipsum placeholder text by paragraph, sentence, word count, or character count. The standard dummy text for wireframes, mockups, templates, and layout testing.",
      date: "Dec 18, 2025",
      slug: "lorem-ipsum-generator-free-placeholder-text",
    },
    {
      title: "Free Online Color Picker — Get HEX, RGB, HSL & Color Codes Instantly",
      description:
        "Pick any color visually and get its HEX, RGB, and HSL codes with one click. Includes a practical guide to color theory, accessibility contrast ratios, and building design system palettes.",
      date: "Dec 19, 2025",
      slug: "online-color-picker-hex-rgb-hsl",
    },
    {
      title: "How to Add a Watermark to Images Online Free — Text & Logo Watermarks",
      description:
        "Add text or transparent PNG logo watermarks to your photos online. Customize position, opacity, font, and size. Protect your work and brand every image before sharing.",
      date: "Dec 20, 2025",
      slug: "add-watermark-to-image-online-free",
    },
    {
      title: "How to Rotate and Flip Images Online Free — Fix Photo Orientation Instantly",
      description:
        "Rotate images 90°, 180°, 270° or flip horizontally and vertically in one click. Fix sideways phone photos, upside-down scans, and create mirror effects — no software needed.",
      date: "Dec 21, 2025",
      slug: "rotate-flip-image-online-free",
    },
    {
      title: "Free Meta Tag Generator — Create SEO & Open Graph Tags Instantly",
      description:
        "Generate complete HTML meta tags for SEO, Open Graph (Facebook/LinkedIn), and Twitter Cards. Fill in your page details and copy production-ready code straight into your site's head.",
      date: "Dec 22, 2025",
      slug: "free-meta-tag-generator-seo-tool",
    },
    {
      title: "Free Online Text to Speech — Convert Text to Audio Instantly",
      description:
        "Convert any text to natural-sounding audio in your browser. Choose voice, language, and speed — listen instantly or download as audio. Great for proofreading, accessibility, and voiceovers.",
      date: "Dec 23, 2025",
      slug: "free-text-to-speech-converter-online",
    },
    {
      title: "Free Text to URL Slug Converter — Create SEO-Friendly Slugs Instantly",
      description:
        "Convert any page title or text into a clean, lowercase, hyphenated URL slug. Removes special characters, accents, and stop words. One click and your slug is ready to paste.",
      date: "Dec 24, 2025",
      slug: "text-to-url-slug-converter-free",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent leading-tight">
        ConvertLinx Blog & Guides
      </h1>

      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-base leading-relaxed">
        Step-by-step guides for every tool on ConvertLinx — how to compress
        images, extract text from photos, convert HEIC files, generate QR
        codes, format JSON, and everything else.
        <br />
        <br />
        Everything is <strong>free</strong>, no fluff, written from real
        hands-on use. Save time and get things done faster.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
          >
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 hover:text-teal-600 transition">
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-3 flex-grow">
                {blog.description}
              </p>
              <p className="text-xs text-gray-500 mb-4">{blog.date}</p>

              <div className="mt-auto">
                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-block text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                  style={{ background: "linear-gradient(135deg, #0F766E, #14B8A6)" }}
                >
                  Read Guide →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}





























// "use client";

// import Link from "next/link";

// export default function BlogClient() {

//   const blogs = [
//     {
//       title: "Generate QR Codes Instantly for Links, Text & Contacts",
//       description:
//         "Need a quick QR code for your website, Wi-Fi password, or contact info? Here's how I make clean, custom ones in seconds — perfect for menus, business cards, or sharing links easily.",
//       date: "Dec 2, 2025",
//       slug: "qr-generator",
//     },
//     {
//       title: "Create Strong Passwords Instantly with Our Password Generator",
//       description:
//         "Tired of using the same weak passwords everywhere? Here's how I create super-strong, random ones in seconds — perfect for new accounts, emails, or just tightening up your security.",
//       date: "Dec 3, 2025",
//       slug: "password-gen",
//     },
//     {
//       title: "Convert Units Easily with Our Free Online Unit Converter",
//       description:
//         "Need to switch between meters and feet, kg and pounds, or Celsius and Fahrenheit? Here's the dead-simple unit converter I use all the time — instant, accurate, and completely free.",
//       date: "Dec 4, 2025",
//       slug: "unit-converter",
//     },
//     {
//       title: "Download HD YouTube Thumbnails Instantly in One Click",
//       description:
//         "Need a clean, high-quality thumbnail from a YouTube video? Here's how I grab them in HD or even 4K in seconds — perfect for creators, editors, or just saving cool covers.",
//       date: "Dec 5, 2025",
//       slug: "youtube-thumbnail",
//     },
//     {
//       title: "Compress Images Online Without Losing Quality",
//       description:
//         "Got heavy photos slowing down your site or eating storage? Here's how I shrink JPGs, PNGs, and WebPs down to tiny sizes while keeping them looking sharp — free and super fast.",
//       date: "Dec 6, 2025",
//       slug: "image-compressor",
//     },
//     {
//       title: "Convert Images to Text Using AI (Image to Text Extractor)",
//       description:
//         "Need to pull text out of a photo, screenshot, or scanned page? Here's how I quickly turn images into editable text — perfect for notes, receipts, books, or anything with words in it.",
//       date: "Dec 7, 2025",
//       slug: "image-to-text",
//     },
//     {
//       title: "Draw & Download Signatures Online with Signature Maker",
//       description:
//         "Need a clean digital signature for documents? Here's how I quickly draw or type one and download it as a transparent PNG — perfect for contracts, forms, or anything official.",
//       date: "Dec 8, 2025",
//       slug: "signature-maker",
//     },
//     {
//       title: "Convert HEIC to JPG Instantly Online",
//       description:
//         "Got iPhone photos in HEIC format that won't open on Windows or Android? Here's how I quickly turn them into regular JPGs — keeps quality perfect, no software needed.",
//       date: "Dec 9, 2025",
//       slug: "heic-to-jpg",
//     },
//     {
//       title: "Convert Text to PDF Instantly Online (Free & Secure)",
//       description:
//         "Got plain text or notes you need to turn into a proper PDF? Here's how I quickly make clean, professional PDFs from any text — great for essays, letters, or just saving stuff neatly.",
//       date: "Dec 10, 2025",
//       slug: "text-to-pdf",
//     },
//     {
//       title: "Convert Images to Any Format Online Free (JPG, PNG, WebP & More)",
//       description:
//         "Need to convert a JPG to PNG, WebP to JPEG, or HEIC to any format? Here's how I quickly switch between 20+ image formats in seconds — no software, no signup, perfect quality every time.",
//       date: "Dec 11, 2025",
//       slug: "image-converter",
//     },
//   ];

//   return (
//     <main className="max-w-6xl mx-auto py-12 px-6">
//       <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
//         ConvertLinx Blog & Guides
//       </h1>

//       <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-base leading-relaxed">
//         Welcome to the blog! Here I've written simple, no-nonsense guides for
//         all the tools — how to compress images, extract text from photos,
//         convert HEIC files, generate QR codes, and everything else.
//         <br />
//         <br />
//         Everything is <strong>free</strong>, no fluff, and I've tested it all
//         myself in real life. Hope these help you save time and get stuff done
//         easier.
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {blogs.map((blog, index) => (
//           <div
//             key={index}
//             className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
//           >
//             <div className="p-5 flex flex-col flex-grow">
//               <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 hover:text-indigo-600 transition">
//                 {blog.title}
//               </h2>
//               <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-3 flex-grow">
//                 {blog.description}
//               </p>
//               <p className="text-xs text-gray-500 mb-4">{blog.date}</p>

//               <div className="mt-auto">
//                 <Link
//                   href={`/blog/${blog.slug}`}
//                   className="inline-block text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
//                   style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
//                 >
//                   Read More →
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }

