Yoast SEO
=========
Requires at least: 6.9
Tested up to: 7.1
Requires PHP: 7.4

Changelog
=========

## 28.3

Release date: 2026-08-18

#### Enhancements

* Adds a schemamap.xml file at the site root that exposes the aggregated schema map.
* Adds the failing object's type and ID to the SEO data optimization error report when an indexable cannot be built.
* Improves performance when running the SEO optimization by warming post and term caches in bulk.
* Improves the performance of generating XML sitemaps by warming post, term and featured-image caches in bulk.

#### Bugfixes

* Fixes a bug where the AI Content Planner inserted an empty paragraph block before the template blocks when a post type had a block template registered.

#### Other

* Sets the _WordPress tested up to_ version to 7.1.
* Sets the minimum supported WordPress version to 6.9.
* Adds a first-time guided tour to the bulk editor.


### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/yoast-seo-changelog).
