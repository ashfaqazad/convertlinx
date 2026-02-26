"use client";

import { useRef, useState, useEffect } from "react";
import RelatedToolsSection from "@/components/RelatedTools";

import Script from "next/script";
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  X,
  PenTool,
  Eraser,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export default function SignPdf() {
  // ==================== STATE ====================
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [signatureImage, setSignatureImage] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState("");
  const [drawMode, setDrawMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [xPosition, setXPosition] = useState(50);
  const [yPosition, setYPosition] = useState(50);
  const [signatureWidth, setSignatureWidth] = useState(150);
  const [signatureHeight, setSignatureHeight] = useState(75);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [pdfJsReady, setPdfJsReady] = useState(false);
  const canvasRefs = useRef([]);
  const signCanvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [renderKey, setRenderKey] = useState(0); // Force re-render trigger

  // ==================== HELPERS ====================
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const resetAllForNewPdf = () => {
    setPdfDoc(null);
    setTotalPages(1);
    setPageNumber(1);
    setScale(1);
    canvasRefs.current = [];
    setXPosition(50);
    setYPosition(50);
    setSuccess(false);
    setError("");
    setRenderKey(0);
  };

  const resetSignature = () => {
    setSignatureImage(null);
    setSignaturePreview("");
    setDrawMode(false);
  };

  // ==================== PDF FILE UPLOAD ====================
  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    setPdfFile(file);
    resetAllForNewPdf();
  };

  // ==================== LOAD PDF DOC ====================
  useEffect(() => {
    if (!pdfFile) return;

    let cancelled = false;
    let tries = 0;

    const load = async () => {
      const lib = window?.pdfjsLib;

      if (!lib) {
        if (tries++ < 60) return setTimeout(load, 50);
        if (!cancelled) setError("PDF preview engine failed to load (pdf.js).");
        return;
      }

      try {
        setError("");
        const buf = await pdfFile.arrayBuffer();
        const doc = await lib.getDocument({ data: buf }).promise;

        if (cancelled) return;

        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setPageNumber(1);
        canvasRefs.current = new Array(doc.numPages).fill(null);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load PDF for preview.");
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [pdfFile]);

  // ==================== RENDER ALL PAGES ====================
  useEffect(() => {
    if (!pdfDoc) return;

    let cancelled = false;

    const renderAll = async () => {
      try {
        // Wait for all canvas refs to be mounted
        await new Promise(resolve => setTimeout(resolve, 100));
        
        for (let i = 1; i <= totalPages; i++) {
          if (cancelled) return;

          const canvas = canvasRefs.current[i - 1];
          if (!canvas) {
            console.warn(`Canvas ${i} not mounted yet`);
            continue;
          }

          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale });

          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: ctx, viewport }).promise;
        }
      } catch (e) {
        console.error("Render error:", e);
        if (!cancelled) setError("Failed to render PDF preview.");
      }
    };

    renderAll();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, totalPages, scale, renderKey]);

  // Trigger re-render when scale changes
  useEffect(() => {
    if (pdfDoc) {
      setRenderKey(prev => prev + 1);
    }
  }, [scale]);

  // ==================== SIGNATURE: DRAW MODE ====================
  // const startDrawing = (e) => {
  //   if (!drawMode) return;
  //   const canvas = signCanvasRef.current;
  //   if (!canvas) return;

  //   const rect = canvas.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
  //   const y = e.clientY - rect.top;

  //   const ctx = canvas.getContext("2d");
  //   ctx.beginPath();
  //   ctx.moveTo(x, y);
  //   ctx.strokeStyle = "#000";
  //   ctx.lineWidth = 2;
  //   ctx.lineCap = "round";

  //   isDrawing.current = true;
  // };

  // const draw = (e) => {
  //   if (!drawMode || !isDrawing.current) return;
  //   const canvas = signCanvasRef.current;
  //   if (!canvas) return;

  //   const rect = canvas.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
  //   const y = e.clientY - rect.top;

  //   const ctx = canvas.getContext("2d");
  //   ctx.lineTo(x, y);
  //   ctx.stroke();
  // };

  // const stopDrawing = () => {
  //   isDrawing.current = false;
  // };

  // const clearCanvas = () => {
  //   const canvas = signCanvasRef.current;
  //   if (!canvas) return;
  //   const ctx = canvas.getContext("2d");
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   resetSignature();
  // };

  // const saveCanvasAsImage = () => {
  //   const canvas = signCanvasRef.current;
  //   if (!canvas) return;

  //   canvas.toBlob((blob) => {
  //     if (!blob) return;
  //     const file = new File([blob], "signature.png", { type: "image/png" });
  //     setSignatureImage(file);
  //     const url = URL.createObjectURL(blob);
  //     setSignaturePreview(url);
  //     setDrawMode(false);
  //     setSuccess(false);
  //     setError("");
  //   }, "image/png");
  // };

  // ==================== SIGNATURE: DRAW MODE ====================
const startDrawing = (e) => {
  if (!drawMode) return;
  const canvas = signCanvasRef.current;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  // FIX: Scale factor calculate karo
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3; // Thicker line for better visibility
  ctx.lineCap = "round";
  ctx.lineJoin = "round"; // Smooth corners

  isDrawing.current = true;
};

const draw = (e) => {
  if (!drawMode || !isDrawing.current) return;
  const canvas = signCanvasRef.current;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  // FIX: Same scale factor
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const ctx = canvas.getContext("2d");
  ctx.lineTo(x, y);
  ctx.stroke();
};

const stopDrawing = () => {
  isDrawing.current = false;
};

const clearCanvas = () => {
  const canvas = signCanvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resetSignature();
};

const saveCanvasAsImage = () => {
  const canvas = signCanvasRef.current;
  if (!canvas) return;

  canvas.toBlob((blob) => {
    if (!blob) return;
    const file = new File([blob], "signature.png", { type: "image/png" });
    setSignatureImage(file);
    const url = URL.createObjectURL(blob);
    setSignaturePreview(url);
    setDrawMode(false);
    setSuccess(false);
    setError("");
  }, "image/png");
};

  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image (PNG/JPG).");
      return;
    }
    setSignatureImage(file);
    setSignaturePreview(URL.createObjectURL(file));
    setDrawMode(false);
    setSuccess(false);
    setError("");
  };

  // ==================== DRAG SIGNATURE ====================
  const handleSignatureDragStart = (e) => {
    if (!signaturePreview) return;

    const pageWrapper = e.currentTarget.parentElement;
    const rect = pageWrapper.getBoundingClientRect();

    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - rect.left - xPosition,
      y: e.clientY - rect.top - yPosition,
    };
  };

  const handleSignatureDrag = (e) => {
    if (!isDragging) return;

    const canvas = canvasRefs.current[pageNumber - 1];
    if (!canvas) return;

    const pageWrapper = canvas.parentElement;
    if (!pageWrapper) return;

    const rect = pageWrapper.getBoundingClientRect();

    const newX = e.clientX - rect.left - dragStart.current.x;
    const newY = e.clientY - rect.top - dragStart.current.y;

    const maxX = rect.width - signatureWidth;
    const maxY = rect.height - signatureHeight;

    setXPosition(clamp(newX, 0, maxX));
    setYPosition(clamp(newY, 0, maxY));
  };

  const handleSignatureDragEnd = () => {
    setIsDragging(false);
  };

  // ==================== SELECT PAGE ====================
  const selectPage = (i) => {
    setPageNumber(i);
    const canvas = canvasRefs.current[i - 1];
    if (!canvas) return;
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;
    setXPosition((x) => clamp(x, 0, rect.width - signatureWidth));
    setYPosition((y) => clamp(y, 0, rect.height - signatureHeight));
  };

  // ==================== SUBMIT ====================
  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) return setError("Please upload a PDF file!");
    if (!signatureImage) return setError("Please provide a signature!");

    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const formData = new FormData();
      formData.append("pdfFile", pdfFile);
      formData.append("signatureImage", signatureImage);
      formData.append("pageNumber", String(pageNumber));
      formData.append("xPosition", String(Math.round(xPosition)));
      formData.append("yPosition", String(Math.round(yPosition)));
      formData.append("width", String(Math.round(signatureWidth)));
      formData.append("height", String(Math.round(signatureHeight)));
      formData.append("scale", String(scale));

      const res = await fetch("/convert/sign-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Signing failed";
        try {
          const j = await res.json();
          msg = j?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const blob = await res.blob();
      downloadBlob(blob, pdfFile.name.replace(/\.pdf$/i, "") + "-signed.pdf");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError((err?.message || "Something went wrong").toString());
    } finally {
      setLoading(false);
    }
  };

  // ==================== UI ====================
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onReady={() => {
          if (window?.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            setPdfJsReady(true);
          }
        }}
      />

      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Upload PDF
                  </label>
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-blue-50 transition">
                      <Upload className="w-10 h-10 mx-auto mb-2 text-blue-600" />
                      <p className="font-semibold text-gray-800">
                        {pdfFile ? pdfFile.name : "Click to upload PDF"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">.pdf only</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                  </label>

                  {pdfFile && (
                    <div className="mt-3 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium">{pdfFile.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPdfFile(null);
                          resetAllForNewPdf();
                          resetSignature();
                        }}
                        className="text-red-500 hover:bg-red-100 p-1 rounded"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Signature create */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Signature
                  </label>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setDrawMode(true)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition ${
                        drawMode ? "border-blue-600 bg-blue-50" : "border-gray-300"
                      }`}
                    >
                      <PenTool className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-sm">Draw</span>
                    </button>

                    <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-300 hover:border-purple-400 cursor-pointer transition">
                      <ImageIcon className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-sm">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSignatureUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                {drawMode && (
                  <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
                    <canvas
                      ref={signCanvasRef}
                      width={600}  // INCREASED from 450
                      height={250}  // INCREASED from 150
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="border-2 border-dashed border-gray-400 bg-white w-full rounded-lg cursor-crosshair"
                      style={{ touchAction: 'none' }} // Prevent scrolling on touch devices
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                      >
                        <Eraser className="w-4 h-4" />
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={saveCanvasAsImage}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>
                )}


                  {/* {drawMode && (
                    <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
                      <canvas
                        ref={signCanvasRef}
                        width={450}
                        height={150}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="border-2 border-dashed border-gray-400 bg-white w-full rounded-lg cursor-crosshair"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          onClick={clearCanvas}
                          className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                        >
                          <Eraser className="w-4 h-4" />
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={saveCanvasAsImage}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                   */}

                  {signaturePreview && !drawMode && (
                    <div className="border-2 border-green-500 bg-green-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-green-700 mb-2">
                        ✓ Signature ready
                      </p>
                      <img
                        src={signaturePreview}
                        alt="Signature preview"
                        className="max-h-24 bg-white border-2 border-gray-300 rounded-lg p-2"
                      />
                    </div>
                  )}
                </div>

                {/* Controls */}
                {pdfFile && signaturePreview && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Page (1 - {totalPages})
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={pageNumber}
                        onChange={(e) => selectPage(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Width: {Math.round(signatureWidth)}px
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="400"
                        value={signatureWidth}
                        onChange={(e) => setSignatureWidth(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Height: {Math.round(signatureHeight)}px
                      </label>
                      <input
                        type="range"
                        min="30"
                        max="220"
                        value={signatureHeight}
                        onChange={(e) => setSignatureHeight(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !pdfFile || !signatureImage}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing...
                    </>
                  ) : (
                    <>
                      <PenTool className="w-5 h-5" />
                      Sign PDF
                    </>
                  )}
                </button>

                {success && (
                  <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                    <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-green-700">
                      Done! Download started.
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* RIGHT - PREVIEW */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Live Preview
                </h3>

                {/* zoom */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScale((s) => clamp(Number((s + 0.2).toFixed(2)), 0.5, 2.5))}
                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600 min-w-[50px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setScale((s) => clamp(Number((s - 0.2).toFixed(2)), 0.5, 2.5))}
                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {!pdfFile ? (
                <div className="flex items-center justify-center h-[60vh] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <div className="text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Upload a PDF to preview</p>
                  </div>
                </div>
              ) : (
                <div
                  className="relative border rounded-xl overflow-y-auto max-h-[85vh] bg-gray-100 p-4 space-y-6"
                  onMouseMove={handleSignatureDrag}
                  onMouseUp={handleSignatureDragEnd}
                  onMouseLeave={handleSignatureDragEnd}
                >
                  {/* Multi-page canvases */}
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <div
                      key={`page-${index}-${renderKey}`}
                      className={`relative flex justify-center cursor-pointer transition-all ${
                        pageNumber === index + 1 
                          ? "ring-4 ring-blue-500 rounded-xl p-2 bg-blue-50" 
                          : "hover:ring-2 hover:ring-gray-300 rounded-xl p-2"
                      }`}
                      onClick={() => selectPage(index + 1)}
                    >
                      {/* Page number indicator */}
                      <div className="absolute top-1 left-1 bg-gray-800 text-white text-xs px-2 py-1 rounded z-10">
                        Page {index + 1}
                      </div>

                      <div className="relative inline-block shadow-xl">
                        <canvas
                          ref={(el) => {
                            if (el) {
                              canvasRefs.current[index] = el;
                            }
                          }}
                          className="bg-white block"
                          style={{ display: 'block' }}
                        />

                        {/* Signature overlay only on selected page */}
                        {signaturePreview && pageNumber === index + 1 && (
                          <div
                            className="absolute cursor-move border-2 border-blue-500 shadow-xl bg-white/10 hover:border-blue-700"
                            style={{
                              left: `${xPosition}px`,
                              top: `${yPosition}px`,
                              width: `${signatureWidth}px`,
                              height: `${signatureHeight}px`,
                            }}
                            onMouseDown={handleSignatureDragStart}
                            title="Drag to move"
                          >
                            <img
                              src={signaturePreview}
                              alt="Signature"
                              className="w-full h-full object-contain bg-white/90 pointer-events-none"
                              draggable={false}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Loading hint */}
                  {!pdfDoc && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-gray-500">
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p>Loading preview...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3 text-center">
                💡 Tip: Click a page to select it, then drag signature on that page.
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
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Sign PDF Online Free – Add Your Signature Instantly
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to sign a PDF document? PDFLinx Sign PDF tool lets you add
            your signature online in seconds with live preview. Draw your signature or upload an
            image — no software installation required.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Draw or Upload
            </h3>
            <p className="text-gray-600 text-sm">
              Draw your signature with mouse or upload an image. Both work
              perfectly with live preview.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Drag & Drop
            </h3>
            <p className="text-gray-600 text-sm">
              Drag your signature to the perfect position with real-time preview.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Instant Download
            </h3>
            <p className="text-gray-600 text-sm">
              Get your signed PDF instantly. No watermarks, no registration.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Sign PDF in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload PDF</h4>
              <p className="text-gray-600 text-sm">
                Upload the PDF document you need to sign.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Add & Position</h4>
              <p className="text-gray-600 text-sm">
                Draw or upload signature, then drag it to position with live preview.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download</h4>
              <p className="text-gray-600 text-sm">
                Click Sign PDF and download your signed document.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          PDFLinx makes signing PDFs quick and easy with live preview — perfect for contracts,
          forms, and documents.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Sign PDF Online with Live Preview – Add Digital Signature by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Digital signatures are essential for modern document workflows.
          Whether you need to sign contracts, agreements, forms, or applications,
          <span className="font-medium text-slate-900">
            {" "}
            PDFLinx Sign PDF tool
          </span>{" "}
          makes it easy to add your signature to any PDF document online with live preview —
          without installing software or creating an account.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What is PDF Signing?
        </h3>
        <p className="leading-7 mb-6">
          PDF signing means adding your signature to a PDF document digitally.
          This can be done by drawing your signature, uploading an image of
          your handwritten signature, or using a scanned signature. The signed
          PDF can then be shared, printed, or stored electronically. Our tool provides
          live preview so you can see exactly where your signature will appear.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Use Live Preview for Signing?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>See exactly where your signature will appear</li>
          <li>Drag and drop signature to perfect position</li>
          <li>Adjust size in real-time before finalizing</li>
          <li>No guesswork or trial and error</li>
          <li>Professional-looking results every time</li>
          <li>Save time with visual positioning</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Sign a PDF Online with Live Preview
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your PDF document using the tool above</li>
          <li>
            Create your signature by drawing it or uploading an image (PNG/JPG)
          </li>
          <li>
            See live preview of your PDF with signature overlay
          </li>
          <li>
            Drag signature to exact position or use sliders for precise control
          </li>
          <li>Adjust signature size with real-time preview</li>
          <li>Click "Sign PDF" to finalize and download</li>
        </ol>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Sign PDF Tool
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>Free online PDF signing</li>
            <li>Live preview of signature position</li>
            <li>Drag and drop signature placement</li>
            <li>Draw signature with mouse/trackpad</li>
            <li>Upload signature image (PNG/JPG)</li>
            <li>Precise position sliders</li>
            <li>Adjustable signature size</li>
            <li>Multi-page PDF support</li>
            <li>Works on all devices</li>
            <li>No software installation needed</li>
            <li>No watermarks added</li>
            <li>Files deleted after processing</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use Sign PDF Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>
            <strong>Business professionals:</strong> Sign contracts and
            agreements with precise positioning
          </li>
          <li>
            <strong>Remote workers:</strong> Sign documents from home with live preview
          </li>
          <li>
            <strong>Freelancers:</strong> Sign client contracts professionally
          </li>
          <li>
            <strong>Students:</strong> Sign academic forms accurately
          </li>
          <li>
            <strong>Anyone:</strong> Sign any PDF document with visual control
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Common Use Cases
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Employment contracts and offer letters</li>
          <li>Rental agreements and lease documents</li>
          <li>Business proposals and quotes</li>
          <li>Non-disclosure agreements (NDAs)</li>
          <li>Permission forms and consent documents</li>
          <li>Tax forms and financial documents</li>
          <li>Legal contracts and agreements</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Sign PDF Secure?
        </h3>
        <p className="leading-7 mb-6">
          Yes. PDFLinx is built with privacy and security in mind. Your
          uploaded PDF files and signature images are processed automatically
          and deleted immediately after signing. We never store your documents
          or signatures permanently, and your files are never shared with
          anyone.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Sign PDFs on Any Device
        </h3>
        <p className="leading-7">
          PDFLinx works seamlessly on Windows, macOS, Linux, Android, and iOS.
          Sign your PDFs on desktop, laptop, tablet, or smartphone with live preview on any device —
          all you need is an internet connection and a modern web browser.
        </p>
      </section>

      {/* FAQs (UI) */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Is the Sign PDF tool free?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes. PDFLinx Sign PDF is completely free — no sign-up, no
                watermarks, no hidden costs.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I see where my signature will appear?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! Our live preview feature shows your PDF with the signature overlay
                in real-time. You can drag the signature to position it perfectly.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I draw my signature?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes. You can draw your signature using your mouse, trackpad, or
                touchscreen. You can also upload an image file (PNG/JPG).
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my files safe?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes. Files are processed automatically and deleted immediately
                after signing. We never store your PDFs or signatures.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I sign multiple pages?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes. Select the page number where you want to add your signature.
                For multiple signatures, process the PDF multiple times.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                How do I position my signature accurately?
              </summary>
              <p className="mt-2 text-gray-600">
                Simply drag the signature on the live preview to position it, or use
                the position sliders for precise pixel-level control. You'll see the
                changes in real-time.
              </p>
            </details>
          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="sign-pdf" />
    </>
  );
}






















// // app/sign-pdf/page.jsx
// "use client";

// import { useRef, useState, useEffect } from "react";
// import Script from "next/script";
// import {
//   Upload,
//   FileText,
//   Download,
//   CheckCircle,
//   X,
//   PenTool,
//   Eraser,
//   Image as ImageIcon,
//   ZoomIn,
//   ZoomOut,
// } from "lucide-react";

// export default function SignPdf() {
//   // ==================== STATE ====================
//   const [pdfFile, setPdfFile] = useState(null);

//   const [pdfDoc, setPdfDoc] = useState(null);
//   const [totalPages, setTotalPages] = useState(1);

//   const [signatureImage, setSignatureImage] = useState(null);
//   const [signaturePreview, setSignaturePreview] = useState("");

//   const [drawMode, setDrawMode] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");

//   // selected page for signature
//   const [pageNumber, setPageNumber] = useState(1);

//   // signature position & size (IN PREVIEW COORDS)
//   const [xPosition, setXPosition] = useState(50);
//   const [yPosition, setYPosition] = useState(50);
//   const [signatureWidth, setSignatureWidth] = useState(150);
//   const [signatureHeight, setSignatureHeight] = useState(75);

//   // preview zoom
//   const [scale, setScale] = useState(1);

//   // drag
//   const [isDragging, setIsDragging] = useState(false);
//   const dragStart = useRef({ x: 0, y: 0 });

//   // pdf.js readiness
//   const [pdfJsReady, setPdfJsReady] = useState(false);

//   // canvases
//   const canvasRefs = useRef([]); // one canvas per page
//   const [canvasesReady, setCanvasesReady] = useState(false);

//   // draw signature canvas (separate)
//   const signCanvasRef = useRef(null);
//   const isDrawing = useRef(false);

//   // ==================== HELPERS ====================
//   const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

//   const resetAllForNewPdf = () => {
//     setPdfDoc(null);
//     setTotalPages(1);
//     setPageNumber(1);
//     setScale(1);
//     canvasRefs.current = [];
//     setCanvasesReady(false);
//     setXPosition(50);
//     setYPosition(50);
//     setSuccess(false);
//     setError("");
//   };

//   const resetSignature = () => {
//     setSignatureImage(null);
//     setSignaturePreview("");
//     setDrawMode(false);
//   };

//   // ==================== PDF.JS SCRIPT ====================
//   // Use afterInteractive + onReady (reliable even with cache)
//   // Note: this component assumes you load from CDN (as you already do)
//   // If you want, you can remove onLoad elsewhere and keep only this.
//   // -------------------------------------------------------
//   // IMPORTANT: setPdfJsReady only when window.pdfjsLib exists
//   // -------------------------------------------------------
//   // eslint-disable-next-line react/jsx-no-undef
//   // (Script is imported from next/script)
//   // -------------------------------------------------------

//   // ==================== PDF FILE UPLOAD ====================
//   const handlePdfUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (file.type !== "application/pdf") {
//       setError("Please upload a valid PDF file.");
//       return;
//     }
//     setPdfFile(file);
//     resetAllForNewPdf();
//   };

//   // ==================== LOAD PDF DOC (wait for pdfjsLib) ====================
//   useEffect(() => {
//     if (!pdfFile) return;

//     let cancelled = false;
//     let tries = 0;

//     const load = async () => {
//       const lib = window?.pdfjsLib;

//       // wait/retry for pdfjsLib
//       if (!lib) {
//         if (tries++ < 60) return setTimeout(load, 50);
//         if (!cancelled) setError("PDF preview engine failed to load (pdf.js).");
//         return;
//       }

//       try {
//         setError("");
//         const buf = await pdfFile.arrayBuffer();
//         const doc = await lib.getDocument({ data: buf }).promise;

//         if (cancelled) return;

//         setPdfDoc(doc);
//         setTotalPages(doc.numPages);
//         setPageNumber(1);
//       } catch (err) {
//         console.error(err);
//         if (!cancelled) setError("Failed to load PDF for preview.");
//       }
//     };

//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, [pdfFile]);

//   // ==================== RESET CANVAS REFS WHEN PAGE COUNT CHANGES ====================
//   useEffect(() => {
//     canvasRefs.current = [];
//     setCanvasesReady(false);
//   }, [totalPages]);

//   // ==================== RENDER ALL PAGES (ONLY WHEN CANVASES READY) ====================
//   // useEffect(() => {
//   //   if (!pdfDoc || !canvasesReady) return;

//   //   let cancelled = false;

//   //   const renderAll = async () => {
//   //     try {
//   //       for (let i = 1; i <= totalPages; i++) {
//   //         if (cancelled) return;

//   //         const page = await pdfDoc.getPage(i);
//   //         const viewport = page.getViewport({ scale });

//   //         const canvas = canvasRefs.current[i - 1];
//   //         if (!canvas) continue;

//   //         const ctx = canvas.getContext("2d");
//   //         canvas.width = viewport.width;
//   //         canvas.height = viewport.height;

//   //         await page.render({ canvasContext: ctx, viewport }).promise;
//   //       }
//   //     } catch (e) {
//   //       console.error(e);
//   //       if (!cancelled) setError("Failed to render PDF preview.");
//   //     }
//   //   };

//   //   renderAll();

//   //   return () => {
//   //     cancelled = true;
//   //   };
//   // }, [pdfDoc, totalPages, canvasesReady, scale]);

//   useEffect(() => {
//   if (!pdfDoc) return;
  
//   // Pehle check karo k all canvases mounted hain
//   const allMounted = canvasRefs.current.length === totalPages && 
//                      canvasRefs.current.every(c => c !== null);
  
//   if (!allMounted) return;

//   let cancelled = false;

//   const renderAll = async () => {
//     try {
//       for (let i = 1; i <= totalPages; i++) {
//         if (cancelled) return;

//         const page = await pdfDoc.getPage(i);
//         const viewport = page.getViewport({ scale });

//         const canvas = canvasRefs.current[i - 1];
//         if (!canvas) continue;

//         const ctx = canvas.getContext("2d");
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;

//         await page.render({ canvasContext: ctx, viewport }).promise;
//       }
//     } catch (e) {
//       console.error(e);
//       if (!cancelled) setError("Failed to render PDF preview.");
//     }
//   };

//   renderAll();

//   return () => {
//     cancelled = true;
//   };
// }, [pdfDoc, totalPages, scale, canvasRefs.current.length]); // dependency update


//   // ==================== SIGNATURE: DRAW MODE ====================
//   const startDrawing = (e) => {
//     if (!drawMode) return;
//     const canvas = signCanvasRef.current;
//     if (!canvas) return;

//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const ctx = canvas.getContext("2d");
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     ctx.strokeStyle = "#000";
//     ctx.lineWidth = 2;
//     ctx.lineCap = "round";

//     isDrawing.current = true;
//   };

//   const draw = (e) => {
//     if (!drawMode || !isDrawing.current) return;
//     const canvas = signCanvasRef.current;
//     if (!canvas) return;

//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const ctx = canvas.getContext("2d");
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     isDrawing.current = false;
//   };

//   const clearCanvas = () => {
//     const canvas = signCanvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     resetSignature();
//   };

//   const saveCanvasAsImage = () => {
//     const canvas = signCanvasRef.current;
//     if (!canvas) return;

//     canvas.toBlob((blob) => {
//       if (!blob) return;
//       const file = new File([blob], "signature.png", { type: "image/png" });
//       setSignatureImage(file);
//       const url = URL.createObjectURL(blob);
//       setSignaturePreview(url);
//       setDrawMode(false);
//       setSuccess(false);
//       setError("");
//     }, "image/png");
//   };

//   const handleSignatureUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) {
//       setError("Please upload a valid image (PNG/JPG).");
//       return;
//     }
//     setSignatureImage(file);
//     setSignaturePreview(URL.createObjectURL(file));
//     setDrawMode(false);
//     setSuccess(false);
//     setError("");
//   };

//   // ==================== DRAG SIGNATURE (PAGE-BASED RECT) ====================
//   const handleSignatureDragStart = (e) => {
//     if (!signaturePreview) return;

//     // overlay's parent is page wrapper (relative container)
//     const pageWrapper = e.currentTarget.parentElement;
//     const rect = pageWrapper.getBoundingClientRect();

//     setIsDragging(true);
//     dragStart.current = {
//       x: e.clientX - rect.left - xPosition,
//       y: e.clientY - rect.top - yPosition,
//     };
//   };

//   const handleSignatureDrag = (e) => {
//     if (!isDragging) return;

//     const canvas = canvasRefs.current[pageNumber - 1];
//     if (!canvas) return;

//     const pageWrapper = canvas.parentElement;
//     if (!pageWrapper) return;

//     const rect = pageWrapper.getBoundingClientRect();

//     const newX = e.clientX - rect.left - dragStart.current.x;
//     const newY = e.clientY - rect.top - dragStart.current.y;

//     const maxX = rect.width - signatureWidth;
//     const maxY = rect.height - signatureHeight;

//     setXPosition(clamp(newX, 0, maxX));
//     setYPosition(clamp(newY, 0, maxY));
//   };

//   const handleSignatureDragEnd = () => {
//     setIsDragging(false);
//   };

//   // ==================== OPTIONAL: CLICK PAGE TO SELECT IT ====================
//   const selectPage = (i) => {
//     setPageNumber(i);
//     // keep signature in bounds for new page wrapper (best effort)
//     const canvas = canvasRefs.current[i - 1];
//     if (!canvas) return;
//     const rect = canvas.parentElement?.getBoundingClientRect();
//     if (!rect) return;
//     setXPosition((x) => clamp(x, 0, rect.width - signatureWidth));
//     setYPosition((y) => clamp(y, 0, rect.height - signatureHeight));
//   };

//   // ==================== SUBMIT (BACKEND SIGN) ====================
//   const downloadBlob = (blob, filename) => {
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!pdfFile) return setError("Please upload a PDF file!");
//     if (!signatureImage) return setError("Please provide a signature!");

//     setLoading(true);
//     setSuccess(false);
//     setError("");

//     try {
//       const formData = new FormData();
//       formData.append("pdfFile", pdfFile);
//       formData.append("signatureImage", signatureImage);
//       formData.append("pageNumber", String(pageNumber));
//       formData.append("xPosition", String(Math.round(xPosition)));
//       formData.append("yPosition", String(Math.round(yPosition)));
//       formData.append("width", String(Math.round(signatureWidth)));
//       formData.append("height", String(Math.round(signatureHeight)));
//       formData.append("scale", String(scale)); // optional: if backend needs it

//       const res = await fetch("/convert/sign-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         let msg = "Signing failed";
//         try {
//           const j = await res.json();
//           msg = j?.error || msg;
//         } catch {}
//         throw new Error(msg);
//       }

//       const blob = await res.blob();
//       downloadBlob(blob, pdfFile.name.replace(/\.pdf$/i, "") + "-signed.pdf");
//       setSuccess(true);
//     } catch (err) {
//       console.error(err);
//       setError((err?.message || "Something went wrong").toString());
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== UI ====================
//   return (
//     <>
//       <Script
//         src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
//         strategy="afterInteractive"
//         onReady={() => {
//           if (window?.pdfjsLib) {
//             window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//               "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//             setPdfJsReady(true);
//           }
//         }}
//       />

//       <main className="min-h-screen bg-gray-50 py-8 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-8">
//             {/* LEFT */}
//             <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Upload */}
//                 <div>
//                   <label className="block mb-2 text-sm font-medium text-gray-700">
//                     Upload PDF
//                   </label>
//                   <label className="block cursor-pointer">
//                     <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-blue-50 transition">
//                       <Upload className="w-10 h-10 mx-auto mb-2 text-blue-600" />
//                       <p className="font-semibold text-gray-800">
//                         {pdfFile ? pdfFile.name : "Click to upload PDF"}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">.pdf only</p>
//                     </div>
//                     <input
//                       type="file"
//                       accept=".pdf,application/pdf"
//                       onChange={handlePdfUpload}
//                       className="hidden"
//                     />
//                   </label>

//                   {pdfFile && (
//                     <div className="mt-3 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
//                       <div className="flex items-center gap-2">
//                         <FileText className="w-5 h-5 text-red-600" />
//                         <span className="text-sm font-medium">{pdfFile.name}</span>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setPdfFile(null);
//                           resetAllForNewPdf();
//                           resetSignature();
//                         }}
//                         className="text-red-500 hover:bg-red-100 p-1 rounded"
//                       >
//                         <X className="w-5 h-5" />
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Signature create */}
//                 <div>
//                   <label className="block mb-2 text-sm font-medium text-gray-700">
//                     Signature
//                   </label>

//                   <div className="grid grid-cols-2 gap-3 mb-4">
//                     <button
//                       type="button"
//                       onClick={() => setDrawMode(true)}
//                       className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition ${
//                         drawMode ? "border-blue-600 bg-blue-50" : "border-gray-300"
//                       }`}
//                     >
//                       <PenTool className="w-5 h-5 text-blue-600" />
//                       <span className="font-semibold text-sm">Draw</span>
//                     </button>

//                     <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-300 hover:border-purple-400 cursor-pointer transition">
//                       <ImageIcon className="w-5 h-5 text-purple-600" />
//                       <span className="font-semibold text-sm">Upload</span>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleSignatureUpload}
//                         className="hidden"
//                       />
//                     </label>
//                   </div>

//                   {drawMode && (
//                     <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
//                       <canvas
//                         ref={signCanvasRef}
//                         width={450}
//                         height={150}
//                         onMouseDown={startDrawing}
//                         onMouseMove={draw}
//                         onMouseUp={stopDrawing}
//                         onMouseLeave={stopDrawing}
//                         className="border-2 border-dashed border-gray-400 bg-white w-full rounded-lg cursor-crosshair"
//                       />
//                       <div className="flex gap-2 mt-3">
//                         <button
//                           type="button"
//                           onClick={clearCanvas}
//                           className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
//                         >
//                           <Eraser className="w-4 h-4" />
//                           Clear
//                         </button>
//                         <button
//                           type="button"
//                           onClick={saveCanvasAsImage}
//                           className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                         >
//                           <CheckCircle className="w-4 h-4" />
//                           Save
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {signaturePreview && !drawMode && (
//                     <div className="border-2 border-green-500 bg-green-50 rounded-xl p-4">
//                       <p className="text-sm font-medium text-green-700 mb-2">
//                         ✓ Signature ready
//                       </p>
//                       <img
//                         src={signaturePreview}
//                         alt="Signature preview"
//                         className="max-h-24 bg-white border-2 border-gray-300 rounded-lg p-2"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {/* Controls */}
//                 {pdfFile && signaturePreview && (
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">
//                         Page (1 - {totalPages})
//                       </label>
//                       <input
//                         type="number"
//                         min={1}
//                         max={totalPages}
//                         value={pageNumber}
//                         onChange={(e) => selectPage(parseInt(e.target.value) || 1)}
//                         className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">
//                         Width: {Math.round(signatureWidth)}px
//                       </label>
//                       <input
//                         type="range"
//                         min="50"
//                         max="400"
//                         value={signatureWidth}
//                         onChange={(e) => setSignatureWidth(parseInt(e.target.value))}
//                         className="w-full"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">
//                         Height: {Math.round(signatureHeight)}px
//                       </label>
//                       <input
//                         type="range"
//                         min="30"
//                         max="220"
//                         value={signatureHeight}
//                         onChange={(e) => setSignatureHeight(parseInt(e.target.value))}
//                         className="w-full"
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {error && (
//                   <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
//                     {error}
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={loading || !pdfFile || !signatureImage}
//                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Signing...
//                     </>
//                   ) : (
//                     <>
//                       <PenTool className="w-5 h-5" />
//                       Sign PDF
//                     </>
//                   )}
//                 </button>

//                 {success && (
//                   <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//                     <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
//                     <p className="font-semibold text-green-700">
//                       Done! Download started.
//                     </p>
//                   </div>
//                 )}
//               </form>
//             </div>

//             {/* RIGHT */}
//             <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Live Preview
//                 </h3>

//                 {/* zoom */}
//                 <div className="flex items-center gap-2">
//                   <button
//                     type="button"
//                     onClick={() => setScale((s) => clamp(Number((s + 0.2).toFixed(2)), 0.5, 2.5))}
//                     className="px-3 py-2 bg-gray-100 rounded-lg"
//                     title="Zoom In"
//                   >
//                     <ZoomIn className="w-5 h-5" />
//                   </button>
//                   <span className="text-sm text-gray-600">
//                     {Math.round(scale * 100)}%
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => setScale((s) => clamp(Number((s - 0.2).toFixed(2)), 0.5, 2.5))}
//                     className="px-3 py-2 bg-gray-100 rounded-lg"
//                     title="Zoom Out"
//                   >
//                     <ZoomOut className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {!pdfFile ? (
//                 <div className="flex items-center justify-center h-[60vh] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
//                   <div className="text-center text-gray-500">
//                     <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
//                     <p>Upload a PDF to preview</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div
//                   className="relative border rounded-xl overflow-y-auto max-h-[85vh] bg-gray-50 p-4"
//                   onMouseMove={handleSignatureDrag}
//                   onMouseUp={handleSignatureDragEnd}
//                   onMouseLeave={handleSignatureDragEnd}
//                 >
//                   {/* Multi-page canvases */}
//                   {Array.from({ length: totalPages }).map((_, index) => (
//                     <div
//                       key={index}
//                       className={`relative mb-8 flex justify-center ${
//                         pageNumber === index + 1 ? "ring-2 ring-blue-400 rounded-xl p-2" : ""
//                       }`}
//                       onClick={() => selectPage(index + 1)}
//                     >
//                       <div className="relative inline-block">

//                         {/* <canvas
//                           ref={(el) => {
//                             canvasRefs.current[index] = el;

//                             const readyCount = canvasRefs.current.filter(Boolean).length;
//                             if (readyCount === totalPages) setCanvasesReady(true);
//                           }}
//                           className="shadow-lg bg-white"
//                         /> */}

//                       <canvas
//                         ref={(el) => {
//                           if (el && !canvasRefs.current[index]) {
//                             canvasRefs.current[index] = el;
                            
//                             // Check if all canvases are now ready
//                             if (canvasRefs.current.filter(Boolean).length === totalPages) {
//                               setCanvasesReady(true);
//                             }
//                           }
//                         }}
//                         className="shadow-lg bg-white"
//                       />

//                         {/* Signature overlay only on selected page */}
//                         {signaturePreview && pageNumber === index + 1 && (
//                           <div
//                             className="absolute cursor-move border-2 border-blue-500 shadow-xl bg-white/10"
//                             style={{
//                               left: `${xPosition}px`,
//                               top: `${yPosition}px`,
//                               width: `${signatureWidth}px`,
//                               height: `${signatureHeight}px`,
//                             }}
//                             onMouseDown={handleSignatureDragStart}
//                             title="Drag to move"
//                           >
//                             <img
//                               src={signaturePreview}
//                               alt="Signature"
//                               className="w-full h-full object-contain bg-white/90 pointer-events-none"
//                               draggable={false}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}

//                   {/* basic loading hint */}
//                   {!pdfDoc && (
//                     <div className="absolute inset-0 flex items-center justify-center text-gray-500">
//                       Loading preview...
//                     </div>
//                   )}
//                 </div>
//               )}

//               <p className="text-xs text-gray-500 mt-3 text-center">
//                 Tip: Click a page to select it, then drag signature on that page.
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }





























// // // app/sign-pdf/page.jsx
// // "use client";

// // import { useRef, useState, useEffect } from "react";
// // import {
// //   Upload,
// //   FileText,
// //   Download,
// //   CheckCircle,
// //   X,
// //   PenTool,
// //   Eraser,
// //   Image as ImageIcon,
// //   ZoomIn,
// //   ZoomOut,
// // } from "lucide-react";
// // import Script from "next/script";
// // import RelatedToolsSection from "@/components/RelatedTools";

// // export default function SignPdf() {
// //   const [pdfFile, setPdfFile] = useState(null);
// //   const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");
// //   const [signatureImage, setSignatureImage] = useState(null);
// //   const [signaturePreview, setSignaturePreview] = useState("");
// //   const [drawMode, setDrawMode] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [success, setSuccess] = useState(false);
// //   const [error, setError] = useState("");

// //   // Signature position & size
// //   const [pageNumber, setPageNumber] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [xPosition, setXPosition] = useState(50);
// //   const [yPosition, setYPosition] = useState(650);
// //   const [signatureWidth, setSignatureWidth] = useState(150);
// //   const [signatureHeight, setSignatureHeight] = useState(75);

// //   // Preview & Drag
// //   const [isDragging, setIsDragging] = useState(false);
// //   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
// //   const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });

// //   const canvasRef = useRef(null);
// //   const isDrawing = useRef(false);
// //   const previewContainerRef = useRef(null);

// //   // ==================== PDF PREVIEW SETUP ====================
// //   useEffect(() => {
// //     if (pdfFile) {
// //       // Create object URL for PDF preview
// //       const url = URL.createObjectURL(pdfFile);
// //       setPdfPreviewUrl(url);

// //       // Load PDF to get page count
// //       loadPdfPageCount(pdfFile);

// //       return () => URL.revokeObjectURL(url);
// //     }
// //   }, [pdfFile]);

// //   const loadPdfPageCount = async (file) => {
// //     try {
// //       // Using pdf.js to load PDF and get page count
// //       const pdfjsLib = window.pdfjsLib;
// //       if (!pdfjsLib) {
// //         console.warn("PDF.js not loaded yet");
// //         return;
// //       }

// //       const arrayBuffer = await file.arrayBuffer();
// //       const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
// //       setTotalPages(pdf.numPages);

// //       // Load first page to get dimensions
// //       const page = await pdf.getPage(1);
// //       const viewport = page.getViewport({ scale: 1 });
// //       setPdfDimensions({ width: viewport.width, height: viewport.height });
// //     } catch (err) {
// //       console.error("Failed to load PDF:", err);
// //     }
// //   };

// //   // ==================== CANVAS DRAWING ====================
// //   const startDrawing = (e) => {
// //     if (!drawMode) return;
// //     const canvas = canvasRef.current;
// //     const rect = canvas.getBoundingClientRect();
// //     const x = e.clientX - rect.left;
// //     const y = e.clientY - rect.top;

// //     const ctx = canvas.getContext("2d");
// //     ctx.beginPath();
// //     ctx.moveTo(x, y);
// //     isDrawing.current = true;
// //   };

// //   const draw = (e) => {
// //     if (!drawMode || !isDrawing.current) return;
// //     const canvas = canvasRef.current;
// //     const rect = canvas.getBoundingClientRect();
// //     const x = e.clientX - rect.left;
// //     const y = e.clientY - rect.top;

// //     const ctx = canvas.getContext("2d");
// //     ctx.lineTo(x, y);
// //     ctx.strokeStyle = "#000";
// //     ctx.lineWidth = 2;
// //     ctx.lineCap = "round";
// //     ctx.stroke();
// //   };

// //   const stopDrawing = () => {
// //     isDrawing.current = false;
// //   };

// //   const clearCanvas = () => {
// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext("2d");
// //     ctx.clearRect(0, 0, canvas.width, canvas.height);
// //     setSignatureImage(null);
// //     setSignaturePreview("");
// //   };

// //   const saveCanvasAsImage = () => {
// //     const canvas = canvasRef.current;
// //     canvas.toBlob((blob) => {
// //       const file = new File([blob], "signature.png", { type: "image/png" });
// //       setSignatureImage(file);
// //       setSignaturePreview(URL.createObjectURL(blob));
// //       setDrawMode(false);
// //     });
// //   };

// //   // ==================== DRAG SIGNATURE ====================
// //   const handleSignatureDragStart = (e) => {
// //     if (!signatureImage) return;
// //     setIsDragging(true);
// //     const rect = previewContainerRef.current.getBoundingClientRect();
// //     setDragStart({
// //       x: e.clientX - rect.left - xPosition,
// //       y: e.clientY - rect.top - yPosition,
// //     });
// //   };

// //   const handleSignatureDrag = (e) => {
// //     if (!isDragging) return;
// //     const rect = previewContainerRef.current.getBoundingClientRect();
// //     const newX = e.clientX - rect.left - dragStart.x;
// //     const newY = e.clientY - rect.top - dragStart.y;

// //     // Constrain within bounds
// //     const maxX = rect.width - signatureWidth;
// //     const maxY = rect.height - signatureHeight;

// //     setXPosition(Math.max(0, Math.min(newX, maxX)));
// //     setYPosition(Math.max(0, Math.min(newY, maxY)));
// //   };

// //   const handleSignatureDragEnd = () => {
// //     setIsDragging(false);
// //   };

// //   // ==================== FILE HANDLERS ====================
// //   const handlePdfUpload = (e) => {
// //     const file = e.target.files?.[0];
// //     if (file) {
// //       setPdfFile(file);
// //       setSuccess(false);
// //       setError("");
// //       setPageNumber(1);
// //     }
// //   };

// //   const handleSignatureUpload = (e) => {
// //     const file = e.target.files?.[0];
// //     if (file) {
// //       setSignatureImage(file);
// //       setSignaturePreview(URL.createObjectURL(file));
// //       setDrawMode(false);
// //       setSuccess(false);
// //       setError("");
// //     }
// //   };

// //   const downloadBlob = (blob, filename) => {
// //     const url = window.URL.createObjectURL(blob);
// //     const a = document.createElement("a");
// //     a.href = url;
// //     a.download = filename;
// //     a.click();
// //     window.URL.revokeObjectURL(url);
// //   };

// //   // ==================== SUBMIT ====================
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!pdfFile) {
// //       setError("Please upload a PDF file!");
// //       return;
// //     }

// //     if (!signatureImage) {
// //       setError("Please provide a signature (draw or upload image)!");
// //       return;
// //     }

// //     setLoading(true);
// //     setSuccess(false);
// //     setError("");

// //     const formData = new FormData();
// //     formData.append("pdfFile", pdfFile);
// //     formData.append("signatureImage", signatureImage);
// //     formData.append("pageNumber", String(pageNumber));
// //     formData.append("xPosition", String(Math.round(xPosition)));
// //     formData.append("yPosition", String(Math.round(yPosition)));
// //     formData.append("width", String(Math.round(signatureWidth)));
// //     formData.append("height", String(Math.round(signatureHeight)));

// //     try {
// //       const res = await fetch("/convert/sign-pdf", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       if (!res.ok) {
// //         let msg = "Signing failed";
// //         try {
// //           const j = await res.json();
// //           msg = j?.error || msg;
// //         } catch {}
// //         throw new Error(msg);
// //       }

// //       const blob = await res.blob();
// //       const outName = pdfFile.name.replace(/\.pdf$/i, "") + "-signed.pdf";
// //       downloadBlob(blob, outName);
// //       setSuccess(true);
// //     } catch (err) {
// //       const msg = (
// //         err?.message || "Something went wrong. Please try again."
// //       ).toString();
// //       setError(msg);
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <>
// //       {/* Load PDF.js from CDN */}
// //       <Script
// //         src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
// //         strategy="beforeInteractive"
// //         onLoad={() => {
// //           window.pdfjsLib.GlobalWorkerOptions.workerSrc =
// //             "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
// //         }}
// //       />

// //       {/* ==================== SEO SCHEMAS ==================== */}
// //       <Script
// //         id="howto-schema-sign"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify(
// //             {
// //               "@context": "https://schema.org",
// //               "@type": "HowTo",
// //               name: "How to Sign PDF Online for Free",
// //               description:
// //                 "Add your signature to PDF documents online. Draw your signature or upload an image and place it anywhere on your PDF.",
// //               url: "https://pdflinx.com/sign-pdf",
// //               step: [
// //                 {
// //                   "@type": "HowToStep",
// //                   name: "Upload PDF",
// //                   text: "Upload the PDF file you want to sign.",
// //                 },
// //                 {
// //                   "@type": "HowToStep",
// //                   name: "Create signature",
// //                   text: "Draw your signature or upload a signature image.",
// //                 },
// //                 {
// //                   "@type": "HowToStep",
// //                   name: "Position & download",
// //                   text: "Drag signature to position, adjust size, then download signed PDF.",
// //                 },
// //               ],
// //               totalTime: "PT30S",
// //               estimatedCost: {
// //                 "@type": "MonetaryAmount",
// //                 value: "0",
// //                 currency: "USD",
// //               },
// //               image: "https://pdflinx.com/og-image.png",
// //             },
// //             null,
// //             2
// //           ),
// //         }}
// //       />

// //       <Script
// //         id="breadcrumb-schema-sign"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify(
// //             {
// //               "@context": "https://schema.org",
// //               "@type": "BreadcrumbList",
// //               itemListElement: [
// //                 {
// //                   "@type": "ListItem",
// //                   position: 1,
// //                   name: "Home",
// //                   item: "https://pdflinx.com",
// //                 },
// //                 {
// //                   "@type": "ListItem",
// //                   position: 2,
// //                   name: "Sign PDF",
// //                   item: "https://pdflinx.com/sign-pdf",
// //                 },
// //               ],
// //             },
// //             null,
// //             2
// //           ),
// //         }}
// //       />

// //       <Script
// //         id="faq-schema-sign"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify(
// //             {
// //               "@context": "https://schema.org",
// //               "@type": "FAQPage",
// //               mainEntity: [
// //                 {
// //                   "@type": "Question",
// //                   name: "Is PDFLinx Sign PDF free?",
// //                   acceptedAnswer: {
// //                     "@type": "Answer",
// //                     text: "Yes. PDFLinx Sign PDF is completely free — no sign-up required, no watermarks added.",
// //                   },
// //                 },
// //                 {
// //                   "@type": "Question",
// //                   name: "Can I draw my signature?",
// //                   acceptedAnswer: {
// //                     "@type": "Answer",
// //                     text: "Yes. You can draw your signature using your mouse, trackpad, or touchscreen. You can also upload an image of your signature.",
// //                   },
// //                 },
// //                 {
// //                   "@type": "Question",
// //                   name: "Is my PDF secure?",
// //                   acceptedAnswer: {
// //                     "@type": "Answer",
// //                     text: "Yes. Your files are processed automatically and deleted immediately after signing. We never store your PDFs or signatures.",
// //                   },
// //                 },
// //                 {
// //                   "@type": "Question",
// //                   name: "Can I sign multiple pages?",
// //                   acceptedAnswer: {
// //                     "@type": "Answer",
// //                     text: "Currently, you can add one signature to one page. For multi-page signing, process the PDF multiple times.",
// //                   },
// //                 },
// //                 {
// //                   "@type": "Question",
// //                   name: "What image formats are supported?",
// //                   acceptedAnswer: {
// //                     "@type": "Answer",
// //                     text: "You can upload PNG or JPG images as your signature. Transparent PNG images work best.",
// //                   },
// //                 },
// //               ],
// //             },
// //             null,
// //             2
// //           ),
// //         }}
// //       />

// //       {/* ==================== MAIN TOOL SECTION ==================== */}
// //       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
// //         <div className="max-w-7xl mx-auto">
// //           {/* Header */}
// //           <div className="text-center mb-8">
// //             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
// //               Sign PDF Online Free
// //             </h1>
// //             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// //               Add your signature to PDF documents in seconds. Draw or upload
// //               your signature and drag it to the perfect position with live preview.
// //             </p>
// //           </div>

// //           <div className="grid lg:grid-cols-2 gap-8">
// //             {/* LEFT SIDE - Controls */}
// //             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-fit">
// //               <form onSubmit={handleSubmit} className="space-y-6">
// //                 {/* PDF Upload */}
// //                 <div>
// //                   <label className="block mb-2 text-sm font-medium text-gray-700">
// //                     1. Upload PDF Document
// //                   </label>
// //                   <div className="relative">
// //                     <label className="block">
// //                       <div
// //                         className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
// //                           pdfFile
// //                             ? "border-green-500 bg-green-50"
// //                             : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
// //                         }`}
// //                       >
// //                         <Upload className="w-10 h-10 mx-auto mb-2 text-blue-600" />
// //                         <p className="text-base font-semibold text-gray-700">
// //                           {pdfFile
// //                             ? pdfFile.name
// //                             : "Click to upload PDF"}
// //                         </p>
// //                         <p className="text-sm text-gray-500 mt-1">
// //                           Max 25MB • .pdf only
// //                         </p>
// //                       </div>
// //                       <input
// //                         type="file"
// //                         accept=".pdf,application/pdf"
// //                         onChange={handlePdfUpload}
// //                         className="hidden"
// //                         required
// //                       />
// //                     </label>
// //                   </div>

// //                   {pdfFile && (
// //                     <div className="mt-3 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
// //                       <div className="flex items-center gap-2">
// //                         <FileText className="w-5 h-5 text-red-600" />
// //                         <span className="text-sm font-medium">
// //                           {pdfFile.name}
// //                         </span>
// //                         <span className="text-xs text-gray-500">
// //                           ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
// //                         </span>
// //                       </div>
// //                       <button
// //                         type="button"
// //                         onClick={() => {
// //                           setPdfFile(null);
// //                           setPdfPreviewUrl("");
// //                         }}
// //                         className="text-red-500 hover:bg-red-100 p-1 rounded"
// //                       >
// //                         <X className="w-5 h-5" />
// //                       </button>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Signature Creation */}
// //                 <div>
// //                   <label className="block mb-2 text-sm font-medium text-gray-700">
// //                     2. Create or Upload Signature
// //                   </label>

// //                   <div className="grid grid-cols-2 gap-3 mb-4">
// //                     <button
// //                       type="button"
// //                       onClick={() => setDrawMode(true)}
// //                       className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
// //                         drawMode
// //                           ? "border-blue-600 bg-blue-50 shadow-md"
// //                           : "border-gray-300 hover:border-blue-400"
// //                       }`}
// //                     >
// //                       <PenTool className="w-5 h-5 text-blue-600" />
// //                       <span className="font-semibold text-sm">Draw</span>
// //                     </button>

// //                     <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-300 hover:border-purple-400 cursor-pointer transition-all">
// //                       <ImageIcon className="w-5 h-5 text-purple-600" />
// //                       <span className="font-semibold text-sm">Upload</span>
// //                       <input
// //                         type="file"
// //                         accept="image/*"
// //                         onChange={handleSignatureUpload}
// //                         className="hidden"
// //                       />
// //                     </label>
// //                   </div>

// //                   {/* Drawing Canvas */}
// //                   {drawMode && (
// //                     <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
// //                       <canvas
// //                         ref={canvasRef}
// //                         width={450}
// //                         height={150}
// //                         onMouseDown={startDrawing}
// //                         onMouseMove={draw}
// //                         onMouseUp={stopDrawing}
// //                         onMouseLeave={stopDrawing}
// //                         className="border-2 border-dashed border-gray-400 bg-white cursor-crosshair w-full rounded-lg"
// //                       />
// //                       <div className="flex gap-2 mt-3">
// //                         <button
// //                           type="button"
// //                           onClick={clearCanvas}
// //                           className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
// //                         >
// //                           <Eraser className="w-4 h-4" />
// //                           Clear
// //                         </button>
// //                         <button
// //                           type="button"
// //                           onClick={saveCanvasAsImage}
// //                           className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
// //                         >
// //                           <CheckCircle className="w-4 h-4" />
// //                           Save
// //                         </button>
// //                       </div>
// //                     </div>
// //                   )}

// //                   {/* Signature Preview */}
// //                   {signaturePreview && !drawMode && (
// //                     <div className="border-2 border-green-500 bg-green-50 rounded-xl p-4">
// //                       <p className="text-sm font-medium text-green-700 mb-2">
// //                         ✓ Signature ready
// //                       </p>
// //                       <img
// //                         src={signaturePreview}
// //                         alt="Signature preview"
// //                         className="max-h-24 bg-white border-2 border-gray-300 rounded-lg p-2"
// //                       />
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Position Controls */}
// //                 {pdfFile && signatureImage && (
// //                   <div>
// //                     <label className="block mb-3 text-sm font-medium text-gray-700">
// //                       3. Adjust Position & Size
// //                     </label>

// //                     <div className="space-y-3">
// //                       {/* Page Number */}
// //                       <div>
// //                         <label className="block text-xs text-gray-600 mb-1">
// //                           Page Number (Total: {totalPages})
// //                         </label>
// //                         <input
// //                           type="number"
// //                           min="1"
// //                           max={totalPages}
// //                           value={pageNumber}
// //                           onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
// //                           className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// //                         />
// //                       </div>

// //                       {/* X Position */}
// //                       <div>
// //                         <label className="block text-xs text-gray-600 mb-1">
// //                           X Position: {Math.round(xPosition)}px
// //                         </label>
// //                         <input
// //                           type="range"
// //                           min="0"
// //                           max="500"
// //                           value={xPosition}
// //                           onChange={(e) => setXPosition(parseInt(e.target.value))}
// //                           className="w-full"
// //                         />
// //                       </div>

// //                       {/* Y Position */}
// //                       <div>
// //                         <label className="block text-xs text-gray-600 mb-1">
// //                           Y Position: {Math.round(yPosition)}px
// //                         </label>
// //                         <input
// //                           type="range"
// //                           min="0"
// //                           max="800"
// //                           value={yPosition}
// //                           onChange={(e) => setYPosition(parseInt(e.target.value))}
// //                           className="w-full"
// //                         />
// //                       </div>

// //                       {/* Width */}
// //                       <div>
// //                         <label className="block text-xs text-gray-600 mb-1">
// //                           Width: {Math.round(signatureWidth)}px
// //                         </label>
// //                         <input
// //                           type="range"
// //                           min="50"
// //                           max="300"
// //                           value={signatureWidth}
// //                           onChange={(e) =>
// //                             setSignatureWidth(parseInt(e.target.value))
// //                           }
// //                           className="w-full"
// //                         />
// //                       </div>

// //                       {/* Height */}
// //                       <div>
// //                         <label className="block text-xs text-gray-600 mb-1">
// //                           Height: {Math.round(signatureHeight)}px
// //                         </label>
// //                         <input
// //                           type="range"
// //                           min="30"
// //                           max="150"
// //                           value={signatureHeight}
// //                           onChange={(e) =>
// //                             setSignatureHeight(parseInt(e.target.value))
// //                           }
// //                           className="w-full"
// //                         />
// //                       </div>
// //                     </div>

// //                     <p className="text-xs text-blue-600 mt-3 bg-blue-50 p-2 rounded">
// //                       💡 Tip: You can also drag the signature directly on the preview!
// //                     </p>
// //                   </div>
// //                 )}

// //                 {/* Error */}
// //                 {error && (
// //                   <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
// //                     <p className="font-semibold text-sm">{error}</p>
// //                   </div>
// //                 )}

// //                 {/* Submit Button */}
// //                 <button
// //                   type="submit"
// //                   disabled={loading || !pdfFile || !signatureImage}
// //                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
// //                 >
// //                   {loading ? (
// //                     <>
// //                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// //                       Signing PDF...
// //                     </>
// //                   ) : (
// //                     <>
// //                       <PenTool className="w-5 h-5" />
// //                       Sign PDF
// //                     </>
// //                   )}
// //                 </button>
// //               </form>

// //               {/* Success */}
// //               {success && (
// //                 <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
// //                   <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
// //                   <p className="text-xl font-bold text-green-700 mb-2">
// //                     Done! Your signed PDF is ready
// //                   </p>
// //                   <p className="text-sm text-green-700">
// //                     Download started automatically.
// //                   </p>
// //                 </div>
// //               )}
// //             </div>

// //             {/* RIGHT SIDE - Live Preview */}
// //             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
// //               <h3 className="text-lg font-semibold mb-4 text-gray-800">
// //                 Live Preview
// //               </h3>

// //               {!pdfFile ? (
// //                 <div className="flex items-center justify-center h-[600px] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
// //                   <div className="text-center text-gray-500">
// //                     <FileText className="w-16 h-16 mx-auto mb-3 text-gray-400" />
// //                     <p className="font-medium">Upload a PDF to see preview</p>
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <div
// //                   ref={previewContainerRef}
// //                   className="relative border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-100"
// //                   style={{ height: "600px" }}
// //                   onMouseMove={handleSignatureDrag}
// //                   onMouseUp={handleSignatureDragEnd}
// //                   onMouseLeave={handleSignatureDragEnd}
// //                 >
// //                   {/* PDF Preview using iframe */}
// //                   <iframe
// //                     src={`${pdfPreviewUrl}#page=${pageNumber}`}
// //                     className="w-full h-full"
// //                     title="PDF Preview"
// //                   />

// //                   {/* Signature Overlay */}
// //                   {signaturePreview && (
// //                     <div
// //                       className="absolute cursor-move border-2 border-blue-500 shadow-lg"
// //                       style={{
// //                         left: `${xPosition}px`,
// //                         top: `${yPosition}px`,
// //                         width: `${signatureWidth}px`,
// //                         height: `${signatureHeight}px`,
// //                       }}
// //                       onMouseDown={handleSignatureDragStart}
// //                     >
// //                       <img
// //                         src={signaturePreview}
// //                         alt="Signature"
// //                         className="w-full h-full object-contain bg-white/90 pointer-events-none"
// //                         draggable={false}
// //                       />
// //                       {/* Corner resize indicator */}
// //                       <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize" />
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               <p className="text-xs text-gray-500 mt-3 text-center">
// //                 Preview shows approximate signature position. Drag signature to adjust.
// //               </p>
// //             </div>
// //           </div>

// //           <p className="text-center mt-6 text-gray-600 text-base">
// //             No account • No watermark • Files auto-deleted • 100% free
// //           </p>
// //         </div>
// //       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
//             Sign PDF Online Free – Add Your Signature Instantly
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Need to sign a PDF document? PDFLinx Sign PDF tool lets you add
//             your signature online in seconds with live preview. Draw your signature or upload an
//             image — no software installation required.
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <PenTool className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">
//               Draw or Upload
//             </h3>
//             <p className="text-gray-600 text-sm">
//               Draw your signature with mouse or upload an image. Both work
//               perfectly with live preview.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FileText className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">
//               Drag & Drop
//             </h3>
//             <p className="text-gray-600 text-sm">
//               Drag your signature to the perfect position with real-time preview.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">
//               Instant Download
//             </h3>
//             <p className="text-gray-600 text-sm">
//               Get your signed PDF instantly. No watermarks, no registration.
//             </p>
//           </div>
//         </div>

//         {/* Steps */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Sign PDF in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload PDF</h4>
//               <p className="text-gray-600 text-sm">
//                 Upload the PDF document you need to sign.
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Add & Position</h4>
//               <p className="text-gray-600 text-sm">
//                 Draw or upload signature, then drag it to position with live preview.
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download</h4>
//               <p className="text-gray-600 text-sm">
//                 Click Sign PDF and download your signed document.
//               </p>
//             </div>
//           </div>
//         </div>

//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           PDFLinx makes signing PDFs quick and easy with live preview — perfect for contracts,
//           forms, and documents.
//         </p>
//       </section>

//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//           Sign PDF Online with Live Preview – Add Digital Signature by PDFLinx
//         </h2>

//         <p className="text-base leading-7 mb-6">
//           Digital signatures are essential for modern document workflows.
//           Whether you need to sign contracts, agreements, forms, or applications,
//           <span className="font-medium text-slate-900">
//             {" "}
//             PDFLinx Sign PDF tool
//           </span>{" "}
//           makes it easy to add your signature to any PDF document online with live preview —
//           without installing software or creating an account.
//         </p>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           What is PDF Signing?
//         </h3>
//         <p className="leading-7 mb-6">
//           PDF signing means adding your signature to a PDF document digitally.
//           This can be done by drawing your signature, uploading an image of
//           your handwritten signature, or using a scanned signature. The signed
//           PDF can then be shared, printed, or stored electronically. Our tool provides
//           live preview so you can see exactly where your signature will appear.
//         </p>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Why Use Live Preview for Signing?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li>See exactly where your signature will appear</li>
//           <li>Drag and drop signature to perfect position</li>
//           <li>Adjust size in real-time before finalizing</li>
//           <li>No guesswork or trial and error</li>
//           <li>Professional-looking results every time</li>
//           <li>Save time with visual positioning</li>
//         </ul>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           How to Sign a PDF Online with Live Preview
//         </h3>
//         <ol className="space-y-2 mb-6 list-decimal pl-6">
//           <li>Upload your PDF document using the tool above</li>
//           <li>
//             Create your signature by drawing it or uploading an image (PNG/JPG)
//           </li>
//           <li>
//             See live preview of your PDF with signature overlay
//           </li>
//           <li>
//             Drag signature to exact position or use sliders for precise control
//           </li>
//           <li>Adjust signature size with real-time preview</li>
//           <li>Click "Sign PDF" to finalize and download</li>
//         </ol>

//         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
//           <h3 className="text-xl font-semibold text-slate-900 mb-4">
//             Features of PDFLinx Sign PDF Tool
//           </h3>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
//             <li>Free online PDF signing</li>
//             <li>Live preview of signature position</li>
//             <li>Drag and drop signature placement</li>
//             <li>Draw signature with mouse/trackpad</li>
//             <li>Upload signature image (PNG/JPG)</li>
//             <li>Precise position sliders</li>
//             <li>Adjustable signature size</li>
//             <li>Multi-page PDF support</li>
//             <li>Works on all devices</li>
//             <li>No software installation needed</li>
//             <li>No watermarks added</li>
//             <li>Files deleted after processing</li>
//           </ul>
//         </div>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Who Should Use Sign PDF Tool?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li>
//             <strong>Business professionals:</strong> Sign contracts and
//             agreements with precise positioning
//           </li>
//           <li>
//             <strong>Remote workers:</strong> Sign documents from home with live preview
//           </li>
//           <li>
//             <strong>Freelancers:</strong> Sign client contracts professionally
//           </li>
//           <li>
//             <strong>Students:</strong> Sign academic forms accurately
//           </li>
//           <li>
//             <strong>Anyone:</strong> Sign any PDF document with visual control
//           </li>
//         </ul>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Common Use Cases
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li>Employment contracts and offer letters</li>
//           <li>Rental agreements and lease documents</li>
//           <li>Business proposals and quotes</li>
//           <li>Non-disclosure agreements (NDAs)</li>
//           <li>Permission forms and consent documents</li>
//           <li>Tax forms and financial documents</li>
//           <li>Legal contracts and agreements</li>
//         </ul>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Is PDFLinx Sign PDF Secure?
//         </h3>
//         <p className="leading-7 mb-6">
//           Yes. PDFLinx is built with privacy and security in mind. Your
//           uploaded PDF files and signature images are processed automatically
//           and deleted immediately after signing. We never store your documents
//           or signatures permanently, and your files are never shared with
//           anyone.
//         </p>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Sign PDFs on Any Device
//         </h3>
//         <p className="leading-7">
//           PDFLinx works seamlessly on Windows, macOS, Linux, Android, and iOS.
//           Sign your PDFs on desktop, laptop, tablet, or smartphone with live preview on any device —
//           all you need is an internet connection and a modern web browser.
//         </p>
//       </section>

//       {/* FAQs (UI) */}
//       <section className="py-16">
//         <div className="max-w-4xl mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-10">
//             Frequently Asked Questions
//           </h2>

//           <div className="space-y-4">
//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Is the Sign PDF tool free?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes. PDFLinx Sign PDF is completely free — no sign-up, no
//                 watermarks, no hidden costs.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I see where my signature will appear?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! Our live preview feature shows your PDF with the signature overlay
//                 in real-time. You can drag the signature to position it perfectly.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I draw my signature?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes. You can draw your signature using your mouse, trackpad, or
//                 touchscreen. You can also upload an image file (PNG/JPG).
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Are my files safe?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes. Files are processed automatically and deleted immediately
//                 after signing. We never store your PDFs or signatures.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I sign multiple pages?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes. Select the page number where you want to add your signature.
//                 For multiple signatures, process the PDF multiple times.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 How do I position my signature accurately?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Simply drag the signature on the live preview to position it, or use
//                 the position sliders for precise pixel-level control. You'll see the
//                 changes in real-time.
//               </p>
//             </details>
//           </div>
//         </div>
//       </section>

//       <RelatedToolsSection currentPage="sign-pdf" />
//     </>
//   );
// }




















// // // // app/sign-pdf/page.jsx
// // // "use client";

// // // import { useRef, useState, useEffect } from "react";
// // // import {
// // //   Upload,
// // //   FileText,
// // //   Download,
// // //   CheckCircle,
// // //   X,
// // //   PenTool,
// // //   Eraser,
// // //   Image as ImageIcon,
// // // } from "lucide-react";
// // // import Script from "next/script";
// // // import RelatedToolsSection from "@/components/RelatedTools";

// // // // No static import of pdfjs-dist here (to avoid SSR error)

// // // export default function SignPdf() {
// // //   const [pdfFile, setPdfFile] = useState(null);
// // //   const [signatureImage, setSignatureImage] = useState(null);
// // //   const [signaturePreview, setSignaturePreview] = useState("");
// // //   const [drawMode, setDrawMode] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const [success, setSuccess] = useState(false);
// // //   const [error, setError] = useState("");

// // //   // Position & size
// // //   const [pageNumber, setPageNumber] = useState(1);
// // //   const [xPosition, setXPosition] = useState(50);
// // //   const [yPosition, setYPosition] = useState(650);
// // //   const [signatureWidth, setSignatureWidth] = useState(150);
// // //   const [signatureHeight, setSignatureHeight] = useState(75);

// // //   // PDF preview states
// // //   const [pdfDoc, setPdfDoc] = useState(null);
// // //   const [currentPagePreview, setCurrentPagePreview] = useState(null);
// // //   const [pdfjsLib, setPdfjsLib] = useState(null);
// // //   const [pdfLoaded, setPdfLoaded] = useState(false);

// // //   const canvasRef = useRef(null);       // Signature drawing canvas
// // //   const pdfCanvasRef = useRef(null);    // PDF render canvas

// // //   const isDrawing = useRef(false);

// // //   // Dynamic load pdfjs (only on client)
// // //   useEffect(() => {
// // //     if (pdfLoaded) return;

// // //     console.log("Starting pdfjs dynamic import...");
// // //     import('pdfjs-dist')
// // //       .then((module) => {
// // //         console.log("pdfjs loaded successfully");
// // //         const pdfjs = module;
// // //         pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
// // //         console.log("WorkerSrc set:", pdfjs.GlobalWorkerOptions.workerSrc);
// // //         setPdfjsLib(pdfjs);
// // //         setPdfLoaded(true);
// // //       })
// // //       .catch((err) => {
// // //         console.error("pdfjs dynamic import FAILED:", err);
// // //         setError("PDF preview library load failed. Check console.");
// // //       });
// // //   }, [pdfLoaded]);

// // //   // ==================== DRAWING ====================
// // //   const startDrawing = (e) => {
// // //     if (!drawMode) return;
// // //     const canvas = canvasRef.current;
// // //     if (!canvas) return;
// // //     const rect = canvas.getBoundingClientRect();
// // //     const x = e.clientX - rect.left;
// // //     const y = e.clientY - rect.top;

// // //     const ctx = canvas.getContext("2d");
// // //     ctx.beginPath();
// // //     ctx.moveTo(x, y);
// // //     isDrawing.current = true;
// // //   };

// // //   const draw = (e) => {
// // //     if (!drawMode || !isDrawing.current) return;
// // //     const canvas = canvasRef.current;
// // //     if (!canvas) return;
// // //     const rect = canvas.getBoundingClientRect();
// // //     const x = e.clientX - rect.left;
// // //     const y = e.clientY - rect.top;

// // //     const ctx = canvas.getContext("2d");
// // //     ctx.lineTo(x, y);
// // //     ctx.strokeStyle = "#000";
// // //     ctx.lineWidth = 2;
// // //     ctx.lineCap = "round";
// // //     ctx.stroke();
// // //   };

// // //   const stopDrawing = () => {
// // //     isDrawing.current = false;
// // //   };

// // //   const clearCanvas = () => {
// // //     const canvas = canvasRef.current;
// // //     if (!canvas) return;
// // //     const ctx = canvas.getContext("2d");
// // //     ctx.clearRect(0, 0, canvas.width, canvas.height);
// // //     setSignatureImage(null);
// // //     setSignaturePreview("");
// // //   };

// // //   const saveCanvasAsImage = () => {
// // //     const canvas = canvasRef.current;
// // //     if (!canvas) return;
// // //     canvas.toBlob((blob) => {
// // //       if (!blob) return;
// // //       const file = new File([blob], "signature.png", { type: "image/png" });
// // //       setSignatureImage(file);
// // //       setSignaturePreview(URL.createObjectURL(blob));
// // //       setDrawMode(false);
// // //     }, 'image/png');
// // //   };

// // //   // ==================== PDF PREVIEW ====================
// // //   const loadPdfPreview = async (file) => {
// // //     if (!file) return;

// // //     if (!pdfLoaded || !pdfjsLib) {
// // //       setError("PDF library abhi load ho rahi hai...");
// // //       console.log("PDF library not ready yet");
// // //       return;
// // //     }

// // //     try {
// // //       console.log("Loading PDF preview...");
// // //       const arrayBuffer = await file.arrayBuffer();
// // //       const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
// // //       const pdf = await loadingTask.promise;
// // //       console.log("PDF loaded with", pdf.numPages, "pages");

// // //       setPdfDoc(pdf);
// // //       await renderPagePreview(pdf, pageNumber);
// // //     } catch (err) {
// // //       console.error("PDF load failed:", err);
// // //       setError("PDF preview load failed: " + err.message);
// // //     }
// // //   };

// // //   const renderPagePreview = async (pdf, pgNum) => {
// // //     if (!pdf || !pdfCanvasRef.current) {
// // //       console.log("Render failed: pdf or canvas missing");
// // //       return;
// // //     }

// // //     try {
// // //       console.log("Rendering page", pgNum);
// // //       const page = await pdf.getPage(pgNum);
// // //       const scale = 1.2;
// // //       const viewport = page.getViewport({ scale });

// // //       const canvas = pdfCanvasRef.current;
// // //       canvas.height = viewport.height;
// // //       canvas.width = viewport.width;

// // //       const context = canvas.getContext("2d");
// // //       await page.render({ canvasContext: context, viewport }).promise;
// // //       console.log("Page rendered OK");
// // //       setCurrentPagePreview(pgNum);
// // //     } catch (err) {
// // //       console.error("Render error:", err);
// // //       setError("Page render failed");
// // //     }
// // //   };

// // //   // ==================== HANDLERS ====================
// // //   const handlePdfUpload = (e) => {
// // //     const file = e.target.files?.[0];
// // //     if (file && file.type === "application/pdf") {
// // //       setPdfFile(file);
// // //       setSuccess(false);
// // //       setError("");
// // //       loadPdfPreview(file);
// // //     } else if (file) {
// // //       setError("Sirf PDF file upload karo");
// // //     }
// // //   };

// // //   const handleSignatureUpload = (e) => {
// // //     const file = e.target.files?.[0];
// // //     if (file) {
// // //       setSignatureImage(file);
// // //       setSignaturePreview(URL.createObjectURL(file));
// // //       setDrawMode(false);
// // //       setSuccess(false);
// // //       setError("");
// // //     }
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     if (!pdfFile) return setError("PDF upload karo pehle");
// // //     if (!signatureImage) return setError("Signature banao ya upload karo");

// // //     setLoading(true);
// // //     setSuccess(false);
// // //     setError("");

// // //     const formData = new FormData();
// // //     formData.append("pdfFile", pdfFile);
// // //     formData.append("signatureImage", signatureImage);
// // //     formData.append("pageNumber", String(pageNumber));
// // //     formData.append("xPosition", String(xPosition));
// // //     formData.append("yPosition", String(yPosition));
// // //     formData.append("width", String(signatureWidth));
// // //     formData.append("height", String(signatureHeight));

// // //     try {
// // //       const res = await fetch("/convert/sign-pdf", {
// // //         method: "POST",
// // //         body: formData,
// // //       });

// // //       if (!res.ok) throw new Error("Signing failed");

// // //       const blob = await res.blob();
// // //       const outName = pdfFile.name.replace(/\.pdf$/i, "") + "-signed.pdf";
// // //       const url = URL.createObjectURL(blob);
// // //       const a = document.createElement("a");
// // //       a.href = url;
// // //       a.download = outName;
// // //       a.click();
// // //       URL.revokeObjectURL(url);
// // //       setSuccess(true);
// // //     } catch (err) {
// // //       setError(err.message || "Kuch galat ho gaya");
// // //       console.error(err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Re-render on page change
// // //   useEffect(() => {
// // //     if (pdfDoc && pageNumber !== currentPagePreview) {
// // //       renderPagePreview(pdfDoc, pageNumber);
// // //     }
// // //   }, [pageNumber, pdfDoc]);

// // //   return (
// // //     <>
// // //       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
// // //         <div className="max-w-5xl mx-auto">
// // //           <div className="text-center mb-8">
// // //             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
// // //               Sign PDF Online Free
// // //             </h1>
// // //             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// // //               Add your signature to PDF documents in seconds. Draw or upload your signature and place it anywhere on your PDF.
// // //             </p>
// // //           </div>

// // //           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
// // //             <form onSubmit={handleSubmit} className="space-y-6">
// // //               {/* 1. Upload PDF */}
// // //               <div>
// // //                 <label className="block mb-2 text-sm font-medium text-gray-700">
// // //                   1. Upload PDF Document
// // //                 </label>
// // //                 <div className="relative">
// // //                   <label className="block">
// // //                     <div
// // //                       className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
// // //                         pdfFile ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
// // //                       }`}
// // //                     >
// // //                       <Upload className="w-10 h-10 mx-auto mb-2 text-blue-600" />
// // //                       <p className="text-base font-semibold text-gray-700">
// // //                         {pdfFile ? pdfFile.name : "Click to upload PDF or drag & drop"}
// // //                       </p>
// // //                       <p className="text-sm text-gray-500 mt-1">Max 25MB • .pdf only</p>
// // //                     </div>
// // //                     <input
// // //                       type="file"
// // //                       accept="application/pdf"
// // //                       onChange={handlePdfUpload}
// // //                       className="hidden"
// // //                     />
// // //                   </label>
// // //                 </div>

// // //                 {pdfFile && (
// // //                   <div className="mt-3 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
// // //                     <div className="flex items-center gap-2">
// // //                       <FileText className="w-5 h-5 text-red-600" />
// // //                       <span className="text-sm font-medium">{pdfFile.name}</span>
// // //                       <span className="text-xs text-gray-500">
// // //                         ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
// // //                       </span>
// // //                     </div>
// // //                     <button
// // //                       type="button"
// // //                       onClick={() => {
// // //                         setPdfFile(null);
// // //                         setPdfDoc(null);
// // //                         setError("");
// // //                       }}
// // //                       className="text-red-500 hover:bg-red-100 p-1 rounded"
// // //                     >
// // //                       <X className="w-5 h-5" />
// // //                     </button>
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               {/* 2. Signature */}
// // //               <div>
// // //                 <label className="block mb-2 text-sm font-medium text-gray-700">
// // //                   2. Create or Upload Signature
// // //                 </label>

// // //                 <div className="grid md:grid-cols-2 gap-4 mb-4">
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => setDrawMode(true)}
// // //                     className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
// // //                       drawMode ? "border-blue-600 bg-blue-50 shadow-md" : "border-gray-300 hover:border-blue-400"
// // //                     }`}
// // //                   >
// // //                     <PenTool className="w-5 h-5 text-blue-600" />
// // //                     <span className="font-semibold">Draw Signature</span>
// // //                   </button>

// // //                   <label className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-300 hover:border-purple-400 cursor-pointer transition-all">
// // //                     <ImageIcon className="w-5 h-5 text-purple-600" />
// // //                     <span className="font-semibold">Upload Image</span>
// // //                     <input
// // //                       type="file"
// // //                       accept="image/png,image/jpeg"
// // //                       onChange={handleSignatureUpload}
// // //                       className="hidden"
// // //                     />
// // //                   </label>
// // //                 </div>

// // //                 {drawMode && (
// // //                   <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
// // //                     <canvas
// // //                       ref={canvasRef}
// // //                       width={600}
// // //                       height={200}
// // //                       onMouseDown={startDrawing}
// // //                       onMouseMove={draw}
// // //                       onMouseUp={stopDrawing}
// // //                       onMouseLeave={stopDrawing}
// // //                       className="border-2 border-dashed border-gray-400 bg-white cursor-crosshair w-full rounded-lg touch-none"
// // //                     />
// // //                     <div className="flex gap-3 mt-3">
// // //                       <button
// // //                         type="button"
// // //                         onClick={clearCanvas}
// // //                         className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
// // //                       >
// // //                         <Eraser className="w-4 h-4" />
// // //                         Clear
// // //                       </button>
// // //                       <button
// // //                         type="button"
// // //                         onClick={saveCanvasAsImage}
// // //                         className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
// // //                       >
// // //                         <CheckCircle className="w-4 h-4" />
// // //                         Save Signature
// // //                       </button>
// // //                     </div>
// // //                   </div>
// // //                 )}

// // //                 {signaturePreview && !drawMode && (
// // //                   <div className="border-2 border-green-500 bg-green-50 rounded-xl p-4">
// // //                     <p className="text-sm font-medium text-green-700 mb-2">✓ Signature ready</p>
// // //                     <img
// // //                       src={signaturePreview}
// // //                       alt="Signature preview"
// // //                       className="max-h-32 bg-white border-2 border-gray-300 rounded-lg p-2 object-contain"
// // //                     />
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               {/* LIVE PREVIEW SECTION */}
// // //               {pdfFile && (
// // //                 <div className="mt-6">
// // //                   <label className="block mb-2 text-sm font-medium text-gray-700">
// // //                     Live Preview (Signature Placement)
// // //                   </label>
// // //                   <div className="relative border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-50 min-h-[400px]">
// // //                     {pdfLoaded ? (
// // //                       <canvas ref={pdfCanvasRef} className="w-full h-auto block" />
// // //                     ) : (
// // //                       <div className="absolute inset-0 flex items-center justify-center text-gray-500">
// // //                         PDF library abhi load ho rahi hai...
// // //                       </div>
// // //                     )}
// // //                     {signaturePreview && pdfCanvasRef.current?.width && pdfLoaded && (
// // //                       <img
// // //                         src={signaturePreview}
// // //                         alt="Signature overlay preview"
// // //                         className="absolute border-2 border-blue-500 border-dashed pointer-events-none opacity-80 shadow-md"
// // //                         style={{
// // //                           left: `${xPosition}px`,
// // //                           top: `${pdfCanvasRef.current.height - yPosition - signatureHeight}px`,
// // //                           width: `${signatureWidth}px`,
// // //                           height: `${signatureHeight}px`,
// // //                         }}
// // //                       />
// // //                     )}
// // //                   </div>
// // //                   <p className="text-xs text-gray-500 mt-1">
// // //                     Adjust X/Y/Size below — changes appear here instantly.
// // //                   </p>
// // //                 </div>
// // //               )}

// // //               {/* 3. Position Settings */}
// // //               <div>
// // //                 <label className="block mb-3 text-sm font-medium text-gray-700">
// // //                   3. Position & Size Settings
// // //                 </label>

// // //                 <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
// // //                   <div>
// // //                     <label className="block text-xs text-gray-600 mb-1">Page Number</label>
// // //                     <input
// // //                       type="number"
// // //                       min="1"
// // //                       value={pageNumber}
// // //                       onChange={(e) => setPageNumber(Math.max(1, parseInt(e.target.value) || 1))}
// // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // //                     />
// // //                   </div>
// // //                   <div>
// // //                     <label className="block text-xs text-gray-600 mb-1">X Position (px)</label>
// // //                     <input
// // //                       type="number"
// // //                       min="0"
// // //                       value={xPosition}
// // //                       onChange={(e) => setXPosition(Math.max(0, parseInt(e.target.value) || 0))}
// // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // //                     />
// // //                   </div>
// // //                   <div>
// // //                     <label className="block text-xs text-gray-600 mb-1">Y Position (px)</label>
// // //                     <input
// // //                       type="number"
// // //                       min="0"
// // //                       value={yPosition}
// // //                       onChange={(e) => setYPosition(Math.max(0, parseInt(e.target.value) || 0))}
// // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // //                     />
// // //                   </div>
// // //                   <div>
// // //                     <label className="block text-xs text-gray-600 mb-1">Width (px)</label>
// // //                     <input
// // //                       type="number"
// // //                       min="50"
// // //                       value={signatureWidth}
// // //                       onChange={(e) => setSignatureWidth(Math.max(50, parseInt(e.target.value) || 150))}
// // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // //                     />
// // //                   </div>
// // //                   <div>
// // //                     <label className="block text-xs text-gray-600 mb-1">Height (px)</label>
// // //                     <input
// // //                       type="number"
// // //                       min="30"
// // //                       value={signatureHeight}
// // //                       onChange={(e) => setSignatureHeight(Math.max(30, parseInt(e.target.value) || 75))}
// // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 <p className="text-xs text-gray-500 mt-2">
// // //                   💡 Tip: Adjust X and Y to move signature. Lower Y = higher on page.
// // //                 </p>
// // //               </div>

// // //               {error && (
// // //                 <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
// // //                   {error}
// // //                 </div>
// // //               )}

// // //               <button
// // //                 type="submit"
// // //                 disabled={loading || !pdfFile || !signatureImage || !pdfLoaded}
// // //                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 transition shadow-md flex items-center justify-center gap-2"
// // //               >
// // //                 {loading ? (
// // //                   <>
// // //                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// // //                     Signing PDF...
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     <PenTool className="w-5 h-5" />
// // //                     Sign PDF
// // //                   </>
// // //                 )}
// // //               </button>
// // //             </form>

// // //             {success && (
// // //               <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
// // //                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
// // //                 <p className="text-xl font-bold text-green-700 mb-2">Done! Signed PDF downloaded</p>
// // //               </div>
// // //             )}
// // //           </div>

// // //           <p className="text-center mt-6 text-gray-600">
// // //             No account • No watermark • Files auto-deleted • 100% free
// // //           </p>
// // //         </div>
// // //       </main>

// // //       {/* SEO, FAQs, Related Tools – same as before */}
// // //       <RelatedToolsSection currentPage="sign-pdf" />
// // //     </>
// // //   );
// // // }




















// // // // // app/sign-pdf/page.jsx
// // // // "use client";

// // // // import { useRef, useState, useEffect } from "react";
// // // // // import * as pdfjsLib from 'pdfjs-dist';
// // // // import {
// // // //   Upload,
// // // //   FileText,
// // // //   Download,
// // // //   CheckCircle,
// // // //   X,
// // // //   PenTool,
// // // //   Eraser,
// // // //   Image as ImageIcon,
// // // // } from "lucide-react";
// // // // import Script from "next/script";
// // // // import RelatedToolsSection from "@/components/RelatedTools";

// // // // // pdfjs imports
// // // // // import * as pdfjsLib from 'pdfjs-dist';
// // // // // import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

// // // // export default function SignPdf() {
// // // //   const [pdfFile, setPdfFile] = useState(null);
// // // //   const [signatureImage, setSignatureImage] = useState(null);
// // // //   const [signaturePreview, setSignaturePreview] = useState("");
// // // //   const [drawMode, setDrawMode] = useState(false);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [success, setSuccess] = useState(false);
// // // //   const [error, setError] = useState("");
// // // //   const [pdfjs, setPdfjs] = useState(null);
// // // //   const [pdfjsLib, setPdfjsLib] = useState(null);
// // // // const [pdfLoaded, setPdfLoaded] = useState(false);

// // // //   // Signature position & size
// // // //   const [pageNumber, setPageNumber] = useState(1);
// // // //   const [xPosition, setXPosition] = useState(50);
// // // //   const [yPosition, setYPosition] = useState(650);
// // // //   const [signatureWidth, setSignatureWidth] = useState(150);
// // // //   const [signatureHeight, setSignatureHeight] = useState(75);

// // // //   // PDF preview states
// // // //   const [pdfDoc, setPdfDoc] = useState(null);
// // // //   const [currentPagePreview, setCurrentPagePreview] = useState(null);

// // // //   const canvasRef = useRef(null);          // Drawing canvas for signature
// // // //   const pdfCanvasRef = useRef(null);       // Canvas for PDF preview

// // // //   const isDrawing = useRef(false);


// // // //   useEffect(() => {
// // // //   if (pdfLoaded) return; // Already loaded

// // // //   console.log("Attempting to load pdfjs dynamically...");
// // // //   import('pdfjs-dist')
// // // //     .then((module) => {
// // // //       console.log("pdfjs imported successfully");
// // // //       const pdfjs = module;
// // // //       pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
// // // //       console.log("Worker set:", pdfjs.GlobalWorkerOptions.workerSrc);
// // // //       setPdfjsLib(pdfjs);
// // // //       setPdfLoaded(true);
// // // //     })
// // // //     .catch((err) => {
// // // //       console.error("Dynamic import failed:", err);
// // // //       setError("PDF preview library load nahi ho rahi: " + err.message);
// // // //     });
// // // // }, [pdfLoaded]);


// // // // // useEffect(() => {
// // // // //   pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
// // // // // }, []);


// // // // // const [pdfjsLib, setPdfjsLib] = useState(null);  // New state add kar
// // // // // useEffect(() => {
// // // // //   import('pdfjs-dist').then((module) => {
// // // // //     const pdfjsLib = module;
// // // // //     pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';  // ya jo path tune copy kiya
// // // // //     setPdfjs(pdfjsLib);
// // // // //   }).catch((err) => {
// // // // //     console.error("pdfjs load failed:", err);
// // // // //     setError("PDF preview library load nahi ho rahi");
// // // // //   });
// // // // // }, []);
// // // // // useEffect(() => {
// // // // //   // Load pdfjs only once on client
// // // // //   import('pdfjs-dist').then((module) => {
// // // // //     const pdfjs = module;
// // // // //     pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';  // Worker copy wala path
// // // // //     setPdfjsLib(pdfjs);
// // // // //   }).catch(err => {
// // // // //     console.error("pdfjs load failed", err);
// // // // //     setError("PDF library load nahi ho rahi");
// // // // //   });
// // // // // }, []);


// // // //   // ==================== CANVAS DRAWING ====================
// // // //   const startDrawing = (e) => {
// // // //     if (!drawMode) return;
// // // //     const canvas = canvasRef.current;
// // // //     if (!canvas) return;
// // // //     const rect = canvas.getBoundingClientRect();
// // // //     const x = e.clientX - rect.left;
// // // //     const y = e.clientY - rect.top;

// // // //     const ctx = canvas.getContext("2d");
// // // //     ctx.beginPath();
// // // //     ctx.moveTo(x, y);
// // // //     isDrawing.current = true;
// // // //   };

// // // //   const draw = (e) => {
// // // //     if (!drawMode || !isDrawing.current) return;
// // // //     const canvas = canvasRef.current;
// // // //     if (!canvas) return;
// // // //     const rect = canvas.getBoundingClientRect();
// // // //     const x = e.clientX - rect.left;
// // // //     const y = e.clientY - rect.top;

// // // //     const ctx = canvas.getContext("2d");
// // // //     ctx.lineTo(x, y);
// // // //     ctx.strokeStyle = "#000";
// // // //     ctx.lineWidth = 2;
// // // //     ctx.lineCap = "round";
// // // //     ctx.stroke();
// // // //   };

// // // //   const stopDrawing = () => {
// // // //     isDrawing.current = false;
// // // //   };

// // // //   const clearCanvas = () => {
// // // //     const canvas = canvasRef.current;
// // // //     if (!canvas) return;
// // // //     const ctx = canvas.getContext("2d");
// // // //     ctx.clearRect(0, 0, canvas.width, canvas.height);
// // // //     setSignatureImage(null);
// // // //     setSignaturePreview("");
// // // //   };

// // // //   const saveCanvasAsImage = () => {
// // // //     const canvas = canvasRef.current;
// // // //     if (!canvas) return;
// // // //     canvas.toBlob((blob) => {
// // // //       if (!blob) return;
// // // //       const file = new File([blob], "signature.png", { type: "image/png" });
// // // //       setSignatureImage(file);
// // // //       setSignaturePreview(URL.createObjectURL(blob));
// // // //       setDrawMode(false);
// // // //     }, 'image/png');
// // // //   };

// // // //   // ==================== PDF PREVIEW ====================
// // // // //   const loadPdfPreview = async (file) => {
// // // // //     if (!file) return;

// // // // //     try {
// // // // //       setError(""); // Clear previous errors
// // // // //       const arrayBuffer = await file.arrayBuffer();
// // // // //       const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
// // // // //       const pdf = await loadingTask.promise;

// // // // //       setPdfDoc(pdf);
// // // // //       await renderPagePreview(pdf, pageNumber);
// // // // //     } catch (err) {
// // // // //       console.error("PDF preview load failed:", err);
// // // // //       setError(`Failed to load PDF preview: ${err.message || "Unknown error"}`);
// // // // //     }
// // // // //   };



// // // // // const loadPdfPreview = async (file) => {
// // // // //   if (!file) return;

// // // // //   try {
// // // // //     setError("");
// // // // //     const arrayBuffer = await file.arrayBuffer();
// // // // //     const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
// // // // //     const pdf = await loadingTask.promise;

// // // // //     setPdfDoc(pdf);
// // // // //     await renderPagePreview(pdf, pageNumber);
// // // // //   } catch (err) {
// // // // //     console.error("PDF preview error:", err);
// // // // //     setError("PDF preview load nahi ho raha: " + (err.message || "Kuch galat hua"));
// // // // //   }
// // // // // };

// // // // // const loadPdfPreview = async (file) => {
// // // // //   if (!file || !pdfjs) {
// // // // //     if (!pdfjs) setError("PDF library abhi load ho rahi hai...");
// // // // //     return;
// // // // //   }

// // // // //   try {
// // // // //     setError("");
// // // // //     const arrayBuffer = await file.arrayBuffer();
// // // // //     const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
// // // // //     const pdf = await loadingTask.promise;

// // // // //     setPdfDoc(pdf);
// // // // //     await renderPagePreview(pdf, pageNumber);
// // // // //   } catch (err) {
// // // // //     console.error("PDF load error:", err);
// // // // //     setError("PDF preview load failed: " + err.message);
// // // // //   }
// // // // // };


// // // // const loadPdfPreview = async (file) => {
// // // //   if (!file) return;

// // // //   if (!pdfLoaded || !pdfjsLib) {
// // // //     setError("PDF library abhi load ho rahi hai... thoda wait karo");
// // // //     console.log("PDF library not ready yet");
// // // //     return;
// // // //   }

// // // //   try {
// // // //     console.log("Loading PDF with pdfjs");
// // // //     const arrayBuffer = await file.arrayBuffer();
// // // //     const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
// // // //     const pdf = await loadingTask.promise;
// // // //     console.log("PDF document loaded", pdf.numPages, "pages");

// // // //     setPdfDoc(pdf);
// // // //     await renderPagePreview(pdf, pageNumber);
// // // //   } catch (err) {
// // // //     console.error("PDF load/render error:", err);
// // // //     setError("PDF preview load failed: " + err.message);
// // // //   }
// // // // };

// // // // // const loadPdfPreview = async (file) => {
// // // // //   if (!file || !pdfjsLib) return;  // Wait for library to load

// // // // //   try {
// // // // //     setError("");
// // // // //     const arrayBuffer = await file.arrayBuffer();
// // // // //     const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
// // // // //     const pdf = await loadingTask.promise;

// // // // //     setPdfDoc(pdf);
// // // // //     await renderPagePreview(pdf, pageNumber);
// // // // //   } catch (err) {
// // // // //     console.error(err);
// // // // //     setError("PDF preview load failed: " + err.message);
// // // // //   }
// // // // // };

// // // // const renderPagePreview = async (pdf, pgNum) => {
// // // //   if (!pdf || !pdfCanvasRef.current) {
// // // //     console.log("Render failed: pdf or canvas null");
// // // //     return;
// // // //   }

// // // //   try {
// // // //     console.log("Rendering page", pgNum);
// // // //     const page = await pdf.getPage(pgNum);
// // // //     const scale = 1.0; // Simple scale se shuru kar
// // // //     const viewport = page.getViewport({ scale });

// // // //     const canvas = pdfCanvasRef.current;
// // // //     canvas.height = viewport.height;
// // // //     canvas.width = viewport.width;

// // // //     const context = canvas.getContext("2d");
// // // //     await page.render({ canvasContext: context, viewport }).promise;
// // // //     console.log("Page rendered successfully");
// // // //     setCurrentPagePreview(pgNum);
// // // //   } catch (err) {
// // // //     console.error("Page render error:", err);
// // // //     setError("Page render failed: " + err.message);
// // // //   }
// // // // };
// // // //   // ==================== FILE HANDLERS ====================
// // // //   const handlePdfUpload = (e) => {
// // // //     const file = e.target.files?.[0];
// // // //     if (file && file.type === "application/pdf") {
// // // //       setPdfFile(file);
// // // //       setSuccess(false);
// // // //       setError("");
// // // //       loadPdfPreview(file);
// // // //     } else if (file) {
// // // //       setError("Please upload a valid PDF file");
// // // //     }
// // // //   };

// // // //   const handleSignatureUpload = (e) => {
// // // //     const file = e.target.files?.[0];
// // // //     if (file) {
// // // //       setSignatureImage(file);
// // // //       setSignaturePreview(URL.createObjectURL(file));
// // // //       setDrawMode(false);
// // // //       setSuccess(false);
// // // //       setError("");
// // // //     }
// // // //   };

// // // //   const downloadBlob = (blob, filename) => {
// // // //     const url = window.URL.createObjectURL(blob);
// // // //     const a = document.createElement("a");
// // // //     a.href = url;
// // // //     a.download = filename;
// // // //     a.click();
// // // //     window.URL.revokeObjectURL(url);
// // // //   };

// // // //   // ==================== SUBMIT ====================
// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();

// // // //     if (!pdfFile) {
// // // //       setError("Please upload a PDF file!");
// // // //       return;
// // // //     }

// // // //     if (!signatureImage) {
// // // //       setError("Please provide a signature (draw or upload image)!");
// // // //       return;
// // // //     }

// // // //     setLoading(true);
// // // //     setSuccess(false);
// // // //     setError("");

// // // //     const formData = new FormData();
// // // //     formData.append("pdfFile", pdfFile);
// // // //     formData.append("signatureImage", signatureImage);
// // // //     formData.append("pageNumber", String(pageNumber));
// // // //     formData.append("xPosition", String(xPosition));
// // // //     formData.append("yPosition", String(yPosition));
// // // //     formData.append("width", String(signatureWidth));
// // // //     formData.append("height", String(signatureHeight));

// // // //     try {
// // // //       const res = await fetch("/convert/sign-pdf", {
// // // //         method: "POST",
// // // //         body: formData,
// // // //       });

// // // //       if (!res.ok) {
// // // //         const errorData = await res.json().catch(() => ({}));
// // // //         throw new Error(errorData.error || "Signing failed");
// // // //       }

// // // //       const blob = await res.blob();
// // // //       const outName = pdfFile.name.replace(/\.pdf$/i, "") + "-signed.pdf";
// // // //       downloadBlob(blob, outName);
// // // //       setSuccess(true);
// // // //     } catch (err) {
// // // //       setError(err.message || "Something went wrong. Please try again.");
// // // //       console.error(err);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // Re-render when page number changes
// // // //   useEffect(() => {
// // // //     if (pdfDoc && pageNumber !== currentPagePreview) {
// // // //       renderPagePreview(pdfDoc, pageNumber);
// // // //     }
// // // //   }, [pageNumber, pdfDoc]);

// // // //   return (
// // // //     <>
// // // //       {/* Your SEO Scripts here - keep as is */}
// // // //       {/* <Script id="howto-schema-sign" ... /> etc. */}

// // // //       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
// // // //         <div className="max-w-5xl mx-auto">
// // // //           <div className="text-center mb-8">
// // // //             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
// // // //               Sign PDF Online Free
// // // //             </h1>
// // // //             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// // // //               Add your signature to PDF documents in seconds. Draw or upload your signature and place it anywhere on your PDF.
// // // //             </p>
// // // //           </div>

// // // //           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
// // // //             <form onSubmit={handleSubmit} className="space-y-6">
// // // //               {/* 1. Upload PDF */}
// // // //               <div>
// // // //                 <label className="block mb-2 text-sm font-medium text-gray-700">
// // // //                   1. Upload PDF Document
// // // //                 </label>
// // // //                 <div className="relative">
// // // //                   <label className="block">
// // // //                     <div
// // // //                       className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
// // // //                         pdfFile ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
// // // //                       }`}
// // // //                     >
// // // //                       <Upload className="w-10 h-10 mx-auto mb-2 text-blue-600" />
// // // //                       <p className="text-base font-semibold text-gray-700">
// // // //                         {pdfFile ? pdfFile.name : "Click to upload PDF or drag & drop"}
// // // //                       </p>
// // // //                       <p className="text-sm text-gray-500 mt-1">Max 25MB • .pdf only</p>
// // // //                     </div>
// // // //                     <input
// // // //                       type="file"
// // // //                       accept="application/pdf"
// // // //                       onChange={handlePdfUpload}
// // // //                       className="hidden"
// // // //                     />
// // // //                   </label>
// // // //                 </div>

// // // //                 {pdfFile && (
// // // //                   <div className="mt-3 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
// // // //                     <div className="flex items-center gap-2">
// // // //                       <FileText className="w-5 h-5 text-red-600" />
// // // //                       <span className="text-sm font-medium">{pdfFile.name}</span>
// // // //                       <span className="text-xs text-gray-500">
// // // //                         ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
// // // //                       </span>
// // // //                     </div>
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={() => {
// // // //                         setPdfFile(null);
// // // //                         setPdfDoc(null);
// // // //                         setError("");
// // // //                       }}
// // // //                       className="text-red-500 hover:bg-red-100 p-1 rounded"
// // // //                     >
// // // //                       <X className="w-5 h-5" />
// // // //                     </button>
// // // //                   </div>
// // // //                 )}
// // // //               </div>

// // // //               {/* 2. Signature */}
// // // //               <div>
// // // //                 <label className="block mb-2 text-sm font-medium text-gray-700">
// // // //                   2. Create or Upload Signature
// // // //                 </label>

// // // //                 <div className="grid md:grid-cols-2 gap-4 mb-4">
// // // //                   <button
// // // //                     type="button"
// // // //                     onClick={() => setDrawMode(true)}
// // // //                     className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
// // // //                       drawMode ? "border-blue-600 bg-blue-50 shadow-md" : "border-gray-300 hover:border-blue-400"
// // // //                     }`}
// // // //                   >
// // // //                     <PenTool className="w-5 h-5 text-blue-600" />
// // // //                     <span className="font-semibold">Draw Signature</span>
// // // //                   </button>

// // // //                   <label className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-300 hover:border-purple-400 cursor-pointer transition-all">
// // // //                     <ImageIcon className="w-5 h-5 text-purple-600" />
// // // //                     <span className="font-semibold">Upload Image</span>
// // // //                     <input
// // // //                       type="file"
// // // //                       accept="image/png,image/jpeg"
// // // //                       onChange={handleSignatureUpload}
// // // //                       className="hidden"
// // // //                     />
// // // //                   </label>
// // // //                 </div>

// // // //                 {drawMode && (
// // // //                   <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
// // // //                     <canvas
// // // //                       ref={canvasRef}
// // // //                       width={600}
// // // //                       height={200}
// // // //                       onMouseDown={startDrawing}
// // // //                       onMouseMove={draw}
// // // //                       onMouseUp={stopDrawing}
// // // //                       onMouseLeave={stopDrawing}
// // // //                       className="border-2 border-dashed border-gray-400 bg-white cursor-crosshair w-full rounded-lg touch-none"
// // // //                     />
// // // //                     <div className="flex gap-3 mt-3">
// // // //                       <button
// // // //                         type="button"
// // // //                         onClick={clearCanvas}
// // // //                         className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
// // // //                       >
// // // //                         <Eraser className="w-4 h-4" />
// // // //                         Clear
// // // //                       </button>
// // // //                       <button
// // // //                         type="button"
// // // //                         onClick={saveCanvasAsImage}
// // // //                         className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
// // // //                       >
// // // //                         <CheckCircle className="w-4 h-4" />
// // // //                         Save Signature
// // // //                       </button>
// // // //                     </div>
// // // //                   </div>
// // // //                 )}

// // // //                 {signaturePreview && !drawMode && (
// // // //                   <div className="border-2 border-green-500 bg-green-50 rounded-xl p-4">
// // // //                     <p className="text-sm font-medium text-green-700 mb-2">✓ Signature ready</p>
// // // //                     <img
// // // //                       src={signaturePreview}
// // // //                       alt="Signature preview"
// // // //                       className="max-h-32 bg-white border-2 border-gray-300 rounded-lg p-2 object-contain"
// // // //                     />
// // // //                   </div>
// // // //                 )}
// // // //               </div>

// // // //               {/* LIVE PREVIEW */}
// // // //               {pdfFile && (
// // // //                 <div className="mt-6">
// // // //                   <label className="block mb-2 text-sm font-medium text-gray-700">
// // // //                     Live Preview (Signature Placement)
// // // //                   </label>
// // // //                   <div className="relative border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-50">
// // // //                     <canvas ref={pdfCanvasRef} className="w-full h-auto block" />
// // // //                     {signaturePreview && pdfCanvasRef.current?.width && (
// // // //                       <img
// // // //                         src={signaturePreview}
// // // //                         alt="Signature preview overlay"
// // // //                         className="absolute border-2 border-blue-500 border-dashed pointer-events-none opacity-80 shadow-md"
// // // //                         style={{
// // // //                           left: `${xPosition}px`,
// // // //                           top: `${pdfCanvasRef.current.height - yPosition - signatureHeight}px`,
// // // //                           width: `${signatureWidth}px`,
// // // //                           height: `${signatureHeight}px`,
// // // //                         }}
// // // //                       />
// // // //                     )}
// // // //                   </div>
// // // //                   <p className="text-xs text-gray-500 mt-1">
// // // //                     Adjust position and size below — see changes instantly here.
// // // //                   </p>
// // // //                 </div>
// // // //               )}

// // // //               {/* 3. Position Settings */}
// // // //               <div>
// // // //                 <label className="block mb-3 text-sm font-medium text-gray-700">
// // // //                   3. Position & Size Settings
// // // //                 </label>

// // // //                 <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
// // // //                   <div>
// // // //                     <label className="block text-xs text-gray-600 mb-1">Page Number</label>
// // // //                     <input
// // // //                       type="number"
// // // //                       min="1"
// // // //                       value={pageNumber}
// // // //                       onChange={(e) => setPageNumber(Math.max(1, parseInt(e.target.value) || 1))}
// // // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // // //                     />
// // // //                   </div>
// // // //                   <div>
// // // //                     <label className="block text-xs text-gray-600 mb-1">X Position (px)</label>
// // // //                     <input
// // // //                       type="number"
// // // //                       min="0"
// // // //                       value={xPosition}
// // // //                       onChange={(e) => setXPosition(Math.max(0, parseInt(e.target.value) || 0))}
// // // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // // //                     />
// // // //                   </div>
// // // //                   <div>
// // // //                     <label className="block text-xs text-gray-600 mb-1">Y Position (px)</label>
// // // //                     <input
// // // //                       type="number"
// // // //                       min="0"
// // // //                       value={yPosition}
// // // //                       onChange={(e) => setYPosition(Math.max(0, parseInt(e.target.value) || 0))}
// // // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // // //                     />
// // // //                   </div>
// // // //                   <div>
// // // //                     <label className="block text-xs text-gray-600 mb-1">Width (px)</label>
// // // //                     <input
// // // //                       type="number"
// // // //                       min="50"
// // // //                       value={signatureWidth}
// // // //                       onChange={(e) => setSignatureWidth(Math.max(50, parseInt(e.target.value) || 150))}
// // // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // // //                     />
// // // //                   </div>
// // // //                   <div>
// // // //                     <label className="block text-xs text-gray-600 mb-1">Height (px)</label>
// // // //                     <input
// // // //                       type="number"
// // // //                       min="30"
// // // //                       value={signatureHeight}
// // // //                       onChange={(e) => setSignatureHeight(Math.max(30, parseInt(e.target.value) || 75))}
// // // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // // //                     />
// // // //                   </div>
// // // //                 </div>

// // // //                 <p className="text-xs text-gray-500 mt-2">
// // // //                   💡 Tip: Adjust X and Y to move signature. Lower Y = higher on page.
// // // //                 </p>
// // // //               </div>

// // // //               {error && (
// // // //                 <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
// // // //                   {error}
// // // //                 </div>
// // // //               )}

// // // //               <button
// // // //                 type="submit"
// // // //                 disabled={loading || !pdfFile || !signatureImage}
// // // //                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 transition shadow-md flex items-center justify-center gap-2"
// // // //               >
// // // //                 {loading ? (
// // // //                   <>
// // // //                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// // // //                     Signing PDF...
// // // //                   </>
// // // //                 ) : (
// // // //                   <>
// // // //                     <PenTool className="w-5 h-5" />
// // // //                     Sign PDF
// // // //                   </>
// // // //                 )}
// // // //               </button>
// // // //             </form>

// // // //             {success && (
// // // //               <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
// // // //                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
// // // //                 <p className="text-xl font-bold text-green-700 mb-2">Done! Signed PDF downloaded</p>
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           <p className="text-center mt-6 text-gray-600">
// // // //             No account • No watermark • Files auto-deleted • 100% free
// // // //           </p>
// // // //         </div>
// // // //       </main>

// // // //       {/* Keep your SEO content, FAQs, RelatedToolsSection as is */}
// // // //       {/* ... paste your existing lower sections here ... */}

// // // //       <RelatedToolsSection currentPage="sign-pdf" />
// // // //     </>
// // // //   );
// // // // }





















// // // // // // app/sign-pdf/page.jsx
// // // // // "use client";

// // // // // import { useRef, useState } from "react";
// // // // // import {
// // // // //   Upload,
// // // // //   FileText,
// // // // //   Download,
// // // // //   CheckCircle,
// // // // //   X,
// // // // //   PenTool,
// // // // //   Eraser,
// // // // //   Image as ImageIcon,
// // // // // } from "lucide-react";
// // // // // import Script from "next/script";
// // // // // import RelatedToolsSection from "@/components/RelatedTools";

// // // // // export default function SignPdf() {
// // // // //   const [pdfFile, setPdfFile] = useState(null);
// // // // //   const [signatureImage, setSignatureImage] = useState(null);
// // // // //   const [signaturePreview, setSignaturePreview] = useState("");
// // // // //   const [drawMode, setDrawMode] = useState(false);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [success, setSuccess] = useState(false);
// // // // //   const [error, setError] = useState("");

// // // // //   // Signature position & size
// // // // //   const [pageNumber, setPageNumber] = useState(1);
// // // // //   const [xPosition, setXPosition] = useState(50);
// // // // //   const [yPosition, setYPosition] = useState(650);
// // // // //   const [signatureWidth, setSignatureWidth] = useState(150);
// // // // //   const [signatureHeight, setSignatureHeight] = useState(75);

// // // // //   const canvasRef = useRef(null);
// // // // //   const isDrawing = useRef(false);

// // // // //   // ==================== CANVAS DRAWING ====================
// // // // //   const startDrawing = (e) => {
// // // // //     if (!drawMode) return;
// // // // //     const canvas = canvasRef.current;
// // // // //     const rect = canvas.getBoundingClientRect();
// // // // //     const x = e.clientX - rect.left;
// // // // //     const y = e.clientY - rect.top;

// // // // //     const ctx = canvas.getContext("2d");
// // // // //     ctx.beginPath();
// // // // //     ctx.moveTo(x, y);
// // // // //     isDrawing.current = true;
// // // // //   };

// // // // //   const draw = (e) => {
// // // // //     if (!drawMode || !isDrawing.current) return;
// // // // //     const canvas = canvasRef.current;
// // // // //     const rect = canvas.getBoundingClientRect();
// // // // //     const x = e.clientX - rect.left;
// // // // //     const y = e.clientY - rect.top;

// // // // //     const ctx = canvas.getContext("2d");
// // // // //     ctx.lineTo(x, y);
// // // // //     ctx.strokeStyle = "#000";
// // // // //     ctx.lineWidth = 2;
// // // // //     ctx.lineCap = "round";
// // // // //     ctx.stroke();
// // // // //   };

// // // // //   const stopDrawing = () => {
// // // // //     isDrawing.current = false;
// // // // //   };

// // // // //   const clearCanvas = () => {
// // // // //     const canvas = canvasRef.current;
// // // // //     const ctx = canvas.getContext("2d");
// // // // //     ctx.clearRect(0, 0, canvas.width, canvas.height);
// // // // //     setSignatureImage(null);
// // // // //     setSignaturePreview("");
// // // // //   };

// // // // //   const saveCanvasAsImage = () => {
// // // // //     const canvas = canvasRef.current;
// // // // //     canvas.toBlob((blob) => {
// // // // //       const file = new File([blob], "signature.png", { type: "image/png" });
// // // // //       setSignatureImage(file);
// // // // //       setSignaturePreview(URL.createObjectURL(blob));
// // // // //       setDrawMode(false);
// // // // //     });
// // // // //   };

// // // // //   // ==================== FILE HANDLERS ====================
// // // // //   const handlePdfUpload = (e) => {
// // // // //     const file = e.target.files?.[0];
// // // // //     if (file) {
// // // // //       setPdfFile(file);
// // // // //       setSuccess(false);
// // // // //       setError("");
// // // // //     }
// // // // //   };

// // // // //   const handleSignatureUpload = (e) => {
// // // // //     const file = e.target.files?.[0];
// // // // //     if (file) {
// // // // //       setSignatureImage(file);
// // // // //       setSignaturePreview(URL.createObjectURL(file));
// // // // //       setDrawMode(false);
// // // // //       setSuccess(false);
// // // // //       setError("");
// // // // //     }
// // // // //   };

// // // // //   const downloadBlob = (blob, filename) => {
// // // // //     const url = window.URL.createObjectURL(blob);
// // // // //     const a = document.createElement("a");
// // // // //     a.href = url;
// // // // //     a.download = filename;
// // // // //     a.click();
// // // // //     window.URL.revokeObjectURL(url);
// // // // //   };

// // // // //   // ==================== SUBMIT ====================
// // // // //   const handleSubmit = async (e) => {
// // // // //     e.preventDefault();

// // // // //     if (!pdfFile) {
// // // // //       setError("Please upload a PDF file!");
// // // // //       return;
// // // // //     }

// // // // //     if (!signatureImage) {
// // // // //       setError("Please provide a signature (draw or upload image)!");
// // // // //       return;
// // // // //     }

// // // // //     setLoading(true);
// // // // //     setSuccess(false);
// // // // //     setError("");

// // // // //     const formData = new FormData();
// // // // //     formData.append("pdfFile", pdfFile);
// // // // //     formData.append("signatureImage", signatureImage);
// // // // //     formData.append("pageNumber", String(pageNumber));
// // // // //     formData.append("xPosition", String(xPosition));
// // // // //     formData.append("yPosition", String(yPosition));
// // // // //     formData.append("width", String(signatureWidth));
// // // // //     formData.append("height", String(signatureHeight));

// // // // //     try {
// // // // //       const res = await fetch("/convert/sign-pdf", {
// // // // //         method: "POST",
// // // // //         body: formData,
// // // // //       });

// // // // //       if (!res.ok) {
// // // // //         let msg = "Signing failed";
// // // // //         try {
// // // // //           const j = await res.json();
// // // // //           msg = j?.error || msg;
// // // // //         } catch {}
// // // // //         throw new Error(msg);
// // // // //       }

// // // // //       const blob = await res.blob();
// // // // //       const outName = pdfFile.name.replace(/\.pdf$/i, "") + "-signed.pdf";
// // // // //       downloadBlob(blob, outName);
// // // // //       setSuccess(true);
// // // // //     } catch (err) {
// // // // //       const msg = (
// // // // //         err?.message || "Something went wrong. Please try again."
// // // // //       ).toString();
// // // // //       setError(msg);
// // // // //       console.error(err);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <>
// // // // //       {/* ==================== SEO SCHEMAS ==================== */}
// // // // //       <Script
// // // // //         id="howto-schema-sign"
// // // // //         type="application/ld+json"
// // // // //         strategy="afterInteractive"
// // // // //         dangerouslySetInnerHTML={{
// // // // //           __html: JSON.stringify(
// // // // //             {
// // // // //               "@context": "https://schema.org",
// // // // //               "@type": "HowTo",
// // // // //               name: "How to Sign PDF Online for Free",
// // // // //               description:
// // // // //                 "Add your signature to PDF documents online. Draw your signature or upload an image and place it anywhere on your PDF.",
// // // // //               url: "https://pdflinx.com/sign-pdf",
// // // // //               step: [
// // // // //                 {
// // // // //                   "@type": "HowToStep",
// // // // //                   name: "Upload PDF",
// // // // //                   text: "Upload the PDF file you want to sign.",
// // // // //                 },
// // // // //                 {
// // // // //                   "@type": "HowToStep",
// // // // //                   name: "Create signature",
// // // // //                   text: "Draw your signature or upload a signature image.",
// // // // //                 },
// // // // //                 {
// // // // //                   "@type": "HowToStep",
// // // // //                   name: "Position & download",
// // // // //                   text: "Adjust signature position and size, then download signed PDF.",
// // // // //                 },
// // // // //               ],
// // // // //               totalTime: "PT30S",
// // // // //               estimatedCost: {
// // // // //                 "@type": "MonetaryAmount",
// // // // //                 value: "0",
// // // // //                 currency: "USD",
// // // // //               },
// // // // //               image: "https://pdflinx.com/og-image.png",
// // // // //             },
// // // // //             null,
// // // // //             2
// // // // //           ),
// // // // //         }}
// // // // //       />

// // // // //       <Script
// // // // //         id="breadcrumb-schema-sign"
// // // // //         type="application/ld+json"
// // // // //         strategy="afterInteractive"
// // // // //         dangerouslySetInnerHTML={{
// // // // //           __html: JSON.stringify(
// // // // //             {
// // // // //               "@context": "https://schema.org",
// // // // //               "@type": "BreadcrumbList",
// // // // //               itemListElement: [
// // // // //                 {
// // // // //                   "@type": "ListItem",
// // // // //                   position: 1,
// // // // //                   name: "Home",
// // // // //                   item: "https://pdflinx.com",
// // // // //                 },
// // // // //                 {
// // // // //                   "@type": "ListItem",
// // // // //                   position: 2,
// // // // //                   name: "Sign PDF",
// // // // //                   item: "https://pdflinx.com/sign-pdf",
// // // // //                 },
// // // // //               ],
// // // // //             },
// // // // //             null,
// // // // //             2
// // // // //           ),
// // // // //         }}
// // // // //       />

// // // // //       <Script
// // // // //         id="faq-schema-sign"
// // // // //         type="application/ld+json"
// // // // //         strategy="afterInteractive"
// // // // //         dangerouslySetInnerHTML={{
// // // // //           __html: JSON.stringify(
// // // // //             {
// // // // //               "@context": "https://schema.org",
// // // // //               "@type": "FAQPage",
// // // // //               mainEntity: [
// // // // //                 {
// // // // //                   "@type": "Question",
// // // // //                   name: "Is PDFLinx Sign PDF free?",
// // // // //                   acceptedAnswer: {
// // // // //                     "@type": "Answer",
// // // // //                     text: "Yes. PDFLinx Sign PDF is completely free — no sign-up required, no watermarks added.",
// // // // //                   },
// // // // //                 },
// // // // //                 {
// // // // //                   "@type": "Question",
// // // // //                   name: "Can I draw my signature?",
// // // // //                   acceptedAnswer: {
// // // // //                     "@type": "Answer",
// // // // //                     text: "Yes. You can draw your signature using your mouse, trackpad, or touchscreen. You can also upload an image of your signature.",
// // // // //                   },
// // // // //                 },
// // // // //                 {
// // // // //                   "@type": "Question",
// // // // //                   name: "Is my PDF secure?",
// // // // //                   acceptedAnswer: {
// // // // //                     "@type": "Answer",
// // // // //                     text: "Yes. Your files are processed automatically and deleted immediately after signing. We never store your PDFs or signatures.",
// // // // //                   },
// // // // //                 },
// // // // //                 {
// // // // //                   "@type": "Question",
// // // // //                   name: "Can I sign multiple pages?",
// // // // //                   acceptedAnswer: {
// // // // //                     "@type": "Answer",
// // // // //                     text: "Currently, you can add one signature to one page. For multi-page signing, process the PDF multiple times.",
// // // // //                   },
// // // // //                 },
// // // // //                 {
// // // // //                   "@type": "Question",
// // // // //                   name: "What image formats are supported?",
// // // // //                   acceptedAnswer: {
// // // // //                     "@type": "Answer",
// // // // //                     text: "You can upload PNG or JPG images as your signature. Transparent PNG images work best.",
// // // // //                   },
// // // // //                 },
// // // // //               ],
// // // // //             },
// // // // //             null,
// // // // //             2
// // // // //           ),
// // // // //         }}
// // // // //       />

// // // // //       {/* ==================== MAIN TOOL SECTION ==================== */}
// // // // //       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
// // // // //         <div className="max-w-5xl mx-auto">
// // // // //           {/* Header */}
// // // // //           <div className="text-center mb-8">
// // // // //             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
// // // // //               Sign PDF Online Free
// // // // //             </h1>
// // // // //             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// // // // //               Add your signature to PDF documents in seconds. Draw or upload
// // // // //               your signature and place it anywhere on your PDF.
// // // // //             </p>
// // // // //           </div>

// // // // //           {/* Main Card */}
// // // // //           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
// // // // //             <form onSubmit={handleSubmit} className="space-y-6">
// // // // //               {/* PDF Upload */}
// // // // //               <div>
// // // // //                 <label className="block mb-2 text-sm font-medium text-gray-700">
// // // // //                   1. Upload PDF Document
// // // // //                 </label>
// // // // //                 <div className="relative">
// // // // //                   <label className="block">
// // // // //                     <div
// // // // //                       className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
// // // // //                         pdfFile
// // // // //                           ? "border-green-500 bg-green-50"
// // // // //                           : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
// // // // //                       }`}
// // // // //                     >
// // // // //                       <Upload className="w-10 h-10 mx-auto mb-2 text-blue-600" />
// // // // //                       <p className="text-base font-semibold text-gray-700">
// // // // //                         {pdfFile
// // // // //                           ? pdfFile.name
// // // // //                           : "Click to upload PDF or drag & drop"}
// // // // //                       </p>
// // // // //                       <p className="text-sm text-gray-500 mt-1">
// // // // //                         Max 25MB • .pdf only
// // // // //                       </p>
// // // // //                     </div>
// // // // //                     <input
// // // // //                       type="file"
// // // // //                       accept=".pdf,application/pdf"
// // // // //                       onChange={handlePdfUpload}
// // // // //                       className="hidden"
// // // // //                       required
// // // // //                     />
// // // // //                   </label>
// // // // //                 </div>

// // // // //                 {pdfFile && (
// // // // //                   <div className="mt-3 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
// // // // //                     <div className="flex items-center gap-2">
// // // // //                       <FileText className="w-5 h-5 text-red-600" />
// // // // //                       <span className="text-sm font-medium">{pdfFile.name}</span>
// // // // //                       <span className="text-xs text-gray-500">
// // // // //                         ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
// // // // //                       </span>
// // // // //                     </div>
// // // // //                     <button
// // // // //                       type="button"
// // // // //                       onClick={() => setPdfFile(null)}
// // // // //                       className="text-red-500 hover:bg-red-100 p-1 rounded"
// // // // //                     >
// // // // //                       <X className="w-5 h-5" />
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>

// // // // //               {/* Signature Creation */}
// // // // //               <div>
// // // // //                 <label className="block mb-2 text-sm font-medium text-gray-700">
// // // // //                   2. Create or Upload Signature
// // // // //                 </label>

// // // // //                 <div className="grid md:grid-cols-2 gap-4 mb-4">
// // // // //                   <button
// // // // //                     type="button"
// // // // //                     onClick={() => setDrawMode(true)}
// // // // //                     className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
// // // // //                       drawMode
// // // // //                         ? "border-blue-600 bg-blue-50 shadow-md"
// // // // //                         : "border-gray-300 hover:border-blue-400"
// // // // //                     }`}
// // // // //                   >
// // // // //                     <PenTool className="w-5 h-5 text-blue-600" />
// // // // //                     <span className="font-semibold">Draw Signature</span>
// // // // //                   </button>

// // // // //                   <label className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-300 hover:border-purple-400 cursor-pointer transition-all">
// // // // //                     <ImageIcon className="w-5 h-5 text-purple-600" />
// // // // //                     <span className="font-semibold">Upload Image</span>
// // // // //                     <input
// // // // //                       type="file"
// // // // //                       accept="image/*"
// // // // //                       onChange={handleSignatureUpload}
// // // // //                       className="hidden"
// // // // //                     />
// // // // //                   </label>
// // // // //                 </div>

// // // // //                 {/* Drawing Canvas */}
// // // // //                 {drawMode && (
// // // // //                   <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
// // // // //                     <canvas
// // // // //                       ref={canvasRef}
// // // // //                       width={600}
// // // // //                       height={200}
// // // // //                       onMouseDown={startDrawing}
// // // // //                       onMouseMove={draw}
// // // // //                       onMouseUp={stopDrawing}
// // // // //                       onMouseLeave={stopDrawing}
// // // // //                       className="border-2 border-dashed border-gray-400 bg-white cursor-crosshair w-full rounded-lg"
// // // // //                     />
// // // // //                     <div className="flex gap-3 mt-3">
// // // // //                       <button
// // // // //                         type="button"
// // // // //                         onClick={clearCanvas}
// // // // //                         className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
// // // // //                       >
// // // // //                         <Eraser className="w-4 h-4" />
// // // // //                         Clear
// // // // //                       </button>
// // // // //                       <button
// // // // //                         type="button"
// // // // //                         onClick={saveCanvasAsImage}
// // // // //                         className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
// // // // //                       >
// // // // //                         <CheckCircle className="w-4 h-4" />
// // // // //                         Save Signature
// // // // //                       </button>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 )}

// // // // //                 {/* Signature Preview */}
// // // // //                 {signaturePreview && !drawMode && (
// // // // //                   <div className="border-2 border-green-500 bg-green-50 rounded-xl p-4">
// // // // //                     <p className="text-sm font-medium text-green-700 mb-2">
// // // // //                       ✓ Signature ready
// // // // //                     </p>
// // // // //                     <img
// // // // //                       src={signaturePreview}
// // // // //                       alt="Signature preview"
// // // // //                       className="max-h-32 bg-white border-2 border-gray-300 rounded-lg p-2"
// // // // //                     />
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>

// // // // //               {/* Position Controls */}
// // // // //               <div>
// // // // //                 <label className="block mb-3 text-sm font-medium text-gray-700">
// // // // //                   3. Position & Size Settings
// // // // //                 </label>

// // // // //                 <div className="grid md:grid-cols-2 gap-4">
// // // // //                   <div>
// // // // //                     <label className="block text-xs text-gray-600 mb-1">
// // // // //                       Page Number
// // // // //                     </label>
// // // // //                     <input
// // // // //                       type="number"
// // // // //                       min="1"
// // // // //                       value={pageNumber}
// // // // //                       onChange={(e) => setPageNumber(parseInt(e.target.value))}
// // // // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // // // //                     />
// // // // //                   </div>

// // // // //                   <div>
// // // // //                     <label className="block text-xs text-gray-600 mb-1">
// // // // //                       X Position (px)
// // // // //                     </label>
// // // // //                     <input
// // // // //                       type="number"
// // // // //                       min="0"
// // // // //                       value={xPosition}
// // // // //                       onChange={(e) => setXPosition(parseInt(e.target.value))}
// // // // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // // // //                     />
// // // // //                   </div>

// // // // //                   <div>
// // // // //                     <label className="block text-xs text-gray-600 mb-1">
// // // // //                       Y Position (px)
// // // // //                     </label>
// // // // //                     <input
// // // // //                       type="number"
// // // // //                       min="0"
// // // // //                       value={yPosition}
// // // // //                       onChange={(e) => setYPosition(parseInt(e.target.value))}
// // // // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // // // //                     />
// // // // //                   </div>

// // // // //                   <div>
// // // // //                     <label className="block text-xs text-gray-600 mb-1">
// // // // //                       Width (px)
// // // // //                     </label>
// // // // //                     <input
// // // // //                       type="number"
// // // // //                       min="50"
// // // // //                       value={signatureWidth}
// // // // //                       onChange={(e) =>
// // // // //                         setSignatureWidth(parseInt(e.target.value))
// // // // //                       }
// // // // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // // // //                     />
// // // // //                   </div>

// // // // //                   <div>
// // // // //                     <label className="block text-xs text-gray-600 mb-1">
// // // // //                       Height (px)
// // // // //                     </label>
// // // // //                     <input
// // // // //                       type="number"
// // // // //                       min="30"
// // // // //                       value={signatureHeight}
// // // // //                       onChange={(e) =>
// // // // //                         setSignatureHeight(parseInt(e.target.value))
// // // // //                       }
// // // // //                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
// // // // //                     />
// // // // //                   </div>
// // // // //                 </div>

// // // // //                 <p className="text-xs text-gray-500 mt-2">
// // // // //                   💡 Tip: Adjust X and Y to move signature position. Lower Y = higher on page.
// // // // //                 </p>
// // // // //               </div>

// // // // //               {/* Error */}
// // // // //               {error && (
// // // // //                 <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
// // // // //                   <p className="font-semibold">{error}</p>
// // // // //                 </div>
// // // // //               )}

// // // // //               {/* Submit Button */}
// // // // //               <button
// // // // //                 type="submit"
// // // // //                 disabled={loading || !pdfFile || !signatureImage}
// // // // //                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
// // // // //               >
// // // // //                 {loading ? (
// // // // //                   <>
// // // // //                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// // // // //                     Signing PDF...
// // // // //                   </>
// // // // //                 ) : (
// // // // //                   <>
// // // // //                     <PenTool className="w-5 h-5" />
// // // // //                     Sign PDF
// // // // //                   </>
// // // // //                 )}
// // // // //               </button>
// // // // //             </form>

// // // // //             {/* Success */}
// // // // //             {success && (
// // // // //               <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
// // // // //                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
// // // // //                 <p className="text-xl font-bold text-green-700 mb-2">
// // // // //                   Done! Your signed PDF is ready
// // // // //                 </p>
// // // // //                 <p className="text-sm text-green-700">
// // // // //                   Download started automatically.
// // // // //                 </p>
// // // // //               </div>
// // // // //             )}
// // // // //           </div>

// // // // //           <p className="text-center mt-6 text-gray-600 text-base">
// // // // //             No account • No watermark • Files auto-deleted • 100% free
// // // // //           </p>
// // // // //         </div>
// // // // //       </main>

// // // // //       {/* ==================== SEO CONTENT SECTION ==================== */}
// // // // //       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
// // // // //         <div className="text-center mb-12">
// // // // //           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
// // // // //             Sign PDF Online Free – Add Your Signature Instantly
// // // // //           </h2>
// // // // //           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
// // // // //             Need to sign a PDF document? PDFLinx Sign PDF tool lets you add
// // // // //             your signature online in seconds. Draw your signature or upload an
// // // // //             image — no software installation required.
// // // // //           </p>
// // // // //         </div>

// // // // //         {/* Benefits Grid */}
// // // // //         <div className="grid md:grid-cols-3 gap-8 mb-16">
// // // // //           <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
// // // // //             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
// // // // //               <PenTool className="w-8 h-8 text-white" />
// // // // //             </div>
// // // // //             <h3 className="text-xl font-semibold text-gray-800 mb-3">
// // // // //               Draw or Upload
// // // // //             </h3>
// // // // //             <p className="text-gray-600 text-sm">
// // // // //               Draw your signature with mouse or upload an image. Both work
// // // // //               perfectly.
// // // // //             </p>
// // // // //           </div>

// // // // //           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
// // // // //             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
// // // // //               <FileText className="w-8 h-8 text-white" />
// // // // //             </div>
// // // // //             <h3 className="text-xl font-semibold text-gray-800 mb-3">
// // // // //               Custom Position
// // // // //             </h3>
// // // // //             <p className="text-gray-600 text-sm">
// // // // //               Place your signature anywhere on the PDF with precise position
// // // // //               controls.
// // // // //             </p>
// // // // //           </div>

// // // // //           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
// // // // //             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
// // // // //               <Download className="w-8 h-8 text-white" />
// // // // //             </div>
// // // // //             <h3 className="text-xl font-semibold text-gray-800 mb-3">
// // // // //               Instant Download
// // // // //             </h3>
// // // // //             <p className="text-gray-600 text-sm">
// // // // //               Get your signed PDF instantly. No watermarks, no registration.
// // // // //             </p>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Steps */}
// // // // //         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
// // // // //           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
// // // // //             Sign PDF in 3 Simple Steps
// // // // //           </h3>
// // // // //           <div className="grid md:grid-cols-3 gap-8">
// // // // //             <div className="text-center">
// // // // //               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// // // // //                 1
// // // // //               </div>
// // // // //               <h4 className="text-lg font-semibold mb-2">Upload PDF</h4>
// // // // //               <p className="text-gray-600 text-sm">
// // // // //                 Upload the PDF document you need to sign.
// // // // //               </p>
// // // // //             </div>

// // // // //             <div className="text-center">
// // // // //               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// // // // //                 2
// // // // //               </div>
// // // // //               <h4 className="text-lg font-semibold mb-2">Add Signature</h4>
// // // // //               <p className="text-gray-600 text-sm">
// // // // //                 Draw your signature or upload signature image.
// // // // //               </p>
// // // // //             </div>

// // // // //             <div className="text-center">
// // // // //               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// // // // //                 3
// // // // //               </div>
// // // // //               <h4 className="text-lg font-semibold mb-2">Download</h4>
// // // // //               <p className="text-gray-600 text-sm">
// // // // //                 Adjust position, click Sign PDF, and download.
// // // // //               </p>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>

// // // // //         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
// // // // //           PDFLinx makes signing PDFs quick and easy — perfect for contracts,
// // // // //           forms, and documents.
// // // // //         </p>
// // // // //       </section>

// // // // //       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
// // // // //         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
// // // // //           Sign PDF Online – Add Digital Signature by PDFLinx
// // // // //         </h2>

// // // // //         <p className="text-base leading-7 mb-6">
// // // // //           Digital signatures are essential for modern document workflows.
// // // // //           Whether you need to sign contracts, agreements, forms, or applications,
// // // // //           <span className="font-medium text-slate-900">
// // // // //             {" "}
// // // // //             PDFLinx Sign PDF tool
// // // // //           </span>{" "}
// // // // //           makes it easy to add your signature to any PDF document online —
// // // // //           without installing software or creating an account.
// // // // //         </p>

// // // // //         <h3 className="text-xl font-semibold text-slate-900 mb-3">
// // // // //           What is PDF Signing?
// // // // //         </h3>
// // // // //         <p className="leading-7 mb-6">
// // // // //           PDF signing means adding your signature to a PDF document digitally.
// // // // //           This can be done by drawing your signature, uploading an image of
// // // // //           your handwritten signature, or using a scanned signature. The signed
// // // // //           PDF can then be shared, printed, or stored electronically.
// // // // //         </p>

// // // // //         <h3 className="text-xl font-semibold text-slate-900 mb-3">
// // // // //           Why Sign PDFs Online?
// // // // //         </h3>
// // // // //         <ul className="space-y-2 mb-6 list-disc pl-6">
// // // // //           <li>Sign contracts and agreements from anywhere</li>
// // // // //           <li>No need to print, sign, and scan documents</li>
// // // // //           <li>Save time on document workflows</li>
// // // // //           <li>Work remotely without physical paperwork</li>
// // // // //           <li>Environmentally friendly (less paper waste)</li>
// // // // //           <li>Professional appearance for business documents</li>
// // // // //         </ul>

// // // // //         <h3 className="text-xl font-semibold text-slate-900 mb-3">
// // // // //           How to Sign a PDF Online
// // // // //         </h3>
// // // // //         <ol className="space-y-2 mb-6 list-decimal pl-6">
// // // // //           <li>Upload your PDF document using the tool above</li>
// // // // //           <li>
// // // // //             Create your signature by drawing it or uploading an image (PNG/JPG)
// // // // //           </li>
// // // // //           <li>
// // // // //             Adjust signature position and size using the position controls
// // // // //           </li>
// // // // //           <li>Click "Sign PDF" to add signature to your document</li>
// // // // //           <li>Download your signed PDF instantly</li>
// // // // //         </ol>

// // // // //         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
// // // // //           <h3 className="text-xl font-semibold text-slate-900 mb-4">
// // // // //             Features of PDFLinx Sign PDF Tool
// // // // //           </h3>
// // // // //           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
// // // // //             <li>Free online PDF signing</li>
// // // // //             <li>Draw signature with mouse/trackpad</li>
// // // // //             <li>Upload signature image (PNG/JPG)</li>
// // // // //             <li>Precise position controls</li>
// // // // //             <li>Adjustable signature size</li>
// // // // //             <li>Works on all devices</li>
// // // // //             <li>No software installation needed</li>
// // // // //             <li>No watermarks added</li>
// // // // //             <li>Files deleted after processing</li>
// // // // //             <li>Fast and secure</li>
// // // // //           </ul>
// // // // //         </div>

// // // // //         <h3 className="text-xl font-semibold text-slate-900 mb-3">
// // // // //           Who Should Use Sign PDF Tool?
// // // // //         </h3>
// // // // //         <ul className="space-y-2 mb-6 list-disc pl-6">
// // // // //           <li>
// // // // //             <strong>Business professionals:</strong> Sign contracts and
// // // // //             agreements
// // // // //           </li>
// // // // //           <li>
// // // // //             <strong>Remote workers:</strong> Sign documents from home
// // // // //           </li>
// // // // //           <li>
// // // // //             <strong>Freelancers:</strong> Sign client contracts and proposals
// // // // //           </li>
// // // // //           <li>
// // // // //             <strong>Students:</strong> Sign academic forms and applications
// // // // //           </li>
// // // // //           <li>
// // // // //             <strong>Anyone:</strong> Sign any PDF document quickly
// // // // //           </li>
// // // // //         </ul>

// // // // //         <h3 className="text-xl font-semibold text-slate-900 mb-3">
// // // // //           Common Use Cases
// // // // //         </h3>
// // // // //         <ul className="space-y-2 mb-6 list-disc pl-6">
// // // // //           <li>Employment contracts and offer letters</li>
// // // // //           <li>Rental agreements and lease documents</li>
// // // // //           <li>Business proposals and quotes</li>
// // // // //           <li>Non-disclosure agreements (NDAs)</li>
// // // // //           <li>Permission forms and consent documents</li>
// // // // //           <li>Tax forms and financial documents</li>
// // // // //           <li>Legal contracts and agreements</li>
// // // // //         </ul>

// // // // //         <h3 className="text-xl font-semibold text-slate-900 mb-3">
// // // // //           Is PDFLinx Sign PDF Secure?
// // // // //         </h3>
// // // // //         <p className="leading-7 mb-6">
// // // // //           Yes. PDFLinx is built with privacy and security in mind. Your
// // // // //           uploaded PDF files and signature images are processed automatically
// // // // //           and deleted immediately after signing. We never store your documents
// // // // //           or signatures permanently, and your files are never shared with
// // // // //           anyone.
// // // // //         </p>

// // // // //         <h3 className="text-xl font-semibold text-slate-900 mb-3">
// // // // //           Sign PDFs on Any Device
// // // // //         </h3>
// // // // //         <p className="leading-7">
// // // // //           PDFLinx works seamlessly on Windows, macOS, Linux, Android, and iOS.
// // // // //           Sign your PDFs on desktop, laptop, tablet, or smartphone — all you
// // // // //           need is an internet connection and a modern web browser.
// // // // //         </p>
// // // // //       </section>

// // // // //       {/* FAQs (UI) */}
// // // // //       <section className="py-16">
// // // // //         <div className="max-w-4xl mx-auto px-4">
// // // // //           <h2 className="text-3xl font-bold text-center mb-10">
// // // // //             Frequently Asked Questions
// // // // //           </h2>

// // // // //           <div className="space-y-4">
// // // // //             <details className="bg-white rounded-lg shadow-sm p-5">
// // // // //               <summary className="font-semibold cursor-pointer">
// // // // //                 Is the Sign PDF tool free?
// // // // //               </summary>
// // // // //               <p className="mt-2 text-gray-600">
// // // // //                 Yes. PDFLinx Sign PDF is completely free — no sign-up, no
// // // // //                 watermarks, no hidden costs.
// // // // //               </p>
// // // // //             </details>

// // // // //             <details className="bg-white rounded-lg shadow-sm p-5">
// // // // //               <summary className="font-semibold cursor-pointer">
// // // // //                 Can I draw my signature?
// // // // //               </summary>
// // // // //               <p className="mt-2 text-gray-600">
// // // // //                 Yes. You can draw your signature using your mouse, trackpad, or
// // // // //                 touchscreen. You can also upload an image file (PNG/JPG).
// // // // //               </p>
// // // // //             </details>

// // // // //             <details className="bg-white rounded-lg shadow-sm p-5">
// // // // //               <summary className="font-semibold cursor-pointer">
// // // // //                 Are my files safe?
// // // // //               </summary>
// // // // //               <p className="mt-2 text-gray-600">
// // // // //                 Yes. Files are processed automatically and deleted immediately
// // // // //                 after signing. We never store your PDFs or signatures.
// // // // //               </p>
// // // // //             </details>

// // // // //             <details className="bg-white rounded-lg shadow-sm p-5">
// // // // //               <summary className="font-semibold cursor-pointer">
// // // // //                 Can I sign multiple pages?
// // // // //               </summary>
// // // // //               <p className="mt-2 text-gray-600">
// // // // //                 Currently, you can add one signature to one page per upload.
// // // // //                 For multiple pages, process the PDF multiple times.
// // // // //               </p>
// // // // //             </details>

// // // // //             <details className="bg-white rounded-lg shadow-sm p-5">
// // // // //               <summary className="font-semibold cursor-pointer">
// // // // //                 What image formats are supported?
// // // // //               </summary>
// // // // //               <p className="mt-2 text-gray-600">
// // // // //                 PNG and JPG/JPEG formats are supported. PNG with transparent
// // // // //                 background works best for clean signatures.
// // // // //               </p>
// // // // //             </details>

// // // // //             <details className="bg-white rounded-lg shadow-sm p-5">
// // // // //               <summary className="font-semibold cursor-pointer">
// // // // //                 How do I position my signature?
// // // // //               </summary>
// // // // //               <p className="mt-2 text-gray-600">
// // // // //                 Use the position controls to set X and Y coordinates. Lower Y
// // // // //                 values place the signature higher on the page. You can also
// // // // //                 adjust width and height.
// // // // //               </p>
// // // // //             </details>
// // // // //           </div>
// // // // //         </div>
// // // // //       </section>

// // // // //       <RelatedToolsSection currentPage="sign-pdf" />
// // // // //     </>
// // // // //   );
// // // // // }

