/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@microsaas/core", "@microsaas/ui", "@microsaas/db", "@microsaas/auth", "@microsaas/llm", "@microsaas/analytics"],
};

export default nextConfig;
