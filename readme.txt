=== WordPress SEO by Yoast ===
Contributors: joostdevalk, barrykooij
Donate link: https://yoast.com/
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: seo, SEO, google, meta, meta description, search engine optimization, xml sitemap, xml sitemaps, google sitemap, sitemap, sitemaps, robots meta, rss, rss footer, yahoo, bing, news sitemaps, XML News Sitemaps, WordPress SEO, WordPress SEO by Yoast, yoast, multisite, canonical, nofollow, noindex, keywords, meta keywords, description, webmaster tools, google webmaster tools, seo pack
Requires at least: 3.5
Tested up to: 3.9
Stable tag: 1.5.2.8

Improve your WordPress SEO: Write better content and have a fully optimized WordPress site using the WordPress SEO plugin by Yoast.

== Description ==

WordPress out of the box is already technically quite a good platform for SEO, this was true when I wrote my original [WordPress SEO](https://yoast.com/articles/wordpress-seo/) article in 2008 (and updated every few months) and it's still true today, but that doesn't mean you can't improve it further! This plugin is written from the ground up by Joost de Valk and his team at [Yoast](https://yoast.com/) to improve your site's SEO on *all* needed aspects. While this [WordPress SEO plugin](https://yoast.com/wordpress/plugins/seo/) goes the extra mile to take care of all the technical optimization, more on that below, it first and foremost helps you write better content.  WordPress SEO forces you to choose a focus keyword when you're writing your articles, and then makes sure you use that focus keyword everywhere.

> = Premium Support =
> The Yoast team does not provide support for the WordPress SEO plugin on the WordPress.org forums. One on one email support is available to people who bought the [Premium WordPress SEO plugin](https://yoast.com/wordpress/plugins/seo-premium/) only.
> Note that the Premium SEO plugin has several extra features too so it might be well worth your investment!
>
> You should also check out the [Local SEO](https://yoast.com/wordpress/plugins/local-seo/) and [Video SEO](https://yoast.com/wordpress/plugins/video-seo/) extensions to WordPress SEO, these of course come with support too.

= Write better content with WordPress SEO =
Using the snippet preview you can see a rendering of what your post or page will look like in the search results, whether your title is too long or too short and your meta description makes sense in the context of a search result. This way the plugin will help you not only increase rankings but also increase the click through for organic search results.

= Page Analysis =
The WordPress SEO plugins [Linkdex Page Analysis](https://yoast.com/content-seo-wordpress-linkdex/) functionality checks simple things you're bound to forget. It checks, for instance, if you have images in your post and whether they have an alt tag containing the focus keyword for that post. It also checks whether your posts are long enough, if you've written a meta description and if that meta description contains your focus keyword, if you've used any subheadings within your post, etc. etc.

The plugin also allows you to write meta titles and descriptions for all your category, tag and custom taxonomy archives, giving you the option to further optimize those pages.

Combined, this plugin makes sure that your content is the type of content search engines will love!

= Technical WordPress Search Engine Optimization =
While out of the box WordPress is pretty good for SEO, it needs some tweaks here and there. This WordPress SEO plugin guides you through some of the settings needed, for instance by reminding you to enable pretty permalinks. But it also goes beyond that, by automatically optimizing and inserting the meta tags and link elements that Google and other search engines like so much:

= Meta & Link Elements =
With the WordPress SEO plugin you can control which pages Google shows in its search results and which pages it doesn't show. By default, it will tell search engines to index all of your pages, including category and tag archives, but only show the first pages in the search results. It's not very useful for a user to end up on the third page of your "personal" category, right?

WordPress itself only shows canonical link elements on single pages, WordPress SEO makes it output canonical link elements everywhere. Google has recently announced they would also use `rel="next"` and `rel="prev"` link elements in the `head` section of your paginated archives, this plugin adds those automatically, see [this post](https://yoast.com/rel-next-prev-paginated-archives/ title="rel=next & rel=prev for paginated archives") for more info.

= XML Sitemaps =
WordPress SEO has the most advanced XML Sitemaps functionality in any WordPress plugin. Once you check the box, it automatically creates XML sitemaps and notifies Google & Bing of the sitemaps existence. These XML sitemaps include the images in your posts & pages too, so that your images may be found better in the search engines too.

These XML Sitemaps will even work on large sites, because of how they're created, using one index sitemap that links to sub-sitemaps for each 1,000 posts. They will also work with custom post types and custom taxonomies automatically, while giving you the option to remove those from the XML sitemap should you wish to.

Because of using [XSL stylesheets for these XML Sitemaps](https://yoast.com/xsl-stylesheet-xml-sitemap/), the XML sitemaps are easily readable for the human eye too, so you can spot things that shouldn't be in there.

= RSS Optimization =
Are you being outranked by scrapers? Instead of cursing at them, use them to your advantage! By automatically adding a link to your RSS feed pointing back to the original article, you're telling the search engine where they should be looking for the original. This way, the WordPress SEO plugin increases your own chance of ranking for your chosen keywords and gets rid of scrapers in one go!

= Breadcrumbs =
If your theme is compatible, and themes based on Genesis or by WooThemes for instance often are, you can use the built-in Breadcrumbs functionality. This allows you to create an easy navigation that is great for both users and search engines and will support the search engines in understanding the structure of your site.

Making your theme compatible isn't hard either, check [these instructions](https://yoast.com/wordpress/plugins/breadcrumbs/).

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

Read [this migration guide](https://yoast.com/all-in-one-seo-pack-migration/) if you still have questions about migrating from another SEO plugin to WordPress SEO.

= WordPress SEO Plugin in your Language! =
Currently a huge translation project is underway, translating WordPress SEO in as much as 24 languages. So far, the translations for French and Dutch are complete, but we still need help on a lot of other languages, so if you're good at translating, please join us at [translate.yoast.com](http://translate.yoast.com).

= News SEO =
Be sure to also check out the [News SEO module](https://yoast.com/wordpress/plugins/news-seo/) if you need Google News Sitemaps. It tightly integrates with WordPress SEO to give you the combined power of News Sitemaps and full Search Engine Optimization.

= Further Reading =
For more info, check out the following articles:

* [WordPress SEO - The definitive Guide by Yoast](https://yoast.com/articles/wordpress-seo/).
* Once you have great SEO, you'll need the [best WordPress Hosting](https://yoast.com/articles/wordpress-hosting/).
* The [WordPress SEO Plugin](https://yoast.com/wordpress/plugins/seo/) official homepage.
* Other [WordPress Plugins](https://yoast.com/wordpress/plugins/) by the same author.
* Follow Yoast on [Facebook](https://facebook.com/yoast) & [Twitter](http://twitter.com/yoast).

== Installation ==

1. Upload the `wordress-seo` folder to the `/wp-content/plugins/` directory
1. Activate the WordPress SEO plugin through the 'Plugins' menu in WordPress
1. Configure the plugin by going to the `SEO` menu that appears in your admin menu

== Frequently Asked Questions ==

You'll find the [FAQ on Yoast.com](https://yoast.com/wordpress/plugins/seo/faq/).

== Screenshots ==

1. The WordPress SEO plugin general meta box. You'll see this on edit post pages, for posts, pages and custom post types.
2. Some of the sites using this WordPress SEO plugin.
3. The WordPress SEO settings for a taxonomy.
4. The fully configurable XML sitemap for WordPress SEO.
5. Easily import SEO data from All In One SEO pack and HeadSpace2 SEO.
6. Example of the Page Analysis functionality.
7. The advanced section of the WordPress SEO meta box.

== Changelog ==

= 1.5.2.8 =

* Bugfixes
	* Added some missing textdomains.
	* Fixed a license manager request bug.
	* Work-around for fatal error caused by other plugins doing front-end post updates without loading all the required WP files, such as the WP Google Forms plugin - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed incorrect link to Issues in CONTRIBUTING.md - props [GaryJones](https://github.com/GaryJones).
	* Fixed a fatal error caused by not checking if Google Suggest request reponse is valid - props [jeremyfelt](https://github.com/jeremyfelt).
	* Fixed a screen option bug in bulk edit options - props [designerken](https://github.com/designerken).
	* Fixed warnings on edit files section - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed a warning when post_type is an array - props [unr](https://github.com/unr).

* i18n
	* Updated el_GR, hu_HU, nl_NL and pl_PL

= 1.5.2.7 =

* Bugfixes
	* Fixed a WordPress Network license bug.

* i18n
	* Updated el_GR, fa_IR, hu, it_IT, pt_PT, ru_RU, tr_TK and zh_CN
	* Added Malay

= 1.5.2.6 =

* Bugfixes
	* Fixed Open Graph Facebook Debubber Tags/Categories Issue, tags/categories are now grouped into one metatag - props [lgrandicelli](https://github.com/lgrandicelli).
	* Fixed: %%cf_<custom-field-name>%% and %%parent_title%% not being resolved in the preview snippet as reported by [Glark](https://github.com/Glark) in [issue #916](https://github.com/Yoast/wordpress-seo/issues/916) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Options are no longer deleted on plugin uninstall.
	* Fixed a bug that caused the 'Plugins activated' message to be removed by the robots error message - props [andyexeter](https://github.com/andyexeter).
	* Fix white screen/blog down issues caused by some webhosts actively disabling the PHP ctype extension - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixes Metabox Social tab media uploader not working on custom post types which don't use media as reported by [Drethic](https://github.com/Drethic) in [issue #911](https://github.com/Yoast/wordpress-seo/issues/911) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed vars not being replaced in OG description tag.

* Enhancement
	* Fix PHP warnings when post_type is an array.

= 1.5.2.5 =

* Bugfixes
	* Fixed: Premium support link was being added to all plugins, not just ours ;-)
	* Only show the breadcrumbs-blog-remove option if user uses page_for_posts as it's not applicable otherwise and can cause confusion.
	* Clean up url query vars after use in our settings page to avoid actions being executed twice - props [Jrf](http://profiles.wordpress.org/jrf).

= 1.5.2.4 =

* Bugfixes
	* Changed 'wpseo_frontend_head_init' hook to 'template_redirect' to prevent incorrect canonical redirect.
	* Improved upgrade routine for breadcrumbs maintax/pt option as reported by [benfreke](https://github.com/benfreke) in [issue #849](https://github.com/Yoast/wordpress-seo/issues/849) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed a bug where the banners overlapped WordPress notices/errors.
	* Fixed: Slashes in Taxonomy text inputs as reported by [chuckreynolds](https://github.com/chuckreynolds) in [issue #868](https://github.com/Yoast/wordpress-seo/issues/868) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Increased priority (decreased priority int) on the template_redirect for the sitemap redirect hook.
	* Fixed: `current_user_can` was being called too early as reported by [satrya](https://github.com/satrya) in [issue #881](https://github.com/Yoast/wordpress-seo/issues/881) - props [Jrf](http://profiles.wordpress.org/jrf).

* Enhancement
	* Enhanced validation of webmaster verification keys to prevent invalidating incorrect input which does contain a key as reported by [TheZoker](https://github.com/TheZoker) in [issue #864](https://github.com/Yoast/wordpress-seo/issues/864) - props [Jrf](http://profiles.wordpress.org/jrf).

= 1.5.2.3 =

** Note: if you already upgraded to v1.5+, you will need to retrieve your Facebook Apps again and please also check your Google+ URL. We had some bugs with both being escaped too aggressively. Sorry about that. **

* Bugfixes
	* Added missing settings menu pages to wp admin bar.
	* Replaced old AdWords keyword tool link.
	* Fix wp admin bar keyword density check link
	* Taxonomy sitemap will now also show if empty.
	* Prevent infinite loop triggered by `sitemap_close()`, fixes [#600](https://github.com/Yoast/wordpress-seo/issues/) as reported and fixed by [pbogdan](https://github.com/pbogdan).
	* Fixed a link count Page Analysis bug.
	* Fixed a keyword density problem in the Page Analysis
	* Fixed OpenGraph/GooglePlus/Twitter tags not showing in a select few themes, [issue #750](https://github.com/Yoast/wordpress-seo/issues/750) as reported by [Jovian](https://github.com/Jovian) and [wwdboer](https://github.com/wwdboer) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed Facebook Apps not being saved/ "Failed to retrieve your apps from Facebook" as reported by [kevinlisota](https://github.com/kevinlisota) in [issue #812](https://github.com/Yoast/wordpress-seo/issues/812) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed duplicate feedback messages on WPSEO -> Social pages as reported by [steverep](https://github.com/steverep) in [issue #743](https://github.com/Yoast/wordpress-seo/issues/743) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Flush our force title rewrite buffer earlier in `wp_footer` so it can be used by other plugins in `wp_footer`. Props [Gabriel Pérez Salazar](http://www.guero.net/).
	* Start the force rewrite buffer late (at 999) in `template_redirect` instead of `get_header` because of several themes not using `get_header`, issue [#817](https://github.com/Yoast/wordpress-seo/issues/817) as reported by [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed 'Page %d of %d' / %%page%% variable not being replaced when on pages, as reported by [SGr33n](https://github.com/SGr33n) in [issue #801](https://github.com/Yoast/wordpress-seo/issues/801) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Restore robots meta box per post to its former glory, it now shows even when blog is not set to public.
	* Fixed individual page robots settings not being respected when using a page as blog as reported by [wintersolutions](https://github.com/wintersolutions) in [issue #813](https://github.com/Yoast/wordpress-seo/issues/813) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed: Too aggressive html escaping of the breadcrumbs.
	* Fixed: Last breadcrumb wasn't always determined correctly resulting in crumbs not being linked when they should have been.
	* Fixed: Breadcrumbs were sometimes missing separators and default texts since v1.5.0.
	* Fixed: 404 date based breadcrumb and title creation could cause corruption of the `$post` object.
	* Fixed: Filtering posts based on SEO score via the dropdown at the top of a post/page overview page no longer worked. Fixed. As reported by [gmuehl](https://github.com/gmuehl) in [issue #838](https://github.com/Yoast/wordpress-seo/issues/838) - props [Jrf](http://profiles.wordpress.org/jrf).

* Enhancements
	* Added filters for the change frequencies of different URLs added to the sitemap. Props to [haroldkyle](https://github.com/haroldkyle) for the idea.
	* Added filter `wpseo_sitemap_exclude_empty_terms` to allow including empty terms in the XML sitemap.
	* Private posts now default to noindex (even though they technically probably couldn't be indexed anyway).
	* Show a warning message underneath a post's robots meta settings when site is set to noindex sitewide in WP core.
	* Updated licensing class to show a notice when requests to yoast.com are blocked because of `WP_HTTP_BLOCK_EXTERNALS`.

* Other
	* Refactored the breadcrumb class - props [Jrf](http://profiles.wordpress.org/jrf).

= 1.5.2.2 =

* Bugfixes
	* Fix for issue with Soliloquy image slider was not applied to minified js file.
	* Fixed some PHP 'undefined index' notices.
	* Fix banner images overlapping text in help tabs.
	* Fixed meta description tag not showing for taxonomy (category/tag/etc) pages as reported in [issue #737](https://github.com/Yoast/wordpress-seo/issues/737) and [#780](https://github.com/Yoast/wordpress-seo/issues/780) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Prevent a fatal error if `wp_remote_get()` fails while testing whether the title needs to be force rewritten as reported by [homeispv](http://wordpress.org/support/profile/homeispv) - props [Jrf](http://profiles.wordpress.org/jrf).

* Enhancements
	* Added composer support - props [codekipple](https://github.com/codekipple) and [Rarst](https://github.com/Rarst).

= 1.5.2.1 =

* Bugfixes
	* Fix white screen/blog down issues caused by some (bloody stupid) webhosts actively disabling the filter extension - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fix for some PHP notices, [issue #747](https://github.com/Yoast/wordpress-seo/issues/747) as reported by [benfreke](https://github.com/benfreke) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed: GooglePlus vanity urls were saved without the `+` as reported by [ronimarin](https://github.com/ronimarin) in [issue #730](https://github.com/Yoast/wordpress-seo/issues/730) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fix WP Admin menu items no longer clickable when on WPSEO pages as reported in [issue #733](https://github.com/Yoast/wordpress-seo/issues/733) and [#738](https://github.com/Yoast/wordpress-seo/issues/738) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fix strict warning for W3TC, [issue 721](https://github.com/Yoast/wordpress-seo/issues/721).
	* Fix RSS text strings on options page being double escaped, [issue #731](https://github.com/Yoast/wordpress-seo/issues/731) as reported by [namaserajesh](https://github.com/namaserajesh) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Avoid potential confusion over Facebook OpenGraph front page usage, [issue #570](https://github.com/Yoast/wordpress-seo/issues/570) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Potentially fix [issue 565](https://github.com/Yoast/wordpress-seo/issues/565) bbpress warning message. Thanks [inetbiz](https://github.com/inetbiz) for reporting and [tobylewis](https://github.com/tobylewis) for finding the likely cause.
	* Filter 'wpseo_pre_analysis_post_content' output is now only loaded in DOM object if not empty. - props [mgmartel](https://github.com/mgmartel).
	* $post_content is now unset after loading in DOM object. - props [mgmartel](https://github.com/mgmartel).
	* Fix Alexa ID string validation, as reported by [kyasajin](https://github.com/kyasajin) and [Bubichka](https://github.com/Bubichka) in [issue 736](https://github.com/Yoast/wordpress-seo/issues/736) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fix issue with Soliloquy image query, as reported by [osalcedo](https://github.com/osalcedo) and [mattisherwood](https://github.com/mattisherwood) in [issue #733](https://github.com/Yoast/wordpress-seo/issues/733) - props [Jrf](http://profiles.wordpress.org/jrf).

* Enhancements
	* Twitter metatag key is now filterable by 'wpseo_twitter_metatag_key'.
	* Added a filter called "wpseo_replacements" in wpseo_replace_vars to allow customization of the replacements before they are applied - props [martinernst](https://github.com/martinernst).
	* Added useful links for page analysis - props [bhubbard](https://github.com/bhubbard).

* i18n Updates
	* Updated nl_NL, id_ID, it_IT, fr_FR and de_DE
	* Added ko
	* Updated .pot file.

= 1.5.2 =

* Bugfix:
	* If `mbstring` extension isn't loaded, fatal error was thrown.

= 1.5.0 =

This release contains tons and tons of bugfixes and security improvements. Credits for this release largely go to Juliette Reinders Folmer aka [Jrf](http://profiles.wordpress.org/jrf) / [jrfnl](https://github.com/jrfnl).

Also a heartfelt thanks go out to the beta testers who tested all the changes. Special mentions for testers [Woyto](https://github.com/Woyto), [Bnpositive](https://github.com/Bnpositive), [Surbma](https://github.com/Surbma), [DavidCH1](https://github.com/DavidCH1), [TheITJuggler](https://github.com/TheITJuggler), [kletskater](https://github.com/kletskater) who caught a number of bugs and provided us with actionable information to fix these.

This version also incorporates the [SEO Extended](http://wordpress.org/plugins/seo-extended/) plugin functionality into WP SEO with graceful thanks to [Faison](http://profiles.wordpress.org/faison/) and [Scott Offord](http://profiles.wordpress.org/scottofford/) for their great work on this plugin.

**This version contains a lot of changes under the hood which will break backward compatibility, i.e. once you've upgraded, downgrading will break things.** So make sure you make a backup of your settings/database before upgrading.


* Bugfixes
	* Major overhaul of the way the plugin deals with options. This should fix a truck-load of bugs and provides improved security.
	* Major overhaul of the way the plugin deals with post meta values. This should fix a truck-load of bugs and provides improved security.
	* Major overhaul of the way the plugin deals with taxonomy meta values. This should fix a truck-load of bugs and provides improved security.

	* Fixed: Renamed a number of options as they ran the risk of being overwritten by post type/taxonomy options which could get the same name. This may fix some issues where options did not seem to get saved correctly.

	* Fixed: if page specific keywords were set for a static homepage, they would never be shown.
	* Fixed: if only one FB admin was selected, the tag would not be added.
	* Fixed: bug where taxonomies which were on an individual level set to noindex and sitemap include 'auto-detect' would still be shown in the sitemap
	* Fixed: bug in canonical urls where an essential part of the logic was skipped for singular posts/pages
	* Fixed: category rewrite rules could have errors for categories without parent categories.
	* Fixed: bug in delete_sitemaps() - wrong retrieval of needed options.
	* Fixed: HTML sitemaps would sometimes display headers without a link list.
	* Fixed: Breadcrumbs could potentially output an empty element as part of the chain, resulting in two separators in a row.
	* Fixed: Breadcrumbs: even when removing the prefix texts from the admin page, they would sometimes still be included.
	* Improved fixed for possible caching issue when `title_test` option remained set, issue [#627](https://github.com/Yoast/wordpress-seo/issues/627).
	* Fixed bug in `title_test_helper` where it would pass the wrong information to `update_option()`, related to issue [#627](https://github.com/Yoast/wordpress-seo/issues/627).
	* Fixed: shortcodes should be removed from ogdesc.

	* Fixed: Admin -> Dashboard -> Failed removal of the meta description from a theme file would still change the relevant internal option as if it had succeeded.
	* Fixed: Admin -> Dashboard -> bug where message about files blocking the sitemap from working would not be removed when it should.
	* Fixed: Admin -> Titles & Meta's -> Post types would show attachments even when attachment redirection to post was enabled.
	* Fixed: Admin -> Import -> Fixed partially broken import functionality for WooThemes SEO framework
	* Fixed: Admin -> Import -> Importing settings from file would not always work due to file/directory permission issues.
	* Fixed: Admin -> Export -> Some values were exported in a way that they couldn't be imported properly again.
	* Fixed: Admin -> Import/Export -> On export, the part of the admin page after export would not be loaded.
	* Fixed: Admin -> Various -> Removed some superfluous hidden fields which could cause issues.
	* Fixed: Admin -> Social -> The same fb user can no longer be added twice as Facebook admin.

	* Admin -> Multi-site -> Added error message when user tries to restore to defaults a non-existent blog (only applies to multi-site installations).

	* Bow out early from displaying the post/taxonomy metabox if the post/taxonomy is not public (no use adding meta data which will never be displayed).
	* Prevent the SEO score filter from displaying on a post type overview page if the metabox has been hidden for the post type as suggested by [coreyworrell](https://github.com/coreyworrell) in issue [#601](https://github.com/Yoast/wordpress-seo/issues/601).

	* Improved: post meta -> the keyword density calculation for non-latin, non-ideograph languages - i.e. cyrillic, hebrew etc - has been improved. Related issues [#703](https://github.com/Yoast/wordpress-seo/issues/703), [#681](https://github.com/Yoast/wordpress-seo/issues/681), [#349](https://github.com/Yoast/wordpress-seo/issues/349) and [#264](https://github.com/Yoast/wordpress-seo/issues/264). The keyword density calculation for ideograph based languages such as Japanese and Chinese will not work yet, issue [#145](https://github.com/Yoast/wordpress-seo/issues/145) remains open.
	* Fixed: post meta -> SEO score indicator -> wpseo_translate_score() would never return score, but always the css value.
	* Fixed: post meta -> SEO score indicator -> wpseo_translate_score() calls were passing unintended wrong parameters
	* Fixed: post meta -> page analysis -> text analysis did not respect the blog character encoding. This may or may not solve a number of related bugs.
	* Fixed: post meta -> often wrong meta value was shown for meta robots follow and meta robots index in post meta box so it appeared as if the chosen value was not saved correctly.
	* Fixed: post meta -> meta robots advanced entry could have strange (invalid) values.
	* Fixed: post meta -> since v1.4.22 importing from other plugins would import data even when the post already had WP SEO values, effectively overwritting (empty by choice) WPSEO fields.
	* Fixed: post meta -> A few of the meta values could contain line breaks where those aren't allowed.

	* Fixed: taxonomy meta -> breadcrumb title entry field would show for taxonomy even when breadcrumbs were not enabled
	* Fixed: taxonomy meta -> bug where W3TC cache for taxonomy meta data wouldn't always be refreshed when it should and sometimes would when it shouldn't

	* Fixed: some things should work better now for must-use installations.
	* Added sanitation/improved validation to $_GET and $_POST variables if/when they are used in a manner which could cause security issues.
	* Fixed: wrong file was loaded for the get_plugin_data() function.
	* Fixed: several bug-sensitive code constructs. This will probably get rid of a number of hard to figure out bugs.
	* Fixed: several html validation issues.
	* Prevent error when theme does not support featured images, issue [#639](https://github.com/Yoast/wordpress-seo/issues/639) as reported by [kuzudecoletaje](https://github.com/kuzudecoletaje).


* Enhancements
	* The [SEO Extended](http://wordpress.org/plugins/seo-extended/) plugin functionality has now been integrated into WP SEO.
	* Added ability to add Pininterest and Yandex site verification tags. You can enter this info on the WPSEO Dashboard and it will auto-generate the relevant meta tags for your webpage headers.
	* New `[wpseo_breadcrumb]` shortcode.
	* Post meta -> Don't show robots index/no-index choice in advanced meta box if there is a blog-wide override in place, i.e. the Settings -> Reading -> Block search engines checkbox is checked.
	* Post meta -> Added 'Site-wide default' option to meta robots advanced field in advanced meta box.
	* Post meta -> Added an option to decide whether to include/exclude `rel="author"` on a per post base as suggested by [GaryJones](https://github.com/GaryJones). (Added to the advanced meta box).
	* Taxonomy meta -> Don't show robots index/no-index choice in taxonomy meta box if there is a blog-wide override in place, i.e. the Settings -> Reading -> Block search engines checkbox is checked.
	* Admin -> If WP_DEBUG is on or if you have set the special constant WPSEO_DEBUG, a block with the currently saved options will be shown on the settings pages.
	* Admin -> Dashboard -> Added error message for when meta description tag removal from theme file fails.
	* Admin -> Titles & Meta -> Added option to add meta keywords to post type archives.
	* Admin -> Social -> Facebook -> Added error messages for if communication with Facebook failed.
	* Admin -> Import -> WPSEO settings -> Better error messages for when importing the settings fails and better clean up after itself.
	* Adminbar -> Keyword research links now also search for the set the keyword when editing a post in the back-end.
	* [Usability] Proper field labels for user profile form fields.
	* The New Relic daemon (not the W3TC New Relic PHP module) realtime user monitoring will be turned off for xml/xsl files by default to prevent breaking the sitemaps as suggested by [szepeviktor](https://github.com/szepeviktor) in [issue #603](https://github.com/Yoast/wordpress-seo/issues/603)
	* General jQuery efficiency improvements.
	* Improved lazy loading of plugin files using autoload.
	* Made the Google+ and Facebook post descriptions translatable by WPML.
	* Better calculation precision for SEO score
	* Improved 403 headers for illegal file requests as suggested by [cfoellmann](https://github.com/cfoellmann)
	* Synchronized TextStatistics class with changes from the original, this should provide somewhat better results for non-latin languages.
	* CSS and JS files are now minified
	* Rewrote query logic for XML sitemaps
	* Changed default settings for rel="author"
	* Added option to switch to summary card with image for Twitter cards
	* Made several changes to Open Graph logic
	* Implemented new Yoast License framework
	* Added possibility to create a robots.txt file directly on the server

* Other:
	* Removed some backward compatibility with WP < 3.5 as minimum requirement for WP SEO is now 3.5
	* Removed some old (commented out) code
	* Deprecated category rewrite functionality



= 1.4.25 =

* Bugfixes
	* Do not include external URLs in XML sitemap (Issue #528) - props [tivnet](https://github.com/tivnet).
	* Get home_url out of the sitemap loop - props [tivnet](https://github.com/tivnet).
	* Add support for html entities - props [julienmeyer](https://github.com/julienmeyer).
	* Fixed wrong use of `__FILE__`.

* Enhancement
	* WPSEO_FILE now has a 'defined' check.
	* Removed unneeded `dirname` calls.

* i18n
	* Updated cs_CZ, de_DE, fr_FR & tr_TK

= 1.4.24 =

* Bugfixes
	* Removed screen_icon() calls.
	* Fixed a bug in robots meta tag on singular items.
	* Fix double robots header, WP native settings will be respected - props [Jrf](http://profiles.wordpress.org/jrf).
	* When post published data is newer than last modified date, use that in XML sitemap, props [mindingdata](https://github.com/mindingdata).
	* Check if tab hash is correct after being redirected from Facebook API, props [dannyvankooten](https://github.com/dannyvankooten).
	* Fix 404 in category rewrites when `pagination_base` was changed, props [raugfer](https://github.com/raugfer).
	* Make the metabox tabs jQuery only work for WPSEO tabs, props [imageinabox](https://github.com/imageinabox).
	* Sitemap shortcode sql had hard-coded table name which could easily cause the shortcode display to fail. Fixed. - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fix issue with user capability authorisation check as reported by [scienceandpoetry](https://github.com/scienceandpoetry) in issue [#492](https://github.com/Yoast/wordpress-seo/issues/492) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed canonical rel links was causing an error when given an invalid taxonomy, issue [#306](https://github.com/Yoast/wordpress-seo/issues/306) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Removed add_meta_box() function duplication  - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fix issue "Flesch Reading Ease should only be a positive number". This also fixes the message being unclear. Thanks [eugenmihailescu](https://github.com/eugenmihailescu) for reporting - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed issue with page analysis not taking feature image into account - props [darrarski](https://github.com/darrarski).

* Enhancement
	* Shortcode now also available to ajax requests - props [Jrf](http://profiles.wordpress.org/jrf).
	* Added gitignores to prevent incorrect commits (Cross platform collab) - props [cfoellmann](https://github.com/cfoellmann).
	* Adding filters to individual sitemap url entries - props [mboynes](https://github.com/mboynes).

= 1.4.23 =

* Bugfixes
	* Fix for serious sitemap issue which caused all pages of a split sitemap to be the same (show the first 1000 urls) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed a bug in the WPSEO tour in WP Network installs
	* clean_permalink 301 redirect issue when using https - props [pirategaspard](https://github.com/pirategaspard)

* i18n
	* Updated cs_CZ, fa_IR, fr_FR, hu, hu_HU, pl_PL, ru_RU & zh_CN


= 1.4.22 =

* Bugfixes
	* Reverted change to XML sitemaps stylesheet URL as that was giving issues on multisite installs.
	* Reverted change to XML sitemap loading as we were no longer exposing some variables that other plugins relied upon.
	* Fix bug with author sitemap showing for everyone.

* Enhancement
	* No longer save empty meta post variables, issue [#463](https://github.com/Yoast/wordpress-seo/issues/463). Clean up of DB is coming in future release, if you want to clean your DB now, see that issue for SQL queries.

= 1.4.21 =

* Bugfixes
	* Fix notice for `ICL_LANGUAGE_CODE` not being defined.
	* Fix missing function in install by adding a require.

= 1.4.20 =

* Bugfixes
	* Fixed bug where posts set to _always_ index would not end up in XML sitemap.
	* Fix _Invalid argument supplied for foreach()_ notice for WPML as reported by [pbearne](https://github.com/pbearne) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Yoast tracking cron job will now unschedule on disallowing of tracking, on deactivation and on uninstall, inspired by [Bluebird Blvd.](http://wordpress.org/support/topic/found-active-tracking-device-after-deleting-wp-seo-months-ago) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fix issue [#453](https://github.com/Yoast/wordpress-seo/issues/435): setting shop as homepage caused a notice and wrong title with WooCommerce.
	* Fixed a bug [#449](https://github.com/Yoast/wordpress-seo/issues/449) where a canonical, when manually set for a category, tag or term, could get pagination added to it on paginated pages, when it shouldn't.
	* Fixed a bug where manually set canonicals would end up in `rel="next"` and `rel="prev"` tags.
	* Fixed a bug [#450](https://github.com/Yoast/wordpress-seo/issues/450) where noindexed pages would appear in the HTML sitemap.
	* Fixed a bug where non-public taxonomies would appear in the HTML sitemap.
	* Fixed quotes not working in meta title and description for terms, issue [#405](https://github.com/Yoast/wordpress-seo/issues/405).
	* Make sure author sitemap works when they should.
	* Fix some notices in author sitemap, issue [#402](https://github.com/Yoast/wordpress-seo/issues/402).
	* Fix breadcrumbs being broken on empty post type archives, issue [#443](https://github.com/Yoast/wordpress-seo/issues/443).
	* Fixed a possible caching issue when `title_test` option remained set, issue [#419](https://github.com/Yoast/wordpress-seo/issues/419).
	* Make sure og:description is shown on homepage when it's left empty in settings, fixes [#441](https://github.com/Yoast/wordpress-seo/issues/441).
	* Make sure there are no WPML leftovers in our title, issue [#383](https://github.com/Yoast/wordpress-seo/issues/383).
	* Fix padding on fix it buttons with 3.8 design, issue [#400](https://github.com/Yoast/wordpress-seo/issues/400).
	* Hide SEO columns in responsive admin ( in 3.8 admin design ), issue [#445](https://github.com/Yoast/wordpress-seo/issues/445).

* Misc
	* Switch back to MailChimp for newsletter subscribe.
	* Default to nofollowing links in RSS feed footers.

* i18n
  * Updated es_ES, pt_BR & ru_RU
  * Added sk_SK

= 1.4.19 =

* Enhancements
	* Added the option to upload a separate image for Facebook in the Social tab.
	* Added published time, last modified time, tags and categories to OpenGraph output, to work with Pinterests new article pin.
	* Added a filter for post length requirements in the Analysis tab.
	* If there is a term description, use it in the OpenGraph description for a term archive page.
	* Applied a number of settings form best practices - props [Jrf](http://profiles.wordpress.org/jrf).
	* File inclusion best practices applied - props [Jrf](http://profiles.wordpress.org/jrf).
	* Breadcrumbs for Custom Post Types now take the CPT->label instead of CPT->labels->menu_name as text parameter, as suggested by [katart17](http://wordpress.org/support/profile/katart17) and [Robbert V](http://wordpress.org/support/profile/robbert-v) - props [Jrf](http://profiles.wordpress.org/jrf).

* Bugfixes
	* Move all rewrite flushing to shutdown, so it doesn't break other plugins who add their rewrites late.
	* Fixed the wrong naming of the L10n JS object, props [Otto](http://profiles.wordpress.org/otto42).
	* Improved form support for UTF-8 - props [Jrf](http://profiles.wordpress.org/jrf).
	* Corrected faulty multisite option registration - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed appropriate use of plugins_url() to avoid breaking hooked in filters - props [Jrf](http://profiles.wordpress.org/jrf).
	* (Temporary) fix for metabox styling for users using the MP6 plugin - props [Jrf](http://profiles.wordpress.org/jrf).
	* Minor fix in localization loading - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed [Missing argument 3 for wpseo_upgrader_process_complete](https://github.com/Yoast/wordpress-seo/issues/327) notice for WP 3.7+, thanks [vickyindo](https://github.com/vickyindo), [Wendyhihi](https://github.com/Wendihihi) and [Theressa1](https://github.com/Theressa1) for reporting - props [Jrf](http://profiles.wordpress.org/jrf).

* i18n
  * Updated ru_RU, tr_TK and Hr

= 1.4.18 =

* Unhooking 'shutdown' (part of the NGG fix in 1.4.16) caused caching plugins to break, fixed while preserving NGG fix.
* These changes were pushed in later but were deemed not important enough to force an update:
	* Updated newsletter subscription form to reflect new newsletter system.
	* Documentation
		* Updated readme.txt to reflect support changes.
		* Moved old sections of changelog to external file.
	* i18n
	* Updated pt_PT

= 1.4.17 =

* Missed a line in the commit of the option to stop stop words cleaning.

= 1.4.16 =

* Fix for compatibility with NextGen Gallery.

* Enhancements
	* Add option to enable slug stop word cleaning, find it under SEO -> Permalinks. It's on by default.
	* Remove tracking variables from the Yoast Tracking that weren't used.

* i18n
	* Updated de_DE, fa_IR, fi, hu_HU, it_IT, pl_PL, sv_SE and tr_TK

= 1.4.15 =

* Bugfixes
	* Fix the white XML sitemap errors caused by non-working XSL.
	* Fixed the errors in content analysis reporting an H2 was not found when it was really there.
	* Fix slug stopwords removal, props [amm350](https://github.com/amm350).
	* Fix PHP Notice logged when site has capabilities created without 3rd value in args array, props [mbijon](https://github.com/mbijon).
	* Fix the fact that meta description template for archive pages didn't work, props [MarcQueralt](https://github.com/MarcQueralt).
	* Prevent wrong shortcodes (that echo instead of return) from causing erroneous output.
	* Fix edge cases issue for keyword in first paragraph test not working.
	* Revert change in 1.4.14 that did a `do_shortcode` while in the `head` to retrieve images from posts, as too many plugins crash then, instead added `wpseo_pre_analysis_post_content` filter there as well.

= 1.4.14 =

This release contains tons and tons of bugfixes, thanks in *large* part to [Jrf](http://profiles.wordpress.org/jrf), who now has commit rights to the code on Github directly. Please join me in thanking her for her efforts!

* Notes:
	* Our GitHub repository moved to [https://github.com/Yoast/wordpress-seo](https://github.com/Yoast/wordpress-seo), old links should redirect but please check.

* Bugfixes
	* Switch to stock autocomplete file and fix clash with color picker, props [Heinrich Luehrsen](http://www.luehrsen-heinrich.de/).
	* Prevent strip category base code from breaking Custom Post Type rewrites, props [Steve Hulet](http://about.me/stevehulet).
	* Fixed [issue with canonical links](http://wordpress.org/support/topic/serious-canonical-issue-with-paginated-posts) on last page of paginated posts - props [maxbugfiy](http://wordpress.org/support/profile/maxbuxfiy)
	* Fixed bug in shortcode removal from meta description as reported by [professor44](http://profiles.wordpress.org/professor44/) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed bug preventing saving of taxonomy meta data on first try - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed small (potential) issue in wpseo_title_test() - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed bug where RSS excerpt would be double wrapped in `&lt;p&gt;` tags as reported by [mikeprince](http://profiles.wordpress.org/mikeprince) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed HTML validation error: Duplicate id Twitter on Social tab - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed undefined index notice as reported by [szepeviktor](http://profiles.wordpress.org/szepeviktor).
	* Fixed error in a database query as reported by [Watch Teller](http://wordpress.org/support/profile/watchteller) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed small issue with how styles where enqueued/registered - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed bug in alt text of score dots as [reported by Rocket Pixels](http://wordpress.org/support/topic/dots-on-hover-over-show-na-tooltip) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Applied best practices to all uses of preg_ functions fixing some bugs in the process - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed bug in processing of `%%ct_<custom-tax-name>%%` as [reported by Joy](http://wordpress.org/support/topic/plugin-dies-when-processing-ct_desc_) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed: no more empty og: or twitter: tags. Also added additional escaping where needed - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed: Meta description tag discovery looked in parent theme header file even when a child theme is the current theme - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed: Using the 'Fix it' button would remove the meta description tag from the parent theme header file, even when a child theme is the current theme - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed: Using the 'Fix it' button would fail if it had already been used once (i.e. if a wpseo backup file already existed) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed repeated unnecessary meta description tag checks on each visit to dashboard page - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed: Meta description 'Fix it' feedback message was not shown - props [Jrf](http://profiles.wordpress.org/jrf).
	* Mini-fix for plugin_dir_url - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed Author Highlighting to only show authors as possible choice for Google+ Plus author as reported by [Sanoma](https://github.com/jdevalk/wordpress-seo/issues/131) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed `adjacent_rel_links()` for Genesis users - props [benjamin74](https://github.com/benjamin74) for reporting.
	* Replace jQuery .live function with .on(), as .live() has been deprecated and deleted. Props [Viktor Kostadinov](http://www.2buy1click.com/) & [Taco Verdonschot](https://yoast.com/about-us/taco-verdonschot/).
	* Fix how breadcrumbs deal with taxonomy orders. Props [Gaya Kessler](http://www.gayadesign.com/).
	* Fixed some PHP warnings

* Enhancements
	* Added `wpseo_pre_analysis_post_content` filter. This allows plugins to add content to the content that is analyzed by the page analysis functionality.
	* Added `wpseo_genesis_force_adjacent_rel_home` filter to allow forcing of rel=next / rel=prev links on the homepage pagination for Genesis users, they're off by default.
	* Make `$wpseo_metabox` a global, props [Peter Chester](http://tri.be/).
	* No need to show Twitter image when OpenGraph is showing, props [Gary Jones](http://garyjones.co.uk/).
	* Make sure WPML works again, props [dominykasgel](https://github.com/dominykasgel).
	* Added checks for the meta description tag on theme switch, on theme update and on (re-)activation of the WP SEO plugin including a visual warning if the check would warrant it - props [Jrf](http://profiles.wordpress.org/jrf).
	* Added the ability to request re-checking a theme for the meta description tag. Useful when you've manually removed it (to get rid of the warning), inspired by [tzeldin88](http://wordpress.org/support/topic/plugin-wordpress-seo-by-yoast-your-theme-contains-a-meta-description-which-blocks-wordpress-seo) - props [Jrf](http://profiles.wordpress.org/jrf).
	* OpenGraph image tags will now also be added for images added to the post via shortcodes, as suggested by [msebald](http://wordpress.org/support/topic/ogimage-set-to-default-image-but-articlepage-has-own-images?replies=3#post-4436317) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Added 'wpseo_breadcrumb_single_link_with_sep' filter which allows users to filter a complete breadcrumb element including the separator - props [Jrf](http://profiles.wordpress.org/jrf).
	* Added 'wpseo_stopwords' filter which allows users to filter the stopwords list - props [Jrf](http://profiles.wordpress.org/jrf).
	* Added 'wpseo_terms' filter which allows users to filter the terms string - props [Jrf](http://profiles.wordpress.org/jrf).
	* Hide advanced tab for users for which it has been disabled, as [suggested by jrgmartin](https://github.com/jdevalk/wordpress-seo/issues/93) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Updated Facebook supported locales list for og:locale

* i18n
	* Updated languages tr_TK, fi, ru_RU & da_DK
	* Added language hi_IN
	* Updated wordpress-seo.pot file

= 1.4.13 =

* Bugfixes
	* Fixed ampersand (&) in site title in Title Templates loading as &amp;
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
	* Make twitter:domain use WordPress site name instead of domain name.
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
	* Add new `twitter:domain` tag	- props [Mike Bijon](https://github.com/mbijon).
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

== Upgrade Notice ==

= 1.5.0 =
* Major overhaul of the way the plugin deals with option. Upgrade highly recommended. Please do verify your settings after the upgrade.
