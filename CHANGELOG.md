# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.5.1] - 2020-07-28

- Added inLanguage to Schema
- Added function to tidy strings before returning

### Changed

- Changed Composer to note require dependency plugins but suggest them, to fix issues with MU Plugins

## [4.5.0] - 2020-07-13

### Added

- Added Frontpage and default openGraph Image

## [4.4.1] - 2020-07-05

### Changed

- Fixes MU plugin issue and HTML entities in taxonomy titles

## [4.4.0] - 2020-07-02

### Added

- Adds support for Author / User Metadata

### Changed

- Missing returns added, to avoid PHP notices - Thanks @jonshipman

## [4.3.0] - 2020-06-24

### Added

- Adds support for redirects (Yoast Premium)

## [4.2.0] - 2020-06-15

### Added

- Adds check for dependencies

## [4.1.0] - 2020-05-06

### Added

- Page / Tax SEO - opengraphUrl, opengraphSiteName, opengraphPublishedTime, opengraphModifiedTime - Thanks @izzygld
- Global SEO > Schema - siteName, wordpressSiteName, siteUrl - Thanks @izzygld
- Contributor Images added to readme

## [4.0.1] - 2020-05-03

### Added

- Support for Yoast 14
- Breadcrumbs for post type and taxonomies
- canonical url for post type and taxonomies

## [3.3.0] - 2020-04-01

### Added

Support for Yoast configuration data including:

- Webmaster verification
- Social profiles
- Schemas
- Breadcrumbs (global config)

## [3.2.0] - 2020-03-09

### Added

Adding canonical url (thanks @dafky2000 )

## [3.1.0] - 2020-03-09

### Added

WooCommerce product support

## [3.0.0] - 2020-02-04

### Changed

- BREAKING CHANGE - image urls are now returned as `mediaItem` type.
  This applies to `twitterImage` and `opengraphImage`

## [2.1.1] - 2019-12-01

### Changed

- Update composer

## [2.1.0] - 2019-12-01

### Changed

- Fixed term data

## [2.1.0] - 2019-11-11

### Added

- Ability to query taxonomies for SEO data.
- LICENSE file added

## [2.1.0] - 2019-11-01

### Added

- Composer.json file added.

## [2.0.0] - 2019-07-08

### Changed

- Generated Meta title and descriptions
