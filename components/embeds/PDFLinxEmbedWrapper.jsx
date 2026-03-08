// "use client";
// // components/embeds/PDFLinxEmbedWrapper.jsx
// import { useState } from "react";

// // compact=true  → Sidebar ke liye (300-350px width, chhoti height)
// // compact=false → Normal page embed (680px width)

// export default function PDFLinxEmbedWrapper({ compact = false }) {
//   const [loaded, setLoaded] = useState(false);

//   const embedSrc = compact
//     ? "https://pdflinx.com/embed/compress-pdf?compact=true"
//     : "https://pdflinx.com/embed/compress-pdf";

//   const maxWidth = compact ? "340px" : "680px";
//   const iframeHeight = compact ? 320 : 420;

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
//         .pdflinx-widget { font-family: 'DM Sans', system-ui, sans-serif; }
//         .pdflinx-card { border-radius: ${compact ? "14px" : "20px"}; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid #e8edf5; background: #fff; }
//         .pdflinx-topbar { display: flex; align-items: center; justify-content: space-between; padding: ${compact ? "8px 12px" : "10px 16px"}; background: #0f172a; }
//         .pdflinx-dots { display: flex; gap: 5px; align-items: center; }
//         .pdflinx-dot { width: ${compact ? "7px" : "9px"}; height: ${compact ? "7px" : "9px"}; border-radius: 50%; }
//         .pdflinx-url { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; padding: 3px 8px; flex: 1; margin: 0 10px; }
//         .pdflinx-url span { color: rgba(255,255,255,0.4); font-size: ${compact ? "10px" : "11px"}; }
//         .pdflinx-open-btn { display: flex; align-items: center; gap: 4px; background: #14b8a6; color: #fff; text-decoration: none; font-size: ${compact ? "10px" : "11px"}; font-weight: 600; padding: ${compact ? "4px 8px" : "5px 11px"}; border-radius: 5px; white-space: nowrap; transition: background 0.2s; }
//         .pdflinx-open-btn:hover { background: #0d9488; }
//         .pdflinx-iframe-wrap { position: relative; background: #f8fafc; }
//         .pdflinx-loader { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: #f8fafc; min-height: ${compact ? "260px" : "340px"}; z-index: 2; }
//         .pdflinx-spinner { width: 28px; height: 28px; border: 2.5px solid #e2e8f0; border-top-color: #14b8a6; border-radius: 50%; animation: pdflinx-spin 0.7s linear infinite; }
//         @keyframes pdflinx-spin { to { transform: rotate(360deg); } }
//         .pdflinx-loader span { color: #94a3b8; font-size: 11px; }
//         .pdflinx-bottombar { display: flex; align-items: center; justify-content: space-between; padding: ${compact ? "6px 12px" : "8px 16px"}; background: #0f172a; border-top: 1px solid rgba(255,255,255,0.06); }
//         .pdflinx-privacy { display: flex; align-items: center; gap: 5px; color: rgba(255,255,255,0.3); font-size: 10px; }
//         .pdflinx-privacy-dot { width: 5px; height: 5px; border-radius: 50%; background: #14b8a6; opacity: 0.7; }
//         .pdflinx-brand { display: flex; align-items: center; gap: 4px; text-decoration: none; transition: opacity 0.2s; }
//         .pdflinx-brand:hover { opacity: 0.8; }
//         .pdflinx-brand-text { color: rgba(255,255,255,0.35); font-size: 10px; }
//         .pdflinx-brand-name { color: #14b8a6; font-size: 10px; font-weight: 600; }
//       `}</style>

//       <div className="pdflinx-widget" style={{ maxWidth, margin: "0 auto" }}>
//         <div className="pdflinx-card">

//           {/* Top Bar */}
//           <div className="pdflinx-topbar">
//             <div className="pdflinx-dots">
//               {["#ff5f57", "#ffbd2e", "#28ca41"].map((c, i) => (
//                 <div key={i} className="pdflinx-dot" style={{ background: c }} />
//               ))}
//             </div>
//             <div className="pdflinx-url">
//               <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5">
//                 <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
//               </svg>
//               <span>pdflinx.com/compress-pdf</span>
//             </div>
//             <a href="https://pdflinx.com/compress-pdf" target="_blank" rel="noopener noreferrer" className="pdflinx-open-btn">
//               <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                 <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
//                 <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
//               </svg>
//               {compact ? "Full" : "Open Full"}
//             </a>
//           </div>

//           {/* iFrame */}
//           <div className="pdflinx-iframe-wrap">
//             {!loaded && (
//               <div className="pdflinx-loader">
//                 <div className="pdflinx-spinner" />
//                 <span>Loading PDF Compressor...</span>
//               </div>
//             )}
//             <iframe
//               src={embedSrc}
//               width="100%"
//               height={iframeHeight}
//               style={{ border: "none", display: "block", opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
//               loading="lazy"
//               onLoad={() => setLoaded(true)}
//               title="PDF Compressor by PDFLinx"
//             />
//           </div>

//           {/* Bottom Bar */}
//           <div className="pdflinx-bottombar">
//             <div className="pdflinx-privacy">
//               <div className="pdflinx-privacy-dot" />
//               {compact ? "100% browser-based" : "Files never stored · 100% browser-based"}
//             </div>
//             <a href="https://pdflinx.com" target="_blank" rel="noopener noreferrer" className="pdflinx-brand">
//               <span className="pdflinx-brand-text">by</span>
//               <span className="pdflinx-brand-name">PDFLinx ↗</span>
//             </a>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }




















// // "use client";
// // import { useState } from "react";

// // export default function PDFLinxEmbedWrapper() {
// //   const [loaded, setLoaded] = useState(false);

// //   return (
// //     <>
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        
// //         .pdflinx-widget {
// //           font-family: 'DM Sans', system-ui, sans-serif;
// //           max-width: 680px;
// //           margin: 0 auto;
// //         }

// //         .pdflinx-card {
// //           border-radius: 20px;
// //           overflow: hidden;
// //           box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
// //           border: 1px solid #e8edf5;
// //           background: #fff;
// //         }

// //         .pdflinx-topbar {
// //           display: flex;
// //           align-items: center;
// //           justify-content: space-between;
// //           padding: 10px 16px;
// //           background: #0f172a;
// //           border-bottom: 1px solid rgba(255,255,255,0.06);
// //         }

// //         .pdflinx-dots {
// //           display: flex;
// //           gap: 5px;
// //           align-items: center;
// //         }

// //         .pdflinx-dot {
// //           width: 9px;
// //           height: 9px;
// //           border-radius: 50%;
// //         }

// //         .pdflinx-url {
// //           display: flex;
// //           align-items: center;
// //           gap: 6px;
// //           background: rgba(255,255,255,0.07);
// //           border: 1px solid rgba(255,255,255,0.1);
// //           border-radius: 6px;
// //           padding: 4px 10px;
// //           flex: 1;
// //           margin: 0 12px;
// //         }

// //         .pdflinx-url span {
// //           color: rgba(255,255,255,0.4);
// //           font-size: 11px;
// //           letter-spacing: 0.2px;
// //         }

// //         .pdflinx-open-btn {
// //           display: flex;
// //           align-items: center;
// //           gap: 5px;
// //           background: #14b8a6;
// //           color: #fff;
// //           text-decoration: none;
// //           font-size: 11px;
// //           font-weight: 600;
// //           padding: 5px 11px;
// //           border-radius: 6px;
// //           white-space: nowrap;
// //           transition: background 0.2s;
// //           letter-spacing: 0.2px;
// //         }

// //         .pdflinx-open-btn:hover { background: #0d9488; }

// //         .pdflinx-iframe-wrap {
// //           position: relative;
// //           background: #f8fafc;
// //         }

// //         .pdflinx-loader {
// //           position: absolute;
// //           inset: 0;
// //           display: flex;
// //           flex-direction: column;
// //           align-items: center;
// //           justify-content: center;
// //           gap: 12px;
// //           background: #f8fafc;
// //           min-height: 340px;
// //           z-index: 2;
// //         }

// //         .pdflinx-spinner {
// //           width: 32px;
// //           height: 32px;
// //           border: 2.5px solid #e2e8f0;
// //           border-top-color: #14b8a6;
// //           border-radius: 50%;
// //           animation: pdflinx-spin 0.7s linear infinite;
// //         }

// //         @keyframes pdflinx-spin { to { transform: rotate(360deg); } }

// //         .pdflinx-loader span {
// //           color: #94a3b8;
// //           font-size: 12px;
// //         }

// //         .pdflinx-bottombar {
// //           display: flex;
// //           align-items: center;
// //           justify-content: space-between;
// //           padding: 8px 16px;
// //           background: #0f172a;
// //           border-top: 1px solid rgba(255,255,255,0.06);
// //         }

// //         .pdflinx-privacy {
// //           display: flex;
// //           align-items: center;
// //           gap: 5px;
// //           color: rgba(255,255,255,0.3);
// //           font-size: 10px;
// //         }

// //         .pdflinx-privacy-dot {
// //           width: 5px;
// //           height: 5px;
// //           border-radius: 50%;
// //           background: #14b8a6;
// //           opacity: 0.7;
// //         }

// //         .pdflinx-brand {
// //           display: flex;
// //           align-items: center;
// //           gap: 5px;
// //           text-decoration: none;
// //           transition: opacity 0.2s;
// //         }

// //         .pdflinx-brand:hover { opacity: 0.8; }
// //         .pdflinx-brand-text { color: rgba(255,255,255,0.35); font-size: 10px; }
// //         .pdflinx-brand-name { color: #14b8a6; font-size: 10px; font-weight: 600; }
// //       `}</style>

// //       <div className="pdflinx-widget">
// //         <div className="pdflinx-card">

// //           {/* Top Bar */}
// //           <div className="pdflinx-topbar">
// //             <div className="pdflinx-dots">
// //               {["#ff5f57", "#ffbd2e", "#28ca41"].map((c, i) => (
// //                 <div key={i} className="pdflinx-dot" style={{ background: c }} />
// //               ))}
// //             </div>

// //             <div className="pdflinx-url">
// //               <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5">
// //                 <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
// //                 <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
// //               </svg>
// //               <span>pdflinx.com/compress-pdf</span>
// //             </div>

// //             <a
// //               href="https://pdflinx.com/compress-pdf"
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="pdflinx-open-btn"
// //             >
// //               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
// //                 <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
// //                 <polyline points="15 3 21 3 21 9"/>
// //                 <line x1="10" y1="14" x2="21" y2="3"/>
// //               </svg>
// //               Open Full
// //             </a>
// //           </div>

// //           {/* iFrame */}
// //           <div className="pdflinx-iframe-wrap">
// //             {!loaded && (
// //               <div className="pdflinx-loader">
// //                 <div className="pdflinx-spinner" />
// //                 <span>Loading PDF Compressor...</span>
// //               </div>
// //             )}
// //             <iframe
// //             //   src="https://pdflinx.com/embed/compress-pdf"
// //             src="http://localhost:3000/embed/compress-pdf"

// //               width="100%"
// //               height="420"
// //               style={{
// //                 border: "none",
// //                 display: "block",
// //                 opacity: loaded ? 1 : 0,
// //                 transition: "opacity 0.3s ease",
// //               }}
// //               loading="lazy"
// //               onLoad={() => setLoaded(true)}
// //               title="PDF Compressor by PDFLinx"
// //             />
// //           </div>

// //           {/* Bottom Bar */}
// //           <div className="pdflinx-bottombar">
// //             <div className="pdflinx-privacy">
// //               <div className="pdflinx-privacy-dot" />
// //               Files never stored · 100% browser-based
// //             </div>
// //             <a
// //               href="https://pdflinx.com"
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="pdflinx-brand"
// //             >
// //               <span className="pdflinx-brand-text">Powered by</span>
// //               <span className="pdflinx-brand-name">PDFLinx ↗</span>
// //             </a>
// //           </div>

// //         </div>
// //       </div>
// //     </>
// //   );
// // }


















// // // "use client";
// // // import { useState } from "react";

// // // export default function PDFLinxEmbedWrapper() {
// // //   const [loaded, setLoaded] = useState(false);

// // //   return (
// // //     <div style={{
// // //       fontFamily: "'Segoe UI', system-ui, sans-serif",
// // //       maxWidth: "860px",
// // //       margin: "0 auto",
// // //       padding: "0 16px"
// // //     }}>
// // //       {/* Header Bar */}
// // //       <div style={{
// // //         display: "flex",
// // //         alignItems: "center",
// // //         justifyContent: "space-between",
// // //         background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
// // //         borderRadius: "16px 16px 0 0",
// // //         padding: "14px 20px",
// // //         borderBottom: "1px solid rgba(255,255,255,0.08)"
// // //       }}>
// // //         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
// // //           {/* Dot indicators */}
// // //           <div style={{ display: "flex", gap: "6px" }}>
// // //             {["#ff5f57","#ffbd2e","#28ca41"].map((c, i) => (
// // //               <div key={i} style={{
// // //                 width: 11, height: 11, borderRadius: "50%", background: c
// // //               }} />
// // //             ))}
// // //           </div>
// // //           <span style={{
// // //             color: "rgba(255,255,255,0.5)",
// // //             fontSize: "12px",
// // //             marginLeft: "8px",
// // //             letterSpacing: "0.3px"
// // //           }}>
// // //             pdflinx.com · compress-pdf
// // //           </span>
// // //         </div>

// // //         <a
// // //           href="https://pdflinx.com/compress-pdf"
// // //           target="_blank"
// // //           rel="noopener noreferrer"
// // //           style={{
// // //             display: "flex",
// // //             alignItems: "center",
// // //             gap: "6px",
// // //             background: "rgba(255,255,255,0.08)",
// // //             color: "rgba(255,255,255,0.7)",
// // //             textDecoration: "none",
// // //             fontSize: "12px",
// // //             padding: "5px 12px",
// // //             borderRadius: "20px",
// // //             border: "1px solid rgba(255,255,255,0.12)",
// // //             transition: "all 0.2s",
// // //             cursor: "pointer"
// // //           }}
// // //           onMouseEnter={e => {
// // //             e.currentTarget.style.background = "rgba(255,255,255,0.15)";
// // //             e.currentTarget.style.color = "#fff";
// // //           }}
// // //           onMouseLeave={e => {
// // //             e.currentTarget.style.background = "rgba(255,255,255,0.08)";
// // //             e.currentTarget.style.color = "rgba(255,255,255,0.7)";
// // //           }}
// // //         >
// // //           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// // //             <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
// // //             <polyline points="15 3 21 3 21 9"/>
// // //             <line x1="10" y1="14" x2="21" y2="3"/>
// // //           </svg>
// // //           Open Full Tool
// // //         </a>
// // //       </div>

// // //       {/* iFrame Container */}
// // //       <div style={{ position: "relative", background: "#f8f9ff" }}>
// // //         {/* Loading State */}
// // //         {!loaded && (
// // //           <div style={{
// // //             position: "absolute",
// // //             inset: 0,
// // //             display: "flex",
// // //             flexDirection: "column",
// // //             alignItems: "center",
// // //             justifyContent: "center",
// // //             background: "#f8f9ff",
// // //             minHeight: "420px",
// // //             gap: "16px",
// // //             zIndex: 2
// // //           }}>
// // //             {/* Spinner */}
// // //             <div style={{
// // //               width: 40, height: 40,
// // //               border: "3px solid #e0e7ff",
// // //               borderTop: "3px solid #6366f1",
// // //               borderRadius: "50%",
// // //               animation: "spin 0.8s linear infinite"
// // //             }} />
// // //             <span style={{ color: "#94a3b8", fontSize: "14px" }}>Loading PDF Compressor...</span>
// // //             <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
// // //           </div>
// // //         )}

// // //         <iframe
// // //         //   src="https://pdflinx.com/embed/compress-pdf"
// // //         src="http://localhost:3000/embed/compress-pdf"

// // //           width="100%"
// // //           height="600"
// // //           style={{
// // //             border: "none",
// // //             display: "block",
// // //             opacity: loaded ? 1 : 0,
// // //             transition: "opacity 0.4s ease"
// // //           }}
// // //           loading="lazy"
// // //           onLoad={() => setLoaded(true)}
// // //           title="PDF Compressor by PDFLinx"
// // //         />
// // //       </div>

// // //       {/* Footer Bar */}
// // //       <div style={{
// // //         display: "flex",
// // //         alignItems: "center",
// // //         justifyContent: "space-between",
// // //         background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
// // //         borderRadius: "0 0 16px 16px",
// // //         padding: "10px 20px",
// // //         borderTop: "1px solid rgba(255,255,255,0.08)"
// // //       }}>
// // //         <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>
// // //           🔒 Files processed in browser · Never uploaded
// // //         </span>
// // //         <a
// // //           href="https://pdflinx.com"
// // //           target="_blank"
// // //           rel="noopener noreferrer"
// // //           style={{
// // //             color: "rgba(255,255,255,0.45)",
// // //             fontSize: "11px",
// // //             textDecoration: "none",
// // //             display: "flex",
// // //             alignItems: "center",
// // //             gap: "4px",
// // //             transition: "color 0.2s"
// // //           }}
// // //           onMouseEnter={e => e.currentTarget.style.color = "#fff"}
// // //           onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
// // //         >
// // //           Powered by <strong style={{ color: "rgba(255,255,255,0.7)" }}>PDFLinx</strong> ↗
// // //         </a>
// // //       </div>
// // //     </div>
// // //   );
// // // }






