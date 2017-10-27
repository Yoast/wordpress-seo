# Change Log

This changelog is according to [Keep a Changelog](http://keepachangelog.com).

All notable changes to this project will be documented in this file.
We follow [Semantic Versioning](http://semver.org/).

## 2.11: October 27th, 2017

### Added

#### Components
* `Notification` component. #348
* `AnalysisResult` component. #352
* `ContentAnalysis` component. #359

#### Other additions
* Added callbacks to notify tab switch in `YoastTabs`. #346
* `setSeoResultsForKeyword` action and reducer implementation. #355
* Added default `className` to `VideoDescriptionItem` component. #358

## 2.10.3: October 17th, 2017

### Added
* `IconButtonToggle` component

### Other
* Added class names to VideoTutorial component.

## 2.10.2: October 16th, 2017

### Other
* Improved AlgoliaSearcher focus management between search and detail view.
* Help center CSS tweaks.

## 2.10.1: October 4th, 2017

### Added

#### Other
* Improved the `HelpCenterButton` and the `HelpCenterContainer` styling. #337

### Other
* Added class names to the `HelpCenterContainer` and `HelpCenterButton`. #337

## 2.10.0: October 3rd, 2017

### Added

#### Components
* `Table` component. #219
* `SearchResultDetail` component. #243
* `SearchResults` component. #243
* `YoastLinkButton` component. #284
* `VideoTutorial` component. #291
* `YouTubeVideo` component. #291
* `YoastTabs` component. #303
* `AllyNotice` component. #306
* `HelpCenter` component. #310
* `HelpCenterButton` component. #318

#### Other
* Added translatable label to `SearchBar` component. #243 
* Added `makeOutboundLink` util function. #308
* Added a prop to the `AlgoliaSearcher` component that can be used to enable live search. #323
* Added a search button and placeholder text to the `SearchBar` component. #323

### Other
* Improved styling and accessibility of the `SearchBar` component. #243
* Styling improvements for the Onboarding Wizard. #290
* Fixed two prop warnings that appeared when switching pages in the Onboarding wizard. #293 and #295
* Improved YoastButton hover and active style. #332

## 2.9.3: September 26th, 2017

### Other
* Fixed the loading of AMP articles in the Algolia article iFrame. 


## 2.9.2: September 25th, 2017

### Other
* Added trailing slash to knowledge base URL in help center

## 2.9.1: September 19th, 2017

### Added

#### Other
* Added dashboard widget to development environment.
* Added class names to `WordpressFeed` and `SeoAssessment` components, and also to their children.

## 2.9.0: September 11th, 2017

### Added

#### Components
* `Icon` component (using `svg-react-loader`, see `README.md`). #218 
* `Button`(#173), `IconButton`(##232), `LinkButton`(#262), `YoastButton`(#257) components.
* `InputField` component (using `DraftJS` ). #204 
* `ListTable`, `Row` and `Cell` component. #219 
* `ProgressBar`component. #172 
* `IFrame` and `ArticleContent` components. #242 
* `StackedProgressBar` component. #270
* `SeoScoreAssessment(s)` components. #272
* `WordpressFeed` component. #273 
* `SeoAssessment` component. #281 

##### Other
* Added `getFeed` RSS reader utility function. #267 
* Added `ContentAnalysis` reducer and actions. #224
* Added `striptags` utility library. #276 
* Added various documentation. #239 

### Other
* Improved development environment. (#238, #174 )

#### Onboarding wizard
* Added max width for content in Onboarding wizard (#250), and `fullWidth` property for full screen support (#269).
* Changed Onboarding wizard header. #256  
* Added paragraph for additional information to Onboard wizard `Choice component`. #254

## 2.8.0: August 8th, 2017

### Added

* Adds aria-current to the onboarding wizard active step.

### Fixed

* Removes console errors caused by using React.PropTypes and React.createClass. 

## 2.7.1: July 25th, 2017

### Changed

* Improved README.md to instruct on using yarn instead of npm.

## 2.7.0: July 6th, 2017

### Added

* [AlgoliaSearch] Added Algolia Search as a new component.
* Adds additional colors

## 2.6.0:

### Changed

* Changes the color blue from #0075b3 to #0066cd.

## 2.5.0: 

### Added

* [ConfigurationWizard] Adds possibility to disable navigation on a step page
* [ConfigurationWizard] Adds icons to next, previous and close buttons
* [ConfigurationWizard] Pass `nextStep` and `previousStep` functions to Steps
* Adds Colors for use in my.yoast

## 2.4.0: February 14th, 2016

### Added

* [Choice] Adds a radio button option to the Choice components.

### Removed

* [StyledSection] Removes width from StyledSection to be usable in different contexts.

## 2.3.0: January 17th, 2016

### Changed

* Removes width from StyledSection.

## 2.2.0: December 13th, 2016
 
### Added

* [Loader] Adds Loader component to be used when something is occurring in the background.

## 2.1.0: November 29th, 2016

### Added

* Adds Sass and JSON colors palette.
* Adds `grunt-scss-to-json` package to generate the JSON colors file.

### Changed

* Splits color schemes in a separate Sass file.
* Splits snippet preview colors in a separate Sass file.
* Removes, updates, and adds colors. See the related issue for a [list of colors changes](https://github.com/Yoast/yoast-components/issues/106).
* Adds 2.0.0 as a possibility for react-tap-plugin as a peer dependency.

## 2.0.0: October 20th, 2016

### Breaking changes

* Changed default server request from a PUT to a POST request.

## 1.1.0: October 11th, 2016

### Added

* [StyledSection] Adds a StyledSection component. This component is used to render a HTML section including a heading with an icon.
* [CSS] Adds the `file-text-o` font awesome icon.
* [utils] Exports flat `translate` function in the i18n util.

### Fixed

* [Label] Adds an `aria-label` attribute.
* [Choice] Passes the screenReaderText to the label as `aria-label`.

## 1.0.0: September 27th, 2016

### Added

* Implements HTML component. This component is used to render HTML.
* Implements Choice component. This component is used for a choice, like a group of radio buttons or a select box.
* Implements Input component. This component is used to render a text input.
* Implements Wizard component. This component is used to make a wizard from steps that include fields.
* Implements ScreenReaderText component. This component is used to create a text for use with screen readers.
* Implements ScreenReaderShortcut component. This component is used for skipping navigation to screen reader texts.
* Implements Stepper component. This component is used to create step navigation in the wizard.
* Implements StepButton component. This component is used to access a Step in the wizard.
