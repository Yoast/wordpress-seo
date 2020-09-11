# Yoast SEO

[![Build Status](https://api.travis-ci.org/Yoast/wordpress-seo.svg?branch=master)](https://travis-ci.org/Yoast/wordpress-seo)
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

Alternatively, a webpack development server is available. To enable the dev-server, you'll have to add this to your WordPress install's `config.php`:
```php
define( 'YOAST_SEO_DEV_SERVER', true );
```
and you can start it by running `yarn start` in the `wordpress-seo` folder.

This repository uses [the Yoast grunt tasks plugin](https://github.com/Yoast/plugin-grunt-tasks).

### Developing JavaScript dependencies

Yoast SEO uses some JavaScript code that is managed outside of this repository. This code is being maintained in a monorepo: [Yoast/javascript](https://github.com/Yoast/javascript). If you need to change anything in one or more of the packages included in the monorepo, you'll need to do the following:

```bash
git clone https://github.com/Yoast/javascript.git # Only the first time.
yarn link-monorepo # You will be prompted for the location of your Yoast/javascript clone. This will be "./javascript" if you cloned it inside the wordpress-seo directory. Your preference will be saved in a .yoast file for later use.
grunt build 
```

This [links](https://yarnpkg.com/lang/en/docs/cli/link/) all [Yoast managed JavaScript packages](https://github.com/yoast/javascript) to your installation of the plugin. Most branches on the wordpress-seo repository also exist on the javascript repository. Please find which branch to use in the table below. If the branch you're looking for does not exist, feel free to default to develop (or create the branch yourself if you're making changes).

| Yoast/wordpress-seo | Yoast/javascript |
| ------------------- | ---------------- |
| master              | master           |
| trunk               | develop          |
| feature/x           | feature/x        |

You can now modify the code of the linked packages directly from the `node_modules` (as they're now symlinked to your `javascript` clone) or your javascript directory. Please remember to run a `grunt build:js` from the `wordpress-seo` directory after making changes in order to apply those changes to the plugin. 

 If you don't want to use the latest development version of the Yoast JavaScript packages anymore, you can restore the versions as specified in the [package.json](package.json) by running the following command:

```bash
yarn unlink-monorepo
grunt build
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

