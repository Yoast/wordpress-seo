// See https://github.com/sindresorhus/grunt-sass

const sass = require( "node-sass" );

module.exports = {
	options: {
		outputStyle: "compressed",
		implementation: sass,
	},
	build: {
		files: {
			"examples/shared/yoast-seo.min.css": "css/analyzer.scss",
		},
	},
	example: {
		files: {
			"examples/browserified/style.css": "examples/browserified/style.scss",
		},
	},
};
