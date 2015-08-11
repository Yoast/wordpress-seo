// https://github.com/gruntjs/grunt-contrib-cssmin
module.exports = {
	target: {
		files: {
			"<%= paths.css %>dist/yoast-seo-content-analysis.min.css": [ "<%= paths.css %>*.css" ]
		}
	}
};
