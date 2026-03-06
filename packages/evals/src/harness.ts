/**
 * Eval Harness — Types and Scoring
 *
 * Defines the evaluation framework for measuring tool output quality.
 * Each eval case specifies inputs, expected constraints, and a rubric.
 * Scoring is deterministic and reproducible in dummy mode.
 */

export interface EvalCase {
    id: string;
    tool: string;
    inputs: Record<string, string>;
    expected: {
        min_lines: number;
        must_contain_input: boolean;
        max_length: number;
    };
    rubric: string;
}

export interface EvalResult {
    id: string;
    tool: string;
    passed: boolean;
    scores: {
        schema_valid: boolean;
        output_nonempty: boolean;
        min_lines_met: boolean;
        length_within_limit: boolean;
        contains_input_reference: boolean;
        no_error_thrown: boolean;
    };
    latencyMs: number;
    outputLength: number;
    error?: string;
}

export interface EvalReport {
    timestamp: string;
    provider: string;
    totalCases: number;
    passed: number;
    failed: number;
    passRate: number;
    avgLatencyMs: number;
    results: EvalResult[];
    metrics: {
        schema_validity_rate: number;
        completion_rate: number;
        mean_output_length: number;
        error_rate: number;
        p50_latency_ms: number;
        p95_latency_ms: number;
    };
}

/**
 * Score a single eval case against its expected constraints.
 * All checks are deterministic — no LLM-based grading.
 */
export function scoreOutput(
    evalCase: EvalCase,
    output: string | null,
    latencyMs: number,
    error?: string
): EvalResult {
    const lines = (output || "").split("\n").filter((l) => l.trim().length > 0);
    const firstInputValue = Object.values(evalCase.inputs)[0] || "";

    const scores = {
        schema_valid: output !== null && output.length > 0,
        output_nonempty: output !== null && output.trim().length > 0,
        min_lines_met: lines.length >= evalCase.expected.min_lines,
        length_within_limit: (output || "").length <= evalCase.expected.max_length,
        contains_input_reference: evalCase.expected.must_contain_input
            ? (output || "").toLowerCase().includes(firstInputValue.toLowerCase().slice(0, 20))
            : true,
        no_error_thrown: !error,
    };

    const passed = Object.values(scores).every(Boolean);

    return {
        id: evalCase.id,
        tool: evalCase.tool,
        passed,
        scores,
        latencyMs,
        outputLength: (output || "").length,
        error,
    };
}

/**
 * Aggregate individual results into a summary report.
 */
export function aggregateReport(
    results: EvalResult[],
    provider: string
): EvalReport {
    const passed = results.filter((r) => r.passed).length;
    const latencies = results.map((r) => r.latencyMs).sort((a, b) => a - b);

    return {
        timestamp: new Date().toISOString(),
        provider,
        totalCases: results.length,
        passed,
        failed: results.length - passed,
        passRate: results.length > 0 ? passed / results.length : 0,
        avgLatencyMs: latencies.length > 0
            ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
            : 0,
        results,
        metrics: {
            schema_validity_rate:
                results.filter((r) => r.scores.schema_valid).length / Math.max(results.length, 1),
            completion_rate:
                results.filter((r) => r.scores.output_nonempty).length / Math.max(results.length, 1),
            mean_output_length:
                Math.round(
                    results.reduce((a, r) => a + r.outputLength, 0) / Math.max(results.length, 1)
                ),
            error_rate:
                results.filter((r) => !r.scores.no_error_thrown).length / Math.max(results.length, 1),
            p50_latency_ms: latencies[Math.floor(latencies.length * 0.5)] || 0,
            p95_latency_ms: latencies[Math.floor(latencies.length * 0.95)] || 0,
        },
    };
}
