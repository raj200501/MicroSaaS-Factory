#!/usr/bin/env node

import { Command } from "commander";
import prompts from "prompts";
import fs from "fs-extra";
import path from "path";

const program = new Command();

program
    .name("create-microapp")
    .description("Scaffold a new microapp in the MicroSaaS Factory")
    .version("0.1.0");

program.parse(process.argv);

async function run() {
    const response = await prompts([
        {
            type: "text",
            name: "name",
            message: "What is your microapp named?",
            initial: "My App",
        },
        {
            type: "text",
            name: "slug",
            message: "What is the slug? (e.g. my-app)",
            initial: "my-app",
            validate: (value) => /^[a-z0-9-]+$/.test(value) ? true : "Slug must be lowercase alphanumeric and dashes.",
        },
        {
            type: "text",
            name: "description",
            message: "Short description?",
            initial: "A cool new microapp",
        }
    ]);

    if (!response.slug || !response.name) {
        console.log("Canceled.");
        process.exit(1);
    }

    const { slug, name, description } = response;
    const targetDir = path.join(process.cwd(), "..", "..", "apps", `microapp-${slug}`);

    if (fs.existsSync(targetDir)) {
        console.error(`Error: Directory apps/microapp-${slug} already exists.`);
        process.exit(1);
    }

    // Use microapp-resume as the template
    const templateDir = path.join(process.cwd(), "..", "..", "apps", "microapp-resume");

    if (!fs.existsSync(templateDir)) {
        console.error("Error: Template app (apps/microapp-resume) not found.");
        process.exit(1);
    }

    console.log(`\nCreating microapp-${slug}...`);
    await fs.copy(templateDir, targetDir);

    // Update package.json
    const pkgPath = path.join(targetDir, "package.json");
    const pkg = await fs.readJson(pkgPath);
    pkg.name = `microapp-${slug}`;
    // generate a random port 3005-3050 for dev
    const port = Math.floor(Math.random() * (3050 - 3005 + 1) + 3005);
    pkg.scripts.dev = `next dev --port ${port}`;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    // Add a note about the DB registry
    console.log("\n✅ Microapp scaffolded successfully!");
    console.log(`Next steps:`);
    console.log(`1. cd apps/microapp-${slug}`);
    console.log(`2. Update the DB seed script or studio UI to register it in the workspace.`);
    console.log(`3. pnpm dev`);
}

run().catch(console.error);
