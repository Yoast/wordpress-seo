# Browserslist Config

Yoast browserslist shareable config for [Browserslist](https://www.npmjs.com/package/browserslist).

## Installation

Install the module

```shell
$ npm install browserslist @yoast/browserslist-config --save-dev
```

or 

```shell
$ yarn add --dev @yoast/browserslist-config
```

## Usage

Add this to your `package.json` file:

```json
"browserslist": [
	"extends @yoast/browserslist-config"
]
```

Alternatively, add this to `.browserslistrc` file:

```
extends @yoast/browserslist-config
```

This package when imported returns an array of supported browsers, for more configuration examples including Autoprefixer, Babel, ESLint, PostCSS, and stylelint see the [Browserslist examples](https://github.com/ai/browserslist-example#browserslist-example) repo.

## List determination

This list is based on the [list of browsers with a usage higher than 1 percent](https://browserl.ist/?q=%3E1%25). This is according to the can I use statistics. We then take this list and reduce it to the browsers that we actually want to support based on our own usage data.

This list is periodically reviewed.
