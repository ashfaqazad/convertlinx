// Loads ffmpeg.wasm's JS wrapper from /public/ffmpeg (same origin) via <script> tags.
// Bundling "@ffmpeg/ffmpeg" directly breaks Next.js/Turbopack builds (it spawns a
// worker from a dynamic URL), so the pre-built UMD files are served as static assets.
// ffmpeg-core.js/.wasm (v0.12.6, single-thread) are served from here too, not a CDN.
// To upgrade: re-copy node_modules/@ffmpeg/ffmpeg/dist/umd/{ffmpeg.js,814.ffmpeg.js}
// and node_modules/@ffmpeg/util/dist/umd/index.js (as util.js) into public/ffmpeg/.

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

let promise = null;

export function loadFfmpegLibs() {
  if (!promise) {
    promise = (async () => {
      if (!window.FFmpegWASM) await loadScript("/ffmpeg/ffmpeg.js");
      if (!window.FFmpegUtil) await loadScript("/ffmpeg/util.js");
      return { FFmpeg: window.FFmpegWASM.FFmpeg, toBlobURL: window.FFmpegUtil.toBlobURL };
    })().catch((e) => {
      promise = null;
      throw e;
    });
  }
  return promise;
}
