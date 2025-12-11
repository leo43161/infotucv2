import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    URL_SERVER: "https://www.tucumanturismo.gob.ar/api/v1/api/",
    URL_PDF: "https://www.tucumanturismo.gob.ar/api/itinerario/pdf/",
    URL_IMG: "https://www.tucumanturismo.gob.ar/public/img/",
    URL_WEB: "https://www.tucumanturismo.gob.ar/",
    URL_TOUCH: process.env.NODE_ENV === 'production' ? "https://www.tucumanturismo.gob.ar/infotuc/" : "http://10.20.20.5:3000/",
    URL_IMG_TOUCH: process.env.NODE_ENV === 'production' ? "/infotuc" : "",
  },
  devIndicators: false,
  /* config options here */
  /* reactStrictMode: true, */
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? "/infotuc" : "",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
