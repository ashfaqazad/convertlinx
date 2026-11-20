import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  AudioLines,
  Check,
  Code2,
  FileText,
  Image as ImageIcon,
  Laptop,
  Lock,
  Mail,
  Server,
  Smartphone,
  Wrench,
  Zap,
} from "lucide-react";

const chips = [
  "Image Converter",
  "Background Remover",
  "QR Code Generator",
  "Image to Text",
  "Audio Converter",
  "MP4 to MP3",
  "Video Compressor",
  "Signature Maker",
  "JSON Formatter",
  "Text to PDF",
  "Password Generator",
  "Favicon Generator",
];

const categories = [
  {
    icon: ImageIcon,
    title: "Images",
    tone: "bg-indigo-50 text-indigo-600",
    links: [
      { label: "Image Converter", href: "/image-converter" },
      { label: "Background Remover", href: "/background-remover" },
      { label: "Image Compressor", href: "/image-compressor" },
      { label: "Image Resizer", href: "/image-resizer" },
    ],
  },
  {
    icon: FileText,
    title: "Text & documents",
    tone: "bg-violet-50 text-violet-600",
    links: [
      { label: "Image to Text (OCR)", href: "/image-to-text" },
      { label: "Text to PDF", href: "/text-to-pdf" },
      { label: "Text to Speech", href: "/text-to-speech" },
      { label: "Word Counter", href: "/word-counter" },
    ],
  },
  {
    icon: AudioLines,
    title: "Audio & video",
    tone: "bg-rose-50 text-rose-600",
    links: [
      { label: "Audio Converter", href: "/audio-converter" },
      { label: "MP4 to MP3", href: "/mp4-to-mp3" },
      { label: "Video Compressor", href: "/video-compressor" },
    ],
  },
  {
    icon: Code2,
    title: "Developers",
    tone: "bg-sky-50 text-sky-600",
    links: [
      { label: "JSON Formatter", href: "/json-formatter" },
      { label: "Base64 Tool", href: "/base64-tool" },
      { label: "Regex Tester", href: "/regex-tester" },
    ],
  },
  {
    icon: Lock,
    title: "Everyday",
    tone: "bg-emerald-50 text-emerald-600",
    links: [
      { label: "QR Code Generator", href: "/qr-generator" },
      { label: "Password Generator", href: "/password-gen" },
      { label: "Signature Maker", href: "/signature-maker" },
    ],
  },
  {
    icon: Wrench,
    title: "Web & SEO",
    tone: "bg-amber-50 text-amber-600",
    links: [
      { label: "Favicon Generator", href: "/favicon-generator" },
      { label: "Meta Tag Generator", href: "/metatag-generator" },
      { label: "OG Preview Checker", href: "/og-preview-checker" },
    ],
  },
];

const timeline = [
  {
    title: "The problem",
    text: "Quick jobs like a QR code, an image conversion or a compressed file kept running into sign-up walls, heavy ads and slow pages.",
  },
  {
    title: "The decision",
    text: "Build the tool that should have existed: one clean place for practical utilities that respect your time.",
  },
  {
    title: "The approach",
    text: "Add a tool only when people genuinely need it. Keep each one simple, fast and honest about how it works.",
  },
  {
    title: "Today",
    text: "A growing library of 35+ free tools, improved continuously and shaped by feedback from the people who use them.",
  },
];

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About ConvertLinx",
    description:
      "ConvertLinx is a free collection of fast, privacy-minded online tools for images, documents, audio, video and everyday tasks.",
    url: "https://convertlinx.com/about",
    publisher: {
      "@type": "Organization",
      name: "ConvertLinx",
      url: "https://convertlinx.com",
    },
  };

  return (
    <>
      <Script
        id="aboutpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-white text-slate-600">
        {/* ───────── Hero ───────── */}
        <section className="relative isolate overflow-hidden">
          {/* grid + glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 [background-image:linear-gradient(to_right,rgba(100,116,139,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.10)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
          />
          <div
            aria-hidden="true"
            className="absolute -top-40 left-1/2 -z-10 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-indigo-300/30 blur-[110px]"
          />

          <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:pt-28">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Free online tools · No sign-up
              </p>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
                Small tools.
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent">
                  Zero friction.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
                ConvertLinx is where you convert, compress, extract and create
                without creating an account first. Fast pages, honest tools
                and your files kept as private as possible.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
                >
                  Browse all tools
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Talk to us
                </Link>
              </div>
            </div>
          </div>

          {/* chip strip */}
          <div className="border-y border-slate-100 bg-slate-50/70">
            <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-5">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                >
                  {c}
                </span>
              ))}
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                + many more
              </span>
            </div>
          </div>
        </section>

        {/* ───────── Bento ───────── */}
        <section className="mx-auto max-w-6xl px-4 py-24">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Built around how you actually work
            </h2>
            <p className="mt-3 text-slate-600">
              Four ideas shape every tool on the site.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-6">
            {/* Privacy (large) */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-8 shadow-sm md:col-span-4">
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl"
              />
              <h3 className="relative text-2xl font-semibold text-slate-900">
                Your files can stay on your device
              </h3>
              <p className="relative mt-3 max-w-xl leading-relaxed text-slate-600">
                Many tools run entirely inside your browser, so your photos and
                files are not uploaded to our servers. If a tool does need
                server processing, we say so clearly on that page.
              </p>

              <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <Laptop className="h-4 w-4" />
                    In your browser
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    File stays with you. Result is created locally.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Server className="h-4 w-4" />
                    Only when required
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Clearly disclosed on the tool page.
                  </p>
                </div>
              </div>
            </div>

            {/* Free */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:col-span-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Check className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">
                Free, for real
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                No sign-up, no trial timers and no watermark on your results.
              </p>
            </div>

            {/* Fast */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:col-span-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Zap className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">
                Fast by default
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Light pages and short workflows, so small jobs stay small.
              </p>
            </div>

            {/* Any device */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:col-span-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Smartphone className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">
                Works on any device
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Phone, tablet or laptop. Open the page and start.
              </p>
            </div>

            {/* Clean */}
            <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-8 shadow-sm md:col-span-2">
              <h3 className="text-xl font-semibold text-slate-900">
                Clean and honest
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                No clutter between you and the download button. What a tool
                does is exactly what the page says it does.
              </p>
            </div>
          </div>
        </section>

        {/* ───────── Story timeline ───────── */}
        <section className="border-y border-slate-100 bg-slate-50/70">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                Our story
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Made by someone who needed these tools
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                ConvertLinx is built and maintained by an independent
                developer. Every decision comes from using these tools in real
                life, not from a growth dashboard.
              </p>
            </div>

            <ol className="relative space-y-8 border-l border-slate-200 pl-8 lg:col-span-3">
              {timeline.map((t) => (
                <li key={t.title} className="relative">
                  <span className="absolute -left-[39px] top-1.5 h-3 w-3 rounded-full border-2 border-indigo-500 bg-white" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    {t.title}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-slate-600">
                    {t.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── Tools directory ───────── */}
        <section className="mx-auto max-w-6xl px-4 py-24">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              What you can do here
            </h2>
            <p className="mt-3 text-slate-600">
              A few of the most-used tools, by category.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ icon: Icon, title, tone, links }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                </div>
                <ul className="mt-4 space-y-1.5">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-indigo-700"
                      >
                        {l.label}
                        <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ───────── CTA ───────── */}
        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-10 text-center shadow-sm sm:p-14">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-indigo-200/50 blur-3xl"
            />
            <h2 className="relative text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Missing a tool? Found a bug?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-slate-600">
              New tools are added based on real needs. Tell us what would save
              you time. Every message gets read.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
              >
                <Mail className="h-4 w-4" />
                Contact us
              </Link>
              <a
                href="mailto:support@convertlinx.com"
                className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline"
              >
                support@convertlinx.com
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
