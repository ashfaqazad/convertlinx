'use client';

import { useState } from 'react';
import { Upload, Download, Smartphone, Image as ImageIcon, CheckCircle, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/HeicToJpg.css';
import Link from 'next/link';

export default function HeicToJpg() {
  const [converted, setConverted] = useState([]);
  const [loading, setLoading] = useState(false);

  const convert = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    setLoading(true);
    setConverted([]);

    try {
      const heic2any = (await import('heic2any')).default;
      const results = [];

      for (const file of files) {
        const jpgBlob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.94 });
        results.push({
          name: file.name.replace(/\.heic$/i, '.jpg'),
          url: URL.createObjectURL(jpgBlob),
          originalName: file.name,
        });
      }
      setConverted(results);
    } catch (err) {
      console.error(err);
      alert('Conversion failed. Make sure you uploaded valid HEIC files and try again.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { q: 'Is HEIC to JPG conversion free?', a: 'Yes — completely free with unlimited conversions and downloads.' },
    { q: 'Can I convert multiple HEIC files at once?', a: 'Yes — batch conversion is supported. Upload multiple photos and convert them together.' },
    { q: 'Will JPG quality be reduced?', a: 'Conversion is optimized to keep photos sharp and clear. Quality depends on the original image.' },
    { q: 'Why does iPhone use HEIC?', a: 'HEIC saves storage while keeping high quality. But JPG is more compatible for sharing and uploads.' },
    { q: 'Are my photos stored anywhere?', a: 'No — your photos are used only to generate the converted output. Nothing is stored.' },
    { q: 'Can I use this on mobile?', a: 'Yes — works perfectly on iPhone, Android, tablets, and desktops.' },
    {
      q: 'Why are my HEIC photos not opening on Windows?',
      a: 'Many Windows devices and older apps do not fully support HEIC files by default. Converting HEIC to JPG makes your photos easier to open, upload, and share anywhere.',
    },
    {
      q: 'Can I convert iPhone photos to JPG for website uploads?',
      a: 'Yes — JPG is a more widely accepted format for websites, forms, school portals, and online marketplaces. Converting HEIC to JPG improves compatibility.',
    },
    {
      q: 'What is the difference between HEIC and JPG?',
      a: 'HEIC usually offers smaller file sizes with good quality, but JPG is more universal and supported by more devices, apps, and websites.',
    },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-heic"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Convert HEIC to JPG Online for Free',
            description:
              'Learn how to convert iPhone HEIC images to JPG online for free so they open on Windows, upload to websites, and share easily across devices.',
            url: 'https://convertlinx.com/heic-to-jpg',
            totalTime: 'PT30S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'HEIC or HEIF photo file' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx HEIC to JPG Converter' }],
            step: [
              { '@type': 'HowToStep', name: 'Upload HEIC photos', text: 'Select one or more HEIC or HEIF files from your iPhone, iPad, or computer.' },
              { '@type': 'HowToStep', name: 'Convert to JPG', text: 'The tool converts your Apple HEIC images into JPG format instantly in your browser.' },
              { '@type': 'HowToStep', name: 'Download JPG files', text: 'Download the converted JPG images individually and use them anywhere.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-heic"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'HEIC to JPG', item: 'https://convertlinx.com/heic-to-jpg' },
            ],
          }),
        }}
      />

      <main className="hj-page">

        {/* ── HERO ── */}
        <section className="hj-hero">
          <div className="hj-blob-1" />
          <div className="hj-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="hj-breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#C026D3' }}>HEIC to JPG</span>
            </div>
            <span className="hj-badge">iPhone Photos</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              HEIC to <span className="hj-grad-text">JPG Converter</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Convert HEIC to JPG online free — instantly change Apple HEIC photos into universally supported
              JPG files that open on Windows laptops, upload to websites, and share easily on WhatsApp, email,
              and online forms. Batch conversion supported. No signup required.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="hj-section-main py-10 px-6">
          <div className="max-w-2xl mx-auto hj-fade-up">
            <div className="hj-tool-card">

              <label className="block mb-3" style={{ color: '#C026D3', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                Upload HEIC Photos
              </label>

              <label className="hj-upload-area">
                <div className="hj-upload-icon">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
                  Drop HEIC photos here or click to browse
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                  Multiple files supported · Straight from iPhone or iPad
                </p>
                <input
                  type="file"
                  accept=".heic,.HEIC,.heif,.HEIF"
                  multiple
                  onChange={convert}
                  className="hidden"
                />
              </label>

              {loading && (
                <div className="text-center py-8 mt-4">
                  <div className="hj-spinner mb-3" />
                  <p className="text-sm font-semibold" style={{ color: '#C026D3' }}>Converting your photos...</p>
                </div>
              )}

              {!loading && converted.length > 0 && (
                <div className="mt-7">
                  <p className="text-sm font-bold uppercase tracking-widest mb-5 text-center" style={{ color: '#C026D3' }}>
                    {converted.length} {converted.length === 1 ? 'Photo' : 'Photos'} Ready
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {converted.map((item, i) => (
                      <div key={i} className="hj-result-card">
                        <img src={item.url} alt={item.name} className="w-full h-44 object-cover" />
                        <div className="p-4 text-center">
                          <p className="text-xs font-medium mb-3 truncate" style={{ color: '#374151' }}>{item.name}</p>
                          <a href={item.url} download={item.name} className="hj-dl-btn w-full justify-center">
                            <Download className="w-4 h-4" />
                            Download JPG
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No sign-up', 'Batch convert', 'Website upload friendly', 'Nothing stored', '100% free'].map((t, i) => (
                  <span key={i} className="hj-trust-item">
                    <span className="hj-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="hj-divider" />
        <section className="hj-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Drop Your Photos', desc: 'Pick one or multiple HEIC files from your iPhone, iPad, or computer.' },
                { num: '2', title: 'We Do the Work', desc: 'Conversion happens instantly in your browser — fast and smooth.' },
                { num: '3', title: 'Grab Your JPGs', desc: 'Download converted photos one by one — ready for anything.' },
              ].map((s, i) => (
                <div key={i} className="hj-step-card">
                  <div className="hj-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="hj-divider" />
        <section className="hj-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Smartphone className="w-6 h-6" />,
                  color: '#C026D3',
                  bg: 'rgba(192,38,211,0.08)',
                  title: 'Fix iPhone Photo Compatibility',
                  desc: 'HEIC photos often do not open properly on Windows PCs, older Android phones, or many websites. Convert them to JPG for universal support.',
                },
                {
                  icon: <ImageIcon className="w-6 h-6" />,
                  color: '#7C3AED',
                  bg: 'rgba(124,58,237,0.08)',
                  title: 'Batch Convert Multiple HEIC Files',
                  desc: 'Upload many iPhone photos together and convert them in one go instead of changing each HEIC image manually.',
                },
                {
                  icon: <CheckCircle className="w-6 h-6" />,
                  color: '#10B981',
                  bg: 'rgba(16,185,129,0.08)',
                  title: 'Best for Uploads and Sharing',
                  desc: 'JPG files are easier to upload in forms, attach in emails, share on WhatsApp, and use in editing tools without format issues.',
                },
              ].map((b, i) => (
                <div key={i} className="hj-benefit-card">
                  <div className="hj-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="hj-divider" />
        <section className="hj-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Why HEIC Photos Don't Open Everywhere
              </h2>
              <p className="leading-7 text-sm">
                HEIC is Apple's modern photo format that saves storage while keeping high image quality,
                but it is not supported everywhere. Many Windows laptops, websites, online forms,
                editing tools, and older devices do not handle HEIC files properly.
              </p>
              <p className="leading-7 text-sm mt-3">
                That is why people often need to convert HEIC to JPG before uploading iPhone photos,
                sending them by email, attaching them to school or office portals, or opening them on
                non-Apple devices. JPG is more universal and works almost everywhere.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                HEIC vs JPG — What's the Difference?
              </h3>
              <p className="leading-7 text-sm">
                HEIC files are usually smaller and more efficient, which is why iPhones use them by default.
                JPG files, however, are more widely supported across Windows computers, Android phones,
                browsers, websites, online forms, and editing apps. If your iPhone photos are not opening
                properly or not uploading correctly, converting HEIC to JPG is the easiest fix.
              </p>
            </div>

            <div className="hj-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Problems This Tool Solves
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'HEIC photos not opening on Windows PC',
                  'iPhone images not accepted on websites',
                  'HEIC files hard to share on WhatsApp or email',
                  'Need to convert multiple HEIC files quickly',
                  'Apple photos not working in document portals',
                  'Need JPG format for editing or uploading',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="hj-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'iPhone users — convert Apple photos to JPG for easier sharing',
                  'Windows users — open HEIC images on laptops and desktops',
                  'Students — upload iPhone photos to school forms and portals',
                  'Office teams — attach JPG images in emails, documents, and reports',
                  'Online sellers — upload compatible product images to websites',
                  'Everyone — change HEIC to JPG without installing apps',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#C026D3' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hj-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Free, unlimited conversions',
                  'iPhone & iPad HEIC supported',
                  'Batch conversion — multiple files',
                  'Fast results in seconds',
                  'High-quality JPG output',
                  'Simple drag & drop upload',
                  'Works on mobile & desktop',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="hj-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Best Uses for HEIC to JPG Conversion
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Convert iPhone photos to JPG for website uploads',
                  'Change HEIC to JPG for WhatsApp sharing',
                  'Open HEIC files on Windows without extra software',
                  'Convert Apple photos for email attachments',
                  'Use JPG images in online forms and portals',
                  'Prepare HEIC photos for editing tools and document use',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="hj-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="hj-divider" />
        <section className="hj-section-main py-16 px-6">
          <Script
            id="faq-schema-heic"
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
                <details key={i} className="hj-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#C026D3' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="hj-divider" />
        <section className="hj-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Image Converter', href: '/image-converter' },
                { name: 'Image Resizer', href: '/image-resizer' },
                { name: 'Image Cropper', href: '/image-cropper' },
                { name: 'Image to Text', href: '/image-to-text' },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ color: '#7C3AED', borderColor: '#D8B4FE', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="hj-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to convert your iPhone photos?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 5 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hj-cta-btn"
            >
              <Smartphone className="w-5 h-5" />
              Convert Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}










































// 'use client';

// import { useState, useEffect } from 'react';
// import { Upload, Download, Smartphone, Image as ImageIcon, CheckCircle, ChevronDown } from 'lucide-react';
// import Script from 'next/script';
// import '@/styles/HeicToJpg.css';
// import Link from "next/link";


// export default function HeicToJpg() {
//   const [converted, setConverted] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const convert = async (e) => {
//     const files = e.target.files;
//     if (!files?.length) return;

//     setLoading(true);
//     setConverted([]);

//     try {
//       const heic2any = (await import('heic2any')).default;
//       const results = [];

//       for (const file of files) {
//         const jpgBlob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.94 });
//         results.push({
//           name: file.name.replace(/\.heic$/i, '.jpg'),
//           url: URL.createObjectURL(jpgBlob),
//           originalName: file.name,
//         });
//       }
//       setConverted(results);
//     } catch (err) {
//       console.error(err);
//       alert('Conversion failed. Make sure you uploaded valid HEIC files and try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const faqs = [
//     { q: 'Is HEIC to JPG conversion free?', a: 'Yes — completely free with unlimited conversions and downloads.' },
//     { q: 'Can I convert multiple HEIC files at once?', a: 'Yes — batch conversion is supported. Upload multiple photos and convert them together.' },
//     { q: 'Will JPG quality be reduced?', a: 'Conversion is optimized to keep photos sharp and clear. Quality depends on the original image.' },
//     { q: 'Why does iPhone use HEIC?', a: 'HEIC saves storage while keeping high quality. But JPG is more compatible for sharing and uploads.' },
//     { q: 'Are my photos stored anywhere?', a: 'No — your photos are used only to generate the converted output. Nothing is stored.' },
//     { q: 'Can I use this on mobile?', a: 'Yes — works perfectly on iPhone, Android, tablets, and desktops.' },
//     {
//       q: 'Why are my HEIC photos not opening on Windows?',
//       a: 'Many Windows devices and older apps do not fully support HEIC files by default. Converting HEIC to JPG makes your photos easier to open, upload, and share anywhere.'
//     },
//     {
//       q: 'Can I convert iPhone photos to JPG for website uploads?',
//       a: 'Yes — JPG is a more widely accepted format for websites, forms, school portals, and online marketplaces. Converting HEIC to JPG improves compatibility.'
//     },
//     {
//       q: 'What is the difference between HEIC and JPG?',
//       a: 'HEIC usually offers smaller file sizes with good quality, but JPG is more universal and supported by more devices, apps, and websites.'
//     },
//   ];


//   return (
//     <>
//       <Script
//         id="howto-schema-heic"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert HEIC to JPG Online for Free",
//             description: "Learn how to convert iPhone HEIC images to JPG online for free so they open on Windows, upload to websites, and share easily across devices.",
//             url: "https://convertlinx.com/heic-to-jpg",
//             totalTime: "PT30S",
//             estimatedCost: {
//               "@type": "MonetaryAmount",
//               value: "0",
//               currency: "USD"
//             },
//             supply: [
//               {
//                 "@type": "HowToSupply",
//                 name: "HEIC or HEIF photo file"
//               }
//             ],
//             tool: [
//               {
//                 "@type": "HowToTool",
//                 name: "ConvertLinx HEIC to JPG Converter"
//               }
//             ],
//             step: [
//               {
//                 "@type": "HowToStep",
//                 name: "Upload HEIC photos",
//                 text: "Select one or more HEIC or HEIF files from your iPhone, iPad, or computer."
//               },
//               {
//                 "@type": "HowToStep",
//                 name: "Convert to JPG",
//                 text: "The tool converts your Apple HEIC images into JPG format instantly in your browser."
//               },
//               {
//                 "@type": "HowToStep",
//                 name: "Download JPG files",
//                 text: "Download the converted JPG images individually and use them anywhere."
//               }
//             ]
//           })
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-heic"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               {
//                 "@type": "ListItem",
//                 position: 1,
//                 name: "Home",
//                 item: "https://convertlinx.com/"
//               },
//               {
//                 "@type": "ListItem",
//                 position: 2,
//                 name: "HEIC to JPG",
//                 item: "https://convertlinx.com/heic-to-jpg"
//               }
//             ]
//           })
//         }}
//       />
//       <main className="hj-page">

//         {/* ── HERO ── */}
//         <section className="hj-hero">
//           <div className="hj-blob-1" />
//           <div className="hj-blob-2" />
//           <div className="relative z-10 max-w-3xl mx-auto">
//             <div className="flex items-center justify-center gap-2 text-sm mb-5">
//               <a href="/" className="hj-breadcrumb-link">Home</a>
//               <span style={{ color: '#C4B5FD' }}>/</span>
//               <span style={{ color: '#C026D3' }}>HEIC to JPG</span>
//             </div>
//             <span className="hj-badge">iPhone Photos</span>
//             <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
//               HEIC to{' '}
//               <span className="hj-grad-text">JPG Converter</span>
//             </h1>
//             <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
//               Convert HEIC to JPG online free for iPhone, iPad, Windows, and Android.
//               Instantly change Apple HEIC photos into universally supported JPG files that
//               open on laptops, upload to websites, and share easily on WhatsApp, email,
//               and online forms — with batch conversion, high-quality output, and no signup required.
//             </p>
//           </div>
//         </section>

//         {/* ── TOOL WORKSPACE ── */}
//         <section className="hj-section-main py-10 px-6">
//           <div className="max-w-2xl mx-auto hj-fade-up">
//             <div className="hj-tool-card">

//               <label className="block mb-3" style={{ color: '#C026D3', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
//                 Upload HEIC Photos
//               </label>

//               {/* Upload area */}
//               <label className="hj-upload-area">
//                 <div className="hj-upload-icon">
//                   <Upload className="w-8 h-8" />
//                 </div>
//                 <p className="font-semibold text-base mb-1" style={{ color: '#1a1a2e' }}>
//                   Drop HEIC photos here or click to browse
//                 </p>
//                 <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
//                   Multiple files supported · Straight from iPhone or iPad
//                 </p>
//                 <input
//                   type="file"
//                   accept=".heic,.HEIC,.heif,.HEIF"
//                   multiple
//                   onChange={convert}
//                   className="hidden"
//                 />
//               </label>

//               {/* Loader */}
//               {loading && (
//                 <div className="text-center py-8 mt-4">
//                   <div className="hj-spinner mb-3" />
//                   <p className="text-sm font-semibold" style={{ color: '#C026D3' }}>
//                     Converting your photos...
//                   </p>
//                 </div>
//               )}

//               {/* Results */}
//               {!loading && converted.length > 0 && (
//                 <div className="mt-7">
//                   <p className="text-sm font-bold uppercase tracking-widest mb-5 text-center" style={{ color: '#C026D3' }}>
//                     {converted.length} {converted.length === 1 ? 'Photo' : 'Photos'} Ready
//                   </p>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {converted.map((item, i) => (
//                       <div key={i} className="hj-result-card">
//                         <img src={item.url} alt={item.name} className="w-full h-44 object-cover" />
//                         <div className="p-4 text-center">
//                           <p className="text-xs font-medium mb-3 truncate" style={{ color: '#374151' }}>
//                             {item.name}
//                           </p>
//                           <a href={item.url} download={item.name} className="hj-dl-btn w-full justify-center">
//                             <Download className="w-4 h-4" />
//                             Download JPG
//                           </a>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Trust row */}
//               <div className="flex flex-wrap justify-center gap-5 mt-6">
//                 {['No sign-up', 'Batch convert', 'Website upload friendly', 'Nothing stored', '100% free'].map((t, i) => (
//                   <span key={i} className="hj-trust-item">
//                     <span className="hj-trust-dot" />
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── BENEFITS ── */}
//         <hr className="hj-divider" />
//         <section className="hj-section-alt py-16 px-6">
//           <div className="max-w-5xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Why Use ConvertLinx?
//             </h2>
//             <div className="grid md:grid-cols-3 gap-5">
//               {
//                 [
//                   {
//                     icon: <Smartphone className="w-6 h-6" />,
//                     color: '#C026D3',
//                     bg: 'rgba(192,38,211,0.08)',
//                     title: 'Fix iPhone Photo Compatibility',
//                     desc: 'HEIC photos often do not open properly on Windows PCs, older Android phones, or many websites. Convert them to JPG for universal support.'
//                   },
//                   {
//                     icon: <ImageIcon className="w-6 h-6" />,
//                     color: '#7C3AED',
//                     bg: 'rgba(124,58,237,0.08)',
//                     title: 'Batch Convert Multiple HEIC Files',
//                     desc: 'Upload many iPhone photos together and convert them in one go instead of changing each HEIC image manually.'
//                   },
//                   {
//                     icon: <CheckCircle className="w-6 h-6" />,
//                     color: '#10B981',
//                     bg: 'rgba(16,185,129,0.08)',
//                     title: 'Best for Uploads and Sharing',
//                     desc: 'JPG files are easier to upload in forms, attach in emails, share on WhatsApp, and use in editing tools without format issues.'
//                   },
//                 ]
//                   .map((b, i) => (
//                     <div key={i} className="hj-benefit-card">
//                       <div className="hj-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
//                       <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
//                       <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
//                     </div>
//                   ))}
//             </div>
//           </div>
//         </section>

//         {/* ── HOW TO ── */}
//         <hr className="hj-divider" />
//         <section className="hj-section-main py-16 px-6">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
//               3 Simple Steps
//             </h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {[
//                 { num: '1', title: 'Drop Your Photos', desc: 'Pick one or multiple HEIC files from your iPhone, iPad, or computer.' },
//                 { num: '2', title: 'We Do the Work', desc: 'Conversion happens instantly in your browser — fast and smooth.' },
//                 { num: '3', title: 'Grab Your JPGs', desc: 'Download converted photos one by one — ready for anything.' },
//               ].map((s, i) => (
//                 <div key={i} className="hj-step-card">
//                   <div className="hj-step-num">{s.num}</div>
//                   <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
//                   <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         <hr className="hj-divider" />
//         <section className="hj-section-alt py-16 px-6">
//           <div className="max-w-3xl mx-auto space-y-6" style={{ color: '#6B7280' }}>
//             <div>
//               <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
//                 Why HEIC Photos Don’t Open Everywhere
//               </h2>
//               <p className="leading-7 text-sm">
//                 HEIC is Apple’s modern photo format that saves storage while keeping high image quality,
//                 but it is not supported everywhere. Many Windows laptops, websites, online forms,
//                 editing tools, and older devices do not handle HEIC files properly.
//               </p>
//               <p className="leading-7 text-sm">
//                 That is why people often need to convert HEIC to JPG before uploading iPhone photos,
//                 sending them by email, attaching them to school or office portals, or opening them on
//                 non-Apple devices. JPG is more universal and works almost everywhere.
//               </p>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
//                 HEIC vs JPG — What’s the Difference?
//               </h3>
//               <p className="leading-7 text-sm">
//                 HEIC files are usually smaller and more efficient, which is why iPhones use them by default.
//                 JPG files, however, are more widely supported across Windows computers, Android phones,
//                 browsers, websites, online forms, and editing apps.
//               </p>
//               <p className="leading-7 text-sm">
//                 If your iPhone photos are not opening properly, not uploading, or not sharing smoothly,
//                 converting HEIC to JPG is the easiest fix because JPG works almost everywhere without compatibility issues.
//               </p>
//             </div>

//             <div className="hj-seo-box">
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
//                 Common Problems This Tool Solves
//               </h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'HEIC photos not opening on Windows PC',
//                   'iPhone images not accepted on websites',
//                   'HEIC files hard to share on WhatsApp or email',
//                   'Need to convert multiple HEIC files quickly',
//                   'Apple photos not working in document portals',
//                   'Need JPG format for editing or uploading',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="hj-feature-dot" />
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>



//           </div>
//         </section>

//         {/* ── SEO CONTENT ── */}
//         <hr className="hj-divider" />
//         <section className="hj-section-alt py-16 px-6">
//           <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>
//             <div>
//               <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
//                 Free HEIC to JPG Converter — ConvertLinx
//               </h2>
//               {/* <p className="leading-7 text-sm">
//                 The <span style={{ color: '#1a1a2e', fontWeight: 600 }}>ConvertLinx HEIC to JPG</span> tool converts
//                 iPhone photos into universal JPG format instantly — no signup, no watermark, batch supported.
//               </p> */}
//               <p className="leading-7 text-sm">
//                 The <span style={{ color: '#1a1a2e', fontWeight: 600 }}>ConvertLinx HEIC to JPG Converter</span>
//                 helps you convert HEIC to JPG online free without installing any software.
//                 It is useful for people who need to open iPhone photos on Windows laptops,
//                 upload HEIC images to websites that do not support Apple photo format,
//                 or quickly change multiple HEIC files to JPG in one go.
//               </p>
//               <p className="leading-7 text-sm">
//                 Whether you want to convert iPhone HEIC photos for email, WhatsApp, online forms,
//                 office work, school portals, or image editing tools, this free HEIC image converter
//                 gives you fast JPG output with better compatibility across all devices and browsers.
//               </p>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'iPhone users — convert Apple photos to JPG for easier sharing',
//                   'Windows users — open HEIC images on laptops and desktops',
//                   'Students — upload iPhone photos to school forms and portals',
//                   'Office teams — attach JPG images in emails, documents, and reports',
//                   'Online sellers — upload compatible product images to websites',
//                   'Everyone — change HEIC to JPG without installing apps',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-2 text-sm">
//                     <span className="font-bold mt-0.5" style={{ color: '#C026D3' }}>→</span>
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="hj-seo-box">
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Free, unlimited conversions',
//                   'iPhone & iPad HEIC supported',
//                   'Batch conversion — multiple files',
//                   'Fast results in seconds',
//                   'High-quality JPG output',
//                   'Simple drag & drop upload',
//                   'Works on mobile & desktop',
//                   'Nothing stored — full privacy',
//                 ].map((f, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="hj-feature-dot" />
//                     <span>{f}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* 🔥 YAHAN ADD KARNA HAI */}
//             <div>
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
//                 Best Uses for HEIC to JPG Conversion
//               </h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Convert iPhone photos to JPG for website uploads',
//                   'Change HEIC to JPG for WhatsApp sharing',
//                   'Open HEIC files on Windows without extra software',
//                   'Convert Apple photos for email attachments',
//                   'Use JPG images in online forms and portals',
//                   'Prepare HEIC photos for editing tools and document use',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="hj-feature-dot" />
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>


//           </div>
//         </section>


//         {/* ── FAQ ── */}
//         <hr className="hj-divider" />
//         <section className="hj-section-main py-16 px-6">
//           <Script
//             id="faq-schema-heic"
//             type="application/ld+json"
//             strategy="afterInteractive"
//             dangerouslySetInnerHTML={{
//               __html: JSON.stringify({
//                 "@context": "https://schema.org",
//                 "@type": "FAQPage",
//                 mainEntity: faqs.map((faq) => ({
//                   "@type": "Question",
//                   name: faq.q,
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: faq.a,
//                   },
//                 })),
//               }),
//             }}
//           />

//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Frequently Asked Questions
//             </h2>
//             <div className="space-y-3">
//               {faqs.map((faq, i) => (
//                 <details key={i} className="hj-faq-item">
//                   <summary className="flex items-center justify-between gap-4">
//                     <span className="font-semibold text-sm" style={{ color: '#374151' }}>
//                       {faq.q}
//                     </span>
//                     <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#C026D3' }} />
//                   </summary>
//                   <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
//                     {faq.a}
//                   </p>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>


//         <hr className="hj-divider" />
//         <section className="hj-section-alt py-14 px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
//               You may also find these free tools helpful
//             </h2>
//             <div className="flex flex-wrap justify-center gap-3">
//               {[
//                 { name: 'Image Converter', href: '/image-converter' },
//                 { name: 'Image Resizer', href: '/image-resizer' },
//                 { name: 'Image Cropper', href: '/image-cropper' },
//                 { name: 'Image to Text', href: '/image-to-text' },
//               ].map((tool, i) => (
//                 <Link
//                   key={i}
//                   href={tool.href}
//                   className="px-4 py-2 rounded-full text-sm font-medium border"
//                   style={{ color: '#7C3AED', borderColor: '#D8B4FE', background: '#fff' }}
//                 >
//                   {tool.name}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── BOTTOM CTA ── */}
//         <section className="hj-cta-section">
//           <div className="max-w-xl mx-auto">
//             <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
//               Ready to convert your iPhone photos?
//             </h2>
//             <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
//               Takes 5 seconds. No signup. No ads.
//             </p>
//             <button
//               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//               className="hj-cta-btn"
//             >
//               <Smartphone className="w-5 h-5" />
//               Convert Now
//             </button>
//           </div>
//         </section>

//       </main>
//     </>
//   );
// }