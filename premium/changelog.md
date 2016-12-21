### 4.0.2: December 20th, 2016
* Adds site wide calculation of prominent words for pages.
* Fixes a notice that would be thrown on custom post types: "Undefined property: WP_Post_Type::$rest_base".
* Fixes a bug where the site language would be used for the social previews and select2.
* Fixes a bug where the link suggestions wouldn't work when the insights block was disabled.
* Includes every change in Yoast SEO core 4.0.2, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 4.0.1 December 14th, 2016
* Fixes a JavaScript error when editing pages in the admin, this fixes conflicts with page builders.
* Fixes an uncaught (in promise) error when using the prominent words in combinations with Fusion builder or Divi themes.
* Adds link suggestions meta box to pages.
* Fixes a bug where prominent words would be saved too often when editing a post.

### 4.0.0 December 13th, 2016
* Adds a metabox "Yoast internal linking" that contains link suggestions for the current post.
* Adds import functionality for Safe Redirect Manager.
* Adds import support for Simple 301 Redirects.
* Fixes import messaging when importing redirects.
* .htaccess import no longer overwrites the real htaccess file.
* .htaccess import properly imports all redirects.
* .htaccess import properly imports redirects with quotes.
* Fixes a bug where post format archives showed up in sitemap when disabled.
* Fixes a bug where an old update notice would not be removed.
* Fixes a bug where keywords with periods where not highlighted in the snippet.
* Includes every change in Yoast SEO core 4.0.0, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.9.0 November 29th, 2016
* Improves the title updates in the social previews.
* Fixes a bug where the wrong URLs were used in redirect notices.
* Includes every change in Yoast SEO core 3.9.0, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.8.0 November 8th, 2016
* Fixes a bug where keyword tabs didn't have a correct screen reader text.
* Fixes a bug where certain translations weren't translatable, props [Pedro Mendonça](https://github.com/pedro-mendonca)
* Removes React debugging tools from eventual build JavaScript files.
* Includes every change in Yoast SEO core 3.8.0, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.7.2 October 20th, 2016
* Includes every change in Yoast SEO core 3.7.1, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.7.1 October 11th, 2016
* Adds a message when no prominent words were detected in the text.

### 3.7.0: October 11th, 2016
* Adds an insights section to the Yoast SEO metabox that shows authors the most prominent words in their text.
* Adds a validation to check if the origin url in a redirect contains the subdirectory in case WordPress is installed in a subdirectory.
* Improved accessibility of the redirects manager.
* Fixes a bug where some form fields in the import and export tools were missing labels.
* Makes the redirects new rows action links translatable.
* Fixes a PHP Warning when hitting 301 redirect on subdomain multisites.
* Fixes a bug where the Twitter preview would no longer work when Facebook is disabled in Social.
* Includes every change in Yoast SEO core 3.7.0, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.6.1: October 3rd, 2016
* Includes every change in Yoast SEO core 3.6.1, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/). 

### 3.6: September 27th, 2016
* Includes every change in Yoast SEO core 3.6.0, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/). 

### 3.5.2: September 8th, 2016
* Fixes a JavaScript error that was thrown from redirect notifications when attempting to edit the redirect destination. These notifications are thrown whenever a slug is edited or when a post or term is deleted.

### 3.5.1: September 7th, 2016
* Fixes a fatal error when network activating.

### 3.5.0: September 7th, 2016
* Includes every change in Yoast SEO core 3.5.0, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).
* Fixes the slug change and redirects in the quick edit for posts and terms.
* Fixes title on the redirect settings page.

### 3.4.2: August 8th, 2016
* Includes every change in Yoast SEO core 3.4.2, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.4.1: August 2nd, 2016
* Security hotfix: Includes every change in Yoast SEO core 3.4.1, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.4.0: July 19th, 2016
* Includes every change in Yoast SEO core 3.4.0, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).
* Visually improves the redirect dialog by using an overlay.
* Fixes a bug where a trailing slash was added when redirecting to a file.
* Fixes a fatal JavaScript error for the featured image on attachment edit pages.

### 3.3.3: June 30th, 2016
* Includes every change in Yoast SEO core 3.3.3 and 3.3.4, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.3.2: June 21st, 2016
* Includes every change in Yoast SEO core 3.3.2, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.3.1: June 15th, 2016
* Fixes a bug with redirects on a subsite in a multisite installation, props [nicholas-eden](https://github.com/nicholas-eden).
* Fixes a bug where the tabs inside the metabox weren't aligned properly.
* Includes every change in Yoast SEO core 3.3.1, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.3.0: June 14th, 2016
* Add author name support to the social previews.
* Add a tab inside the help center to contact support, this replaces the question mark at the bottom right of the page.
* Fixes a bug where the redirects couldn't be saved to the .htaccess in certain scenarios.
* Fixes a bug where subdomains would be stripped from target URLs in the redirects.
* Fixes a bug where the Redirection import wasn't present.
* Includes every change in Yoast SEO core 3.3.0, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/). 

### 3.2.5: May 6th, 2016
* Fixes "undefined index" notices when Facebook and/or Twitter have been disabled in settings.
* Fixes a bug when writing 4xx redirects into the .htaccess file on Apache.
* Includes every change in Yoast SEO core 3.2.5, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.2.2: April 21th, 2016
* Fixes a bug where notification for a deleted post wasn't shown.
* Includes every change in Yoast SEO core 3.2.3, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.2.0: April 20th, 2016
* Introduces social previews, you can now see what your posts will look like when they are shared on Facebook and Twitter.
  * The previews will automatically show you when your image is too small.
  * You can use all replace variables you are used to in the Facebook and Twitter previews.
* Removes the tutorial video page, the videos are now available on every tab.
* Fixes a bug where Yoast SEO Premium would fatal when activating while Yoast SEO was active.
* Fixes a bug where the home URL wasn't correctly stripped from the redirect old URL.
* Fixes a bug where clicking the 'Update now' button on the plugin page didn't update correctly.
* Includes every change in Yoast SEO core 3.2.0, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.1.3: March 23rd, 2016
* Fixes a few bugs related to term slugs that were altered by our plugin after they were saved. This especially caused issues for terms with parents. We will simply not touch term slugs anymore until the way terms are saved is fixed in WordPress, see also https://core.trac.wordpress.org/ticket/22293.
* Fixes a bug where we would create redirects if nav menu items were edited.
* Fixes a bug where redirects to urls with url parameters got appended with a slash.
* Fixes a bug where adding a parent to a page would cause the slug of that page to detected by us as non-unique and incremented with a number.
* Fixes a bug where the AJAX request for creating redirects in the search console integration was broken for search console issues for which a 4xx redirect already exists.
* Merge with Yoast SEO core 3.1.2, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.1.2: March 8th, 2016
* Fixes a bug where PHP redirects were still broken on servers that disable accessing the server input by making use of the filter extension.
* Merge with Yoast SEO core 3.1.1, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.1.1: March 2nd, 2016
* Fixes a bug where PHP redirects were broken.
* Fixes a bug where users could (temporarily) lose their redirects if our upgrade routine would for some reason not be triggered while updating to versions greater than 3.0.7
* Fixes a bug where slashes were shown in the redirect manager for a redirect without a target url (ie. 410)
* Fixes a Fatal error that occurred when switching from Free to Premium.

### 3.1: March 1st, 2016
* Made PHP redirects faster and more efficient.
* Added an interface to easily serve 410 (content deleted) headers for posts you have just deleted.
* Added support for creating 451 (legal takedown) headers in the redirect manager.
* Improved existing validations, ensuring redirects are complete and unique.
* Added a validation error that checks for a redirect loop.
* Added validation warnings for the following cases:
  * when a redirect points to an url that is redirected.
  * when a redirect point to a url that cannot be resolved.
  * when a redirect points to a url that doesn't return a 200 OK status code.
* Changed the interface for inline editing of redirects to resemble the redirect form used to add redirects.
* Fixes a possible fatal error on update.
* Replaced checkboxes and radio buttons with toggles on the Premium settings pages.
* Makes sure post / term slugs uniqueness checks also take into account redirects.
* Makes sure redirected are redirected both with and without trailing slash.
* Takes the WP permalink structure into account in deciding if we should redirect to a slug with or without trailing slash.
* Makes sure links to our knowledge base open in a new window.
* Added a few knowledge base suggestions to our support beacon on the redirects page.
* Merge with Yoast SEO core 3.1, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.0.7: December 23rd, 2015
* Merge with Yoast SEO core 3.0.7, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.0.6: December 1st, 2015
* Merge with Yoast SEO core 3.0.6, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.0.5: December 1st, 2015
* Fixed performance issues in custom fields integration.
* Merge with Yoast SEO core 3.0.5, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.0.4: November 25th, 2015
* Merge with Yoast SEO core 3.0.4, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.0.3: November 19th, 2015
* Merge with Yoast SEO core 3.0.3, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.0.2: November 19th, 2015
* Merge with Yoast SEO core 3.0.2, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.0.1: November 18th, 2015
* Merge with Yoast SEO core 3.0.1, see the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 3.0: November 18th, 2015
* Merge with Yoast SEO core 3.0, including the realtime content analysis tool and social settings for taxonomies. See the [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).
* Added possibility to analyze multiple keywords per post/page.
* Added support beacon to all the Yoast SEO settings pages, allowing users to ask for support straight from their WordPress backend.

### 2.3.5: September 16th, 2015
* Merge with Yoast SEO core 2.3.5

### 2.3.4: August 6th, 2015
* Merge with Yoast SEO core 2.3.4

### 2.3.3: August 6th, 2015
* Added a filter `wpseo_hide_version` that allows webmasters to hide the Yoast SEO Premium version number in the debug marker.
* Merge with Yoast SEO core 2.3.3

### 2.3.2: July 23rd, 2015
* Merge with Yoast SEO core 2.3.2

### 2.3.1: July 22nd, 2015
* Fixes a bug where the .htaccess redirect import was no longer available.
* Fixes a bug where upgrading to version 2.3 would occasionally cause WSOD's on both admin and frontend. We were unable to pinpoint the exact conflicting plugins and themes, but we are quite confident it was caused by us using, and others hooking into, WP_Query too early.
* Merge with Yoast SEO core 2.3.1

### 2.3: July 21st, 2015
* Renamed plugin to "Yoast SEO Premium"
* Fixes compatibility issue with Post type order plugin.
* Merge with Yoast SEO core 2.3

### 2.2.2: June 17th, 2015
* Fixed a bug that would create unnecessary (and sometimes even faulty) redirects.
* Added a Japanese translation and updated several other languages.

### 2.2.1: June 11th, 2015
* Merge with Yoast SEO core 2.2.1

### 2.2: June 10th, 2015
* Adds a X-Redirect-By header to redirects that were created using Yoast SEO Premium. Works for all PHP redirects and regular NGINX redirects. Doesn't work for Apache.
* Makes sure all AJAX notices become dismissible.
* Makes sure the redirect notice also shows the old and new url.
* Fixes a bug where the link in the redirect notice was not clickable in some cases.
* Fixes a bug where we offered the user the possibility to undo creating a redirect that was never created in the first place.
* Fixes a bug where clicking a link to our knowledge base about redirect types triggered a notice instead of taking the user to the right page.
* Fixes a bug where in some cases no tab was selected after reloading the crawl issues in the GWT settings.
* Fixes a bug where automatic redirects where being created for unpublished posts.
* Fixes a bug where automatic redirects where not being created on slug change when using quick edit for both posts and terms.
* Fixes a bug where where automatic redirects where not being created on slug change for custom taxonomies.
* Fixes a bug where a slug change could falsely be detected and redirected in case of a term update in the context of a post update
* Merge with Yoast SEO core 2.2

### 2.1.1: April 21st, 2015
* Merge with Yoast SEO core 2.1.1

### 2.1: April 20th, 2015
* Merge with Yoast SEO core 2.1

### 2.0.1: April 1st, 2015
* Merge with Yoast SEO core 2.0.1

### 2.0: March 11th, 2015
* Merge with Yoast SEO core 2.0
* Made the version number for the Premium plugin the same as for the Free plugin to avoid confusion.
* Contains several performance improvements, making the plugin much faster.

### 1.5.3: March 11th, 2015
* Security hotfix: Merge with Yoast SEO core 1.7.4, see [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 1.5.2.2: February 23rd, 2015
* Merge with Yoast SEO core 1.7.3.2

### 1.5.2.1: February 19th, 2015
* Merge with Yoast SEO core 1.7.3.1

### 1.5.2: February 17th, 2015
* Added the possibility to add 410 status to redirects.
* Added a few validations to prevent circular redirects.
* Reuses translations from the free version of this plugin, thereby dramatically reducing the amount of strings that need to be translated for the premium plugin.
* Merge with Yoast SEO core 1.7.3

### 1.5.1: November 26th, 2014
* Security hotfix: Merge with Yoast SEO core 1.7.1, see [core changelog](https://wordpress.org/plugins/wordpress-seo/changelog/).

### 1.5: November 18th, 2014
* Merge with Yoast SEO core 1.7
* Fixes a bug where authentication with Google Webmaster Tools would fail silently.
* Fixes a bug where redirects weren't written to htaccess.
* Added filters for hiding redirects notifications.

### 1.4.3: October 8th, 2014
* Merge with Yoast SEO core 1.6.3

### 1.4.2: October 8th, 2014
* Merge with Yoast SEO core 1.6.2
* Implement new filter for issue types on the Google Webmaster Tools issues screen

### 1.4.1: September 16th, 2014
* Merge with Yoast SEO core 1.6.1

### 1.4: September 9th, 2014
* Merge with Yoast SEO core 1.6

### 1.3.5: August 26th, 2014
* Merge with Yoast SEO core 1.5.6, updated for WP 4.0

### 1.3.4: August 15th, 2014
* Fix incomplete merge with Yoast SEO core to 1.5.5.3

### 1.3.3: August 14th, 2014
* Updated Yoast SEO core to 1.5.5.3

### 1.3.2: August 14th, 2014
* Fixed bug in core Yoast SEO that made SEO icon value wrong.
* Updated Yoast SEO core to 1.5.5.2

### 1.3.1: August 14th, 2014
* Fix versioning issue

### 1.3: August 14th, 2014
* The bulk title and bulk description editor pages are merge into one page
* Possibility for creating a redirect when a post/page is trashed.
* Possibility for deleting a redirect when a post/page is restored.
* Added feature for defining custom fields for page analysis
* Values for redirects will be trimmed, preventing invalid redirects
* Fixed pagination on the redirect page
* Fixed screen options on the redirect page

### 1.2.2: July 4th, 2014
* Added link to Yoast Knowledge Base to regex redirects.
* Fixed bug when creating redirects from Webmaster Tools.

### 1.2.1: June 6th, 2014
* Fixed a REGEX redirect type bug that prevented REGEX redirects from working.
* Fixed a bug involving the & sign in redirects.

### 1.2.0: June 3rd, 2014
* The redirect type (HTTP code) can now set per redirect.
* Redirects can now be imported from the .htaccess file.
* Redirects can now be written to the .htaccess file.
* A redirect is automatically added when a post slug change.
* The possibility to add a redirect is offered when a post is deleted.
* A redirect is automatically added when a category/term slug change.
* The possibility to add a redirect is offered when a category/term is deleted.
* Added support to redirect URLs with special characters.
* Response code of redirects is now checked while adding redirects to avoid incorrect redirects.
* Created a Yoast overlay for a more user friendly way of displaying errors.
* Implemented autoloader to enhance plugin performance.
* Updated Yoast SEO core to 1.5.3.3.

### 1.1.3: May 22nd, 2014
* Updated Yoast SEO core to 1.5.3.2

### 1.1.2: April 25th, 2014
* Fixed notices when fetching remote crawl issues and there are now crawl issues from remote.
* Updated Yoast SEO core to 1.5.2.8

### 1.1.1: April 15th, 2014
* Updated Yoast SEO core to 1.5.2.7

### 1.1.0: April 4st, 2014
* Updated Yoast SEO core to 1.5.x
* Google Webmaster Tools crawl issues are now cached decreasing load time of issues dramatically.
* Google Webmaster Tools profile can now manually be selected.
* Added 'not redirected' filter to crawl issues table.
* Added option to ignore crawl issues.
* Added import option from Redirection plugin.
* Added a redirect link to WordPress toolbar on 404 pages.
* Added support for REGEX redirects.

### 1.0.8: March 21st, 2014
* Updated Yoast SEO core to 1.5.2.5

### 1.0.7: March 14st, 2014
* Updated Yoast SEO core to 1.5.2.2

### 1.0.6: March 12st, 2014
* Updated Yoast SEO core to 1.5.2.1

### 1.0.5: March 11st, 2014
* Updated Yoast SEO core to 1.5.2

### 1.0.4: March 11st, 2014
* Updated Yoast SEO core to 1.5.0

### 1.0.3: Feb 26st, 2014
* Fixed an incorrect constant define.
* Updated Yoast SEO core to 1.4.25.
* Now using the correct file reference (WPSEO_FILE) in main WPSEO file.

### 1.0.2: Feb 18st, 2014
* Fixed a bug that prevented options on the WPSEO dashboard from saving.
* Updated Yoast SEO core to 1.4.24.

### 1.0.1: Jan 31st, 2014
* Remove dependency on PHP 5.3 function DateTime::getTimestamp() so plugin works on PHP 5.2 installs too.

### 1.0: Jan 23rd, 2014
* Initial release.
