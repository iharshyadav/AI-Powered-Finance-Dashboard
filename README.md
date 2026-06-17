# Proton Finance — Wealth Curator

A personal finance dashboard. It shows net worth and account summaries, AI-style insights, spending and transaction analytics, and budget tracking. Works in dark and light mode and is responsive down to mobile.

**Live:** https://bright-money-lime.vercel.app

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 with a CSS-variable token system (colors in OKLCH)
- Recharts for the portfolio chart
- @tanstack/react-virtual for the transactions table
- GA4 for analytics

## Running it

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

Analytics are optional in dev. If you set `NEXT_PUBLIC_GA_ID` in `.env.local` it sends to GA4, otherwise events just log to the console so nothing breaks.

```bash
pnpm build
pnpm start
pnpm lint
```

## Routes

- `/` — Dashboard: summary cards, AI strategy card, alerts, spending breakdown, recent transactions
- `/insights` — portfolio insights: active signal, performance chart with a time-range toggle, sentiment gauge, sector allocation, cash-flow cards
- `/budgets` — monthly budget overview: velocity, category allocation, budget strategy, recent alerts
- `/design` — a page that shows the design tokens (type scale, colors, buttons, etc.)

## Folder layout

```
src/
  app/            routes + root layout, and /api for the mock endpoints
  components/     dashboard (shell + sections), insights, budgets, design
  hooks/          useFetch, useAnalytics, useDebounce, useLocalStorage, useTheme
  lib/            mock data, insights logic, fetch helper, formatting, cn
```

## How it's put together

Each route's `page.tsx` is a server component that only sets the metadata, and the actual screen lives in a client component next to it. That keeps the title/description on the server for SEO while the screen itself can use hooks and state.

The data isn't imported straight into the components. It's served from Next route handlers under `/api`, so `useFetch` makes a real request and the loading/error/empty states are genuine. Each handler waits a bit before responding so you can see the skeletons, returns a 500 if you pass `?fail=1`, and returns empty data if you pass `?empty=1`. The `httpGet` helper carries those params across navigation so you can keep testing the states.

Theming is a `dark` or `light` class on `<html>`. A small script in the layout reads the saved choice and sets the class before the page paints, so there's no flash. The colors themselves are CSS variables, so switching the class swaps the whole palette.

## Hooks

- `useFetch(fetcher, deps)` — takes any async function, returns `{ data, loading, error, refetch }`, and skips setting state if the component already unmounted. Every screen uses it.
- `useDebounce(value, delay)` — debounced copy of a value. The search box uses it so the table only filters after you stop typing.
- `useLocalStorage(key, initial)` — like useState but saved to localStorage. Reads after mount so it doesn't break SSR.
- `useAnalytics()` — `track(event, params)` and `trackPageView(path, title)`. Loads the GA script only if an ID is set, otherwise logs in dev.
- `useTheme()` — dark/light state, flips the class on `<html>`, saves the choice.

## Insights

The insights aren't fixed strings. `src/lib/insights.ts` builds them from the data — tech exposure change, a dining-surplus note, duplicate subscriptions, net-worth change — and each one only shows up if the numbers actually trigger it. The insights page also has a 1M/3M/1Y/ALL toggle that re-slices the daily series and recalculates the value and percent change.

## Performance

- The heavier dashboard sections and the Recharts chart load with `React.lazy` + `Suspense`, so they're not in the first bundle.
- The transactions table virtualizes once the list gets long enough, so the ~126 rows stay smooth.
- `useMemo`/`useCallback` for the filtered rows, the insights, and the chart slice, and `React.memo` on the presentational cards so they don't re-render while you type in search.

## SEO and accessibility

- Per-route title and description, plus Open Graph tags in the root layout.
- Real landmarks: header, main, nav, aside, section.
- Visually-hidden label on the search box, aria-labels on icon buttons, `aria-current` on the active nav item, progressbar roles on the bars, focus rings, keyboard navigation. There are no `<img>` tags — the icons are inline SVGs marked `aria-hidden` — so there's no alt text to add.

## Trade-offs

- I didn't do React Native Web. It was a bonus, and it renders everything as plain divs, which fights the semantic HTML/SEO part of the brief. I'd rather do the other bonuses properly: dark mode, charts, tokens, virtualization.
- No component library. The UI is plain Tailwind plus a few token utilities. Keeps things small and easy to read; the trade is writing a couple of small pieces (badges, bars) myself.
- The mock API runs inside Next instead of a separate backend, so there's nothing extra to deploy.

## Deploy

It's on Vercel. Import the repo, and if you want analytics set `NEXT_PUBLIC_GA_ID` in the project's environment variables and redeploy.
