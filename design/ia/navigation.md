# IA — A & Z Wedding Schedule

Single-page site. No multi-level navigation. All content is on one scrollable page.

## Page Sections (scroll order)

| Section | Element | Purpose |
|---------|---------|---------|
| Header | `<header>` | Title, subtitle, language toggle (EN/JA) |
| Schedule | `<main> > <section>` | 7 day cards, each with time-slot list |
| Notes & Reminders | `<main> > <section>` | Bullet list of guest-facing info |
| Costs | `<main> > <section>` | Label/amount pairs |
| Footer | `<footer>` | WhatsApp CTA link, attribution |

## Labels

- Day headings: day name + date (e.g. "Monday", "Mon, Sep 14")
- Time slots: time + label + optional description
- Section headings: "Notes & Reminders", "Costs"
- Toggle: shows the *other* language name (日本語 when in EN, English when in JA)

## Slot Categories

| Category | Visual | Meaning |
|----------|--------|---------|
| excursion | teal accent | Group outing |
| dinner | gold accent | Group meal |
| busy | lavender accent | Couple is unavailable |
| wedding | rose accent | Ceremony / reception |
| free | green accent | Free time |
| travel | blue accent | Arrival / departure |
