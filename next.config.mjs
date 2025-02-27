/** @type {import('next').NextConfig} */
const nextConfig = {
images: {
    domains: ['images.unsplash.com', 'avatar.vercel.sh'],
    remotePatterns: [
    {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
    },
    {
        protocol: "https",
        hostname: "images.pexels.com",
    },
    ],
},
};

export default nextConfig;
