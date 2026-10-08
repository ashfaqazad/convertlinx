"use client";

import { useState } from "react";
import {
  Download,
  Youtube,
  Copy,
  CheckCircle,
  Zap,
  ChevronDown,
} from "lucide-react";
import Script from "next/script";
import "@/styles/YouTubeThumb.css";

export default function YouTubeThumbnailDownloader() {
  const [url, setUrl] = useState("");
  const [thumbs, setThumbs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const download = () => {
    setLoading(true);
    const videoId = extractVideoId(url);
    if (!videoId) {
      alert("Invalid YouTube URL! Paste a valid video link.");
      setLoading(false);
      return;
    }
    const qualities = [
      {
        name: "Max Resolution (1920×1080)",
        url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      },
      {
        name: "HD Quality (1280×720)",
        url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      },
      {
        name: "Medium Quality (640×480)",
        url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      },
      {
        name: "Standard Quality (480×360)",
        url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      },
      {
        name: "Default (120×90)",
        url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      },
    ];
    setThumbs(qualities);
    setLoading(false);
  };

  const copyUrl = (imageUrl) => {
    navigator.clipboard.writeText(imageUrl);
    setCopied(imageUrl);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <>
      <Script
        id="howto-schema-yt"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Download YouTube Thumbnail in HD",
              description:
                "Download any YouTube video thumbnail in full HD quality instantly.",
              url: "https://convertlinx.com/youtube-thumbnail",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Paste URL",
                  text: "Copy and paste YouTube video URL.",
                },
                {
                  "@type": "HowToStep",
                  name: "Get Thumbnails",
                  text: "Press Get Thumbnails button.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download",
                  text: "Save your preferred quality.",
                },
              ],
              totalTime: "PT20S",
              estimatedCost: {
                "@type": "MonetaryAmount",
                value: "0",
                currency: "USD",
              },
            },
            null,
            2,
          ),
        }}
      />

      <Script
        id="faq-schema-yt"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is the YouTube Thumbnail Downloader free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes — completely free with unlimited downloads and no hidden charges.",
                },
              },
              {
                "@type": "Question",
                name: "What thumbnail qualities can I download?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You can download Max (1920×1080), HD (1280×720), Medium, Standard and Default thumbnail sizes.",
                },
              },
              {
                "@type": "Question",
                name: "How do I download a thumbnail?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Paste the YouTube video URL, click Get Thumbnails, then download the thumbnail size you want.",
                },
              },
              {
                "@type": "Question",
                name: "Can I use this on mobile?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes — the tool works on phones, tablets and desktop browsers.",
                },
              },
            ],
          }),
        }}
      />

      <main className="yt-page">
        {/* ── HERO ── */}
        <section className="yt-hero">
          <div className="yt-blob-1" />
          <div className="yt-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="yt-breadcrumb-link">
                Home
              </a>
              <span style={{ color: "#C4B5FD" }}>/</span>
              <span style={{ color: "#6366F1" }}>YouTube Thumbnail</span>
            </div>
            <span className="yt-badge">Free Tool</span>
            <h1
              className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2"
              style={{ color: "#1a1a2e" }}
            >
              YouTube Thumbnail <span className="yt-grad-text">Downloader</span>
            </h1>
            <p
              className="text-base md:text-lg max-w-xl mx-auto leading-relaxed"
              style={{ color: "#6B7280" }}
            >
              Download any YouTube video thumbnail in HD — instantly, free, no
              signup required.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="yt-section-main py-10 px-6">
          <div className="max-w-3xl mx-auto yt-fade-up">
            <div className="yt-tool-card">
              <label
                className="block mb-3"
                style={{
                  color: "#6366F1",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                }}
              >
                Paste YouTube Video URL
              </label>

              {/* Input + Button Row */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && url && download()}
                  placeholder="https://youtube.com/watch?v=..."
                  className="yt-input flex-1"
                />
                <button
                  onClick={download}
                  disabled={loading || !url}
                  className="yt-get-btn"
                >
                  <Youtube className="w-5 h-5" />
                  {loading ? "Loading..." : "Get Thumbnails"}
                </button>
              </div>

              {/* Thumbnails Grid */}
              {thumbs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {thumbs.map((thumb, i) => (
                    <div key={i} className="yt-thumb-card">
                      <img
                        src={thumb.url}
                        alt={thumb.name}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                      <div className="p-4 text-center">
                        <p className="yt-thumb-name">{thumb.name}</p>
                        <div className="flex justify-center gap-2">
                          <a href={thumb.url} download className="yt-dl-btn">
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                          <button
                            onClick={() => copyUrl(thumb.url)}
                            className={`yt-copy-btn ${copied === thumb.url ? "copied" : ""}`}
                          >
                            {copied === thumb.url ? (
                              <>
                                <CheckCircle className="w-4 h-4" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" /> Copy URL
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {[
                  "No signup",
                  "Unlimited downloads",
                  "No watermark",
                  "100% free",
                ].map((t, i) => (
                  <span key={i} className="yt-trust-item">
                    <span className="yt-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="yt-divider" />
        <section className="yt-section-alt py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-2xl font-bold text-center mb-10"
              style={{ color: "#1a1a2e" }}
            >
              Why Use ConvertLinx?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Youtube className="w-6 h-6" />,
                  color: "#DC2626",
                  bg: "rgba(220,38,38,0.08)",
                  title: "All Qualities",
                  desc: "Max (1920×1080), HD (1280×720), Medium, Standard — every size available.",
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  color: "#F59E0B",
                  bg: "rgba(245,158,11,0.08)",
                  title: "Instant & Easy",
                  desc: "Paste URL — thumbnails appear instantly. Download or copy URL.",
                },
                {
                  icon: <CheckCircle className="w-6 h-6" />,
                  color: "#10B981",
                  bg: "rgba(16,185,129,0.08)",
                  title: "Free & No Limits",
                  desc: "Unlimited downloads. No signup, no watermark, works everywhere.",
                },
              ].map((b, i) => (
                <div key={i} className="yt-benefit-card">
                  <div
                    className="yt-benefit-icon"
                    style={{ background: b.bg, color: b.color }}
                  >
                    {b.icon}
                  </div>
                  <h3
                    className="font-bold text-base mb-2"
                    style={{ color: "#1a1a2e" }}
                  >
                    {b.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6B7280" }}
                  >
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW TO ── */}
        <hr className="yt-divider" />
        <section className="yt-section-main py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl font-bold text-center mb-12"
              style={{ color: "#1a1a2e" }}
            >
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  num: "1",
                  title: "Paste Video URL",
                  desc: "Copy any YouTube video link and paste it into the input box.",
                },
                {
                  num: "2",
                  title: "Get Thumbnails",
                  desc: "All available thumbnail sizes appear instantly below.",
                },
                {
                  num: "3",
                  title: "Download or Copy",
                  desc: "Download your preferred quality or copy the direct image URL.",
                },
              ].map((s, i) => (
                <div key={i} className="yt-step-card">
                  <div className="yt-step-num">{s.num}</div>
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

        {/* ── SEO CONTENT ── */}
        <hr className="yt-divider" />
        <section className="yt-section-alt py-16 px-6">
          <div
            className="max-w-3xl mx-auto space-y-8"
            style={{ color: "#6B7280" }}
          >
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Free YouTube Thumbnail Downloader — ConvertLinx
              </h2>
              <p className="leading-7 text-sm">
                The <strong>Convertlinx YouTube Thumbnail Downloader</strong>{" "}
                lets you
                <strong>download YouTube thumbnails</strong> instantly in
                multiple resolutions. You can extract{" "}
                <strong>HD YouTube thumbnails</strong>, preview images, and save
                thumbnails from any video link. This{" "}
                <strong>online YouTube thumbnail downloader</strong> works
                without signup or watermark and supports
                <strong>max resolution thumbnails (1920×1080)</strong>, HD,
                medium and standard sizes.
              </p>
            </div>

            <div>
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#1a1a2e" }}
              >
                Who Should Use This?
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "YouTube Creators — backup & redesigns",
                  "Designers — inspiration & mockups",
                  "Marketers — campaign previews",
                  "Bloggers — video embed images",
                  "Anyone — quick thumbnail saves",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span
                      className="font-bold mt-0.5"
                      style={{ color: "#DC2626" }}
                    >
                      →
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="yt-seo-box">
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Features
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Free with unlimited downloads",
                  "Max, HD, Medium, Standard sizes",
                  "Instant thumbnail preview",
                  "Download or copy direct URL",
                  "Works on mobile & desktop",
                  "No signup, no watermark",
                  "Fast & lightweight",
                  "Nothing stored — full privacy",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="yt-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Related Tools (Tailwind) */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-5">
              <p className="text-sm font-semibold text-slate-700 mb-3">
                You may also find these free tools helpful:
              </p>

              <div className="flex flex-wrap gap-2">
                {/* <a href="/qr-generator" className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition">
      QR Generator
    </a> */}

                {/* <a href="/password-gen" className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition">
      Password Generator
    </a> */}

                <a
                  href="/image-resizer"
                  className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
                >
                  Image Resizer
                </a>

                {/* <a href="/image-to-text" className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition">
      Image to Text
    </a> */}

                <a
                  href="/image-cropper"
                  className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
                >
                  Image Cropper
                </a>

                <a
                  href="/image-converter"
                  className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
                >
                  Image Converter
                </a>

                <a
                  href="/signature-maker"
                  className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
                >
                  Signature Maker
                </a>

                <a
                  href="/unit-converter"
                  className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition"
                >
                  Unit Converter
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="yt-divider" />
        <section className="yt-section-main py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl font-bold text-center mb-10"
              style={{ color: "#1a1a2e" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                {
                  q: "Is the YouTube Thumbnail Downloader free?",
                  a: "Yes — completely free with unlimited downloads and no hidden charges.",
                },
                {
                  q: "What thumbnail qualities can I download?",
                  a: "Max (1920×1080), HD (1280×720), Medium (640×480), Standard (480×360), and Default — depending on what the video provides.",
                },
                {
                  q: "How do I download a thumbnail?",
                  a: "Paste the YouTube video URL, click Get Thumbnails, then download your preferred quality.",
                },
                {
                  q: "Can I use this on mobile?",
                  a: "Yes — works perfectly on phones, tablets, and desktops.",
                },
                {
                  q: "Do you store the URLs?",
                  a: "No — the URL is only used to fetch thumbnail links. Nothing is stored.",
                },
                {
                  q: "Why is Max/HD not available for some videos?",
                  a: "Some videos do not have a max-resolution thumbnail uploaded by the creator, so only lower sizes are available.",
                },
              ].map((faq, i) => (
                <details key={i} className="yt-faq-item">
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
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="yt-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to download thumbnails?
            </h2>
            <p
              className="mb-8 text-base"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Takes 5 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="yt-cta-btn"
            >
              <Youtube className="w-5 h-5" />
              Download Now
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
