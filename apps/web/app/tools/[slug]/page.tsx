import { notFound } from "next/navigation";
import { getToolBySlug, TOOLS } from "../_lib/tool-defs";
import ToolRunner from "./ToolRunner";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return TOOLS.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const tool = getToolBySlug(params.slug);
    if (!tool) return {};
    return {
        title: tool.name,
        description: tool.description,
        openGraph: {
            title: `${tool.name} | MicroSaaS Factory`,
            description: tool.description,
        },
    };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
    const tool = getToolBySlug(params.slug);
    if (!tool) notFound();

    return <ToolRunner tool={tool} />;
}
