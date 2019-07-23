=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Content analysis, Readability
Requires at least: 4.9
Tested up to: 5.2.2
Stable tag: 11.7
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

= 11.7.0 =
Release Date: July 23rd, 2019

By now you probably know the 11.x releases of Yoast SEO are all about Schema. In this release, we’ve enabled the possibility to use to use a subset of HTML tags in the FAQ and HowTo blocks! Find out all about Yoast SEO 11.7 in [our 11.7 release post](https://yoa.st/release-11-7)!

Enhancements:

* Allows a subset of HTML tags in FAQ answer, HowTo description and HowToStep description schema output: `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`, `<br>`, `<ol>`, `<ul>`, `<li>`, `<a>`, `<p>`, `<b>`, `<strong>`, `<i>`, `<em>`, and their closing counterparts.
* Remove the `noindex` from feeds as this causes issues for podcasts and other feeds.
* Improves the accessibility of the horizontal tabs in the metabox by implementing an ARIA tabbed user interface.

Bugfixes:

* Fixes a bug where the avatar in the knowledge graph settings would incorrectly overwrite the default user profile picture.

= 11.6.0 =
Release Date: July 9th, 2019

Yoast SEO 11.6 is out today. Of course, we did the regular round of bug fixing, but the focus of this release is two-fold: a new, much easier to use tabbed interface for the meta box and an updated HowTo structured data content block for WordPress. Find out all about Yoast SEO 11.6 in [our 11.6 release post](https://yoa.st/release-11-6)!

Enhancements:

* Changes the tabs in the metabox to horizontal tabs.
* Splits the content optimization tab in the metabox into two separate tabs: an SEO and a Readability tab.
* Updates HowTo schema output to reflect Google's new guidelines.
* Makes sure the media modal that is triggered for image uploads only displays images.

Bugfixes:

* Fixes a bug where the Schema `@id` for `Person` would be incorrect on posts when author archives where disabled. 
* Fixes a bug where the Schema would contain `WebPage` instead of `CollectionPage` for a latest posts homepage and the static posts page type.
* Fixes a bug where the Organization and Article Schema nodes would incorrectly be output when a website had not set their organization's name and/or logo.
* Fixes a bug where the eye marker tooltips would break out of the metabox, which would hide the last part of the tooltip text.
* Fixes a bug where instances of unfiltered HTML would be allowed in term descriptions where they shouldn't be.

= Earlier versions =
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/yoast-seo-changelog).
