# Yoast SEO

[![CS](https://github.com/Yoast/wordpress-seo/actions/workflows/cs.yml/badge.svg)](https://github.com/Yoast/wordpress-seo/actions/workflows/cs.yml)
[![Lint](https://github.com/Yoast/wordpress-seo/actions/workflows/lint.yml/badge.svg)](https://github.com/Yoast/wordpress-seo/actions/workflows/lint.yml)
[![LintJS](https://github.com/Yoast/wordpress-seo/actions/workflows/jslint.yml/badge.svg)](https://github.com/Yoast/wordpress-seo/actions/workflows/jslint.yml)
[![TestJS](https://github.com/Yoast/wordpress-seo/actions/workflows/jstest.yml/badge.svg)](https://github.com/Yoast/wordpress-seo/actions/workflows/jstest.yml)
[![Test](https://github.com/Yoast/wordpress-seo/actions/workflows/test.yml/badge.svg)](https://github.com/Yoast/wordpress-seo/actions/workflows/test.yml)
[![Deployment](https://github.com/Yoast/wordpress-seo/actions/workflows/deploy.yml/badge.svg)](https://github.com/Yoast/wordpress-seo/actions/workflows/deploy.yml)
[![Coverage Status](https://coveralls.io/repos/github/Yoast/wordpress-seo/badge.svg?branch=trunk)](https://coveralls.io/github/Yoast/wordpress-seo?branch=trunk)

[![Stable Version](https://poser.pugx.org/yoast/wordpress-seo/v/stable.svg)](https://packagist.org/packages/yoast/wordpress-seo)
[![License](https://poser.pugx.org/yoast/wordpress-seo/license.svg)](https://packagist.org/packages/yoast/wordpress-seo)

## Welcome to the Yoast SEO GitHub repository


While the documentation for the [Yoast SEO plugin](https://yoa.st/1ul) can be found on [Yoast.com](https://yoa.st/1um), here
you can browse the source of the project, find and discuss open issues and even
[contribute yourself](.github/CONTRIBUTING.md).

## Installation

Here's a [guide on how to install Yoast SEO in your WordPress site](https://yoa.st/1un).

## Want to contribute to Yoast SEO?

### Prerequisites

At Yoast, we make use a specific toolset to develop our code. Please ensure you have the following tools installed before contributing.

* [Composer](https://getcomposer.org/)
* [Yarn](https://yarnpkg.com/en/)
* [Grunt](https://gruntjs.com/)

### Getting started
After installing the aforementioned tools, you can use the steps below to acquire a development version of Yoast SEO.
Please note that this will download the latest development version of Yoast SEO. While this version is usually stable,
it is not recommended for use in a production environment.

Within your WordPress installation, navigate to `wp-content/plugins` and run the following commands:
```bash
git clone https://github.com/Yoast/wordpress-seo.git
cd wordpress-seo
```

To install all the necessary dependencies, run the following commands:
```bash
composer install
yarn
grunt build
```

During development, you could run `grunt build:dev` instead of `grunt build`, to save yourself downloading some dependencies that are only needed for a production environment.

Please note that if you change anything in the JavaScript or CSS, you'll have to run `grunt build:js` or `grunt build:css`, respectively.

For active development, you could run `grunt watch` to keep the build up-to-date and run checks right away.

For JavaScript only, you start a Webpack watch by running `yarn start`, this command will keep the JS files up-to-date. You'll have to refresh the page yourself.
When working in other folders than `packages/js`, you can refer to their individual readme or package.json scripts. If the package offers a watch, you still have to build the plugin afterwards.

For example, the `packages/ui-library` package has its own `yarn watch` (and js/css) commands. You can either `cd` into that folder or target it from the root using the workspace command:
```bash
yarn workspace @yoast/ui-library watch:js
```
or using Lerna:
```bash
yarn lerna run watch:js --scope @yoast/ui-library --stream
```

This repository uses [the Yoast grunt tasks plugin](https://github.com/Yoast/plugin-grunt-tasks).

## Testing packages

To run tests for js packages, run the following command from the root of the repository:
```bash
yarn test
```

## Support

This is a developer's portal for Yoast SEO and should not be used for support. Please visit the
[support forums](https://wordpress.org/support/plugin/wordpress-seo).

## Reporting bugs

If you find an issue, [let us know here](https://github.com/yoast/wordpress-seo/issues/new)! Please follow [these guidelines](https://yoa.st/1uo) on how to write a good bug report.

It may help us a lot if you can provide a backtrace of the error encountered. You can use [code in this gist](https://gist.github.com/jrfnl/5925642) to enable the backtrace in your website's configuration.

## Contributions

Anyone is welcome to contribute to Yoast SEO. Please
[read the guidelines](.github/CONTRIBUTING.md) for contributing to this
repository.

There are various ways you can contribute:

* [Raise an issue](https://github.com/yoast/wordpress-seo/issues) on GitHub.
* Send us a Pull Request with your bug fixes and/or new features.
* [Translate Yoast SEO into different languages](http://translate.yoast.com/projects/wordpress-seo/).
* Provide feedback and [suggestions on enhancements](https://github.com/yoast/wordpress-seo/issues?direction=desc&labels=Enhancement&page=1&sort=created&state=open).
