import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false
};

module.exports = {
  allowedDevOrigins: ['10.0.0.232'],
}

export default nextConfig;
