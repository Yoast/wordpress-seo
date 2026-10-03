# Yoast SEO PHP testsuite

## Table of contents

- [Testing](#testing)
  * [Configuration](#configuration)
    + [Setting environment variables](#setting-environment-variables)
    + [Configuring WordPress unit tests in VVV](#configuring-wordpress-unit-tests-in-vvv)
    + [PhpStorm Setup](#phpstorm-setup)
  * [Running the tests](#running-the-tests)
    + [Integration tests](#integration-tests)
    + [Unit tests](#unit-tests)
    + [Coverage](#coverage)
- [Linting](#linting)
  * [Syntax errors](#syntax-errors)
  * [Codestyle](#codestyle)
  * [Configuration](#configuration-1)
  * [Running the codestyle](#running-the-codestyle)

## Testing

### Configuration
To run the unit tests you have to setup a few things. 

#### Setting environment variables

First, you should edit your local `.zshrc` configuration file (via `vim ~/.zshrc` or a similar editor) and add the following lines:
```
export WP_PLUGIN_DIR="/dir/to/plugin/directory"
export WP_DEVELOP_DIR="/dir/to/wp/develop/directory"
```
For example:
```
wordpress-default/public_html/wp-content/plugins"
wordpress-develop/public_html/"
```
**Note: Make sure to reload your terminal once you've added the above lines.**

#### Configuring WordPress unit tests in VVV

The `WP_DEVELOP_DIR` (`wordpress-develop`) should point to a `trunk` build of WordPress. In the older VVV instances this defaulted to `wordpress-develop`, in the newer this is `wordpress-trunk`.
When afterwards you get an error in PhpStorm saying you can not connect, the test database needs to be set up.
- The sample configuration is located in `wordpress-trunk/public_html/wp-tests-config-sample.php`. Copy the sample to `wp-tests-config.php`.
- Fill in the configuration with valid data. Create the database itself if needed (you can use Sequel Pro or PHPMyAdmin). _Mind the `$table_prefix` variable in the configuration here, by default it is set to `wptests_`_
- **Important** is that the `DB_HOST` should point to the vagrant box URL `vvv.test` since this is run from your local machine (in PhpStorm), not from the vagrant box itself.

#### PhpStorm Setup

The setup in PhpStorm can be completed by following the next steps:

* Under the run menu in PhpStorm you have to choose `edit configurations`.
* In the window you will see, you have to press the `+` in the left corner and then you choose PHPUnit in the options.
* You will get another window: Select the option: `Defined in the configuration page` and check the checkbox for `Use alternative configuration file`. 
* After the checkbox you have to enter the full path to the `phpunit.xml.dist` file. This file is located in the plugin directory. If the repo contains a `phpunit.xml` file, use that one instead. (NB: wordpress-seo has two types of tests. Use `phpunit-integration.xml.dist` for the 'old' integration tests, and `phpunit.xml.dist` for the Brainmonkey tests.)
* Now you've entered the path, press the icon to the far right of the path to the `phpunit.xml(.dist)` file. This will bring you to the `Test frameworks` window. 
* Press the plus icon and select the first option: `PHPUnit Local`. Press the second radio button `Path to phpunit.phar` and enter the path to the file. It's probably in your cellar directory. If you do not have a phpunit.phar file yet. you can download it here: https://phar.phpunit.de/
* Finally, when you return to the `Run/Debug configurations` window, there might be an error message at the bottom. Press the `fix` button next to it and select PHP as your CLI interpreter. Apply and done!

To run multisite tests, add an environment variable:

<img width="733" alt="Schermafbeelding 2019-08-12 om 09 36 09" src="https://user-images.githubusercontent.com/17744553/62851749-6cc7a000-bce7-11e9-9f52-c2287c0245e8.png">

### Running the tests

#### Integration tests
- `composer integration-test`

#### Unit tests
- (First time) `composer global require phpunit/phpunit:5.7`
- `composer test`

#### Coverage
Configuration: Run `pecl install xdebug` to install debug.
To run the tests including the coverage, click <img width="30" alt="schermafbeelding 2019-03-07 om 10 32 59" src="https://user-images.githubusercontent.com/17744553/53946611-714ab580-40c4-11e9-85b6-fde5576e4609.png"> in the upper right corner of PHPStorm.

If you get an error "Failed loading /usr/local/Cellar/php@7.1/7.1.26/lib/php/20160303/xdebug.so" or something similar it is possible your extension directory needs to be configured. 
Run `php --ini` to find your php.ini file and open it. 

To load extensions installed by PECL, we need to point the extension_dir in our php.ini to the extension directory created by PECL. This directory can be found by running:
`pecl config-get ext_dir`
Now uncomment and update the extension_dir in your php.ini:
`extension_dir = /usr/local/lib/php/pecl/<php_api_version>`

## Linting

### Syntax errors
To check for syntax errors, run `composer lint`

### Codestyle
We use a combination of coding standards to check our code against: WPCS, PHPCompatibility, and [our own YoastCS sniffs](https://github.com/Yoast/yoastcs).

### Configuration
`composer install`

### Running the codestyle
- To check everything: `composer check-cs`
- When you only want to output the errors (not the warnings): `composer check-cs-errors`
- To auto-fix errors and warnings: `composer fix-cs`
- Yoast SEO Premium only: To check only the premium folder: `composer premium-check-cs`
