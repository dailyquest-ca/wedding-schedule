# A & Z Wedding Schedule

A single-page bilingual (English / Japanese) wedding week schedule.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (static export) |
| `npm test` | Run test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint with ESLint |

## Editing Content

All schedule data, translations, notes, costs, and the WhatsApp link live in a single file:

**`lib/wedding-content.ts`**

Edit the `EN` and `JA` objects to change dates, events, notes, or costs. The types enforce consistency between locales.

## Project Structure

```
app/            Next.js App Router pages and layout
components/     React components (WeddingPage + styles)
lib/            Content data module and helpers
lib/__tests__/  Vitest test files
design/ia/      Information architecture docs
```

## Stack

- Next.js 15 (App Router, static export)
- TypeScript
- CSS Modules
- Vitest + React Testing Library
