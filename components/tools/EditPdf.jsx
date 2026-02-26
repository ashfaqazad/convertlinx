"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import {
  Upload,
  Type,
  Square,
  Trash2,
  ZoomIn,
  ZoomOut,
  CheckCircle,
  Download,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import RelatedToolsSection from "@/components/RelatedTools";

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const FONT_OPTIONS = [
  "Calibri",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Courier New",
  "Inter",
  "Roboto",
  "Poppins",
];

const DARK_PRESETS = ["#111827", "#0f172a", "#1f2937", "#374151", "#000000"];

export default function EditPdf() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);

  // NOTE: multi-page preview mode => currentPage still used to decide new objects page
  const [currentPage, setCurrentPage] = useState(1);

  const [objects, setObjects] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const containerRef = useRef(null);
  const canvasRefs = useRef([]); // one canvas per page
  const pageWrapRefs = useRef([]); // wrappers for offset calc

  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  const activeObj = objects.find((o) => o.id === activeId);

  // map objects by page for fast render
  const objectsByPage = useMemo(() => {
    const m = new Map();
    for (const o of objects) {
      if (!m.has(o.page)) m.set(o.page, []);
      m.get(o.page).push(o);
    }
    return m;
  }, [objects]);

  // ---------------- PDF LOAD ----------------
  useEffect(() => {
    if (!pdfFile) return;

    const load = async () => {
      try {
        setError("");
        setSuccess(false);

        const pdfjsLib = window.pdfjsLib;
        if (!pdfjsLib) return;

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        const buffer = await pdfFile.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: buffer }).promise;

        setPdfDoc(doc);
        setNumPages(doc.numPages);

        // reset page selection for adding
        setCurrentPage(1);
        setScale(1);

        // reset refs arrays
        canvasRefs.current = new Array(doc.numPages);
        pageWrapRefs.current = new Array(doc.numPages);
      } catch (err) {
        console.error(err);
        setError("Failed to load PDF");
      }
    };

    load();
  }, [pdfFile]);

  // ---------------- RENDER ALL PAGES ----------------
  useEffect(() => {
    if (!pdfDoc || !numPages) return;

    let cancelled = false;

    const renderAll = async () => {
      try {
        for (let p = 1; p <= numPages; p++) {
          if (cancelled) return;

          const page = await pdfDoc.getPage(p);
          const viewport = page.getViewport({ scale });

          const canvas = canvasRefs.current[p - 1];
          if (!canvas) continue;

          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: ctx, viewport }).promise;
        }
      } catch (e) {
        console.error(e);
      }
    };

    renderAll();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, numPages, scale]);

  // ---------------- UPLOAD ----------------
  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a valid PDF file");
      return;
    }

    setPdfFile(file);
    setObjects([]);
    setActiveId(null);
    setError("");
    setSuccess(false);
  };

  // ---------------- OBJECT HELPERS ----------------
  const updateObj = (id, updates) => {
    setObjects((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
  };

  const deleteActive = () => {
    if (!activeId) return;
    setObjects((prev) => prev.filter((o) => o.id !== activeId));
    setActiveId(null);
  };

  // ---------------- ADD TEXT ----------------
  const addText = () => {
    const id = Date.now();
    setObjects((prev) => [
      ...prev,
      {
        id,
        type: "text",
        page: currentPage,
        text: "Double click to edit",
        x: 100,
        y: 120,
        fontSize: 16,
        color: "#111827",
        fontFamily: "Calibri",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
      },
    ]);
    setActiveId(id);
  };

  // ---------------- ADD COVER ----------------
  const addCover = () => {
    const id = Date.now();
    setObjects((prev) => [
      ...prev,
      {
        id,
        type: "cover",
        page: currentPage,
        x: 100,
        y: 120,
        width: 220,
        height: 32,
        fill: "#ffffff",
      },
    ]);
    setActiveId(id);
  };

  // ---------------- TEXT STYLE TOGGLES ----------------
  const toggleBold = () => {
    if (!activeObj || activeObj.type !== "text") return;
    updateObj(activeObj.id, {
      fontWeight: activeObj.fontWeight === "bold" ? "normal" : "bold",
    });
  };

  const toggleItalic = () => {
    if (!activeObj || activeObj.type !== "text") return;
    updateObj(activeObj.id, {
      fontStyle: activeObj.fontStyle === "italic" ? "normal" : "italic",
    });
  };

  const toggleUnderline = () => {
    if (!activeObj || activeObj.type !== "text") return;
    updateObj(activeObj.id, {
      textDecoration:
        activeObj.textDecoration === "underline" ? "none" : "underline",
    });
  };

  // ---------------- PAGE PICK FROM CLICK ----------------
  // allows user to set "currentPage" by clicking on a page area
  const setCurrentPageFromClick = (e, pageIndex) => {
    e.stopPropagation();
    setCurrentPage(pageIndex + 1);
  };

  // ---------------- DRAG / RESIZE ----------------
  const startDrag = (e, obj) => {
    e.stopPropagation();

    const pageIndex = (obj.page || 1) - 1;
    const wrap = pageWrapRefs.current[pageIndex];
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();

    dragRef.current = {
      id: obj.id,
      page: obj.page,
      startX: e.clientX,
      startY: e.clientY,
      origX: obj.x,
      origY: obj.y,
      pageLeft: rect.left,
      pageTop: rect.top,
    };

    setActiveId(obj.id);
    setCurrentPage(obj.page);
  };

  const startResize = (e, obj) => {
    e.stopPropagation();

    resizeRef.current = {
      id: obj.id,
      page: obj.page,
      startX: e.clientX,
      startY: e.clientY,
      origW: obj.width,
      origH: obj.height,
    };

    setActiveId(obj.id);
    setCurrentPage(obj.page);
  };

  const onMove = (e) => {
    if (dragRef.current) {
      const { id, startX, startY, origX, origY } = dragRef.current;
      updateObj(id, {
        x: origX + (e.clientX - startX) / scale,
        y: origY + (e.clientY - startY) / scale,
      });
    }

    if (resizeRef.current) {
      const { id, startX, startY, origW, origH } = resizeRef.current;
      updateObj(id, {
        width: clamp(origW + (e.clientX - startX) / scale, 20, 3000),
        height: clamp(origH + (e.clientY - startY) / scale, 12, 3000),
      });
    }
  };

  const stopDrag = () => {
    dragRef.current = null;
    resizeRef.current = null;
  };

  // ---------------- SAVE ----------------
  const handleSubmit = async () => {
    if (!pdfFile) return;

    if (objects.length === 0) {
      setError("Please add text or cover first");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("pdfFile", pdfFile);
      formData.append("edits", JSON.stringify(objects));

      const res = await fetch("/convert/edit-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Edit failed";
        try {
          const j = await res.json();
          msg = j?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = pdfFile.name.replace(/\.pdf$/i, "") + "-edited.pdf";
      a.click();

      URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (err) {
      setError((err?.message || "Something went wrong").toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* PDF.js */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="beforeInteractive"
      />

      {/* ==================== SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-editpdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Edit PDF Online for Free",
              description:
                "Add text, cover existing text, change font, color and download an edited PDF with live preview.",
              url: "https://pdflinx.com/edit-pdf",
              step: [
                { "@type": "HowToStep", name: "Upload PDF", text: "Upload the PDF you want to edit." },
                { "@type": "HowToStep", name: "Add text or cover", text: "Add text anywhere or cover existing text with a white box." },
                { "@type": "HowToStep", name: "Style and download", text: "Change font, size and color, then download the edited PDF." },
              ],
              totalTime: "PT30S",
              estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
              image: "https://pdflinx.com/og-image.png",
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="breadcrumb-schema-editpdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "Edit PDF", item: "https://pdflinx.com/edit-pdf" },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="faq-schema-editpdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is PDFLinx Edit PDF free to use?",
                  acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx Edit PDF is free — no sign-up, no watermarks." },
                },
                {
                  "@type": "Question",
                  name: "Can I edit existing text inside the PDF?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "You can cover existing text with a white box and place new text on top. True editing depends on the PDF structure.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I change font size, font family, color, bold and italic?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Select a text box, then change its font, size, color, bold/italic/underline from the toolbar.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is my PDF secure?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Files are processed automatically and deleted after processing. No accounts required.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does it work on mobile?",
                  acceptedAnswer: { "@type": "Answer", text: "Yes. The editor is mobile-friendly with scrolling and zoom support." },
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      {/* ==================== TOOL UI ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Edit PDF Online Free
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Add text, cover existing text, change font, size, color, bold/italic with live preview — no signup, no watermark.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT SIDE */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit">
              <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-blue-50 transition">
                <Upload className="mx-auto mb-2 text-blue-600" />
                <p className="font-medium text-gray-800">
                  {pdfFile ? pdfFile.name : "Upload PDF"}
                </p>
                <p className="text-sm text-gray-500 mt-1">Max 25MB • .pdf only</p>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
              </label>

              {pdfFile && (
                <>
                  {/* TOOLBAR */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <button
                      onClick={addText}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                      type="button"
                    >
                      Add Text
                    </button>

                    <button
                      onClick={addCover}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                      type="button"
                    >
                      Cover Text
                    </button>

                    <button
                      onClick={deleteActive}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg"
                      type="button"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Delete
                      </span>
                    </button>
                  </div>

                  {/* TEXT CONTROLS */}
                  {activeObj?.type === "text" && (
                    <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Bold / Italic / Underline */}
                        <button
                          onClick={toggleBold}
                          className={`p-2 rounded-lg border ${
                            activeObj.fontWeight === "bold"
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                          title="Bold"
                          type="button"
                        >
                          <Bold className="w-4 h-4" />
                        </button>

                        <button
                          onClick={toggleItalic}
                          className={`p-2 rounded-lg border ${
                            activeObj.fontStyle === "italic"
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                          title="Italic"
                          type="button"
                        >
                          <Italic className="w-4 h-4" />
                        </button>

                        <button
                          onClick={toggleUnderline}
                          className={`p-2 rounded-lg border ${
                            activeObj.textDecoration === "underline"
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                          title="Underline"
                          type="button"
                        >
                          <Underline className="w-4 h-4" />
                        </button>

                        {/* Font Size */}
                        <div className="flex items-center gap-2 ml-1">
                          <button
                            onClick={() =>
                              updateObj(activeObj.id, {
                                fontSize: Math.max(8, (activeObj.fontSize || 16) - 2),
                              })
                            }
                            className="px-2 py-1 bg-white border border-gray-300 rounded-lg"
                            type="button"
                          >
                            A-
                          </button>

                          <span className="text-sm font-medium w-10 text-center">
                            {activeObj.fontSize || 16}
                          </span>

                          <button
                            onClick={() =>
                              updateObj(activeObj.id, {
                                fontSize: (activeObj.fontSize || 16) + 2,
                              })
                            }
                            className="px-2 py-1 bg-white border border-gray-300 rounded-lg"
                            type="button"
                          >
                            A+
                          </button>
                        </div>

                        {/* Font Family */}
                        <select
                          value={activeObj.fontFamily || "Calibri"}
                          onChange={(e) =>
                            updateObj(activeObj.id, { fontFamily: e.target.value })
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                          title="Font family"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>

                        {/* Color Picker */}
                        <input
                          type="color"
                          value={activeObj.color || "#111827"}
                          onChange={(e) =>
                            updateObj(activeObj.id, { color: e.target.value })
                          }
                          className="w-12 h-11 rounded-lg cursor-pointer border border-gray-300 bg-white"
                          title="Text color"
                        />

                        {/* Dark presets */}
                        <div className="flex items-center gap-1">
                          {DARK_PRESETS.map((c) => (
                            <button
                              key={c}
                              onClick={() => updateObj(activeObj.id, { color: c })}
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{ background: c }}
                              title={c}
                              type="button"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PAGE SELECT + ZOOM */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      Active page: <span className="font-semibold">{currentPage}</span> / {numPages || 1}
                      <span className="block text-xs text-gray-500">
                        (Click a page in preview to select it)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => setScale((s) => Math.max(0.4, +(s - 0.2).toFixed(2)))}
                        className="px-3 py-2 bg-gray-200 rounded-lg"
                        title="Zoom out"
                        type="button"
                      >
                        <ZoomOut />
                      </button>

                      <div className="min-w-[64px] text-center text-sm font-medium text-gray-700">
                        {Math.round(scale * 100)}%
                      </div>

                      <button
                        onClick={() => setScale((s) => Math.min(3, +(s + 0.2).toFixed(2)))}
                        className="px-3 py-2 bg-gray-200 rounded-lg"
                        title="Zoom in"
                        type="button"
                      >
                        <ZoomIn />
                      </button>
                    </div>
                  </div>

                  {/* Save */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    type="button"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Save PDF
                      </>
                    )}
                  </button>

                  {success && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                      <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
                      <p className="font-semibold text-green-700">
                        Done! Download started.
                      </p>
                    </div>
                  )}
                </>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Live Preview (All Pages)
              </h3>

              {!pdfFile ? (
                <div className="h-[60vh] flex items-center justify-center text-gray-400 border-2 border-dashed rounded-xl">
                  Upload PDF to preview
                </div>
              ) : (
                <div
                  ref={containerRef}
                  className="relative border rounded-xl overflow-auto max-h-[80vh] bg-gray-50"
                  onMouseMove={onMove}
                  onMouseUp={stopDrag}
                  onMouseLeave={stopDrag}
                  onClick={() => setActiveId(null)}
                >
                  <div className="p-4 space-y-8">
                    {Array.from({ length: numPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const objs = objectsByPage.get(pageNum) || [];

                      return (
                        <div
                          key={pageNum}
                          ref={(el) => (pageWrapRefs.current[idx] = el)}
                          onClick={(e) => setCurrentPageFromClick(e, idx)}
                          className={`relative inline-block bg-white rounded-lg shadow-sm border ${
                            currentPage === pageNum
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200"
                          }`}
                        >
                          <canvas
                            ref={(el) => (canvasRefs.current[idx] = el)}
                            className="block"
                          />

                          {/* overlays */}
                          {objs.map((obj) =>
                            obj.type === "text" ? (
                              <div
                                key={obj.id}
                                onMouseDown={(e) => startDrag(e, obj)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveId(obj.id);
                                  setCurrentPage(obj.page);
                                }}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  const newText = prompt("Edit text:", obj.text);
                                  if (newText !== null) updateObj(obj.id, { text: newText });
                                }}
                                style={{
                                  position: "absolute",
                                  left: obj.x * scale,
                                  top: obj.y * scale,
                                  fontSize: (obj.fontSize || 16) * scale,
                                  color: obj.color || "#111827",
                                  fontFamily: obj.fontFamily || "Calibri",
                                  fontWeight: obj.fontWeight || "normal",
                                  fontStyle: obj.fontStyle || "normal",
                                  textDecoration: obj.textDecoration || "none",
                                  cursor: "move",
                                  whiteSpace: "pre",
                                  padding: "2px 6px",
                                  borderRadius: 6,
                                  background:
                                    activeId === obj.id ? "rgba(59,130,246,0.08)" : "transparent",
                                  outline:
                                    activeId === obj.id ? "2px solid rgba(59,130,246,0.5)" : "none",
                                }}
                                title="Drag to move • Double click to edit"
                              >
                                {obj.text}
                              </div>
                            ) : (
                              <div
                                key={obj.id}
                                onMouseDown={(e) => startDrag(e, obj)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveId(obj.id);
                                  setCurrentPage(obj.page);
                                }}
                                style={{
                                  position: "absolute",
                                  left: obj.x * scale,
                                  top: obj.y * scale,
                                  width: (obj.width || 220) * scale,
                                  height: (obj.height || 32) * scale,
                                  background: obj.fill || "#ffffff",
                                  cursor: "move",
                                  outline:
                                    activeId === obj.id ? "2px solid rgba(59,130,246,0.5)" : "none",
                                }}
                                title="Drag to move • Resize from corner"
                              >
                                <div
                                  onMouseDown={(e) => startResize(e, obj)}
                                  className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                                />
                              </div>
                            )
                          )}

                          <div className="absolute -top-3 left-3 bg-white px-2 py-0.5 text-xs text-gray-600 border border-gray-200 rounded-full">
                            Page {pageNum}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3 text-center">
                Tip: Click a page to select it, then “Add Text” will be added on that page.
              </p>
            </div>
          </div>

          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Files auto-deleted • 100% free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Edit PDF Online Free – Add Text, Change Font & Download
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need quick PDF edits? Add text anywhere, cover old text, change font
            size, font family, color, bold/italic/underline — all with live preview.
            No signup, no watermark — upload, edit, and download instantly on PDF Linx.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Type className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Add Text Anywhere
            </h3>
            <p className="text-gray-600 text-sm">
              Place text on any page with drag & drop positioning and live preview.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Square className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Cover Existing Text
            </h3>
            <p className="text-gray-600 text-sm">
              Hide old text using a cover box, then write new text on top.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Fast & Private
            </h3>
            <p className="text-gray-600 text-sm">
              Instant download, no signup, no watermark — files are auto-deleted.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Edit PDF in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload PDF</h4>
              <p className="text-gray-600 text-sm">
                Upload the PDF you want to edit in your browser.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Edit & Style</h4>
              <p className="text-gray-600 text-sm">
                Add text, choose font, size, color, bold/italic with live preview.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download</h4>
              <p className="text-gray-600 text-sm">
                Click Save PDF and download your edited document instantly.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          PDF Linx makes quick PDF edits easy — add text, change fonts, adjust colors,
          and download instantly. Simple, fast, secure, and completely free — no signup, no watermark.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Edit PDF Online – Free PDF Editor Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Kabhi PDF me chhoti si correction karni ho — naam, date, address, ya koi line add karni ho —
          lekin Adobe jaisi heavy app install nahi karni? Yahan{" "}
          <span className="font-medium text-slate-900">PDFLinx Edit PDF tool</span>{" "}
          kaam aata hai. Ye 100% free online editor hai jahan tum PDF me{" "}
          <span className="font-semibold text-slate-900">text add</span> kar sakte ho,
          font size / font family / color change kar sakte ho, aur live preview ke sath
          final PDF download kar sakte ho —{" "}
          <span className="font-semibold text-slate-900">
            no signup, no watermark
          </span>
          .
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What is PDF Editing?
        </h3>
        <p className="leading-7 mb-6">
          PDF editing ka matlab hota hai document me changes karna — jaise naya text add
          karna, existing text ko hide/cover karna, ya formatting adjust karna. PDF
          format “fixed layout” hota hai, is liye true text editing har PDF me possible
          nahi hoti. Is tool me tum easily{" "}
          <span className="font-medium text-slate-900">
            text add + cover old text
          </span>{" "}
          method se professional results nikal sakte ho.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Use PDFLinx Edit PDF Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Add text anywhere on the PDF pages with drag & drop</li>
          <li>Change font size, font family, and text color instantly</li>
          <li>Cover existing text using a cover box and write new text on top</li>
          <li>Live preview with zoom + scroll (mobile & desktop friendly)</li>
          <li>No signup, no watermark — fast download</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Edit a PDF Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your PDF file</li>
          <li>Click “Add Text” to insert text, or “Cover Text” to hide old text</li>
          <li>Select the text box to change font, size, color & style</li>
          <li>Drag to position it correctly (use zoom if needed)</li>
          <li>Click “Save PDF” to download your edited file</li>
        </ol>

        <p className="mb-6">
          No registration, no watermark, no software needed — completely free and simple.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Edit PDF Tool
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>Add text on any PDF page</li>
            <li>Bold / Italic / Underline</li>
            <li>Font size increase/decrease controls</li>
            <li>Font family selector (Calibri + more)</li>
            <li>Text color picker + dark presets</li>
            <li>Cover existing text (cover box tool)</li>
            <li>Zoom in/out with scrollable preview</li>
            <li>Works on mobile & desktop browsers</li>
            <li>Free — no signup, no watermark</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> forms, assignments, applications me quick edits</li>
          <li><strong>Job seekers:</strong> CV/resume me small text corrections</li>
          <li><strong>Business owners:</strong> invoices, quotations, letters me updates</li>
          <li><strong>Office work:</strong> PDFs me notes, labels, dates add karna</li>
          <li><strong>Anyone:</strong> fast PDF edits without installing software</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Safe to Use?
        </h3>
        <p className="leading-7 mb-6">
          Yes — safe and privacy-friendly. Your PDF is processed automatically and
          deleted shortly after processing. We don’t store or share your documents.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Edit PDFs Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx works on Windows, macOS, Linux, Android, and iOS. Bas browser open
          karo, PDF upload karo, edits karo, aur download — simple and fast.
        </p>
      </section>

      {/* FAQs UI */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Is the Edit PDF tool free?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — PDFLinx Edit PDF is free to use with no sign-up and no watermarks.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I change font size, font family, color, bold and italic?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes. Select your text box and use the toolbar to change size, font,
                color, and styles like bold/italic/underline.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I edit existing text in a PDF?
              </summary>
              <p className="mt-2 text-gray-600">
                Most PDFs are not truly editable. You can cover existing text and place new text on top.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Why do I only see one page sometimes?
              </summary>
              <p className="mt-2 text-gray-600">
                This editor shows all pages in a scroll view. If you previously saw one page, it was single-page render mode.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Is my PDF safe?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes. Files are processed automatically and deleted after processing.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Does it work on mobile?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — you can zoom, scroll, and edit PDFs on mobile and desktop browsers.
              </p>
            </details>
          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="edit-pdf" />
    </>
  );
}






























// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import Script from "next/script";
// import {
//   Upload,
//   Type,
//   Square,
//   Trash2,
//   ZoomIn,
//   ZoomOut,
//   CheckCircle,
//   Download,
// } from "lucide-react";
// import RelatedToolsSection from "@/components/RelatedTools";

// const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

// const FONT_OPTIONS = [
//   "Calibri",
//   "Arial",
//   "Helvetica",
//   "Times New Roman",
//   "Georgia",
//   "Verdana",
//   "Tahoma",
//   "Trebuchet MS",
//   "Courier New",
//   "Inter",
//   "Roboto",
//   "Poppins",
// ];

// const DARK_PRESETS = ["#111827", "#0f172a", "#1f2937", "#374151", "#000000"];

// export default function EditPdf() {
//   const [pdfFile, setPdfFile] = useState(null);
//   const [pdfDoc, setPdfDoc] = useState(null);
//   const [numPages, setNumPages] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [scale, setScale] = useState(1);

//   const [objects, setObjects] = useState([]);
//   const [activeId, setActiveId] = useState(null);

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const canvasRef = useRef(null);
//   const containerRef = useRef(null);
//   const dragRef = useRef(null);
//   const resizeRef = useRef(null);

//   const pageObjects = useMemo(
//     () => objects.filter((o) => o.page === currentPage),
//     [objects, currentPage]
//   );

//   const activeObj = objects.find((o) => o.id === activeId);

//   // ---------------- PDF LOAD ----------------
//   useEffect(() => {
//     if (!pdfFile) return;

//     const load = async () => {
//       try {
//         setError("");
//         setSuccess(false);

//         const pdfjsLib = window.pdfjsLib;
//         if (!pdfjsLib) return;

//         pdfjsLib.GlobalWorkerOptions.workerSrc =
//           "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

//         const buffer = await pdfFile.arrayBuffer();
//         const doc = await pdfjsLib.getDocument({ data: buffer }).promise;

//         setPdfDoc(doc);
//         setNumPages(doc.numPages);
//         setCurrentPage(1);
//         setScale(1);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load PDF");
//       }
//     };

//     load();
//   }, [pdfFile]);

//   // ---------------- RENDER PAGE ----------------
//   useEffect(() => {
//     if (!pdfDoc) return;

//     const render = async () => {
//       try {
//         const page = await pdfDoc.getPage(currentPage);
//         const viewport = page.getViewport({ scale });

//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");

//         canvas.width = viewport.width;
//         canvas.height = viewport.height;

//         await page.render({
//           canvasContext: ctx,
//           viewport,
//         }).promise;
//       } catch (e) {
//         console.error(e);
//       }
//     };

//     render();
//   }, [pdfDoc, currentPage, scale]);

//   // ---------------- UPLOAD ----------------
//   const handlePdfUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file || file.type !== "application/pdf") {
//       setError("Please upload a valid PDF file");
//       return;
//     }

//     setPdfFile(file);
//     setObjects([]);
//     setActiveId(null);
//     setError("");
//     setSuccess(false);
//   };

//   // ---------------- OBJECT HELPERS ----------------
//   const updateObj = (id, updates) => {
//     setObjects((prev) =>
//       prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
//     );
//   };

//   const deleteActive = () => {
//     if (!activeId) return;
//     setObjects((prev) => prev.filter((o) => o.id !== activeId));
//     setActiveId(null);
//   };

//   // ---------------- ADD TEXT ----------------
//   const addText = () => {
//     const id = Date.now();
//     setObjects((prev) => [
//       ...prev,
//       {
//         id,
//         type: "text",
//         page: currentPage,
//         text: "Double click to edit",
//         x: 100,
//         y: 100,
//         fontSize: 16,
//         color: "#111827",
//         fontFamily: "Calibri",
//       },
//     ]);
//     setActiveId(id);
//   };

//   // ---------------- ADD COVER ----------------
//   const addCover = () => {
//     const id = Date.now();
//     setObjects((prev) => [
//       ...prev,
//       {
//         id,
//         type: "cover",
//         page: currentPage,
//         x: 100,
//         y: 100,
//         width: 220,
//         height: 32,
//         fill: "#ffffff",
//       },
//     ]);
//     setActiveId(id);
//   };

//   // ---------------- DRAG ----------------
//   const startDrag = (e, id) => {
//     e.stopPropagation();
//     const obj = objects.find((o) => o.id === id);
//     dragRef.current = {
//       id,
//       startX: e.clientX,
//       startY: e.clientY,
//       origX: obj.x,
//       origY: obj.y,
//     };
//     setActiveId(id);
//   };

//   const startResize = (e, id) => {
//     e.stopPropagation();
//     const obj = objects.find((o) => o.id === id);
//     resizeRef.current = {
//       id,
//       startX: e.clientX,
//       startY: e.clientY,
//       origW: obj.width,
//       origH: obj.height,
//     };
//     setActiveId(id);
//   };

//   const onMove = (e) => {
//     if (dragRef.current) {
//       const { id, startX, startY, origX, origY } = dragRef.current;
//       updateObj(id, {
//         x: origX + (e.clientX - startX) / scale,
//         y: origY + (e.clientY - startY) / scale,
//       });
//     }

//     if (resizeRef.current) {
//       const { id, startX, startY, origW, origH } = resizeRef.current;
//       updateObj(id, {
//         width: clamp(origW + (e.clientX - startX) / scale, 20, 3000),
//         height: clamp(origH + (e.clientY - startY) / scale, 12, 3000),
//       });
//     }
//   };

//   const stopDrag = () => {
//     dragRef.current = null;
//     resizeRef.current = null;
//   };

//   // ---------------- SAVE ----------------
//   const handleSubmit = async () => {
//     if (!pdfFile) return;

//     if (objects.length === 0) {
//       setError("Please add text or cover first");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setSuccess(false);

//     try {
//       const formData = new FormData();
//       formData.append("pdfFile", pdfFile);
//       formData.append("edits", JSON.stringify(objects));

//       const res = await fetch("/convert/edit-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         let msg = "Edit failed";
//         try {
//           const j = await res.json();
//           msg = j?.error || msg;
//         } catch {}
//         throw new Error(msg);
//       }

//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = pdfFile.name.replace(/\.pdf$/i, "") + "-edited.pdf";
//       a.click();

//       URL.revokeObjectURL(url);
//       setSuccess(true);
//     } catch (err) {
//       setError((err?.message || "Something went wrong").toString());
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* PDF.js */}
//       <Script
//         src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
//         strategy="beforeInteractive"
//       />

//       {/* ==================== SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-editpdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "HowTo",
//               name: "How to Edit PDF Online for Free",
//               description:
//                 "Add text, cover existing text, change font, color and download an edited PDF with live preview.",
//               url: "https://pdflinx.com/edit-pdf",
//               step: [
//                 {
//                   "@type": "HowToStep",
//                   name: "Upload PDF",
//                   text: "Upload the PDF you want to edit.",
//                 },
//                 {
//                   "@type": "HowToStep",
//                   name: "Add text or cover",
//                   text: "Add text anywhere or cover existing text with a white box.",
//                 },
//                 {
//                   "@type": "HowToStep",
//                   name: "Style and download",
//                   text: "Change font, size and color, then download the edited PDF.",
//                 },
//               ],
//               totalTime: "PT30S",
//               estimatedCost: {
//                 "@type": "MonetaryAmount",
//                 value: "0",
//                 currency: "USD",
//               },
//               image: "https://pdflinx.com/og-image.png",
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-editpdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "BreadcrumbList",
//               itemListElement: [
//                 { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//                 { "@type": "ListItem", position: 2, name: "Edit PDF", item: "https://pdflinx.com/edit-pdf" },
//               ],
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       <Script
//         id="faq-schema-editpdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "FAQPage",
//               mainEntity: [
//                 {
//                   "@type": "Question",
//                   name: "Is PDFLinx Edit PDF free to use?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes. PDFLinx Edit PDF is free — no sign-up, no watermarks.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "Can I edit existing text inside the PDF?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "You can cover existing text with a white box and place new text on top. True editing depends on the PDF structure.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "Can I change font size, font family and color?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes. Select a text box, then change its size, font and color from the toolbar.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "Is my PDF secure?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes. Files are processed automatically and deleted after processing. No accounts required.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "Does it work on mobile?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes. The editor is mobile-friendly with scrolling and zoom support.",
//                   },
//                 },
//               ],
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       {/* ==================== TOOL UI ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
//               Edit PDF Online Free
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Add text, cover existing text, change font, size & color with live preview — no signup, no watermark.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* LEFT SIDE */}
//             <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit">
//               <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-blue-50 transition">
//                 <Upload className="mx-auto mb-2 text-blue-600" />
//                 <p className="font-medium text-gray-800">
//                   {pdfFile ? pdfFile.name : "Upload PDF"}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">Max 25MB • .pdf only</p>
//                 <input
//                   type="file"
//                   accept=".pdf,application/pdf"
//                   onChange={handlePdfUpload}
//                   className="hidden"
//                 />
//               </label>

//               {pdfFile && (
//                 <>
//                   {/* TOOLBAR */}
//                   <div className="flex flex-wrap items-center gap-2 mt-4 overflow-x-auto">
//                     <button
//                       onClick={addText}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//                       type="button"
//                     >
//                       Add Text
//                     </button>

//                     <button
//                       onClick={addCover}
//                       className="px-4 py-2 bg-purple-600 text-white rounded-lg"
//                       type="button"
//                     >
//                       Cover Text
//                     </button>

//                     <button
//                       onClick={deleteActive}
//                       className="px-4 py-2 bg-red-600 text-white rounded-lg"
//                       type="button"
//                     >
//                       Delete
//                     </button>

//                     {/* TEXT CONTROLS */}
//                     {activeObj?.type === "text" && (
//                       <>
//                         {/* Font Size */}
//                         <div className="flex items-center gap-2 ml-2">
//                           <button
//                             onClick={() =>
//                               updateObj(activeObj.id, {
//                                 fontSize: Math.max(8, (activeObj.fontSize || 16) - 2),
//                               })
//                             }
//                             className="px-2 py-1 bg-gray-200 rounded"
//                             type="button"
//                           >
//                             A-
//                           </button>

//                           <span className="text-sm font-medium w-10 text-center">
//                             {activeObj.fontSize || 16}
//                           </span>

//                           <button
//                             onClick={() =>
//                               updateObj(activeObj.id, {
//                                 fontSize: (activeObj.fontSize || 16) + 2,
//                               })
//                             }
//                             className="px-2 py-1 bg-gray-200 rounded"
//                             type="button"
//                           >
//                             A+
//                           </button>
//                         </div>

//                         {/* Font Family */}
//                         <select
//                           value={activeObj.fontFamily || "Calibri"}
//                           onChange={(e) =>
//                             updateObj(activeObj.id, { fontFamily: e.target.value })
//                           }
//                           className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
//                           title="Font family"
//                         >
//                           {FONT_OPTIONS.map((f) => (
//                             <option key={f} value={f}>
//                               {f}
//                             </option>
//                           ))}
//                         </select>

//                         {/* Color Picker */}
//                         <input
//                           type="color"
//                           value={activeObj.color || "#111827"}
//                           onChange={(e) =>
//                             updateObj(activeObj.id, { color: e.target.value })
//                           }
//                           className="w-12 h-11 rounded-lg cursor-pointer border border-gray-300"
//                           title="Text color"
//                         />

//                         {/* Dark presets */}
//                         <div className="flex items-center gap-1">
//                           {DARK_PRESETS.map((c) => (
//                             <button
//                               key={c}
//                               onClick={() => updateObj(activeObj.id, { color: c })}
//                               className="w-6 h-6 rounded border border-gray-300"
//                               style={{ background: c }}
//                               title={c}
//                               type="button"
//                             />
//                           ))}
//                         </div>
//                       </>
//                     )}

//                     {/* Zoom */}
//                     <button
//                       onClick={() => setScale((s) => s + 0.2)}
//                       className="px-3 py-2 bg-gray-200 rounded-lg ml-auto"
//                       title="Zoom in"
//                       type="button"
//                     >
//                       <ZoomIn />
//                     </button>

//                     <button
//                       onClick={() => setScale((s) => Math.max(0.4, s - 0.2))}
//                       className="px-3 py-2 bg-gray-200 rounded-lg"
//                       title="Zoom out"
//                       type="button"
//                     >
//                       <ZoomOut />
//                     </button>
//                   </div>

//                   {/* Save */}
//                   <button
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
//                     type="button"
//                   >
//                     {loading ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                         Saving...
//                       </>
//                     ) : (
//                       <>
//                         <Download className="w-5 h-5" />
//                         Save PDF
//                       </>
//                     )}
//                   </button>

//                   {success && (
//                     <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
//                       <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
//                       <p className="font-semibold text-green-700">
//                         Done! Download started.
//                       </p>
//                     </div>
//                   )}
//                 </>
//               )}

//               {error && (
//                 <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
//                   {error}
//                 </div>
//               )}
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100">
//               <h3 className="text-lg font-semibold mb-4 text-gray-800">
//                 Live Preview
//               </h3>

//               {!pdfFile ? (
//                 <div className="h-[60vh] flex items-center justify-center text-gray-400 border-2 border-dashed rounded-xl">
//                   Upload PDF to preview
//                 </div>
//               ) : (
//                 <div
//                   ref={containerRef}
//                   className="relative border rounded-xl overflow-auto max-h-[80vh] bg-gray-50"
//                   onMouseMove={onMove}
//                   onMouseUp={stopDrag}
//                   onMouseLeave={stopDrag}
//                   onClick={() => setActiveId(null)}
//                 >
//                   <div className="relative inline-block">
//                     <canvas ref={canvasRef} />

//                     {pageObjects.map((obj) =>
//                       obj.type === "text" ? (
//                         <div
//                           key={obj.id}
//                           onMouseDown={(e) => startDrag(e, obj.id)}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setActiveId(obj.id);
//                           }}
//                           onDoubleClick={(e) => {
//                             e.stopPropagation();
//                             const newText = prompt("Edit text:", obj.text);
//                             if (newText !== null) updateObj(obj.id, { text: newText });
//                           }}
//                           style={{
//                             position: "absolute",
//                             left: obj.x * scale,
//                             top: obj.y * scale,
//                             fontSize: obj.fontSize * scale,
//                             color: obj.color,
//                             fontFamily: obj.fontFamily || "Calibri",
//                             cursor: "move",
//                             whiteSpace: "pre",
//                           }}
//                           title="Drag to move • Double click to edit"
//                         >
//                           {obj.text}
//                         </div>
//                       ) : (
//                         <div
//                           key={obj.id}
//                           onMouseDown={(e) => startDrag(e, obj.id)}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setActiveId(obj.id);
//                           }}
//                           style={{
//                             position: "absolute",
//                             left: obj.x * scale,
//                             top: obj.y * scale,
//                             width: obj.width * scale,
//                             height: obj.height * scale,
//                             background: obj.fill,
//                             cursor: "move",
//                           }}
//                           title="Drag to move • Resize from corner"
//                         >
//                           <div
//                             onMouseDown={(e) => startResize(e, obj.id)}
//                             className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
//                           />
//                         </div>
//                       )
//                     )}
//                   </div>
//                 </div>
//               )}

//               <p className="text-xs text-gray-500 mt-3 text-center">
//                 Tip: Zoom in/out and scroll to view the full page.
//               </p>
//             </div>
//           </div>

//           <p className="text-center mt-6 text-gray-600 text-base">
//             No account • No watermark • Files auto-deleted • 100% free
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
//             Edit PDF Online Free – Add Text, Change Font & Download
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Need quick PDF edits? Add text anywhere, cover old text, change font
//             size, font family, and text color — all with live preview. No signup,
//             no watermark — just upload, edit, and download instantly on PDF Linx.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Type className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">
//               Add Text Anywhere
//             </h3>
//             <p className="text-gray-600 text-sm">
//               Place text on any page with drag & drop positioning and live preview.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Square className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">
//               Cover Existing Text
//             </h3>
//             <p className="text-gray-600 text-sm">
//               Hide old text using a white cover box, then write new text on top.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">
//               Fast & Private
//             </h3>
//             <p className="text-gray-600 text-sm">
//               Instant download, no signup, no watermark — files are auto-deleted.
//             </p>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Edit PDF in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload PDF</h4>
//               <p className="text-gray-600 text-sm">
//                 Upload the PDF you want to edit in your browser.
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Edit & Style</h4>
//               <p className="text-gray-600 text-sm">
//                 Add text, choose font, size, and color with live preview.
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download</h4>
//               <p className="text-gray-600 text-sm">
//                 Click Save PDF and download your edited document instantly.
//               </p>
//             </div>
//           </div>
//         </div>

//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//         PDF Linx makes quick PDF edits easy — add text, change fonts, adjust colors,
//         and download instantly. Simple, fast, secure, and completely free — no signup, no watermark.
//         </p>

        
    
//       </section>

//         <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//   {/* Heading */}
//   <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//     Edit PDF Online – Free PDF Editor Tool by PDFLinx
//   </h2>

//   {/* Intro */}
//   <p className="text-base leading-7 mb-6">
//     Kabhi PDF me chhoti si correction karni ho — naam, date, address, ya koi line add karni ho —
//     lekin Adobe jaisi heavy app install nahi karni? Yahan{" "}
//     <span className="font-medium text-slate-900">PDFLinx Edit PDF tool</span>{" "}
//     kaam aata hai. Ye 100% free online editor hai jahan tum PDF me{" "}
//     <span className="font-semibold text-slate-900">text add</span> kar sakte ho,
//     font size / font family / color change kar sakte ho, aur live preview ke sath
//     final PDF download kar sakte ho —{" "}
//     <span className="font-semibold text-slate-900">
//       no signup, no watermark
//     </span>
//     .
//   </p>

//   {/* What is */}
//   <h3 className="text-xl font-semibold text-slate-900 mb-3">
//     What is PDF Editing?
//   </h3>
//   <p className="leading-7 mb-6">
//     PDF editing ka matlab hota hai document me changes karna — jaise naya text add
//     karna, existing text ko hide/cover karna, ya formatting adjust karna. PDF
//     format “fixed layout” hota hai, is liye true text editing har PDF me possible
//     nahi hoti. Is tool me tum easily{" "}
//     <span className="font-medium text-slate-900">
//       text add + cover old text
//     </span>{" "}
//     method se professional results nikal sakte ho.
//   </p>

//   {/* Why use */}
//   <h3 className="text-xl font-semibold text-slate-900 mb-3">
//     Why Use PDFLinx Edit PDF Tool?
//   </h3>
//   <ul className="space-y-2 mb-6 list-disc pl-6">
//     <li>Add text anywhere on the PDF pages with drag & drop</li>
//     <li>Change font size, font family, and text color instantly</li>
//     <li>Cover existing text using a white box and write new text on top</li>
//     <li>Live preview with zoom + scroll (mobile & desktop friendly)</li>
//     <li>No signup, no watermark — fast download</li>
//   </ul>

//   {/* Steps */}
//   <h3 className="text-xl font-semibold text-slate-900 mb-3">
//     How to Edit a PDF Online
//   </h3>
//   <ol className="space-y-2 mb-6 list-decimal pl-6">
//     <li>Upload your PDF file</li>
//     <li>Click “Add Text” to insert text, or “Cover Text” to hide old text</li>
//     <li>Select the text box to change font, size, and color</li>
//     <li>Drag to position it correctly (use zoom if needed)</li>
//     <li>Click “Save PDF” to download your edited file</li>
//   </ol>

//   <p className="mb-6">
//     No registration, no watermark, no software needed — completely free and
//     simple.
//   </p>

//   {/* Features box */}
//   <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
//     <h3 className="text-xl font-semibold text-slate-900 mb-4">
//       Features of PDFLinx Edit PDF Tool
//     </h3>
//     <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
//       <li>Add text on any PDF page</li>
//       <li>Font size increase/decrease controls</li>
//       <li>Font family selector</li>
//       <li>Text color picker + dark presets</li>
//       <li>Cover existing text (white box tool)</li>
//       <li>Zoom in/out with scrollable preview</li>
//       <li>Works on mobile & desktop browsers</li>
//       <li>Free — no signup, no watermark</li>
//     </ul>
//   </div>

//   {/* Audience */}
//   <h3 className="text-xl font-semibold text-slate-900 mb-3">
//     Who Should Use This Tool?
//   </h3>
//   <ul className="space-y-2 mb-6 list-disc pl-6">
//     <li>
//       <strong>Students:</strong> forms, assignments, applications me quick edits
//     </li>
//     <li>
//       <strong>Job seekers:</strong> CV/resume me small text corrections
//     </li>
//     <li>
//       <strong>Business owners:</strong> invoices, quotations, letters me updates
//     </li>
//     <li>
//       <strong>Office work:</strong> PDFs me notes, labels, dates add karna
//     </li>
//     <li>
//       <strong>Anyone:</strong> fast PDF edits without installing software
//     </li>
//   </ul>

//   {/* Safety */}
//   <h3 className="text-xl font-semibold text-slate-900 mb-3">
//     Is PDFLinx Safe to Use?
//   </h3>
//   <p className="leading-7 mb-6">
//     Yes — safe and privacy-friendly. Your PDF is processed automatically and
//     deleted shortly after processing. We don’t store or share your documents,
//     and you don’t need an account to edit PDFs.
//   </p>

//   {/* Closing */}
//   <h3 className="text-xl font-semibold text-slate-900 mb-3">
//     Edit PDFs Anytime, Anywhere
//   </h3>
//   <p className="leading-7">
//     PDFLinx works on Windows, macOS, Linux, Android, and iOS. Bas browser open
//     karo, PDF upload karo, edits karo, aur download — simple and fast.
//   </p>
// </section>



//       {/* FAQs UI */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
//             Frequently Asked Questions
//           </h2>

//           <div className="space-y-4">
//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Is the Edit PDF tool free?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — PDFLinx Edit PDF is free to use with no sign-up and no watermarks.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I change font size, font family and text color?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes. Select your text box and use the toolbar to change size, font and color.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I edit existing text in a PDF?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Most PDFs are not truly editable. You can cover existing text and place new text on top.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Is my PDF safe?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes. Files are processed automatically and deleted after processing.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Does it work on mobile?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — you can zoom, scroll, and edit PDFs on mobile and desktop browsers.
//               </p>
//             </details>
//           </div>
//         </div>
//       </section>

//       <RelatedToolsSection currentPage="edit-pdf" />
//     </>
//   );
// }


