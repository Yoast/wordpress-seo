# AGENTS.md — Yoast SEO agent delta

This file follows the [AGENTS.md](https://agents.md/) convention (supported natively by OpenAI Codex, Cursor, Aider, Zed, Copilot, Gemini CLI, Windsurf, JetBrains Junie, and others; Claude Code reads it via a thin `CLAUDE.md` pointer).

**Read [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md) first.** It is the canonical source of truth for everything in this repository: architecture, repository layout, code placement, dependency injection, build and test commands, coding standards, commits, branches, the PR opening procedure, changelog rules, license, and security. This file does not repeat any of that — it only lists the behaviours specific to working in this repo as an **AI coding agent**.

If a rule appears to conflict between this file and `CONTRIBUTING.md` or [`.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md), prefer those. Edit the source, not this delta.

## Behaviour rules for agents

- **Delegate long-running commands.** Do not run `composer`, `yarn`, or `grunt` in the main session — the output clutters context. If a build-runner-style agent is available, delegate to it and have it return PASS/FAIL plus failing-case details only. When no such agent is available, summarise the output rather than inlining it.

- **Verify before you recommend.** Before citing a file path, function name, class, flag, or any other code identifier from memory, confirm it still exists — `ls`, `grep`, or a file read. Memory is a snapshot; the tree may have moved.

- **Ask, don't guess.**
  - If a change might affect Premium, Shopify, the Google Docs extension, another JS package, or any other repo but the diff does not prove it, ask before adding a cross-repo changelog entry or label.
  - If the licensing status of a piece of reused or AI-generated code is unclear, ask before including it. See [CONTRIBUTING.md → "License and copyright"](./.github/CONTRIBUTING.md#license-and-copyright).

- **Prefer editing over creating.** Before adding a new file, a new abstraction, or a new directory, search for where similar functionality already lives and extend that instead. New files are the last resort.

- **Don't paper over failures.** If a pre-push check, test, or coding-standard rule fails, fix it or flag it. Do not skip tests, lower CS thresholds, add ignore pragmas, bypass CI gates, or untick quality-assurance boxes on the PR template without explicit permission.

- **Respect the creator / merger split on PRs.** When opening a PR, never set the milestone and never add the `community-patch` label. Both are the merger's or automation's job. The full procedure lives in [`docs/workflows/create-pr.md`](./docs/workflows/create-pr.md) — follow it instead of reinventing the steps.

- **Don't hand-edit generated or vendored files.** `src/generated/`, `vendor/`, `vendor_prefixed/`, `build/`, `js/dist/`, `css/dist/`, `artifact/`, `languages/`, `node_modules/` — regenerate via the appropriate tooling. The full list and the tool for each is in [CONTRIBUTING.md → "Repository layout"](./.github/CONTRIBUTING.md#repository-layout).

- **Run `grunt build:images` when you touch images.** Adding or editing any `.png`, `.jpg`, `.gif`, or `.svg` file — primarily under `images/` or `svn-assets/` — requires running `grunt build:images` (or plain `grunt build`, which includes it) and committing the optimised output before the PR is opened or updated. The release pipeline re-runs `imagemin` and fails if the committed images aren't already optimised. Full detail in [CONTRIBUTING.md → "Before you push or open/update a PR"](./.github/CONTRIBUTING.md#before-you-push-or-openupdate-a-pr).

- **Keep changelog bullets to one short sentence.** Extra context goes in *Context* or *Relevant technical choices*, not in the bullet. See [CONTRIBUTING.md → "Changelog entry and label"](./.github/CONTRIBUTING.md#changelog-entry-and-label).

- **Default to CONTRIBUTING.md.** Anything not listed in this delta is in `CONTRIBUTING.md`, the PR template, or `src/README.md`. Read those before making assumptions.
