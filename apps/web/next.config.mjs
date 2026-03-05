/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@microsaas/core", "@microsaas/ui", "@microsaas/auth", "@microsaas/content", "@microsaas/db"],
};

export default nextConfig;
