/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xsurface-upload.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
  // ... other Next.js config
};
