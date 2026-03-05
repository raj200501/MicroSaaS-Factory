import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://microsaas.dev";

    const staticRoutes = [
        { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
        { url: `${baseUrl}/showcase`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
        { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
        { url: `${baseUrl}/docs`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
        { url: `${baseUrl}/roadmap`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
        { url: `${baseUrl}/license`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
        { url: `${baseUrl}/hire`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
        { url: `${baseUrl}/launch-kit`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    ];

    // Add microapp pages
    let microappRoutes: MetadataRoute.Sitemap = [];
    try {
        const jsonPath = path.join(process.cwd(), "../../docs/microapps-30.json");
        const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
        const realSlugs = ["resume", "prd2jira", "meeting"];
        const allSlugs = [...realSlugs, ...data.map((a: any) => a.slug)];
        microappRoutes = allSlugs.map((slug: string) => ({
            url: `${baseUrl}/showcase/${slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));
    } catch { }

    return [...staticRoutes, ...microappRoutes];
}
