"use client";

import { ShieldCheck, Zap, Globe } from "lucide-react";
import Script from "next/script";

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About ConvertLinx",
    description:
      "Learn about ConvertLinx — a fast, clean collection of free online utility tools built for simplicity and privacy.",
    url: "https://convertlinx.com/about",
    publisher: {
      "@type": "Organization",
      name: "ConvertLinx",
      url: "https://convertlinx.com",
    },
  };

  return (
    <>
      {/* SEO Schema */}
      <Script
        id="aboutpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-4xl mx-auto py-8 px-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        
        {/* Hero Section */}
        <section className="text-center mb-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
            About <strong>ConvertLinx</strong>
          </h1>

          <div className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-left space-y-4">
            
            <p>
              ConvertLinx started with a simple frustration.
            </p>

            <p>
              I kept needing small tools — generate a QR code, convert an image,
              compress a file, extract text — and every time I searched, I ran
              into the same problems.
            </p>

            <ul className="list-none space-y-1 ml-4">
              <li>→ “Sign up to download”</li>
              <li>→ aggressive ads everywhere</li>
              <li>→ confusing layouts</li>
              <li>→ slow tools for simple tasks</li>
            </ul>

            <p>
              So instead of complaining about it, I built what I wished existed.
              A clean hub of practical tools that just work.
            </p>

            <p>
              No unnecessary friction. No complicated dashboards.
              Just open the site, use the tool, and move on with your day.
            </p>

            <p className="text-gray-600 italic">
              Built solo. Maintained carefully. Designed to respect your time.
            </p>

          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-12 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-lg border border-indigo-100 p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-900 mb-6">
            Why This Exists
          </h2>

          <div className="text-gray-700 max-w-3xl mx-auto text-base leading-relaxed space-y-4">
            <p>
              The internet has amazing tools — but too many of them are bloated,
              slow, or designed to trap users into subscriptions.
            </p>

            <p>
              ConvertLinx exists to do the opposite.
            </p>

            <p>
              Whether you’re:
              <br />
              → a student converting notes  
              → a freelancer compressing images  
              → a business owner generating a QR code  
              → or someone just fixing a quick file issue  
            </p>

            <p>
              The experience should be fast, clean, and frustration-free.
            </p>

            <p className="text-gray-600">
              Simple tools. Real utility. No drama.
            </p>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

          {/* Free */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
            <Globe className="w-16 h-16 mx-auto text-indigo-700 mb-4 p-3 rounded-xl bg-indigo-50 group-hover:scale-110 transition" />
            <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition">
              Truly <strong>Free</strong>
            </h3>
            <p className="text-gray-600 text-center text-sm leading-relaxed">
              No fake trials. No credit card traps.
              <br />
              Just open the tool and use it.
            </p>
          </div>

          {/* Fast */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
            <Zap className="w-16 h-16 mx-auto text-amber-600 mb-4 p-3 rounded-xl bg-amber-50 group-hover:scale-110 transition" />
            <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-amber-600 transition">
              Built for <strong>Speed</strong>
            </h3>
            <p className="text-gray-600 text-center text-sm leading-relaxed">
              Small tasks shouldn’t take minutes.
              <br />
              Tools are optimized to feel instant.
            </p>
          </div>

          {/* Privacy */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
            <ShieldCheck className="w-16 h-16 mx-auto text-emerald-600 mb-4 p-3 rounded-xl bg-emerald-50 group-hover:scale-110 transition" />
            <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition">
              Privacy <strong>Matters</strong>
            </h3>
            <p className="text-gray-600 text-center text-sm leading-relaxed">
              Many tools run directly in your browser.
              <br />
              If server processing is required, it’s clearly stated.
            </p>
          </div>

        </section>

        {/* Story Section */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-900">
            How It’s Growing
          </h2>

          <div className="text-gray-700 max-w-3xl mx-auto text-base leading-relaxed text-left space-y-4">

            <p>
              What started as a few simple tools is slowly becoming a growing hub.
            </p>

            <p>
              Each tool is added based on real-world need — not trends.
              If something saves time for even a few people every day,
              it’s worth building.
            </p>

            <p>
              I continuously improve performance, simplify interfaces,
              and remove unnecessary friction.
            </p>

            <p className="text-gray-600 italic">
              Have an idea or found something that can be improved?
              Email <strong>support@ConvertLinx.com</strong> — I read everything.
            </p>

          </div>
        </section>

      </main>
    </>
  );
}

























// "use client";

// import { ShieldCheck, Zap, Globe } from "lucide-react";
// import Script from "next/script";

// export default function About() {
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "AboutPage",
//     name: "About PDF Linx",
//     description:
//       "Learn about PDF Linx — a privacy-first collection of free PDF and utility tools built for speed and simplicity.",
//     url: "https://pdflinx.com/about",
//     publisher: {
//       "@type": "Organization",
//       name: "PDF Linx",
//       url: "https://pdflinx.com",
//     },
//   };

//   return (
//     <>
//       {/* SEO Schema (JSON-LD) */}
//       <Script
//         id="aboutpage-jsonld"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       <main className="max-w-4xl mx-auto py-8 px-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
//         {/* Hero Section */}
//         <section className="text-center mb-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
//           <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
//             About <strong>PDF Linx</strong>
//           </h1>

//           <div className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-left space-y-3">
//             <p>
//               I built PDF Linx in <strong>October 2023</strong> after wasting way
//               too much time trying to convert a simple scanned receipt.
//               I tested multiple “free” converters — and they all came with the
//               same annoying problems.
//             </p>

//             <p>You know the type:</p>
//             <ul className="list-none space-y-1 ml-4">
//               <li>→ “Sign up to download your file” (why?)</li>
//               <li>→ tiny file limits</li>
//               <li>→ popups and distractions</li>
//               <li>→ slow processing for basic tasks</li>
//             </ul>

//             <p>
//               So I spent the weekend building something that just works —
//               simple, fast, and focused. Many tools run directly in your browser
//               to keep things private and quick.
//             </p>

//             <p>
//               I posted it on Reddit in November and it got surprising traction.
//               A friend used it for a thesis (merging a bunch of PDFs), and then
//               more people started sharing it.
//             </p>

//             <p>
//               Today, there’s a small but growing community — especially across
//               Pakistan, India, and Bangladesh (shoutout to the desi dev community 🙏).
//             </p>

//             <p className="text-gray-600 italic">
//               Built solo. Maintained continuously. Privacy-first by default.
//             </p>
//           </div>
//         </section>

//         {/* Mission Section */}
//         <section className="mb-12 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-lg border border-indigo-100 p-8">
//           <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-900 mb-6">
//             Why This Exists
//           </h2>

//           <div className="text-gray-700 max-w-3xl mx-auto text-base leading-relaxed space-y-3">
//             <p>
//               I’m not trying to build the next billion-dollar startup. I just got
//               tired of clunky tools that charge monthly subscriptions for basic
//               PDF operations.
//             </p>

//             <p>
//               The goal is simple: <strong>don’t waste people’s time</strong>.
//             </p>

//             <p>
//               Whether you’re a student submitting assignments at 2 AM, a freelancer
//               dealing with client files, or someone making a QR code for a café menu —
//               these tools should just work. Fast. Simple. Minimal friction.
//             </p>

//             <p className="text-gray-600">
//               And yes — I keep the site clean. No spammy popups. No weird tricks.
//             </p>
//           </div>
//         </section>

//         {/* Feature Cards */}
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//           {/* Card 1 */}
//           <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
//             <Globe className="w-16 h-16 mx-auto text-indigo-700 mb-4 p-3 rounded-xl bg-indigo-50 group-hover:scale-110 transition" />
//             <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition">
//               Actually <strong>Free</strong>
//             </h3>
//             <p className="text-gray-600 text-center text-sm leading-relaxed">
//               No “free trial” traps. No account required. No credit card.
//               <br />
//               <br />
//               Use it on phone, laptop, tablet — just open the site and go.
//             </p>
//           </div>

//           {/* Card 2 */}
//           <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
//             <Zap className="w-16 h-16 mx-auto text-amber-600 mb-4 p-3 rounded-xl bg-amber-50 group-hover:scale-110 transition" />
//             <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-amber-600 transition">
//               Fast, <strong>Always</strong>
//             </h3>
//             <p className="text-gray-600 text-center text-sm leading-relaxed">
//               Most tools finish quickly — because waiting for simple tasks is painful.
//               <br />
//               <br />
//               Merging PDFs, compressing files, converting formats — built to be snappy.
//             </p>
//           </div>

//           {/* Card 3 */}
//           <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
//             <ShieldCheck className="w-16 h-16 mx-auto text-emerald-600 mb-4 p-3 rounded-xl bg-emerald-50 group-hover:scale-110 transition" />
//             <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition">
//               Your Files Stay <strong>Yours</strong>
//             </h3>
//             <p className="text-gray-600 text-center text-sm leading-relaxed">
//               Many tools run directly in your browser — so your files aren’t sent
//               to random servers for processing.
//               <br />
//               <br />
//               If a tool requires server processing, it’s clearly disclosed in the tool page.
//             </p>
//           </div>
//         </section>

//         {/* Story Section */}
//         <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
//           <h2 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-900">
//             How We Got <strong>Here</strong>
//           </h2>

//           <div className="text-gray-700 max-w-3xl mx-auto text-base leading-relaxed text-left space-y-3">
//             <p>
//               Started as a weekend project in <strong>October 2023</strong>. Just
//               me, building what I wished existed.
//             </p>

//             <p>
//               The first version had just a few essentials:{" "}
//               <strong>PDF to Word</strong>, <strong>Merge PDF</strong>, and{" "}
//               <strong>Compress PDF</strong>.
//             </p>

//             <p>
//               Then people started requesting more:
//               <br />
//               → QR Code Generator (added)
//               <br />
//               → Password Generator (added)
//               <br />
//               → Image Compression (added)
//             </p>

//             <p>
//               Now there are <strong>22 tools</strong> and I still ship updates
//               based on feedback.
//             </p>

//             <p className="text-gray-600 italic">
//               Got an idea or found a bug? Email{" "}
//               <strong>support@pdflinx.com</strong>. I read everything.
//             </p>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }

