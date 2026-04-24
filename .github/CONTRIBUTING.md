# Contribution Guidelines

Thanks for taking the time to contribute to Yoast SEO! Before filing a bug report, feature request, or pull request, please read the guidelines below.

This file is the canonical contributor guide for this repository. It is written for both humans and AI coding tools. The repo-root [`AGENTS.md`](../AGENTS.md) adds a small set of behaviours specific to AI agents on top of the rules here; the [`PULL_REQUEST_TEMPLATE.md`](./PULL_REQUEST_TEMPLATE.md) carries the detailed changelog and label rules.

## Contents

- [How to use GitHub](#how-to-use-github)
- [Security issues](#security-issues)
- [I have found a bug](#i-have-found-a-bug)
- [I have a feature request](#i-have-a-feature-request)
- [I want to create a patch](#i-want-to-create-a-patch)
  - [License and copyright](#license-and-copyright)
  - [Supported environment](#supported-environment)
  - [Repository layout](#repository-layout)
  - [Where to put new code](#where-to-put-new-code)
    - [Onion dependency rules](#onion-dependency-rules)
    - [Legacy folders (`admin/`, `inc/`)](#legacy-folders-admin-inc)
  - [Dependency injection](#dependency-injection)
  - [PHP workflow](#php-workflow)
  - [JavaScript workflow](#javascript-workflow)
  - [Testing](#testing)
  - [Code style](#code-style)
  - [Opening a pull request](#opening-a-pull-request)
    - [Before you push or open/update a PR](#before-you-push-or-openupdate-a-pr)
  - [Changelog entry and label](#changelog-entry-and-label)
  - [Issues labelled _patch welcome_](#issues-labelled-_patch-welcome_)
  - [Submitting an issue you have found](#submitting-an-issue-you-have-found)
- [Additional resources](#additional-resources)

## How to use GitHub

We use GitHub exclusively for well-documented bugs, feature requests, and code contributions. Communication is always done in English.

For support with Yoast SEO we have the following channels:

* [Yoast Knowledge base](https://yoa.st/1y0)
* [Support forums](https://wordpress.org/support/plugin/wordpress-seo) on WordPress.org

If you have purchased one of [our premium plugins](https://yoa.st/1y1) you will receive personal support by email — see your purchase email for details.

## Security issues

Please do **not** report security issues on GitHub. Follow our [security program](https://yoast.com/security-program/) instead, or email the details to `security@yoast.com` so we can handle them quickly and responsibly.

## I have found a bug

Before opening a new issue, please:

* update to the latest versions of WordPress and the Yoast SEO plugins.
* search for duplicate issues to avoid filing the same report twice. If an open issue already exists, please comment on it.
* check our [knowledge base](https://yoa.st/1y0) — many common errors are documented there with possible solutions.
* pick the matching GitHub issue form (Bug report, Feature request, Design implementation, etc.) and fill in every section.
* check for [plugin and theme conflicts](https://yoa.st/1y2) and include your findings.
* check for [JavaScript errors in your browser's console](https://yoa.st/1y3) and include any output.
* include everything needed to understand and reproduce the problem — screenshots, clear reproduction steps, plugin and theme versions, and any relevant logs — but stay focused. A tight, reproducible report is easier to triage than a long narrative with unrelated context or commentary.

## I have a feature request

Before opening a new issue:

* search for duplicate issues to avoid filing the same request twice. If an open request already exists, please add your thoughts there.
* pick the Feature request issue form and explain *why* you think this feature is worth considering.

## I want to create a patch

Community patches, localizations, bug reports, and contributions are very welcome — they help Yoast SEO remain the #1 SEO plugin for WordPress.

### License and copyright

Yoast SEO is licensed under [GPL-2.0-or-later](../license.txt). By opening a pull request you confirm that your contribution is offered under the same license. Before contributing code, make sure that:

- You wrote the code yourself, or you have the right to relicense it under GPL-2.0-or-later.
- You have not copied code from sources whose license is incompatible with GPL-2.0-or-later (for example proprietary code, CC-licensed snippets that restrict commercial use, or GPL-3.0-only code).
- If you have reused code from a GPL-2.0-compatible source (MIT, BSD, public domain, Apache-2.0 where compatible, etc.), you have preserved the original copyright notice and license header, and noted the provenance in the commit message.
- You have not included code whose licensing status is unclear — including AI-generated code whose training or output terms you have not verified as compatible.

If you are unsure whether a piece of code is safe to include, ask in the issue or PR before opening it for review.

### Supported environment

* PHP 7.4 or newer (8.x is supported too).
* The latest two major WordPress versions are officially supported.
* The plugin is a single PHP plugin plus a Yarn workspaces / Lerna monorepo of JS packages under `packages/*`.

### Repository layout

The top-level folders you will touch (or explicitly avoid):

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
| `src/generated/` | Compiled Symfony DI container. **Gitignored, not committed**; the release-build pipeline bundles it into the shipped artifact. | **Never hand-edit** — regenerate via `composer compile-di` |
| `vendor/`, `vendor_prefixed/` | Composer dependencies (prefixed copies are scoped with `YoastSEO_Vendor`). | Never hand-edit |
| `build/`, `js/dist/`, `css/dist/`, `artifact/`, `languages/`, `node_modules/` | Generated or distribution artifacts. | Never hand-edit |
| `wp-seo.php`, `wp-seo-main.php`, `index.php` | Plugin bootstrap. Change only when the bootstrap itself needs to change. | With care |

### Where to put new code

Two organisational patterns coexist inside `src/`:

1. **Concept-based (older, still valid for extensions of existing features).** Code is grouped by its role in the plugin: `src/integrations/`, `src/conditionals/`, `src/generators/`, `src/actions/`, `src/presenters/`, `src/surfaces/`, `src/helpers/`, etc. When you are expanding a feature that already follows this layout — for example adding a new Schema piece, a new admin integration, or a new REST action — keep it in the matching folder and follow the surrounding patterns. See [`src/README.md`](../src/README.md) for a description of each concept folder.

2. **Feature-folder with onion layers (preferred for new self-contained features).** A new feature gets its own directory under `src/` with four subfolders:

   ```
   src/<feature>/
   ├── domain/          Pure business logic — no WordPress, no I/O.
   ├── application/     Use cases, orchestration, DTOs, interfaces.
   ├── infrastructure/  WordPress/DB/HTTP adapters; repository implementations.
   └── user-interface/  Integrations, REST routes, WP-CLI, presenters.
   ```

   Live examples in the repo: `src/dashboard/`, `src/introductions/`, `src/llms-txt/`, `src/schema-aggregator/`, `src/ai-*/`.

#### Onion dependency rules

- Domain depends on **nothing** outside itself (no WP functions, no framework, no infrastructure).
- Application depends on Domain only, and defines interfaces for anything it needs from Infrastructure.
- Infrastructure and User-Interface depend on Application and Domain — never the other way round.
- Cross-layer wiring happens through constructor injection via the Symfony DI container.

#### Legacy folders (`admin/`, `inc/`)

These contain pre-namespace, pre-onion code. Treat them as **maintenance-only**: fix bugs, keep them compatible, but do not add new features there. When a legacy class needs significant changes, consider whether the work justifies moving (or extracting a new service for) the affected responsibility into `src/`.

### Dependency injection

The plugin uses a compiled Symfony DI container. Services are auto-wired from `src/` based on their type hints.

- **Run `composer compile-di` whenever a change would affect the container.** In practice this means:
  - You added a new class under `src/`.
  - You changed a constructor signature of an existing class.
  - You added/removed a service definition or tag in `config/dependency-injection/` (if applicable).
- The regenerated files under `src/generated/` (`container.php`, `container.php.meta`) are **gitignored — do not commit them**. Every environment rebuilds its own container: `composer install` and `composer update` re-run `compile-di` via the `post-autoload-dump` hook, so local dev, CI, and the release build each regenerate it fresh. The compiled container *is* included in the shipped release artifact; it is just never part of the Git history.
- If CI fails during DI compilation after your changes, check that your new or modified classes resolve correctly via auto-wiring (type-hinted constructor arguments, correct namespaces, etc.).

### PHP workflow

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

### JavaScript workflow

| Command | What it does |
| --- | --- |
| `yarn install` | Install JS dependencies for the whole workspace. |
| `yarn start` | Webpack dev build with watch for the main JS bundle. |
| `yarn build` | Run the `build` script of every workspace package. |
| `yarn lint` | Lint every workspace package plus the repo-level tooling. |
| `yarn test` | Run every workspace's `test` script (Jest). |
| `grunt build` / `grunt build:dev` | Full plugin build (assets + images + i18n) via Grunt. |

Each package under `packages/*` has its own `package.json` with local scripts; prefer running those directly when iterating on a single package.

### Testing

- **Every PR that changes PHP behaviour should ship unit tests.** Place them under `tests/Unit/…` mirroring the path of the class under test.
- **Integration tests** (those that boot WordPress) live under `tests/WP/…` and run via `composer test-wp-env`, which starts an isolated WP in Docker through `@wordpress/env`.
- Test one method per test class where practical; share setup via abstract base classes or traits (examples already exist under `tests/Unit`).
- JS tests use Jest and live inside the relevant `packages/*/tests/` folder.
- If you cannot run the integration tests in your environment, say so explicitly in the PR description rather than skipping them silently.

### Code style

- Follow the existing code. When two styles look plausible, match the file you are editing.
- PHP: Yoast CS (`yoast/yoastcs`). Class files use **snake_case with underscores** (e.g. `Introductions_Collector`) — this is Yoast's convention even though it differs from PSR. Namespaces live under `Yoast\WP\SEO\…`.
- JavaScript/TypeScript: the shared `@yoast/eslint-config`, plus per-package overrides where they exist.
- Comments: document **why**, not **what**. End every inline comment with a full stop.
- Don't add features, scaffolding, or abstractions the task doesn't need.

### Opening a pull request

1. Fork the repository and create your branch from `trunk`. `trunk` is the active development branch and the default branch on GitHub — every PR should target it unless a maintainer asks otherwise. Do **not** target `main`: that branch tracks the latest released version and is not where new work goes. When the work tracks a GitHub issue, name your branch `<issue-number>-<short-description>` (e.g. `2056-paid-upgrades`).
2. Make your changes on your fork.
3. Follow the [Yoast Coding Standards](https://github.com/Yoast/yoastcs) (a superset of the [WordPress Coding Standards](https://make.wordpress.org/core/handbook/best-practices/coding-standards/)).
4. Document any new functions, actions, and filters following the [PHP inline-documentation standards](https://make.wordpress.org/core/handbook/best-practices/inline-documentation-standards/php/).
5. Write tests. We expect every PR that changes PHP behaviour to ship unit tests — see the commands in the checklist below.
6. Use the [Conventional Commits](https://www.conventionalcommits.org/) format for commit messages (e.g. `fix: …`, `feat(dashboard): …`). **Prefer atomic commits whenever practical** — each commit should represent a single logical change that can be reviewed or reverted on its own. If your PR mixes unrelated changes (e.g. a bugfix plus a refactor plus a tooling tweak), split them into separate commits or ideally separate PRs. Combining closely coupled changes into one commit is fine when splitting would be artificial.
7. Push your branch and open a pull request against `trunk`. **Use the pull request template** at [`.github/PULL_REQUEST_TEMPLATE.md`](./PULL_REQUEST_TEMPLATE.md) and fill in every section — even for small changes.
8. **Keep the PR description focused.** Fill every required section of the template with what the reviewer actually needs — no more. *Context* and *Relevant technical choices* are usually one or two clear sentences; *Test instructions* are concrete steps, not essays. Don't pad sections to look thorough; reviewers read every line, and padding makes the substance harder to find. Summarise — link to the epic, issue, or design doc instead of restating them.

#### Before you push or open/update a PR

Run these checks locally and make sure each one is clean. CI will run the same checks — catching issues locally is faster and easier than fixing them afterwards on a review cycle.

* `composer test` — the unit test suite must pass.
* `composer test-wp-env` — the WordPress integration tests (Docker via `@wordpress/env`) must pass if your change touches code that has or needs WP integration coverage.
* `composer check-branch-cs` — checks the Yoast coding-standard ruleset against the files you changed on this branch. It must report **no new errors or warnings** introduced by your branch. Use `composer fix-cs` to auto-fix what it can, and address the rest by hand.
* `composer lint-branch` — PHP parse-error check on the files changed on this branch.
* For changes under `packages/*` or `js/`: run `yarn lint` and the relevant package's `yarn test`.

**Coverage:** every PR should *increase* test coverage, or at minimum keep it flat. In practice this means the code you add should come with tests that exercise it. CI reports the coverage delta on the PR — if coverage drops, explain in the PR description why it was not possible to add tests for the new code (for example: pure wiring code that can only be exercised through a full WordPress boot, or a third-party API call that is impractical to mock).

If a check fails or you need to skip one (e.g. you can't run Docker locally for `test-wp-env`), say so explicitly in the PR description so reviewers know what still needs validating.

### Changelog entry and label

Every PR needs a **changelog entry** in the Summary section of the PR body and a **changelog label** on the PR itself:

* Write one bullet describing the change in present tense, 3rd person singular, ending with a full stop. For bugfixes, describe the incorrect behaviour followed by the condition that triggered it, in clear past tense, avoiding hypothetical or nested conditionals (e.g. `Fixes a bug where X happened when Y` or `Fixes a bug where X was caused by Y`). See [`PULL_REQUEST_TEMPLATE.md`](./PULL_REQUEST_TEMPLATE.md) for the full grammar and examples.
* Attach one of: `changelog: bugfix`, `changelog: enhancement`, `changelog: other`, `changelog: non-user-facing`.
* If the change also affects another Yoast repo or package, add an extra bullet prefixed with `[<repo-or-package>]`. The PR template explains this in more detail.

The `community-patch` label is applied automatically to external contributions — you do not need to add it yourself. Milestones are set by the maintainer who merges your PR.

### Issues labelled _patch welcome_

Issues tagged with the `patch welcome` label are enhancements we see value in but have not prioritised. If you'd like to take one on, write a patch and we'll review it.

### Submitting an issue you have found

Make sure your problem doesn't already have a ticket by searching [the existing issues](https://github.com/Yoast/wordpress-seo/issues). If you can't find anything matching, please [open a new issue](https://github.com/Yoast/wordpress-seo/issues/new/choose).

## Additional resources

* [Yoast developer portal](https://developer.yoast.com/)
* [Yoast SEO API](https://yoa.st/1y4)
* [General GitHub documentation](https://docs.github.com/)
* [GitHub Pull Request documentation](https://docs.github.com/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
