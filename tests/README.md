## Running PHPUnit tests

### Unit tests
For the unit tests, we use PHPUnit. 

### 'Old' integration tests
- `composer integration-test`

### Brainmonkey tests
- (First time) `composer global require phpunit/phpunit:5.7`
- `composer test`

### Running multisite tests
If you want to run multisite tests when running the tests in PHP Storm, add an environment variable:

<img width="733" alt="Schermafbeelding 2019-08-12 om 09 36 09" src="https://user-images.githubusercontent.com/17744553/62851749-6cc7a000-bce7-11e9-9f52-c2287c0245e8.png">

### Coverage
Configuration: Run `pecl install xdebug` to install debug.
To run the tests including the coverage, click <img width="30" alt="schermafbeelding 2019-03-07 om 10 32 59" src="https://user-images.githubusercontent.com/17744553/53946611-714ab580-40c4-11e9-85b6-fde5576e4609.png"> in the upper right corner of PHPStorm.

If you get an error "Failed loading /usr/local/Cellar/php@7.1/7.1.26/lib/php/20160303/xdebug.so" or something similar it is possible your extension directory needs to be configured. 
Run `php --ini` to find your php.ini file and open it. 

To load extensions installed by PECL, we need to point the extension_dir in our php.ini to the extension directory created by PECL. This directory can be found by running:
`pecl config-get ext_dir`
Now uncomment and update the extension_dir in your php.ini:
`extension_dir = /usr/local/lib/php/pecl/<php_api_version>`

## Linting
To check for syntax errors, run `find -L . -path ./vendor -prune -o -path ./node_modules -prune -o -name '*.php' -print0 | xargs -0 -n 1 -P 4 php -l`

## Codestyle
We use a combination of coding standards to check our code against: WPCS, PHPCompatibility, and [our own YoastCS sniffs](https://github.com/Yoast/yoastcs).

### Configuration
1. `composer install`
2. `composer config-yoastcs`. 

### Checking
- To check everything: `composer check-cs`
- When you only want to output the errors (not the warnings): `composer check-cs-errors`
- To auto-fix errors and warnings: `composer fix-cs`
- Yoast SEO Premium only: To check only the premium folder: `composer premium-check-cs`
