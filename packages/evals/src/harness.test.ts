/**
 * Eval Harness Tests
 *
 * Tests the scoring logic and report aggregation.
 * These are regression tests — if scoring changes break these,
 * it signals a meaningful change in eval behavior.
 */

import { describe, it, expect } from "vitest";
import { scoreOutput, aggregateReport, EvalCase } from "./harness";

const sampleCase: EvalCase = {
    id: "test-001",
    tool: "email-subject",
    inputs: { topic: "Summer sale" },
    expected: {
        min_lines: 3,
        must_contain_input: true,
        max_length: 2000,
    },
    rubric: "Generate at least 3 subject lines",
};

describe("scoreOutput", () => {
    it("passes when all criteria are met", () => {
        const output = "1. Summer sale — Big Deal\n2. Don't miss Summer sale\n3. Summer sale ends tonight\n4. Last chance for Summer sale\n5. Your Summer sale awaits";
        const result = scoreOutput(sampleCase, output, 5);
        expect(result.passed).toBe(true);
        expect(result.scores.schema_valid).toBe(true);
        expect(result.scores.output_nonempty).toBe(true);
        expect(result.scores.min_lines_met).toBe(true);
        expect(result.scores.length_within_limit).toBe(true);
        expect(result.scores.contains_input_reference).toBe(true);
        expect(result.scores.no_error_thrown).toBe(true);
    });

    it("fails when output is null", () => {
        const result = scoreOutput(sampleCase, null, 5);
        expect(result.passed).toBe(false);
        expect(result.scores.schema_valid).toBe(false);
        expect(result.scores.output_nonempty).toBe(false);
    });

    it("fails when output is empty", () => {
        const result = scoreOutput(sampleCase, "", 5);
        expect(result.passed).toBe(false);
        expect(result.scores.schema_valid).toBe(false);
    });

    it("fails when min lines not met", () => {
        const output = "1. Just one Summer sale line";
        const result = scoreOutput(sampleCase, output, 5);
        expect(result.passed).toBe(false);
        expect(result.scores.min_lines_met).toBe(false);
    });

    it("fails when output exceeds max length", () => {
        const output = "Summer sale " + "x".repeat(2001);
        const result = scoreOutput(sampleCase, output, 5);
        expect(result.passed).toBe(false);
        expect(result.scores.length_within_limit).toBe(false);
    });

    it("fails when input reference is missing", () => {
        const output = "1. Line one\n2. Line two\n3. Line three";
        const result = scoreOutput(sampleCase, output, 5);
        expect(result.passed).toBe(false);
        expect(result.scores.contains_input_reference).toBe(false);
    });

    it("fails when an error occurred", () => {
        const output = "1. Summer sale\n2. Summer sale\n3. Summer sale";
        const result = scoreOutput(sampleCase, output, 5, "Provider timeout");
        expect(result.passed).toBe(false);
        expect(result.scores.no_error_thrown).toBe(false);
        expect(result.error).toBe("Provider timeout");
    });

    it("skips input reference check when not required", () => {
        const noRefCase: EvalCase = {
            ...sampleCase,
            expected: { ...sampleCase.expected, must_contain_input: false },
        };
        const output = "1. Generic line\n2. Another line\n3. Third line";
        const result = scoreOutput(noRefCase, output, 5);
        expect(result.scores.contains_input_reference).toBe(true);
    });
});

describe("aggregateReport", () => {
    it("correctly aggregates pass/fail metrics", () => {
        const results = [
            scoreOutput(sampleCase, "Summer sale line 1\nSummer sale line 2\nSummer sale line 3", 10),
            scoreOutput(sampleCase, null, 5),
            scoreOutput(sampleCase, "Summer sale short\nSummer sale two\nSummer sale three", 15),
        ];

        const report = aggregateReport(results, "dummy");
        expect(report.totalCases).toBe(3);
        expect(report.passed).toBe(2);
        expect(report.failed).toBe(1);
        expect(report.passRate).toBeCloseTo(2 / 3);
        expect(report.avgLatencyMs).toBe(10);
        expect(report.metrics.error_rate).toBe(0);
        expect(report.metrics.schema_validity_rate).toBeCloseTo(2 / 3);
    });

    it("handles empty results", () => {
        const report = aggregateReport([], "dummy");
        expect(report.totalCases).toBe(0);
        expect(report.passRate).toBe(0);
        expect(report.avgLatencyMs).toBe(0);
    });
});
