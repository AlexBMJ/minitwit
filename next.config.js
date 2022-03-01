/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['secure.gravatar.com'],
  },
};

global.latest = -1;

module.exports = nextConfig;
