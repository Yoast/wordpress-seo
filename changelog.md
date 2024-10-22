Yoast SEO
=========
Requires at least: 6.4
Tested up to: 6.6
Requires PHP: 7.2.5

Changelog
=========

## 23.7

Release date: 2024-10-22

Yoast SEO 23.7 brings more enhancements and bugfixes. [Find more information about our software releases and updates here](https://yoa.st/release-22-10-24).

#### Enhancements

* Removes the _keyphrase in slug_ assessment for static home pages.

#### Bugfixes

* Fixes a bug where a database error would occur when there were no public taxonomies available for indexing.
* Fixes a bug where another plugin running the `exit()` function inside the `plugin_loaded` hook would result in a fatal error. Props to [menno-ll](https://github.com/menno-ll).

#### Other

* Removes translation strings that are not meant for the Yoast SEO Free version from the plugin.
* Resets the notice for search engines discouraged when changing Search engine visibility to visible.

## 23.6

Release date: 2024-10-08

Yoast SEO 23.6 brings more enhancements and bugfixes. [Find more information about our software releases and updates here](https://yoa.st/release-8-10-24).

#### Enhancements

* Adds a filter to modify the sitemap's URL. Props to [ashujangra](https://github.com/ashujangra).
* Improves the _transition words_ assessment for Turkish and English by expanding the relevant lists of transitions words. Props to [abulu](https://wordpress.org/support/users/abulu/).
* Uses the full-sized counterpart when a resized first content image is used for Open Graph and X images.

#### Bugfixes

* Fixes a bug where the content analysis would error when removing an image caption in the default editor.
* Fixes a bug where the link popover would be hidden when editing a post in tablet/mobile view. Props to [stokesman](https://github.com/stokesman).
* Fixes a visual inconsistency where the descriptions of the disabled Premium policy settings would look enabled, when they are not enabled.

#### Other

* Sets the minimum supported WordPress version to 6.5.

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/yoast-seo-changelog).
