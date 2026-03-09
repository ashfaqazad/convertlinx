import Link from "next/link";
import { notFound } from "next/navigation";

const blogs = [
  {
    slug: "qr-generator",
    title: "How to Generate QR Codes Instantly (Free & Customizable)",
    date: "Dec 2, 2025",
    content: `
    <h2>How to Make QR Codes Quickly (And Actually Make Them Look Good)</h2>

    <p>QR codes are literally everywhere now — restaurant menus, business cards, posters, even Wi-Fi passwords at cafes. I remember the first time I needed one: I wanted to share my portfolio link at a meetup. Spent way too long searching for a decent free tool that didn't slap a watermark or make it ugly.</p>

    <p>That's why I built the <a href="/qr-generator"><strong>QR Code Generator</strong></a> on ConvertLinx. Now whenever I need one — for my website, Instagram, Wi-Fi at home, or even a quick "text me" code — I just type it in and download a clean, sharp QR in seconds.</p>

    <h3>Super Simple Steps (Takes less than 20 seconds):</h3>
    <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
      <li>Go to the <a href="/qr-generator" class="text-indigo-600 hover:underline">QR Code Generator</a></li>
      <li>Type in your link, text, Wi-Fi details, or contact info</li>
      <li>QR code generates live as you type</li>
      <li>Click Download and save as PNG</li>
    </ol>

    <p>No signup, no watermarks, no limits. Works great for business cards, flyers, event posters, sharing social profiles, or even putting your Wi-Fi password on the fridge so guests stop asking.</p>

    <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center my-12">
      <p class="text-xl font-semibold text-indigo-800 mb-4">
        Need a QR code right now? Make one — it's faster than explaining your Wi-Fi password again.
      </p>
      <a href="/qr-generator" class="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg">
        Generate QR Code for Free →
      </a>
    </div>

    <p class="text-center text-gray-600">
      <a href="/blog" class="text-indigo-600 hover:underline">← Back to all guides</a>
    </p>
    `,
  },

  {
    slug: "password-gen",
    title: "How to Create Strong Passwords Instantly (Free Password Generator)",
    date: "Dec 3, 2025",
    content: `
    <h2>How to Make Really Strong Passwords (Without Going Crazy)</h2>

    <p>I used to be terrible with passwords. Same one for everything, or slight variations like "Password123" and "Password123!" — you know the type. Then one day an old account got hacked, and I realized how dumb that was.</p>

    <p>Coming up with truly random, strong passwords is hard. Your brain doesn't want to remember "x7K#pL9$mQw2". That's why I built the <a href="/password-gen"><strong>Password Generator</strong></a> on ConvertLinx. Now whenever I sign up for something new — email, banking, random app — I just open this, tweak a couple settings, and get a bulletproof password in seconds.</p>

    <h3>Super Easy Steps (Takes less than 10 seconds):</h3>
    <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
      <li>Go to the <a href="/password-gen" class="text-indigo-600 hover:underline">Password Generator</a></li>
      <li>Choose how long you want it (I usually go 16-20 characters)</li>
      <li>Check the boxes for uppercase, numbers, symbols</li>
      <li>Click Generate and copy the result</li>
    </ol>

    <p>No signup, no limits. Works great for new accounts, resetting old ones, or just replacing weak passwords you've been using too long.</p>

    <p><strong>My biggest tip:</strong> Don't try to remember them all. Copy the password straight into a password manager like Bitwarden or your browser's built-in one.</p>

    <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center my-12">
      <p class="text-xl font-semibold text-indigo-800 mb-4">
        Need a new strong password right now? Generate one — your accounts will thank you.
      </p>
      <a href="/password-gen" class="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg">
        Generate Secure Password for Free →
      </a>
    </div>

    <p class="text-center text-gray-600">
      <a href="/blog" class="text-indigo-600 hover:underline">← Back to all guides</a>
    </p>
    `,
  },

  {
    slug: "unit-converter",
    title: "How to Convert Units Easily (Free Online Unit Converter)",
    date: "Dec 4, 2025",
    content: `
    <h2>How to Convert Units Without Pulling Your Hair Out</h2>

    <p>I still remember the first time I needed to convert meters to feet for a project — opened Google, typed it in, got the answer, but then needed centimeters to inches, kilograms to pounds… and ended up with 10 tabs open. Total mess.</p>

    <p>That's why I built the <a href="/unit-converter"><strong>Unit Converter</strong></a> on ConvertLinx. Now whenever I need to switch units — length, weight, temperature, volume, area — I just type the number, pick the units, and boom, instant accurate result.</p>

    <h3>Super Easy Steps (Takes literally 5 seconds):</h3>
    <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
      <li>Go to the <a href="/unit-converter" class="text-indigo-600 hover:underline">Unit Converter</a></li>
      <li>Pick what you're converting (length, weight, temperature, etc.)</li>
      <li>Type your value and choose "from" and "to" units</li>
      <li>Watch the conversion happen instantly as you type</li>
    </ol>

    <p>No signup, no ads, works on phone or laptop. Perfect for students doing science homework, cooks following foreign recipes, travelers checking temperatures, or anyone who just hates doing math in their head.</p>

    <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center my-12">
      <p class="text-xl font-semibold text-indigo-800 mb-4">
        Need to convert something right now? Try it — you'll probably end up bookmarking it too.
      </p>
      <a href="/unit-converter" class="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg">
        Open Free Unit Converter →
      </a>
    </div>

    <p class="text-center text-gray-600">
      <a href="/blog" class="text-indigo-600 hover:underline">← Back to all guides</a>
    </p>
    `,
  },

  {
    slug: "youtube-thumbnail",
    title: "How to Download YouTube Thumbnails in HD (One Click, Free)",
    date: "Dec 5, 2025",
    content: `
    <h2>How to Grab YouTube Thumbnails in High Quality (Super Easy Way)</h2>

    <p>I watch a lot of YouTube — tutorials, reviews, music, random stuff. Sometimes I see a video with an awesome thumbnail and think, "Man, that would make a great wallpaper" or "I need that image for a project." But right-clicking doesn't give you the full-quality version.</p>

    <p>So I built the <a href="/youtube-thumbnail"><strong>YouTube Thumbnail Downloader</strong></a> on ConvertLinx. Now whenever I want a thumbnail, I paste the video link, pick the quality, and download a crisp HD image in seconds.</p>

    <h3>Dead Simple Steps (Takes less than 10 seconds):</h3>
    <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
      <li>Copy the YouTube video URL</li>
      <li>Go to the <a href="/youtube-thumbnail" class="text-indigo-600 hover:underline">Thumbnail Downloader</a></li>
      <li>Paste the link</li>
      <li>Choose your quality — HD, Full HD, or max resolution</li>
      <li>Download the image instantly</li>
    </ol>

    <p>No signup, no watermarks. Works for any public YouTube video. Great for creators, bloggers, designers, or just saving a cool cover for personal use.</p>

    <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center my-12">
      <p class="text-xl font-semibold text-indigo-800 mb-4">
        Got a YouTube video with a thumbnail you love? Grab it in full quality now.
      </p>
      <a href="/youtube-thumbnail" class="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg">
        Download YouTube Thumbnail for Free →
      </a>
    </div>

    <p class="text-center text-gray-600">
      <a href="/blog" class="text-indigo-600 hover:underline">← Back to all guides</a>
    </p>
    `,
  },

  {
    slug: "image-compressor",
    title: "How to Compress Images Without Losing Quality (Free Online Tool)",
    date: "Dec 6, 2025",
    content: `
    <h2>How to Make Images Smaller Without Them Looking Terrible</h2>

    <p>I take a lot of photos — phone pics, screenshots, product shots for side projects. The problem? They're usually huge. 5MB, 10MB each. Upload them to a website and the page loads like molasses. Try emailing a few and your attachment gets rejected.</p>

    <p>That's why I added the <a href="/image-compressor"><strong>Image Compressor</strong></a> on ConvertLinx. Now whenever I have big images, I drop them here, slide the compression level, and get much smaller files that still look crisp and clear.</p>

    <h3>Really Easy Steps (Takes about 10 seconds per image):</h3>
    <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
      <li>Go to the <a href="/image-compressor" class="text-indigo-600 hover:underline">Image Compressor</a></li>
      <li>Upload your JPG, PNG, or WebP files — multiple at once works too</li>
      <li>Adjust the compression level (medium is usually perfect)</li>
      <li>Download the smaller versions instantly</li>
    </ol>

    <p>No signup, no watermarks, no limits. Perfect for speeding up websites, making social media posts load faster, or just sending images without "file too large" errors.</p>

    <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center my-12">
      <p class="text-xl font-semibold text-indigo-800 mb-4">
        Got some heavy images taking up space? Shrink them now — you'll be surprised how much room you free up.
      </p>
      <a href="/image-compressor" class="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg">
        Compress Images for Free →
      </a>
    </div>

    <p class="text-center text-gray-600">
      <a href="/blog" class="text-indigo-600 hover:underline">← Back to all guides</a>
    </p>
    `,
  },

  {
    slug: "image-to-text",
    title: "How to Convert Images to Text Using AI (Free Image to Text Tool)",
    date: "Dec 7, 2025",
    content: `
    <h2>How to Extract Text from Images (The Easy Way)</h2>

    <p>I take a lot of photos of things I want to remember — whiteboards from meetings, pages from books, receipts for expenses, handwritten notes from classes. But then I'm stuck: the text is trapped in the image, and typing it all out manually takes forever.</p>

    <p>That's why I built the <a href="/image-to-text"><strong>Image to Text tool</strong></a> on ConvertLinx. Now whenever I have a photo or screenshot with text, I just drop it in, wait a few seconds, and get clean, editable text I can copy right away.</p>

    <h3>Super Simple Steps (Takes about 10-20 seconds):</h3>
    <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
      <li>Go to the <a href="/image-to-text" class="text-indigo-600 hover:underline">Image to Text tool</a></li>
      <li>Upload your image or screenshot (JPG, PNG, even scans)</li>
      <li>Wait while OCR does its thing (usually 5-15 seconds)</li>
      <li>Copy the extracted text instantly</li>
    </ol>

    <p>No signup, no watermarks, nothing uploaded permanently. Works great for printed documents, receipts, book pages, screenshots, or even clear handwritten notes.</p>

    <p><strong>My best tip:</strong> The clearer and brighter the image, the better the result. Good lighting and straight-on shots make a huge difference.</p>

    <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center my-12">
      <p class="text-xl font-semibold text-indigo-800 mb-4">
        Got a photo or scan with text you need to copy? Try it now — you'll save yourself a ton of typing.
      </p>
      <a href="/image-to-text" class="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg">
        Extract Text from Image for Free →
      </a>
    </div>

    <p class="text-center text-gray-600">
      <a href="/blog" class="text-indigo-600 hover:underline">← Back to all guides</a>
    </p>
    `,
  },

  {
    slug: "signature-maker",
    title: "How to Create & Download Digital Signatures Online (Free Signature Maker)",
    date: "Dec 8, 2025",
    content: `
    <h2>How to Make a Digital Signature That Actually Looks Good</h2>

    <p>I freelance a bit on the side, and nothing kills the vibe faster than a client sending a contract and saying "just sign and send back." Printing, signing by hand, scanning — total hassle.</p>

    <p>That's why I built the <a href="/signature-maker"><strong>Signature Maker</strong></a> on ConvertLinx. Now whenever I need to sign something — contracts, NDAs, invoices — I just draw my signature with the mouse or finger, and download a clean transparent PNG in seconds.</p>

    <h3>Super Easy Steps (Takes less than 30 seconds):</h3>
    <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
      <li>Go to the <a href="/signature-maker" class="text-indigo-600 hover:underline">Signature Maker</a></li>
      <li>Draw your signature with the mouse, trackpad, or finger</li>
      <li>Pick pen color and stroke size</li>
      <li>Click Download and save the transparent PNG</li>
    </ol>

    <p>No signup, no watermarks, downloads as transparent PNG so it works perfectly on any document. Great for freelancers, remote workers, or anyone dealing with digital paperwork.</p>

    <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center my-12">
      <p class="text-xl font-semibold text-indigo-800 mb-4">
        Need a digital signature ready to go? Make one now — you'll use it more than you think.
      </p>
      <a href="/signature-maker" class="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg">
        Create Signature for Free →
      </a>
    </div>

    <p class="text-center text-gray-600">
      <a href="/blog" class="text-indigo-600 hover:underline">← Back to all guides</a>
    </p>
    `,
  },

  {
    slug: "heic-to-jpg",
    title: "How to Convert HEIC to JPG Instantly (Free Online Tool)",
    date: "Dec 9, 2025",
    content: `
    <h2>How to Convert iPhone HEIC Photos to JPG (The Easy Way)</h2>

    <p>I love my iPhone camera, but every time I try to send photos to friends on Android or upload them to a website on my Windows laptop, I hit the same problem: "File format not supported." Apple's HEIC files look great and save space, but half the world can't open them.</p>

    <p>That's why I added the <a href="/heic-to-jpg"><strong>HEIC to JPG converter</strong></a> on ConvertLinx. Now whenever I have iPhone photos I need to share, I just drop the HEIC files here and get clean, normal JPGs in seconds.</p>

    <h3>Super Simple Steps (Takes less than 20 seconds):</h3>
    <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
      <li>Go to the <a href="/heic-to-jpg" class="text-indigo-600 hover:underline">HEIC to JPG tool</a></li>
      <li>Upload your HEIC photos — drag multiple at once if you want</li>
      <li>Conversion happens automatically</li>
      <li>Download the JPG versions instantly</li>
    </ol>

    <p>No signup, no watermarks, no quality loss. Perfect for sharing vacation pics, uploading to job sites, or posting on forums.</p>

    <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center my-12">
      <p class="text-xl font-semibold text-indigo-800 mb-4">
        Got some iPhone photos stuck in HEIC? Turn them into JPGs now.
      </p>
      <a href="/heic-to-jpg" class="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg">
        Convert HEIC to JPG for Free →
      </a>
    </div>

    <p class="text-center text-gray-600">
      <a href="/blog" class="text-indigo-600 hover:underline">← Back to all guides</a>
    </p>
    `,
  },

  {
    slug: "text-to-pdf",
    title: "How to Convert Text to PDF Instantly (Free Online Tool)",
    date: "Dec 10, 2025",
    content: `
    <h2>How to Turn Plain Text into a Nice PDF (The Quick Way)</h2>

    <p>Sometimes you just have text — notes in Notepad, an essay in a plain editor, a quick letter. But sending it as a .txt file looks messy, and people might not even open it properly.</p>

    <p>That's why I added the <a href="/text-to-pdf"><strong>Text to PDF converter</strong></a> on ConvertLinx. Now whenever I have plain text I want to share professionally, I just paste it in, hit convert, and get a clean PDF in seconds.</p>

    <h3>Really Easy Steps (Takes less than 20 seconds):</h3>
    <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
      <li>Go to the <a href="/text-to-pdf" class="text-indigo-600 hover:underline">Text to PDF tool</a></li>
      <li>Paste or type your text into the box</li>
      <li>Click Download as PDF</li>
      <li>Your clean PDF downloads instantly</li>
    </ol>

    <p>No signup, no watermarks, no weird formatting issues. Great for saving notes, turning essays into submittable files, making quick letters, or archiving text properly.</p>

    <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center my-12">
      <p class="text-xl font-semibold text-indigo-800 mb-4">
        Got some text you want to turn into a proper PDF? Try it now.
      </p>
      <a href="/text-to-pdf" class="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg">
        Convert Text to PDF for Free →
      </a>
    </div>

    <p class="text-center text-gray-600">
      <a href="/blog" class="text-indigo-600 hover:underline">← Back to all guides</a>
    </p>
    `,
  },

  {
    slug: "image-converter",
    title: "Convert Images to Any Format Online Free (JPG, PNG, WebP & More)",
    date: "Dec 11, 2025",
    content: `
    <h2>How to Convert Images Between Any Format (Super Easy Way)</h2>

    <p>Design tools want PNG, websites prefer WebP, email clients work best with JPG, and then there's HEIC from iPhones that nothing opens. Switching between formats used to mean opening Photoshop or downloading some sketchy converter.</p>

    <p>That's why I built the <a href="/image-converter"><strong>Image Converter</strong></a> on ConvertLinx. Now whenever I need to switch formats — JPG to PNG, WebP to JPEG, HEIC to anything — I just upload, pick the target format, and download in seconds.</p>

    <h3>Dead Simple Steps (Takes less than 15 seconds):</h3>
    <ol class="list-decimal list-inside space-y-3 ml-4 text-lg">
      <li>Go to the <a href="/image-converter" class="text-indigo-600 hover:underline">Image Converter</a></li>
      <li>Upload your image (JPG, PNG, WebP, HEIC, GIF, BMP, and more)</li>
      <li>Pick the output format you need</li>
      <li>Download the converted image instantly</li>
    </ol>

    <p>Supports 20+ formats. No signup, no watermarks, batch conversion supported.</p>

    <p><strong>My most used combo:</strong> Converting HEIC photos from my iPhone to JPG or WebP for websites. Saves a ton of time versus doing them one by one.</p>

    <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center my-12">
      <p class="text-xl font-semibold text-indigo-800 mb-4">
        Need to switch image formats right now? Convert in seconds — no Photoshop needed.
      </p>
      <a href="/image-converter" class="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg">
        Convert Image Format for Free →
      </a>
    </div>

    <p class="text-center text-gray-600">
      <a href="/blog" class="text-indigo-600 hover:underline">← Back to all guides</a>
    </p>
    `,
  },
];

// ── Metadata ──
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) return notFound();

  return {
    title: blog.title + " | ConvertLinx Blog",
    description: blog.content.replace(/<[^>]+>/g, "").slice(0, 160),
    keywords: [
      "ConvertLinx",
      "free online tools",
      "image converter",
      "QR code generator",
      "password generator",
      "unit converter",
      "image compressor",
      "HEIC to JPG",
      "text to PDF",
      "signature maker",
      "image to text",
      "YouTube thumbnail downloader",
    ],
    alternates: {
      canonical: `https://convertlinx.com/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.content.replace(/<[^>]+>/g, "").slice(0, 160),
      url: `https://convertlinx.com/blog/${slug}`,
      type: "article",
      siteName: "convertlinx",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.content.replace(/<[^>]+>/g, "").slice(0, 160),
    },
  };
}

// ── Blog Post Page ──
export default async function BlogPost({ params }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) return notFound();

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">
        {blog.title}
      </h1>
      <p className="text-gray-500 text-sm mb-8">{blog.date}</p>

      <article
        className="prose prose-base max-w-none text-gray-700 leading-relaxed space-y-5"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </main>
  );
}