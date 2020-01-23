const sass = require( "node-sass" );

// See https://github.com/sindresorhus/grunt-sass
module.exports = {
	options: {
		implementation: sass,
		outputStyle: "compressed",
	},
	build: {
		files: {
			"css-dist/yoast-components.min.css": "css/all.scss",
			"css-dist/yoast-components-standalone.min.css": "css/standalone.scss",
		},
	},
	example: {
		files: {
			"examples/browserified/style.css": "examples/browserified/style.scss",
		},
	},
};
