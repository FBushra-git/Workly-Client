# Workly Frontend

Next.js frontend for the Freelance Marketplace backend in `../backend`.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS
- Fetch API through `src/lib/api.ts`
- Lucide icons

## Setup

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The backend must be running from `../backend`:

```bash
npm run dev
```

## Routes

- `/` marketplace home
- `/services` search, category/status filters, and pagination
- `/services/[id]` service details, reviews, and ordering
- `/login` and `/register`
- `/dashboard/client` orders, cancellation, and reviews
- `/dashboard/freelancer` service CRUD and received-order status
- `/dashboard/admin` users, categories, services, orders, and reviews

Authentication is persisted in browser local storage for this portfolio application. The backend remains the authority for JWT verification, roles, ownership, and validation.

## Verification

```bash
npm run lint
npm run build
node tests/smoke.mjs
```

The Playwright smoke test expects the backend on port `5000`, frontend on port `3000`, and a Playwright Chromium installation.
