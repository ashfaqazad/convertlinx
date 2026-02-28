/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // agar pehle /tools/slug routes thay aur ab /slug pe shift kar diya:
      { source: "/tools/:slug*", destination: "/:slug*", permanent: true },
    ];
  },
};

export default nextConfig;

















// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [

//       {
//       source: "/api/converted/:path*",
//       destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/converted/:path*`,
//     },
//       {
//         source: "/convert/:path*",
//         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/:path*`,
//       },

//       {
//         source: "/api/:path((?!convert).*)",
//         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
//       },

//     ];
//   },

//   async redirects() {
//     return [
//       { source: "/tools/:slug*", destination: "/:slug*", permanent: true },
//     ];
//   },
// };

// export default nextConfig;

