# Change Log

All notable changes to this project will be documented in this file. Releases without a changelog entry contain only minor changes that are irrelevant for users of this library.
We follow [Semantic Versioning](http://semver.org/).

## 0.2.0
Enhancements:
* Adds the Task List components and redux slice. [#22759](https://github.com/Yoast/wordpress-seo/pull/22717)

Other:
* Adds the accessibility add-on to Storybook. [#22725](https://github.com/Yoast/wordpress-seo/pull/22725)

Non user facing:
* Bumps `@yoast/ui-library` to version `4.4.0` from `4.3.0`. [#22862](https://github.com/Yoast/wordpress-seo/pull/22862)
* Adds the TaskRow component.  [#22717](https://github.com/Yoast/wordpress-seo/pull/22717)
* Adds the task modal component. [#22712](https://github.com/Yoast/wordpress-seo/pull/22712)
* Updated style for task row states. [#22747](https://github.com/Yoast/wordpress-seo/pull/22747)
* Adds complete status component inside `TaskModal`. [#22744](https://github.com/Yoast/wordpress-seo/pull/22744)
* Adds a loading state for the button of "default" and "delete" task type. [#22744](https://github.com/Yoast/wordpress-seo/pull/22744)
* Adds selectors and actions to the task list redux slice. [#22726](https://github.com/Yoast/wordpress-seo/pull/22726)
* Exports the TaskRow component. [#22726](https://github.com/Yoast/wordpress-seo/pull/22726)
* Support optional `how` text for the Task modal. [#22726](https://github.com/Yoast/wordpress-seo/pull/22726)
* Adds children prop to the task row and selectors to the task list redux slice. [#22735](https://github.com/Yoast/wordpress-seo/pull/22735)
* Adds JS docs to the initial state of the task list redux slice. [#22735](https://github.com/Yoast/wordpress-seo/pull/22735)
* Fixes the RTL direction of the task row chevron. [#22735](https://github.com/Yoast/wordpress-seo/pull/22735)
* Adds the Redux Toolkit slice for tasks list. [#22703](https://github.com/Yoast/wordpress-seo/pull/22703)
* Adds the tasks progress bar component. [#22720](https://github.com/Yoast/wordpress-seo/pull/22720)
* Adds screen reader text to the progress bar. [#22751](https://github.com/Yoast/wordpress-seo/pull/22751)
* Adds selector and action to the task list redux slice for the completed state of a task.  [#22765](https://github.com/Yoast/wordpress-seo/pull/22765)
* Adds support for error handling for the task modal. [#22754](https://github.com/Yoast/wordpress-seo/pull/22754)
* Adds the GetTasksErrorRow components to support error handling for the tasks table. [#22754](https://github.com/Yoast/wordpress-seo/pull/22754)
* Fixes an unreleased bug where the Task loading row will adds extra column. [#22754](https://github.com/Yoast/wordpress-seo/pull/22754)
* Fixes responsivness for the task row. [#22762](https://github.com/Yoast/wordpress-seo/pull/22762)

## 0.1.1
Other:
* Upgrades WP packages to minimum supported WP version 6.7. [#22466](https://github.com/Yoast/wordpress-seo/pull/22466)

Non user facing:
* Bumps `@yoast/eslint-config` to version `8.1.0` from `8.0.0`. [#22256](https://github.com/Yoast/wordpress-seo/pull/22256)

## 0.1.0
Enhancements:
* Adds override `fetchJson` option to the Remote Data Provider. [#22178](https://github.com/Yoast/wordpress-seo/pull/22178)
* Sets up Storybook with stories for the Organic Sessions widget. [#22178](https://github.com/Yoast/wordpress-seo/pull/22178)
* Exposes internal `fetchJson` and `useFetch` tools for creating your own widgets. [#22178](https://github.com/Yoast/wordpress-seo/pull/22178)
* Adds widgets and services as building blocks to create a dashboard page. [#22152](https://github.com/Yoast/wordpress-seo/pull/22152)

Bugfixes:
* Fixes a bug where the screen reader only table in the Organic Sessions widget was influencing the width on the page. [#22234](https://github.com/Yoast/wordpress-seo/pull/22234)
