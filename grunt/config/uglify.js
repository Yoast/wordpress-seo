// https://github.com/gruntjs/grunt-contrib-uglify
module.exports = {
	"js-text-analysis": {
		options: {
			preserveComments: "some",
			report: "gzip"
		},
		files: {
			"dist/yoast-seo.min.js": [
				"dist/yoast-seo.js"
			],
			"examples/standalone/example-scraper.min.js": [
				"examples/standalone/example-scraper.js"
			]
		}
	}
};
