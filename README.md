# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
## Stripe Checkout sandbox

1. Copy `.env.example` to `.env`.
2. Set `STRIPE_SECRET_KEY` to your Stripe test secret key.
3. Set `STRIPE_WEBHOOK_SECRET` after you start Stripe CLI webhook forwarding.
4. Set `APP_URL` to the frontend origin you are using.
5. Set `VITE_API_BASE` to the Stripe API origin when the frontend and API are hosted on different domains. Leave it empty when the frontend and API share the same origin.
5. Run `npm run dev` for the frontend and `npm run dev:api` for the local Stripe API.

The cart page calls the local Stripe API and redirects to Stripe Checkout. Success returns to `/checkout/success`; cancel returns to `/checkout/cancel`.

### Split hosting

If the static site is hosted on GitHub Pages and the Stripe API is hosted on Vercel:

- Set `APP_URL` on Vercel to the public frontend origin, for example `https://bmore420.com`.
- Set `VITE_API_BASE` in the frontend build to the deployed Vercel API origin, for example `https://your-project.vercel.app`.
- The Vercel API routes send CORS headers that allow requests from `APP_URL`.

In that setup, the GitHub Pages domain does not need to be attached to the Vercel project just for Stripe.

### Webhooks

Use Stripe CLI to forward webhook events to the local API:

```bash
stripe listen --forward-to localhost:8787/api/stripe-webhook
```

Copy the `whsec_...` signing secret shown by Stripe CLI into `.env` as `STRIPE_WEBHOOK_SECRET`, then restart `npm run dev:api`.

The webhook persists completed `checkout.session.completed` events to `.data/stripe-orders.json`, and the success page verifies the returned `session_id` against that stored order record.
