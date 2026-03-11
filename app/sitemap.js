// app/sitemap.js

export default function sitemap() {
  const baseUrl = "https://convertlinx.com";

  const staticRoutes = [
    { url: "/", changeFrequency: "monthly", priority: 1.0, lastModified: new Date("2025-01-01") },
    { url: "/blog", changeFrequency: "weekly", priority: 0.9, lastModified: new Date("2025-06-01") },
    { url: "/about", changeFrequency: "yearly", priority: 0.5, lastModified: new Date("2025-01-01") },
    { url: "/contact", changeFrequency: "yearly", priority: 0.5, lastModified: new Date("2025-01-01") },
    { url: "/privacy-policy", changeFrequency: "yearly", priority: 0.3, lastModified: new Date("2025-01-01") },
    { url: "/terms-of-service", changeFrequency: "yearly", priority: 0.3, lastModified: new Date("2025-01-01") },
  ];

  const toolRoutes = [
    { url: "/tools/qr-generator", lastModified: new Date("2025-01-01") },
    { url: "/tools/password-gen", lastModified: new Date("2025-01-01") },
    { url: "/tools/unit-converter", lastModified: new Date("2025-01-01") },
    { url: "/tools/youtube-thumbnail", lastModified: new Date("2025-01-01") },
    { url: "/tools/image-compressor", lastModified: new Date("2025-01-01") },
    { url: "/tools/image-to-text", lastModified: new Date("2025-01-01") },
    { url: "/tools/signature-maker", lastModified: new Date("2025-01-01") },
    { url: "/tools/heic-to-jpg", lastModified: new Date("2025-01-01") },
    { url: "/tools/text-to-pdf", lastModified: new Date("2025-01-01") },
    { url: "/tools/image-converter", lastModified: new Date("2025-01-01") },
    { url: "/tools/image-resizer", lastModified: new Date("2025-02-01") },
    { url: "/tools/image-cropper", lastModified: new Date("2025-03-01") },
  ].map(({ url, lastModified }) => ({
    url,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified,
  }));

  const blogRoutes = [
    { url: "/blog/qr-generator", lastModified: new Date("2025-01-01") },
    { url: "/blog/password-gen", lastModified: new Date("2025-01-01") },
    { url: "/blog/unit-converter", lastModified: new Date("2025-01-01") },
    { url: "/blog/youtube-thumbnail", lastModified: new Date("2025-01-01") },
    { url: "/blog/image-compressor", lastModified: new Date("2025-01-01") },
    { url: "/blog/image-to-text", lastModified: new Date("2025-01-01") },
    { url: "/blog/signature-maker", lastModified: new Date("2025-01-01") },
    { url: "/blog/heic-to-jpg", lastModified: new Date("2025-01-01") },
    { url: "/blog/text-to-pdf", lastModified: new Date("2025-01-01") },
    { url: "/blog/image-converter", lastModified: new Date("2025-01-01") },
    { url: "/blog/image-resizer", lastModified: new Date("2025-02-01") },
    { url: "/blog/image-cropper", lastModified: new Date("2025-03-01") },
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
//     { url: "/", changeFrequency: "monthly", priority: 1.0 },
//     { url: "/blog", changeFrequency: "weekly", priority: 0.9 },
//     { url: "/about", changeFrequency: "yearly", priority: 0.5 },
//     { url: "/contact", changeFrequency: "yearly", priority: 0.5 },
//     { url: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
//     { url: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
//   ];

//   const toolRoutes = [
//     "/tools/qr-generator",
//     "/tools/password-gen",
//     "/tools/unit-converter",
//     "/tools/youtube-thumbnail",
//     "/tools/image-compressor",
//     "/tools/image-to-text",
//     "/tools/signature-maker",
//     "/tools/heic-to-jpg",
//     "/tools/text-to-pdf",
//     "/tools/image-converter",
//     "/tools/image-resizer",
//     "/tools/image-cropper",
//   ].map((url) => ({ url, changeFrequency: "monthly", priority: 0.8 }));

//   const blogRoutes = [
//     "/blog/qr-generator",
//     "/blog/password-gen",
//     "/blog/unit-converter",
//     "/blog/youtube-thumbnail",
//     "/blog/image-compressor",
//     "/blog/image-to-text",
//     "/blog/signature-maker",
//     "/blog/heic-to-jpg",
//     "/blog/text-to-pdf",
//     "/blog/image-converter",
//     "/blog/image-resizer",
//     "/blog/image-cropper",
//   ].map((url) => ({ url, changeFrequency: "weekly", priority: 0.7 }));

//   const allRoutes = [...staticRoutes, ...toolRoutes, ...blogRoutes];

//   return allRoutes.map(({ url, changeFrequency, priority }) => ({
//     url: `${baseUrl}${url}`,
//     lastModified: new Date(),
//     changeFrequency,
//     priority,
//   }));
// }

