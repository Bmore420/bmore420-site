# Bmore420 Site

This repo is the real source for the public site and checkout frontend.

## Paths

- Working repo: `/home/masteruser/projects/bmore/bmore420-new`
- Git remote: `https://github.com/Bmore420/bmore420-site.git`
- Public site: `https://bmore420.com`
- GitHub Pages workflow: `.github/workflows/pages.yml`
- GitHub Pages custom domain source: `public/CNAME`
- Vercel project link for Stripe/API: `.vercel/project.json`

`mirror/bmore420.com/` is an old copy used during migration. Do not treat it as the active deploy source.

## Hosting Model

The site is split across two hosts:

- GitHub Pages serves the frontend for `https://bmore420.com`.
- Vercel serves the Stripe/API backend.

That means:

- Visual/site changes must be made in this repo and pushed to `main`.
- Stripe/API changes must be deployed to the linked Vercel project.
- A checkout fix can go live without a frontend deploy if the bug is only in the Vercel API.

## Frontend Deploy Procedure

Use this for page content, styling, routing, favicon, shop text, events layout, nav behavior, and other visible site changes.

1. Work in `/home/masteruser/projects/bmore/bmore420-new`.
2. Run `npm run build`.
3. Commit the intended frontend changes.
4. Push to `origin main`.
5. GitHub Actions runs `.github/workflows/pages.yml` and deploys `dist/` to GitHub Pages.
6. Verify the live site at `https://bmore420.com`.

Useful checks:

```bash
git -C /home/masteruser/projects/bmore/bmore420-new status --short
gh run list --limit 5
gh run watch <run-id>
curl -s https://bmore420.com
```

`VITE_API_BASE` is injected during the GitHub Pages build from the GitHub secret used by `pages.yml`.

## Stripe / Vercel Deploy Procedure

Use this for checkout, order status, webhook, CORS, or Stripe session bugs.

Important files:

- `api/create-checkout-session.mjs`
- `api/checkout-session-status.mjs`
- `api/stripe-webhook.mjs`
- `server.mjs` for local API development

Expected production setup:

- Frontend origin: `https://bmore420.com`
- Vercel project: `bmore420`
- Vercel `APP_URL`: `https://bmore420.com`
- Frontend `VITE_API_BASE`: the production Vercel origin for the API

Procedure:

1. Make the API change in this repo.
2. Deploy the Vercel project linked in `.vercel/project.json`.
3. Test checkout against the live frontend.
4. If the frontend also changed, push `main` so GitHub Pages picks up the matching UI changes.

## Local Development

Install dependencies:

```bash
npm ci
```

Run the frontend:

```bash
npm run dev
```

Run the local API:

```bash
npm run dev:api
```

## Environment

Local development uses `.env`.

Typical variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `APP_URL`
- `VITE_API_BASE`

Notes:

- Set `APP_URL` to the frontend origin you are testing against.
- Leave `VITE_API_BASE` empty only when frontend and API share the same origin.
- Temporary files such as `.env.vercel.tmp` should not be committed.

## Stripe Webhooks

Forward Stripe events locally with:

```bash
stripe listen --forward-to localhost:8787/api/stripe-webhook
```

Copy the `whsec_...` value into `.env` as `STRIPE_WEBHOOK_SECRET`, then restart `npm run dev:api`.

Completed `checkout.session.completed` events are persisted to `.data/stripe-orders.json`, and the success page checks the returned `session_id` against that stored order data.
