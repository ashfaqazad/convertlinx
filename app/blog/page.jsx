import BlogClient from "./BlogClient";

export const metadata = {
  metadataBase: new URL("https://pdflinx.com"),
  alternates: { canonical: "https://pdflinx.com/blog" },
};

export default function BlogPage() {
  return <BlogClient />;
}
















// "use client";

// import Link from "next/link";

// export default function Blog() {


//   const blogs = [

//     {
//       title: "Convert PDF to Word Online Without Losing Formatting",
//       description:
//         "Locked PDFs driving you crazy? Here's how I turn any PDF into an editable Word file without ruining the layout, fonts, or images. I use this free tool every week — no software needed, no signup, just works.",
//       date: "Aug 24, 2025",
//       slug: "pdf-to-word",
//     },


//     {
//       title: "Convert Word to PDF Instantly (No Software Needed)",
//       description:
//         "Need to turn your Word doc into a clean, professional PDF that looks perfect everywhere? Here’s how I do it in seconds — no software, no watermarks, just a sharp PDF ready to send.",
//       date: "Aug 26, 2025",
//       slug: "word-to-pdf",
//     },



//     {
//       title: "Convert Images (JPG, PNG) to PDF in Seconds",
//       description:
//         "Combine multiple images into one clear, professional PDF document. Perfect for photos, scanned documents, receipts, or portfolios. Supports JPG, PNG, and more no signup, no watermark, just fast and secure image to PDF conversion.",
//       date: "Aug 28, 2025",
//       slug: "image-to-pdf",
//     },


//     {
//       title: "Merge Multiple PDF Files into One Online",
//       description:
//         "Got a bunch of separate PDFs you need to combine? Here’s how I quickly merge them into one clean file — perfect for reports, invoices, or study notes. Free, no limits, and keeps everything looking sharp.",
//       date: "Aug 30, 2025",
//       slug: "merge-pdf",
//     },

//     {
//       title: "Split PDF Files Online (Extract Specific Pages Easily)",
//       description:
//         "Got a big PDF and only need a few pages? Here’s how I quickly pull out exactly what I want — perfect for reports, contracts, or study notes. Free, no signup, and keeps the quality perfect.",
//       date: "Sep 1, 2025",
//       slug: "split-pdf",
//     },


//     {
//       title: "Compress PDF Files Without Losing Quality",
//       description:
//         "Got a massive PDF that won’t attach to emails or takes forever to upload? Here’s how I shrink them down super small while keeping everything looking sharp — free, fast, and no quality drop.",
//       date: "Sep 3, 2025",
//       slug: "compress-pdf",
//     },



//     {
//       title: "Convert Excel to PDF Without Losing Formatting",
//       description:
//         "Need to turn your Excel spreadsheet into a clean PDF that keeps all the tables, charts, and formatting perfect? Here’s how I do it in seconds — great for reports, budgets, or sharing data securely.",
//       date: "Sep 5, 2025",
//       slug: "excel-pdf",
//     },

//     {
//       title: "Generate QR Codes Instantly for Links, Text & Contacts",
//       description:
//         "Need a quick QR code for your website, Wi-Fi password, or contact info? Here’s how I make clean, custom ones in seconds — perfect for menus, business cards, or sharing links easily.",
//       date: "Dec 2, 2025",
//       slug: "qr-generator",
//     },

//     {
//       title: "Create Strong Passwords Instantly with Our Password Generator",
//       description:
//         "Tired of using the same weak passwords everywhere? Here’s how I create super-strong, random ones in seconds — perfect for new accounts, emails, or just tightening up your security.",
//       date: "Dec 3, 2025",
//       slug: "password-gen",
//     },


//     {
//       title: "Convert Units Easily with Our Free Online Unit Converter",
//       description:
//         "Need to switch between meters and feet, kg and pounds, or Celsius and Fahrenheit? Here’s the dead-simple unit converter I use all the time — instant, accurate, and completely free.",
//       date: "Dec 4, 2025",
//       slug: "unit-converter",
//     },


//     {
//       title: "Download HD YouTube Thumbnails Instantly in One Click",
//       description:
//         "Need a clean, high-quality thumbnail from a YouTube video? Here’s how I grab them in HD or even 4K in seconds — perfect for creators, editors, or just saving cool covers.",
//       date: "Dec 5, 2025",
//       slug: "youtube-thumbnail",
//     },


//     {
//       title: "Compress Images Online Without Losing Quality",
//       description:
//         "Got heavy photos slowing down your site or eating storage? Here’s how I shrink JPGs, PNGs, and WebPs down to tiny sizes while keeping them looking sharp — free and super fast.",
//       date: "Dec 6, 2025",
//       slug: "image-compressor",
//     },


//     {
//       title: "Convert Images to Text Using AI (Image to Text Extractor)",
//       description:
//         "Need to pull text out of a photo, screenshot, or scanned page? Here’s how I quickly turn images into editable text — perfect for notes, receipts, books, or anything with words in it.",
//       date: "Dec 7, 2025",
//       slug: "image-to-text",
//     },



//     {
//       title: "Draw & Download Signatures Online with Signature Maker",
//       description:
//         "Need a clean digital signature for documents? Here’s how I quickly draw or type one and download it as a transparent PNG — perfect for contracts, forms, or anything official.",
//       date: "Dec 8, 2025",
//       slug: "signature-maker",
//     },


//     {
//       title: "Convert HEIC to JPG Instantly Online",
//       description:
//         "Got iPhone photos in HEIC format that won’t open on Windows or Android? Here’s how I quickly turn them into regular JPGs — keeps quality perfect, no software needed.",
//       date: "Dec 9, 2025",
//       slug: "heic-to-jpg",
//     },

//     {
//       title: "Convert Text to PDF Instantly Online (Free & Secure)",
//       description:
//         "Got plain text or notes you need to turn into a proper PDF? Here’s how I quickly make clean, professional PDFs from any text — great for essays, letters, or just saving stuff neatly.",
//       date: "Dec 10, 2025",
//       slug: "text-to-pdf",
//     },
//     {
//       title: "Best Tools for Students to Study Smarter in 2025",
//       description:
//         "Hey, if you're a student right now, you know how crazy things can get — assignments piling up, group projects going wrong, exams sneaking up, and PDFs that just won't cooperate.\n\nI’ve been there (still am sometimes), and over the years I’ve tried pretty much every tool out there. Some were slow, some were full of ads, and some just didn’t do the job properly.",
//       date: "Dec 11, 2025",
//       slug: "best-tools-for-students",
//     },


//   ];

//   return (

//     <main className="max-w-6xl mx-auto py-12 px-6"> {/* max-w-7xl → 6xl, py-16 → 12 */}

//   <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent leading-tight">
//     PDF Tools Blog & Guides
//   </h1>

//   <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-base leading-relaxed">
//         Hey, welcome to the blog! Here I've written simple, no-nonsense guides for all the tools — how to merge PDFs, convert Word to PDF, pull text from images, and everything else.<br /><br />
//         Everything is <strong>free</strong>, no fluff, and I've tested it all myself in real life. Hope these help you save time and get stuff done easier.

//   </p>

//   {/* Compact Grid: Mobile 1 col, Tablet 2 col, Desktop 3 col */}
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* gap-8 → gap-6 */}
//     {blogs.map((blog, index) => (
//       <div
//         key={index}
//         className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
//       >
//         {/* Card Content - Compact Padding */}
//         <div className="p-5 flex flex-col flex-grow"> {/* p-6 → p-5 */}
//           <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 hover:text-red-700 transition">
//             {blog.title}
//           </h2>
//           <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-3 flex-grow">
//             {blog.description}
//           </p>
//           <p className="text-xs text-gray-500 mb-4">{blog.date}</p>
          
//           <div className="mt-auto">
//             <Link
//               href={`/blog/${blog.slug}`}
//               className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-sm"
//             >
//               Read More →
//             </Link>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// </main>

//   );
// }



























// // "use client";

// // import Link from "next/link";

// // export default function Blog() {
// //   const blogs = [
// //     {
// //       title: "Convert PDF to Word Online Without Losing Formatting",
// //       description:
// //         "Easily convert PDF to editable Word documents online. Keep your formatting, fonts, and layout perfectly preserved fast, free, and secure.",
// //       date: "Aug 24, 2025",
// //       slug: "pdf-to-word",
// //     },
// //     {
// //       title: "Convert Word to PDF Instantly (No Software Needed)",
// //       description:
// //         "Turn your Word (DOC or DOCX) files into professional, high-quality PDFs in seconds. 100% free and secure ideal for resumes and reports.",
// //       date: "Aug 26, 2025",
// //       slug: "word-to-pdf",
// //     },
// //     {
// //       title: "Convert Images (JPG, PNG) to PDF in Seconds",
// //       description:
// //         "Combine multiple images into a single PDF effortlessly. Works with JPG, PNG, and more no watermark, no signup required.",
// //       date: "Aug 28, 2025",
// //       slug: "image-to-pdf",
// //     },
// //     {
// //       title: "Merge Multiple PDF Files into One Online",
// //       description:
// //         "Combine multiple PDF documents into one organized file easily. Preserve layout, order, and quality with our simple merge tool.",
// //       date: "Aug 30, 2025",
// //       slug: "merge-pdf",
// //     },
// //     {
// //       title: "Split PDF Files Online (Extract Specific Pages Easily)",
// //       description:
// //         "Need only a few pages from a large PDF? Use our free PDF Splitter to extract, separate, or divide PDF files instantly.",
// //       date: "Sep 1, 2025",
// //       slug: "split-pdf",
// //     },
// //     {
// //       title: "Compress PDF Files Without Losing Quality",
// //       description:
// //         "Reduce PDF file size for faster sharing without sacrificing text or image clarity. Ideal for email attachments and uploads.",
// //       date: "Sep 3, 2025",
// //       slug: "compress-pdf",
// //     },
// //     {
// //       title: "Convert Excel to PDF Without Losing Formatting",
// //       description:
// //         "Convert Excel spreadsheets to PDF quickly and maintain your cell styles, charts, and formulas intact secure and free.",
// //       date: "Sep 5, 2025",
// //       slug: "excel-to-pdf",
// //     },
// //   ];

// //   return (
// //     <main className="max-w-6xl mx-auto py-12 px-6">
// //       <h1 className="text-4xl font-bold text-center mb-10">
// //         PDF Tools Blog & Guides
// //       </h1>

// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //         {blogs.map((blog, index) => (
// //           <div
// //             key={index}
// //             className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition"
// //           >
// //             <h2 className="text-2xl font-semibold mb-3">{blog.title}</h2>
// //             <p className="text-gray-600 mb-4">{blog.description}</p>
// //             <p className="text-sm text-gray-500 mb-4">{blog.date}</p>
// //             <Link
// //               href={`/blog/${blog.slug}`}
// //               className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
// //             >
// //               Read More
// //             </Link>
// //           </div>
// //         ))}
// //       </div>
// //     </main>
// //   );
// // }






















// // // "use client";

// // // import Link from "next/link";

// // // export default function Blog() {
// // //   // Dummy blog data
// // //   const blogs = [
// // //     {
// // //       title: "How to Convert PDF to Word Easily",
// // //       description:
// // //         "Learn step-by-step how to convert your PDF files to editable Word documents quickly and securely.",
// // //       date: "Aug 24, 2025",
// // //       slug: "pdf-to-word-guide",
// // //     },
// // //     {
// // //       title: "Merge Multiple PDFs into One File",
// // //       description:
// // //         "A simple tutorial on combining multiple PDF files into a single document using online tools.",
// // //       date: "Aug 20, 2025",
// // //       slug: "merge-pdf-guide",
// // //     },
// // //     {
// // //       title: "Compress PDFs Without Losing Quality",
// // //       description:
// // //         "Tips and tricks to reduce PDF size while maintaining original quality for easy sharing.",
// // //       date: "Aug 18, 2025",
// // //       slug: "compress-pdf-guide",
// // //     },
// // //     {
// // //       title: "Top 5 Free PDF Tools You Must Try",
// // //       description:
// // //         "Explore the best free online tools to manage your PDF files effectively in 2025.",
// // //       date: "Aug 15, 2025",
// // //       slug: "top-5-pdf-tools",
// // //     },
// // //   ];

// // //   return (
// // //     <main className="max-w-6xl mx-auto py-12 px-6">
// // //       <h1 className="text-4xl font-bold text-center mb-10">Our Blog</h1>

// // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// // //         {blogs.map((blog, index) => (
// // //           <div
// // //             key={index}
// // //             className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition"
// // //           >
// // //             <h2 className="text-2xl font-semibold mb-3">{blog.title}</h2>
// // //             <p className="text-gray-600 mb-4">{blog.description}</p>
// // //             <p className="text-sm text-gray-500 mb-4">{blog.date}</p>
// // //             <Link
// // //               href={`/blog/${blog.slug}`}
// // //               className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
// // //             >
// // //               Read More
// // //             </Link>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </main>
// // //   );
// // // }

