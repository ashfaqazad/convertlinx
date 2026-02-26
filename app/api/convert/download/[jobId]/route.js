// app/api/convert/download/[jobId]/route.js
export async function GET(req, { params }) {
  const { jobId } = params;

  const backendBase =
    process.env.CONVERTER_API || process.env.NEXT_PUBLIC_CONVERTER_API;

  if (!backendBase) {
    return new Response("CONVERTER_API is missing", { status: 500 });
  }

  const upstream = await fetch(`${backendBase}/download/${jobId}`, {
    cache: "no-store",
  });

  // forward status + stream body EXACTLY (binary safe)
  const headers = new Headers(upstream.headers);

  // IMPORTANT: Avoid Next compression messing binary
  headers.set("Cache-Control", "no-store");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}






















// export async function GET(req, { params }) {
//   const backendBase =
//     process.env.CONVERTER_API || process.env.NEXT_PUBLIC_CONVERTER_API;

//   if (!backendBase) {
//     return new Response("CONVERTER_API is missing in env", { status: 500 });
//   }

//   const r = await fetch(`${backendBase}/download/${params.jobId}`, { cache: "no-store" });

//   // If backend returned JSON error, pass it as text/json
//   const ct = r.headers.get("content-type") || "";
//   if (ct.includes("application/json")) {
//     const text = await r.text();
//     return new Response(text, { status: r.status, headers: { "content-type": ct } });
//   }

//   return new Response(r.body, {
//     status: r.status,
//     headers: {
//       "content-type": ct || "application/octet-stream",
//       "content-disposition": r.headers.get("content-disposition") || "",
//       "content-length": r.headers.get("content-length") || "",
//       "cache-control": "no-store",
//     },
//   });
// }

















// // export async function GET(req, { params }) {
// //   const backendBase =
// //     process.env.CONVERTER_API || process.env.NEXT_PUBLIC_CONVERTER_API;

// //   if (!backendBase) {
// //     return new Response("CONVERTER_API is missing in env", { status: 500 });
// //   }

// //   const r = await fetch(`${backendBase}/download/${params.jobId}`, { cache: "no-store" });

// //   return new Response(r.body, {
// //     status: r.status,
// //     headers: {
// //       "content-type": r.headers.get("content-type") || "application/octet-stream",
// //       "content-disposition": r.headers.get("content-disposition") || "",
// //     },
// //   });
// // }













// // // export async function GET(req, { params }) {
// // //   const backendBase = process.env.NEXT_PUBLIC_CONVERTER_API || process.env.CONVERTER_API;

// // //   if (!backendBase) {
// // //     return new Response("CONVERTER API base URL missing in env", { status: 500 });
// // //   }

// // //   const r = await fetch(`${backendBase}/download/${params.jobId}`, { cache: "no-store" });

// // //   return new Response(r.body, {
// // //     status: r.status,
// // //     headers: {
// // //       "content-type": r.headers.get("content-type") || "application/octet-stream",
// // //       "content-disposition": r.headers.get("content-disposition") || "",
// // //     },
// // //   });
// // // }











// // // // // app/api/convert/download/[jobId]/route.js
// // // // export async function GET(req, { params }) {
// // // //   const { jobId } = params;
// // // //   const backendBase = process.env.NEXT_PUBLIC_CONVERTER_API;

// // // //   const r = await fetch(`${backendBase}/download/${jobId}`, { cache: "no-store" });

// // // //   return new Response(r.body, {
// // // //     status: r.status,
// // // //     headers: {
// // // //       "content-type": r.headers.get("content-type") || "application/octet-stream",
// // // //       "content-disposition": r.headers.get("content-disposition") || "",
// // // //     },
// // // //   });
// // // // }
