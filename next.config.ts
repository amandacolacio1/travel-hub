import type { NextConfig } from "next";
import path from "path";

const cabecalhosDeSeguranca = [
  // Bloqueia enquadramento em iframe (clickjacking, §5.1).
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Fotos de capa das cidades vêm da Wikipedia (Wikimedia Commons).
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "thumb.wikimedia.org" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: cabecalhosDeSeguranca,
      },
      {
        // Respostas com dados de sessão nunca em cache (§3.1).
        source: "/api/auth/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
