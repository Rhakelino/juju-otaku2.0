/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "otakudesu.best"
            },
            {
                hostname: "cdn.myanimelist.net"
            }
        ]
    }
};

export default nextConfig;
