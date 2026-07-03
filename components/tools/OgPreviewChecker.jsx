'use client';

import { useState, useMemo } from 'react';
import { Eye, Copy, Check, AlertCircle, CheckCircle2, Shield, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/OgPreviewChecker.css';
import Link from 'next/link';

const SAMPLE_HTML = `<title>ConvertLinx — Free Online Converter & Utility Tools</title>
<meta name="description" content="Free online tools to convert, compress, and edit images, PDFs, text and more.">
<meta property="og:title" content="ConvertLinx — Free Online Tools">
<meta property="og:description" content="Convert, compress, and edit files online for free.">
<meta property="og:image" content="https://convertlinx.com/og-image.png">
<meta property="og:url" content="https://convertlinx.com">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">`;

function parseMetaTags(html) {
  if (typeof window === 'undefined' || !html.trim()) return null;
  const parser = new DOMParser();
  // Wrap so fragments without <html>/<head> still parse reliably
  const doc = parser.parseFromString(`<html><head>${html}</head></html>`, 'text/html');

  const getMeta = (attr, value) => {
    const el = doc.querySelector(`meta[${attr}="${value}"]`);
    return el ? el.getAttribute('content') : '';
  };

  return {
    title: doc.querySelector('title')?.textContent || '',
    description: getMeta('name', 'description'),
    ogTitle: getMeta('property', 'og:title'),
    ogDescription: getMeta('property', 'og:description'),
    ogImage: getMeta('property', 'og:image'),
    ogUrl: getMeta('property', 'og:url'),
    ogType: getMeta('property', 'og:type'),
    ogSiteName: getMeta('property', 'og:site_name'),
    twitterCard: getMeta('name', 'twitter:card'),
    twitterTitle: getMeta('name', 'twitter:title'),
    twitterDescription: getMeta('name', 'twitter:description'),
    twitterImage: getMeta('name', 'twitter:image'),
  };
}

export default function OgPreviewChecker() {
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);

  const data = useMemo(() => parseMetaTags(html), [html]);

  const fbTitle = data?.ogTitle || data?.title || '';
  const fbDesc = data?.ogDescription || data?.description || '';
  const fbImage = data?.ogImage || '';
  const fbUrl = data?.ogUrl || '';

  const twTitle = data?.twitterTitle || fbTitle;
  const twDesc = data?.twitterDescription || fbDesc;
  const twImage = data?.twitterImage || fbImage;

  const checklist = data ? [
    { label: 'Page Title', ok: !!data.title, tip: 'Add a <title> tag — used as fallback when og:title is missing.' },
    { label: 'Meta Description', ok: !!data.description, tip: 'Add <meta name="description"> for search snippets.' },
    { label: 'og:title', ok: !!data.ogTitle, tip: 'Without this, most platforms fall back to <title>, which is often too long.' },
    { label: 'og:description', ok: !!data.ogDescription, tip: 'Controls the preview text on Facebook, LinkedIn, WhatsApp, Slack.' },
    { label: 'og:image', ok: !!data.ogImage, tip: 'Missing this means link previews show no image at all — the #1 preview issue.' },
    { label: 'og:url', ok: !!data.ogUrl, tip: 'Should be the canonical URL of the page being shared.' },
    { label: 'og:type', ok: !!data.ogType, tip: 'Usually "website" or "article" — helps platforms categorize the content.' },
    { label: 'twitter:card', ok: !!data.twitterCard, tip: 'Set to "summary_large_image" for a full-width image preview on X/Twitter.' },
  ] : [];

  const missingCount = checklist.filter((c) => !c.ok).length;

  const suggestedSnippet = data ? `<title>${data.title || 'Your Page Title'}</title>
<meta name="description" content="${data.description || 'Your page description here'}">
<meta property="og:title" content="${data.ogTitle || data.title || 'Your Page Title'}">
<meta property="og:description" content="${data.ogDescription || data.description || 'Your page description here'}">
<meta property="og:image" content="${data.ogImage || 'https://yourdomain.com/og-image.png'}">
<meta property="og:url" content="${data.ogUrl || 'https://yourdomain.com/page'}">
<meta property="og:type" content="${data.ogType || 'website'}">
<meta name="twitter:card" content="${data.twitterCard || 'summary_large_image'}">` : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(suggestedSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const faqs = [
    { q: 'Is the Open Graph Preview Checker free?', a: 'Yes — completely free, unlimited checks, no signup required.' },
    { q: 'Why do I need to paste HTML instead of entering a URL?', a: 'This tool runs entirely in your browser, and browsers block cross-site requests to other domains for security (CORS). Pasting your HTML avoids this limitation and keeps the tool 100% private — nothing is sent to a server.' },
    { q: 'Where do I get my page\'s HTML to paste here?', a: 'Open your live page, right-click and choose "View Page Source" (or press Ctrl+U), then copy the content inside the <head> tag — or the whole page source, since this tool automatically extracts the relevant tags.' },
    { q: 'Why is my link preview showing no image on Facebook or WhatsApp?', a: 'This almost always means the og:image tag is missing, points to a broken URL, or the image is too small. Most platforms require at least 200×200px, with 1200×630px recommended for the best display.' },
    { q: 'What is the difference between og:title and twitter:title?', a: 'og:title controls previews on Facebook, LinkedIn, WhatsApp, and Slack. twitter:title is used specifically by X/Twitter — if it\'s missing, Twitter automatically falls back to og:title.' },
    { q: 'Do I need both Open Graph and Twitter Card tags?', a: 'Open Graph tags alone cover most platforms including Twitter/X fallback behavior, but adding twitter:card explicitly ensures the larger "summary_large_image" layout instead of a small thumbnail.' },
    { q: 'Why does my preview show an old image after I updated og:image?', a: 'Most platforms cache link previews. Use each platform\'s debugging tool (like Facebook Sharing Debugger or LinkedIn Post Inspector) to force a re-scrape after making changes.' },
    { q: 'Is my pasted HTML uploaded anywhere?', a: 'No — parsing happens entirely in your browser using the native DOMParser API. Your HTML is never sent to or stored on any server.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-og"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Check and Preview Open Graph Tags for Free',
            description: 'Paste your page HTML and instantly preview how the link will look when shared on Facebook, LinkedIn, WhatsApp, and Twitter/X.',
            url: 'https://convertlinx.com/og-preview-checker',
            totalTime: 'PT10S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'HTML source or head section of a webpage' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Open Graph Preview Checker' }],
            step: [
              { '@type': 'HowToStep', name: 'Copy Your Page HTML', text: 'View source on your page and copy the HTML or head section.' },
              { '@type': 'HowToStep', name: 'Paste It Into the Tool', text: 'Paste the HTML — meta tags are extracted automatically.' },
              { '@type': 'HowToStep', name: 'Review the Preview & Checklist', text: 'See exactly how your link will look when shared, plus any missing tags.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-og"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Open Graph Preview Checker', item: 'https://convertlinx.com/og-preview-checker' },
            ],
          }),
        }}
      />

      <main className="og-page">

        {/* ── HERO ── */}
        <section className="og-hero">
          <div className="og-blob-1" />
          <div className="og-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="og-breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#059669' }}>Open Graph Preview Checker</span>
            </div>
            <span className="og-badge">Free Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Open Graph <span className="og-grad-text">Preview Checker</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              See exactly how your link will look when shared on Facebook, LinkedIn, WhatsApp,
              and Twitter/X — paste your HTML and get an instant preview plus a missing-tags
              checklist. No signup required.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="og-section-main py-10 px-6">
          <div className="max-w-3xl mx-auto og-fade-up">
            <div className="og-tool-card">

              {/* HTML Input */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-3">
                  <label style={{ color: '#059669', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                    Paste Page HTML or &lt;head&gt; Section
                  </label>
                  <button onClick={() => setHtml(SAMPLE_HTML)} className="og-sample-btn">
                    Load Example
                  </button>
                </div>
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  rows={7}
                  className="og-textarea"
                  placeholder="Paste your page's HTML source here — e.g. everything inside <head>...</head>"
                  spellCheck={false}
                />
                <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
                  Tip: View Page Source (Ctrl+U) on your live page, then copy and paste it here.
                </p>
              </div>

              {data && (
                <>
                  {/* Facebook / LinkedIn Preview */}
                  <div className="mt-7 mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>
                      Facebook / LinkedIn / WhatsApp Preview
                    </p>
                    <div className="og-social-card">
                      <div className="og-social-image">
                        {fbImage ? (
                          <img src={fbImage} alt="" onError={(e) => (e.target.style.display = 'none')} />
                        ) : (
                          <span className="og-no-image">No og:image found</span>
                        )}
                      </div>
                      <div className="og-social-body">
                        <p className="og-social-domain">{fbUrl ? new URL(fbUrl.startsWith('http') ? fbUrl : `https://${fbUrl}`).hostname.toUpperCase() : 'YOURDOMAIN.COM'}</p>
                        <p className="og-social-title">{fbTitle || 'Your page title will appear here'}</p>
                        <p className="og-social-desc">{fbDesc || 'Your page description will appear here'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Twitter/X Preview */}
                  <div className="mb-7">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>
                      Twitter / X Preview
                    </p>
                    <div className="og-social-card og-twitter-card">
                      <div className="og-social-image">
                        {twImage ? (
                          <img src={twImage} alt="" onError={(e) => (e.target.style.display = 'none')} />
                        ) : (
                          <span className="og-no-image">No image found</span>
                        )}
                      </div>
                      <div className="og-social-body">
                        <p className="og-social-title">{twTitle || 'Your page title will appear here'}</p>
                        <p className="og-social-desc">{twDesc || 'Your page description will appear here'}</p>
                        <p className="og-social-domain">{fbUrl ? new URL(fbUrl.startsWith('http') ? fbUrl : `https://${fbUrl}`).hostname : 'yourdomain.com'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="og-checklist-card mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#059669' }}>
                      Tag Checklist — {checklist.length - missingCount}/{checklist.length} Found
                    </p>
                    <div className="space-y-2.5">
                      {checklist.map((c, i) => (
                        <div key={i} className={`og-check-row ${c.ok ? 'ok' : 'missing'}`}>
                          {c.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                          <div>
                            <span className="og-check-label">{c.label}</span>
                            {!c.ok && <span className="og-check-tip"> — {c.tip}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested snippet */}
                  <div className="og-snippet-box">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#059669' }}>
                        Suggested Meta Tags
                      </p>
                      <button onClick={handleCopy} className="og-copy-btn">
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="og-code-block">{suggestedSnippet}</pre>
                  </div>
                </>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No signup', 'No CORS issues', 'Nothing stored', '100% free', 'Instant preview'].map((t, i) => (
                  <span key={i} className="og-trust-item">
                    <span className="og-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="og-divider" />
        <section className="og-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'View Page Source', desc: 'Open your live page, press Ctrl+U (or right-click → View Page Source), and copy the HTML.' },
                { num: '2', title: 'Paste It Here', desc: 'Drop the HTML into the box — meta tags are extracted and parsed automatically.' },
                { num: '3', title: 'Review & Fix', desc: 'See your social preview and a checklist of any missing or weak Open Graph tags.' },
              ].map((s, i) => (
                <div key={i} className="og-step-card">
                  <div className="og-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="og-divider" />
        <section className="og-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Eye className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'See It Before You Share It',
                  desc: 'Catch a missing image or broken title before you post a link publicly — not after.',
                },
                {
                  icon: <CheckCircle2 className="w-6 h-6" />,
                  color: '#0284C7',
                  bg: 'rgba(2,132,199,0.08)',
                  title: 'Clear Fix Checklist',
                  desc: 'Every missing or weak tag comes with a plain-English explanation of why it matters.',
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  color: '#6366F1',
                  bg: 'rgba(99,102,241,0.08)',
                  title: 'No CORS, No Server',
                  desc: 'Paste-based checking means it works for any site — even localhost or staging — with total privacy.',
                },
              ].map((b, i) => (
                <div key={i} className="og-benefit-card">
                  <div className="og-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="og-divider" />
        <section className="og-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Why Open Graph Tags Matter
              </h2>
              <p className="leading-7 text-sm">
                Open Graph tags control how a link looks when it's shared on Facebook, LinkedIn,
                WhatsApp, and Slack — the title, description, and image that appear in the preview
                card. Without them, platforms fall back to guessing content from the page, which
                often means no image, a cut-off title, or the wrong text entirely.
              </p>
              <p className="leading-7 text-sm mt-3">
                A broken or missing link preview can quietly hurt click-through rates on every post,
                ad, and shared link — since people are far less likely to click a link with no image
                or a confusing snippet next to it.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                Open Graph vs Twitter Card Tags
              </h3>
              <p className="leading-7 text-sm">
                Open Graph (<code>og:title</code>, <code>og:description</code>, <code>og:image</code>)
                is the standard used by Facebook, LinkedIn, WhatsApp, and most other platforms.
                Twitter/X uses its own <code>twitter:card</code> tags, but automatically falls back
                to Open Graph tags if Twitter-specific ones are missing — so adding both ensures the
                best possible preview everywhere, including the larger image layout on X.
              </p>
            </div>

            <div className="og-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Problems This Tool Solves
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Link preview shows no image on Facebook or WhatsApp',
                  'Wrong or outdated title/description appears when sharing',
                  'Twitter/X preview looks different from Facebook',
                  'Unsure which meta tags are actually missing',
                  'Need to check a site before it goes live (localhost/staging)',
                  'Social preview looks broken after a redesign or CMS migration',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="og-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Marketers — verify link previews before running a campaign',
                  'Developers — debug missing Open Graph tags after deployment',
                  'Bloggers — confirm every post has a proper share image',
                  'SEO specialists — audit meta tags across multiple pages',
                  'Agencies — QA client sites before launch',
                  'Anyone sharing links who wants them to look professional',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#059669' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="og-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Free, unlimited checks',
                  'Facebook/LinkedIn/WhatsApp-style preview',
                  'Twitter/X-style preview',
                  'Missing tag checklist with explanations',
                  'Auto-generated suggested meta tag snippet',
                  'One-click copy of the fixed tags',
                  'Works on mobile & desktop',
                  'No CORS issues — works on any site, even localhost',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="og-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Best Uses for This Tool
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Check a new blog post\'s share preview before publishing',
                  'Audit an existing site for missing og:image tags',
                  'Compare Facebook vs Twitter preview differences',
                  'Test staging or localhost pages before launch',
                  'Generate a corrected meta tag snippet to paste into your CMS',
                  'Verify tags after a site redesign or platform migration',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="og-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="og-divider" />
        <section className="og-section-main py-16 px-6">
          <Script
            id="faq-schema-og"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: { '@type': 'Answer', text: faq.a },
                })),
              }),
            }}
          />
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="og-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#059669' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="og-divider" />
        <section className="og-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Meta Tag Generator', href: '/metatag-generator' },
                { name: 'Favicon Generator', href: '/favicon-generator' },
                { name: 'WhatsApp Link Generator', href: '/whatsapp-link-generator' },
                { name: 'Word Counter', href: '/word-counter' },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ color: '#059669', borderColor: '#A7F3D0', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="og-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to check your link preview?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 10 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="og-cta-btn"
            >
              <Eye className="w-5 h-5" />
              Check Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}