/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["firebase-admin"],
  images: {
    qualities: [100, 75],
  },
};

export default nextConfig;
