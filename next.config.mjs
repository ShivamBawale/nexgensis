import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Turbopack this folder is the project root (there is another
  // package-lock.json higher up on this machine that confuses it).
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  images: {
    // Product photos and user avatars from DummyJSON.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.dummyjson.com" },
      { protocol: "https", hostname: "dummyjson.com" },
    ],
  },
};

export default nextConfig;
