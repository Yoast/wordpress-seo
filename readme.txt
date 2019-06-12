=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Content analysis, Readability
Requires at least: 4.9
Tested up to: 5.2.1
Stable tag: 11.3
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
* Manage SEO roles: Give your colleagues access to specific sections of the Yoast SEO plugin.
* Bulk editor: Make large-scale edits to your site.
* **[Premium]** Social previews to manage the way your page is shared on social networks like Facebook and Twitter.
* **[Premium]** Redirect manager: It keeps your site healthy by easily redirecting deleted pages and changed URLs.

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

= 11.4.0 =
Release Date: June 12th, 2019

Enhancements:

* Yoast SEO now takes control of the Schema output on pages generated by the [AMP plugin](https://wordpress.org/plugins/amp/).
* Introduces a new action `wpseo_pre-schema_block-type_<block-type>` which allows changing graph output based on the blocks on the page.
* Introduces a new filter `wpseo_schema_block_<block-type>` which allows filtering graph output per block.
* Improves the `FAQPage` Schema markup to adhere to Google's new standards.
* Optimizes the handling of external images.
* Adds links to the SEO and readability scores in the classic editor publish box that make the page scroll to the corresponding analysis in the metabox.
* Moves the focus keyphrase input field to the top of the metabox and sidebar.

Bugfixes:

* Fixes a bug where object cache for `WPSEO_Option_Titles` would be cleared too often.
* Fixes a bug where questions without answers would be outputted in the Schema FAQ markup.
* Fixes a bug where the overridden canonical would be used instead of the 'unoverridden' canonical.
* Fixes a bug where the traffic light icon would be empty when the readability and SEO analysis were disabled.
* Fixes a bug where following links to page fragments would make the Help Center video tab disappear.
* Fixes a bug where author Schema would be outputted on author archives when author archives were disabled.

Other:

* Removes a redundant caching call for primary terms.

= 11.3.0 =
Release Date: May 28th, 2019

High-time for another release, namely Yoast SEO 11.3. This release features enhancements and bug fixes aimed at improving the way your favorite SEO plugin performs. Read more about the release in [our 11.3 release post](https://yoa.st/release-11-3).

Enhancements:

* When the site is set to represent a person, a logo/avatar to be used in the knowledge graph can now be selected in the Search Appearance settings.
* Adds the `wpseo_should_index_links` filter that can be used to disable the link indexation.
* Enables builtin Taxonomies for the 'Content type archive to show in breadcrumbs for taxonomies' section to allow the Blog archive page be added to the breadcrumbs.
* Props to [@ramiy](https://profiles.wordpress.org/ramiy/) for making translating the plugin easier by merging near identical strings.

Bugfixes:

* Fixes a bug where sitemaps would be shown in the `sitemap_index.xml` but result in a 404 when requested.
* Fixes a bug where the schema output would include an invalid publisher when the site was set to represent a person.
* Fixes a bug where a `Person` schema object would be output, when the site was set to represent a person, but no specific person was selected.
* Fixes a bug where it would no longer be possible to change the user in the Search Appearance settings when the previously selected user had been deleted.

Other:

* Removes the help center from the metabox.
* Removes redundant `name` attribute from `author` in `Article` schema markup piece.
* Increases the MyYoast API request timeout from 1 to 5 seconds, to give servers with a less optimal connection to our services more room to fetch the data.
