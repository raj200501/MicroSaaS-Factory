import { z } from "zod";
import { generateText as aiGenerateText, generateObject as aiGenerateObject, LanguageModel } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

export type LLMProviderType = "dummy" | "openai" | "anthropic";

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

// Dummy LanguageModel implementation for local dev (cast to bypass strict interface checks)
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

function getModel(provider: LLMProviderType, apiKey?: string, modelId?: string): LanguageModel {
    if (provider === "dummy") {
        return dummyModel;
    }
    if (provider === "openai" && apiKey) {
        const openai = createOpenAI({ apiKey });
        return openai(modelId || "gpt-4-turbo");
    }
    if (provider === "anthropic" && apiKey) {
        const anthropic = createAnthropic({ apiKey });
        return anthropic(modelId || "claude-3-opus-20240229");
    }

    // Fallback to dummy
    console.warn(`[LLM] Requested provider ${provider} but missing API key. Falling back to dummy model.`);
    return dummyModel;
}

export async function generateText(options: GenerateOptions) {
    const model = getModel(options.provider, options.apiKey, options.model);

    const result = await aiGenerateText({
        model,
        system: options.system,
        prompt: options.prompt,
        temperature: options.temperature,
    });

    return result.text;
}

export async function generateObject<T extends z.ZodType>(options: GenerateObjectOptions<T>) {
    const model = getModel(options.provider, options.apiKey, options.model);

    // If using dummy, the generated text is {"dummy":"response"} which will likely fail validation
    // So for dummy, we try to mock a valid response if possible, or we just throw.
    // We'll let `aiGenerateObject` do its thing. The caller must be aware dummy model returns static json.
    // Actually, let's make dummy return an empty object that bypasses validation just for local dev, 
    // or better, intercept it.
    if (options.provider === "dummy" || !options.apiKey) {
        console.warn("[LLM] Mocking object generation for dummy provider.");
        if (options.mockResponse) {
            return options.mockResponse;
        }
        return {} as z.infer<T>;
    }

    const result = await aiGenerateObject({
        model,
        schema: options.schema,
        system: options.system,
        prompt: options.prompt,
        temperature: options.temperature,
    });

    return result.object;
}
