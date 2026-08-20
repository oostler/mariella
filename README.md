# Wooma 🌙

**Your hormones change every day. Your plan should too.**

Wooma is an AI-powered Hormone Intelligence Platform that transforms menstrual health from passive tracking into personalized daily action. Instead of answering *"When is my period coming?"*, Wooma answers the more meaningful question: **"What should I do today?"**

**Live app:** https://oostler.github.io/mariella/

## MVP capabilities

1. **Cycle & Symptom Intelligence** — cycle wheel, calendar with predictions, daily symptom/mood/energy/flow tracking, and pattern detection that learns how *your* cycle behaves.
2. **Daily Wooma** — a personalized morning briefing: current phase, expected energy, likely symptoms, and phase-tuned recommendations for nutrition, movement, recovery and daily planning.
3. **Hormone Concierge** — a conversational assistant that connects your cycle phase and logged symptoms to practical guidance, explains *why* behind every recommendation, and labels the strength of the evidence (high / moderate / emerging).
4. **Personalized Nutrition Intelligence** — phase-based meal ideas, craving support without judgment, and a built-in grocery list.

## Principles (from the business plan)

- **Support, not diagnosis** — educational wellness guidance, never medical advice.
- **Privacy first** — all data stays in the browser (localStorage). No accounts, no servers, no third parties. Export or erase anytime.
- **Evidence transparency** — every recommendation shows its reasoning and confidence tier.
- **Supportive, never judgmental** — especially around food, cravings and mood.

## Tech

- Vite + TypeScript, zero runtime dependencies
- Mobile-first PWA-style web app (installable via the web manifest)
- Deployed automatically to GitHub Pages via GitHub Actions on every push to `main`

## Deployment: one-time Pages setup

CI builds the site and publishes it to the `gh-pages` branch on every push to
`main`. GitHub Pages itself has to be switched on once by hand — the workflow
token is not allowed to create the Pages site (`actions/configure-pages` fails
with *"Resource not accessible by integration"*).

In the repo: **Settings → Pages → Build and deployment → Source:
"Deploy from a branch"**, then pick branch **`gh-pages`** and folder **`/ (root)`**
and save. The site goes live at https://oostler.github.io/mariella/ within a
minute, and every later push to `main` redeploys on its own.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run check    # typecheck
npm run build    # production build → dist/
```
