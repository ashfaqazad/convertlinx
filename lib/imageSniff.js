// Checks what a file really is (not just its extension) and whether this
// browser can decode a format. Nothing leaves the device.

export const FORMAT_NAMES = { jpg: "JPG", png: "PNG", webp: "WebP", avif: "AVIF", gif: "GIF" };

export async function sniffImage(file) {
  const b = new Uint8Array(await file.slice(0, 64).arrayBuffer());
  const text = (from, to) => String.fromCharCode(...b.subarray(from, to));

  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b[0] === 0x89 && text(1, 4) === "PNG") return "png";
  if (text(0, 4) === "GIF8") return "gif";
  if (text(0, 4) === "RIFF" && text(8, 12) === "WEBP") return "webp";
  if (text(4, 8) === "ftyp") {
    // Major brand, then the list of compatible brands, all inside the first box
    const boxEnd = Math.min(b.length, ((b[0] << 24) | (b[1] << 16) | (b[2] << 8) | b[3]) >>> 0);
    for (let i = 8; i + 4 <= boxEnd; i += 4) {
      if (i !== 12 && (text(i, i + 4) === "avif" || text(i, i + 4) === "avis")) return "avif";
    }
  }
  return null;
}

// 1x1 sample images, used only to ask the browser "can you open this?"
const PROBES = {
  webp: "UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=",
  avif: "AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABsAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACNtZGF0EgAKCBgABggQEDQgMg0TQAIIIIQAAGjTBViA",
};

export async function canDecode(format) {
  const probe = PROBES[format];
  if (!probe) return true;
  const bytes = Uint8Array.from(atob(probe), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: `image/${format}` });
  const url = URL.createObjectURL(blob);
  try {
    return await new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(img.naturalWidth > 0);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
