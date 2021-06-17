# Yoast E2E Tests package

e2e-tests implementation for Yoast SEO plugin.

## Usage

### Installation

To run the tests locally, do the folowing:

1. Start by cloning this repository: `git clone https://github.com/Yoast/wordpress-seo.git`.
2. Then move to the repository folder `cd wordpress-seo`.
3. Checkout the e2e-tests branch by doing `git checkout try/e2e-tests-package`.
4. To install all the necessary dependencies, run the following commands:

> There are some conflicts that could happen with Puppeteer and newer versions of Node.
> Before running the following commands, please make sure your Node version is set to 12.
> This can be done through [nvm](https://github.com/nvm-sh/nvm), with the command `nvm use 12`.

```
composer install
yarn
grunt build:dev
```
5. Move to the package folder by doing `cd packages/e2e-tests`.
6. Now you will need to start a WordPress local environment using [@wordpress/env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/).

First make sure Docker is running on your machine and run this command `bash e2e-test-env-setup.sh`.
The command will execute the [e2e-test-env-setup.sh](e2e-test-env-setup.sh) file.
This file basically:
- Move to the plugin root folder
- Start the WordPress local environment
- Install and activate the [yoast-simple-custom-post-type.zip](./data/yoast-simple-custom-post-type.zip) plugin: the plugin creates a custom post type used in the tests
7. Run the command `yarn test:e2e` to run the tests.
8. When you are done with testing, run the following commands:
```
cd ../..
wp-env stop
```
that stop the local environment.

## Configuration

A configuration example is present in the [jest-puppeteer.config.js.example](jest-puppeteer.config.js.example) file.

The default configuration of the packages runs the test in headless mode. If you want to run the tests in headless mode, rename the `jest-puppeteer.config.js.example` file to `jest-puppeteer.config.js`

**Slow Motion** slows down Puppeteer operations by a specified amount of milliseconds.
Comment the `slowMo: 100,` line in `jest.puppeteer.config.js` to disable it. You can also edit the `slowMo` value to change its behaviour.
