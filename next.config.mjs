/** @type {import('next').NextConfig} */
// instrumentationHook aplica migrations/ na subida do servidor Node.
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ["pg", "exceljs"],
  },
};

export default nextConfig;

