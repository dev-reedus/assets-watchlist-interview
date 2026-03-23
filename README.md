<div align="center">
    <br />
    <a href="https://stonks-o-meter.reedus.dev">
        <img src="src/lib/assets/logo.svg" alt="Logo" width="100" height="100">
    </a>
    <h1 align="center">Stonks-o-meter</h1>
    <p align="center">
        A financial assets watchlist SPA built with SvelteKit 2, Svelte 5, TypeScript, and Tailwind CSS 4. Browse stocks, ETFs, cryptocurrencies, and commodities, track favourites in a persistent watchlist, and inspect price history via interactive candlestick charts.
        <br />
        <br />
        <a href="https://stonks-o-meter.reedus.dev">View Demo</a>
    </p>
    <p align="center">
        <em>Built as a technical interview project — and my first hands-on experience with Svelte and SvelteKit. Structure and choices may not be best practices, though I tried to follow the SvelteKit conventions as closely as possible.</em>
    </p>
</div>

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | SvelteKit 2 + Svelte 5 (runes) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Charts | lightweight-charts |
| Testing | Vitest (unit + component) |
| Component explorer | Storybook 10 + addon-svelte-csf |
| Adapter | @sveltejs/adapter-node |
| Container | Docker (multi-stage) |

---

## Features

- **Dashboard** — paginated asset grid with live search (debounced), category filter, and currency selector
- **Asset detail** — full asset info page with an interactive OHLC candlestick chart (90D / 52W / 24M intervals)
- **Watchlist** — client-side favourites list persisted to `localStorage`, togglable from any asset card or detail page
- **Currency conversion** — switch display currency (USD, EUR, GBP, JPY, CHF) via URL param; all prices converted on the API side
- **Streaming data** — categories load synchronously; the slower asset list streams in via SvelteKit's `streaming` pattern, showing skeleton cards while pending
- **Error handling** — granular error boundaries per route with retry actions
- **Navigation backdrop** — loading overlay on page changes + loading bar on top of the page
- **Accessibility** — semantic HTML, ARIA labels, skip-to-content link, keyboard-navigable components

---

## Project Structure

```
src/
├── lib/
│   ├── assets/                  # Static assets (logo, favicon)
│   ├── components/              # Reusable UI components
│   │   ├── *.svelte
│   │   └── *.stories.svelte     # Co-located Storybook stories
│   ├── data/
│   │   ├── *.ts                 # Mock dataset
│   ├── stores/
│   │   └── *.svelte.ts          # Rune stores (+ localStorage persistance)
│   ├── types/
│   │   └── *.ts                 # Shared TypeScript types
│   └── utils/
│       └── *.ts                 # Helper functions
└──  routes/
    ├── +layout.svelte           # App shell
    ├── +*.svelte                # Svelte pages
    ├── +*.ts                    # Pages load functions
    ├── +error.svelte            # Global error boundary
    ├── api/                     # Api routes
    │   └──  */
    │       ├── +*.ts
    │       └── [id]/            # Nested api routes
    │           └── +*.ts
    └── */
        └── [id]/
            ├── +*.svelte       # Nested routes
            ├── +*.ts           # Nested pages load functions
            └── +error.svelte   # Nested specific error boundary
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm (or yarn if you prefer)

### Install & run

```bash
npm install
npm run dev --open
```

App available at `http://localhost:5173`.

### Other commands

```bash
npm run build          # Production build (outputs to build/)
npm run preview        # Preview production build locally

npm run test           # Run all unit tests
npm run test:unit      # Same, explicit

npm run storybook      # Storybook dev server on :6006
npm run build-storybook

npm run check          # svelte-check + TypeScript
npm run lint           # Prettier + ESLint
npm run format         # Auto-format
```

---

## API Reference

### `GET /api/asset`

Returns a paginated, filtered list of asset summaries.

| Param | Type | Default | Description |
|---|---|---|---|
| `q` | string | — | Search by name or symbol |
| `category` | string | — | Filter by category id |
| `currency` | string | `USD` | Convert prices to this currency |

**Response**
```json
{
  "data": [ AssetSummary ],
  "total": 35
}
```

### `GET /api/asset/:id`

Returns full asset details.

| Param | Type | Default | Description |
|---|---|---|---|
| `currency` | string | `USD` | Convert prices to this currency |

### `GET /api/asset/:id/price-history`

Returns OHLC candlestick data for the chart.

| Param | Type | Default | Description |
|---|---|---|---|
| `interval` | `1D` \| `1W` \| `1M` | `1D` | Candle interval |
| `currency` | string | `USD` | Convert prices |

Returns `90` candles for `1D`, `52` for `1W`, `24` for `1M`.

### `GET /api/category`

Returns all categories with asset counts.

---

## Running with Docker

```bash
./run.sh
```

The script builds the image and starts the container on port `8087`. The default port can be overridden:

```bash
PORT=3000 ./run.sh
```

The Dockerfile uses a **multi-stage build**:
- **Builder** — `node:22-slim` (Debian/glibc, required for native deps like `lightningcss` on ARM 32bit)
- **Runner** — `node:22-alpine` (lean, ~180MB final image; devDependencies stripped via `npm prune`)

---

## Testing

Tests are co-located with source files and split into two Vitest projects:

| Project | Scope | Environment |
|---|---|---|
| `server` | API route handlers, utility functions | Node |
| `storybook` | Storybook stories as component tests | Browser |

```bash
npm run test                        # all tests
npx vitest run --project=server     # server tests only
npx vitest run --project=storybook  # story tests only
```

---

## Storybook

Stories are co-located next to their components (`*.stories.svelte`). Each story uses `@storybook/addon-svelte-csf` and includes `play()` interaction tests where relevant.

```bash
npm run storybook   # http://localhost:6006
```

---

## Improvements (being still mocked up)

### Architecture

- **Watchlist as a dedicated route** — `/watchlist` as its own SvelteKit route with its own load function, rather than a URL param on the dashboard.

### Performance

- **Pagination** — with a cursor + infinite scroll solution, add API supports `limit` + `after` cursor params. On client-side implement with `IntersectionObserver` a "sentinel" that intercepts the end of the list and triggers a new request.
- **Virtual scroller** — If the list became very large (thousands of items rendered simultaneously), a virtual list (e.g. `svelte-virtual-list`) would reduce DOM node count and improve scroll performance.

### UX

- **Sorting** — allow sorting the asset grid by price, change %, market cap, or volume, via URL param (`?sort=change_desc`).
- **Localization** — implement a language switch handled by a i18n library, like `svelte-i18n`.


### DX

- **Component organisation** — split `src/lib/components/` into subdirectories by domain (`charts/`, `layout/`, `asset/`, `ui/`) as the component count grows.
- **Design tokens** — extract CSS custom properties from `app.css` into a dedicated tokens file for easier theming.
