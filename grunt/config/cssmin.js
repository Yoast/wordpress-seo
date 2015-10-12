// https://github.com/gruntjs/grunt-contrib-cssmin
module.exports = {
	target: {
		files: {
			"dist/yoast-seo.min.css": [ "<%= paths.css %>*.css" ],
			"example/style.min.css": [ "example/style.css" ]
		}
	}
};
