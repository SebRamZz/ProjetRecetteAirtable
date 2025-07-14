import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        // soit en listant les domains
        domains: ['v5.airtableusercontent.com'],
        // ou, si vous voulez être plus précis, en remotePatterns :
        // remotePatterns: [
        //   {
        //     protocol: 'https',
        //     hostname: 'v5.airtableusercontent.com',
        //     port: '',
        //     pathname: '/**'
        //   }
        // ]
    },
};

export default nextConfig;
