/** @type {import('next').NextConfig} */
const path = require("path")

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.join(__dirname, ".")
    return config
  },
  // Optimize package imports for better bundle size
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
}

module.exports = nextConfig
