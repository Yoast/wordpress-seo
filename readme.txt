=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Google Search Console, Content analysis, Readability
Requires at least: 4.9
Tested up to: 5.0.3
Stable tag: 9.5
Requires PHP: 5.2.4

Improve your WordPress SEO: Write better content and have a fully optimized WordPress site using the Yoast SEO plugin.

== Description ==

### Yoast SEO: the #1 WordPress SEO plugin

Need some help with your search engine optimization? Need an SEO plugin that helps you reach for the stars? Yoast SEO is the original WordPress SEO plugin since 2008. It is the favorite tool of millions of users, ranging from the bakery around the corner to some of the most popular sites on the planet. With Yoast SEO, you get a solid toolset that helps you aim for that number one spot in the search results. Yoast: SEO for everyone.

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
* **[Premium]** The Insights tool shows you what your text focuses on so you can keep your article in line with your keyphrases.
* **[Premium]** Synonyms & related keyphrases: Optimize your article for synonyms and related keyphrases.
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

Note that the [Yoast SEO Premium](https://yoa.st/1v8) also has several extra features too, including the option to have synonyms and related keyphrases, internal linking suggestions, cornerstone content checks and a redirect manager, so it is well worth your investment!

You should also check out the [Yoast Local SEO](https://yoa.st/1uu), [Yoast News SEO](https://yoa.st/1uv) and [Yoast Video SEO](https://yoa.st/1uw) extensions to Yoast SEO. They work with the free version of Yoast SEO already, and these premium extensions of course come with support too.

### Bug reports

Bug reports for Yoast SEO are [welcomed on GitHub](https://github.com/Yoast/wordpress-seo). Please note GitHub is not a support forum, and issues that aren’t properly qualified as bugs will be closed.

### Further Reading

For more info on search engine optimization, check out the following:

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
= 9.5.0 =
Release Date: January 22nd, 2019

Enhancements:

* Completes the readability analysis for Swedish by adding the transition words, sentence beginnings and passive voice assessments.
* Improves the transition word assessment for German.

Bugfixes:

* Fixes a bug where the Ryte endpoint would be called when the Ryte feature has been disabled.
* Fixes a bug where the 'Show archives for authors without posts in search results?' toggle would be shown when the 'Show author archives in search results?' toggle was disabled in the search appearance settings.
* Fixes a bug where the front page would be shown in the page sitemap. Props to [stodorovic](https://github.com/stodorovic).
* Fixes a bug where errors would be thrown in the classic editor when Gutenberg assets were enqueued without Gutenberg being active.
* Fixes a bug where the editor would not be loaded when clicking the ‘edit’ button for a child page in the page overview. Props [mondrey](https://github.com/mondrey).

Deprecated:

* Deprecates the methods WPSEO_Utils::get_user_locale() and WPSEO_Utils::get_language().

Other:

* Adds a Courses Page showing an overview of the available online courses offered by Yoast Academy.

= 9.4.0 =
Release Date: January 8th, 2019

Content analysis recalibration (beta):

* Adds a toggle feature for subscribing to the recalibration beta under SEO -> General -> Features.
* When the recalibration feature is enabled:
  * The single title assessment is added. This assessment makes sure that you don't use superfluous H1s in your text.
  * Assessments changes:
    * Keyphrase density: changes scoring schema to account for the length of the keyphrase and changes feedback strings so that we give feedback about the number of occurrences rather than a percentage.
    * Outbound links assessment: changes the scoring schema so that red bullet instead of an orange bullet is shown when you have no outbound links.
    * Image alt attributes: if there are at least 5 images, checks whether the alt tags contain the keyphrase or synoynyms in 30-70% of all images. If there are less than 5 images, 1 image with the keyphrase or synonym in the alt tag is still scored as good.
    * Keyphrase in title: function words preceding the exact match keyphrase are ignored when determining the position of the keyphrase in the title.
    * Keyphrase length: makes the scoring scheme less strict for languages that don't have function word support, so that for these languages keyphrases with 1-6 words are scored as green, 7-9 as orange, and more than 9 as red.
    * Keyphrase in subheading: only takes H2 and H3 level subheadings into account and changes the scoring schema so that 30%-75% of these subheadings need to include the keyphrase or its synonyms. In languages without function word support, a match is only counted if all the words from the keyphrase/synonym appear in the subheading.
    * Text length: on taxonomy pages, the recommended minimum text length is increased from 150 to 250 words.
  * Assessment removals:
    * The assessment checking the length or your URL.
    * The assessment checking whether your URL contains stopwords.

Enhancements:

* Improve accessibility of the analysis results.
* Improve accessibility of the Title Separator setting.
* Adds a new filter for adjacent-rel links: `wpseo_adjacent_rel_url`.

Bugfixes:

* Fixes a bug where special characters from certain word lists weren't correctly escaped when matched with a regex. This resulted in `eggs` being incorrectly matched as the transition word `e.g.`, for example.
* Fixes a bug where the search appearance setting for a custom content type named `profile` would have a broken layout.
* Fixes a bug where pagination elements were not shown in the Genesis theme.

Other:

* Uses method `is_simple_page` instead of `is_singular` in method robots. Props to: [stodorovic](https://github.com/stodorovic)
* Adds method `is_woocommerce_active` and check is woocommerce activate before registering hooks. Props to [stodorovic](https://github.com/stodorovic)
* Adds static variables to "cache" results of functions [`is_shop`](https://docs.woocommerce.com/wc-apidocs/function-is_shop.html) and [`wc_get_page_id`](https://docs.woocommerce.com/wc-apidocs/function-wc_get_page_id.html). Props to [stodorovic](https://github.com/stodorovic)
* Verifies that variable `post` is an instance of `WP_Post` in `WPSEO_Admin_Bar_Menu ::get_singular_post()`. Props to [@yingles](https://github.com/yingles).
* Improves strings to be more easily translated. Props to [pedro-mendonca](https://github.com/pedro-mendonca)
* The browser console now shows more descriptive error messages when something went wrong during analyses in the web worker.
* Avoids irrelevant warning and error in the WPEngine PHP Compatibility plugin.

= Earlier versions =

For the changelog of earlier versions, please refer to [the Yoast SEO changelog on yoast.com](https://yoa.st/yoast-seo-changelog)
