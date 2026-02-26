import React from 'react';


// ============================================
// STEP 1: Related Tools Data Configuration
// ============================================
export const relatedToolsData = {
  // PDF Conversion Tools
  'word-to-pdf': [
    { title: 'PDF to Word', emoji: '📄', url: '/pdf-to-word', desc: 'Convert PDF back to Word format' },
    { title: 'Excel to PDF', emoji: '📊', url: '/excel-pdf', desc: 'Convert Excel spreadsheets to PDF' },
    { title: 'Image to PDF', emoji: '🖼️', url: '/image-to-pdf', desc: 'Turn images into PDF documents' },
  ],
  'pdf-to-word': [
    { title: 'Word to PDF', emoji: '📄', url: '/word-to-pdf', desc: 'Convert back to PDF format' },
    { title: 'Split PDF', emoji: '✂️', url: '/split-pdf', desc: 'Separate pages into multiple files' },
    { title: 'Compress PDF', emoji: '🗜️', url: '/compress-pdf', desc: 'Reduce file size without losing quality' },
  ],
  'excel-pdf': [
    { title: 'Word to PDF', emoji: '📄', url: '/word-to-pdf', desc: 'Convert Word to PDF' },
    { title: 'PDF to Word', emoji: '📝', url: '/pdf-to-word', desc: 'Convert PDF to editable Word' },
    { title: 'Compress PDF', emoji: '🗜️', url: '/compress-pdf', desc: 'Reduce PDF file size' },
  ],
  'image-to-pdf': [
    { title: 'PDF to Word', emoji: '📄', url: '/pdf-to-word', desc: 'Convert PDF to Word' },
    { title: 'Merge PDF', emoji: '📚', url: '/merge-pdf', desc: 'Combine multiple PDFs' },
    { title: 'Compress PDF', emoji: '🗜️', url: '/compress-pdf', desc: 'Reduce PDF file size' },
  ],


  // PDF Manipulation Tools
  'merge-pdf': [
    { title: 'Split PDF', emoji: '✂️', url: '/split-pdf', desc: 'Separate PDF into multiple files' },
    { title: 'Compress PDF', emoji: '🗜️', url: '/compress-pdf', desc: 'Reduce file size' },
    { title: 'PDF to Word', emoji: '📄', url: '/pdf-to-word', desc: 'Convert to editable format' },
  ],
  'split-pdf': [
    { title: 'Merge PDF', emoji: '📚', url: '/merge-pdf', desc: 'Combine multiple PDF files' },
    { title: 'Compress PDF', emoji: '🗜️', url: '/compress-pdf', desc: 'Reduce file size' },
    { title: 'PDF to Word', emoji: '📄', url: '/pdf-to-word', desc: 'Convert to Word' },
  ],

  'compress-pdf': [
    { title: 'Merge PDF', emoji: '📚', url: '/merge-pdf', desc: 'Combine multiple PDFs' },
    { title: 'Split PDF', emoji: '✂️', url: '/split-pdf', desc: 'Separate pages' },
    { title: 'PDF to Word', emoji: '📄', url: '/pdf-to-word', desc: 'Convert to Word' },
  ],

  'pdf-to-jpg': [
    { title: 'Image to PDF', emoji: '🖼️', url: '/image-to-pdf', desc: 'Turn images into PDF documents' },
    { title: 'Split PDF', emoji: '✂️', url: '/split-pdf', desc: 'Separate pages' },
    { title: 'PDF to Word', emoji: '📄', url: '/pdf-to-word', desc: 'Convert to Word' },
  ],


  // ===============================
  // PDF Security Tools (NEW 🔥)
  // ===============================
  'protect-pdf': [
    { title: 'Unlock PDF', emoji: '🔓', url: '/unlock-pdf', desc: 'Remove password protection from PDFs' },
    { title: 'Compress PDF', emoji: '🗜️', url: '/compress-pdf', desc: 'Reduce file size after securing PDFs' },
    { title: 'Merge PDF', emoji: '📚', url: '/merge-pdf', desc: 'Combine multiple PDFs securely' },
  ],

  'unlock-pdf': [
    { title: 'Protect PDF', emoji: '🔐', url: '/protect-pdf', desc: 'Add password protection to PDF files' },
    { title: 'PDF to Word', emoji: '📄', url: '/pdf-to-word', desc: 'Convert unlocked PDFs to editable Word' },
    { title: 'Split PDF', emoji: '✂️', url: '/split-pdf', desc: 'Split unlocked PDF into pages' },
  ],

  'rotate-pdf': [
    { title: 'Sign PDF', emoji: '✍️', url: '/sign-pdf', desc: 'Add your digital signature to rotated PDFs' },
    { title: 'Merge PDF', emoji: '📚', url: '/merge-pdf', desc: 'Combine rotated PDFs into one file' },
    { title: 'Split PDF', emoji: '✂️', url: '/split-pdf', desc: 'Split rotated PDF into separate pages' },
  ],

  'sign-pdf': [
    { title: 'Rotate PDF', emoji: '🔄', url: '/rotate-pdf', desc: 'Fix page orientation before signing' },
    { title: 'Protect PDF', emoji: '🔐', url: '/protect-pdf', desc: 'Secure signed PDFs with a password' },
    { title: 'Compress PDF', emoji: '🗜️', url: '/compress-pdf', desc: 'Reduce file size after signing PDF' },
  ],

  'edit-pdf': [
  { title: 'OCR PDF', emoji: '🧠', url: '/ocr-pdf', desc: 'Extract text from scanned PDFs' },
  { title: 'Rotate PDF', emoji: '🔄', url: '/rotate-pdf', desc: 'Fix page orientation before signing' },
  { title: 'Protect PDF', emoji: '🔐', url: '/protect-pdf', desc: 'Secure signed PDFs with a password' },
],

  'ocr-pdf': [
  { title: 'Edit PDF', emoji: '✏️', url: '/edit-pdf', desc: 'Modify text, images, and pages in your PDF' },
  { title: 'Rotate PDF', emoji: '🔄', url: '/rotate-pdf', desc: 'Fix page orientation before signing' },
  { title: 'Protect PDF', emoji: '🔐', url: '/protect-pdf', desc: 'Secure signed PDFs with a password' },
],


  // Image Tools
  'image-compressor': [
    { title: 'HEIC to JPG', emoji: '🔄', url: '/heic-to-jpg', desc: 'Convert iPhone photos to JPG' },
    { title: 'Image Converter', emoji: '🎨', url: '/image-converter', desc: 'Convert between image formats' },
    { title: 'Add Watermark', emoji: '💧', url: '/add-watermark', desc: 'Protect images with watermark' },
  ],
  'heic-to-jpg': [
    { title: 'Image Compressor', emoji: '📦', url: '/image-compressor', desc: 'Reduce image file size' },
    { title: 'Image to PDF', emoji: '🖼️', url: '/image-to-pdf', desc: 'Convert images to PDF' },
    { title: 'Image Converter', emoji: '🎨', url: '/image-converter', desc: 'Convert image formats' },
  ],
  'image-to-text': [
    { title: 'Image to PDF', emoji: '🖼️', url: '/image-to-pdf', desc: 'Convert images to PDF' },
    { title: 'PDF to Word', emoji: '📄', url: '/pdf-to-word', desc: 'Convert PDF to Word' },
    { title: 'Image Compressor', emoji: '📦', url: '/image-compressor', desc: 'Compress images' },
  ],
  'add-watermark': [
    { title: 'Image Compressor', emoji: '📦', url: '/image-compressor', desc: 'Reduce image size' },
    { title: 'Image Converter', emoji: '🎨', url: '/image-converter', desc: 'Convert formats' },
    { title: 'Signature Maker', emoji: '✍️', url: '/signature-maker', desc: 'Create digital signatures' },
  ],
  'image-converter': [
    { title: 'HEIC to JPG', emoji: '🔄', url: '/heic-to-jpg', desc: 'Convert HEIC to JPG' },
    { title: 'Image Compressor', emoji: '📦', url: '/image-compressor', desc: 'Reduce image size' },
    { title: 'Image to PDF', emoji: '🖼️', url: '/image-to-pdf', desc: 'Create PDF from images' },
  ],

  // Utility Tools
  'qr-generator': [
    { title: 'Password Generator', emoji: '🔐', url: '/password-gen', desc: 'Create secure passwords' },
    { title: 'Signature Maker', emoji: '✍️', url: '/signature-maker', desc: 'Design digital signatures' },
    { title: 'Unit Converter', emoji: '📏', url: '/unit-converter', desc: 'Convert measurements' },
  ],
  'password-gen': [
    { title: 'QR Generator', emoji: '📱', url: '/qr-generator', desc: 'Create QR codes instantly' },
    { title: 'Signature Maker', emoji: '✍️', url: '/signature-maker', desc: 'Make digital signatures' },
    { title: 'Text to PDF', emoji: '📝', url: '/text-to-pdf', desc: 'Convert text to PDF' },
  ],
  'signature-maker': [
    { title: 'Add Watermark', emoji: '💧', url: '/add-watermark', desc: 'Add watermarks to images' },
    { title: 'PDF to Word', emoji: '📄', url: '/pdf-to-word', desc: 'Convert PDF to Word' },
    { title: 'Text to PDF', emoji: '📝', url: '/text-to-pdf', desc: 'Create PDF from text' },
  ],
  'unit-converter': [
    { title: 'QR Generator', emoji: '📱', url: '/qr-generator', desc: 'Generate QR codes' },
    { title: 'Password Generator', emoji: '🔐', url: '/password-gen', desc: 'Create strong passwords' },
    { title: 'Text to PDF', emoji: '📝', url: '/text-to-pdf', desc: 'Convert text to PDF' },
  ],
  'youtube-thumbnail': [
    { title: 'Image Compressor', emoji: '📦', url: '/image-compressor', desc: 'Compress images' },
    { title: 'Image Converter', emoji: '🎨', url: '/image-converter', desc: 'Convert image formats' },
    { title: 'Image to PDF', emoji: '🖼️', url: '/image-to-pdf', desc: 'Create PDF from images' },
  ],
  'text-to-pdf': [
    { title: 'Word to PDF', emoji: '📄', url: '/word-to-pdf', desc: 'Convert Word documents' },
    { title: 'Signature Maker', emoji: '✍️', url: '/signature-maker', desc: 'Create signatures' },
    { title: 'Add Watermark', emoji: '💧', url: '/add-watermark', desc: 'Add watermarks' },
  ],
};



// ============================================
// STEP 2: Reusable Related Tools Component
// ============================================
const RelatedToolsSection = ({ currentPage }) => {
  // Get related tools for current page
  const tools = relatedToolsData[currentPage] || [];

  // If no related tools defined, return null
  if (tools.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto mb-16 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          You Might Also Need
        </h3>

        <div className="space-y-4">
          {tools.map((tool, index) => (
            <a
              key={index}
              href={tool.url}
              className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <span className="text-2xl mr-4 flex-shrink-0">{tool.emoji}</span>
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                  {tool.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {tool.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};



// ============================================
// STEP 3: Example Usage - Demo Pages
// ============================================
const DemoPage = () => {
  const [currentPage, setCurrentPage] = React.useState('word-to-pdf');

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Demo Page Selector */}
      <div className="bg-blue-600 text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Related Tools Demo</h1>
        <p className="mb-4">Select a page to see related tools:</p>
        <select
          value={currentPage}
          onChange={(e) => setCurrentPage(e.target.value)}
          className="px-4 py-2 rounded text-gray-900"
        >
          <optgroup label="PDF Conversion">
            <option value="word-to-pdf">Word to PDF</option>
            <option value="pdf-to-word">PDF to Word</option>
            <option value="excel-pdf">Excel to PDF</option>
            <option value="image-to-pdf">Image to PDF</option>
          </optgroup>
          <optgroup label="PDF Manipulation">
            <option value="merge-pdf">Merge PDF</option>
            <option value="split-pdf">Split PDF</option>
            <option value="compress-pdf">Compress PDF</option>
          </optgroup>
          <optgroup label="Image Tools">
            <option value="image-compressor">Image Compressor</option>
            <option value="heic-to-jpg">HEIC to JPG</option>
            <option value="image-to-text">Image to Text</option>
            <option value="add-watermark">Add Watermark</option>
            <option value="image-converter">Image Converter</option>
          </optgroup>
          <optgroup label="Utility Tools">
            <option value="qr-generator">QR Generator</option>
            <option value="password-gen">Password Generator</option>
            <option value="signature-maker">Signature Maker</option>
            <option value="unit-converter">Unit Converter</option>
            <option value="youtube-thumbnail">YouTube Thumbnail</option>
            <option value="text-to-pdf">Text to PDF</option>
          </optgroup>
        </select>
      </div>

      {/* Main Tool Content (Example) */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {currentPage.split('-').map(word =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </h2>
          <p className="text-gray-600 mb-6">
            This is your main tool functionality area. Your converter, uploader, or tool interface goes here.
          </p>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Main Tool Interface</p>
          </div>
        </div>
      </div>

      {/* RELATED TOOLS SECTION - ADD THIS BEFORE FOOTER */}
      <RelatedToolsSection currentPage={currentPage} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>© 2026 PDF Linx - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default DemoPage;
