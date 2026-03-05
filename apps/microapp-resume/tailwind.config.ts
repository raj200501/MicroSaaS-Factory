import type { Config } from "tailwindcss";
import sharedConfig from "@microsaas/ui/tailwind.config";

const config: Pick<Config, "presets" | "content"> = {
    content: ["./app/**/*.tsx"],
    presets: [sharedConfig as Config],
};

export default config;
