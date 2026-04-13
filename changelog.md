Yoast SEO
=========
Requires at least: 6.8
Tested up to: 7.0
Requires PHP: 7.4

Changelog
=========

## 27.4

Release date: 2026-04-14

Yoast SEO 27.4 adds new tasks to the Task List, improves navigation within the editor, and fixes a bug where tasks were displaying in the wrong language. [Read the full release post here.](https://yoa.st/task-list)  

#### Enhancements

* Enhances the task list with a task about customizing meta descriptions in recent content.
* Enhances the task list with a task about deleting the "Sample Page".
* Improves the UX of completing tasks that require users to go to specific part of the post editor, by redirecting them to the exact spot they need to be.
* Adds a "Yoast" tab to the WordPress Plugins screen that groups all installed Yoast plugins when two or more are present. Requires WordPress 7.0+.

#### Bugfixes

* Fixes a bug where the task list copies were displayed in the site language instead of the user language.
* Fixes a bug where alt text changes made via the inline image editor in How-to and FAQ blocks were not being reflected on the frontend. Props to [@param-chandarana](https://github.com/param-chandarana).

## 27.3

Release date: 2026-03-31

Yoast SEO 27.3 brings more enhancements and bugfixes. [Find more information about our software releases and updates here](https://yoa.st/releases).

#### Enhancements

* Introduces a more robust HTML processing approach for the _keyphrase in subheadings_ assessment.
* Adds the highlighting feature to _keyphrase in subheadings_ assessment. Now users can highlight the headings that include the keyphrase or synonyms.

#### Bugfixes

* Fixes a bug where the installation success redirect was incorrectly fire during AJAX, cron, REST API, or JSON requests, breaking integrations such as the Bluehost SSO.
* Fixes a bug where `Deprecated: strip_tags(): Passing null to parameter #1 ($string) of type string is deprecated` notices appeared on certain actions, like when activating the plugin, or saving a Yoast setting. Props to @sabernhardt.
* Fixes a console error in the editor related to AI Generate feature that occurred when the “Enable SEO controls and assessments” option was disabled for a content type.

#### Other

* Sets the _WordPress tested up to_ version to 7.0.
* Updates the completion message and changes the call-to-action button text of the First-time configuration.
* Improves security of format_json_encode() by removing JSON_UNESCAPED_SLASHES, which could allow a user to control tags in the schema JSON-LD output. Props to @rob006.

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/yoast-seo-changelog).
