=== WordPress SEO by Yoast ===
Contributors: joostdevalk, barrykooij
Donate link: https://yoast.com/
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: seo, SEO, google, meta, meta description, search engine optimization, xml sitemap, xml sitemaps, google sitemap, sitemap, sitemaps, robots meta, rss, rss footer, yahoo, bing, news sitemaps, XML News Sitemaps, WordPress SEO, WordPress SEO by Yoast, yoast, multisite, canonical, nofollow, noindex, keywords, meta keywords, description, webmaster tools, google webmaster tools, seo pack
Requires at least: 3.5
Tested up to: 3.9.1
Stable tag: 1.5.3.3

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

= Trunk / 1.5.4 =

* Bugfixes
	* Refactored the variable replacement function for better and faster results and more stability. This should fix most if not all problems users where having with variables not being replaced in the title, meta description, snippet preview etc - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed: `wpseo_replacements` filter was being run before all replacements were known.
	* Fixed: `%%pt_single%%` and `%%pt_plural%%` didn't work in preview mode.
	* Fixed: `%%page_total%%` would sometimes be one short.
	* Fixed: `%%term404%%` would sometimes be empty while the pagename causing the 404 was known.
	* Fixed: empty taxonomy sitemap could still be shown, while it shouldn't, as reported by [allasai](https://github.com/allasai) in [issue #1004](https://github.com/Yoast/wordpress-seo/issues/1004) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed: if first result of a search is a post, the blog page was incorrectly added to the breadcrumb, as reported in [issue #1248](https://github.com/Yoast/wordpress-seo/issues/1248) by [Nikoya](https://github.com/Nikoya) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed: ensure that all our options exist always, fixes rare case in which this wouldn't be so. As reported by [bonny](https://github.com/bonny) in [issue #1245](https://github.com/Yoast/wordpress-seo/issues/1245) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Improved and more consistent check for whether to show the admin 'Edit files' screen, [issue #1197](https://github.com/Yoast/wordpress-seo/issues/1197) - props [hostliketoast](https://github.com/hostliketoast) and [Jrf](http://profiles.wordpress.org/jrf).

* Enhancements
	* New `wpseo_register_extra_replacements` action hook which lets plugin/theme builders add new `%%...%%` replacement variables - including relevant help texts -. See [function documentation](https://github.com/Yoast/wordpress-seo/blob/master/inc/wpseo-functions.php) for an example of how to use this new functionality.
	* If the final string - after replacement - would contain two separators with nothing between them, this extra separator will be removed.
	* All remaining not replaced replacement vars are now stripped from the strings (without breaking the snippet preview).
	
* Other enhancements
	* We've added server specific info to our tracking class. Most notably, we're tracking whether a number of PHP extensions are enabled for our users now.



= 1.5.3.3 =
Release Date: June 2nd, 2014

* Enhancements
	* We've added some options and some host specific info to our tracking class. Most notably, we're tracking the PHP version for our users now, so we can see whether we, at some point, might drop PHP 5.2 support before WordPress does.
	* Auto-deactivate plugin in the rare case that the SPL (Standard PHP Library) extension is not available.
	* Switch from inline `xmlns` to inline use of the `prefix` attribute for breadcrumbs as that makes validation work. Fixes [Issue 1186]((https://github.com/Yoast/wordpress-seo/issues/1186).

* Bugfixes
	* Check whether snippet preview is shown on page before hiding / showing errors, deducted from [#1178](https://github.com/Yoast/wordpress-seo/issues/1178)
	* Fixed incorrect sitemap last modified date as reported in [issue 1136](https://github.com/Yoast/wordpress-seo/issues/1136) - props [rscs](https://github.com/rscs).
	* Specify post ID when using `wp_enqueue_media()` to set up correctly for the post being edited. [Pull #1165](https://github.com/Yoast/wordpress-seo/pull/1165), props [benhuson](https://github.com/benhuson).
	* Fixed unreachable filter `wpseo_sitemap_[post_type]_content` as reported in [pull #1163](https://github.com/Yoast/wordpress-seo/pull/1163), also fixes unreachable filter `wpseo_sitemap_author_content`. Props [jakub-klapka](https://github.com/jakub-klapka).
	* Fixed PHP notice as reported by [maxiwheat](https://github.com/maxiwheat) in [issue #1160](https://github.com/Yoast/wordpress-seo/issues/1160).
	* Backed out pagination overflow redirect as it's causing too many issues.

* i18n
 	* Make sure extensions menu is fully i18n compatible.


= 1.5.3.2 =
Release Date: May 16th, 2014

* Bugfixes
	* Backing out earlier change, as this breaks the snippet preview.

* Enhancement
	* Reintroduced the 'Strip the category base (usually /category/) from the category URL.' option.

= 1.5.3.1 =
Release Date: May 15th, 2014

* Bugfixes
	* Fix regression issue - non-replacement of %%name%% variable as reported in [issue #1104](https://github.com/Yoast/wordpress-seo/issues/1104) by [firstinflight](https://github.com/firstinflight) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fixed an issue where %%category%% was not replaced on certain pages.
	* Added support for %%tag%% even if the ID is empty.
	* All remaining not replaced title vars are now stripped from the title.
	* Added a fallback to post_date in the sitemap 'mod' property for when a post is lacking the post_date_gmt value.

= 1.5.3 =

* Bugfixes
	* Don't ping search engines if the blog is set to 'discourage search engines from indexing this site' - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fix error in sitemap_index.xml if post type does not contain any posts as reported by [sebastiaandegeus](https://github.com/sebastiaandegeus).
	* Use the correct HTTP protocol for responses - props [Fab1en](https://github.com/Fab1en).
	* Better OG locale handling - props [maiis](https://github.com/maiis).
	* Fixed: 'breadcrumb_last' class was missing on homepage, as reported by [uprise10](https://github.com/uprise10) in [issue #1045](https://github.com/Yoast/wordpress-seo/issues/1045) - props [Jrf](http://profiles.wordpress.org/jrf).
	* Fix empty post id notice, [issue #1080](https://github.com/Yoast/wordpress-seo/issues/1080) as reported by [sosada](https://github.com/sosada).
	* Localize dates where appropriate as suggested by [allankronmark](https://github.com/allankronmark) in [issue #1073](https://github.com/Yoast/wordpress-seo/issues/1073).
	* Fix for escaping str literals in JS regexes - props [MarventusWP](https://github.com/MarventusWP).
	
* Enhancement
	* Redirect paginated archive pages with a pagination number that doesn't exist to the first page of that archive.
	* Update score circle icon to look great on HiDPI displays, as well as fitting better with WordPress 3.8+ design - props [paulwilde](https://github.com/paulwilde).
	* Only show article publication time for posts, not for pages or other post types, introduce a new filter to _do_ allow them when needed.
	* Load of improvements to banners and licenses page.
	* Update snippet preview to use latest Google design changes - props [paulwilde](https://github.com/paulwilde).

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

= Earlier versions =

For the changelog of earlier versions, please refer to the separate changelog.txt file.


== Upgrade Notice ==

= 1.5.0 =
* Major overhaul of the way the plugin deals with option. Upgrade highly recommended. Please do verify your settings after the upgrade.
