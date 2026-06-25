Yoast SEO
=========
Requires at least: 6.8
Tested up to: 7.0
Requires PHP: 7.4

Changelog
=========

## 27.9

Release date: 2026-06-22

#### Enhancements

* Improves the performance of the content analysis by reusing previously built HTML trees across assessor runs, related-keyphrase passes and research calls instead of rebuilding the tree for each.
* Passes shortcodes to the Insights analysis data for more consistent analysis result across application.

#### Bugfixes

* Fixes a bug where the recently modified posts were fetched twice when using the Content Planner.

#### Other

* Adds the web-server family to the server data collected for opt-in tracking.

## 27.8

Release date: 2026-06-09

#### Enhancements

* Significantly reduces loading times of the root sitemap on sites with many users.
* Reduces loading times of the author sitemap on sites with many users.
* Makes the schema aggregator faster by drastically reducing the roundtrips to the database, when indexables are disabled.
* Makes the SEO optimization faster by drastically reducing the roundtrips to the database.
* Prevents unnecessary expensive DB queries when admin pages are being visited.
* Optimizes expensive DB queries when performing actions in admin pages related to SEO optimization.

#### Bugfixes

* Ensures compatibility with the React 19 version bundled in Gutenberg 23.3 (WordPress 7.1), fixing several screens and components that could otherwise fail to render.
* Fixes a bug where the dismiss button in the Webinar promo notice in general page was transparent.
* Improves post editor rendering performance by stabilising Redux selector and `withSelect` references in multiple components to prevent unnecessary re-renders.
* Fixes a bug where NaN was set as the Primary taxonomy and triggered a console error.

#### Other

* Removes the Yoast group from the filter bar on the WordPress plugins list.
* Sets the title of a child task to "(no title)" in the task list, when the related post has no title.
* Introduces the `wpseo_custom_fields_pre_query` filter, allowing sites to short-circuit the potentially expensive custom-fields lookup in Yoast settings, with a pre-computed list or a custom query.

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/yoast-seo-changelog).
