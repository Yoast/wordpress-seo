=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Google Search Console, Content analysis, Readability
Requires at least: 4.9
Tested up to: 5.0.1
Stable tag: 9.3
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

= 9.3.0 =
Release Date: December 18th, 2018

Enhancements:

* Reapplies the markers in Gutenberg when the content changes to make sure they stay up-to-date.
* Changes the output of schema preventing unnecessary escaping of forward slashes, only available on sites running PHP 5.4 or higher.
* Changes the website schema `@id` attribute to include the home URL to be a unique identifier.
* Adds the page number to the breadcrumbs when an archived page is entered.
* Removes a redundant Edge-specific CSS fix for the tooltips in the post overview. Props [mkronenfeld](https://github.com/mkronenfeld).

Bugfixes:

* Fixes a bug where the 'Select primary category' label in the primary taxonomy picker would overlap the 'Add new category' button.
* Fixes a bug where the cornerstone filter was still visible with the metabox disabled.
* Fixes a bug where non-functional markers are shown for taxonomy pages.
* Fixes a bug where the `og:description` tag would remain empty after setting the author description.
* Fixes a bug where texts in the configuration wizard would overlap each other and break out of the columns in Internet Explorer 11. Props [DrGrimshaw](https://github.com/DrGrimshaw).
* Fixes a bug where keyphrases weren't recognized in the URL when the words in the URL were separated by underscore characters instead of hyphens.
* Fixes a bug that caused numbers to be stripped when marking a keyphrase containing a number, e.g. 'Yoast SEO 9.3'.
* Fixes a bug where the first tab of the metabox would be empty when using WordPress 4.8.x.
* Fixes a bug where private post types would have a sitemap with their 'private' entries.

Other:
* Implemented performance optimizations in FAQ and How To blocks.

= 9.2.1 =
Release Date: November 21th, 2018

Bugfixes:

* Fixes a bug where the title and meta description field's cursor would jump to the start when typing.

= 9.2.0 =
Release Date: November 20th, 2018

Enhancements:

* Adds support for the 'eye' markers in Gutenberg using the experimental annotations API in Gutenberg. They will work for the paragraph, quote, heading and list blocks.
* Adds the latest og:locale options provided by Facebook. Props to [valtlfelipe](https://github.com/valtlfelipe)
* Adds support for oEmbed utilization of Yoast custom fields (post meta) values. Specifically the image and the title. Props to [ben-caplan](https://github.com/ben-caplan)
* Defines attachment as non-accessible when attachment urls are redirected to the attachment file itself. Props to [stodorovic](https://github.com/stodorovic)
* Improves the accessibility of the "Bulk editor" and "Search console" tables.
* Hides SEO title and meta description fields on the author edit page when the author archives are disabled.
* Replaces Settings ZIP download (export) and upload (import) functionality with Settings fields.

Bugfixes:

* Fixes a bug where assessments would fail if a "<" character is present in the content.
* Fixes a bug where the excerpt replacement variable will output a piece of the post content when no excerpt is given.
* Fixes a bug where the wrong title is rendered for the WooCommerce product archive.
* Fixes a bug where the Yoast metabox is visible even when the attachment urls are redirected to the attachment file itself.
* Fixes a bug where the Dashboard Widget was not displayed in the correct language.
* Fixes a bug in combination with Gutenberg where paragraphs were sometimes not correctly detected because paragraph tags were not automatically added in WordPress-like fashion.
* Fixes a bug in combination with Gutenberg where multiple marker buttons could be active at the same time.
* Fixes a bug in combination with Gutenberg where escaped HTML is shown in the OpenGraph description.

Compatibility:

* Adds the `__block_editor_compatible_meta_box` flag to our metabox registrations to indicate they are compatible with WordPress 5.0.
* Revise the enqueue order of the JavaScript assets to ensure compatibility with the classic editor plugin and WordPress 5.0.

Security:

* Fixes a possible command execution by users with SEO Manager roles. Props to [Dimopoulos Elias](https://twitter.com/gweeperx)

Other:

* Disables the non-functioning markers for the subheading distribution assessment.
* Refactor SEO assessment filenames and exports. Props to [Kingdutch](https://github.com/Kingdutch)
* Deprecates the `Yoast_Modal` class.

= Earlier versions =

For the changelog of earlier versions, please refer to https://yoa.st/yoast-seo-changelog
