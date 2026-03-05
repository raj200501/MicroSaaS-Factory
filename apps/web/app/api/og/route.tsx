import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "MicroSaaS Factory";
    const subtitle = searchParams.get("subtitle") || "AI Microapps You Can Ship Today";

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0a0a1a",
                    backgroundImage: "radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px 80px",
                        maxWidth: "900px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "24px",
                            marginBottom: "20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#a78bfa",
                        }}
                    >
                        ⚡ MicroSaaS Factory
                    </div>
                    <div
                        style={{
                            fontSize: "56px",
                            fontWeight: 900,
                            background: "linear-gradient(135deg, #a78bfa, #818cf8, #6366f1)",
                            backgroundClip: "text",
                            color: "transparent",
                            textAlign: "center",
                            lineHeight: 1.1,
                            marginBottom: "16px",
                        }}
                    >
                        {title}
                    </div>
                    <div
                        style={{
                            fontSize: "24px",
                            color: "#94a3b8",
                            textAlign: "center",
                        }}
                    >
                        {subtitle}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            marginTop: "32px",
                        }}
                    >
                        {["Zero SaaS", "BYOK LLM", "Open Source"].map((badge) => (
                            <div
                                key={badge}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "999px",
                                    border: "1px solid rgba(139, 92, 246, 0.3)",
                                    backgroundColor: "rgba(139, 92, 246, 0.1)",
                                    color: "#c4b5fd",
                                    fontSize: "14px",
                                }}
                            >
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
