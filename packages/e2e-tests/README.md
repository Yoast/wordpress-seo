# Yoast E2E Tests package

e2e-tests implementation for Yoast SEO plugin.

## Usage

### Installation

1. Start by cloning this repository: `git clone https://github.com/Yoast/wordpress-seo.git`.
2. Checkout the e2e-tests branch by doing `git checkout feature/e2e-tests`
3. Then move to the repository folder `cd wordpress-seo`.
4. To install all the necessary dependencies, run the following commands:

```
composer install
yarn
grunt build
```

5. Now you can start a WordPress local environment using [@wordpress/env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/).

Make sure Docker is running on your machine and run `wp-env start` to launch the enviromnment.

6. Move to the package folder by doing `cd packages/e2e-tests`.

7. Run the command `yarn test:e2e` to run the tests.

## Configuration

### Headless mode

The default configuration of the packages runs the test in headless mode.
If you want to run in non-headless mode, uncomment the ` // headless: false,` line in `jest.puppeteer.config.js`.
## Slow Motion

If you want to slows down Puppeteer operations by a specified amount of milliseconds,
uncomment the ` // slowMo: 30,` line in `jest.puppeteer.config.js`, and edit the `slowMo` value.
