// ─────────────────────────────────────────────────────────────
// ConvertLinx — browser-only image decoders & encoders
// Everything runs on the user's device. Heavy codecs (HEIC, AVIF,
// JPEG XL, TIFF, PSD, GIF) are lazy-loaded only when actually needed.
// ─────────────────────────────────────────────────────────────

const RAW_EXT = ['dng', 'cr2', 'cr3', 'nef', 'arw', 'raf', 'orf', 'rw2'];

export const OUTPUT_META = {
  webp: { ext: 'webp', mime: 'image/webp' },
  png:  { ext: 'png',  mime: 'image/png' },
  jpg:  { ext: 'jpg',  mime: 'image/jpeg' },
  gif:  { ext: 'gif',  mime: 'image/gif' },
  avif: { ext: 'avif', mime: 'image/avif' },
  jxl:  { ext: 'jxl',  mime: 'image/jxl' },
  svg:  { ext: 'svg',  mime: 'image/svg+xml' },
  ico:  { ext: 'ico',  mime: 'image/x-icon' },
  tiff: { ext: 'tiff', mime: 'image/tiff' },
  bmp:  { ext: 'bmp',  mime: 'image/bmp' },
  tga:  { ext: 'tga',  mime: 'image/x-tga' },
  pcx:  { ext: 'pcx',  mime: 'image/x-pcx' },
};

// ── helpers ──────────────────────────────────────────────────
const getExt = (name) => (name.split('.').pop() || '').toLowerCase();

function newCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function canvasFromImageData(imageData) {
  const c = newCanvas(imageData.width, imageData.height);
  c.getContext('2d').putImageData(imageData, 0, 0);
  return c;
}

function canvasFromRGBA(rgba, w, h) {
  const px = new Uint8ClampedArray(rgba.buffer, rgba.byteOffset, w * h * 4);
  return canvasFromImageData(new ImageData(px, w, h));
}

const getImageData = (c) => c.getContext('2d').getImageData(0, 0, c.width, c.height);
const toBlob = (c, type, q) => new Promise((res) => c.toBlob(res, type, q));

// JPG / PCX have no alpha: put transparent pixels on white instead of black
function flatten(c, bg = '#ffffff') {
  const o = newCanvas(c.width, c.height);
  const g = o.getContext('2d');
  g.fillStyle = bg;
  g.fillRect(0, 0, o.width, o.height);
  g.drawImage(c, 0, 0);
  return o;
}

// ═════════════════════════════════════════════════════════════
// DECODERS  (any input → canvas)
// ═════════════════════════════════════════════════════════════

async function decodeNative(blob) {
  // createImageBitmap: fast + respects EXIF orientation. SVG needs <img>.
  if (blob.type !== 'image/svg+xml') {
    try {
      const bmp = await createImageBitmap(blob);
      const c = newCanvas(bmp.width, bmp.height);
      c.getContext('2d').drawImage(bmp, 0, 0);
      bmp.close?.();
      return c;
    } catch { /* fall through to <img> */ }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || 1024;
      const h = img.naturalHeight || 1024;
      const c = newCanvas(w, h);
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Your browser could not read this file. It may be corrupted or an unsupported variant.'));
    };
    img.src = url;
  });
}

async function decodeHEIC(file) {
  try { return await decodeNative(file); } catch { /* Safari decodes natively; others need heic2any */ }
  const heic2any = (await import('heic2any')).default;
  let out = await heic2any({ blob: file, toType: 'image/png' });
  if (Array.isArray(out)) out = out[0]; // multi-image HEIC → first image
  return decodeNative(out);
}

async function decodeTIFF(file) {
  const mod = await import('utif');
  const UTIF = mod.default || mod;
  const buf = await file.arrayBuffer();
  const ifds = UTIF.decode(buf);
  if (!ifds.length) throw new Error('No image found in this TIFF file.');
  const page = ifds[0];
  UTIF.decodeImage(buf, page, ifds);
  const rgba = UTIF.toRGBA8(page);
  return canvasFromRGBA(rgba, page.width, page.height);
}

async function decodeJXL(file) {
  try { return await decodeNative(file); } catch { /* Safari 17+ decodes natively */ }
  const { default: decode } = await import('@jsquash/jxl/decode');
  return canvasFromImageData(await decode(await file.arrayBuffer()));
}

async function decodePSD(file) {
  const { readPsd } = await import('ag-psd');
  const psd = readPsd(await file.arrayBuffer(), { skipLayerImageData: true, skipThumbnail: true });
  if (!psd.canvas) {
    throw new Error('This PSD has no merged preview. Re-save it in Photoshop with "Maximize Compatibility" turned on.');
  }
  return psd.canvas;
}

function decodeTGA(buf) {
  const d = new Uint8Array(buf);
  if (d.length < 18) throw new Error('This TGA file is incomplete.');
  const idLen = d[0], cmapType = d[1], type = d[2];
  const cmapStart = d[3] | (d[4] << 8);
  const cmapLen = d[5] | (d[6] << 8);
  const cmapBits = d[7];
  const w = d[12] | (d[13] << 8);
  const h = d[14] | (d[15] << 8);
  const bpp = d[16], desc = d[17];
  const mapped = type === 1 || type === 9;
  const gray = type === 3 || type === 11;
  const rle = type === 9 || type === 10 || type === 11;
  const trueColor = type === 2 || type === 10;
  const supported = w > 0 && h > 0 && (
    mapped ? cmapType === 1 && bpp === 8 && [15, 16, 24, 32].includes(cmapBits)
    : gray ? bpp === 8
    : trueColor && [16, 24, 32].includes(bpp)
  );
  if (!supported) {
    throw new Error('This TGA variant is not supported (only 8-bit gray / color-mapped and 16, 24, 32-bit color are).');
  }
  const px = Math.ceil(bpp / 8);
  const topDown = (desc & 0x20) !== 0;
  const rightToLeft = (desc & 0x10) !== 0;
  const alphaBits = desc & 0x0f;
  const cb = Math.ceil(cmapBits / 8);
  const cmapOff = 18 + idLen;
  const dataOff = cmapOff + (cmapType === 1 ? cmapLen * cb : 0);
  const out = new Uint8ClampedArray(w * h * 4);
  const total = w * h;
  const c5 = (v) => (v << 3) | (v >> 2);

  // read one pixel at byte offset `o` (bytes of this pixel format) into out[q..q+3]
  const readColor = (src, o, bits, q, useAlpha) => {
    if (bits === 8) { out[q] = out[q + 1] = out[q + 2] = src[o]; out[q + 3] = 255; }
    else if (bits === 15 || bits === 16) {
      const v = src[o] | (src[o + 1] << 8);
      out[q] = c5((v >> 10) & 31); out[q + 1] = c5((v >> 5) & 31); out[q + 2] = c5(v & 31);
      out[q + 3] = useAlpha && bits === 16 ? ((v & 0x8000) ? 255 : 0) : 255;
    } else {
      out[q] = src[o + 2]; out[q + 1] = src[o + 1]; out[q + 2] = src[o];
      out[q + 3] = bits === 32 && useAlpha ? src[o + 3] : 255;
    }
  };

  const put = (i, o) => {
    let x = i % w;
    const yf = (i / w) | 0;
    const y = topDown ? yf : h - 1 - yf;
    if (rightToLeft) x = w - 1 - x;
    const q = (y * w + x) * 4;
    if (mapped) {
      const idx = d[o] - cmapStart;
      if (idx >= 0 && idx < cmapLen) readColor(d, cmapOff + idx * cb, cmapBits, q, alphaBits > 0);
      else out[q + 3] = 255;
    } else if (gray) {
      readColor(d, o, 8, q, false);
    } else {
      readColor(d, o, bpp, q, alphaBits > 0);
    }
  };

  let p = dataOff;
  let i = 0;
  if (!rle) {
    for (; i < total && p + px <= d.length; i++, p += px) put(i, p);
  } else {
    while (i < total && p < d.length) {
      const hdr = d[p++];
      const n = (hdr & 0x7f) + 1;
      if (hdr & 0x80) { for (let k = 0; k < n && i < total; k++) put(i++, p); p += px; }
      else { for (let k = 0; k < n && i < total; k++) { put(i++, p); p += px; } }
    }
  }
  return canvasFromImageData(new ImageData(out, w, h));
}

// Find where a JPEG that starts at `start` ends (walks marker segments, then entropy data)
function jpegEnd(d, start) {
  let p = start + 2;
  while (p + 4 <= d.length) {
    if (d[p] !== 0xff) return -1;
    const m = d[p + 1];
    if (m === 0xff) { p++; continue; }
    if (m === 0xd9) return p + 2;
    if ((m >= 0xd0 && m <= 0xd7) || m === 0x01) { p += 2; continue; }
    const len = (d[p + 2] << 8) | d[p + 3];
    p += 2 + len;
    if (m === 0xda) {
      while (p + 1 < d.length) {
        if (d[p] === 0xff) {
          const n = d[p + 1];
          if (n === 0x00 || (n >= 0xd0 && n <= 0xd7)) { p += 2; continue; }
          if (n === 0xff) { p += 1; continue; }
          if (n === 0xd9) return p + 2;
          break; // another marker (progressive JPEG) → back to segment loop
        }
        p++;
      }
    }
  }
  return -1;
}

// RAW files can't be developed in a browser, but every camera embeds a
// full-size (or large) JPEG preview. We extract the biggest one that decodes.
async function decodeRAW(file) {
  const d = new Uint8Array(await file.arrayBuffer());
  const cands = [];
  for (let i = 0; i < d.length - 3; i++) {
    if (d[i] === 0xff && d[i + 1] === 0xd8 && d[i + 2] === 0xff) {
      const end = jpegEnd(d, i);
      if (end > 0) { cands.push([i, end]); i = end - 1; }
    }
  }
  cands.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]));
  for (const [s, e] of cands) {
    try {
      const canvas = await decodeNative(new Blob([d.subarray(s, e)], { type: 'image/jpeg' }));
      return { canvas, note: `Converted from the camera's embedded preview (${canvas.width}×${canvas.height})` };
    } catch { /* e.g. lossless-JPEG sensor data → try next */ }
  }
  throw new Error('No embedded preview was found in this RAW file.');
}

/** Decode any supported input file → { canvas, note? } */
export async function decodeFile(file) {
  const ext = getExt(file.name);
  const type = (file.type || '').toLowerCase();

  if (RAW_EXT.includes(ext)) return decodeRAW(file);
  if (ext === 'heic' || ext === 'heif' || type.includes('heic') || type.includes('heif')) return { canvas: await decodeHEIC(file) };
  if (ext === 'tif' || ext === 'tiff' || type === 'image/tiff') return { canvas: await decodeTIFF(file) };
  if (ext === 'jxl' || type === 'image/jxl') return { canvas: await decodeJXL(file) };
  if (ext === 'psd') return { canvas: await decodePSD(file) };
  if (ext === 'tga') return { canvas: decodeTGA(await file.arrayBuffer()) };
  if (ext === 'svg' && type !== 'image/svg+xml') {
    return { canvas: await decodeNative(new Blob([file], { type: 'image/svg+xml' })) };
  }
  // JPG, PNG, WebP, GIF (first frame), BMP, ICO, SVG, AVIF
  return { canvas: await decodeNative(file) };
}

// ═════════════════════════════════════════════════════════════
// ENCODERS  (canvas → real file of the chosen format)
// ═════════════════════════════════════════════════════════════

function encodeBMP(c) {
  // 32-bit BMP with BITMAPV4HEADER so transparency is kept
  const { data, width: w, height: h } = getImageData(c);
  const headerSize = 14 + 108;
  const size = headerSize + w * h * 4;
  const buf = new ArrayBuffer(size);
  const v = new DataView(buf);
  v.setUint8(0, 0x42); v.setUint8(1, 0x4d);          // 'BM'
  v.setUint32(2, size, true);
  v.setUint32(10, headerSize, true);
  v.setUint32(14, 108, true);                        // V4 header size
  v.setInt32(18, w, true);
  v.setInt32(22, h, true);                           // positive = bottom-up
  v.setUint16(26, 1, true);
  v.setUint16(28, 32, true);
  v.setUint32(30, 3, true);                          // BI_BITFIELDS
  v.setUint32(34, w * h * 4, true);
  v.setInt32(38, 2835, true); v.setInt32(42, 2835, true); // 72 DPI
  v.setUint32(54, 0x00ff0000, true);                 // R mask
  v.setUint32(58, 0x0000ff00, true);                 // G mask
  v.setUint32(62, 0x000000ff, true);                 // B mask
  v.setUint32(66, 0xff000000, true);                 // A mask
  v.setUint32(70, 0x73524742, true);                 // 'sRGB'
  const out = new Uint8Array(buf);
  let o = headerSize;
  for (let y = h - 1; y >= 0; y--) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      out[o++] = data[i + 2]; out[o++] = data[i + 1]; out[o++] = data[i]; out[o++] = data[i + 3];
    }
  }
  return new Blob([buf], { type: 'image/bmp' });
}

function encodeTGA(c) {
  const { data, width: w, height: h } = getImageData(c);
  if (w > 65535 || h > 65535) throw new Error('Image is too large for TGA.');
  // Opaque image → 24-bit (most compatible, 25% smaller). Transparent → 32-bit with alpha.
  let hasAlpha = false;
  for (let i = 3; i < data.length; i += 4) { if (data[i] !== 255) { hasAlpha = true; break; } }
  const bytes = hasAlpha ? 4 : 3;
  const footer = 'TRUEVISION-XFILE.\0';                 // TGA 2.0 footer (26 bytes with the two zero offsets)
  const out = new Uint8Array(18 + w * h * bytes + 8 + footer.length);
  out[2] = 2;                                        // uncompressed true-color
  out[12] = w & 0xff; out[13] = w >> 8;
  out[14] = h & 0xff; out[15] = h >> 8;
  out[16] = bytes * 8;
  out[17] = hasAlpha ? 0x28 : 0x20;                  // (8 alpha bits) + top-left origin
  let o = 18;
  for (let i = 0; i < data.length; i += 4) {
    out[o++] = data[i + 2]; out[o++] = data[i + 1]; out[o++] = data[i];
    if (hasAlpha) out[o++] = data[i + 3];
  }
  o += 8;                                            // extension + developer-area offsets = 0
  for (let k = 0; k < footer.length; k++) out[o++] = footer.charCodeAt(k);
  return new Blob([out], { type: 'image/x-tga' });
}

function encodePCX(c) {
  // 24-bit PCX (3 planes, RLE). PCX has no alpha → flattened on white.
  const { data, width: w, height: h } = getImageData(flatten(c));
  if (w > 65535 || h > 65535) throw new Error('Image is too large for PCX.');
  const bpl = w + (w & 1);                           // bytes per line must be even
  const header = new Uint8Array(128);
  const v = new DataView(header.buffer);
  header[0] = 10; header[1] = 5; header[2] = 1; header[3] = 8;
  v.setUint16(8, w - 1, true);
  v.setUint16(10, h - 1, true);
  v.setUint16(12, 72, true); v.setUint16(14, 72, true);
  header[65] = 3;                                    // planes
  v.setUint16(66, bpl, true);
  v.setUint16(68, 1, true);
  const chunks = [header];
  const line = new Uint8Array(bpl);
  const enc = new Uint8Array(bpl * 2 * 3 + 16);
  for (let y = 0; y < h; y++) {
    let o = 0;
    for (let plane = 0; plane < 3; plane++) {
      for (let x = 0; x < bpl; x++) line[x] = x < w ? data[(y * w + x) * 4 + plane] : 0;
      let x = 0;
      while (x < bpl) {
        const val = line[x];
        let run = 1;
        while (x + run < bpl && line[x + run] === val && run < 63) run++;
        if (run > 1 || val >= 0xc0) { enc[o++] = 0xc0 | run; enc[o++] = val; }
        else enc[o++] = val;
        x += run;
      }
    }
    chunks.push(enc.slice(0, o));
  }
  return new Blob(chunks, { type: 'image/x-pcx' });
}

async function encodeICO(c) {
  // Multi-size favicon.ico (PNG-compressed entries, square, aspect kept)
  const max = Math.max(c.width, c.height);
  const sizes = [16, 24, 32, 48, 64, 128, 256].filter((s) => s <= Math.max(max, 16));
  const images = [];
  for (const s of sizes) {
    const o = newCanvas(s, s);
    const g = o.getContext('2d');
    g.imageSmoothingQuality = 'high';
    const k = Math.min(s / c.width, s / c.height);
    const w = Math.max(1, Math.round(c.width * k));
    const h = Math.max(1, Math.round(c.height * k));
    g.drawImage(c, Math.floor((s - w) / 2), Math.floor((s - h) / 2), w, h);
    images.push({ s, bytes: new Uint8Array(await (await toBlob(o, 'image/png')).arrayBuffer()) });
  }
  const headerLen = 6 + 16 * images.length;
  const total = headerLen + images.reduce((n, im) => n + im.bytes.length, 0);
  const out = new Uint8Array(total);
  const v = new DataView(out.buffer);
  v.setUint16(2, 1, true);                           // type: icon
  v.setUint16(4, images.length, true);
  let offset = headerLen;
  images.forEach((im, i) => {
    const e = 6 + i * 16;
    out[e] = im.s >= 256 ? 0 : im.s;
    out[e + 1] = im.s >= 256 ? 0 : im.s;
    v.setUint16(e + 4, 1, true);
    v.setUint16(e + 6, 32, true);
    v.setUint32(e + 8, im.bytes.length, true);
    v.setUint32(e + 12, offset, true);
    out.set(im.bytes, offset);
    offset += im.bytes.length;
  });
  return new Blob([out], { type: 'image/x-icon' });
}

async function encodeGIF(c) {
  const { GIFEncoder, quantize, applyPalette } = await import('gifenc');
  const { data, width, height } = getImageData(c);
  // Only use the 4-bit-per-channel "rgba4444" mode when the picture really has
  // transparent pixels. Opaque photos use "rgb565" (much better color, less banding).
  let transparent = false;
  for (let i = 3; i < data.length; i += 4) { if (data[i] < 128) { transparent = true; break; } }
  const gif = GIFEncoder();
  if (transparent) {
    const palette = quantize(data, 256, { format: 'rgba4444', oneBitAlpha: true });
    const index = applyPalette(data, palette, 'rgba4444');
    const ti = palette.findIndex((p) => p[3] === 0);
    gif.writeFrame(index, width, height, { palette, transparent: ti >= 0, transparentIndex: Math.max(ti, 0) });
  } else {
    const palette = quantize(data, 256, { format: 'rgb565', clearAlpha: false });
    const index = applyPalette(data, palette, 'rgb565');
    gif.writeFrame(index, width, height, { palette });
  }
  gif.finish();
  return new Blob([gif.bytes()], { type: 'image/gif' });
}

async function encodeTIFF(c) {
  const mod = await import('utif');
  const UTIF = mod.default || mod;
  const { data, width, height } = getImageData(c);
  // t338 (ExtraSamples) = 2 → alpha is NOT premultiplied (canvas data is straight alpha)
  const buf = UTIF.encodeImage(new Uint8Array(data.buffer), width, height, { t338: [2] });
  return new Blob([buf], { type: 'image/tiff' });
}

async function encodeSVG(c) {
  // Raster image wrapped in an SVG container (not traced vector art)
  const png = await toBlob(c, 'image/png');
  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(png);
  });
  const { width: w, height: h } = c;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><image width="${w}" height="${h}" href="${dataUrl}" xlink:href="${dataUrl}"/></svg>`;
  return new Blob([svg], { type: 'image/svg+xml' });
}

// AVIF / JPEG XL: load the SINGLE-THREAD WASM builds directly.
// (The default @jsquash entry points also bundle multi-thread workers,
//  which hang Turbopack builds and need COOP/COEP headers anyway.)
const wasmEncoders = {};
function loadWasmEncoder(name) {
  if (!wasmEncoders[name]) {
    wasmEncoders[name] = (async () => {
      const factory = name === 'avif'
        ? (await import('@jsquash/avif/codec/enc/avif_enc.js')).default
        : (await import('@jsquash/jxl/codec/enc/jxl_enc.js')).default;
      return factory({ noInitialRun: true });
    })().catch((err) => {
      delete wasmEncoders[name]; // allow a retry if the network hiccuped
      throw err;
    });
  }
  return wasmEncoders[name];
}

/** Encode a canvas into a real file of `fmt`. quality: 0.5–1 */
export async function encodeCanvas(c, fmt, quality = 0.9) {
  const q100 = Math.round(quality * 100);
  switch (fmt) {
    case 'png':
      return toBlob(c, 'image/png');
    case 'jpg':
      return toBlob(flatten(c), 'image/jpeg', quality);
    case 'webp': {
      const b = await toBlob(c, 'image/webp', quality);
      if (b && b.type === 'image/webp') return b;
      // Older Safari can't encode WebP via canvas → WASM encoder
      const { default: encode } = await import('@jsquash/webp/encode');
      return new Blob([await encode(getImageData(c), { quality: q100 })], { type: 'image/webp' });
    }
    case 'avif': {
      const [mod, { defaultOptions }] = await Promise.all([loadWasmEncoder('avif'), import('@jsquash/avif/meta.js')]);
      const { data, width, height } = getImageData(c);
      const out = mod.encode(new Uint8Array(data.buffer), width, height, { ...defaultOptions, quality: q100, speed: 8 });
      if (!out) throw new Error('AVIF encoding failed.');
      return new Blob([out], { type: 'image/avif' });
    }
    case 'jxl': {
      const [mod, { defaultOptions }] = await Promise.all([loadWasmEncoder('jxl'), import('@jsquash/jxl/meta.js')]);
      const { data, width, height } = getImageData(c);
      const out = mod.encode(data, width, height, { ...defaultOptions, quality: q100, effort: 5 });
      if (!out) throw new Error('JPEG XL encoding failed.');
      return new Blob([out], { type: 'image/jxl' });
    }
    case 'gif':  return encodeGIF(c);
    case 'tiff': return encodeTIFF(c);
    case 'bmp':  return encodeBMP(c);
    case 'ico':  return encodeICO(c);
    case 'tga':  return encodeTGA(c);
    case 'pcx':  return encodePCX(c);
    case 'svg':  return encodeSVG(c);
    default:
      throw new Error(`Unsupported output format: ${fmt}`);
  }
}