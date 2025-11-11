/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4000',
                pathname: '**',
            },
        ],
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
};

export default nextConfig;
