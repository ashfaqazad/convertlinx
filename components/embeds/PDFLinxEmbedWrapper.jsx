"use client";
// components/embeds/PDFLinxEmbedWrapper.jsx
//
// Usage:
//   <PDFLinxEmbedWrapper tool="compress-pdf" />
//   <PDFLinxEmbedWrapper tool="word-to-pdf" compact={true} />
//
// Available tools:
//   compress-pdf | merge-pdf | split-pdf
//   pdf-to-word  | word-to-pdf
//   image-to-pdf | pdf-to-jpg

import { useState } from "react";

const TOOL_LABELS = {
    "compress-pdf": "PDF Compressor",
    "merge-pdf": "PDF Merger",
    "split-pdf": "PDF Splitter",
    "pdf-to-word": "PDF to Word",
    "word-to-pdf": "Word to PDF",
    "image-to-pdf": "JPG to PDF",
    "pdf-to-jpg": "PDF to JPG",
};

export default function PDFLinxEmbedWrapper({ tool = "compress-pdf", compact = false }) {
    const [loaded, setLoaded] = useState(false);

    const toolLabel = TOOL_LABELS[tool] || tool;

    //   const embedSrc     = compact
    //     ? `https://pdflinx.com/embed/${tool}?compact=true`
    //     : `https://pdflinx.com/embed/${tool}`;
    //   const fullUrl      = `https://pdflinx.com/${tool}`;

    const BASE = process.env.NEXT_PUBLIC_PDFLINX_URL || "https://pdflinx.com";
    const embedSrc = compact
        ? `${BASE}/embed/${tool}?compact=true`
        : `${BASE}/embed/${tool}`;
    const fullUrl = `${BASE}/${tool}`;
    
    const maxWidth = compact ? "340px" : "680px";
    const iframeHeight = compact ? 320 : 420;
    const pad = compact ? "8px 12px" : "10px 16px";
    const dotSize = compact ? "7px" : "9px";
    const fontSize = compact ? "10px" : "11px";
    const btnPad = compact ? "4px 8px" : "5px 11px";
    const loaderMin = compact ? "260px" : "340px";
    const bPad = compact ? "6px 12px" : "8px 16px";
    const cardRadius = compact ? "14px" : "20px";

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .pdflinx-widget { font-family: 'DM Sans', system-ui, sans-serif; }
        .pdflinx-card { border-radius: ${cardRadius}; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid #e8edf5; background: #fff; }
        .pdflinx-topbar { display: flex; align-items: center; justify-content: space-between; padding: ${pad}; background: #0f172a; }
        .pdflinx-dots { display: flex; gap: 5px; align-items: center; }
        .pdflinx-dot { width: ${dotSize}; height: ${dotSize}; border-radius: 50%; }
        .pdflinx-url { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; padding: 3px 8px; flex: 1; margin: 0 10px; overflow: hidden; }
        .pdflinx-url span { color: rgba(255,255,255,0.4); font-size: ${fontSize}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pdflinx-open-btn { display: flex; align-items: center; gap: 4px; background: #14b8a6; color: #fff; text-decoration: none; font-size: ${fontSize}; font-weight: 600; padding: ${btnPad}; border-radius: 5px; white-space: nowrap; transition: background 0.2s; }
        .pdflinx-open-btn:hover { background: #0d9488; }
        .pdflinx-iframe-wrap { position: relative; background: #f8fafc; }
        .pdflinx-loader { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: #f8fafc; min-height: ${loaderMin}; z-index: 2; }
        .pdflinx-spinner { width: 28px; height: 28px; border: 2.5px solid #e2e8f0; border-top-color: #14b8a6; border-radius: 50%; animation: pdflinx-spin 0.7s linear infinite; }
        @keyframes pdflinx-spin { to { transform: rotate(360deg); } }
        .pdflinx-loader span { color: #94a3b8; font-size: 11px; }
        .pdflinx-bottombar { display: flex; align-items: center; justify-content: space-between; padding: ${bPad}; background: #0f172a; border-top: 1px solid rgba(255,255,255,0.06); }
        .pdflinx-privacy { display: flex; align-items: center; gap: 5px; color: rgba(255,255,255,0.3); font-size: 10px; }
        .pdflinx-privacy-dot { width: 5px; height: 5px; border-radius: 50%; background: #14b8a6; opacity: 0.7; }
        .pdflinx-brand { display: flex; align-items: center; gap: 4px; text-decoration: none; transition: opacity 0.2s; }
        .pdflinx-brand:hover { opacity: 0.8; }
        .pdflinx-brand-text { color: rgba(255,255,255,0.35); font-size: 10px; }
        .pdflinx-brand-name { color: #14b8a6; font-size: 10px; font-weight: 600; }
      `}</style>

            <div className="pdflinx-widget" style={{ maxWidth, margin: "0 auto" }}>
                <div className="pdflinx-card">

                    {/* Top Bar */}
                    <div className="pdflinx-topbar">
                        <div className="pdflinx-dots">
                            {["#ff5f57", "#ffbd2e", "#28ca41"].map((c, i) => (
                                <div key={i} className="pdflinx-dot" style={{ background: c }} />
                            ))}
                        </div>
                        <div className="pdflinx-url">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5">
                                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <span>pdflinx.com/embed/{tool}</span>
                        </div>
                        <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="pdflinx-open-btn">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            {compact ? "Full" : "Open Full"}
                        </a>
                    </div>

                    {/* iFrame */}
                    <div className="pdflinx-iframe-wrap">
                        {!loaded && (
                            <div className="pdflinx-loader">
                                <div className="pdflinx-spinner" />
                                <span>Loading {toolLabel}...</span>
                            </div>
                        )}
                        <iframe
                            src={embedSrc}
                            width="100%"
                            height={iframeHeight}
                            style={{ border: "none", display: "block", opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
                            loading="lazy"
                            onLoad={() => setLoaded(true)}
                            title={`${toolLabel} by PDFLinx`}
                        />
                    </div>

                    {/* Bottom Bar */}
                    <div className="pdflinx-bottombar">
                        <div className="pdflinx-privacy">
                            <div className="pdflinx-privacy-dot" />
                            {compact ? "100% browser-based" : "Files never stored · 100% browser-based"}
                        </div>
                        <a href="https://pdflinx.com" target="_blank" rel="noopener noreferrer" className="pdflinx-brand">
                            <span className="pdflinx-brand-text">by</span>
                            <span className="pdflinx-brand-name">PDFLinx ↗</span>
                        </a>
                    </div>

                </div>
            </div>
        </>
    );
}
