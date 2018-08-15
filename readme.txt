=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Google Search Console, Content analysis, Readability
Requires at least: 4.8
Tested up to: 4.9.8
Stable tag: 8.0
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

= 8.0.0 =
Release Date: August 14th, 2018

Enhancements:
* Implements the Yoast sidebar for Gutenberg: added the Readability, Focus Keyword and Cornerstone content tabs to the sidebar.
* Revamps the Yoast metabox to use the same vertical design as the new sidebar.
* Implements the same tabbed layout in the plugin's network settings screen that is also used in the plugin's site settings screens.
* Implements a plugin-specific network settings API and use it in the network settings screen.
* Introduces a network admin-specific admin bar menu.
* Adds notifications to the Notification Center in regards to Gutenberg compatibility. If Gutenberg is older than the minimum supported version by Yoast SEO, a 'problem' notification is added. If Gutenberg is only slightly outdated, a 'normal' notification is added.
* Implements the automatic detection of the keyword for terms based on the term's title.

Bugfixes:
* Fixes a bug where `/sitemap.xml` would not correctly redirect to `/sitemap_index.xml` in some environments.
* Fixes a bug where sitemap cache transients would not be correctly cleared.
* Fixes a bug where markers were wrongfully displayed in Gutenberg.
* Fixes a bug where SEO titles were incorrectly evaluated as being of a good length when they were actually slightly too long.

Other:
* Moves the network's Restore Site functionality into its own tab.

= 7.9.1 =
Release Date: August 7th, 2018

Enhancements:
* Improves the link to claim your website on Pinterest by directly sending you to the right location.
* Adds the passive voice assessment for Dutch.
* Adds a link to a relevant article about re-using keywords to the feedback of the assessment that checks if the keyword was used previously.

Bugfixes:
* Adds a missing H1 heading to the Network Admin > SEO > Edit Files page.
* Fixes the textarea sizes in the Search Appearance > RSS tab.
* Fixes a bug where adding a company image in step 4 of the Configuration Wizard, would make the wizard crash.
* Fixes a bug where PHP error notices were given when the search result doesn't have any WooCommerce products. Props to [jaska120](https://github.com/jaska120).
* Improves the order in which assessments are triggered. The keyword in the title is only checked once there's a title, the keyword in the introduction is only checked once there's a text, and the keyword in the meta description is only checked once there's a meta description.
* Fixes a bug that caused keywords to be incorrectly recognized within possessive forms (e.g. `Natalia` in `Natalia's fix`).
* Improves the recognition of keywords with special diacritics in the URL.
* Improves keyword recognition through adding Spanish inverted exclamation and question marks to the rules that determine word boundaries.

Other:
* Corrects the WP_Filesystem() initialization call to support settings import for non-default FS_METHOD definitions. Props to [ptbello](https://github.com/ptbello).

= 7.9.0 =
Release Date: July 24th, 2018

Enhancements:
* Introduces the collapsible sections to all the tabs in Search Appearance.
* Improves accessibility of the collapsible sections in Search Appearance.

Bugfixes:
* Fixes a bug where archive settings for post types aren't shown on the search appearance page when the `has_archive` for that post type contains an archive slug. Props to [nesinervink](https://github.com/nesinervink), [schurig](https://github.com/schurig).
* Fixes a bug where a notice ("Notice: Trying to get property of non-object") is given when the `$term->taxonomy` isn't set before it is used. Props to [bainternet](https://github.com/bainternet).
* Fixes a bug where an uppercased encode URI isn't redirected to the category. Props to [dawnbirth](https://github.com/dawnbirth).
* Fixes a bug where HTML entities were not always decoded in the Snippet Variables.
* Fixes a bug where custom field labels would be separated by spaces in the classic editor, but in Gutenberg they would be separated by underscores instead.
* Fixes a bug where the conversion of `&#039;`, which is PHP's HTML entity for the apostrophy, did not happen.
* Fixes a bug where the same notification is shown multiple times when trashing multiple posts.
* Fixes a bug where a possibly non-existent key would be retrieved when generating the `article:section` OpenGraph tag. Props to [mikeschinkel](https://github.com/mikeschinkel).
* Fixes a bug in the UI that happend when `do_shortcode` was run on category descriptions in the admin list. Additionally, fixes rendering of shortcodes in category descriptions on the frontend.
* Fixes a bug where saved templates in Search Appearance would be saved incorrectly into the database, resulting in them never being loaded when editing a post, page, etc. This meant that the default template would always be used.
* Fixes a bug where the "Tagline" / `%%sitedesc%%` snippet editor variable was not selectable in the Search Appearance settings.
* Fixes a bug where the newsletter signup in the configuration wizard would not work.

Other:
* Moves some snippet variables to only appear within specific editors. Adds a filter `wpseo_editor_specific_replace_vars` to make this pluggable.
* Adds the white background to the template of media on the Search Appearance page.
* Changes feedback in the keyword density assessment to make it more explicit that synonyms are not taken into consideration when calculating the score.
* Shows a notification with the message that you should check your post type archive settings when these are possibly reset to their defaults in 7.7 or 7.8.

= Earlier versions =

For the changelog of earlier versions, please refer to https://yoa.st/yoast-seo-changelog
