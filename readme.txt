=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Google Search Console, Content analysis, Readability
Requires at least: 4.8
Tested up to: 4.9.4
Stable tag: 7.1
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

= 7.0.3 =
Release Date: March 12th, 2018

Bugfixes:
* Fixes a bug where the option settings that needs to be migrated are backfilled prematurely, resulting in settings not being migrated as expected.
* Fixes a bug where adding a `wpseo_sitemap_entries_per_page` is not being applied as expected.

= 7.0.2 =
Release Date: March 8th, 2018

Bugfixes:
* Fixes a bug where a fatal error occurs on a taxonomy edit page when social graphs has been disabled for either Facebook or Twitter.
* Fixes a bug where the breadcrumb path were missing parent entries.
* Fixes a bug where RSS `before` and `after` content settings were being cleaned too aggressively.
* Fixes the problem that other plugins are depending on the options we've removed. This patch adds those options as backfills to make them available again.

= 7.0.1 =
Release Date: March 6th, 2018

Bugfixes:
* Fixes a bug where the some settings are not properly migrated after upgrading to 7.0.

= 7.0.0 =
Release Date: March 6th, 2018

Enhancements:
* Interface:
    * Introduces an overhaul of the Admin settings to simplify the plugin configuration.
    * Introduces a new setting to redirect attachment URLs. Previously, we had an option to redirect attachment URLs to their post parent. This didn't work for attachments that weren't attached to anything. This new setting redirects *all* attachment URLs to the URL of the original image / media item. This is all explained on the new `Media` tab under `Search Appearance`. This setting is enabled by default for new installations.
    * Moves the `Text link counter calculation` to the `Tools` submenu.
    * Moves the RSS tab from `Advanced` to `Search Appearance`.
    * Removes the option to remove the `replytocom` variable. We now disable this automatically with a filter (`wpseo_remove_reply_to_com`).
    * Removes the option to exclude an author from the XML sitemap in favor of a broader option. Instead, we now have an option to set whether this author's archive should be visible in the search results. If you choose not to allow this archive in the search results, it's also excluded from the author sitemap.
    * Removes the XML sitemaps settings page in favor of a feature toggle on the Features tab and a question in Titles & Meta's "Do you want to show X in search results?".
    * Moves the setting to disable the Advanced Meta Box for authors to the Features Tab. The setting now also defaults to 'On'.
    * Expands the content analysis headers by default.

* JSON+LD:
    * Shows JSON+LD markup for website and search on the front page.
    * Makes sure JSON+LD organization markup properly links to the frontpage.

* Copy:
    * Clarifies the copy on the Edit Post page to ask "Allow search engines to show this Post in search results?" instead of having a heading "Meta Robots", which was quite difficult to understand for non-SEO's. Similar changes have been made to the `follow` / `nofollow` setting.
    * Introduces the question: "Allow search engines to show this `<taxonomy>` in search results?" and bases both the `noindex` and the inclusion in XML sitemaps on this decision.
    * Changes the wording in the indexing dropdown menu in the Advanced Tab of the metabox from `Yes (Default for posts)` / `Yes` / `No` to `Default for Posts, currently: Yes` / `Yes` / `No`.
    * Renames the Dashboard menu item to General.

* Other:
    * Removes the feature that automatically removed stop words from the slug.
    * Removes `media` post type from the Configuration Wizard, which brings the question about indexing in line with the rest of the plugin.
    * Removes `jQuery UI autocomplete` from the enqueued scripts.
    * Adds a filter `wpseo_exclude_from_sitemap_by_post_ids` for controlling which posts are excluded from the sitemap.
    * Improves the switch toggle settings for use with assistive technologies.
    * Removes code to add a trailing slash in weird permutations of permalink settings. Canonical should solve this properly.
    * Removes the functionality to automatically remove blocking XML sitemap files.
    * Removes the clean permalinks feature, as it was created before canonical was introduced and is no longer needed.
    * Fixes a reference to the `ACF Content Analysis for Yoast SEO` plugin.
    * Removes all functions, methods and files that were deprecated since before version 4.0 and were showing a deprecation warning.
    * Removes the plugin conflict check for the `Head, Footer and Post Injections`-plugin as it no longer manages OpenGraph tags.
    * Migrates the `hideeditbox-<post type>` and `hideeditbox-tax-<taxonomy>` settings to a saner `display-metabox-pt-<post type>` and `display-metabox-tax-<taxonomy>` settings.

Bugfixes:

* Hides the "Save changes" button on option tabs where there is nothing to save.
* Fixes a bug where you would not stay on the same option tab after using the save button in Safari.
* When we set `noindex` on a page, we no longer add a canonical, to prevent confusing search engines.
* Fixes an issue where the categories / tags overview pages were incorrectly showing elements marked as noindex when in reality they weren't set to noindex (and vice versa). This meant that blue bullets were being shown incorrectly.
* Fixes an issue where setting posts and pages to noindex didn't change the overview.

Security:

* Fixes a security issue where importing of the values of ini files were being parsed for dynamic content.

= Earlier versions =

For the changelog of earlier versions, please refer to https://yoa.st/yoast-seo-changelog
