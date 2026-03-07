# Hobbylog

A personal Warhammer miniature collection tracker built with **Kirby CMS** (headless backend) and **SvelteKit** (static frontend).

> **Note:** The `content/` directory is gitignored and not included in this repository. It contains personal miniature collection data managed via the Kirby panel.

---

## About

This project is built through **AI-assisted deliberate development** — architectural decisions, trade-offs, and data models are reasoned through intentionally, with Claude Code handling the implementation. It's not vibe coding: the steering is human, the typing is shared.

A running log of sessions, decisions, and design rationale lives in [`docs/`](docs/).

---

## Stack

| Layer | Tech | Purpose |
|---|---|---|
| Backend | Kirby CMS v5 (PHP 8.2+) | Content management, KQL API |
| Frontend | SvelteKit + Svelte 5 | Static site, UI |
| Styling | Tailwind CSS v4 | Utility classes |
| Deployment | adapter-static + FTP | Shared PHP hosting (no SSH/Node runtime) |

---

## Local Development

> **Node version note:** Herd installs Node v16 globally, which is too old for Vite 7. Use the Homebrew Node (`/opt/homebrew/bin/node`) for all frontend commands. See [Frontend commands](#frontend-commands) below.

### Prerequisites

- PHP 8.2+
- Composer
- Node.js ≥ 20 (via Homebrew: `/opt/homebrew/bin/node`)

### 1. Start the Kirby backend

```bash
make backend
# Kirby runs at http://localhost:8000
# Panel at http://localhost:8000/panel
```

### 2. Start the SvelteKit frontend

```bash
make frontend
# SvelteKit runs at http://localhost:5173
```

Open `http://localhost:5173` to see the collection frontend.

---

## Frontend Commands

> **Node version note:** The `Makefile` uses `/opt/homebrew/bin/node` directly, bypassing Herd's Node v16 which is incompatible with Vite 7.

For other frontend tasks, run from the `frontend/` directory using the Homebrew Node binary:

```bash
cd frontend

# Production build (Kirby must be running for prerender to work)
/opt/homebrew/bin/node node_modules/.bin/vite build

# Preview the static build locally
/opt/homebrew/bin/node node_modules/.bin/vite preview

# Type-check
/opt/homebrew/bin/node node_modules/.bin/svelte-kit sync && \
/opt/homebrew/bin/node node_modules/.bin/svelte-check --tsconfig ./tsconfig.json
```

---

## Project Structure

```
.
├── Makefile                   # Dev helpers: make backend | make frontend
├── composer.json              # Kirby + KQL dependency
├── content/                   # Kirby file-based content (gitignored)
├── docs/                      # Developer documentation
├── frontend/                  # SvelteKit frontend
│   ├── static/                # Copied as-is to build output
│   ├── src/
│   │   ├── app.css            # Tailwind CSS entry
│   │   ├── lib/
│   │   │   ├── api.ts         # KQL fetch helpers (fetchPages, fetchPage)
│   │   │   ├── i18n.ts        # Localisation helpers
│   │   │   ├── types.ts       # TypeScript interfaces
│   │   │   └── components/
│   │   │       ├── DonutChart.svelte
│   │   │       ├── FilterBar.svelte
│   │   │       ├── ImageModal.svelte
│   │   │       ├── MiniatureCard.svelte
│   │   │       ├── MiniatureCards.svelte
│   │   │       ├── MiniatureTable.svelte
│   │   │       └── PaintProgress.svelte
│   │   └── routes/
│   │       ├── +layout.svelte
│   │       ├── +layout.ts     # prerender = true
│   │       ├── +page.svelte   # Index: all collections
│   │       ├── +page.ts       # Loads all pages
│   │       └── [slug]/
│   │           ├── +page.svelte  # Collection view (tabs, filters, cards/table)
│   │           └── +page.ts      # Loads single page by slug
│   ├── svelte.config.js       # adapter-static
│   └── vite.config.ts         # Tailwind Vite plugin
├── kirby/                     # Kirby core (gitignored)
├── site/
│   ├── blueprints/            # Kirby blueprints (pages/, fields/, sections/)
│   ├── config/
│   │   ├── config.php         # KQL auth, CORS, locale
│   │   ├── config.localhost.php          # Local overrides (frontend URL)
│   │   ├── config.hobbylog.hendrik-berends.de.php  # Production overrides
│   │   └── private.php        # Protected routes
│   ├── models/                # Page models (DefaultPage, HomePage)
│   └── plugins/
│       └── kql/               # Kirby Query Language API plugin
└── vendor/                    # Composer packages (gitignored)
```

---

## Kirby KQL API

The SvelteKit frontend fetches data via the [KQL plugin](https://github.com/getkirby/kql) (Kirby Query Language).

**Endpoint:** `POST http://localhost:8000/api/query`

**Authentication:** Disabled for local dev via `'kql' => ['auth' => false]` in `site/config/config.php`. Restrict this in production.

**CORS:** `http://localhost:5173` is allowed via a `route:before` hook in `config.php`.

### Example KQL request

```bash
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query":"site.children.listed","select":{"title":true}}'
```

---

## Data Model

Each content page has a `miniatures` structure field with these per-miniature fields:

| Field | Type | Description |
|---|---|---|
| `name` | text | German display name |
| `original_name` | text | English original name |
| `genre` | radio | `fantasy` or `scifi` |
| `faction_fantasy` | multiselect | Fantasy faction tags |
| `faction_scifi` | multiselect | Sci-Fi faction tags |
| `categories_fantasy` | multiselect | Fantasy category tags |
| `categories_scifi` | multiselect | Sci-Fi category tags |
| `amount` | number | How many in collection |
| `wished` | toggle | On wishlist (not yet owned) |
| `converted` | toggle | Conversion/kitbash |
| `painted` | toggle | Fully painted |
| `base_size` | multiselect | Base diameter |
| `material` | multiselect | Plastic, resin, metal, etc. |
| `company` | multiselect | Manufacturer |
| `special_miniature` | toggle | Named character / centerpiece |
| `notes` | textarea | Free text notes |
| `images` | files | Photo uploads |

---

## Kirby Panel

Blueprints live in `site/blueprints/` (native Kirby location). Content can be managed and previewed via the Kirby panel at any time (`http://localhost:8000/panel`).

---

## Deployment

Static build output goes to `frontend/build/`. Upload via FTP (VS Code SFTP extension, config in `.vscode/sftp.json`).

The Kirby backend (PHP files + content) is deployed separately to the server. `kirby/`, `vendor/`, `content/`, `site/accounts/`, and `site/cache/` are all gitignored.
