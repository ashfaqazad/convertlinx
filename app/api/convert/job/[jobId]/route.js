// app/api/convert/job/[jobId]/route.js
export async function GET(req, { params }) {
  const { jobId } = params;

  const backendBase =
    process.env.CONVERTER_API || process.env.NEXT_PUBLIC_CONVERTER_API;

  if (!backendBase) {
    return new Response("CONVERTER_API is missing", { status: 500 });
  }

  const upstream = await fetch(`${backendBase}/job/${jobId}`, {
    cache: "no-store",
  });

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json",
      "cache-control": "no-store",
    },
  });
}
















// export async function GET(req, { params }) {
//   const backendBase =
//     process.env.CONVERTER_API || process.env.NEXT_PUBLIC_CONVERTER_API;

//   if (!backendBase) {
//     return new Response(
//       JSON.stringify({ error: "CONVERTER_API is missing in env" }),
//       { status: 500, headers: { "content-type": "application/json" } }
//     );
//   }

//   const r = await fetch(`${backendBase}/job/${params.jobId}`, { cache: "no-store" });
//   const text = await r.text();

//   return new Response(text, {
//     status: r.status,
//     headers: { "content-type": r.headers.get("content-type") || "application/json" },
//   });
// }













// // export async function GET(req, { params }) {
// //   const backendBase = process.env.NEXT_PUBLIC_CONVERTER_API || process.env.CONVERTER_API;

// //   if (!backendBase) {
// //     return new Response(JSON.stringify({ error: "CONVERTER API base URL missing in env" }), {
// //       status: 500,
// //       headers: { "content-type": "application/json" },
// //     });
// //   }

// //   const r = await fetch(`${backendBase}/job/${params.jobId}`, { cache: "no-store" });

// //   return new Response(await r.text(), {
// //     status: r.status,
// //     headers: { "content-type": r.headers.get("content-type") || "application/json" },
// //   });
// // }



















// // // // app/api/convert/job/[jobId]/route.js
// // // export async function GET(req, { params }) {
// // //   const { jobId } = params;

// // //   const backendBase = process.env.NEXT_PUBLIC_CONVERTER_API; 

// // //   const r = await fetch(`${backendBase}/job/${jobId}`, { cache: "no-store" });

// // //   return new Response(await r.text(), {
// // //     status: r.status,
// // //     headers: { "content-type": r.headers.get("content-type") || "application/json" },
// // //   });
// // // }
