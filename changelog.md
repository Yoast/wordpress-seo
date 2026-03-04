Yoast SEO
=========
Requires at least: 6.8
Tested up to: 6.9
Requires PHP: 7.4

Changelog
=========

## 27.1.1

Release date: 2026-03-03

#### Bugfixes

* Fixes a bug where Schema aggregator endpoints were returning a fatal error when trying to access response pages other than the first one by using slash syntax.

## 27.1

Release date: 2026-03-03

New: Introducing the Schema Aggregation feature. Futureproof your website for an agentic future. [Read the full release post here](https://yoa.st/55i).

#### Enhancements

* Introduces the Schema aggregation feature. Thanks to Syde for helping us with testing it!
* Introduces a more robust HTML processing and highlighting approach for the *transition words* assessment.

#### Bugfixes

* Fixes a bug where sentences containing transition words failed to be highlighted in _transition words_ assessment when they contained elements excluded from the analysis such as `<code>`.
* Fixes a bug where Slovak two-part transition words weren't recognized when running the readability analysis.

## 27.0

Release date: 2026-02-17

Yoast SEO 27.0 brings more enhancements and bugfixes. [Find more information about our software releases and updates here](https://yoa.st/releases).

#### Enhancements

* Adds `html-react-parser` dependency for improved HTML string handling in React components.
* Adds `images` array to FAQ and How-to blocks attributes for explicit image handling.
* Migrates FAQ block's question/answer fields from array-based formats to HTML strings for better compatibility with WordPress components.
* Migrates How-to block's step name/text fields from array-based formats to HTML strings for better compatibility with WordPress components.
* Updates the design for the search appearance mode switcher.

#### Bugfixes

* Fixes a bug where inline link icon was missing when editing a sync pattern in the block editor with WordPress 6.9.
* Fixes a bug where the AI Optimize buttons remained active even when another button had been pressed.
* Fixes a bug where the _subheading distribution assessment_ threw an error when there was some text with no subheadings plus a block containing a subheading (like the Yoast Table of contents block).

#### Other

* Changes the AI Generator `Generate 5 more` button design and preview background.
* Modernizes how translations of the plugin work by removing the unneeded `load_plugin_textdomain()` calls.
* Restores the suggestions title and `Generate 5 more` button when the suggestions are loading.
* Updates the name of the Yoast SEO AI+ card on the plans page.

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/yoast-seo-changelog).
