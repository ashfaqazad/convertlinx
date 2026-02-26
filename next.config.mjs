/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [

      {
      source: "/api/converted/:path*",
      destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/converted/:path*`,
    },
      {
        source: "/convert/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/:path*`,
      },

      {
        source: "/api/:path((?!convert).*)",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
      },

    ];
  },

  async redirects() {
    return [
      { source: "/tools/:slug*", destination: "/:slug*", permanent: true },
      { source: "/excel-to-pdf", destination: "/excel-pdf", permanent: true },
      { source: "/blog/excel-to-pdf", destination: "/blog/excel-pdf", permanent: true },
    ];
  },
};

export default nextConfig;

