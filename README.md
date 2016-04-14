[![Build Status](https://travis-ci.com/Yoast/yoast-social-previews.svg?token=gaaQH3oaep1wtn7YvLp2&branch=master)](https://travis-ci.com/Yoast/yoast-social-previews)
[![Code Climate](https://codeclimate.com/repos/570799d5c612ed7bad006090/badges/40d96a3111eae2f6b434/gpa.svg)](https://codeclimate.com/repos/570799d5c612ed7bad006090/feed)
[![Test Coverage](https://codeclimate.com/repos/570799d5c612ed7bad006090/badges/40d96a3111eae2f6b434/coverage.svg)](https://codeclimate.com/repos/570799d5c612ed7bad006090/coverage)

# yoast-social-previews

JavaScript library that previews how your page looks when it is shared on social media. 

## Installation

You can install the social previews using npm:

```bash
npm install https://github.com/Yoast/yoast-social-previews.git
```

## Usage

The simplest way to use the previews is by just specifying the target element and letting the library do the rest.

```js
var FacebookPreview = require( "yoast-social-previews" ).FacebookPreview;
var TwitterPreview  = require( "yoast-social-previews" ).TwitterPreview;

var facebookPreview = new FacebookPreview(
	{
		targetElement: document.getElementById(  'facebook-container' )
	}
);

facebookPreview.init();

var twitterPreview = new TwitterPreview(
	{
		targetElement: document.getElementById(  'twitter-container' )
	}
);

twitterPreview.init();
```

## Change log

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Documentation

The data that will be analyzed by YoastSEO.js can be modified by plugins. Plugins can also add new research and assessments. To find out how to do this, checkout out the [customization documentation](./docs/Customization.md).

## Testing

```bash
npm test
```

Generate coverage using the `--coverage` flag.
