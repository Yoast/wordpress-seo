// https://github.com/gruntjs/grunt-contrib-uglify
module.exports = {
	"js-text-analysis": {
		options: {
			preserveComments: "some",
			report: "gzip"
		},
		files: {
			"example/yoast-social-previews.min.js": [
				"example/yoast-social-previews.js"
			]
		}
	}
};
