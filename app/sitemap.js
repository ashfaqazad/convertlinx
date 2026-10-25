// app/sitemap.js

export default function sitemap() {
  const baseUrl = "https://convertlinx.com";

  // ── Static Pages ──
  const staticRoutes = [
    { url: "/",                 changeFrequency: "monthly", priority: 1.0, lastModified: new Date("2025-01-01") },
    { url: "/blog",             changeFrequency: "weekly",  priority: 0.9, lastModified: new Date("2026-06-30") },
    { url: "/about",            changeFrequency: "yearly",  priority: 0.5, lastModified: new Date("2025-01-01") },
    { url: "/contact",          changeFrequency: "yearly",  priority: 0.5, lastModified: new Date("2025-01-01") },
    { url: "/privacy-policy",   changeFrequency: "yearly",  priority: 0.3, lastModified: new Date("2025-01-01") },
    { url: "/terms-and-conditions", changeFrequency: "yearly",  priority: 0.3, lastModified: new Date("2025-01-01") },
  ];

  // ── Tool Pages ──
  const toolRoutes = [
    // Image Tools
    "/image-compressor",
    "/image-resizer",
    "/image-cropper",
    "/image-converter",
    "/png-to-ico",
    "/image-to-text",
    "/scan-to-text",
    "/screenshot-to-text",

    "/heic-to-jpg",
    "/add-watermark",
    "/rotate-flip-image",

    // Writing / Text Tools
    "/word-counter",
    "/case-converter",
    "/lorem-ipsum",
    "/text-to-speech",
    "/text-to-slug",

    // Developer Tools
    "/json-formatter",
    "/base64-tool",
    "/regex-tester",
    "/favicon-generator",
    "/og-preview-checker",
    "/metatag-generator",

    // Design Tools
    "/color-picker",
    "/color-palette-generator",
 
    // Utilities
    "/qr-generator",
    "/password-gen",
    "/whatsapp-link-generator",
    "/unit-converter",
    "/youtube-thumbnail",
    "/signature-maker",
    "/text-to-pdf",
  ].map((url) => ({
    url,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: new Date("2026-04-02"),
  }));

  // ── New Image Tool Pages (added Oct 2026) ──
  const newToolRoutes = [
    "/png-to-jpg",
    "/jfif-to-jpg",
  ].map((url) => ({
    url,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: new Date("2026-10-15"),
  }));

  // ── Blog Pages (24 articles) ──
  const blogRoutes = [
    // Image Tools
    "/blog/compress-images-without-losing-quality",
    "/blog/resize-image-online-free-tool",
    "/blog/crop-image-online-free-tool",
    "/blog/convert-image-format-online-free",
    "/blog/extract-text-from-image-ocr-free",
    "/blog/convert-heic-to-jpg-free-online",
    "/blog/add-watermark-to-image-online-free",
    "/blog/rotate-flip-image-online-free",

    // Writing / Text Tools
    "/blog/free-online-word-counter-tool",
    "/blog/text-case-converter-uppercase-lowercase",
    "/blog/lorem-ipsum-generator-free-placeholder-text",
    "/blog/free-text-to-speech-converter-online",
    "/blog/text-to-url-slug-converter-free",

    // Developer Tools
    "/blog/json-formatter-validator-online-free",
    "/blog/base64-encode-decode-online-free",
    "/blog/free-meta-tag-generator-seo-tool",

    // Design Tools
    "/blog/online-color-picker-hex-rgb-hsl",

    // Utilities
    "/blog/how-to-generate-qr-code-online-free",
    "/blog/how-to-create-strong-password-online",
    "/blog/free-online-unit-converter-guide",
    "/blog/download-youtube-thumbnail-hd-free",
    "/blog/create-digital-signature-online-free",
    "/blog/convert-text-to-pdf-online-free",
    "/blog/best-free-pdf-tools-online",
  ].map((url) => ({
    url,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: new Date("2026-06-30"),
  }));

  const allRoutes = [...staticRoutes, ...toolRoutes, ...newToolRoutes, ...blogRoutes];

  return allRoutes.map(({ url, changeFrequency, priority, lastModified }) => ({
    url: `${baseUrl}${url}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}




