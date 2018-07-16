# Change Log

This changelog is according to [Keep a Changelog](http://keepachangelog.com).

All notable changes to this project will be documented in this file.
We will follow [Semantic Versioning](http://semver.org/) from version 2 and onwards.

## 1.35.4 July 16th, 2018
### Changed
* Changes feedback in the keyword density assessment to make it more explicit that synonyms are not taken into consideration when calculating the score.

## 1.35.3 July 9th, 2018
### Changed
* Makes keyword distribution boundaries the same regardless of whether or not synonyms are set, enables markings also when the bullet is green, and shows a gray bullet when there are not enough keyword occurrences to calculate distribution.

## 1.35.2 July 5th, 2018
### Changed
* Removes the topic density assessment and uses the keyword density assessment also when synonyms are set.

## 1.35.1 July 4th, 2018
### Fixed
* Fixes a bug where a custom callback would not work correctly.

## 1.35.0 July 3rd, 2018
### Added
* Adds an assessment the checks the distribution of the focus keyword in the text.
* Adds a topic distribution and topic density assessment to use with synonyms.
* Adds links to relevant articles to all SEO assessments.
* Adds Flesch Reading Ease assessment for French.
* Adds Flesch Reading Ease assessment for Spanish.
* Add passive voice assessment for Italian.

### Fixed
* Instances of the same keyword with different kinds of apostrophes (e.g., brain’s and brain's) are now recognized as the same in the following assessments: keyword in meta description, keyword in subheading, keyword in first paragraph, keyword in title, keyword in URL.
* Filters out prominent word combinations ending in 's in English. Props to [swekkiekekkie](https://github.com/swekkiekekkie).

## 1.34.0 June 12th, 2018
### Fixed
* Fixes title width measurements by adding font styles to the hidden input field.

### Changed
* Improves the lists of French transition words, stopwords, and function words, props [Laurent-1971](https://github.com/Laurent-1971).

## 1.33.1 May 25th, 2018
### Fixed
* Fixes a bug where Flesch Reading Ease translation strings were not fully translated.

## 1.33.0 May 23rd, 2018
### Added
* Adds Catalan transition words.
* Added the title width to rawData in app.js to be used by the title width assessment.

### Changed
* Changed max meta description length from 320 to 156.

## 1.32.0 May 16th, 2018
### Added
* Adds Flesh Reading Ease for Russian.

### Changed
* Sequences of symbols which do not contain a single letter or digit are no longer considered a valid keyword.
* Question marks and hashes are stripped from the snippet preview URL.
* Makes the snippetPreview optional in the App. This can be enabled by putting the hasSnippetPreview argument to false.

## 1.31.0 April 26th, 2018
### Added
* Adds readability analysis for Russian.
* Adds prominent words for Russian.

### Changed
* Improves SVG image accessibility.
* Updates the language support table in the README.

### Fixed
* Fixes a bug where sentences ending in multiple sentence marks, exclamation marks or ellipses were treated as multiple sentences.

## 1.30.2  March 16th, 2018
### Changed
* Reverted the default view of the snippet preview to desktop.

## 1.30.1 March 12th, 2018
### Fixed
* Fixes a bug that broke a filter which marks Spanish and French sentences as non-passive when certain exception words occur between the auxiliary and the participle.

## 1.30.0 March 5th, 2018
### Added
* Adds a setter for titleWidth to the snippet preview. 
* Adds a researcher to calculate the reading time for a given paper.
* Adds a filter to mark Spanish sentences as non-passive when certain exception words occur between the auxiliary and the participle. The list of exception words includes all forms of the copula 'estar'.
* Adds transition words assessment for Portuguese, props [amesdigital](https://github.com/amesdigital).
* Adds prominent words for Portuguese, props [amesdigital](https://github.com/amesdigital).

### Changed
* The snippet preview now shows the mobile preview by default.
* Fixes a bug where division by zero errors in the passive voice assessment would cause `NaN%` to show up in the feedback.
* Fixes a bug where multiple `rel` arguments prevented correct `nofollow` detection. 
* Slightly increased the height of the meta description box so it matches the maximum amount of characters without needing a scrollbar.
* Improves the list of Portuguese function words.

## 1.29.0 January 15th, 2018
### Added
* Adds language support table to the README.
* Adds a performance analysis tool.
* Adds the passive voice assessment for French.
* Adds the passive voice assessment for Spanish.

### Changed
* Simplifies the message for the SubheadingsKeywordAssessment.
* Reduces the number of times the content analysis is refreshed on page load.
* Fixes a bug where relative URLs were not counted as internal links in the internal link assessment.

## 1.28.0 December 18th, 2017
### Changed
* Includes the link to the post about using your focus keyword multiple times also to the feedback text that is shown when using a focus keyword twice. 
* Changes the anchor text of the link to the post about using your focus keyword multiple times to a more accessible one.

## 1.27.0 December 15th, 2017
### Changed
* The upper boundary of the meta description length has been changed from 156 to 320 characters.

## 1.26.0 December 13th, 2017
### Changed
* Updates the copy for the `previouslyUsedKeywords` assessment by referring to a new blogpost on why it might be a bad idea to use the same keyword more than once.

## 1.25.0 December 11th, 2017
### Added
* Adds a link to the subheadings article in the readability analysis to better explain the advantages of using subheadings in your text. #1317

## 1.24 November 29th, 2017
### Changed
* Changes the feedback string for a good meta description length from `The length of the meta description is sufficient.` to `The meta description has a nice length.` #1307

## 1.23.1 November 7th, 2017
### Added
* Adds a sentence research. #1278
* Adds escaping of the focus keyword in the url generated by the `PreviouslyUsedKeywords` assessment. #1281

## 1.23.0 October 31st, 2017
* Errors now give a score of -1. `ScoreToRating` interpreter will convert `-1` to `error`. #1272
* Adds `Excited` to exception -ed verbs for passive voice assessment. #1269
* Adds `release` script to `.travis.yml` for publishing to npm. #1265
* Adds a filter to exclude `code` tags and their enclosed content from the content analysis assessments. #1250
* Adds a filter to exclude `pre` tags and their enclosed content from the content analysis assessments, props [chrisboo](https://github.com/chrisboo). #1258
* Switches testing framework to `jest`. #1266

## 1.22.0 October 3rd, 2017
* Added typescript support.
* Add filter for exception words between auxiliary and passive participle.
* Fixes a bug that caused an error in the passive analysis when certain words ending in ing were followed by a parenthesis.

## 1.21.0: September 5th, 2017
* Adds updatedKeywordsResults and updatedContentResults callbacks to app.js.

## 1.20.0: August 8th, 2017
### Added
* Adds a filter for word combinations that consist of a single one-character word.

### Fixed
* Fixes a bug where the passive voice and transition word assessments were broken when the passive voice sentence breaker or the transition word was preceded by a word containing the same string of letters.

## 1.19.0: July 25th, 2017
### Added
* Adds additional English transition words.
* Adds additional French transition words, props [Evoque](https://github.com/@evoqueio).
* Adds relevant words functionality for Italian.
* Adds relevant words filters for titles such as 'Ms', 'jr' etc. for English, Dutch, German, French, Italian and Spanish.
* Adds plural ordinal numbers relevant words filters for Spanish, Italian, and French.
* Adds time words relevant words filters for English, Dutch, German, French and Spanish.
* Adds more function words category relevant words filters for Spanish and Italian.

### Changed
* Improves filtering for Internal Linking Suggestions and Insights for Italian, Spanish, Dutch, French, English and German.
* Removes all relevant word combinations containing any of the following special characters if they are not part of a word: –, —, -, ©, #, %, /, \, $, €, £, *, •, |, →, ←, }, {, //, ||.

### Fixed
* Fixes a visual imperfection in the tooltip in combination with Microsoft Edge.

## 1.18.0: July 6th, 2017
### Changed
* Changes 'page title' to 'seo title' in the snippet preview.
* Changes recommended maximum sentence length for Italian from 20 to 25 words, based on more in-depth research.

### Added
* Adds Flesch Reading for Italian.
* Adds prominent words for French, props Sylvain Perret and [Evoque](https://github.com/evoqueio).

## 1.17.2: June 7th, 2017

### Fixed
* Remove YoastSEO.js as dependency of itself.

## 1.17.0: June 7th, 2017

### Fixed
* Fixes a bug where assessments added with the pluggable were omitted.

## 1.16.0: May 23rd, 2017

### Fixed
* Fixes a typo in app.js comments, props [Alexander Varwijk](https://github.com/Kingdutch).
* Fixes an incompatibility issue with includes in Internet Explorer. The browser doesn't support includes and that broke the HTMLparser.

### Added
* Adds cornerstone assessors.

## 1.15.1: May 9th, 2017

### Fixed
* Fixes an issue where the analysis wouldn't work on Internet Explorer.

## 1.15.0: May 2nd, 2017

### Fixed
* Fixes a bug where style and script elements were parsed for the prominent words.
* Fixes a bug where the cursor pointer was in front of the metabox.

### Added
* Adds transition words for Italian.
* Adds a new assessment for internal linking that checks for the presence of at least one internal link.

## 1.14.0: April 11th, 2017

### Fixed
* Fixes the provided example code, props [Alexander Guth](https://github.com/alxy).

### Added
* Introduces sentence beginnings assessment for Italian.

## 1.13.0: March 21st, 2017

### Fixed

* Fixes a bug where the keyword density assessment would disappear when the density was 0.5%.

## 1.12.0: February 28th, 2017

### Fixed
* Sets the boldness of the strong tags to 700 to enforce that they are displayed strong.
* Changes strings that link to an article to improve context.
* Changes links to short links so we can ensure they are always up to date.

## 1.11.0: February 14th, 2017

### Added
* Adds prominent words for Spanish.
* Adds getLinks to the researcher, this function retrieves the URLs of the links from the text.

### Changed
* Improves feedback text for subheading too long assessment.

## 1.10.0: January 31st, 2017

### Added
* Adds prominent words for Dutch.
* Adds example for testing the prominent words analysis.
* Adds the tooltip CSS rule from Yoast SEO to yoastSEO.js.

### Changed
* Improves the accessibility of the snippet preview toggle buttons.
* Makes the mark buttons tooltips always visible.

### Fixed
* Fixes a bug where the measurement elements holder `<div>` breaks the responsive view of the media modal.

## 1.9.0: January 17th, 2017

### Added

* Adds mobile snippet preview.
* Adds sentence length check for Dutch.
* Adds sentence beginnings check for Dutch.
* Adds transition words for Dutch.
* Adds German prominent words.

### Changed

* Removes unused assessments; sentence length variation, subheading length, 
    subheading presence, subheading distribution too short, paragraph too short
* Makes the stop words check language dependant.

## 1.8.0: December 13th, 2016

### Added

* Adds passive voice for German. 
* Adds more transition words for French.

### Changed

* Creates value objects for sentence parts and participles.
* Improves feedback strings for the meta description length assessment. 
* Improves matching of the keyword in the first paragraph.
* Improves the snippet preview to match the styling of Google's snippet.

### Fixed

* Fixes a bug where keywords with periods where not highlighted in the snippet.

## 1.7.0: October 11th, 2016

### Added

* Adds relevant word research that returns a list of most prominent words in a given Paper.

### Changed

* Changes all target= links to consistently be target=_blank.

### Fixed

* Adds missing transition words to German transition word list.
* Fixes a bug where empty sentences could be marked when marking the beginning of sentences.

## 1.6.0: September 27th, 2016

### Changed

* Improves carets used in the snippet preview to support RTL.

### Fixed

* Keywords with special characters are now matched.
* Changes sassdash from a dev dependency to a regular dependency.

## 1.5.0: September 7th, 2016

### Changed

* Improves sentence beginning check by matching only alphanumeric characters.
* Adds horizontal ellipses as sentence terminator.

### Fixed

* Improves detecting sentence endings with block ends.
* Passive voice detects multiple uses of the same auxiliary.
* Yoast marks are no longer placed around block level elements.
* Prevents division by zero in transition word assessment result text.
* Passive voice detects exceptions with the word 'rid' correctly.

### Added

* Flesch Reading for Dutch
* Flesch Reading for German

## 1.4.1: August 2nd, 2016

### Fixed

* Fixes a security issue where the focus keyword would be output without escaping it first.

## 1.4.0: July 19th, 2016

### Changed

* Improves feedback texts of assessments.
* Improves Russian transliteration.
* Determine length of title based on the width in pixels instead of on number of characters.
* Words comprised of only digits are no longer counted in the Flesch Reading assessment.
* Improves passive voice detection by omitting HTML tags.
* Non breaking spaces are replaced with normal spaces in word boundaries.

### Fixed

* Improved keyword density assessment by scoring on the rounded result.
* ¿ and ¡ are now accepted as sentence beginnings.
* Fix a bug where the text assessment would fail with exactly 300 words.
* Fix a bug in the competing links assessment where a link to the same post would be counted as an outbound link.

### Added

* Transliterations for the following languages:
    * Breton, Chamorro, Corsican, Kashubian, Welsh, Ewe
    * Estonian, Basque, Fulah, Fijian, Arpitan, Friulian
    * Frisian, Irish, Scottish Gaelic, Galician, Guarani
    * Swiss German, Haitian Creole, Hawaiian, Croatian
    * Georgian, Greenlandic, Kinyarwanda, Luxembourgish
    * Limburgish, Lingala, Lithuanian, Malagasy, Macedonian
    * Maori, Mirandese, Occitan, Oromo, Portuguese, Romansh Vallader
    * Aromanian, Romanian, Slovak, Slovenian, Albanian
    * Klingon (in Latin characters, not KLI PlqaD script yet)
    * Hungarian, Sardinian, Silesian, Tahitian, Venetian, Walloon
* Added assessment for consecutive sentences beginning with the same word for the following languages:
    * English, German, French, Spanish.
* Added transition words for German, French and Spanish.

## 1.3.3: June 21st, 2016

### Changed
* Change the calculation of the aggregate content score to be more lenient for non-English languages. 

## 1.3.2: June 15th, 2016

### Fixed
* Fix a bug where the transition words and passive voice assessments would display on non-English languages. 

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
