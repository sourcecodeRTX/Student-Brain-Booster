/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.svg"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true, // Keeping unoptimized for placeholder SVGs and client-side compressed images
  },
  // Removed the 'env' block as NEXT_PUBLIC_ prefixed variables are automatically exposed to the client
  // and server-side variables are accessed directly in server actions.
}

module.exports = nextConfig
