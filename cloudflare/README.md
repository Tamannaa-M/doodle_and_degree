# Free Cloudflare deployment

This folder is the no-card, always-available edition of Doodle & Degree. It keeps the existing interface and moves live rooms to Cloudflare Durable Objects. Uploaded PDFs are prepared in the host's browser and stored with the room.

## Deploy from GitHub

1. Create a free Cloudflare account and open **Workers & Pages**.
2. Choose **Create application**, then **Import a repository** and select `doodle_and_degree`.
3. Set the root directory to `cloudflare`.
4. Leave the build command empty. Keep the deploy command as `npx wrangler deploy`.
5. Deploy. Cloudflare provides a permanent `*.workers.dev` address.

No environment variables, database, payment card, or separate Vercel project are required.

## Local checks

- `node --check src/worker.js`
- `node test-room.mjs`
- `pnpm dev` for the full Cloudflare preview
