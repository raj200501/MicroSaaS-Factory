# Adding a Microapp

To scaffold a new microapp within the factory:

1. Run the CLI tool from the root directory:
   ```bash
   pnpm create:microapp
   ```
   (Or run via node: `node packages/cli/dist/index.js`)

2. Answer the prompts:
   - App Name
   - Slug (e.g., `my-cool-app`)
   - Description

3. The CLI will duplicate the `microapp-resume` template into `apps/microapp-<slug>` and update the `package.json` names and port numbers.

4. Register the new app in the database:
   Update `packages/db/seed.ts` with your new slug to auto-register it, or use the Studio admin app (if fully implemented) to enable the microapp for specific workspaces.

5. Re-run `pnpm install` at the root so turbo picks up the new package, and start with `pnpm dev`.
