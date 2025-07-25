/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons']
  },
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig