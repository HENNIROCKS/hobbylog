# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Stack

- **Backend:** Kirby CMS v5.2 (PHP 8.2+) — headless API via KQL
- **Frontend:** SvelteKit (TypeScript, `adapter-static`) in `frontend/`
- **Styling:** SCSS (active), Tailwind migration planned
- **Hosting:** ALL-INKL shared PHP host — no SSH/Node runtime; SvelteKit builds statically and deploys via FTP
- Always be aware of both the Kirby backend (PHP/plugins) and SvelteKit frontend contexts when making changes.

## Workflow Preferences

- At session start, consult CLAUDE.md and the latest `docs/*.html` file for full context on prior decisions.
- When asked to "document the session", export a conversation summary to a file in `docs/` (HTML or Markdown with today's date) — do NOT just save memory notes to MEMORY.md.
- At session end, offer to update/append to the session docs file.

## Communication Style

- Explain your plan BEFORE making changes. Wait for confirmation before implementing.
- For file operations (deletion, renaming, cleanup): enumerate ALL target files with full paths first, confirm with the user, then execute.
- When searching for `__`-prefixed files/directories, the prefix is **double underscore** (`__`), not single. Always verify pattern matches before acting.

## Commands

**Start development server:**
```bash
composer start
# Runs PHP built-in server at http://localhost:8000
```

**Compile/watch SCSS (theme plugin):**
```bash
cd site/plugins/hb-theme-hobbylog
npm run watch-styles   # Watch and compile SCSS
npm run build-styles   # One-time production build
```

**Admin panel:** `/panel` on the running dev server

There are no automated tests.

## Architecture

This is a [Kirby CMS](https://getkirby.com) site (v5.2, PHP 8.2+) for tracking Warhammer miniatures. Content is file-based — no traditional database.

### Plugin Structure

Custom functionality lives in two plugins under `site/plugins/`:

- **`hb-commons/`** — Shared utilities. Provides `Helpers::mapFiles()` and `Helpers::mapRequires()` for recursive directory scanning, plus shared blueprints/snippets/templates used across the site.
- **`hb-theme-hobbylog/`** — Main theme plugin. Contains all site-specific blueprints, snippets, templates, controllers, collections, and SCSS. Registers its files using `mapFiles` from hb-commons.

Both plugins use `index.php` as the entry point (Kirby plugin registration).

### `__` Prefix Convention

Files and directories prefixed with `__` are disabled/inactive. This applies to:
- Old plugin versions: `__hb-commons/`, `__hb-theme-hobbylog/`, `__my-hobbylog/`, `__kirby-imagex/`
- Root-level staging files: `__package.json`, `__src/`, `__assets/`

The active SCSS source and compiled CSS are in `site/plugins/hb-theme-hobbylog/src/scss/` and `site/plugins/hb-theme-hobbylog/assets/css/` respectively.

### Configuration

- `site/config/config.php` — Main config. Loads panel.php, private.php, routes.php, thumbs.php. Sets German locale (`de_DE.utf-8`), enables debug mode, declares active theme.
- `site/config/private.php` — Protected routes
- `site/config/routes.php` — Custom API routes (mostly commented out)
- `__hobbylog.json` — Hobby-specific data (Warhammer factions/subfactions)

### Kirby Concepts

- **Blueprints** (YAML in `blueprints/`) define page types and their fields
- **Templates** (PHP in `templates/`) render pages
- **Snippets** (PHP in `snippets/`) are reusable components
- **Collections** and **Controllers** provide data to templates
- Content pages live in `content/` as directories with text files

### Deployment

SFTP via VS Code (`.vscode/sftp.json`). The `kirby/`, `vendor/`, `content/`, `site/accounts/`, and `site/cache/` directories are gitignored.
