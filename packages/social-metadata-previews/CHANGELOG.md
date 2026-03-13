# Change Log

All notable changes to this project will be documented in this file.
We follow [Semantic Versioning](http://semver.org/).

## 2.0.0 March 9th, 2026
### Enhancements
* The Facebook and Twitter Preview now uses image instead of a background image.
* Export the variables TWITTER_IMAGE_SIZES, FACEBOOK_IMAGE_SIZES and determineFacebookImageMode.

### Other:
* Passes `imageFallbackUrl` prop to `SocialPreviewEditor` component. [#21962](https://github.com/Yoast/wordpress-seo/pull/21962)
* Upgrades WP packages to minimum supported WP version 6.7. [#22466](https://github.com/Yoast/wordpress-seo/pull/22466)
* Refactors the `defaultProps` to be `defaultArguments` instead. [#22267](https://github.com/Yoast/wordpress-seo/pull/22267)


### Non user facing
* Now published as a transpiled package.
* Adds missing development dependencies: `enzyme`, `enzyme-adapter-react-16`, `jest-styled-components`, `raf` and `react-test-renderer`. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Adds missing peer dependency `react-dom`. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Bumps `react` peer dependency to `^16.14.0`. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Upgrades `styled-components` to `5.3.6` to fix compatibility with React 18. [#19857](https://github.com/Yoast/wordpress-seo/pull/19857)
* Removes enzyme. [#20653](https://github.com/Yoast/wordpress-seo/pull/20653)
* Upgrades react to 18.2.0, Upgrade react test renderer. [#20653](https://github.com/Yoast/wordpress-seo/pull/20653)
* Deprecates `determineFacebookImageMode`, `FACEBOOK_IMAGE_SIZES` and `TWITTER_IMAGE_SIZES`. They are moved to `@yoast/social-metadata-forms`. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Adds missing dependency `@yoast/components`. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Bumps `@yoast/replacement-variable-editor` to version `2.0.0` from `2.0.0-alpha.3` and `@yoast/@yoast/social-metadata-forms` to version `2.0.0` from `2.0.0-alpha.3`. [#23045](https://github.com/Yoast/wordpress-seo/pull/23045)
* Bumps `@yoast/eslint-config` to version `8.1.0` from `8.0.0`. [#22256](https://github.com/Yoast/wordpress-seo/pull/22256)
* Updates babel and jest config after updating @yoast/social-metadata-forms to use @yoast-ui-library.  [#22580](https://github.com/Yoast/wordpress-seo/pull/22580)
	
## 1.15.0 April 1st, 2021
### Enhancements
* Removes the keyphrase highlighting in the mobile meta description to reflect new Google behavior.
* Improves the URL in the SnippetEditor.

## 1.0.0 July 20th, 2020
### Enhancements
* Adds a new Facebook and Twitter preview written in React.
* Adds a form for editing the Social Previews.

## 0.4.0 January 6th, 2020
### Other
* Drops IE11 support through configuring Babel to use the preset environment with the own list of supported browsers specified.

## 0.1.0 April 29th, 2019
### Added
* Creates `@yoast/social-metadata-previews` as a placeholder for future code to render previews for social platforms.
