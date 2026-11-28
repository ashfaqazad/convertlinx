import { notFound } from "next/navigation";
import { seoData } from "@/lib/seoData";
import { generateSchemas } from "@/lib/generateSchemas";
import ToolLoader from "@/components/ToolLoader";
import { unstable_cache } from "next/cache";
import { getExchangeRates } from "@/lib/exchangeRates";
import { todayISO } from "@/lib/hijri";

const SITE_URL = "https://convertlinx.com";

// 🔹 Valid BASE tools (ToolLoader ke toolMap ki keys ke saath bilkul same rakhna)
// ToolLoader 'use client' hai, is liye server page se toolMap check nahi ho sakta.
// Is Set se galat slug par khali page ki jagah 404 aayega.
const BASE_TOOLS = new Set([
  "qr-generator",
  "password-gen",
  "unit-converter",
  "youtube-thumbnail",
  "image-compressor",
  "image-to-text",
  "signature-maker",
  "heic-to-jpg",
  "text-to-pdf",
  "image-converter",
  "image-resizer",
  "image-cropper",
  "word-counter",
  "case-converter",
  "base64-tool",
  "json-formatter",
  "lorem-ipsum",
  "color-picker",
  "add-watermark",
  "rotate-flip-image",
  "metatag-generator",
  "text-to-speech",
  "text-to-slug",
  "whatsapp-link-generator",
  "favicon-generator",
  "regex-tester",
  "og-preview-checker",
  "png-to-ico",
  "png-to-jpg",
  "jfif-to-jpg",
  "color-palette-generator",
  "background-remover",
  "audio-converter",
  "mp4-to-mp3",
  "video-compressor",
  "hijri-date-converter",
  "today-islamic-date",
  "currency-converter",
  "age-calculator",
  "percentage-calculator",
  "format-converter",
  
]);

// Refreshed hourly, so the server-rendered "today" page does not stay on the build date
const getTodayInPakistan = unstable_cache(
  async () => todayISO("Asia/Karachi"),
  ["today-pk"],
  { revalidate: 3600 }
);

// Extra server data, fetched only for the tools that need it
async function getToolProps(baseTool) {
  if (baseTool === "currency-converter") return { rates: await getExchangeRates() };
  if (baseTool === "today-islamic-date") return { today: await getTodayInPakistan() };
  return {};
}

// 🔹 Resolve base tool (for variants)
function resolveBaseTool(slug) {
  const meta = seoData[slug];
  if (!meta) return null;
  return meta.baseTool || slug;
}

// 🔹 Pre-generate static pages for every known tool slug
export async function generateStaticParams() {
  return Object.keys(seoData).map((slug) => ({
    tool: slug,
  }));
}

// ✅ Keep your no-trailing-slash URLs ("/merge-pdf" style)
function normalizePath(path = "/") {
  if (!path.startsWith("/")) path = "/" + path;
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}

function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return SITE_URL;
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return SITE_URL + normalizePath(pathOrUrl);
}


const DEFAULT_OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
};

// 🔹 Metadata (SEO)
export async function generateMetadata({ params }) {
  const { tool } = await params; // Next 14 aur 15+ dono mein chalta hai
  const pageData = seoData[tool];
  if (!pageData) notFound();

  const canonicalAbs = absoluteUrl(pageData.canonical);

  const og = pageData.openGraph || {};
  const ogUrlAbs = absoluteUrl(og.url || pageData.canonical);

  // Agar tool ki apni OG image nahi, to default image use karo
  const rawImages =
    og.images && og.images.length > 0
      ? og.images
      : [{ ...DEFAULT_OG_IMAGE, alt: pageData.title }];

  const ogImages = rawImages.map((img) => ({
    ...img,
    url: absoluteUrl(img.url),
  }));

  return {
    metadataBase: new URL(SITE_URL),

    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords,

    alternates: {
      canonical: canonicalAbs,
    },

    openGraph: {
      title: pageData.title,
      description: pageData.description,
      siteName: "ConvertLinx",
      locale: "en_US",
      type: "website",
      ...og,
      url: ogUrlAbs,
      images: ogImages,
    },

    twitter: {
      card: "summary_large_image",
      title: og.title || pageData.title,
      description: og.description || pageData.description,
      images: ogImages.map((img) => img.url),
    },
  };
}

// 🔹 Metadata (SEO)
// export async function generateMetadata({ params }) {
//   const { tool } = await params; // Next 14 aur 15+ dono mein chalta hai
//   const pageData = seoData[tool];
//   if (!pageData) notFound();

//   const canonicalAbs = absoluteUrl(pageData.canonical);

//   const og = pageData.openGraph || {};
//   const ogUrlAbs = absoluteUrl(og.url || pageData.canonical);

//   const ogImages = (og.images || []).map((img) => ({
//     ...img,
//     url: absoluteUrl(img.url),
//   }));

//   return {
//     metadataBase: new URL(SITE_URL),

//     title: pageData.title,
//     description: pageData.description,
//     keywords: pageData.keywords,

//     alternates: {
//       canonical: canonicalAbs,
//     },

//     openGraph: {
//       ...og,
//       url: ogUrlAbs,
//       images: ogImages,
//     },

//     twitter: {
//       card: "summary_large_image",
//       title: og.title || pageData.title,
//       description: og.description || pageData.description,
//       images: ogImages.map((img) => img.url),
//     },
//   };
// }


// 🔹 Dynamic Page Loader (BASE + VARIANTS)
export default async function ToolPage({ params }) {
  const { tool } = await params; // Next 14 aur 15+ dono mein chalta hai

  const pageData = seoData[tool];
  if (!pageData) notFound();

  const baseTool = resolveBaseTool(tool);
  if (!baseTool || !BASE_TOOLS.has(baseTool)) notFound();

  // ✅ Server-side JSON-LD (raw HTML mein aayega)
  const schemas = generateSchemas(pageData);
  const toolProps = await getToolProps(baseTool);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      {/* ✅ ToolLoader client pe sahi tool ka chunk load karega */}
      <ToolLoader key={tool} tool={baseTool} seo={pageData} {...toolProps} />
    </>
  );
}

