// Page copy for the format pair converters, keyed by slug.
// Links inside paragraphs are written as [anchor text](/path).
// FAQ answers stay plain text because they are also used in the FAQ schema.

const webpToJpg = {
  intro: "Turn WebP pictures saved from websites into ordinary JPG files that open and upload almost everywhere. Batch conversion, adjustable quality and no signup.",
  benefit: { title: "Opens Almost Anywhere", desc: "JPG is accepted by old software, forms and print shops that reject WebP." },
  stepTitles: ["Add WebP Files", "Set Quality and Colour", "Download JPG"],
  sections: [
    {
      title: "Why convert WebP to JPG?",
      paras: [
        "WebP is common on websites because it keeps files small. The trouble starts after you save such a picture: some editors, upload forms and older programs do not accept it. Converting **WebP to JPG** gives you the same picture in the most widely supported photo format.",
        "The conversion keeps the original width and height. If you need a different size, use the [Image Resizer](/image-resizer) afterwards, and if the JPG is too heavy for a form, run it through the [Image Compressor](/image-compressor).",
      ],
    },
    {
      title: "Transparency and the background colour",
      paras: [
        "A WebP file can have transparent areas, while JPG cannot. Those areas are painted with the colour you pick, white by default. To keep the transparency, use [WebP to PNG](/webp-to-png) instead. To remove an existing background first, try the [Background Remover](/background-remover).",
      ],
    },
    {
      title: "File size and quality",
      paras: [
        "Do not be surprised if the JPG is larger than the WebP you started with, because WebP usually stores the same picture in less space. JPG also compresses the image again, so keep the original file. For other output formats, use the [Image Converter](/image-converter).",
      ],
    },
  ],
  tips: [
    "Transparent areas take your chosen colour",
    "Only the first frame of an animated WebP is kept",
    "The JPG can be larger than the WebP",
    "Pixel dimensions stay the same",
    "92% quality is a good starting point",
    "Keep the original WebP as a backup",
  ],
  who: [
    "People whose upload form rejects WebP",
    "Online sellers preparing product photos",
    "Office staff adding web images to documents",
    "Students submitting assignments",
    "Anyone using older photo software",
    "People sending pictures to a print shop",
  ],
  related: [["/webp-to-png", "WebP to PNG"], ["/jpg-to-webp", "JPG to WebP"], ["/avif-to-jpg", "AVIF to JPG"], ["/image-converter", "Image Converter"], ["/image-compressor", "Image Compressor"], ["/png-to-jpg", "PNG to JPG"]],
  faqs: [
    { q: "How do I convert WebP to JPG?", a: "Add one or more WebP files, keep or change the quality and background colour, then download each JPG or all of them as a ZIP." },
    { q: "Are my WebP files uploaded?", a: "No. The conversion runs inside your browser and the files are not sent to a server." },
    { q: "What happens to a transparent background?", a: "JPG has no transparency, so transparent areas are filled with the background colour you choose. White is the default." },
    { q: "Why is the JPG bigger than the WebP?", a: "WebP generally compresses more efficiently than JPG. Lower the quality slider if you need a smaller file." },
    { q: "Can I convert animated WebP files?", a: "Only the first frame is converted, because JPG cannot hold animation." },
    { q: "Can I convert many files at once?", a: "Yes. Select several files together and use Download All as ZIP." },
  ],
};

const jpgToWebp = {
  intro: "Convert JPG photos to WebP to make web pages and uploads lighter. Choose the quality, compare the sizes and download one file or a ZIP.",
  benefit: { title: "Lighter Web Images", desc: "See the size before and after for every file, and tune it with the slider." },
  stepTitles: ["Add JPG Files", "Choose Quality", "Download WebP"],
  sections: [
    {
      title: "Why convert JPG to WebP?",
      paras: [
        "Images are often the heaviest part of a web page. WebP is a format made for the web that can usually hold a photo in a smaller file than JPG at a similar visual quality. Converting **JPG to WebP** is a simple step before you publish a blog post or a product listing.",
        "Resize first, then convert. A photo straight from a phone is far wider than most pages need, so reduce it with the [Image Resizer](/image-resizer) or trim it with the [Image Cropper](/image-cropper).",
      ],
    },
    {
      title: "Choosing the quality",
      paras: [
        "The slider starts at 85%. Every file shows its old and new size, so you can lower the value and check the result. Savings depend on the picture, and a JPG that is already heavily compressed may not get smaller at all. In that case keep the JPG, or try the [Image Compressor](/image-compressor).",
      ],
    },
    {
      title: "Where WebP works",
      paras: [
        "Current web browsers display WebP. Some email programs, office software and upload forms still expect JPG, so keep your originals. You can switch back any time with [WebP to JPG](/webp-to-jpg), and the [Image Converter](/image-converter) covers other formats.",
      ],
    },
  ],
  tips: [
    "Check the new size before replacing a file",
    "Resize large photos before publishing",
    "JPG and JPEG files are both accepted",
    "Pixel dimensions stay the same",
    "Re-compressing cannot restore lost detail",
    "WebP is limited to 16383 pixels per side",
  ],
  who: [
    "Bloggers and website owners",
    "Developers preparing site assets",
    "Online shop managers",
    "Anyone with a page that loads slowly",
    "Designers delivering web images",
    "People saving space on shared drives",
  ],
  related: [["/webp-to-jpg", "WebP to JPG"], ["/webp-to-png", "WebP to PNG"], ["/image-converter", "Image Converter"], ["/image-compressor", "Image Compressor"], ["/image-resizer", "Image Resizer"], ["/heic-to-jpg", "HEIC to JPG"]],
  faqs: [
    { q: "How do I convert JPG to WebP?", a: "Add your JPG files, set the quality, and download each WebP or all of them as a ZIP." },
    { q: "Will the WebP always be smaller?", a: "Not always. It depends on the picture and the quality setting, which is why both sizes are shown." },
    { q: "Does converting reduce quality?", a: "WebP at these settings is lossy, so a little detail can be lost. Keep the original JPG." },
    { q: "Are my photos uploaded?", a: "No. They are converted in your browser and are not sent to a server." },
    { q: "Can I convert iPhone HEIC photos here?", a: "This page takes JPG files. Convert HEIC photos with the HEIC to JPG tool first, or use the Image Converter." },
    { q: "Can I convert many files at once?", a: "Yes. Select several files together and use Download All as ZIP." },
  ],
};

const webpToPng = {
  intro: "Convert WebP to PNG and keep the transparent background. Works in your browser with batch conversion and ZIP download, with no upload.",
  benefit: { title: "Keeps Transparency", desc: "See-through areas in your WebP stay see-through in the PNG." },
  stepTitles: ["Add WebP Files", "Wait a Moment", "Download PNG"],
  sections: [
    {
      title: "Why convert WebP to PNG?",
      paras: [
        "PNG is the safe choice for logos, stickers, screenshots and cutouts that need a transparent background. Many design and office programs handle PNG more reliably than WebP. Converting **WebP to PNG** keeps the transparency and adds no further compression loss.",
        "There is no quality slider on this page because PNG is lossless. It cannot bring back detail that was already lost when the WebP was saved.",
      ],
    },
    {
      title: "Expect a larger file",
      paras: [
        "A PNG is often much larger than the WebP it came from, especially for photographs. If you do not need transparency, [WebP to JPG](/webp-to-jpg) gives a lighter file. You can also shrink the result with the [Image Compressor](/image-compressor).",
      ],
    },
    {
      title: "What to do next",
      paras: [
        "Use the [Image Resizer](/image-resizer) to set exact dimensions, or the [Background Remover](/background-remover) if the picture still has a background you want gone. For a website icon, continue with [PNG to ICO](/png-to-ico). When you need a JPG later, [PNG to JPG](/png-to-jpg) lets you pick the background colour.",
      ],
    },
  ],
  tips: [
    "Transparent areas are preserved",
    "PNG files are often larger than WebP",
    "Only the first frame of an animation is kept",
    "Pixel dimensions stay the same",
    "No quality setting is needed",
    "Preview squares show transparent parts",
  ],
  who: [
    "Designers working with logos and cutouts",
    "People making presentations",
    "Sticker and thumbnail creators",
    "Developers preparing icons",
    "Anyone whose editor will not open WebP",
    "Teachers adding images to worksheets",
  ],
  related: [["/webp-to-jpg", "WebP to JPG"], ["/jpg-to-webp", "JPG to WebP"], ["/image-converter", "Image Converter"], ["/background-remover", "Background Remover"], ["/image-resizer", "Image Resizer"], ["/png-to-ico", "PNG to ICO"]],
  faqs: [
    { q: "How do I convert WebP to PNG?", a: "Add your WebP files and the PNG versions appear. Download them one by one or all as a ZIP." },
    { q: "Is transparency kept?", a: "Yes. PNG supports transparency, so see-through areas stay as they are." },
    { q: "Why is the PNG so much bigger?", a: "PNG stores the picture without lossy compression, which takes more space than WebP." },
    { q: "Does PNG improve the quality?", a: "No. It keeps the picture as it is in the WebP and cannot restore lost detail." },
    { q: "Are my files uploaded?", a: "No. The conversion happens in your browser and nothing is sent to a server." },
    { q: "Can I convert many files at once?", a: "Yes. Select several files together and use Download All as ZIP." },
  ],
};

const avifToJpg = {
  intro: "Open AVIF images as ordinary JPG files for apps, forms and devices that do not read AVIF yet. Batch conversion in your browser, with no upload.",
  benefit: { title: "Fixes Unsupported Files", desc: "Turn an AVIF that will not open into a JPG you can use." },
  stepTitles: ["Add AVIF Files", "Set Quality and Colour", "Download JPG"],
  sections: [
    {
      title: "Why convert AVIF to JPG?",
      paras: [
        "AVIF is a newer image format that some websites use to serve small, sharp pictures. A saved AVIF may refuse to open in a photo viewer, an editor or an upload form. Converting **AVIF to JPG** solves that without installing anything.",
      ],
    },
    {
      title: "Your browser does the decoding",
      paras: [
        "This converter relies on the AVIF support built into your browser. Current versions of Chrome, Edge, Firefox and Safari have it. If yours does not, the page says so before you add any files. A damaged file or an unusual AVIF variant shows its own message, and the other files in the batch continue.",
      ],
    },
    {
      title: "Quality, size and transparency",
      paras: [
        "JPG is usually larger than AVIF for the same picture, and converting compresses the image again. Colours from HDR pictures may look different in an 8-bit JPG. Transparent areas are filled with the colour you choose. Afterwards you can trim the picture with the [Image Cropper](/image-cropper), reduce it with the [Image Compressor](/image-compressor), or publish a web copy with [JPG to WebP](/jpg-to-webp).",
        "If your files are iPhone photos ending in .heic, use [HEIC to JPG](/heic-to-jpg) instead. The [Image Converter](/image-converter) offers more output formats.",
      ],
    },
  ],
  tips: [
    "The JPG will often be larger than the AVIF",
    "Transparent areas take your chosen colour",
    "Animated AVIF gives one still frame",
    "Pixel dimensions stay the same",
    "Keep the original AVIF as a backup",
    "Very large images need more device memory",
  ],
  who: [
    "People who saved a picture that will not open",
    "Anyone facing an upload form that rejects AVIF",
    "Office users inserting images into documents",
    "Sellers preparing marketplace photos",
    "Students submitting image files",
    "People sharing pictures with older devices",
  ],
  related: [["/webp-to-jpg", "WebP to JPG"], ["/heic-to-jpg", "HEIC to JPG"], ["/image-converter", "Image Converter"], ["/image-compressor", "Image Compressor"], ["/image-resizer", "Image Resizer"], ["/png-to-jpg", "PNG to JPG"]],
  faqs: [
    { q: "How do I convert AVIF to JPG?", a: "Add your AVIF files, adjust the quality if you wish, and download each JPG or a ZIP of all of them." },
    { q: "What is an AVIF file?", a: "AVIF is an image format based on the AV1 video codec. It is designed to keep pictures small." },
    { q: "Why does the page say my browser cannot open AVIF?", a: "The converter uses your browser's own AVIF support. An older browser does not have it, so update it or use another one." },
    { q: "Are my images uploaded?", a: "No. They are decoded and converted on your device and are not sent to a server." },
    { q: "Will the JPG look the same?", a: "It is usually very close at high quality, but JPG is lossy and cannot hold transparency or HDR detail." },
    { q: "Can I convert many files at once?", a: "Yes. Select several files together and use Download All as ZIP." },
  ],
};

export const CONVERTER_CONTENT = {
  "webp-to-jpg": webpToJpg,
  "jpg-to-webp": jpgToWebp,
  "webp-to-png": webpToPng,
  "avif-to-jpg": avifToJpg,
};
