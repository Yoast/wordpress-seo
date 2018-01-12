=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Google Search Console, Content analysis, Readability
Requires at least: 4.8
Tested up to: 4.9.1
Stable tag: 6.1.2
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
2. The fully configurable XML sitemap for Yoast SEO.
3. Easily import SEO data from other SEO plugins like All In One SEO pack, HeadSpace2 SEO and wpSEO.de.
4. Example of the SEO analysis functionality.
5. Example of the readability analysis functionality.
6. The advanced section of the Yoast SEO meta box.

== Changelog ==

= 6.1.1 =
Release Date: January 10th, 2018

Bugfixes:

* Fixes a bug where sitemaps could not be generated when there one or more galleries in the content.

= 6.1.0 =
Release Date: January 9th, 2018

Enhancements:

* Allows more strings to be translated.
* Replaces any Yoast domain URLs with shortlink alternatives.

Bugfixes:

* Fixes a bug where the internal links aren't recognized when the `site_url` is not the same as the `home_url`.
* Fixes a bug where the user locale is not used for the Help Center when it is different from the site locale.
* Removes unsupported PHP 5.2 arguments in an `array_unique` call in the Term image sitemap.
* Removes unsupported PHP 5.3 arguments in a `json_encode` call in the notification functionality.
* Added support for locales without territory (examples: et, fi) - Props [Peeter Marvet](https://github.com/petskratt).
* Added support support for 3-letter language codes (example: rhg) - Props [Peeter Marvet](https://github.com/petskratt).
* Fixes a JavaScript compatibility issue by prefixing the webpack jsonP function with `yoast` - Props [Raitis Sevelis from Visual Composer](https://visualcomposer.io/).

= 6.0.0 =
Release Date: December 20th, 2017

Enhancements:

* Adds support for custom page titles and meta descriptions on the WooCommerce shop page. Props [Caleb Burks](https://github.com/WPprodigy).
* Adds support for custom page social titles and descriptions on the WooCommerce shop page.
* Adds a link to the Google Knowledge Graph article on Yoast.com. Props [Raaj Trambadia](https://github.com/raajtram).
* Adds a link to an article on Yoast.com on why it might be a bad idea to use the same keyword more than once.
* Changed the meta description maximum recommended length from 156 to 320 characters.

Bugfixes:

* Disables the mark buttons of the content analysis when switched to text view.
* Hides the mark buttons when the WYSIWYG editor is not loaded or the filter `wpseo_enable_assessment_markers` returns false.
* Security hardening through stricter code checks.

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

= Earlier versions =

For the changelog of earlier versions, please refer to the separate changelog.txt file.
