=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Google Search Console, Content analysis, Readability
Requires at least: 4.8
Tested up to: 4.9.8
Stable tag: 8.2
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

= 8.2.0 =
Release Date: September 11th, 2018

Enhancements:

* Introduces a How-To block in Gutenberg to create a How-to guide in an SEO-friendly way. Read more about the Gutenblocks in [https://yoa.st/gutenblocks](our release post).
* Introduces a FAQ block in Gutenberg to list your Frequently Asked Questions in an SEO-friendly way. Read more about the Gutenblocks in [https://yoa.st/gutenblocks](our release post).
* Adds readability analysis for Polish.
* On Multisite environments, in addition to the site domain, path and ID, also site titles are now present in the site selection dropdowns.

Bugfixes:

* Fixes a bug where changing the WordPress slug would not correctly update the snippet editor.
* Fixes a bug where the user input would trigger an analysis every time.
* Fixes a bug with incorrect zooming on older iPhones within the installation wizard.
* Fixes a bug where the OpenGraph image wouldn't show correctly for the frontpage in a few situations. Props to [@mt8](https://github.com/mt8) for the solution direction.
* Fixes a bug where the Yoast SEO network admin menu and admin bar menu would appear when the plugin was only active for the main site, and not for the entire network.
* Fixes a bug where snippet variables in the Twitter card title and description wouldn't be properly replaced.
* Fixes a bug where a non-existing dependency was requested on the Search Appearance settings page.
* Fixes a bug where the value of the primary category snippet variable in the classic editor wouldn't change when the primary category was changed.
* Fixes a bug where the Gutenberg editor in the Classic Editor plugin would crash when the primary category picker was loaded. If something goes wrong in the primary category picker, it now shows a notification, instead of making the entire editor crash.
* Fixes a bug where the readability analysis would not show the correct scores for cornerstone content.
* Fixes a bug where switching off the SEO analysis would stop the readability analysis from loading.
* Fixes a fatal error on the Term and Post edit pages when the server is running on PHP 5.2.

= 8.1.2 =
Release Date: September 5th, 2018

Bugfixes:

* Fixes a bug where our JavaScript memory usage would increase indefinitely. This could result in a browser crash after a long enough period.

= 8.1.1 =
Release Date: September 3rd, 2018

Bugfixes:

* Fixes compatibility with Gutenberg 3.7, which removed a feature we were relying on.
* Fixes a bug where the Twitter meta-tags would not have the snippet variables replaced with their dynamic values.
* Fixes a bug where the `og:url` would not be set to the canonical URL if the canonical URL is explicitly set on Post types, Terms or Tags.
* Fixes a bug on the Term page when editting the `slug`, it would not be updated in the Snippet Preview directly.

= 8.1.0 =
Release Date: August 28th, 2018

Enhancements:

* Adds the Snippet Preview Editor to the sidebar.
* Introduces the Primary Category picker to Gutenberg.
* Introduces a loading indicator in the analysis that is shown until we're ready to analyze the content.
* Optimizes the content analysis calculations. This fixes the issue where the UI could freeze when you have a long post.
* Changes the "Check Inlinks (OSE)" menu item in the Yoast Admin bar "Analyze this page" dropdown from the Moz OpenSite Explorer (OSE) to Google Search Console, as the former service is being disabled on August 30th 2018.

Bugfixes:

* Fixes a bug where the analysis scores would change multiple times due to a delay in the loading of the actual scores. We now show loading indicators until the actual scores have been calculated.
* Fixes a bug where the parent title snippet variable wasn't properly being replaced with the actual parent title in Gutenberg.
* Fixes a plugin compatibility bug where the SEO score in the admin bar could not be retrieved.
* Fixes a bug where the editor would not be usable when deferred or async loading of JavaScript is being forced.
* Fixes a bug where the analysis for previously used keywords would only be triggered if the keyword was changed, resulting in an incorrect SEO score.

= Earlier versions =

For the changelog of earlier versions, please refer to https://yoa.st/yoast-seo-changelog
