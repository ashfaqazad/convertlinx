// app/sitemap.js

export default function sitemap() {
  const baseUrl = "https://convertlinx.com";

  const staticRoutes = [
    { url: "/",               changeFrequency: "monthly", priority: 1.0, lastModified: new Date("2025-01-01") },
    { url: "/blog",           changeFrequency: "weekly",  priority: 0.9, lastModified: new Date("2026-03-18") },
    { url: "/about",          changeFrequency: "yearly",  priority: 0.5, lastModified: new Date("2025-01-01") },
    { url: "/contact",        changeFrequency: "yearly",  priority: 0.5, lastModified: new Date("2025-01-01") },
    { url: "/privacy-policy", changeFrequency: "yearly",  priority: 0.3, lastModified: new Date("2025-01-01") },
    { url: "/terms-of-service", changeFrequency: "yearly", priority: 0.3, lastModified: new Date("2025-01-01") },
  ];

  const toolRoutes = [
    // ── Image Tools ──
    { url: "/image-compressor",  lastModified: new Date("2026-03-18") },
    { url: "/image-resizer",     lastModified: new Date("2026-03-18") },
    { url: "/image-cropper",     lastModified: new Date("2026-03-18") },
    { url: "/image-converter",   lastModified: new Date("2026-03-18") },
    { url: "/image-to-text",     lastModified: new Date("2026-03-18") },
    { url: "/heic-to-jpg",       lastModified: new Date("2026-03-18") },

    // ── Writing Tools ──
    { url: "/word-counter",      lastModified: new Date("2026-03-18") },
    { url: "/case-converter",    lastModified: new Date("2026-03-18") },
    { url: "/lorem-ipsum",       lastModified: new Date("2026-03-18") },

    // ── Developer Tools ──
    { url: "/json-formatter",    lastModified: new Date("2026-03-18") },
    { url: "/base64-tool",            lastModified: new Date("2026-03-18") },

    // ── Design Tools ──
    { url: "/color-picker",      lastModified: new Date("2026-03-18") },

    // ── Other Utilities ──
    { url: "/qr-generator",      lastModified: new Date("2026-03-18") },
    { url: "/password-gen",      lastModified: new Date("2026-03-18") },
    { url: "/unit-converter",    lastModified: new Date("2026-03-18") },
    { url: "/youtube-thumbnail", lastModified: new Date("2026-03-18") },
    { url: "/signature-maker",   lastModified: new Date("2026-03-18") },
    { url: "/text-to-pdf",       lastModified: new Date("2026-03-18") },
  ].map(({ url, lastModified }) => ({
    url,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified,
  }));

  const blogRoutes = [
    // ── Image Tools Blogs ──
    { url: "/blog/image-compressor",  lastModified: new Date("2026-03-18") },
    { url: "/blog/image-resizer",     lastModified: new Date("2026-03-18") },
    { url: "/blog/image-cropper",     lastModified: new Date("2026-03-18") },
    { url: "/blog/image-converter",   lastModified: new Date("2026-03-18") },
    { url: "/blog/image-to-text",     lastModified: new Date("2026-03-18") },
    { url: "/blog/heic-to-jpg",       lastModified: new Date("2026-03-18") },

    // ── Writing Tools Blogs ──
    // { url: "/blog/word-counter",      lastModified: new Date("2026-03-18") },
    // { url: "/blog/case-converter",    lastModified: new Date("2026-03-18") },
    // { url: "/blog/lorem-ipsum",       lastModified: new Date("2026-03-18") },

    // ── Developer Tools Blogs ──
    // { url: "/blog/json-formatter",    lastModified: new Date("2026-03-18") },
    // { url: "/blog/base64",            lastModified: new Date("2026-03-18") },

    // ── Design Tools Blogs ──
    // { url: "/blog/color-picker",      lastModified: new Date("2026-03-18") },

    // ── Other Utilities Blogs ──
    { url: "/blog/qr-generator",      lastModified: new Date("2026-03-18") },
    { url: "/blog/password-gen",      lastModified: new Date("2026-03-18") },
    { url: "/blog/unit-converter",    lastModified: new Date("2026-03-18") },
    { url: "/blog/youtube-thumbnail", lastModified: new Date("2026-03-18") },
    { url: "/blog/signature-maker",   lastModified: new Date("2026-03-18") },
    { url: "/blog/text-to-pdf",       lastModified: new Date("2026-03-18") },
  ].map(({ url, lastModified }) => ({
    url,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified,
  }));

  const allRoutes = [...staticRoutes, ...toolRoutes, ...blogRoutes];

  return allRoutes.map(({ url, changeFrequency, priority, lastModified }) => ({
    url: `${baseUrl}${url}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}



















// // app/sitemap.js

// export default function sitemap() {
//   const baseUrl = "https://convertlinx.com";

//   const staticRoutes = [
//     { url: "/", changeFrequency: "monthly", priority: 1.0, lastModified: new Date("2025-01-01") },
//     { url: "/blog", changeFrequency: "weekly", priority: 0.9, lastModified: new Date("2026-03-18") },
//     { url: "/about", changeFrequency: "yearly", priority: 0.5, lastModified: new Date("2025-01-01") },
//     { url: "/contact", changeFrequency: "yearly", priority: 0.5, lastModified: new Date("2025-01-01") },
//     { url: "/privacy-policy", changeFrequency: "yearly", priority: 0.3, lastModified: new Date("2025-01-01") },
//     { url: "/terms-of-service", changeFrequency: "yearly", priority: 0.3, lastModified: new Date("2025-01-01") },
//   ];

//   const toolRoutes = [
//     { url: "/qr-generator", lastModified: new Date("2026-03-18") },
//     { url: "/password-gen", lastModified: new Date("2026-03-18") },
//     { url: "/unit-converter", lastModified: new Date("2026-03-18") },
//     { url: "/youtube-thumbnail", lastModified: new Date("2026-03-18") },
//     { url: "/image-compressor", lastModified: new Date("2026-03-18") },
//     { url: "/image-to-text", lastModified: new Date("2026-03-18") },
//     { url: "/signature-maker", lastModified: new Date("2026-03-18") },
//     { url: "/heic-to-jpg", lastModified: new Date("2026-03-18") },
//     { url: "/text-to-pdf", lastModified: new Date("2026-03-18") },
//     { url: "/image-converter", lastModified: new Date("2026-03-18") },
//     { url: "/image-resizer", lastModified: new Date("2026-03-18") },
//     { url: "/image-cropper", lastModified: new Date("2026-03-18") },
//   ].map(({ url, lastModified }) => ({
//     url,
//     changeFrequency: "monthly",
//     priority: 0.8,
//     lastModified,
//   }));

//   const blogRoutes = [
//     { url: "/blog/qr-generator", lastModified: new Date("2026-03-18") },
//     { url: "/blog/password-gen", lastModified: new Date("2026-03-18") },
//     { url: "/blog/unit-converter", lastModified: new Date("2026-03-18") },
//     { url: "/blog/youtube-thumbnail", lastModified: new Date("2026-03-18") },
//     { url: "/blog/image-compressor", lastModified: new Date("2026-03-18") },
//     { url: "/blog/image-to-text", lastModified: new Date("2026-03-18") },
//     { url: "/blog/signature-maker", lastModified: new Date("2026-03-18") },
//     { url: "/blog/heic-to-jpg", lastModified: new Date("2026-03-18") },
//     { url: "/blog/text-to-pdf", lastModified: new Date("2026-03-18") },
//     { url: "/blog/image-converter", lastModified: new Date("2026-03-18") },
//     { url: "/blog/image-resizer", lastModified: new Date("2026-03-18") },
//     { url: "/blog/image-cropper", lastModified: new Date("2026-03-18") },
//   ].map(({ url, lastModified }) => ({
//     url,
//     changeFrequency: "weekly",
//     priority: 0.7,
//     lastModified,
//   }));

//   const allRoutes = [...staticRoutes, ...toolRoutes, ...blogRoutes];

//   return allRoutes.map(({ url, changeFrequency, priority, lastModified }) => ({
//     url: `${baseUrl}${url}`,
//     lastModified,
//     changeFrequency,
//     priority,
//   }));
// }


































// // // app/sitemap.js

// // export default function sitemap() {
// //   const baseUrl = "https://convertlinx.com";

// //   const staticRoutes = [
// //     { url: "/", changeFrequency: "monthly", priority: 1.0, lastModified: new Date("2025-01-01") },
// //     { url: "/blog", changeFrequency: "weekly", priority: 0.9, lastModified: new Date("2025-06-01") },
// //     { url: "/about", changeFrequency: "yearly", priority: 0.5, lastModified: new Date("2025-01-01") },
// //     { url: "/contact", changeFrequency: "yearly", priority: 0.5, lastModified: new Date("2025-01-01") },
// //     { url: "/privacy-policy", changeFrequency: "yearly", priority: 0.3, lastModified: new Date("2025-01-01") },
// //     { url: "/terms-of-service", changeFrequency: "yearly", priority: 0.3, lastModified: new Date("2025-01-01") },
// //   ];

// //   const toolRoutes = [
// //     { url: "/tools/qr-generator", lastModified: new Date("2025-01-01") },
// //     { url: "/tools/password-gen", lastModified: new Date("2025-01-01") },
// //     { url: "/tools/unit-converter", lastModified: new Date("2025-01-01") },
// //     { url: "/tools/youtube-thumbnail", lastModified: new Date("2025-01-01") },
// //     { url: "/tools/image-compressor", lastModified: new Date("2025-01-01") },
// //     { url: "/tools/image-to-text", lastModified: new Date("2025-01-01") },
// //     { url: "/tools/signature-maker", lastModified: new Date("2025-01-01") },
// //     { url: "/tools/heic-to-jpg", lastModified: new Date("2025-01-01") },
// //     { url: "/tools/text-to-pdf", lastModified: new Date("2025-01-01") },
// //     { url: "/tools/image-converter", lastModified: new Date("2025-01-01") },
// //     { url: "/tools/image-resizer", lastModified: new Date("2025-02-01") },
// //     { url: "/tools/image-cropper", lastModified: new Date("2025-03-01") },
// //   ].map(({ url, lastModified }) => ({
// //     url,
// //     changeFrequency: "monthly",
// //     priority: 0.8,
// //     lastModified,
// //   }));

// //   const blogRoutes = [
// //     { url: "/blog/qr-generator", lastModified: new Date("2025-01-01") },
// //     { url: "/blog/password-gen", lastModified: new Date("2025-01-01") },
// //     { url: "/blog/unit-converter", lastModified: new Date("2025-01-01") },
// //     { url: "/blog/youtube-thumbnail", lastModified: new Date("2025-01-01") },
// //     { url: "/blog/image-compressor", lastModified: new Date("2025-01-01") },
// //     { url: "/blog/image-to-text", lastModified: new Date("2025-01-01") },
// //     { url: "/blog/signature-maker", lastModified: new Date("2025-01-01") },
// //     { url: "/blog/heic-to-jpg", lastModified: new Date("2025-01-01") },
// //     { url: "/blog/text-to-pdf", lastModified: new Date("2025-01-01") },
// //     { url: "/blog/image-converter", lastModified: new Date("2025-01-01") },
// //     { url: "/blog/image-resizer", lastModified: new Date("2025-02-01") },
// //     { url: "/blog/image-cropper", lastModified: new Date("2025-03-01") },
// //   ].map(({ url, lastModified }) => ({
// //     url,
// //     changeFrequency: "weekly",
// //     priority: 0.7,
// //     lastModified,
// //   }));

// //   const allRoutes = [...staticRoutes, ...toolRoutes, ...blogRoutes];

// //   return allRoutes.map(({ url, changeFrequency, priority, lastModified }) => ({
// //     url: `${baseUrl}${url}`,
// //     lastModified,
// //     changeFrequency,
// //     priority,
// //   }));
// // }




















// // // app/sitemap.js

// // export default function sitemap() {
// //   const baseUrl = "https://convertlinx.com";

// //   const staticRoutes = [
// //     { url: "/", changeFrequency: "monthly", priority: 1.0 },
// //     { url: "/blog", changeFrequency: "weekly", priority: 0.9 },
// //     { url: "/about", changeFrequency: "yearly", priority: 0.5 },
// //     { url: "/contact", changeFrequency: "yearly", priority: 0.5 },
// //     { url: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
// //     { url: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
// //   ];

// //   const toolRoutes = [
// //     "/tools/qr-generator",
// //     "/tools/password-gen",
// //     "/tools/unit-converter",
// //     "/tools/youtube-thumbnail",
// //     "/tools/image-compressor",
// //     "/tools/image-to-text",
// //     "/tools/signature-maker",
// //     "/tools/heic-to-jpg",
// //     "/tools/text-to-pdf",
// //     "/tools/image-converter",
// //     "/tools/image-resizer",
// //     "/tools/image-cropper",
// //   ].map((url) => ({ url, changeFrequency: "monthly", priority: 0.8 }));

// //   const blogRoutes = [
// //     "/blog/qr-generator",
// //     "/blog/password-gen",
// //     "/blog/unit-converter",
// //     "/blog/youtube-thumbnail",
// //     "/blog/image-compressor",
// //     "/blog/image-to-text",
// //     "/blog/signature-maker",
// //     "/blog/heic-to-jpg",
// //     "/blog/text-to-pdf",
// //     "/blog/image-converter",
// //     "/blog/image-resizer",
// //     "/blog/image-cropper",
// //   ].map((url) => ({ url, changeFrequency: "weekly", priority: 0.7 }));

// //   const allRoutes = [...staticRoutes, ...toolRoutes, ...blogRoutes];

// //   return allRoutes.map(({ url, changeFrequency, priority }) => ({
// //     url: `${baseUrl}${url}`,
// //     lastModified: new Date(),
// //     changeFrequency,
// //     priority,
// //   }));
// // }

