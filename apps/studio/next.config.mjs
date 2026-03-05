/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@microsaas/core", "@microsaas/ui", "@microsaas/db", "@microsaas/auth"],
};

export default nextConfig;
