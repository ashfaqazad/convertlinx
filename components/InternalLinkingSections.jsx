// import React from 'react';
// import { Link, FileText, Image, QrCode, Lock, Type, Download, Signature, Convert, Droplet, Repeat } from 'lucide-react';

// const InternalLinkingSections = () => {
//   return (
//     <div className="bg-gray-50 min-h-screen p-8">
      
//       {/* Section 1: More Useful Tools - Homepage Section */}
//       <section className="max-w-7xl mx-auto mb-16 bg-white rounded-lg shadow-sm p-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
//           More Useful Tools
//         </h2>
//         <p className="text-gray-600 text-center mb-8">
//           Quick access to all our productivity tools
//         </p>
        
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//           <a href="/add-watermark" className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
//             <Droplet className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
//             <span className="text-sm font-medium text-gray-700 text-center">Add Watermark</span>
//           </a>
          
//           <a href="/text-to-pdf" className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
//             <Type className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
//             <span className="text-sm font-medium text-gray-700 text-center">Text to PDF</span>
//           </a>
          
//           <a href="/signature-maker" className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
//             <Signature className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
//             <span className="text-sm font-medium text-gray-700 text-center">Signature Maker</span>
//           </a>
          
//           <a href="/heic-to-jpg" className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
//             <Repeat className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
//             <span className="text-sm font-medium text-gray-700 text-center">HEIC to JPG</span>
//           </a>
          
//           <a href="/image-to-text" className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
//             <FileText className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
//             <span className="text-sm font-medium text-gray-700 text-center">Image to Text</span>
//           </a>
          
//           <a href="/youtube-thumbnail" className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
//             <Download className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
//             <span className="text-sm font-medium text-gray-700 text-center">YT Thumbnail</span>
//           </a>
//         </div>
//       </section>

//       {/* Section 2: Related Tools Widget - For Individual Tool Pages */}
//       <section className="max-w-4xl mx-auto mb-16 bg-white rounded-lg shadow-sm p-8">
//         <h3 className="text-2xl font-bold text-gray-900 mb-6">
//           You Might Also Need
//         </h3>
        
//         <div className="space-y-4">
//           <a href="/word-to-pdf" className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
//             <span className="text-2xl mr-4">📄</span>
//             <div>
//               <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">Word to PDF</h4>
//               <p className="text-sm text-gray-600">Convert back to PDF format</p>
//             </div>
//           </a>
          
//           <a href="/split-pdf" className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
//             <span className="text-2xl mr-4">✂️</span>
//             <div>
//               <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">Split PDF</h4>
//               <p className="text-sm text-gray-600">Separate pages into multiple files</p>
//             </div>
//           </a>
          
//           <a href="/compress-pdf" className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
//             <span className="text-2xl mr-4">🗜️</span>
//             <div>
//               <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">Compress PDF</h4>
//               <p className="text-sm text-gray-600">Reduce file size without losing quality</p>
//             </div>
//           </a>
//         </div>
//       </section>

//       {/* Section 3: Breadcrumb Navigation */}
//       <section className="max-w-7xl mx-auto mb-16 bg-white rounded-lg shadow-sm p-6">
//         <h3 className="text-xl font-bold text-gray-900 mb-4">Breadcrumb Navigation Example</h3>
        
//         <div className="space-y-3">
//           <nav className="flex items-center text-sm text-gray-600">
//             <a href="/" className="hover:text-blue-600">Home</a>
//             <span className="mx-2">&gt;</span>
//             <a href="/pdf-tools" className="hover:text-blue-600">PDF Tools</a>
//             <span className="mx-2">&gt;</span>
//             <span className="text-gray-900 font-medium">Compress PDF</span>
//           </nav>
          
//           <nav className="flex items-center text-sm text-gray-600">
//             <a href="/" className="hover:text-blue-600">Home</a>
//             <span className="mx-2">&gt;</span>
//             <a href="/utility-tools" className="hover:text-blue-600">Utility Tools</a>
//             <span className="mx-2">&gt;</span>
//             <span className="text-gray-900 font-medium">QR Generator</span>
//           </nav>
//         </div>
//       </section>

//       {/* Section 4: Popular Searches - Footer Section */}
//       <section className="max-w-7xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg p-8">
//         <h3 className="text-lg font-semibold mb-4">Popular Searches</h3>
//         <div className="flex flex-wrap gap-2">
//           <a href="/pdf-to-word" className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-blue-600 transition-colors">
//             PDF to Word
//           </a>
//           <a href="/merge-pdf" className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-blue-600 transition-colors">
//             Merge PDF
//           </a>
//           <a href="/qr-generator" className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-blue-600 transition-colors">
//             QR Generator
//           </a>
//           <a href="/image-compressor" className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-blue-600 transition-colors">
//             Image Compressor
//           </a>
//           <a href="/signature-maker" className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-blue-600 transition-colors">
//             Signature Maker
//           </a>
//           <a href="/compress-pdf" className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-blue-600 transition-colors">
//             Compress PDF
//           </a>
//           <a href="/word-to-pdf" className="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-blue-600 transition-colors">
//             Word to PDF
//           </a>
//         </div>
//       </section>

//       {/* Section 5: Categorized Footer Links */}
//       <section className="max-w-7xl mx-auto mt-16 bg-gray-800 text-white rounded-lg shadow-lg p-8">
//         <div className="grid md:grid-cols-3 gap-8">
//           <div>
//             <h4 className="font-bold text-lg mb-4 text-blue-400">Related PDF Tools</h4>
//             <ul className="space-y-2 text-sm">
//               <li><a href="/pdf-to-word" className="hover:text-blue-400">PDF to Word</a> | <a href="/word-to-pdf" className="hover:text-blue-400">Word to PDF</a></li>
//               <li><a href="/merge-pdf" className="hover:text-blue-400">Merge PDF</a> | <a href="/split-pdf" className="hover:text-blue-400">Split PDF</a></li>
//               <li><a href="/compress-pdf" className="hover:text-blue-400">Compress PDF</a> | <a href="/excel-pdf" className="hover:text-blue-400">Excel to PDF</a></li>
//             </ul>
//           </div>
          
//           <div>
//             <h4 className="font-bold text-lg mb-4 text-blue-400">Image & Converter Tools</h4>
//             <ul className="space-y-2 text-sm">
//               <li><a href="/image-compressor" className="hover:text-blue-400">Image Compressor</a> | <a href="/heic-to-jpg" className="hover:text-blue-400">HEIC to JPG</a></li>
//               <li><a href="/image-converter" className="hover:text-blue-400">Image Converter</a> | <a href="/image-to-text" className="hover:text-blue-400">Image to Text</a></li>
//               <li><a href="/image-to-pdf" className="hover:text-blue-400">Image to PDF</a> | <a href="/add-watermark" className="hover:text-blue-400">Add Watermark</a></li>
//             </ul>
//           </div>
          
//           <div>
//             <h4 className="font-bold text-lg mb-4 text-blue-400">Utility Tools</h4>
//             <ul className="space-y-2 text-sm">
//               <li><a href="/qr-generator" className="hover:text-blue-400">QR Generator</a> | <a href="/password-generator" className="hover:text-blue-400">Password Gen</a></li>
//               <li><a href="/signature-maker" className="hover:text-blue-400">Signature Maker</a> | <a href="/unit-converter" className="hover:text-blue-400">Unit Converter</a></li>
//               <li><a href="/youtube-thumbnail" className="hover:text-blue-400">YT Thumbnail</a> | <a href="/text-to-pdf" className="hover:text-blue-400">Text to PDF</a></li>
//             </ul>
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// };

// export default InternalLinkingSections;