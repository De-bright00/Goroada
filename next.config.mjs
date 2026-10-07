/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // jspdf (ticket PDFs) pulls in fflate's worker code, which Turbopack can't bundle.
  // Load it from node_modules at runtime instead.
  serverExternalPackages: ["jspdf"],
}

export default nextConfig
