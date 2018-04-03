=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Google Search Console, Content analysis, Readability
Requires at least: 4.8
Tested up to: 4.9.4
Stable tag: 7.2
Requires PHP: 5.2.4

Improve your WordPress SEO: Write better content and have a fully optimized WordPress site using the Yoast SEO plugin.

== Description ==

### Yoast SEO: the #1 WordPress SEO plugin

Need an SEO plugin that helps you reach for the stars? Yoast SEO is the original WordPress SEO plugin since 2008. It is the favorite tool of millions of users, ranging from the bakery around the corner to some of the most popular sites on the planet. With Yoast SEO, you get a solid toolset that helps you aim for that number one spot in the search results. Yoast: SEO for everyone.

Yoast SEO does everything in its power to please both visitors and search engine spiders. How? Below you’ll find a small sampling of the powers of Yoast SEO:

#### Taking care of your WordPress SEO

* The most advanced XML Sitemaps functionality at the push of a button.
* Full control over site breadcrumbs: add a piece of code and you’re good to go.
* Set canonical URLs to avoid duplicate content. Never have to worry about Google penalties again.
* Title and meta description templating for better branding and consistent snippets in the search results.
* **[Premium]** Expand Yoast SEO with the News SEO, Video SEO, Local SEO and WooCommerce SEO extensions.
* **[Premium]** Need help? Yoast SEO Premium users get 1 year free access to our awesome support team.

> Note: some features are Premium. Which means you need Yoast SEO Premium to unlock those features. You can [get Yoast SEO Premium here](https://yoa.st/1v8)!

#### Write killer content with Yoast SEO

* Content & SEO analysis: Invaluable tools to write SEO-friendly texts.
* The snippet preview shows you how your post or page will look in the search results - even on mobile. Yoast SEO Premium even has social media previews!
* **[Premium]** The Insights tool shows you what your text focuses on so you can keep your article in line with your keywords.
* **[Premium]** Multiple focus keywords: Optimize your article for synonyms and related keywords.
* **[Premium]** Automatic internal linking suggestions: write your article and get automatic suggested posts to link to.

#### Keep your site in perfect shape

* Yoast SEO tunes the engine of your site so you can work on creating great content.
* Our cornerstone content and internal linking features help you optimize your site structure in a breeze.
* Integrates with Google Search Console: See how your site performs in the search engines and fix crawl errors.
* Manage SEO roles: Give your colleagues access to specific sections of the Yoast SEO plugin.
* Bulk editor: Make large-scale edits to your site.
* **[Premium]** Social previews to manage the way your page is shared on social networks like Facebook and Twitter.
* **[Premium]** Redirect manager: It keeps your site healthy by easily redirecting errors from Google Search Console, deleted pages and changed URLs.

### Premium support

The Yoast team does not always provide active support for the Yoast SEO plugin on the WordPress.org forums, as we prioritize our email support. One-on-one email support is available to people who [bought Yoast SEO Premium](https://yoa.st/1v8) only.

Note that the [Yoast SEO Premium](https://yoa.st/1v8) also has several extra features too, including the option to have multiple focus keywords, internal linking suggestions, cornerstone content checks and a redirect manager, so it is well worth your investment!

You should also check out the [Yoast Local SEO](https://yoa.st/1uu), [Yoast News SEO](https://yoa.st/1uv) and [Yoast Video SEO](https://yoa.st/1uw) extensions to Yoast SEO. They work with the free version of Yoast SEO already, and these premium extensions of course come with support too.

### Bug reports

Bug reports for Yoast SEO are [welcomed on GitHub](https://github.com/Yoast/wordpress-seo). Please note GitHub is not a support forum, and issues that aren’t properly qualified as bugs will be closed.

### Further Reading

For more info, check out the following articles:

* The [Yoast SEO Plugin](https://yoa.st/1v8) official homepage.
* The [Yoast SEO Knowledgebase](https://yoa.st/1va).
* [WordPress SEO - The definitive Guide by Yoast](https://yoa.st/1v6).
* Other [WordPress Plugins](https://yoa.st/1v9) by the same team.
* Follow Yoast on [Facebook](https://facebook.com/yoast) & [Twitter](https://twitter.com/yoast).

== Installation ==

=== From within WordPress ===

1. Visit 'Plugins > Add New'
1. Search for 'Yoast SEO'
1. Activate Yoast SEO from your Plugins page.
1. Go to "after activation" below.

=== Manually ===

1. Upload the `wordpress-seo` folder to the `/wp-content/plugins/` directory
1. Activate the Yoast SEO plugin through the 'Plugins' menu in WordPress
1. Go to "after activation" below.

=== After activation ===

1. You should see (a notice to start) the Yoast SEO configuration wizard.
1. Go through the configuration wizard and set up the plugin for your site.
1. You're done!

== Frequently Asked Questions ==

You'll find answers to many of your questions on [kb.yoast.com](https://yoa.st/1va).

== Screenshots ==

1. The Yoast SEO plugin general meta box. You'll see this on edit post pages, for posts, pages and custom post types.
2. Example of the SEO analysis functionality.
3. Example of the readability analysis functionality.
4. Overview of site-wide SEO problems and possible improvements.
5. Control over which features you want to use.
6. Easily import SEO data from other SEO plugins like All In One SEO pack, HeadSpace2 SEO and wpSEO.de.

== Changelog ==

= 7.2.0 =
Release Date: April 3rd, 2018

Enhancements:
* Updates all Help Center videos with new recordings.
* Adds functionality to import noindex, nofollow and OpenGraph tags from All in One SEO Pack.
* Improves consistency of capitalization in settings and tabs.
* Improves the traffic light icon accessibility.
* Changes the words 'post type' into 'content type' throughout the plugin.

Bugfixes:
* Fixes a bug where the Facebook app-id could no longer be set in the Social settings.
* Fixes a bug where existing Yoast SEO data could be overwritten when importing data from All in One SEO Pack.
* Fixes a bug where the Ryte notification is not removed when disabling the Ryte feature.
* Fixes a bug where setting a page to `noindex` through the `wpseo_robots` filter did not properly remove the `canonical` element.
* Fixes a bug where attachments connected to password-protected parents are included in the sitemaps. Props [Scott Carter](https://gobarrelroll.com).
* Fixes alignment of the `Go Premium` notice.

= 7.1.0 =
Release Date: March 20th, 2018

Enhancements:
* Adds a filter to mark Spanish sentences as non-passive when certain exception words occur between the auxiliary and the participle. The list of exception words includes all forms of the copula 'estar'.
* Adds transition words assessment for Portuguese, props [amesdigital](https://github.com/amesdigital).
* Increases the height of the meta description box so it matches the maximum amount of characters without needing a scrollbar.
* Detects when you need to import old SEO plugin data and allows you to import it on the import plugins page. After importing you can check whether the import was completed successfully and then delete the data.
* Changes the formatting of text in the dashboard widget to improve the reading experience.
* Adds an extra argument to `wpseo_replacements` filter. This makes it possible to access post, taxonomy or term instances when applying the filter.
* Adds support for a new template variable `%%archive_title%%`.
* Remove all Facebook Insights functionality as it's no longer supported.

Bugfixes:
* Fixes a bug that broke a filter which marks Spanish and French sentences as non-passive when certain exception words occur between the auxiliary and the participle.
* Fixes a bug where the `page` and `paged` values could cause errors if they weren't properly handled as integers.
* Fixes a bug where division by zero errors in the passive voice assessment would cause `NaN%` to show up in the feedback.
* Fixes a bug where multiple `rel` arguments prevented correct `nofollow` detection.
* Fixes a bug where enabling the Show blog page in the breadcrumb settings had the inverse effect. Internally renamed `breadcrumbs-blog-remove` to `breadcrumbs-display-blog-page` to fix logic issues.
* Fixes a bug where the rewrite rules weren't removed after stripping the category base. This resulted in an unaccessible page.
* Fixes a bug where adding a `wpseo_sitemap_entries_per_page` was not being used when rendering the sitemaps.
* Fixes a bug where the Yoast logo in the Configuration Wizard was showing the old version.
* Removes the backfill hooks when calling `WPSEO_Options::get()` to improve performance.

= Earlier versions =

For the changelog of earlier versions, please refer to https://yoa.st/yoast-seo-changelog
