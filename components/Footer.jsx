"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-gray-900 via-indigo-950 to-gray-900 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand & Intro */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">PDF Linx</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Free online tools for PDFs and files — no signup, no ads, no watermarks.<br />
              Just simple stuff that works.
            </p>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="text-base font-semibold text-white mb-3">Popular Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pdf-to-word" className="hover:text-indigo-400 transition">PDF to Word</Link></li>
              <li><Link href="/word-to-pdf" className="hover:text-indigo-400 transition">Word to PDF</Link></li>
              <li><Link href="/merge-pdf" className="hover:text-indigo-400 transition">Merge PDF</Link></li>
              <li><Link href="/compress-pdf" className="hover:text-indigo-400 transition">Compress PDF</Link></li>
              <li><Link href="/image-to-pdf" className="hover:text-indigo-400 transition">Image to PDF</Link></li>
              <li><Link href="/qr-generator" className="hover:text-indigo-400 transition">QR Code Generator</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-base font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-indigo-400 transition">Blog & Guides</Link></li>
              <li><Link href="/about" className="hover:text-indigo-400 transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-indigo-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-indigo-400 transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-base font-semibold text-white mb-3">Connect</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Got feedback or spotted something?<br />
              I'd love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-indigo-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              Get in Touch →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {year} PDF Linx • All Rights Reserved • Made with ❤️ for people who hate bad PDF tools
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Free tools • No data stored • No tracking • Processed in your browser
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;





















// "use client";

// import React from "react";
// import Link from "next/link";

// const Footer = () => {
//   const year = new Date().getFullYear();

//   return (
//     <footer className="bg-gradient-to-t from-gray-900 via-indigo-950 to-gray-900 text-gray-300 py-12">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
//           {/* Brand & Quick Intro */}
//           <div className="md:col-span-1">
//             <h3 className="text-2xl font-bold text-white mb-4">PDF Linx</h3>
//             <p className="text-gray-400 text-sm leading-relaxed">
//               Free online tools to handle PDFs and files — no signup, no ads, no watermarks.<br />
//               Built for people who just want things to work.
//             </p>
//           </div>

//           {/* Quick Links - Main Tools */}
//           <div>
//             <h4 className="text-lg font-semibold text-white mb-5">Popular Tools</h4>
//             <ul className="space-y-3 text-sm">
//               <li><Link href="/pdf-to-word" className="hover:text-indigo-400 transition">PDF to Word</Link></li>
//               <li><Link href="/word-to-pdf" className="hover:text-indigo-400 transition">Word to PDF</Link></li>
//               <li><Link href="/merge-pdf" className="hover:text-indigo-400 transition">Merge PDF</Link></li>
//               <li><Link href="/compress-pdf" className="hover:text-indigo-400 transition">Compress PDF</Link></li>
//               <li><Link href="/image-to-pdf" className="hover:text-indigo-400 transition">Image to PDF</Link></li>
//               <li><Link href="/qr-generator" className="hover:text-indigo-400 transition">QR Code Generator</Link></li>
//             </ul>
//           </div>

//           {/* More Links */}
//           <div>
//             <h4 className="text-lg font-semibold text-white mb-5">Resources</h4>
//             <ul className="space-y-3 text-sm">
//               <li><Link href="/blog" className="hover:text-indigo-400 transition">Blog & Guides</Link></li>
//               <li><Link href="/about" className="hover:text-indigo-400 transition">About</Link></li>
//               <li><Link href="/contact" className="hover:text-indigo-400 transition">Contact</Link></li>
//               <li><Link href="/privacy-policy" className="hover:text-indigo-400 transition">Privacy Policy</Link></li>
//               <li><Link href="/terms-and-conditions" className="hover:text-indigo-400 transition">Terms of Service</Link></li>
//             </ul>
//           </div>

//           {/* Connect */}
//           <div>
//             <h4 className="text-lg font-semibold text-white mb-5">Connect</h4>
//             <p className="text-gray-400 text-sm leading-relaxed mb-6">
//               Have feedback, ideas, or found a bug?<br />
//               I'd love to hear from you.
//             </p>
//             <Link
//               href="/contact"
//               className="inline-block bg-indigo-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg"
//             >
//               Get in Touch →
//             </Link>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="border-t border-gray-800 pt-8 text-center">
//           <p className="text-gray-500 text-sm">
//             © {year} PDF Linx • All Rights Reserved • Made with ❤️ for people who hate bad PDF tools
//           </p>
//           <p className="text-gray-600 text-xs mt-3 max-w-3xl mx-auto leading-relaxed">
//             Free online PDF and file tools. No data stored • No tracking • Completely in-browser processing
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;




















// "use client";
// import React from "react";
// import Link from "next/link";

// const Footer = () => {
//   const year = new Date().getFullYear();

//   return (
//     <footer className="bg-gray-900 text-gray-300 py-6 text-center text-sm">
//       <div className="space-y-3">
//         {/* Legal Links */}
//         <div className="flex flex-wrap justify-center gap-4 text-gray-400">
//           <Link
//             href="/privacy-policy"
//             className="hover:text-white transition-colors"
//           >
//             Privacy Policy
//           </Link>
//           <Link
//             href="/terms-and-conditions"
//             className="hover:text-white transition-colors"
//           >
//             Terms & Conditions
//           </Link>
//           <Link
//             href="/contact"
//             className="hover:text-white transition-colors"
//           >
//             Contact
//           </Link>
//           <Link
//             href="/licenses.txt"
//             target="_blank"
//             className="hover:text-white transition-colors"
//           >
//             Open Source Licenses
//           </Link>
//         </div>

//         {/* Copyright */}
//         <p className="text-gray-400">
//           © {year} PDF Converter www.pdflinx.com All Rights Reserved.
//         </p>

//         {/* Disclaimer */}
//         <p className="text-gray-500 max-w-2xl mx-auto px-4 text-xs leading-relaxed">
//           This website provides free online PDF conversion tools. By using this
//           site, you agree to our Terms and Privacy Policy. All trademarks and
//           brand names belong to their respective owners.
//         </p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;














// // // components/Footer.jsx
// // "use client";
// // import React from "react";

// // const Footer = () => {
// //   return (
// //     <footer className="bg-gray-900 text-white py-6 text-center">
// //       <p>© {new Date().getFullYear()} PDF Tools. All Rights Reserved.</p>
// //     </footer>
// //   );
// // };

// // export default Footer;
