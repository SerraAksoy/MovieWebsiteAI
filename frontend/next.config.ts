import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint:{
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "image.tmdb.org",
                pathname: "/t/p/**",
            },
        ],
    },
};

export default nextConfig;
