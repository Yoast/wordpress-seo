=== WordPress SEO by Yoast ===
Contributors: joostdevalk
Donate link: http://yoast.com/
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: seo, SEO, google, meta, meta description, search engine optimization, xml sitemap, xml sitemaps, google sitemap, sitemap, sitemaps, robots meta, rss, rss footer, yahoo, bing, news sitemaps, XML News Sitemaps, WordPress SEO, WordPress SEO by Yoast, yoast, multisite, canonical, nofollow, noindex, keywords, meta keywords, description, webmaster tools, google webmaster tools, seo pack
Requires at least: 3.3
Tested up to: 3.6
Stable tag: 1.4.13

Improve your WordPress SEO: Write better content and have a fully optimized WordPress site using the WordPress SEO plugin by Yoast.

== Description ==

WordPress out of the box is already technically quite a good platform for SEO, this was true when I wrote my original [WordPress SEO](http://yoast.com/articles/wordpress-seo/) article in 2008 and it's still true today, but that doesn't mean you can't improve it further! This plugin is written from the ground up by [WordPress SEO consultant](http://yoast.com/hire-me/wordpress-seo-consultant/) and [WordPress developer](http://yoast.com/hire-me/wordpress-developer/) Joost de Valk to improve your site's SEO on *all* needed aspects. While this [WordPress SEO plugin](http://yoast.com/wordpress/seo/) goes the extra mile to take care of all the technical optimization, more on that below, it first and foremost helps you write better content.  WordPress SEO forces you to choose a focus keyword when you're writing your articles, and then makes sure you use that focus keyword everywhere.

= Write better content with WordPress SEO =
Using the snippet preview you can see a rendering of what your post or page will look like in the search results, whether your title is too long or too short and your meta description makes sense in the context of a search result. This way the plugin will help you not only increase rankings but also increase the click through for organic search results.

= Page Analysis =
The WordPress SEO plugins [Linkdex Page Analysis](http://yoast.com/content-seo-wordpress-linkdex/) functionality checks simple things you're bound to forget. It checks, for instance, if you have images in your post and whether they have an alt tag containing the focus keyword for that post. It also checks whether your posts are long enough, if you've written a meta description and if that meta description contains your focus keyword, if you've used any subheadings within your post, etc. etc.

The plugin also allows you to write meta titles and descriptions for all your category, tag and custom taxonomy archives, giving you the option to further optimize those pages.

Combined, this plugin makes sure that your content is the type of content search engines will love!

= Technical WordPress Search Engine Optimization =
While out of the box WordPress is pretty good for SEO, it needs some tweaks here and there. This WordPress SEO plugin guides you through some of the settings needed, for instance by reminding you to enable pretty permalinks. But it also goes beyond that, by automatically optimizing and inserting the meta tags and link elements that Google and other search engines like so much:

= Meta & Link Elements =
With the WordPress SEO plugin you can control which pages Google shows in its search results and which pages it doesn't show. By default, it will tell search engines to index all of your pages, including category and tag archives, but only show the first pages in the search results. It's not very useful for a user to end up on the third page of your "personal" category, right?

WordPress itself only shows canonical link elements on single pages, WordPress SEO makes it output canonical link elements everywhere. Google has recently announced they would also use `rel="next"` and `rel="prev"` link elements in the `head` section of your paginated archives, this plugin adds those automatically, see [this post](http://yoast.com/rel-next-prev-paginated-archives/ title="rel=next & rel=prev for paginated archives") for more info.

= XML Sitemaps =
WordPress SEO has the most advanced XML Sitemaps functionality in any WordPress plugin. Once you check the box, it automatically creates XML sitemaps and notifies Google & Bing of the sitemaps existence. These XML sitemaps include the images in your posts & pages too, so that your images may be found better in the search engines too.

These XML Sitemaps will even work on large sites, because of how they're created, using one index sitemap that links to sub-sitemaps for each 1,000 posts. They will also work with custom post types and custom taxonomies automatically, while giving you the option to remove those from the XML sitemap should you wish to.

Because of using [XSL stylesheets for these XML Sitemaps](http://yoast.com/xsl-stylesheet-xml-sitemap/), the XML sitemaps are easily readable for the human eye too, so you can spot things that shouldn't be in there.

= RSS Optimization =
Are you being outranked by scrapers? Instead of cursing at them, use them to your advantage! By automatically adding a link to your RSS feed pointing back to the original article, you're telling the search engine where they should be looking for the original. This way, the WordPress SEO plugin increases your own chance of ranking for your chosen keywords and gets rid of scrapers in one go!

= Breadcrumbs =
If your theme is compatible, and themes based on Genesis or by WooThemes for instance often are, you can use the built-in Breadcrumbs functionality. This allows you to create an easy navigation that is great for both users and search engines and will support the search engines in understanding the structure of your site.

Making your theme compatible isn't hard either, check [these instructions](http://yoast.com/wordpress/breadcrumbs/).

= Edit your .htaccess and robots.txt file =
Using the built-in file editor you can edit your WordPress blogs .htaccess and robots.txt file, giving you direct access to the two most powerful files, from an SEO perspective, in your WordPress install.

= Social Integration =
SEO and Social Media are heavily intertwined, that's why this plugin also comes with a Facebook OpenGraph implementation and will soon also support Google+ sharing tags.

= Multi-Site Compatible =
This WordPress SEO plugin, unlike some others, is fully Multi-Site compatible. The XML Sitemaps work fine in all setups and you even have the option, in the Network settings, to copy the settings from one blog to another, or make blogs default to the settings for a specific blog.

= Import & Export functionality =
If you have multiple blogs, setting up plugins like this one on all of them might seem like a daunting task. Except that it's not, because what you can do is simple: you set up the plugin once. You then export your settings and simply import them on all your other sites. It's that simple!

= Import functionality for other WordPress SEO plugins =
If you've used All In One SEO Pack or HeadSpace2 before using this plugin, you might want to import all your old titles and descriptions. You can do that easily using the built-in import functionality. There's also import functionality for some of the older Yoast plugins like Robots Meta and RSS footer.

Should you have a need to import from another SEO plugin or from a theme like Genesis or Thesis, you can use the [SEO Data Transporter](http://wordpress.org/extend/plugins/seo-data-transporter/) plugin, that'll easily convert your SEO meta data from and to a whole set of plugins like Platinum SEO, SEO Ultimate, Greg's High Performance SEO and themes like Headway, Hybrid, WooFramework, Catalyst etc.

Read [this migration guide](http://yoast.com/all-in-one-seo-pack-migration/) if you still have questions about migrating from another SEO plugin to WordPress SEO.

= WordPress SEO Plugin in your Language! =
Currently a huge translation project is underway, translating WordPress SEO in as much as 24 languages. So far, the translations for French and Dutch are complete, but we still need help on a lot of other languages, so if you're good at translating, please join us at [translate.yoast.com](http://translate.yoast.com).

= News SEO =
Be sure to also check out the [News SEO module](http://yoast.com/wordpress/seo/news-seo/) if you need Google News Sitemaps. It tightly integrates with WordPress SEO to give you the combined power of News Sitemaps and full Search Engine Optimization.

= Further Reading =
For more info, check out the following articles:

* [WordPress SEO - The definitive Guide by Yoast](http://yoast.com/articles/wordpress-seo/).
* Once you have great SEO, you'll need the [best WordPress Hosting](http://yoast.com/articles/wordpress-hosting/).
* The [WordPress SEO Plugin](http://yoast.com/wordpress/seo/) official homepage.
* Other [WordPress Plugins](http://yoast.com/wordpress/) by the same author.
* Follow Yoast on [Facebook](https://facebook.com/yoast) & [Twitter](http://twitter.com/yoast).

== Installation ==

1. Upload the `wordress-seo` folder to the `/wp-content/plugins/` directory
1. Activate the WordPress SEO plugin through the 'Plugins' menu in WordPress
1. Configure the plugin by going to the `SEO` menu that appears in your admin menu

== Frequently Asked Questions ==

You'll find the [FAQ on Yoast.com](http://yoast.com/wordpress/seo/faq/).

== Screenshots ==

1. The WordPress SEO plugin general meta box. You'll see this on edit post pages, for posts, pages and custom post types.
2. Some of the sites using this WordPress SEO plugin.
3. The WordPress SEO settings for a taxonomy.
4. The fully configurable XML sitemap for WordPress SEO.
5. Easily import SEO data from All In One SEO pack and HeadSpace2 SEO.
6. Example of the Page Analysis functionality.
7. The advanced section of the WordPress SEO meta box.

== Changelog ==

* Bugfixes
	* Fixed: Meta description tag discovery looked in parent theme header file even when a child theme is the current theme - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed: Using the 'Fix it' button would remove the meta description tag from the parent theme header file, even when a child theme is the current theme - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed repeated unnecessary meta description tag checks on each visit to dashboard page - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed: Using the 'Fix it' button would fail if it had already been used once (i.e. if a wpseo backup file already existed) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed: Meta description 'Fix it' feedback message was not shown - props [Jrf](http://profiles.wordpress.org/jrf).

* Enhancements
	* Added checks for the meta description tag on theme switch, on theme update and on (re-)activation of the WP SEO plugin including a visual warning if the check would warrant it - props [Jrf](http://profiles.wordpress.org/jrf).
	* Added the ability to request re-checking a theme for the meta description tag. Useful when you've manually removed it (to get rid of the warning), inspired by [tzeldin88](http://wordpress.org/support/topic/plugin-wordpress-seo-by-yoast-your-theme-contains-a-meta-description-which-blocks-wordpress-seo) - props [Jrf](http://profiles.wordpress.org/jrf).

= 1.4.13 =

* Bugfixes
	* Fixed ampersand (&) in sitetitle in Title Templates loading as &amp;
	* Fixed error when focus keyword contains a / - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed issue with utf8 characters in meta description - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed undefined property error - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed undefined index error for the last page of the tour - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed undefined index error for images without alt - props [Jrf](http://profiles.wordpress.org/jrf).
    * Fix output of author for Google+ when using a static front page - props [petervanderdoes](https://github.com/petervanderdoes).
    * Keyword density calculation not working when special character in focus keyword - props [siriuzwhite](https://github.com/siriuzwhite).
    * Reverse output buffer cleaning for XML sitemaps, as that collides with WP Super Cache, thanks to [Rarst](https://github.com/Rarst) for finding this.
    * Fix canonical and rel=prev / rel=next links for paginated home pages using index.php links.
    * Fixed og:title not following title settings.
* Enhancements
	* Improved breadcrumbs and titles for 404 pages - props [Jrf](http://profiles.wordpress.org/jrf).
    * Moved XSL stylesheet from a static file in wp-content folder to a dynamic one, allowing it to work for sites that prevented the wp-content dir from being opened directly, f.i. through Sucuri's hardening.
    * Added a link in the XSL pointing back to the sitemap index on individual sitemaps.
    * When remove replytocom is checked in the permalink settings, these are now also redirected out.
    * Added filters to OpenGraph output functions that didn't have them yet.

= 1.4.12 =

* Bugfixes
	* Submit button displays again on Titles & Metas page.
	* SEO Title now calculates length correctly.
	* Force rewrite titles should no longer reset wrongly on update.

= 1.4.11 =

* i18n
	* Updated de_DE, ru_RU, zh_CN.
* Bugfixes
    * Make rel="publisher" markup appear on every page.
    * Prevent empty property='article:publisher' markup from being output .
    * Fixed twitter:description tag should only appears if OpenGraph is inactive.
    * og:description will default to get_the_excerpt when meta description is blank (similar to how twitter:description works).
	* Fixes only 25 tags (and other taxonomy) are being indexed in taxonomy sitemaps.
	* Fix lastmod dates for taxonomies in XML sitemap index file.
* Enhancements
	* Changed Social Admin section to have a tab-layout.
	* Moved Google+ section from Homepage tab of Titles & Metas to Social tab.
	* Make twitter:domain use WordPress site name instead of domainname.
	* Added more output filters in the Twitter class.

= 1.4.10 =

* Fixes
    * Caching was disabled in certain cases, this update fixes that.
* Enhancements
    * Added option to disable author sitemap.
    * If author pages are disabled, author sitemaps are now automatically disabled.

= 1.4.9 =

* i18n
    * Updated .pot file
    * Updated ar, da_DK, de_DE, el_GR, es_ES, fa_IR, fr_FR, he_IL, id_ID, nl_NL, ro_RO, sv_SE & tr_TK
    * Added hr & sl_SI
    * Many localization fixes
* Bugfixes
    * Fixed sitemap "loc" element to have encoded entities.
    * Honor the language setting if other plugins set the language.
    * sitemap.xml will now redirect to sitemap_index.xml if it doesn't exist statically.
    * Added filters 'wpseo_sitemap_exclude_post_type' and 'wpseo_sitemap_exclude_taxonomy' to allow themes/plugins to exclude entries in the XML sitemap.
    * Added RTL support, some CSS fixes.
    * Focus word gets counted in meta description when defined by a template.
    * Fixed some bugs with the focus keyword in the first paragraph test.
    * Fixed display bug in SEO Title column when defined by a template ('Page # of #').
    * Fixed a few strict notices that would pop up in WP 3.6.
    * Prevent other plugins from overriding the WP SEO menu position.
    * Enabled the advanced tab for site-admins on a multi-site install.
	* Fixed post save error when page analysis is disabled.
	* OpenGraph frontpage og:description and og:image tags now properly added to the frontpage.
* Enhancements
    * Added an HTML sitemap shortcode [wpseo_sitemap].
    * Added an XML sitemap listing the author profile URLs.
    * Added detection of Yoast's robots meta plugin and All In One SEO plugins, plugin now gives a notice to import settings and disable those plugins.
    * Prevent empty image tags in Twitter Cards - props [Mike Bijon](https://github.com/mbijon).
    * Add new `twitter:domain` tag  - props [Mike Bijon](https://github.com/mbijon).
    * Add support for Facebooks new OG tags for media publishers.
	* Allow authorship to be removed per post type.

= 1.4.7 =

* Properly fix security bug that should've been fixed in 1.4.5.
* Move from using several $options arrays in the frontend to 1 class wide option.
* Instead of firing all plugin options as function within head function, attach them to `wpseo_head` action, allowing easier filtering and changing.
* Where possible, use larger images for Facebook Opengraph.
* Add several filters and actions around social settings.

= 1.4.6 =

* Fix a possible fatal error in tracking.

= 1.4.5 =

* Bug fixes:
    * Fix security issue which allowed any user to reset settings.
    * Allow saving of SEO metadata for attachments.
    * Set the max-width of the snippet preview to 520px to look more like Google search results, while still allowing it to work on lower resolutions.
* Enhancements:
    * Remove the shortlink http header when the hide shortlink checkbox is checked.
    * Added a check on focus keyword in the page analysis functionality, checking whether a focus keyword has already been used before.
    * Update how the tracking class calculates users to improve speed.

= 1.4.4 =

* Fix changelog for 1.4.3
* Bugfixes
    * Fix activation bug.
* i18n
	* Updated es_ES, id_ID, he_IL.

= 1.4.3 =

* Bugfixes
    * Register core SEO menu at a lower than default prio so other plugins can tie in more easily.
    * Remove alt= from page analysis score divs.
    * Make site tracking use the site hash consistently between plugins.
    * Improve popup pointer removal.

= 1.4.2 =

* Bugfixes
    * Made the sitemaps class load in backend too so it always generates rewrites correctly.
    * Changed > to /> in class-twitter.php for validation as XHTML.
    * Small fix in metabox CSS for small screens (thx [Ryan Hellyer](http://ryanhellyer.net)).
    * Load classes on plugins_loaded instead of immediately on load to allow WPML to filter options.
* i18n
    * Updated bs_BA, cs_CZ, da_DK, de_DE, fa_IR, fr_FR, he_IL, hu_HU, id_ID, it_IT, nl_NL, pl_PL, pt_BR, ru_RU and tr_TR

= 1.4.1 =

* i18n:
    * Updated .pot file
    * Updated bg_BG, bs_BA, cs_CZ, fa_IR, hu_HU, pl_PL & ru_RU
* Bugfixes:
    * Focus keyword check now works again in all cases.
    * Fix typo in Video SEO banner.
* Enhancements:
    * Don't show banners for plugins you already have.

= 1.4 =

* i18n & documentation:
    * Updated Hebrew (he_IL)
    * Updated Italian (it_IT)
    * Updated Dutch (nl_NL)
    * Updated Swedish (sv_SE)
    * Updated some strings to fix typos.
    * Removed affiliate links from readme.txt.
* Bugfixes:
    * Fixed a bug in saving post meta details for revisions.
    * Prevent an error when there are no posts for post type.
    * Fix the privacy warning to point to the right place.
* Enhancements:
    * Slight performance improvement in <head> functionality by not resetting query when its not needed (kudos to @Rarst).
    * Slight performance improvement in options call by adding some caching (kudos to @Rarst as well).
    * Changed inner workings of search engine ping, adding YOAST_SEO_PING_IMMEDIATELY constant to allow immediate ping on publish.
    * Changed design of meta box, moving much of the help text out in favor of clicking on a help icon.
    * Removed Linkdex branding from page analysis functionality.

= 1.3.4.4 =

* Bug with revisions in XML sitemap for some weird combinations.
* Improved logic for rel=publisher on frontpage.
* Allow variables in meta description for post type archive.
* Improved counting of images for page analysis.
* updated Turkish (tr_TR)
* updated Russian (ru_RU)
* updated Indonesian (id_ID)
* updated French (fr_FR)
* updated Czech (cs_CZ)
* added Japanese (ja)

= 1.3.4.3 =

* Regex annoyances anyone? Sigh. Bug fixed.

= 1.3.4.2 =

* Added missing filter for meta box priority.
* Fixed bug in JS encoding.

= 1.3.4.1 =

* Bug in page analysis regex.

= 1.3.4 =

* Fix bug in custom field value retrieval for new drafts.
* Fix bug in meta box value for checkboxes (only used currently in News extension).
* Remove redirect added in 1.3.3 as it seems to cause loops on some servers, will investigate later.
* Add option to filter `wpseo_admin_pages` so more pages can use WP SEO admin stylesheets.
* Prevent notice for images without alt tags.
* Use mb_string when possible.

= 1.3.3 =

* Properly `$wpdb->prepare` all queries that need preparing.
* Fix wrong escaping in admin pointers.
* Make %%currentdate%% and %%currenttime%% variables respect WP date format settings.
* Add %%currentday%% format.
* Force remove Jetpack OpenGraph.
* Fix the weird addition of `noindex, nofollow` on URLs with ?replytocom that was added in 3.5.
* Force XML sitemap to be displayed on the proper domain URL, so XSLT works.

= 1.3.2 =

* Updated wordpress-seo.pot
* Updated Turkish (tr_TR) filename.
* Updated Spanish (es_ES) translation.
* Fixed bug where non-admin users couldn't save their profile updates.
* Fixed bug with the same OpenGraph image appearing multiple times.
* Fixed bug that would prevent import and export of plugin settings.
* Try to do a redirect back after saving settings.
* Properly allow for attachment pages in XML sitemaps, default them to off.
* Fixed annoying bug where checkboxes wouldn't display as "checked" even when the value was set to true.
* Show post type name and taxonomy name (as opposed to label) next to labels in XML sitemap settings to more easily identify post types and taxonomies.
* Switch tracking to a daily cronjob instead of an admin process to prevent tracking from slowing down admin interface.
* Focus keyword detection now properly works for diacritical focus keywords as well.
* Properly apply filters to meta desc and titles in admin grid.
* Properly detect new versions of Facebook plugin too.
* Allow changing of the number of posts per XML sitemap, to prevent memory issues on certain installs.

= 1.3.1.1 =

* Some of that escaping was too aggressive.

= 1.3.1 =

* Fix somewhat too aggressive escaping of content.
* Added notice text for non-existing .htaccess file / robots.txt file.

= 1.3 =

* Long list of small fixes and improvements to code best practices after Sucuri review. Fixes 3 small security issues.
* Updated .pot file
* Updated Danish (da_DK), Indonesian (id_ID), Chinese (zh_CN), Russian (ru_RU), Norwegian (nb_NO), Turkish (tr_TK), Hebrew (he_IL) and Persian (fa_IR).
* Added Arabic (ar), Catalan (ca) and Romanian (ro_RO).

= 1.2.8.7 =

* Fixed %%category%% and %%tag%% and some other variables that weren't working since 1.2.8.6.

= 1.2.8.6 =

* Revert gplus changes in 1.2.8.5 that were causing issues.
* Fix a tracking timeout.
* Fix a bunch of notices throughout variables functions.

= 1.2.8.5 =

* Fixed a bug for MultiSite due to a missing attribute in calling `get_admin_url`.
* Updated Hebrew (he_IL), Dutch (nl_NL) French (fr_FR), Czech (cs_CZ), Italian (it_IT), Brazilian Portuguese (pt_BR).
* Added Norwegian (nb_NO) and Portuguese (pt_PT).
* Added a `wpseo_robots` filter for the robots meta tag.
* Fixed integration with the [Facebook plugin](http://wordpress.org/extend/plugins/facebook).

= 1.2.8.4 =

* Fix for double title issues with themes that filter `wp_title`, by having WP SEO filter a bit later in the process
  (but no too late because the genesis <title> wrap filter is on 30).
* Improved Twitter Card functionality: twitter meta tags now appear above OpenGraph meta tags.
* Updated a bunch of languages: da_DK, de_DE, es_ES, fa_IR, fr_FR, he_IL, hu, hu_HU, it_IT, nl_NL, pt_BR, ru_RU, tr_TK, zh_CN.
* Added Czech (cs_CZ) and Spanish - Venezuela (es_VE).

= 1.2.8.3 =

* Updated all the languages in hopes to fix the empty text strings.
* Added basic translations for Danish (da_DK) and Finnish (fi).

= 1.2.8.2 =

* "Fix" for tracking popup with empty buttons.

* Updated languages
	* French fr_FR
	* Dutch nl_NL
	* Turkish tr_TK

= 1.2.8.1 =

* Fixed one s, that caused a fatal error. Sigh.

= 1.2.8 =

* Bug fixes:
    * Fix for images not showing up in XML sitemap.
    * Fix to allow breadcrumb titles to once again be set for CPT archive pages.
    * Prevent empty rel=publisher link from being put out.
    * Several fixes to the strip category base settings.
    * Several fixes to the hardcoded meta description recognition code.
    * Prevent title testing from priming the cache.
    * Prevent upgrading from a recent version to force a title test, no longer overrides manual force rewrite settings.
    * Fix paginated singular post / page issue when single isn't paginated.
* Enhancements:
    * No longer show .htaccess editor when on NGINX.
    * Move tracking to its own file, switching to my own tracking instead of PressTrends so more specific options can be tracked.
    * Tracking can now be enabled and disabled from the SEO Dashboard screen.
* Documentation:
    * Added rewrite rules for NGINX to FAQ.
    * Now showing rewrite rules for NGINX on XML sitemaps settings page.

= 1.2.7 =

* Fixed compatibility with 3.3 and lower.

= 1.2.6 =

* Enhancements:
    * Added (optional) PressTrends tracking to get some more info on common configurations of WP to test for.
    * Made config page loading even faster.
    * Added a link to my [Amazon wishlist](http://amzn.com/w/CBV7CEOJJH98) to the plugin sidebar in the admin ;)
    * Added a check to see whether your theme contains a hardcoded meta description, and options to remove it.
    * Added a Google+ Publisher input option for the homepage.
    * Added the option to allow showing the date in the snippet preview per post type.
    * Removed aggressive cache deleting in the XML sitemaps. Could cause issues with some plugins but should increase speed.
    * Force the XML Sitemap to return a 200 OK Header.
* Deprecated functionality:
    * The breadcrumbs functionality no longer automatically hooks as this was giving too many issues.
* Bug fixes:
    * Prevent adding trailing slash on paged posts when force trailing slash on categories and tags is on.
    * Breadcrumbs now properly use `home_url` instead of `site_url`.
    * Simplify shortcode stripping, to make it actually work.
    * Prevent several notices in XML Sitemaps class.
* Textual / documentation changes:
    * Add a "without @" notice to the Twitter username input field.

= 1.2.5 =

* Bug fixes:
    * Make sure html entities are decoded and if needed re-encoded to XML entities for the XML sitemap.
    * Fix infinite loop in sub-category or other sub-taxonomy archive page breadcrumbs.
    * Fix breaking rewrite for categories when strip category is enabled.
    * Fix non-global classes that should be global.
* i18n:
	* Updated French translation.
	* Updated Bosnian language code and deleted unused Bosnian version.
	* Updated Bulgarian and deleted unused Bulgarian `bul` version.
	* Updated and completed it_IT and pt_BR translations.

= 1.2.4 =

* Bug fixes:
	* Properly restore $wp_query after running header functionality, so we're not breaking badly built themes.
	* Make the title test helper function only return the test title to the right WordPress user-agent.
	* Fix for slug saving that should help interoperability with other slug-enhancing / changing functions.
	* Fix wrong homepage titles with 12345 in them because of bug in 1.2.2.
	* Added text domains on some strings that were missing it.
	* Replace `split` with `explode` as `split` is deprecated in newer PHP versions.
	* Properly deal with shortcodes with text inbetween.
	* Remove several functions that are no longer used.
	* `%%page%%` only outputs '`%%sep%%` Page 2 of X' when not on page 1. If you want it to show up on Page 1 you can use `%%pagetotal%%` and `%%pagenumber%%`. This both works for paginated posts & pages too.
	* Allow for rel=author on sites with static frontpage too.
* Enhancements:
	* Massive updates to how parts of the plugin are loaded, leading to a reduction of memory usage in WordPress admin of 1~2 MB.
	* Respect `DISALLOW_FILE_MODS` and `DISALLOW_FILE_EDIT` constants. When set to true, edit files menu option won't show.
	* Added support for image galleries in the page analysis functionality, alt tags from images in galleries are now parsed too.
	* Add an option to remove the `replytocom` variables from comment links (they're bloody stupid).
	* Added variables `%%pt_single%%` and `%%pt_plural%%` which output the single and plural label of the current post type (useful for post type archives).
	* Made the default settings smarter, they'll now use better titles _and_ will set titles for each public post type, post type archive and taxonomy.
	* Updates to introductory tour.
	* Added PHPdoc to the entire plugins codebase.
	* Refactored all of the code not using WordPress code style.
	* Breadcrumbs now use [RDFA](http://support.google.com/webmasters/bin/answer.py?hl=en&answer=185417) and have been completely rewritten for speed and more filter options.
* i18n:
	* Updated Russian translation.
	* Better language codes for Hungarian and Bulgarian added.
	* Updated .pot file.

= 1.2.3 =

* Bug fixes:
	* Fixed possible bug on multi site.
	* Fixed a bug in alt & title elements for XML sitemaps.
	* Fix to force title rewrites in two places: call `wp_reset_query` for stupid themes and plugins.
	* Fixed bug in saving some options.
	* Fixed OpenGraph bug where default image wouldn't be used for post without images.
	* Prevent error on division by zero when swapping around text.
	* Prevent notice in title_test and also fix possible bugs.
	* Properly escape the delimiter too in all `preg_quote` calls.
	* Don't show SEO filter on upload.php.
	* Only count alt tags in keyword density and word count calculations, leave out title attributes.
	* Rewrote the force rewrite test to be simpler and better.
* Enhancements:
	* New icons for the analysis functionality.
	* Twitter card functionality.
	* Removed 200 lines of code from OpenGraph class because I could just inherit it from the parent class. d0h!
	* Added a *bunch* of translations; bg, bos, bs, bul, es_ES, hu, hun, id_ID, pl_PL, pt_BR.
	* Updated another bunch: de_DE, fr_FR, he_IL, it_IT, nl_NL, ru_RU, sv_SE.

= 1.2.2 =

* Some small bug fixes.
* Made loading the TextStatistics class conditional on the existence of said class.
* Added a posts filter option for SEO quality in the edit posts / pages overview.
* Added a filter `wpseo_use_page_analysis` that disables the page analysis functionality when false is returned.
* Added a filter `wpseo_show_date_in_snippet` that disables the date in the preview snippet when false is returned.

= 1.2.1 =

* Bugs fixed:
	* Trim the focus keyword before running page analysis tests.
	* Title's should be (and now is) Titles.
	* Fixes to Theme integrations for Woo, Genesis and Thematic.
	* Enhancement to force rewrite title test.

= 1.2 =

* Bugs fixed:
	* ereg_replace != preg_replace ; in other words: alt and title tags for images in xml sitemap fixed.
	* Image size for OpenGraph now defaults to medium for thumbnail image.
	* Selecting a Facebook App as the admin of your site now actually works.
	* Saving the SEO -> Dashboard settings no longer makes you loose the SEO -> Social settings.
	* Tweaks to clean slug functionality.
	* Fix for UTF-8 terms in titles and descriptions.
	* Fixed bug where empty but saved title template settings could lead to empty homepage title on blogs with a static front page.
	* Fixed several bugs around page numbers in titles and descriptions.
	* Prevented an error in the opendir functionality for WP SEO modules.
	* Allow ';' in focus keyword.
	* Don't double encode characters in suggest functionality.
	* Don't remove non-alphanumeric values for keyword checks.
	* Fixed a bug in snippet preview occurring when content was shorter than max snippet length.
	* Fixed keyword count in content for cases where keyword was surrounded by parentheses and some other characters.
	* Loads of Regex Fu to improve keyword bolding.
	* Activation and deactivation handlers properly specified.
	* WP Super Cache now properly emptied on update of settings.
	* Fixes to OpenGraph images for homepage.
	* Fixed a notice in OpenGraph class on 404 pages.
	* Fixed notices in OpenGraph admin when selecting Facebook app as admin.
	* Fixed a bug where half the Page analyses wouldn't work when the visual editor is disabled.
	* Changed the mime type of the XSL file for XML sitemaps to text/xml, so Firefox will display them properly.
	* Made sure the default OpenGraph image will always show up when there's no other image.
	* Updated tablesorting JS used in XML Sitemaps.
* Enhancements:
	* Added a page level "score" for the site analysis functionality.
	* Allow sitewide noindexing of post types and taxonomies with post- and term-level overrides.
	* Automatically check whether force rewrite needs to be enabled.
	* Upon activation, XML sitemaps are automatically enabled.
	* Upon activation, title templates are pre-filled with sensible defaults.
	* Plugin now auto-detects whether titles need to be force-rewritten (using output buffering) or not.
	* Redesign of the admin, removal of the indexations page and renaming the Titles page into Metas & Titles page.
	* Allow noindex-following per custom taxonomy and custom post type.
	* No longer show non-public post types on the Titles & Metas page.
	* On activation, W3 Total Cache or WP Super Cache cache gets cleared automatically.
	* Added an uninstall handler, deleting the plugin through the WP backend will now delete options from the DB too.
	* Added the option to display custom taxonomy in titles and descriptions, use `%%ct_<custom-taxname>%%` for a comma separated list or `%%ct_<custom-taxname>%%single%%` for only one taxonomy term.
	* Added the option to display custom taxonomy descriptions in post description fields, use `%%ct_desc_<custom-taxname>%%`.
	* Allow for 'Page x of x' to be localized too.
	* Force the query for the current page to be used instead of the query that a bad plugin or even theme was using by calling `wp_reset_query` before the header functionality.
	* If you're a Woothemes user and you activate WordPress SEO, the "use 3rd party plugins data" checkbox will be checked on upon activation.
	* Non front page blog pages now have a title template: `%%title%% %%page%% - %%sitename%%` if they don't have a specific SEO title and there is no page template.
	* Pinging search engines on post of new content now moved to cron to prevent lag.
	* Only embed images in the XML sitemap that match the main domain, subdomains should not matter but images from other domains are now ignored.
	* Fixed a bug where homepage wouldn't be in the XML sitemap when there are no posts, yet the homepage is set to display recent posts.
* API Improvements:
	* Added a filter to allow adding URLs to specific XML sitemaps, see [this thread](http://wordpress.org/support/topic/plugin-wordpress-seo-by-yoast-how-to-add-a-non-wordpress-page-to-the-sitemap). The filter is `wpseo_sitemap_<$post_type>_content`.
	* Added a filter for the meta keywords, `wpseo_metakey`.
	* Added a filter to allow disabling `rel="next"` and `rel="prev"` links, use `wpseo_<prev|next>_rel_link`.
	* Added a filter `wpseo_xml_sitemap_img_src` to allow changing the hostname of images, most common use case is to force them to the CDN.
	* See the new [WordPress SEO API docs](http://yoast.com/wordpress/seo/api-docs/).

= 1.1.9 =

* Sigh... Sorry about that.

= 1.1.8 =

* Bugs fixed / Changes:
	* Fix the clean slug function to not freak people out and remove chars.
	* Fixed a couple of notices.
	* Allow '+' in focus keyword.
	* A *load* of i18n fixes (including a new POT file).

= 1.1.7 =

* Bugs fixed / Changes:
	* Fixes issue with un-paginated canonicals for paged single posts / pages.
	* Fixes %%page%% variable to work in title & description template on paginated singular post(type)s.
	* Allow - in focus keyword.
	* Removed the option to use a Facebook page as an admin in the Facebook OpenGraph, as Facebook deprecated that.
	* Force OpenGraph locale to lowercase.
	* Catch some weird locales and convert them to proper Facebook supported iso_country versions.
	* Now adding _all_ the images in a post with an og:image tag, so people can more easily share the right image.
	* Allow regex specific characters in the focus keyword for the Page Analysis checks.
	* Add proper (and i18n compatible) [stop word](http://en.wikipedia.org/wiki/Stop_words) removal.
	* Removed code to add noindex to login page as that's now in core for long enough.
	* Fixed several notices.
	* When a static homepage has no SEO title, default to the site's name + description.
	* Only show images once in OpenGraph tags.
	* Prevent a timeout on retrieving term meta.
	* Don't do next / prev links on the homepage for Genesis based themes as that leads to trouble.
	* XML Sitemaps & feeds:
		* Properly fix featured image showing up in XML Sitemap.
		* Optimized the main query for XML sitemaps per [this thread](http://wordpress.org/support/topic/plugin-wordpress-seo-by-yoast-performance-suggestion).
		* Switch feed noindexing from `xhtml:meta` tags to X-Robots-Tag HTTP headers to prevent feed display issues.
		* Force XML Sitemap descriptions for images to be clean to prevent XML parse errors.
		* Tiny change in CSS for explanatory text in XSL.
* New filters:
	* Add filter `wpseo_locale` for the locale in the opengraph settings.
	* Add filter `wpseo_metabox_prio` to allow WP SEO metabox priority to be changed.
* Documentation:
	* Removed the "Other Notes" tab from the plugin page, enough tabs there already.
	* Added %%cf_ options to config page for titles.
	* Fixed the Yoast Facebook URL.
	* Changed plugin support link to [the new support URL format](http://wordpress.org/support/plugin/wordpress-seo).

= 1.1.6 =

* Tiny fix to showing meta description on posts page.
* Fix for showing proper link to bug tracker.
* Fix for redirecting attachment pages when they don't have a parent.
* Fix for titles of custom post type pages.
* Dozens more tiny bugfixes.

= 1.1.5 =

* Removing the Dashboard widget.

= 1.1.4 =

* Removed the canonical redirect as that was screwing with people's setups (and minds).

= 1.1.3 =

* Fix for the blog homepage title, description etc.
* Added several filters for use in the soon to be released [Video SEO module](http://yoast.com/wordpress/seo/video-seo/).
* Change to XSL for XML Sitemaps.
* Non-canonical hostnames (like example.com when site setting is www.example.com) now 301 redirect to canonical hostname.
* Static frontpages now added to XML sitemap *with* images if it has them, same for interior blog pages.

= 1.1.2 =

* No longer add redirected URLs to the XML Sitemap.
* Plugin now properly adds images in galleries to the XML Sitemap too.
* Fixed a bug in home page title logic, affecting blogs with a static front page and a separate posts page, who were unable to set the posts page's title.
* Fixed a bug in the OpenGraph admin implementation.
* Google Suggest works again, and properly this time.
* Using entities in the snippet preview title & description field now still renders a correct "chars left" count.
* Replaced the last single quotes with double quotes for meta fields, apparently Bing wouldn't verify because of the single quotes in the verification line.
* Added option to verify your site with Alexa, as a lot of people requested this.

= 1.1.1 =

* Fixed `sprintf` bug in page analysis.
* Fixed bug that caused inability to edit / save the search page title.
* Fixed bug that caused inability to edit / save the "parent" blog in multisite settings.
* Removed ability to edit WP Super Cache .htaccess file as it doesn't seem to be there anymore.
* Removed Yahoo! Site Explorer.

= 1.1 =

* Biggest change: entire plugin now supports localization, testing can be done by dropping your properly named .mo file (wordpress-seo-nl_NL.mo for instance) into the languages dir.
* Added Dutch, German, French, Hebrew, Italian, Russian and Swedish translations.
* Show proper post type names in admin menu for disabling editor box and hide non-public post types (props Nacin).
* Disabling the Advanced Editor now only disables it for non admins.
* Replaced single quotes with double quotes in meta description and canonical, to please [Danny Sullivan](http://searchengineland.com).
* Fixed issue with images in XML sitemaps.
* Added Social menu item.
* Lots of changes to the Facebook integration:
	* Added the locale.
	* Added default image.
	* Added homepage image & description.
	* New method of adding Facebook Admins.
* Removed all nofollow settings, login register links are now nofollow by default, all other functionality removed as it doesn't make sense anymore.
* Cosmetic changes: added some Yoast links to backend widget in the right sidebar.
* Switched text domain from a constant to a proper string 'wordpress-seo'.
* Removed the now unneeded extra styling for admin pointers.
* Fixed a notice in 3.3beta with caused by `wp_reset_query` being called too early.
* Added several filters to allow WPML (and other plugins) to create XML Sitemaps for other languages.
* Minor updates to the plugin tour, removing the "Stop tour" button, "Close" now closes until you manually restart.

= 1.0.3 =

* This release is dedicated to removing options and setting defaults instead. Specifically, the following settings are now defaults without options to change them:
	* Images are now always included in the XML sitemap as Bing no longer breaks on them.
	* Pinging Google and Bing is now a default action as that's the whole point of having XML sitemaps.
	* RSS feeds are now always noindex, followed. No search engine should ever list an RSS feed as a result in the resultpages.
	* Admin, login and registration pages are always noindexed now for the same reason.
	* Search result pages are now always noindex, follow.
	* Subpages of the homepage are now also noindex, follow. It just doesn't make sense to index,follow those especially with the new rel="prev" and rel="next" changes.
* The option to add `nosnippet` and `noarchive` meta tags sitewide has been removed. No one in his right mind would want to do that, and if you do, then adding the robots meta to your template yourself should be doable.
* Pinging search engines with your RSS feed is no longer part of this plugin (as its unneeded because the XML sitemaps do that).
* UTF-8 characters in RSS footer no longer break.
* Added the option to use the author name and link in the RSS header and footer using %%AUTHORLINK%%.
* No longer show the admin bar SEO menu for subscribers.
* Some style changes to make the backend look nicer in WP 3.2 and 3.3.
* Bug with importing settings fixed.
* No longer redirect attachments that have no parent.
* Correctly grab thumbnail for OpenGraph settings.
* Pages now get the correct priority (0.8).
* Added the option to noindex or completely disable post format archives.

= 1.0.2.3 =

* Fixed some edge cases with rel=next and rel=prev, particularly relating to a paginated page as a frontpage.
* Updated the snippet preview so the date part of the snippet has the right color.
* Fixed a bug in the update routine that could cause errors in the backend.
* Enabled OpenGraph meta box on edit screens, first "stab".

= 1.0.2.2 =

* Removed all rel=index, rel=prev etc references that WP core currently uses as they're wrongly implemented.
* Added rel=prev and rel=next for paginated posts and pages.
* Removed the interface options for all rel= links, they're off by default now.
* Removed the option to hide the version number. It's very easy to detect the version number anyway so let's not clutter the interface.

= 1.0.2.1 =

* I missed a case where the next link would point to the current page, fixed it though :)

= 1.0.2 =

* Fixed keyword in slug detection on non-post post types.
* Optimizations in canonical functionality, adding canonicals to author archives and more.
* Added prev and next links as [suggested by Google](http://googlewebmastercentral.blogspot.com/2011/09/pagination-with-relnext-and-relprev.html).
* Fixed issue with unescaped characters in title and description when updating edit screen.
* Posts with a canonical set to another URL are no longer included in the XML sitemap.

= 1.0.1 =

* Fixed a bug where canonical would be set to /page/1/ on archives.
* Fixed an error for blocking files.
* Fixed a JS error that would cause the link editor in the rich editor not to work.
* Fixed possible error when reading settings have gone haywire (ie not 'posts' or 'page' on front but something else).

= 1.0 =

* I now dare call this plugin STABLE. This doesn't mean there are no more bugs, it does mean that I think it won't break sites anymore.
* Fixed the import/export settings functionality.
* Updated the snippet preview to Google's new snippet design.

= 0.4.3 =

* Heavily, very heavily, reduced memory usage in XML Sitemap generation.

= 0.4.2 =

* Fixes:
	* XML Sitemaps:
		* Bug in redirection of www to non-www
		* Removed no longer needed robots_txt code.
		* Proper flushing of rewrites.
		* Fix for sites using index.php in permalinks.
		* Moved XML settings to its own options array, cleaning up the settings. This also allows you to save XML Sitemap settings again.
		* Sitemaps now contains all the last updated posts (under 1,000) of one post type in one new XML sitemap, so SE only has to crawl one sitemap per post type.
		* XML Sitemap Index file is now being pushed into cache if a caching plugin is active (by loading it through a cron job).
		* No longer breaks when `get_post_type_archive` doesn't exist.
	* Metaboxes / Edit Post:
		* Proper escaping of attribute values / already filled boxes.
		* Bug in bolding / keyword recognition JS code.
		* Background of tab content is now white again.
	* Taxonomies:
		* Fixed bug that could prevent noindex from showing up.
	* Other:
		* Admin menu works properly again and has XML Sitemaps menu added.

= 0.4.1 =

* Fixes bug in saving XML Sitemap and Dashboard settings.
* Forces flush of rewrite rules so XML sitemaps start working immediately after enabling.
* Adds a line of copy to the XML Sitemaps page to point the user at the index sitemap file.

= 0.4 =

* Fixes:
	* XML Sitemaps:
		* Complete rewrite of the XML Sitemap system, now using a sitemap index file and sitemap files per taxonomy and post type. Way more scaleable and awesome.
		* Updated the XSL to work with Sitemap Index file too.
		* Added functionality to remove old style & potential blocking XML sitemaps.
		* Removed all code that wrote files, as it's no longer needed.
		* Removed all functionality for updating sitemaps after publish, as it's no longer needed (search engines will still be pinged though).
	* Breadcrumbs:
	 	* Support for bbPress (the plugin), breadcrumbs.
		* Fixed bug with blog URL appearing for non-post post_types.
		* Fixed bug with post ancestors being in wrong order.
		* Removed erroneous var_dump.
	* Bug with title for homepage when using page as homepage.
	* OpenGraph:
		* Moved all OpenGraph code to specific OpenGraph class.
		* Added option to specify and add FB Page and App ID and FB admin ID or ID's.
	* Page Analaysis:
		* Fixed bug in detection of headings with an ID or other attribute.
	* Several performance optimizations to class includes.
	* Some fixes in JavaScript keyword detection and keyword bolding in snippet when using colon and semicolons etc in title or meta description.
	* Tiny CSS fixes so it all looks nice in WordPress 3.2.


* Also:
	* XML Sitemaps now have their own settings page.
	* Plugin version is now stored in the options for the plugin to allow easy upgrade.
	* Added the option to use custom fields in title and description templates. Use `%%cf_&lt;custom-field-name&gt;%%` and it'll be replaced with your custom field. So for instance %%cf_city%% when your custom field is named "city".
	* Removed some of the tabs and empty lines the plugin was outputting.
	* Added some filters:
		* `wpseo_sitemap_urlimages` so you can add images to the sitemap, found in inc/class-sitemaps.php
		* `wpseo_title` and `wpseo_metadesc` in frontend/class-frontend.php


= 0.3.5 =

* Fixes:
	* Issue in post / page editor with link dialog and other plugins using jQuery UI.
	* No longer uses Google JS API for jQuery UI, but just include jQuery UI autocomplete library and uses the rest from WP core.
	* No longer uses Google JS API for jQuery UI CSS, but included the needed classes in the plugins CSS files.
	* Properly update sitemap for custom post types on publication.
	* Fixed a notice in heading detection when no headings were found.
	* Fixed a typo in Page Analysis messages.

= 0.3.4 =

* Fixes:
	* CSS issue caused by 0.3.3.
	* Some security issues, thanks Jon Cave and Andrew Nacin for pointing them out and helping to fix!

= 0.3.3 =

* Fixes:
	* CSS collisions due to too generic class names.
	* Issue with outbound link recognition caused in 0.3.2.
	* Improved first paragraph detection.
	* Word count is now correct for non western european languages too.
	* Keyword detection in content and first paragraph in Cyrillic, Russian and other languages.
	* Handling of UTF-8 slugs.
	* Proper detection of keywords underneath the focus keyword input field by using word boundaries.
	* Proper keyword bolding and counting in snippet preview for Cyrillic, Russian and other languages.
	* Proper counting of length of description and title for strings with accents or non-ASCII characters.
	* No longer calculating Flesch score for non-English, as it's not correct.
	* Related keywords button works again.
	* Several performance improvements to edit post page JavaScript.

* Also:
	* Notice now properly tells you to save as draft or update a post to see new Linkdex analysis. No, it's not going to be AJAX, ever, for performance reasons.

= 0.3.2 =

* Fixes:
	* Instant update of snippet preview now also works when editing post excerpt.
	* Bugs with non-ASCII characters in the focus keyword and keyword recognition.
	* Issues with themes using `cat` in search, most specifically the ClassiPress themes.
	* The snippet preview no longer crashes when you use "on", "strong" or any other term contained in "strong" in your focus keyword.
	* Made the Linkdex check for keyword in URL work in all occasions.
	* Notices on XML import.
	* Issue with title of blog page on paginated pages.

* Also:
	* Removed 3 no longer needed JavaScript files.
	* Added the new bug tracker to the plugins sidebar notice under support.
	* Canonical now has a filter (`wpseo_canonical`) so you can remove it or change it.

= 0.3.1 =

* Fixes:
	* Bug in meta box JS code causing annoying issues in Firefox and Internet Explorer.
	* Issue with outbound anchor text detection in Linkdex Page Analysis.
	* Small bug in detection of keyword in Title when keyword contained dashes or other non alphanumeric chars.

= 0.3 =

* Major new feature: Linkdex Page Analysis has been integrated into WordPress SEO.

* Other new features:
	* You can now noindex, follow all sub pages of archives, taxonomies and categories.

* Fixes / Updates:
	* Snippet will now use ellipsis when post title or meta description is too long.
	* Various JS optimizations in snippet preview generation.
	* Snippet length will once again correctly correct for date inclusion.
	* Date in snippet will be the current date when post is an unpublished draft.
	* Preventing some errors when there's no focus keyword.
	* Keyword detection in the URL now works correctly.
	* URLs are no longer (incorrectly) "shortened".
	* Fixed possible infinite loop in editor when adding focus keyword, which was causing FF crashes.
	* Fixed count of keyword in content by removing tags properly.
	* Fixed issues with HTML tags appearing in snippet inappropriately.
	* Switched Google Suggest autocompletion for focus keyword to use [Google Suggest jQuery](http://code.google.com/p/googlesuggest-jquery/).
	* No longer relies on `is_post_type_archive` to work, so compatible with WP 3.0 again.
	* On themes that badly include $post in the head a redirect no longer occurs if the last post was redirected.
	* SEO Settings menu in Admin Bar will no longer show for people that don't have the rights needed to use it.
	* No longer wrongly showing image for last post in OpenGraph when on front page.
	* No longer redirecting taxonomy feeds wrongly under some conditions with clean permalinks enabled.
	* Fixed wrong titles for feeds.

= 0.2.5.4 =

* Custom post type archives update:
	* You can now set a title, meta description and breadcrumbs title for custom post type archives on the Titles page
	* Custom post type archives now have a correct canonical
* Other fixes:
	* Fixed a notice for an uninitialized setting
	* Slightly changed the CSS for the admin area
	* Changed input fields for meta descriptions on titles page from text input to textarea
	* More preparations for allowing the plugin to be fully translated

= 0.2.5.3 =

* Bugs fixed:
	* `edit_posts` is not the same as `edit_post`, what a difference an s makes, thanks to nacin.
	* preview URLs now work again with clean permalinks on, but only for those with the actual rights to view them.
	* Fix for catchable fatal error in canonical function.
	* First stab at fix for errors with focus keyword check and keywords filled with HTML tags.
	* canonical links for paginated posts are now set correctly.
	* Issue where parent taxonomy items would display in the reverse order in breadcrumbs.
	* Improved error handling for non PHP 5.2+ installs and also made automatic deactivation work properly.

* Documentation fixes:
	* Added screenshot and a FAQ with several items to this plugin's page.

= 0.2.5.2 =

* This WordPress SEO plugin now officially requires PHP5. WordPress version 3.2 will also require it, so you'd better upgrade now. If you're on any version lower than PHP 5.2, this plugin will deactivate itself. You can then use SEO Data Transporter to migrate your data to another plugin, or you could do the more sensible thing and get your hosting upgraded to PHP 5.2 ASAP.

* Bugs fixed:
	* Attempted compatibility fix with other plugins that hook into robots.txt functionality.
	* Issue with not loading meta box for some custom post types.
	* Issue where SEO data for custom post types would not save.
	* Issue where post title in snippet preview would show %%sitename% instead of your site's name when no title template for post type was set.
	* Issue with removing tags when string was empty in JavaScript.
	* Hiding the post_format taxonomy on the right places.
	* Should now work better with crappy themes that do weird things in header.php.

* Design fixes:
	* Updated tabs in meta boxes to reflect Core UI, for more info see [this post](http://developersmind.com/tabbed-meta-box-in-wordpress/) by Pete Mall.

* Enhancements:
	* Now using plugin version number to enqueue files so browser cache isn't in the way when upgrading.
	* Loading scripts in footer now when possible.

= 0.2.5.1 =

* Security fixes:
	* Added nonces for security to htaccess and robots.txt file editing to prevent possible CSRF.

* Bugs fixed:
	* Prevent JS error when WordPress SEO Meta box was hidden on edit pages.
	* Fix for title in snippet preview not showing when no title template was set for the post type.
	* Fix for focus keyword count, would give wrong return on slugs that were too long.
	* Removed post_format from list of taxonomies you can edit title and meta desc template for as it's of no use.
	* Removed post_format from list of taxonomies to exclude for XML Sitemap, it was already excluded by default.

* New features:
	* Option to disable WordPress SEO meta data box on (custom) taxonomies.

= 0.2.5 =

* Bugs fixed:
	* Snippet preview quicker than ever and it no longer blows up some browsers: all AJAX calls have been removed and the entire process is done with JavaScript within the browser.

* Feature enhancements:
	* The meta box on the edit posts page now features tabs, thanks to Pete Mall (even works nicely in the blue theme).
	* Advanced features moved to their own tab instead of button.
	* Focus keyword now shown straight below snippet preview.

* Other news: The Google News module almost ready for mass-deployment. Stay tuned.

= 0.2.3.4 =

* Added WPML config file, so you can SEO in multiple languages.

= 0.2.3.3 =

* Bugs fixed:
	* Comma in priority in sitemap which should be dot. I hate European servers.
	* Fixed a notice in generating a path to the wpseo directory in the uploads dir.
	* Fixed a rather annoying XML Sitemap date issue, props to [Staze in wp.org forums](http://wordpress.org/support/topic/plugin-wordpress-seo-by-yoast-sitemapxml-wrong-date-for-blog?replies=8).

* Feature enhancement:
	* Breadcrumbs now output links to post type archives too.

= 0.2.3.2 =

* Bugs fixed:
	* Fixed race condition where sitemap wouldn't load sometimes.
	* ... in snippet preview are now bold as they should be.
	* Desc and Title in snippet preview should now update less frequently to prevent crashing low mem browsers.

= 0.2.3.1 =

* Bugs fixed:
	* Error in saving certain data when it was a checkbox.
	* Fixed notice for non-existing title and for empty metakey.
	* Fix for an error that could occur when the post thumbnail functionality is not active.
* Changes:
	* Added page numbers to default titles for taxonomies and archives.

= 0.2.3 =

* New features:
	* First stab at (Facebook) OpenGraph implementation.
	* Meta Description can now be returned, using `$wpseo_front->metadesc( false );` for use elsewhere.
	* Plugins can now register their own variables to not be cleaned out when permalink redirect is enabled.

* Bugs fixed:
	* Deleting the dashboard widget will now really delete it.
	* Some fixes for notices.
	* Strip tags out of titles.
	* Use blog charset for XML Sitemap instead of UTF-8.
	* Import of Meta Keywords fixed.
	* Small fix for possible error in AJAX routines.
	* Breadcrumb now actually returns when you ask it to.
	* Fixed some errors in JavaScript of title generation within snippet preview.
	* Removed SEO title from post edit overview as you couldn't edit it there anyway.

* Documentation fixes:
	* Added an extra notice to clean permalink to let people know they're playing with fire.
	* Small improvement to error handling for upload path.

= 0.2.2 =

* Bugs fixed:
	* Disabling sitemaps now properly does what it says on the tin: disable sitemaps.
	* Properly return title for homepage in rare instances where `is_home` returns true for front page even when front page is set to static page (yes, that's a WordPress bug I had to work around).
	* An empty title separator will now be changed to ' - ' so titles don't get all borked.
	* Several fixes in rewrites for MultiSite instances.
	* Option to force http or https on canonical URLs.
	* Several other bugfixes.

= 0.2.1 =

* Bugs fixed:
	* Plugin frontend URL should now be properly defined for sites with https admin.
	* Manually entered category title now actually works.
	* Import now works properly again for HeadSpace and AIOSEO, even for meta keywords.
	* Fixed typo in *wpseo-functions.php*, apparently `udpate_option` is not the same as `update_option`.
	* Fixed a notice about date snippet.
	* Fixed a notice about empty canonical.
	* Prevent cleaning out the WP Subscription managers interface for everyone.
	* Meta keywords are now properly comma separated.
	* Year archives now give proper breadcrumb.
	* Nofollowed meta widget actually works now.
	* %%date%% replacement in templates improved significantly.
	* Shortcodes stripped out in generation of title & description templates.

* Changes:
	* Moved all rewrites to their own class, *inc/class-rewrite.php*.
	* Further improved error handling when *uploads/wpseo* dir creation fails.

* New features:
	* Remove category base, removes `/category/` from category URL's. Find it under Permalinks. Props to [WP No Category Base](http://wordpresssupplies.com/wordpress-plugins/no-category-base/) for having the cleanest code I could find in this area, which I reused and modified.
	* Admin bar goodness: an SEO menu! Try it if you're on 3.1 already, it allows you to perform several SEO actions!

= 0.2 =

* Bugs fixed:
	* Chars left counter works again as you type in title and SEO title.
	* No longer error out when unable to delete sitemap files in site root.
	* Fixed error when `memory_get_peak_usage` doesn't exist (below PHP 5.2).
	* Fixed error when Yoast News feed couldn't be loaded.
	* Fix for people who agressively empty their dashboards.
	* Permalink redirect fix for paginated searches.

* Changes:
	* Plugin now properly reports which sitemap files are blocking it from working properly and asks you to delete them if it can't delete them itself.
	* Some cosmetic fixes to dashboard widget.
	* Removed some old links to Yoast CDN and replaced with images shipped with plugin, for SSL backends.
	* New general settings panel on WPSEO Dashboard which allows you to disable WordPress SEO box on certain post types.
	* Option to use focus keyword in title, meta description and keyword templates.
	* Changed the hook for the permalink cleaning from `get_header` to `template_redirect`, which means it redirects faster and is less error prone.

* New Features:
	* Added option to export taxonomy metadata (PHP 5.2+ only for now).
	* Meta keywords are now an option... I don't like them but there's sufficient demand apparently. Works for homepage, post types, author pages and taxonomies.
	* Added an option to disable the advanced part of the edit post / page metabox.
	* Added option to disable date display in snippet preview for posts.
	* Multisite Network Admin page added, with three features:
		* The option to make WordPress SEO only accessible to Super admins instead of site admins.
		* The option to set a "default" site, from which new sites will henceforth acquire their settings on creation.
		* The option to revert a site to the "default" site's settings.

= 0.1.8 =

* Notice: The functionality in the post / page editor has changed quite a bit. Meta descriptions are now generated using the meta descriptions template if no meta description is entered, so it will for instance use the post excerpt, the SEO title is no longer filled automatically BUT it is properly shown in the snippet preview based on your title template. It should work faster, more intuitive and just better in general, but I do need your feedback, let me know if it's an improvement.

* Bugs fixed:
	* Fixed a notice for non existing metadesc.
	* Fixed several notices in title generation.
	* Directory paths in backend now properly recognized even when erroneously set to 1.
	* Fixed bug where frontpage title wouldn't be generated properly.
	* Made sure unzip of settings.zip (for settings import) works properly everywhere (by getting rid of `WP_Filesystem` and `unzip_file()`, as they do not work reliably).
	* Made sure meta descriptions are not shown on paged archives or homepages.

* Changes:
	* Admin:
		* Moved image used in news widget into images directory instead of loading from CDN to prevent https issues.
	* Breadcrumbs:
		* Creating proper breadcrumbs for daily archives now (linking back to month archives).
	* Post / Page edit box:
		* Meta description now properly generated using template for that particular post_type.
		* SEO Title is no longer auto filled, if you leave it empty "normal" title template generation is used.
		* Several improvements to javascripts.
	* Titles, Meta descriptions & Canonicals:
		* Speed up of variable replacement for titles and meta descriptions.
		* In fallback titles (when there's no template), plugin now sticks to `$sep` defined in `wp_title`.
		* Now properly generating canonical links for date archives.
		* The %%date%% variable now works properly on date archives too.
		* Added new filter to make title work properly on HeadWay 2.0.5 and up.
		* Fixed canonical and permalink redirection for paginated pages and posts (props to @rrolfe for finding the bug and coming up with first patch).
	* XML Sitemaps:
		* During sitemap generation, plugin now checks whether old sitemap.xml or sitemap.xml.gz files exist in root and deletes those if so.
		* Made including images optional.
		* Made it possible to pick which search engines to ping.
		* Fix in XSL path generation on HTTPS admin backends when frontend is normal HTTP.
		* XML Sitemap update on post publish now actually works properly.
		* No longer are XML Sitemaps enabled automatically when publishing a post (sorry about that).

= 0.1.7.1 =

* Apparently `is_network_admin()` didn't exist before WP 3.1. D0h!!!

= 0.1.7 =

* Bugs fixed:
	* Empty Home link when blog page is used and no settings have been set.
	* Fixed couple more notices (well, like, 10).
	* Bug in directory creation that would create the directory correctly but still throw an error and save the path wrongly to options.
	* Dismissing Blog public warning was only possible on SEO pages, now it's possible everywhere.
	* Excerpts, when used in description, are now properly sanitized from tags and shortcodes.
	* Properly fallback to `$wp_query->get_queried_object()` instead of `get_queried_object()` for < 3.1 installs.
	* Fixed several bugs in title generation, making it more stable and faster in the process.
	* Properly escape entities in page titles, both in front end and in posts overview.

* Changes:
	* Latest news from Yoast now appears on Network Admin too, and you can disable it there and on normal admin pages individually. First step towards getting a Multi Site Network Admin SEO page.
	* Added a "Re-test focus keyword" button for people using the Rich Text editor, which wasn't sending update events properly.

= 0.1.6 =

* New features:
	* Export & Import your WordPress Settings easily.
	* You can now supply extra variables to prevent from being cleaned out when clean permalinks is on.

* Bugs fixed:
	* No longer throw errors when wpseo dir cannot be created.
	* Your blog is not public warning can now be properly dismissed.
	* Fixed rewrite issues: apparently if you only load rewrite rules on the front-end, they don't get added when changing rewrites in the backend. D0h.
	* Rewrite rule for sitemap is now forced even harder when regenerating sitemap by hand.
	* Search permalinks now work properly, though in "old" ?s=query style, because of a bug in core.
	* Breadcrumbs no longer errors when term that is supposed to show is empty.
	* Enabling breadcrumbs without setting any of the text fields no longer gives notices but proper defaults.
	* Proper fallback for get_term_title for pre WP 3.1 sites with custom taxonomies.

* Changes:
	* You can now dismiss settings advice.
	* You can now fix some of the settings advice just by clicking the button.
	* You can now make posts, pages and taxonomy terms of any kind always appear in sitemap even if they're noindex, or never, set on a piece by piece basis.
	* Permalink changes now invoke immediate XML sitemap update.
	* Added canonical url to the blog page if using a static page for front page (props [@rrolfe](http://twitter.com/rrolfe)).
	* Removing RSS feeds now actually works (props @rrolfe).
	* Added breadcrumb for 404 pages (props @rrolfe).
	* Drastically reduced memory usage during XML sitemap generation.

= 0.1.5 =

* Bugs fixed:
	* Duplicate noodp,noydir showing up in some occasions. Reworked most of robots meta output function.
	* Fixed couple more notices.
	* Trailing slash (when option set) now applied correctly in XML sitemap too.
	* Made sure regenerating sitemap worked again on post publish.
	* Force flush rewrite rules on activation / upgrade of plugin to make rewrite work.
	* Fixed empty RSS content bug caused in 0.1.4.

* Changes:
	* Removed part done quick edit functionality, will need to revisit once API improves.
	* Implemented a hook that would make the title work with Thematic based themes properly.
	* Added option to remove "start" rel link from head section.
	* Several style sheet changes to make backend styling easier and more robust.
	* Added option to force rewrite titles for people that can't adapt their theme, it's ugly but not as ugly as how All In One SEO handles it.
	* If title templates aren't set, the plugin now generates proper default titles.
	* The News module has moved to a separate directory, where all other modules will reside too, so they can be updated individually later. Download link for the news module will appear on yoast.com shortly.

* Documentation:
	* Added Admin Only notice in HTML code when no meta description could be generated.
	* Added a donation box, I'll gladly take your money ;)

= 0.1.4 =

* Bugs fixed:
	* Fixed canonical for paginated archives of any kind when permalink structure doesn't end with /
	* Fixed permalink redirect for paginated archives of any kind when permalink structure doesn't end with /
	* Made sure blog shows up in breadcrumbs when you want it too.
	* Fixed small javascript notice for js/wp-seo-metabox.js
	* Rewrote parts of XML Sitemap generation so it's now fully compliant with MultiSite. You no longer have to choose paths for sitemaps, they'll all have fixed locations and using WP Rewrite will be placed in the correct positions, f.i. example.com/sitemap.xml.
	* Heavily reduced memory usage on admin pages.
	* Rewrote module structure and added some API's to be used in the modules.
	* Plugin now creates uploads/wpseo dir to store all files it creates and takes in.
	* Fixed several notices throughout the code.
	* Made sure SEO title in edit posts screen shows correct SEO Title.
	* Changed table sorting javascript for XSL's to Yoast CDN.

= 0.1.3 =

* Bugs fixed:
	* SEO Title no longer being overwritten when it's already set.
	* Titles for date archives work too now.
	* On initial page load or SEO title regeneration number of chars remaining updates properly.
	* Entities in titles and meta descriptions should now work correctly.
	* When editing SEO title snippet preview now correctly updates with focus keyword bolded.
	* Entities in XML sitemap should now show correctly.
	* When using %%excerpt%% in descriptions it now correctly is shortened to 155 chars.
	* Regenerating XML News sitemaps should no longer give a Fatal error but just work.
	* Focus keyword should now properly be recognized in slug even when slug is too long to display.
	* Breadcrumbs now show proper home link when showing blog link is disabled.
	* Non post singular pages (pages and custom post types) no longer show blog link in breadcrumb path.

* New features:
	* Added option to regenerate SEO title (just click the button).
	* Advanced button now looks cooler (hey even little changes deserve a changelog line!).
	* Now pinging Ask.com too for updated sitemaps, for those of you caring about SEO for Ask.
	* Added plugin version number to "branding" comment to help in bug fixing.

= 0.1.2.1 =

* Added a missing ) to prevent death on install / going into wp-admin.

= 0.1.2 =

* Bugs fixed:
	* Non ASCII characaters should now display properly.
	* Google News Module: added input field for Google News publication name, as this has to match how Google has you on file.
	* Stripped tags out of title and meta description output when using, f.i., excerpts in template.
	* Meta description now updates in snippet preview as well when post content changes and no meta description has been set yet.
	* Meta description generated from post content now searches ahead to focus keyword and bolds it.
	* Meta description should now show properly on blog pages when blog page is not site homepage.
	* Alt or title for previous image could show up in image sitemap when one image didn't have that attribute.
	* Prevented fatal error on remote_get of XML sitemap in admin/ajax.php.
	* When there's a blog in / and in /example/ file editor should now properly get robots.txt and .htaccess from /example/ and not /.
	* Reference to wrongly named yoast_breadcrumb_output fixed, should fix auto insertion of breadcrumbs in supported theme frameworks.
	* Prevented error when yoast.com/feed/ doesn't work.
	* Fixed several notices for unset variables.
	* Added get text calls in several places to allow localization.

* (Inline) Documentation fixes:
	* Exclusion list in XML sitemap box for post types now shows proper label instead of internal name.
	* Exclusion list in XML sitemap box for custom taxonomies now shows plural instead of singular form.
	* Added explanation on how to add breadcrumbs to your theme, as well as link to more explanatory page.

* Changes:
	* Links to Webmaster Tools etc. now open in new window.
	* Heavily simplified the javascript used for snippet preview, removing HTML5 placeholder code and instead inserting the title into the input straight away. Lot faster this way.
	* Removed Anchor text for the blog page option from breadcrumbs section as you can simply set a breadcrumbs title on the blog page itself.
	* Added option to always remove the Blog page from the breadcrumb.

= 0.1.1 =

* Bugs fixed:
	* Double comma in robots meta values, as well as index,follow in robots meta.
	* Oddities with categories in breadcrumbs fixed.
	* If complete meta value for SE is entered it's now properly stripped, preventing /> from showing up in your page.
	* Category meta description now shows properly when using category description template.
	* Removed Hybrid breadcrumb in favor of Yoast breadcrumb when automatically adding breadcrumb to Hybrid based themes.
	* First stab at fixing trailing slashed URL's in XML sitemaps.
	* Made %%page%% also work on page 1 of a result set.
	* Fixed design of broken feed error.
	* Made sure %%tag%% works too in title templates.

* (Inline) Documentation fixes:
	* Added this readme.txt file describing all the SEO functionality, and why this is _the_ All in one SEO plugin.
	* MS Webmaster Central renamed to Bing Webmaster Tools.
	* Added links to Bing Webmaster Tools and Yahoo! Site explorer to meta values box, as well as an explanation that you do not need to use those values if your site is already verified.
	* Changed wording on description of clean permalinks.
	* Added line explaining that SEO title overwrites the SEO title template.
	* Added line telling to save taxonomy and post_type excludes before rebuilding XML sitemap.

* Changes:
	* Changed robots meta noindex and nofollow storage for pages to boolean on noindex and nofollow, please check when upgrading.
	* Now purging W3TC Object Cache when saving taxonomy meta data to make sure new settings are immediately reflected in output.
	* Namespaced all menu items to prevent collissions with other plugins.
	* Several code optimizations in admin panels.
	* Huge code optimizations in breadcrumbs generation and permalink clean up.
	* Permalink cleaning now works for taxonomies too.
	* Faked All in One SEO class to make plugin work with themes that check for that.

* New features:
	* Noindex and nofollow options for taxonomies (noindexing a term automatically removes it from XML sitemap too).
	* Editable canonicals for taxonomies.
	* Completed module functionality, using the XML News sitemap as first module.
	* Added experimental "Find related keywords" feature that'll return keywords that are related to your focus keyword.

* Issues currently in progress:
	* WPML compatibility for the multilingual SEO's.
	* XML Sitemap errors in Bing Webmaster Tools (due to use of "caption" for images).


= 0.1 =

* Initial beta release.

== Upgrade Notice ==

= 0.3.4 =
Upgrade immediately to make sure your WordPress install is secure.