/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "otakudesu.best"
            },
            {
                hostname: "cdn.myanimelist.net"
            },
            {
                hostname: "avatars.githubusercontent.com"
            },
            {
                hostname: "lh3.googleusercontent.com"
            },
            {
                hostname: "placehold.co"
            }
        ]
    }
};

export default nextConfig;
