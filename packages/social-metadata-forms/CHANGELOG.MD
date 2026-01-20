# Change Log

All notable changes to this project will be documented in this file. Releases without a changelog entry contain only minor changes that are irrelevant for users of this library.

We follow [Semantic Versioning](http://semver.org/).

## Future Release
### Enhancements:
* Updates the image select field to use the `@yoast/ui-library` components. [#22580](https://github.com/Yoast/wordpress-seo/pull/22580)

### Other:
* Adds `usingFallback` prop to `SocialMetadataPreviewForm` component. [#21962](https://github.com/Yoast/wordpress-seo/pull/21962)
* Upgrades WP packages to minimum supported WP version 6.7. [#22466](https://github.com/Yoast/wordpress-seo/pull/22466)

### Non user facing
* Now published as a transpiled package.
* Adds an `imageAltText` prop to the `SocialMetadataPreviewForm` component.
* Bumps `@yoast/eslint-config` to version `8.1.0` from `8.0.0`. [#22256](https://github.com/Yoast/wordpress-seo/pull/22256)
* Refactors the `defaultProps` to be `defaultArguments` instead. [#22266](https://github.com/Yoast/wordpress-seo/pull/22266)
* Bumps `@yoast/ui-library` to version `4.4.0` from `4.3.0`. [#22862](https://github.com/Yoast/wordpress-seo/pull/22862)

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
