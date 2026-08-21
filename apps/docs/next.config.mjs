/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@projectx/ui"],
  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
};

export default nextConfig;
