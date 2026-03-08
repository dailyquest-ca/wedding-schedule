# A & Z Wedding Schedule

A bilingual (English / Japanese) wedding week schedule with event sign-ups backed by Neon Postgres.

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and ADMIN_PASSWORD
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes (for sign-ups) | Neon Postgres connection string |
| `ADMIN_PASSWORD` | Yes (for admin) | Password for `/admin` roster view |

## Database Setup

Run the migration against your Neon database:

```bash
psql $DATABASE_URL -f migrations/001_init.sql
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint with ESLint |

## Editing Content

All schedule data, translations, notes, costs, and the WhatsApp link live in:

**`lib/wedding-content.ts`**

Edit the `EN` and `JA` objects to change dates, events, notes, or costs. Slots with `signupEnabled: true` will show sign-up buttons to guests.

## Project Structure

```
app/                 Next.js App Router pages and layout
app/api/events/      GET events with signup counts
app/api/signups/     POST/DELETE sign-ups
app/api/admin/       Admin roster endpoint (password-protected)
app/admin/           Admin dashboard page
components/          React components (WeddingPage, SignupModal)
lib/                 Content data, guests, DB client
lib/signup/          Signup domain logic and DB queries
lib/__tests__/       Vitest test files
migrations/          SQL migration files
design/ia/           Information architecture docs
```

## Deploy to Vercel

1. Push to GitHub and import in Vercel
2. Add `DATABASE_URL` and `ADMIN_PASSWORD` in Vercel Environment Variables
3. Run `migrations/001_init.sql` against your Neon database
4. Every push to `main` auto-deploys

## Stack

- Next.js 15 (App Router, Vercel serverless)
- TypeScript
- CSS Modules
- Neon Postgres (`@neondatabase/serverless`)
- Vitest + React Testing Library
