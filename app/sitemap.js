// app/sitemap.js

// Real last-change date of each page. Update the date when a page changes.
const LAST_MODIFIED = {
  "/image-compressor": "2026-10-08",
  "/image-resizer": "2026-10-08",
  "/image-cropper": "2026-10-08",
  "/image-converter": "2026-11-07",
  "/background-remover": "2026-10-26",
  "/png-to-ico": "2026-10-29",
  "/image-to-text": "2026-11-04",
  "/scan-to-text": "2026-11-04",
  "/screenshot-to-text": "2026-11-04",
  "/urdu-ocr": "2026-11-04",
  "/arabic-ocr": "2026-11-04",
  "/scanned-pdf-to-text": "2026-11-04",
  "/heic-to-jpg": "2026-10-08",
  "/add-watermark": "2026-10-08",
  "/audio-converter": "2026-11-10",
  "/mp4-to-mp3": "2026-11-10",
  "/rotate-flip-image": "2026-10-10",
  "/word-counter": "2026-10-17",
  "/case-converter": "2026-10-08",
  "/lorem-ipsum": "2026-10-25",
  "/text-to-speech": "2026-10-10",
  "/text-to-slug": "2026-10-08",
  "/json-formatter": "2026-10-08",
  "/base64-tool": "2026-10-08",
  "/regex-tester": "2026-10-08",
  "/favicon-generator": "2026-10-29",
  "/og-preview-checker": "2026-10-08",
  "/metatag-generator": "2026-10-28",
  "/color-picker": "2026-10-09",
  "/color-palette-generator": "2026-10-20",
  "/qr-generator": "2026-10-29",
  "/password-gen": "2026-10-15",
  "/whatsapp-link-generator": "2026-10-08",
  "/unit-converter": "2026-10-08",
  "/youtube-thumbnail": "2026-10-10",
  "/signature-maker": "2026-10-27",
  "/text-to-pdf": "2026-10-08",
  "/png-to-jpg": "2026-10-15",
  "/jfif-to-jpg": "2026-10-15",
  "/blog/compress-images-without-losing-quality": "2025-12-06",
  "/blog/resize-image-online-free-tool": "2025-12-12",
  "/blog/crop-image-online-free-tool": "2025-12-13",
  "/blog/convert-image-format-online-free": "2025-12-11",
  "/blog/extract-text-from-image-ocr-free": "2025-12-07",
  "/blog/convert-heic-to-jpg-free-online": "2025-12-09",
  "/blog/add-watermark-to-image-online-free": "2025-12-20",
  "/blog/rotate-flip-image-online-free": "2025-12-21",
  "/blog/best-free-image-converter-utility-tools": "2026-11-06",
  "/blog/image-converter": "2026-10-18",
  "/blog/free-online-word-counter-tool": "2025-12-14",
  "/blog/text-case-converter-uppercase-lowercase": "2025-12-15",
  "/blog/lorem-ipsum-generator-free-placeholder-text": "2025-12-18",
  "/blog/free-text-to-speech-converter-online": "2025-12-23",
  "/blog/text-to-url-slug-converter-free": "2025-12-24",
  "/blog/json-formatter-validator-online-free": "2025-12-17",
  "/blog/base64-encode-decode-online-free": "2025-12-16",
  "/blog/free-meta-tag-generator-seo-tool": "2025-12-22",
  "/blog/online-color-picker-hex-rgb-hsl": "2025-12-19",
  "/blog/how-to-generate-qr-code-online-free": "2025-12-02",
  "/blog/how-to-create-strong-password-online": "2025-12-03",
  "/blog/free-online-unit-converter-guide": "2025-12-04",
  "/blog/download-youtube-thumbnail-hd-free": "2025-12-05",
  "/blog/create-digital-signature-online-free": "2025-12-08",
  "/blog/convert-text-to-pdf-online-free": "2025-12-10",
  "/blog/best-free-pdf-tools-online": "2026-10-11",
  "/": "2026-10-26",
  "/blog": "2026-11-06",
  "/about": "2026-10-10",
  "/contact": "2026-03-11",
  "/privacy-policy": "2026-03-05",
  "/terms-and-conditions": "2026-03-05",
};

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
    "/background-remover",
    "/png-to-ico",
    "/image-to-text",
    "/scan-to-text",
    "/screenshot-to-text",
    "/urdu-ocr",
    "/arabic-ocr",
    "/scanned-pdf-to-text",

    "/heic-to-jpg",
    "/add-watermark",
    "/audio-converter",
    "/mp4-to-mp3",
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
    "/blog/best-free-image-converter-utility-tools",
    "/blog/image-converter",

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
    lastModified: LAST_MODIFIED[url] ? new Date(LAST_MODIFIED[url]) : lastModified,
    changeFrequency,
    priority,
  }));
}




