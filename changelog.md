Yoast SEO
=========
Requires at least: 6.8
Tested up to: 7.0
Requires PHP: 7.4

Changelog
=========

## 27.5

Release date: 2026-04-28

#### Enhancements

* Adds a Yoast ability for retrieving scores for Yoast analyses for recent posts, using the Abilities API.
* Adds Qatar to the list of available countries for the Semrush related keyphrase suggestions.

#### Bugfixes

* Fixes a bug where the AI Generator's "Generate with AI" feature failed after a site's domain was changed, because stale callback URLs remained registered with the Yoast API from the original domain.

#### Other

* Removes the schemamap line from the `robots.txt` file.
* Introduces a performance increase when calculating if the SEO optimization is completed for internal links. Props to [@adconecto](https://github.com/adconecto).

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


### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/yoast-seo-changelog).
