module.exports = {
	options: {
		separator: ";"
	},
	dist: {
		src: [ "<%= paths.js %>/*.js", "node_modules/jed/jed.js", "<%= paths.js %>/config/*.js" ],
		dest: "dist/yoast-seo-content-analysis.min.js"
	}
};
