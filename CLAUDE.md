# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Stack

- **Backend:** Kirby CMS v5.2 (PHP 8.2+) — headless API via KQL
- **Frontend:** SvelteKit (TypeScript, `adapter-static`) in `frontend/`
- **Styling:** Tailwind CSS v4 (SvelteKit frontend)
- **Hosting:** Shared PHP hosting (no SSH, no Node.js runtime) — SvelteKit builds statically and deploys via FTP
- Always be aware of both the Kirby backend (PHP) and SvelteKit frontend contexts when making changes.

## Workflow Preferences

- At session start, consult CLAUDE.md and the latest `docs/*.html` file for full context on prior decisions.
- When asked to "document the session", export a conversation summary to a file in `docs/` (HTML or Markdown with today's date) — do NOT just save memory notes to MEMORY.md.
- At session end, offer to update/append to the session docs file.

## Communication Style

- Explain your plan BEFORE making changes. Wait for confirmation before implementing.
- For file operations (deletion, renaming, cleanup): enumerate ALL target files with full paths first, confirm with the user, then execute.

## Commands

**Start development servers:**
```bash
make backend   # Kirby PHP server at http://localhost:8000
make frontend  # SvelteKit dev server at http://localhost:5173
```

**Admin panel:** `/panel` on the running backend

There are no automated tests.

## Architecture

This is a [Kirby CMS](https://getkirby.com) site (v5.2, PHP 8.2+) for tracking Warhammer miniatures. Content is file-based — no traditional database. Kirby serves as a headless API backend only; all rendering is handled by the SvelteKit frontend.

### Plugins

Only one active plugin: **`kql`** (Kirby Query Language API). No custom plugins.

### Configuration

- `site/config/config.php` — Main config. KQL auth (disabled for local dev), CORS hook, locale, loads `panel.php` and `private.php`.
- `site/config/config.localhost.php` — Sets `hb.frontend_url = http://localhost:5173`
- `site/config/config.hobbylog.hendrik-berends.de.php` — Production overrides (KQL auth enabled)
- `site/config/private.php` — Protected routes

### Blueprints & Models

- Blueprints live in `site/blueprints/` (`pages/`, `fields/`, `sections/`)
- Models live in `site/models/` — `DefaultPage` and `HomePage` with `previewUrl()` pointing to SvelteKit

### Kirby Concepts

- **Blueprints** (YAML in `site/blueprints/`) define page types and their fields
- Content pages live in `content/` as directories with text files

### Deployment

SFTP via VS Code (`.vscode/sftp.json`). The `kirby/`, `vendor/`, `content/`, `site/accounts/`, and `site/cache/` directories are gitignored.
