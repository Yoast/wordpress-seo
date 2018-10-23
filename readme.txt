=== Yoast SEO ===
Contributors: yoast, joostdevalk, tacoverdo, omarreiss, atimmer, jipmoors
Donate link: https://yoa.st/1up
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: SEO, XML sitemap, Google Search Console, Content analysis, Readability
Requires at least: 4.8
Tested up to: 4.9.8
Stable tag: 9.0.1
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

= 9.0.1 =
Release Date: October 23rd, 2018

Bugfixes:

* Fixes error with using `$` in wp-seo-admin-media.js. Now we use `jQuery` instead.

= 9.0.0 =
Release Date: October 23rd, 2018

Bugfixes:

* Fixes a bug where the keyword would not be found in the slug when containing punctuation, for example the keyphrase `apples & pears` in the slug `apples-pears`.
* Fixes a bug where the buttons to change the How-to steps and FAQ questions order would be only partially visible in mobile view.
* Fixes a bug where an 'undefined index' notice would be given when an OpenGraph image URL didn't have a correct path. Props to [@Julian-B90](https://github.com/Julian-B90)
* Fixes a bug where the home description can contain HTML, resulting in unexpected characters on the Facebook social settings page.
* Fixes a bug where author sitemap caches would be attempted to be invalidated despite not all conditions being met.
* Fixes a bug where a fatal error on Yoast settings pages was thrown because they did not have a dedicated option class.

Enhancements:

* Introduces two new principles for keyword recognition:
  * Makes keyphrase recognition flexible with regards to word order. This means that the keyphrase `SEO WordPress plugin` will be found in the sentence `This is the most popular SEO plugin for WordPress.` In order to use exact matches, the keyphrase can be enclosed in quotation marks.
  * When matching keyphrases for the various assessments, the analysis only targets content words and ignores function words (e.g., `the` or `and`). This functionality is available in English, German, Dutch, French, Spanish, Italian, Portuguese, Russian and Polish.
* The analysis of the following assessments incorporates the new keyword recognition principles:
  * Image alt attributes: checks whether there’s at least one image with an alt tag that contains words from the keyphrase. An exact match isn’t required anymore.
  * Keyphrase in introduction: checks whether words from the keyphrase are matched within one sentence in the introduction or, if not, whether they are present in the first paragraph at all. An exact match isn’t required anymore.
  * Keyphrase in title: still checks whether an exact match of the keyphrase is found in (the beginning of) the title, but now also recommends improvement if all words from the keyphrase are found in the title.
  * Keyphrase length: has new boundaries to check whether the keyphrase is not too long. For languages that have support for function word stripping (see above), only content words are taken into account.
  * Keyphrase in meta description: checks how often all words from the keyphrase are matched within the meta description.
  * Keyphrase in subheading: now checks whether at least one subheading contains more than half of the words from the keyphrase. An exact match isn’t required anymore.
  * Keyphrase in slug: checks whether a sufficient number of words from the keyphrase is used in the slug. The number of words required depends on the length of the keyphrase.
  * Keyphrase density: checks whether there are enough keyphrase matches; a match is defined as a sentence that contains all words from the keyphrase.
  * Link focus keyphrase: the assessment that checks whether you’re using your keyphrase to link to a different article doesn't require an exact match anymore.
* Improves the feedback texts for all SEO and readability assessments.
* Improves the consistency of the SEO and readability results by showing them in a fixed order.
* Adds target="_blank" to the "How to connect to GSC" link to open the link a new tab. Props to [@zkan](https://github.com/zkan)
* Changes all mentions of 'keyword' to 'keyphrase'. Read more about [the transition from 'keyword' to 'keyphrase'](https://yoa.st/keyword-to-keyphrase).
* Optimizes and caches WPSEO_Option_Titles::enrich_defaults(). Props to [@soulseekah](https://github.com/soulseekah)
* Introduces a Features tab in the network admin, which allows disabling all site-specific features for the entire network.
* Improves the tab order within the structured data blocks in Gutenberg and make it consistent between the FAQ and How-To block.
* Improves sitemap performance by disabling the caching by default.
* Adds `target="_blank"` to the "How to connect to GSC" link to open a new tab when clicked.
* Adds an assessment that checks whether your keyword consists only of function words.
* Changes OpenGraph image handling to always use an image from the media library. This makes the performance of the OpenGraph image handling much better.
* Improves performance by no longer using images from the content as a fallback for the OpenGraph and Twitter images.

Other:

* Deprecates the WPSEO_Cornerstone class.
* Deprecates the assessment that checks if stopwords are used within the keyphrase.

= 8.4.0 =
Release Date: October 9th, 2018

Bugfixes:

* Fixes a bug where the cornerstone content toggle was available for attachment pages.
* Fixes a bug where the Search Console page displayed 'first detected' and 'last crawled' dates that were in the future.

Enhancements:

* Introduces the `wpseo_taxonomy_content_fields` filter to add additional fields to the taxonomy metabox.
* Adds a margin below select fields so there's space between taxonomy settings for breadcrumbs. Props to [@emilyatmobtown](https://github.com/emilyatmobtown)

= 8.3.0 =
Release Date: September 25th, 2018

Bugfixes:

* Fixes a bug where an incorrect time would be outputted in the `article:published_time` and `article:modified_time` meta properties when a timezone with numerical UTC offset was used (e.g. UTC+10).
* Fixes a bug where the `article:published_time` and `article:modified_time` meta properties would be localized. Props to [AminulBD](https://github.com/AminulBD).
* Fixes a bug where the structured data rendered by the Gutenberg How-To and FAQ blocks was rendered on pages with multiple posts.
* Fixes a bug where snippet variables would not be replaced in the `og:description` of taxonomies when they were added in the Facebook Description input field.
* Fixes a bug where `babel-polyfill` would throw an error that there shouldn't be two instances of babel-polyfill.
* Fixes a bug where the `bold` button was available in the How-to block's step title and the FAQ block's Question field while they were already bold by default.
* Fixes a bug that caused keywords beginning with the Turkish characters `İ` / `i` and `I` / `ı` not to be recognized when changing that character from lowercase to uppercase and vice versa.

Enhancements:

* Adds a colon to the list of possible title separators.
* Adds a setting and filter (`wpseo_duration_text`) to the how-to block that allows users to edit the text describing the time needed.
* Adds a help text to the readability analysis.

Other:

* Adds a notice to the Yoast SEO dashboard that is shown when both Yoast SEO and All in One SEO Pack plugins are active.
* Makes the duplicate content link on the archive settings open in a new tab. Props to [nikhilbarar](https://github.com/nikhilbarar).
* Changes the notification message that is shown when a new SEO-related issue has been found.
* Uses the correct type as the second argument of the `wpseo_sitemap_exclude_empty_terms` filter call when determining which taxonomies should have a sitemap. Props to [liarco](https://github.com/liarco).
* Removes the executable bits on SVN assets. Props to [mathieu-aubin](https://github.com/mathieu-aubin).
* Introduces an API function to get all Yoast SEO-related capabilities. Props to [JoryHogeveen](https://github.com/JoryHogeveen).
* Changes the `@context` property from `http://schema.org` to `https://schema.org` in the FAQ and How-To block's structured data output.
* Rename the `associatedMedia` property in the FAQ and How-To block's structured data output to `image`, to reflect a change in Google's guidelines.
* Moves the `@type` and `name` properties to the root of the FAQ block's structured data output.
* Nests the `Question` objects in the newly introduced `mainEntity` property in the FAQ block's structured data output.
* Removes the superfluous `position` property from the How-To block's structured data output.

= 8.2.1 =
Release Date: September 20th, 2018

Bugfixes:

* Fixes a bug where the Chrome or Opera browser tab would crash on Windows when a Polish text contains sentences in passive voice.

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

= Earlier versions =

For the changelog of earlier versions, please refer to https://yoa.st/yoast-seo-changelog
