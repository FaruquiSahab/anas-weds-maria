/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [384, 640, 750, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anas-weds-maria.netlify.app",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "*.netlify.app",
        pathname: "/images/**",
      },
    ],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
