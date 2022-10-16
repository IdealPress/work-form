/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.prismic.io", "images.unsplash.com"],
  },
  swcMinify: true,
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
