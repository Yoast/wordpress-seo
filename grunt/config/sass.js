// https://github.com/sindresorhus/grunt-sass
module.exports = {
	options: {
		outputStyle: "compressed",
	},
	build: {
		files: {
			"dist/yoast-seo.min.css": "css/analyzer.scss",
		},
	},
	example: {
		files: {
			"examples/browserified/style.css": "examples/browserified/style.scss",
		},
	},
};
