# Changelog

All notable changes to this project will be documented in this file. Releases without a changelog entry contain only minor changes that are irrelevant for users of this library.
We will follow [Semantic Versioning](http://semver.org/) from version 3.0.0 and onwards.

## 3.2.0 (2025-05-02)

### Enhancements:
* Adds new phrases regarding disability and forms of the word _insane_ to the _inclusive language assessment_. [#22221](https://github.com/Yoast/wordpress-seo/pull/22221)
* Improves the feedback for "lame" in the _inclusive language assessment_ by considering homonyms. [#22221](https://github.com/Yoast/wordpress-seo/pull/22221)
* Improves the feedback texts for the _passive voice_ and _consecutive sentences_ assessments in case there is nothing to report. [#22194](https://github.com/Yoast/wordpress-seo/pull/22194)
* Makes the _images_, _internal links_, and _external links_ assessments available when no content has been added. [#22192](https://github.com/Yoast/wordpress-seo/pull/22192)
* Makes the following SEO assessments available in the analysis by default, even when no content has been added: _keyphrase in introduction_, _keyphrase in meta description_, _keyphrase in SEO title_, _keyphrase in slug_ and _previously used keyphrase_. [#22219](https://github.com/Yoast/wordpress-seo/pull/22219)
* Removes unnecessary config for the _outbound links_ assessment from the cornerstone SEO assessor, which is the same as the default config. [#22197](https://github.com/Yoast/wordpress-seo/pull/22197)

### Bugfixes:
* Fixes a bug where prominent words would not be updated when switching languages. [#22222](https://github.com/Yoast/wordpress-seo/pull/22222)

### Other:
* Updates assessment scoring documentation to include e-commerce assessments. [#22197](https://github.com/Yoast/wordpress-seo/pull/22197)

### Non user facing:
* Fixes broken links in the assessors documentation. [#22225](https://github.com/Yoast/wordpress-seo/pull/22225)

## 3.1.0 (2025-04-11)
### Enhancements:
* Adds _pregnant women_ to the potentially non-inclusive phrases targeted by the inclusive language analysis. [#22086](https://github.com/Yoast/wordpress-seo/pull/22086)
* Converts the _consecutive sentences_ assessment highlighting approach from search and replace to position-based approach. [#21974](https://github.com/Yoast/wordpress-seo/pull/21974)
* Converts the _consecutive sentences_ assessment to use HTML parser in its analysis. [#21974](https://github.com/Yoast/wordpress-seo/pull/21974)
* Expands and updates the function words list for Farsi. Props to [nshayanfar](https://github.com/nshayanfar). [#21958](https://github.com/Yoast/wordpress-seo/pull/21958)
* Extends the transition words list for Farsi. [#22158](https://github.com/Yoast/wordpress-seo/pull/22158)
* Improves the inclusive language analysis feedback for the potentially non-inclusive word _exotic_, and prevents the feedback from appearing when _exotic_ is followed by words common in scientific contexts. [#22087](https://github.com/Yoast/wordpress-seo/pull/22087)
* Removes applicability criteria from readability assessments that are related to a minimum text length. [#22156](https://github.com/Yoast/wordpress-seo/pull/22156)
* Splits Farsi function words with spaces into separate strings. [#21958](https://github.com/Yoast/wordpress-seo/pull/21958)

### Other:
* Improves the translatability of feedback strings for the keyphrase length assessment. [#22173](https://github.com/Yoast/wordpress-seo/pull/22173)
* Updates the assessment scoring documentation for the _paragraph length_ assessment. [#22161](https://github.com/Yoast/wordpress-seo/pull/22161)

## 3.0.0 (2025-03-07)
### Enhancements:
* Adds _так_ to the words recognized by the _transition words_ assessment in Russian. [#21440](https://github.com/Yoast/wordpress-seo/pull/21440)
* Adds a condition in the worker to update the readability analysis assessor when the Paper's keyphrase changes. [#21530](https://github.com/Yoast/wordpress-seo/pull/21530)
* Adds a score aggregator that only counts valid results. [#21941](https://github.com/Yoast/wordpress-seo/pull/21941)
* Adds a separate check for German plural nouns containing umlaut. [#21796](https://github.com/Yoast/wordpress-seo/pull/21796)
* Adds an additional step for stemming words ending in `-er` in English. [#21708](https://github.com/Yoast/wordpress-seo/pull/21708)
* Adds logic to set `hasAIFixes` to `true` for a certain condition for _keyphrase in introduction_, _keyphrase in subheading_, _keyphrase density_, and _keyphrase distribution_ assessment's result. [#21348](https://github.com/Yoast/wordpress-seo/pull/21348)
* Adds new property `hasAIFixes` in `AssessmentResult` class. [#21348](https://github.com/Yoast/wordpress-seo/pull/21348)
* Converts _sentence length_ and _paragraph length_ assessments highlighting approach from search and replace to position-based approach. [#21866](https://github.com/Yoast/wordpress-seo/pull/21866)
* Converts _sentence length_ and _paragraph length_ assessments to use HTML parser in their analysis. [#21866](https://github.com/Yoast/wordpress-seo/pull/21866)
* Enables Yoast AI Optimize button for _sentence length_ and _paragraph length_ assessments. [#21866](https://github.com/Yoast/wordpress-seo/pull/21866)
* Excludes the image caption inside a classic block from the _keyphrase in introduction_ assessment. [#21564](https://github.com/Yoast/wordpress-seo/pull/21564)
* Expands and updates the transition words lists for Portuguese and English. [#21794](https://github.com/Yoast/wordpress-seo/pull/21794)
* Improves the _word complexity_ assessment by not flagging the focus keyphrase or related keyphrases as complex words. [#21400](https://github.com/Yoast/wordpress-seo/pull/21400)
* Improves the transition words lists for Turkish and English.  [#21616](https://github.com/Yoast/wordpress-seo/pull/21616)
* Improves the verb suffixes recognition and stemming in Spanish. [#21999](https://github.com/Yoast/wordpress-seo/pull/21999)
* Removes common punctuation from the character count for Japanese in `countCharacters.js`. [#22050](https://github.com/Yoast/wordpress-seo/pull/22050)

### Bugfixes
* Fixes a bug where Arabic keyphrases containing certain function words were not correctly matched. [#21569](https://github.com/Yoast/wordpress-seo/pull/21569)
* Fixes a bug where the content analysis would become unresponsive when processing very long keyphrases in Arabic and Hebrew. [#21807](https://github.com/Yoast/wordpress-seo/pull/21807)

### Other
* Exposes all assessors and the helpers to retrieve the _word complexity_ configs and helpers. [#21337](https://github.com/Yoast/wordpress-seo/pull/21337)
* Improves the feedback strings in _subheading distribution_ assessment for better translatability. [#22044](https://github.com/Yoast/wordpress-seo/pull/22044)
* Outputs the feedback strings of the following assessments as a non-translation string by default: _image alt tags_, _keyphrase distribution_, _title_, _product SKU_, _product identifier_, _word complexity_, _lists_, and _text alignment_ assessments. The default feedback strings can be overridden through the assessment config `callbacks.getResultTexts`, for example with text in the form of translation strings. [#21567](https://github.com/Yoast/wordpress-seo/pull/21567)
* Removes the product assessment registration from product assessors. These assessments must now be registered via the worker `worker.registerAssessment()`. [#21567](https://github.com/Yoast/wordpress-seo/pull/21567)
* Removes unused code related to the tree parser. [#21941](https://github.com/Yoast/wordpress-seo/pull/21941)

### Non user facing:
* Adds TypeScript bindings. [#21717](https://github.com/Yoast/wordpress-seo/pull/21717)
* Adds a `yarn` command to extract the inclusive language configuration. [#21987](https://github.com/Yoast/wordpress-seo/pull/21987)
* Adds a rule description property to each inclusive language assessment that has a rule. [#21779](https://github.com/Yoast/wordpress-seo/pull/21779)
* Adds additional key `endOffset` of a block when parsing the Gutenberg blocks. [#21520](https://github.com/Yoast/wordpress-seo/pull/21520)
* Adds an overview and glossary for the terminology used throughout the package. [#21876](https://github.com/Yoast/wordpress-seo/pull/21876)
* Adds enforcement of WordPress's i18n rules.  [#22042](https://github.com/Yoast/wordpress-seo/pull/22042)
* Adds tests for converting Turkish keyphrases starting on capitalised İ and ı to lower case. [#21980](https://github.com/Yoast/wordpress-seo/pull/21980)
* Allows transpiling all JavaScript files inside `src` and `vendor` into TypeScript and allows importing modules with an asterisk `*`. [#21971](https://github.com/Yoast/wordpress-seo/pull/21971)
* Converts the _list_ assessment to use the HTML parser. [#21726](https://github.com/Yoast/wordpress-seo/pull/21726)
* Exports the `LanguageProcessor`. [#21957](https://github.com/Yoast/wordpress-seo/pull/21957)
* Improves the way that the passive auxiliaries list is organized, and the way it's used to create rules for disability assessments. [#21788](https://github.com/Yoast/wordpress-seo/pull/21788)
* Outputs the parent block of the introduction node when the `findKeywordInFirstParagraph` research is run. [#21520](https://github.com/Yoast/wordpress-seo/pull/21520)
* Removes the `matchStringWithRegex` helper from the index, as its use is discouraged. [#21721](https://github.com/Yoast/wordpress-seo/pull/21721)
* Removes unnecessary inclusive language feedback string variables. [#21535](https://github.com/Yoast/wordpress-seo/pull/21535)
* Rewrites JavaScript `prototype`-based classes into the newer `class` syntax. [#21325](https://github.com/Yoast/wordpress-seo/pull/21325)
* Updates the package dependencies. [#21813](https://github.com/Yoast/wordpress-seo/pull/21813)
* Updates the readability analysis result when there is a change in the list of Gutenberg blocks `wpBlocks`. [#21953](https://github.com/Yoast/wordpress-seo/pull/21953)
* Uses the HTML parser for the _text alignment_ assessment. [#21721](https://github.com/Yoast/wordpress-seo/pull/21721)

## 2.0.0-alpha.0 (2024-05-27) (changelog is likely incomplete)
### Enhancements
* Activates the consecutive sentences assessment for Norwegian and adds a list of exception words to exclude from the assessment.
* Adapts _keyphrase density_ assessment to use the HTML parser. [#20139](https://github.com/Yoast/wordpress-seo/pull/20139)
* Adapts the language-specific files for passive voice assessment to the new structure for German, Dutch, French, Spanish, Italian, Portuguese, Polish, Hungarian, and Czech.
* Adds `<textarea>` element to ignored tags in the html parser. [#20212](https://github.com/Yoast/wordpress-seo/pull/20212)
* Adds Czech stemmer.
* Adds Farsi transition words and activates the transition words assessment.
* Adds Japanese configuration for meta description length.
* Adds Norwegian transition words and activates the transition words assessment.
* Adds _Text alignment_ assessment to the Readability analysis. [#19881](https://github.com/Yoast/wordpress-seo/pull/19881)
* Adds `TextTitleAssessment`. [#18990](https://github.com/Yoast/wordpress-seo/pull/18990)
* Adds `jak wiemy` to the list of Polish transition words.
* Adds a `getParagraphs` research that returns all paragraphs in a document. [#20546](https://github.com/Yoast/wordpress-seo/pull/20546)
* Adds a check in the `wordComplexity` research file to exclude words included in the `functionWords` config. [#19390](https://github.com/Yoast/wordpress-seo/pull/19390)
* Adds a condition to the SKU assessment that returns a grey bullet when the product variant data is not valid. [#18721](https://github.com/Yoast/wordpress-seo/pull/18721)
* Adds a condition to the assessment that returns a grey bullet when the product variant data is not valid. [#18698](https://github.com/Yoast/wordpress-seo/pull/18698)
* Adds a few entries to the list of `multipleWords` for French transition words.
* Adds a function to exclude an HTML element by its attributes' `id` in `fiterHelpers.js`. [#20186](https://github.com/Yoast/wordpress-seo/pull/20186)
* Adds a keyphrase distribution assessment to all relevant product-related assessors.
* Adds a missing array entry that caused time-related words in Dutch, English, Indonesian, Russian, and Spanish to not be counted as function words.
* Adds a new attribute `writingDirection` to the Paper. [#19881](https://github.com/Yoast/wordpress-seo/pull/19881)
* Adds a step to check for the pre-sanitized version of the keyphrase to match in the findKeyphraseInSEOTitle research. [#19816](https://github.com/Yoast/wordpress-seo/pull/19816)
* Adds a step to the `dehyphenateKeyphrase` function in the `keywordCountInUrl` research that allows to generate an array of dehyphenated keyphrase forms for keyphrases with multiple word forms. [#18460](https://github.com/Yoast/wordpress-seo/pull/18460)
* Adds a word complexity research and assessment, with an implementation for English. [#18592](https://github.com/Yoast/wordpress-seo/pull/18592)
* Adds additional setter and getter methods in `Mark` object for position information. [#20139](https://github.com/Yoast/wordpress-seo/pull/20139)
* Adds an additional check to split text on ellipsis &#8230; only when the beginning of the next sentence is a valid one. [#18511](https://github.com/Yoast/wordpress-seo/pull/18511)
* Adds an edit button to the assessment results of the SEO title width, Meta description length, Keyphrase in meta description, Keyphrase in slug, Keyphrase in SEO title, Keyphrase length, and Function words in keyphrase assessments when they return an orange or red bullet.  [#18674](https://github.com/Yoast/wordpress-seo/pull/18674)
* Adds an edit button to the assessment results of the SKU and Product identifier assessments when they return an orange or red bullet. [#19886](https://github.com/Yoast/wordpress-seo/pull/19886)
* Adds an extra check for matching keyphrase in SEO title for languages that have function word prefixes (i.e. Arabic and Hebrew). [#21150](https://github.com/Yoast/wordpress-seo/pull/21150)
* Adds an extra check in the `SubheadingsDistributionTooLong` assessment's applicability where we can adjust whether the assessment should appear in a short text analysis or not.
* Adds assessors for blog posts and pages, and sets them in `analysis.worker` in the content analysis app.
* Adds assessors for collection pages and sets them in the `apps/content-analysis/src/analysis.worker.js` file.
* Adds assessors for product pages.
* Adds assessors for store blogs.
* Adds correct shortlinks to product assessors.
* Adds custom config for TitleWidth assessment in all SEO assessors so that short title is not penalized with a bad score.
* Adds custom config for `TitleWidth` assessment for product pages and adds extra feedback string in the assessment file for when short title width is not penalized with a bad score.
* Adds custom configuration for the keyphrase length assessment when used for product pages.
* Adds diacritics to the list of full form non-passive exceptions for Turkish.
* Adds external stemmer for Slovak.
* Adds function words for Czech.
* Adds functionality for the webworker to also set custom options when loading the custom assessors for the SEO analysis (regular/cornerstone), the SEO analysis for related keyphrases (regular/cornerstone), and the readability analysis (regular/cornerstone).
* Adds functionality for the webworker to load custom assessors for the SEO analysis (regular/cornerstone), the SEO analysis for related keyphrases (regular/cornerstone), and the readability analysis (regular/cornerstone).
* Adds helpers to retrieve the sentence and words from paragraph and heading nodes. [#20139](https://github.com/Yoast/wordpress-seo/pull/20139)
* Adds highlighting for the _subheading distribution_ assessment and new feedback for content with a too long text before the first subheading.  [#18773](https://github.com/Yoast/wordpress-seo/pull/18773)
* Adds language-specific configuration parameters for German, Dutch and Swedish.
* Adds more non-passive exception words to the list of full form non-passive exceptions for Turkish.
* Adds quotation marks followed by period as valid sentence endings. [#18530](https://github.com/Yoast/wordpress-seo/pull/18530)
* Adds shortlinks to the feedback text of the Images and Image Keyphrase assessments.
* Adds shortlinks to the feedback text of the Lists assessment.
* Adds single-word transition words to the function words list for Arabic and Hebrew. [#20992](https://github.com/Yoast/wordpress-seo/pull/20992)
* Adds stemming rule for the most common perfective verbs.
* Adds text length score boundaries config for product pages to the product page SEO assessors.
* Adds the full slug (in addition to each part of the slug divided on the hyphen/underscore) to the list of words from the paper. [#18460](https://github.com/Yoast/wordpress-seo/pull/18460)
* Adds the html code (&amp) for the ampersand character (&) to the removePunctuation helper. [#18664](https://github.com/Yoast/wordpress-seo/pull/18664)
* Adds the sentence beginnings assessment for Czech.
* Adds the transition words list for Czech and improves the list of function words with the most common irregular comparatives.
* Adds the word complexity assessment for Spanish, German and French. [#18684](https://github.com/Yoast/wordpress-seo/pull/18684)
* Adjusts recommended text length values for non-cornerstone collections pages so that they are lower than the cornerstone ones.
* Changes the maximum recommended sentence length in Farsi to 25 words.
* Changes the recommended maximum result of `portuguesePaper2` in `fullTextTests` folder and deletes a word that is also a preposition from participle list.
* Creates `ImageAltTagsAssessment` for product pages.
* Creates a research file that checks if there are lists in the text, and an assessment file that returns a red bullet if there is no list and a green bullet if there is one.
* Deletes obsolete files and changes the `SentenceNew` class to `Sentence`. Also adds an additional check in `parse.js` to parse classes.
* Enables the Product identifiers assessment in WooCommerce. [#18698](https://github.com/Yoast/wordpress-seo/pull/18698)
* Enables the SKU assessment in WooCommerce. [#18721](https://github.com/Yoast/wordpress-seo/pull/18721)
* Excludes Estimated reading time from the analysis. [#18726](https://github.com/Yoast/wordpress-seo/pull/18726)
* Excludes Table of Contents from the analysis.
* Expands Russian irregular nouns exception list.
* Expands the list of excluded HTML elements in `alwaysFilterElements.js`. [#20186](https://github.com/Yoast/wordpress-seo/pull/20186)
* Expands the list of function words for Farsi.
* Filters out table block content from the `getSentenceBeginnings` research.
* Fixes the stopwords list for Czech by adding the correct stopwords. Adds punctuation marks as sentence breakers.
* Implements the consecutive sentence beginnings assessment for Slovak to ensure variety in a text.
* Implements the consecutive sentences assessment for Farsi to ensure variety in a text.
* Implements the new `Clause` and `SentenceNew` class to English folder, adds English Clause class, and adjusts related specs.
* Implements the passive voice assessment for Czech.
* Implements the passive voice assessment for Farsi.
* Implements the passive voice assessment for Norwegian.
* Implements the passive voice assessment for Slovak.
* Implements the transition words assessment for Slovak.
* Improves code quality of the Spanish stemmer and changes the way we stem words ending in `-mente`.
* Improves feedback strings for _keyphrase density_  assessment by replacing "focus keyphrase" with "keyphrase". [#20213](https://github.com/Yoast/wordpress-seo/pull/20213)
* Improves feedback strings for the Keyphrase Length assessment by making them more explicit.
* Improves feedback strings for the Keyphrase Length assessment by making them more explicit. [#18016](https://github.com/Yoast/wordpress-seo/pull/18016)
* Improves keyphrase recognition in Slovak by filtering out function words such as `som, a, jedna, že`.
* Improves keyword detection for Norwegian by expanding the list of function words.
* Improves recognition of keyphrases appearing with em dashes. [#18459](https://github.com/Yoast/wordpress-seo/pull/18459)
* Improves sentence recognition for German by disregarding ordinal numbers as potential sentence boundaries. [#18560](https://github.com/Yoast/wordpress-seo/pull/18560)
* Improves the SentenceTokenizer performance by adding curly (“”) and angular quotation marks («»). [#18664](https://github.com/Yoast/wordpress-seo/pull/18664)
* Improves the content analysis by excluding blockquote HTML elements. [#18528](https://github.com/Yoast/wordpress-seo/pull/18528)
* Improves the regex used to remove URLs from the text so that it matches URLs containing semi-colons, and doesn't match domain names (e.g. yoast.com).  [#19137](https://github.com/Yoast/wordpress-seo/pull/19137)
* Improves the sentence recognition by disregarding abbreviations as potential sentence boundaries. [#18505](https://github.com/Yoast/wordpress-seo/pull/18505)
* Improves the sentence recognition by disregarding initials as potential sentence boundaries. [#18527](https://github.com/Yoast/wordpress-seo/pull/18527)
* Improves the text analysis by supporting sentence detection for declarative sentences in quotation marks. [#18530](https://github.com/Yoast/wordpress-seo/pull/18530)
* Improves tokenizing text into sentences by adding a new condition that next sentence should be preceded by a whitespace except in Japanese. [#18443](https://github.com/Yoast/wordpress-seo/pull/18443)
* Includes videos in the `ImageCount` analysis when the `countVideos` value is true.
* Introduces a robust HTML parser to improve the processing and analysis of text in HTML.  [#20367](https://github.com/Yoast/wordpress-seo/pull/20367)
* Introduces more robust HTML processing and highlighting  [#20714](https://github.com/Yoast/wordpress-seo/pull/20714)
* Makes `transitionWordsAssessment` not applicable when the text has less than 200 words.
* Makes replacement of spaces, followed by a period, applicable only when the period is the last character in both stripSpaces files. [#19816](https://github.com/Yoast/wordpress-seo/pull/19816)
* Makes the _SKU_ and _product identifiers_ assessments available for grouped products. [#18958](https://github.com/Yoast/wordpress-seo/pull/18958)
* Moves Japanese Sentence Tokenizer out of `SentenceTokenizer.js`. [#18443](https://github.com/Yoast/wordpress-seo/pull/18443)
* Moves an exception check specific to English from the general `getClauses` file to the English-specific `getClauses` file.
* Moves passive voice values and some helpers, and the `ProminentWord` value to different folders in order to improve file organization.
* Normalizes single quotes in Japanese sentences before looking for an exact match with the keyphrase. [#20650](https://github.com/Yoast/wordpress-seo/pull/20650)
* Normalizes single quotes when creating tokens from sentences. [#20650](https://github.com/Yoast/wordpress-seo/pull/20650)
* Passes appropriate `config` to the sentence length assessment class in the product page content assessors.
* Passes custom configuration for the images assessment for product pages
* Refactors `getSubheadingTexts` research to also return the text that follows a subheading. [#18773](https://github.com/Yoast/wordpress-seo/pull/18773)
* Refactors the `Sentence` and `SentencePart` classes.
* Refactors the `paragraphTooLong` assessment into a class and adds custom config for the assessment when used for product pages.
* Refactors the way that the right `config` is set for the sentence length assessment.
* Registers the whole web worker with the scope.
* Removes URLs and email addresses from the text before calculating prominent words (for insights and for internal linking).  [#19137](https://github.com/Yoast/wordpress-seo/pull/19137)
* Removes all spaces from the text before counting the number of characters in Japanese texts. [#19137](https://github.com/Yoast/wordpress-seo/pull/19137)
* Removes apostrophe before Turkish words are stemmed. [#17981](https://github.com/Yoast/wordpress-seo/pull/17981)
* Removes feature flag for Greek support to prepare Greek for release.
* Removes feature flag for Japanese support to prepare Japanese for release.
* Removes hyphens from a keyphrase for the Keyphrase in slug assessment. Also removes the functionality that would look for the keyphrase in the unparsed slug if it was not found in the parsed slug, as it is made redundant by the new functionality.
* Removes non-transition words from the Arabic transition words list. [#19097](https://github.com/Yoast/wordpress-seo/pull/19097)
* Removes semicolon from sentence delimiter list. [#18511](https://github.com/Yoast/wordpress-seo/pull/18511)
* Removes the Farsi feature flag.
* Removes the Flesch Reading Ease assessment and the consecutive sentences assessment from the readability analysis on product pages.
* Removes the outbound links and internal links assessments from the SEO analysis on product pages.
* Renames `keywordDensity` to `keyphraseDensity` in the assessment's class. [#20139](https://github.com/Yoast/wordpress-seo/pull/20139)
* Replaces assessment shortlinks that are passed to the assessment constructors in the product assessors with variables.
* Splits hyphenated function words into separate words and adds them to the list of function words. [#20992](https://github.com/Yoast/wordpress-seo/pull/20992)
* Splits the `TextImagesAssessment` into two, `KeyphraseInImageTextAssessment` and `ImageCountAssessment`.
* Switches the default setting of the `nofollow_rss_links` filter from `true` to `false` in order to disable the `rel=nofollow` attribute for RSS feed links. [#20693](https://github.com/Yoast/wordpress-seo/pull/20693)
* Updates the documentation of _keyphrase in image_ and _keyphrase density_ assessments. [#20213](https://github.com/Yoast/wordpress-seo/pull/20213)
* Uses language (e.g. `id`) instead of locale (e.g. `id_ID`) for language-specific checks that should be performed for all locale variants of a language. [#21268](https://github.com/Yoast/wordpress-seo/pull/21268)

### Bugfixes
* Adds `yoastmark` tags to matched keyphrase with different types of apostrophe. For example, when the keyphrase is "panda" and both "panda's" and "panda’s" are found in the text, `yoastmark` tags would be added to both occurrences. [#20947](https://github.com/Yoast/wordpress-seo/pull/20947)
* Adds a step to filter out blocks that only contain paragraph tags in `getSentences.js`. [#18416](https://github.com/Yoast/wordpress-seo/pull/18416)
* Adds a step to unify all whitespaces and non-breaking spaces in `sanitizeString.js` helper. [#18416](https://github.com/Yoast/wordpress-seo/pull/18416)
* Adds a step to unify non-breaking spaces in `Paper.js` and before splitting it into words. [#18416](https://github.com/Yoast/wordpress-seo/pull/18416)
* Adds a type label when registering a new assessment using the `registerAssessment` function in the `AnalysisWebWorker` file. [#19020](https://github.com/Yoast/wordpress-seo/pull/19020)
* Adds the non-breaking space character (`&nbsp;`) to the removePunctuation helper to fix highlighting issues. [#18689](https://github.com/Yoast/wordpress-seo/pull/18689)
* Counts relative fragment links (`#some-id`) as a link to the same page.
* Don't count empty h1s when looking for h1s in the text in the `h1s.js` research. [#20663](https://github.com/Yoast/wordpress-seo/pull/20663)
* Excludes applying `yoastmark` to anchor tag attributes. [#19688](https://github.com/Yoast/wordpress-seo/pull/19688)
* Fixes a bug where an invalid browser field in package.json would cause Vite to throw an error when building. Props to [peeke](https://github.com/peeke). [#19361](https://github.com/Yoast/wordpress-seo/pull/19361)
* Fixes a bug where shortcodes in the Block editor would be treated as words when analyzing content. [#19876](https://github.com/Yoast/wordpress-seo/pull/19876)
* Fixes a bug where the _previously used keyword_ assessment would potentially link to an empty page of results when the focus keyphrase had been used across different post types. [#19800](https://github.com/Yoast/wordpress-seo/pull/19800)
* Fixes a bug where the results of the SEO analysis of the focus keyphrase were removed when more than two related keyphrases were analyzed.
* Fixes a bug with incorrect counting of the number of words in the text when using Cyrillic (Russian and Ukrainian). Props to [kudinovfedor](https://github.com/kudinovfedor). [#17774](https://github.com/Yoast/wordpress-seo/pull/17774)
* Fixes a typo in the list of Spanish transition words. [#18442](https://github.com/Yoast/wordpress-seo/pull/18442)
* Moves the initialization of Keyphrase distribution assessment inside `AnalysisWebWorker.js`.
* Removes URLs from Japanese texts before computing text length in the `countCharacters` function. [#17970](https://github.com/Yoast/wordpress-seo/pull/17970)
* Removes spaces before and after Japanese full stops when sanitizing strings. [#17970](https://github.com/Yoast/wordpress-seo/pull/17970)
* Removes two items from the list of morphological passive suffixes for Greek due to their overlap with bigger word groups causing false positives detection.

### Other
* Adds additional logic to register a readability assessment for cornerstone content. [#19812](https://github.com/Yoast/wordpress-seo/pull/19812)
* Adds documentation about the inclusive language analysis. [#19092](https://github.com/Yoast/wordpress-seo/pull/19092)
* Adds the _title assessment_ to the yoastseo package. [#19931](https://github.com/Yoast/wordpress-seo/pull/19931)
* Creates methods for adding or checking a given config. [#19877](https://github.com/Yoast/wordpress-seo/pull/19877)
* Fixes warnings from running `yarn lint`. [#20952](https://github.com/Yoast/wordpress-seo/pull/20952)
* Moves the registration of _keyphrase distribution assessment_ and its research and helper outside of `yoastseo`. [#19824](https://github.com/Yoast/wordpress-seo/pull/19824)
* Moves the registration of the _word complexity_ assessment and its research and helper outside of the `yoastseo` package. [#19812](https://github.com/Yoast/wordpress-seo/pull/19812)
* Optimizes the English frequency list, for example by removing plural forms duplicates and words shorter than the length limit. [#19877](https://github.com/Yoast/wordpress-seo/pull/19877)
* Refactors the transition words, passive voice, text presence, and sentence beginnings assessments into classes.
* Removes `ProductSKUAssessment`, `ProductIdentifiersAssessment`, and `ImageAltTagsAssessment` from the assessments module. [#20025](https://github.com/Yoast/wordpress-seo/pull/20025)
* Removes the Flesch Reading Ease assessment from the blog posts and pages assessors.
* Removes the _word complexity_ assessment's config from the language-specific researcher. [#19877](https://github.com/Yoast/wordpress-seo/pull/19877)
* Removes the `Images` assessment from related keyphrase analysis in `productPages`.
* Removes the `templates` directory from the package. [#21312](https://github.com/Yoast/wordpress-seo/pull/21312)
* Removes the beta badge from the result of the WordComplexityAssessment. [#19140](https://github.com/Yoast/wordpress-seo/pull/19140)
* Removes the deprecated `SnippetPreview` from the `App`. [#21327](https://github.com/Yoast/wordpress-seo/pull/21327)
* Removes the logic to initialize  _keyphrase distribution assessment_ from the worker and app. [#19824](https://github.com/Yoast/wordpress-seo/pull/19824)
* Removes the logic to initialize the _word complexity_ assessment from the worker and the app. [#19812](https://github.com/Yoast/wordpress-seo/pull/19812)
* Renames the 'Keyphrase in title' SEO assessment to 'Keyphrase in SEO title', including its research file from `findKeyphraseInPageTitle` to `findKeyphraseInSEOTitle`. [#18504](https://github.com/Yoast/wordpress-seo/pull/18504)
* Replaces lodash-es dependency with lodash. [#21287](https://github.com/Yoast/wordpress-seo/pull/21287)
* Resolves a typo in a feedback string in the `cultureAssessments.js` file. [#19070](https://github.com/Yoast/wordpress-seo/pull/19070)
* Resolves a typo in the list of German transition words. [#21266](https://github.com/Yoast/wordpress-seo/pull/21266)
* Updates documentation on scoring for the _keyphrase in image assessment_. [#20580](https://github.com/Yoast/wordpress-seo/pull/20580)
* Updates the analysis documentation for transition words assessment. [#19104](https://github.com/Yoast/wordpress-seo/pull/19104)

### Non user facing
* Activates the consecutive sentences assessment for Japanese.
* Adapt the `getKeywordDensity` research so that a `getWordsCustomHelper` is used when available and adds unitests for Japanese.
* Adapts Keyphrase in title assessment for Japanese and adds a custom Japanese `findKeywordInPageTitle` research file.
* Adapts _text competing links_ assessment to use the HTML parser. [#20072](https://github.com/Yoast/wordpress-seo/pull/20072)
* Adapts `findTransitionWords` research for Japanese.
* Adapts `functionWordsInKeyphrase` research for Japanese.
* Adapts `getKeywordDensity` research for Japanese.
* Adapts `getLinkStatistics` research for Japanese.
* Adapts `getParagraphLength` research for Japanese.
* Adapts `getProminentWordsForInternalLinking` research for Japanese.
* Adapts `getSubheadingTextLengths` for Japanese.
* Adapts `keyphraseDistribution` research for Japanese and adds Japanese topic length criteria config.
* Adapts `matchKeywordInSubheadings` research for Japanese.
* Adapts subheading distribution assessment for Japanese.
* Adapts the Mark object to allow for position based highlighting. [#20073](https://github.com/Yoast/wordpress-seo/pull/20073)
* Adapts the Paragraph length assessment for Japanese and adds a Japanese specific configuration file for the paragraph length assessment in non-product and product pages.
* Adapts the `getProminentWordsForInsights` research for Japanese.
* Adapts the `sentencesCountFromText` research for Japanese.
* Adapts the functionality to mark words in a sentence for Japanese.
* Adapts the keyphrase length assessment for Japanese so that it uses custom scoring config and counts keyphrase length in characters instead of words.
* Adapts the sentence length assessment for Japanese.
* Adapts the text length assessment for Japanese.
* Adds "OCD" to the terms that are targeted by the _inclusive language assessment_. [#19327](https://github.com/Yoast/wordpress-seo/pull/19327)
* Adds "normal" and "abnormal" to the terms that are targeted by the _inclusive language assessment_ in specific contexts. [#19354](https://github.com/Yoast/wordpress-seo/pull/19354)
* Adds Farsi transition words and activates the transition words assessment.
* Adds Greek transition words and activates the transition words assessment.
* Adds Japanese folder and Researcher.
* Adds Japanese quotes to the function that checks whether a keyphrase is enclosed in double quotes in the findKeywordInPageTitle research.
* Adds Japanese sentence beginning exceptions.
* Adds Japanese transition words and activates the transition words assessment.
* Adds `customGetStemmer` and `determineStem` helper for Japanese.
* Adds `position` of the matched keyphrase in the returned object of `matchTextWithArray.js` and `findKeywordFormsInString.js`.
* Adds `textTitle` data to `Paper` attribute. [#18848](https://github.com/Yoast/wordpress-seo/pull/18848)
* Adds a ESLint ignore rule to trigger the tests in the CI. [#20839](https://github.com/Yoast/wordpress-seo/pull/20839)
* Adds a Japanese full text test.
* Adds a `getContentWords` helper and adds function words list for Japanese.
* Adds a custom `morphology` research for the Japanese language and edits an HTML tag typo in `matchStringWithRegexSpec.js`.
* Adds a feature-flag for Farsi support.
* Adds a feature-flag for Japanese support.
* Adds a function to split sentences in tokens in Japanese without changing the position of characters. [#20381](https://github.com/Yoast/wordpress-seo/pull/20381)
* Adds a function to split sentences in tokens without changing the position of characters. [#20087](https://github.com/Yoast/wordpress-seo/pull/20087)
* Adds a functionality in estimating reading time of a text to use characters per minute formula and adds the reading time score for Japanese.
* Adds a helper `checkIfWordIsFunction` for German. [#19898](https://github.com/Yoast/wordpress-seo/pull/19898)
* Adds a helper to create word forms for Japanese.
* Adds a helper to return the supported languages for Word complexity assessment. [#18680](https://github.com/Yoast/wordpress-seo/pull/18680)
* Adds a language folder and Researcher for Greek.
* Adds a missing plural variant of a feedback string for the keyphrase length assessment in product pages.
* Adds a paper and unit tests to test the assessments for Greek and edits a typo in the Greek morphologyData file path in `getMorphologyData.js`.
* Adds a rule to the inclusive language feedback string for 'Third World' so that it's not shown when 'Third World' is followed by 'country. [#18781](https://github.com/Yoast/wordpress-seo/pull/18781)
* Adds a safeguard to check if `wpseoAdminL10n` is defined in the `createWorker.js`. [#19212](https://github.com/Yoast/wordpress-seo/pull/19212)
* Adds a script implemented as a Jest test to export the inclusive language configuration into more readable formats. [#19081](https://github.com/Yoast/wordpress-seo/pull/19081)
* Adds a spec file for `getLanguagesWithWordFormSupport.js`. [#18315](https://github.com/Yoast/wordpress-seo/pull/18315)
* Adds a step to exclude Table of Contents in `sanitizeString.js` helper and uses this helper in Japanese `countCharacters` and `getWords` helpers.
* Adds a word complexity research and assessment for German. [#18673](https://github.com/Yoast/wordpress-seo/pull/18673)
* Adds a word complexity research and assessment for Spanish. [#18678](https://github.com/Yoast/wordpress-seo/pull/18678)
* Adds additional entries for the inflectional forms of the current non-inclusive phrases, if applicable. [#19348](https://github.com/Yoast/wordpress-seo/pull/19348)
* Adds an additional property to the `Mark` object, which can check which field to apply the marking to. [#19089](https://github.com/Yoast/wordpress-seo/pull/19089)
* Adds custom `keyphraseLength` research for Japanese.
* Adds documentation of the scoring criteria of the assessments.
* Adds external stemmer for Greek.
* Adds feedback and suggested alternatives for different phrases with "crazy" to the _inclusive language assessment_. [#19402](https://github.com/Yoast/wordpress-seo/pull/19402)
* Adds full text tests for product pages and collection pages assessments.
* Adds inclusive language assessments that are only not inclusive in the case they are followed by a function word (excl. nouns), a participle (or simple past tense) or a punctuation mark. [#19228](https://github.com/Yoast/wordpress-seo/pull/19228)
* Adds links between newly created readme files and edit two minor typos. [#18189](https://github.com/Yoast/wordpress-seo/pull/18189)
* Adds missing development dependency on `eslint-config-yoast`. [#20916](https://github.com/Yoast/wordpress-seo/pull/20916)
* Adds missing researcher parameter in assessors.
* Adds more words to the frequencyList for the Spanish Word complexity assessment. [#18685](https://github.com/Yoast/wordpress-seo/pull/18685)
* Adds position information for tokens.  [#20131](https://github.com/Yoast/wordpress-seo/pull/20131)
* Adds position information to nodes in the HTML tree. [#20026](https://github.com/Yoast/wordpress-seo/pull/20026)
* Adds sentences to paragraph and heading nodes. [#20019](https://github.com/Yoast/wordpress-seo/pull/20019)
* Adds the option to pass a custom `matchWordInText` helper and a helper for matching Japanese keyphrases in the `findKeywordInFirstParagraph` research.
* Adds the option to pass a custom matchWordInText helper and a helper for matching multiword keyphrases in the findKeywordInPageTitle research.
* Adds the option to pass a language-specific `getWords` helper to the `getSentenceBeginnings` research.
* Adds the possibility to change the links to the "learn more" URLs in the Inclusive language assessments. [#19360](https://github.com/Yoast/wordpress-seo/pull/19360)
* Adds type validation to the `registerResearch` method in `AnalysisWebWorker.js` and unit tests to test the method. [#19783](https://github.com/Yoast/wordpress-seo/pull/19783)
* Adds unit tests for each phrase in the _inclusive language assessment_. [#19597](https://github.com/Yoast/wordpress-seo/pull/19597)
* Adds unit tests that cover Japanese strings in `metaDescriptionLengthSpec` research file.
* Adjusts Farsi full text tests papers.
* Adjusts _Keyphrase distribution_ assessment's applicability to also take its research availability into account. [#19899](https://github.com/Yoast/wordpress-seo/pull/19899)
* Adjusts a failing unit test and comments out unit tests that are temporarily failing. [#18653](https://github.com/Yoast/wordpress-seo/pull/18653)
* Adjusts the English papers in full text tests for product pages.
* Allows Marks to replace with position information.  [#20026](https://github.com/Yoast/wordpress-seo/pull/20026)
* Also changes default config value for the assessVariants variable in the assessments to `true`, to consistently have the WooCommerce value as the default. [#18918](https://github.com/Yoast/wordpress-seo/pull/18918)
* Avoids early conversion of the HTML entity `&nbsp;` to its reserved character when running the analysis and adds `#nbsp;` as a word delimiter. [#20950](https://github.com/Yoast/wordpress-seo/pull/20950)
* Builds the tree in the worker using the unmodified `Paper._text`. [#20185](https://github.com/Yoast/wordpress-seo/pull/20185)
* Changes applicability conditions for the SKU and Product identifier assessments.  [#18918](https://github.com/Yoast/wordpress-seo/pull/18918)
* Changes the applicability criteria of the transition words, subheading distribution, and keyphrase density assessments for Japanese so that the minimum required text length is expressed in characters instead of words.
* Changes the feedback of Flesch reading ease in the insights tab when there is not enough text. [#18631](https://github.com/Yoast/wordpress-seo/pull/18631)
* Changes the feedback string for the non-inclusive phrase "binge".  [#19348](https://github.com/Yoast/wordpress-seo/pull/19348)
* Changes the helper to match word in text for Japanese in `altTagCount`.
* Changes the maximum recommended sentence length in Farsi to 25 words.
* Cleans up spec descriptions for assessing text and paragraph length.
* Correctly calculates token and sentence positions for texts containing HTML comments, `&lt;code&gt;`, `&lt;script&gt;`, and image elements. [#20185](https://github.com/Yoast/wordpress-seo/pull/20185)
* Creates Japanese helper file for matching word in text.
* Creates a custom helper for finding exact matches of multiword keyphrases in title in Japanese.
* Creates a helper for splitting a Japanese text into words using the TinySegmenter package, and adds Japanese punctuation to the removePunctuation helper. Also changes the global Jest testing environment from `node` to `jsdom`.
* Creates an interface to register helper in the worker, and to add custom helpers to the researcher. [#19783](https://github.com/Yoast/wordpress-seo/pull/19783)
* Creates the anchor opening tag after merging the configs in _keyphrase distribution_ and _word complexity_ assessments. [#19913](https://github.com/Yoast/wordpress-seo/pull/19913)
* Disables some new import ESLint rules for now, coming from `eslint-plugin-import`. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Disables the keyphrase in slug assessment for Japanese.
* Do not try to get a descendant node's end tag in the `getSentencePositions` function if the node doesn't have an end tag. [#20121](https://github.com/Yoast/wordpress-seo/pull/20121)
* Edits spec files by reorganising unit-tests to match the assessment files they appear in and renames unit-test titles and adds punctuation. [#19349](https://github.com/Yoast/wordpress-seo/pull/19349)
* Edits the links to two documentation files and the size of the image displaying the assessments bullets. [#18234](https://github.com/Yoast/wordpress-seo/pull/18234)
* Ensures matching of feedback strings to the severity of non-inclusiveness. [#19375](https://github.com/Yoast/wordpress-seo/pull/19375)
* Filters out elements that we don't want to analyze before tokenizing them. [#20075](https://github.com/Yoast/wordpress-seo/pull/20075)
* Fixes a bug where an invalid browser field in package.json would cause Vite to throw an error when building.
* Fixes a bug where the inclusive language feedback in the publish box was not synchronized with the metabox in the classic editor. [#18813](https://github.com/Yoast/wordpress-seo/pull/18813)
* Fixes a bug where the results of the SEO analysis of the focus keyphrase were removed when more than two related keyphrases were analyzed. [#17846](https://github.com/Yoast/wordpress-seo/pull/17846)
* Fixes a failing test in English paper. [#18672](https://github.com/Yoast/wordpress-seo/pull/18672)
* Fixes a failing unit test. [#18671](https://github.com/Yoast/wordpress-seo/pull/18671)
* Fixes a small grammatical error in the feedback string of the wordcomplexity assessment. [#18644](https://github.com/Yoast/wordpress-seo/pull/18644)
* Fixes a typo that caused the `findList` research to not be used in the `ListAssessment`.
* Fixes an unreleased bug where tokens would get the incorrect offsets if they were not in the first sentence of the paragraph. [#20197](https://github.com/Yoast/wordpress-seo/pull/20197)
* Fixes assessment result links that omit tracking parameters.
* Fixes highlights for sentence length assessment for other editors.
* Fixes the Japanese full text test.
* Fixes the error shown for Single title assessment in Block editor when one of the H1s doesn't have text. [#20649](https://github.com/Yoast/wordpress-seo/pull/20649)
* Fixes the prominent words functionality in content-analysis app.
* Fixes two failing tests possibly caused by the changes to passive voice detection made for [Portuguese](https://github.com/Yoast/wordpress-seo/pull/19411).
* Implements a filter for the html tree. [#20024](https://github.com/Yoast/wordpress-seo/pull/20024)
* Implements passive voice assessment for Greek.
* Implements the Product identifier/Barcode assessment and temporarily disables it until the necessary data from Woo and Shopify become available. [#18609](https://github.com/Yoast/wordpress-seo/pull/18609)
* Implements the SKU assessment and temporarily disables it until the necessary data from Woo and Shopify become available. [#18656](https://github.com/Yoast/wordpress-seo/pull/18656)
* Implements the consecutive sentences assessment for Farsi to ensure variety in a text.
* Implements the consecutive sentences assessment for Greek to ensure variety in a text.
* Implements the passive voice assessment for Farsi.
* Imports the e-Commerce assessors' dependencies from `index.js` if applicable. [#19921](https://github.com/Yoast/wordpress-seo/pull/19921)
* Improves internal imports. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Improves keyphrase recognition in Greek by filtering out function words such as `στον`, `τρίτος`, `τέτοιους`, `ποιανής`.
* Improves the Farsi passive voice assessment by expanding the list of passive verb forms.
* Improves the feedback string for the potentially non-inclusive term 'minorities' in `otherAssessments.js`. [#20768](https://github.com/Yoast/wordpress-seo/pull/20768)
* Improves the way keyphrase enclosed in double quotes is matched in Keyphrase in title assessment for Japanese.
* Makes Consecutive sentence, Passive voice and Transition words assessments available for Farsi when the Feature flag is enabled.
* Makes it possible to tokenize sentences in Japanese.
* Makes passive voice and function words in keyphrase assessments available for Greek.
* Makes spec helpers `hasResearch`, `hasConfig` and `hasHelper` available for tests in wordpress-seo-premium.  [#19912](https://github.com/Yoast/wordpress-seo/pull/19912)
* Makes the SKU assessment not applicable when we cannot detect the SKU on products without variants. [#18905](https://github.com/Yoast/wordpress-seo/pull/18905)
* Moves `processExactMatchRequest` helper from `findKeywordInPageTitle.js` to a separate helper file.
* Moves some non-inclusive phrases away from the `otherAssessments.js` file to more specific locations and creates a new `sexualOrientationAssessments.js` file. [#19349](https://github.com/Yoast/wordpress-seo/pull/19349)
* Moves the frequency lists of the _word complexity_ assessment out of the package. [#20695](https://github.com/Yoast/wordpress-seo/pull/20695)
* Moves the initialization of Keyphrase distribution assessment inside `AnalysisWebWorker.js`.
* Moves the logic in `findList` research to the `ListAssessment`. [#19780](https://github.com/Yoast/wordpress-seo/pull/19780)
* Moves the word "oriental" category to context-specific orange cases in _inclusive language analysis culture assessment_ and adds exceptions for phrases "exotic shorthair" and "exotic longhair". [#19328](https://github.com/Yoast/wordpress-seo/pull/19328)
* Moves the word "oriental" category to context-specific orange cases in _inclusive language analysis_ culture assessment. [#19301](https://github.com/Yoast/wordpress-seo/pull/19301)
* Now published as a transpiled package.
* Only marks the subheading when a subheading text is too long in _subheading distribution_ assessment. [#19089](https://github.com/Yoast/wordpress-seo/pull/19089)
* Parses WordPress block information and set them to the tree when building it. [#20330](https://github.com/Yoast/wordpress-seo/pull/20330)
* Provides block information when creating Mark object for Single H1 assessment. This way, the position-based highlighting approach will be used in Block editor. [#20633](https://github.com/Yoast/wordpress-seo/pull/20633)
* Recalibrates the recommended length of the text on taxonomy and collection pages for the _text length_ assessment. [#21259](https://github.com/Yoast/wordpress-seo/pull/21259)
* Recognises internal link if the site's host is null but the site domain and the link host are the same. [#18014](https://github.com/Yoast/wordpress-seo/pull/18014)
* Refactors the `isInternalLink` helper to improve clarity. [#18172](https://github.com/Yoast/wordpress-seo/pull/18172)
* Refactors the unit tests for SEO, related keyphrase, and taxonomy assessors. [#20070](https://github.com/Yoast/wordpress-seo/pull/20070)
* Refactors the unit tests for SEO, related to the Keyphrase in image text assessment. [#20102](https://github.com/Yoast/wordpress-seo/pull/20102)
* Removes WordComplexity and KeyphraseDistribution assessments from productPages assessors.  [#19897](https://github.com/Yoast/wordpress-seo/pull/19897)
* Removes _keyphrase distribution_ and _word complexity_ assessments from non-product eCommerce assessors. [#19913](https://github.com/Yoast/wordpress-seo/pull/19913)
* Removes any HTML whitespace padding and replaces it with a single whitespace in getSentenceBeginning.js. [#18475](https://github.com/Yoast/wordpress-seo/pull/18475)
* Removes codes that are not relevant anymore which were introduced in [this PR](https://github.com/Yoast/wordpress-seo/pull/17577).
* Removes images from the text before tokenizing it into sentences in `getSentences.js`. [#19399](https://github.com/Yoast/wordpress-seo/pull/19399)
* Removes superfluous full text test papers for all languages in the yoastseo package.
* Removes superfluous full text test papers for all languages in the yoastseo package. [#18278](https://github.com/Yoast/wordpress-seo/pull/18278)
* Removes the Farsi feature flag.
* Removes the step to modify the `Paper._text` in the worker. [#20185](https://github.com/Yoast/wordpress-seo/pull/20185)
* Removes the word "Ebonics" from the list of non-inclusive phrases. [#20755](https://github.com/Yoast/wordpress-seo/pull/20755)
* Removes unnecessary language-specific tests for assessments and researchers, and comments out unnecessary-but-nice-to-have language-specific tests (they will be moved to separate files in a separate PR). [#18397](https://github.com/Yoast/wordpress-seo/pull/18397)
* Replaces 'words' with 'characters' in the Japanese feedback strings for the Subheading distribution, Paragraph length, Sentence length, Keyphrase length, and Text length assessments.
* Replaces Images assessment `countVideos` value that is passed to the assessment constructor in the product assessors with a variable.
* Replaces the feedback strings for generalization/overgeneralization phrases with `potentiallyHarmful` feedback string in _inclusive language_ analysis. [#20767](https://github.com/Yoast/wordpress-seo/pull/20767)
* Replaces the feedback strings for generalizing/overgeneralizing phrases with the potentiallyHarmful feedback string in inclusive language analysis. [#20766](https://github.com/Yoast/wordpress-seo/pull/20766)
* Restores the `unifyNonBreakingSpace` santization step in `getSentences.js`. [#18739](https://github.com/Yoast/wordpress-seo/pull/18739)
* Updates README.md for Greek support.
* Updates `README.md` for Farsi support.
* Updates `README.md` for Japanese support.
* Updates the dependencies, improves the configuration and cleans up old code. [#20651](https://github.com/Yoast/wordpress-seo/pull/20651)
* Updates the documentation for _single title_ assessment. [#19084](https://github.com/Yoast/wordpress-seo/pull/19084)
* Uses direct imports when possible, instead of relying on the full exported object. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)

## 1.91.2 March 2nd, 2023
### Bugfixes
* Fixes a potential security issue.

## 1.91.1 January 25th, 2023
### Bugfixes
* Fixes a bug where an invalid browser field in package.json would cause Vite to throw an error when building.

## 1.89.0 January 25th, 2021
### Enhancements
* Adds Turkish stemmer.
* Adds function words for Turkish.
* Adds the consecutive sentences beginnings assessment for Turkish.
* Adds the sentence length assessment for Turkish.
* Implements the passive voice assessment for Turkish.
* Implements the transition words assessment for Turkish.

## 1.88.0 January 12th, 2021
### Enhancements
* Adds function words for Norwegian.
* Adds Norwegian stemmer.

## 1.87.0 December 14th, 2020
### Enhancements
* Implements the Hungarian passive voice.
* Implements Hungarian stemmer.
* Edits typos and add more transition words for Hungarian.
* Adds function words for Hungarian.
* Adds the sentence beginning assessment and specs for Hungarian.
* Adds specs for the sentence length assessment in Hungarian.

## 1.86.0 November 30th, 2020
### Enhancements
* Adds prefixes `وبال, مست, تنن, است, نست, ولل, كال, فال, بال, وال, لن, سن, ست, ات, وس, فل, فب, فس, لل, ول, وب, ال` to the list of ignored prefixes for Arabic. When the Arabic keyphrase is preceded by one of these prefixes, the basic keyphrase forms will also be created.

### Bugfixes
* Fixes a bug where links that contain line terminators (`\n`, `\r`, `\u2028` or `\u2029`) would not be detected as a link.

## 1.85.0 November 16th, 2020
### Enhancements
* Implements Hebrew stemmer.
* Implements the transition words assessment for Hebrew.
* Adds Hebrew papers and specs to check the assessments functionality for Hebrew.
* Adds the consecutive sentences assessment for Hebrew.
* Adds Sentence length assessment for Hebrew.
* Adds passive voice assessment for Hebrew, including a check, a number of specs and a list of Hebrew verb roots, both in their original and (for some) modified version.
* Adds the words 'annoyed', 'depressed', 'disappointed', and 'upset' to the list of English non-passives.
* Adds Swedish, Indonesian, Arabic, Hebrew, and Farsi to the list of languages with function words, to which a different scoring system applies for the keyphraseDistribution assessment.

## 1.84.0 October 26th, 2020
### Enhancements
* Expands list of exceptions for Indonesian words that look like passive voice forms but are not and adds a rule that checks for those exceptions.

### Bugfixes
* Adds various quotation marks to `wordBoundaries` and `removePunctuation`.

## 1.83.0 October 13th, 2020
### Enhancements
* Creates basic keyphrase forms for Farsi when they have the following affixes: prefix `ن`, and suffixes `مان, شان, تان, ش, ت, م, ی` and their variations such as ` ‌اش, ‌ات, یی, یم, یت, یش, ‌ای, ‌ام`.
* Adds function words for Farsi and edits a typo in the Arabic function words file.

## 1.82.0 September 14th, 2020
### Enhancements
* Adds the following words to the list that's used for the English transition word assessment: 'note that', 'not only', 'initially', 'as opposed to'.
* Improves word tokenization when words are followed by specific Arabic or Urdu punctuation marks.
* Adds passive voice assessment for Arabic, including a check, and a list of Arabic passive verbs with long vowel in their root.
* Adds the consecutive sentences assessment for Arabic.
* Implements the transition words assessment for Arabic.
* Adds the prefixes س and أ to the list of ignored prefixes for Arabic. When the Arabic keyphrase is preceded by س and أ, the basic keyphrase forms will also be created.
* Adds and refactors an external stemmer for Arabic.

### Bugfixes
* Fixes the URL of the assessment image in the readme. Props to [Güven Atbakan](https://github.com/shibby).

### Other
* Sets the threshold for words to be recognized as prominent words from 4 to 2, in case a language has no morphology support. This increases the chance that different word forms are saved, leading to better internal linking suggestions for these languages.

## 1.81.0 August 31st, 2020
### Enhancements
* Adds more Polish function words.
* Adds word form functionality for Polish.
* Makes feedback string in the keyphrase in subheadings assessment more explicit.
* Improves keyphrase recognition for Hebrew.
* Adds function words for Hebrew.

### Bugfixes
* Fixes a bug where closing parentheses would always be regarded as sentence endings in RTL languages.
* Fixes a bug where closing parentheses would always be regarded as sentence endings when followed by an upper-case letter.

## 1.80.0 August 17th, 2020
### Enhancements
* Makes it possible to tokenize sentences in languages that are written right-to-left (e.g., Hebrew, Arabic, Farsi and Urdu).
* Improves keyphrase recognition for Arabic.
* Adds function words for Arabic and Hebrew.
* Adds Sentence beginning assessment for Indonesian.
* Adds Transition words assessment for Indonesian.
* Adds Passive voice assessment for Indonesian.
* Adds Flesch reading ease assessment for Portuguese.
* Adds passive voice assessment for Portuguese.
* Fixes inconsistency in feedback strings that are produced by the Keyphrase in SEO Title assessment.

## 1.79.0 August 3rd, 2020
### Enhancements
* Adds some irregular plural forms of Italian words to function words and morphologyData file, including specs and a function to call the exception list.
* Adds a check for whether the word belongs to stemming exceptions to the Russian stemmer.
* Adds an exception check for irregular Italian diminutives to the Italian stemmer.
* Adds a check for exception lists of full forms and words with multiple stems to the Russian stemmer.
* Adds specs for irregular verbs for the Italian full forms exception list.
* Adds check for French verbs on -ions before stemming the verb suffix -ons and does not stem -ons if the word ends on -ions (for these words, the suffix is most likely -s, not -ons).
* Adds Indonesian function words.
* Changes the `getProminentWordsForInternalLinking` research so that it only runs for texts over 400 words or texts over 300 words with a title and/or a metadescription specified.
* Changes the output of the research so that it not only returns the list of prominent words but also information about the presence of metadescription and title, as well as the length of text. This information is later used to return a customized message to the user, within the internal linking suggestions container.

## 1.78.0 July 20th, 2020
### Enhancements
* Adds word form support for Portuguese.
* Adds word form support for Indonesian.
* Adds a check for keywords containing a dash as part of the word (e.g., buku-buku) so that they can be found in the slug.
* Adds "кроме того" to Russian transition words.
* Adds a check for whether the word belongs to stemming exceptions to the Russian stemmer.
* Adds an exception check for irregular Italian diminutives to the Italian stemmer and removes _scrivere_, _scrive_, and _scritto_ from function words.
* Adds a check for exception lists of full forms and words with multiple stems to the Russian stemmer.
* Adds some irregular plural forms of Italian words to function words and morphologyData file, including specs and a function to call the exception list.
* Improves the feedback text for the _keyphrase in title_ assessment to make clear that an exact keyphrase match is necessary.

## 1.77.0 June 22nd, 2020
### Enhancements
* Adds check for stemming -ons suffix in French, and for the exception list of words where only -s should be stemmed in French.
* Adds check for nouns in Russian on _ость_ before removing verb suffixes (including the newly added suffix _ть_).

## 1.76.0 June 8th, 2020
### Enhancements
* Adds a check for the exception list of French verbs with multiple stems and stems them by returning the indicated canonical stem.
* Adds a stemmer for the Italian language.
* Adds an exception check for words ending in -is/us/os where -s should not be stemmed.
* Improves the way keyphrases containing words ending in "ent" are recognized in the text.
* Stems French words that are considered too short to be stemmed according to the stemming rules, but that should nevertheless be stemmed.

## 1.75.0 May 25th, 2020
### Enhancements
* Adds a stemmer for the Russian language.
* Adds checks for exception list with full forms and exception list of words with multiple stems to the French stemmer.
* Checks an exception list of plurals with -x suffix and stems them correctly.
* Transfers data from French stemmer to data file and improves stemming of words in -issement in French.

## 1.74.0 May 11th, 2020
### Added
* Adds French to the list of languages for which we have morphology support.
* Adds word forms support for French in a beta version.

### Changed
* Improves the transition word assessment for Hungarian. Props to [@Zsoru](https://github.com/Zsoru).
* Improves the way diminutive nouns are stemmed.

### Fixed
* Makes sure that lists with single words don't skew the keyphrase distribution score.

## 1.72.0 April 9th, 2020
### Added
* Adds word-form support for Spanish.

### Fixed
* Fixes a bug where the text analysis would break if the text contains the word "Ying".

## 1.71.0 March 30th, 2020
### Enhancements:
* Adds word form support for Dutch.

## 1.66.0 January 6th, 2019
### Other
* Drops IE11 support through configuring Babel to use the preset environment with the own list of supported browsers specified.
* Adds a way to register a custom parser for parsing a paper to a structured tree representation, ready for further analysis.
* Adds a new attribute to the `Paper`: `wpBlocks`, to be used to send WordPress block editor data to the analysis.

## 1.65.1 December 11th, 2019
* Fixes a bug where the metabox would be broken when a relative URL was configured as `WP_CONTENT_URL`. Props to [FPCSJames](https://github.com/FPCSJames).

## 1.63.0 November 13th, 2019
### Fixed
 * Fixes a bug where the verb form `landscape` was not recognized in the text when the keyphrase contained the verb `landscaping`.

## 1.62.0 October 29th, 2019
### Enhancements:
 * Adds a new Readability Score of 0 and "Not Available". Changes Readability for empty content from "Needs Improvement" to "Not Available". Props to [emilyatmobtown](https://github.com/emilyatmobtown)

## 1.61.0 October 14th, 2019
### Added
* Adds the transition word assessment for Hungarian, props to [9abor](https://github.com/9abor)

## 1.60.0 September 30th, 2019
No user-facing changes.

## 1.59.0 September 16th, 2019
No user-facing changes.

## 1.58.0 September 3rd, 2019
### Enhancements:
* Implements the assessment that checks whether multiple sentences begin with the same word for Portuguese, props to [amesdigital](https://github.com/amesdigital).
* Increases the recommended sentence length limit for Portuguese, props to [amesdigital](https://github.com/amesdigital).

## 1.57.0 July 22nd, 2019
### Changed
* No user-facing changes.

## 1.56.0 July 8th, 2019
### Changed
* Changes the following improved internal linking functionality (which is disabled by a feature flag by default):
  * Bumps the minimum number of required word occurrences from 2 to 4 (when extracting prominent words for internal linking).

## 1.55.0 June 24th, 2019
### Changed
* Updated the CSS autoprefixer configuration to drop support for old Internet Explorer versions.

## 1.54.0 June 11th, 2019
### Added
* Adds an improved internal linking functionality behind a feature flag. For now, this new functionality is disabled by default. Specifically, the new internal linking functionality has the following improvements:
  * Changes the way prominent words are extracted for the Internal linking suggestions and Insights features. No multiple-word combinations are considered anymore, but single words only. For languages with morphological support (currently English and German) different morphological forms of words (e.g., `link`, `linking`, `links`, `linked`) are recognized and collapsed together, which improves the performance of the said features.
  * Changes the Insights functionality in the following way: no words that occurred less than 5 times in the text of the post are displayed. For languages with morphological support (for now, English and German) different word forms of the same word are collapsed based on their stem/base form (e.g., the stem of words `link`, `linking`, `links`, and `linked` is `link`). If the stem coincides with an actual word used in the text, it is displayed to the user in the list of Insights. If the stem does not coincide with any words used in the text, the first word form of the stem that occurred in the text will be used for display.
  * Changes the Internal linking suggestions functionality in the following way: not only the text of the post but also different meta data fields are used for analysis, i.e., title, keyphrase, synonyms, meta description, subheadings (H2 and H3 levels). One occurrence of a word in the said meta data fields is deemed more important than one occurrence of this word inside the text. Stems are further saved in the database and used for matching of prominent words between posts and the internal linking functionality.

## 1.52.0 May 14th, 2019
### Added
* Adds a dependency to `@yoast/feature-flag`.
* Adds createRegexFromArray export to yoastseo index.js.

### Fixed
* Improves keyphrase recognition for additional irregular verbs in German (e.g., `brennen`, `senden`, `kennen`).

## 1.51.0 April 29th, 2019
### Added
* Adds functionality to specify a custom premium-configuration branch to use for tests, locally and on Travis.

### Fixed
* Adds error handling to the YoastSEO development tool, when building the tree for visualization purposes.
* Fixes the parsing of paragraphs within headings when using the tree parser. Previously, it crashed the building of the tree.

### Changed
* Improves the recognition of German keyphrases that include words with an `i` or `e` in between vowels (e.g., `schrieen`, `schreien`, `speie`).
* Rewrites the SEO and readability analysis such that it uses both the original assessors as well the new tree assessors. The results of both are combined and their scores aggregated.

## 1.50.0 April 1st, 2019
### Added
* Adds word form recognition for German.
* Adds more transition words for Swedish.
* Adds visualization of the tree to the dev tool.

### Changed
* Increases the recommended sentence length limit for Spanish and Catalan, props to [Sílvia Fustegueres](https://www.ampersand.net/en/).
* Improves list of Catalan transition words, props to [Sílvia Fustegueres](https://www.ampersand.net/en/).

### Fixed
* Fixes a bug that impeded recognition of word forms for keyphrases on taxonomy pages.

## 1.49.0 March 11th, 2019
### Added
* The recalibrated analysis is out of its beta phase and is now the default for the SEO analysis. Thanks for testing and giving us your valuable feedback! You are awesome!

### Fixed
* Changes the text read out by a screen reader from `Bad SEO score.` to `Needs improvement.` when focused on the SEO score indicator in the menu bar and the traffic light in the snippet preview.

### Changed
* Props to [Kingdutch](https://github.com/Kingdutch) for helping us to improve our open source content analysis library.

## 1.48.0 February 25th, 2019
### Added
* Improves the feedback for the assessment that checks the length of the text in cornerstone articles.

### Fixed
* Fixes a bug where a Flesch reading ease score of exactly 90 would incorrectly trigger a red bullet.

## 1.47.0 February 11th, 2019
### Fixed
* Fixes accidental removal of the SEO Assessor export from the index. Props [Kingdutch](https://github.com/Kingdutch).

## 1.46.0 January 21st, 2019
### Added
* Adds readability analysis for Swedish.
* Adds prominent words for Swedish.
* Improves keyword recognition in Swedish by filtering function words.
* Improves the transition word assessment for German.
* Improves the error logging when there is an error in an SEO or readability assessment.

## 1.45.0 January 7th, 2019
### Fixed
* Fixes a bug where special characters from certain word lists weren't correctly escaped when matched with a regex. This resulted in `eggs` being incorrectly matched as the transition word `e.g.`, for example.
* Fixes a crash when loading the createWorker module because the window was accessed in the global scope immediately.

### Added
* When the recalibration feature flag is switched on:
  * The single title assessment is added. This assessment makes sure that you don't use superfluous H1s in your text.
  * The following assessments are not used anymore:
    * The assessment checking the length or your URL.
    * The assessment checking whether your URL contains stopwords.
  * Assessments changes:
    * Keyphrase density: changes scoring schema to account for the length of the keyphrase and changes feedback strings so that we give feedback about the number of occurrences rather than a percentage.
    * Outbound links assessment: changes the scoring schema so that red bullet instead of an orange bullet is shown when you have no outbound links.
    * Image alt attributes: if there are at least 5 images, checks whether the alt tags contain the keyphrase or synoynyms in 30-70% of all images. If there are less than 5 images, 1 image with the keyphrase or synonym in the alt tag is still scored as good.
    * Keyphrase in title: function words preceding the exact match keyphrase are ignored when determining the position of the keyphrase in the title.
    * Keyphrase length: makes the scoring scheme less strict for languages that don't have function word support, so that for these languages keyphrases with 1-6 words are scored as green, 7-9 as orange, and more than 9 as red.
    * Keyphrase in subheading: only takes H2 and H3 level subheadings into account and changes the scoring schema so that 30%-75% of these subheadings need to include the keyphrase or its synonyms. In languages without function word support, a match is only counted if all the words from the keyphrase/synonym appear in the subheading.
    * Text length: on taxonomy pages, the recommended minimum text length is increased from 150 to 250 words.
* The browser console now shows more descriptive error messages when something went wrong during analyses in the web worker.

### Changed
* Improved README Usage to detail the Web Worker API.

## 1.44.0 December 14th, 2018
### Fixed
* Fixes a bug where keyphrases weren't recognized in the URL when the words in the URL were separated by underscore characters instead of hyphens.
* Fixes a bug that caused numbers to be stripped when marking a keyphrase containing a number, e.g. `Yoast SEO 9.3`.

### Added
* Adds relevant words from the browserified example to the dev tool.
* Adds the option to use local morphology data in the dev tool.

### Changed
* Improves error handling in the analysis web worker by rejecting the last request instead of just throwing an error.

## 1.43.0 November 19th, 2018
### Fixed
* Fixes assessments failing when using a `<` sign in the content.
* Fixes a bug where paragraphs were sometimes not correctly detected because paragraph tags were not automatically added in WordPress-like fashion.

### Added
* Adds toggles to use the different assessors in the webpack example (e.g., for all the different combinations for cornerstone and taxonomy pages and related keyphrase).
* Introduce logger in the AnalysisWebWorker to replace the development console log.

### Changed
* Refactor SEO assessment file names and exports. Props [Kingdutch](https://github.com/Kingdutch).
* Disables the non-functioning markers for the subheading distribution assessment.

## 1.42.0 November 5th, 2018

### Fixed
* Improves keyword recognition in the first paragraph on texts which start with images and captions.

### Other
* Removes non-functioning eye-markers from the link keyphrase assessment.

## 1.41.1 October 29th, 2018

### Fixed
* Fixes a bug where the Chrome browser tab would crash on Windows when a French or Italian text contains sentences in passive voice, props [CarloCannas](https://github.com/CarloCannas).
* Fixes a bug where the Yoast SEO analysis would error if used together with the DelightfulDownloads plugin.

## 1.41.0 October 22nd, 2018

### Added
* Introduces two new principles for keyword recognition:
  * Makes keyphrase recognition flexible with regards to word order. This means that the keyphrase `SEO WordPress plugin` will be found in the sentence `This is the most popular SEO plugin for WordPress.` In order to use exact matches, the keyphrase can be enclosed in quotation marks.
  * When matching keyphrases for the various assessments, the analysis only targets content words and ignores function words (e.g., `the` or `and`). This functionality is available in English, German, Dutch, French, Spanish, Italian, Portuguese, Russian and Polish.
* Implements support for word form recognition for keyphrases in English (requires Premium configuration).
* Improves the feedback texts for all SEO and readability assessments.
* Adds functionality to append a query string to the assessment links through the analysis worker.
* Adds an assessment that checks whether your keyword consists only of function words.

### Changed
* The analysis of the following assessments incorporates the new keyword recognition principles:
  * Image alt attributes: checks whether there’s at least one image with an alt tag that contains words from the keyphrase. An exact match isn’t required anymore.
  * Keyphrase in introduction: checks whether words from the keyphrase are matched within one sentence in the introduction or, if not, whether they are present in the first paragraph at all. An exact match isn’t required anymore.
  * Keyphrase in title: still checks whether an exact match of the keyphrase is found in (the beginning of) the title, but now also recommends improvement if all words from the keyphrase are found in the title.
  * Keyphrase length: has new boundaries to check whether the keyphrase is not too long. For languages that have support for function word stripping (see above), only content words are taken into account.
  * Keyphrase in meta description: checks how often all words from the keyphrase are matched within the meta description.
  * Keyphrase in subheading: checks whether at least one subheading contains more than half of the words from the keyphrase. An exact match isn’t required anymore.
  * Keyphrase in slug: checks whether a sufficient number of words from the keyphrase is used in the slug. The number of words required depends on the length of the keyphrase.
  * Keyphrase density: checks whether there are enough keyphrase matches; a match is defined as a sentence that contains all words from the keyphrase. The upper boundary for a good score is higher when word form recognition is available, since in that case the analysis is able to pick up more matches.
  * Link focus keyphrase: the assessment that checks whether you’re using your keyphrase to link to a different article doesn't require an exact match anymore.
  * Keyphrase distribution uses an improved algorithm that checks whether the keyphrase is evenly distributed throughout the text.
* The following assessments will also count synonym matches as keyphrase matches:
  * Image alt attributes
  * Keyphrase in introduction
  * Keyphrase in meta description
  * Keyphrase in subheading
  * Keyphrase distribution
* Deprecates the assessment that checks if stopwords are used within the keyphrase.
* The analysis for related keyphrases only shows assessments relevant for the specific keyphrase. It omits assessments that are non-keyphrase-related and assessments that should only be applied to the focus keyphrase.

### Fixed
* Fixes a bug where the keyword would not be found in the slug when containing punctuation, for example the keyphrase `apples & pears` in the slug `apples-pears`.

## 1.40.0 September 24th, 2018

### Bugs:

* Fixes a bug that caused keywords beginning with the Turkish characters `İ` / `i` and `I` / `ı` not to be recognized when changing that character from lowercase to uppercase and vice versa.

### Enhancements:

* Exposes word boundaries for use in other libraries or applications.

### Changed:

* Drops TypeScript support.
* Changes all usage of `lodash` to `lodash-es`.
* `index.js` has been rewritten to use ES6 Module import and export logic, instead of Node's `require` logic.

## 1.39.3 September 19th, 2018

### Bugs:

* Fixes a bug that would cause a browser crash in Chrome and Opera on Windows when the site language was Polish and the readability analysis was switched on.

## 1.39.2 September 6th, 2018

### Bugs:

* Fixes a bug where the readability analysis would not show the correct scores for cornerstone content.
* Fixes a bug where switching off the SEO analysis would stop the readability analysis from loading.

## 1.39.1 September 5th, 2018

* Fixes a bug where our JavaScript memory usage would increase indefinitely. This could result in a browser crash after a long enough period.

## 1.39 August 28th, 2018

### Enhancements
* Adds readability analysis for Polish.
* Adds prominent words for Polish.

## 1.38.4 September 5th, 2018

### Bugs:

* Fixes a bug where our JavaScript memory usage would increase indefinitely. This could result in a browser crash after a long enough period.

## 1.38.3 August 24th, 2018

### Bugs:

* Fixes an issue where the worker communication wouldn't work when the script was minified.

## 1.38.2 August 24th, 2018

### Bugs:

* Fixes an issue where we would show bad results for an empty Paper.

### Enhancements:

* Automatically parse and serialize all value objects send to and from the worker. This means `Paper` objects can be passed to the analysis wrapper.
* Add a method to the worker that can run any arbitrary research, `runResearch`.
* Add a priority system to the Scheduler, this means extensions run before the analysis to make sure they are loaded.
* Adds support for related keywords.

## 1.38.1 August 21st, 2018
* Improves web worker functionality.

## 1.38.0 August 21st, 2018
* Adds basic web worker functionality.

## 1.37.0 August 13th, 2018
* Updates the font size of the snippet title measure element to correctly mimic Google's desktop snippet title.
* Deprecates the switch assessor.

## 1.36.1 August 6th, 2018
### Changed
* Increased the debounce delay in the App to make sure the refresh is triggered less often.

## 1.36.0 July 24th, 2018
### Added
* Adds a link to a relevant article about re-using keywords to the feedback of the assessment that checks if the keyword was used previously.
* Exposes all assessments and more as a public API.
* Adds the passive voice assessment for Dutch.

### Changed
* Improves the order in which assessments are triggered. The keyword in the title is only checked once there's a title, the keyword in the introduction is only checked once there's a text, and the keyword in the meta description is only checked once there's a meta description.

### Fixed
* Fixes a bug that caused keywords to be incorrectly recognized within possessive forms (e.g. `Natalia` in `Natalia's fix`).
* Improves the recognition of keywords with special diacritics in the URL.
* Improves keyword recognition through adding Spanish inverted exclamation and question marks to the rules that determine word boundaries.

## 1.35.5 July 16th, 2018

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
