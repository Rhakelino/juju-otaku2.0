/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
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
            },
            {
                hostname: "i3.wp.com"
            },
            {
                hostname: "i2.wp.com"
            },
            {
                hostname: "i0.wp.com"
            },
            {
                hostname: "i1.wp.com"
            },
            {
                hostname: "upload.wikimedia.org"
            },
            {
                hostname: "u01.appmifile.com"
            },
            {
                hostname: "media.kitsu.io"
            },
            {
                hostname: "i.pinimg.com"
            },
            {
                hostname: "1.bp.blogspot.com"
            },
            {
                hostname: "ecs7.tokopedia.net"
            },
            {
                hostname: "s4.anilist.co"
            },
            {
                hostname: "encrypted-tbn0.gstatic.com"
            },
            {
                hostname: "cache2-ebookjapan.akamaized.net"
            },
            {
                hostname: "v1.animasu.top"
            }
        ]
    }
};

export default nextConfig;
