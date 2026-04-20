# AGENTS.md — Yoast SEO

This file is the shared context for coding agents and human contributors working on the Yoast SEO plugin. It follows the [AGENTS.md](https://agents.md/) convention, which is recognised by most major AI coding tools (OpenAI Codex, Cursor, Aider, Zed, Copilot, Gemini CLI, Windsurf, JetBrains Junie, and others). Claude Code reads it via a thin `CLAUDE.md` pointer.

Use it to orient yourself to the conventions, tooling, and architectural direction of the repository. External contributors are encouraged to read it before opening a PR.

If something here contradicts `.github/CONTRIBUTING.md`, prefer the latter. If you find a genuinely stale or incorrect instruction, please update it in the same PR.

## Project at a glance

- **What it is:** the Yoast SEO WordPress plugin, distributed on wordpress.org and extended by a family of premium add-ons.
- **Default branch:** `trunk` (active development). All PRs should target `trunk` unless a reviewer asks otherwise. A separate `main` branch also exists and tracks the latest released version — it is **not** the development branch; do not open PRs against it.
- **Supported runtime versions:** PHP 7.4 (also supports PHP 8.x). WordPress: the latest two major versions are officially supported.
- **Packaging model:** single PHP plugin, plus a Yarn workspaces / Lerna monorepo of JS packages under `packages/*`.

## Repository layout

Top-level folders you will touch (or explicitly avoid):

| Path | Purpose | Editable? |
| --- | --- | --- |
| `src/` | Namespaced PHP. All new backend work lives here. | Yes |
| `packages/js/` | The primary JS bundle shipped with the plugin. | Yes |
| `packages/*` | Shared JS/TS libraries (UI library, analysis engine, etc.). | Yes |
| `tests/` | PHPUnit tests (unit + WP integration). | Yes |
| `config/` | Grunt, webpack, php-scoper, wp-env, composer actions, build scripts. | Yes, with care |
| `docs/` | Repo-local developer notes. | Yes |
| `admin/`, `inc/` | Legacy non-namespaced PHP. | **Maintenance only** — see below |
| `lib/` | Low-level utilities (ORM, migrations). Touch only when needed. | Maintenance |
| `src/generated/` | Compiled Symfony DI container. | **Never hand-edit** — regenerate via `composer compile-di` |
| `vendor/`, `vendor_prefixed/` | Composer dependencies (prefixed copies are scoped with `YoastSEO_Vendor`). | Never hand-edit |
| `build/`, `js/dist/`, `css/dist/`, `artifact/`, `svn-assets/`, `languages/`, `node_modules/` | Generated or distribution artifacts. | Never hand-edit |
| `wp-seo.php`, `wp-seo-main.php`, `index.php` | Plugin bootstrap. Change only when the bootstrap itself needs to change. | With care |

## Where to put new code

Two organisational patterns coexist inside `src/`:

1. **Concept-based (older, still valid for extensions of existing features).** Code is grouped by its role in the plugin: `src/integrations/`, `src/conditionals/`, `src/generators/`, `src/actions/`, `src/presenters/`, `src/surfaces/`, `src/helpers/`, etc. When you are expanding a feature that already follows this layout — for example adding a new Schema piece, a new admin integration, or a new REST action — keep it in the matching folder and follow the surrounding patterns. See `src/README.md` for a description of each concept folder.

2. **Feature-folder with onion layers (preferred for new self-contained features).** A new feature gets its own directory under `src/` with four subfolders:

   ```
   src/<feature>/
   ├── domain/          Pure business logic — no WordPress, no I/O.
   ├── application/     Use cases, orchestration, DTOs, interfaces.
   ├── infrastructure/  WordPress/DB/HTTP adapters; repository implementations.
   └── user-interface/  Integrations, REST routes, WP-CLI, presenters.
   ```

   Live examples in the repo: `src/dashboard/`, `src/introductions/`, `src/llms-txt/`, `src/schema-aggregator/`, `src/ai-*/`.

### Onion dependency rules

- Domain depends on **nothing** outside itself (no WP functions, no framework, no infrastructure).
- Application depends on Domain only, and defines interfaces for anything it needs from Infrastructure.
- Infrastructure and User-Interface depend on Application and Domain — never the other way round.
- Cross-layer wiring happens through constructor injection via the Symfony DI container.

### Legacy folders (`admin/`, `inc/`)

These contain pre-namespace, pre-onion code. Treat them as **maintenance-only**: fix bugs, keep them compatible, but do not add new features there. When a legacy class needs significant changes, consider whether the work justifies moving (or extracting a new service for) the affected responsibility into `src/`.

## Dependency injection

The plugin uses a compiled Symfony DI container. Services are auto-wired from `src/` based on their type hints.

- **Run `composer compile-di` whenever a change would affect the container.** In practice this means:
  - You added a new class under `src/`.
  - You changed a constructor signature of an existing class.
  - You added/removed a service definition or tag in `config/dependency-injection/` (if applicable).
- Commit the regenerated `src/generated/container.php` and `src/generated/container.php.meta`. The `post-autoload-dump` hook also runs this, so it usually happens automatically on `composer install` / `composer update`.
- If CI complains about the container being out of sync, re-run `composer compile-di` and commit the result.

## PHP workflow

All commands are run from the repo root.

| Command | What it does |
| --- | --- |
| `composer install` | Install PHP dependencies (also compiles DI and prefixes vendor packages). |
| `composer lint` | PHP parse-error check across the repo. |
| `composer lint-branch` | Same, but only for files changed on the current branch. |
| `composer check-cs` | Run phpcs with the Yoast ruleset (errors only). |
| `composer check-branch-cs` | Run phpcs against the files changed on the current branch. |
| `composer fix-cs` | Auto-fix fixable phpcs violations. |
| `composer test` | Run PHPUnit unit tests (no WP, no coverage). |
| `composer test-wp-env` | Run WP integration tests inside the `wp-env` Docker environment (preferred way to run integration tests locally). |
| `composer coverage` / `coverage-wp-env` | Same, with coverage. |
| `composer compile-di` | Rebuild the DI container. |
| `composer generate-migration` | Scaffold a new DB migration under `src/config/migrations/`. |
| `composer generate-unit-test` | Scaffold a unit-test file for a fully-qualified class name. |

Coding standards are enforced by the Yoast Coding Standard (`yoast/yoastcs`) — a superset of WordPress Coding Standards — plus parallel-lint for syntax. Run `composer check-branch-cs` before opening a PR.

## JavaScript workflow

| Command | What it does |
| --- | --- |
| `yarn install` | Install JS dependencies for the whole workspace. |
| `yarn start` | Webpack dev build with watch for the main JS bundle. |
| `yarn build` | Run the `build` script of every workspace package. |
| `yarn lint` | Lint every workspace package plus the repo-level tooling. |
| `yarn test` | Run every workspace's `test` script (Jest). |
| `grunt build` / `grunt build:dev` | Full plugin build (assets + images + i18n) via Grunt. |

Each package under `packages/*` has its own `package.json` with local scripts; prefer running those directly when iterating on a single package.

## Testing policy

- **Every PR that changes PHP behaviour should ship unit tests.** Place them under `tests/Unit/...` mirroring the path of the class under test.
- **Integration tests** (those that boot WordPress) live under `tests/WP/...` and run via `composer test-wp-env`, which starts an isolated WP in Docker through `@wordpress/env`.
- Test one method per test class where practical; share setup via abstract base classes or traits (examples already exist under `tests/Unit`).
- JS tests use Jest and live inside the relevant `packages/*/tests/` folder.
- If you cannot run the integration tests in your environment, say so explicitly in the PR description rather than skipping them silently.

## Code style

- Follow the existing code. When two styles look plausible, match the file you are editing.
- PHP: Yoast CS (`yoast/yoastcs`). Class files use **snake_case with underscores** (e.g. `Introductions_Collector`) — this is Yoast's convention even though it differs from PSR. Namespaces live under `Yoast\WP\SEO\...`.
- JavaScript/TypeScript: the shared `@yoast/eslint-config`, plus per-package overrides where they exist.
- Comments: document **why**, not **what**. End every inline comment with a full stop.
- Don't add features, scaffolding, or abstractions the task doesn't need.

## Commits, branches, and pull requests

- **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, `perf:`, `ci:`, `style:`). Include a scope when useful: `feat(dashboard): ...`.
- **Prefer atomic commits whenever practical.** Each commit should represent a single logical change that compiles, passes tests on its own, and can be reviewed (or reverted) in isolation. If a PR mixes unrelated changes — e.g. a bug fix plus a refactor plus a tooling tweak — split them into separate commits (or, ideally, separate PRs). It's fine to combine closely coupled changes into one commit when splitting would be artificial.
- Branch names: `<issue-number>-<short-description>` when the work tracks a GitHub issue (e.g. `2056-paid-upgrades`).
- Target `trunk`. Use the PR template at `.github/PULL_REQUEST_TEMPLATE.md` — every section is there for a reason; fill it in even for small changes.
- Apply a changelog label: `changelog: bugfix`, `changelog: enhancement`, `changelog: other`, or `changelog: non-user-facing`.
- External contributors do **not** need to apply any special label — the `community-patch` label is applied automatically on GitHub.
- Never commit generated artifacts by hand; let the tooling regenerate them (DI container, i18n files, built JS/CSS, prefixed vendors).

## Security

Do **not** file security issues in public GitHub. Email `security@yoast.com` — see `.github/CONTRIBUTING.md` for details. Never commit credentials, API keys, or test fixtures that contain sensitive data.

## Further reading

- [Yoast developer portal](https://developer.yoast.com/) — user-facing extension and integration documentation (schema, indexables, surfaces, filters).
- `src/README.md` — overview of the concept-based folders inside `src/`.
- [WordPress Coding Standards](https://make.wordpress.org/core/handbook/best-practices/coding-standards/) and [PHP inline-documentation standards](https://make.wordpress.org/core/handbook/best-practices/inline-documentation-standards/php/).
