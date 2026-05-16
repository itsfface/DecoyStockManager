import type { NextConfig } from "next";

const rawBackendApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
const backendApiBaseUrl = rawBackendApiUrl.replace(/\/api\/v1\/?$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendApiBaseUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
