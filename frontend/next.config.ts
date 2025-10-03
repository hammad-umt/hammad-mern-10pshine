import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    "http://localhost:3000",        // localhost access
    "http://192.168.100.12:3000",   // your laptop LAN IP
  ],
};

export default nextConfig;
