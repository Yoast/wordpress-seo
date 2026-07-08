Yoast SEO
=========
Requires at least: 6.8
Tested up to: 7.0
Requires PHP: 7.4

Changelog
=========

## 28.0

Release date: 2026-07-06

#### Enhancements

* Improves the compatibility with the atomic editor in Elementor V4.

#### Bugfixes

* Fixes a bug where raw `type` and `id` attributes were written on a link instead of `data-type` and `data-id`, when the link was added by selecting a suggestion in the block editor link popover.

#### Other

* Updates the guzzlehttp/guzzle and guzzlehttp/psr7 dependencies to patched releases that address known security advisories.

## 27.9

Release date: 2026-06-22

#### Enhancements

* Improves the performance of the content analysis by reusing previously built HTML trees across assessor runs, related-keyphrase passes and research calls instead of rebuilding the tree for each.
* Passes shortcodes to the Insights analysis data for more consistent analysis result across application.

#### Bugfixes

* Fixes a bug where the recently modified posts were fetched twice when using the Content Planner.

#### Other

* Adds the web-server family to the server data collected for opt-in tracking.

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/yoast-seo-changelog).
