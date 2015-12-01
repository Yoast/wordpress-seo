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
* Added support to redirect URL's with special characters.
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
