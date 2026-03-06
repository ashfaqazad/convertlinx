// app/sitemap.js

export default function sitemap() {
  const baseUrl = "https://convertlinx.com";

  const staticRoutes = [
    { url: "/", changeFrequency: "monthly", priority: 1.0 },
    { url: "/blog", changeFrequency: "weekly", priority: 0.9 },
    { url: "/about", changeFrequency: "yearly", priority: 0.5 },
    { url: "/contact", changeFrequency: "yearly", priority: 0.5 },
    { url: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { url: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
  ];

  const toolRoutes = [
    "/tools/qr-generator",
    "/tools/password-gen",
    "/tools/unit-converter",
    "/tools/youtube-thumbnail",
    "/tools/image-compressor",
    "/tools/image-to-text",
    "/tools/signature-maker",
    "/tools/heic-to-jpg",
    "/tools/text-to-pdf",
    "/tools/image-converter",
    "/tools/image-resizer",
    "/tools/image-cropper",
  ].map((url) => ({ url, changeFrequency: "monthly", priority: 0.8 }));

  const blogRoutes = [
    "/blog/qr-generator",
    "/blog/password-gen",
    "/blog/unit-converter",
    "/blog/youtube-thumbnail",
    "/blog/image-compressor",
    "/blog/image-to-text",
    "/blog/signature-maker",
    "/blog/heic-to-jpg",
    "/blog/text-to-pdf",
    "/blog/image-converter",
    "/blog/image-resizer",
    "/blog/image-cropper",
  ].map((url) => ({ url, changeFrequency: "weekly", priority: 0.7 }));

  const allRoutes = [...staticRoutes, ...toolRoutes, ...blogRoutes];

  return allRoutes.map(({ url, changeFrequency, priority }) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
