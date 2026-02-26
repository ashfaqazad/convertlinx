// app/compress-pdf/page.jsx
import { seoData } from "@/lib/seoData";
import CompressPdfClient from "./CompressPdfClient";

const SITE_URL = "https://pdflinx.com";

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

export function generateMetadata() {
  const data = seoData["compress-pdf"];
  const url = absoluteUrl(data.canonical);

  const og = data.openGraph || {};
  const ogImages = (og.images || []).map((img) => ({
    ...img,
    url: absoluteUrl(img.url),
  }));

  return {
    metadataBase: new URL(SITE_URL),
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    alternates: { canonical: url },
    openGraph: {
      ...og,
      url: absoluteUrl(og.url || data.canonical),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: og.title || data.title,
      description: og.description || data.description,
      images: ogImages.map((img) => img.url),
    },
  };
}

export default function Page() {
  return <CompressPdfClient />;
}
