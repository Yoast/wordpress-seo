=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoast.com/
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Google Search Console, Content analysis, Readability
Requires at least: 4.8
Tested up to: 4.9.1
Stable tag: 5.9.4
Requires PHP: 5.2.4

Improve your WordPress SEO: Write better content and have a fully optimized WordPress site using the Yoast SEO plugin.

== Description ==

WordPress out of the box is already technically quite a good platform for SEO. This was true when Joost wrote his original [WordPress SEO](https://yoast.com/articles/wordpress-seo/) article in 2008 (updated every few months) and it's still true today, but that doesn't mean you can't improve it further! This plugin is written from the ground up by Joost de Valk and his team at [Yoast](https://yoast.com/) to improve your site's SEO on *all* needed aspects. While this [Yoast SEO plugin](https://yoast.com/wordpress/plugins/seo/) goes the extra mile to take care of all the technical optimization, more on that below, it first and foremost helps you write better content.  Yoast SEO forces you to choose a focus keyword when you're writing your articles, and then makes sure you use that focus keyword everywhere.

> <strong>Premium Support</strong><br>
> The Yoast team does not always provide active support for the Yoast SEO plugin on the WordPress.org forums. One-on-one email support is available to people who bought the [Premium Yoast SEO plugin](https://yoast.com/wordpress/plugins/seo-premium/) only.
> Note that the Premium SEO plugin has several extra features too, including the option to have multiple focus keywords and a redirect manager, so it might be well worth your investment!
>
> You should also check out the [Yoast Local SEO](https://yoast.com/wordpress/plugins/local-seo/), [Yoast News SEO](https://yoast.com/wordpress/plugins/news-seo/) and [Yoast Video SEO](https://yoast.com/wordpress/plugins/video-seo/) extensions to Yoast SEO. These of course come with support too.

> <strong>Bug Reports</strong><br>
> Bug reports for Yoast SEO are [welcomed on GitHub](https://github.com/Yoast/wordpress-seo). Please note GitHub is _not_ a support forum, and issues that aren't properly qualified as bugs will be closed.

= Write better content with Yoast SEO =
Using the snippet preview, you can see a rendering of what your post or page will look like in the search results, whether your title is too long or too short, and whether your meta description makes sense in the context of a search result. This way the plugin will help you not only increase rankings but also increase the click through rate for organic search results.

= Page Analysis =
The Yoast SEO plugins [Page Analysis](https://yoast.com/content-seo-wordpress-linkdex/) functionality checks simple things you're bound to forget. It checks, for instance, if you have images in your post and whether they have an alt tag containing the focus keyword for that post. It also checks whether your posts are long enough, whether you've written a meta description and if that meta description contains your focus keyword, if you've used any subheadings within your post, etc. etc.

The plugin also allows you to write meta titles and descriptions for all your category, tag and custom taxonomy archives, giving you the option to further optimize those pages.

Combined, this plugin makes sure that your content is the type of content search engines will love!

= Technical WordPress Search Engine Optimization =
While out of the box WordPress is pretty good for SEO, it needs some tweaks here and there. This Yoast SEO plugin guides you through some of the settings needed, for instance by reminding you to enable pretty permalinks. But it also goes beyond that, by automatically optimizing and inserting the meta tags and link elements that Google and other search engines like so much:

= Meta & Link Elements =
With the Yoast SEO plugin you can control which pages Google shows in its search results and which pages it doesn't show. By default, it will tell search engines to index all of your pages, including category and tag archives, but to only show the first pages in the search results. It's not very useful for a user to end up on the third page of your "personal" category, right?

WordPress itself only shows canonical link elements on single pages, but Yoast SEO makes it output canonical link elements everywhere. Google has recently announced they would also use `rel="next"` and `rel="prev"` link elements in the `head` section of your paginated archives. This plugin adds those automatically. See [this post](https://yoast.com/rel-next-prev-paginated-archives/) for more info.

= XML Sitemaps =
The Yoast SEO plugin has the most advanced XML Sitemaps functionality in any WordPress plugin. Once you check the box, it automatically creates XML sitemaps and notifies Google & Bing of the sitemaps' existence. These XML sitemaps include the images in your posts & pages too, so that your images may be found better in the search engines too.

These XML Sitemaps will even work on large sites, because of how they're created, using one index sitemap that links to sub-sitemaps for each 1,000 posts. They will also work with custom post types and custom taxonomies automatically, while giving you the option to remove those from the XML sitemap should you wish to.

Because of using [XSL stylesheets for these XML Sitemaps](https://yoast.com/xsl-stylesheet-xml-sitemap/), the XML sitemaps are easily readable for the human eye too, so you can spot things that shouldn't be in there.

= RSS Optimization =
Are you being outranked by scrapers? Instead of cursing at them, use them to your advantage! By automatically adding a link to your RSS feed pointing back to the original article, you're telling the search engine where they should be looking for the original. This way, the Yoast SEO plugin increases your own chance of ranking for your chosen keywords and gets rid of scrapers in one go!

= Breadcrumbs =
If your theme is compatible, and themes based on for instance Genesis or by WooThemes often are, you can use the built-in Breadcrumbs functionality. This allows you to create an easy navigation that is great for both users and search engines, and will support the search engines in understanding the structure of your site.

Making your theme compatible isn't hard either, check [these instructions](https://kb.yoast.com/kb/implement-wordpress-seo-breadcrumbs/).

= Edit your .htaccess and robots.txt file =
Using the built-in file editor, you can edit your WordPress blog's `.htaccess` and `robots.txt` file, giving you direct access to the two most powerful files, from an SEO perspective, in your WordPress install.

= Social Integration =
SEO and Social Media are heavily intertwined. That's why this plugin also comes with a Facebook OpenGraph implementation and will soon also support Google+ sharing tags.

= Multi-Site Compatible =
The Yoast SEO plugin, unlike some others, is fully Multi-Site compatible. The XML Sitemaps work fine in all setups and you even have the option, in the Network settings, to copy the settings from one blog to another, or make blogs default to the settings for a specific blog.

= Import & Export functionality =
If you have multiple blogs, setting up plugins like this one on all of them might seem like a daunting task. Except that it's not, because what you can do is simple: you set up the plugin once. You then export your settings and simply import them on all your other sites. It's that simple!

= Import functionality for other WordPress SEO plugins =
If you've used All In One SEO Pack or HeadSpace2 before using this plugin, you might want to import all your old titles and descriptions. You can do that easily using the built-in import functionality. There's also import functionality for some of the older Yoast plugins, like Robots Meta and RSS footer.

Should you have a need to import from another SEO plugin to Yoast SEO, or from a theme like Genesis or Thesis, you can use the [SEO Data Transporter](http://wordpress.org/extend/plugins/seo-data-transporter/) plugin, which will easily convert your SEO meta data from and to a whole set of plugins like Platinum SEO, SEO Ultimate, Greg's High Performance SEO, and themes like Headway, Hybrid, WooFramework, Catalyst etc.

Read [this migration guide](https://yoast.com/all-in-one-seo-pack-migration/) if you still have questions about migrating from another SEO plugin to Yoast SEO.

= Yoast SEO Plugin in your Language! =
Currently a huge translation project is underway, translating Yoast SEO in as much as 24 languages. So far, the translations for French and Dutch are complete, but we still need help on a lot of other languages, so if you're good at translating, please join us at [translate.yoast.com](http://translate.yoast.com).

= News SEO =
Be sure to also check out the premium [News SEO module](https://yoast.com/wordpress/plugins/news-seo/) if you need Google News Sitemaps. It tightly integrates with Yoast SEO to give you the combined power of News Sitemaps and full Search Engine Optimization.

= Further Reading =
For more info, check out the following articles:

* The [Yoast SEO Knowledgebase](https://kb.yoast.com/kb/category/yoast-seo/).
* [WordPress SEO - The definitive Guide by Yoast](https://yoast.com/articles/wordpress-seo/).
* Once you have great SEO, you'll need the [best WordPress Hosting](https://yoast.com/articles/wordpress-hosting/).
* The [Yoast SEO Plugin](https://yoast.com/wordpress/plugins/seo/) official homepage.
* Other [WordPress Plugins](https://yoast.com/wordpress/plugins/) by the same team.
* Follow Yoast on [Facebook](https://facebook.com/yoast) & [Twitter](http://twitter.com/yoast).

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

You'll find answers to many of your questions on [kb.yoast.com](https://kb.yoast.com/kb/category/yoast-seo/).

== Screenshots ==

1. The Yoast SEO plugin general meta box. You'll see this on edit post pages, for posts, pages and custom post types.
2. The fully configurable XML sitemap for Yoast SEO.
3. Easily import SEO data from other SEO plugins like All In One SEO pack, HeadSpace2 SEO and wpSEO.de.
4. Example of the SEO analysis functionality.
5. Example of the readability analysis functionality.
6. The advanced section of the Yoast SEO meta box.

== Changelog ==

= 5.9.3 =

Release Date: December 11th, 2017

Security:

* Fixes an issue where a part of the excerpt would be leaked on password protected posts when used as a replacement variable. Such as `%%excerpt%%` and `%%excerpt_only%%`. Props to [Rolands Umbrovskis](https://profiles.wordpress.org/rolandinsh) for reporting this issue to us.

= 5.9.2 =
Release Date: December 11th, 2017

Bugfixes:

* Fixes a bug where older browsers couldn't load the content analysis. This applies to Internet Explorer (10 and lower) and Safari (9.1 and lower).
* Fixes a bug where the Yoast Metabox wouldn't be shown for posts set to `noindex`, therefore making it impossible to change it back to `index`, view Readability scores and not being able to optimize a post, before allowing it to be indexed.
* Fixes a bug where translations wouldn't be applied in the Yoast SEO Metabox for SEO and Readability scores.

= 5.9.1 =
Release Date: December 5th, 2017

Bugfixes:

* Fixes a bug where the configuration wizard could not be loaded, caused by a missing JavaScript dependency.

= 5.9.0 =
Release Date: December 5th, 2017

Bugfixes:

* Fixes a bug where the title isn't added back to the HTML when the debug marker has been disabled.
* Fixes a bug where multiple help panels showed up when clicking on different help buttons.
* Fixes a bug where the Help Center wouldn't be closed when clicking the Go Premium link.
* Fixes a bug where the cornerstone setting for a post would be lost when quick editing the post.
* Fixes a bug where newly created posts were taken into account for the link count, resulting in MySQL errors. Props to [stodorovic](https://github.com/stodorovic).
* Fixes a bug where Premium plugins were being treated as WordPress.org plugins in the 'suggested plugin' notifications, resulting in download errors.
* Fixes a bug where an empty div was visible when both Content and Readability analysis are disabled.

Enhancements

* Shows a notice regarding opening the Onboarding Wizard when the plugin is installed for the first time.
* Makes it easier to unhook the debug code rendered as HTML comment.
* Implements the Reactified content analysis.
* Introduces the `wpseo_add_opengraph_additional_images` filter to allow additional OpenGraph Images to be added at a low priority.
* Changes the Dashboard widget's progress bar height to 24px.
* Makes the 'Next' and 'Back' buttons in the Onboarding Wizard focusable.
* Adds grouping of feedback within the content analysis, in the following categories: 'errors', 'problems', 'needs improvement', 'considerations', and 'good'. Each category can be expanded and collapsed.

= 5.8.0 =

Release Date: November 15th, 2017

Security:

* Fixes an XSS vulnerability in the Google Search Console configuration page, when connected to any profile. Thanks [Dimopoulos Elias](https://twitter.com/dimopouloselias) for discovering and responsibly disclosing this issue.

Bugfixes:

* Fixes a bug where inactive suggested plugins weren't displaying a notification.
* Fixes a bug where an error would be thrown if a Yoast SEO custom database table was missing.
* Fixes a bug where the layout of the metabox would break if too little content was present. Props to [shane-gray](https://github.com/shane-gray).
* Fixes a bug where the WordPress editor was being displayed for custom, private taxonomies. Props to [stodorovic](https://github.com/stodorovic).
* Fixes a bug where the analysis heading is shown when readability and keyword analysis has been turned off. Props to [daim2k5](https://github.com/daim2k5).
* Fixes a bug where outputting on `the_content` filter calls could result in faulty AJAX requests.

Enhancements:

* Introduces `wpseo_breadcrumb_single_link_info` filter for modifying breadcrumb data. Props to [slushman](https://github.com/slushman) and [forsvunnet](https://github.com/forsvunnet).
* Introduces `wpseo_redirect_orphan_attachment` action to allow unattached attachment pages to be redirected in tune with the relevant setting. Props to [soulseekah](https://github.com/soulseekah).
* Enhances integration with most role/capability manager plugins using the `members_get_capabilities` filter. Props to [JoryHogeveen](https://github.com/JoryHogeveen).
* Adds a Yoast group to the Members and User Role Editor plugins to easily find the Yoast SEO capabilities. Props to [JoryHogeveen](https://github.com/JoryHogeveen).
* Made link for Premium buy button changeable. Props to [leesto](https://github.com/leesto).
* Removes the max-width on alerts to present a better UI. Props to [timnolte](https://github.com/timnolte).
* Sets default Twitter Card option to 'Summary with large image'. Props to [pattonwebz](https://github.com/pattonwebz).
* Makes the content accessible by adding scroll functionality in the help center tabs.
* Improves the suggested plugins messages and adds installation and activation links when appropriate.
* Makes sure that the `yoast_seo_links` table is accessible before attempting to run a query against it.
* Uses Gutenberg content if it is available.

Maintenance:

* Cleaned up codebase by removing old Knowledge Base Search code.
* Improved the codebase to make it comply with the latest WordPress Coding Standards.

= Earlier versions =

For the changelog of earlier versions, please refer to the separate changelog.txt file.
