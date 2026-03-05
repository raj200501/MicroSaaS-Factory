import { z } from "zod";
import { generateText as aiGenerateText, generateObject as aiGenerateObject, LanguageModel } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createHash } from "crypto";

// ------- Types -------

export type LLMProviderType = "dummy" | "openai" | "anthropic" | "gemini";

export interface GenerateOptions {
    provider: LLMProviderType;
    apiKey?: string;
    model?: string;
    system?: string;
    prompt: string;
    temperature?: number;
    maxTokens?: number;
}

export interface GenerateObjectOptions<T extends z.ZodType> extends GenerateOptions {
    schema: T;
    mockResponse?: z.infer<T>;
}

// ------- Env helpers (safe fallbacks) -------

function getEnv(key: string, fallback = ""): string {
    return process.env[key] || fallback;
}

export function getLlmConfig() {
    const geminiKey = getEnv("GEMINI_API_KEY");
    const demoMode = getEnv("DEMO_MODE", "true") === "true";
    const defaultProvider = getEnv("DEFAULT_LLM_PROVIDER",
        geminiKey ? "gemini" : "dummy"
    ) as LLMProviderType;
    return {
        geminiKey,
        demoMode,
        defaultProvider,
        dailyGlobalLimit: parseInt(getEnv("DEMO_DAILY_GLOBAL_LIMIT", "200")),
        dailyPerIpLimit: parseInt(getEnv("DEMO_DAILY_PER_IP_LIMIT", "20")),
        cacheTtlHours: parseInt(getEnv("LLM_CACHE_TTL_HOURS", "168")),
        ipSalt: getEnv("DEMO_IP_SALT", "microsaas-default-salt-change-me"),
    };
}

// ------- Cache helpers -------

export function computeCacheKey(provider: string, model: string, system: string, prompt: string, schemaFingerprint = ""): string {
    const raw = `${provider}|${model}|${system}|${prompt}|${schemaFingerprint}`;
    return createHash("sha256").update(raw).digest("hex");
}

export function hashIp(ip: string): string {
    const config = getLlmConfig();
    return createHash("sha256").update(ip + config.ipSalt).digest("hex");
}

// ------- SchemaFiller (deterministic dummy that looks real) -------

function hashToNumber(s: string, max: number): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return Math.abs(h) % max;
}

function pickFromBank(seed: string, bank: string[]): string {
    return bank[hashToNumber(seed, bank.length)]!;
}

const wordBanks = {
    verbs: ["Spearheaded", "Developed", "Architected", "Implemented", "Optimized", "Designed", "Led", "Automated", "Streamlined", "Launched"],
    adjectives: ["scalable", "robust", "high-performance", "production-ready", "user-friendly", "cloud-native", "data-driven", "AI-powered", "responsive", "modular"],
    nouns: ["dashboard", "API", "pipeline", "platform", "system", "framework", "microservice", "application", "workflow", "module"],
    metrics: ["40% improvement", "$5K/mo savings", "3x throughput", "99.9% uptime", "50% reduction", "2x faster delivery", "10K+ daily users", "60% cost reduction", "sub-100ms latency", "zero downtime"],
    sentences: [
        "This approach maximizes efficiency while minimizing overhead.",
        "The solution is designed for extensibility and long-term maintainability.",
        "Built with best practices in mind, ensuring quality at every layer.",
        "Proven to deliver measurable results in production environments.",
        "Leverages modern architecture patterns for optimal performance.",
    ],
};

export function fillSchema<T extends z.ZodType>(schema: T, promptSeed: string): z.infer<T> {
    const seed = createHash("md5").update(promptSeed).digest("hex");

    function fillZod(s: z.ZodType, depth: number, idx: number): any {
        const seedKey = `${seed}-${depth}-${idx}`;
        if (s instanceof z.ZodString) {
            const desc = (s._def as any).description || "";
            if (desc.toLowerCase().includes("title") || desc.toLowerCase().includes("name")) {
                return `${pickFromBank(seedKey + "v", wordBanks.verbs)} ${pickFromBank(seedKey + "a", wordBanks.adjectives)} ${pickFromBank(seedKey + "n", wordBanks.nouns)}`;
            }
            if (desc.toLowerCase().includes("bullet") || desc.toLowerCase().includes("criteria")) {
                return `${pickFromBank(seedKey + "v", wordBanks.verbs)} a ${pickFromBank(seedKey + "a", wordBanks.adjectives)} ${pickFromBank(seedKey + "n", wordBanks.nouns)}, achieving ${pickFromBank(seedKey + "m", wordBanks.metrics)}.`;
            }
            return pickFromBank(seedKey, wordBanks.sentences);
        }
        if (s instanceof z.ZodNumber) {
            return hashToNumber(seedKey, 13) + 1;
        }
        if (s instanceof z.ZodBoolean) return hashToNumber(seedKey, 2) === 0;
        if (s instanceof z.ZodArray) {
            const innerType = (s._def as any).type;
            const len = Math.min(hashToNumber(seedKey + "len", 3) + 3, 5);
            return Array.from({ length: len }, (_, i) => fillZod(innerType, depth + 1, i));
        }
        if (s instanceof z.ZodObject) {
            const shape = (s as any).shape;
            const result: Record<string, any> = {};
            let i = 0;
            for (const [key, val] of Object.entries(shape)) {
                result[key] = fillZod(val as z.ZodType, depth + 1, i++);
            }
            return result;
        }
        if (s instanceof z.ZodOptional || s instanceof z.ZodNullable) {
            return fillZod((s._def as any).innerType, depth, idx);
        }
        if (s instanceof z.ZodDefault) {
            return fillZod((s._def as any).innerType, depth, idx);
        }
        if (s instanceof z.ZodEnum) {
            const values = (s._def as any).values as string[];
            return pickFromBank(seedKey, values);
        }
        // Fallback
        return "Generated placeholder content";
    }

    return fillZod(schema, 0, 0);
}

// ------- Dummy Model -------

const dummyModel = {
    specificationVersion: 'v1',
    provider: 'dummy',
    modelId: 'dummy-model',
    defaultObjectGenerationMode: 'json',
    async doGenerate(options: any) {
        const isObject = options?.mode?.type === "object-json";
        const text = isObject ? "{\"dummy\": \"response\"}" : "This is a dummy response from the local LLM stub.";
        return {
            text,
            usage: { promptTokens: 10, completionTokens: 10 },
            finishReason: 'stop' as const,
            rawCall: { rawPrompt: options?.prompt, rawSettings: {} },
        };
    },
    async doStream(_options: any) {
        throw new Error("Stream not implemented for dummy model");
    }
} as unknown as LanguageModel;

// ------- Model factory -------

function getModel(provider: LLMProviderType, apiKey?: string, modelId?: string): LanguageModel {
    if (provider === "gemini" && apiKey) {
        const google = createGoogleGenerativeAI({ apiKey });
        return google(modelId || "gemini-1.5-flash");
    }
    if (provider === "openai" && apiKey) {
        const openai = createOpenAI({ apiKey });
        return openai(modelId || "gpt-4-turbo");
    }
    if (provider === "anthropic" && apiKey) {
        const anthropic = createAnthropic({ apiKey });
        return anthropic(modelId || "claude-3-opus-20240229");
    }
    if (provider !== "dummy") {
        console.warn(`[LLM] Provider ${provider} requested but no API key. Falling back to dummy.`);
    }
    return dummyModel;
}

// ------- Smart provider resolution -------

export interface ResolvedProvider {
    provider: LLMProviderType;
    apiKey?: string;
    badge: "BYOK" | "Demo (Shared Gemini)" | "Local Dummy";
    model?: string;
}

export function resolveProvider(byokProvider?: LLMProviderType, byokKey?: string): ResolvedProvider {
    // 1. BYOK
    if (byokProvider && byokKey && byokProvider !== "dummy") {
        return { provider: byokProvider, apiKey: byokKey, badge: "BYOK" };
    }
    // 2. Server-side Gemini demo key
    const config = getLlmConfig();
    if (config.geminiKey && config.demoMode) {
        return { provider: "gemini", apiKey: config.geminiKey, badge: "Demo (Shared Gemini)", model: "gemini-1.5-flash" };
    }
    // 3. Fallback to dummy
    return { provider: "dummy", badge: "Local Dummy" };
}

// ------- Generate functions -------

export async function generateText(options: GenerateOptions) {
    const model = getModel(options.provider, options.apiKey, options.model);

    try {
        const result = await aiGenerateText({
            model,
            system: options.system,
            prompt: options.prompt,
            temperature: options.temperature,
        });
        return result.text;
    } catch (e: any) {
        // Never leak API keys in error messages
        const safeMsg = e.message?.replace(/key[=:]\s*\S+/gi, "key=***") || "LLM generation failed";
        throw new Error(`[LLM] ${safeMsg}`);
    }
}

export async function generateObject<T extends z.ZodType>(options: GenerateObjectOptions<T>) {
    // Dummy provider: use SchemaFiller for realistic deterministic output
    if (options.provider === "dummy" || (!options.apiKey && !getLlmConfig().geminiKey)) {
        if (options.mockResponse) return options.mockResponse;
        return fillSchema(options.schema, options.prompt);
    }

    const model = getModel(options.provider, options.apiKey, options.model);

    try {
        const result = await aiGenerateObject({
            model,
            schema: options.schema,
            system: options.system,
            prompt: options.prompt,
            temperature: options.temperature,
        });
        return result.object;
    } catch (e: any) {
        const safeMsg = e.message?.replace(/key[=:]\s*\S+/gi, "key=***") || "LLM generation failed";
        throw new Error(`[LLM] ${safeMsg}`);
    }
}
