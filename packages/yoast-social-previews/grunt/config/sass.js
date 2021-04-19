const sass = require( "node-sass" );

// https://github.com/sindresorhus/grunt-sass
module.exports = {
	options: {
		implementation: sass,
		outputStyle: "compressed",
	},
	build: {
		files: {
			"dist/yoast-social-preview.min.css": "css/social_preview.scss",
		},
	},
};
