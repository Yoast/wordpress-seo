=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Google Search Console, Content analysis, Readability
Requires at least: 4.8
Tested up to: 4.9.6
Stable tag: 7.7.3
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

= 7.7.3 =
Release Date: July 2nd, 2018

Bugfixes:
* Disables WordPress' automatic conversion of emoji to images on every page where the snippet editor is present. This conversion is not compatible with React or content editable fields and broke the snippet editor.
* Fixes text directionality for the title and description fields in the snippet editor for right-to-left languages.
* Fixes a bug where the snippet title and description values were saved to the database if they did match the post-type template.

= 7.7.2 =
Release Date: June 29th, 2018

Bugfixes:
* Fixes a bug where the snippet variables selection is hidden behind the WordPress menu when using a right-to-left language.
* Fixes styling in the snippet preview when using a right-to-left language.
* Fixes a bug where the 'insert snippet variable' button placement was inconsistent.
* Migrates WooCommerce Product archive settings to the Shop page, if present and not already set on the Shop page.

= 7.7.1 =
Release Date: June 27th, 2018

Bugfixes:
* Fixes a bug where disabling the `post_format` archive would result in it actually being enabled and vice versa.
* Fixes an issue where all replacement variables were being displayed instead of the recommended ones.

Other:
* Restores `currentyear` as a snippet variable.

= 7.7.0 =
Release Date: June 26th, 2018

Enhancements:
* Implements the snippet preview in React. This brings an improved user experience regarding the snippet variables, making it easier to use and discover them.
* Implements the improved snippet variables on the search appearance settings pages.
* Adds an inserter to the title and metadescription fields to make it easier to insert a snippet variable.
* Improves the mobile snippet preview to match the Google mobile search results more closely.
* Changes the behavior of the meta description preview when there is no handwritten meta description. We no longer mimic Google by showing a part of your content, but explain what Google does instead.
* Sends the user to the proper control in the customizer when clicking the link in the "You still have the default WordPress tagline [...]" warning message.
* Adds a `wpseo_attachment_redirect_url` filter to allow changing of the target redirection URL for attachments. This may be necessary to restore the redirect to the parent post. Props to [cawa-93](https://github.com/cawa-93).
* Adds a `wpseo_recommended_replace_vars` filter to allow adding or altering the recommended snippet variables.
* Adds support for JSON-LD breadcrumbs. Props to [teolaz](https://github.com/teolaz)
* Improves the lists of French transition words, stopwords, and function words, props to [Laurent-1971](https://github.com/Laurent-1971).
* Improves the assessment that checks the use of subheadings so that it always returns relevant feedback to the user.
* Adds a notification when a post is removed.
* Overhauls the Content Types section under SEO -> Search Appearance by sectioning the post types and allowing users to collapse them. This is especially handy when you have a lot of custom post types.
* Updates the 'snippet variables tab' of the Help Center to have the new names.
* Adds recommended snippet variables for templates depending on the context.

Bugfixes:
* Fixes a bug where a PHP notice would be triggered when the `opcache.restrict_api` directive was enabled.
* Fixes a bug where restricting SEO setting access to network admins only on a multisite, would still allow regular admins to have access to SEO settings.
* Fixes a bug where dismissing notifications on a single site in a multisite environment, would result in the notification being dismissed on all sites.
* Fixes a bug where the attachment URL would redirect to `wp-admin` if the attachment was located on a different Site URL domain.
* Fixes a bug where MySQL would throw a "Duplicate entry 'X'" error into the error log when attempting to upsert a record in the database.
* Fixes a performance problem where the selecting a fallback Open Graph image would collect the filename for all the images in the content. This has been changed to detecting if an image is usable per image and stopping when a usable image is found.
* Fixes a bug where the term title snippet variable would be replaced by 'undefined' instead of an empty string on posts and pages.
* Fixes a bug where PHP notices got triggered on archive pages when `%%pt_single%%` and/or `%%pt_plural%%` are used in a template.
* Fixes a bug where the configured separator wasn't used in the title template fallback that's being used when no title template has been set.

Deprecated:
* Deprecates the following snippet variables: %%userid%%, %%currenttime%%, %%currentdate%%, %%currentday%%, %%currentmonth%%, %%currentyear%%.

Other:
* Changes the timing on which the capability filter is run to better time when notifications should be initialized.
* Adds X-Redirect-By header to all redirects, making the origin of redirects much easier to debug.

= 7.6.1 =
Release Date: June 7th, 2018

Bugfixes:
* Fixes a bug where a JavaScript error was thrown on the post-edit page when certain plugins are active.
* Fixes a bug where stylesheet definitions would impact form fields of metaboxes on the post-edit pages. The definitions have been contained in a Yoast-selector.

= 7.6.0 =
Release Date: June 5th, 2018

Enhancements:
* Adds Flesch Reading Ease for Russian.
* Adds Catalan transition words.
* Adds a tab to the Help Center on posts, pages, terms and custom post types which explains which template variables can be used in the Snippet Preview.

Bugfixes:
* Fixes a bug where sequences of symbols which do not contain a single letter or digit were considered as valid keywords.
* Fixes a bug where Flesch Reading Ease translation strings were not fully translated.
* Fixes a bug where numbers-only keywords caused the analysis to fail.
* Fixes a bug where the active keyword in the state wasn't updated whenever changes were made in the keyword field.
* Fixes a bug where replacevars based on custom fields would throw an error due to a missing ID.

Other:
* Changes the maximum meta description length from 320 to 156 characters.
* Fixes typo in $field_defs parameter description for wpseo_metabox_entries filter.
* Restores the warning for using unsupported replacement variables on the search appearance settings page.

= Earlier versions =

For the changelog of earlier versions, please refer to https://yoa.st/yoast-seo-changelog
