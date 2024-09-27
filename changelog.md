Yoast SEO
=========
Requires at least: 6.4
Tested up to: 6.6
Requires PHP: 7.2.5

Changelog
=========

## 23.7

Release date: 2024-10-08
Changes compared to: 23.6-RC1

Enhancements:

* Adds a filter to modify the sitemap's URL. Props to @ashujangra. [#21611](https://github.com/Yoast/wordpress-seo/pull/21611)
* Uses the full-sized counterpart when a resized first content image is used for Open Graph and X images. [#21534](https://github.com/Yoast/wordpress-seo/pull/21534)
* Improves the _transition words_ assessment for Turkish and English by expanding the relevant lists of transitions words. Props to [abulu](https://wordpress.org/support/users/abulu/). [#21616](https://github.com/Yoast/wordpress-seo/pull/21616)

Bugfixes:

* Fixes a bug where the link popover would be hidden when editing a post in tablet/mobile view. Props to [stokesman](https://github.com/stokesman). [#21615](https://github.com/Yoast/wordpress-seo/pull/21615)
* Fixes a bug where the content analysis would error when removing an image caption in the default editor. [#21590](https://github.com/Yoast/wordpress-seo/pull/21590)
* Fixes a visual inconsistency where the descriptions of the disabled Premium policy settings would look enabled, when they are not enabled.  [#21581](https://github.com/Yoast/wordpress-seo/pull/21581)

Non user facing:

* Adds an empty placeholder for a new dashboard page. [#21606](https://github.com/Yoast/wordpress-seo/pull/21606)
* Refactor server side check for whether Woocommerce is active. [#21598](https://github.com/Yoast/wordpress-seo/pull/21598)
* Fixes a bug where webinar link would be missing when on settings page. [#21612](https://github.com/Yoast/wordpress-seo/pull/21612)
* Adds a sidebar to the new dashboard page. [#21614](https://github.com/Yoast/wordpress-seo/pull/21614)
* Refactor check for news SEO add-on. [#21620](https://github.com/Yoast/wordpress-seo/pull/21620)
* Refactors the way we check for woocommerce and woo seo in the editor. [#21617](https://github.com/Yoast/wordpress-seo/pull/21617)
* Adds problems and notifications sections in alert center. [#21646](https://github.com/Yoast/wordpress-seo/pull/21646)
* Prevents a deprecation warning when editing a post with Gutenberg version 19.1. [#21634](https://github.com/Yoast/wordpress-seo/pull/21634)
* Refactors isPrivateBlog preference. [#21629](https://github.com/Yoast/wordpress-seo/pull/21629)
* Removes outdated user language code property from window object.  [#21627](https://github.com/Yoast/wordpress-seo/pull/21627)
* Refactor check if AI feature is active property. [#21633](https://github.com/Yoast/wordpress-seo/pull/21633)
* Refactor sitewide Social image property. [#21631](https://github.com/Yoast/wordpress-seo/pull/21631)
* Refactor the social appearance property in editors. [#21639](https://github.com/Yoast/wordpress-seo/pull/21639)
* Integrates the FTC into the new dashboard [#21623](https://github.com/Yoast/wordpress-seo/pull/21623)
* Rewrites JavaScript `prototype`-based classes inside `yoastseo` package into the newer `class` syntax. [#21325](https://github.com/Yoast/wordpress-seo/pull/21325)
* Moves the new dashboard page to the root of the Yoast SEO menu [#21641](https://github.com/Yoast/wordpress-seo/pull/21641)
* Adds notification and problem information to the script data. [#21647](https://github.com/Yoast/wordpress-seo/pull/21647)
* Adds black friday promotion dates and content. [#21601](https://github.com/Yoast/wordpress-seo/pull/21601)
* Adds black friday promotion dates and content. [#21601](https://github.com/Yoast/wordpress-seo/pull/21601)
* Add paper styling to different components that are part of the new dashboard. [#21642](https://github.com/Yoast/wordpress-seo/pull/21642)
* Fixes an unreleased bug where the `NEW_DASHBOARD_UI` feature flag would negatively influence other admin pages. [#21650](https://github.com/Yoast/wordpress-seo/pull/21650)
* Remove unreleased jetpack ad code. [#21613](https://github.com/Yoast/wordpress-seo/pull/21613)
* Removes the `woocommerceUpsell` property from `wpseoScriptData`. [#21589](https://github.com/Yoast/wordpress-seo/pull/21589)
* Removes outdated translations properties from fields definitions. [#21592](https://github.com/Yoast/wordpress-seo/pull/21592)
* Moves woocommerce and jetpack boost upsell links to client side. [#21582](https://github.com/Yoast/wordpress-seo/pull/21582)

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/yoast-seo-changelog).
