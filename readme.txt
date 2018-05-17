=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Google Search Console, Content analysis, Readability
Requires at least: 4.8
Tested up to: 4.9.5
Stable tag: 7.5.1
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

= 7.5.1 =
Release Date: May 16th, 2018

Bugfixes:
* Fixes a bug where the auto-generating of the slug did not work as expected due to persisting of the post name too agressively.

= 7.5.0 =
Release Date: May 15th, 2018

Enhancements:
* Adds readability analysis for Russian.
* Improves accessibility.

Bugfixes:
* Fixes a bug where images with specific aspect ratios where removed from OpenGraph consideration. This was causing unexpected results with Facebook sharing. The aspect ratio check has been removed completely.
* Fixes a bug where sentences ending in multiple sentence marks, exclamation marks or ellipses were treated as multiple sentences.
* Fixes a bug where attempting to get Yoast SEO options in multi-site, would result in wrong values being returned.
* Fixes a bug where the sitemap styling could not be loaded when the Site domain differs from the Admin domain.
* Fixes a bug where the admin bar still used old copy: Dashboard has been renamed to General.

= 7.4.2 =
Release Date: May 3rd, 2018

Bugfixes:
* Fixes automatic image size detection for OpenGraph images. When an image was used that was too large, we wouldn't output the `og:image` tag. That is now fixed.
* Fixes a bug where portrait images where not allowed for the OpenGraph image.

= 7.4.1 =
Release Date: May 2nd, 2018

Bugfixes:
* Re-adds `wpseo_opengraph_image_size` filter. This will completely override any automatic size determination our code does. This filter now also applies to all ways an `og:image` can be determined: In the content, as a featured image or as set in our Facebook image setting.
* Fixes an unintended backwards incompatible change which caused "Warning: Illegal string offset ‘url’ in".
* Fixes an unintended change which caused SVGs to be included in consideration for the `og:image` tag. SVG images are not allowed by Facebook, so these should never be used in the `og:image` tag.

= 7.4.0 =
Release Date: May 1st, 2018

Enhancements:
* Adds OpenGraph image dimension-meta tags for more images.
* Excludes images from being used in OpenGraph meta tags, if the image is larger than 2MB.
* Adds caching for images found in a post to reduce load.
* Adds image alt tag to the OpenGraph output, using the meta tag `og:image:alt`.
* Adds the `is_post_type_viewable` WordPress function to improve support for the `wpseo_accessible_post_types` filters.

Bugfixes:
* Fixes a bug where a non-array value causes a fatal error when `cron_schedules` filter has been executed.
* Fixes a bug where not all database tables were removed when a subsite was deleted in a multisite environment.
* Fixes a bug where deleting multiple posts might cause performance issues. Props to [Moeini](https://github.com/abolfazl-moeini).

Other:
* Introduces a message, warning about dropping of PHP 5.2 support in an upcoming version.
* Alters the configuration service text in the Configuration Wizard when a user is already running Yoast SEO Premium. Previously the text contained a reference to getting a bundled copy of Premium, even if the user was already running Premium.

= Earlier versions =

For the changelog of earlier versions, please refer to https://yoa.st/yoast-seo-changelog
