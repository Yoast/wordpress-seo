# Creating a pull request

This is the canonical workflow for opening a pull request on this repository. It is written to be followed by both humans and AI coding agents. Tool-specific entry points — the Claude Code skill, the Cursor rule, any future Copilot chat mode — should be thin pointers to this file so every tool follows the same procedure.

Rules and templates live elsewhere — this file is the **procedure**:

- **Changelog grammar, label rules, bracket-prefix rules, release-branch rules** → [`.github/PULL_REQUEST_TEMPLATE.md`](../../.github/PULL_REQUEST_TEMPLATE.md)
- **Architecture, repository layout, placement rules, dependency injection, build/test commands, Yoast CS ruleset, testing policy, coverage policy, commit style, branching, pre-push checks** → [`.github/CONTRIBUTING.md`](../../.github/CONTRIBUTING.md)
- **Agent-specific behaviours (delegate long-running commands, verify before recommending, ask don't guess)** → [`AGENTS.md`](../../AGENTS.md)

If anything here contradicts those files, prefer them. Edits to rules belong there, not in this file.

## 0. Creator vs. merger responsibilities

Every merged PR needs a milestone, a changelog entry, and a changelog label. Split:

- **Creator provides:** a changelog entry (in the PR body) and a changelog label on the PR.
- **Creator MUST NOT set:** the milestone. That is the merger's job. Do not add a milestone via `gh pr edit --milestone`.

## 1. Gather context

Run in parallel:

- `git status`
- `git diff`
- `git log <base>..HEAD` and `git diff <base>...HEAD` — inspect **every** commit since the branch diverged, not just the tip
- Check whether the branch has an upstream and is up to date

Identify the base branch: usually `trunk`. PRs targeting `release/*` follow stricter label rules — see the PR template.

Read [`.github/PULL_REQUEST_TEMPLATE.md`](../../.github/PULL_REQUEST_TEMPLATE.md) so the PR body matches it section-for-section.

## 2. Verify checks

Follow the pre-push checklist in [`.github/CONTRIBUTING.md` — "Before you push or open/update a PR"](../../.github/CONTRIBUTING.md). All required checks must pass **before** calling `gh pr create`. Do not silently skip a check; if something cannot be run locally (e.g. `composer test-wp-env` without Docker), disclose it in the PR body's *Test instructions* section.

Do not paper over failures by excluding tests, lowering CS thresholds, or adding ignore pragmas without explicit permission.

If a `build-runner`-style agent is available in your tool, delegate the actual command execution there so the main session stays focused on the workflow.

## 3. Decide how many changelog bullets the PR needs

Default is **one bullet**, describing one logical change. Write more than one bullet only in these cases:

- **Case A — multiple distinct changes in the same repo and same label.** One bullet per change; no brackets.
- **Case B — bullets with different changelog types.** Add a `[repo type]` override only on the bullets whose type *differs* from the PR label; bullets that match the PR label stay unprefixed.
- **Case C — impact on multiple repos or packages.** One bullet per affected changelog, each prefixed with `[<repo-or-package>]`. Routing prefix is mandatory for non-Free targets.

Grammar, bracket syntax, semver hints, bugfix template, and the release-branch label rules all live in the PR template — follow the template, do not restate the rules here or in the PR body.

If you are not certain a change affects another repo (Premium, Shopify, etc.), ask the user rather than guessing.

## 4. Fill every PR-template section

Cover every section of `.github/PULL_REQUEST_TEMPLATE.md`:

- **Context** — *why* the change is being made.
- **Summary** — the bullet(s) from step 3.
- **Relevant technical choices** — non-obvious decisions, trade-offs, architectural notes. **If coverage decreased, explain here why tests weren't feasible.**
- **Test instructions (acceptance)** — step-by-step, aimed at non-technical users.
- **Relevant test scenarios** — tick the boxes that apply and explain why for each ticked box.
- **QA instructions** — tick the "same steps as above" box if applicable, otherwise write separate steps (or link to the epic).
- **Impact check** — parts of the plugin that may need regression testing.
- **Other environments** — tick Shopify / Google Docs boxes only when the corresponding entry is present in step 3.
- **Documentation / Quality assurance / Innovation** checkboxes — tick only those that are actually true.
- **Fixes #** — link the issue being closed, if any.

Preserve the HTML comments from the template so future editors keep the same structure.

## 5. Create and label the PR

1. Push the branch if it has no upstream: `git push -u origin <branch>`.
2. `gh pr create --title "<title>" --body "$(cat <<'EOF' ... EOF)"`.
   - Title under 70 characters. Use a Conventional Commits prefix when natural (`fix: …`, `feat(dashboard): …`).
   - The body is the completed template, verbatim-structured.
3. Apply the changelog label immediately: `gh pr edit <number> --add-label "changelog: <type>"`. Attach Shopify / Google Docs / innovation labels in the same call only when the corresponding condition holds.
4. **Never set the milestone.**
5. Return the PR URL.

## 6. Self-check

Before reporting the PR as created, verify:

- [ ] Pre-push checks (step 2) ran and passed — any skipped check is disclosed in the PR body.
- [ ] Coverage increased or held flat — or the *Relevant technical choices* section explains why tests weren't feasible.
- [ ] The body contains at least one changelog bullet, correctly prefixed for every affected changelog.
- [ ] Exactly one `changelog:` label is attached; Shopify / Google Docs / innovation labels match the content.
- [ ] Bugfix bullets describe the incorrect behaviour followed by the triggering condition, in past tense, per the PR template's grammar rules.
- [ ] Every PR-template section has content — no empty bullets, no leftover placeholder text.
- [ ] No milestone was set.
- [ ] If the branch adds or edits any image or SVG, `grunt build:images` was run and its optimised output committed. Tick the matching *Quality assurance* checkbox in the PR body.

If any item fails, fix it (edit the body or labels with `gh pr edit`) before returning the URL.
