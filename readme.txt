=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Google Search Console, Content analysis, Readability
Requires at least: 4.8
Tested up to: 4.9.4
Stable tag: 6.3.1
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

= 6.3.1 =
Release Date: February 20th, 2018

Bugfixes:

* Fixes a bug where a non-existing JavaScript `chunk` file was loaded, causing a console error. This only affected users using a locale different than `en`.

= 6.3.0 =
Release Date: February 13th, 2018

Bugfixes:

* Reverts the shortlink in the HTML comment back to the hard link it was before.
* Fixes a bug where the Local SEO for WooCommerce extension was not shown on the licenses page.
* Fixes a bug where the `current_user_can()` function was not called with the post ID as argument.
* Fixes a bug where the auto-generated meta descriptions were not using the new 320 characters limitation.
* Fixes a bug where specific external links were not filtered from the post_type sitemap.
* Fixes a bug where trashed posts were displayed in the bulk editor overview.
* Fixes a bug where old meta values were not deleted during import.
* Fixes a bug where only 10 posts when executing meta robots import from wpSEO.de.
* Clears the sitemap cache when the Site URL is changed.

Enhancements:

* Adds an importer for the SEO Ultimate plugin SEO data.
* Adds an importer for the SEOpressor plugin SEO data.
* Adds links to explanatory articles on the features tab.
* Adds additional explanation for entries on the features tab.
* Improves Open Graph copy for Facebook and Twitter in the Social settings to better explain what it does.
* Improves Content Analysis and Publish box copy for better translations.
* Applies design changes to the Help Center support tab for Premium.

Other:

* Removes "meta keywords" from the plugin as this has had no search result value for at least 7 years.
* Removes the "noindex subpages" feature as Google has gotten much better at paginated series, and it's now actually detrimental to use.
* Removes the "Other" tab from the Titles & Metas settings screen, as all options have been moved or removed.
* Security hardening.

= 6.2.0 =
Release Date: January 23rd, 2018

Enhancements:

* Allows more strings to be translated.
* Adds the passive voice assessment for French.
* Adds the passive voice assessment for Spanish.
* Simplifies the feedback message for the assessment that checks whether subheadings contain the keyword.

Bugfixes:

* Security hardening through stricter code checks.
* Reduces the number of times the content analysis is refreshed on page load.
* Fixes a bug where relative URLs were not counted as internal links in the internal link assessment.
* Fixes a bug where Premium users would be shown ads when following a certain path through the SEO menu.
* Fixes a bug where the method of setting the title and meta description templates for the WooCommerce shop page would not work anymore.

= Earlier versions =

For the changelog of earlier versions, please refer to the separate changelog.txt file.
