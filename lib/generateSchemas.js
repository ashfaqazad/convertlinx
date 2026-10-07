// lib/generateSchemas.js
const SITE_URL = "https://convertlinx.com";

// canonical relative ho ya full URL, dono ko absolute bana deta hai
function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return SITE_URL;
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  let path = pathOrUrl.startsWith("/") ? pathOrUrl : "/" + pathOrUrl;
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return SITE_URL + path;
}

// "Free QR Code Generator – Create Custom QR Codes Online" -> "Free QR Code Generator"
function cleanName(pageData) {
  if (pageData.h1) return pageData.h1;
  return (pageData.title || "").split(/\s[–—|-]\s/)[0].trim();
}

export function generateSchemas(pageData) {
  const url = absoluteUrl(pageData.canonical);
  const name = cleanName(pageData);
  const schemas = [];

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name, item: url },
    ],
  });

  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    url,
    description: pageData.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "ConvertLinx", url: SITE_URL },
  });

  if (pageData.howItWorks?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name,
      description: pageData.description,
      step: pageData.howItWorks.map((text, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: text,
        text,
      })),
    });
  }

  return schemas;
}