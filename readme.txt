=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Google Search Console, Content analysis, Readability
Requires at least: 4.9
Tested up to: 5.1.1
Stable tag: 11.0
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

= 11.0.0 =
Release Date: April 16th, 2019

We've made huge changes to the schema.org markup we output, adding multiple different types of Schema. Be sure to check [our posts on yoast.com about this release](https://yoa.st/schema-release-post)!

Enhancements:

* Schema changes:
	* Adds `Person` markup for author pages.
	* Adds `WebPage` markup for all pages.
	* Adds `Article` markup for posts, with `Person` markup for the author.
	* Changes the ‘Organization or Person’ section of the Knowledge graph settings to allow selecting an author that is the ‘Person’ that the website represents.
* Adds MySpace, SoundCloud, Tumblr and YouTube URL input fields to people’s profiles.

Bugfixes:

* Fixes an issue where the metabox would not display on term edit pages when running the development build of Gutenberg.

= 10.1.3 =
Release Date: April 4th, 2019

Bugfixes:

* Reverted a fix relating replacement variables on the block editor, which was causing a slow and unworkable editting experience.
* Fixes a bug where the license information from MyYoast is being saved aggressively, causing updates in MyYoast to take 24 hours to show up in the site.
* Fixes a bug where the `rel="publisher"` Google+ tag was being output on the frontend if that profile was provided in the past.
* Fixes a bug where the server could experience a high load when using external object cache.
* Fixes the bug where Yoast SEO would contact Yoast.com for license checks on specific Yoast-pages even when no Yoast addons are installed.

= 10.1.2 =
Release Date: April 3rd, 2019

Bugfixes:

* Fixes the bug where Yoast SEO would contact Yoast.com for license checks even when no Yoast addons are installed.

= 10.1.1 =
Release Date: April 2nd, 2019

Bugfixes:

* Fixes a bug where a fatal error can occur on license requests which return an unexpected result.

= 10.1.0 =
Release Date: April 2nd, 2019

Enhancements:

* Removes Google+ from the various interfaces: social accounts, user profiles and more.
* Adds a Wikipedia URL field to the social accounts list, to be used in `sameAs` Schema.org output.
* Adds a LinkedIn profile URL field to user profiles, a first sign of things to come in 10.2.
* Removes the `og:image:alt` tag as it causes potential accessibility issues when content is shared via Facebook.
* Adds support for browsers auto-fill in the form fields that collect user information.
* Adds missing screen reader text to the SEO score icon in the front end admin bar.
* Increases the recommended sentence length limit for Spanish and Catalan to be more in line with best practices in these languages, props to [Sílvia Fustegueres](https://www.ampersand.net/en/).
* Improves the list of Catalan transition words, props to [Sílvia Fustegueres](https://www.ampersand.net/en/).
* Improves the list of Swedish transition words.

Bugfixes:

* Fixes a bug where selecting a parent page for a page would lead to console errors and a not-working 'parent page' snippet variable.
* Fixes a bug where no focus indication was shown for the title separators in the configuration wizard and settings.
* Fixes a bug where taxonomy terms weren't shown correctly in the Snippet Preview, for example when using the `Categories`, `Tags` or any custom taxonomy replacement variable.
* Fixes a bug where breadcrumb structured data wasn't output when breadcrumbs are disabled and a theme with breadcrumb support has been installed.
* Fixes a bug where a PHP notice would be written to `debug.log` when adding a new site to a WordPress 5.1 multisite installation.

Other:

* Removes all functionality that has been deprecated before Yoast SEO 6.1.

= 10.0.1 =
Release Date: March 19th, 2019

Bugfixes:

* Fixes a bug where network-wide settings were not saved on multisite environments.

= 10.0.0 =
Release Date: March 12th, 2019

Enhancements:

* The recalibrated analysis is out of its beta phase and is now the default for the SEO analysis. Thanks for testing and giving us your valuable feedback! You are awesome! 👍
* Adds `$taxonomy` to the arguments passed to the `wpseo_terms` filter. Props to [polevaultweb](https://github.com/polevaultweb).
* Changes the screen reader text of the SEO score indicator in the menu bar and the traffic light in the snippet preview from `Bad SEO score.` to `Needs improvement.`
* Props to [Kingdutch](https://github.com/Kingdutch) for helping improve our open source content analysis library.

Bugfixes:

* Fixes a bug where the `focus keyphrase` snippet variable was not correctly applied on term pages.
* Fixes a bug where the Facebook image that was set for the WooCommerce Shop page would not be outputted as `og:image`. Props [stodorovic](https://github.com/stodorovic).
* Fixes a bug where the featured image set on a WooCommerce Shop page would not be outputted as Facebook OpenGraph Image or Twitter Image. Props [stodorovic](https://github.com/stodorovic).
* Fixes a bug where backslashes and consecutive double quotes would be removed from the focus keyphrase when saving a post or term.
* Fixes a bug where backslashes would be removed from the breadcrumb title, focus keyphrase, title or meta description when saving a term.

= Earlier versions =

For the changelog of earlier versions, please refer to https://yoa.st/yoast-seo-changelog
