"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Download,
  FileText,
  Type,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
// import Script from 'next/script';
import "@/styles/TextToPdf.css";

const SITE = "https://convertlinx.com";
const PAGE_URL = `${SITE}/text-to-pdf`;

const JsonLd = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
);

const faqs = [
  {
    q: "Is Text to PDF free?",
    a: "Yes — completely free with unlimited conversions and downloads.",
  },
  {
    q: "Can I format text before converting?",
    a: "Yes — edit or paste your content before clicking convert.",
  },
  {
    q: "Does it support long text?",
    a: "Yes — it automatically handles multiple pages for any length of content.",
  },
  {
    q: "Is my text stored anywhere?",
    a: "No — your text is used only to generate the PDF. Nothing is stored.",
  },
  {
    q: "Can I use this on mobile?",
    a: "Yes — works perfectly on phones, tablets, and desktops.",
  },
  {
    q: "Will my PDF look professional?",
    a: "Yes — the tool formats text with clean layout, proper margins, and readable spacing.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Convert Text to PDF Online for Free",
  description:
    "Create a PDF from plain text instantly in your browser, free and with no signup.",
  url: PAGE_URL,
  totalTime: "PT20S",
  estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
  step: [
    {
      "@type": "HowToStep",
      name: "Paste It In",
      text: "Type or paste your resume, notes, letter, or any text into the box.",
    },
    {
      "@type": "HowToStep",
      name: "Review Your Text",
      text: "Your text is formatted with proper spacing and margins automatically.",
    },
    {
      "@type": "HowToStep",
      name: "Grab Your PDF",
      text: "Click Download as PDF and your file is saved instantly.",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function TextToPDF() {
  const [text, setText] = useState("");

  const generatePDF = () => {
    if (!text.trim()) {
      alert("Please enter some text first!");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);

    const margin = 20;
    const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    const lines = doc.splitTextToSize(text, maxWidth);

    let y = 20;
    lines.forEach((line) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 7;
    });

    doc.save("my-text-document.pdf");
  };

  return (
    <>
      {/* <Script id="howto-schema-text-pdf" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert Text to PDF Online for Free",
            description: "Create PDF from plain text instantly.",
            url: "https://convertlinx.com/text-to-pdf",
            step: [
              { "@type": "HowToStep", name: "Paste Text",    text: "Type or paste your text." },
              { "@type": "HowToStep", name: "Click Convert", text: "Click Download as PDF button." },
              { "@type": "HowToStep", name: "Download",      text: "PDF downloads instantly." }
            ],
            totalTime: "PT20S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
          }, null, 2),
        }}
      /> */}
      <JsonLd data={howToSchema} />
      <JsonLd data={faqSchema} />

      <main className="tp-page">
        {/* ── HERO ── */}
        <section className="tp-hero">
          <div className="tp-blob-1" />
          <div className="tp-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="tp-breadcrumb-link">
                Home
              </a>
              <span style={{ color: "#C4B5FD" }}>/</span>
              <span style={{ color: "#2563EB" }}>Text to PDF</span>
            </div>
            <span className="tp-badge">Free Tool</span>
            <h1
              className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2"
              style={{ color: "#1a1a2e" }}
            >
              Text to <span className="tp-grad-text">PDF Converter</span>
            </h1>
            <p
              className="text-base md:text-lg max-w-xl mx-auto leading-relaxed"
              style={{ color: "#6B7280" }}
            >
              Turn your notes, letters, or any text into a clean, professional
              PDF — instantly, free, no watermark.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="tp-section-main py-10 px-6">
          <div className="max-w-2xl mx-auto tp-fade-up">
            <div className="tp-tool-card">
              {/* Label */}
              <label
                className="flex items-center gap-2 mb-3"
                style={{
                  color: "#2563EB",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                }}
              >
                <Type className="w-4 h-4" />
                Your Text
              </label>

              {/* Textarea */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your resume, notes, letter, story, or anything else here..."
                className="tp-textarea"
                spellCheck="true"
              />

              {/* Char count */}
              <div className="tp-char-count">{text.length} characters</div>

              {/* Download button */}
              <div className="text-center mt-6">
                <button
                  onClick={generatePDF}
                  disabled={!text.trim()}
                  className="tp-dl-btn"
                >
                  <Download className="w-5 h-5" />
                  Download as PDF
                </button>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-7">
                {[
                  "No account needed",
                  "Unlimited conversions",
                  "No watermark",
                  "Browser-only",
                  "100% free",
                ].map((t, i) => (
                  <span key={i} className="tp-trust-item">
                    <span className="tp-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="tp-divider" />
        <section className="tp-section-alt py-16 px-6">
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
                  icon: <FileText className="w-6 h-6" />,
                  color: "#2563EB",
                  bg: "rgba(37,99,235,0.08)",
                  title: "Looks Pro Every Time",
                  desc: "Clean layout, proper margins — perfect for resumes, letters, or any document you want to impress with.",
                },
                {
                  icon: <Type className="w-6 h-6" />,
                  color: "#4F46E5",
                  bg: "rgba(79,70,229,0.08)",
                  title: "Any Text Welcome",
                  desc: "Short note or long story — handles multiple pages automatically, no sweat.",
                },
                {
                  icon: <CheckCircle className="w-6 h-6" />,
                  color: "#10B981",
                  bg: "rgba(16,185,129,0.08)",
                  title: "Quick & Private",
                  desc: "Runs entirely in your browser — nothing leaves your device, free forever.",
                },
              ].map((b, i) => (
                <div key={i} className="tp-benefit-card">
                  <div
                    className="tp-benefit-icon"
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
        <hr className="tp-divider" />
        <section className="tp-section-main py-16 px-6">
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
                  title: "Paste It In",
                  desc: "Dump whatever text you have — resume, notes, letter, code snippets, anything.",
                },
                {
                  num: "2",
                  title: "We Do the Magic",
                  desc: "Text gets neatly formatted with proper spacing and flow — looks sharp instantly.",
                },
                {
                  num: "3",
                  title: "Grab Your PDF",
                  desc: "Click download — ready to print, email, or archive.",
                },
              ].map((s, i) => (
                <div key={i} className="tp-step-card">
                  <div className="tp-step-num">{s.num}</div>
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
        <hr className="tp-divider" />
        <section className="tp-section-alt py-16 px-6">
          <div
            className="max-w-3xl mx-auto space-y-8"
            style={{ color: "#6B7280" }}
          >
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Free Text to PDF Converter — ConvertLinx
              </h2>
              <p className="leading-7 text-sm">
                The{" "}
                <span style={{ color: "#1a1a2e", fontWeight: 600 }}>
                  Convertlinx Text to PDF
                </span>{" "}
                tool converts plain text into clean, professional PDFs instantly
                — no signup, no watermark, no limits.
              </p>
            </div>
            <div>
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Who Should Use This?
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Students — assignments, notes & essays",
                  "Job seekers — resumes & cover letters",
                  "Office professionals — reports & letters",
                  "Writers & bloggers — export content as PDF",
                  "Anyone — quick text to printable document",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span
                      className="font-bold mt-0.5"
                      style={{ color: "#2563EB" }}
                    >
                      →
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="tp-seo-box">
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "#1a1a2e" }}
              >
                Features
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Free, unlimited conversions",
                  "Clean professional PDF formatting",
                  "Handles short & long text",
                  "Auto multi-page support",
                  "Instant download",
                  "Works on mobile & desktop",
                  "No signup, no watermark",
                  "Nothing stored — full privacy",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="tp-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="tp-divider" />
        <section className="tp-section-main py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl font-bold text-center mb-10"
              style={{ color: "#1a1a2e" }}
            >
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="tp-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: "#374151" }}
                    >
                      {faq.q}
                    </span>
                    <ChevronDown
                      className="w-4 h-4 shrink-0"
                      style={{ color: "#2563EB" }}
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
        <section className="tp-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to create your PDF?
            </h2>
            <p
              className="mb-8 text-base"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Takes 5 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="tp-cta-btn"
            >
              <FileText className="w-5 h-5" />
              Convert Now
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
