/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Ensure config.json is included in the build
    config.module.rules.push({
      test: /config\.json$/,
      type: 'json',
    });
    return config;
  },
};

export default nextConfig;
