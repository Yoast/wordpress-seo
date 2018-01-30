// See https://github.com/sindresorhus/grunt-sass
module.exports = {
	options: {
		outputStyle: "compressed",
	},
	build: {
		files: {
			"examples/shared/yoast-seo.min.css": "css/analyzer.scss",
		},
	},
	example: {
		files: {
			"examples/browserified/style.css": "examples/browserified/style.scss",
			"examples/relevant-words-example/style.css": "examples/relevant-words-example/style.scss",
		},
	},
};
