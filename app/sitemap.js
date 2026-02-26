// app/sitemap.js

export default function sitemap() {
  const baseUrl = "https://pdflinx.com";

  const staticRoutes = [
    { url: "/", changeFrequency: "monthly", priority: 1.0 },
    { url: "/blog", changeFrequency: "weekly", priority: 0.9 },
    { url: "/free-pdf-tools", changeFrequency: "monthly", priority: 0.9 },
    { url: "/about", changeFrequency: "yearly", priority: 0.5 },
    { url: "/contact", changeFrequency: "yearly", priority: 0.5 },
    { url: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { url: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.3 },
    // 🔹 Comparison Pages
    { url: "/compare/pdflinx-vs-ilovepdf", changeFrequency: "monthly", priority: 0.8 },
    { url: "/compare/pdflinx-vs-smallpdf", changeFrequency: "monthly", priority: 0.8 },

  ];

  const toolRoutes = [
    "/pdf-to-word",
    "/pdf-to-word-for-students",
    "/word-to-pdf",
    "/image-to-pdf",
    "/compress-pdf",
    "/merge-pdf",
    "/split-pdf",
    "/excel-pdf",
    "/pdf-to-jpg",
    "/ppt-to-pdf",
    "/protect-pdf",
    "/unlock-pdf",
    "/rotate-pdf",
    "/sign-pdf",
    "/ocr-pdf",
    "/edit-pdf",
    "/qr-generator",
    "/password-gen",
    "/unit-converter",
    "/youtube-thumbnail",
    "/image-compressor",
    "/image-to-text",
    "/image-converter",
    "/heic-to-jpg",
    "/signature-maker",
    "/text-to-pdf",
    "/add-watermark",
  ].map((url) => ({ url, changeFrequency: "monthly", priority: 0.8 }));

  const blogRoutes = [
    "/blog/pdf-to-word",
    "/blog/word-to-pdf",
    "/blog/image-to-pdf",
    "/blog/merge-pdf",
    "/blog/split-pdf",
    "/blog/compress-pdf",
    "/blog/excel-pdf",
    "/blog/qr-generator",
    "/blog/password-gen",
    "/blog/unit-converter",
    "/blog/youtube-thumbnail",
    "/blog/image-compressor",
    "/blog/signature-maker",
    "/blog/heic-to-jpg",
    "/blog/image-to-text",
    "/blog/pdf-to-word-formatting-messed-up",
    "/blog/how-to-edit-scanned-pdf-in-word",
    "/blog/convert-pdf-resume-to-editable-word",
  ].map((url) => ({ url, changeFrequency: "weekly", priority: 0.7 }));

  const allRoutes = [...staticRoutes, ...toolRoutes, ...blogRoutes];

  return allRoutes.map(({ url, changeFrequency, priority }) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}























// // app/sitemap.js

// export default function sitemap() {
//   const baseUrl = "https://pdflinx.com";

//   const routes = [
//     "",

//     "/blog",
//     "/about",
//     "/contact",
//     "/free-pdf-tools",

//     "/pdf-to-word",
//     "/pdf-to-word-for-students",
//     "/word-to-pdf",
//     "/image-to-pdf",
//     "/compress-pdf",
//     "/merge-pdf",
//     "/split-pdf",
//     "/excel-pdf",
//     "/pdf-to-jpg",
//     "/ppt-to-pdf",
//     "/protect-pdf",
//     "/unlock-pdf",
//     "/rotate-pdf",
//     "/sign-pdf",
//     "/ocr-pdf",
//     "/edit-pdf",

//     "/qr-generator",
//     "/password-gen",
//     "/unit-converter",
//     "/youtube-thumbnail",
//     "/image-compressor",
//     "/image-to-text",
//     "/image-converter",
//     "/heic-to-jpg",
//     "/signature-maker",
//     "/text-to-pdf",
//     "/add-watermark",

//     "/privacy-policy",
//     "/terms-and-conditions",
//   ];

//   return routes.map((route) => ({
//     url: `${baseUrl}${route}`,
//     lastModified: new Date(),
//   }));
// }