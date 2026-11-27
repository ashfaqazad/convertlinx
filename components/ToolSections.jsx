"use client";

// Page sections shared by the date and currency tools, in the same order and
// style as the Unit Converter page.
import { Fragment, useState } from "react";
import Link from "next/link";
import { ChevronDown, Copy, Check } from "lucide-react";
import "@/styles/UnitConverter.css";
import "@/styles/DateCurrency.css";

const HEADING = { color: "#1a1a2e" };
const MUTED = { color: "#6B7280" };
const ACCENT = { color: "var(--dc-main)" };

// Turns **bold** and [anchor text](/path) inside content strings into elements
function Rich({ text }) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) return <Link key={i} href={link[2]} className="dc-link">{link[1]}</Link>;
    if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    return part;
  });
}

function ListBox({ title, items }) {
  return (
    <div className="uc-seo-box">
      <h3 className="font-bold text-lg mb-4" style={HEADING}>{title}</h3>
      <ul className="grid sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2.5">
            <span className="uc-feature-dot" />
            <span><Rich text={item} /></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ToolHero({ crumb, title, accent, intro }) {
  return (
    <section className="uc-hero py-16 px-6 text-center">
      <div className="uc-blob-1" />
      <div className="uc-blob-2" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm mb-6">
          <Link href="/" className="uc-breadcrumb-link">Home</Link>
          <span style={ACCENT}>/</span>
          <span style={ACCENT}>{crumb}</span>
        </nav>
        <span className="uc-badge mb-5">Free Tool</span>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 mt-5" style={HEADING}>
          {title} {accent && <span className="uc-grad-text">{accent}</span>}
        </h1>
        <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={MUTED}>{intro}</p>
      </div>
    </section>
  );
}

export function CopyButton({ text }) {
  const [state, setState] = useState("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 1800);
  };

  return (
    <button type="button" onClick={copy} className="dc-copy">
      {state === "copied" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      <span aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy"}
      </span>
    </button>
  );
}

export function Block({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-3" style={HEADING}>{title}</h2>
      {children}
    </div>
  );
}

export function ToolSections({ benefits, steps, related, content, ctaTitle, ctaText, children }) {
  const { sections, uses, who, features, faqs } = content;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />

      <hr className="uc-divider" />
      <section className="uc-section-alt py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10" style={HEADING}>Why Use ConvertLinx?</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {benefits.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="uc-benefit-card">
                <div className="uc-benefit-icon" style={{ background: `${color}14`, color }}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base mb-2" style={HEADING}>{title}</h3>
                <p className="text-sm leading-relaxed" style={MUTED}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="uc-divider" />
      <section className="uc-section-main py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={HEADING}>How to Use</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s} className="uc-step-card">
                <div className="uc-step-num">{i + 1}</div>
                <p className="text-sm leading-relaxed" style={MUTED}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="uc-divider" />
      <section className="uc-section-alt py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8 text-sm leading-7" style={MUTED}>
          {sections.map((section, index) => (
            <Fragment key={section.title}>
            <Block title={section.title}>
              {section.paras.map((p) => (
                <p key={p} className="mb-3"><Rich text={p} /></p>
              ))}
              {section.list && (
                <ul className="list-disc pl-5">
                  {section.list.map((item) => <li key={item}><Rich text={item} /></li>)}
                </ul>
              )}
            </Block>
            {index === 0 && children}
            </Fragment>
          ))}
          <ListBox title="Common Uses" items={uses} />
          <ListBox title="Who Should Use This?" items={who} />
          <ListBox title="Features" items={features} />
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-5">
            <p className="text-sm font-semibold text-slate-700 mb-3">
              You may also find these free tools helpful:
            </p>
            <div className="flex flex-wrap gap-2">
              {related.map(([href, label]) => (
                <Link key={href} href={href} className="dc-chip">{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="uc-divider" />
      <section className="uc-section-main py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10" style={HEADING}>Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="uc-faq-item">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: "#374151" }}>{faq.q}</span>
                  <ChevronDown className="w-4 h-4 shrink-0" style={ACCENT} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={MUTED}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="uc-cta-section">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">{ctaTitle}</h2>
          <p className="mb-8 text-base" style={{ color: "rgba(255,255,255,0.7)" }}>{ctaText}</p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="uc-cta-btn">
            Back to the Tool
          </button>
        </div>
      </section>
    </>
  );
}
