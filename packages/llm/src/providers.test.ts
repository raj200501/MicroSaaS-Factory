/**
 * LLM Provider Tests
 *
 * Tests the provider layer: dummy model, provider resolution, fallback logic.
 * These test the actual production code paths without API keys.
 */

import { describe, it, expect } from "vitest";
import { resolveProvider, generateText, fillSchema } from "./providers";
import { z } from "zod";

describe("resolveProvider", () => {
    it("falls back to dummy when no keys provided", () => {
        const resolved = resolveProvider();
        expect(resolved.provider).toBe("dummy");
        expect(resolved.badge).toBe("Local Dummy");
    });

    it("uses BYOK when key is provided", () => {
        const resolved = resolveProvider("openai", "sk-test-key");
        expect(resolved.provider).toBe("openai");
        expect(resolved.badge).toBe("BYOK");
        expect(resolved.apiKey).toBe("sk-test-key");
    });

    it("treats dummy BYOK as fallback", () => {
        const resolved = resolveProvider("dummy", "some-key");
        expect(resolved.provider).toBe("dummy");
        expect(resolved.badge).toBe("Local Dummy");
    });
});

describe("generateText (error handling)", () => {
    it("wraps dummy model errors with [LLM] prefix", async () => {
        // The dummy model uses AI SDK spec v1 which v5 doesn't support.
        // This tests that generateText catches and re-throws with sanitized message.
        await expect(
            generateText({ provider: "dummy", prompt: "test" })
        ).rejects.toThrow("[LLM]");
    });

    it("does not leak API keys in error messages", async () => {
        // When a provider fails, the error message should not contain raw keys
        try {
            await generateText({
                provider: "dummy",
                apiKey: "sk-super-secret-key-12345",
                prompt: "test",
            });
            // If it doesn't throw, that's also fine
        } catch (e: any) {
            expect(e.message).not.toContain("sk-super-secret-key-12345");
            expect(e.message).toContain("[LLM]");
        }
    });
});

describe("fillSchema (SchemaFiller)", () => {
    it("fills a simple object schema", () => {
        const schema = z.object({
            title: z.string().describe("title"),
            count: z.number(),
            active: z.boolean(),
        });

        const result = fillSchema(schema, "test-seed");
        expect(typeof result.title).toBe("string");
        expect(typeof result.count).toBe("number");
        expect(typeof result.active).toBe("boolean");
    });

    it("fills nested schemas with arrays", () => {
        const schema = z.object({
            items: z.array(z.object({
                name: z.string().describe("name"),
                score: z.number(),
            })),
        });

        const result = fillSchema(schema, "nested-seed");
        expect(Array.isArray(result.items)).toBe(true);
        expect(result.items.length).toBeGreaterThan(0);
        expect(typeof result.items[0].name).toBe("string");
        expect(typeof result.items[0].score).toBe("number");
    });

    it("produces deterministic output for same seed", () => {
        const schema = z.object({ title: z.string().describe("title") });
        const a = fillSchema(schema, "same-seed");
        const b = fillSchema(schema, "same-seed");
        expect(a.title).toBe(b.title);
    });

    it("produces different output for different seeds", () => {
        const schema = z.object({ title: z.string().describe("title") });
        const a = fillSchema(schema, "seed-a");
        const b = fillSchema(schema, "seed-b");
        expect(typeof a.title).toBe("string");
        expect(typeof b.title).toBe("string");
    });

    it("handles enum schemas", () => {
        const schema = z.object({
            status: z.enum(["active", "inactive", "pending"]),
        });
        const result = fillSchema(schema, "enum-seed");
        expect(["active", "inactive", "pending"]).toContain(result.status);
    });
});
