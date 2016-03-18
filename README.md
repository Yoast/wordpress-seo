[![Build Status](https://travis-ci.org/Yoast/YoastSEO.js.svg?branch=master)](https://travis-ci.org/Yoast/js-text-analysis)
[![Code Climate](https://codeclimate.com/repos/5524f75d69568028f6000fda/badges/f503961401819f93c64c/gpa.svg)](https://codeclimate.com/repos/5524f75d69568028f6000fda/feed)
[![Test Coverage](https://codeclimate.com/repos/5524f75d69568028f6000fda/badges/f503961401819f93c64c/coverage.svg)](https://codeclimate.com/repos/5524f75d69568028f6000fda/coverage)
[![Inline docs](http://inch-ci.org/github/yoast/yoastseo.js.svg?branch=master)](http://inch-ci.org/github/yoast/yoastseo.js)

# YoastSEO.js

[Examples][/examples]

Text analysis and assessment library in JavaScript. This library can generate interesting metrics about a text and assess these metrics to give you an assessment which can be used to improve the text.

Also included is a preview of the Google search results which can be assessed using the library.

## Installation

You can install YoastSEO.js using npm:

```bash
npm install https://github.com/Yoast/YoastSEO.js#develop
```

## Usage

If you want the complete experience with UI and everything you can use the `App`. You need to have a few HTML elements to make this work: A snippet preview container, a focusKeyword input element and a content input field.

```js
var SnippetPreview = require( "yoastseo" ).SnippetPreview;
var App = require( "yoastseo" ).App;

window.onload = function() {
	var focusKeywordField = document.getElementById( "focusKeyword" );
	var contentField = document.getElementById( "content" );

	var snippetPreview = new SnippetPreview({
		targetElement: document.getElementById( "snippet" )
	});

	var app = new App({
		snippetPreview: snippetPreview,
		targets: {
			output: "output"
		},
		callbacks: {
			getData: function() {
				return {
					keyword: focusKeywordField.value,
					text: contentField.value
				};
			}
		}
	});

	app.refresh();
	
	focusKeywordField.on( 'change', app.refresh.bind( app ) );
	contentField.on( 'change', app.refresh.bind( app ) );
};
```

You can also invoke internal components directly to be able to work with the raw data. To get metrics about the text you can use the `Researcher`:

```js
var Researcher = require( "yoastseo" ).Researcher;

var researcher = new Researcher( new Paper( "Text that has been written" ) );

console.log( researcher.getResearch( "wordCountInText" ) );
```

## Change log

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Documentation

[Customization][./docs/Customization.md]

## Testing

```bash
npm test
```

Generate coverage using the `--coverage` flag.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please email security@yoast.com instead of using the issue tracker.

## Credits

- [Team Yoast][https://github.com/orgs/Yoast/people]
- [All Contributors][https://github.com/Yoast/YoastSEO.js/graphs/contributors]

## License

The MIT License (MIT). Please see License File for more information.
