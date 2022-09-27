# Yoast E2E Tests package

e2e-tests implementation for Yoast SEO plugin.

## Usage

### Installation

To run the tests locally, do the folowing:

1. Start by cloning this repository: `git clone https://github.com/Yoast/wordpress-seo.git`.
2. Then move to the repository folder `cd wordpress-seo`.
3. Checkout the e2e-tests branch by doing `git checkout try/e2e-tests-package`.
4. To install all the necessary dependencies, run the following commands:

```
composer install
yarn
grunt build:dev
```

5. Start a WordPress local environment by running `yarn wp-env start`.
6. Some tests require [this plugin](https://github.com/Yoast/wordpress-seo/blob/trunk/packages/e2e-tests/data/yoast-simple-custom-post-type.zip) to be installed. Run the following command to install it:

```
yarn wp-env run tests-cli wp plugin install https://github.com/Yoast/wordpress-seo/blob/trunk/packages/e2e-tests/data/yoast-simple-custom-post-type.zip?raw=true
```

7. Move to the e2e tests package folder by doing `cd packages/e2e-tests`.
8. Run the command `yarn test:e2e` to run the tests.
9. When you are done with testing, run the following commands:

```
cd ../..
yarn wp-env stop
```

that stops the WordPress local environment.

## Test reporter

The package integrates the [jest-allure](https://github.com/zaqqaz/jest-allure) test reporter which provides advanced information about the tests. Run the `allure serve` command to generate and view a report in the browser.

## Configuration

A configuration example is present in the [jest-puppeteer.config.js.example](jest-puppeteer.config.js.example) file.

The default configuration of the packages runs the test in headless mode. If you want to run the tests in headless mode, rename the `jest-puppeteer.config.js.example` file to `jest-puppeteer.config.js`

### Slow Motion

**Slow Motion** slows down Puppeteer operations by a specified amount of milliseconds.
Comment the `slowMo: 100,` line in `jest.puppeteer.config.js` to disable it. You can also edit the `slowMo` value to change its behaviour.

### Running a specific test file

To run a specific test file, you can add the relative path to the test file as an argument for the `yarn test:e2e` command.

For example:

```
yarn test:e2e -- /specs/yoast-seo-blocks.test.js
```

will run the [`yoast-seo-blocks.test.js`](specs/yoast-seo-blocks.test.js) test.
