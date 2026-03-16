# Change Log

All notable changes to this project will be documented in this file. Releases without a changelog entry contain only minor changes that are irrelevant for users of this library.

We follow [Semantic Versioning](http://semver.org/).

## 2.0.0 March 16th, 2026
### Enhancements:
* Updates the image select field style. [#22580](https://github.com/Yoast/wordpress-seo/pull/22580)
* Adds X as allowed social medium name. [#21158](https://github.com/Yoast/wordpress-seo/pull/21158)
* Adds an `imageAltText` prop to the `SocialMetadataPreviewForm` component. [#18071](https://github.com/Yoast/wordpress-seo/pull/18071)

### Other:
* Adds `usingFallback` prop to `SocialMetadataPreviewForm` component. [#21962](https://github.com/Yoast/wordpress-seo/pull/21962)
* Upgrades WP packages to minimum supported WP version 6.7. [#22466](https://github.com/Yoast/wordpress-seo/pull/22466)

### Non user facing
* Now published as a transpiled package.
* Adds an `imageAltText` prop to the `SocialMetadataPreviewForm` component.
* Bumps `@yoast/eslint-config` to version `8.1.0` from `8.0.0`. [#22256](https://github.com/Yoast/wordpress-seo/pull/22256)
* Refactors the `defaultProps` to be `defaultArguments` instead. [#22266](https://github.com/Yoast/wordpress-seo/pull/22266)
* Bumps `@yoast/ui-library` to version `4.4.0` from `4.3.0`. [#22862](https://github.com/Yoast/wordpress-seo/pull/22862)
* Adds a helper function `determineFacebookImageMode` and constants: `FACEBOOK_IMAGE_SIZES` and `TWITTER_IMAGE_SIZES`. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Adds missing dependency `@yoast/helpers`. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Adds missing development dependencies: `enzyme`, `enzyme-adapter-react-16`, `jest-styled-components`, `raf` and `react-test-renderer`. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Adds missing peer dependency `react-dom`. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Bumps `react` peer dependency to `^16.14.0`. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Refactors the `defaultProps` to be `defaultArguments` instead. [#22266](https://github.com/Yoast/wordpress-seo/pull/22266)
* Bumps `@yoast/eslint-config` to version `8.1.0` from `8.0.0`. [#22256](https://github.com/Yoast/wordpress-seo/pull/22256)
* Upgrades `styled-components` to `5.3.6` to fix compatibility with React 18. [#19857](https://github.com/Yoast/wordpress-seo/pull/19857)
* Upgrades react to 18.2.0, Upgrade react test renderer. [#20653](https://github.com/Yoast/wordpress-seo/pull/20653)
* Removes enzyme. [#20653](https://github.com/Yoast/wordpress-seo/pull/20653)
* Improves internal imports. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Bumps `@yoast/ui-library` to version `4.5.0` from `4.4.0` and `@yoast/replacement-variable-editor` to version `2.0.0` from `2.0.0-alpha.3`. [#23045](https://github.com/Yoast/wordpress-seo/pull/23045)

## 1.12.0 February 8th, 2021
### Enhancements
* Changes the ImageSelect to use the `@yoast/components` version.

## 1.6.0 October 26th, 2020
### Enhancements
* Adds optional idSuffix prop to the SocialMetadataPreviewForm.
* Adds optional ID props to the ImageSelect.

## 1.0.0 July 20th, 2020
### Enhancements
* Creates a new package for the form that is used in the Social Previews.
