### 1.1

#### Backwards incompatible changes
* Passing the title, url and meta description meant for the snippet editor is no longer taken into account. The snippet
editor keeps track of these values itself.
* `callbacks.updateSnippetValues` has been deprecated in favor of `callback.saveSnippetData`. Currently a raw event is
passed to `updateSnippetValues`. This is undesirable because it couples the callback to the DOM. The new
`saveSnippetData` passes the actual data that the user put in the fields.
* The `SnippetPreview` object now requires an options object instead of an `App` object. The `App` object should still
be passed inside the options object with the `analyzerApp` key.


### 1.0: November 18th, 2015

#### Backwards incompatible changes

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

#### Features

* Added `YoastSEO.SnippetPreview.getUnformattedText` and `YoastSEO.SnippetPreview.setUnformattedText, getter and setter for the unformatted text property. [682ec6d](https://github.com/yoast/yoastseo.js/commit/682ec6d)
* Added fallback for meta description to the text that is analyzed. This is prioritized after the excerpt but before the sample text.
* Added a `config.snippetSuffix` to include some text before the snippet title.
* Added `YoastSEO.Analyzer.addAnalysis` to add an analysis on the analyzer object. [ddec6b7](https://github.com/yoast/yoastseo.js/commit/ddec6b7)
* Added `YoastSEO.AnalyzeScorer.addScoring` to add a scoring on the scoring object. [ddec6b7](https://github.com/yoast/yoastseo.js/commit/ddec6b7)
* Added `YoastSEO.App.registerTest` to add a new test to the analyzer. [ddec6b7](https://github.com/yoast/yoastseo.js/commit/ddec6b7)
* Added `YoastSEO.AnalyzerScoring.getTotalScore` to retrieve the total score. [72f368a](https://github.com/yoast/yoastseo.js/commit/72f368a)

#### Enhancements

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

#### Bugfixes

* Fixed snippet preview so only the full focus keyword is highlighted and not words that contain the focus keyword. [3655d13](https://github.com/yoast/yoastseo.js/commit/3655d13)
* Fixed scoring so 0-3 now mean a bad score and no-keyword is a special score. [ad8a085](https://github.com/yoast/yoastseo.js/commit/ad8a085)
* Fix scoring for title length.
* Sanitize keyword before using it as a regex to prevent the regex from breaking. [2d95fcb](https://github.com/yoast/yoastseo.js/commit/2d95fcb)
* Style the snippet title `inline-block` to make the overflow hidden.
* Style the snippet site url `inline` to make the overflow hidden.

### 1.0-beta2: September 23st, 2015
* Fixes a bug where the slug wasn't taken into account when checking if the url contains the focus keyword.

### 1.0-beta: September 21st, 2015
* Initial beta release
