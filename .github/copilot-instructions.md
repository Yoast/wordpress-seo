# GitHub Copilot review instructions

Used here for **pull request reviews**. Canonical rules: [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`PULL_REQUEST_TEMPLATE.md`](./PULL_REQUEST_TEMPLATE.md). [`AGENTS.md`](../AGENTS.md) adds agent-behaviour guidance. If anything below contradicts these, prefer them.

## Review priorities

### PR hygiene

- Every required section of the PR template must have content — no empty bullets.
- At least one changelog bullet in the *Summary* section.
- A `changelog:` label attached (`bugfix`, `enhancement`, `other`, `non-user-facing`). Milestones are set by the merger, not the author.
- Bugfix entries follow `Fixes a bug where … (was …) when …` with past-tense inner verbs.
- Multiple changelog bullets only when (a) the PR has two logically distinct changes, (b) types differ — then use `[repo type]` override on the divergent bullets, or (c) the change must land in multiple repos/packages, in which case each extra bullet is prefixed with `[<repo-or-package>]`.
- Title under ~70 characters; Conventional Commits prefix where natural.
- Prefer atomic commits: if the PR mixes unrelated changes in a single commit (e.g. bugfix + refactor + tooling), suggest splitting into separate commits (or separate PRs) when practical.
- Flag padded PR descriptions. *Context* and *Relevant technical choices* should be one or two sentences; *Test instructions* should be concrete steps, not prose. Replace restatements of linked issues/epics with the link itself.
- Release-branch PRs (`release/*`): unreleased-bug fixes use `changelog: non-user-facing` and `Fixes an unreleased bug where …`.

### Tests and coverage

- New or changed PHP classes/methods should ship unit tests under `tests/Unit/…` mirroring the source path. One test method per tested method; shared setup via abstract base classes or traits.
- Coverage should not decrease. If it does, the PR's *Relevant technical choices* section must explain why tests weren't feasible.
- Flag PRs touching WP-integration code that have no integration coverage and no mention of `composer test-wp-env`.

### Code style and structure

- PHP must pass **Yoast Coding Standards** (`yoast/yoastcs`, a WPCS superset) — flag violations `composer check-branch-cs` would catch. Classes use snake_case with underscores (e.g. `Introductions_Collector`); namespaces under `Yoast\WP\SEO\…`.
- New self-contained features go under `src/<feature>/{domain,application,infrastructure,user-interface}/`. Dependencies point inward only — domain must not reference WP functions or infrastructure.
- Concept-based folders (`src/integrations/`, `src/generators/`, `src/presenters/`, …) are still valid when extending existing features.
- `admin/` and `inc/` are **maintenance-only** — flag new features placed there.
- New classes or changed constructors require `composer compile-di` and a committed `src/generated/container.php`.

### Safety

- Never hand-edited: `src/generated/`, `vendor/`, `vendor_prefixed/`, `build/`, `js/dist/`, `css/dist/`, `artifact/`, `svn-assets/`, `languages/`, `node_modules/`.
- Flag any committed secrets, credentials, or API keys.
- Flag disabled CS checks, skipped tests, or bypassed CI gates without explanation.
- Breaking changes to public extension points (filters, actions, surfaces, REST routes) must be called out in the PR body.

### Security

- Watch for SQL injection, XSS, CSRF, unescaped output, missing nonces on state-changing requests, and capability checks that are missing or wrong.
- Sanitise at input boundary (`sanitize_text_field`, `absint`, …) and escape on output (`esc_html`, `esc_attr`, `esc_url`).

## What NOT to flag

- Pre-existing issues in unchanged lines — focus on the diff.
- Thresholded phpcs warnings in legacy code; only flag *new* errors/warnings attributable to this PR.
- Style variants that match the surrounding file.
- Minor changelog wording variations that still follow the PR-template grammar rules.
