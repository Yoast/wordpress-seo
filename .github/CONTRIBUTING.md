# Contribution Guidelines

Thanks for taking the time to contribute to Yoast SEO! Before filing a bug report, feature request, or pull request, please read the guidelines below.

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
* include as much information as possible — screenshots, relevant links, step-by-step reproductions, plugin/theme versions.

## I have a feature request

Before opening a new issue:

* search for duplicate issues to avoid filing the same request twice. If an open request already exists, please add your thoughts there.
* pick the Feature request issue form and explain *why* you think this feature is worth considering.

## I want to create a patch

Community patches, localizations, bug reports, and contributions are very welcome — they help Yoast SEO remain the #1 SEO plugin for WordPress.

### Supported environment

* PHP 7.4 or newer (8.x is supported too).
* The latest two major WordPress versions are officially supported.

### Opening a pull request

1. Fork the repository and create your branch from `trunk`. `trunk` is the active development branch and the default branch on GitHub — every PR should target it unless a maintainer asks otherwise. Do **not** target `main`: that branch tracks the latest released version and is not where new work goes.
2. Make your changes on your fork.
3. Follow the [Yoast Coding Standards](https://github.com/Yoast/yoastcs) (a superset of the [WordPress Coding Standards](https://make.wordpress.org/core/handbook/best-practices/coding-standards/)).
4. Document any new functions, actions, and filters following the [PHP inline-documentation standards](https://make.wordpress.org/core/handbook/best-practices/inline-documentation-standards/php/).
5. Write tests. We expect every PR that changes PHP behaviour to ship unit tests — see the commands in the checklist below.
6. Use the [Conventional Commits](https://www.conventionalcommits.org/) format for commit messages (e.g. `fix: …`, `feat(dashboard): …`). **Prefer atomic commits whenever practical** — each commit should represent a single logical change that can be reviewed or reverted on its own. If your PR mixes unrelated changes (e.g. a bugfix plus a refactor plus a tooling tweak), split them into separate commits or ideally separate PRs. Combining closely coupled changes into one commit is fine when splitting would be artificial.
7. Push your branch and open a pull request against `trunk`. **Use the pull request template** at [`.github/PULL_REQUEST_TEMPLATE.md`](./PULL_REQUEST_TEMPLATE.md) and fill in every section — even for small changes.

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

* Write one bullet describing the change in present tense, 3rd person singular, ending with a full stop. For bugfixes use the template `Fixes a bug where … (was …) when …`.
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
