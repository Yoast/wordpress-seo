# Change Log

This changelog is according to [Keep a Changelog](http://keepachangelog.com).

All notable changes to this project will be documented in this file.
We will follow [Semantic Versioning](http://semver.org/) from version 2 and onwards.

## 1.3.1: June 14th, 2016

### Fixed
* Fix a bug where no content would result in a green overall content score.

## 1.3.0: June 14th, 2016

### Added

* Assessments that assess the following properties:
    * The length of subheadings.
    * The length of text following a subheading.
    * The length of paragraphs.
    * The length of sentences.
    * The presence of transition words.
    * The presence of the passive voice.
* Markers for certain assessments that can show the location of the feedback inside the text:
	* The length of paragraphs.
	* The length of sentences.
	* The presence of passive voice.
	* The presence of transition words.
	* The presence of links with the focus keyword as link text.
* Transliteration for the following languages:
    * Spanish, Polish, German, Nynorsk, Bokmål, Swedish, Finnish,
    * Danish, Turkish, Latvian, Icelandic, Faroese, Czech, Russian,
    * Esperanto, Afrikaans, Catalan, Asturian, Aragonese, Aymara,
    * English, French, Italian, Dutch, Bambara.
* Improved accessibility in the snippet preview.

* Added a marker argument to the `App` that can be used to inject a marker function.
* Added a marker argument to the `Assessor` that can be used to inject a marker function.
* Added a button after all assessment results that can be marked in the text.

### Changed

* Created a contentAssessor that contains all content assessments. Some
assessments have been moved from the SEO sssessor to the content
assessor.
* Gracefully fail on assessment failure. An assessment that has a fatal
 error now will be shown as a gray bullet and add a trace to the console.
* Improve the way we detect sentences in the text.
* Improve performance of the flesch reading ease.
* Make sure the refresh of the app is always properly debounced.
* Add identifier to all assessments and assessment results to be able to reference them later.
* Hide progress bars from screen readers.

### Fixed
* Fix a bug where a modification on the title wasn't correctly taken into account.
* Fix a bug where alt tags were requires in all images instead of in only one of the images.
* Fix a bug where having subheadings without the focus keyword was worse than having no subheadings at all.
* Fix a bug where requiring paper in index.js would fail on case-sensitive systems, props [Chris Bosco](https://github.com/cbosco).

## 1.2.2: May 4th, 2016

### Bug

* Fixes a bug where the alt-attribute assessment required all images to have an alt-attribute with the keyword.

## 1.2.1: April 21th, 2016

### Bugfixes

* Fixes a bug where one wrong translation could crash all the JavaScript.

## 1.2: April 20th, 2016

### Backwards incompatible changes

* Stopped loading sassdash, when importing the scss files you need to include sassdash yourself.
* Removed all analyses in favor of researches.
* Implement the used keywords assessment as a bundled plugin, this means that an implementation should call the plugin itself.
* Removes `js/config/scoring.js`
* Removes `js/analyzer.js`
* Removes `js/analyzescorer.js`
* Removes `browser.js` as we expect implementations to browserify themselves.
* Removes `app.registerTest` in favor of `app.registerAssessment`.
* Removes `js/scoreFormatter.js`

### Features

* Introduces several value objects to more easily work with content and results:
	* `Paper` to represent the text that is about to be assessed.
	* `AssessmentResult` to represent the result of a single assessment.
* Implements all value judgements about content as assessments, we introduced the following assessments:
	* FleschReadingEaseAssessment
	* IntroductionKeywordAssessment
	* KeyphraseLengthAssessment
	* KeywordDensityAssessment
	* KeywordStopWordsAssessment
	* MetaDescriptionKeywordAssessment
	* MetaDescriptionLengthAssessment
	* SubheadingsKeywordAssessment
	* TaxonomyTextLengthAssessment
	* TextCompetingLinksAssessment
	* TextImagesAssessment
	* TextLengthAssessment
	* TextLinksAssessment
	* TextSubheadingsAssessment
	* TitleKeywordAssessment
	* TitleLengthAssessment
	* UrlKeywordAssessment
	* UrlLengthAssessment
	* UrlStopWordsAssessment
* Implements all statistics about a text as researches, we introduced the following researches. All researches expect a `Paper`.
	* calculateFleschReading
	* countLinks
	* findKeywordInFirstParagraph
	* findKeywordInPageTitle
	* getKeywordDensity
	* getLinks
	* getLinkStatistics
	* imageAltTags
	* imageCountInText
	* keyphraseLength
	* keywordCountInUrl
	* matchKeywordInSubheadings
	* matchSubHeadings
	* metaDescriptionKeyword
	* metaDescriptionLength
	* pageTitleLength
	* stopWordsInKeyword
	* stopWordsInText
	* stopWordsInUrl
	* urlIsTooLong
	* wordCountInText
* Introduces an `Assessor` that contains a number of assessments and is able to determine a total assessment.
* Introduces an `SEOAssessor` that has all the assessments that are currently available.
* Introduces an `AssessorPresenter` to output the results of an `Assessor` to the DOM.
* Introduces a template to more easily render the assessment results.
* Introduces an `Researches` that contains a number of researches and is you can retrieve a specific research from.
* Rewrites the `App` to make use of the assessor setup.
* Introduces `scoreToRating` to transform a score to a rating.
* Introduces `InvalidTypeError` for passing invalid types to constructors or methods
* Introduces `config/presenter.js` to transform a rating into a className or screenreader text.
* Exports certain prototypes and functions in an `index.js`.

### Enhancements

* Improves the contrast between the background and the red circle by choosing a different color red.
* Add a clearfix mixin.
* Switches to ESLint in favor of JSHint, JSONLint, JSValidate and JSCS.
* Switches to a custom grunt script to build the lodash templates, `grunt-lodash` is deprecated.
* Adds an argument to `stringToRegex` to specify whether to replace diacritics before building the regex.
* Massively improves test coverage.
* Updates `lodash` from version 3 to version 4.
* Pluralizes certain translations, this makes it possible to correctly translate these strings.
* Adds a sass function for a caret point to the left.

### Bugfixes

* Removes several `for..in` calls that errored when build in prototypes had added methods or properties.
* Fixes a bug where accented characters were not correctly matched in subheadings and the snippet editor.

## 1.1: March 1st, 2016

### Backwards incompatible changes

* Passing the title, url and meta description meant for the snippet editor is no longer taken into account. The snippet
editor keeps track of these values itself.
* `callbacks.updateSnippetValues` has been deprecated in favor of `callback.saveSnippetData`. Currently a raw event is
passed to `updateSnippetValues`. This is undesirable because it couples the callback to the DOM. The new
`saveSnippetData` passes the actual data that the user put in the fields.
* The `SnippetPreview` object now requires an options object instead of an `App` object. The `App` object should still be passed inside the options object with the `analyzerApp` key.
* Removed `SnippetPreview` methods:
	* `setFocus`
	* `hideEditIcon`
	* `showEditIcon`
	* `textFeedback` 
	* `disableEnter`
* Removed `App` methods:
	* `bindSnippetEvents`
	* `bindEvent`
	* `createEditIcon`
	* `createSnippetPreviewEditIcon`
	* `createSnippetPreviewMeta`
	* `createSnippetPreviewUrl`
	* `createSnippetPreviewTitle`
* Deprecated `App.createSnippetPreview`
* Removed `StringHelper` prototype.
* Removed `PreProcessor` prototype.

### Features

* Completely redesign the snippet editor editing experience:
	* Remove the contenteditable fields
	* Add a decoupled form to edit the title, slug and meta description fields.
	* Add a button to clearly show how to open the snippet editor.
	* Add headings to clearly indicate which part is the snippet preview and which is the editor.
	* Add progress bars to show an indication about the length of the title and meta description.
	* Add carets before the preview and form fields to show which preview belongs to which input field.
* Introduce modules. All non-trivial modules are moved out of `analyzer.js` and moved to the `analyses` folder as module. Where it makes sense we added a `stringProcessing` folder with all the string helper modules.
* Introduces new SnippetPreview functions:
	* toggleEditor
	* closeEditor
	* openEditor
	* updateDataFromDOM
	* changedInput
	* bindEvents
	* updateProgressBars
	* validateFields
	* callRegisteredEventBinder
	* getAnalyzerData
	* refresh
	* renderTemplate
* Introduce `ScoreFormatter.getUndefinedScores` to retrieve all the undefined scores from a scores array.
* Introduce `missingArgument` error that is thrown when an argument is missing in the `App`.
* Massively reduce the required config of the `App`.

### Enhancements

* Start to decouple the SnippetPreview from the scrapers and the analyzer.
* Depend on lodash to improve the readability of our codebase and to standardize certain actions.
* Add an option to the `SnippetPreview` to include a date before the meta description.
* Add a `baseURL` option to the `SnippetPreview` to change the base URL.
* Change the stopwords check to a grey bullet that doesn't count towards the total score.

### Bugfixes

* By default add a trailing slash to the rendered URL, add an option to the `SnippetPreview` to disable this behaviour.
* Show the protocol in the snippet preview if it is HTTPS. Google has this behaviour as well.
* Color the meta description preview gray if the user hasn't set it explicitly.

## 1.0: November 18th, 2015

### Backwards incompatible changes

* Removed `YoastSEO.app.addToQueue` method.
* Removed `YoastSEO.app.removeFromQueue` method.
* Removed `YoastSEO.SnippetPreview.setFocusToEnd` method.
* Changed class name of progress bar from `wpseo_msg` to `YoastSEO_msg`. [3fa27b8](https://github.com/yoast/yoastseo.js/commit/3fa27b8)
* Changed ID of progress bar from `wpseo-plugin-loading` to `YoastSEO-plugin-loading`. [3fa27b8](https://github.com/yoast/yoastseo.js/commit/3fa27b8)
* `config.sampleText.url` has been removed in favor of `config.sampleText.baseUrl` and `config.sampleText.snippetCite`.
* `YoastSEO.Pluggable` now needs to be instantiated with a valid `YoastSEO.App` object. [ce32d4a](https://github.com/yoast/yoastseo.js/commit/ce32d4a)
* Removed `YoastSEO.App.init` method. [b720553](https://github.com/yoast/yoastseo.js/commit/b720553)
* Removed `YoastSEO.App.loadQueue` method. [b720553](https://github.com/yoast/yoastseo.js/commit/b720553)
* Move `YoastSEO.App.queue` to `YoastSEO.App.rawData.queue`. [b720553](https://github.com/yoast/yoastseo.js/commit/b720553)
* Removed `YoastSEO.App.defineElements` method. [b720553](https://github.com/yoast/yoastseo.js/commit/b720553)
* Removed `YoastSEO.App.showMessage` method. [b720553](https://github.com/yoast/yoastseo.js/commit/b720553)
* Removed `YoastSEO.initialize` method. [b720553](https://github.com/yoast/yoastseo.js/commit/b720553)
* Removed `YoastSEO.getAnalyzerInput` method. [b596d41](https://github.com/yoast/yoastseo.js/commit/b596d41)
* Removed `YoastSEO.runAnalyzerCallback` method. [b596d41](https://github.com/yoast/yoastseo.js/commit/b596d41)
* Removed `YoastSEO.noKeywordQueue` method. [b596d41](https://github.com/yoast/yoastseo.js/commit/b596d41)
* Removed `YoastSEO.InputGenerator` in favor of `YoastSEO.ExampleScraper`, don't use this! This is only meant as an example. [af05e7d](https://github.com/yoast/yoastseo.js/commit/af05e7d)
* Removed `args.snippetTitle`. The snippet title will now always be rendered following `args.pageTitle`. [1cf3e23](https://github.com/yoast/yoastseo.js/commit/1cf3e23)
* Changed arguments of `YoastSEO.ScoreFormatter` [116bdfd](https://github.com/yoast/yoastseo.js/commit/116bdfd), [9473dce](https://github.com/yoast/yoastseo.js/commit/9473dce) and [34f7657](https://github.com/yoast/yoastseo.js/commit/34f7657):
	* `args.pageAnalyzer` removed in favor of `args.scores` and `args.overallScore`.
	* `args.config.targets.output` removed in favor of `args.outputTarget`.
	* `args.config.targets.overall` removed in favor of `args.overallTarget`.
	* Introduced `args.keyword`.
	* Introduced `args.saveScores`.

### Features

* Added `YoastSEO.SnippetPreview.getUnformattedText` and `YoastSEO.SnippetPreview.setUnformattedText, getter and setter for the unformatted text property. [682ec6d](https://github.com/yoast/yoastseo.js/commit/682ec6d)
* Added fallback for meta description to the text that is analyzed. This is prioritized after the excerpt but before the sample text.
* Added a `config.snippetSuffix` to include some text before the snippet title.
* Added `YoastSEO.Analyzer.addAnalysis` to add an analysis on the analyzer object. [ddec6b7](https://github.com/yoast/yoastseo.js/commit/ddec6b7)
* Added `YoastSEO.AnalyzeScorer.addScoring` to add a scoring on the scoring object. [ddec6b7](https://github.com/yoast/yoastseo.js/commit/ddec6b7)
* Added `YoastSEO.App.registerTest` to add a new test to the analyzer. [ddec6b7](https://github.com/yoast/yoastseo.js/commit/ddec6b7)
* Added `YoastSEO.AnalyzerScoring.getTotalScore` to retrieve the total score. [72f368a](https://github.com/yoast/yoastseo.js/commit/72f368a)

### Enhancements

* Improved default value of the base url in the snippet preview. [a1d805a](https://github.com/yoast/yoastseo.js/commit/a1d805a)
* Improved handling of the raw snippet preview content so we the user can edit the raw string when clicking on an item in the snippet preview.
* Improved detection of container element, now uses `config.targets.output` instead of a hardcoded `wpseo_meta`
* `config.sampleText.baseUrl` is no longer required.
* Added reference to `Yoast.App` instance as a parameter to `bindElementEvents` callback.
* Automatically enable no keyword queue if there is no keyword. [b596d41](https://github.com/yoast/yoastseo.js/commit/b596d41)
* Increase snippet title length from 40 to 70 characters. [0ad7c1f](https://github.com/yoast/yoastseo.js/commit/0ad7c1f)
* Re-render snippet preview after each analysis. [3d080b8](https://github.com/yoast/yoastseo.js/commit/3d080b8)
* Use `input` event to bind to snippet preview change instead of `change`. [4675a9f](https://github.com/yoast/yoastseo.js/commit/4675a9f)
* Don't use `args.overallTarget` if it isn't set. [7ce7ea4](https://github.com/yoast/yoastseo.js/commit/7ce7ea4)

### Bugfixes

* Fixed snippet preview so only the full focus keyword is highlighted and not words that contain the focus keyword. [3655d13](https://github.com/yoast/yoastseo.js/commit/3655d13)
* Fixed scoring so 0-3 now mean a bad score and no-keyword is a special score. [ad8a085](https://github.com/yoast/yoastseo.js/commit/ad8a085)
* Fix scoring for title length.
* Sanitize keyword before using it as a regex to prevent the regex from breaking. [2d95fcb](https://github.com/yoast/yoastseo.js/commit/2d95fcb)
* Style the snippet title `inline-block` to make the overflow hidden.
* Style the snippet site url `inline` to make the overflow hidden.

## 1.0-beta2: September 23st, 2015
* Fixes a bug where the slug wasn't taken into account when checking if the url contains the focus keyword.

## 1.0-beta: September 21st, 2015
* Initial beta release
