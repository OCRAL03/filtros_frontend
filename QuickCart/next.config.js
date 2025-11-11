/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/**' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', port: '', pathname: '/**' },
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },
  async redirects() {
    return [
      {
        source: '/assets/articulos/:path*',
        destination: '/assets/productos/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Proxy client-side `/api/*` requests from Next dev server (3000) to backend (4000)
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['@/components', '@/assets'],
  },
};

module.exports = nextConfig;
