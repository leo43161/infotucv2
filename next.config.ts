import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    URL_SERVER: "https://www.tucumanturismo.gob.ar/api/v1/api/",
    URL_IMG: "https://www.tucumanturismo.gob.ar/public/img/",
    URL_WEB: "https://www.tucumanturismo.gob.ar/",
    URL_TOUCH: "https://www.tucumanturismo.gob.ar/infotucv2/",
  },
  devIndicators: false,
  /* config options here */
  /* reactStrictMode: true, */
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
