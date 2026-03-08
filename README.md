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

## Deploy to Vercel (auto-deploy on push)

1. **Create a Git repo on GitHub**
   - Go to [github.com/new](https://github.com/new)
   - Name it (e.g. `wedding-schedule`), leave it empty (no README/license)
   - Create the repository

2. **Push this project**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/wedding-schedule.git
   git branch -M main
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` and `wedding-schedule` with your GitHub username and repo name.)

3. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub)
   - Click **Add New…** → **Project**
   - Import your `wedding-schedule` repo
   - Leave **Build Command** as `npm run build` and **Output Directory** as default (Vercel detects Next.js)
   - Click **Deploy**

After that, every push to `main` will trigger a new deployment. You can add a custom domain in the Vercel project settings.

## Stack

- Next.js 15 (App Router, static export)
- TypeScript
- CSS Modules
- Vitest + React Testing Library
