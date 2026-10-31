"use client";

import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import QRCode from "qrcode";
import {
  Link as LucideLink,
  Type,
  Wifi,
  User,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  MapPin,
  Download,
  Copy,
  Check,
  RotateCcw,
  Upload,
  X,
  QrCode,
  ChevronDown,
} from "lucide-react";
import Script from "next/script";
import NextLink from "next/link";
import "@/styles/QrGenerator.css";

/* ───────────────────────── constants ───────────────────────── */

const LINK_CLS = "text-indigo-600 hover:underline font-medium";
const PREVIEW_PX = 560;
const MAX_LABEL = 24;
const MAX_BULK = 100;
const MAX_LOGO_BYTES = 2 * 1024 * 1024;

const TYPES = [
  { id: "url", label: "URL", Icon: LucideLink },
  { id: "text", label: "Text", Icon: Type },
  { id: "wifi", label: "WiFi", Icon: Wifi },
  { id: "vcard", label: "vCard", Icon: User },
  { id: "email", label: "Email", Icon: Mail },
  { id: "phone", label: "Phone", Icon: Phone },
  { id: "sms", label: "SMS", Icon: MessageSquare },
  { id: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
  { id: "location", label: "Location", Icon: MapPin },
];

const REQUIRED_HINT = {
  url: "Enter a link to generate your QR code.",
  text: "Type some text to generate your QR code.",
  wifi: "Enter the network name (SSID) to generate your WiFi QR code.",
  vcard: "Enter at least a name, phone number, or email to create a contact QR code.",
  email: "Enter a valid email address to generate your QR code.",
  phone: "Enter a phone number to generate your QR code.",
  sms: "Enter a phone number to generate your SMS QR code.",
  whatsapp: "Enter a WhatsApp number with country code to generate your QR code.",
  location: "Enter a valid latitude and longitude to generate your QR code.",
};

const FORMATS = {
  png: { label: "PNG", mime: "image/png", ext: "png" },
  svg: { label: "SVG", mime: "image/svg+xml", ext: "svg" },
  jpeg: { label: "JPG", mime: "image/jpeg", ext: "jpg" },
  webp: { label: "WebP", mime: "image/webp", ext: "webp" },
};

const SIZES = [256, 512, 1024, 2048];

const ECC_LEVELS = [
  { v: "L", label: "L · Low (7%)" },
  { v: "M", label: "M · Medium (15%)" },
  { v: "Q", label: "Q · Quartile (25%)" },
  { v: "H", label: "H · High (30%)" },
];

const MARGINS = [
  { v: 0, label: "None" },
  { v: 2, label: "Small" },
  { v: 4, label: "Standard (recommended)" },
];

const STYLE_PRESETS = [
  { name: "Indigo", fg: "#1E1B4B", bg: "#ffffff" },
  { name: "Classic", fg: "#000000", bg: "#ffffff" },
  { name: "Teal", fg: "#0F766E", bg: "#ffffff" },
  { name: "Rose", fg: "#9f1239", bg: "#ffffff" },
  { name: "Blue", fg: "#1D4ED8", bg: "#EFF6FF" },
];

const DEFAULT_STYLE = { fg: "#1E1B4B", bg: "#ffffff" };

const INITIAL_FIELDS = {
  url: "",
  text: "",
  wifiSsid: "",
  wifiPass: "",
  wifiSec: "WPA",
  wifiHidden: false,
  vcFirst: "",
  vcLast: "",
  vcOrg: "",
  vcTitle: "",
  vcPhone: "",
  vcEmail: "",
  vcUrl: "",
  vcStreet: "",
  vcCity: "",
  vcCountry: "",
  mailTo: "",
  mailSubject: "",
  mailBody: "",
  phone: "",
  smsNumber: "",
  smsMessage: "",
  waNumber: "",
  waMessage: "",
  lat: "",
  lng: "",
};

const inputCls = "qr-input w-full px-4 py-3 rounded-xl text-sm";

/* ───────────────────────── helpers ───────────────────────── */

const hexToRgb = (hex) => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (a, b) => {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const escWifi = (s) => s.replace(/([\\;,:"])/g, "\\$1");
const escVcard = (s) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

const cleanPhone = (v) => (v || "").replace(/[^\d+]/g, "");

const normalizeUrl = (value) => {
  const v = (value || "").trim();
  if (!v) return "";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) return v;
  if (/^(mailto|tel|sms|smsto|geo|wifi|facetime|skype):/i.test(v)) return v;
  return `https://${v}`;
};

/* Builds the exact text that is encoded in the QR code */
function buildPayload(type, f) {
  const t = (s) => (s || "").trim();
  switch (type) {
    case "url":
      return normalizeUrl(f.url);

    case "text":
      return t(f.text);

    case "wifi": {
      const ssid = t(f.wifiSsid);
      if (!ssid) return "";
      const sec = f.wifiSec;
      let s = `WIFI:T:${sec};S:${escWifi(ssid)};`;
      if (sec !== "nopass" && f.wifiPass) s += `P:${escWifi(f.wifiPass)};`;
      if (f.wifiHidden) s += "H:true;";
      return `${s};`;
    }

    case "vcard": {
      const first = t(f.vcFirst);
      const last = t(f.vcLast);
      const phone = t(f.vcPhone);
      const email = t(f.vcEmail);
      if (!first && !last && !phone && !email) return "";
      const full =
        [first, last].filter(Boolean).join(" ") || t(f.vcOrg) || phone || email;
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${escVcard(last)};${escVcard(first)};;;`,
        `FN:${escVcard(full)}`,
      ];
      if (t(f.vcOrg)) lines.push(`ORG:${escVcard(t(f.vcOrg))}`);
      if (t(f.vcTitle)) lines.push(`TITLE:${escVcard(t(f.vcTitle))}`);
      if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
      if (email) lines.push(`EMAIL:${email}`);
      if (t(f.vcUrl)) lines.push(`URL:${normalizeUrl(f.vcUrl)}`);
      if (t(f.vcStreet) || t(f.vcCity) || t(f.vcCountry)) {
        lines.push(
          `ADR;TYPE=WORK:;;${escVcard(t(f.vcStreet))};${escVcard(
            t(f.vcCity),
          )};;;${escVcard(t(f.vcCountry))}`,
        );
      }
      lines.push("END:VCARD");
      return lines.join("\n");
    }

    case "email": {
      const to = t(f.mailTo);
      if (!to || !to.includes("@")) return "";
      const params = [];
      if (t(f.mailSubject))
        params.push(`subject=${encodeURIComponent(t(f.mailSubject))}`);
      if (t(f.mailBody)) params.push(`body=${encodeURIComponent(t(f.mailBody))}`);
      return `mailto:${to}${params.length ? `?${params.join("&")}` : ""}`;
    }

    case "phone": {
      const n = cleanPhone(f.phone);
      return n ? `tel:${n}` : "";
    }

    case "sms": {
      const n = cleanPhone(f.smsNumber);
      if (!n) return "";
      const msg = t(f.smsMessage);
      return msg ? `sms:${n}?body=${encodeURIComponent(msg)}` : `sms:${n}`;
    }

    case "whatsapp": {
      const digits = (f.waNumber || "").replace(/\D/g, "");
      if (!digits) return "";
      const msg = t(f.waMessage);
      return `https://wa.me/${digits}${
        msg ? `?text=${encodeURIComponent(msg)}` : ""
      }`;
    }

    case "location": {
      if (t(f.lat) === "" || t(f.lng) === "") return "";
      const lat = Number(t(f.lat));
      const lng = Number(t(f.lng));
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "";
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return "";
      return `geo:${lat},${lng}`;
    }

    default:
      return "";
  }
}

function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawLogo(ctx, img, size, pct, bgColor) {
  const box = Math.round(size * pct);
  const x = Math.round((size - box) / 2);
  roundRectPath(ctx, x, x, box, box, box * 0.2);
  ctx.fillStyle = bgColor;
  ctx.fill();
  const inner = box * 0.78;
  const iw = img.naturalWidth || img.width || 256;
  const ih = img.naturalHeight || img.height || 256;
  const sc = Math.min(inner / iw, inner / ih);
  const dw = iw * sc;
  const dh = ih * sc;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
}

/* Renders QR (+ optional logo and frame/label) to a canvas */
async function composeQr(o, targetPx, forJpeg) {
  const { text, ecc, margin, fg, bg, transparent, logoImg, logoPct, frameOn, label } = o;
  const solidBg = transparent ? "#ffffff" : bg;
  const light =
    frameOn || forJpeg ? solidBg : transparent ? "#00000000" : bg;

  const pad = frameOn ? Math.round(targetPx * 0.06) : 0;
  const qrPx = targetPx - pad * 2;

  const qrCanvas = document.createElement("canvas");
  await new Promise((resolve, reject) => {
    QRCode.toCanvas(
      qrCanvas,
      text,
      { errorCorrectionLevel: ecc, margin, width: qrPx, color: { dark: fg, light } },
      (err) => (err ? reject(err) : resolve()),
    );
  });

  const qrW = qrCanvas.width;
  if (logoImg) drawLogo(qrCanvas.getContext("2d"), logoImg, qrW, logoPct, solidBg);
  if (!frameOn) return qrCanvas;

  const labelText = (label || "").trim();
  const labelH = labelText ? Math.round(qrW * 0.2) : 0;
  const W = qrW + pad * 2;
  const H = pad + qrW + (labelText ? labelH : pad);

  const out = document.createElement("canvas");
  out.width = W;
  out.height = H;
  const ctx = out.getContext("2d");
  if (forJpeg) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
  }
  const r = W * 0.06;
  roundRectPath(ctx, 0, 0, W, H, r);
  ctx.fillStyle = fg;
  ctx.fill();

  ctx.save();
  roundRectPath(ctx, pad, pad, qrW, qrW, r * 0.6);
  ctx.clip();
  ctx.drawImage(qrCanvas, pad, pad);
  ctx.restore();

  if (labelText) {
    const family =
      '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
    let fs = Math.round(labelH * 0.5);
    ctx.font = `700 ${fs}px ${family}`;
    while (fs > 8 && ctx.measureText(labelText).width > W * 0.88) {
      fs -= 1;
      ctx.font = `700 ${fs}px ${family}`;
    }
    ctx.fillStyle = luminance(fg) > 0.5 ? "#111827" : "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(labelText, W / 2, pad + qrW + labelH / 2);
  }
  return out;
}

/* SVG export (QR + optional embedded logo) */
async function buildSvg(o, size) {
  const { text, ecc, margin, fg, bg, transparent, logoSrc, logoImg, logoPct } = o;
  let svg = await QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: ecc,
    margin,
    width: size,
    color: { dark: fg, light: transparent ? "#00000000" : bg },
  });

  if (logoSrc && logoImg) {
    const m = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
    if (m) {
      const vb = parseFloat(m[1]);
      const box = vb * logoPct;
      const x = (vb - box) / 2;
      const inner = box * 0.78;
      const ix = (vb - inner) / 2;
      const logoBg = transparent ? "#ffffff" : bg;
      const extra =
        `<rect x="${x.toFixed(2)}" y="${x.toFixed(2)}" width="${box.toFixed(2)}" height="${box.toFixed(2)}" rx="${(box * 0.2).toFixed(2)}" fill="${logoBg}"/>` +
        `<image xlink:href="${logoSrc}" x="${ix.toFixed(2)}" y="${ix.toFixed(2)}" width="${inner.toFixed(2)}" height="${inner.toFixed(2)}" preserveAspectRatio="xMidYMid meet"/>`;
      svg = svg
        .replace("<svg ", '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ')
        .replace("</svg>", `${extra}</svg>`);
    }
  }
  return svg;
}

const canvasToBlob = (canvas, fmt) =>
  new Promise((resolve) =>
    canvas.toBlob(resolve, FORMATS[fmt].mime, fmt === "png" ? undefined : 0.92),
  );

const extForBlob = (blob, fmt) =>
  blob && blob.type === FORMATS[fmt].mime ? FORMATS[fmt].ext : "png";

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ── Rich text: strings + contextual internal links, one source for UI and schema ── */
const lk = (text, href) => ({ text, href });
const toPlain = (parts) =>
  parts.map((p) => (typeof p === "string" ? p : p.text)).join("");
const Rich = ({ parts }) => (
  <>
    {parts.map((p, i) =>
      typeof p === "string" ? (
        <Fragment key={i}>{p}</Fragment>
      ) : (
        <NextLink key={i} href={p.href} className={LINK_CLS}>
          {p.text}
        </NextLink>
      ),
    )}
  </>
);

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span
        className="block mb-1.5 text-xs font-semibold"
        style={{ color: "#4B5563" }}
      >
        {label}
      </span>
      {children}
      {hint && (
        <span className="block mt-1 text-xs" style={{ color: "#9CA3AF" }}>
          {hint}
        </span>
      )}
    </label>
  );
}

const sectionLabelStyle = {
  color: "#6366F1",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.09em",
  textTransform: "uppercase",
};

/* ───────────────────────── content ───────────────────────── */

/* ── NEW SEO content blocks (rich text with internal links) ── */
const seoNoSignup1 = [
  "Looking to get a QR code without creating an account? Choose a type above, enter your content, and this free QR code generator creates it instantly. There is no sign up, no email, and no trial period, so you can make free QR codes and generate QR codes for free as often as you like. Everything runs in your browser, and because the result is a static QR code, it never expires and does not redirect through a third-party server.",
];
const seoNoSignup2 = [
  "That makes it a good fit when you need a permanent QR code for print, a QR code generator without tracking, or a digital link QR code generator for a menu, flyer, or business card.",
];
const seoLink = [
  "To convert a URL to a QR code, choose the URL tab, paste the full link, and download your QR code once the preview appears. It is the quickest way to turn a link into a QR code, with no account needed. Shorter links produce simpler QR codes that scan faster, so tidy long page slugs first with the ",
  lk("Text to Slug", "/text-to-slug"),
  " tool. Want a full walkthrough? Read our ",
  lk("guide to creating a QR code online", "/blog/how-to-generate-qr-code-online-free"),
  ".",
];
const seoStatic = [
  "A static QR code stores your link or text directly inside the code. It cannot be edited after you print it, but it never expires, needs no subscription, and works as a permanent bridge from offline to online, for example from a printed flyer to a website. A dynamic QR code stores a short redirect link instead, which lets you change the destination and see scan analytics, but it stops working if the service behind it is cancelled. This tool creates static QR codes, so choose it when you want a code that is free, private, and permanent.",
];
const seoWifi = [
  "Open the WiFi tab, enter your network name, choose the security type, and add the password. Guests scan the code with their phone camera and join without typing anything. Use a long, random key from the ",
  lk("Password Generator", "/password-gen"),
  " so a printed code does not give away a weak password. The network name and password are encoded inside the QR code itself and are never uploaded.",
];
const seoVcard = [
  "A vCard QR code saves your contact details straight into a phone address book. Fill in your name, phone, email, company, and website in the vCard tab, then print the code on a business card, badge, or event banner. Matching your brand colors keeps the card consistent, so build a palette with the ",
  lk("Color Palette Generator", "/color-palette-generator"),
  " first.",
];
const seoMore = [
  "The same generator also creates QR codes for email (with subject and message), phone numbers, SMS, WhatsApp chats, and map locations. For WhatsApp, enter the number with country code and an optional first message. If you only need a shareable chat link, use the ",
  lk("WhatsApp Link Generator", "/whatsapp-link-generator"),
  ".",
];
const seoCustom = [
  "Pick your own QR and background colors, add a logo in the middle, or wrap the code in a frame with a label such as Scan me. Keep strong contrast between a dark code and a light background so every scanner can read it. A logo works best as a square image with a clean background, so remove its background with the ",
  lk("Background Remover", "/background-remover"),
  " and size it with the ",
  lk("Image Resizer", "/image-resizer"),
  " first. When you add a logo, the tool switches error correction to level H so the code stays scannable even though the center is covered.",
];
const seoFormat = [
  "Download PNG for websites, documents, and social posts, and JPG or WebP when a small file matters. Choose SVG when you need a vector QR code that stays sharp at any size, for example on posters, banners, packaging, or in design software. Need another image format later? Change it with the ",
  lk("Image Converter", "/image-converter"),
  ".",
];
const seoPrint = [
  "A free QR code for business works best when it is easy to scan. Print it at least 2 x 2 cm (about 0.8 inches), and larger for posters or anything scanned from a distance. Keep strong contrast between the dark code and the light background, leave the white border around it, and always test-scan the printed version with a phone before sending it to print.",
];

/* ── FAQ data: one source for the visible FAQ and the FAQPage schema ── */
const faqs = [
  {
    q: "Is the QR Code Generator free?",
    a: [
      "Yes — completely free with no signup or hidden costs, and no sign up is needed to download. Generate QR codes directly in your browser.",
    ],
  },
  {
    q: "What types of QR codes can I create?",
    a: [
      "You can generate QR codes for URLs, plain text, WiFi networks, vCard contacts, email, phone numbers, SMS, WhatsApp chats, and map locations. If you need to prepare text for a document, try our ",
      lk("Text to PDF", "/text-to-pdf"),
      " tool.",
    ],
  },
  {
    q: "Do I need to install anything?",
    a: [
      "No installation is needed. The QR Code Generator works directly in your browser on compatible phones, tablets, and desktop computers.",
    ],
  },
  {
    q: "Can I use QR codes for printing?",
    a: [
      "Yes. You can download your QR code as a PNG, JPG, WebP, or vector SVG for posters, flyers, business cards, product packaging, and restaurant menus. If you need to optimize images for your projects, try our ",
      lk("Image Compressor", "/image-compressor"),
      ".",
    ],
  },
  {
    q: "Is my data private?",
    a: [
      "Yes. Your QR code is generated in your browser and your input is not uploaded to a server. Avoid encoding sensitive information in QR codes that other people can scan.",
    ],
  },
  {
    q: "Can I create a QR code for a WhatsApp link?",
    a: [
      "Yes. Open the WhatsApp tab, enter the phone number with country code and an optional first message, and the QR code is created instantly. If you only need the chat link itself, try our ",
      lk("WhatsApp Link Generator", "/whatsapp-link-generator"),
      ".",
    ],
  },
  {
    q: "How can I share text or image data via QR code?",
    a: [
      "You can enter plain text directly in the Text tab. If the text is inside an image, extract it using our ",
      lk("Image to Text (OCR)", "/image-to-text"),
      " tool, then paste the extracted text into the generator.",
    ],
  },
  {
    q: "Can I create a QR code that links to an image?",
    a: [
      "Yes. Use a publicly accessible image URL to create a QR code. You can prepare images with our ",
      lk("Image Compressor", "/image-compressor"),
      " or convert image formats using our ",
      lk("Image Converter", "/image-converter"),
      ".",
    ],
  },
  {
    q: "How do I handle complex URLs or encoded parameters in QR codes?",
    a: [
      "Enter the complete URL in the URL tab and test the resulting QR code. If you need to format JSON data before sharing it, try our ",
      lk("JSON Formatter", "/json-formatter"),
      " tool.",
    ],
  },
  {
    q: "Can I create a QR code for PDF documents?",
    a: [
      "Yes. Upload your PDF to a hosting service and use its shareable URL to generate a QR code. You can also create a PDF from text using our ",
      lk("Text to PDF", "/text-to-pdf"),
      " tool.",
    ],
  },
  {
    q: "How do I create a QR code for free without signing up?",
    a: [
      "Choose a type, enter your link or text in the box, and the QR code appears instantly. There is no account, no email, and no trial. Click Download to save it as PNG, SVG, JPG, or WebP.",
    ],
  },
  {
    q: "How do I convert a link to a QR code?",
    a: [
      "Open the URL tab and paste the full link. If you leave out https://, it is added automatically. The QR code updates as you type, so test it with your phone camera before you print or share it.",
    ],
  },
  {
    q: "Do these QR codes expire?",
    a: [
      "No. This tool creates static QR codes that store your link or text directly in the code, so they keep working as long as the destination stays online. There is no subscription that can run out.",
    ],
  },
  {
    q: "Does this QR code generator track scans or redirect through your servers?",
    a: [
      "No. The code points straight to your link with no redirect, and scans are not tracked. The trade-off is that static codes cannot show scan analytics or be edited after printing. If you need that, you need a dynamic QR service.",
    ],
  },
  {
    q: "What is the difference between static and dynamic QR codes?",
    a: [
      "A static QR code holds your data directly, so it cannot be edited and never expires. A dynamic QR code holds a short redirect link that can be changed later and usually comes with scan analytics, but it depends on a service staying active, and many charge for it.",
    ],
  },
  {
    q: "How do I make a WiFi QR code?",
    a: [
      "Open the WiFi tab, enter your network name and password, and pick the security type (WPA/WPA2/WPA3, WEP, or none). Guests can scan the code with most modern phone cameras to join the network. For a strong key, use the ",
      lk("Password Generator", "/password-gen"),
      ".",
    ],
  },
  {
    q: "How do I make a vCard QR code for a business card?",
    a: [
      "Open the vCard tab, fill in your name, phone, email, company, and website, then download the QR code and place it on your card. Scanning it lets people save your contact details in one tap.",
    ],
  },
  {
    q: "Can I add a logo to my QR code?",
    a: [
      "Yes. Open the Logo section, upload a PNG, JPG, or SVG image, and adjust its size. The tool automatically uses the highest error correction level (H) so the code still scans with the center covered. Always test-scan before printing.",
    ],
  },
  {
    q: "Can I download my QR code as an SVG?",
    a: [
      "Yes. Choose SVG in the format menu to get a vector file that stays sharp at any size, which is ideal for print and design software. A frame with a label is included in PNG, JPG, and WebP downloads.",
    ],
  },
  {
    q: "Which error correction level should I choose?",
    a: [
      "Level M is a good default. Choose Q or H for codes that may get dirty, scratched, or partly covered, and L for the smallest, simplest code. Adding a logo switches the tool to level H automatically.",
    ],
  },
  {
    q: "Can I change the colors of my QR code?",
    a: [
      "Yes. Pick your own QR color and background color, or use a quick style. For reliable scanning, keep a dark code on a light background with strong contrast. The tool warns you when the contrast is too low.",
    ],
  },
  {
    q: "Can I create many QR codes at once?",
    a: [
      "Yes, for URLs and text. Open the bulk section, enter one link or text per line (up to 100), and download all QR codes as a single ZIP file in your chosen format.",
    ],
  },
  {
    q: "How big should a printed QR code be?",
    a: [
      "As a rule of thumb, at least 2 x 2 cm (about 0.8 inches) for close scanning, and larger for posters or anything scanned from a distance. Keep strong contrast, leave the white border around the code, and always test-scan the printed version.",
    ],
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Create a QR Code Online for Free",
  description:
    "Generate QR codes for URLs, text, WiFi, vCard contacts, email, SMS, WhatsApp, and locations in seconds — free, private, no sign up.",
  url: "https://convertlinx.com/qr-generator",
  totalTime: "PT30S",
  estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
  supply: [{ "@type": "HowToSupply", name: "No files needed — works in browser" }],
  tool: [{ "@type": "HowToTool", name: "ConvertLinx QR Code Generator" }],
  step: [
    {
      "@type": "HowToStep",
      name: "Choose a Type and Enter Your Data",
      text: "Pick URL, text, WiFi, vCard, email, phone, SMS, WhatsApp, or location, then fill in the fields.",
    },
    {
      "@type": "HowToStep",
      name: "Customize and Preview",
      text: "Adjust colors, add a logo or frame, and check the live preview as you type.",
    },
    {
      "@type": "HowToStep",
      name: "Download & Share",
      text: "Download your QR code as PNG, SVG, JPG, or WebP, or copy the image to your clipboard.",
    },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ConvertLinx QR Code Generator",
  url: "https://convertlinx.com/qr-generator",
  description:
    "Free QR code generator with no sign up. Create static QR codes for links, WiFi, vCard, email, SMS, WhatsApp, and locations, with custom colors and logo, and download PNG, SVG, JPG, or WebP.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: toPlain(faq.a) },
  })),
};

/* ───────────────────────── component ───────────────────────── */

export default function QRGenerator() {
  const [type, setType] = useState("url");
  const [f, setF] = useState(INITIAL_FIELDS);
  const [fg, setFg] = useState(DEFAULT_STYLE.fg);
  const [bg, setBg] = useState(DEFAULT_STYLE.bg);
  const [transparent, setTransparent] = useState(false);
  const [ecc, setEcc] = useState("M");
  const [margin, setMargin] = useState(4);
  const [format, setFormat] = useState("png");
  const [size, setSize] = useState(1024);
  const [logoSrc, setLogoSrc] = useState("");
  const [logoImg, setLogoImg] = useState(null);
  const [logoPct, setLogoPct] = useState(0.2);
  const [frameOn, setFrameOn] = useState(false);
  const [label, setLabel] = useState("Scan me");
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkBusy, setBulkBusy] = useState("");
  const previewRef = useRef(null);

  const set = (key, value) => setF((prev) => ({ ...prev, [key]: value }));

  const qrText = useMemo(() => buildPayload(type, f), [type, f]);
  const effectiveEcc = logoImg ? "H" : ecc;
  const effectiveBg = transparent || frameOn ? "#ffffff" : bg;
  const ratio = contrastRatio(fg, effectiveBg);
  const inverted = luminance(fg) > luminance(effectiveBg);

  const bulkLines = useMemo(
    () =>
      bulkText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, MAX_BULK),
    [bulkText],
  );

  const getOpts = (text) => ({
    text,
    ecc: effectiveEcc,
    margin,
    fg,
    bg,
    transparent,
    logoImg,
    logoSrc,
    logoPct,
    frameOn,
    label,
  });

  /* Live preview */
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!qrText) {
        setIsGenerated(false);
        setError("");
        return;
      }
      try {
        const c = await composeQr(
          { text: qrText, ecc: effectiveEcc, margin, fg, bg, transparent, logoImg, logoPct, frameOn, label },
          PREVIEW_PX,
          false,
        );
        if (cancelled) return;
        const pc = previewRef.current;
        if (!pc) return;
        pc.width = c.width;
        pc.height = c.height;
        pc.getContext("2d").drawImage(c, 0, 0);
        setIsGenerated(true);
        setError("");
      } catch (e) {
        if (!cancelled) {
          setIsGenerated(false);
          setError(
            "This content is too long for a QR code. Please shorten it or lower the error correction level.",
          );
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [qrText, effectiveEcc, margin, fg, bg, transparent, logoImg, logoPct, frameOn, label]);

  const handleLogo = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file for the logo.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setError("Logo is too large. Please use an image under 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result;
      const img = new Image();
      img.onload = () => {
        setLogoSrc(src);
        setLogoImg(img);
        setError("");
      };
      img.onerror = () => setError("Could not read that logo image.");
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoSrc("");
    setLogoImg(null);
  };

  const handleDownload = async () => {
    if (!qrText || !isGenerated) return;
    try {
      const opts = getOpts(qrText);
      if (format === "svg") {
        const svg = await buildSvg(opts, size);
        triggerDownload(new Blob([svg], { type: "image/svg+xml" }), "qrcode-convertlinx.svg");
      } else {
        const c = await composeQr(opts, size, format === "jpeg");
        const blob = await canvasToBlob(c, format);
        if (!blob) throw new Error("blob");
        triggerDownload(blob, `qrcode-convertlinx.${extForBlob(blob, format)}`);
      }
    } catch (e) {
      setError("Could not create the download. Try a smaller size.");
    }
  };

  const handleCopy = async () => {
    if (!qrText || !isGenerated) return;
    try {
      if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
        throw new Error("unsupported");
      }
      const c = await composeQr(getOpts(qrText), 512, false);
      const blob = await canvasToBlob(c, "png");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setError("Copying images is not supported in this browser. Please use Download instead.");
    }
  };

  const handleReset = () => {
    setF(INITIAL_FIELDS);
    setFg(DEFAULT_STYLE.fg);
    setBg(DEFAULT_STYLE.bg);
    setTransparent(false);
    setEcc("M");
    setMargin(4);
    setFormat("png");
    setSize(1024);
    removeLogo();
    setLogoPct(0.2);
    setFrameOn(false);
    setLabel("Scan me");
    setBulkText("");
    setError("");
    setCopied(false);
  };

  const handleBulk = async () => {
    if (!bulkLines.length) return;
    try {
      setBulkBusy("Preparing...");
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (let i = 0; i < bulkLines.length; i++) {
        setBulkBusy(`Creating ${i + 1} / ${bulkLines.length}`);
        const text = type === "url" ? normalizeUrl(bulkLines[i]) : bulkLines[i];
        const base = `qr-${String(i + 1).padStart(3, "0")}`;
        const opts = getOpts(text);
        if (format === "svg") {
          zip.file(`${base}.svg`, await buildSvg(opts, size));
        } else {
          const c = await composeQr(opts, size, format === "jpeg");
          const blob = await canvasToBlob(c, format);
          zip.file(`${base}.${extForBlob(blob, format)}`, blob);
        }
      }
      const out = await zip.generateAsync({ type: "blob" });
      triggerDownload(out, "qrcodes-convertlinx.zip");
      setBulkBusy("");
    } catch (e) {
      setBulkBusy("");
      setError("Bulk export failed. Try fewer lines or a smaller size.");
    }
  };

  const renderFields = () => {
    switch (type) {
      case "url":
        return (
          <Field
            label="Website link (URL)"
            hint={
              f.url.trim() && qrText !== f.url.trim()
                ? `We will encode: ${qrText}`
                : "Paste any link. https:// is added automatically if missing."
            }
          >
            <input
              type="text"
              inputMode="url"
              className={inputCls}
              placeholder="https://example.com"
              value={f.url}
              onChange={(e) => set("url", e.target.value)}
            />
          </Field>
        );

      case "text":
        return (
          <Field label="Your text">
            <textarea
              rows={4}
              className={inputCls}
              placeholder="Type or paste any text..."
              value={f.text}
              onChange={(e) => set("text", e.target.value)}
            />
          </Field>
        );

      case "wifi":
        return (
          <div className="space-y-4">
            <Field label="Network name (SSID)">
              <input
                type="text"
                className={inputCls}
                placeholder="My WiFi network"
                value={f.wifiSsid}
                onChange={(e) => set("wifiSsid", e.target.value)}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Password">
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Network password"
                  value={f.wifiPass}
                  disabled={f.wifiSec === "nopass"}
                  onChange={(e) => set("wifiPass", e.target.value)}
                />
              </Field>
              <Field label="Security">
                <select
                  className={inputCls}
                  value={f.wifiSec}
                  onChange={(e) => set("wifiSec", e.target.value)}
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (open network)</option>
                </select>
              </Field>
            </div>
            <label className="flex items-center gap-2 text-xs" style={{ color: "#4B5563" }}>
              <input
                type="checkbox"
                checked={f.wifiHidden}
                onChange={(e) => set("wifiHidden", e.target.checked)}
              />
              Hidden network
            </label>
          </div>
        );

      case "vcard":
        return (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First name">
                <input type="text" className={inputCls} value={f.vcFirst} onChange={(e) => set("vcFirst", e.target.value)} />
              </Field>
              <Field label="Last name">
                <input type="text" className={inputCls} value={f.vcLast} onChange={(e) => set("vcLast", e.target.value)} />
              </Field>
              <Field label="Company">
                <input type="text" className={inputCls} value={f.vcOrg} onChange={(e) => set("vcOrg", e.target.value)} />
              </Field>
              <Field label="Job title">
                <input type="text" className={inputCls} value={f.vcTitle} onChange={(e) => set("vcTitle", e.target.value)} />
              </Field>
              <Field label="Phone">
                <input type="tel" className={inputCls} placeholder="+1 555 123 4567" value={f.vcPhone} onChange={(e) => set("vcPhone", e.target.value)} />
              </Field>
              <Field label="Email">
                <input type="email" className={inputCls} placeholder="name@example.com" value={f.vcEmail} onChange={(e) => set("vcEmail", e.target.value)} />
              </Field>
            </div>
            <Field label="Website">
              <input type="text" className={inputCls} placeholder="example.com" value={f.vcUrl} onChange={(e) => set("vcUrl", e.target.value)} />
            </Field>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Street">
                <input type="text" className={inputCls} value={f.vcStreet} onChange={(e) => set("vcStreet", e.target.value)} />
              </Field>
              <Field label="City">
                <input type="text" className={inputCls} value={f.vcCity} onChange={(e) => set("vcCity", e.target.value)} />
              </Field>
              <Field label="Country">
                <input type="text" className={inputCls} value={f.vcCountry} onChange={(e) => set("vcCountry", e.target.value)} />
              </Field>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-4">
            <Field label="Email address">
              <input type="email" className={inputCls} placeholder="name@example.com" value={f.mailTo} onChange={(e) => set("mailTo", e.target.value)} />
            </Field>
            <Field label="Subject (optional)">
              <input type="text" className={inputCls} value={f.mailSubject} onChange={(e) => set("mailSubject", e.target.value)} />
            </Field>
            <Field label="Message (optional)">
              <textarea rows={3} className={inputCls} value={f.mailBody} onChange={(e) => set("mailBody", e.target.value)} />
            </Field>
          </div>
        );

      case "phone":
        return (
          <Field label="Phone number" hint="Include the country code, for example +1 555 123 4567.">
            <input type="tel" className={inputCls} placeholder="+1 555 123 4567" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
        );

      case "sms":
        return (
          <div className="space-y-4">
            <Field label="Phone number" hint="Include the country code.">
              <input type="tel" className={inputCls} placeholder="+1 555 123 4567" value={f.smsNumber} onChange={(e) => set("smsNumber", e.target.value)} />
            </Field>
            <Field label="Message (optional)">
              <textarea rows={3} className={inputCls} value={f.smsMessage} onChange={(e) => set("smsMessage", e.target.value)} />
            </Field>
          </div>
        );

      case "whatsapp":
        return (
          <div className="space-y-4">
            <Field label="WhatsApp number" hint="Country code first, digits only (no + or leading zeros), for example 15551234567.">
              <input type="tel" className={inputCls} placeholder="15551234567" value={f.waNumber} onChange={(e) => set("waNumber", e.target.value)} />
            </Field>
            <Field label="First message (optional)">
              <textarea rows={3} className={inputCls} value={f.waMessage} onChange={(e) => set("waMessage", e.target.value)} />
            </Field>
          </div>
        );

      case "location":
        return (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Latitude" hint="Between -90 and 90">
              <input type="text" inputMode="decimal" className={inputCls} placeholder="40.7128" value={f.lat} onChange={(e) => set("lat", e.target.value)} />
            </Field>
            <Field label="Longitude" hint="Between -180 and 180">
              <input type="text" inputMode="decimal" className={inputCls} placeholder="-74.0060" value={f.lng} onChange={(e) => set("lng", e.target.value)} />
            </Field>
          </div>
        );

      default:
        return null;
    }
  };

  const actionBtnStyle = (disabled) => ({
    color: "#4338CA",
    borderColor: "#C7D2FE",
    background: "#fff",
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  });

  return (
    <>
      {/* ── SCHEMA: HowTo + WebApplication + FAQPage ── */}
      <Script
        id="howto-schema-qr"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Script
        id="app-schema-qr"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <Script
        id="faq-schema-qr"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="qr-page">
        {/* ── HERO ── */}
        <section className="hero-bg py-16 px-6 text-center">
          <div className="hero-blob-1" />
          <div className="hero-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              <a href="/" className="breadcrumb-link">
                Home
              </a>
              <span style={{ color: "#C4B5FD" }}>/</span>
              <span style={{ color: "#6366F1" }}>QR Code Generator</span>
            </div>
            <span className="badge-pill inline-block px-4 py-1.5 rounded-full mb-5">
              Free Tool
            </span>
            <h1
              className="text-4xl md:text-5xl font-extrabold leading-tight mb-4"
              style={{ color: "#1a1a2e" }}
            >
              QR Code <span className="grad-text">Generator</span>
            </h1>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: "#6B7280" }}
            >
              Create QR codes for URLs, WiFi passwords, WhatsApp links, vCard
              contact cards, email, SMS, locations, and plain text — instantly
              in your browser. Add your own colors and logo, then download as
              PNG, SVG, JPG, or WebP. 100% private, no sign up required.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {[
                "No signup needed",
                "URLs · WiFi · WhatsApp · vCard",
                "PNG · SVG · JPG · WebP",
                "Custom colors & logo",
                "Unlimited use",
                "100% private",
              ].map((t, i) => (
                <span
                  key={i}
                  className="badge-pill px-3 py-1 rounded-full text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="main-section py-10 px-6">
          <div className="max-w-5xl mx-auto fade-up">
            <div className="tool-card rounded-3xl p-6 md:p-10">
              <div className="grid md:grid-cols-5 gap-8">
                {/* ── LEFT: inputs and options ── */}
                <div className="md:col-span-3">
                  <p className="mb-3" style={sectionLabelStyle}>
                    1 · Choose QR code type
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="QR code type">
                    {TYPES.map(({ id, label: tl, Icon }) => {
                      const active = type === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setType(id)}
                          className="px-3 py-2 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition"
                          style={
                            active
                              ? { background: "#6366F1", color: "#fff", borderColor: "#6366F1" }
                              : { background: "#fff", color: "#4338CA", borderColor: "#C7D2FE" }
                          }
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {tl}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mb-3" style={sectionLabelStyle}>
                    2 · Enter your content
                  </p>
                  <div className="mb-6">{renderFields()}</div>

                  <details className="mb-6">
                    <summary
                      className="text-xs font-semibold cursor-pointer"
                      style={{ color: "#6366F1" }}
                    >
                      View encoded content
                    </summary>
                    <pre
                      className="mt-2 p-3 rounded-xl text-xs overflow-x-auto"
                      style={{ background: "#F5F3FF", color: "#4B5563", maxHeight: 160 }}
                    >
                      {qrText || "Nothing to encode yet."}
                    </pre>
                  </details>

                  <p className="mb-3" style={sectionLabelStyle}>
                    3 · Customize (optional)
                  </p>

                  {/* Colors */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {STYLE_PRESETS.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => {
                            setFg(p.fg);
                            setBg(p.bg);
                          }}
                          className="px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2"
                          style={{ background: "#fff", color: "#4B5563", borderColor: "#E5E7EB" }}
                        >
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ background: p.fg, border: "1px solid #E5E7EB" }}
                          />
                          {p.name}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="QR code color">
                        <input
                          type="color"
                          value={fg}
                          onChange={(e) => setFg(e.target.value)}
                          className="h-10 w-full rounded-lg border cursor-pointer p-1 bg-white"
                          style={{ borderColor: "#E5E7EB" }}
                        />
                      </Field>
                      <Field label="Background color">
                        <input
                          type="color"
                          value={bg}
                          disabled={transparent || frameOn}
                          onChange={(e) => setBg(e.target.value)}
                          className="h-10 w-full rounded-lg border cursor-pointer p-1 bg-white"
                          style={{ borderColor: "#E5E7EB", opacity: transparent || frameOn ? 0.5 : 1 }}
                        />
                      </Field>
                    </div>
                    <label className="flex items-center gap-2 text-xs mt-3" style={{ color: "#4B5563" }}>
                      <input
                        type="checkbox"
                        checked={transparent && !frameOn}
                        disabled={frameOn}
                        onChange={(e) => setTransparent(e.target.checked)}
                      />
                      Transparent background (PNG, WebP, SVG)
                      {frameOn ? " — frame uses a solid background" : ""}
                    </label>
                    {inverted && (
                      <p className="mt-3 text-xs" style={{ color: "#B45309" }}>
                        Light code on a dark background can fail on some scanners. A dark code on a light background is safest.
                      </p>
                    )}
                    {!inverted && ratio < 4 && (
                      <p className="mt-3 text-xs" style={{ color: "#B45309" }}>
                        Low contrast ({ratio.toFixed(1)}:1). This QR code may be hard to scan. Use a darker code color or a lighter background.
                      </p>
                    )}
                  </div>

                  {/* Logo */}
                  <details className="faq-item rounded-xl p-4 mb-3">
                    <summary className="text-sm font-semibold cursor-pointer" style={{ color: "#374151" }}>
                      Add a logo
                    </summary>
                    <div className="mt-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <label
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2 cursor-pointer"
                          style={{ color: "#4338CA", borderColor: "#C7D2FE", background: "#fff" }}
                        >
                          <Upload className="w-4 h-4" />
                          {logoImg ? "Change logo" : "Upload logo"}
                          <input type="file" accept="image/*" onChange={handleLogo} className="sr-only" />
                        </label>
                        {logoImg && (
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="px-3 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5"
                            style={{ color: "#9f1239", borderColor: "#FDA4AF", background: "#fff" }}
                          >
                            <X className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        )}
                      </div>
                      {logoImg && (
                        <Field label={`Logo size: ${Math.round(logoPct * 100)}%`}>
                          <input
                            type="range"
                            min="10"
                            max="30"
                            value={Math.round(logoPct * 100)}
                            onChange={(e) => setLogoPct(Number(e.target.value) / 100)}
                            className="w-full"
                          />
                        </Field>
                      )}
                      <p className="text-xs" style={{ color: "#9CA3AF" }}>
                        PNG, JPG, or SVG under 2 MB. With a logo, error correction is set to H automatically. Test-scan before printing.
                      </p>
                    </div>
                  </details>

                  {/* Frame */}
                  <details className="faq-item rounded-xl p-4 mb-3">
                    <summary className="text-sm font-semibold cursor-pointer" style={{ color: "#374151" }}>
                      Add a frame and label
                    </summary>
                    <div className="mt-4 space-y-3">
                      <label className="flex items-center gap-2 text-xs" style={{ color: "#4B5563" }}>
                        <input
                          type="checkbox"
                          checked={frameOn}
                          onChange={(e) => setFrameOn(e.target.checked)}
                        />
                        Wrap the QR code in a frame
                      </label>
                      {frameOn && (
                        <Field label="Label text">
                          <input
                            type="text"
                            maxLength={MAX_LABEL}
                            className={inputCls}
                            placeholder="Scan me"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                          />
                        </Field>
                      )}
                    </div>
                  </details>

                  {/* Advanced */}
                  <details className="faq-item rounded-xl p-4 mb-3">
                    <summary className="text-sm font-semibold cursor-pointer" style={{ color: "#374151" }}>
                      Advanced: error correction and margin
                    </summary>
                    <div className="mt-4 grid sm:grid-cols-2 gap-4">
                      <Field
                        label="Error correction"
                        hint={logoImg ? "Locked to H while a logo is used." : "Higher levels survive more damage but make a denser code."}
                      >
                        <select
                          className={inputCls}
                          value={effectiveEcc}
                          disabled={!!logoImg}
                          onChange={(e) => setEcc(e.target.value)}
                        >
                          {ECC_LEVELS.map((l) => (
                            <option key={l.v} value={l.v}>
                              {l.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Margin (quiet zone)">
                        <select
                          className={inputCls}
                          value={margin}
                          onChange={(e) => setMargin(Number(e.target.value))}
                        >
                          {MARGINS.map((m) => (
                            <option key={m.v} value={m.v}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </details>

                  {/* Bulk */}
                  {(type === "url" || type === "text") && (
                    <details className="faq-item rounded-xl p-4">
                      <summary className="text-sm font-semibold cursor-pointer" style={{ color: "#374151" }}>
                        Bulk QR codes (one per line, download as ZIP)
                      </summary>
                      <div className="mt-4 space-y-3">
                        <textarea
                          rows={5}
                          className={inputCls}
                          placeholder={type === "url" ? "example.com/page-1\nexample.com/page-2" : "First text\nSecond text"}
                          value={bulkText}
                          onChange={(e) => setBulkText(e.target.value)}
                        />
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>
                          {bulkLines.length} / {MAX_BULK} lines. Uses your colors, logo, format, and size settings.
                        </p>
                        <button
                          type="button"
                          onClick={handleBulk}
                          disabled={!bulkLines.length || !!bulkBusy}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2"
                          style={actionBtnStyle(!bulkLines.length || !!bulkBusy)}
                        >
                          <Download className="w-4 h-4" />
                          {bulkBusy || "Download ZIP"}
                        </button>
                      </div>
                    </details>
                  )}
                </div>

                {/* ── RIGHT: preview and download ── */}
                <div className="md:col-span-2 md:sticky md:top-6 self-start">
                  <p className="mb-3" style={sectionLabelStyle}>
                    Preview
                  </p>
                  <div className="flex flex-col items-center">
                    <div
                      className={`qr-canvas-wrap rounded-2xl p-4 w-full flex justify-center ${isGenerated ? "active scale-pop" : ""}`}
                    >
                      {qrText ? (
                        <canvas
                          ref={previewRef}
                          className="rounded-xl"
                          style={{
                            width: "100%",
                            maxWidth: 280,
                            height: "auto",
                            display: error ? "none" : "block",
                          }}
                        />
                      ) : (
                        <div
                          className="qr-placeholder-wrap rounded-xl flex flex-col items-center justify-center gap-3"
                          style={{ width: "100%", maxWidth: 280, aspectRatio: "1 / 1" }}
                        >
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{
                              background: "rgba(99,102,241,0.08)",
                              border: "1px solid rgba(99,102,241,0.15)",
                            }}
                          >
                            <QrCode className="w-8 h-8" style={{ color: "#6366F1" }} />
                          </div>
                          <p className="text-sm text-center px-6" style={{ color: "#A5B4FC" }}>
                            {REQUIRED_HINT[type]}
                          </p>
                        </div>
                      )}
                    </div>

                    {isGenerated && (
                      <div className="ready-pill flex items-center gap-2 mt-4 px-4 py-2 rounded-full">
                        <span
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ background: "#6366F1" }}
                        />
                        <span className="text-sm font-semibold" style={{ color: "#6366F1" }}>
                          QR code ready!
                        </span>
                      </div>
                    )}
                  </div>

                  {error && (
                    <p className="mt-3 text-xs text-center" style={{ color: "#B91C1C" }} role="alert">
                      {error}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <Field label="Format">
                      <select
                        className={inputCls}
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                      >
                        {Object.entries(FORMATS).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Size">
                      <select
                        className={inputCls}
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                      >
                        {SIZES.map((s) => (
                          <option key={s} value={s}>
                            {s} × {s} px
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {format === "svg" && frameOn && (
                    <p className="mt-2 text-xs" style={{ color: "#B45309" }}>
                      The frame and label are included in PNG, JPG, and WebP downloads, not in SVG.
                    </p>
                  )}
                  {format === "jpeg" && transparent && !frameOn && (
                    <p className="mt-2 text-xs" style={{ color: "#B45309" }}>
                      JPG has no transparency, so a white background is used.
                    </p>
                  )}

                  <button
                    onClick={handleDownload}
                    disabled={!isGenerated}
                    className="download-btn w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base mt-4"
                  >
                    <Download className="w-5 h-5" />
                    Download QR Code ({FORMATS[format].label})
                  </button>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <button
                      type="button"
                      onClick={handleCopy}
                      disabled={!isGenerated}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2"
                      style={actionBtnStyle(!isGenerated)}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied" : "Copy image"}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2"
                      style={actionBtnStyle(false)}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>

                  <p className="mt-4 text-xs text-center" style={{ color: "#9CA3AF" }}>
                    Always test-scan your QR code with a phone before printing.
                  </p>
                </div>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-8">
                {[
                  "No signup",
                  "Unlimited use",
                  "Files not stored",
                  "No tracking",
                  "100% free",
                ].map((t, i) => (
                  <span
                    key={i}
                    className="text-xs flex items-center gap-1.5"
                    style={{ color: "#9CA3AF" }}
                  >
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ background: "#A5B4FC" }}
                    />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="mid-divider" />
        <section className="main-section py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl font-bold text-center mb-12"
              style={{ color: "#1a1a2e" }}
            >
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  num: "1",
                  title: "Choose a Type and Enter Your Data",
                  desc: "Pick URL, text, WiFi, vCard, email, phone, SMS, WhatsApp, or location, then fill in the fields.",
                },
                {
                  num: "2",
                  title: "Customize and Preview",
                  desc: "QR code generates live as you type. Change colors, add a logo or frame, and check it in real time.",
                },
                {
                  num: "3",
                  title: "Download & Share",
                  desc: "Save as PNG, SVG, JPG, or WebP. Print it on materials or use it digitally anywhere.",
                },
              ].map((s, i) => (
                <div key={i} className="step-card rounded-2xl p-7 text-center">
                  <div className="step-num w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg text-white">
                    {s.num}
                  </div>
                  <h3
                    className="font-bold text-base mb-2"
                    style={{ color: "#1a1a2e" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6B7280" }}
                  >
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT (Enhanced Internal Linking) ── */}
        <hr className="mid-divider" />

        <section className="alt-section py-16 px-6">
          <div
            className="max-w-3xl mx-auto space-y-8"
            style={{ color: "#6B7280" }}
          >
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Why You Need a Free Online QR Code Generator
              </h2>

              <p className="leading-7 text-sm">
                QR codes are the fastest way to share digital content in the
                physical world. Instead of asking someone to type a long URL,
                remember a WiFi password, or manually save a contact, a single
                scan does it all instantly. If you need to prepare text for a
                document first, our{" "}
                <NextLink href="/text-to-pdf" className={LINK_CLS}>
                  Text to PDF
                </NextLink>{" "}
                tool can help. New to QR codes? Read our{" "}
                <NextLink
                  href="/blog/how-to-generate-qr-code-online-free"
                  className={LINK_CLS}
                >
                  step-by-step guide to generating a QR code online for free
                </NextLink>
                .
              </p>

              <p className="leading-7 text-sm mt-3">
                This QR Code Generator lets you enter your content and generate
                a QR code in your browser. Type or paste a website URL, text, or
                another supported value, then download your QR code. Designing a
                flyer or business card around it? Fill the layout with{" "}
                <NextLink href="/lorem-ipsum" className={LINK_CLS}>
                  Lorem Ipsum placeholder text
                </NextLink>{" "}
                first, and pick brand-matching shades with the{" "}
                <NextLink href="/color-picker" className={LINK_CLS}>
                  color picker
                </NextLink>
                .
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Free QR Code Generator With No Sign Up, No Tracking and No Redirect
              </h2>
              <p className="leading-7 text-sm">
                <Rich parts={seoNoSignup1} />
              </p>
              <p className="leading-7 text-sm mt-3">
                <Rich parts={seoNoSignup2} />
              </p>
            </div>

            <div>
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#1a1a2e" }}
              >
                What Is a QR Code?
              </h3>

              <p className="leading-7 text-sm">
                A QR code (Quick Response code) is a scannable two-dimensional
                barcode that can direct a smartphone to digital content. It can
                contain URLs, WiFi credentials, messaging links, email
                addresses, plain text, or contact information, depending on the
                QR code generator's supported features.
              </p>
            </div>

            <div>
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#1a1a2e" }}
              >
                How to Convert a Link to a QR Code
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoLink} />
              </p>
            </div>

            <div>
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#1a1a2e" }}
              >
                Static vs Dynamic QR Codes: Which One Do You Need?
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoStatic} />
              </p>
            </div>

            <div>
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#1a1a2e" }}
              >
                WiFi QR Code Generator: Let Guests Connect With One Scan
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoWifi} />
              </p>
            </div>

            <div>
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#1a1a2e" }}
              >
                vCard QR Code Generator for Business Cards and Events
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoVcard} />
              </p>
            </div>

            <div>
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#1a1a2e" }}
              >
                WhatsApp, Email, SMS, Phone and Location QR Codes
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoMore} />
              </p>
            </div>

            <div>
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#1a1a2e" }}
              >
                Customize Your QR Code: Colors, Logo, Frame and Error Correction
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoCustom} />
              </p>
            </div>

            <div>
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#1a1a2e" }}
              >
                PNG, SVG, JPG or WebP: Which QR Code Format Should You Download?
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoFormat} />
              </p>
            </div>

            <div className="seo-box rounded-2xl p-6">
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Optimizing Media and Documents for QR Codes
              </h3>

              <p className="leading-7 text-sm mb-3">
                When creating QR codes that link to online images or documents,
                use a reliable, publicly accessible URL and ensure the linked
                content loads quickly on mobile devices. If you want to create a
                PDF from text, you can use our{" "}
                <NextLink href="/text-to-pdf" className={LINK_CLS}>
                  Text to PDF
                </NextLink>{" "}
                tool. For linked images, shrink the file size with the{" "}
                <NextLink href="/image-compressor" className={LINK_CLS}>
                  image compressor
                </NextLink>{" "}
                and set the right dimensions with the{" "}
                <NextLink href="/image-resizer" className={LINK_CLS}>
                  image resizer
                </NextLink>{" "}
                so the page opens fast after the scan.
              </p>
            </div>

            <div className="seo-box rounded-2xl p-6">
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Common Problems This Tool Solves
              </h3>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  <>Share a website URL without people typing it manually</>,
                  <>
                    Let guests connect to WiFi by scanning a QR code, with a
                    strong network key from the{" "}
                    <NextLink href="/password-gen" className={LINK_CLS}>
                      password generator
                    </NextLink>
                  </>,
                  <>
                    Share a messaging link on a business card or flyer, created
                    with the{" "}
                    <NextLink href="/whatsapp-link-generator" className={LINK_CLS}>
                      WhatsApp link generator
                    </NextLink>
                  </>,
                  <>Share contact details at events with a vCard QR code</>,
                  <>Add QR codes to restaurant menus</>,
                  <>
                    Link product packaging to instructional videos or websites
                  </>,
                  <>Turn a link into a QR code that never expires</>,
                  <>Match your brand with custom colors and a center logo</>,
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="feature-dot w-1.5 h-1.5 rounded-full shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="seo-box rounded-2xl p-6">
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Features
              </h3>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Free to use, no sign up",
                  "URL, text, WiFi, vCard, email, phone, SMS, WhatsApp, and location QR codes",
                  "Live preview as you type",
                  "PNG, SVG, JPG, and WebP download",
                  "Custom colors, center logo, and frame with label",
                  "Error correction levels L, M, Q, and H",
                  "Sizes up to 2048 px for print",
                  "Copy the QR code image to your clipboard",
                  "Bulk QR codes as a ZIP file",
                  "Works on mobile and desktop browsers",
                  "Download QR codes without watermarks",
                  "Generated in your browser, nothing is uploaded",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="feature-dot w-1.5 h-1.5 rounded-full shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#1a1a2e" }}
              >
                Free QR Codes for Business, Menus and Flyers
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoPrint} />
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="mid-divider" />
        <section className="main-section py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-3xl font-bold text-center mb-10"
              style={{ color: "#1a1a2e" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="faq-item rounded-xl p-5">
                  <summary className="flex items-center justify-between gap-4">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: "#374151" }}
                    >
                      {faq.q}
                    </span>
                    <ChevronDown
                      className="w-4 h-4 shrink-0"
                      style={{ color: "#6366F1" }}
                    />
                  </summary>
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: "#6B7280" }}
                  >
                    <Rich parts={faq.a} />
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="mid-divider" />
        <section className="alt-section py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl font-bold mb-5 text-center"
              style={{ color: "#1a1a2e" }}
            >
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Image to Text", href: "/image-to-text" },
                { name: "Image Compressor", href: "/image-compressor" },
                { name: "Image Converter", href: "/image-converter" },
                { name: "Text to PDF", href: "/text-to-pdf" },
                {
                  name: "WhatsApp Link Generator",
                  href: "/whatsapp-link-generator",
                },
                { name: "JSON Formatter", href: "/json-formatter" },
                { name: "Password Generator", href: "/password-gen" },
                { name: "Color Picker", href: "/color-picker" },
                { name: "Background Remover", href: "/background-remover" },
              ].map((tool, i) => (
                <NextLink
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border hover:border-rose-400 transition"
                  style={{
                    color: "#9f1239",
                    borderColor: "#FDA4AF",
                    background: "#fff",
                  }}
                >
                  {tool.name}
                </NextLink>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section py-20 px-6 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
              Ready to create your QR code?
            </h2>
            <p
              className="mb-8 text-base"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Takes less than 10 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="cta-main-btn text-white text-base px-10 py-4 rounded-xl inline-flex items-center gap-2"
            >
              <QrCode className="w-5 h-5" /> Generate QR Code Now
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
















































// "use client";

// import { useState, useEffect, useRef } from "react";
// import QRCode from "qrcode";
// import {
//   Link as LucideLink,
//   Wifi,
//   MessageCircle,
//   Download,
//   QrCode,
//   ChevronDown,
// } from "lucide-react";
// import Script from "next/script";
// import NextLink from "next/link";
// import "@/styles/QrGenerator.css";

// /* ── FAQ data (Expanded with Internal Links) ── */

// const faqs = [
//   {
//     q: "Is the QR Code Generator free?",
//     a: "Yes — completely free with no signup or hidden costs. Generate QR codes directly in your browser.",
//   },
//   {
//     q: "What types of QR codes can I create?",
//     a: (
//       <span>
//         You can generate QR codes for URLs, plain text, WiFi passwords, and
//         messaging links. If you need to prepare text for a document, try our{" "}
//         <NextLink
//           href="/text-to-pdf"
//           className="text-indigo-600 hover:underline font-medium"
//         >
//           Text to PDF
//         </NextLink>{" "}
//         tool.
//       </span>
//     ),
//   },
//   {
//     q: "Do I need to install anything?",
//     a: "No installation is needed. The QR Code Generator works directly in your browser on compatible phones, tablets, and desktop computers.",
//   },
//   {
//     q: "Can I use QR codes for printing?",
//     a: (
//       <span>
//         Yes. You can download your QR code as a PNG image for posters, flyers,
//         business cards, product packaging, and restaurant menus. If you need to
//         optimize images for your projects, try our{" "}
//         <NextLink
//           href="/image-compressor"
//           className="text-indigo-600 hover:underline font-medium"
//         >
//           Image Compressor
//         </NextLink>
//         .
//       </span>
//     ),
//   },
//   {
//     q: "Is my data private?",
//     a: "Your QR code input is processed in your browser if the tool uses client-side generation. Avoid encoding sensitive information in QR codes that other people can scan.",
//   },
//   {
//     q: "Can I create a QR code for a WhatsApp link?",
//     a: (
//       <span>
//         Yes. Enter your WhatsApp chat link into the URL field and generate a QR
//         code. If you need help creating a chat link, try our{" "}
//         <NextLink
//           href="/whatsapp-link-generator"
//           className="text-indigo-600 hover:underline font-medium"
//         >
//           WhatsApp Link Generator
//         </NextLink>{" "}
//         if that tool is available on your website.
//       </span>
//     ),
//   },
//   {
//     q: "How can I share text or image data via QR code?",
//     a: (
//       <span>
//         You can enter plain text directly into the QR Code Generator. If the
//         text is inside an image, extract it using our{" "}
//         <NextLink
//           href="/image-to-text"
//           className="text-indigo-600 hover:underline font-medium"
//         >
//           Image to Text (OCR)
//         </NextLink>{" "}
//         tool, then paste the extracted text into the generator.
//       </span>
//     ),
//   },
//   {
//     q: "Can I create a QR code that links to an image?",
//     a: (
//       <span>
//         Yes. Use a publicly accessible image URL to create a QR code. You can
//         prepare images with our{" "}
//         <NextLink
//           href="/image-compressor"
//           className="text-indigo-600 hover:underline font-medium"
//         >
//           Image Compressor
//         </NextLink>{" "}
//         or convert image formats using our{" "}
//         <NextLink
//           href="/image-converter"
//           className="text-indigo-600 hover:underline font-medium"
//         >
//           Image Converter
//         </NextLink>
//         .
//       </span>
//     ),
//   },
//   {
//     q: "How do I handle complex URLs or encoded parameters in QR codes?",
//     a: (
//       <span>
//         Enter the complete URL into the QR Code Generator and test the resulting
//         QR code. If you need to format JSON data before sharing it, try our{" "}
//         <NextLink
//           href="/json-formatter"
//           className="text-indigo-600 hover:underline font-medium"
//         >
//           JSON Formatter
//         </NextLink>{" "}
//         tool.
//       </span>
//     ),
//   },
//   {
//     q: "Can I create a QR code for PDF documents?",
//     a: (
//       <span>
//         Yes. Upload your PDF to a hosting service and use its shareable URL to
//         generate a QR code. You can also create a PDF from text using our{" "}
//         <NextLink
//           href="/text-to-pdf"
//           className="text-indigo-600 hover:underline font-medium"
//         >
//           Text to PDF
//         </NextLink>{" "}
//         tool.
//       </span>
//     ),
//   },
// ];

// export default function QRGenerator() {
//   const [text, setText] = useState("");
//   const [isGenerated, setIsGenerated] = useState(false);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (text && canvasRef.current) {
//       QRCode.toCanvas(
//         canvasRef.current,
//         text,
//         { width: 280, margin: 2, color: { dark: "#1E1B4B", light: "#ffffff" } },
//         (error) => {
//           if (error) console.error(error);
//           else setIsGenerated(true);
//         },
//       );
//     } else {
//       setIsGenerated(false);
//     }
//   }, [text]);

//   const handleDownload = () => {
//     if (!canvasRef.current) return;
//     const src = canvasRef.current;
//     const out = document.createElement("canvas");
//     const pad = 24;
//     out.width = src.width + pad * 2;
//     out.height = src.height + pad * 2;
//     const ctx = out.getContext("2d");
//     ctx.fillStyle = "#ffffff";
//     ctx.fillRect(0, 0, out.width, out.height);
//     ctx.drawImage(src, pad, pad);
//     const url = out.toDataURL("image/png");
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "qrcode-convertlinx.png";
//     a.click();
//   };

//   return (
//     <>
//       {/* ── SCHEMA: HowTo ── */}
//       <Script
//         id="howto-schema-qr"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Create a QR Code Online for Free",
//             description:
//               "Generate QR codes for URLs, text, WiFi, WhatsApp, and contact cards in seconds — free, private, no signup.",
//             url: "https://convertlinx.com/qr-generator",
//             totalTime: "PT30S",
//             estimatedCost: {
//               "@type": "MonetaryAmount",
//               value: "0",
//               currency: "USD",
//             },
//             supply: [
//               {
//                 "@type": "HowToSupply",
//                 name: "No files needed — works in browser",
//               },
//             ],
//             tool: [
//               { "@type": "HowToTool", name: "ConvertLinx QR Code Generator" },
//             ],
//             step: [
//               {
//                 "@type": "HowToStep",
//                 name: "Enter Your Data",
//                 text: "Type or paste a URL, text, WiFi details, WhatsApp link, or contact information into the input field.",
//               },
//               {
//                 "@type": "HowToStep",
//                 name: "Instant Preview",
//                 text: "The QR code generates live as you type — no button needed.",
//               },
//               {
//                 "@type": "HowToStep",
//                 name: "Download & Share",
//                 text: "Click Download QR Code to save a high-quality PNG. Print it or use it digitally.",
//               },
//             ],
//           }),
//         }}
//       />

//       {/* ── SCHEMA: FAQPage ── */}
//       <Script
//         id="faq-schema-qr"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "FAQPage",
//             mainEntity: faqs.map((faq) => ({
//               "@type": "Question",
//               name: faq.q,
//               acceptedAnswer: {
//                 "@type": "Answer",
//                 text: typeof faq.a === "string" ? faq.a : faq.q,
//               },
//             })),
//           }),
//         }}
//       />

//       <main className="qr-page">
//         {/* ── HERO ── */}
//         <section className="hero-bg py-16 px-6 text-center">
//           <div className="hero-blob-1" />
//           <div className="hero-blob-2" />
//           <div className="relative z-10 max-w-3xl mx-auto">
//             <div className="flex items-center justify-center gap-2 text-sm mb-6">
//               <a href="/" className="breadcrumb-link">
//                 Home
//               </a>
//               <span style={{ color: "#C4B5FD" }}>/</span>
//               <span style={{ color: "#6366F1" }}>QR Code Generator</span>
//             </div>
//             <span className="badge-pill inline-block px-4 py-1.5 rounded-full mb-5">
//               Free Tool
//             </span>
//             <h1
//               className="text-4xl md:text-5xl font-extrabold leading-tight mb-4"
//               style={{ color: "#1a1a2e" }}
//             >
//               QR Code <span className="grad-text">Generator</span>
//             </h1>
//             <p
//               className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
//               style={{ color: "#6B7280" }}
//             >
//               Create QR codes for URLs, WiFi passwords, WhatsApp links, contact
//               cards, and plain text — instantly in your browser. High-quality
//               PNG download, 100% private, no signup required.
//             </p>
//             <div className="flex flex-wrap justify-center gap-2 mt-5">
//               {[
//                 "No signup needed",
//                 "URLs · WiFi · WhatsApp · vCard",
//                 "High-res PNG download",
//                 "Unlimited use",
//                 "100% private",
//               ].map((t, i) => (
//                 <span
//                   key={i}
//                   className="badge-pill px-3 py-1 rounded-full text-xs"
//                 >
//                   {t}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── TOOL WORKSPACE ── */}
//         <section className="main-section py-10 px-6">
//           <div className="max-w-2xl mx-auto fade-up">
//             <div className="tool-card rounded-3xl p-8 md:p-10">
//               <label
//                 className="block mb-3"
//                 style={{
//                   color: "#6366F1",
//                   fontSize: "11px",
//                   fontWeight: 700,
//                   letterSpacing: "0.09em",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 Enter your content
//               </label>

//               <input
//                 type="text"
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Paste a URL, type text, WiFi password..."
//                 className="qr-input w-full px-5 py-4 rounded-xl text-base mb-7"
//               />

//               {/* QR Preview */}
//               <div className="flex flex-col items-center mb-7">
//                 <div
//                   className={`qr-canvas-wrap rounded-2xl p-5 ${isGenerated ? "active scale-pop" : ""}`}
//                 >
//                   {text ? (
//                     <canvas ref={canvasRef} className="rounded-xl block" />
//                   ) : (
//                     <div className="qr-placeholder-wrap w-70 h-70 rounded-xl flex flex-col items-center justify-center gap-3">
//                       <div
//                         className="w-16 h-16 rounded-2xl flex items-center justify-center"
//                         style={{
//                           background: "rgba(99,102,241,0.08)",
//                           border: "1px solid rgba(99,102,241,0.15)",
//                         }}
//                       >
//                         <QrCode
//                           className="w-8 h-8"
//                           style={{ color: "#6366F1" }}
//                         />
//                       </div>
//                       <p
//                         className="text-sm text-center px-8"
//                         style={{ color: "#A5B4FC" }}
//                       >
//                         Your QR code will appear here
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {isGenerated && (
//                   <div className="ready-pill flex items-center gap-2 mt-4 px-4 py-2 rounded-full">
//                     <span
//                       className="w-2 h-2 rounded-full animate-pulse"
//                       style={{ background: "#6366F1" }}
//                     />
//                     <span
//                       className="text-sm font-semibold"
//                       style={{ color: "#6366F1" }}
//                     >
//                       QR code ready!
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Download */}
//               <button
//                 onClick={handleDownload}
//                 disabled={!isGenerated}
//                 className="download-btn w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base"
//               >
//                 <Download className="w-5 h-5" />
//                 Download QR Code (PNG)
//               </button>

//               {/* Trust row */}
//               <div className="flex flex-wrap justify-center gap-5 mt-5">
//                 {[
//                   "No signup",
//                   "Unlimited use",
//                   "Files not stored",
//                   "100% free",
//                 ].map((t, i) => (
//                   <span
//                     key={i}
//                     className="text-xs flex items-center gap-1.5"
//                     style={{ color: "#9CA3AF" }}
//                   >
//                     <span
//                       className="w-1 h-1 rounded-full"
//                       style={{ background: "#A5B4FC" }}
//                     />
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── HOW IT WORKS ── */}
//         <hr className="mid-divider" />
//         <section className="main-section py-16 px-6">
//           <div className="max-w-4xl mx-auto">
//             <h2
//               className="text-3xl font-bold text-center mb-12"
//               style={{ color: "#1a1a2e" }}
//             >
//               3 Simple Steps
//             </h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {[
//                 {
//                   num: "1",
//                   title: "Enter Your Data",
//                   desc: "Type or paste a URL, text, WiFi details, WhatsApp link, or contact info into the input field.",
//                 },
//                 {
//                   num: "2",
//                   title: "Instant Preview",
//                   desc: "QR code generates live as you type — no button needed. See it appear in real time.",
//                 },
//                 {
//                   num: "3",
//                   title: "Download & Share",
//                   desc: "Save as high-quality PNG. Print it on materials or use it digitally anywhere.",
//                 },
//               ].map((s, i) => (
//                 <div key={i} className="step-card rounded-2xl p-7 text-center">
//                   <div className="step-num w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg text-white">
//                     {s.num}
//                   </div>
//                   <h3
//                     className="font-bold text-base mb-2"
//                     style={{ color: "#1a1a2e" }}
//                   >
//                     {s.title}
//                   </h3>
//                   <p
//                     className="text-sm leading-relaxed"
//                     style={{ color: "#6B7280" }}
//                   >
//                     {s.desc}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── SEO CONTENT ── */}

//         {/* ── SEO CONTENT (Enhanced Internal Linking) ── */}
//         <hr className="mid-divider" />

//         <section className="alt-section py-16 px-6">
//           <div
//             className="max-w-3xl mx-auto space-y-8"
//             style={{ color: "#6B7280" }}
//           >
//             <div>
//               <h2
//                 className="text-2xl font-bold mb-4"
//                 style={{ color: "#1a1a2e" }}
//               >
//                 Why You Need a Free Online QR Code Generator
//               </h2>

//               <p className="leading-7 text-sm">
//                 QR codes are the fastest way to share digital content in the
//                 physical world. Instead of asking someone to type a long URL,
//                 remember a WiFi password, or manually save a contact, a single
//                 scan does it all instantly. If you need to prepare text for a
//                 document first, our{" "}
//                 <NextLink
//                   href="/text-to-pdf"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Text to PDF
//                 </NextLink>{" "}
//                 tool can help. New to QR codes? Read our{" "}
//                 <NextLink
//                   href="/blog/how-to-generate-qr-code-online-free"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   step-by-step guide to generating a QR code online for free
//                 </NextLink>
//                 .
//               </p>

//               <p className="leading-7 text-sm mt-3">
//                 This QR Code Generator lets you enter your content and generate
//                 a QR code in your browser. Type or paste a website URL, text, or
//                 another supported value, then download your QR code. Designing a
//                 flyer or business card around it? Fill the layout with{" "}
//                 <NextLink
//                   href="/lorem-ipsum"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Lorem Ipsum placeholder text
//                 </NextLink>{" "}
//                 first, and pick brand-matching shades with the{" "}
//                 <NextLink
//                   href="/color-picker"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   color picker
//                 </NextLink>
//                 .
//               </p>
//             </div>

//             <div>
//               <h3
//                 className="font-bold text-lg mb-3"
//                 style={{ color: "#1a1a2e" }}
//               >
//                 What Is a QR Code?
//               </h3>

//               <p className="leading-7 text-sm">
//                 A QR code (Quick Response code) is a scannable two-dimensional
//                 barcode that can direct a smartphone to digital content. It can
//                 contain URLs, WiFi credentials, messaging links, email
//                 addresses, plain text, or contact information, depending on the
//                 QR code generator's supported features.
//               </p>
//             </div>

//             <div className="seo-box rounded-2xl p-6">
//               <h3
//                 className="font-bold text-lg mb-4"
//                 style={{ color: "#1a1a2e" }}
//               >
//                 Optimizing Media and Documents for QR Codes
//               </h3>

//               <p className="leading-7 text-sm mb-3">
//                 When creating QR codes that link to online images or documents,
//                 use a reliable, publicly accessible URL and ensure the linked
//                 content loads quickly on mobile devices. If you want to create a
//                 PDF from text, you can use our{" "}
//                 <NextLink
//                   href="/text-to-pdf"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Text to PDF
//                 </NextLink>{" "}
//                 tool. For linked images, shrink the file size with the{" "}
//                 <NextLink
//                   href="/image-compressor"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   image compressor
//                 </NextLink>{" "}
//                 and set the right dimensions with the{" "}
//                 <NextLink
//                   href="/image-resizer"
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   image resizer
//                 </NextLink>{" "}
//                 so the page opens fast after the scan.
//               </p>
//             </div>

//             <div className="seo-box rounded-2xl p-6">
//               <h3
//                 className="font-bold text-lg mb-4"
//                 style={{ color: "#1a1a2e" }}
//               >
//                 Common Problems This Tool Solves
//               </h3>

//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   <>Share a website URL without people typing it manually</>,
//                   <>
//                     Let guests connect to WiFi by scanning a QR code, with a
//                     strong network key from the{" "}
//                     <NextLink
//                       href="/password-gen"
//                       className="text-indigo-600 hover:underline font-medium"
//                     >
//                       password generator
//                     </NextLink>
//                   </>,
//                   <>
//                     Share a messaging link on a business card or flyer, created
//                     with the{" "}
//                     <NextLink
//                       href="/whatsapp-link-generator"
//                       className="text-indigo-600 hover:underline font-medium"
//                     >
//                       WhatsApp link generator
//                     </NextLink>
//                   </>,
//                   <>Share contact details at events</>,
//                   <>Add QR codes to restaurant menus</>,
//                   <>
//                     Link product packaging to instructional videos or websites
//                   </>,
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="feature-dot w-1.5 h-1.5 rounded-full shrink-0" />
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="seo-box rounded-2xl p-6">
//               <h3
//                 className="font-bold text-lg mb-4"
//                 style={{ color: "#1a1a2e" }}
//               >
//                 Features
//               </h3>

//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   "Free to use",
//                   "Generate QR codes for supported content",
//                   "Live preview as you type",
//                   "PNG download",
//                   "Compatible with QR-scanning devices",
//                   "Works on supported mobile and desktop browsers",
//                   "Download QR codes without watermarks, if supported",
//                   "Privacy depends on the tool's data processing",
//                 ].map((feature, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="feature-dot w-1.5 h-1.5 rounded-full shrink-0" />
//                     <span>{feature}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── FAQ ── */}
//         <hr className="mid-divider" />
//         <section className="main-section py-16 px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2
//               className="text-3xl font-bold text-center mb-10"
//               style={{ color: "#1a1a2e" }}
//             >
//               Frequently Asked Questions
//             </h2>
//             <div className="space-y-3">
//               {faqs.map((faq, i) => (
//                 <details key={i} className="faq-item rounded-xl p-5">
//                   <summary className="flex items-center justify-between gap-4">
//                     <span
//                       className="font-semibold text-sm"
//                       style={{ color: "#374151" }}
//                     >
//                       {faq.q}
//                     </span>
//                     <ChevronDown
//                       className="w-4 h-4 shrink-0"
//                       style={{ color: "#6366F1" }}
//                     />
//                   </summary>
//                   <p
//                     className="mt-3 text-sm leading-relaxed"
//                     style={{ color: "#6B7280" }}
//                   >
//                     {faq.a}
//                   </p>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── RELATED TOOLS ── */}
//         <hr className="mid-divider" />
//         <section className="alt-section py-14 px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2
//               className="text-2xl font-bold mb-5 text-center"
//               style={{ color: "#1a1a2e" }}
//             >
//               You may also find these free tools helpful
//             </h2>
//             <div className="flex flex-wrap justify-center gap-3">
//               {[
//                 { name: "Image to Text", href: "/image-to-text" },
//                 { name: "Image Compressor", href: "/image-compressor" },
//                 { name: "Image Converter", href: "/image-converter" },
//                 { name: "Text to PDF", href: "/text-to-pdf" },
//                 {
//                   name: "WhatsApp Link Generator",
//                   href: "/whatsapp-link-generator",
//                 },
//                 { name: "JSON Formatter", href: "/json-formatter" },
//               ].map((tool, i) => (
//                 <NextLink
//                   key={i}
//                   href={tool.href}
//                   className="px-4 py-2 rounded-full text-sm font-medium border hover:border-rose-400 transition"
//                   style={{
//                     color: "#9f1239",
//                     borderColor: "#FDA4AF",
//                     background: "#fff",
//                   }}
//                 >
//                   {tool.name}
//                 </NextLink>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── CTA ── */}
//         <section className="cta-section py-20 px-6 text-center">
//           <div className="max-w-xl mx-auto">
//             <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
//               Ready to create your QR code?
//             </h2>
//             <p
//               className="mb-8 text-base"
//               style={{ color: "rgba(255,255,255,0.7)" }}
//             >
//               Takes less than 10 seconds. No signup. No ads.
//             </p>
//             <button
//               onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//               className="cta-main-btn text-white text-base px-10 py-4 rounded-xl inline-flex items-center gap-2"
//             >
//               <QrCode className="w-5 h-5" /> Generate QR Code Now
//             </button>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }
