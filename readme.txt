=== Yoast SEO ===
Contributors: joostdevalk
Donate link: https://yoast.com/
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, Google, xml sitemap, google search console, google webmaster tools, canonical, meta description, meta title, noindex, snippet preview, redirects, focus keyword, seo copywriting, content marketing
Requires at least: 4.3
Tested up to: 4.5
Stable tag: 3.4.0

Improve your WordPress SEO: Write better content and have a fully optimized WordPress site using Yoast SEO plugin.

== Description ==

WordPress out of the box is already technically quite a good platform for SEO, this was true when Joost wrote his original [WordPress SEO](https://yoast.com/articles/wordpress-seo/) article in 2008 (and updated every few months) and it's still true today, but that doesn't mean you can't improve it further! This plugin is written from the ground up by Joost de Valk and his team at [Yoast](https://yoast.com/) to improve your site's SEO on *all* needed aspects. While this [Yoast SEO plugin](https://yoast.com/wordpress/plugins/seo/) goes the extra mile to take care of all the technical optimization, more on that below, it first and foremost helps you write better content.  Yoast SEO forces you to choose a focus keyword when you're writing your articles, and then makes sure you use that focus keyword everywhere.

> <strong>Premium Support</strong><br>
> The Yoast team does not always provide active support for the Yoast SEO plugin on the WordPress.org forums. One on one email support is available to people who bought the [Premium Yoast SEO plugin](https://yoast.com/wordpress/plugins/seo-premium/) only.
> Note that the Premium SEO plugin has several extra features too so it might be well worth your investment, including the option to have multiple focus keywords and a redirect manager!
>
> You should also check out the [Yoast Local SEO](https://yoast.com/wordpress/plugins/local-seo/), [Yoast News SEO](https://yoast.com/wordpress/plugins/news-seo/) and [Yoast Video SEO](https://yoast.com/wordpress/plugins/video-seo/) extensions to Yoast SEO, these of course come with support too.

> <strong>Bug Reports</strong><br>
> Bug reports for Yoast SEO are [welcomed on GitHub](https://github.com/Yoast/wordpress-seo). Please note GitHub is _not_ a support forum and issues that aren't properly qualified as bugs will be closed.

= Write better content with Yoast SEO =
Using the snippet preview you can see a rendering of what your post or page will look like in the search results, whether your title is too long or too short and your meta description makes sense in the context of a search result. This way the plugin will help you not only increase rankings but also increase the click through for organic search results.

= Page Analysis =
The Yoast SEO plugins [Page Analysis](https://yoast.com/content-seo-wordpress-linkdex/) functionality checks simple things you're bound to forget. It checks, for instance, if you have images in your post and whether they have an alt tag containing the focus keyword for that post. It also checks whether your posts are long enough, if you've written a meta description and if that meta description contains your focus keyword, if you've used any subheadings within your post, etc. etc.

The plugin also allows you to write meta titles and descriptions for all your category, tag and custom taxonomy archives, giving you the option to further optimize those pages.

Combined, this plugin makes sure that your content is the type of content search engines will love!

= Technical WordPress Search Engine Optimization =
While out of the box WordPress is pretty good for SEO, it needs some tweaks here and there. This Yoast SEO plugin guides you through some of the settings needed, for instance by reminding you to enable pretty permalinks. But it also goes beyond that, by automatically optimizing and inserting the meta tags and link elements that Google and other search engines like so much:

= Meta & Link Elements =
With the Yoast SEO plugin you can control which pages Google shows in its search results and which pages it doesn't show. By default, it will tell search engines to index all of your pages, including category and tag archives, but only show the first pages in the search results. It's not very useful for a user to end up on the third page of your "personal" category, right?

WordPress itself only shows canonical link elements on single pages, Yoast SEO makes it output canonical link elements everywhere. Google has recently announced they would also use `rel="next"` and `rel="prev"` link elements in the `head` section of your paginated archives, this plugin adds those automatically, see [this post](https://yoast.com/rel-next-prev-paginated-archives/ title="rel=next & rel=prev for paginated archives") for more info.

= XML Sitemaps =
Yoast SEO plugin has the most advanced XML Sitemaps functionality in any WordPress plugin. Once you check the box, it automatically creates XML sitemaps and notifies Google & Bing of the sitemaps existence. These XML sitemaps include the images in your posts & pages too, so that your images may be found better in the search engines too.

These XML Sitemaps will even work on large sites, because of how they're created, using one index sitemap that links to sub-sitemaps for each 1,000 posts. They will also work with custom post types and custom taxonomies automatically, while giving you the option to remove those from the XML sitemap should you wish to.

Because of using [XSL stylesheets for these XML Sitemaps](https://yoast.com/xsl-stylesheet-xml-sitemap/), the XML sitemaps are easily readable for the human eye too, so you can spot things that shouldn't be in there.

= RSS Optimization =
Are you being outranked by scrapers? Instead of cursing at them, use them to your advantage! By automatically adding a link to your RSS feed pointing back to the original article, you're telling the search engine where they should be looking for the original. This way, the Yoast SEO plugin increases your own chance of ranking for your chosen keywords and gets rid of scrapers in one go!

= Breadcrumbs =
If your theme is compatible, and themes based on Genesis or by WooThemes for instance often are, you can use the built-in Breadcrumbs functionality. This allows you to create an easy navigation that is great for both users and search engines and will support the search engines in understanding the structure of your site.

Making your theme compatible isn't hard either, check [these instructions](https://yoast.com/wordpress/plugins/breadcrumbs/).

= Edit your .htaccess and robots.txt file =
Using the built-in file editor you can edit your WordPress blogs .htaccess and robots.txt file, giving you direct access to the two most powerful files, from an SEO perspective, in your WordPress install.

= Social Integration =
SEO and Social Media are heavily intertwined, that's why this plugin also comes with a Facebook OpenGraph implementation and will soon also support Google+ sharing tags.

= Multi-Site Compatible =
The Yoast SEO plugin, unlike some others, is fully Multi-Site compatible. The XML Sitemaps work fine in all setups and you even have the option, in the Network settings, to copy the settings from one blog to another, or make blogs default to the settings for a specific blog.

= Import & Export functionality =
If you have multiple blogs, setting up plugins like this one on all of them might seem like a daunting task. Except that it's not, because what you can do is simple: you set up the plugin once. You then export your settings and simply import them on all your other sites. It's that simple!

= Import functionality for other WordPress SEO plugins =
If you've used All In One SEO Pack or HeadSpace2 before using this plugin, you might want to import all your old titles and descriptions. You can do that easily using the built-in import functionality. There's also import functionality for some of the older Yoast plugins like Robots Meta and RSS footer.

Should you have a need to import from another SEO plugin to Yoast SEO or from a theme like Genesis or Thesis, you can use the [SEO Data Transporter](http://wordpress.org/extend/plugins/seo-data-transporter/) plugin, that'll easily convert your SEO meta data from and to a whole set of plugins like Platinum SEO, SEO Ultimate, Greg's High Performance SEO and themes like Headway, Hybrid, WooFramework, Catalyst etc.

Read [this migration guide](https://yoast.com/all-in-one-seo-pack-migration/) if you still have questions about migrating from another SEO plugin to Yoast SEO.

= Yoast SEO Plugin in your Language! =
Currently a huge translation project is underway, translating Yoast SEO in as much as 24 languages. So far, the translations for French and Dutch are complete, but we still need help on a lot of other languages, so if you're good at translating, please join us at [translate.yoast.com](http://translate.yoast.com).

= News SEO =
Be sure to also check out the premium [News SEO module](https://yoast.com/wordpress/plugins/news-seo/) if you need Google News Sitemaps. It tightly integrates with Yoast SEO to give you the combined power of News Sitemaps and full Search Engine Optimization.

= Further Reading =
For more info, check out the following articles:

* The [Yoast SEO Knowledgebase](http://kb.yoast.com/category/42-wordpress-seo).
* [WordPress SEO - The definitive Guide by Yoast](https://yoast.com/articles/wordpress-seo/).
* Once you have great SEO, you'll need the [best WordPress Hosting](https://yoast.com/articles/wordpress-hosting/).
* The [Yoast SEO Plugin](https://yoast.com/wordpress/plugins/seo/) official homepage.
* Other [WordPress Plugins](https://yoast.com/wordpress/plugins/) by the same author.
* Follow Yoast on [Facebook](https://facebook.com/yoast) & [Twitter](http://twitter.com/yoast).

= Tags =
seo, SEO, Yoast SEO, google, meta, meta description, search engine optimization, xml sitemap, xml sitemaps, google sitemap, sitemap, sitemaps, robots meta, rss, rss footer, yahoo, bing, news sitemaps, XML News Sitemaps, WordPress SEO, WordPress SEO by Yoast, yoast, multisite, canonical, nofollow, noindex, keywords, meta keywords, description, webmaster tools, google webmaster tools, seo pack

== Installation ==

1. Upload the `wordpress-seo` folder to the `/wp-content/plugins/` directory
1. Activate the Yoast SEO plugin through the 'Plugins' menu in WordPress
1. Configure the plugin by going to the `SEO` menu that appears in your admin menu

== Frequently Asked Questions ==

You'll find the [FAQ on Yoast.com](https://yoast.com/wordpress/plugins/seo/faq/).

== Screenshots ==

1. The Yoast SEO plugin general meta box. You'll see this on edit post pages, for posts, pages and custom post types.
2. Some of the sites using this Yoast SEO plugin.
3. The Yoast SEO settings for a taxonomy.
4. The fully configurable XML sitemap for Yoast SEO.
5. Easily import SEO data from All In One SEO pack and HeadSpace2 SEO.
6. Example of the Page Analysis functionality.
7. The advanced section of the Yoast SEO meta box.

== Changelog ==

= 3.4.0 =

Release Date: July 19th, 2016

* Enhancements:
	* Adds readability checks for consecutive sentences beginning with the same word for the following languages:
		* English, German, French, Spanish.
	* Adds transition words check for German, French and Spanish.
	* Adds transliterations for the following languages:
		* Breton, Chamorro, Corsican, Kashubian, Welsh, Ewe
		* Estonian, Basque, Fulah, Fijian, Arpitan, Friulian
		* Frisian, Irish, Scottish Gaelic, Galician, Guarani
		* Swiss German, Haitian Creole, Hawaiian, Croatian
		* Georgian, Greenlandic, Kinyarwanda, Luxembourgish
		* Limburgish, Lingala, Lithuanian, Malagasy, Macedonian
		* Maori, Mirandese, Occitan, Oromo, Portuguese, Romansh Vallader
		* Aromanian, Romanian, Slovak, Slovenian, Albanian
		* Klingon (in Latin characters, not KLI PlqaD script yet)
		* Hungarian, Sardinian, Silesian, Tahitian, Venetian, Walloon
	* Improves the Russian transliteration.
	* Improves the feedback strings of content checks.
	* Adds a setting and a user option to disable the SEO analysis.
	* Adds the readability score to the post and term overview.
	* Disables the analysis marker buttons when switching from visual to text view in the editor.
	* Accessibility enhancements:
		* Improves the headings in the dashboard widget.
		* Improves the headings hierarchy on the following pages:
			* titles and metas
			* user profile
			* advanced settings
			* social settings
			* XML sitemap
			* general settings
		* Improves the headings hierarchy for dashboard alerts.
		* Improves the debug information headings.
		* Adds a legend for the title seperator on the titles and metas page.
		* Improves the intro text of the social tabs.
		* Improves consistency of buttons using WordPress styles.
		* Adds a background to the YoastSEO issue counter to improve readability.
		* Improves the focus style for the dismiss and restore buttons.
		* Improves the redirect attachment warnings style by using the native WordPress notices style.
		* Improves the links on the credit screen.
		* Improves the release video iframe by adding a title.
		* Improves the knowledge base results by making them focusable and operable with a keyboard.
		* Improves the admin bar menu items by making them focusable and operable with a keyboard.
		* Adds labels to the buttons of the knowledge base search for use with a screen reader.
		* Adds label to the search field in the knowledge base for screen readers.
		* Makes the knowledge base search button translatable.
		* Improves the semantics of the knowledge base results.
	* Improves the alignment of the icons in the metabox tab sections.
	* Improve code to be consistent with WordPress standards, props [danielbachhuber](https://github.com/danielbachhuber).

* Bugfixes:
	* Fixes a bug where non-ANSI characters would break the sitemap feature.
	* Fixes a bug where MS Edge would not display the traffic light image in the help center properly.
	* Fixes a bug where the style of the 'open article' button was overwritten and made unreadable.
	* Fixes the link of the FAQ that linked to a non-existing page.
	* Fixes a typo to make the KB search "Open" link translatable.
	* Reintroduces the text length check for taxonomies.
	* Fixes a bug where a 404 could be thrown when there was no locale set.
	* Fixes a bug where in certain cases a yoastmark would leave traces in the text, these are now removed.
	* Fixes a bug where the score bullet wouldn't be shown on the frontend.
	* Fixes the generation of permalinks for new posts by ignoring the permalink sample and generating the permalink
	from the posttitle, props [Robert Korulczyk](https://github.com/rob006).
	* Fixes getting the incorrect primary category when getting the permalink, props [pawawat](https://github.com/pawawat).

= 3.3.4 =

Release Date: June 30th, 2016

* Fixed a bug in the 3.3.3 release that caused the release folder to not have a fix.

= 3.3.3 =

Release Date: June 30th, 2016

* Bugfixes:
	* Fixes a bug where the focus keyword is not shown for posts created using WordPress SEO 2.x.
	* Fixes a bug where changing the title in the bulk editor could be used to trigger JavaScript for the current user.

= 3.3.2 =

Release Date: June 21st, 2016

* Enhancements:
	* Removes non-minified files. This makes the download a lot smaller which will result in less cases of an incomplete or failed download.
	* Add setting and user option to disable the content analysis; The SEO analysis will still be present.
	* Change the overall content analysis bullet to be more lenient in non-English languages. This means it will be easier to get a green bullet for non-English languages.

* Bugfixes:
	* Fix issue where the settings export zip file could be read from the uploads folder after doing an export.

= 3.3.1 =

Release Date: June 15th, 2016

* Enhancements:
	* Adds help center to google search console page when not connected to google search console.
	* Adds video to the Yoast SEO dashboard to explain it.
	* Ships the production version of React instead of the development version.

* Bugfixes
	* Fixes a bug where the primary category wouldn't be in the permalink if `get_permalink` was called outside the loop.
	* Fixes a compatibility issue where we set `$` to `jQuery`.
	* Fixes a bug with redirects on a subsite in a multisite installation, props [nicholas-eden](https://github.com/nicholas-eden).
	* Fixes a bug where invalid HTML would throw a warning.
	* Fixes a bug where reading server variables using `filter_input` returns an empty result.
	* Fixes a bug where the passive voice and transition words would be shown on non-english language

= 3.3.0 =

Release Date: June 14th, 2016

* Features:
	* Added a dashboard under the SEO menu item and moved all persistent notifications to this dashboard.
	* Added an indicator to the menu and admin bar about pending notifications and SEO problems.
	* Splits the analysis into content and keyword analysis.
	* Adds a ton of content feedback about the following properties:
		* The length of subheadings.
		* The length of text following a subheading.
		* The length of paragraphs.
		* The length of sentences.
		* The presence of transition words.
		* The presence of the passive voice.
	* Adds a marker button for specific properties to mark these in the editor:
		* The length of paragraphs.
		* The length of sentences.
		* The presence of passive voice.
		* The presence of transition words.
		* The presence of links with the focus keyword as link text.
	* Adds slug transliteration for the following languages, this means that we now match with both the non-transliterated keyword and the transliterated keyword:
		* Spanish, Polish, German, Nynorsk, Bokmål, Swedish, Finnish,
		* Danish, Turkish, Latvian, Icelandic, Faroese, Czech, Russian,
		* Esperanto, Afrikaans, Catalan, Asturian, Aragonese, Aymara,
		* English, French, Italian, Dutch, Bambara.
	* Adds a search box in the help center to search in the [Yoast knowledge base](https://kb.yoast.com).

* Enhancements:
	* Adds missing alt tags to banners.
	* Adds a 50.000 URL hard limit to the sitemaps, this is what google recommends.
	* Moves social tab above settings tab in the metabox.
	* Adds live updating to the score indicator in the admin bar on the post edit page.
	* Optimize multiple sitemap cache clears by waiting until the end of the pageload to actual clear the cache.
	* Improved title separator radio buttons accessibility.
	* Removed Alexa verification from the plugin as it no longer works.

* Bugfixes:
	* Fixes a bug where a quote inside an attribute in the XML sitemaps would cause to create invalid XML.
	* Fixes a bug where using a custom posts table would not result in correct output in the XML sitemaps.
	* Fixes an issue where canonical URLs didn't always correctly have a trailing slash, thanks you for your input [MatthewMi11er](https://github.com/MatthewMi11er).
	* Fixes a bug where we didn't match a focus keyword correctly if it contained a slash.
	* Fixes a bug where the content analysis would be executed too many times when typing in the snippet preview.
	* Fixes a bug where the `wpseo_title` filter couldn't change the opengraph and twitter titles, props [Xavi Ivars](https://github.com/xavivars).
	* Fixes a bug where the focus keyword wouldn't be saved when saving the post instantly after changing the focus keyword.
	* Fixes a bug where retrieving terms in the breadcrumbs wouldn't be cached, props [Jonny Harris](https://github.com/spacedmonkey)
	* Fixes a bug where the help center wasn't properly styled in Safari.
	* Fixes an XSS issue, props [Hristo Pandjarov](https://twitter.com/pandjarov).

* Removed:
	* Removes the ability to sort on the post score column, because the scores aren't meant to be sorted.
	* Removes recalculation because there were too many
	issues with integration missing that can only be added on the actual post edit admin page.
	* Removes `json_encode` wrapper, it was only necessary for older WordPress versions.

= Earlier versions =

For the changelog of earlier versions, please refer to the separate changelog.txt file.
